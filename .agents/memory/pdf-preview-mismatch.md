---
name: PDF vs Preview mismatch — root cause analysis
description: Complete analysis of why Puppeteer PDF differs from browser preview, and all fixes applied. Includes critical "do NOT" rules learned from mistakes.
---

# PDF vs Preview Mismatch — Complete Root Cause Analysis

## Architecture context
- Browser preview: React template rendered at 794px in a hidden div, inside the full app with Tailwind CSS active.
- PDF: Client sends `captureEl.innerHTML` → server wraps in bare HTML doc → Puppeteer renders → PDF.
- The bare Puppeteer doc has NO Tailwind → browser UA stylesheet defaults apply where Tailwind would have overridden them.

## Root Cause 1: Missing HTML element reset in Puppeteer document
**File:** `api/_lib/atsReactRenderer.js` — `baseStyles` in `_buildDocument()`

Tailwind v4 preflight (`tailwindcss/preflight.css`) includes:
```css
*, ::after, ::before, ::backdrop { box-sizing: border-box; margin: 0; padding: 0; border: 0 solid; }
h1-h6 { font-size: inherit; font-weight: inherit; }
```
Without this, h1-h6 get browser-default `margin: 0.67em 0`, `p` gets `margin: 1em 0`, etc.
With 8-10 heading elements per CV, this accumulates to 100+ px of phantom spacing.

**Fix:** Add exact Tailwind v4 preflight rules to `baseStyles`.

## Root Cause 2: Font loading via external googleapis.com (unreliable in Replit)
**Files:** `api/_lib/atsReactRenderer.js` + `api/_lib/puppeteerPdf.js`

Browser loads fonts via `/api/font-proxy` (same-origin, 100% reliable).
Puppeteer was fetching directly from `fonts.googleapis.com` — external network, potentially blocked in Replit sandbox → fallback to Arial → completely different text metrics → all layout measurements wrong.

**Fix A** (`atsReactRenderer.js`): Change font link from absolute `fonts.googleapis.com` URL to relative `/api/font-proxy?url=...`.
**Fix B** (`puppeteerPdf.js`): Add `baseURL: 'http://127.0.0.1:PORT'` to `page.setContent()` so relative URLs resolve to localhost.

The font-proxy returns CSS with `/api/font-file?url=...` (relative) which also resolves via baseURL. All font traffic stays on localhost.

## Root Cause 3: Font URL mismatch between browser and Puppeteer
**File:** `api/_lib/atsReactRenderer.js`

`ALL_GOOGLE_FONTS_URL` had different font weight sets than `index.html` FONTS_URL.

**Fix:** `ALL_GOOGLE_FONTS_URL` must be IDENTICAL to `FONTS_URL` in `index.html`. If either changes, update both simultaneously.

## Root Cause 4: `computeSmartBreaks` only checked inline styles, missed CSS class-based break rules
**File:** `src/components/builder/LivePreview.jsx`

`computeSmartBreaks` used `el.style.breakInside` (inline style object) which misses elements
styled via CSS classes like `.cv-section { break-inside: avoid }`. The page break calculation
therefore ignored section boundaries defined by class names → wrong page cut positions.

**Fix:** Changed to `getComputedStyle(el).breakInside` to catch both inline AND class-based break rules.

## Root Cause 5: Missing `.cv-section`, `.cv-item`, `.cv-heading` CSS rules in Puppeteer document
**File:** `api/_lib/atsReactRenderer.js` — `baseStyles`

`src/index.css` defines:
```css
.cv-section, .cv-item { break-inside: avoid; page-break-inside: avoid; }
.cv-heading { break-after: avoid; page-break-after: avoid; }
```
Templates use these class names for page-break control. Without these rules in Puppeteer,
the PDF ignores section break-avoidance → sections get split across pages mid-content.

**Fix:** Added these CSS class rules to `baseStyles` in `_buildDocument()`.

## Root Cause 6: Fonts not awaited in browser before capturing innerHTML
**File:** `src/components/builder/CVBuilder.jsx` — `handleDownloadPDF`

`captureEl.innerHTML` was captured without waiting for fonts to fully load.
The off-screen element at `top: -9999px` may still have fallback font metrics
(different character widths → different text wrapping → different total height → page break mismatch).

**Fix:** Added `await document.fonts.ready` + force-load all pending font faces + 80ms
layout settle time before capturing `captureEl.innerHTML`.

## Root Cause 7: Fixed 1122px slice height → content duplicated across PDF pages
**File:** `api/_lib/atsReactRenderer.js` — multi-page `pageContainers` builder

Every page-slice was hardcoded to `height: 1122px`. With page breaks less than 1122px apart
(e.g. break at y=900), slice 1 (translateY=0, h=1122) showed y=0→1122, and slice 2
(translateY=-900, h=1122) showed y=900→2022. Content y=900→1122 appeared in BOTH PDF
pages — a visible duplicate strip.

The browser preview hides this overlap with white overlays (bottom overlay on non-last pages,
top overlay on non-first pages). The PDF has no such overlays → content duplication was visible.

**Fix:** Set slice height dynamically = `pageBreaks[i] - pageBreaks[i-1]` (the exact gap between
consecutive break points). Each slice shows only its own content band. The remainder of the A4
page (1122px - sliceHeight) becomes white space — matching the browser's white overlay behavior.
Removed `height: 1122px` from `.page-slice` CSS; height now set via inline style per slice.

## Critical "DO NOT" rules

### ❌ DO NOT add `address { font-style: normal }` to the Puppeteer CSS reset
Tailwind v4 preflight's `*` selector only zeroes `margin`, `padding`, `border` — NOT `font-style`.
The browser UA stylesheet `address { font-style: italic }` is NOT overridden by Tailwind in the browser preview.
Therefore `<address>` renders italic in BOTH the browser AND Puppeteer — they match.
Adding `address { font-style: normal }` to the Puppeteer reset makes PDF ≠ Preview.

### ❌ DO NOT use font UA string without `Chrome/120` in font-proxy requests
The proxy sends `User-Agent: Mozilla/5.0 Chrome/120` to get woff2 files. Without this, Google Fonts returns older formats with different metrics.

### ❌ DO NOT check `el.style` for break detection — use `getComputedStyle(el)`
`el.style` only sees inline styles. CSS class-based rules (`.cv-section`, etc.) are invisible to `el.style`.

## Tailwind v4 preflight — what it actually resets (verified from source)
```
*, ::before, ::after        → margin:0; padding:0; border:0 solid; box-sizing:border-box
html                        → line-height:1.5
h1-h6                       → font-size:inherit; font-weight:inherit
a                           → color:inherit; text-decoration:inherit
b, strong                   → font-weight:bolder
ol, ul, menu                → list-style:none
table                       → text-indent:0; border-collapse:collapse
img/svg/video/canvas/…      → display:block; vertical-align:middle
```

## What Tailwind v4 does NOT reset (UA stylesheet survives)
- `address { font-style: italic }` — UA default survives in both environments
- `summary { display: list-item }` — added explicitly in preflight (not a UA default)
