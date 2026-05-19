import { useCV } from '../../context/useCV';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ExperienceCard from './ExperienceCard';
import AITextarea from './AITextarea';
import EducationCard from './EducationCard';
import SkillsEditor from './SkillsEditor';
import LanguagesEditor from './LanguagesEditor';

export const FREE_TEMPLATE = 'minimal';

const PaywallModal = ({ isRTL, onClose }) => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{isRTL ? 'ميزة مدفوعة' : 'Pro Feature'}</h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          {isRTL
            ? 'هذا القسم متاح فقط في الخطة المدفوعة. قم بالترقية للوصول إلى جميع الأقسام وقوالب احترافية.'
            : 'This section is available in the Pro plan. Upgrade to access all sections and premium templates.'}
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate('/upgrade')}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm transition-all"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
          >
            {isRTL ? '⭐ ترقية الآن — $3/شهر' : '⭐ Upgrade Now — $3/mo'}
          </button>
          <button onClick={onClose} className="w-full py-2.5 rounded-2xl text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors">
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PuzzleIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.5 3A1.5 1.5 0 0015 4.5V5h1a2 2 0 012 2v2.5a1.5 1.5 0 000 3V15a2 2 0 01-2 2H4a2 2 0 01-2-2v-2.5a1.5 1.5 0 000-3V7a2 2 0 012-2h1v-.5A1.5 1.5 0 016.5 3h1A1.5 1.5 0 019 4.5V5h2v-.5A1.5 1.5 0 0112.5 3h1z" />
  </svg>
);

const t = (en, ar, isRTL) => isRTL ? ar : en;


const ALL_SECTIONS = [
  {
    key: 'personalInfo',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    en: { title: 'Personal Info',      desc: 'Name, contact details and profile summary.' },
    ar: { title: 'المعلومات الشخصية', desc: 'اسمك وبيانات التواصل والملخص المهني.' },
    color: '#4f46e5',
  },
  {
    key: 'experience',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    en: { title: 'Professional Experience', desc: 'Work history, roles, and key achievements.' },
    ar: { title: 'الخبرة المهنية',          desc: 'سجل عملك وأدوارك وإنجازاتك الرئيسية.' },
    color: '#4f46e5',
  },
  {
    key: 'education',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>,
    en: { title: 'Education',              desc: 'Degrees, schools, honors, and achievements.' },
    ar: { title: 'التعليم والمؤهلات',      desc: 'درجاتك العلمية ومدارسك وأوسمتك.' },
    color: '#7c3aed',
  },
  {
    key: 'skills',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
    en: { title: 'Skills',     desc: 'Hard and soft skills that set you apart.' },
    ar: { title: 'المهارات',   desc: 'مهاراتك التقنية والشخصية التي تميّزك.' },
    color: '#0891b2',
  },
  {
    key: 'summary',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    en: { title: 'Profile Summary', desc: 'Short intro capturing your strengths and goals.' },
    ar: { title: 'الملف الشخصي',   desc: 'مقدمة قصيرة تعكس نقاط قوتك وأهدافك.' },
    color: '#0f766e',
  },
  {
    key: 'projects',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    en: { title: 'Projects',  desc: 'Showcase key projects, your role, and impact.' },
    ar: { title: 'المشاريع', desc: 'اعرض مشاريعك الرئيسية ودورك فيها وأثرها.' },
    color: '#b45309',
  },
  {
    key: 'languages',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>,
    en: { title: 'Languages', desc: 'Languages you speak and proficiency level.' },
    ar: { title: 'اللغات',   desc: 'اللغات التي تتحدثها ومستوى إتقانك.' },
    color: '#0369a1',
  },
  {
    key: 'certificates',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
    en: { title: 'Certificates',          desc: 'Industry certifications with issuer and date.' },
    ar: { title: 'الشهادات والاعتمادات', desc: 'شهاداتك المهنية مع الجهة المانحة وتاريخها.' },
    color: '#6d28d9',
  },
  {
    key: 'interests',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
    en: { title: 'Interests & Hobbies',   desc: 'Personal interests that enrich your profile.' },
    ar: { title: 'الاهتمامات والهوايات', desc: 'اهتماماتك الشخصية التي تثري قصتك المهنية.' },
    color: '#be185d',
  },
  {
    key: 'courses',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
    en: { title: 'Courses & Training',  desc: 'Online or in-person courses and trainings.' },
    ar: { title: 'الدورات والتدريب',   desc: 'الدورات التدريبية عبر الإنترنت أو الحضورية.' },
    color: '#0e7490',
  },
  {
    key: 'awards',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
    en: { title: 'Awards & Honours',    desc: 'Awards and recognitions from any field.' },
    ar: { title: 'الجوائز والتكريمات', desc: 'جوائزك وتكريماتك في مختلف المجالات.' },
    color: '#d97706',
  },
  {
    key: 'organisations',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
    en: { title: 'Organisations',       desc: 'Memberships or volunteer work with your role.' },
    ar: { title: 'المنظمات والجمعيات', desc: 'عضوياتك أو عملك التطوعي مع دورك.' },
    color: '#065f46',
  },
  {
    key: 'publications',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>,
    en: { title: 'Publications',        desc: 'Articles, papers, or books you authored.' },
    ar: { title: 'المنشورات والأبحاث', desc: 'المقالات والأوراق البحثية أو الكتب التي ألّفتها.' },
    color: '#1e40af',
  },
  {
    key: 'references',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    en: { title: 'References',          desc: 'References from managers or coworkers.' },
    ar: { title: 'المراجع والتزكيات', desc: 'مراجعك من المديرين أو الزملاء.' },
    color: '#374151',
  },
  {
    key: 'custom',
    icon: <PuzzleIcon />,
    en: { title: 'Custom', desc: 'Add a custom section for anything else, or combine sections cleanly.' },
    ar: { title: 'مخصص', desc: 'أضف قسمًا مخصصًا لأي شيء آخر أو لدمج أقسام بشكل أنيق.' },
    color: '#374151',
  },
];

const AddContentModal = ({ isRTL, onClose, onSelect, sectionOrder }) => {
  const overlayRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ maxHeight: '88vh' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t('Add Content', 'إضافة محتوى', isRTL)}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{t('Choose a section to add to your resume', 'اختر قسماً لإضافته إلى سيرتك الذاتية', isRTL)}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALL_SECTIONS.map((section) => {
              const alreadyAdded = section.key !== 'custom' && (sectionOrder.includes(section.key) || section.key === 'design' || section.key === 'personalInfo' || section.key === 'summary');
              return (
                <button
                  key={section.key}
                  onClick={() => onSelect(section.key)}
                  className="text-start p-4 rounded-2xl border transition-all group hover:shadow-md relative"
                  style={{ borderColor: alreadyAdded ? section.color + '44' : '#f1f5f9', background: alreadyAdded ? section.color + '08' : '#fff' }}
                >
                  {alreadyAdded && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: section.color }}>
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: section.color + '18', color: section.color }}>
                    {section.icon}
                  </div>
                  <p className="font-semibold text-slate-800 text-sm leading-snug">{isRTL ? section.ar.title : section.en.title}</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{isRTL ? section.ar.desc : section.en.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomSectionNameModal = ({ isRTL, onConfirm, onClose }) => {
  const [title, setTitle] = useState('');
  const overlayRef = useRef(null);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  const handleConfirm = () => {
    const trimmed = title.trim();
    if (trimmed) onConfirm(trimmed);
  };
  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm" dir={isRTL ? 'rtl' : 'ltr'}>
        <h3 className="text-lg font-bold text-slate-800 mb-1">{t('Name Your Section', 'اسم القسم المخصص', isRTL)}</h3>
        <p className="text-sm text-slate-400 mb-4">{t('Give this custom section a title', 'أدخل عنواناً لهذا القسم المخصص', isRTL)}</p>
        <input
          type="text"
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleConfirm(); }}
          placeholder={t('e.g. Volunteer Work, Achievements...', 'مثال: العمل التطوعي، الإنجازات...', isRTL)}
          className="input-field py-2 text-sm w-full mb-4"
        />
        <div className="flex gap-2" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
            {t('Cancel', 'إلغاء', isRTL)}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!title.trim()}
            className="flex-1 py-2 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
          >
            {t('Add Section', 'إضافة القسم', isRTL)}
          </button>
        </div>
      </div>
    </div>
  );
};

const DeleteBtn = ({ onClick }) => (
  <button onClick={onClick} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded">
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  </button>
);

const AddBtn = ({ onClick, label }) => (
  <button onClick={onClick} className="w-full py-2 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-600 font-medium hover:bg-indigo-100 hover:border-indigo-400 transition-colors text-sm">
    {label}
  </button>
);

const AccordionHeader = ({ en, ar, section, isRTL, openSection, onToggle }) => (
  <div
    className="flex justify-between items-center p-4 bg-white border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
    onClick={() => onToggle(section)}
    style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
  >
    <h3 className="font-medium text-slate-800">{t(en, ar, isRTL)}</h3>
    <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${openSection === section ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>
);

const CardWrapper = ({ children, onDelete }) => (
  <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 space-y-2 relative">
    <div className="absolute top-2 right-2">
      <DeleteBtn onClick={onDelete} />
    </div>
    {children}
  </div>
);

const EditorPanel = () => {
  const { cvData, updateSection, theme, setTheme, addSection, sectionOrder, addCustomSection, updateCustomSection, deleteCustomSection, visiblePersonalFields, togglePersonalField, selectedTemplate } = useCV();
  const { isRTL, currentUser } = useAuth();
  const [openSection, setOpenSection] = useState('personalInfo');
  const [showAddContent, setShowAddContent] = useState(false);
  const [showCustomNameModal, setShowCustomNameModal] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  const isPaidTemplate = selectedTemplate !== FREE_TEMPLATE;
  const isFreeUser = !currentUser || currentUser.plan === 'free';
  const isLocked = isPaidTemplate && isFreeUser;

  const guardedToggle = (section) => {
    if (isLocked && section !== 'personalInfo') {
      setShowPaywall(true);
      return;
    }
    setOpenSection(openSection === section ? null : section);
  };

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    updateSection('personalInfo', { ...cvData.personalInfo, [name]: value });
  };

  const toggle = (section) => setOpenSection(openSection === section ? null : section);

  const handleAddContentSelect = (key) => {
    setShowAddContent(false);
    if (key === 'custom') {
      setShowCustomNameModal(true);
      return;
    }
    if (key !== 'personalInfo' && key !== 'summary') {
      addSection(key);
    }
    setOpenSection(key === 'summary' ? 'personalInfo' : key);
  };

  const handleCustomSectionCreate = (title) => {
    setShowCustomNameModal(false);
    const id = addCustomSection(title);
    setOpenSection(id);
  };

  const lbl = 'block text-xs font-medium text-slate-500 mb-1';
  const inp = 'input-field py-2 text-sm';

  return (
    <>
      {showAddContent && (
        <AddContentModal
          isRTL={isRTL}
          onClose={() => setShowAddContent(false)}
          onSelect={handleAddContentSelect}
          sectionOrder={sectionOrder}
        />
      )}
      {showPaywall && <PaywallModal isRTL={isRTL} onClose={() => setShowPaywall(false)} />}
      {showCustomNameModal && (
        <CustomSectionNameModal
          isRTL={isRTL}
          onConfirm={handleCustomSectionCreate}
          onClose={() => setShowCustomNameModal(false)}
        />
      )}

      {/* Paywall banner for paid templates on free plan */}
      {isLocked && (
        <div className="mx-4 mt-4 rounded-2xl px-4 py-3 flex items-center gap-3" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
          <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold leading-tight">
              {isRTL ? 'قالب مدفوع — المعلومات الشخصية فقط مفتوحة' : 'Paid template — Personal Info only'}
            </p>
            <p className="text-white/70 text-xs mt-0.5">
              {isRTL ? 'ترقّ للوصول إلى كل الأقسام' : 'Upgrade to unlock all sections'}
            </p>
          </div>
          <button
            onClick={() => setShowPaywall(true)}
            className="flex-shrink-0 text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            {isRTL ? 'ترقية' : 'Upgrade'}
          </button>
        </div>
      )}

      <div className="flex flex-col pb-20" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: isRTL ? "'Tajawal', Arial, sans-serif" : undefined }}>

        {/* Personal Info */}
        <div>
          <AccordionHeader en="Personal Information" ar="المعلومات الشخصية" section="personalInfo" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
          {openSection === 'personalInfo' && (
            <div className="p-4 space-y-4 bg-slate-50/50 border-b border-slate-100">

              {/* Photo Upload */}
              <div>
                <label className={lbl}>{t('Profile Photo', 'الصورة الشخصية', isRTL)}</label>
                <div className="flex items-center gap-4 mt-2">
                  {/* Preview circle */}
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-primary-100 flex items-center justify-center border-2 border-dashed border-primary-300">
                    {cvData.personalInfo.photo ? (
                      <img src={cvData.personalInfo.photo} alt="profile" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 bg-primary-600 text-white text-xs font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {t('Upload Photo', 'رفع صورة', isRTL)}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            updateSection('personalInfo', { ...cvData.personalInfo, photo: ev.target.result });
                          };
                          reader.readAsDataURL(file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {cvData.personalInfo.photo ? (
                      <button
                        onClick={() => updateSection('personalInfo', { ...cvData.personalInfo, photo: '' })}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t('Remove Photo', 'حذف الصورة', isRTL)}
                      </button>
                    ) : visiblePersonalFields.photo !== false ? (
                      <button
                        onClick={() => togglePersonalField('photo')}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {t('Remove Default Photo', 'حذف الصورة الافتراضية', isRTL)}
                      </button>
                    ) : (
                      <button
                        onClick={() => togglePersonalField('photo')}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {t('Restore Default Photo', 'استعادة الصورة الافتراضية', isRTL)}
                      </button>
                    )}
                    <p className="text-xs text-slate-400">{t('JPG, PNG or WebP — max 5 MB', 'JPG أو PNG أو WebP — حجم أقصى 5 ميغابايت', isRTL)}</p>
                  </div>
                </div>

                {/* Show/Hide photo toggle */}
                <div className="flex items-center justify-between mt-3 p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-sm font-medium text-slate-700">{t('Show photo in CV', 'إظهار الصورة في السيرة الذاتية', isRTL)}</span>
                  <button
                    type="button"
                    onClick={() => togglePersonalField('photo')}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${visiblePersonalFields.photo !== false ? 'bg-primary-600' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${visiblePersonalFields.photo !== false ? (isRTL ? '-translate-x-6' : 'translate-x-6') : (isRTL ? '-translate-x-1' : 'translate-x-1')}`} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1"><label className={lbl}>{t('Full Name','الاسم الكامل',isRTL)}</label><input type="text" name="fullName" value={cvData.personalInfo.fullName} onChange={handlePersonalInfoChange} className={inp} /></div>
                <div className="col-span-2 sm:col-span-1"><label className={lbl}>{t('Job Title','المسمى الوظيفي',isRTL)}</label><input type="text" name="jobTitle" value={cvData.personalInfo.jobTitle} onChange={handlePersonalInfoChange} className={inp} /></div>
                <div className="col-span-2 sm:col-span-1"><label className={lbl}>{t('Email','البريد الإلكتروني',isRTL)}</label><input type="email" name="email" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} className={inp} /></div>
                <div className="col-span-2 sm:col-span-1"><label className={lbl}>{t('Phone','الهاتف',isRTL)}</label><input type="text" name="phone" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} className={inp} /></div>
                <div className="col-span-2"><label className={lbl}>{t('Location','الموقع',isRTL)}</label><input type="text" name="location" value={cvData.personalInfo.location} onChange={handlePersonalInfoChange} className={inp} /></div>
                <div className="col-span-2"><label className={lbl}>LinkedIn</label><input type="text" name="linkedin" value={cvData.personalInfo.linkedin || ''} onChange={handlePersonalInfoChange} className={inp} /></div>
                <div className="col-span-2">
                  <label className={lbl}>{t('Professional Summary','الملخص المهني',isRTL)}</label>
                  <AITextarea
                    value={cvData.personalInfo.summary}
                    onChange={val => handlePersonalInfoChange({ target: { name: 'summary', value: val } })}
                    rows={4}
                    className={`${inp} resize-none`}
                    placeholder={isRTL ? 'لخّص خلفيتك المهنية...' : 'Summarize your professional background...'}
                    isRTL={isRTL}
                    align={cvData.personalInfo.summaryAlign}
                    onAlignChange={val => handlePersonalInfoChange({ target: { name: 'summaryAlign', value: val } })}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Experience */}
        <div>
          <AccordionHeader en="Experience" ar="الخبرة العملية" section="experience" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
          {openSection === 'experience' && (
            <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
              {cvData.experience.map((exp) => (
                <ExperienceCard key={exp.id} exp={exp} isRTL={isRTL} labelClass={lbl} inputClass={inp}
                  onChange={(field, value) => updateSection('experience', cvData.experience.map(e => e.id === exp.id ? { ...e, [field]: value } : e))}
                  onDelete={() => updateSection('experience', cvData.experience.filter(e => e.id !== exp.id))}
                />
              ))}
              <AddBtn onClick={() => updateSection('experience', [...cvData.experience, { id: `exp-${Date.now()}`, jobTitle: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }])}
                label={t('+ Add Experience','+ إضافة خبرة',isRTL)} />
            </div>
          )}
        </div>

        {/* Education */}
        <div>
          <AccordionHeader en="Education" ar="التعليم" section="education" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
          {openSection === 'education' && (
            <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
              {cvData.education.map((edu) => (
                <EducationCard key={edu.id} edu={edu} isRTL={isRTL} labelClass={lbl} inputClass={inp}
                  onChange={(field, value) => updateSection('education', cvData.education.map(e => e.id === edu.id ? { ...e, [field]: value } : e))}
                  onDelete={() => updateSection('education', cvData.education.filter(e => e.id !== edu.id))}
                />
              ))}
              <AddBtn onClick={() => updateSection('education', [...cvData.education, { id: `edu-${Date.now()}`, degree: '', institution: '', location: '', startDate: '', endDate: '', description: '' }])}
                label={t('+ Add Education','+ إضافة تعليم',isRTL)} />
            </div>
          )}
        </div>

        {/* Skills */}
        <div>
          <AccordionHeader en="Skills" ar="المهارات" section="skills" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
          {openSection === 'skills' && <SkillsEditor skills={cvData.skills} isRTL={isRTL} updateSection={updateSection} />}
        </div>

        {/* Languages */}
        <div>
          <AccordionHeader en="Languages" ar="اللغات" section="languages" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
          {openSection === 'languages' && <LanguagesEditor languages={cvData.languages} isRTL={isRTL} updateSection={updateSection} />}
        </div>

        {/* Projects */}
        {(sectionOrder.includes('projects') || cvData.projects?.length > 0) && (
          <div>
            <AccordionHeader en="Projects" ar="المشاريع" section="projects" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
            {openSection === 'projects' && (
              <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
                {(cvData.projects || []).map((proj, i) => (
                  <CardWrapper key={proj.id} onDelete={() => updateSection('projects', cvData.projects.filter(p => p.id !== proj.id))}>
                    <div><label className={lbl}>{t('Project Title','عنوان المشروع',isRTL)}</label><input className={inp} value={proj.title} onChange={e => updateSection('projects', cvData.projects.map(p => p.id === proj.id ? { ...p, title: e.target.value } : p))} /></div>
                    <div><label className={lbl}>{t('Link / URL','الرابط',isRTL)}</label><input className={inp} value={proj.link || ''} onChange={e => updateSection('projects', cvData.projects.map(p => p.id === proj.id ? { ...p, link: e.target.value } : p))} /></div>
                    <div><label className={lbl}>{t('Description','الوصف',isRTL)}</label><AITextarea className={`${inp} resize-none`} rows={3} value={proj.description} onChange={val => updateSection('projects', cvData.projects.map(p => p.id === proj.id ? { ...p, description: val } : p))} isRTL={isRTL} placeholder={isRTL ? 'صف المشروع...' : 'Describe the project...'} align={proj.descriptionAlign} onAlignChange={val => updateSection('projects', cvData.projects.map(p => p.id === proj.id ? { ...p, descriptionAlign: val } : p))} /></div>
                  </CardWrapper>
                ))}
                <AddBtn onClick={() => updateSection('projects', [...(cvData.projects||[]), { id: `proj-${Date.now()}`, title: '', link: '', description: '' }])}
                  label={t('+ Add Project','+ إضافة مشروع',isRTL)} />
              </div>
            )}
          </div>
        )}

        {/* Certificates */}
        {sectionOrder.includes('certificates') && (
          <div>
            <AccordionHeader en="Certificates" ar="الشهادات والاعتمادات" section="certificates" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
            {openSection === 'certificates' && (
              <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
                {(cvData.certificates || []).map((cert) => (
                  <CardWrapper key={cert.id} onDelete={() => updateSection('certificates', cvData.certificates.filter(c => c.id !== cert.id))}>
                    <div><label className={lbl}>{t('Certificate Name','اسم الشهادة',isRTL)}</label><input className={inp} value={cert.name} onChange={e => updateSection('certificates', cvData.certificates.map(c => c.id === cert.id ? { ...c, name: e.target.value } : c))} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className={lbl}>{t('Issuer','الجهة المانحة',isRTL)}</label><input className={inp} value={cert.issuer || ''} onChange={e => updateSection('certificates', cvData.certificates.map(c => c.id === cert.id ? { ...c, issuer: e.target.value } : c))} /></div>
                      <div><label className={lbl}>{t('Date','التاريخ',isRTL)}</label><input className={inp} value={cert.date || ''} onChange={e => updateSection('certificates', cvData.certificates.map(c => c.id === cert.id ? { ...c, date: e.target.value } : c))} /></div>
                    </div>
                    <div><label className={lbl}>{t('Description','الوصف',isRTL)}</label><AITextarea className={`${inp} resize-none`} rows={2} value={cert.description || ''} onChange={val => updateSection('certificates', cvData.certificates.map(c => c.id === cert.id ? { ...c, description: val } : c))} isRTL={isRTL} placeholder={isRTL ? 'صف الشهادة...' : 'Describe the certificate...'} align={cert.descriptionAlign} onAlignChange={val => updateSection('certificates', cvData.certificates.map(c => c.id === cert.id ? { ...c, descriptionAlign: val } : c))} /></div>
                  </CardWrapper>
                ))}
                <AddBtn onClick={() => updateSection('certificates', [...(cvData.certificates||[]), { id: `cert-${Date.now()}`, name: '', issuer: '', date: '', description: '' }])}
                  label={t('+ Add Certificate','+ إضافة شهادة',isRTL)} />
              </div>
            )}
          </div>
        )}

        {/* Interests */}
        {sectionOrder.includes('interests') && (
          <div>
            <AccordionHeader en="Interests & Hobbies" ar="الاهتمامات والهوايات" section="interests" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
            {openSection === 'interests' && (
              <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
                {(cvData.interests || []).map((item) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <input className={`${inp} flex-1`} value={item.name} placeholder={t('e.g. Photography','مثال: التصوير',isRTL)} onChange={e => updateSection('interests', cvData.interests.map(i => i.id === item.id ? { ...i, name: e.target.value } : i))} />
                    <DeleteBtn onClick={() => updateSection('interests', cvData.interests.filter(i => i.id !== item.id))} />
                  </div>
                ))}
                <AddBtn onClick={() => updateSection('interests', [...(cvData.interests||[]), { id: `int-${Date.now()}`, name: '' }])}
                  label={t('+ Add Interest','+ إضافة اهتمام',isRTL)} />
              </div>
            )}
          </div>
        )}

        {/* Courses */}
        {sectionOrder.includes('courses') && (
          <div>
            <AccordionHeader en="Courses & Training" ar="الدورات والتدريب" section="courses" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
            {openSection === 'courses' && (
              <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
                {(cvData.courses || []).map((course) => (
                  <CardWrapper key={course.id} onDelete={() => updateSection('courses', cvData.courses.filter(c => c.id !== course.id))}>
                    <div><label className={lbl}>{t('Course Name','اسم الدورة',isRTL)}</label><input className={inp} value={course.name} onChange={e => updateSection('courses', cvData.courses.map(c => c.id === course.id ? { ...c, name: e.target.value } : c))} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className={lbl}>{t('Institution','المؤسسة',isRTL)}</label><input className={inp} value={course.institution || ''} onChange={e => updateSection('courses', cvData.courses.map(c => c.id === course.id ? { ...c, institution: e.target.value } : c))} /></div>
                      <div><label className={lbl}>{t('Date','التاريخ',isRTL)}</label><input className={inp} value={course.date || ''} onChange={e => updateSection('courses', cvData.courses.map(c => c.id === course.id ? { ...c, date: e.target.value } : c))} /></div>
                    </div>
                  </CardWrapper>
                ))}
                <AddBtn onClick={() => updateSection('courses', [...(cvData.courses||[]), { id: `crs-${Date.now()}`, name: '', institution: '', date: '' }])}
                  label={t('+ Add Course','+ إضافة دورة',isRTL)} />
              </div>
            )}
          </div>
        )}

        {/* Awards */}
        {sectionOrder.includes('awards') && (
          <div>
            <AccordionHeader en="Awards & Honours" ar="الجوائز والتكريمات" section="awards" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
            {openSection === 'awards' && (
              <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
                {(cvData.awards || []).map((award) => (
                  <CardWrapper key={award.id} onDelete={() => updateSection('awards', cvData.awards.filter(a => a.id !== award.id))}>
                    <div><label className={lbl}>{t('Award Title','عنوان الجائزة',isRTL)}</label><input className={inp} value={award.title} onChange={e => updateSection('awards', cvData.awards.map(a => a.id === award.id ? { ...a, title: e.target.value } : a))} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className={lbl}>{t('Issuer','الجهة المانحة',isRTL)}</label><input className={inp} value={award.issuer || ''} onChange={e => updateSection('awards', cvData.awards.map(a => a.id === award.id ? { ...a, issuer: e.target.value } : a))} /></div>
                      <div><label className={lbl}>{t('Date','التاريخ',isRTL)}</label><input className={inp} value={award.date || ''} onChange={e => updateSection('awards', cvData.awards.map(a => a.id === award.id ? { ...a, date: e.target.value } : a))} /></div>
                    </div>
                    <div><label className={lbl}>{t('Description','الوصف',isRTL)}</label><AITextarea className={`${inp} resize-none`} rows={2} value={award.description || ''} onChange={val => updateSection('awards', cvData.awards.map(a => a.id === award.id ? { ...a, description: val } : a))} isRTL={isRTL} placeholder={isRTL ? 'صف الجائزة...' : 'Describe the award...'} align={award.descriptionAlign} onAlignChange={val => updateSection('awards', cvData.awards.map(a => a.id === award.id ? { ...a, descriptionAlign: val } : a))} /></div>
                  </CardWrapper>
                ))}
                <AddBtn onClick={() => updateSection('awards', [...(cvData.awards||[]), { id: `awd-${Date.now()}`, title: '', issuer: '', date: '', description: '' }])}
                  label={t('+ Add Award','+ إضافة جائزة',isRTL)} />
              </div>
            )}
          </div>
        )}

        {/* Organisations */}
        {sectionOrder.includes('organisations') && (
          <div>
            <AccordionHeader en="Organisations" ar="المنظمات والجمعيات" section="organisations" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
            {openSection === 'organisations' && (
              <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
                {(cvData.organisations || []).map((org) => (
                  <CardWrapper key={org.id} onDelete={() => updateSection('organisations', cvData.organisations.filter(o => o.id !== org.id))}>
                    <div><label className={lbl}>{t('Organisation Name','اسم المنظمة',isRTL)}</label><input className={inp} value={org.name} onChange={e => updateSection('organisations', cvData.organisations.map(o => o.id === org.id ? { ...o, name: e.target.value } : o))} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className={lbl}>{t('Role','الدور',isRTL)}</label><input className={inp} value={org.role || ''} onChange={e => updateSection('organisations', cvData.organisations.map(o => o.id === org.id ? { ...o, role: e.target.value } : o))} /></div>
                      <div><label className={lbl}>{t('Date','التاريخ',isRTL)}</label><input className={inp} value={org.date || ''} onChange={e => updateSection('organisations', cvData.organisations.map(o => o.id === org.id ? { ...o, date: e.target.value } : o))} /></div>
                    </div>
                  </CardWrapper>
                ))}
                <AddBtn onClick={() => updateSection('organisations', [...(cvData.organisations||[]), { id: `org-${Date.now()}`, name: '', role: '', date: '' }])}
                  label={t('+ Add Organisation','+ إضافة منظمة',isRTL)} />
              </div>
            )}
          </div>
        )}

        {/* Publications */}
        {sectionOrder.includes('publications') && (
          <div>
            <AccordionHeader en="Publications" ar="المنشورات والأبحاث" section="publications" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
            {openSection === 'publications' && (
              <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
                {(cvData.publications || []).map((pub) => (
                  <CardWrapper key={pub.id} onDelete={() => updateSection('publications', cvData.publications.filter(p => p.id !== pub.id))}>
                    <div><label className={lbl}>{t('Title','العنوان',isRTL)}</label><input className={inp} value={pub.title} onChange={e => updateSection('publications', cvData.publications.map(p => p.id === pub.id ? { ...p, title: e.target.value } : p))} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className={lbl}>{t('Publisher','الناشر',isRTL)}</label><input className={inp} value={pub.publisher || ''} onChange={e => updateSection('publications', cvData.publications.map(p => p.id === pub.id ? { ...p, publisher: e.target.value } : p))} /></div>
                      <div><label className={lbl}>{t('Date','التاريخ',isRTL)}</label><input className={inp} value={pub.date || ''} onChange={e => updateSection('publications', cvData.publications.map(p => p.id === pub.id ? { ...p, date: e.target.value } : p))} /></div>
                    </div>
                    <div><label className={lbl}>{t('Description','الوصف',isRTL)}</label><AITextarea className={`${inp} resize-none`} rows={2} value={pub.description || ''} onChange={val => updateSection('publications', cvData.publications.map(p => p.id === pub.id ? { ...p, description: val } : p))} isRTL={isRTL} placeholder={isRTL ? 'صف المنشور...' : 'Describe the publication...'} align={pub.descriptionAlign} onAlignChange={val => updateSection('publications', cvData.publications.map(p => p.id === pub.id ? { ...p, descriptionAlign: val } : p))} /></div>
                  </CardWrapper>
                ))}
                <AddBtn onClick={() => updateSection('publications', [...(cvData.publications||[]), { id: `pub-${Date.now()}`, title: '', publisher: '', date: '', description: '' }])}
                  label={t('+ Add Publication','+ إضافة منشور',isRTL)} />
              </div>
            )}
          </div>
        )}

        {/* References */}
        {sectionOrder.includes('references') && (
          <div>
            <AccordionHeader en="References" ar="المراجع والتزكيات" section="references" isRTL={isRTL} openSection={openSection} onToggle={guardedToggle} />
            {openSection === 'references' && (
              <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
                {(cvData.references || []).map((ref) => (
                  <CardWrapper key={ref.id} onDelete={() => updateSection('references', cvData.references.filter(r => r.id !== ref.id))}>
                    <div><label className={lbl}>{t('Name','الاسم',isRTL)}</label><input className={inp} value={ref.name} onChange={e => updateSection('references', cvData.references.map(r => r.id === ref.id ? { ...r, name: e.target.value } : r))} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className={lbl}>{t('Job Title','المسمى',isRTL)}</label><input className={inp} value={ref.title || ''} onChange={e => updateSection('references', cvData.references.map(r => r.id === ref.id ? { ...r, title: e.target.value } : r))} /></div>
                      <div><label className={lbl}>{t('Company','الشركة',isRTL)}</label><input className={inp} value={ref.company || ''} onChange={e => updateSection('references', cvData.references.map(r => r.id === ref.id ? { ...r, company: e.target.value } : r))} /></div>
                      <div><label className={lbl}>{t('Email','البريد',isRTL)}</label><input className={inp} value={ref.email || ''} onChange={e => updateSection('references', cvData.references.map(r => r.id === ref.id ? { ...r, email: e.target.value } : r))} /></div>
                      <div><label className={lbl}>{t('Phone','الهاتف',isRTL)}</label><input className={inp} value={ref.phone || ''} onChange={e => updateSection('references', cvData.references.map(r => r.id === ref.id ? { ...r, phone: e.target.value } : r))} /></div>
                    </div>
                  </CardWrapper>
                ))}
                <AddBtn onClick={() => updateSection('references', [...(cvData.references||[]), { id: `ref-${Date.now()}`, name: '', title: '', company: '', email: '', phone: '' }])}
                  label={t('+ Add Reference','+ إضافة مرجع',isRTL)} />
              </div>
            )}
          </div>
        )}

        {/* Custom Sections */}
        {(cvData.customSections || []).filter(sec => sectionOrder.includes(sec.id)).map(sec => (
          <div key={sec.id}>
            <div
              className="flex justify-between items-center p-4 bg-white border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggle(sec.id)}
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
            >
              <div className="flex items-center gap-2" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                <span className="text-slate-400"><PuzzleIcon /></span>
                <h3 className="font-medium text-slate-800">{sec.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); deleteCustomSection(sec.id); }}
                  className="text-red-400 hover:text-red-600 transition-colors p-1 rounded"
                  title={t('Delete section', 'حذف القسم', isRTL)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <svg className={`w-5 h-5 text-slate-400 transform transition-transform ${openSection === sec.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {openSection === sec.id && (
              <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
                <div>
                  <label className={lbl}>{t('Section Title', 'عنوان القسم', isRTL)}</label>
                  <input
                    className={inp}
                    value={sec.title}
                    onChange={e => updateCustomSection(sec.id, { ...sec, title: e.target.value })}
                  />
                </div>
                {sec.items.map(item => (
                  <CardWrapper key={item.id} onDelete={() => updateCustomSection(sec.id, { ...sec, items: sec.items.filter(i => i.id !== item.id) })}>
                    <div><label className={lbl}>{t('Title', 'العنوان', isRTL)}</label><input className={inp} value={item.title || ''} onChange={e => updateCustomSection(sec.id, { ...sec, items: sec.items.map(i => i.id === item.id ? { ...i, title: e.target.value } : i) })} /></div>
                    <div><label className={lbl}>{t('Subtitle / Date', 'العنوان الفرعي / التاريخ', isRTL)}</label><input className={inp} value={item.subtitle || ''} onChange={e => updateCustomSection(sec.id, { ...sec, items: sec.items.map(i => i.id === item.id ? { ...i, subtitle: e.target.value } : i) })} /></div>
                    <div><label className={lbl}>{t('Description', 'الوصف', isRTL)}</label><AITextarea className={`${inp} resize-none`} rows={3} value={item.description || ''} onChange={val => updateCustomSection(sec.id, { ...sec, items: sec.items.map(i => i.id === item.id ? { ...i, description: val } : i) })} isRTL={isRTL} placeholder={isRTL ? 'صف العنصر...' : 'Describe this item...'} align={item.descriptionAlign} onAlignChange={val => updateCustomSection(sec.id, { ...sec, items: sec.items.map(i => i.id === item.id ? { ...i, descriptionAlign: val } : i) })} /></div>
                  </CardWrapper>
                ))}
                <AddBtn
                  onClick={() => updateCustomSection(sec.id, { ...sec, items: [...sec.items, { id: `ci-${Date.now()}`, title: '', subtitle: '', description: '' }] })}
                  label={t('+ Add Item', '+ إضافة عنصر', isRTL)}
                />
              </div>
            )}
          </div>
        ))}

        {/* Add Content Button */}
        <div className="p-4 mt-2">
          <button
            onClick={() => isLocked ? setShowPaywall(true) : setShowAddContent(true)}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: isLocked
                ? 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 100%)'
                : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#fff',
              boxShadow: isLocked ? 'none' : '0 4px 14px rgba(79,70,229,0.35)',
            }}
          >
            {isLocked ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {isRTL ? 'يتطلب ترقية' : 'Requires Upgrade'}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {t('+ Add Content', '+ إضافة محتوى', isRTL)}
              </>
            )}
          </button>
        </div>

      </div>
    </>
  );
};

export default EditorPanel;
