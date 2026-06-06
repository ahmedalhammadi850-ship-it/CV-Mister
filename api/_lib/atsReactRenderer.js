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
// Must stay in sync with the font list in index.html (font-proxy script) so
// browser preview and Puppeteer PDF use identical font files.
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

  // Base CSS — note: print-color-adjust must be inside a real selector.
  // We intentionally do NOT include @media print {} overrides — those would
  // alter rendering vs. the browser preview. Instead we set emulateMediaType
  // to 'screen' in puppeteerPdf.js to keep Chromium in screen-render mode.
  //
  // IMPORTANT — HTML element reset (mirrors Tailwind preflight):
  // In the browser preview, Tailwind's preflight stylesheet neutralises
  // browser-default margins on h1-h6, p, ul, ol, li (e.g. h3 gets
  // "margin: 1em 0" by default, p gets "margin: 1em 0").  Puppeteer
  // renders in a minimal document with NO Tailwind, so those browser
  // defaults would apply and add invisible extra spacing that doesn't
  // exist in the preview — causing every section, role title, and
  // paragraph to shift down relative to what the user sees.
  // The inline styles on template elements (which always win over element
  // selectors) are unaffected by this reset.
  const baseStyles = `
    @page { size: A4; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0; padding: 0; background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    h1, h2, h3, h4, h5, h6 {
      margin: 0; padding: 0;
      font-size: inherit; font-weight: inherit;
    }
    p  { margin: 0; padding: 0; }
    ul, ol { margin: 0; padding: 0; list-style: none; }
    li { margin: 0; padding: 0; }
    blockquote, figure, pre { margin: 0; padding: 0; }
    table { border-collapse: collapse; border-spacing: 0; }
    img, svg { display: block; }
    section, article, aside, header, footer, nav, main {
      display: block; margin: 0; padding: 0;
    }
    /* address: browser default is font-style:italic — templates use <address>
       for the contact line but never set fontStyle in the inline style object.
       Tailwind preflight resets this to normal in the browser preview; we must
       do the same here so Puppeteer doesn't render contact info in italics. */
    address { font-style: normal; margin: 0; padding: 0; }`;

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
  // One 794 × 1122 px container per page. Each container:
  //   • overflow: hidden — clips to exactly one A4 page height
  //   • translateY(-pageStart px) — shifts template to show only this slice
  //   • break-after: page — forces a new PDF page after each container
  const pageStarts = [0, ...pageBreaks];

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

    .page-slice {
      width: 794px;
      height: 1122px;
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
