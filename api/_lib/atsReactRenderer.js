/**
 * atsReactRenderer.js
 *
 * Builds print-ready HTML documents for Puppeteer PDF generation.
 *
 * Two entry points:
 *
 *  buildAtsHtmlFromReact(cvData, options)  [PRIMARY]
 *    Server-renders the selected React template via react-dom/server renderToStaticMarkup.
 *    ALWAYS used when cvData is present (which the client always sends).
 *    Guarantees the CORRECT template — no template-mismatch bugs.
 *    Templates use 100% inline React styles so SSR output is identical to
 *    the browser preview.  Fonts are loaded in Puppeteer via /api/font-proxy
 *    (same URL the browser uses) → identical glyph metrics → identical layout.
 *    Page-break positions (options.pageBreaks + totalHeight) come from the
 *    browser's smart-break algorithm and are forwarded for multi-page layout.
 *
 *  buildHtmlFromRendered(bodyHtml, options)  [FALLBACK]
 *    Takes pre-rendered HTML from the browser (legacy / direct API callers).
 *    Used only when cvData is absent.
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

// On Vercel, Node.js cannot import raw .jsx files.
// scripts/buildSsr.mjs pre-compiles all templates into dist-ssr/templates.js
// (run as part of the Vercel build).  We import from that bundle on Vercel
// and fall back to dynamic JSX imports on Replit / local (tsx handles JSX).
const _ssrBundle = process.env.VERCEL
  ? import('../../dist-ssr/templates.js').catch(() => null)
  : null;

async function loadTemplate(tid) {
  if (_templateCache.has(tid)) return _templateCache.get(tid);
  const file = TEMPLATE_FILES[tid] || TEMPLATE_FILES.atsclean;
  let component;

  if (process.env.VERCEL) {
    const bundle = await _ssrBundle;
    if (!bundle) throw new Error('dist-ssr/templates.js not found — run scripts/buildSsr.mjs');
    const exportName = file.replace(/\.(jsx|tsx)$/, '');
    component = bundle[exportName];
  } else {
    const fullPath = path.join(TEMPLATES_DIR, file);
    const mod = await import(fullPath);
    component = mod.default;
  }

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
  // On Vercel, Chromium has direct internet access — fetch Google Fonts directly
  // (no localhost server is running so the /api/font-proxy relative URL would fail).
  // On Replit/local, use the font-proxy which routes through the local Express
  // server (baseURL: http://127.0.0.1:PORT makes the relative URL resolve).
  const fontLinks = process.env.VERCEL
    ? `<link href="${ALL_GOOGLE_FONTS_URL}" rel="stylesheet" />`
    : `<link href="/api/font-proxy?url=${encodeURIComponent(ALL_GOOGLE_FONTS_URL)}" rel="stylesheet" />`;

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
    }
    /* Prevent individual bullet-point lines from being orphaned on a new page */
    .cv-item li, .cv-section li {
      break-inside: avoid;
      page-break-inside: avoid;
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
  //   • overflow: hidden — clips to exactly the declared slice height
  //   • translateY(-pageStart px) — shifts template so only this slice is visible
  //   • break-after: page — forces a new PDF page after each slice
  //
  // PAGE 2+ TOP MARGIN  (mirrors LivePreview.jsx exactly)
  //   LivePreview renders page 2+ with:
  //     clipStart = start - MARGIN  (48px before the break point)
  //     white overlay of MARGIN px covering the top of the frame
  //   This makes pages 2+ show a clean MARGIN px of white at the top, then
  //   content from exactly `start`.  We replicate this in the PDF using a
  //   nested overflow:hidden inner container so NO template content bleeds
  //   into the white margin area — matching the preview pixel-for-pixel.
  //
  //   Structure for pages 2+:
  //     .page-slice  (height = sliceHeight + MARGIN, overflow:hidden)
  //       inner-clip  (position:absolute, top=MARGIN, height=sliceHeight, overflow:hidden)
  //         template-wrap  (translateY(-start))
  //
  //   The inner-clip sits BELOW the MARGIN px white zone and tightly clips
  //   content from template y=start to y=(start+sliceHeight).  No template
  //   content can bleed upward into the white margin.
  const MARGIN = 48; // px — matches LivePreview.jsx MARGIN constant (≈ 36pt at 96dpi)

  const pageStarts = [0, ...pageBreaks];

  // Extra pixel buffer added to the last page's content height to absorb the
  // small difference between the browser-measured totalHeight (scrollHeight of
  // the off-screen DOM) and the actual SSR-rendered height.
  //
  // WHY THIS HAPPENS: The browser measures the live DOM with the user's actual
  // screen fonts loaded; SSR (react-dom/server) renders the same JSX but on
  // the server, where font metrics can differ very slightly (sub-pixel
  // line-height rounding, fractional em values resolved differently).  The
  // result: SSR may produce a template that is 50–150 px taller than what the
  // browser reported.  Without this buffer, that extra content is clipped by
  // overflow:hidden on the last page's inner container, silently cutting off
  // the last few items (e.g. the Languages section).
  //
  // 200 px is conservative — real variance is typically < 100 px — and keeps
  // totalSliceHeight well under A4 (1122 px) for any normal resume layout,
  // which prevents an unwanted blank third page.
  const LAST_PAGE_SSR_BUFFER = 200;

  const pageContainers = pageStarts.map((start, i) => {
    const isFirst = i === 0;
    const isLast  = i === pageStarts.length - 1;

    // For the last page extend the clip boundary by the SSR buffer so that
    // content slightly beyond the browser-measured totalHeight is not hidden.
    const end = isLast ? totalHeight + LAST_PAGE_SSR_BUFFER : pageBreaks[i];
    const sliceHeight = Math.max(1, Math.round(end - start));

    if (isFirst) {
      // Page 1 (single-page OR first of multi-page): template at translateY(0).
      // For single-page documents cap at A4 height so Puppeteer never emits a
      // second blank page.
      const singleHeight = isLast ? Math.min(sliceHeight, 1122) : sliceHeight;
      return `<div class="page-slice${isLast ? ' last-slice' : ''}" style="height:${singleHeight}px">
  <div class="template-wrap" style="transform:translateY(0px)">
    ${bodyHtml}
  </div>
</div>`;
    }

    // Pages 2+: MARGIN px of white at top, then clipped content.
    // For the last page, cap totalSliceHeight at A4 height (1122 px) so
    // the SSR buffer never pushes the slice past one full page and causes
    // Puppeteer to emit an unwanted blank extra page.
    const rawTotalSliceHeight = sliceHeight + MARGIN;
    const totalSliceHeight = isLast
      ? Math.min(rawTotalSliceHeight, 1122)
      : rawTotalSliceHeight;
    // Recompute the inner clip height after the cap is applied.
    // NOTE: we do NOT subtract a PDF_BOTTOM_MARGIN here — that would clip
    // content.  The 20 px white bottom space is achieved naturally because
    // measureBreaks() places each break 20 px before the raw page edge.
    const innerHeight = totalSliceHeight - MARGIN;

    // TOP-CLIP GUARD: subtract 2 px from the translateY so the inner-clip
    // starts 2 px BEFORE the measured break point.
    //
    // WHY THIS IS NEEDED:
    //   The break algorithm sets start = elTop (getBoundingClientRect top of the
    //   first element on the new page).  Some elements render a top-border,
    //   rule, or decorative line whose paint box starts 1-2 px ABOVE elTop
    //   (e.g. a section heading with border-top, or a pseudo-element).
    //   translateY(-Math.round(start)) positions that content at y ≤ -1 inside
    //   the overflow:hidden inner-clip → clipped → "first line missing" in PDF.
    //
    //   By translating 2 px less (start - 2), the element's paint box lands at
    //   inner-clip y ≥ 0 and is always visible.  The top 2 px of the inner-clip
    //   then show the inter-section gap immediately before the break (white
    //   space), which is invisible to the eye and doesn't disturb the MARGIN
    //   white area above.
    const translateY = Math.max(0, Math.floor(start) - 2);

    return `<div class="page-slice${isLast ? ' last-slice' : ''}" style="height:${totalSliceHeight}px">
  <div style="position:absolute;top:${MARGIN}px;left:0;width:794px;height:${innerHeight}px;overflow:hidden">
    <div style="position:absolute;top:0;left:0;width:794px;transform:translateY(-${translateY}px)">
      ${bodyHtml}
    </div>
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
