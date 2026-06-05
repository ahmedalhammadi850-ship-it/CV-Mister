---
name: PDF Export approach
description: How PDF download works for ATS vs non-ATS templates — all text-based, no images, no print dialog.
---

## Rule
All PDF exports produce **real selectable text** with **direct download** (no window.print, no dialog, no image rasterisation).

- **ATS templates** → `generateATSPdf` (atsPdfExport.js) — plain text layout, Helvetica/Amiri.
- **Non-ATS visual templates** → `generateStyledPdf` (atsPdfExport.js) — solid coloured header band using `theme.primaryColor`, same section rendering logic as ATS.

**Why:** User explicitly rejected: (a) image-based PDF (text not selectable), (b) window.print() (shows dialog). generateStyledPdf produces a styled but fully text-based PDF.

**How to apply:**
- CVBuilder.jsx calls `generateStyledPdf` with `accentColor: theme?.primaryColor` for all non-ATS templates.
- `generateStyledPdf` is exported from `atsPdfExport.js` alongside `generateATSPdf`.
- No print CSS needed — the `@media print` block was removed from index.css.
- `theme.primaryColor` is a hex string (e.g. `'#4f46e5'`).
