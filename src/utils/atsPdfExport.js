/**
 * ATS-safe PDF export — writes real, machine-readable text directly into
 * jsPDF using native doc.text() calls. Zero html2canvas / addImage usage.
 *
 * • For English (LTR): Helvetica built-in font, instant export.
 * • For Arabic (RTL):  Amiri font fetched at export time via the app's
 *   /api/font-proxy and /api/font-file proxies, then embedded as a real
 *   TTF so Arabic glyphs render correctly and are extractable by ATS parsers.
 */

export const ATS_TEMPLATE_IDS = new Set([
  'atsclean', 'atspro', 'atssimple', 'atsbold',
  'atscompact', 'atsmodern', 'atsharvard', 'atscenter', 'atselegant',
]);

/**
 * Normalise a template ID to a compact lowercase string:
 *   'ATS Clean'  → 'atsclean'
 *   'ats-bold'   → 'atsbold'
 *   'ATSHarvard' → 'atsharvard'
 */
function normaliseId(templateId) {
  return (templateId || '').toLowerCase().replace(/[\s\-_]/g, '');
}

export function isATSTemplate(templateId) {
  const id = normaliseId(templateId);
  // Match explicit set OR any id that starts with 'ats'
  return ATS_TEMPLATE_IDS.has(id) || id.startsWith('ats');
}

const SECTION_LABELS = {
  summary:       { en: 'PROFESSIONAL SUMMARY',  ar: 'الملخص المهني'          },
  experience:    { en: 'WORK EXPERIENCE',        ar: 'الخبرة العملية'         },
  education:     { en: 'EDUCATION',             ar: 'التعليم'                },
  skills:        { en: 'CORE SKILLS',           ar: 'المهارات الأساسية'      },
  languages:     { en: 'LANGUAGES',             ar: 'اللغات'                 },
  projects:      { en: 'PROJECTS',              ar: 'المشاريع'               },
  certificates:  { en: 'CERTIFICATIONS',        ar: 'الشهادات والاعتمادات'    },
  interests:     { en: 'INTERESTS',             ar: 'الاهتمامات'             },
  courses:       { en: 'COURSES & TRAINING',    ar: 'الدورات والتدريب'       },
  awards:        { en: 'AWARDS & HONOURS',      ar: 'الجوائز والتكريمات'     },
  organisations: { en: 'ORGANISATIONS',         ar: 'المنظمات والجمعيات'     },
  publications:  { en: 'PUBLICATIONS',          ar: 'المنشورات والأبحاث'     },
  references:    { en: 'REFERENCES',            ar: 'المراجع والتزكيات'      },
};

const CONTACT_LABELS = {
  email:     { en: 'Email',    ar: 'البريد الإلكتروني' },
  phone:     { en: 'Phone',    ar: 'الهاتف'            },
  location:  { en: 'Location', ar: 'الموقع'            },
  linkedin:  { en: 'LinkedIn', ar: 'LinkedIn'          },
  portfolio: { en: 'Portfolio',ar: 'Portfolio'         },
};

function sectionLabel(key, isRTL, sectionNames) {
  if (sectionNames?.[key]) return sectionNames[key].toUpperCase();
  return SECTION_LABELS[key]?.[isRTL ? 'ar' : 'en'] ?? key.toUpperCase();
}

function dateRange(start, end, current, isRTL) {
  const present = isRTL ? 'حتى الآن' : 'Present';
  return [start, current ? present : end].filter(Boolean).join(' – ');
}

function safe(v) {
  return v ? String(v) : '';
}

/** Fetch an Arabic TTF font via the app's font proxy and embed it in jsPDF. */
export async function embedArabicFont(doc) {
  try {
    const cssUrl = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400&display=swap';
    const proxyUrl = '/api/font-proxy?url=' + encodeURIComponent(cssUrl);

    const cssRes = await fetch(proxyUrl);
    if (!cssRes.ok) return false;
    const css = await cssRes.text();

    const fontUrlMatch = css.match(/url\(([^)]+)\)/);
    if (!fontUrlMatch) return false;
    const fontFileUrl = fontUrlMatch[1];

    const fontRes = await fetch(fontFileUrl);
    if (!fontRes.ok) return false;
    const buffer = await fontRes.arrayBuffer();

    const bytes = new Uint8Array(buffer);
    let binary = '';
    const CHUNK = 8192;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    const base64 = btoa(binary);

    doc.addFileToVFS('Amiri-Regular.ttf', base64);
    doc.addFont('Amiri-Regular.ttf', 'Amiri', 'normal');
    doc.addFileToVFS('Amiri-Bold.ttf', base64);
    doc.addFont('Amiri-Bold.ttf', 'Amiri', 'bold');

    return true;
  } catch (e) {
    console.warn('[ATS PDF] Arabic font load failed, falling back to Helvetica:', e.message);
    return false;
  }
}

/**
 * Generates a fully text-based ATS-compatible PDF using jsPDF native APIs.
 * No html2canvas, no addImage — every character is a real PDF text operator.
 */
export async function generateATSPdf(cvData, options = {}) {
  const { jsPDF } = await import('jspdf');

  const {
    isRTL = false,
    visibleSections = {},
    visiblePersonalFields = {},
    sectionOrder = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'],
    sectionNames = {},
  } = options;

  const show = (key) => visibleSections[key] !== false;

  const PAGE_W = 210;
  const PAGE_H = 297;
  const ML     = 15;
  const MR     = 15;
  const MT     = 15;
  const MB     = 12;
  const CW     = PAGE_W - ML - MR;
  const BOTTOM = PAGE_H - MB;

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  // Embed Arabic font for RTL content
  let arabicFontReady = false;
  if (isRTL) {
    arabicFontReady = await embedArabicFont(doc);
    if (arabicFontReady) {
      doc.setR2L(true);
    }
  }

  // Font helpers
  const FONT_FAMILY  = arabicFontReady ? 'Amiri'    : 'helvetica';
  const BOLD_STYLE   = arabicFontReady ? 'bold'     : 'bold';
  const NORMAL_STYLE = arabicFontReady ? 'normal'   : 'normal';

  let y = MT;

  function needsPageBreak(needed) { return y + needed > BOTTOM; }
  function newPageIfNeeded(needed = 6) {
    if (needsPageBreak(needed)) { doc.addPage(); y = MT; }
  }

  // x anchor: for LTR text starts at left margin; for RTL (doc.setR2L) starts at right margin
  const TX = isRTL ? (ML + CW) : ML;
  const ALIGN = isRTL ? 'right' : 'left';

  function writeLine(text, { size = 10, style = NORMAL_STYLE, color = [20, 20, 20] } = {}) {
    if (!text) return;
    const lineH = size * 0.35 + 1.8;
    newPageIfNeeded(lineH);
    doc.setFontSize(size);
    doc.setFont(FONT_FAMILY, style);
    doc.setTextColor(...color);
    doc.text(String(text), TX, y, { align: ALIGN });
    y += lineH;
  }

  function writeWrapped(text, { size = 10, style = NORMAL_STYLE, color = [30, 30, 30] } = {}) {
    if (!text) return;
    const lineH = size * 0.35 + 1.8;
    doc.setFontSize(size);
    doc.setFont(FONT_FAMILY, style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text), CW);
    for (const line of lines) {
      newPageIfNeeded(lineH);
      doc.text(line, TX, y, { align: ALIGN });
      y += lineH;
    }
  }

  function writeTwoCol(left, right, { size = 10 } = {}) {
    if (!left && !right) return;
    const lineH = size * 0.35 + 1.8;
    newPageIfNeeded(lineH);
    doc.setFontSize(size);

    if (isRTL) {
      // RTL: primary text on right, date on left
      if (left) {
        doc.setFont(FONT_FAMILY, BOLD_STYLE);
        doc.setTextColor(10, 10, 10);
        doc.text(String(left), ML + CW, y, { align: 'right' });
      }
      if (right) {
        doc.setFont(FONT_FAMILY, NORMAL_STYLE);
        doc.setTextColor(80, 80, 80);
        doc.text(String(right), ML, y, { align: 'left' });
      }
    } else {
      if (left) {
        const safeLeft = doc.splitTextToSize(String(left), CW * 0.72)[0] ?? '';
        doc.setFont(FONT_FAMILY, BOLD_STYLE);
        doc.setTextColor(10, 10, 10);
        doc.text(safeLeft, ML, y);
      }
      if (right) {
        doc.setFont(FONT_FAMILY, NORMAL_STYLE);
        doc.setTextColor(80, 80, 80);
        doc.text(String(right), ML + CW, y, { align: 'right' });
      }
    }
    y += lineH;
  }

  function writeSectionHeading(label) {
    y += 3;
    newPageIfNeeded(10);
    doc.setFontSize(10.5);
    doc.setFont(FONT_FAMILY, BOLD_STYLE);
    doc.setTextColor(0, 0, 0);
    doc.text(String(label), TX, y, { align: ALIGN });
    y += 4.5;
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.35);
    doc.line(ML, y, ML + CW, y);
    y += 3.5;
  }

  function gap(mm = 3) { y += mm; }

  // ── Header ────────────────────────────────────────────────────────────────
  const pi = cvData?.personalInfo ?? {};

  if (pi.fullName) writeLine(pi.fullName,   { size: 20, style: BOLD_STYLE,   color: [10, 10, 10] });
  if (pi.jobTitle) writeLine(pi.jobTitle,   { size: 11, style: NORMAL_STYLE, color: [60, 60, 60] });

  gap(1);

  const L = (k) => CONTACT_LABELS[k]?.[isRTL ? 'ar' : 'en'] ?? k;
  const contactParts = [];
  if (visiblePersonalFields.email     !== false && pi.email)     contactParts.push(`${L('email')}: ${pi.email}`);
  if (visiblePersonalFields.phone     !== false && pi.phone)     contactParts.push(`${L('phone')}: ${pi.phone}`);
  if (visiblePersonalFields.location  !== false && pi.location)  contactParts.push(`${L('location')}: ${pi.location}`);
  if (visiblePersonalFields.linkedin  !== false && pi.linkedin)  contactParts.push(`${L('linkedin')}: ${pi.linkedin}`);
  if (visiblePersonalFields.portfolio !== false && pi.portfolio) contactParts.push(`${L('portfolio')}: ${pi.portfolio}`);

  if (contactParts.length) {
    writeWrapped(contactParts.join('   |   '), { size: 9, color: [60, 60, 60] });
  }

  gap(2);
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.5);
  doc.line(ML, y, ML + CW, y);
  gap(1);

  // ── Sections ──────────────────────────────────────────────────────────────
  const renderSection = (key) => {
    if (!show(key)) return;
    switch (key) {

      case 'summary': {
        if (!pi.summary) return;
        writeSectionHeading(sectionLabel('summary', isRTL, sectionNames));
        writeWrapped(pi.summary, { size: 10 });
        break;
      }

      case 'experience': {
        if (!cvData.experience?.length) return;
        writeSectionHeading(sectionLabel('experience', isRTL, sectionNames));
        cvData.experience.forEach((e, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(e.jobTitle), dateRange(e.startDate, e.endDate, e.current, isRTL));
          const sub = [safe(e.company), safe(e.location)].filter(Boolean).join(' · ');
          if (sub) writeLine(sub, { size: 9, color: [80, 80, 80] });
          if (e.description) { gap(0.5); writeWrapped(safe(e.description)); }
        });
        break;
      }

      case 'education': {
        if (!cvData.education?.length) return;
        writeSectionHeading(sectionLabel('education', isRTL, sectionNames));
        cvData.education.forEach((e, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(e.degree), dateRange(e.startDate, e.endDate, false, isRTL));
          if (e.institution) writeLine(safe(e.institution), { size: 9, color: [80, 80, 80] });
          if (e.description) writeWrapped(safe(e.description));
        });
        break;
      }

      case 'skills': {
        if (!cvData.skills?.length) return;
        writeSectionHeading(sectionLabel('skills', isRTL, sectionNames));
        writeWrapped(cvData.skills.map(sk => safe(sk.name || sk)).filter(Boolean).join('  ·  '));
        break;
      }

      case 'languages': {
        if (!cvData.languages?.length) return;
        writeSectionHeading(sectionLabel('languages', isRTL, sectionNames));
        writeWrapped(cvData.languages.map(l => `${safe(l.name)} (${safe(l.level)})`).filter(s => s !== ' ()').join('  ·  '));
        break;
      }

      case 'projects': {
        if (!cvData.projects?.length) return;
        writeSectionHeading(sectionLabel('projects', isRTL, sectionNames));
        cvData.projects.forEach((p, idx) => {
          if (idx > 0) gap(3);
          writeLine(safe(p.title), { size: 10, style: BOLD_STYLE });
          if (p.link) writeLine(safe(p.link), { size: 9, color: [80, 80, 80] });
          if (p.description) writeWrapped(safe(p.description));
        });
        break;
      }

      case 'certificates': {
        if (!cvData.certificates?.length) return;
        writeSectionHeading(sectionLabel('certificates', isRTL, sectionNames));
        cvData.certificates.forEach((c, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(c.name), safe(c.date));
          if (c.issuer) writeLine(safe(c.issuer), { size: 9, color: [80, 80, 80] });
          if (c.description) writeWrapped(safe(c.description));
        });
        break;
      }

      case 'interests': {
        if (!cvData.interests?.length) return;
        writeSectionHeading(sectionLabel('interests', isRTL, sectionNames));
        writeWrapped(cvData.interests.map(item => safe(typeof item === 'string' ? item : item.name)).filter(Boolean).join('  ·  '));
        break;
      }

      case 'courses': {
        if (!cvData.courses?.length) return;
        writeSectionHeading(sectionLabel('courses', isRTL, sectionNames));
        cvData.courses.forEach((c, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(c.name), safe(c.date));
          if (c.institution) writeLine(safe(c.institution), { size: 9, color: [80, 80, 80] });
        });
        break;
      }

      case 'awards': {
        if (!cvData.awards?.length) return;
        writeSectionHeading(sectionLabel('awards', isRTL, sectionNames));
        cvData.awards.forEach((a, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(a.title), safe(a.date));
          if (a.issuer) writeLine(safe(a.issuer), { size: 9, color: [80, 80, 80] });
          if (a.description) writeWrapped(safe(a.description));
        });
        break;
      }

      case 'organisations': {
        if (!cvData.organisations?.length) return;
        writeSectionHeading(sectionLabel('organisations', isRTL, sectionNames));
        cvData.organisations.forEach((o, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(o.name), safe(o.date));
          if (o.role) writeLine(safe(o.role), { size: 9, color: [80, 80, 80] });
        });
        break;
      }

      case 'publications': {
        if (!cvData.publications?.length) return;
        writeSectionHeading(sectionLabel('publications', isRTL, sectionNames));
        cvData.publications.forEach((p, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(p.title), safe(p.date));
          if (p.publisher) writeLine(safe(p.publisher), { size: 9, color: [80, 80, 80] });
          if (p.description) writeWrapped(safe(p.description));
        });
        break;
      }

      case 'references': {
        if (!cvData.references?.length) return;
        writeSectionHeading(sectionLabel('references', isRTL, sectionNames));
        cvData.references.forEach((r, idx) => {
          if (idx > 0) gap(3);
          writeLine(safe(r.name), { size: 10, style: BOLD_STYLE });
          const sub = [safe(r.title), safe(r.company)].filter(Boolean).join(' — ');
          if (sub) writeLine(sub, { size: 9, color: [80, 80, 80] });
          const contact = [safe(r.email), safe(r.phone)].filter(Boolean).join('  |  ');
          if (contact) writeLine(contact, { size: 9, color: [80, 80, 80] });
        });
        break;
      }

      default: {
        if (key.startsWith('csec-') && cvData.customSections) {
          const sec = cvData.customSections.find(s => s.id === key);
          if (!sec?.items?.length) return;
          writeSectionHeading(safe(sec.title).toUpperCase());
          sec.items.forEach((item, idx) => {
            if (idx > 0) gap(3);
            if (item.title) writeLine(safe(item.title), { size: 10, style: BOLD_STYLE });
            if (item.subtitle) writeLine(safe(item.subtitle), { size: 9, color: [80, 80, 80] });
            if (item.description) writeWrapped(safe(item.description));
          });
        }
      }
    }
  };

  for (const key of sectionOrder) {
    renderSection(key);
  }

  return doc;
}
