---
name: Phase 3 ancestor guard — unbreakable container boundary fix
description: When Phase 2 pulls bestBreak to a heading's top that is the first child of a break-inside:avoid item div, the whole section moves to page 2 as a block. Fixed by using strict less-than in unbreakableContainers filter.
---

# Phase 3 Ancestor Guard — Section Moves as a Block Bug

## The Rule
In Phase 3's `unbreakableContainers` filter, use **strict** `t < bestBreak - 2` (not `t <= bestBreak`).

**Why:** A container is "unbreakable" only if it has content already on page 1 (started before bestBreak). When Phase 2 pulls bestBreak to a heading's top, and the heading is the first child of a `break-inside:avoid` item div, that div's top equals bestBreak exactly. With `t <= bestBreak`, the div is incorrectly treated as "partly on page 1" and placed in unbreakableContainers → Phase 3 sees all its children as "inside unbreakable" → skips all of them → bestBreak stays at heading.top → entire section (heading + all items) moves to page 2 as one block.

**How to apply:** In BOTH `src/components/builder/LivePreview.jsx` and `api/_lib/puppeteerPdf.js`, Phase 3 unbreakableContainers filter:

```js
const unbreakableContainers = new Set(
  avoidEls.filter(el => {
    const r = el.getBoundingClientRect();
    const t = r.top    - containerTop;
    const b = r.bottom - containerTop;
    return t < bestBreak - 2 && b > rawBreak;  // ← strict <, not <=
  })
);
```

## Result after fix
- Phase 2 pulls bestBreak to heading.top (correct orphan protection)
- Phase 3 finds the item div is NOT in unbreakableContainers (it starts at bestBreak, not before it)
- Phase 3 greedily includes: heading → rule → project title (h3)
- Project description (if too long) stays on page 2 — line-by-line flow
- Heading is 20-50px above the clip boundary → no PDF clipping risk

## Files to keep in sync
- `src/components/builder/LivePreview.jsx` — Phase 3 unbreakableContainers filter
- `api/_lib/puppeteerPdf.js` — Phase 3 unbreakableContainers filter
