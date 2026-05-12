import { useState } from 'react';

const ui = {
  addSkill:    { en: 'Add skill…',  ar: 'أضف مهارة…' },
  add:         { en: 'Add',         ar: 'إضافة'       },
};
const t = (key, isRTL) => ui[key]?.[isRTL ? 'ar' : 'en'] ?? key;

export default function SkillsEditor({ skills, isRTL, updateSection }) {
  const [input, setInput] = useState('');

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    updateSection('skills', [...skills, trimmed]);
    setInput('');
  };

  const deleteSkill = (index) => {
    updateSection('skills', skills.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addSkill(); }
  };

  return (
    <div className="p-4 bg-slate-50/50 border-b border-slate-100 space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 px-3 py-1 rounded-full text-sm text-slate-700 flex items-center gap-1"
          >
            <span>{skill}</span>
            <button
              onClick={() => deleteSkill(index)}
              className="text-slate-400 hover:text-red-500 transition-colors leading-none ml-1 font-bold"
              title="Remove"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
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
    </div>
  );
}
