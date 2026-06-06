---
name: ATS PDF — PDFKit server-side
description: Why ATS PDFs use PDFKit instead of jsPDF, and what was wrong with jsPDF.
---

## Rule
Server-side ATS PDF generation uses **PDFKit** (`pdfkit` npm package), NOT jsPDF.

## Why jsPDF was replaced
jsPDF embeds custom TTF fonts (DejaVuSans, NotoNaskhArabic) using incorrect glyph advance widths.
The PDF text operators are placed at correct visual positions, but the /Widths arrays in the font
descriptor don't match — so PDF viewers compute selection rectangles based on wrong metrics.
Symptom: "fragmented blue blocks" when selecting text; selection doesn't track words correctly.

PDFKit uses its bundled `fontkit` to read actual glyph advance widths from the TTF file and stores
them in CIDFontType2 /W arrays. Rendering width == selection width == copy/paste width. Fixed.

## How to apply
- `api/_lib/atsServerPdf.js` — full PDFKit implementation, handles LTR (DejaVuSans) and RTL (NotoNaskhArabic)
- Fonts live in `api/_lib/fonts/` — committed to repo, bundled in every deployment
- `generateATSPdfBuffer(cvData, options)` returns a `Buffer`; called from `api/pdf/ats.js` and `api/[...path].js`
- If you need to add new sections, mirror the pattern in `renderSection()` switch statement
- Do NOT switch back to jsPDF for this path — the glyph width bug is a known jsPDF limitation with embedded TTFs

## Verified PDF structure (PDFKit output)
- Subtype: CIDFontType2 (correct for TTF fonts)
- /W arrays: present (per-glyph widths from actual TTF metrics)
- /ToUnicode: present (copy/paste works)
- Raster /Image entries: 0 (purely text-based)
- Text operators: hex-encoded CID values (correct)
