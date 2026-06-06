---
name: PDF Export — Universal Puppeteer SSR
description: All templates use server-side Puppeteer + react-dom/server renderToStaticMarkup for PDF generation.
---

# PDF Export: Universal Puppeteer SSR

## The Rule
ALL templates (ATS + non-ATS) generate PDFs via `POST /api/pdf/ats` on the server using Puppeteer. No client-side html-to-image or jsPDF image layers. The same React component used in the browser preview is server-rendered with `renderToStaticMarkup` → identical layout guaranteed.

**Why:** html-to-image + jsPDF (old approach) produced dual-layer PDFs (image + invisible text). Some PDF viewers rendered the invisible text layer as visible black text at incorrect positions → headings appeared "on the left". Also: Tailwind v4 Constructable Stylesheets are invisible to html2canvas/html-to-image's SVG foreignObject → blank captures. Puppeteer renders real text — no dual layers.

## Multi-page support
Client (`LivePreview.jsx` via `breakDataRef`) computes pixel y-positions of page breaks using a smart-break algorithm. These are sent to the server as `options.pageBreaks` + `options.totalHeight`. When provided, `atsReactRenderer.js` builds N `.page-slice` containers, each `overflow:hidden` + `translateY(-pageStart_px)` + `break-after:page` — so PDF pages exactly match the preview slices.

## Font substitution (server-side)
System fonts (Calibri, Georgia, Times New Roman, Verdana, Trebuchet MS, Arial) are NOT available on Linux/Chromium. `atsReactRenderer.js` has `LINUX_FONT_SUBSTITUTES` map that patches `theme.fontFamily` before SSR:
- Calibri, Verdana, Trebuchet MS, Arial → **Inter**
- Georgia, Times New Roman → **Merriweather**

Applied via `patchThemeForServer(theme, isRTL)`. Does NOT change Firestore data or browser UI selection.

## Font consistency (browser ↔ PDF)
`index.html` loads Inter, Merriweather, Outfit via the same `/api/font-proxy` so the browser preview also has these fonts. `templateUtils.js` font stack for LTR:
`'${fontFamily}', 'Inter', Arial, sans-serif` — so non-Windows browsers fall through to Inter (matching the PDF) instead of Arial.

## Key files
- `api/_lib/atsReactRenderer.js` — SSR + multi-page HTML builder + font substitution
- `api/pdf/ats.js` — HTTP handler, accepts pageBreaks/totalHeight
- `api/_lib/puppeteerPdf.js` — singleton browser, viewport height from pageBreakCount
- `src/templates/templateUtils.js` — font stack (Inter as LTR fallback)
- `index.html` — loads all template fonts via font-proxy
