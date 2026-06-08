---
name: Pagination MARGIN dead-zone fix
description: Why rawBreak for pages 2+ must use PAGE_H-MARGIN, not PAGE_H — and the related phantom-guard and slice-cap fixes.
---

## The Rule

In `computeSmartBreaks` (LivePreview.jsx) and `measureBreaks` (puppeteerPdf.js), `rawBreak` and the while-loop exit condition must account for the top MARGIN on pages 2+:

```javascript
const isFirstPage   = pageStart === 0;
const pageTopMargin = isFirstPage ? 0 : MARGIN;   // MARGIN = 48 px
const pageVisibleH  = PAGE_H - pageTopMargin;       // 1122 for p1, 1074 for p2+
// exit condition:
if (pageStart + pageVisibleH >= totalHeight) break;
// rawBreak:
const rawBreak = pageStart + pageVisibleH - BOTTOM_BLANK;
// = 1107 for p1, pageStart+1059 for p2+
```

**Why:** Page 2+ in the preview renders with `clipStart = start - MARGIN`. The A4 frame (height=1122px) places content at `top: -(clipStart * scale)` with a 48px white MARGIN overlay. Effective visible content area = 1122 − 48 = 1074 px. Using `rawBreak = pageStart + PAGE_H − BOTTOM_BLANK = pageStart + 1107` (the old formula) allowed the break algorithm to place content in the range `pageStart+1074` to `pageStart+1107` — a 33 px dead zone that is INVISIBLE in both preview (clipped by frame overflow:hidden) and PDF (clipped by inner-clip height after the MARGIN offset).

**How to apply:** Any time you touch the break algorithm loop or rawBreak calculation, use `pageVisibleH = PAGE_H - (pageStart === 0 ? 0 : MARGIN)` as the per-page available height. Apply the same formula to `fixSplitBreak` and `analyzeBreakQuality`.

## Related fixes applied at the same time

### MIN_PHANTOM_PAGE: 120 → 50
`MIN_PHANTOM_PAGE = 120` was too aggressive — it removed valid page breaks whenever the last page had < 120 px of content. Because rawBreak for pages 2+ is now 48 px earlier (1059 vs 1107 from pageStart), the remaining content on the last page is correspondingly smaller, making the old 120 px threshold even more likely to fire incorrectly. Set to 50 px — enough to filter CSS bottom-padding artefacts (typically ≤ 30 px) while keeping real content. Must stay in sync between LivePreview.jsx and puppeteerPdf.js.

### totalSliceHeight cap in atsReactRenderer.js
`_buildDocument()` now caps `totalSliceHeight = Math.min(rawTotalSliceHeight, 1122)` for **all** pages, not just the last. With the fixed rawBreak, the primary path guarantees `sliceHeight ≤ 1059` for non-last pages so `totalSliceHeight ≤ 1107` and the cap is a no-op. For the fallback Puppeteer-measured path the cap prevents an overflowing A4 slice from pushing content into a spurious blank extra PDF page.

### Phantom guard added to puppeteerPdf.js measureBreaks
The fallback path now mirrors LivePreview.jsx's phantom guard (added inside `page.evaluate` before `return`). MIN_PHANTOM_PAGE is passed as a parameter to the evaluate callback.
