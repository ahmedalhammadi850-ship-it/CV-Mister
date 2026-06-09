---
name: Phase 3 ancestor guard — split container bug
description: Phase 3 greedy fill splits break-inside:avoid containers by including sub-elements piecemeal, causing section headings+titles to appear on page 1 while descriptions appear orphaned on page 2.
---

# Phase 3 ancestor guard — split container bug

## The Rule
In Phase 3 (greedy forward fill) of `computeSmartBreaks`, before including a sub-element, check if any of its ancestors is a `break-inside: avoid` container that is too large to fit on page 1 (ancestor.bot > rawBreak). If yes, skip that element.

**Why:** Phase 1 pulls the break back to the TOP of a large `break-inside:avoid` container (e.g., a project card containing heading + title + description). Phase 3 then greedily pushes the break forward by including "complete" sub-elements of that container — the heading (fits) and the title (fits) — up to rawBreak. This effectively SPLITS the container: heading and title go to page 1, description goes to page 2. The user sees a section title on page 1 with no content below it, and a floating description on page 2 with no heading above it.

In ModernTemplate, the Projects section structure is:
```
<div style={BREAK_ITEM}>                    ← break-inside:avoid (whole card)
  <div style={BREAK_HEADING}>Projects •</div> ← break-after:avoid (heading)
  <h3>{title}</h3>
  <BulletDesc>{description}</BulletDesc>
</div>
```
Phase 1 correctly pulls to card top. Phase 3 (without the fix) then includes heading+title, splitting the card.

**How to apply:** In both `src/components/builder/LivePreview.jsx` and `api/_lib/puppeteerPdf.js`, Phase 3 builds a Set of "unbreakable containers" (break-inside:avoid elements whose bot > rawBreak), then filters them out of avoidPositions via an `isInsideUnbreakable(el)` ancestor walk. The fix is identical in both files and must stay in sync.

Key code pattern:
```javascript
const unbreakableContainers = new Set(
  avoidEls.filter(el => {
    const r = el.getBoundingClientRect();
    const t = r.top - containerTop, b = r.bottom - containerTop;
    return t <= bestBreak && b > rawBreak;
  })
);
const isInsideUnbreakable = (el) => {
  let p = el.parentElement;
  while (p && p !== container) {
    if (unbreakableContainers.has(p)) return true;
    p = p.parentElement;
  }
  return false;
};
// Then add !isInsideUnbreakable(el) to the avoidPositions filter
```
