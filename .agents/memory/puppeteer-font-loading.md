---
name: Puppeteer headless font loading failure
description: Puppeteer on Replit Linux does NOT load <link> stylesheets reliably — document.fonts shows 0 entries, causing system-font fallback and ~200px height mismatch vs browser.
---

## Rule
Never rely on `<link rel="stylesheet">` for font loading in Puppeteer headless on Replit/Linux.

## Why
`waitUntil:"networkidle0"` in `page.setContent()` does NOT guarantee that `<link>` stylesheets are processed and their @font-face rules are registered in `document.fonts`. Diagnostic confirmed: `fonts loaded: 0, failed: 0` even after full font-wait evaluate. Chromium falls back to system fonts (DejaVu/Liberation on NixOS) which are ~20% wider than Inter → content measures ~200px taller → Preview=1 page but PDF=2 pages.

## How to Apply
In `_openPage()` (api/_lib/puppeteerPdf.js), AFTER `page.setContent()`:
1. Fetch font CSS server-side via Node.js `fetch('http://127.0.0.1:PORT/api/font-proxy?url=...')` — always works.
2. Rewrite relative `/api/font-file?url=` → `http://127.0.0.1:PORT/api/font-file?url=` (absolute URLs, no baseURL dependency).
3. Inject via `page.addStyleTag({ content: absoluteCss })` — guaranteed to register @font-face rules before the font-wait evaluate.

The `<link>` tag in the HTML can stay (belt-and-suspenders), but the `addStyleTag` injection is what actually loads fonts.

## Additional Fixes Applied (same session)
- `--font-render-hinting=slight` (was `none`) — reduces character-advance difference between headless Chromium and desktop Chrome on macOS/Windows.
- `PDF_BOTTOM_MARGIN = 0` (was 20) — eliminates 20px gap between preview rawBreak (1074px) and PDF rawBreak (1054px) that caused borderline 1→2 page jumps.
