/**
 * atsReactRenderer.js
 *
 * Renders ALL resume templates (ATS + non-ATS) using the SAME React components
 * as the browser preview — guaranteeing pixel-perfect PDF/preview parity.
 *
 * Uses react-dom/server renderToStaticMarkup to produce static HTML from
 * the JSX templates in src/templates/, then wraps it in a print-ready
 * HTML document for Puppeteer.
 *
 * Multi-page support: when pageBreaks are provided (from the client's smart
 * break computation), the HTML document contains one clipped container per
 * page slice. Each container uses overflow:hidden + translateY to show only
 * the correct slice of the template, and break-after:page forces a Puppeteer
 * page boundary between them — so the PDF pages exactly match the preview.
 */

import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import path from 'path';
import { fileURLToPath } from 'url';

// tsx compiles the JSX template files using the classic JSX transform
// (React.createElement), so React must be in the global scope when those
// modules execute.  We set it here once, before any template is imported.
if (typeof globalThis.React === 'undefined') {
  globalThis.React = React;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, '../../src/templates');

// Maps normalized templateId → filename in src/templates/
const TEMPLATE_FILES = {
  // ── ATS templates ──────────────────────────────────────────────────────────
  atsclean:   'ATSCleanTemplate.jsx',
  atspro:     'ATSProTemplate.jsx',
  atssimple:  'ATSSimpleTemplate.jsx',
  atsbold:    'ATSBoldTemplate.jsx',
  atscompact: 'ATSCompactTemplate.jsx',
  atsmodern:  'ATSModernTemplate.jsx',
  atsharvard: 'ATSHarvardTemplate.jsx',
  atscenter:  'ATSCenterTemplate.jsx',
  atselegant: 'ATSElegantTemplate.jsx',

  // ── Standard / English templates ───────────────────────────────────────────
  modern:         'ModernTemplate.jsx',
  classic:        'ClassicTemplate.jsx',
  creative:       'CreativeTemplate.jsx',
  minimal:        'MinimalTemplate.jsx',
  executive:      'ExecutiveTemplate.jsx',
  prestige:       'PrestigeTemplate.jsx',
  classicserif:   'ClassicSerifTemplate.jsx',
  atlanticblue:   'AtlanticBlueTemplate.jsx',
  mercuryflow:    'MercuryFlowTemplate.jsx',
  editorialrule:  'EditorialRuleTemplate.jsx',
  sidebarlight:   'SidebarLightTemplate.jsx',
  tealpro:        'TealProTemplate.jsx',
  roseelegant:    'RoseElegantTemplate.jsx',
  darkheader:     'DarkHeaderTemplate.jsx',
  velvet:         'VelvetTemplate.jsx',
  aurora:         'AuroraTemplate.jsx',
  englishhorizon: 'EnglishHorizonTemplate.jsx',
  englishapex:    'EnglishApexTemplate.jsx',

  // ── Arabic templates ────────────────────────────────────────────────────────
  arabicgem:          'ArabicGemTemplate.jsx',
  arabicnavy:         'ArabicNavyTemplate.jsx',
  arabicpro:          'ArabicProTemplate.jsx',
  arabictealsidebar:  'ArabicTealSidebarTemplate.jsx',
  arabicslatesidebar: 'ArabicSlateSidebarTemplate.jsx',
  arabicmodern:       'ArabicModernTemplate.jsx',
  arabiccard:         'ArabicCardTemplate.jsx',
  arabicelite:        'ArabicEliteTemplate.jsx',
  arabicwave:         'ArabicWaveTemplate.jsx',
  arabicluxe:         'ArabicLuxeTemplate.jsx',
  arabiczafir:        'ArabicZafirTemplate.jsx',
};

// All Google Fonts used across templates — loaded in a single CSS request
// so every font is available regardless of which template is selected.
// System fonts (Calibri, Arial, Georgia, etc.) are resolved from Chromium's
// bundled fonts; on Linux this means Liberation/Noto fallbacks.
const ALL_GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800' +
  '&family=Merriweather:ital,wght@0,400;0,700;1,400' +
  '&family=Outfit:wght@400;500;600;700;800' +
  '&family=Tajawal:wght@400;500;700;800' +
  '&family=Cairo:wght@400;600;700;800' +
  '&family=Amiri:ital,wght@0,400;0,700;1,400' +
  '&family=Noto+Naskh+Arabic:wght@400;600;700' +
  '&family=Scheherazade+New:wght@400;700' +
  '&display=swap';

// ── Server-side font substitution ─────────────────────────────────────────────
// System fonts listed here are NOT available in Puppeteer's Linux/Chromium
// environment. Without substitution they fall back to Arial, which has
// measurably different character widths and causes layout shifts vs. the
// browser preview (where Windows/macOS users have the system font installed).
//
// Each system font is mapped to the CLOSEST Google Font equivalent that is
// already declared in ALL_GOOGLE_FONTS_URL, so no extra network fetch is
// needed. The substitution is applied only to the theme passed to the server-
// side renderToStaticMarkup call — it never changes what is stored in Firestore
// or shown as the selected font in the browser UI.
const LINUX_FONT_SUBSTITUTES = {
  'Calibri':         'Inter',          // Microsoft humanist sans-serif → Inter
  'Verdana':         'Inter',          // Geometric humanist → Inter
  'Trebuchet MS':    'Inter',          // Humanist sans-serif → Inter
  'Georgia':         'Merriweather',   // Transitional serif → Merriweather
  'Times New Roman': 'Merriweather',   // Old-style serif → Merriweather
  'Arial':           'Inter',          // Grotesque sans-serif → Inter (closest web font)
};

/**
 * Patch a theme object so any system-only font is replaced with its
 * nearest Google Fonts equivalent before server-side rendering.
 * This keeps the PDF layout as close as possible to the browser preview.
 */
function patchThemeForServer(theme, isRTL) {
  const ff = theme?.fontFamily || (isRTL ? 'Tajawal' : 'Calibri');
  const substitute = LINUX_FONT_SUBSTITUTES[ff];
  if (!substitute) return theme ?? {};
  return { ...(theme ?? {}), fontFamily: substitute };
}

function normalizeId(id) {
  return (id || '').toLowerCase().replace(/[\s\-_]/g, '');
}

// Cache imported template modules — avoids re-compiling on every request
const _templateCache = new Map();

async function loadTemplate(tid) {
  if (_templateCache.has(tid)) return _templateCache.get(tid);
  const file = TEMPLATE_FILES[tid] || TEMPLATE_FILES.atsclean;
  const fullPath = path.join(TEMPLATES_DIR, file);
  const mod = await import(fullPath);
  const component = mod.default;
  if (!component) throw new Error(`Template ${file} has no default export`);
  _templateCache.set(tid, component);
  return component;
}

/**
 * Build a complete print-ready HTML document by server-rendering the exact
 * same React template component used in the browser preview.
 *
 * When pageBreaks are provided (pixel y-positions from the client's smart
 * break computation), the document contains one clipped container per page
 * slice. Each container uses overflow:hidden + translateY to display only its
 * slice of the template, and break-after:page forces a PDF page boundary —
 * so the exported pages exactly match what the user sees in the preview.
 *
 * @param {object} cvData
 * @param {object} options  — same shape as POST /api/pdf/ats body.options
 *   @param {number[]} [options.pageBreaks=[]]     pixel y-positions of page breaks
 *   @param {number}   [options.totalHeight=1122]  total content height in px
 * @returns {Promise<string>} Full HTML document ready for Puppeteer
 */
export async function buildAtsHtmlFromReact(cvData, options = {}) {
  const {
    templateId            = 'atsclean',
    isRTL                 = false,
    theme                 = {},
    visibleSections       = {},
    visiblePersonalFields = {},
    sectionOrder          = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'],
    sectionNames          = {},
    pageBreaks            = [],
    totalHeight           = 1122,
  } = options;

  const tid = normalizeId(templateId);
  const TemplateComponent = await loadTemplate(tid);

  // Substitute any system-only fonts with Google Fonts equivalents so the
  // PDF layout matches the preview as closely as possible on Linux/Chromium.
  const serverTheme = patchThemeForServer(theme, isRTL);

  // Server-render the same component the browser preview uses.
  const bodyHtml = renderToStaticMarkup(
    React.createElement(TemplateComponent, {
      data: cvData,
      theme: serverTheme,
      isRTL,
      visibleSections,
      visiblePersonalFields,
      sectionOrder,
      sectionNames,
    })
  );

  const dir = isRTL ? 'rtl' : 'ltr';
  const lang = isRTL ? 'ar' : 'en';

  const fontLinks = `
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="${ALL_GOOGLE_FONTS_URL}" rel="stylesheet" />`;

  const baseStyles = `
    @page { size: A4; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #ffffff; }
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;`;

  // ── Single-page (no breaks) ────────────────────────────────────────────────
  // Use the original simple HTML structure — Puppeteer paginates automatically
  // at A4 boundaries using the template's own CSS break-inside/break-after rules.
  if (pageBreaks.length === 0) {
    return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=794" />
  ${fontLinks}
  <style>${baseStyles}</style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
  }

  // ── Multi-page (breaks provided by client) ─────────────────────────────────
  // Build one 794×1122px container per page slice. Each container:
  //   • Is exactly A4 height (1122px at 96dpi) with overflow:hidden
  //   • Shifts the template upward by -pageStart px using translateY so only
  //     the correct slice is visible
  //   • Has break-after:page so Puppeteer starts a new PDF page after it
  //
  // This approach duplicates the template HTML N times (once per page), but
  // since it's static markup the overhead is small and the layout is exact.
  const pageStarts = [0, ...pageBreaks];
  const pageEnds   = [...pageBreaks, totalHeight];

  const pageContainers = pageStarts.map((start, i) => {
    const isLast = i === pageStarts.length - 1;
    return `<div class="page-slice${isLast ? ' last-slice' : ''}">
  <div class="template-wrap" style="transform:translateY(-${Math.round(start)}px)">
    ${bodyHtml}
  </div>
</div>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=794" />
  ${fontLinks}
  <style>
    ${baseStyles}

    /* One container per PDF page */
    .page-slice {
      width: 794px;
      height: 1122px;          /* A4 at 96 dpi */
      overflow: hidden;
      position: relative;
      break-after: page;
      page-break-after: always;
    }
    .page-slice.last-slice {
      break-after: auto;
      page-break-after: auto;
    }

    /* The template itself; transform shifts it to show only this page's slice */
    .template-wrap {
      width: 794px;
      position: absolute;
      top: 0;
      left: 0;
      transform-origin: top left;
    }
  </style>
</head>
<body>
${pageContainers}
</body>
</html>`;
}
