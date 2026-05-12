import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import ModernTemplate from '../../templates/ModernTemplate';
import ClassicTemplate from '../../templates/ClassicTemplate';
import CreativeTemplate from '../../templates/CreativeTemplate';
import MinimalTemplate from '../../templates/MinimalTemplate';
import ExecutiveTemplate from '../../templates/ExecutiveTemplate';
import { useEffect, useRef, useState, useCallback } from 'react';

const PAGE_H = 1122; // A4 at 96 dpi

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
      setScale(Math.min(1, avail / 794));
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
  const scaledH  = contentHeight * scale;
  const scaledW  = 794 * scale;

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

      {/* CV + page separators */}
      <div className="relative shadow-2xl" style={{ width: scaledW, height: scaledH }}>

        {/* Scaled CV content */}
        <div
          ref={contentRef}
          className="resume-scale-wrapper"
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: 794 }}
        >
          {renderTemplate()}
        </div>

        {/* Page separator lines */}
        {numPages > 1 && Array.from({ length: numPages - 1 }, (_, i) => (
          <div
            key={i}
            className="cv-page-separator"
            style={{ top: (i + 1) * PAGE_H * scale - 1 }}
          >
            <span className="cv-page-badge">
              {isRTL ? `صفحة ${i + 2}` : `Page ${i + 2}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePreview;
