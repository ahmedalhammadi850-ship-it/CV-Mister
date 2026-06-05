---
name: PDF Export approach
description: How PDF download works in CVBuilder — html-to-image visual capture + invisible text layer for ATS selectability.
---

## Architecture (current)
All PDF exports use **html-to-image + jsPDF** — pixel-perfect visual with fully selectable text.

### Stack
- **Visual layer**: `html-to-image` (`toCanvas`) at 2× pixel ratio — handles modern CSS (oklch, lch, lab) that html2canvas v1 crashes on
- **Text layer**: jsPDF v4 `doc.text(str, x, y, { renderingMode: 'invisible' })` — PDF text mode 3 (invisible on screen but selectable/copyable/ATS-readable)
- **html2canvas**: removed from `package.json` entirely

### Key rules
- **ALWAYS** use `{ renderingMode: 'invisible' }` — NOT `doc.internal.write('3 Tr')` (jsPDF v4 deprecated hack)
- For text-rect extraction: clone the `captureEl` to `position:fixed; top:0; left:-9999px; visibility:hidden` so the browser fully lays out the clone before calling `getClientRects()` on text nodes. The original element sits at `top:-9999px` (absolute) which is unreliable for rect extraction in some browsers.
- Always remove the clone in the `finally` block.
- `generateATSPdf` and `generateStyledPdf` in `atsPdfExport.js` are kept but no longer called by the main download handler.

**Why:** html2canvas v1 cannot parse oklch colors (Tailwind CSS v4 default) → crashes. html-to-image uses SVG foreignObject which supports all modern CSS. User explicitly wants `renderingMode:'invisible'` over the write hack.
