---
name: PDF missing lines — root cause and definitive fix
description: Why lines disappear at page ends in PDF, and the single architectural fix.
---

# PDF Missing Lines at Page Boundaries — Root Cause & Fix

## The Actual Root Cause

**NOT font timing.** The timing fix (freshMeasure) helps preview accuracy but does not fix the PDF clip bug.

**The real cause:** `_buildDocument` used `overflow:hidden` at `height = sliceHeight` (exact break pixel) on the inner content container. Chromium on Linux (Puppeteer) renders fonts with different sub-pixel hinting than Chrome on Windows/macOS (the user's browser). The same line of text can be 1–5 px taller in Puppeteer. `overflow:hidden` at the exact break boundary clips that extra rendering → line disappears.

## Evidence from Code

**LivePreview.jsx (the preview — correct behavior):**
```
// Lines 843–853: uses white OVERLAY, not overflow:hidden
const overlayH = (PAGE_H * scale) - contentEndInFrame;
return <div style={{position:'absolute', bottom:0, height:overlayH, background:'#fff'}} />
```
Preview never clips content — it COVERS it with a white div.

**Old atsReactRenderer.js (the bug):**
```
// Line 446 (old): hard overflow:hidden at exact break pixel
<div style="height:${innerHeight}px; overflow:hidden">
```
PDF clips at the exact boundary → 1–5 px rendered taller → cut off.

## The Fix (Single Change — atsReactRenderer.js `_buildDocument`)

Replace `overflow:hidden` on inner content containers with white overlay divs that mirror LivePreview exactly:

**Page 1 (non-last):** Always 1122px height (not sliceHeight). White bottom overlay from `sliceHeight` to 1122.

**Pages 2+ (non-last):** Remove `overflow:hidden` from inner div entirely. Outer `.page-slice` stays at 1122px with `overflow:hidden`. Two white overlays:
- Top: `0 → MARGIN` (hides prev-page content bleed)  
- Bottom: `MARGIN+sliceHeight → 1122` (hides next-page content bleed)

**Pages 2+ (last):** Keep overflow:hidden — `LAST_PAGE_SSR_BUFFER = 200px` already extends clip well past any drift.

**Single-page documents:** Unchanged (no multi-page slicing).

## Why This Works

Content near the break boundary is now COVERED by white, not CUT by overflow. A line rendered 5px taller in Puppeteer still appears (it's in the inner container) but is hidden by the white overlay — not sliced through.

## What NOT to do

- Do NOT use `overflow:hidden` on any inner content container for non-last pages — this is the bug.
- Do NOT try to compute breaks differently or wait longer for fonts — the fundamental issue is architectural (cut vs. cover).
- Do NOT add pixel buffers to break positions — this changes the visible layout without solving the clipping.
- The outer `.page-slice` MUST keep `overflow:hidden` at 1122px to prevent content from one slice leaking onto the next PDF page.
