---
name: Phase 3 heading orphan bug — break-after:avoid stop guard
description: Phase 3 greedy fill advances bestBreak past break-after:avoid headings whose following content doesn't fit, stranding the heading at the page bottom where it gets clipped in PDF.
---

# Phase 3 Heading Orphan Bug

## The Rule
In Phase 3's for loop over `avoidPositions`, **break out immediately** when the element has `break-after: avoid` (or `pageBreakAfter: avoid`).

**Why:** Phase 3 greedily includes elements whose `bot <= rawBreak`. A section heading (`.cv-heading`, `break-after:avoid`) can fit before rawBreak but its following content (e.g. "English (Native)...") cannot. Phase 3 advances bestBreak to the heading's bottom, orphaning the heading at the very bottom of page 1 without its content. The heading then gets clipped in the PDF by the page-slice overflow:hidden. The heading is missing from both page 1 (clipped) and page 2 (translateY=heading.bot means heading is at inner-clip y<0).

**How to apply:** In BOTH `src/components/builder/LivePreview.jsx` and `api/_lib/puppeteerPdf.js`, Phase 3 for loop:

```js
for (const { top, bot, el } of avoidPositions) {
  // A break-after:avoid heading must NOT be stranded at the bottom of the
  // page without its content. Stop here — leave it on page 2 with content.
  const cs = getComputedStyle(el);
  if (cs.breakAfter === 'avoid' || cs.pageBreakAfter === 'avoid') break;

  if (top >= bestBreak - 2) {
    bestBreak = Math.max(bestBreak, bot);
  }
}
```

## Separate fix: unbreakableContainers strict < guard
Phase 3's `unbreakableContainers` filter uses **strict** `t < bestBreak - 2` (not `t <= bestBreak`).
This prevents a container starting exactly at bestBreak from being treated as "partly on page 1", which would block Phase 3 from filling any of its children. Both fixes must coexist.

## Files to keep in sync
- `src/components/builder/LivePreview.jsx` — Phase 3 for loop
- `api/_lib/puppeteerPdf.js` — Phase 3 for loop (inside page.evaluate callback)
