/**
 * atsServerPdf.js — PDFKit-based ATS PDF generator
 *
 * Replaced jsPDF because jsPDF embeds incorrect glyph advance widths for
 * custom TTF fonts, causing PDF viewers to render selection rectangles that
 * are offset from the visible glyphs ("fragmented blue blocks" symptom).
 *
 * PDFKit uses its bundled fontkit to read actual TTF/OTF metrics, so every
 * glyph's width in the PDF's /Widths array matches what is rendered on screen.
 * Text selection, copy/paste, and ATS parsing all work correctly.
 *
 * Fonts in api/_lib/fonts/ are committed to the repo and bundled automatically
 * in every deployment environment (Replit, Vercel Lambda, etc.).
 */

import PDFDocument from "pdfkit";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR  = path.join(__dirname, "fonts");

// 1 mm expressed in PDF user-space points (72 dpi)
const MM = 2.8346;

// Page geometry — all values in points (A4 = 595 × 842 pt)
const ML     = 15 * MM;          // left margin
const MT     = 15 * MM;          // top margin
const MB     = 12 * MM;          // bottom margin
const CW     = 180 * MM;         // content width (210 - 30 mm)
const BOTTOM = (297 - 12) * MM;  // lower threshold before page break

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

/**
 * Line height in PDF points for a given font size (in pt).
 * Formula mirrors the original mm layout: lineH(mm) = size*0.35 + 1.8
 * Converting to points: × 2.8346
 */
function lineH(size) { return (size * 0.35 + 1.8) * MM; }

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Generate an ATS-compatible PDF from CV data using PDFKit.
 * Returns a Buffer containing raw PDF bytes.
 */
export async function generateATSPdfBuffer(cvData, options = {}) {
  const {
    isRTL                = false,
    visibleSections      = {},
    visiblePersonalFields = {},
    sectionOrder         = ["summary","experience","education","skills","projects","languages"],
    sectionNames         = {},
  } = options;

  const show = (key) => visibleSections[key] !== false;

  // ── Resolve font paths ───────────────────────────────────────────────────────
  const latinRegPath  = path.join(FONTS_DIR, "DejaVuSans.ttf");
  const latinBoldPath = path.join(FONTS_DIR, "DejaVuSans-Bold.ttf");
  const arabicPath    = path.join(FONTS_DIR, "NotoNaskhArabic-Regular.ttf");

  const hasLatin  = existsSync(latinRegPath);
  const hasBold   = existsSync(latinBoldPath);
  const hasArabic = existsSync(arabicPath);

  if (!hasLatin)  console.warn("[atsServerPdf] DejaVuSans.ttf not found — falling back to Helvetica");
  if (!hasArabic) console.warn("[atsServerPdf] NotoNaskhArabic-Regular.ttf not found — Arabic may render incorrectly");

  // ── Create PDFKit document ───────────────────────────────────────────────────
  const doc = new PDFDocument({
    size:          "A4",
    margin:        0,
    autoFirstPage: true,
    lang:          isRTL ? "ar" : "en",
    info:          { Title: "Resume", Subject: "ATS-optimised resume" },
  });

  // ── Register fonts ───────────────────────────────────────────────────────────
  let FONT_REG  = "Helvetica";
  let FONT_BOLD = "Helvetica-Bold";

  if (isRTL && hasArabic) {
    doc.registerFont("PDF-Regular", arabicPath);
    doc.registerFont("PDF-Bold",    arabicPath); // NotoNaskh has no separate bold; same TTF used
    FONT_REG  = "PDF-Regular";
    FONT_BOLD = "PDF-Bold";
  } else if (!isRTL && hasLatin) {
    doc.registerFont("PDF-Regular", latinRegPath);
    doc.registerFont("PDF-Bold",    hasBold ? latinBoldPath : latinRegPath);
    FONT_REG  = "PDF-Regular";
    FONT_BOLD = "PDF-Bold";
  }

  // ── Layout state ─────────────────────────────────────────────────────────────
  let y     = MT;
  const ALIGN = isRTL ? "right" : "left";

  function ensurePage(needed) {
    if (y + needed > BOTTOM) {
      doc.addPage({ size: "A4", margin: 0 });
      y = MT;
    }
  }

  /**
   * Render a single non-wrapping line of text.
   * We position it at (ML, y) with full content width so alignment works.
   */
  function writeLine(text, { size = 10, bold = false, color = [20, 20, 20] } = {}) {
    if (!text) return;
    const lh = lineH(size);
    ensurePage(lh);
    doc
      .font(bold ? FONT_BOLD : FONT_REG)
      .fontSize(size)
      .fillColor(color)
      .text(String(text), ML, y, { lineBreak: false, width: CW, align: ALIGN });
    y += lh;
  }

  /**
   * Render wrapped (possibly multi-line) text.
   * After the call we sync y from PDFKit's cursor so multi-line content
   * correctly advances our position tracker.
   */
  function writeWrapped(text, { size = 10, bold = false, color = [30, 30, 30] } = {}) {
    if (!text) return;
    const lh = lineH(size);
    ensurePage(lh);
    doc
      .font(bold ? FONT_BOLD : FONT_REG)
      .fontSize(size)
      .fillColor(color)
      .text(String(text), ML, y, { width: CW, align: ALIGN, lineBreak: true });
    // Sync our manual tracker with PDFKit's cursor after wrapping
    y = doc.y;
  }

  /**
   * Render two items on the same line (job title + date, degree + date, etc.).
   * LTR: bold left-aligned title | light right-aligned date
   * RTL: bold right-aligned title | light left-aligned date
   */
  function writeTwoCol(left, right, { size = 10 } = {}) {
    if (!left && !right) return;
    const lh = lineH(size);
    ensurePage(lh);

    if (isRTL) {
      // Primary content at right, secondary (date) at left
      if (left) {
        doc.font(FONT_BOLD).fontSize(size).fillColor([10, 10, 10])
          .text(String(left), ML, y, { width: CW, align: "right", lineBreak: false });
      }
      if (right) {
        doc.font(FONT_REG).fontSize(size).fillColor([80, 80, 80])
          .text(String(right), ML, y, { width: CW * 0.32, align: "left", lineBreak: false });
      }
    } else {
      // Primary content at left, secondary (date) at right
      if (left) {
        doc.font(FONT_BOLD).fontSize(size).fillColor([10, 10, 10])
          .text(String(left), ML, y, { width: CW * 0.68, lineBreak: false });
      }
      if (right) {
        doc.font(FONT_REG).fontSize(size).fillColor([80, 80, 80])
          .text(String(right), ML, y, { width: CW, align: "right", lineBreak: false });
      }
    }
    y += lh;
  }

  function writeSectionHeading(label) {
    y += 3 * MM;
    ensurePage(10 * MM);
    doc.font(FONT_BOLD).fontSize(10.5).fillColor([0, 0, 0])
      .text(String(label), ML, y, { lineBreak: false, width: CW, align: ALIGN });
    y += lineH(10.5);
    doc.strokeColor([100, 100, 100]).lineWidth(0.5)
      .moveTo(ML, y).lineTo(ML + CW, y).stroke();
    y += 3.5 * MM;
  }

  function gap(mm = 3) { y += mm * MM; }

  // ── Header ───────────────────────────────────────────────────────────────────
  const pi = cvData?.personalInfo ?? {};

  if (pi.fullName) writeLine(pi.fullName, { size: 20, bold: true,  color: [10, 10, 10] });
  if (pi.jobTitle) writeLine(pi.jobTitle, { size: 11, bold: false, color: [60, 60, 60] });

  gap(1);

  const L  = (k) => CONTACT_LABELS[k]?.[isRTL ? "ar" : "en"] ?? k;
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
  doc.strokeColor([60, 60, 60]).lineWidth(0.7)
    .moveTo(ML, y).lineTo(ML + CW, y).stroke();
  gap(1);

  // ── Sections ─────────────────────────────────────────────────────────────────
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
        writeWrapped(
          cvData.skills.map(sk => safe(sk.name || sk)).filter(Boolean).join("  ·  ")
        );
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
          writeLine(safe(p.title), { size: 10, bold: true });
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
          writeLine(safe(r.name), { size: 10, bold: true });
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
            if (item.title)       writeLine(safe(item.title),       { size: 10, bold: true });
            if (item.subtitle)    writeLine(safe(item.subtitle),    { size: 9,  color: [80, 80, 80] });
            if (item.description) writeWrapped(safe(item.description));
          });
        }
      }
    }
  };

  for (const key of sectionOrder) renderSection(key);

  // ── Collect PDF bytes ─────────────────────────────────────────────────────────
  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on("data",  chunk => chunks.push(chunk));
    doc.on("end",   ()    => resolve(Buffer.concat(chunks)));
    doc.on("error", err   => reject(err));
    doc.end();
  });
}
