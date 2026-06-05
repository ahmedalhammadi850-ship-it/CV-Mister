---
name: PDF Export approach
description: How PDF download works in CVBuilder — html-to-image visual capture + invisible text layer for ATS selectability.
---

## Architecture (current)
All PDF exports use **html-to-image + jsPDF** — pixel-perfect visual with fully selectable text.

### Stack
- **Visual layer**: `html-to-image` (`toCanvas`) at 2× pixel ratio — handles modern CSS (oklch, lch, lab) that html2canvas v1 crashes on
- **Text layer**: jsPDF v4 `doc.text(str, x, y, { renderingMode: 'invisible' })` — PDF text mode 3 (invisible on screen but selectable/copyable/ATS-readable)

### Key rules
- **ALWAYS** use `{ renderingMode: 'invisible' }` — NOT `doc.internal.write('3 Tr')` (jsPDF v4 deprecated hack)
- For image capture: clone captureEl to `position:fixed; top:0; left:0` (viewport origin) with a white overlay at z-index 999997 on top. Do NOT place at `-10000px` — html-to-image produces a blank canvas when element is off-screen.
- For text-rect extraction: clone captureEl to `position:fixed; top:0; left:0; visibility:hidden` so browser fully lays out the clone before calling `getClientRects()` on text nodes.
- Always remove clones in the `finally` block.
- Tailwind v4 uses Constructable Stylesheets invisible to html2canvas — that's why html-to-image is used (inlines computed styles per element).

**Why:** html2canvas v1 cannot read Tailwind v4 Constructable Stylesheets → blank white canvas. html-to-image uses SVG foreignObject + getComputedStyle inlining which works correctly.
