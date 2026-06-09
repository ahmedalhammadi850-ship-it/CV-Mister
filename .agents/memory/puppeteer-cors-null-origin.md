---
name: Puppeteer CORS null-origin font block
description: Puppeteer Chromium sends "null" (string) as Origin header when loading @font-face sub-resources; standard !origin check misses it, blocking fonts and causing PDF text to use system fonts.
---

# Puppeteer CORS null-origin font block

## The Rule
In the Express CORS `isCorsAllowed()` function, always allow `origin === "null"` (the string) in addition to `!origin` (undefined/empty).

**Why:** When `page.addStyleTag()` injects CSS with `@font-face { src: url(http://127.0.0.1:PORT/api/font-file?...) }`, Chromium's renderer process fetches those font files. These sub-resource requests come from an opaque origin (sandboxed Chromium context, not a real webpage with an https:// URL), so Chromium sends the literal HTTP header `Origin: null`. In Express/Node, `req.headers.origin` is then the string `"null"` — which is truthy, so `!origin` returns false, and it gets blocked by CORS.

**Result of the block:** Fonts fall back to Linux system fonts (DejaVu/Liberation), which are ~20% wider than Inter/web fonts. Content measures ~200px taller in Puppeteer than in the browser. Page breaks land in the wrong place. Sections like "Projects" get pushed past the visible area of page 2 and disappear from the PDF.

**How to apply:** In `server/index.ts` `isCorsAllowed()`:
```javascript
if (!origin || origin === "null") return true; // same-origin, server-to-server, or Puppeteer Chromium
```

This is safe — `Origin: null` is only sent by local sub-resource requests (Puppeteer) or sandboxed iframes, never by a real cross-origin browser request.
