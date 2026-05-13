import { useState } from 'react';

const AI_ACTIONS = [
  {
    key: 'improve',
    ar: 'تحسين النص',
    en: 'Improve',
    dot: '#7c3aed',
    pill: { border: '#c4b5fd', color: '#6d28d9', bg: '#f5f3ff' },
    icon: (
      <svg viewBox="0 0 16 16" fill="none" style={{ width: 10, height: 10 }} stroke="white" strokeWidth="2.2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 8h12M9 4l4 4-4 4" />
      </svg>
    ),
  },
  {
    key: 'suggest',
    ar: 'اقتراح',
    en: 'Suggest',
    dot: '#059669',
    pill: { border: '#6ee7b7', color: '#047857', bg: '#ecfdf5' },
    icon: (
      <svg viewBox="0 0 16 16" fill="none" style={{ width: 10, height: 10 }} stroke="white" strokeWidth="2.4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v10M3 8h10" />
      </svg>
    ),
  },
  {
    key: 'grammar',
    ar: 'تدقيق لغوي',
    en: 'Grammar',
    dot: '#0891b2',
    pill: { border: '#67e8f9', color: '#0e7490', bg: '#ecfeff' },
    icon: (
      <svg viewBox="0 0 16 16" fill="none" style={{ width: 10, height: 10 }} stroke="white" strokeWidth="2.4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 9l3.5 3.5 7-8" />
      </svg>
    ),
  },
  {
    key: 'shorten',
    ar: 'اختصار',
    en: 'Shorten',
    dot: '#d97706',
    pill: { border: '#fcd34d', color: '#92400e', bg: '#fffbeb' },
    icon: (
      <svg viewBox="0 0 16 16" fill="none" style={{ width: 10, height: 10 }} stroke="white" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3v10M5 6l3-3 3 3M5 10l3 3 3-3" />
      </svg>
    ),
  },
];

export function AIWritingAssistant() {
  const [text, setText] = useState('');
  const [align, setAlign] = useState<'right'|'center'|'left'>('right');
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [toast, setToast] = useState<{ msg: string; bg: string } | null>(null);

  const fire = (key: string, bg: string, msgAr: string) => {
    setToast({ msg: `✦ ${msgAr}`, bg });
    setTimeout(() => setToast(null), 2200);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 flex items-center justify-center p-6"
      dir="rtl"
      style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div style={{ width: 420 }}>
        {/* Section label */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>📝</span>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#1e293b' }}>الملخص المهني</span>
          </div>
          <button style={{ color: '#94a3b8', padding: 4 }}>
            <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#fff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          }}
        >
          {/* Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid #f1f5f9',
              background: '#f8fafc',
            }}
          >
            {/* Alignment pills */}
            <div
              style={{
                display: 'flex',
                gap: 2,
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: 3,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              }}
            >
              {[{ v: 'right', l: 'يمين' }, { v: 'center', l: 'وسط' }, { v: 'left', l: 'يسار' }].map(({ v, l }) => (
                <button
                  key={v}
                  onClick={() => setAlign(v as any)}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 5,
                    fontSize: 11,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    background: align === v ? '#1e293b' : 'transparent',
                    color: align === v ? '#fff' : '#94a3b8',
                    transition: 'all 0.15s',
                  }}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Format icons */}
            <div style={{ display: 'flex', gap: 2 }}>
              {[
                {
                  title: 'قائمة',
                  active: false,
                  node: (
                    <svg viewBox="0 0 16 16" fill="none" style={{ width: 14, height: 14 }} stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" d="M6 4h7M6 8h7M6 12h7M3 4h.01M3 8h.01M3 12h.01" />
                    </svg>
                  ),
                  onClick: () => {},
                },
                {
                  title: 'I',
                  active: italic,
                  node: <span style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 14, fontFamily: 'serif' }}>I</span>,
                  onClick: () => setItalic(v => !v),
                },
                {
                  title: 'B',
                  active: bold,
                  node: <span style={{ fontWeight: 900, fontSize: 14 }}>B</span>,
                  onClick: () => setBold(v => !v),
                },
              ].map((btn, i) => (
                <button
                  key={i}
                  title={btn.title}
                  onClick={btn.onClick}
                  style={{
                    width: 28, height: 28,
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: btn.active ? '#e2e8f0' : 'transparent',
                    color: btn.active ? '#1e293b' : '#94a3b8',
                    transition: 'all 0.15s',
                  }}
                >
                  {btn.node}
                </button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <div style={{ position: 'relative' }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="لخّص خلفيتك المهنية..."
              rows={5}
              dir="rtl"
              style={{
                width: '100%',
                resize: 'none',
                border: 'none',
                outline: 'none',
                padding: '14px 16px',
                fontSize: 13.5,
                color: '#1e293b',
                background: 'transparent',
                textAlign: align as any,
                fontWeight: bold ? 700 : 400,
                fontStyle: italic ? 'italic' : 'normal',
                lineHeight: 1.7,
                boxSizing: 'border-box',
              }}
            />

            {toast && (
              <div style={{
                position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)',
                background: toast.bg, color: '#fff', fontSize: 11.5, fontWeight: 600,
                padding: '5px 14px', borderRadius: 999, boxShadow: '0 3px 12px rgba(0,0,0,0.18)',
                whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 10,
              }}>
                {toast.msg}
              </div>
            )}
          </div>

          {/* AI Actions */}
          <div style={{
            padding: '8px 12px 12px',
            borderTop: '1px solid #f1f5f9',
            background: '#fafafa',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, alignItems: 'center', direction: 'rtl' }}>
              {AI_ACTIONS.map(a => (
                <button
                  key={a.key}
                  onClick={() => fire(a.key, a.dot, `قريباً — ${a.ar}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '4px 12px 4px 6px',
                    borderRadius: 999,
                    border: `1.5px solid ${a.pill.border}`,
                    background: a.pill.bg,
                    color: a.pill.color,
                    fontSize: 11.5, fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    direction: 'rtl',
                  }}
                >
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: a.dot,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {a.icon}
                  </span>
                  {a.ar}
                </button>
              ))}

              {/* AI badge */}
              <span style={{
                marginRight: 'auto', display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 10.5, color: '#94a3b8', fontWeight: 500,
              }}>
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 12, height: 12 }} stroke="#cbd5e1" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                مساعد ذكي
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
