---
name: PDF Export — print-based for non-ATS templates
description: Why and how PDF export was changed from html-to-image screenshot to window.print() for non-ATS templates.
---

## Rule
Non-ATS (visual/designer) templates export PDF using `window.print()` via a `#cv-print-root` DOM node. ATS templates continue to use `generateATSPdf` (jsPDF text-based).

## Why
The previous approach screenshotted the CV with html-to-image → JPEG, then overlaid an invisible jsPDF text layer using `renderingMode: 'invisible'`. The invisible text used Helvetica metrics but the visual fonts (Plus Jakarta Sans, Tajawal, etc.) have different advance widths, so click targets misaligned. Result: users couldn't reliably select text in the downloaded PDF.

## How to apply
- `CVBuilder.jsx` `handleDownloadPDF`: after ATS early-return, clone `breakDataRef.current.captureEl`, reset positioning styles (`position: relative, top/left: 0`), insert as child of a `div#cv-print-root` appended to `<body>`, call `window.print()`, await `afterprint` event, then remove the element.
- `src/index.css` `@media print`: `#cv-print-root` uses `position: static` (NOT fixed) so multi-page content flows correctly across print pages. `#cv-print-root > div` gets `width: 210mm` (= 794px at 96dpi, matching template width).
- `body > *:not(#cv-print-root) { display: none }` hides the rest of the app during print.
- `print-color-adjust: exact` preserves template colors/backgrounds.
- The captureEl (`contentRef.current` in LivePreview) is a hidden off-screen div (794px wide) containing the raw template HTML with no scale transforms — perfect source for print.
