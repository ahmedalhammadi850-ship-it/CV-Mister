---
name: Phantom-page CLIP_TOLERANCE fix
description: Why MIN_PHANTOM_PAGE alone cannot remove a sparse last page when content marginally overflows PAGE_H — and the CLIP_TOLERANCE fix.
---

# Phantom-page CLIP_TOLERANCE

## The rule
When the phantom-page guard tries to remove a trailing break, it now allows removal if the resulting overflow of the previous page is ≤ `CLIP_TOLERANCE` (60 px), not just when it perfectly fits.

## Why
Scenario: total CV content = ~1180 px, PAGE_H = 1122 px.  
Phase 2 (heading-orphan fix) pulls the break back to ~1080 px (before the "Languages" heading).  
Last page content = 1180 − 1080 = 100 px < MIN_PHANTOM_PAGE (200) → phantom guard triggers.  
Old safety check: `totalHeight − prevBreakStart > prevPageVisibleH` → 1180 − 0 = 1180 > 1122 → **blocked**.  
Result: Languages sits alone on a mostly-empty page 2 even though the entire section (ending at ~1160 px) and template bottom-padding (1160–1180) are just barely over the page boundary.

The overflow (58 px) is exclusively template bottom-padding, not real content. Clipping it is invisible to the user.

## How to apply
- `CLIP_TOLERANCE = 60` defined as a constant in both `src/components/builder/LivePreview.jsx` and `api/_lib/puppeteerPdf.js` (must stay in sync).
- In `puppeteerPdf.js`, `CLIP_TOLERANCE` must be passed as an explicit parameter to `page.evaluate()` — variables defined outside the evaluate callback are not accessible inside it.
- Phantom guard condition changes from `if (overflow > 0) break` to `if (overflow > CLIP_TOLERANCE) break`.
- `MIN_PHANTOM_PAGE` was also raised from 50 → 200 to widen the trigger window for short last-page sections.
