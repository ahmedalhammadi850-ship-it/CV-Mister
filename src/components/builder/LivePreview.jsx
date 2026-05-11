import { useCV } from '../../context/CVContext';
import ModernTemplate from '../../templates/ModernTemplate';
import ClassicTemplate from '../../templates/ClassicTemplate';
import CreativeTemplate from '../../templates/CreativeTemplate';
import MinimalTemplate from '../../templates/MinimalTemplate';
import ExecutiveTemplate from '../../templates/ExecutiveTemplate';
import { useEffect, useRef, useState } from 'react';

const LivePreview = () => {
  const { cvData, selectedTemplate, theme } = useCV();
  const previewRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Auto-scale to fit container width while maintaining aspect ratio
  useEffect(() => {
    const handleResize = () => {
      if (previewRef.current && previewRef.current.parentElement) {
        const parentWidth = previewRef.current.parentElement.clientWidth;
        // A4 width is 210mm (~794px). We want some padding.
        const targetWidth = parentWidth - 40; 
        const newScale = Math.min(1, targetWidth / 794);
        setScale(newScale);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'modern':    return <ModernTemplate    data={cvData} theme={theme} />;
      case 'classic':   return <ClassicTemplate   data={cvData} theme={theme} />;
      case 'creative':  return <CreativeTemplate  data={cvData} theme={theme} />;
      case 'minimal':   return <MinimalTemplate   data={cvData} theme={theme} />;
      case 'executive': return <ExecutiveTemplate data={cvData} theme={theme} />;
      default:          return <ModernTemplate    data={cvData} theme={theme} />;
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-start w-full" 
      ref={previewRef}
    >
      <div 
        className="resume-scale-wrapper shadow-2xl transition-transform"
        style={{ transform: `scale(${scale})`, marginBottom: `-${(1 - scale) * 1122}px` }}
      >
        <div id="cv-preview-content">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
