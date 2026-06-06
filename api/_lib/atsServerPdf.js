/**
 * atsServerPdf.js — server-side ATS PDF generator (jsPDF)
 *
 * Supports all 9 ATS templates with their exact visual styles:
 *   atsclean   – left header, accent job-title, accent rule below sections
 *   atsbold    – accent name, filled accent section bars (white text)
 *   atspro     – light-accent header block + left border, left-bar sections
 *   atssimple  – plain, double-line header border, simple rule below sections
 *   atsharvard – no header border, thin rule ABOVE each section
 *   atscenter  – centered header + name, lines-both-sides section headings
 *   atselegant – centered, double-line header, centered rule-below sections
 *   atscompact – compact, thin-gray header border, tight rule-below sections
 *   atsmodern  – full-width accent stripe header (white text), accent-underline sections
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR  = path.join(__dirname, "fonts");

// ── Font cache ────────────────────────────────────────────────────────────────
let _latinRegB64 = null, _latinBoldB64 = null, _arabicB64 = null;

function tryRead(...ps) {
  for (const p of ps) { try { if (existsSync(p)) return readFileSync(p).toString("base64"); } catch (_) {} }
  return null;
}
function getLatinFonts() {
  if (!_latinRegB64) {
    _latinRegB64 = tryRead(path.join(FONTS_DIR, "DejaVuSans.ttf"));
    _latinBoldB64 = tryRead(path.join(FONTS_DIR, "DejaVuSans-Bold.ttf"));
  }
  return { regular: _latinRegB64, bold: _latinBoldB64 };
}
function getArabicFont() {
  if (_arabicB64 === null) _arabicB64 = tryRead(path.join(FONTS_DIR, "NotoNaskhArabic-Regular.ttf")) ?? false;
  return _arabicB64 || null;
}

// ── Template styles ───────────────────────────────────────────────────────────

function parseHex(hex) {
  const h = (hex || "#000000").replace("#", "").padEnd(6, "0");
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

/** Returns a very light tint of the accent color (92% white mix). */
function lightTint(rgb) {
  return rgb.map(c => Math.round(c + (255 - c) * 0.9));
}

const TEMPLATE_DEFAULTS = {
  atsclean:   { accent: "#1a56a0", nameRgb: null,          nameUpper: false, jobTitleAccent: true,  hdr: "solid-bottom",    hdrAlign: "auto",   sec: "rule-below",       secAlign: "auto"   },
  atsbold:    { accent: "#155e75", nameRgb: "accent",      nameUpper: false, jobTitleAccent: false, hdr: "thin-gray-bottom",hdrAlign: "auto",   sec: "filled-bar",       secAlign: "auto"   },
  atspro:     { accent: "#0f4c75", nameRgb: "accent",      nameUpper: false, jobTitleAccent: false, hdr: "left-bar-bg",     hdrAlign: "auto",   sec: "left-bar",         secAlign: "auto"   },
  atssimple:  { accent: "#2d6a9f", nameRgb: [0,0,0],       nameUpper: false, jobTitleAccent: false, hdr: "double-bottom",   hdrAlign: "auto",   sec: "rule-below",       secAlign: "auto"   },
  atsharvard: { accent: "#1a3a5c", nameRgb: [0,0,0],       nameUpper: false, jobTitleAccent: false, hdr: "none",            hdrAlign: "auto",   sec: "rule-above",       secAlign: "auto"   },
  atscenter:  { accent: "#1a56a0", nameRgb: [13,13,13],    nameUpper: true,  jobTitleAccent: true,  hdr: "solid-bottom",    hdrAlign: "center", sec: "lines-both-sides", secAlign: "center" },
  atselegant: { accent: "#0f4c75", nameRgb: [10,10,10],    nameUpper: true,  jobTitleAccent: true,  hdr: "double-bottom",   hdrAlign: "center", sec: "rule-below",       secAlign: "center" },
  atscompact: { accent: "#1b4f72", nameRgb: [13,13,13],    nameUpper: false, jobTitleAccent: true,  hdr: "thin-gray-bottom",hdrAlign: "auto",   sec: "rule-below",       secAlign: "auto"   },
  atsmodern:  { accent: "#0d4f6e", nameRgb: [255,255,255], nameUpper: false, jobTitleAccent: false, hdr: "filled-stripe",   hdrAlign: "auto",   sec: "accent-underline", secAlign: "auto",  jobTitleRgb: [220,235,245] },
};

function getTemplateStyle(templateId, accentHex, isRTL) {
  const id = (templateId || "atsclean").toLowerCase().replace(/[\s\-_]/g, "");
  const cfg = TEMPLATE_DEFAULTS[id] || TEMPLATE_DEFAULTS["atsclean"];
  const accentRgb = parseHex(accentHex || cfg.accent);

  const autoAlign = isRTL ? "right" : "left";
  const hdrAlign  = cfg.hdrAlign  === "auto" ? autoAlign : cfg.hdrAlign;
  const secAlign  = cfg.secAlign  === "auto" ? autoAlign : cfg.secAlign;

  return {
    id,
    accentRgb,
    nameRgb: cfg.nameRgb === "accent" ? accentRgb : (cfg.nameRgb ?? [13,13,13]),
    nameUpper:       cfg.nameUpper,
    jobTitleAccent:  cfg.jobTitleAccent,
    jobTitleRgb:     cfg.jobTitleRgb ?? null,
    headerStyle:     cfg.hdr,
    hdrAlign,
    sectionStyle:    cfg.sec,
    secAlign,
  };
}

// ── Labels ────────────────────────────────────────────────────────────────────

const SECTION_LABELS = {
  summary:       { en: "Professional Summary",  ar: "الملخص المهني"         },
  experience:    { en: "Work Experience",        ar: "الخبرة العملية"        },
  education:     { en: "Education",             ar: "التعليم"               },
  skills:        { en: "Core Skills",           ar: "المهارات الأساسية"     },
  languages:     { en: "Languages",             ar: "اللغات"                },
  projects:      { en: "Projects",              ar: "المشاريع"              },
  certificates:  { en: "Certifications",        ar: "الشهادات والاعتمادات"  },
  interests:     { en: "Interests",             ar: "الاهتمامات"            },
  courses:       { en: "Courses & Training",    ar: "الدورات والتدريب"      },
  awards:        { en: "Awards & Honours",      ar: "الجوائز والتكريمات"    },
  organisations: { en: "Organisations",         ar: "المنظمات والجمعيات"    },
  publications:  { en: "Publications",          ar: "المنشورات والأبحاث"    },
  references:    { en: "References",            ar: "المراجع والتزكيات"     },
};

const CONTACT_LABELS = {
  email:     { en: "Email",    ar: "البريد الإلكتروني" },
  phone:     { en: "Phone",    ar: "الهاتف"            },
  location:  { en: "Location", ar: "الموقع"            },
  linkedin:  { en: "LinkedIn", ar: "LinkedIn"          },
  portfolio: { en: "Portfolio",ar: "Portfolio"         },
};

function sectionLabel(key, isRTL, sectionNames) {
  if (sectionNames?.[key]) return sectionNames[key];
  return SECTION_LABELS[key]?.[isRTL ? "ar" : "en"] ?? key;
}
function dateRange(start, end, current, isRTL) {
  const present = isRTL ? "حتى الآن" : "Present";
  return [start, current ? present : end].filter(Boolean).join(" – ");
}
function safe(v) { return v ? String(v) : ""; }

// ── Main export ───────────────────────────────────────────────────────────────

export async function generateATSPdfBuffer(cvData, options = {}) {
  const { jsPDF } = await import("jspdf");

  const {
    isRTL                = false,
    visibleSections      = {},
    visiblePersonalFields = {},
    sectionOrder         = ["summary","experience","education","skills","projects","languages"],
    sectionNames         = {},
    templateId           = "atsclean",
    theme                = {},
  } = options;

  const show = (key) => visibleSections[key] !== false;
  const TS = getTemplateStyle(templateId, theme?.primaryColor, isRTL);

  // Page geometry (mm)
  const PAGE_W = 210, PAGE_H = 297;
  const ML = 15, MT = 15, MB = 12;
  const CW = PAGE_W - ML * 2;
  const BOTTOM = PAGE_H - MB;

  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // ── Embed fonts ──────────────────────────────────────────────────────────────
  let FONT_FAMILY = "helvetica";
  if (isRTL) {
    const arabicB64 = getArabicFont();
    if (arabicB64) {
      doc.addFileToVFS("NotoNaskhArabic-Regular.ttf", arabicB64);
      doc.addFont("NotoNaskhArabic-Regular.ttf", "NotoNaskhArabic", "normal");
      doc.addFileToVFS("NotoNaskhArabic-Bold.ttf", arabicB64);
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
  const B = "bold", N = "normal";

  // ── Layout helpers ───────────────────────────────────────────────────────────
  let y = MT;
  const lineH = (size) => size * 0.35 + 1.8; // mm

  // Resolve text anchor for a given alignment token
  function txFor(align) {
    if (align === "center") return ML + CW / 2;
    if (align === "right")  return ML + CW;
    return ML;
  }

  // Default body alignment follows isRTL
  const BODY_ALIGN = isRTL ? "right" : "left";
  const TX_BODY    = txFor(BODY_ALIGN);

  function needsBreak(h) { return y + h > BOTTOM; }
  function newPage() { doc.addPage(); y = MT; }
  function ensurePage(needed = 6) { if (needsBreak(needed)) newPage(); }

  function writeLine(text, {
    size = 10, style = N, color = [20,20,20],
    align = BODY_ALIGN, upperCase = false,
  } = {}) {
    if (!text) return;
    const lh = lineH(size);
    ensurePage(lh);
    doc.setFontSize(size).setFont(FONT_FAMILY, style).setTextColor(...color);
    doc.text(upperCase ? String(text).toUpperCase() : String(text), txFor(align), y, { align });
    y += lh;
  }

  function writeWrapped(text, {
    size = 10, style = N, color = [30,30,30], align = BODY_ALIGN,
  } = {}) {
    if (!text) return;
    const lh = lineH(size);
    doc.setFontSize(size).setFont(FONT_FAMILY, style).setTextColor(...color);
    const lines = doc.splitTextToSize(String(text), CW);
    for (const line of lines) { ensurePage(lh); doc.text(line, txFor(align), y, { align }); y += lh; }
  }

  function writeTwoCol(left, right, { size = 10 } = {}) {
    if (!left && !right) return;
    const lh = lineH(size);
    ensurePage(lh);
    doc.setFontSize(size);
    if (isRTL) {
      if (left)  { doc.setFont(FONT_FAMILY, B).setTextColor(10,10,10).text(String(left),  ML+CW, y, { align:"right" }); }
      if (right) { doc.setFont(FONT_FAMILY, N).setTextColor(80,80,80).text(String(right), ML,    y, { align:"left"  }); }
    } else {
      if (left)  {
        const capped = doc.splitTextToSize(String(left), CW * 0.7)[0] ?? "";
        doc.setFont(FONT_FAMILY, B).setTextColor(10,10,10).text(capped, ML, y);
      }
      if (right) { doc.setFont(FONT_FAMILY, N).setTextColor(80,80,80).text(String(right), ML+CW, y, { align:"right" }); }
    }
    y += lh;
  }

  function gap(mm = 3) { y += mm; }

  // ── Section heading — template-specific ──────────────────────────────────────
  function writeSectionHeading(rawLabel) {
    const label = rawLabel.toUpperCase();
    const [ar, ag, ab] = TS.accentRgb;
    const sa = TS.secAlign;   // 'left' | 'center' | 'right'
    const TX_sec = txFor(sa);

    y += 3;
    ensurePage(10);

    switch (TS.sectionStyle) {

      // ATSBold: filled accent rectangle, white ALL-CAPS text inside
      case "filled-bar": {
        const barH  = 5.2;
        const barY  = y - 4.2;
        doc.setFillColor(ar, ag, ab);
        doc.rect(ML, barY, CW, barH, "F");
        doc.setFontSize(9.5).setFont(FONT_FAMILY, B).setTextColor(255,255,255);
        doc.text(label, TX_sec, y, { align: sa });
        y += 1;
        break;
      }

      // ATSPro: thick left (or right for RTL) accent bar, then text, then thin rule
      case "left-bar": {
        const barW  = 2.5;
        const barH  = 5.0;
        const barY  = y - 4.0;
        const barX  = isRTL ? ML + CW - barW : ML;
        doc.setFillColor(ar, ag, ab);
        doc.rect(barX, barY, barW, barH, "F");
        const textX = isRTL ? ML + CW - barW - 1.5 : ML + barW + 1.5;
        const textA = isRTL ? "right" : "left";
        doc.setFontSize(10.5).setFont(FONT_FAMILY, B).setTextColor(0,0,0);
        doc.text(label, textX, y, { align: textA });
        y += lineH(10.5);
        doc.setDrawColor(180,180,180).setLineWidth(0.25).line(ML, y, ML+CW, y);
        y += 3;
        return;
      }

      // ATSHarvard: thin rule ABOVE, then bold text below
      case "rule-above": {
        doc.setDrawColor(ar, ag, ab).setLineWidth(0.4).line(ML, y - 2, ML+CW, y - 2);
        y += 1;
        doc.setFontSize(10.5).setFont(FONT_FAMILY, B).setTextColor(0,0,0);
        doc.text(label, TX_sec, y, { align: sa });
        y += lineH(10.5) + 2;
        return;
      }

      // ATSCenter: ─────  HEADING  ─────
      case "lines-both-sides": {
        doc.setFontSize(10.5).setFont(FONT_FAMILY, B).setTextColor(0,0,0);
        const textW   = doc.getTextWidth(label);
        const lineY   = y - 1.2;
        const gap_mm  = 3.5;
        const leftEnd = ML + (CW - textW) / 2 - gap_mm;
        const rightSt = ML + (CW + textW) / 2 + gap_mm;
        doc.setDrawColor(ar, ag, ab).setLineWidth(0.4);
        if (leftEnd > ML) doc.line(ML, lineY, leftEnd, lineY);
        doc.text(label, ML + CW / 2, y, { align: "center" });
        if (rightSt < ML + CW) doc.line(rightSt, lineY, ML+CW, lineY);
        y += lineH(10.5) + 1.5;
        return;
      }

      // ATSModern: accent-colored text + thin accent underline
      case "accent-underline": {
        doc.setFontSize(10.5).setFont(FONT_FAMILY, B).setTextColor(ar, ag, ab);
        doc.text(label, TX_sec, y, { align: sa });
        y += lineH(10.5);
        doc.setDrawColor(ar, ag, ab).setLineWidth(0.5).line(ML, y, ML+CW, y);
        y += 3;
        return;
      }

      // Default (ATSClean, ATSSimple, ATSElegant, ATSCompact): text then rule below
      case "rule-below":
      default: {
        doc.setFontSize(10.5).setFont(FONT_FAMILY, B).setTextColor(0,0,0);
        doc.text(label, TX_sec, y, { align: sa });
        y += lineH(10.5);
        doc.setDrawColor(100,100,100).setLineWidth(0.35).line(ML, y, ML+CW, y);
        y += 3.5;
        return;
      }
    }

    // For filled-bar: add spacing after
    y += lineH(9.5) + 2;
  }

  // ── Header ───────────────────────────────────────────────────────────────────
  const pi = cvData?.personalInfo ?? {};
  const [ar, ag, ab] = TS.accentRgb;
  const ha = TS.hdrAlign;  // 'left' | 'center' | 'right'

  // ATSModern: draw full-page accent stripe first
  if (TS.headerStyle === "filled-stripe") {
    const STRIPE_H = 40;
    doc.setFillColor(ar, ag, ab);
    doc.rect(0, 0, PAGE_W, STRIPE_H, "F");
  }

  // ATSPro: draw light-accent header background + thick left border
  if (TS.headerStyle === "left-bar-bg") {
    const BG_H = 30;
    const tint = lightTint(TS.accentRgb);
    doc.setFillColor(...tint);
    doc.rect(ML - 4, MT - 3, CW + 8, BG_H, "F");
    const borderSide = isRTL ? ML + CW + 4 : ML - 4;
    doc.setDrawColor(ar, ag, ab).setLineWidth(1.8).line(borderSide, MT-3, borderSide, MT-3+BG_H);
  }

  // Name
  const nameColor = TS.nameRgb;
  if (pi.fullName) {
    writeLine(pi.fullName, { size: 19, style: B, color: nameColor, align: ha, upperCase: TS.nameUpper });
  }
  // Job title
  if (pi.jobTitle) {
    const jtColor = TS.jobTitleRgb ?? (TS.jobTitleAccent ? TS.accentRgb : [80,80,80]);
    writeLine(pi.jobTitle, { size: 10.5, style: N, color: jtColor, align: ha });
  }

  // Contact line
  const L = (k) => CONTACT_LABELS[k]?.[isRTL ? "ar" : "en"] ?? k;
  const vp = visiblePersonalFields;
  const parts = [];
  if (vp.email     !== false && pi.email)     parts.push(`${L("email")}: ${pi.email}`);
  if (vp.phone     !== false && pi.phone)     parts.push(`${L("phone")}: ${pi.phone}`);
  if (vp.location  !== false && pi.location)  parts.push(`${L("location")}: ${pi.location}`);
  if (vp.linkedin  !== false && pi.linkedin)  parts.push(`${L("linkedin")}: ${pi.linkedin}`);
  if (vp.portfolio !== false && pi.portfolio) parts.push(`${L("portfolio")}: ${pi.portfolio}`);
  if (parts.length) {
    const contactColor = TS.headerStyle === "filled-stripe" ? [220,235,245] : [70,70,70];
    writeWrapped(parts.join("   |   "), { size: 9, color: contactColor, align: ha });
  }

  gap(2);

  // Header separator
  switch (TS.headerStyle) {
    case "solid-bottom":
      doc.setDrawColor(ar, ag, ab).setLineWidth(0.5).line(ML, y, ML+CW, y);
      break;
    case "double-bottom":
      doc.setDrawColor(ar, ag, ab).setLineWidth(0.3);
      doc.line(ML, y, ML+CW, y);
      doc.line(ML, y+0.7, ML+CW, y+0.7);
      break;
    case "thin-gray-bottom":
      doc.setDrawColor(180,180,180).setLineWidth(0.3).line(ML, y, ML+CW, y);
      break;
    case "filled-stripe":
      // Ensure body starts below the stripe
      y = Math.max(y, 42);
      break;
    case "left-bar-bg":
      // Ensure body starts below the header block
      y = Math.max(y, MT + 30);
      break;
    case "none":
    default:
      break;
  }

  gap(1.5);

  // Reset text color to dark for body content (important after white-text stripe)
  doc.setTextColor(20, 20, 20);

  // ── Section rendering ─────────────────────────────────────────────────────────
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
        cvData.experience.forEach((e, i) => {
          if (i > 0) gap(3);
          writeTwoCol(safe(e.jobTitle), dateRange(e.startDate, e.endDate, e.current, isRTL));
          const sub = [safe(e.company), safe(e.location)].filter(Boolean).join(" · ");
          if (sub) writeLine(sub, { size: 9, color: [80,80,80] });
          if (e.description) { gap(0.5); writeWrapped(safe(e.description)); }
        });
        break;
      }

      case "education": {
        if (!cvData.education?.length) return;
        writeSectionHeading(sectionLabel("education", isRTL, sectionNames));
        cvData.education.forEach((e, i) => {
          if (i > 0) gap(3);
          writeTwoCol(safe(e.degree), dateRange(e.startDate, e.endDate, false, isRTL));
          if (e.institution) writeLine(safe(e.institution), { size: 9, color: [80,80,80] });
          if (e.description) writeWrapped(safe(e.description));
        });
        break;
      }

      case "skills": {
        if (!cvData.skills?.length) return;
        writeSectionHeading(sectionLabel("skills", isRTL, sectionNames));
        const sep = TS.id === "atscompact" ? " | " : "  ·  ";
        writeWrapped(cvData.skills.map(sk => safe(sk.name || sk)).filter(Boolean).join(sep));
        break;
      }

      case "languages": {
        if (!cvData.languages?.length) return;
        writeSectionHeading(sectionLabel("languages", isRTL, sectionNames));
        writeWrapped(
          cvData.languages.map(l => `${safe(l.name)} (${safe(l.level)})`).filter(s=>s!==" ()").join("  ·  ")
        );
        break;
      }

      case "projects": {
        if (!cvData.projects?.length) return;
        writeSectionHeading(sectionLabel("projects", isRTL, sectionNames));
        cvData.projects.forEach((p, i) => {
          if (i > 0) gap(3);
          writeLine(safe(p.title), { size: 10, style: B });
          if (p.link) writeLine(safe(p.link), { size: 9, color: [80,80,80] });
          if (p.description) writeWrapped(safe(p.description));
        });
        break;
      }

      case "certificates": {
        if (!cvData.certificates?.length) return;
        writeSectionHeading(sectionLabel("certificates", isRTL, sectionNames));
        cvData.certificates.forEach((c, i) => {
          if (i > 0) gap(3);
          writeTwoCol(safe(c.name), safe(c.date));
          if (c.issuer) writeLine(safe(c.issuer), { size: 9, color: [80,80,80] });
          if (c.description) writeWrapped(safe(c.description));
        });
        break;
      }

      case "interests": {
        if (!cvData.interests?.length) return;
        writeSectionHeading(sectionLabel("interests", isRTL, sectionNames));
        writeWrapped(cvData.interests.map(item => safe(typeof item==="string"?item:item.name)).filter(Boolean).join("  ·  "));
        break;
      }

      case "courses": {
        if (!cvData.courses?.length) return;
        writeSectionHeading(sectionLabel("courses", isRTL, sectionNames));
        cvData.courses.forEach((c, i) => {
          if (i > 0) gap(3);
          writeTwoCol(safe(c.name), safe(c.date));
          if (c.institution) writeLine(safe(c.institution), { size: 9, color: [80,80,80] });
        });
        break;
      }

      case "awards": {
        if (!cvData.awards?.length) return;
        writeSectionHeading(sectionLabel("awards", isRTL, sectionNames));
        cvData.awards.forEach((a, i) => {
          if (i > 0) gap(3);
          writeTwoCol(safe(a.title), safe(a.date));
          if (a.issuer) writeLine(safe(a.issuer), { size: 9, color: [80,80,80] });
          if (a.description) writeWrapped(safe(a.description));
        });
        break;
      }

      case "organisations": {
        if (!cvData.organisations?.length) return;
        writeSectionHeading(sectionLabel("organisations", isRTL, sectionNames));
        cvData.organisations.forEach((o, i) => {
          if (i > 0) gap(3);
          writeTwoCol(safe(o.name), safe(o.date));
          if (o.role) writeLine(safe(o.role), { size: 9, color: [80,80,80] });
        });
        break;
      }

      case "publications": {
        if (!cvData.publications?.length) return;
        writeSectionHeading(sectionLabel("publications", isRTL, sectionNames));
        cvData.publications.forEach((p, i) => {
          if (i > 0) gap(3);
          writeTwoCol(safe(p.title), safe(p.date));
          if (p.publisher) writeLine(safe(p.publisher), { size: 9, color: [80,80,80] });
          if (p.description) writeWrapped(safe(p.description));
        });
        break;
      }

      case "references": {
        if (!cvData.references?.length) return;
        writeSectionHeading(sectionLabel("references", isRTL, sectionNames));
        cvData.references.forEach((r, i) => {
          if (i > 0) gap(3);
          writeLine(safe(r.name), { size: 10, style: B });
          const sub = [safe(r.title), safe(r.company)].filter(Boolean).join(" — ");
          if (sub) writeLine(sub, { size: 9, color: [80,80,80] });
          const contact = [safe(r.email), safe(r.phone)].filter(Boolean).join("  |  ");
          if (contact) writeLine(contact, { size: 9, color: [80,80,80] });
        });
        break;
      }

      default: {
        if (key.startsWith("csec-") && cvData.customSections) {
          const sec = cvData.customSections.find(s => s.id === key);
          if (!sec?.items?.length) return;
          writeSectionHeading(safe(sec.title));
          sec.items.forEach((item, i) => {
            if (i > 0) gap(3);
            if (item.title)       writeLine(safe(item.title),       { size: 10, style: B });
            if (item.subtitle)    writeLine(safe(item.subtitle),    { size: 9,  color: [80,80,80] });
            if (item.description) writeWrapped(safe(item.description));
          });
        }
      }
    }
  };

  for (const key of sectionOrder) renderSection(key);

  // ── Output ────────────────────────────────────────────────────────────────────
  return Buffer.from(doc.output("arraybuffer"));
}
