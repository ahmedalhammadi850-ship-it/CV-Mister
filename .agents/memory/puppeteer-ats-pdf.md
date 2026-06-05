---
name: Puppeteer ATS PDF
description: Server-side PDF generation for ATS templates using Puppeteer + Chromium (Nix); Arabic font embedded as base64.
---

# Puppeteer ATS PDF

## Rule
ATS templates (any templateId starting with "ats") use `POST /api/pdf/ats` — server-side Puppeteer rendering. Non-ATS templates keep the client-side html-to-image + jsPDF path.

**Why:** jsPDF text-positioning produces spacing artifacts in copy-paste; the invisible text overlay approach for non-ATS templates is also imperfect for Arabic. Puppeteer prints real browser-rendered HTML so text is 100% selectable, correctly spaced, and ATS-parseable.

## Architecture
- `api/_lib/puppeteerPdf.js` — singleton browser (lazy init, reconnects on disconnect), `generatePdfFromHtml(html)` → Buffer
- `api/_lib/atsHtmlTemplate.js` — `buildAtsHtml(cvData, options)` → HTML string; handles all 9 ATS variants, all sections, RTL/LTR, theme (primaryColor, fontSize, pagePadding, lineHeight, sectionSpacing)
- `api/pdf/ats.js` — POST endpoint, auth required, returns `application/pdf` binary
- `CVBuilder.jsx` — checks `isATSTemplate(selectedTemplate)` at download time; if true, POSTs cvData+options to /api/pdf/ats, receives blob, triggers download

## Arabic font
Noto Naskh Arabic fetched from Google Fonts server-side on first Arabic request, cached in-memory as base64, embedded in HTML via `@font-face { src: url('data:font/woff2;base64,...') }`. Falls back to system Arabic fonts silently if fetch fails.

**How to apply:** When adding a new ATS template, add its normalized ID to `TEMPLATE_VARIANTS` in `atsHtmlTemplate.js` with `headerAlign` and `accentDefault`. The HTML generator handles all sections automatically.

## Chromium
Installed via Nix system package (`chromium`). Binary found with `which chromium`. Chromium 138 confirmed working. Launch args include `--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage --disable-gpu --no-zygote --single-process`.
