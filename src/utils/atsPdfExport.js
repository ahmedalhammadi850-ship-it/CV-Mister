/**
 * ATS-safe PDF export — writes real, machine-readable text directly into
 * jsPDF using native doc.text() calls. Zero html2canvas / addImage usage.
 *
 * ATS parsers (and n8n's "Extract from File" node) read the PDF text stream.
 * An image-based PDF produces an empty string on extraction regardless of
 * whether it is compressed or not.
 */

export const ATS_TEMPLATE_IDS = new Set([
  'atsclean', 'atspro', 'atssimple', 'atsbold',
  'atscompact', 'atsmodern', 'atsharvard', 'atscenter', 'atselegant',
]);

export function isATSTemplate(templateId) {
  return ATS_TEMPLATE_IDS.has((templateId || '').toLowerCase());
}

const SECTION_LABELS = {
  summary:       { en: 'PROFESSIONAL SUMMARY',      ar: 'الملخص المهني'            },
  experience:    { en: 'WORK EXPERIENCE',            ar: 'الخبرة العملية'           },
  education:     { en: 'EDUCATION',                 ar: 'التعليم'                  },
  skills:        { en: 'CORE SKILLS',               ar: 'المهارات الأساسية'        },
  languages:     { en: 'LANGUAGES',                 ar: 'اللغات'                   },
  projects:      { en: 'PROJECTS',                  ar: 'المشاريع'                 },
  certificates:  { en: 'CERTIFICATIONS',            ar: 'الشهادات والاعتمادات'      },
  interests:     { en: 'INTERESTS',                 ar: 'الاهتمامات'               },
  courses:       { en: 'COURSES & TRAINING',        ar: 'الدورات والتدريب'         },
  awards:        { en: 'AWARDS & HONOURS',          ar: 'الجوائز والتكريمات'       },
  organisations: { en: 'ORGANISATIONS',             ar: 'المنظمات والجمعيات'       },
  publications:  { en: 'PUBLICATIONS',              ar: 'المنشورات والأبحاث'       },
  references:    { en: 'REFERENCES',                ar: 'المراجع والتزكيات'        },
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
  const parts = [start, current ? present : end].filter(Boolean);
  return parts.join(' – ');
}

function safe(v) {
  return v ? String(v) : '';
}

/**
 * Generates a fully text-based ATS-compatible PDF using jsPDF native APIs.
 * No html2canvas, no addImage — every character is a real PDF text operator.
 *
 * @param {object} cvData       - The CV data object from CVContext
 * @param {object} options
 * @param {boolean} options.isRTL
 * @param {object}  options.visibleSections
 * @param {object}  options.visiblePersonalFields
 * @param {string[]} options.sectionOrder
 * @param {object}  options.sectionNames
 * @returns {jsPDF} The generated document (call .save() on it)
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

  // ── Page geometry ────────────────────────────────────────────────────────
  const PAGE_W   = 210;
  const PAGE_H   = 297;
  const ML       = 15;   // left margin
  const MR       = 15;   // right margin
  const MT       = 15;   // top margin
  const MB       = 12;   // bottom margin
  const CW       = PAGE_W - ML - MR; // usable content width in mm
  const BOTTOM   = PAGE_H - MB;

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  let y = MT;

  // ── Helpers ───────────────────────────────────────────────────────────────

  function needsPageBreak(needed) {
    return y + needed > BOTTOM;
  }

  function newPageIfNeeded(needed = 6) {
    if (needsPageBreak(needed)) {
      doc.addPage();
      y = MT;
    }
  }

  /** Write a single line, advancing y. Handles page breaks. */
  function writeLine(text, { size = 10, style = 'normal', color = [20, 20, 20], x = ML, align = 'left', advance = true } = {}) {
    if (!text) return;
    const lineH = size * 0.35 + 1.8;
    newPageIfNeeded(lineH);
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.setTextColor(...color);
    doc.text(String(text), x, y, { align });
    if (advance) y += lineH;
  }

  /** Write text that may wrap across multiple lines. */
  function writeWrapped(text, { size = 10, style = 'normal', color = [30, 30, 30], indent = 0, maxW } = {}) {
    if (!text) return;
    const lineH = size * 0.35 + 1.8;
    const width = (maxW ?? CW) - indent;
    doc.setFontSize(size);
    doc.setFont('helvetica', style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(String(text), width);
    for (const line of lines) {
      newPageIfNeeded(lineH);
      doc.text(line, ML + indent, y);
      y += lineH;
    }
  }

  /** Write a two-column row: left text + right-aligned date string. */
  function writeTwoCol(left, right, { size = 10, leftStyle = 'bold', rightStyle = 'normal' } = {}) {
    if (!left && !right) return;
    const lineH = size * 0.35 + 1.8;
    newPageIfNeeded(lineH);
    doc.setFontSize(size);
    if (left) {
      doc.setFont('helvetica', leftStyle);
      doc.setTextColor(10, 10, 10);
      const safeLeft = doc.splitTextToSize(String(left), CW * 0.72)[0] ?? '';
      doc.text(safeLeft, ML, y);
    }
    if (right) {
      doc.setFont('helvetica', rightStyle);
      doc.setTextColor(80, 80, 80);
      doc.text(String(right), ML + CW, y, { align: 'right' });
    }
    y += lineH;
  }

  /** Draw a full-width section heading + horizontal rule. */
  function writeSectionHeading(label) {
    y += 3;
    newPageIfNeeded(10);
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(String(label), ML, y);
    y += 4.5;
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.35);
    doc.line(ML, y, ML + CW, y);
    y += 3.5;
  }

  /** Gap between items */
  function gap(mm = 3) { y += mm; }

  // ── Header ────────────────────────────────────────────────────────────────
  const pi = cvData?.personalInfo ?? {};

  // Full name
  if (pi.fullName) {
    writeLine(pi.fullName, { size: 20, style: 'bold', color: [10, 10, 10] });
  }

  // Job title
  if (pi.jobTitle) {
    writeLine(pi.jobTitle, { size: 11, style: 'normal', color: [60, 60, 60] });
  }

  gap(1);

  // Contact line — single row of pipe-separated items
  const contactParts = [];
  const L = (k) => CONTACT_LABELS[k]?.[isRTL ? 'ar' : 'en'] ?? k;

  if (visiblePersonalFields.email     !== false && pi.email)     contactParts.push(`${L('email')}: ${pi.email}`);
  if (visiblePersonalFields.phone     !== false && pi.phone)     contactParts.push(`${L('phone')}: ${pi.phone}`);
  if (visiblePersonalFields.location  !== false && pi.location)  contactParts.push(`${L('location')}: ${pi.location}`);
  if (visiblePersonalFields.linkedin  !== false && pi.linkedin)  contactParts.push(`${L('linkedin')}: ${pi.linkedin}`);
  if (visiblePersonalFields.portfolio !== false && pi.portfolio) contactParts.push(`${L('portfolio')}: ${pi.portfolio}`);

  if (contactParts.length) {
    writeWrapped(contactParts.join('   |   '), { size: 9, color: [60, 60, 60] });
  }

  // Separator line below header
  gap(2);
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.5);
  doc.line(ML, y, ML + CW, y);
  gap(1);

  // ── Sections ──────────────────────────────────────────────────────────────

  const renderSection = (key) => {
    if (!show(key)) return;

    switch (key) {

      // ── Summary ──
      case 'summary': {
        const text = pi.summary;
        if (!text) return;
        writeSectionHeading(sectionLabel('summary', isRTL, sectionNames));
        writeWrapped(text, { size: 10 });
        break;
      }

      // ── Experience ──
      case 'experience': {
        const items = cvData.experience;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('experience', isRTL, sectionNames));
        items.forEach((e, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(e.jobTitle), dateRange(e.startDate, e.endDate, e.current, isRTL), { size: 10, leftStyle: 'bold' });
          if (e.company || e.location) {
            const sub = [safe(e.company), safe(e.location)].filter(Boolean).join(' · ');
            writeLine(sub, { size: 9, style: 'normal', color: [80, 80, 80] });
          }
          if (e.description) {
            gap(0.5);
            writeWrapped(safe(e.description), { size: 10, color: [30, 30, 30] });
          }
        });
        break;
      }

      // ── Education ──
      case 'education': {
        const items = cvData.education;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('education', isRTL, sectionNames));
        items.forEach((e, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(e.degree), dateRange(e.startDate, e.endDate, false, isRTL), { size: 10, leftStyle: 'bold' });
          if (e.institution) writeLine(safe(e.institution), { size: 9, style: 'normal', color: [80, 80, 80] });
          if (e.description) {
            gap(0.5);
            writeWrapped(safe(e.description), { size: 10, color: [30, 30, 30] });
          }
        });
        break;
      }

      // ── Skills ──
      case 'skills': {
        const items = cvData.skills;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('skills', isRTL, sectionNames));
        const text = items.map(sk => safe(sk.name || sk)).filter(Boolean).join('  ·  ');
        writeWrapped(text, { size: 10 });
        break;
      }

      // ── Languages ──
      case 'languages': {
        const items = cvData.languages;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('languages', isRTL, sectionNames));
        const text = items.map(l => `${safe(l.name)} (${safe(l.level)})`).filter(s => s !== ' ()').join('  ·  ');
        writeWrapped(text, { size: 10 });
        break;
      }

      // ── Projects ──
      case 'projects': {
        const items = cvData.projects;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('projects', isRTL, sectionNames));
        items.forEach((p, idx) => {
          if (idx > 0) gap(3);
          writeLine(safe(p.title), { size: 10, style: 'bold', color: [10, 10, 10] });
          if (p.link) writeLine(safe(p.link), { size: 9, style: 'normal', color: [80, 80, 80] });
          if (p.description) writeWrapped(safe(p.description), { size: 10 });
        });
        break;
      }

      // ── Certificates ──
      case 'certificates': {
        const items = cvData.certificates;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('certificates', isRTL, sectionNames));
        items.forEach((c, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(c.name), safe(c.date), { size: 10, leftStyle: 'bold' });
          if (c.issuer) writeLine(safe(c.issuer), { size: 9, style: 'normal', color: [80, 80, 80] });
          if (c.description) writeWrapped(safe(c.description), { size: 10 });
        });
        break;
      }

      // ── Interests ──
      case 'interests': {
        const items = cvData.interests;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('interests', isRTL, sectionNames));
        const text = items.map(item => safe(typeof item === 'string' ? item : item.name)).filter(Boolean).join('  ·  ');
        writeWrapped(text, { size: 10 });
        break;
      }

      // ── Courses ──
      case 'courses': {
        const items = cvData.courses;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('courses', isRTL, sectionNames));
        items.forEach((c, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(c.name), safe(c.date), { size: 10, leftStyle: 'bold' });
          if (c.institution) writeLine(safe(c.institution), { size: 9, style: 'normal', color: [80, 80, 80] });
        });
        break;
      }

      // ── Awards ──
      case 'awards': {
        const items = cvData.awards;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('awards', isRTL, sectionNames));
        items.forEach((a, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(a.title), safe(a.date), { size: 10, leftStyle: 'bold' });
          if (a.issuer) writeLine(safe(a.issuer), { size: 9, style: 'normal', color: [80, 80, 80] });
          if (a.description) writeWrapped(safe(a.description), { size: 10 });
        });
        break;
      }

      // ── Organisations ──
      case 'organisations': {
        const items = cvData.organisations;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('organisations', isRTL, sectionNames));
        items.forEach((o, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(o.name), safe(o.date), { size: 10, leftStyle: 'bold' });
          if (o.role) writeLine(safe(o.role), { size: 9, style: 'normal', color: [80, 80, 80] });
        });
        break;
      }

      // ── Publications ──
      case 'publications': {
        const items = cvData.publications;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('publications', isRTL, sectionNames));
        items.forEach((p, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(p.title), safe(p.date), { size: 10, leftStyle: 'bold' });
          if (p.publisher) writeLine(safe(p.publisher), { size: 9, style: 'normal', color: [80, 80, 80] });
          if (p.description) writeWrapped(safe(p.description), { size: 10 });
        });
        break;
      }

      // ── References ──
      case 'references': {
        const items = cvData.references;
        if (!items?.length) return;
        writeSectionHeading(sectionLabel('references', isRTL, sectionNames));
        items.forEach((r, idx) => {
          if (idx > 0) gap(3);
          writeLine(safe(r.name), { size: 10, style: 'bold', color: [10, 10, 10] });
          const sub = [safe(r.title), safe(r.company)].filter(Boolean).join(' — ');
          if (sub) writeLine(sub, { size: 9, style: 'normal', color: [80, 80, 80] });
          const contact = [safe(r.email), safe(r.phone)].filter(Boolean).join('  |  ');
          if (contact) writeLine(contact, { size: 9, style: 'normal', color: [80, 80, 80] });
        });
        break;
      }

      // ── Custom sections ──
      default: {
        if (key.startsWith('csec-') && cvData.customSections) {
          const sec = cvData.customSections.find(s => s.id === key);
          if (!sec?.items?.length) return;
          writeSectionHeading(safe(sec.title).toUpperCase());
          sec.items.forEach((item, idx) => {
            if (idx > 0) gap(3);
            if (item.title) writeLine(safe(item.title), { size: 10, style: 'bold', color: [10, 10, 10] });
            if (item.subtitle) writeLine(safe(item.subtitle), { size: 9, style: 'normal', color: [80, 80, 80] });
            if (item.description) writeWrapped(safe(item.description), { size: 10 });
          });
        }
      }
    }
  };

  // Render sections in the user-defined order
  for (const key of sectionOrder) {
    renderSection(key);
  }

  return doc;
}
