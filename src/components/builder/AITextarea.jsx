import { useState } from 'react';

const AI_ACTIONS = [
  {
    key: 'improve',
    en: 'Improve',
    ar: 'تحسين',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
        <path d="M8 1.5l1.2 2.5 2.8.4-2 2 .5 2.8L8 7.9l-2.5 1.3.5-2.8-2-2 2.8-.4z" />
      </svg>
    ),
    // outlined/light style like reference
    btn: 'bg-white border-2 border-violet-300 text-violet-600 hover:bg-violet-50 hover:border-violet-400',
    bubble: 'bg-violet-100 text-violet-600',
    ring: 'hover:shadow-violet-100',
  },
  {
    key: 'suggest',
    en: 'Suggest',
    ar: 'اقتراح',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M8 2v12M2 8h12" />
      </svg>
    ),
    btn: 'bg-green-500 border-2 border-green-500 text-white hover:bg-green-600 hover:border-green-600',
    bubble: 'bg-white/25 text-white',
    ring: 'hover:shadow-green-200',
  },
  {
    key: 'grammar',
    en: 'Grammar',
    ar: 'تدقيق',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 9l3.5 3.5 7-8" />
      </svg>
    ),
    btn: 'bg-blue-500 border-2 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600',
    bubble: 'bg-white/25 text-white',
    ring: 'hover:shadow-blue-200',
  },
  {
    key: 'shorten',
    en: 'Shorten',
    ar: 'اختصار',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2v12M5 5l3-3 3 3M5 11l3 3 3-3" />
      </svg>
    ),
    btn: 'bg-orange-500 border-2 border-orange-500 text-white hover:bg-orange-600 hover:border-orange-600',
    bubble: 'bg-white/25 text-white',
    ring: 'hover:shadow-orange-200',
  },
];

const AlignIcon = ({ type }) => {
  if (type === 'right')  return <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="1.5" rx="0.75"/><rect x="5" y="7" width="9" height="1.5" rx="0.75"/><rect x="2" y="11" width="12" height="1.5" rx="0.75"/></svg>;
  if (type === 'center') return <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="1.5" rx="0.75"/><rect x="4" y="7" width="8" height="1.5" rx="0.75"/><rect x="2" y="11" width="12" height="1.5" rx="0.75"/></svg>;
  return <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="1.5" rx="0.75"/><rect x="2" y="7" width="9" height="1.5" rx="0.75"/><rect x="2" y="11" width="12" height="1.5" rx="0.75"/></svg>;
};

const RobotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="8" width="16" height="11" rx="3" fill="white" fillOpacity="0.18" stroke="white" strokeWidth="1.5"/>
    <line x1="12" y1="8" x2="12" y2="5"/>
    <circle cx="12" cy="4.5" r="1.2" fill="white"/>
    <circle cx="9" cy="13" r="1.4" fill="white"/>
    <circle cx="15" cy="13" r="1.4" fill="white"/>
    <path d="M9.5 16.5h5" strokeWidth="1.8"/>
    <line x1="4" y1="12.5" x2="2.5" y2="12.5" strokeWidth="2"/>
    <line x1="20" y1="12.5" x2="21.5" y2="12.5" strokeWidth="2"/>
  </svg>
);

export default function AITextarea({
  value, onChange, rows = 4, className = '', placeholder = '', isRTL = false,
  align: alignProp, onAlignChange,
}) {
  const [alignLocal, setAlignLocal] = useState(isRTL ? 'right' : 'left');
  const align    = alignProp !== undefined ? alignProp : alignLocal;
  const setAlign = (v) => { setAlignLocal(v); onAlignChange?.(v); };
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

      let result = null;
      if (res.ok) {
        try {
          const data = await res.json();
          if (typeof data === 'string') result = data;
          else if (data?.result) result = data.result;
          else if (data?.output) result = data.output;
          else if (data?.text) result = data.text;
          else if (Array.isArray(data) && data[0]?.result) result = data[0].result;
          else if (Array.isArray(data) && data[0]?.output) result = data[0].output;
        } catch { result = null; }
      }

      if (result) {
        onChange(result);
        const successMsg = {
          improve: { ar: '✦ تم تحسين النص', en: '✦ Text improved!' },
          suggest: { ar: '✦ تم اقتراح النص', en: '✦ Text suggested!' },
          grammar: { ar: '✦ تم التدقيق اللغوي', en: '✦ Grammar fixed!' },
          shorten: { ar: '✦ تم اختصار النص', en: '✦ Text shortened!' },
        };
        const colors = { improve: 'bg-violet-600', suggest: 'bg-green-600', grammar: 'bg-blue-600', shorten: 'bg-orange-600' };
        showToast(successMsg[key][isRTL ? 'ar' : 'en'], colors[key]);
      } else {
        showToast(isRTL ? '✦ حدث خطأ، حاول مرة أخرى' : '✦ Error, please try again', 'bg-red-500');
      }
    } catch {
      showToast(isRTL ? '✦ تعذر الاتصال' : '✦ Connection error', 'bg-red-500');
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
          <button type="button" title={isRTL ? 'قائمة' : 'List'}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" d="M6 4h7M6 8h7M6 12h7M3 4h.01M3 8h.01M3 12h.01" />
            </svg>
          </button>
          <button type="button" onClick={() => setItalic(v => !v)} title={isRTL ? 'مائل' : 'Italic'}
            className={`w-7 h-7 rounded-md flex items-center justify-center text-sm font-serif font-bold italic transition-colors ${
              italic ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}>
            I
          </button>
          <button type="button" onClick={() => setBold(v => !v)} title={isRTL ? 'عريض' : 'Bold'}
            className={`w-7 h-7 rounded-md flex items-center justify-center text-sm font-black transition-colors ${
              bold ? 'bg-slate-200 text-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}>
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
          style={{ textAlign: align, fontWeight: bold ? 700 : 400, fontStyle: italic ? 'italic' : 'normal' }}
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
        className="px-3 pb-3 pt-2.5 border-t border-slate-100"
        style={{ background: 'linear-gradient(135deg,#f8f6ff 0%,#f3f0ff 60%,#faf5ff 100%)' }}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header row */}
        <div className={`flex items-center gap-2 mb-2.5`}>
          <span className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-violet-500 uppercase whitespace-nowrap">
            <svg viewBox="0 0 8 8" className="w-1.5 h-1.5 fill-violet-400"><circle cx="4" cy="4" r="4"/></svg>
            {isRTL ? 'مساعد ذكي' : 'AI Assistant'}
          </span>
          {/* dashed separator line */}
          <div className="flex-1" style={{ borderTop: '1.5px dashed #c4b5fd' }} />
        </div>

        {/* Buttons row */}
        <div className={`flex flex-wrap gap-2 items-center`}>

          {/* Action pills */}
          {AI_ACTIONS.map(a => (
            <button
              key={a.key}
              type="button"
              onClick={() => handleAction(a.key)}
              disabled={!!loading}
              className={`
                flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold
                transition-all duration-150 active:scale-95 select-none
                hover:shadow-lg ${a.ring} ${a.btn}
                ${loading === a.key ? 'opacity-80' : ''}
                ${loading && loading !== a.key ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
            >
              <span
                className={`flex items-center justify-center rounded-full ${a.bubble} flex-shrink-0`}
                style={{ width: 22, height: 22 }}
              >
                {loading === a.key ? (
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-30" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"/>
                  </svg>
                ) : a.icon}
              </span>
              {isRTL ? a.ar : a.en}
            </button>
          ))}

          {/* Robot icon — pinned to the right */}
          <div className="ml-auto flex-shrink-0">
            <div
              className={`flex items-center justify-center rounded-2xl cursor-default transition-transform hover:scale-105 active:scale-95 ${loading ? 'animate-ai-robot' : ''}`}
              style={{
                width: 48,
                height: 48,
                background: loading
                  ? 'linear-gradient(135deg,#6d28d9 0%,#c026d3 100%)'
                  : 'linear-gradient(135deg,#7c3aed 0%,#a855f7 100%)',
                boxShadow: loading
                  ? '0 0 0 4px rgba(168,85,247,0.25), 0 4px 14px rgba(124,58,237,0.5)'
                  : '0 3px 12px rgba(124,58,237,0.45)',
                transition: 'background 0.3s, box-shadow 0.3s',
              }}
              title={isRTL ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}
            >
              <span className={loading ? 'animate-ai-icon' : ''} style={{ display: 'flex' }}>
                <RobotIcon />
              </span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
