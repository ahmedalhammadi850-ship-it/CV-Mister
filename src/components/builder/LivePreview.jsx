import { useCV } from '../../context/useCV';
import { useAuth } from '../../context/AuthContext';
import ModernTemplate from '../../templates/ModernTemplate';
import ClassicTemplate from '../../templates/ClassicTemplate';
import CreativeTemplate from '../../templates/CreativeTemplate';
import MinimalTemplate from '../../templates/MinimalTemplate';
import ExecutiveTemplate from '../../templates/ExecutiveTemplate';
import ATSCleanTemplate from '../../templates/ATSCleanTemplate';
import ATSProTemplate from '../../templates/ATSProTemplate';
import ATSSimpleTemplate from '../../templates/ATSSimpleTemplate';
import ATSBoldTemplate from '../../templates/ATSBoldTemplate';
import ATSCompactTemplate from '../../templates/ATSCompactTemplate';
import ATSModernTemplate from '../../templates/ATSModernTemplate';
import ATSHarvardTemplate from '../../templates/ATSHarvardTemplate';
import ATSCenterTemplate from '../../templates/ATSCenterTemplate';
import ATSElegantTemplate from '../../templates/ATSElegantTemplate';
import PrestigeTemplate from '../../templates/PrestigeTemplate';
import ClassicSerifTemplate from '../../templates/ClassicSerifTemplate';
import AtlanticBlueTemplate from '../../templates/AtlanticBlueTemplate';
import MercuryFlowTemplate from '../../templates/MercuryFlowTemplate';
import EditorialRuleTemplate from '../../templates/EditorialRuleTemplate';
import SidebarLightTemplate from '../../templates/SidebarLightTemplate';
import ArabicNavyTemplate from '../../templates/ArabicNavyTemplate';
import ArabicTealSidebarTemplate from '../../templates/ArabicTealSidebarTemplate';
import ArabicProTemplate from '../../templates/ArabicProTemplate';
import ArabicSlateSidebarTemplate from '../../templates/ArabicSlateSidebarTemplate';
import ArabicModernTemplate from '../../templates/ArabicModernTemplate';
import ArabicCardTemplate from '../../templates/ArabicCardTemplate';
import ArabicEliteTemplate from '../../templates/ArabicEliteTemplate';
import ArabicWaveTemplate from '../../templates/ArabicWaveTemplate';
import ArabicLuxeTemplate from '../../templates/ArabicLuxeTemplate';
import EnglishHorizonTemplate from '../../templates/EnglishHorizonTemplate';
import ArabicZafirTemplate from '../../templates/ArabicZafirTemplate';
import EnglishApexTemplate from '../../templates/EnglishApexTemplate';
import TealProTemplate from '../../templates/TealProTemplate';
import RoseElegantTemplate from '../../templates/RoseElegantTemplate';
import DarkHeaderTemplate from '../../templates/DarkHeaderTemplate';
import VelvetTemplate from '../../templates/VelvetTemplate';
import AuroraTemplate from '../../templates/AuroraTemplate';
import ArabicGemTemplate from '../../templates/ArabicGemTemplate';
import { useEffect, useRef, useState, useCallback } from 'react';

const PAGE_H = 1122;   // A4 height at 96 dpi
const PAGE_W = 794;    // A4 width  at 96 dpi
const MARGIN = 48;     // top margin for pages 2+ (≈ 36pt) — visual breathing room
// Blank px reserved at the bottom of each page for the raw break calculation.
// Set equal to MAX_BOTTOM_GAP so the base case already respects the gap limit.
// Must match BOTTOM_BLANK in api/_lib/puppeteerPdf.js.
const BOTTOM_BLANK = 15;
const MIN_PAGE_CONTENT = 200; // minimum content pixels per page (used for drag handle clamping)
// Heading orphan threshold: if a section heading ends within this many pixels of
// the break point, it would be left alone on the page. Move the break to before
// the heading so it travels with its content to the next page.
const HEADING_ORPHAN_PX = 120;

// Max pixels to pull a break back when an AVOID-INSIDE element spans the break.
// Set high enough to protect individual bullet lines (~20px) AND complete resume
// items (job entries, education blocks, ~150-200px). Elements larger than this
// are split at rawBreak; Phase 3 (greedy fill) then minimises the resulting gap.
// Must match MAX_PULL_AVOID in api/_lib/puppeteerPdf.js.
const MAX_PULL_AVOID = 200;

// Max pixels to pull a break back for a heading-orphan fix.
// Must be ≥ MAX_PULL_AVOID so that Phase 2 can always pull past the heading
// even when Phase 1 already consumed most of the budget pulling to an item top.
// Must match MAX_PULL in api/_lib/puppeteerPdf.js.
const MAX_PULL = 200;
const MAX_LINE_H = 35;  // px — covers one line at up to ~14pt / line-height 1.8
// Minimum pixels of real content on the last page.
// If the final page would have less content than this, it is a "phantom page"
// caused by template bottom padding and the break is discarded.
// Set to 50 px — enough to include even short sections (2-3 lines) while
// still filtering out pure CSS bottom-padding artefacts (typically ≤ 30 px).
const MIN_PHANTOM_PAGE = 50;

// Maximum allowed blank space (px) at the bottom of any page.
// After pull-backs, the greedy-fill phase packs complete avoid-elements into the
// remaining space until the gap is ≤ this.
// Must match MAX_BOTTOM_GAP in api/_lib/puppeteerPdf.js.
const MAX_BOTTOM_GAP = 15;

function computeSmartBreaks(container, totalHeight) {
  const containerTop = container.getBoundingClientRect().top;

  const breaks = [];
  let pageStart = 0;

  while (true) {
    // Pages 2+ have MARGIN px of white at the top; their usable content height
    // is PAGE_H − MARGIN (1074 px) instead of PAGE_H (1122 px).  Page 1 starts
    // at y=0 with no top margin, so its full PAGE_H is available.
    // Using PAGE_H for pages 2+ creates a 33 px "dead zone" (1107→1074) where
    // content is placed by the algorithm but clipped by the page frame and
    // invisible in both preview and PDF.
    const isFirstPage   = pageStart === 0;
    const pageTopMargin = isFirstPage ? 0 : MARGIN;
    const pageVisibleH  = PAGE_H - pageTopMargin;   // 1122 for p1, 1074 for p2+

    // Stop once remaining content fits on this page
    if (pageStart + pageVisibleH >= totalHeight) break;

    // rawBreak = furthest allowed break; BOTTOM_BLANK px stay empty at page bottom.
    const rawBreak = pageStart + pageVisibleH - BOTTOM_BLANK;
    let bestBreak = rawBreak;

    // ── avoidEls: built once, shared by Phase 1 & Phase 3 ───────────────────
    // Includes break-inside:avoid elements AND single-line elements (≤MAX_LINE_H).
    const avoidEls = Array.from(container.querySelectorAll('*')).filter(el => {
      const s = getComputedStyle(el);
      if (s.breakInside === 'avoid' || s.pageBreakInside === 'avoid') return true;
      const d = s.display;
      if (d === 'none' || d === 'contents' || d === 'table' || d === 'table-row') return false;
      const h = el.getBoundingClientRect().height;
      return h > 0 && h <= MAX_LINE_H;
    });

    // ── Phase 4 (PRIMARY — runs FIRST): Line-boundary snap at rawBreak ───────
    // Targets rawBreak directly so the break always lands on a complete text-line
    // boundary, never mid-character. Typically gives bestBreak ≈ rawBreak − 0..15px
    // (one line height), keeping the bottom gap small and lines intact.
    // Running this first means large containers are split at a line boundary
    // instead of being avoided entirely (which used to leave 80-100px blank).
    {
      let ph4El = null, ph4ElH = Infinity;
      for (const el of container.querySelectorAll('p, li, td, th, address, div, span')) {
        const hasText = Array.from(el.childNodes).some(
          n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0
        );
        if (!hasText) continue;
        const r  = el.getBoundingClientRect();
        const eT = r.top    - containerTop;
        const eB = r.bottom - containerTop;
        if (eT >= rawBreak || eB <= rawBreak) continue; // must straddle rawBreak
        if (eT >= rawBreak - 3) continue;               // already at element top
        if (r.height < ph4ElH) { ph4El = el; ph4ElH = r.height; }
      }
      if (ph4El) {
        const lb = findLineBottomBefore(ph4El, rawBreak, containerTop);
        if (lb !== null) bestBreak = lb;
      }
    }

    // ── Phase 1: Micro-pull for tiny atomic elements only ────────────────────
    // After line-snapping, only pull back further for tiny elements whose top
    // is within MAX_BOTTOM_GAP (15 px) of rawBreak. This protects single-line
    // atomic elements (dates, role titles) from being split. Large blocks
    // (job entries, education blocks) are intentionally split at the line
    // boundary found by Phase 4 — avoids the 80-100 px blank-space problem.
    for (const el of avoidEls) {
      const rect = el.getBoundingClientRect();
      const elTop = rect.top    - containerTop;
      const elBot = rect.bottom - containerTop;
      if (elTop < bestBreak && elBot > bestBreak) {
        if (elTop > pageStart + MIN_PAGE_CONTENT && (rawBreak - elTop) <= MAX_BOTTOM_GAP) {
          bestBreak = elTop;
        }
      }
    }

    // ── Phase 2: Heading orphan fix ───────────────────────────────────────────
    // A section heading with break-after:avoid must NOT be the last element on a page.
    Array.from(container.querySelectorAll('*')).forEach(el => {
      const cs = getComputedStyle(el);
      if (cs.breakAfter !== 'avoid' && cs.pageBreakAfter !== 'avoid') return;
      const rect = el.getBoundingClientRect();
      const hTop = rect.top    - containerTop;
      const hBot = rect.bottom - containerTop;
      if (
        hBot > pageStart + MARGIN &&
        hBot <= bestBreak &&
        (bestBreak - hBot) <= HEADING_ORPHAN_PX &&
        (rawBreak - hTop) <= MAX_PULL
      ) {
        bestBreak = Math.min(bestBreak, hTop);
      }
    });

    // ── Phase 3: Greedy forward fill (minimize bottom blank space) ────────────
    // If bestBreak is still > MAX_BOTTOM_GAP below rawBreak (e.g. after a heading
    // orphan pull), greedily include complete avoid-elements that fit before rawBreak.
    // Capped at rawBreak so Phase 3 never enters the BOTTOM_BLANK reserved zone.
    //
    // ANCESTOR GUARD: skip sub-elements whose break-inside:avoid ancestor spans
    // into page 2 — including them would orphan that container's content.
    if (rawBreak - bestBreak > MAX_BOTTOM_GAP) {
      const unbreakableContainers = new Set(
        avoidEls.filter(el => {
          const r = el.getBoundingClientRect();
          const t = r.top    - containerTop;
          const b = r.bottom - containerTop;
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

      const avoidPositions = avoidEls
        .map(el => {
          const r = el.getBoundingClientRect();
          return { top: r.top - containerTop, bot: r.bottom - containerTop, el };
        })
        .filter(({ top, bot, el }) =>
          top >= bestBreak - 2 &&
          bot  <= rawBreak     &&
          bot  >  bestBreak    &&
          !isInsideUnbreakable(el)
        )
        .sort((a, b) => a.top - b.top);

      for (const { top, bot } of avoidPositions) {
        if (top >= bestBreak - 2) {
          bestBreak = Math.max(bestBreak, bot);
        }
      }
    }

    breaks.push(bestBreak);
    pageStart = bestBreak;
  }

  // ── Phantom-page guard ────────────────────────────────────────────────────
  // A template's bottom padding can push scrollHeight slightly above PAGE_H
  // even for short CVs, producing a near-empty second page.  If the last page
  // has fewer real content pixels than MIN_PHANTOM_PAGE, discard its break.
  //
  // SAFETY CHECK: never remove a break if doing so would cause the preceding
  // page to exceed its visible height (pageVisibleH).  Without this guard,
  // content just over one page tall (e.g. 1125px when PAGE_H = 1122px) can
  // lose its only break — making that content invisible in the downloaded PDF.
  while (breaks.length > 0 && totalHeight - breaks[breaks.length - 1] < MIN_PHANTOM_PAGE) {
    const prevBreakStart    = breaks.length >= 2 ? breaks[breaks.length - 2] : 0;
    const isPrevFirstPage   = prevBreakStart === 0;
    const prevPageTopMargin = isPrevFirstPage ? 0 : MARGIN;
    const prevPageVisibleH  = PAGE_H - prevPageTopMargin;
    // If removing this break would make the preceding page overflow, stop.
    if (totalHeight - prevBreakStart > prevPageVisibleH) break;
    breaks.pop();
  }

  return breaks;
}

// ── Range API helper — used by Phase 4 and fixSplitBreak ─────────────────────
// Returns the bottom Y (relative to containerTop) of the last complete text
// line within `el` that fits entirely before `y`.
// Uses Range.getClientRects() which returns one rect per inline text-fragment,
// naturally aligned to line boundaries. Returns null if nothing was found.
function findLineBottomBefore(el, y, containerTop) {
  try {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rects = Array.from(range.getClientRects());
    if (rects.length === 0) return null;
    let lastSafe = null;
    for (const rect of rects) {
      const rBot = rect.bottom - containerTop;
      if (rBot <= y - 1) lastSafe = rBot;  // entire line fits before break
    }
    return lastSafe;
  } catch {
    return null;
  }
}

// ── Fix a single split break ──────────────────────────────────────────────────
// Tries Phase 1 (pull to avoid-element top) then Phase 4 (Range line snap)
// to find a safe break position near `breakAt`.  Returns the adjusted Y.
function fixSplitBreak(container, breakAt, pageStart) {
  const containerTop  = container.getBoundingClientRect().top;
  const isFirstPage   = pageStart === 0;
  const pageTopMargin = isFirstPage ? 0 : MARGIN;
  const pageVisibleH  = PAGE_H - pageTopMargin;
  const rawBreak      = pageStart + pageVisibleH - BOTTOM_BLANK;

  // Phase 1 — pull to the straddling avoid-element's top
  const avoidEls = Array.from(container.querySelectorAll('*')).filter(el => {
    const cs = getComputedStyle(el);
    if (cs.breakInside === 'avoid' || cs.pageBreakInside === 'avoid') return true;
    const d = cs.display;
    if (d === 'none' || d === 'contents' || d === 'table' || d === 'table-row') return false;
    const h = el.getBoundingClientRect().height;
    return h > 0 && h <= MAX_LINE_H;
  });

  for (const el of avoidEls) {
    const r  = el.getBoundingClientRect();
    const eT = r.top    - containerTop;
    const eB = r.bottom - containerTop;
    if (eT < breakAt - 3 && eB > breakAt + 3) {
      if (eT > pageStart + MIN_PAGE_CONTENT && (rawBreak - eT) <= MAX_PULL_AVOID) {
        return eT;
      }
    }
  }

  // Phase 4 — Range API line-boundary snap
  // Covers div/span too, not just semantic elements, because resume templates
  // commonly use div/span for descriptions, bullets, and job details.
  let bestEl = null, bestH = Infinity;
  for (const el of container.querySelectorAll('p, li, td, th, address, div, span')) {
    const hasText = Array.from(el.childNodes).some(
      n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0
    );
    if (!hasText) continue;
    const r  = el.getBoundingClientRect();
    const eT = r.top    - containerTop;
    const eB = r.bottom - containerTop;
    if (eT >= breakAt || eB <= breakAt) continue;
    if (r.height < bestH) { bestEl = el; bestH = r.height; }
  }
  if (bestEl) {
    const lb = findLineBottomBefore(bestEl, breakAt, containerTop);
    if (lb !== null) return lb;
  }

  return breakAt; // no improvement found
}

// ── Page-break quality analysis ───────────────────────────────────────────────
// Runs after breaks are computed. For each break:
//   'clean' — gap ≤ QUALITY_GAP_WARN and no avoid-element is being split
//   'gap'   — larger blank space at page bottom (section/heading pulled forward)
//   'split' — a break-inside:avoid element straddles the break point
//
// Uses the same avoidEls definition as computeSmartBreaks (must stay in sync).
const QUALITY_GAP_WARN = 60; // px — gap larger than this shows an amber warning

function analyzeBreakQuality(container, breaks) {
  if (!container || breaks.length === 0) return [];
  const containerTop = container.getBoundingClientRect().top;

  const avoidEls = Array.from(container.querySelectorAll('*')).filter(el => {
    const cs = getComputedStyle(el);
    if (cs.breakInside === 'avoid' || cs.pageBreakInside === 'avoid') return true;
    const d = cs.display;
    if (d === 'none' || d === 'contents' || d === 'table' || d === 'table-row') return false;
    const h = el.getBoundingClientRect().height;
    return h > 0 && h <= MAX_LINE_H;
  });

  return breaks.map((breakAt, i) => {
    const pageStart     = i === 0 ? 0 : breaks[i - 1];
    const isFirstPage   = i === 0;
    const pageTopMargin = isFirstPage ? 0 : MARGIN;
    const pageVisibleH  = PAGE_H - pageTopMargin;
    const rawBreak      = pageStart + pageVisibleH - BOTTOM_BLANK;
    const gap           = Math.max(0, Math.round(rawBreak - breakAt));

    // A 'split' occurs when a protected element straddles the break by > 3 px on each side.
    let isSplit = false;
    for (const el of avoidEls) {
      const r  = el.getBoundingClientRect();
      const eT = r.top    - containerTop;
      const eB = r.bottom - containerTop;
      if (eT < breakAt - 3 && eB > breakAt + 3) { isSplit = true; break; }
    }

    const status = isSplit ? 'split' : gap > QUALITY_GAP_WARN ? 'gap' : 'clean';
    return { breakAt, gap, isSplit, status };
  });
}

/* ── Draggable page-break handle ── */
const DragHandle = ({ breakIndex, breakY, pageStart, nextPageEnd, scale, isRTL, onDrag, onReset, qualityStatus }) => {
  const dragging = useRef(false);
  const startY   = useRef(0);
  const startBreak = useRef(0);

  const begin = (clientY) => {
    dragging.current  = true;
    startY.current    = clientY;
    startBreak.current = breakY;
  };

  const move = useCallback((clientY) => {
    if (!dragging.current) return;
    const deltaContent = (clientY - startY.current) / scale;
    const min = pageStart + MIN_PAGE_CONTENT;
    const max = nextPageEnd - MIN_PAGE_CONTENT;
    const clamped = Math.max(min, Math.min(max, startBreak.current + deltaContent));
    onDrag(breakIndex, clamped);
  }, [breakIndex, pageStart, nextPageEnd, scale, onDrag]);

  const end = () => { dragging.current = false; };

  useEffect(() => {
    const onMove = (e) => move(e.clientY);
    const onTouchMove = (e) => move(e.touches[0].clientY);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', end);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', end);
    };
  }, [move]);

  return (
    <div
      className="group flex items-center gap-2 my-1 select-none"
      style={{ width: PAGE_W * scale }}
    >
      {/* Left line */}
      <div className="flex-1 h-0.5 bg-indigo-300 group-hover:bg-indigo-500 transition-colors rounded-full" />

      {/* Drag pill */}
      <div
        onMouseDown={(e) => { e.preventDefault(); begin(e.clientY); }}
        onTouchStart={(e) => begin(e.touches[0].clientY)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-medium shadow-lg cursor-ns-resize hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
        title={isRTL ? 'اسحب لتغيير نقطة كسر الصفحة' : 'Drag to adjust page break'}
      >
        {/* drag icon */}
        <svg className="w-3 h-3 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        <span>{isRTL ? `صفحة ${breakIndex + 2}` : `Page ${breakIndex + 2}`}</span>

        {/* Quality dot — green/amber/red based on break analysis */}
        {qualityStatus && (() => {
          const dotCls = qualityStatus === 'clean'
            ? 'bg-emerald-400'
            : qualityStatus === 'gap'
            ? 'bg-amber-300'
            : 'bg-red-400 animate-pulse';
          const dotTitle = isRTL
            ? (qualityStatus === 'split' ? 'انقسام في المحتوى' : qualityStatus === 'gap' ? 'مسافة فارغة' : 'فاصل نظيف')
            : (qualityStatus === 'split' ? 'Content split here' : qualityStatus === 'gap' ? 'Empty gap at bottom' : 'Clean break');
          return <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotCls}`} title={dotTitle} />;
        })()}

        {/* reset button */}
        <button
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onReset(breakIndex); }}
          className="ml-1 w-4 h-4 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
          title={isRTL ? 'إعادة ضبط تلقائي' : 'Reset to auto'}
        >
          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Right line */}
      <div className="flex-1 h-0.5 bg-indigo-300 group-hover:bg-indigo-500 transition-colors rounded-full" />
    </div>
  );
};

/* ── Main component ── */
const LivePreview = ({ breakDataRef }) => {
  const { cvData, selectedTemplate, theme, visibleSections, visiblePersonalFields, sectionOrder, sectionNames } = useCV();
  const { isRTL } = useAuth();
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  const [scale, setScale]               = useState(1);
  const [autoBreaks, setAutoBreaks]     = useState([]);   // computed smart breaks
  const [manualBreaks, setManualBreaks] = useState(null); // null = use auto
  const [totalHeight, setTotalHeight]   = useState(PAGE_H);
  const [breakQuality, setBreakQuality] = useState([]);   // per-break quality info

  const activeBreaks = manualBreaks ?? autoBreaks;

  /* ── expose break data + capture element for PDF export ── */
  useEffect(() => {
    if (breakDataRef) {
      breakDataRef.current = {
        breaks: activeBreaks,
        totalHeight,
        captureEl: contentRef.current,
        // freshMeasure() — called by CVBuilder before PDF export.
        // Waits for ALL fonts to finish loading, then re-runs the smart-break
        // algorithm on the live DOM so that pageBreaks and captureEl.innerHTML
        // are always computed from the same post-font layout.
        //
        // WHY: pageBreaks must be computed from the exact same DOM state as the
        // HTML that Puppeteer will render. If breaks were computed pre-font
        // (at the initial 80ms timeout) but the HTML is captured post-font,
        // lines near the break boundary shift, causing content to appear cut off
        // or "missing" at the bottom of PDF pages.
        freshMeasure: async () => {
          const el = contentRef.current;
          if (!el) return { breaks: activeBreaks, totalHeight, captureEl: el };
          // Ensure every @font-face is fully loaded
          await document.fonts.ready;
          const pending = [];
          document.fonts.forEach(f => {
            if (f.status !== 'loaded') pending.push(f.load().catch(() => {}));
          });
          if (pending.length) await Promise.all(pending);
          // Two rAF ticks + 200 ms so the layout engine applies the loaded font
          // metrics and scrollHeight reflects the true post-font content height
          await new Promise(r =>
            requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 200)))
          );
          const h = el.scrollHeight;
          const breaks = h <= PAGE_H ? [] : computeSmartBreaks(el, h);
          return { breaks, totalHeight: h, captureEl: el };
        },
      };
    }
  }, [activeBreaks, totalHeight, breakDataRef]);

  /* ── scale ── */
  const calcScale = useCallback(() => {
    if (wrapperRef.current) {
      const avail = wrapperRef.current.clientWidth - 32;
      if (avail > 0) setScale(Math.min(1, avail / PAGE_W));
    }
  }, []);

  useEffect(() => {
    calcScale();
    window.addEventListener('resize', calcScale);
    // ResizeObserver fires when the wrapper goes from hidden→visible on mobile
    // (switching tabs changes clientWidth from 0 → actual width)
    const ro = new ResizeObserver(calcScale);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => {
      window.removeEventListener('resize', calcScale);
      ro.disconnect();
    };
  }, [calcScale]);

  /* ── measure + smart breaks ── */
  useEffect(() => {
    setManualBreaks(null); // reset manual overrides when content changes
    let cancelled = false;

    const measure = async () => {
      const el = contentRef.current;
      if (!el || cancelled) return;

      // First pass: immediate measurement with whatever fonts are available.
      // This makes the preview render quickly without waiting for network fonts.
      const hFirst = el.scrollHeight;
      if (!cancelled) {
        setTotalHeight(hFirst);
        setAutoBreaks(hFirst <= PAGE_H ? [] : computeSmartBreaks(el, hFirst));
      }

      // Second pass: wait for ALL fonts to load, then re-measure.
      // Web fonts change character metrics (advance widths, line heights), so
      // text wraps differently post-font. Re-measuring ensures break positions
      // match the final rendered layout — the same state from which the PDF
      // export captures innerHTML. Without this, breaks computed pre-font
      // are used with post-font HTML, causing lines to appear cut off or
      // missing at the bottom of PDF pages.
      try {
        await document.fonts.ready;
        const pending = [];
        document.fonts.forEach(f => {
          if (f.status !== 'loaded') pending.push(f.load().catch(() => {}));
        });
        if (pending.length) await Promise.all(pending);
        // Two rAF ticks so the layout engine applies loaded font metrics
        await new Promise(r =>
          requestAnimationFrame(() => requestAnimationFrame(r))
        );
      } catch (_) {}

      if (!contentRef.current || cancelled) return;
      const hFinal = contentRef.current.scrollHeight;
      if (!cancelled) {
        setTotalHeight(hFinal);
        setAutoBreaks(hFinal <= PAGE_H ? [] : computeSmartBreaks(contentRef.current, hFinal));
      }
    };

    const t = setTimeout(() => measure(), 80);
    const ro = new ResizeObserver(() => { clearTimeout(t); setTimeout(() => measure(), 80); });
    if (contentRef.current) ro.observe(contentRef.current);
    return () => {
      cancelled = true;
      clearTimeout(t);
      ro.disconnect();
    };
  }, [cvData, selectedTemplate, theme, visibleSections, visiblePersonalFields, sectionOrder]);

  /* ── drag handlers ── */
  const handleDrag = useCallback((breakIndex, newY) => {
    setManualBreaks(prev => {
      const base = prev ?? [...autoBreaks];
      const next = [...base];
      next[breakIndex] = newY;
      return next;
    });
  }, [autoBreaks]);

  const handleReset = useCallback((breakIndex) => {
    setManualBreaks(prev => {
      if (!prev) return null;
      const next = [...prev];
      next[breakIndex] = autoBreaks[breakIndex];
      const allAuto = next.every((v, i) => v === autoBreaks[i]);
      return allAuto ? null : next;
    });
  }, [autoBreaks]);

  const handleResetAll = () => setManualBreaks(null);

  /* ── quality analysis (runs whenever active breaks change, incl. manual drags) ── */
  useEffect(() => {
    const el = contentRef.current;
    if (!el || activeBreaks.length === 0) { setBreakQuality([]); return; }
    // Small delay so the off-screen layout is fully settled after a drag
    const t = setTimeout(() => setBreakQuality(analyzeBreakQuality(el, activeBreaks)), 120);
    return () => clearTimeout(t);
  }, [activeBreaks]);

  /* ── Fix All Splits — adjusts only the broken breaks, keeps manual ones ── */
  const handleFixAllSplits = useCallback(() => {
    const el = contentRef.current;
    if (!el || activeBreaks.length === 0) return;

    const newBreaks = [...activeBreaks];
    let changed = false;

    breakQuality.forEach((q, i) => {
      if (q.status !== 'split') return;
      const pageStart = i === 0 ? 0 : activeBreaks[i - 1];
      const fixed = fixSplitBreak(el, q.breakAt, pageStart);
      if (Math.abs(fixed - q.breakAt) > 2) {
        newBreaks[i] = fixed;
        changed = true;
      }
    });

    // If fixSplitBreak couldn't improve anything, fall back to re-running
    // the auto algorithm which now includes Phase 4 Range snapping.
    setManualBreaks(changed ? newBreaks : null);
  }, [activeBreaks, breakQuality]);

  /* ── template renderer ── */
  const props = { data: cvData, theme, isRTL, visibleSections, visiblePersonalFields, sectionOrder, sectionNames };
  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':    return <ModernTemplate    {...props} />;
      case 'classic':   return <ClassicTemplate   {...props} />;
      case 'creative':  return <CreativeTemplate  {...props} />;
      case 'minimal':   return <MinimalTemplate   {...props} />;
      case 'executive': return <ExecutiveTemplate {...props} />;
      case 'atsclean':  return <ATSCleanTemplate  {...props} />;
      case 'atspro':    return <ATSProTemplate    {...props} />;
      case 'atssimple':  return <ATSSimpleTemplate  {...props} />;
      case 'atsbold':    return <ATSBoldTemplate    {...props} />;
      case 'atscompact':  return <ATSCompactTemplate  {...props} />;
      case 'atsmodern':   return <ATSModernTemplate   {...props} />;
      case 'atsharvard':  return <ATSHarvardTemplate  {...props} />;
      case 'atscenter':   return <ATSCenterTemplate   {...props} />;
      case 'atselegant':  return <ATSElegantTemplate  {...props} />;
      case 'prestige':      return <PrestigeTemplate      {...props} />;
      case 'classicserif':  return <ClassicSerifTemplate  {...props} />;
      case 'atlanticblue':  return <AtlanticBlueTemplate  {...props} />;
      case 'mercuryflow':   return <MercuryFlowTemplate   {...props} />;
      case 'editorialrule': return <EditorialRuleTemplate {...props} />;
      case 'sidebarlight':  return <SidebarLightTemplate  {...props} />;
      case 'tealpro':       return <TealProTemplate       {...props} />;
      case 'roseelegant':   return <RoseElegantTemplate   {...props} />;
      case 'darkheader':    return <DarkHeaderTemplate    {...props} />;
      case 'velvet':        return <VelvetTemplate        {...props} />;
      case 'aurora':        return <AuroraTemplate        {...props} />;
      case 'arabicgem':     return <ArabicGemTemplate     {...props} />;
      case 'arabicnavy':         return <ArabicNavyTemplate         {...props} />;
      case 'arabicpro':          return <ArabicProTemplate          {...props} />;
      case 'arabictealsidebar':  return <ArabicTealSidebarTemplate  {...props} />;
      case 'arabicslatesidebar': return <ArabicSlateSidebarTemplate {...props} />;
      case 'arabicmodern':       return <ArabicModernTemplate       {...props} />;
      case 'arabiccard':         return <ArabicCardTemplate         {...props} />;
      case 'arabicelite':        return <ArabicEliteTemplate        {...props} />;
      case 'arabicwave':         return <ArabicWaveTemplate         {...props} />;
      case 'arabicluxe':         return <ArabicLuxeTemplate         {...props} />;
      case 'englishhorizon':     return <EnglishHorizonTemplate     {...props} />;
      case 'arabiczafir':        return <ArabicZafirTemplate        {...props} />;
      case 'englishapex':        return <EnglishApexTemplate        {...props} />;
      default:              return <ModernTemplate         {...props} />;
    }
  };

  /* ── page ranges ── */
  const pageRanges = (() => {
    const ranges = [];
    let start = 0;
    for (const brk of activeBreaks) {
      ranges.push({ start, end: brk });
      start = brk;
    }
    ranges.push({ start, end: totalHeight });
    return ranges;
  })();

  const numPages  = pageRanges.length;
  const scaledW   = PAGE_W * scale;
  const hasManual = manualBreaks !== null;

  return (
    <div ref={wrapperRef} className="w-full flex flex-col items-center">

      {/* Top badges */}
      <div className="mb-3 flex items-center gap-2 flex-wrap justify-center">
        {numPages > 1 && (
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-500 font-medium shadow-sm flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {isRTL ? `${numPages} صفحات` : `${numPages} page${numPages !== 1 ? 's' : ''}`}
          </div>
        )}

        {/* "Reset all" badge when manual breaks are active */}
        {hasManual && (
          <button
            onClick={handleResetAll}
            className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-xs text-amber-700 font-medium shadow-sm flex items-center gap-1.5 hover:bg-amber-100 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {isRTL ? 'إعادة الضبط التلقائي' : 'Reset to auto'}
          </button>
        )}

        {/* ── Page-break quality summary badge ── */}
        {activeBreaks.length > 0 && breakQuality.length === activeBreaks.length && (() => {
          const splits = breakQuality.filter(q => q.status === 'split').length;
          const gaps   = breakQuality.filter(q => q.status === 'gap').length;
          const overallStatus = splits > 0 ? 'split' : gaps > 0 ? 'gap' : 'clean';

          const label = isRTL
            ? (overallStatus === 'split'
                ? `${splits} انقسام في المحتوى`
                : overallStatus === 'gap'
                ? `${gaps} مسافة فارغة`
                : 'فواصل الصفحات نظيفة')
            : (overallStatus === 'split'
                ? `${splits} content split${splits > 1 ? 's' : ''}`
                : overallStatus === 'gap'
                ? `${gaps} empty gap${gaps > 1 ? 's' : ''}`
                : 'All page breaks clean');

          const cls = overallStatus === 'split'
            ? 'bg-red-50 border-red-200 text-red-700'
            : overallStatus === 'gap'
            ? 'bg-amber-50 border-amber-200 text-amber-700'
            : 'bg-emerald-50 border-emerald-200 text-emerald-700';

          const dotCls = overallStatus === 'split'
            ? 'bg-red-500'
            : overallStatus === 'gap'
            ? 'bg-amber-400'
            : 'bg-emerald-500';

          return (
            <>
              <div className={`px-3 py-1.5 border rounded-full text-xs font-medium shadow-sm flex items-center gap-1.5 ${cls}`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotCls}`} />
                <span>{label}</span>
              </div>

              {/* Fix All Splits button — only visible when red splits are detected */}
              {overallStatus === 'split' && (
                <button
                  onClick={handleFixAllSplits}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border border-red-700 rounded-full text-xs font-medium shadow-sm flex items-center gap-1.5 transition-colors"
                  title={isRTL ? 'ضبط تلقائي لجميع نقاط الانقسام' : 'Automatically snap all split breaks to the nearest line boundary'}
                >
                  <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{isRTL ? 'إصلاح كافة الانقسامات' : 'Fix All Splits'}</span>
                </button>
              )}
            </>
          );
        })()}
      </div>

      {/* Hidden off-screen CV — measurement only */}
      <div
        ref={contentRef}
        aria-hidden="true"
        style={{
          position: 'absolute', top: '-9999px', left: '-9999px',
          width: PAGE_W, pointerEvents: 'none', zIndex: -1,
        }}
      >
        {renderTemplate()}
      </div>

      {/* Pages */}
      {pageRanges.map(({ start, end }, pageIndex) => {
        const isFirst = pageIndex === 0;
        const isLast  = pageIndex === numPages - 1;
        const clipStart = isFirst ? 0 : start - MARGIN;
        const contentSliceH = end - start;

        return (
          <div key={pageIndex} className="flex flex-col items-center w-full">

            {/* Draggable break handle between pages */}
            {!isFirst && (
              <DragHandle
                breakIndex={pageIndex - 1}
                breakY={activeBreaks[pageIndex - 1]}
                pageStart={pageRanges[pageIndex - 1].start}
                nextPageEnd={end}
                scale={scale}
                isRTL={isRTL}
                onDrag={handleDrag}
                onReset={handleReset}
                qualityStatus={breakQuality[pageIndex - 1]?.status}
              />
            )}

            {/* A4 page frame — always full A4 height to match the PDF exactly */}
            <div
              className="shadow-2xl overflow-hidden bg-white relative"
              style={{
                width: scaledW,
                height: PAGE_H * scale,
                flexShrink: 0,
              }}
            >
              {/* Scaled template content */}
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: PAGE_W,
                  position: 'absolute',
                  top: -(clipStart * scale),
                  left: 0,
                }}
              >
                {renderTemplate()}
              </div>

              {/* White top-margin overlay (pages 2+) */}
              {!isFirst && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  height: MARGIN * scale, background: '#fff', zIndex: 5,
                }} />
              )}

              {/* White bottom overlay — covers from break point to page bottom */}
              {!isLast && (() => {
                const contentEndInFrame = (end - clipStart) * scale;
                const overlayH = (PAGE_H * scale) - contentEndInFrame;
                if (overlayH <= 0) return null;
                return (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: overlayH, background: '#fff', zIndex: 5,
                  }} />
                );
              })()}

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LivePreview;
