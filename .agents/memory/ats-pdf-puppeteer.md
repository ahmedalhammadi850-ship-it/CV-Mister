---
name: ATS PDF — Puppeteer + HTML template
description: ATS PDF generation pipeline and the exact metric values that must mirror templateUtils.js for preview/PDF parity.
---

# ATS PDF Generation

## Pipeline
`POST /api/pdf/ats` → `buildAtsHtml()` (atsHtmlTemplate.js) → `generatePdfFromHtml()` (puppeteerPdf.js) → PDF with selectable CIDFontType2 text.

**Why:** jsPDF coordinate-based drawing cannot replicate CSS flexbox layout, letter-spacing, italic, or accurate line-height. Puppeteer renders the same HTML/CSS engine as the browser preview, giving ~98% visual fidelity.

## Metric values — must match templateUtils.js exactly

| Key | small | medium | large |
|-----|-------|--------|-------|
| font-size name | 18pt | 20pt | 22pt |
| font-size heading | 12pt | 14pt | 16pt |
| font-size body | 10pt | 11pt | 13pt |
| font-size meta | 9pt | 10pt | 11pt |

| Padding key | Value |
|-------------|-------|
| narrow | 24pt 28pt |
| medium | 36pt 42pt |
| wide | 48pt 56pt |

| Line height | LTR | RTL |
|-------------|-----|-----|
| compact | 1.20 | 1.50 |
| normal | 1.40 | 1.80 |
| relaxed | 1.70 | 2.10 |

| Section spacing | Value |
|-----------------|-------|
| compact | 6pt |
| medium | 14pt |
| relaxed | 22pt |

## Other CSS rules matching the React preview
- Section heading letter-spacing: `0.08em`
- Section rule thickness: `1.5px` (not 2px)
- Header border: on `.cv-contact` element (not `.header` wrapper)
- Interests: render as flex-wrap tag chip spans, not dot-separated text

## How to apply
Any future change to templateUtils.js SIZES, PADDING, LINE_HEIGHT, or SECTION_MT must be mirrored in the FONT_SIZES, PAGE_PADDING, LINE_HEIGHTS, and SECTION_MARGINS constants in atsHtmlTemplate.js.
