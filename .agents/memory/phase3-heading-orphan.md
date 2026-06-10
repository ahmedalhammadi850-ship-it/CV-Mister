---
name: Phase 3 heading orphan bug
description: Phase 3 greedy fill pushes bestBreak past break-after:avoid headings, orphaning them at page bottom and hiding them in the PDF.
---

# Phase 3 Heading Orphan Bug

## The Rule
Phase 3's greedy fill loop must `break` immediately when it encounters an element with `break-after: avoid` or `pageBreakAfter: avoid`. Never advance bestBreak past such an element.

**Why:** BREAK_HEADING in templateUtils.js sets `breakAfter: 'avoid'` on section headings (h2). Phase 3 runs after Phase 2 and can advance bestBreak past the heading — orphaning it at the bottom of page 1 with no content. In the PDF this causes the heading to be visually clipped by overflow:hidden (appears missing), while its content starts at the top of page 2 with no heading label.

**How to apply:** In the Phase 3 `for` loop in both `src/components/builder/LivePreview.jsx` and `api/_lib/puppeteerPdf.js`:

```js
for (const { top, bot, el } of avoidPositions) {
  if (top >= bestBreak - 2) {
    const cs = getComputedStyle(el);
    if (cs.breakAfter === 'avoid' || cs.pageBreakAfter === 'avoid') break; // ← stop here
    bestBreak = Math.max(bestBreak, bot);
  }
}
```

## Symptom
Preview shows section heading (e.g. "PROJECTS") at the bottom of page 1 with content on page 2. PDF shows content on page 2 with NO heading — the heading is completely missing.

## Root Cause Chain
1. Phase 4 snaps bestBreak to last safe line before rawBreak (e.g. end of Skills section)
2. Phase 2 checks for orphaned headings: heading.bottom must be ≤ bestBreak — but heading is BELOW bestBreak so Phase 2 skips it
3. Phase 3 greedily includes avoidEls after bestBreak. The heading (height ≤ 35px → in avoidEls, not inside unbreakable container) gets included → bestBreak advances past heading
4. Heading is now between old-bestBreak and new-bestBreak → orphaned on page 1
5. In PDF, heading is at the very edge of page 1's overflow:hidden clip → invisible

## Files to keep in sync
- `src/components/builder/LivePreview.jsx` Phase 3 loop
- `api/_lib/puppeteerPdf.js` Phase 3 loop
