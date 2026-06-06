---
name: ATS PDF — jsPDF server-side
description: Why Puppeteer was removed from the ATS PDF route and replaced with server-side jsPDF
---

## Rule
ATS PDF generation (`api/pdf/ats.js`) uses server-side **jsPDF** via `api/_lib/atsServerPdf.js`, NOT Puppeteer.

## Why
Puppeteer failed silently on Vercel in three compounding ways:
1. `package.vercel.json` had no `puppeteer-core` — module not found on Lambda
2. `server/fonts/` is outside `api/` — Vercel's bundler never included those files in the lambda bundle
3. Even when Chromium runs (Replit only), specific Chrome flags (e.g. `--single-process`) cause glyph-path fallback (Type3 fonts, visually identical but unselectable)

## How to apply
- ATS PDFs: use `generateATSPdfBuffer(cvData, options)` from `api/_lib/atsServerPdf.js` — pure Node.js, no browser, guaranteed selectable text via `doc.text()` operators
- Non-ATS PDFs: keep html-to-image + jsPDF client-side path in `CVBuilder.jsx` (unchanged)
- Fonts live in `api/_lib/fonts/` (committed to repo) — Vercel bundles everything under `api/` automatically
- `jspdf` is in both `package.json` and `package.vercel.json`
