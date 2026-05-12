import { useState, useEffect } from 'react';
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

const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: color + '18' }}>
      <span style={{ color }}>{icon}</span>
    </div>
    <div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  </div>
);

const CVCard = ({ cv, onDelete, onDuplicate, isRTL }) => {
  const navigate = useNavigate();
  const colors = TEMPLATE_COLORS[cv.template] || TEMPLATE_COLORS.modern;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Preview strip */}
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

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{cv.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {isRTL ? 'آخر تعديل:' : 'Modified:'} {formatDate(cv.lastModified)}
            </p>
          </div>
          <div className="relative flex-shrink-0">
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
                <button
                  onClick={() => { navigate(`/builder/${cv.id}`); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  {isRTL ? 'تعديل' : 'Edit'}
                </button>
                <button
                  onClick={() => { onDuplicate(cv.id); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  {isRTL ? 'نسخ' : 'Duplicate'}
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => { onDelete(cv.id); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-500 flex items-center gap-2"
                >
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

const DashboardPage = () => {
  const { currentUser, isRTL } = useAuth();
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);

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

  const templates = [...new Set(cvs.map(c => c.template))];
  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>

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

          {/* Stats */}
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
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
              label: isRTL ? 'تصفح القوالب' : 'Browse Templates',
              onClick: () => navigate('/templates'),
            },
            {
              icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
              label: isRTL ? 'الملف الشخصي' : 'Profile',
              onClick: () => navigate('/about'),
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
          {cvs.length > 0 && (
            <span className="text-sm text-slate-400">{cvs.length} {isRTL ? 'سيرة ذاتية' : 'resume(s)'}</span>
          )}
        </div>

        {cvs.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-20 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 text-lg">{isRTL ? 'لا توجد سير ذاتية بعد' : 'No resumes yet'}</h3>
              <p className="text-slate-400 text-sm mt-1">{isRTL ? 'أنشئ سيرتك الذاتية الأولى الآن' : 'Create your first resume to get started'}</p>
            </div>
            <button
              onClick={() => navigate('/builder')}
              className="mt-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              {isRTL ? '+ إنشاء سيرة ذاتية' : '+ Create Resume'}
            </button>
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
            {/* New CV card */}
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
