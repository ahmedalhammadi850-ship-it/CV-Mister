---
name: Phase 3 heading orphan / PDF clip buffer
description: Section headings disappear in the PDF because the overflow:hidden clip cuts them at the exact break boundary. Fixed with CLIP_BUFFER in _buildDocument.
---

# Section Heading Disappears in PDF

## Root Cause
The smart-break algorithm (Phase 3 greedy fill) sets `bestBreak = heading.bottom` — the break falls right on the bottom edge of the heading.  `_buildDocument` then creates an `overflow:hidden` clip with `height = bestBreak`.

Pass 1 (measureBreaks) and Pass 2 (generatePdfFromHtml) run in the same Chromium process, but sub-pixel font hinting can shift an element's rendered bottom by 1-3 px between the two passes.  If the heading renders 2 px taller in Pass 2 than in Pass 1, its bottom falls just outside the clip → heading is invisible in the PDF.

## Fix: CLIP_BUFFER = 4 px in _buildDocument (atsReactRenderer.js)
Add 4 px to the clip height of every **non-last** page:

- **Page 1** `.page-slice` height: `sliceHeight + CLIP_BUFFER`
- **Pages 2+** inner clip height: derived from `totalSliceHeight = sliceHeight + MARGIN + CLIP_BUFFER`

4 px is larger than any realistic hinting drift, yet safely within the 15 px `BOTTOM_BLANK` reserved zone, so no next-page content ever bleeds through.

**Why not apply to last page?** Last page already has `LAST_PAGE_SSR_BUFFER = 200 px`, which is more than enough.

## What NOT to do
- Do NOT change Phase 3's loop to skip / stop at `break-after:avoid` headings — that pushes the entire section to the next page and breaks the line-by-line flow the user expects.
- Do NOT use browser-measured breaks for the PDF — Puppeteer must measure its own breaks (Pass 1) because Linux/Windows font metrics differ by 30-150 px per page.

## Files changed
- `api/_lib/atsReactRenderer.js` — `CLIP_BUFFER = 4` added near top of `pageContainers` map, applied to `singleHeight` (page 1) and `rawTotalSliceHeight` (pages 2+).
