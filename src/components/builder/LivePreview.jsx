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
const MARGIN = 48;     // top/bottom page margin (≈ 36pt)
const MIN_PAGE_CONTENT = 200; // minimum content pixels per page

function computeSmartBreaks(container, totalHeight) {
  const containerTop = container.getBoundingClientRect().top;
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
    const rawBreak = pageStart + PAGE_H - MARGIN;
    let bestBreak = rawBreak;

    for (const el of candidates) {
      const rect  = el.getBoundingClientRect();
      const elTop = rect.top    - containerTop;
      const elBot = rect.bottom - containerTop;
      if (elTop < rawBreak && elBot > rawBreak && elTop > pageStart + MARGIN) {
        bestBreak = Math.min(bestBreak, elTop);
      }
    }

    breaks.push(bestBreak);
    pageStart = bestBreak;
  }

  return breaks;
}

/* ── Draggable page-break handle ── */
const DragHandle = ({ breakIndex, breakY, pageStart, nextPageEnd, scale, isRTL, onDrag, onReset }) => {
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
  const { cvData, selectedTemplate, theme, visibleSections, visiblePersonalFields, sectionOrder } = useCV();
  const { isRTL } = useAuth();
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);

  const [scale, setScale]               = useState(1);
  const [autoBreaks, setAutoBreaks]     = useState([]);   // computed smart breaks
  const [manualBreaks, setManualBreaks] = useState(null); // null = use auto
  const [totalHeight, setTotalHeight]   = useState(PAGE_H);

  const activeBreaks = manualBreaks ?? autoBreaks;

  /* ── expose break data + capture element for PDF export ── */
  useEffect(() => {
    if (breakDataRef) {
      breakDataRef.current = { breaks: activeBreaks, totalHeight, captureEl: contentRef.current };
    }
  }, [activeBreaks, totalHeight, breakDataRef]);

  /* ── scale ── */
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

  /* ── measure + smart breaks ── */
  useEffect(() => {
    setManualBreaks(null); // reset manual overrides when content changes
    const measure = () => {
      const el = contentRef.current;
      if (!el) return;
      const h = el.scrollHeight;
      setTotalHeight(h);
      setAutoBreaks(h <= PAGE_H ? [] : computeSmartBreaks(el, h));
    };
    const t = setTimeout(measure, 80);
    const ro = new ResizeObserver(() => { clearTimeout(t); setTimeout(measure, 80); });
    if (contentRef.current) ro.observe(contentRef.current);
    return () => { clearTimeout(t); ro.disconnect(); };
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

  /* ── template renderer ── */
  const props = { data: cvData, theme, isRTL, visibleSections, visiblePersonalFields, sectionOrder };
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
              />
            )}

            {/* A4 page frame */}
            <div
              className="shadow-2xl overflow-hidden bg-white relative"
              style={{
                width: scaledW,
                height: isLast
                  ? Math.min(PAGE_H, contentSliceH + (isFirst ? 0 : MARGIN) + MARGIN) * scale
                  : PAGE_H * scale,
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
