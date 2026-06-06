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
 */

import { readFileSync } from "fs";

// ── Font cache ─────────────────────────────────────────────────────────────────
let _arabicFontB64 = null;
let _arabicFontFetching = false;
let _arabicFontWaiters = [];

// Latin font (DejaVu Sans) — read once from the Nix system at startup so
// Chromium always has a real embedded font (Type2/CIDFont) instead of
// converting glyphs to bezier paths (Type3), which makes text unselectable.
let _latinFontRegularB64 = null;
let _latinFontBoldB64    = null;

function loadLatinFonts() {
  if (_latinFontRegularB64) return; // already loaded
  try {
    _latinFontRegularB64 = readFileSync(
      "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    ).toString("base64");
    _latinFontBoldB64 = readFileSync(
      "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    ).toString("base64");
  } catch (e) {
    console.warn("[atsHtmlTemplate] Latin font load failed:", e.message);
  }
}

async function fetchArabicFontBase64() {
  // Return cached
  if (_arabicFontB64) return _arabicFontB64;

  // Coalesce concurrent callers
  if (_arabicFontFetching) {
    return new Promise((res) => _arabicFontWaiters.push(res));
  }
  _arabicFontFetching = true;

  try {
    const cssUrl =
      "https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;600;700&display=swap";
    const cssRes = await fetch(cssUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) Chrome/120" },
    });
    if (!cssRes.ok) throw new Error(`CSS fetch failed: ${cssRes.status}`);
    const css = await cssRes.text();

    const match = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/);
    if (!match) throw new Error("Font URL not found in CSS");

    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) throw new Error(`Font file fetch failed: ${fontRes.status}`);
    const buf = await fontRes.arrayBuffer();
    _arabicFontB64 = Buffer.from(buf).toString("base64");
  } catch (e) {
    console.warn("[atsHtmlTemplate] Arabic font fetch failed:", e.message);
    _arabicFontB64 = null;
  } finally {
    _arabicFontFetching = false;
    const waiters = _arabicFontWaiters.splice(0);
    waiters.forEach((r) => r(_arabicFontB64));
  }
  return _arabicFontB64;
}

// ── Per-template variant config ───────────────────────────────────────────────
function normalizeId(id) {
  return (id || "").toLowerCase().replace(/[\s\-_]/g, "");
}

const TEMPLATE_VARIANTS = {
  atsclean:   { headerAlign: "left",   accentDefault: "#1a56a0", rulerPos: "bottom" },
  atspro:     { headerAlign: "left",   accentDefault: "#1e293b", rulerPos: "bottom" },
  atssimple:  { headerAlign: "left",   accentDefault: "#374151", rulerPos: "bottom" },
  atsbold:    { headerAlign: "left",   accentDefault: "#111827", rulerPos: "bottom", bigName: true },
  atscompact: { headerAlign: "left",   accentDefault: "#2563eb", rulerPos: "bottom", compact: true },
  atsmodern:  { headerAlign: "left",   accentDefault: "#7c3aed", rulerPos: "bottom" },
  atsharvard: { headerAlign: "center", accentDefault: "#8b0000", rulerPos: "top"    },
  atscenter:  { headerAlign: "center", accentDefault: "#1a56a0", rulerPos: "bottom" },
  atselegant: { headerAlign: "left",   accentDefault: "#1a3a5c", rulerPos: "bottom" },
};

// ── Theme resolution (mirrors resolveTheme in templateUtils.js) ───────────────
const FONT_SIZES = {
  small:  { name: "18pt", heading: "10.5pt", body: "9.5pt",  meta: "8.5pt"  },
  medium: { name: "20pt", heading: "11pt",   body: "10.5pt", meta: "9.5pt"  },
  large:  { name: "22pt", heading: "12pt",   body: "11.5pt", meta: "10.5pt" },
};
const PAGE_PADDING = {
  narrow: "18mm 20mm",
  medium: "15mm 18mm",
  wide:   "20mm 25mm",
};
const LINE_HEIGHTS = {
  compact: { ltr: "1.25", rtl: "1.55" },
  normal:  { ltr: "1.40", rtl: "1.75" },
  relaxed: { ltr: "1.65", rtl: "2.00" },
};
const SECTION_MARGINS = {
  compact: "8pt",
  medium:  "14pt",
  relaxed: "20pt",
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
  return [start, current ? present : end].filter(Boolean).join(" – ");
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

// ── HTML section renderers ────────────────────────────────────────────────────
function renderHeading(label, accent, rulerPos) {
  const borderStyle = `2px solid ${esc(accent)}`;
  if (rulerPos === "top") {
    return `
      <div class="section-heading" style="border-top:${borderStyle};padding-top:5pt;">${esc(label)}</div>`;
  }
  return `
      <div class="section-heading">${esc(label)}</div>
      <div class="section-rule" style="border-bottom:${borderStyle};"></div>`;
}

function renderSections(cvData, opts, accent, rulerPos) {
  const { isRTL, visibleSections, visiblePersonalFields, sectionOrder, sectionNames } = opts;
  const show = (k) => visibleSections[k] !== false;
  const pi   = cvData?.personalInfo ?? {};
  const parts = [];

  const section = (key, html) => {
    if (!show(key)) return;
    parts.push(`<section class="cv-section">${renderHeading(secLabel(key, isRTL, sectionNames), accent, rulerPos)}${html}</section>`);
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
              <span class="date-text">${esc(dateRange(e.startDate, e.endDate, e.current, isRTL))}</span>
            </div>
            ${(e.company || e.location) ? `<div class="sub-text">${esc([e.company, e.location].filter(Boolean).join(" · "))}</div>` : ""}
            ${e.description ? `<div class="body-text">${esc(e.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "education":
        if (!cvData.education?.length) break;
        section("education", cvData.education.map((e) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(e.degree)}</span>
              <span class="date-text">${esc(dateRange(e.startDate, e.endDate, false, isRTL))}</span>
            </div>
            ${e.institution ? `<div class="sub-text">${esc(e.institution)}</div>` : ""}
            ${e.description ? `<div class="body-text">${esc(e.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "skills":
        if (!cvData.skills?.length) break;
        section("skills", `<div class="body-text skills-text">${
          cvData.skills.map((sk) => esc(sk.name || sk)).filter(Boolean).join("  ·  ")
        }</div>`);
        break;

      case "languages":
        if (!cvData.languages?.length) break;
        section("languages", `<div class="body-text skills-text">${
          cvData.languages.map((l) => `${esc(l.name)} (${esc(l.level)})`).filter((s) => s !== " ()").join("  ·  ")
        }</div>`);
        break;

      case "projects":
        if (!cvData.projects?.length) break;
        section("projects", cvData.projects.map((p) => `
          <div class="item-sm">
            <div class="role-title">${esc(p.title)}</div>
            ${p.link ? `<div class="sub-text">${esc(p.link)}</div>` : ""}
            ${p.description ? `<div class="body-text">${esc(p.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "certificates":
        if (!cvData.certificates?.length) break;
        section("certificates", cvData.certificates.map((c) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(c.name)}</span>
              ${c.date ? `<span class="date-text">${esc(c.date)}</span>` : ""}
            </div>
            ${c.issuer ? `<div class="sub-text">${esc(c.issuer)}</div>` : ""}
            ${c.description ? `<div class="body-text">${esc(c.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "interests":
        if (!cvData.interests?.length) break;
        section("interests", `<div class="body-text skills-text">${
          cvData.interests.map((i) => esc(typeof i === "string" ? i : i.name)).filter(Boolean).join("  ·  ")
        }</div>`);
        break;

      case "courses":
        if (!cvData.courses?.length) break;
        section("courses", cvData.courses.map((c) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(c.name)}</span>
              ${c.date ? `<span class="date-text">${esc(c.date)}</span>` : ""}
            </div>
            ${c.institution ? `<div class="sub-text">${esc(c.institution)}</div>` : ""}
          </div>`).join(""));
        break;

      case "awards":
        if (!cvData.awards?.length) break;
        section("awards", cvData.awards.map((a) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(a.title)}</span>
              ${a.date ? `<span class="date-text">${esc(a.date)}</span>` : ""}
            </div>
            ${a.issuer ? `<div class="sub-text">${esc(a.issuer)}</div>` : ""}
            ${a.description ? `<div class="body-text">${esc(a.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "organisations":
        if (!cvData.organisations?.length) break;
        section("organisations", cvData.organisations.map((o) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(o.name)}</span>
              ${o.date ? `<span class="date-text">${esc(o.date)}</span>` : ""}
            </div>
            ${o.role ? `<div class="sub-text">${esc(o.role)}</div>` : ""}
          </div>`).join(""));
        break;

      case "publications":
        if (!cvData.publications?.length) break;
        section("publications", cvData.publications.map((p) => `
          <div class="item-sm">
            <div class="role-row">
              <span class="role-title">${esc(p.title)}</span>
              ${p.date ? `<span class="date-text">${esc(p.date)}</span>` : ""}
            </div>
            ${p.publisher ? `<div class="sub-text">${esc(p.publisher)}</div>` : ""}
            ${p.description ? `<div class="body-text">${esc(p.description)}</div>` : ""}
          </div>`).join(""));
        break;

      case "references":
        if (!cvData.references?.length) break;
        section("references", cvData.references.map((r) => `
          <div class="item-sm">
            <div class="role-title">${esc(r.name)}</div>
            ${(r.title || r.company) ? `<div class="sub-text">${esc([r.title, r.company].filter(Boolean).join(" — "))}</div>` : ""}
            ${(r.email || r.phone) ? `<div class="sub-text">${esc([r.email, r.phone].filter(Boolean).join("  |  "))}</div>` : ""}
          </div>`).join(""));
        break;

      default:
        if (key.startsWith("csec-") && cvData.customSections) {
          const sec = cvData.customSections.find((s) => s.id === key);
          if (!sec?.items?.length) break;
          if (!show(key)) break;
          parts.push(`<section class="cv-section">
            ${renderHeading((sec.title || key).toUpperCase(), accent, rulerPos)}
            ${sec.items.map((item) => `
              <div class="item-sm">
                ${item.title    ? `<div class="role-title">${esc(item.title)}</div>` : ""}
                ${item.subtitle ? `<div class="sub-text">${esc(item.subtitle)}</div>` : ""}
                ${item.description ? `<div class="body-text">${esc(item.description)}</div>` : ""}
              </div>`).join("")}
          </section>`);
        }
        break;
    }
  }

  return parts.join("\n");
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

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Build a complete HTML document for an ATS template.
 *
 * @param {object} cvData
 * @param {object} options
 *   - templateId    : 'atsclean' | 'atspro' | … (normalized, lowercase)
 *   - isRTL         : boolean
 *   - theme         : { primaryColor, fontSize, fontFamily, pagePadding, lineHeight, sectionSpacing }
 *   - visibleSections : {}
 *   - visiblePersonalFields : {}
 *   - sectionOrder  : string[]
 *   - sectionNames  : {}
 * @returns {Promise<string>} Full HTML document
 */
export async function buildAtsHtml(cvData, options = {}) {
  const {
    templateId          = "atsclean",
    isRTL               = false,
    theme               = {},
    visibleSections     = {},
    visiblePersonalFields = {},
    sectionOrder        = ["summary","experience","education","skills","projects","languages"],
    sectionNames        = {},
  } = options;

  const tid     = normalizeId(templateId);
  const variant = TEMPLATE_VARIANTS[tid] || TEMPLATE_VARIANTS.atsclean;
  const accent  = theme.primaryColor || variant.accentDefault;
  const { fsSz, padding, fontFam, lineH, sectMt } = resolveTheme(theme, isRTL);
  const { headerAlign, rulerPos } = variant;

  // Resolve header/heading alignment for RTL
  const resolvedHeaderAlign = (isRTL && headerAlign === "left") ? "right" : headerAlign;
  const resolvedHeadAlign   = isRTL ? "right" : "left";

  // Font embedding — always embed a real font so Chromium outputs Type2/CIDFont
  // in the PDF (selectable text) instead of converting glyphs to bezier paths
  // (Type3, which looks identical but cannot be selected or copied).
  let fontFaceBlock = "";

  if (isRTL) {
    const b64 = await fetchArabicFontBase64();
    if (b64) {
      fontFaceBlock = `
    @font-face {
      font-family: 'Noto Naskh Arabic';
      font-style: normal;
      font-weight: 400;
      font-display: block;
      src: url('data:font/ttf;base64,${b64}') format('truetype');
    }
    @font-face {
      font-family: 'Noto Naskh Arabic';
      font-style: normal;
      font-weight: 600;
      font-display: block;
      src: url('data:font/ttf;base64,${b64}') format('truetype');
    }
    @font-face {
      font-family: 'Noto Naskh Arabic';
      font-style: normal;
      font-weight: 700;
      font-display: block;
      src: url('data:font/ttf;base64,${b64}') format('truetype');
    }`;
    }
  } else {
    // Latin — embed DejaVu Sans (always present on Nix) as a real TTF so
    // Chromium/Puppeteer writes proper embedded text to the PDF.
    loadLatinFonts();
    if (_latinFontRegularB64) {
      fontFaceBlock = `
    @font-face {
      font-family: 'CVFont';
      font-style: normal;
      font-weight: 400;
      font-display: block;
      src: url('data:font/ttf;base64,${_latinFontRegularB64}') format('truetype');
    }
    @font-face {
      font-family: 'CVFont';
      font-style: normal;
      font-weight: 600;
      font-display: block;
      src: url('data:font/ttf;base64,${_latinFontBoldB64 || _latinFontRegularB64}') format('truetype');
    }
    @font-face {
      font-family: 'CVFont';
      font-style: normal;
      font-weight: 700;
      font-display: block;
      src: url('data:font/ttf;base64,${_latinFontBoldB64 || _latinFontRegularB64}') format('truetype');
    }
    @font-face {
      font-family: 'CVFont';
      font-style: normal;
      font-weight: 800;
      font-display: block;
      src: url('data:font/ttf;base64,${_latinFontBoldB64 || _latinFontRegularB64}') format('truetype');
    }`;
    }
  }

  const effectiveFontFamily = isRTL
    ? `'Noto Naskh Arabic', sans-serif`
    : (_latinFontRegularB64 ? `'CVFont', 'DejaVu Sans', sans-serif` : `'${fontFam}', sans-serif`);

  const pi          = cvData?.personalInfo ?? {};
  const contactLine = buildContactLine(pi, visiblePersonalFields, isRTL);
  const sectionsHtml = renderSections(cvData, {
    isRTL, visibleSections, visiblePersonalFields, sectionOrder, sectionNames,
  }, accent, rulerPos);

  const dir = isRTL ? "rtl" : "ltr";

  return `<!DOCTYPE html>
<html lang="${isRTL ? "ar" : "en"}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    ${fontFaceBlock}

    @page {
      size: A4;
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html, body {
      width: 210mm;
      background: #ffffff;
    }

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
      padding: ${padding};
      background: #ffffff;
    }

    /* ── Header ── */
    .header {
      text-align: ${resolvedHeaderAlign};
      margin-bottom: 10pt;
      padding-bottom: 10pt;
      border-bottom: 2px solid ${esc(accent)};
    }

    .cv-name {
      font-size: ${fsSz.name};
      font-weight: 800;
      color: #0d0d0d;
      letter-spacing: -0.01em;
      line-height: 1.1;
      margin-bottom: 2pt;
    }

    .cv-title {
      font-size: 11pt;
      font-weight: 600;
      color: ${esc(accent)};
      margin-bottom: 6pt;
    }

    .cv-contact {
      font-size: ${fsSz.meta};
      color: #444444;
    }

    /* ── Sections ── */
    .cv-section {
      margin-top: ${sectMt};
      break-inside: avoid;
    }

    .section-heading {
      font-size: ${fsSz.heading};
      font-weight: 800;
      color: #0d0d0d;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      text-align: ${resolvedHeadAlign};
      margin-bottom: 3pt;
      break-after: avoid;
    }

    .section-rule {
      margin-bottom: 7pt;
    }

    /* ── Items ── */
    .item {
      margin-bottom: 10pt;
      break-inside: avoid;
    }

    .item-sm {
      margin-bottom: 7pt;
      break-inside: avoid;
    }

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
      text-align: ${isRTL ? "left" : "right"};
    }

    .sub-text {
      font-size: ${fsSz.meta};
      color: #444444;
      font-style: italic;
      margin-bottom: 2pt;
    }

    .body-text {
      font-size: ${fsSz.body};
      color: #222222;
      white-space: pre-line;
    }

    .skills-text {
      line-height: 1.7;
    }
  </style>
</head>
<body>
  <div class="cv-page">

    <div class="header">
      ${pi.fullName ? `<div class="cv-name">${esc(pi.fullName)}</div>` : ""}
      ${pi.jobTitle ? `<div class="cv-title">${esc(pi.jobTitle)}</div>` : ""}
      ${contactLine ? `<div class="cv-contact">${contactLine}</div>` : ""}
    </div>

    ${sectionsHtml}

  </div>
</body>
</html>`;
}
