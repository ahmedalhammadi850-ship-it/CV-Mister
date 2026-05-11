import { useState } from 'react';
import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import EditorPanel from './EditorPanel';
import LivePreview from './LivePreview';

const CVBuilder = () => {
  const { selectedTemplate, setSelectedTemplate } = useCV();
  const { isRTL } = useAuth();
  const [activeTab, setActiveTab] = useState('editor');

  const templateOptions = [
    { value: 'modern',    en: 'Modern',    ar: 'عصري'    },
    { value: 'classic',   en: 'Classic',   ar: 'كلاسيكي' },
    { value: 'creative',  en: 'Creative',  ar: 'إبداعي'  },
    { value: 'minimal',   en: 'Minimal',   ar: 'بسيط'    },
    { value: 'executive', en: 'Executive', ar: 'تنفيذي'  },
  ];

  return (
    <div
      className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden bg-slate-100"
      dir={isRTL ? 'rtl' : 'ltr'}
    >

      {/* Mobile Tabs */}
      <div className="md:hidden flex bg-white border-b border-slate-200 sticky top-0 z-10">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'editor' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500'}`}
        >
          {isRTL ? 'تعديل المعلومات' : 'Edit Info'}
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'preview' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-slate-500'}`}
        >
          {isRTL ? 'المعاينة' : 'Preview'}
        </button>
      </div>

      {/* Editor Sidebar */}
      <div className={`w-full md:w-[450px] lg:w-[500px] flex-shrink-0 bg-white border-r border-slate-200 overflow-y-auto ${activeTab === 'editor' ? 'block' : 'hidden md:block'}`}>
        <div className="p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="font-heading font-bold text-lg text-slate-800">
            {isRTL ? 'محتوى السيرة الذاتية' : 'Resume Content'}
          </h2>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="text-sm border border-slate-200 rounded-md px-2 py-1 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {templateOptions.map(t => (
              <option key={t.value} value={t.value}>
                {isRTL ? t.ar : t.en}
              </option>
            ))}
          </select>
        </div>

        <EditorPanel />
      </div>

      {/* Live Preview */}
      <div className={`flex-1 bg-slate-100 overflow-y-auto ${activeTab === 'preview' ? 'block' : 'hidden md:block'}`}>
        <div className="sticky top-0 right-0 p-4 flex justify-end gap-3 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <button className="bg-white border border-slate-200 text-slate-700 shadow-sm px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {isRTL ? 'تقييم ATS: 95/100' : 'ATS Score: 95/100'}
            </button>
          </div>
          <div className="pointer-events-auto">
            <button className="bg-primary-600 text-white shadow-md px-5 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {isRTL ? 'تنزيل PDF' : 'Download PDF'}
            </button>
          </div>
        </div>

        <div className="p-4 md:p-8 flex justify-center pb-20">
          <LivePreview />
        </div>
      </div>
    </div>
  );
};

export default CVBuilder;
