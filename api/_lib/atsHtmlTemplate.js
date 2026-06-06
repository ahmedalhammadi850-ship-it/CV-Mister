/**
 * atsHtmlTemplate.js
 *
 * Generates a complete, print-ready HTML document for ATS CV templates.
 * Designed to be rendered by Puppeteer → PDF with real, selectable text.
 *
 * Supports:
 *  - All 9 ATS template variants (clean, pro, simple, bold, compact, modern, harvard, center, elegant)
 *  - Full Arabic / RTL with embedded Noto Naskh Arabic font
 *  - All CV sections (summary, experience, education, skills, languages, projects,
 *    certificates, interests, courses, awards, organisations, publications, references, custom)
 *  - Theme-aware: primaryColor, fontSize, pagePadding, lineHeight, sectionSpacing
 *  - Template-specific section heading, header, and skills rendering that matches preview
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = path.resolve(__dirname, "../../server/fonts");

// ── Font cache ─────────────────────────────────────────────────────────────────
let _arabicFontB64 = null;
let _arabicFontFetching = false;
let _arabicFontWaiters = [];

let _latinFontRegularB64 = null;
let _latinFontBoldB64    = null;

function tryReadFont(...candidates) {
  for (const p of candidates) {
    try {
      if (existsSync(p)) return readFileSync(p).toString("base64");
    } catch (_) {}
  }
  return null;
}

function loadLatinFonts() {
  if (_latinFontRegularB64) return;
  _latinFontRegularB64 = tryReadFont(
    path.join(FONTS_DIR, "DejaVuSans.ttf"),
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
  );
  _latinFontBoldB64 = tryReadFont(
    path.join(FONTS_DIR, "DejaVuSans-Bold.ttf"),
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
  );
  if (!_latinFontRegularB64) {
    console.warn("[atsHtmlTemplate] Latin fonts not found — text may not be selectable in PDF");
  }
}

async function fetchArabicFontBase64() {
  if (_arabicFontB64) return _arabicFontB64;
  if (_arabicFontFetching) return new Promise((res) => _arabicFontWaiters.push(res));
  _arabicFontFetching = true;

  try {
    const bundled = tryReadFont(path.join(FONTS_DIR, "NotoNaskhArabic-Regular.ttf"));
    if (bundled) {
      _arabicFontB64 = bundled;
      return _arabicFontB64;
    }
    const cssRes = await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;600;700&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) Chrome/120" } },
    );
    if (!cssRes.ok) throw new Error(`CSS fetch failed: ${cssRes.status}`);
    const css = await cssRes.text();
    const match = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/);
    if (!match) throw new Error("Font URL not found in CSS");
    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) throw new Error(`Font file fetch failed: ${fontRes.status}`);
    _arabicFontB64 = Buffer.from(await fontRes.arrayBuffer()).toString("base64");
  } catch (e) {
    console.warn("[atsHtmlTemplate] Arabic font load failed:", e.message);
    _arabicFontB64 = null;
  } finally {
    _arabicFontFetching = false;
    const waiters = _arabicFontWaiters.splice(0);
    waiters.forEach((r) => r(_arabicFontB64));
  }
  return _arabicFontB64;
}

// ── Per-template variant config ───────────────────────────────────────────────
// These values exactly mirror the JSX templates so preview and PDF match.
function normalizeId(id) {
  return (id || "").toLowerCase().replace(/[\s\-_]/g, "");
}

const TEMPLATE_VARIANTS = {
  atsclean: {
    accentDefault:     "#1a56a0",
    headerStyle:       "solid-bottom",    // accent border-bottom on .cv-contact
    sectionStyle:      "rule-below",      // heading text + accent rule below
    skillsStyle:       "text",            // dot-separated text
    nameColor:         "#0d0d0d",
    titleColor:        "accent",          // "accent" → use resolved accent
    contactColor:      "#444444",
    headerAlign:       "left",
    titleFontSize:     "11pt",
    titleWeight:       "600",
  },
  atspro: {
    accentDefault:     "#0f4c75",
    headerStyle:       "left-bar-bg",     // light tinted bg + thick side border
    sectionStyle:      "left-bar",        // 4px accent bar + heading text + gray rule
    skillsStyle:       "pills",           // accent-light pill spans
    nameColor:         "accent",
    titleColor:        "#333333",
    contactColor:      "#444444",
    headerAlign:       "left",
    titleFontSize:     "11pt",
    titleWeight:       "600",
    subTextColor:      "accent",          // company in accent color
    subTextWeight:     "600",
    subTextItalic:     false,
    datePill:          true,              // date wrapped in accent-light pill
  },
  atssimple: {
    accentDefault:     "#2d6a9f",
    headerStyle:       "double-bottom",   // 3px double accent border on header block
    sectionStyle:      "rule-fill-right", // heading text + line filling remaining width
    skillsStyle:       "text",
    nameColor:         "#000000",
    titleColor:        "#444444",
    contactColor:      "#333333",
    headerAlign:       "left",
    titleFontSize:     "10.5pt",
    titleWeight:       "500",
  },
  atsbold: {
    accentDefault:     "#155e75",
    headerStyle:       "thin-gray-bottom",// 1px #ddd border on header block
    sectionStyle:      "filled-bar",      // filled accent rectangle, white text
    skillsStyle:       "bullet-grid",     // ▪ bullet + skill name, flex-wrap
    nameColor:         "accent",
    titleColor:        "#333333",
    contactColor:      "#444444",
    headerAlign:       "left",
    titleFontSize:     "11pt",
    titleWeight:       "500",
  },
  atscompact: {
    accentDefault:     "#1b4f72",
    headerStyle:       "thin-gray-bottom",
    sectionStyle:      "rule-below",
    skillsStyle:       "text",
    nameColor:         "#000000",
    titleColor:        "accent",
    contactColor:      "#333333",
    headerAlign:       "left",
    titleFontSize:     "11pt",
    titleWeight:       "600",
  },
  atsmodern: {
    accentDefault:     "#0d4f6e",
    headerStyle:       "filled-stripe",   // full-width accent stripe (white text)
    sectionStyle:      "accent-underline",// accent-colored text + 2px accent border-bottom
    skillsStyle:       "grid3",           // 3-col grid with accent dots
    nameColor:         "#ffffff",
    titleColor:        "rgba(255,255,255,0.85)",
    contactColor:      "rgba(255,255,255,0.9)",
    headerAlign:       "left",
    titleFontSize:     "10.5pt",
    titleWeight:       "500",
    subTextColor:      "accent",
    subTextWeight:     "500",
    subTextItalic:     false,
  },
  atsharvard: {
    accentDefault:     "#1a3a5c",
    headerStyle:       "none",            // no border
    sectionStyle:      "rule-above",      // thin rule ABOVE heading text
    skillsStyle:       "text",
    nameColor:         "#000000",
    titleColor:        "#333333",
    contactColor:      "#333333",
    headerAlign:       "left",
    titleFontSize:     "10pt",
    titleWeight:       "500",
  },
  atscenter: {
    accentDefault:     "#1a56a0",
    headerStyle:       "solid-bottom",
    sectionStyle:      "lines-both-sides",// ─── HEADING ───
    skillsStyle:       "text",
    nameColor:         "#0d0d0d",
    titleColor:        "accent",
    contactColor:      "#444444",
    headerAlign:       "center",
    titleFontSize:     "11pt",
    titleWeight:       "600",
    nameUppercase:     true,
    nameLetterSpacing: "0.02em",
  },
  atselegant: {
    accentDefault:     "#0f4c75",
    headerStyle:       "double-bottom",
    sectionStyle:      "rule-below-centered",// centered heading + rule below
    skillsStyle:       "text",
    nameColor:         "#0a0a0a",
    titleColor:        "accent",
    contactColor:      "#444444",
    headerAlign:       "center",
    titleFontSize:     "10.5pt",
    titleWeight:       "600",
    nameUppercase:     true,
    nameWeight:        "900",
    nameLetterSpacing: "0.06em",
  },
};

// ── Theme resolution (mirrors resolveTheme in templateUtils.js) ───────────────
const FONT_SIZES = {
  small:  { name: "18pt", heading: "12pt", body: "10pt", meta: "9pt"  },
  medium: { name: "20pt", heading: "14pt", body: "11pt", meta: "10pt" },
  large:  { name: "22pt", heading: "16pt", body: "13pt", meta: "11pt" },
};
const PAGE_PADDING = {
  narrow: "24pt 28pt",
  medium: "36pt 42pt",
  wide:   "48pt 56pt",
};
const LINE_HEIGHTS = {
  compact: { ltr: "1.20", rtl: "1.50" },
  normal:  { ltr: "1.40", rtl: "1.80" },
  relaxed: { ltr: "1.70", rtl: "2.10" },
};
const SECTION_MARGINS = {
  compact: "6pt",
  medium:  "14pt",
  relaxed: "22pt",
};

const ARABIC_FONTS = new Set(["Tajawal","Cairo","Amiri","Noto Naskh Arabic","Scheherazade New"]);
const LATIN_FONTS  = new Set(["Calibri","Arial","Georgia","Times New Roman","Verdana","Trebuchet MS","Inter","Merriweather","Outfit"]);

function resolveTheme(theme, isRTL) {
  const fsSz    = FONT_SIZES[theme?.fontSize || "medium"];
  const padding = PAGE_PADDING[theme?.pagePadding || "medium"];
  let   fontFam = theme?.fontFamily || (isRTL ? "Noto Naskh Arabic" : "Arial");

  if (isRTL  && LATIN_FONTS.has(fontFam))  fontFam = "Noto Naskh Arabic";
  if (!isRTL && ARABIC_FONTS.has(fontFam)) fontFam = "Arial";

  const lhKey = theme?.lineHeight || "normal";
  const lineH = LINE_HEIGHTS[lhKey]?.[isRTL ? "rtl" : "ltr"] ?? "1.4";
  const sectMt = SECTION_MARGINS[theme?.sectionSpacing || "medium"];

  return { fsSz, padding, fontFam, lineH, sectMt };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(v) {
  return v ? String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;") : "";
}

function dateRange(start, end, current, isRTL) {
  const present = isRTL ? "حتى الآن" : "Present";
  return [start, current ? present : end].filter(Boolean).join(" \u2013 ");
}

const SECTION_LABELS = {
  summary:       { en: "Professional Summary", ar: "الملخص المهني"         },
  experience:    { en: "Work Experience",      ar: "الخبرة العملية"        },
  education:     { en: "Education",            ar: "التعليم"               },
  skills:        { en: "Core Skills",          ar: "المهارات الأساسية"     },
  languages:     { en: "Languages",            ar: "اللغات"                },
  projects:      { en: "Projects",             ar: "المشاريع"              },
  certificates:  { en: "Certifications",       ar: "الشهادات والاعتمادات"   },
  interests:     { en: "Interests",            ar: "الاهتمامات"            },
  courses:       { en: "Courses & Training",   ar: "الدورات والتدريب"      },
  awards:        { en: "Awards & Honours",     ar: "الجوائز والتكريمات"    },
  organisations: { en: "Organisations",        ar: "المنظمات والجمعيات"    },
  publications:  { en: "Publications",         ar: "المنشورات والأبحاث"    },
  references:    { en: "References",           ar: "المراجع والتزكيات"     },
};

const CONTACT_LABELS = {
  email:     { en: "Email",    ar: "البريد الإلكتروني" },
  phone:     { en: "Phone",    ar: "الهاتف"            },
  location:  { en: "Location", ar: "الموقع"            },
  linkedin:  { en: "LinkedIn", ar: "LinkedIn"          },
  portfolio: { en: "Portfolio",ar: "Portfolio"         },
};

function secLabel(key, isRTL, sectionNames) {
  if (sectionNames?.[key]) return sectionNames[key].toUpperCase();
  return (SECTION_LABELS[key]?.[isRTL ? "ar" : "en"] ?? key).toUpperCase();
}

// ── Section heading renderers (one per sectionStyle) ─────────────────────────
function renderHeading(label, accent, sectionStyle, isRTL) {
  const a = esc(accent);
  const l = esc(label);

  switch (sectionStyle) {

    case "filled-bar":
      // ATSBold: filled accent rectangle, white ALL-CAPS text
      return `<div class="sec-filled" style="background:${a};">${l}</div>`;

    case "left-bar": {
      // ATSPro: 4px accent bar on the side + heading text + thin gray rule below
      return `
        <div class="sec-leftbar">
          <div class="sec-bar" style="background:${a};"></div>
          <div class="sec-text">${l}</div>
        </div>
        <div class="sec-rule-gray"></div>`;
    }

    case "accent-underline":
      // ATSModern: accent-colored text with 2px accent border-bottom
      return `<div class="sec-accent" style="color:${a};border-bottom:2px solid ${a};">${l}</div>`;

    case "lines-both-sides":
      // ATSCenter: ─── TEXT ───
      return `
        <div class="sec-center">
          <div class="sec-line" style="border-bottom:1.5px solid ${a};"></div>
          <div class="sec-text">${l}</div>
          <div class="sec-line" style="border-bottom:1.5px solid ${a};"></div>
        </div>`;

    case "rule-fill-right":
      // ATSSimple: TEXT [────────────────]
      return `
        <div class="sec-simplefill">
          <div class="sec-text">${l}</div>
          <div style="flex:1;border-bottom:2px solid ${a};"></div>
        </div>`;

    case "rule-above":
      // ATSHarvard: thin rule ABOVE, then heading text
      return `<div class="sec-default" style="border-top:1.5px solid ${a};padding-top:5pt;">${l}</div>`;

    case "rule-below-centered":
      // ATSElegant: centered heading + rule below
      return `
        <div class="sec-default" style="text-align:center;">${l}</div>
        <div class="sec-rule-below" style="border-bottom:1.5px solid ${a};"></div>`;

    case "rule-below":
    default:
      // ATSClean, ATSCompact, default
      return `
        <div class="sec-default">${l}</div>
        <div class="sec-rule-below" style="border-bottom:1.5px solid ${a};"></div>`;
  }
}

// ── Skills / Languages renderers (one per skillsStyle) ───────────────────────
function renderSkillsHtml(items, skillsStyle, accent, fsSz) {
  if (!items?.length) return "";
  const a   = esc(accent);
  const aL  = esc(accent + "18");

  switch (skillsStyle) {
    case "bullet-grid":
      // ATSBold: ▪ accent bullet + skill name, flex-wrap grid
      return `<div class="skills-grid">${
        items.map(sk => {
          const n = esc(typeof sk === "string" ? sk : (sk.name || sk));
          return n ? `<div class="skill-bullet"><span class="bullet-sym" style="color:${a};">&#9642;</span><span>${n}</span></div>` : "";
        }).filter(Boolean).join("")
      }</div>`;

    case "pills":
      // ATSPro: inline pills with accent-light background
      return `<div class="skills-pills">${
        items.map(sk => {
          const n = esc(typeof sk === "string" ? sk : (sk.name || sk));
          return n ? `<span class="skill-pill" style="background:${aL};border-color:${a}30;">${n}</span>` : "";
        }).filter(Boolean).join("")
      }</div>`;

    case "grid3":
      // ATSModern: 3-column grid with accent dot
      return `<div class="skills-grid3">${
        items.map(sk => {
          const n = esc(typeof sk === "string" ? sk : (sk.name || sk));
          return n ? `<div class="skill-col3"><span class="skill-dot" style="background:${a};"></span><span>${n}</span></div>` : "";
        }).filter(Boolean).join("")
      }</div>`;

    default:
      // dot-separated plain text
      return `<div class="body-text skills-text">${
        items.map(sk => esc(typeof sk === "string" ? sk : (sk.name || sk))).filter(Boolean).join("  \u00b7  ")
      }</div>`;
  }
}

function renderLangHtml(items, skillsStyle, accent, fsSz) {
  if (!items?.length) return "";
  const a   = esc(accent);
  const aL  = esc(accent + "18");

  switch (skillsStyle) {
    case "bullet-grid":
      return `<div class="skills-grid">${
        items.filter(l => l.name).map(l => {
          const n = esc(`${l.name} \u2014 ${l.level}`);
          return `<div class="skill-bullet"><span class="bullet-sym" style="color:${a};">&#9642;</span><span>${n}</span></div>`;
        }).join("")
      }</div>`;

    case "pills":
      return `<div class="skills-pills">${
        items.filter(l => l.name).map(l => {
          const n = esc(`${l.name} \u2014 ${l.level}`);
          return `<span class="skill-pill" style="background:${aL};border-color:${a}30;">${n}</span>`;
        }).join("")
      }</div>`;

    case "grid3":
      return `<div class="skills-grid3">${
        items.filter(l => l.name).map(l => {
          const n = esc(`${l.name} (${l.level})`);
          return `<div class="skill-col3"><span class="skill-dot" style="background:${a};"></span><span>${n}</span></div>`;
        }).join("")
      }</div>`;

    default:
      return `<div class="body-text skills-text">${
        items.filter(l => l.name).map(l => esc(`${l.name} (${l.level})`)).join("  \u00b7  ")
      }</div>`;
  }
}

// ── Contact line ──────────────────────────────────────────────────────────────
function buildContactLine(pi, visiblePersonalFields, isRTL) {
  const L = (k) => CONTACT_LABELS[k]?.[isRTL ? "ar" : "en"] ?? k;
  const vpf = visiblePersonalFields || {};
  const parts = [];
  if (vpf.email     !== false && pi.email)     parts.push(`${L("email")}: ${esc(pi.email)}`);
  if (vpf.phone     !== false && pi.phone)     parts.push(`${L("phone")}: ${esc(pi.phone)}`);
  if (vpf.location  !== false && pi.location)  parts.push(`${L("location")}: ${esc(pi.location)}`);
  if (vpf.linkedin  !== false && pi.linkedin)  parts.push(`${L("linkedin")}: ${esc(pi.linkedin)}`);
  if (vpf.portfolio !== false && pi.portfolio) parts.push(`${L("portfolio")}: ${esc(pi.portfolio)}`);
  return parts.join("   |   ");
}

// ── Section renderer ──────────────────────────────────────────────────────────
function renderSections(cvData, opts, accent, variant) {
  const { isRTL, visibleSections, sectionOrder, sectionNames, fsSz } = opts;
  const { sectionStyle, skillsStyle, subTextColor, subTextWeight, subTextItalic, datePill } = variant;
  const show  = (k) => visibleSections[k] !== false;
  const pi    = cvData?.personalInfo ?? {};
  const parts = [];

  const a  = esc(accent);
  const aL = esc(accent + "18");

  const subColor  = (subTextColor === "accent") ? accent : "#444444";
  const subWeight = subTextWeight || "400";
  const subItalic = subTextItalic === false ? "normal" : "italic";

  const dateHtml = (str) => {
    if (!str) return "";
    if (datePill) {
      return `<span class="date-pill" style="background:${aL};">${esc(str)}</span>`;
    }
    return `<span class="date-text">${esc(str)}</span>`;
  };

  const heading = (label) => renderHeading(label, accent, sectionStyle, isRTL);

  const section = (key, html) => {
    if (!show(key)) return;
    parts.push(`<section class="cv-section">${heading(secLabel(key, isRTL, sectionNames))}${html}</section>`);
  };

  for (const key of (sectionOrder || [])) {
    switch (key) {

      case "summary":
        if (!pi.summary) break;
        section("summary", `<div class="body-text">${esc(pi.summary)}</div>`);
        break;

      case "experience":
        if (!cvData.experience?.length) break;
        section("experience", cvData.experience.map((e) => `
          <div class="item">
            <div class="role-row">
              <span class="role-title">${esc(e.jobTitle)}</span>
              ${dateHtml(dateRange(e.startDate, e.endDate, e.current, isRTL))}
            </div>
            ${(e.company || e.location) ? `<div class="sub-text" style="color:${esc(subColor)};font-style:${subItalic};font-weight:${subWeight};">${esc([e.company, e.location].filter(Boolean).join(" \u00b7 "))}</div>` : ""}
            ${e.description ? `<div class="body-text">${esc(e.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "education":
        if (!cvData.education?.length) break;
        section("education", cvData.education.map((e) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(e.degree)}</span>
              ${dateHtml(dateRange(e.startDate, e.endDate, false, isRTL))}
            </div>
            ${e.institution ? `<div class="sub-text" style="color:${esc(subColor)};font-style:${subItalic};font-weight:${subWeight};">${esc(e.institution)}</div>` : ""}
            ${e.description ? `<div class="body-text">${esc(e.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "skills":
        if (!cvData.skills?.length) break;
        section("skills", renderSkillsHtml(cvData.skills, skillsStyle, accent, fsSz));
        break;

      case "languages":
        if (!cvData.languages?.length) break;
        section("languages", renderLangHtml(cvData.languages, skillsStyle, accent, fsSz));
        break;

      case "projects":
        if (!cvData.projects?.length) break;
        section("projects", cvData.projects.map((p) => `
          <div class="item-sm">
            <div class="role-title">${esc(p.title)}</div>
            ${p.link ? `<div class="sub-text" style="color:${esc(subColor)};font-style:${subItalic};">${esc(p.link)}</div>` : ""}
            ${p.description ? `<div class="body-text">${esc(p.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "certificates":
        if (!cvData.certificates?.length) break;
        section("certificates", cvData.certificates.map((c) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(c.name)}</span>
              ${dateHtml(c.date)}
            </div>
            ${c.issuer ? `<div class="sub-text" style="color:${esc(subColor)};font-style:${subItalic};">${esc(c.issuer)}</div>` : ""}
            ${c.description ? `<div class="body-text">${esc(c.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "interests":
        if (!cvData.interests?.length) break;
        section("interests", `<div class="tags-row">${
          cvData.interests.map((i) => {
            const name = esc(typeof i === "string" ? i : i.name);
            return name ? `<span class="tag" style="border-color:${a};">${name}</span>` : "";
          }).filter(Boolean).join("")
        }</div>`);
        break;

      case "courses":
        if (!cvData.courses?.length) break;
        section("courses", cvData.courses.map((c) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(c.name)}</span>
              ${dateHtml(c.date)}
            </div>
            ${c.institution ? `<div class="sub-text" style="color:${esc(subColor)};font-style:${subItalic};">${esc(c.institution)}</div>` : ""}
          </div>`).join(""));
        break;

      case "awards":
        if (!cvData.awards?.length) break;
        section("awards", cvData.awards.map((awd) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(awd.title)}</span>
              ${dateHtml(awd.date)}
            </div>
            ${awd.issuer ? `<div class="sub-text" style="color:${esc(subColor)};font-style:${subItalic};">${esc(awd.issuer)}</div>` : ""}
            ${awd.description ? `<div class="body-text">${esc(awd.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "organisations":
        if (!cvData.organisations?.length) break;
        section("organisations", cvData.organisations.map((o) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(o.name)}</span>
              ${dateHtml(o.date)}
            </div>
            ${o.role ? `<div class="sub-text" style="color:${esc(subColor)};font-style:${subItalic};">${esc(o.role)}</div>` : ""}
          </div>`).join(""));
        break;

      case "publications":
        if (!cvData.publications?.length) break;
        section("publications", cvData.publications.map((p) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(p.title)}</span>
              ${dateHtml(p.date)}
            </div>
            ${p.publisher ? `<div class="sub-text" style="color:${esc(subColor)};font-style:${subItalic};">${esc(p.publisher)}</div>` : ""}
            ${p.description ? `<div class="body-text">${esc(p.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "references":
        if (!cvData.references?.length) break;
        section("references", cvData.references.map((r) => `
          <div class="item-sm">
            <div class="role-title">${esc(r.name)}</div>
            ${(r.title || r.company) ? `<div class="sub-text" style="color:${esc(subColor)};font-style:${subItalic};">${esc([r.title, r.company].filter(Boolean).join(" \u2014 "))}</div>` : ""}
            ${(r.email || r.phone) ? `<div class="sub-text">${esc([r.email, r.phone].filter(Boolean).join("  |  "))}</div>` : ""}
          </div>`).join(""));
        break;

      default:
        if (key.startsWith("csec-") && cvData.customSections) {
          const sec = cvData.customSections.find((s) => s.id === key);
          if (!sec?.items?.length || !show(key)) break;
          parts.push(`<section class="cv-section">
            ${heading((sec.title || key).toUpperCase())}
            ${sec.items.map((item) => `
              <div class="item-sm">
                ${item.title    ? `<div class="role-title">${esc(item.title)}</div>` : ""}
                ${item.subtitle ? `<div class="sub-text" style="color:${esc(subColor)};font-style:${subItalic};">${esc(item.subtitle)}</div>` : ""}
                ${item.description ? `<div class="body-text">${esc(item.description)}</div>` : ""}
              </div>`).join("")}
          </section>`);
        }
        break;
    }
  }

  return parts.join("\n");
}

// ── Generate header CSS block per headerStyle ─────────────────────────────────
function buildHeaderCSS(headerStyle, accent, resolvedHeaderAlign, isRTL) {
  const a  = esc(accent);
  const aL = esc(accent + "18");
  const side    = isRTL ? "right" : "left";
  const oppSide = isRTL ? "left"  : "right";

  switch (headerStyle) {
    case "solid-bottom":
      // ATSClean, ATSCenter: the border sits on .cv-contact (not the wrapper)
      return `
        .header    { text-align: ${resolvedHeaderAlign}; margin-bottom: 0; }
        .cv-contact { padding-bottom: 10pt; margin-bottom: 10pt; border-bottom: 2px solid ${a}; }`;

    case "double-bottom":
      // ATSSimple, ATSElegant: double accent line below the whole header block
      return `
        .header { text-align: ${resolvedHeaderAlign}; border-bottom: 3px double ${a}; padding-bottom: 10pt; margin-bottom: 12pt; }`;

    case "thin-gray-bottom":
      // ATSBold, ATSCompact: thin gray line below the whole header block
      return `
        .header { text-align: ${resolvedHeaderAlign}; border-bottom: 1px solid #dddddd; padding-bottom: 10pt; margin-bottom: 12pt; }`;

    case "left-bar-bg":
      // ATSPro: accent-tinted background + thick colored side border + inner padding
      return `
        .header {
          text-align: ${resolvedHeaderAlign};
          background: ${aL};
          border-${side}: 5px solid ${a};
          border-${oppSide}: none;
          padding: 14pt 16pt;
          margin-bottom: 14pt;
        }`;

    case "filled-stripe":
      // ATSModern: full-width stripe — handled via special HTML structure, no extra .header CSS
      return `
        .header { }`;

    case "none":
    default:
      // ATSHarvard: no decorative border
      return `
        .header { text-align: ${resolvedHeaderAlign}; margin-bottom: 8pt; }`;
  }
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Build a complete HTML document for an ATS template.
 *
 * @param {object} cvData
 * @param {object} options
 *   - templateId            : 'atsclean' | 'atspro' | … (normalized, lowercase)
 *   - isRTL                 : boolean
 *   - theme                 : { primaryColor, fontSize, fontFamily, pagePadding, lineHeight, sectionSpacing }
 *   - visibleSections       : {}
 *   - visiblePersonalFields : {}
 *   - sectionOrder          : string[]
 *   - sectionNames          : {}
 * @returns {Promise<string>} Full HTML document
 */
export async function buildAtsHtml(cvData, options = {}) {
  const {
    templateId            = "atsclean",
    isRTL                 = false,
    theme                 = {},
    visibleSections       = {},
    visiblePersonalFields = {},
    sectionOrder          = ["summary","experience","education","skills","projects","languages"],
    sectionNames          = {},
  } = options;

  const tid     = normalizeId(templateId);
  const variant = TEMPLATE_VARIANTS[tid] || TEMPLATE_VARIANTS.atsclean;
  const accent  = theme.primaryColor || variant.accentDefault;
  const { fsSz, padding, fontFam, lineH, sectMt } = resolveTheme(theme, isRTL);

  const {
    headerStyle, sectionStyle,
    nameColor, titleColor, contactColor,
    headerAlign, titleFontSize, titleWeight,
    nameUppercase, nameWeight, nameLetterSpacing,
  } = variant;

  // Resolve alignments for RTL
  const resolvedHeaderAlign = (headerAlign === "center") ? "center" : (isRTL ? "right" : "left");
  const resolvedHeadAlign   = (sectionStyle === "lines-both-sides") ? "center" : (isRTL ? "right" : "left");

  // Resolve colors ("accent" sentinel → use accent value)
  const resolvedNameColor    = (nameColor === "accent")  ? accent : (nameColor  || "#0d0d0d");
  const resolvedTitleColor   = (titleColor === "accent") ? accent : (titleColor || accent);
  const resolvedContactColor = contactColor || "#444444";

  // ── Font embedding ────────────────────────────────────────────────────────
  let fontFaceBlock = "";

  if (isRTL) {
    const b64 = await fetchArabicFontBase64();
    if (b64) {
      fontFaceBlock = `
    @font-face { font-family:'Noto Naskh Arabic'; font-style:normal; font-weight:400; font-display:block; src:url('data:font/ttf;base64,${b64}') format('truetype'); }
    @font-face { font-family:'Noto Naskh Arabic'; font-style:normal; font-weight:600; font-display:block; src:url('data:font/ttf;base64,${b64}') format('truetype'); }
    @font-face { font-family:'Noto Naskh Arabic'; font-style:normal; font-weight:700; font-display:block; src:url('data:font/ttf;base64,${b64}') format('truetype'); }`;
    }
  } else {
    loadLatinFonts();
    if (_latinFontRegularB64) {
      const boldB64 = _latinFontBoldB64 || _latinFontRegularB64;
      fontFaceBlock = `
    @font-face { font-family:'CVFont'; font-style:normal; font-weight:400; font-display:block; src:url('data:font/ttf;base64,${_latinFontRegularB64}') format('truetype'); }
    @font-face { font-family:'CVFont'; font-style:normal; font-weight:600; font-display:block; src:url('data:font/ttf;base64,${boldB64}') format('truetype'); }
    @font-face { font-family:'CVFont'; font-style:normal; font-weight:700; font-display:block; src:url('data:font/ttf;base64,${boldB64}') format('truetype'); }
    @font-face { font-family:'CVFont'; font-style:normal; font-weight:800; font-display:block; src:url('data:font/ttf;base64,${boldB64}') format('truetype'); }`;
    }
  }

  const effectiveFontFamily = isRTL
    ? `'Noto Naskh Arabic', sans-serif`
    : (_latinFontRegularB64 ? `'CVFont', 'DejaVu Sans', sans-serif` : `'${fontFam}', sans-serif`);

  // ── Content ───────────────────────────────────────────────────────────────
  const pi          = cvData?.personalInfo ?? {};
  const contactLine = buildContactLine(pi, visiblePersonalFields, isRTL);
  const sectionsHtml = renderSections(cvData, {
    isRTL, visibleSections, visiblePersonalFields, sectionOrder, sectionNames, fsSz,
  }, accent, variant);

  const dir = isRTL ? "rtl" : "ltr";
  const a   = esc(accent);
  const aL  = esc(accent + "18");

  // ── ATSModern: full-bleed stripe needs special HTML structure ─────────────
  const isModern = headerStyle === "filled-stripe";
  const paddingParts = padding.split(" ");
  const paddingH = paddingParts[1] || paddingParts[0]; // horizontal padding value
  const paddingV = paddingParts[0];                    // vertical padding value

  const headerHtml = isModern
    ? `<div class="header" style="background:${a};padding:22pt ${esc(paddingH)} 18pt;text-align:${esc(resolvedHeaderAlign)};">
        ${pi.fullName ? `<div class="cv-name">${esc(pi.fullName)}</div>` : ""}
        ${pi.jobTitle ? `<div class="cv-title">${esc(pi.jobTitle)}</div>` : ""}
        ${contactLine ? `<div class="cv-contact">${contactLine}</div>` : ""}
      </div>
      <div class="cv-body" style="padding:14pt ${esc(paddingH)} ${esc(paddingV)};">`
    : `<div class="header">
        ${pi.fullName ? `<div class="cv-name">${esc(pi.fullName)}</div>` : ""}
        ${pi.jobTitle ? `<div class="cv-title">${esc(pi.jobTitle)}</div>` : ""}
        ${contactLine ? `<div class="cv-contact">${contactLine}</div>` : ""}
      </div>`;

  const footerHtml = isModern ? `</div>` : ``;

  const hdrCSS = buildHeaderCSS(headerStyle, accent, resolvedHeaderAlign, isRTL);

  return `<!DOCTYPE html>
<html lang="${isRTL ? "ar" : "en"}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <style>
    ${fontFaceBlock}

    @page { size: A4; margin: 0; }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body { width: 210mm; background: #ffffff; }

    body {
      font-family: ${effectiveFontFamily};
      font-size: ${fsSz.body};
      color: #111111;
      line-height: ${lineH};
      direction: ${dir};
    }

    .cv-page {
      width: 210mm;
      min-height: 297mm;
      padding: ${isModern ? "0" : padding};
      background: #ffffff;
    }

    /* ── Header (template-specific via hdrCSS) ── */
    ${hdrCSS}

    .cv-name {
      font-size: ${fsSz.name};
      font-weight: ${nameWeight || "800"};
      color: ${esc(resolvedNameColor)};
      letter-spacing: ${nameLetterSpacing || "-0.01em"};
      line-height: 1.1;
      margin-bottom: 2pt;
      ${nameUppercase ? "text-transform: uppercase;" : ""}
    }

    .cv-title {
      font-size: ${titleFontSize || "11pt"};
      font-weight: ${titleWeight || "600"};
      color: ${esc(resolvedTitleColor)};
      margin-bottom: 6pt;
    }

    .cv-contact {
      font-size: ${fsSz.meta};
      color: ${esc(resolvedContactColor)};
    }

    /* ── Sections ── */
    .cv-section { margin-top: ${sectMt}; break-inside: avoid; }

    /* ── Shared heading base classes ── */

    /* rule-below / rule-above / rule-below-centered (ATSClean, ATSCompact, ATSHarvard, ATSElegant) */
    .sec-default {
      font-size: ${fsSz.heading};
      font-weight: 800;
      color: #0d0d0d;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-align: ${resolvedHeadAlign};
      margin-bottom: 3pt;
      break-after: avoid;
    }

    .sec-rule-below { margin-bottom: 7pt; }

    /* ATSBold: filled accent bar with white text */
    .sec-filled {
      font-size: ${fsSz.heading};
      font-weight: 800;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding: 3pt 8pt;
      margin-bottom: 8pt;
      break-after: avoid;
      text-align: ${resolvedHeadAlign};
    }

    /* ATSPro: side bar + heading text */
    .sec-leftbar {
      display: flex;
      align-items: center;
      gap: 8pt;
      margin-bottom: 2pt;
      break-after: avoid;
      flex-direction: ${isRTL ? "row-reverse" : "row"};
    }

    .sec-bar {
      width: 4px;
      height: 16px;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .sec-rule-gray {
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 8pt;
    }

    /* ATSModern: accent text + accent underline (color applied inline) */
    .sec-accent {
      font-size: ${fsSz.heading};
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      padding-bottom: 3pt;
      margin-bottom: 7pt;
      break-after: avoid;
      text-align: ${resolvedHeadAlign};
    }

    /* ATSCenter: ─── TEXT ─── */
    .sec-center {
      display: flex;
      align-items: center;
      gap: 8pt;
      margin-bottom: 7pt;
      break-after: avoid;
    }

    /* ATSSimple: TEXT ──────── */
    .sec-simplefill {
      display: flex;
      align-items: center;
      gap: 8pt;
      margin-bottom: 7pt;
      break-after: avoid;
      flex-direction: ${isRTL ? "row-reverse" : "row"};
    }

    /* Shared: the text node inside leftbar / center / simplefill */
    .sec-text {
      font-size: ${fsSz.heading};
      font-weight: 800;
      color: #0d0d0d;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      white-space: nowrap;
      break-after: avoid;
    }

    /* The accent line segments (border set inline) */
    .sec-line { }

    /* ── Content items ── */
    .item    { margin-bottom: 10pt; break-inside: avoid; }
    .item-sm { margin-bottom: 7pt;  break-inside: avoid; }

    .role-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12pt;
      margin-bottom: 1pt;
      flex-direction: ${isRTL ? "row-reverse" : "row"};
    }

    .role-title {
      font-size: ${fsSz.body};
      font-weight: 700;
      color: #111111;
      flex: 1;
      min-width: 0;
    }

    .date-text {
      font-size: ${fsSz.meta};
      color: #555555;
      white-space: nowrap;
      flex-shrink: 0;
      font-weight: 500;
      font-style: italic;
    }

    /* ATSPro: date in accent-light pill */
    .date-pill {
      font-size: ${fsSz.meta};
      color: #333333;
      white-space: nowrap;
      flex-shrink: 0;
      font-weight: 500;
      padding: 1pt 5pt;
      border-radius: 2pt;
    }

    /* sub-text: color/style/weight set inline per template */
    .sub-text {
      font-size: ${fsSz.meta};
      margin-bottom: 2pt;
    }

    .body-text {
      font-size: ${fsSz.body};
      color: #222222;
      white-space: pre-line;
    }

    .skills-text { line-height: 1.7; }

    /* ── ATSBold bullet grid ── */
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 4pt 16pt;
    }

    .skill-bullet {
      display: flex;
      align-items: center;
      gap: 5pt;
      min-width: 180pt;
      font-size: ${fsSz.body};
      color: #111111;
    }

    .bullet-sym {
      font-weight: 900;
      font-size: 10pt;
      line-height: 1;
      flex-shrink: 0;
    }

    /* ── ATSPro skill pills ── */
    .skills-pills { display: flex; flex-wrap: wrap; }

    .skill-pill {
      display: inline-block;
      color: #222222;
      border: 1px solid;
      border-radius: 3pt;
      padding: 2pt 7pt;
      font-size: ${fsSz.meta};
      font-weight: 500;
      margin-right: 4pt;
      margin-bottom: 4pt;
    }

    /* ── ATSModern 3-col grid ── */
    .skills-grid3 { display: flex; flex-wrap: wrap; }

    .skill-col3 {
      width: 33.33%;
      font-size: ${fsSz.body};
      color: #222222;
      display: flex;
      align-items: center;
      gap: 5pt;
      padding-${isRTL ? "left" : "right"}: 8pt;
      margin-bottom: 3pt;
    }

    .skill-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      flex-shrink: 0;
      display: inline-block;
    }

    /* ── Interests tag chips ── */
    .tags-row { display: flex; flex-wrap: wrap; gap: 4pt; }

    .tag {
      display: inline-block;
      border: 1px solid;
      color: #333333;
      border-radius: 2pt;
      padding: 1pt 5pt;
      font-size: ${fsSz.meta};
    }
  </style>
</head>
<body>
  <div class="cv-page">
    ${headerHtml}
    ${sectionsHtml}
    ${footerHtml}
  </div>
</body>
</html>`;
}
