---
name: PDF font timing bug — breaks computed pre-font, HTML captured post-font
description: Root cause and fix for lines disappearing at page boundaries in PDF export across all templates.
---

# PDF Font Timing Bug — Lines Missing at Page Boundaries

## The Rule
`pageBreaks` and `captureEl.innerHTML` must ALWAYS come from the same DOM state. If breaks are computed before fonts load but HTML is captured after, lines near break boundaries silently disappear.

**Why:** Web fonts change character advance widths and line heights. A line at y=[breakAt-5, breakAt+10] pre-font may shift to y=[breakAt-3, breakAt+12] post-font. In the PDF:
- Page N's `overflow:hidden` at height=breakAt clips the line's bottom portion
- Page N+1's inner clip starts at y=breakAt (margin zone above is invisible), clipping the top portion
- Net result: the line is invisible on BOTH pages — appears "missing"

## How to Apply

**In `LivePreview.jsx`:**
- `breakDataRef.current.freshMeasure()` — async function exposed via the ref that:
  1. Awaits `document.fonts.ready` + loads all pending fonts
  2. Waits 2 rAF + 200ms for layout engine to apply font metrics
  3. Re-runs `computeSmartBreaks()` on the live DOM
  4. Returns `{ breaks, totalHeight, captureEl }` — all from the same post-font state
- The measurement `useEffect` now does a two-pass approach: fast first pass (immediate) for quick preview render, then second pass after fonts load for accurate breaks

**In `CVBuilder.jsx handleDownloadPDF`:**
- Call `freshMeasure()` first — this replaces both the old manual `document.fonts.ready` wait AND the stale `breakDataRef.current.breaks` read
- Use `freshData.captureEl.innerHTML` as `renderedHtml` (captured after the same font wait)
- Fallback: if `freshMeasure` is absent, use stale ref values (backward compat)

**In `puppeteerPdf.js _openPage`:**
- After font CSS injection: `page.waitForFunction(() => document.fonts.status === 'loaded', {timeout: 5000})`
- Then `await new Promise(r => setTimeout(r, 300))` — Chromium PDF compositor thread lag
- In-evaluate timeout increased from 150ms → 300ms

## What NOT to do
- Do NOT capture `pageBreaks` before `document.fonts.ready` — they will be computed with wrong metrics
- Do NOT capture `renderedHtml` and `pageBreaks` separately with different font states between them
- Do NOT skip the post-font remeasure thinking ResizeObserver will catch it — ResizeObserver only fires on bounding-box changes, not internal scrollHeight changes from font metric shifts on absolutely-positioned elements
