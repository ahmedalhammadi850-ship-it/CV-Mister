import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import ModernTemplate from '../../templates/ModernTemplate';
import ClassicTemplate from '../../templates/ClassicTemplate';
import CreativeTemplate from '../../templates/CreativeTemplate';
import MinimalTemplate from '../../templates/MinimalTemplate';
import ExecutiveTemplate from '../../templates/ExecutiveTemplate';
import { useEffect, useRef, useState, useCallback } from 'react';

const PAGE_H   = 1122;  // A4 height at 96 dpi
const PAGE_W   = 794;   // A4 width  at 96 dpi
const MARGIN   = 48;    // top/bottom page margin (≈ 36pt)

/**
 * Given a rendered container, compute smart page-break positions.
 * Moves each break point upward so it never cuts through a block element.
 */
function computeSmartBreaks(container, totalHeight) {
  const containerTop = container.getBoundingClientRect().top;

  // Collect all elements that must not be split across pages.
  // Templates use inline breakInside / pageBreakInside styles.
  const candidates = Array.from(container.querySelectorAll('*')).filter(el => {
    const s = el.style;
    return (
      s.breakInside === 'avoid' ||
      s.pageBreakInside === 'avoid' ||
      s.breakAfter === 'avoid' ||
      s.pageBreakAfter === 'avoid'
    );
  });

  const breaks = [];
  let pageStart = 0;

  while (pageStart + PAGE_H < totalHeight) {
    const rawBreak = pageStart + PAGE_H - MARGIN; // leave bottom margin
    let bestBreak = rawBreak;

    // Find the topmost element that straddles rawBreak
    for (const el of candidates) {
      const rect  = el.getBoundingClientRect();
      const elTop = rect.top    - containerTop;
      const elBot = rect.bottom - containerTop;

      if (elTop < rawBreak && elBot > rawBreak) {
        // Element is being cut — move break to just before it
        if (elTop > pageStart + MARGIN) {
          bestBreak = Math.min(bestBreak, elTop);
        }
      }
    }

    breaks.push(bestBreak);
    pageStart = bestBreak;
  }

  return breaks; // array of y-positions where each page ends (content coords)
}

const LivePreview = () => {
  const { cvData, selectedTemplate, theme, visibleSections, visiblePersonalFields, sectionOrder } = useCV();
  const { isRTL } = useAuth();
  const wrapperRef  = useRef(null);
  const contentRef  = useRef(null);
  const [scale, setScale]           = useState(1);
  const [pageBreaks, setPageBreaks] = useState([]); // smart break y-positions
  const [totalHeight, setTotalHeight] = useState(PAGE_H);

  /* ── scale to fit preview width ── */
  const calcScale = useCallback(() => {
    if (wrapperRef.current) {
      const avail = wrapperRef.current.clientWidth - 32;
      setScale(Math.min(1, avail / PAGE_W));
    }
  }, []);

  useEffect(() => {
    calcScale();
    window.addEventListener('resize', calcScale);
    return () => window.removeEventListener('resize', calcScale);
  }, [calcScale]);

  /* ── measure content & compute smart breaks ── */
  useEffect(() => {
    const measure = () => {
      const el = contentRef.current;
      if (!el) return;
      const h = el.scrollHeight;
      setTotalHeight(h);
      if (h <= PAGE_H) {
        setPageBreaks([]);
      } else {
        setPageBreaks(computeSmartBreaks(el, h));
      }
    };

    // Small delay so the DOM has fully painted
    const t = setTimeout(measure, 80);
    const ro = new ResizeObserver(() => { clearTimeout(t); setTimeout(measure, 80); });
    if (contentRef.current) ro.observe(contentRef.current);
    return () => { clearTimeout(t); ro.disconnect(); };
  }, [cvData, selectedTemplate, theme, visibleSections, visiblePersonalFields, sectionOrder]);

  const props = { data: cvData, theme, isRTL, visibleSections, visiblePersonalFields, sectionOrder };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':    return <ModernTemplate    {...props} />;
      case 'classic':   return <ClassicTemplate   {...props} />;
      case 'creative':  return <CreativeTemplate  {...props} />;
      case 'minimal':   return <MinimalTemplate   {...props} />;
      case 'executive': return <ExecutiveTemplate {...props} />;
      default:          return <ModernTemplate    {...props} />;
    }
  };

  // Build page start/end pairs from smart break points
  const pageRanges = (() => {
    const ranges = [];
    let start = 0;
    for (const brk of pageBreaks) {
      ranges.push({ start, end: brk });
      start = brk;
    }
    ranges.push({ start, end: totalHeight });
    return ranges;
  })();

  const numPages = pageRanges.length;
  const scaledW  = PAGE_W * scale;

  return (
    <div ref={wrapperRef} className="w-full flex flex-col items-center">

      {/* Page count badge */}
      {numPages > 1 && (
        <div className="mb-3 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-500 font-medium shadow-sm flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {isRTL ? `${numPages} صفحات` : `${numPages} page${numPages !== 1 ? 's' : ''}`}
        </div>
      )}

      {/* Hidden off-screen CV — used for measurement & break detection */}
      <div
        ref={contentRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: PAGE_W,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        {renderTemplate()}
      </div>

      {/* One A4 frame per page */}
      {pageRanges.map(({ start, end }, pageIndex) => {
        const isFirst = pageIndex === 0;
        const isLast  = pageIndex === numPages - 1;

        // Clip starts a bit before the page start (except page 1)
        // so a white top-margin overlay can sit cleanly at the top.
        const clipStart = isFirst ? 0 : start - MARGIN;

        // Visible content height for this page (in content coordinates)
        const contentSliceH = end - start;

        return (
          <div key={pageIndex} className="flex flex-col items-center w-full">

            {/* Divider + label between pages */}
            {!isFirst && (
              <div className="flex items-center gap-3 my-4" style={{ width: scaledW }}>
                <div className="flex-1 h-px bg-slate-300" />
                <span className="text-xs text-slate-400 font-medium px-3 py-1 bg-white border border-slate-200 rounded-full shadow-sm">
                  {isRTL ? `صفحة ${pageIndex + 1}` : `Page ${pageIndex + 1}`}
                </span>
                <div className="flex-1 h-px bg-slate-300" />
              </div>
            )}

            {/* Page frame — A4 size */}
            <div
              className="shadow-2xl overflow-hidden bg-white relative"
              style={{
                width: scaledW,
                // Last page height matches its actual content + margins; others are full A4
                height: isLast
                  ? Math.min(PAGE_H, (contentSliceH + (isFirst ? 0 : MARGIN) + MARGIN)) * scale
                  : PAGE_H * scale,
                flexShrink: 0,
              }}
            >
              {/* Scaled & shifted template */}
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

              {/* White bottom overlay (all pages except last):
                  covers everything from the smart break point to the page bottom,
                  so no content bleeds across the boundary */}
              {!isLast && (() => {
                // How far into this page frame does the content reach?
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
