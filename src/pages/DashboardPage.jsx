import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSavedCVs, deleteCV, duplicateCV, formatDate } from '../utils/cvStorage';

const TEMPLATE_COLORS = {
  modern:    { from: '#4f46e5', to: '#818cf8' },
  classic:   { from: '#1e3a5f', to: '#2563eb' },
  creative:  { from: '#7c3aed', to: '#c026d3' },
  minimal:   { from: '#374151', to: '#6b7280' },
  executive: { from: '#0f766e', to: '#14b8a6' },
};

/* ── Add-Content Modal Data ── */
const CONTENT_SECTIONS = [
  {
    key: 'experience',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    en: { title: 'Professional Experience', desc: 'Add your work history, roles, and key achievements.' },
    ar: { title: 'الخبرة المهنية', desc: 'أضف سجل عملك وأدوارك وإنجازاتك الرئيسية.' },
    color: '#4f46e5',
  },
  {
    key: 'skills',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    en: { title: 'Skills', desc: 'Highlight your hard and soft skills that set you apart.' },
    ar: { title: 'المهارات', desc: 'أبرز مهاراتك التقنية والشخصية التي تميّزك.' },
    color: '#0891b2',
  },
  {
    key: 'education',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
    en: { title: 'Education', desc: 'Add your degrees, schools, honors, and achievements.' },
    ar: { title: 'التعليم والمؤهلات', desc: 'أضف درجاتك العلمية ومدارسك وأوسمتك ومؤهلاتك.' },
    color: '#7c3aed',
  },
  {
    key: 'summary',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    en: { title: 'Profile Summary', desc: 'Write a short intro that captures your strengths and goals.' },
    ar: { title: 'الملف الشخصي', desc: 'اكتب مقدمة قصيرة تعكس نقاط قوتك وأهدافك المهنية.' },
    color: '#0f766e',
  },
  {
    key: 'projects',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    en: { title: 'Projects', desc: 'Showcase key projects, your role, and their impact.' },
    ar: { title: 'المشاريع', desc: 'اعرض مشاريعك الرئيسية ودورك فيها وأثرها.' },
    color: '#b45309',
  },
  {
    key: 'languages',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    en: { title: 'Languages', desc: 'List languages you speak and your proficiency level.' },
    ar: { title: 'اللغات', desc: 'أدرج اللغات التي تتحدثها ومستوى إتقانك لها.' },
    color: '#0369a1',
  },
  {
    key: 'certificates',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    en: { title: 'Certificates', desc: 'Add industry certifications with issuer and date earned.' },
    ar: { title: 'الشهادات والاعتمادات', desc: 'أضف شهاداتك المهنية مع الجهة المانحة وتاريخ الحصول عليها.' },
    color: '#6d28d9',
  },
  {
    key: 'interests',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    en: { title: 'Interests & Hobbies', desc: 'Share personal interests that enrich your profile story.' },
    ar: { title: 'الاهتمامات والهوايات', desc: 'شارك اهتماماتك الشخصية التي تثري قصتك المهنية.' },
    color: '#be185d',
  },
  {
    key: 'courses',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    en: { title: 'Courses & Training', desc: 'Add online or in-person courses and trainings completed.' },
    ar: { title: 'الدورات والتدريب', desc: 'أضف الدورات التدريبية عبر الإنترنت أو الحضورية التي أكملتها.' },
    color: '#0e7490',
  },
  {
    key: 'awards',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    en: { title: 'Awards & Honours', desc: 'Highlight your awards and recognitions from any field.' },
    ar: { title: 'الجوائز والتكريمات', desc: 'أبرز جوائزك وتكريماتك في مختلف المجالات.' },
    color: '#d97706',
  },
  {
    key: 'organisations',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    en: { title: 'Organisations', desc: 'Add memberships or volunteer work including your role.' },
    ar: { title: 'المنظمات والجمعيات', desc: 'أضف عضوياتك أو عملك التطوعي مع دورك فيها.' },
    color: '#065f46',
  },
  {
    key: 'publications',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    en: { title: 'Publications', desc: 'List articles, papers, or books you authored or contributed to.' },
    ar: { title: 'المنشورات والأبحاث', desc: 'أدرج المقالات والأوراق البحثية أو الكتب التي ألّفتها.' },
    color: '#1e40af',
  },
  {
    key: 'references',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    en: { title: 'References', desc: 'Add references from managers or coworkers with contact info.' },
    ar: { title: 'المراجع والتزكيات', desc: 'أضف مراجعك من المديرين أو الزملاء مع بيانات الاتصال.' },
    color: '#374151',
  },
  {
    key: 'custom',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    en: { title: 'Custom Section', desc: 'Create a custom section for anything else you want to add.' },
    ar: { title: 'قسم مخصص', desc: 'أنشئ قسماً مخصصاً لأي شيء آخر تريد إضافته.' },
    color: '#6b7280',
    dashed: true,
  },
];

/* ── Add Content Modal ── */
const AddContentModal = ({ onClose, onSelect, isRTL }) => {
  const overlayRef = useRef(null);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isRTL ? 'إضافة محتوى' : 'Add Content'}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {isRTL ? 'اختر قسماً لإضافته إلى سيرتك الذاتية' : 'Choose a section to add to your resume'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {CONTENT_SECTIONS.map((section) => (
              <button
                key={section.key}
                onClick={() => onSelect(section)}
                className={`text-start p-4 rounded-2xl border transition-all group hover:shadow-md ${
                  section.dashed
                    ? 'border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/40'
                    : 'border-slate-100 hover:border-opacity-60 bg-white hover:bg-slate-50/80'
                }`}
                style={!section.dashed ? { '--hover-color': section.color } : {}}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
                  style={{ background: section.color + '18', color: section.color }}
                >
                  {section.icon}
                </div>
                <p className="font-semibold text-slate-800 text-sm leading-snug group-hover:text-slate-900">
                  {isRTL ? section.ar.title : section.en.title}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {isRTL ? section.ar.desc : section.en.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── CV Card ── */
const CVCard = ({ cv, onDelete, onDuplicate, isRTL }) => {
  const navigate = useNavigate();
  const colors = TEMPLATE_COLORS[cv.template] || TEMPLATE_COLORS.modern;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div
        className="h-28 relative cursor-pointer"
        style={{ background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)` }}
        onClick={() => navigate(`/builder/${cv.id}`)}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-80">
          <div className="w-16 h-2 bg-white/40 rounded-full" />
          <div className="w-12 h-1.5 bg-white/30 rounded-full" />
          <div className="w-20 h-1.5 bg-white/30 rounded-full mt-2" />
          <div className="w-16 h-1.5 bg-white/20 rounded-full" />
          <div className="w-14 h-1.5 bg-white/20 rounded-full" />
        </div>
        <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full font-medium capitalize">
          {cv.template}
        </div>
        {cv.atsScore && (
          <div className="absolute bottom-2 left-2 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full font-medium">
            ATS {cv.atsScore}/100
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{cv.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRTL ? 'آخر تعديل:' : 'Modified:'} {formatDate(cv.lastModified)}
            </p>
          </div>
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 bg-white border border-slate-100 rounded-xl shadow-lg z-20 min-w-[140px] py-1 text-sm">
                <button onClick={() => { navigate(`/builder/${cv.id}`); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  {isRTL ? 'تعديل' : 'Edit'}
                </button>
                <button onClick={() => { onDuplicate(cv.id); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  {isRTL ? 'نسخ' : 'Duplicate'}
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button onClick={() => { onDelete(cv.id); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  {isRTL ? 'حذف' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => navigate(`/builder/${cv.id}`)}
          className="mt-3 w-full py-2 rounded-xl text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
        >
          {isRTL ? 'تعديل السيرة الذاتية' : 'Edit Resume'}
        </button>
      </div>
    </div>
  );
};

/* ── Dashboard Page ── */
const DashboardPage = () => {
  const { currentUser, isRTL } = useAuth();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);
  const [showAddContent, setShowAddContent] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  useEffect(() => {
    setCvs(getSavedCVs());
  }, []);

  useEffect(() => {
    const onStorage = () => setCvs(getSavedCVs());
    window.addEventListener('cv_saved', onStorage);
    return () => window.removeEventListener('cv_saved', onStorage);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm(isRTL ? 'هل أنت متأكد من حذف هذه السيرة الذاتية؟' : 'Delete this resume?')) return;
    deleteCV(id);
    setCvs(getSavedCVs());
  };

  const handleDuplicate = (id) => {
    duplicateCV(id);
    setCvs(getSavedCVs());
  };

  const handleSectionSelect = (section) => {
    setSelectedSection(section);
    setShowAddContent(false);
    navigate(`/builder?section=${section.key}`);
  };

  const templates = [...new Set(cvs.map(c => c.template))];
  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>

      {showAddContent && (
        <AddContentModal
          isRTL={isRTL}
          onClose={() => setShowAddContent(false)}
          onSelect={handleSectionSelect}
        />
      )}

      {/* ── Hero Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)' }} className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-5 mb-8">
            {currentUser?.profileImage ? (
              <img src={currentUser.profileImage} alt="avatar" className="w-16 h-16 rounded-2xl border-2 border-white/30 shadow-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {initials}
              </div>
            )}
            <div>
              <p className="text-white/70 text-sm">{isRTL ? 'مرحباً بعودتك،' : 'Welcome back,'}</p>
              <h1 className="text-2xl font-bold text-white">{currentUser?.displayName || (isRTL ? 'مستخدم' : 'User')}</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-white">{cvs.length}</div>
              <div className="text-white/70 text-sm mt-0.5">{isRTL ? 'سيرة ذاتية محفوظة' : 'Saved Resumes'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="text-3xl font-bold text-white">{templates.length}</div>
              <div className="text-white/70 text-sm mt-0.5">{isRTL ? 'قوالب مستخدمة' : 'Templates Used'}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 col-span-2 sm:col-span-1">
              <div className="text-3xl font-bold text-white">{cvs.length > 0 ? Math.max(...cvs.map(c => c.atsScore || 0)) : '—'}</div>
              <div className="text-white/70 text-sm mt-0.5">{isRTL ? 'أعلى نقاط ATS' : 'Top ATS Score'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Quick actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {[
            {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
              label: isRTL ? 'إنشاء سيرة ذاتية' : 'New Resume',
              onClick: () => navigate('/builder'),
              primary: true,
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              label: isRTL ? 'إضافة محتوى' : 'Add Content',
              onClick: () => setShowAddContent(true),
            },
            {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
              label: isRTL ? 'تصفح القوالب' : 'Browse Templates',
              onClick: () => navigate('/templates'),
            },
            {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
              label: isRTL ? 'مركز المساعدة' : 'Help Center',
              onClick: () => navigate('/about'),
            },
          ].map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all font-medium text-sm ${
                action.primary
                  ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-700 border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 shadow-sm'
              }`}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        {/* ── My Resumes ── */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">{isRTL ? 'سيرتي الذاتية' : 'My Resumes'}</h2>
          <div className="flex items-center gap-3">
            {cvs.length > 0 && (
              <span className="text-sm text-slate-400">{cvs.length} {isRTL ? 'سيرة ذاتية' : 'resume(s)'}</span>
            )}
            <button
              onClick={() => setShowAddContent(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {isRTL ? 'إضافة محتوى' : 'Add Content'}
            </button>
          </div>
        </div>

        {cvs.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-lg">{isRTL ? 'لا توجد سير ذاتية بعد' : 'No resumes yet'}</h3>
              <p className="text-slate-400 text-sm mt-1">{isRTL ? 'أنشئ سيرتك الذاتية الأولى أو أضف محتوى الآن' : 'Create your first resume or add content to get started'}</p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => navigate('/builder')}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200 text-sm"
              >
                {isRTL ? '+ إنشاء سيرة ذاتية' : '+ Create Resume'}
              </button>
              <button
                onClick={() => setShowAddContent(true)}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors text-sm"
              >
                {isRTL ? 'إضافة محتوى' : 'Add Content'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {cvs.map(cv => (
              <CVCard
                key={cv.id}
                cv={cv}
                isRTL={isRTL}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
              />
            ))}
            <button
              onClick={() => navigate('/builder')}
              className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center gap-3 p-8 min-h-[220px] text-slate-400 hover:text-indigo-600 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-medium text-sm">{isRTL ? 'سيرة ذاتية جديدة' : 'New Resume'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
