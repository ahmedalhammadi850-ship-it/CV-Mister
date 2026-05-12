import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/CVContext';
import { formatDate } from '../utils/cvStorage';

const TEMPLATE_COLORS = {
  modern:    { from: '#4f46e5', to: '#818cf8' },
  classic:   { from: '#1e3a5f', to: '#2563eb' },
  creative:  { from: '#7c3aed', to: '#c026d3' },
  minimal:   { from: '#374151', to: '#6b7280' },
  executive: { from: '#0f766e', to: '#14b8a6' },
};

/* ── CV Card ── */
const CVCard = ({ cv, onDelete, onDuplicate, isRTL }) => {
  const navigate = useNavigate();
  const colors = TEMPLATE_COLORS[cv.template] || TEMPLATE_COLORS.modern;
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm(isRTL ? 'هل أنت متأكد من حذف هذه السيرة الذاتية؟' : 'Delete this resume?')) return;
    setDeleting(true);
    await onDelete(cv.id);
  };

  if (deleting) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group">
      {/* Preview banner */}
      <div
        className="h-32 relative cursor-pointer"
        style={{ background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)` }}
        onClick={() => navigate(`/builder/${cv.id}`)}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-70 px-6">
          <div className="w-3/4 h-2 bg-white/50 rounded-full" />
          <div className="w-1/2 h-1.5 bg-white/35 rounded-full" />
          <div className="w-5/6 h-1.5 bg-white/30 rounded-full mt-2" />
          <div className="w-2/3 h-1.5 bg-white/25 rounded-full" />
          <div className="w-3/4 h-1.5 bg-white/20 rounded-full" />
          <div className="w-1/2 h-1.5 bg-white/15 rounded-full" />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/90 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800">
            {isRTL ? 'تعديل' : 'Edit'}
          </div>
        </div>

        <div className="absolute top-2.5 right-2.5 bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium capitalize">
          {cv.template}
        </div>
        {cv.atsScore != null && (
          <div className="absolute bottom-2.5 left-2.5 bg-white/20 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-300" />
            ATS {cv.atsScore}/100
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-900 truncate text-sm">{cv.name}</h3>
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
              <div className="absolute right-0 top-8 bg-white border border-slate-100 rounded-xl shadow-xl z-20 min-w-[150px] py-1 text-sm overflow-hidden">
                <button
                  onClick={() => { navigate(`/builder/${cv.id}`); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  {isRTL ? 'تعديل' : 'Edit'}
                </button>
                <button
                  onClick={() => { onDuplicate(cv.id); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  {isRTL ? 'نسخ' : 'Duplicate'}
                </button>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => { handleDelete(); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-500 flex items-center gap-2.5 transition-colors"
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

/* ── Dashboard Page ── */
const DashboardPage = () => {
  const { currentUser, isRTL } = useAuth();
  const { deleteCV, duplicateCV, savedCVs, setSavedCVs } = useCV();
  const navigate = useNavigate();

  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCVs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/cvs', { credentials: 'include' });
      if (res.status === 401) {
        navigate('/login');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCvs(data);
    } catch (e) {
      setError(isRTL ? 'فشل تحميل السير الذاتية' : 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, [isRTL, navigate]);

  useEffect(() => {
    fetchCVs();
  }, [fetchCVs]);

  const handleDelete = async (id) => {
    deleteCV(id);
    await fetch(`/api/cvs/${id}`, { method: 'DELETE', credentials: 'include' });
    setCvs(prev => prev.filter(c => c.id !== id));
  };

  const handleDuplicate = async (id) => {
    const cv = cvs.find(c => c.id === id);
    if (!cv) return;
    const newId = `cv-${Date.now()}`;
    const copy = {
      ...cv,
      id: newId,
      name: cv.name + (isRTL ? ' (نسخة)' : ' (Copy)'),
      lastModified: new Date().toISOString(),
    };
    try {
      const res = await fetch('/api/cvs', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy),
      });
      if (res.ok) {
        const saved = await res.json();
        setCvs(prev => [saved, ...prev]);
      }
    } catch (e) {
      console.error('Duplicate failed', e);
    }
  };

  const topAts = cvs.length > 0 ? Math.max(...cvs.map(c => c.atsScore || 0)) : null;
  const templates = [...new Set(cvs.map(c => c.template))];

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : currentUser?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    || '?';

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Hero Banner ── */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #c026d3 100%)' }} className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-white rounded-full" />
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
              <h1 className="text-2xl font-bold text-white">
                {currentUser?.displayName || currentUser?.name || (isRTL ? 'مستخدم' : 'User')}
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: cvs.length, label: isRTL ? 'سيرة محفوظة' : 'Saved Resumes' },
              { value: templates.length || '—', label: isRTL ? 'قوالب مستخدمة' : 'Templates Used' },
              { value: topAts != null ? `${topAts}` : '—', label: isRTL ? 'أعلى نقاط ATS' : 'Top ATS Score' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-3xl font-bold text-white">{loading ? '—' : s.value}</div>
                <div className="text-white/70 text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          <button
            onClick={() => navigate('/builder')}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all font-medium text-sm"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            {isRTL ? 'إنشاء سيرة ذاتية' : 'New Resume'}
          </button>
          <button
            onClick={() => navigate('/templates')}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white text-slate-700 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 shadow-sm transition-all font-medium text-sm"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
            {isRTL ? 'تصفح القوالب' : 'Browse Templates'}
          </button>
          <button
            onClick={fetchCVs}
            className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white text-slate-700 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 shadow-sm transition-all font-medium text-sm col-span-2 sm:col-span-1"
          >
            <svg className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {isRTL ? 'تحديث' : 'Refresh'}
          </button>
        </div>

        {/* ── My Resumes ── */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-slate-900">{isRTL ? 'سيرتي الذاتية' : 'My Resumes'}</h2>
          {cvs.length > 0 && (
            <span className="text-sm text-slate-400">{cvs.length} {isRTL ? 'سيرة ذاتية' : 'resume(s)'}</span>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
                <div className="h-32 bg-slate-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-8 bg-slate-100 rounded-xl mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={fetchCVs} className="mt-3 text-sm text-red-600 underline">
              {isRTL ? 'حاول مجدداً' : 'Try again'}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && cvs.length === 0 && (
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
              className="px-7 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-sm"
            >
              {isRTL ? '+ إنشاء سيرة ذاتية' : '+ Create Resume'}
            </button>
          </div>
        )}

        {/* CV Grid */}
        {!loading && !error && cvs.length > 0 && (
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
            {/* New Resume card */}
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
