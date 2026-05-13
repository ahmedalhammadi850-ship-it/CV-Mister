import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCV } from '../context/useCV';
import { formatDate } from '../utils/cvStorage';

const TEMPLATE_COLORS = {
  modern:        { from: '#4f46e5', to: '#818cf8' },
  classic:       { from: '#1e3a5f', to: '#2563eb' },
  creative:      { from: '#7c3aed', to: '#c026d3' },
  minimal:       { from: '#374151', to: '#6b7280' },
  executive:     { from: '#0f766e', to: '#14b8a6' },
  professional:  { from: '#b45309', to: '#f59e0b' },
  elegant:       { from: '#be185d', to: '#f43f5e' },
  tech:          { from: '#0369a1', to: '#38bdf8' },
  arabic:        { from: '#065f46', to: '#10b981' },
};

const getColors = (template) =>
  TEMPLATE_COLORS[template?.toLowerCase()] || TEMPLATE_COLORS.modern;

const ATS_COLOR = (score) => {
  if (score >= 85) return '#10b981';
  if (score >= 60) return '#f59e0b';
  return '#ef4444';
};

/* ── Rename Modal ── */
const RenameModal = ({ cv, isRTL, onClose, onSave }) => {
  const [name, setName] = useState(cv.name);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handle = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave(cv.id, name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handle}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {isRTL ? 'تغيير اسم السيرة الذاتية' : 'Rename Resume'}
        </h3>
        <input
          ref={inputRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm"
          placeholder={isRTL ? 'اسم السيرة الذاتية' : 'Resume name'}
          maxLength={80}
        />
        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {saving ? '...' : (isRTL ? 'حفظ' : 'Save')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-colors"
          >
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ── CV Card ── */
const CVCard = ({ cv, onDelete, onDuplicate, onRename, isRTL }) => {
  const navigate = useNavigate();
  const colors = getColors(cv.template);
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
    setMenuOpen(false);
    if (!window.confirm(isRTL ? 'هل أنت متأكد من حذف هذه السيرة الذاتية؟' : 'Delete this resume?')) return;
    setDeleting(true);
    await onDelete(cv.id);
  };

  if (deleting) return null;

  const score = cv.atsScore ?? null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 overflow-hidden group flex flex-col">
      {/* Preview banner */}
      <div
        className="h-36 relative cursor-pointer flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)` }}
        onClick={() => navigate(`/builder/${cv.id}`)}
      >
        {/* Paper lines decoration */}
        <div className="absolute inset-0 flex flex-col justify-center gap-1.5 px-8 py-6 opacity-50">
          <div className="h-2 bg-white/60 rounded-full w-3/5" />
          <div className="h-1.5 bg-white/40 rounded-full w-2/5 mt-1" />
          <div className="h-px bg-white/25 rounded-full w-full mt-2" />
          <div className="h-1.5 bg-white/30 rounded-full w-4/5 mt-1" />
          <div className="h-1.5 bg-white/25 rounded-full w-3/5" />
          <div className="h-1.5 bg-white/20 rounded-full w-4/5" />
          <div className="h-1.5 bg-white/15 rounded-full w-2/3" />
        </div>

        {/* Hover edit overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="bg-white/95 rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-lg flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {isRTL ? 'فتح للتعديل' : 'Open & Edit'}
          </div>
        </div>

        {/* Template badge */}
        <div className="absolute top-3 right-3 bg-black/25 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium capitalize">
          {cv.template}
        </div>

        {/* ATS badge */}
        {score !== null && (
          <div className="absolute bottom-3 left-3 bg-black/25 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: ATS_COLOR(score) }} />
            ATS {score}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 truncate text-sm leading-tight">{cv.name}</h3>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatDate(cv.lastModified)}
            </p>
          </div>

          {/* 3-dot menu */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="absolute top-9 bg-white border border-slate-100 rounded-2xl shadow-2xl z-20 min-w-[170px] py-1.5 text-sm overflow-hidden"
                style={{ [isRTL ? 'left' : 'right']: 0 }}
              >
                <button
                  onClick={() => { navigate(`/builder/${cv.id}`); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 flex items-center gap-3 transition-colors"
                >
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {isRTL ? 'تعديل' : 'Edit'}
                </button>
                <button
                  onClick={() => { onRename(cv); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 flex items-center gap-3 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z" />
                  </svg>
                  {isRTL ? 'إعادة تسمية' : 'Rename'}
                </button>
                <button
                  onClick={() => { onDuplicate(cv.id); setMenuOpen(false); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-slate-700 flex items-center gap-3 transition-colors"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {isRTL ? 'نسخ' : 'Duplicate'}
                </button>
                <div className="h-px bg-slate-100 my-1 mx-3" />
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-500 flex items-center gap-3 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {isRTL ? 'حذف' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate(`/builder/${cv.id}`)}
          className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 transition-colors"
        >
          {isRTL ? 'تعديل السيرة' : 'Edit Resume'}
        </button>
      </div>
    </div>
  );
};

/* ── Skeleton Card ── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
    <div className="h-36 bg-slate-200" />
    <div className="p-4 space-y-2.5">
      <div className="h-4 bg-slate-200 rounded-full w-3/4" />
      <div className="h-3 bg-slate-100 rounded-full w-1/2" />
      <div className="h-9 bg-slate-100 rounded-xl mt-4" />
    </div>
  </div>
);

/* ── Empty State ── */
const EmptyState = ({ isRTL, onNew }) => (
  <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 py-16 flex flex-col items-center gap-5 text-center px-6">
    <div className="w-20 h-20 rounded-2xl bg-indigo-50 flex items-center justify-center">
      <svg className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <div>
      <h3 className="font-bold text-slate-800 text-xl mb-2">
        {isRTL ? 'لا توجد سير ذاتية بعد' : 'No resumes yet'}
      </h3>
      <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
        {isRTL
          ? 'أنشئ سيرتك الذاتية الأولى الآن واختر من بين عشرات القوالب الاحترافية'
          : 'Create your first resume and choose from dozens of professional templates'}
      </p>
    </div>

    {/* Tips */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mt-2">
      {[
        { icon: '⚡', title: isRTL ? 'سريع وسهل' : 'Fast & Easy', desc: isRTL ? 'أنهِ سيرتك في دقائق' : 'Finish your resume in minutes' },
        { icon: '🎨', title: isRTL ? 'قوالب احترافية' : 'Pro Templates', desc: isRTL ? '+40 قالب متنوع' : '40+ diverse templates' },
        { icon: '📄', title: isRTL ? 'تصدير PDF' : 'PDF Export', desc: isRTL ? 'احفظ وشارك بسهولة' : 'Save and share easily' },
      ].map((tip) => (
        <div key={tip.title} className="bg-slate-50 rounded-xl p-3.5 text-start">
          <div className="text-xl mb-1">{tip.icon}</div>
          <p className="font-semibold text-slate-700 text-xs">{tip.title}</p>
          <p className="text-slate-400 text-xs mt-0.5">{tip.desc}</p>
        </div>
      ))}
    </div>

    <button
      onClick={onNew}
      className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-sm flex items-center gap-2"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
      </svg>
      {isRTL ? 'إنشاء سيرة ذاتية الآن' : 'Create Your First Resume'}
    </button>
  </div>
);

/* ── Dashboard Page ── */
const DashboardPage = () => {
  const { currentUser, isRTL, signOutUser } = useAuth();
  const { deleteCV } = useCV();
  const navigate = useNavigate();

  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [renameTarget, setRenameTarget] = useState(null);

  const fetchCVs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/cvs', { credentials: 'include' });
      if (res.status === 401) { navigate('/login'); return; }
      if (!res.ok) throw new Error('Failed to fetch');
      setCvs(await res.json());
    } catch {
      setError(isRTL ? 'فشل تحميل السير الذاتية' : 'Failed to load resumes');
    } finally {
      setLoading(false);
    }
  }, [isRTL, navigate]);

  useEffect(() => { fetchCVs(); }, [fetchCVs]);

  const handleDelete = async (id) => {
    deleteCV(id);
    await fetch(`/api/cvs/${id}`, { method: 'DELETE', credentials: 'include' });
    setCvs(prev => prev.filter(c => c.id !== id));
  };

  const handleDuplicate = async (id) => {
    const cv = cvs.find(c => c.id === id);
    if (!cv) return;
    const copy = {
      ...cv,
      id: `cv-${Date.now()}`,
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
      if (res.ok) { const saved = await res.json(); setCvs(prev => [saved, ...prev]); }
    } catch (e) { console.error('Duplicate failed', e); }
  };

  const handleRename = async (id, name) => {
    try {
      const res = await fetch(`/api/cvs/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCvs(prev => prev.map(c => c.id === id ? { ...c, name: updated.name } : c));
      }
    } catch (e) { console.error('Rename failed', e); }
  };

  /* Derived */
  const topAts = cvs.length ? Math.max(...cvs.map(c => c.atsScore || 0)) : null;
  const templates = [...new Set(cvs.map(c => c.template))];

  const filtered = cvs
    .filter(c => c.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'ats') return (b.atsScore || 0) - (a.atsScore || 0);
      return new Date(b.lastModified) - new Date(a.lastModified);
    });

  const initials = (() => {
    const name = currentUser?.displayName || currentUser?.name || '';
    return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
  })();

  const STATS = [
    {
      value: loading ? '—' : cvs.length,
      label: isRTL ? 'سيرة محفوظة' : 'Saved Resumes',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      value: loading ? '—' : (templates.length || '0'),
      label: isRTL ? 'قوالب مستخدمة' : 'Templates Used',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
    },
    {
      value: loading ? '—' : (topAts !== null ? topAts : '—'),
      label: isRTL ? 'أعلى نقاط ATS' : 'Best ATS Score',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Hero Banner ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 55%, #c026d3 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-8 right-16 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-12">
          {/* User row */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {currentUser?.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt="avatar"
                  className="w-14 h-14 rounded-2xl border-2 border-white/30 shadow-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/30 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 select-none">
                  {initials}
                </div>
              )}
              <div>
                <p className="text-white/65 text-sm">{isRTL ? 'مرحباً بعودتك،' : 'Welcome back,'}</p>
                <h1 className="text-2xl font-bold text-white leading-tight">
                  {currentUser?.displayName || currentUser?.name || (isRTL ? 'مستخدم' : 'User')}
                </h1>
                {currentUser?.email && (
                  <p className="text-white/50 text-xs mt-0.5">{currentUser.email}</p>
                )}
              </div>
            </div>

            <button
              onClick={signOutUser}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isRTL ? 'تسجيل الخروج' : 'Sign out'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 flex flex-col gap-2"
              >
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white">
                  {s.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white leading-none">{s.value}</div>
                  <div className="text-white/65 text-xs mt-1 leading-tight">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            {
              label: isRTL ? 'سيرة جديدة' : 'New Resume',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />,
              primary: true,
              onClick: () => navigate('/builder'),
            },
            {
              label: isRTL ? 'القوالب' : 'Templates',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />,
              onClick: () => navigate('/templates'),
            },
            {
              label: isRTL ? 'الرئيسية' : 'Home',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
              onClick: () => navigate('/'),
            },
            {
              label: isRTL ? 'تحديث' : 'Refresh',
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />,
              spinning: loading,
              onClick: fetchCVs,
            },
          ].map((a) => (
            <button
              key={a.label}
              onClick={a.onClick}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl font-medium text-sm transition-all ${
                a.primary
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                  : 'bg-white text-slate-700 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/40 shadow-sm'
              }`}
            >
              <svg className={`w-5 h-5 ${a.spinning ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {a.icon}
              </svg>
              {a.label}
            </button>
          ))}
        </div>

        {/* ── Section header: search + sort ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{isRTL ? 'سيرتي الذاتية' : 'My Resumes'}</h2>
            {!loading && cvs.length > 0 && (
              <p className="text-sm text-slate-400 mt-0.5">
                {filtered.length} {isRTL ? `من ${cvs.length}` : `of ${cvs.length}`} {isRTL ? 'سيرة' : 'resume(s)'}
              </p>
            )}
          </div>

          {cvs.length > 0 && (
            <div className="flex items-center gap-2">
              {/* Search */}
              <div className="relative">
                <svg className="w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none" style={{ [isRTL ? 'right' : 'left']: '12px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isRTL ? 'بحث...' : 'Search...'}
                  className="h-9 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-slate-300"
                  style={{ paddingLeft: isRTL ? '12px' : '36px', paddingRight: isRTL ? '36px' : '12px', width: '160px' }}
                />
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
              >
                <option value="date">{isRTL ? 'الأحدث' : 'Newest'}</option>
                <option value="name">{isRTL ? 'الاسم' : 'Name'}</option>
                <option value="ats">{isRTL ? 'نقاط ATS' : 'ATS Score'}</option>
              </select>
            </div>
          )}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 font-semibold">{error}</p>
            <button onClick={fetchCVs} className="mt-3 text-sm text-red-500 underline hover:text-red-700">
              {isRTL ? 'حاول مجدداً' : 'Try again'}
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && cvs.length === 0 && (
          <EmptyState isRTL={isRTL} onNew={() => navigate('/builder')} />
        )}

        {/* No search results */}
        {!loading && !error && cvs.length > 0 && filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 py-14 text-center">
            <svg className="w-10 h-10 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-slate-500 font-medium">{isRTL ? 'لا توجد نتائج' : 'No results found'}</p>
            <button onClick={() => setSearch('')} className="mt-2 text-sm text-indigo-500 hover:underline">
              {isRTL ? 'مسح البحث' : 'Clear search'}
            </button>
          </div>
        )}

        {/* CV Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(cv => (
              <CVCard
                key={cv.id}
                cv={cv}
                isRTL={isRTL}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onRename={setRenameTarget}
              />
            ))}

            {/* Add new card */}
            <button
              onClick={() => navigate('/builder')}
              className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center gap-3 p-8 min-h-[230px] text-slate-400 hover:text-indigo-600 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-semibold text-sm">{isRTL ? 'سيرة ذاتية جديدة' : 'New Resume'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Rename modal */}
      {renameTarget && (
        <RenameModal
          cv={renameTarget}
          isRTL={isRTL}
          onClose={() => setRenameTarget(null)}
          onSave={handleRename}
        />
      )}
    </div>
  );
};

export default DashboardPage;
