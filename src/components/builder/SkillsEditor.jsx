import { useState } from 'react';

const LEVELS = [
  { label: '—',    value: 0   },
  { label: '60%',  value: 60  },
  { label: '70%',  value: 70  },
  { label: '80%',  value: 80  },
  { label: '90%',  value: 90  },
  { label: '100%', value: 100 },
];

const ui = {
  addSkill:    { en: 'Add skill…',  ar: 'أضف مهارة…' },
  add:         { en: 'Add',         ar: 'إضافة'       },
  level:       { en: 'Level',       ar: 'المستوى'     },
};
const t = (key, isRTL) => ui[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const normalizeSkill = (sk) =>
  typeof sk === 'string' ? { name: sk, level: 0 } : sk;

export default function SkillsEditor({ skills, isRTL, updateSection }) {
  const [input, setInput] = useState('');
  const [newLevel, setNewLevel] = useState(0);

  const normalized = (skills || []).map(normalizeSkill);

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (normalized.some(s => s.name === trimmed)) return;
    updateSection('skills', [...normalized, { name: trimmed, level: newLevel }]);
    setInput('');
    setNewLevel(0);
  };

  const deleteSkill = (index) => {
    updateSection('skills', normalized.filter((_, i) => i !== index));
  };

  const setLevel = (index, level) => {
    const updated = normalized.map((s, i) => i === index ? { ...s, level } : s);
    updateSection('skills', updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  return (
    <div className="p-4 bg-slate-50/50 border-b border-slate-100 space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* Skills list */}
      <div className="space-y-2">
        {normalized.map((skill, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex flex-col gap-2"
          >
            {/* Top row: name + delete */}
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-800 flex-1 truncate">{skill.name}</span>
              <button
                onClick={() => deleteSkill(index)}
                className="text-slate-300 hover:text-red-500 transition-colors flex-shrink-0"
                title="Remove"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Level selector + progress bar */}
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-1 flex-wrap">
                {LEVELS.map(l => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(index, l.value)}
                    className={`text-xs px-2 py-0.5 rounded-md font-medium border transition-all ${
                      skill.level === l.value
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Progress bar (only if level > 0) */}
              {skill.level > 0 && (
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${skill.level}%`,
                      background: 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add new skill */}
      <div className="bg-white border border-dashed border-slate-300 rounded-xl p-3 space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('addSkill', isRTL)}
            className="input-field py-2 text-sm flex-1"
          />
          <button
            onClick={addSkill}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            {t('add', isRTL)}
          </button>
        </div>

        {/* Level for new skill */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400">{t('level', isRTL)}:</span>
          {LEVELS.map(l => (
            <button
              key={l.value}
              onClick={() => setNewLevel(l.value)}
              className={`text-xs px-2 py-0.5 rounded-md font-medium border transition-all ${
                newLevel === l.value
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
