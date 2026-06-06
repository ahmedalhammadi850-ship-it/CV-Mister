/**
 * atsReactRenderer.js
 *
 * Builds print-ready HTML documents for Puppeteer PDF generation.
 *
 * Two entry points:
 *
 *  buildHtmlFromRendered(bodyHtml, options)  [PRIMARY]
 *    Takes the exact outerHTML captured from the browser's live preview and
 *    wraps it in a Puppeteer-ready document.  No re-rendering → no font or
 *    layout mismatch.  The PDF is pixel-identical to what the user sees.
 *
 *  buildAtsHtmlFromReact(cvData, options)  [FALLBACK]
 *    Server-renders the React template from raw CV data.  Used when the client
 *    cannot supply pre-rendered HTML (e.g. old clients / direct API calls).
 *    Font substitution is applied so the result is as close as possible.
 */

import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import path from 'path';
import { fileURLToPath } from 'url';

if (typeof globalThis.React === 'undefined') {
  globalThis.React = React;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, '../../src/templates');

const TEMPLATE_FILES = {
  // ── ATS ────────────────────────────────────────────────────────────────────
  atsclean:   'ATSCleanTemplate.jsx',
  atspro:     'ATSProTemplate.jsx',
  atssimple:  'ATSSimpleTemplate.jsx',
  atsbold:    'ATSBoldTemplate.jsx',
  atscompact: 'ATSCompactTemplate.jsx',
  atsmodern:  'ATSModernTemplate.jsx',
  atsharvard: 'ATSHarvardTemplate.jsx',
  atscenter:  'ATSCenterTemplate.jsx',
  atselegant: 'ATSElegantTemplate.jsx',

  // ── English ────────────────────────────────────────────────────────────────
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

  // ── Arabic ─────────────────────────────────────────────────────────────────
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

// All Google Fonts used across templates — loaded in a single CSS request.
//
// CRITICAL: This URL must be IDENTICAL to FONTS_URL in index.html.
// Both the browser preview and Puppeteer now load fonts through /api/font-proxy.
// If the URLs differ, Google Fonts returns different CSS → different font files
// → different glyph metrics → layout shifts between preview and PDF.
//
// To update fonts: change both this URL and index.html at the same time.
// Includes all template fonts (Inter, Merriweather, Outfit, Tajawal, Cairo,
// Amiri, Noto Naskh Arabic, Scheherazade New) plus UI fonts (Plus Jakarta Sans,
// DM Sans) so the exact same Google Fonts CSS is returned for both environments.
const ALL_GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?' +
  'family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400' +
  '&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400' +
  '&family=Inter:wght@400;500;600;700;800' +
  '&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400' +
  '&family=Outfit:wght@400;500;600;700;800' +
  '&family=Tajawal:wght@300;400;500;700' +
  '&family=Cairo:wght@300;400;600;700' +
  '&family=Amiri:ital,wght@0,400;0,700;1,400' +
  '&family=Noto+Naskh+Arabic:wght@400;500;600;700' +
  '&family=Scheherazade+New:wght@400;700' +
  '&display=swap';

// ── Server-side font substitution (fallback path only) ─────────────────────
// System fonts (Calibri, Georgia, …) are not installed on the Linux server.
// Without substitution Chromium falls back to Arial, which has different
// character metrics and causes layout shifts relative to the browser preview.
// This map is only applied in buildAtsHtmlFromReact (the SSR fallback).
const LINUX_FONT_SUBSTITUTES = {
  'Calibri':         'Inter',
  'Verdana':         'Inter',
  'Trebuchet MS':    'Inter',
  'Arial':           'Inter',
  'Georgia':         'Merriweather',
  'Times New Roman': 'Merriweather',
};

function patchThemeForServer(theme, isRTL) {
  const ff = theme?.fontFamily || (isRTL ? 'Tajawal' : 'Inter');
  const substitute = LINUX_FONT_SUBSTITUTES[ff];
  if (!substitute) return theme ?? {};
  return { ...(theme ?? {}), fontFamily: substitute };
}

function normalizeId(id) {
  return (id || '').toLowerCase().replace(/[\s\-_]/g, '');
}

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

// ── Shared HTML document builder ────────────────────────────────────────────

/**
 * Wrap rendered template HTML in a complete, Puppeteer-ready HTML document.
 *
 * Single-page (pageBreaks empty): template placed directly in <body>.
 * Puppeteer paginates using the template's own break-inside/break-after rules.
 *
 * Multi-page (pageBreaks provided): N clipped .page-slice containers, each
 * showing one page-worth of the template via overflow:hidden + translateY.
 * break-after:page between slices forces a new PDF page at each break point.
 */
function _buildDocument(bodyHtml, isRTL, pageBreaks, totalHeight) {
  const dir  = isRTL ? 'rtl' : 'ltr';
  const lang = isRTL ? 'ar'  : 'en';

  // Load fonts via the local font-proxy rather than directly from fonts.googleapis.com.
  // The browser preview already uses /api/font-proxy (see index.html), so using the
  // same proxy in Puppeteer guarantees identical font files and eliminates the
  // external-network dependency that can cause Google Fonts to fail or time-out
  // inside the Replit sandbox — which would fall back to Arial and break every
  // layout measurement compared to the preview.
  // puppeteerPdf.js sets baseURL:'http://127.0.0.1:<PORT>' on page.setContent() so
  // this relative URL resolves to http://127.0.0.1:<PORT>/api/font-proxy?url=...
  // The proxy rewrites font-file URLs to /api/font-file?url=... (also relative),
  // which Puppeteer resolves the same way — all font traffic stays on localhost.
  const fontLinks = [
    `<link href="/api/font-proxy?url=${encodeURIComponent(ALL_GOOGLE_FONTS_URL)}" rel="stylesheet" />`,
  ].join('\n  ');

  // ── Base CSS — exact mirror of Tailwind CSS v4 preflight ──────────────────
  //
  // WHY: The browser preview renders inside the full app where Tailwind is
  // active (src/index.css → @import "tailwindcss").  Puppeteer renders a bare
  // HTML document with NO Tailwind.  Without this reset, Chromium's UA
  // stylesheet defaults apply in Puppeteer but NOT in the browser (Tailwind
  // overrides them), causing phantom margins on h1-h6, p, ul, ol, etc. that
  // push every section downward relative to what the user sees in the preview.
  //
  // HOW: Copy tailwindcss/preflight.css rules verbatim.  We intentionally do
  // NOT include @media print {} overrides — emulateMediaType('screen') in
  // puppeteerPdf.js keeps Chromium in screen-render mode so print-only rules
  // never apply.  Template inline styles always win over element selectors.
  //
  // WHAT TAILWIND v4 PREFLIGHT ACTUALLY DOES (verified from the source file):
  //   *, ::before, ::after              → margin:0; padding:0; border:0 solid
  //   html                              → line-height:1.5
  //   h1-h6                             → font-size/weight: inherit
  //   a                                 → color/text-decoration: inherit
  //   b, strong                         → font-weight: bolder
  //   ol, ul, menu                      → list-style: none
  //   table                             → text-indent:0; border-collapse:collapse
  //   img/svg/video/canvas/…            → display:block; vertical-align:middle
  //
  // WHAT TAILWIND v4 DOES NOT RESET:
  //   address { font-style: italic }    ← UA stylesheet; Tailwind's * selector
  //                                        only zeroes margin/padding/border,
  //                                        NOT font-style.  Both the browser
  //                                        (Tailwind active) and Puppeteer
  //                                        (bare document) therefore render
  //                                        <address> in italic — they match.
  //                                        Do NOT add address{font-style:normal}
  //                                        here or the PDF will differ from the
  //                                        preview.
  const baseStyles = `
    @page { size: A4; margin: 0; }

    /* Tailwind preflight: universal reset (preflight.css lines 7-16) */
    *, ::after, ::before, ::backdrop {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      border: 0 solid;
    }

    /* Tailwind preflight: html baseline (lines 28-46) */
    html {
      line-height: 1.5;
      -webkit-text-size-adjust: 100%;
      tab-size: 4;
    }

    /* ── Print-colour preservation (CRITICAL for coloured sidebars/backgrounds) ──
     * Chromium's PDF pipeline can strip background-color / background-image even
     * when printBackground:true is set, unless print-color-adjust:exact is declared
     * on the *element itself*.  Setting it only on html/body is not enough —
     * every element with a background needs it.  The * selector covers all of them.
     * The !important ensures it wins over any UA-stylesheet adjustments.
     */
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    html, body {
      background: #ffffff;
    }

    /* Tailwind preflight: heading reset (lines 73-81) */
    h1, h2, h3, h4, h5, h6 {
      font-size: inherit;
      font-weight: inherit;
    }

    /* Tailwind preflight: link reset (lines 87-91) */
    a {
      color: inherit;
      -webkit-text-decoration: inherit;
      text-decoration: inherit;
    }

    /* Tailwind preflight: bold weight (lines 97-100) */
    b, strong { font-weight: bolder; }

    /* Tailwind preflight: list reset (lines 197-201) */
    ol, ul, menu { list-style: none; }

    /* Tailwind preflight: table (lines 163-167) */
    table { text-indent: 0; border-color: inherit; border-collapse: collapse; }

    /* Tailwind preflight: block media (lines 209-219) */
    img, svg, video, canvas, audio, iframe, embed, object {
      display: block;
      vertical-align: middle;
    }
    img, video { max-width: 100%; height: auto; }

    /* ── Resume template class rules (mirror of src/index.css) ──────────────
     * Templates may apply these class names for page-break control.
     * Without them, Puppeteer ignores the break directives and page breaks
     * land mid-section, producing a PDF that differs from the browser preview.
     */
    .cv-section, .cv-item {
      break-inside: avoid;
      page-break-inside: avoid;
    }
    .cv-heading {
      break-after: avoid;
      page-break-after: avoid;
    }`;

  // ── Single-page ────────────────────────────────────────────────────────────
  if (!pageBreaks || pageBreaks.length === 0) {
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

  // ── Multi-page ─────────────────────────────────────────────────────────────
  // One container per page. Each container:
  //   • height = distance between consecutive break points (dynamic, NOT fixed 1122px)
  //     Using a fixed 1122px would make each slice overlap the next slice by
  //     (1122 - breakDelta) px — content would appear duplicated on adjacent pages.
  //   • overflow: hidden — clips to exactly the declared slice height
  //   • translateY(-pageStart px) — shifts template so only this slice is visible
  //   • break-after: page — forces a new PDF page after each slice
  //     The remainder of the A4 page (1122 - sliceHeight px) is white space from
  //     the page background — exactly matching the white overlay the browser preview
  //     paints over the content below each page break line.
  const pageStarts = [0, ...pageBreaks];

  const pageContainers = pageStarts.map((start, i) => {
    const isLast = i === pageStarts.length - 1;
    // Slice shows content from 'start' to 'end' — no overlap with next slice.
    const end = isLast ? totalHeight : pageBreaks[i];
    const sliceHeight = Math.max(1, Math.round(end - start));
    return `<div class="page-slice${isLast ? ' last-slice' : ''}" style="height:${sliceHeight}px">
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

    .page-slice {
      width: 794px;
      /* height is set dynamically per slice (inline style) — do NOT put a
         fixed 1122px here or every slice would overflow and duplicate content */
      overflow: hidden;
      position: relative;
      break-after: page;
      page-break-after: always;
    }
    .page-slice.last-slice {
      break-after: auto;
      page-break-after: auto;
    }
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

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * PRIMARY PATH: Build a Puppeteer-ready HTML document from the browser's own
 * rendered template HTML.
 *
 * The client captures `captureEl.innerHTML` (the live preview's contentRef)
 * and sends it here. We wrap it in a minimal document with Google Fonts so
 * Puppeteer can resolve the same font URLs the browser already used.
 * No re-rendering → no font mismatch → pixel-perfect PDF.
 *
 * @param {string}   bodyHtml  — innerHTML / outerHTML from the browser preview
 * @param {object}   options
 * @returns {string} Complete HTML document for Puppeteer
 */
export function buildHtmlFromRendered(bodyHtml, options = {}) {
  const { isRTL = false, pageBreaks = [], totalHeight = 1122 } = options;
  return _buildDocument(bodyHtml, isRTL, pageBreaks, totalHeight);
}

/**
 * FALLBACK PATH: Server-render the template from raw CV data.
 * Used when the client cannot supply pre-rendered HTML.
 * Applies font substitution to minimize layout differences on Linux.
 *
 * @param {object} cvData
 * @param {object} options
 * @returns {Promise<string>} Complete HTML document for Puppeteer
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

  // Substitute system-only fonts with available Google Fonts equivalents.
  const serverTheme = patchThemeForServer(theme, isRTL);

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

  return _buildDocument(bodyHtml, isRTL, pageBreaks, totalHeight);
}
