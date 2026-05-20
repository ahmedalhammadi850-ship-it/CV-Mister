import { useState } from 'react';
import AITextarea from './AITextarea';

const uiEdu = {
  degree:      { en: 'Degree',       ar: 'الدرجة العلمية'    },
  institution: { en: 'Institution',  ar: 'المؤسسة التعليمية' },
  location:    { en: 'Location',     ar: 'الموقع'             },
  startDate:   { en: 'Start Date',   ar: 'تاريخ البداية'      },
  endDate:     { en: 'End Date',     ar: 'تاريخ الانتهاء'     },
  description: { en: 'Description',  ar: 'الوصف'              },
  delete:      { en: 'Delete',       ar: 'حذف'                },
};
const te = (key, isRTL) => uiEdu[key]?.[isRTL ? 'ar' : 'en'] ?? key;

export default function EducationCard({ edu, isRTL, labelClass, inputClass, onChange, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-indigo-100 bg-indigo-50/60 rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-indigo-100/70 transition-colors"
        style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
        onClick={() => setOpen(o => !o)}
      >
        <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
          <div className="font-medium text-slate-800 text-sm">
            {edu.degree || (isRTL ? 'تعليم جديد' : 'New Education')}
          </div>
          {edu.institution && (
            <div className="text-xs text-slate-500">{edu.institution}</div>
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
            <div className="col-span-2">
              <label className={labelClass}>{te('degree', isRTL)}</label>
              <input
                type="text"
                value={edu.degree}
                onChange={e => onChange('degree', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>{te('institution', isRTL)}</label>
              <input
                type="text"
                value={edu.institution}
                onChange={e => onChange('institution', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className={labelClass}>{te('location', isRTL)}</label>
              <input
                type="text"
                value={edu.location}
                onChange={e => onChange('location', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{te('startDate', isRTL)}</label>
              <input
                type="text"
                placeholder="Sep 2014"
                value={edu.startDate}
                onChange={e => onChange('startDate', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{te('endDate', isRTL)}</label>
              <input
                type="text"
                placeholder="May 2018"
                value={edu.endDate}
                onChange={e => onChange('endDate', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>{te('description', isRTL)}</label>
              <AITextarea
                value={edu.description}
                onChange={val => onChange('description', val)}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder={isRTL ? 'صف مؤهلاتك وإنجازاتك...' : 'Describe your qualifications and achievements...'}
                isRTL={isRTL}
                align={edu.descriptionAlign}
                onAlignChange={val => onChange('descriptionAlign', val)}
                bold={edu.descriptionBold ?? false}
                onBoldChange={val => onChange('descriptionBold', val)}
                italic={edu.descriptionItalic ?? false}
                onItalicChange={val => onChange('descriptionItalic', val)}
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
