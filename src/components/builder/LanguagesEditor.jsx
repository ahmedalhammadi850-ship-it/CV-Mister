import { useState } from 'react';

const ui = {
  language:    { en: 'Language',          ar: 'اللغة'        },
  level:       { en: 'Level',             ar: 'المستوى'      },
  add:         { en: 'Add',              ar: 'إضافة'         },
  addLanguage: { en: '+ Add Language',   ar: '+ إضافة لغة'  },
  delete:      { en: 'Delete',           ar: 'حذف'           },
  native:      { en: 'Native',           ar: 'اللغة الأم'    },
  fluent:      { en: 'Fluent',           ar: 'طلاقة'         },
  advanced:    { en: 'Advanced',         ar: 'متقدم'         },
  intermediate:{ en: 'Intermediate',     ar: 'متوسط'         },
  beginner:    { en: 'Beginner',         ar: 'مبتدئ'         },
};
const t = (key, isRTL) => ui[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const LEVELS = ['native', 'fluent', 'advanced', 'intermediate', 'beginner'];

export default function LanguagesEditor({ languages, isRTL, updateSection }) {
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLevel, setNewLevel] = useState('intermediate');

  const addLanguage = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;
    const entry = {
      id: `lang-${Date.now()}`,
      name: trimmed,
      level: t(newLevel, isRTL),
    };
    updateSection('languages', [...(languages || []), entry]);
    setNewName('');
    setNewLevel('intermediate');
    setAdding(false);
  };

  const deleteLanguage = (id) => {
    updateSection('languages', languages.filter(l => l.id !== id));
  };

  return (
    <div className="p-4 space-y-2 bg-slate-50/50 border-b border-slate-100" dir={isRTL ? 'rtl' : 'ltr'}>
      {(languages || []).map((lang) => (
        <div
          key={lang.id}
          className="border border-slate-200 bg-white rounded-lg px-3 py-2 flex items-center justify-between"
          style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
        >
          <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
            <div className="font-medium text-slate-800 text-sm">{lang.name}</div>
            <div className="text-xs text-slate-500">{lang.level}</div>
          </div>
          <button
            onClick={() => deleteLanguage(lang.id)}
            className="text-slate-400 hover:text-red-500 transition-colors text-lg leading-none font-bold flex-shrink-0"
            title="Remove"
          >
            &times;
          </button>
        </div>
      ))}

      {adding ? (
        <div className="border border-indigo-200 bg-indigo-50 rounded-lg p-3 space-y-2">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('language', isRTL)}</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addLanguage()}
              autoFocus
              className="input-field py-2 text-sm w-full"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">{t('level', isRTL)}</label>
            <select
              value={newLevel}
              onChange={e => setNewLevel(e.target.value)}
              className="input-field py-2 text-sm w-full"
            >
              {LEVELS.map(lvl => (
                <option key={lvl} value={lvl}>{t(lvl, isRTL)}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addLanguage}
              className="flex-1 py-2 bg-indigo-600 text-white text-sm rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              {t('add', isRTL)}
            </button>
            <button
              onClick={() => { setAdding(false); setNewName(''); }}
              className="flex-1 py-2 bg-white border border-slate-200 text-slate-600 text-sm rounded-lg hover:bg-slate-50 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-colors text-sm"
        >
          {t('addLanguage', isRTL)}
        </button>
      )}
    </div>
  );
}
