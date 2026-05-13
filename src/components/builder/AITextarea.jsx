import { useState } from 'react';

const AI_ACTIONS = [
  {
    key: 'improve',
    en: 'Improve',
    ar: 'تحسين',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 2l1.5 3 3.5.5-2.5 2.4.6 3.5L8 9.8l-3.1 1.6.6-3.5L3 5.5l3.5-.5z" />
      </svg>
    ),
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-200',
    ring: 'hover:ring-violet-300',
    label: 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 border-violet-200 hover:border-violet-300 hover:from-violet-100 hover:to-purple-100',
  },
  {
    key: 'suggest',
    en: 'Suggest',
    ar: 'اقتراح',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 1v14M1 8h14" />
      </svg>
    ),
    gradient: 'from-emerald-500 to-green-600',
    glow: 'shadow-emerald-200',
    ring: 'hover:ring-emerald-300',
    label: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 hover:border-emerald-300 hover:from-emerald-100 hover:to-green-100',
  },
  {
    key: 'grammar',
    en: 'Grammar',
    ar: 'تدقيق',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 9.5l3.5 3.5 7-8" />
      </svg>
    ),
    gradient: 'from-sky-500 to-cyan-600',
    glow: 'shadow-sky-200',
    ring: 'hover:ring-sky-300',
    label: 'bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-700 border-sky-200 hover:border-sky-300 hover:from-sky-100 hover:to-cyan-100',
  },
  {
    key: 'shorten',
    en: 'Shorten',
    ar: 'اختصار',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v12M5 5l3-3 3 3M5 11l3 3 3-3" />
      </svg>
    ),
    gradient: 'from-orange-500 to-amber-500',
    glow: 'shadow-orange-200',
    ring: 'hover:ring-orange-300',
    label: 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border-orange-200 hover:border-orange-300 hover:from-orange-100 hover:to-amber-100',
  },
];

const AlignIcon = ({ type }) => {
  if (type === 'right')  return <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="1.5" rx="0.75"/><rect x="5" y="7" width="9" height="1.5" rx="0.75"/><rect x="2" y="11" width="12" height="1.5" rx="0.75"/></svg>;
  if (type === 'center') return <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="1.5" rx="0.75"/><rect x="4" y="7" width="8" height="1.5" rx="0.75"/><rect x="2" y="11" width="12" height="1.5" rx="0.75"/></svg>;
  return <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="1.5" rx="0.75"/><rect x="2" y="7" width="9" height="1.5" rx="0.75"/><rect x="2" y="11" width="12" height="1.5" rx="0.75"/></svg>;
};

const SparkleIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.09 4.26L17.27 7.3l-4.18 1.08L12 12.5l-1.09-4.12L6.73 7.3l4.18-1.04L12 2z" opacity="0.9" />
    <path d="M5 14l.6 2.4L8 17l-2.4.6L5 20l-.6-2.4L2 17l2.4-.6L5 14z" opacity="0.6" />
    <path d="M19 3l.45 1.8L21 5l-1.55.45L19 7l-.45-1.55L17 5l1.55-.45L19 3z" opacity="0.5" />
  </svg>
);

export default function AITextarea({
  value, onChange, rows = 4, className = '', placeholder = '', isRTL = false,
}) {
  const [align, setAlign]     = useState(isRTL ? 'right' : 'left');
  const [bold, setBold]       = useState(false);
  const [italic, setItalic]   = useState(false);
  const [toast, setToast]     = useState('');
  const [loading, setLoading] = useState('');

  const showToast = (msg, color = 'bg-slate-700') => {
    setToast({ msg, color });
    setTimeout(() => setToast(''), 2200);
  };

  const handleAction = async (key) => {
    if (!value?.trim()) {
      showToast(isRTL ? '✦ أدخل نصاً أولاً' : '✦ Enter some text first', 'bg-slate-600');
      return;
    }
    setLoading(key);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value, action: key, language: isRTL ? 'ar' : 'en' }),
      });
      const data = await res.json();
      if (res.ok && data.result) {
        onChange(data.result);
        const successMsg = {
          improve: { ar: '✦ تم تحسين النص', en: '✦ Text improved!' },
          suggest: { ar: '✦ تم اقتراح النص', en: '✦ Text suggested!' },
          grammar: { ar: '✦ تم التدقيق اللغوي', en: '✦ Grammar fixed!' },
          shorten: { ar: '✦ تم اختصار النص', en: '✦ Text shortened!' },
        };
        const colors = { improve: 'bg-violet-600', suggest: 'bg-emerald-600', grammar: 'bg-sky-600', shorten: 'bg-orange-600' };
        showToast(successMsg[key][isRTL ? 'ar' : 'en'], colors[key]);
      } else {
        showToast(isRTL ? '✦ حدث خطأ، حاول مرة أخرى' : '✦ Error, please try again', 'bg-red-500');
      }
    } catch {
      showToast(isRTL ? '✦ تعذر الاتصال بالخادم' : '✦ Connection error', 'bg-red-500');
    } finally {
      setLoading('');
    }
  };

  const alignOptions = isRTL
    ? [{ val: 'right', label: 'يمين' }, { val: 'center', label: 'وسط' }, { val: 'left', label: 'يسار' }]
    : [{ val: 'left', label: 'Left' }, { val: 'center', label: 'Center' }, { val: 'right', label: 'Right' }];

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden focus-within:border-violet-300 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.08)] transition-all">

      {/* ── Toolbar ── */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/70"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
          {alignOptions.map(({ val, label }) => (
            <button
              key={val}
              type="button"
              onClick={() => setAlign(val)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                align === val
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-0.5">
          <button
            type="button"
            title={isRTL ? 'قائمة' : 'List'}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" d="M6 4h7M6 8h7M6 12h7M3 4h.01M3 8h.01M3 12h.01" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setItalic(v => !v)}
            title={isRTL ? 'مائل' : 'Italic'}
            className={`w-7 h-7 rounded-md flex items-center justify-center text-sm font-serif font-bold italic transition-colors ${
              italic ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => setBold(v => !v)}
            title={isRTL ? 'عريض' : 'Bold'}
            className={`w-7 h-7 rounded-md flex items-center justify-center text-sm font-black transition-colors ${
              bold ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            B
          </button>
        </div>
      </div>

      {/* ── Textarea ── */}
      <div className="relative">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          dir={isRTL ? 'rtl' : 'ltr'}
          style={{
            textAlign: align,
            fontWeight: bold ? 700 : 400,
            fontStyle: italic ? 'italic' : 'normal',
          }}
          className="w-full resize-none border-0 outline-none px-4 py-3 text-sm text-slate-800 placeholder-slate-400 bg-transparent"
        />

        {toast && (
          <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 ${toast.color} text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg pointer-events-none z-10 whitespace-nowrap font-medium`}>
            {toast.msg}
          </div>
        )}
      </div>

      {/* ── AI Actions Bar ── */}
      <div
        className="relative px-3 pb-3 pt-2 border-t border-slate-100 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #faf9ff 0%, #f5f3ff 50%, #fdf4ff 100%)',
        }}
      >
        {/* Subtle background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-16 h-16 rounded-full bg-violet-400/10 blur-xl" />
          <div className="absolute top-0 right-1/4 w-12 h-12 rounded-full bg-purple-400/10 blur-xl" />
        </div>

        {/* AI label */}
        <div className={`flex items-center gap-1 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-1 text-[10px] font-semibold text-violet-500 tracking-wide uppercase">
            <SparkleIcon className="w-3 h-3" />
            {isRTL ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-violet-200/60 to-transparent" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }} />
        </div>

        {/* Action buttons */}
        <div className={`flex flex-wrap gap-1.5 items-center relative z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Robot AI icon */}
          <div
            className="flex items-center justify-center rounded-xl flex-shrink-0"
            style={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
              boxShadow: '0 2px 8px rgba(124,58,237,0.35)',
            }}
            title={isRTL ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              {/* Head */}
              <rect x="4" y="8" width="16" height="11" rx="3" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="1.5"/>
              {/* Antenna */}
              <line x1="12" y1="8" x2="12" y2="5"/>
              <circle cx="12" cy="4.5" r="1.2" fill="white"/>
              {/* Eyes */}
              <circle cx="9" cy="13" r="1.4" fill="white"/>
              <circle cx="15" cy="13" r="1.4" fill="white"/>
              {/* Mouth */}
              <path d="M9.5 16.5h5" strokeWidth="1.8"/>
              {/* Ears */}
              <line x1="4" y1="12.5" x2="2.5" y2="12.5" strokeWidth="2"/>
              <line x1="20" y1="12.5" x2="21.5" y2="12.5" strokeWidth="2"/>
            </svg>
          </div>

          {AI_ACTIONS.map(a => (
            <button
              key={a.key}
              type="button"
              onClick={() => handleAction(a.key)}
              disabled={!!loading}
              className={`
                group relative flex items-center gap-1.5 py-1 rounded-full text-xs font-semibold border
                transition-all duration-150 active:scale-95 select-none
                ring-2 ring-transparent hover:ring-2 hover:shadow-md
                ${a.label} ${a.ring}
                ${loading === a.key ? 'opacity-80' : ''}
                ${loading && loading !== a.key ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                paddingLeft: 6,
                paddingRight: 12,
              }}
            >
              {/* Icon bubble with gradient */}
              <span
                className={`relative flex items-center justify-center rounded-full bg-gradient-to-br ${a.gradient} text-white shadow-sm ${a.glow} shadow`}
                style={{ width: 22, height: 22, flexShrink: 0 }}
              >
                {loading === a.key ? (
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                  </svg>
                ) : a.icon}
              </span>

              {isRTL ? a.ar : a.en}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
