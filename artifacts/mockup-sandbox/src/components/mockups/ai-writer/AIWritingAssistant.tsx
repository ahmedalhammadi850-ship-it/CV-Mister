import { useState } from 'react';

export function AIWritingAssistant() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [align, setAlign] = useState<'right' | 'center' | 'left'>('right');

  const simulateAI = (action: string) => {
    setLoading(action);
    setTimeout(() => setLoading(null), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        {/* Section header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <span className="font-bold text-slate-800 text-base">الملخص المهني</span>
          </div>
          <button className="text-slate-400 hover:text-slate-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
        </div>

        <div className="p-5 space-y-3">
          {/* Alignment + Formatting toolbar */}
          <div className="flex items-center justify-between">
            {/* Alignment pills */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
              {(['right', 'center', 'left'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAlign(a)}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                    align === a
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {a === 'right' ? 'يمين' : a === 'center' ? 'وسط' : 'يسار'}
                </button>
              ))}
            </div>

            {/* Formatting icons */}
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h8" />
                </svg>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors font-serif italic font-bold text-sm">
                I
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors font-bold text-sm">
                B
              </button>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="لخّص خلفيتك المهنية..."
            rows={5}
            style={{ textAlign: align }}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
          />

          {/* AI Action buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {/* Improve */}
            <button
              onClick={() => simulateAI('improve')}
              disabled={loading !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all disabled:opacity-60
                border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
            >
              {loading === 'improve' ? (
                <span className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>✂</span>
              )}
              تحسين النص
            </button>

            {/* Suggest */}
            <button
              onClick={() => simulateAI('suggest')}
              disabled={loading !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all disabled:opacity-60
                border-emerald-300 text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
            >
              {loading === 'suggest' ? (
                <span className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>＋</span>
              )}
              اقتراح
            </button>

            {/* Grammar check */}
            <button
              onClick={() => simulateAI('grammar')}
              disabled={loading !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all disabled:opacity-60
                border-teal-300 text-teal-600 bg-teal-50 hover:bg-teal-100"
            >
              {loading === 'grammar' ? (
                <span className="w-3 h-3 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>✓</span>
              )}
              تدقيق لغوي
            </button>

            {/* Shorten */}
            <button
              onClick={() => simulateAI('shorten')}
              disabled={loading !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all disabled:opacity-60
                border-amber-300 text-amber-600 bg-amber-50 hover:bg-amber-100"
            >
              {loading === 'shorten' ? (
                <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>✂</span>
              )}
              اختصار
            </button>
          </div>

          {/* AI badge */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="w-5 h-5 rounded-md bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-xs">✦</span>
            </div>
            <span className="text-xs text-slate-400">مدعوم بالذكاء الاصطناعي</span>
          </div>
        </div>
      </div>
    </div>
  );
}
