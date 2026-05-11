import { useState } from 'react';
import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import EditorPanel from './EditorPanel';
import CustomizePanel from './CustomizePanel';
import LivePreview from './LivePreview';

const OverviewIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ContentIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CustomizeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const PANEL_TABS = [
  { key: 'overview',   enLabel: 'Overview',   arLabel: 'نظرة عامة', Icon: OverviewIcon   },
  { key: 'content',    enLabel: 'Content',    arLabel: 'المحتوى',   Icon: ContentIcon    },
  { key: 'customize',  enLabel: 'Customize',  arLabel: 'تخصيص',     Icon: CustomizeIcon  },
];

const CVBuilder = () => {
  const { selectedTemplate, cvData, theme, visibleSections } = useCV();
  const { isRTL } = useAuth();
  const [mobileTab, setMobileTab] = useState('editor');
  const [panelTab, setPanelTab] = useState('content');

  return (
    <div
      className="flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden bg-slate-100"
      dir={isRTL ? 'rtl' : 'ltr'}
    >

      {/* Mobile top tabs: Edit / Preview */}
      <div className="md:hidden flex bg-white border-b border-slate-200 sticky top-0 z-10">
        <button
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-3 text-sm font-medium ${mobileTab === 'editor' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
        >
          {isRTL ? 'تعديل' : 'Edit'}
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-3 text-sm font-medium ${mobileTab === 'preview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}
        >
          {isRTL ? 'المعاينة' : 'Preview'}
        </button>
      </div>

      {/* ── Editor Sidebar ── */}
      <div className={`w-full md:w-[420px] lg:w-[460px] flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden ${mobileTab === 'editor' ? 'flex' : 'hidden md:flex'}`}>

        {/* Panel tab bar */}
        <div className="flex border-b border-slate-100 bg-white sticky top-0 z-10 flex-shrink-0">
          {PANEL_TABS.map(({ key, enLabel, arLabel, Icon }) => {
            const active = panelTab === key;
            return (
              <button
                key={key}
                onClick={() => setPanelTab(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                  active
                    ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50'
                    : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon />
                <span>{isRTL ? arLabel : enLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Panel content */}
        <div className="overflow-y-auto flex-1">
          {panelTab === 'overview' && <OverviewPanel cvData={cvData} theme={theme} selectedTemplate={selectedTemplate} visibleSections={visibleSections} isRTL={isRTL} setPanelTab={setPanelTab} />}
          {panelTab === 'content' && <EditorPanel />}
          {panelTab === 'customize' && <CustomizePanel />}
        </div>
      </div>

      {/* ── Live Preview ── */}
      <div className={`flex-1 bg-slate-100 overflow-y-auto ${mobileTab === 'preview' ? 'block' : 'hidden md:block'}`}>
        <div className="sticky top-0 right-0 p-4 flex justify-end gap-3 z-10 pointer-events-none">
          <div className="pointer-events-auto">
            <button className="bg-white border border-slate-200 text-slate-700 shadow-sm px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {isRTL ? 'تقييم ATS: 95/100' : 'ATS Score: 95/100'}
            </button>
          </div>
          <div className="pointer-events-auto">
            <button className="bg-indigo-600 text-white shadow-md px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm">
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

/* ── Overview Panel ── */
const SECTION_LABELS = {
  summary:    { en: 'Summary',    ar: 'الملخص'    },
  experience: { en: 'Experience', ar: 'الخبرة'    },
  education:  { en: 'Education',  ar: 'التعليم'   },
  skills:     { en: 'Skills',     ar: 'المهارات'  },
  projects:   { en: 'Projects',   ar: 'المشاريع'  },
  languages:  { en: 'Languages',  ar: 'اللغات'    },
};

const OverviewPanel = ({ cvData, theme, selectedTemplate, visibleSections, isRTL, setPanelTab }) => {
  const completionItems = [
    { key: 'name',       label: isRTL ? 'الاسم'              : 'Name',             done: !!cvData.personalInfo.fullName   },
    { key: 'jobTitle',   label: isRTL ? 'المسمى الوظيفي'     : 'Job title',         done: !!cvData.personalInfo.jobTitle   },
    { key: 'email',      label: isRTL ? 'البريد الإلكتروني'  : 'Email',             done: !!cvData.personalInfo.email      },
    { key: 'summary',    label: isRTL ? 'الملخص المهني'      : 'Summary',           done: !!cvData.personalInfo.summary    },
    { key: 'experience', label: isRTL ? 'الخبرة'             : 'Experience',        done: cvData.experience?.length > 0   },
    { key: 'education',  label: isRTL ? 'التعليم'            : 'Education',         done: cvData.education?.length > 0    },
    { key: 'skills',     label: isRTL ? 'المهارات'           : 'Skills',            done: cvData.skills?.length > 0       },
  ];
  const doneCount = completionItems.filter(i => i.done).length;
  const pct = Math.round((doneCount / completionItems.length) * 100);

  const activeSections = Object.entries(visibleSections).filter(([, v]) => v).map(([k]) => k);

  return (
    <div className="p-5 space-y-6 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Completion */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800 text-sm">{isRTL ? 'اكتمال السيرة الذاتية' : 'CV Completion'}</span>
          <span className="text-sm font-bold text-indigo-600">{pct}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: theme.primaryColor }}
          />
        </div>
        <div className="space-y-1.5">
          {completionItems.map(item => (
            <div
              key={item.key}
              className="flex items-center gap-2 text-sm"
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {item.done
                  ? <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  : <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                }
              </span>
              <span className={item.done ? 'text-slate-700' : 'text-slate-400'}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Active template */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-medium text-slate-400 mb-1">{isRTL ? 'القالب المحدد' : 'Active template'}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800 capitalize">{selectedTemplate}</span>
          <button
            onClick={() => setPanelTab('customize')}
            className="text-xs text-indigo-600 font-medium hover:underline"
          >
            {isRTL ? 'تغيير' : 'Change'}
          </button>
        </div>
      </div>

      {/* Active sections */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-slate-400">{isRTL ? 'الأقسام الفعّالة' : 'Active sections'}</p>
          <button
            onClick={() => setPanelTab('customize')}
            className="text-xs text-indigo-600 font-medium hover:underline"
          >
            {isRTL ? 'تعديل' : 'Edit'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activeSections.map(k => (
            <span key={k} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
              {SECTION_LABELS[k]?.[isRTL ? 'ar' : 'en'] ?? k}
            </span>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setPanelTab('content')}
          className="flex flex-col items-center gap-1.5 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
        >
          <ContentIcon />
          <span className="text-xs font-medium text-slate-600">{isRTL ? 'تعديل المحتوى' : 'Edit Content'}</span>
        </button>
        <button
          onClick={() => setPanelTab('customize')}
          className="flex flex-col items-center gap-1.5 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
        >
          <CustomizeIcon />
          <span className="text-xs font-medium text-slate-600">{isRTL ? 'تخصيص التصميم' : 'Customize Design'}</span>
        </button>
      </div>
    </div>
  );
};

export default CVBuilder;
