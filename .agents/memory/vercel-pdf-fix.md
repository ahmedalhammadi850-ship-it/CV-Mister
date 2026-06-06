---
name: Vercel PDF — Puppeteer + SSR bundle fix
description: Why Vercel produced primitive PDFs and the full fix applied (sparticuz chromium + esbuild SSR bundle + direct font URLs).
---

# Vercel PDF — Root Cause and Fix

## Root Cause
`api/[...path].js` (Vercel's monolithic serverless handler) routed `/api/pdf/ats`
to `atsServerPdf.js` (jsPDF text-only renderer).  jsPDF only outputs plain text —
no colors, no sidebar, no visual formatting.  Meanwhile, Replit's `server/index.ts`
routes the same endpoint to `api/pdf/ats.js` which uses Puppeteer + React SSR.

## Three Sub-Problems on Vercel

### 1. No Chromium binary
Vercel serverless functions don't install Chromium.  `puppeteerPdf.js` used
`which chromium` which would return nothing.

**Fix:** `@sparticuz/chromium-min@^132.0.0` — downloads a compressed Chromium
to `/tmp` on first cold-start.  Detect via `process.env.VERCEL`.

```javascript
if (process.env.VERCEL) {
  const chromium = (await import("@sparticuz/chromium-min")).default;
  executablePath = await chromium.executablePath(SPARTICUZ_CHROMIUM_URL);
}
```

### 2. Node.js can't import raw JSX files
Vercel's Node.js runtime rejects `.jsx` imports.  `atsReactRenderer.js` did
`await import(fullPath)` for each `.jsx` template.

**Fix:** esbuild pre-compiles all templates into `dist-ssr/templates.js` as part
of the Vercel build.  `atsReactRenderer.js` imports from the bundle when `VERCEL`.

- Entry: `api/_lib/ssrBundle.js` (re-exports all templates by name)
- Script: `scripts/buildSsr.mjs` (esbuild, platform:node, jsx:automatic)
- Build command in `package.vercel.json`: `node scripts/buildSsr.mjs && npx vite build`
- Output: `dist-ssr/templates.js` (~732KB, already in .gitignore)
- Export names = filename without `.jsx` (e.g. `ATSCleanTemplate`)

### 3. Font proxy URL fails on Vercel
HTML used `/api/font-proxy?url=...` (relative URL) resolved via
`baseURL: http://127.0.0.1:PORT`.  On Vercel there's no local server → fonts
fail → fallback fonts → broken layout.

**Fix:** On Vercel, use the absolute Google Fonts URL directly (Chromium on
Vercel has full internet access, unlike some Replit sandboxes).  No baseURL
is needed since all font URLs are absolute.

```javascript
// atsReactRenderer.js _buildDocument()
const fontLinks = process.env.VERCEL
  ? `<link href="${ALL_GOOGLE_FONTS_URL}" rel="stylesheet" />`
  : `<link href="/api/font-proxy?url=..." rel="stylesheet" />`;

// puppeteerPdf.js generatePdfFromHtml()
if (!process.env.VERCEL) {
  setContentOpts.baseURL = `http://127.0.0.1:${PORT}`;
}
```

## Files Changed
- `api/[...path].js` — PDF route now uses Puppeteer + React SSR (not jsPDF)
- `api/_lib/puppeteerPdf.js` — sparticuz Chromium on Vercel, conditional baseURL
- `api/_lib/atsReactRenderer.js` — bundle loading on Vercel, absolute font URL
- `api/_lib/ssrBundle.js` (new) — esbuild entry re-exporting all templates
- `scripts/buildSsr.mjs` (new) — esbuild compilation script
- `package.vercel.json` — added `@sparticuz/chromium-min`, `puppeteer-core`, `esbuild`
- `vercel.json` — added `functions."api/[...path].js".maxDuration: 60`

## Critical Notes
- `@sparticuz/chromium-min` version in `package.vercel.json` must stay in sync
  with `SPARTICUZ_CHROMIUM_URL` in `puppeteerPdf.js` (both v132).
- `dist-ssr/templates.js` is .gitignored — built at Vercel deploy time.
- Vercel Pro plan required for `maxDuration: 60` (hobby plan max is 10s, which
  is too short for cold-start PDF generation including Chromium download).
- On Replit, nothing changes — system Chromium + font-proxy localhost path.
- ALL_GOOGLE_FONTS_URL must still stay in sync with index.html FONTS_URL.
