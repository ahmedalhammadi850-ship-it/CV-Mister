/**
 * atsServerPdf.js
 *
 * Server-side ATS PDF generator using jsPDF native text operators.
 * Every character is written with doc.text() — zero html2canvas / addImage /
 * Puppeteer.  Text is always 100 % selectable and ATS-parseable.
 *
 * Works identically on Replit (Express) and Vercel (serverless Lambda)
 * because it has no dependency on Chromium or any system-level binary.
 *
 * Fonts are loaded from api/_lib/fonts/ which is committed to the repo and
 * therefore included in Vercel's serverless bundle automatically.
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR  = path.join(__dirname, "fonts");

// ── Font cache (loaded once per process) ──────────────────────────────────────
let _latinRegularB64 = null;
let _latinBoldB64    = null;
let _arabicB64       = null;

function tryRead(...candidates) {
  for (const p of candidates) {
    try {
      if (existsSync(p)) return readFileSync(p).toString("base64");
    } catch (_) {}
  }
  return null;
}

function getLatinFonts() {
  if (!_latinRegularB64) {
    _latinRegularB64 = tryRead(
      path.join(FONTS_DIR, "DejaVuSans.ttf"),
      path.join(__dirname, "../../server/fonts/DejaVuSans.ttf"),
      "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    );
    _latinBoldB64 = tryRead(
      path.join(FONTS_DIR, "DejaVuSans-Bold.ttf"),
      path.join(__dirname, "../../server/fonts/DejaVuSans-Bold.ttf"),
      "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    );
    if (!_latinRegularB64) {
      console.warn("[atsServerPdf] DejaVu fonts not found — Helvetica fallback will be used");
    }
  }
  return { regular: _latinRegularB64, bold: _latinBoldB64 };
}

function getArabicFont() {
  if (_arabicB64 === null) {
    _arabicB64 = tryRead(
      path.join(FONTS_DIR, "NotoNaskhArabic-Regular.ttf"),
      path.join(__dirname, "../../server/fonts/NotoNaskhArabic-Regular.ttf"),
    ) ?? false; // false = tried and failed
    if (!_arabicB64) {
      console.warn("[atsServerPdf] NotoNaskhArabic font not found — Helvetica fallback");
    }
  }
  return _arabicB64 || null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const SECTION_LABELS = {
  summary:       { en: "PROFESSIONAL SUMMARY",  ar: "الملخص المهني"         },
  experience:    { en: "WORK EXPERIENCE",        ar: "الخبرة العملية"        },
  education:     { en: "EDUCATION",             ar: "التعليم"               },
  skills:        { en: "CORE SKILLS",           ar: "المهارات الأساسية"     },
  languages:     { en: "LANGUAGES",             ar: "اللغات"                },
  projects:      { en: "PROJECTS",              ar: "المشاريع"              },
  certificates:  { en: "CERTIFICATIONS",        ar: "الشهادات والاعتمادات"  },
  interests:     { en: "INTERESTS",             ar: "الاهتمامات"            },
  courses:       { en: "COURSES & TRAINING",    ar: "الدورات والتدريب"      },
  awards:        { en: "AWARDS & HONOURS",      ar: "الجوائز والتكريمات"    },
  organisations: { en: "ORGANISATIONS",         ar: "المنظمات والجمعيات"    },
  publications:  { en: "PUBLICATIONS",          ar: "المنشورات والأبحاث"    },
  references:    { en: "REFERENCES",            ar: "المراجع والتزكيات"     },
};

const CONTACT_LABELS = {
  email:     { en: "Email",    ar: "البريد الإلكتروني" },
  phone:     { en: "Phone",    ar: "الهاتف"            },
  location:  { en: "Location", ar: "الموقع"            },
  linkedin:  { en: "LinkedIn", ar: "LinkedIn"          },
  portfolio: { en: "Portfolio",ar: "Portfolio"         },
};

function sectionLabel(key, isRTL, sectionNames) {
  if (sectionNames?.[key]) return sectionNames[key].toUpperCase();
  return SECTION_LABELS[key]?.[isRTL ? "ar" : "en"] ?? key.toUpperCase();
}

function dateRange(start, end, current, isRTL) {
  const present = isRTL ? "حتى الآن" : "Present";
  return [start, current ? present : end].filter(Boolean).join(" – ");
}

function safe(v) { return v ? String(v) : ""; }

// ── Main export ───────────────────────────────────────────────────────────────
/**
 * Generate an ATS-compatible PDF from CV data.
 * @param {object} cvData   - CV data object
 * @param {object} options  - { isRTL, visibleSections, visiblePersonalFields,
 *                              sectionOrder, sectionNames }
 * @returns {Promise<Buffer>} Raw PDF bytes
 */
export async function generateATSPdfBuffer(cvData, options = {}) {
  const { jsPDF } = await import("jspdf");

  const {
    isRTL                = false,
    visibleSections      = {},
    visiblePersonalFields = {},
    sectionOrder         = ["summary","experience","education","skills","projects","languages"],
    sectionNames         = {},
  } = options;

  const show = (key) => visibleSections[key] !== false;

  // Page geometry (mm)
  const PAGE_W = 210;
  const PAGE_H = 297;
  const ML     = 15;
  const MR     = 15;
  const MT     = 15;
  const MB     = 12;
  const CW     = PAGE_W - ML - MR;
  const BOTTOM = PAGE_H - MB;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // ── Embed fonts ─────────────────────────────────────────────────────────────
  let FONT_FAMILY = "helvetica";

  if (isRTL) {
    const arabicB64 = getArabicFont();
    if (arabicB64) {
      doc.addFileToVFS("NotoNaskhArabic-Regular.ttf", arabicB64);
      doc.addFont("NotoNaskhArabic-Regular.ttf", "NotoNaskhArabic", "normal");
      doc.addFileToVFS("NotoNaskhArabic-Bold.ttf",    arabicB64);
      doc.addFont("NotoNaskhArabic-Bold.ttf",    "NotoNaskhArabic", "bold");
      FONT_FAMILY = "NotoNaskhArabic";
      doc.setR2L(true);
    }
  } else {
    const { regular, bold } = getLatinFonts();
    if (regular) {
      doc.addFileToVFS("DejaVuSans.ttf",      regular);
      doc.addFont("DejaVuSans.ttf",      "DejaVuSans", "normal");
      FONT_FAMILY = "DejaVuSans";
    }
    if (bold) {
      doc.addFileToVFS("DejaVuSans-Bold.ttf", bold);
      doc.addFont("DejaVuSans-Bold.ttf", "DejaVuSans", "bold");
    }
  }

  const BOLD_STYLE   = "bold";
  const NORMAL_STYLE = "normal";

  let y = MT;

  function needsPageBreak(needed) { return y + needed > BOTTOM; }
  function newPageIfNeeded(needed = 6) {
    if (needsPageBreak(needed)) { doc.addPage(); y = MT; }
  }

  const TX    = isRTL ? (ML + CW) : ML;
  const ALIGN = isRTL ? "right" : "left";

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
      if (left) {
        doc.setFont(FONT_FAMILY, BOLD_STYLE);
        doc.setTextColor(10, 10, 10);
        doc.text(String(left), ML + CW, y, { align: "right" });
      }
      if (right) {
        doc.setFont(FONT_FAMILY, NORMAL_STYLE);
        doc.setTextColor(80, 80, 80);
        doc.text(String(right), ML, y, { align: "left" });
      }
    } else {
      if (left) {
        const safeLeft = doc.splitTextToSize(String(left), CW * 0.72)[0] ?? "";
        doc.setFont(FONT_FAMILY, BOLD_STYLE);
        doc.setTextColor(10, 10, 10);
        doc.text(safeLeft, ML, y);
      }
      if (right) {
        doc.setFont(FONT_FAMILY, NORMAL_STYLE);
        doc.setTextColor(80, 80, 80);
        doc.text(String(right), ML + CW, y, { align: "right" });
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

  // ── Header ──────────────────────────────────────────────────────────────────
  const pi = cvData?.personalInfo ?? {};

  if (pi.fullName) writeLine(pi.fullName, { size: 20, style: BOLD_STYLE,   color: [10, 10, 10] });
  if (pi.jobTitle) writeLine(pi.jobTitle, { size: 11, style: NORMAL_STYLE, color: [60, 60, 60] });

  gap(1);

  const L = (k) => CONTACT_LABELS[k]?.[isRTL ? "ar" : "en"] ?? k;
  const vp = visiblePersonalFields;
  const contactParts = [];
  if (vp.email     !== false && pi.email)     contactParts.push(`${L("email")}: ${pi.email}`);
  if (vp.phone     !== false && pi.phone)     contactParts.push(`${L("phone")}: ${pi.phone}`);
  if (vp.location  !== false && pi.location)  contactParts.push(`${L("location")}: ${pi.location}`);
  if (vp.linkedin  !== false && pi.linkedin)  contactParts.push(`${L("linkedin")}: ${pi.linkedin}`);
  if (vp.portfolio !== false && pi.portfolio) contactParts.push(`${L("portfolio")}: ${pi.portfolio}`);

  if (contactParts.length) {
    writeWrapped(contactParts.join("   |   "), { size: 9, color: [60, 60, 60] });
  }

  gap(2);
  doc.setDrawColor(60, 60, 60);
  doc.setLineWidth(0.5);
  doc.line(ML, y, ML + CW, y);
  gap(1);

  // ── Sections ────────────────────────────────────────────────────────────────
  const renderSection = (key) => {
    if (!show(key)) return;

    switch (key) {
      case "summary": {
        if (!pi.summary) return;
        writeSectionHeading(sectionLabel("summary", isRTL, sectionNames));
        writeWrapped(pi.summary, { size: 10 });
        break;
      }

      case "experience": {
        if (!cvData.experience?.length) return;
        writeSectionHeading(sectionLabel("experience", isRTL, sectionNames));
        cvData.experience.forEach((e, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(e.jobTitle), dateRange(e.startDate, e.endDate, e.current, isRTL));
          const sub = [safe(e.company), safe(e.location)].filter(Boolean).join(" · ");
          if (sub) writeLine(sub, { size: 9, color: [80, 80, 80] });
          if (e.description) { gap(0.5); writeWrapped(safe(e.description)); }
        });
        break;
      }

      case "education": {
        if (!cvData.education?.length) return;
        writeSectionHeading(sectionLabel("education", isRTL, sectionNames));
        cvData.education.forEach((e, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(e.degree), dateRange(e.startDate, e.endDate, false, isRTL));
          if (e.institution) writeLine(safe(e.institution), { size: 9, color: [80, 80, 80] });
          if (e.description) writeWrapped(safe(e.description));
        });
        break;
      }

      case "skills": {
        if (!cvData.skills?.length) return;
        writeSectionHeading(sectionLabel("skills", isRTL, sectionNames));
        writeWrapped(cvData.skills.map(sk => safe(sk.name || sk)).filter(Boolean).join("  ·  "));
        break;
      }

      case "languages": {
        if (!cvData.languages?.length) return;
        writeSectionHeading(sectionLabel("languages", isRTL, sectionNames));
        writeWrapped(
          cvData.languages
            .map(l => `${safe(l.name)} (${safe(l.level)})`)
            .filter(s => s !== " ()")
            .join("  ·  ")
        );
        break;
      }

      case "projects": {
        if (!cvData.projects?.length) return;
        writeSectionHeading(sectionLabel("projects", isRTL, sectionNames));
        cvData.projects.forEach((p, idx) => {
          if (idx > 0) gap(3);
          writeLine(safe(p.title), { size: 10, style: BOLD_STYLE });
          if (p.link) writeLine(safe(p.link), { size: 9, color: [80, 80, 80] });
          if (p.description) writeWrapped(safe(p.description));
        });
        break;
      }

      case "certificates": {
        if (!cvData.certificates?.length) return;
        writeSectionHeading(sectionLabel("certificates", isRTL, sectionNames));
        cvData.certificates.forEach((c, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(c.name), safe(c.date));
          if (c.issuer) writeLine(safe(c.issuer), { size: 9, color: [80, 80, 80] });
          if (c.description) writeWrapped(safe(c.description));
        });
        break;
      }

      case "interests": {
        if (!cvData.interests?.length) return;
        writeSectionHeading(sectionLabel("interests", isRTL, sectionNames));
        writeWrapped(
          cvData.interests
            .map(item => safe(typeof item === "string" ? item : item.name))
            .filter(Boolean)
            .join("  ·  ")
        );
        break;
      }

      case "courses": {
        if (!cvData.courses?.length) return;
        writeSectionHeading(sectionLabel("courses", isRTL, sectionNames));
        cvData.courses.forEach((c, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(c.name), safe(c.date));
          if (c.institution) writeLine(safe(c.institution), { size: 9, color: [80, 80, 80] });
        });
        break;
      }

      case "awards": {
        if (!cvData.awards?.length) return;
        writeSectionHeading(sectionLabel("awards", isRTL, sectionNames));
        cvData.awards.forEach((a, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(a.title), safe(a.date));
          if (a.issuer) writeLine(safe(a.issuer), { size: 9, color: [80, 80, 80] });
          if (a.description) writeWrapped(safe(a.description));
        });
        break;
      }

      case "organisations": {
        if (!cvData.organisations?.length) return;
        writeSectionHeading(sectionLabel("organisations", isRTL, sectionNames));
        cvData.organisations.forEach((o, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(o.name), safe(o.date));
          if (o.role) writeLine(safe(o.role), { size: 9, color: [80, 80, 80] });
        });
        break;
      }

      case "publications": {
        if (!cvData.publications?.length) return;
        writeSectionHeading(sectionLabel("publications", isRTL, sectionNames));
        cvData.publications.forEach((p, idx) => {
          if (idx > 0) gap(3);
          writeTwoCol(safe(p.title), safe(p.date));
          if (p.publisher) writeLine(safe(p.publisher), { size: 9, color: [80, 80, 80] });
          if (p.description) writeWrapped(safe(p.description));
        });
        break;
      }

      case "references": {
        if (!cvData.references?.length) return;
        writeSectionHeading(sectionLabel("references", isRTL, sectionNames));
        cvData.references.forEach((r, idx) => {
          if (idx > 0) gap(3);
          writeLine(safe(r.name), { size: 10, style: BOLD_STYLE });
          const sub = [safe(r.title), safe(r.company)].filter(Boolean).join(" — ");
          if (sub) writeLine(sub, { size: 9, color: [80, 80, 80] });
          const contact = [safe(r.email), safe(r.phone)].filter(Boolean).join("  |  ");
          if (contact) writeLine(contact, { size: 9, color: [80, 80, 80] });
        });
        break;
      }

      default: {
        if (key.startsWith("csec-") && cvData.customSections) {
          const sec = cvData.customSections.find(s => s.id === key);
          if (!sec?.items?.length) return;
          writeSectionHeading(safe(sec.title).toUpperCase());
          sec.items.forEach((item, idx) => {
            if (idx > 0) gap(3);
            if (item.title)       writeLine(safe(item.title),       { size: 10, style: BOLD_STYLE });
            if (item.subtitle)    writeLine(safe(item.subtitle),    { size: 9,  color: [80, 80, 80] });
            if (item.description) writeWrapped(safe(item.description));
          });
        }
      }
    }
  };

  for (const key of sectionOrder) renderSection(key);

  // ── Output ──────────────────────────────────────────────────────────────────
  // doc.output('arraybuffer') works in both browser and Node.js environments.
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
