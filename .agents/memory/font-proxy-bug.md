---
name: Font proxy UA + Content-Type bug
description: Truncated User-Agent in font-proxy causes Google Fonts to return TTF instead of WOFF2; hardcoded font/woff2 Content-Type makes Chromium/Puppeteer silently reject all fonts → PDF renders with no custom fonts (text appears as boxes or system fallback).
---

## The Rule
The `/api/font-proxy` endpoint MUST use a full modern Chrome User-Agent string, and `/api/font-file` MUST detect the font format from the URL extension and return the matching Content-Type.

**Why:** Google Fonts CDN uses the User-Agent to decide which font format to serve. A truncated UA like `"Mozilla/5.0 Chrome/120"` is not recognized → CDN returns TTF. But the `font-file` endpoint was hardcoded to return `Content-Type: font/woff2`. Chromium sees TTF bytes declared as WOFF2 and silently rejects the font. All text in the PDF falls back to a system font that may not support Arabic script — characters render as squares or are missing entirely. The PDF downloads successfully (200 OK, valid PDF structure) so the error is invisible unless you open the file.

**How to apply:**
- `font-proxy`: use `"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"` → CDN returns WOFF2 URLs with `.woff2` extension.
- `font-file`: detect from URL: `.woff2` → `font/woff2`, `.ttf` → `font/ttf`, `.otf` → `font/otf`, `.woff` → `font/woff`. Default to `font/woff2` only when extension is absent.
- Symptom of regression: PDF file size drops significantly (e.g. Arabic PDF: 31KB with fonts vs ~12KB without) and fonts are missing when opened.
