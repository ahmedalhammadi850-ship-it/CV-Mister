import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import ModernTemplate from '../../templates/ModernTemplate';
import ClassicTemplate from '../../templates/ClassicTemplate';
import CreativeTemplate from '../../templates/CreativeTemplate';
import MinimalTemplate from '../../templates/MinimalTemplate';
import ExecutiveTemplate from '../../templates/ExecutiveTemplate';
import { useEffect, useRef, useState, useCallback } from 'react';

const PAGE_H = 1122; // A4 at 96 dpi
const PAGE_W = 794;

const LivePreview = () => {
  const { cvData, selectedTemplate, theme, visibleSections, visiblePersonalFields, sectionOrder } = useCV();
  const { isRTL } = useAuth();
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(PAGE_H);

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

  useEffect(() => {
    const measure = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    return () => ro.disconnect();
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

  const numPages = Math.max(1, Math.ceil(contentHeight / PAGE_H));
  const scaledW  = PAGE_W * scale;

  return (
    <div ref={wrapperRef} className="w-full flex flex-col items-center gap-0">

      {/* Page count badge */}
      {numPages > 1 && (
        <div className="mb-3 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs text-slate-500 font-medium shadow-sm flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {isRTL ? `${numPages} صفحات` : `${numPages} page${numPages !== 1 ? 's' : ''}`}
        </div>
      )}

      {/* Hidden full-size content used only for measurement */}
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

      {/* Render each page as a clipped window into the full CV */}
      {Array.from({ length: numPages }, (_, pageIndex) => {
        const offsetY = pageIndex * PAGE_H;
        return (
          <div key={pageIndex} className="flex flex-col items-center w-full">

            {/* Page label (above page 2+) */}
            {pageIndex > 0 && (
              <div className="flex items-center gap-3 my-3" style={{ width: scaledW }}>
                <div className="flex-1 h-px bg-slate-300" />
                <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-full">
                  {isRTL ? `صفحة ${pageIndex + 1}` : `Page ${pageIndex + 1}`}
                </span>
                <div className="flex-1 h-px bg-slate-300" />
              </div>
            )}

            {/* Page frame */}
            <div
              className="shadow-2xl overflow-hidden bg-white relative"
              style={{
                width: scaledW,
                height: PAGE_H * scale,
              }}
            >
              {/* Scaled and offset CV content */}
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left',
                  width: PAGE_W,
                  position: 'absolute',
                  top: -offsetY * scale,
                  left: 0,
                }}
              >
                {renderTemplate()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LivePreview;
