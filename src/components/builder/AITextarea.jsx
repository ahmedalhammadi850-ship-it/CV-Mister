import { useState } from 'react';

const AI_ACTIONS = [
  {
    key: 'improve',
    en: 'Improve',
    ar: 'تحسين النص',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 8h12M8 2l4 6-4 6" />
      </svg>
    ),
    pill: 'border-violet-300 text-violet-700 bg-violet-50 hover:bg-violet-100 hover:border-violet-400',
    dot:  'bg-violet-500',
  },
  {
    key: 'suggest',
    en: 'Suggest',
    ar: 'اقتراح',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v10M3 8h10" />
      </svg>
    ),
    pill: 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-400',
    dot:  'bg-emerald-500',
  },
  {
    key: 'grammar',
    en: 'Grammar',
    ar: 'تدقيق لغوي',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 9l3.5 3.5 7-8" />
      </svg>
    ),
    pill: 'border-cyan-300 text-cyan-700 bg-cyan-50 hover:bg-cyan-100 hover:border-cyan-400',
    dot:  'bg-cyan-500',
  },
  {
    key: 'shorten',
    en: 'Shorten',
    ar: 'اختصار',
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v10M5 6l3-3 3 3M5 10l3 3 3-3" />
      </svg>
    ),
    pill: 'border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 hover:border-amber-400',
    dot:  'bg-amber-500',
  },
];

const AlignIcon = ({ type }) => {
  if (type === 'right')  return <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="1.5" rx="0.75"/><rect x="5" y="7" width="9" height="1.5" rx="0.75"/><rect x="2" y="11" width="12" height="1.5" rx="0.75"/></svg>;
  if (type === 'center') return <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="1.5" rx="0.75"/><rect x="4" y="7" width="8" height="1.5" rx="0.75"/><rect x="2" y="11" width="12" height="1.5" rx="0.75"/></svg>;
  return <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor"><rect x="2" y="3" width="12" height="1.5" rx="0.75"/><rect x="2" y="7" width="9" height="1.5" rx="0.75"/><rect x="2" y="11" width="12" height="1.5" rx="0.75"/></svg>;
};

export default function AITextarea({
  value, onChange, rows = 4, className = '', placeholder = '', isRTL = false,
}) {
  const [align, setAlign]   = useState(isRTL ? 'right' : 'left');
  const [bold, setBold]     = useState(false);
  const [italic, setItalic] = useState(false);
  const [toast, setToast]   = useState('');

  const showToast = (msg, color = 'bg-slate-700') => {
    setToast({ msg, color });
    setTimeout(() => setToast(''), 2200);
  };

  const handleAction = (key) => {
    const messages = {
      improve: { ar: '✦ قريباً — تحسين النص بالذكاء الاصطناعي', en: '✦ Coming soon — AI text improvement' },
      suggest: { ar: '✦ قريباً — اقتراح نص بالذكاء الاصطناعي', en: '✦ Coming soon — AI suggestion' },
      grammar: { ar: '✦ قريباً — التدقيق اللغوي بالذكاء الاصطناعي', en: '✦ Coming soon — AI grammar check' },
      shorten: { ar: '✦ قريباً — اختصار النص بالذكاء الاصطناعي', en: '✦ Coming soon — AI shortening' },
    };
    const colors = { improve: 'bg-violet-600', suggest: 'bg-emerald-600', grammar: 'bg-cyan-600', shorten: 'bg-amber-600' };
    showToast(messages[key][isRTL ? 'ar' : 'en'], colors[key]);
  };

  const alignOptions = isRTL
    ? [{ val: 'right', label: 'يمين' }, { val: 'center', label: 'وسط' }, { val: 'left', label: 'يسار' }]
    : [{ val: 'left', label: 'Left' }, { val: 'center', label: 'Center' }, { val: 'right', label: 'Right' }];

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden focus-within:border-primary-400 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] transition-all">

      {/* ── Toolbar ── */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/70"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Alignment pills */}
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

        {/* Format buttons */}
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

        {/* Toast */}
        {toast && (
          <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 ${toast.color} text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg pointer-events-none z-10 whitespace-nowrap font-medium`}>
            {toast.msg}
          </div>
        )}
      </div>

      {/* ── AI Actions ── */}
      <div className="px-3 pb-3 pt-1 border-t border-slate-100 bg-slate-50/40">
        <div className={`flex flex-wrap gap-1.5 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          {AI_ACTIONS.map(a => (
            <button
              key={a.key}
              type="button"
              onClick={() => handleAction(a.key)}
              className={`group flex items-center gap-1.5 pl-1.5 pr-3 py-1 rounded-full text-xs font-semibold border transition-all active:scale-95 select-none ${a.pill}`}
              style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
            >
              {/* Icon bubble */}
              <span className={`flex items-center justify-center w-4.5 h-4.5 rounded-full ${a.dot} text-white`}
                style={{ width: 18, height: 18, flexShrink: 0 }}>
                {a.icon}
              </span>
              {isRTL ? a.ar : a.en}
            </button>
          ))}

          {/* AI badge */}
          <span className={`flex items-center gap-1 text-[10px] text-slate-400 font-medium px-1 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
            <svg className="w-3 h-3 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 001.357 2.059l.214.1A2.25 2.25 0 0118 13.05v.014a2.25 2.25 0 01-.586 1.538l-4.26 4.26A2.25 2.25 0 0111.63 19.5H7.875a2.25 2.25 0 01-1.594-.659L3.152 15.71a2.25 2.25 0 010-3.183l.663-.663A2.25 2.25 0 015.39 11.25H7.5" />
            </svg>
            {isRTL ? 'مساعد ذكي' : 'AI Assistant'}
          </span>
        </div>
      </div>
    </div>
  );
}
