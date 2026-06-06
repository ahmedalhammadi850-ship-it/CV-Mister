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

`ALL_GOOGLE_FONTS_URL` had different font weight sets than `index.html` FONTS_URL:
- `Tajawal`: browser had `300;400;500;700`, renderer had `400;500;700;800`
- `Cairo`: browser had `300;400;600;700`, renderer had `400;600;700;800`
- `Noto Naskh Arabic`: browser had `400;500;600;700`, renderer had `400;600;700`

Different URLs → different Google Fonts CSS → different font files → different glyph metrics.

**Fix:** `ALL_GOOGLE_FONTS_URL` must be IDENTICAL to `FONTS_URL` in `index.html`. If either changes, update both simultaneously.

## Critical "DO NOT" rules

### ❌ DO NOT add `address { font-style: normal }` to the Puppeteer CSS reset
Tailwind v4 preflight's `*` selector only zeroes `margin`, `padding`, `border` — NOT `font-style`.
The browser UA stylesheet `address { font-style: italic }` is NOT overridden by Tailwind in the browser preview.
Therefore `<address>` renders italic in BOTH the browser AND Puppeteer — they match.
Adding `address { font-style: normal }` to the Puppeteer reset makes PDF ≠ Preview.

### ❌ DO NOT use font UA string without `Chrome/120` in font-proxy requests
The proxy sends `User-Agent: Mozilla/5.0 Chrome/120` to get woff2 files. Without this, Google Fonts returns older formats with different metrics.

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

## Why `page.goto()` vs `page.setContent(html, { baseURL })` are equivalent for fonts
Both resolve relative `<link href="/api/font-proxy?...">` to the base URL. CSS from an external stylesheet resolves its own `url()` relative to the stylesheet URL (not the document base), so `/api/font-file?url=...` in the proxy's CSS resolves to `http://localhost:PORT/api/font-file?url=...` correctly in both cases.
