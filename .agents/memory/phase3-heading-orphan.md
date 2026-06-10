---
name: Phase 3 heading orphan bug
description: Phase 3 greedy fill pushes bestBreak past break-after:avoid headings, orphaning them at page bottom and hiding them in the PDF.
---

# Phase 3 Heading Orphan Bug

## The Rule
In Phase 3's greedy fill loop, when encountering an element with `break-after:avoid` (a section heading):
- **Allow** it if there is at least one more avoidEl after it in `avoidPositions` (so content follows the heading on the same page)
- **Stop (`break`)** if the heading is the last element — it would be stranded alone at the page bottom

**Why:** BREAK_HEADING in templateUtils.js sets `breakAfter: 'avoid'` on h2 section headings. Phase 3 can greedily push bestBreak past the heading, leaving it orphaned at the bottom of page 1 with its content on page 2. In the PDF this causes the heading to be clipped by overflow:hidden (appears missing). Correct behavior: heading may sit at the page bottom only when at least one line of content follows it there.

**How to apply:** In the Phase 3 `for` loop in BOTH files:

```js
// src/components/builder/LivePreview.jsx  AND  api/_lib/puppeteerPdf.js
for (let _i = 0; _i < avoidPositions.length; _i++) {
  const { top, bot, el } = avoidPositions[_i];
  if (top >= bestBreak - 2) {
    const cs = getComputedStyle(el);
    if (cs.breakAfter === 'avoid' || cs.pageBreakAfter === 'avoid') {
      // Only include heading if something follows it on this page
      const hasFollowingContent = _i + 1 < avoidPositions.length;
      if (!hasFollowingContent) break;   // heading would be last → push to page 2
    }
    bestBreak = Math.max(bestBreak, bot);
  }
}
```

## Symptom
Preview shows section heading (e.g. "PROJECTS") at the bottom of page 1 with content on page 2. PDF shows content on page 2 with NO heading — the heading is completely missing.

## Root Cause Chain
1. Phase 4 snaps bestBreak to last safe line before rawBreak (e.g. end of Skills section)
2. Phase 2 checks for orphaned headings: heading.bottom must be ≤ bestBreak — but heading is BELOW bestBreak so Phase 2 skips it
3. Phase 3 greedily includes avoidEls after bestBreak. The heading (height ≤ 35px → in avoidEls) gets included → bestBreak advances past heading to heading.bot
4. If heading.bot ≈ rawBreak, any Puppeteer font-metric difference causes heading to overflow the clip in the PDF → heading invisible

## Desired behaviour
Heading MAY be at the bottom of a page as long as at least one more avoidEl (content line) follows it on that page. If heading is the last avoidEl that fits, push it to page 2.

## Files to keep in sync
- `src/components/builder/LivePreview.jsx` Phase 3 loop
- `api/_lib/puppeteerPdf.js` Phase 3 loop
