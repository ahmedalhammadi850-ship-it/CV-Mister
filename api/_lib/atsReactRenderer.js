/**
 * atsReactRenderer.js
 *
 * Renders ATS resume templates using the SAME React components as the
 * browser preview — guaranteeing pixel-perfect PDF/preview parity.
 *
 * Uses react-dom/server renderToStaticMarkup to produce static HTML from
 * the JSX templates in src/templates/, then wraps it in a print-ready
 * HTML document for Puppeteer.
 *
 * This is the single source of truth for ATS PDF layout. Do NOT maintain
 * a separate HTML/CSS mirror (atsHtmlTemplate.js is no longer used for PDF).
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
  atsclean:   'ATSCleanTemplate.jsx',
  atspro:     'ATSProTemplate.jsx',
  atssimple:  'ATSSimpleTemplate.jsx',
  atsbold:    'ATSBoldTemplate.jsx',
  atscompact: 'ATSCompactTemplate.jsx',
  atsmodern:  'ATSModernTemplate.jsx',
  atsharvard: 'ATSHarvardTemplate.jsx',
  atscenter:  'ATSCenterTemplate.jsx',
  atselegant: 'ATSElegantTemplate.jsx',
};

// Google Fonts CSS URLs for the web fonts the templates can use.
// System fonts (Calibri, Arial, Georgia, Times New Roman, Verdana,
// Trebuchet MS) are not listed here — Puppeteer's Chromium resolves them
// from system fonts (same behaviour as a browser on the same OS).
const GOOGLE_FONT_URLS = {
  'Inter':             'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
  'Merriweather':      'https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,400;0,700;1,400&display=swap',
  'Outfit':            'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap',
  'Tajawal':           'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap',
  'Cairo':             'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap',
  'Amiri':             'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap',
  'Noto Naskh Arabic': 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;600;700&display=swap',
  'Scheherazade New':  'https://fonts.googleapis.com/css2?family=Scheherazade+New:wght@400;700&display=swap',
};

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
 * Build a complete print-ready HTML document by server-rendering the
 * exact same React template component used in the browser preview.
 *
 * @param {object} cvData
 * @param {object} options  — same shape as POST /api/pdf/ats body.options
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
  } = options;

  const tid = normalizeId(templateId);
  const TemplateComponent = await loadTemplate(tid);

  // Server-render the same component the browser preview uses.
  // React.createElement is used (not JSX) so this file doesn't need
  // the JSX transform itself — the template files do their own JSX.
  const bodyHtml = renderToStaticMarkup(
    React.createElement(TemplateComponent, {
      data: cvData,
      theme,
      isRTL,
      visibleSections,
      visiblePersonalFields,
      sectionOrder,
      sectionNames,
    })
  );

  // Load the same font family the template uses.
  // resolveTheme() in templateUtils.js defaults to 'Calibri' (LTR) or
  // 'Tajawal' (RTL). Only web fonts need a <link>; system fonts are
  // picked up automatically by Chromium.
  const fontFamily = theme?.fontFamily || (isRTL ? 'Tajawal' : 'Calibri');
  const fontUrl    = GOOGLE_FONT_URLS[fontFamily];
  const fontLinks  = fontUrl
    ? `<link rel="preconnect" href="https://fonts.googleapis.com" />
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
       <link href="${fontUrl}" rel="stylesheet" />`
    : '';

  const dir = isRTL ? 'rtl' : 'ltr';

  // The React templates render at width:794px / minHeight:1122px
  // which is exactly A4 at 96 dpi. Puppeteer's viewport is set to
  // match this width in generatePdfFromHtml, so @page A4 maps 1:1.
  return `<!DOCTYPE html>
<html lang="${isRTL ? 'ar' : 'en'}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=794" />
  ${fontLinks}
  <style>
    @page { size: A4; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: #ffffff; }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}
