import { useState } from 'react';
import AITextarea from './AITextarea';

const uiExp = {
  jobTitle:    { en: 'Job Title',              ar: 'المسمى الوظيفي'     },
  company:     { en: 'Company',               ar: 'الشركة'              },
  location:    { en: 'Location',              ar: 'الموقع'              },
  startDate:   { en: 'Start Date',            ar: 'تاريخ البداية'       },
  endDate:     { en: 'End Date',              ar: 'تاريخ الانتهاء'      },
  current:     { en: 'Currently working here', ar: 'أعمل هنا حالياً'   },
  description: { en: 'Description',           ar: 'الوصف'              },
  delete:      { en: 'Delete',                ar: 'حذف'                 },
};
const te = (key, isRTL) => uiExp[key]?.[isRTL ? 'ar' : 'en'] ?? key;

export default function ExperienceCard({ exp, isRTL, labelClass, inputClass, onChange, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 bg-white rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition-colors"
        style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
          <div className="font-medium text-slate-800 text-sm">
            {exp.jobTitle || (isRTL ? 'خبرة جديدة' : 'New Experience')}
          </div>
          {exp.company && (
            <div className="text-xs text-slate-500">
              {exp.company}{exp.startDate ? ` • ${exp.startDate}` : ''}
            </div>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transform transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div className="p-3 border-t border-slate-100 space-y-3" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>{te('jobTitle', isRTL)}</label>
              <input
                type="text"
                value={exp.jobTitle}
                onChange={e => onChange('jobTitle', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>{te('company', isRTL)}</label>
              <input
                type="text"
                value={exp.company}
                onChange={e => onChange('company', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>{te('location', isRTL)}</label>
              <input
                type="text"
                value={exp.location}
                onChange={e => onChange('location', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{te('startDate', isRTL)}</label>
              <input
                type="text"
                placeholder="Jan 2021"
                value={exp.startDate}
                onChange={e => onChange('startDate', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{te('endDate', isRTL)}</label>
              <input
                type="text"
                placeholder="Dec 2023"
                value={exp.endDate}
                onChange={e => onChange('endDate', e.target.value)}
                disabled={exp.current}
                className={`${inputClass} ${exp.current ? 'opacity-40 cursor-not-allowed' : ''}`}
              />
            </div>
            <div
              className="col-span-2 flex items-center gap-2"
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                justifyContent: isRTL ? 'flex-end' : 'flex-start',
              }}
            >
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={e => onChange('current', e.target.checked)}
                className="w-4 h-4 accent-indigo-600"
              />
              <label
                htmlFor={`current-${exp.id}`}
                className="text-xs text-slate-600 cursor-pointer select-none"
              >
                {te('current', isRTL)}
              </label>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>{te('description', isRTL)}</label>
              <AITextarea
                value={exp.description}
                onChange={val => onChange('description', val)}
                rows={4}
                className={`${inputClass} resize-none`}
                placeholder={isRTL ? 'صف مهامك ومسؤولياتك...' : 'Describe your duties and responsibilities...'}
                isRTL={isRTL}
              />
            </div>
          </div>
          <button
            onClick={onDelete}
            className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            {te('delete', isRTL)}
          </button>
        </div>
      )}
    </div>
  );
}
