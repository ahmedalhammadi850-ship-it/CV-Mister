---
name: Phantom-page DOM-safety fix
description: Why MIN_PHANTOM_PAGE alone cannot remove a sparse last page when content marginally overflows PAGE_H — and the correct DOM-inspection fix.
---

# Phantom-page sparse-last-page fix

## The rule
The phantom-page guard now uses **DOM inspection** to decide if it's safe to remove a trailing break — it only removes the break when no real text-bearing element has its bottom edge below the page cutoff line.

## Why
Scenario: total CV content = ~1180 px, PAGE_H = 1122 px.  
Phase 2 (heading-orphan fix) pulls the break back to ~1080 px (before the "Languages" heading).  
Last page content = 1180 − 1080 = 100 px < MIN_PHANTOM_PAGE (200) → phantom guard triggers.  
Old safety check: `totalHeight − prevBreakStart > prevPageVisibleH` → 1180 > 1122 → **blocked**.  
Result: Languages sits alone on a mostly-empty page 2.

The correct fix: instead of a blind pixel tolerance (CLIP_TOLERANCE), **query every text-bearing leaf element** and check if any has `bottom > cutoff + 4px`. If no real text crosses the cutoff, the overflow is purely template bottom-padding → safe to remove the break.

**Why NOT CLIP_TOLERANCE:** a fixed pixel tolerance (e.g. 60 px) can clip real content when a section has multiple lines extending past the cutoff. DOM inspection is exact.

## How to apply
- `MIN_PHANTOM_PAGE` = 200 (raised from 50) widens the trigger window for short last-page sections.
- Phantom guard replaces the old `if (overflow > 0) break` with a `.some()` walk over `p, span, li, h1-h6, address, td, th` checking `getBoundingClientRect().bottom - containerTop > cutoff + 4`.
- Both `src/components/builder/LivePreview.jsx` and `api/_lib/puppeteerPdf.js` must stay in sync (puppeteerPdf runs inside `page.evaluate()` so use `nodeType === 3` not `Node.TEXT_NODE`).
- No extra parameters need to be passed to `page.evaluate()` — container and containerTop are already in scope.
