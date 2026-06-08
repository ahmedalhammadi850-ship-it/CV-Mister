---
name: PDF guard-pixel hidden heading bug
description: Why the 8px backward-shift + variable guardPx in _buildDocument caused section headings and first lines to be hidden on page 2 of the PDF, and how it was fixed.
---

## The rule
In `api/_lib/atsReactRenderer.js` `_buildDocument()`, for pages 2+, use `translateY = Math.round(start)` — no backward shift, no white guard overlay.

**Why:**
The old code used `translateY = Math.floor(start) - 8` and `guardPx = Math.round(start) - translateY`.

Two cascading bugs:
1. When `start` has a fractional part ≥ 0.5 (which is common because Phase-4 line-boundary snap returns `rect.bottom - containerTop`, a sub-pixel float), `Math.round(start)` rounds up, making `guardPx = 9` instead of 8. The first content of page 2 (at inner-clip y = 8 + frac, where frac ≥ 0.5 → y = 8.5..9) falls within the 9px guard and is hidden behind the white overlay.
2. Even when guardPx = 8 correctly, the inner clip height `innerHeight = sliceHeight = end - start` only shows template y=start to y=end-8. The last 8px of each non-last page was silently clipped.

**How to apply:**
- Use `translateY = Math.round(start)` — content at `start` lands at inner-clip y≈0.
- Remove the guard overlay `<div>` entirely.
- `getBoundingClientRect()` returns the border box (borders included), so borders never start above `start`. Box-shadows may be cosmetically clipped but content is always visible.
- The MARGIN (48px) white zone at the top of each page-slice already provides visual separation between pages, exactly matching the live preview.
- Do NOT reintroduce the backward shift or guard without understanding this interaction.
