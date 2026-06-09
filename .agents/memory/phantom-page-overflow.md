---
name: Phantom-page guard overflow clip bug
description: Removing a phantom break can make the preceding page exceed its visible height, clipping real content from the PDF.
---

# Phantom-page guard overflow clip bug

## The Rule
Before removing a break in the phantom-page guard, always verify that doing so will NOT cause the preceding page to exceed its visible height (`PAGE_H - pageTopMargin`). If it would overflow, keep the break.

**Why:** When content is just over one A4 page tall (e.g. 1125px when PAGE_H = 1122px), the algorithm correctly adds a break (say at y=1080). The resulting "last page" has only 45px of content — less than MIN_PHANTOM_PAGE (50). The guard removes the break. Now there's only 1 page with 1125px of content in a 1122px (or 1074px) container → the bottom 3–50px of content is silently clipped and missing from the PDF.

**How to apply:** In both `src/components/builder/LivePreview.jsx` (`computeSmartBreaks`) and `api/_lib/puppeteerPdf.js` (`measureBreaks`), the phantom guard loop must check:

```javascript
while (breaks.length > 0 && totalHeight - breaks[breaks.length - 1] < MIN_PHANTOM_PAGE) {
  const prevBreakStart    = breaks.length >= 2 ? breaks[breaks.length - 2] : 0;
  const isPrevFirstPage   = prevBreakStart === 0;
  const prevPageTopMargin = isPrevFirstPage ? 0 : MARGIN;
  const prevPageVisibleH  = PAGE_H - prevPageTopMargin;
  if (totalHeight - prevBreakStart > prevPageVisibleH) break; // ← safety check
  breaks.pop();
  // (also pop pageReport in puppeteerPdf.js)
}
```

The `totalSliceHeight = Math.min(rawTotalSliceHeight, 1122)` cap in `_buildDocument` means any overflow beyond `innerHeight = 1074` is silently clipped in the PDF — so the guard safety check is the only reliable fix.
