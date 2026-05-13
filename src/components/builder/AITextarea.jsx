import { useState } from 'react';

const ACTIONS = [
  {
    key: 'improve',
    en: 'Improve',
    ar: 'تحسين النص',
    icon: '✦',
    colors: 'border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100',
    spinner: 'border-indigo-400',
  },
  {
    key: 'suggest',
    en: 'Suggest',
    ar: 'اقتراح',
    icon: '+',
    colors: 'border-emerald-300 text-emerald-600 bg-emerald-50 hover:bg-emerald-100',
    spinner: 'border-emerald-400',
  },
  {
    key: 'grammar',
    en: 'Grammar',
    ar: 'تدقيق لغوي',
    icon: '✓',
    colors: 'border-teal-300 text-teal-600 bg-teal-50 hover:bg-teal-100',
    spinner: 'border-teal-400',
  },
  {
    key: 'shorten',
    en: 'Shorten',
    ar: 'اختصار',
    icon: '↕',
    colors: 'border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100',
    spinner: 'border-amber-400',
  },
];

export default function AITextarea({ value, onChange, rows = 4, className = '', placeholder = '', isRTL = false }) {
  const [loading, setLoading] = useState(null);
  const [error, setError]     = useState('');
  const [toast, setToast]     = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const handleAction = async (action) => {
    if (!value.trim() && action !== 'suggest') {
      setError(isRTL ? 'اكتب نصاً أولاً لتتمكن من استخدام هذه الميزة' : 'Write some text first to use this feature');
      setTimeout(() => setError(''), 3000);
      return;
    }
    setLoading(action);
    setError('');
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value, action, language: isRTL ? 'ar' : 'en' }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.message === 'AI_NOT_CONFIGURED') {
          setError(isRTL ? 'لم يتم تفعيل الذكاء الاصطناعي — يرجى إضافة مفتاح OPENAI_API_KEY' : 'AI not configured — please add OPENAI_API_KEY');
        } else {
          setError(isRTL ? 'حدث خطأ، حاول مرة أخرى' : 'Something went wrong, try again');
        }
        return;
      }
      if (data.result) {
        onChange(data.result);
        showToast(isRTL ? '✓ تم التحديث بنجاح' : '✓ Updated successfully');
      }
    } catch {
      setError(isRTL ? 'تعذّر الاتصال بالخادم' : 'Could not connect to server');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          dir={isRTL ? 'rtl' : 'ltr'}
          className={`${className} w-full`}
        />
        {toast && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow pointer-events-none z-10 whitespace-nowrap">
            {toast}
          </div>
        )}
      </div>

      <div className={`flex flex-wrap gap-1.5 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        {ACTIONS.map(a => (
          <button
            key={a.key}
            type="button"
            disabled={!!loading}
            onClick={() => handleAction(a.key)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all disabled:opacity-50 select-none ${a.colors}`}
          >
            {loading === a.key ? (
              <span className={`w-3 h-3 border-2 ${a.spinner} border-t-transparent rounded-full animate-spin inline-block`} />
            ) : (
              <span className="text-[11px] font-bold leading-none">{a.icon}</span>
            )}
            {isRTL ? a.ar : a.en}
          </button>
        ))}
        <span className={`text-[10px] text-slate-400 font-medium px-1 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
          {isRTL ? '✦ ذكاء اصطناعي' : '✦ AI'}
        </span>
      </div>

      {error && (
        <p className={`text-xs text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}>{error}</p>
      )}
    </div>
  );
}
