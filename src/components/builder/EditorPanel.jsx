import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const ui = {
  personalInfo:       { en: 'Personal Information',  ar: 'المعلومات الشخصية' },
  fullName:           { en: 'Full Name',              ar: 'الاسم الكامل'      },
  jobTitle:           { en: 'Job Title',              ar: 'المسمى الوظيفي'   },
  email:              { en: 'Email',                  ar: 'البريد الإلكتروني' },
  phone:              { en: 'Phone',                  ar: 'الهاتف'            },
  location:           { en: 'Location',               ar: 'الموقع'            },
  linkedin:           { en: 'LinkedIn',               ar: 'لينكد إن'          },
  summary:            { en: 'Professional Summary',   ar: 'الملخص المهني'     },
  experience:         { en: 'Experience',             ar: 'الخبرة العملية'    },
  addExperience:      { en: '+ Add Experience',       ar: '+ إضافة خبرة'     },
  education:          { en: 'Education',              ar: 'التعليم'           },
  addEducation:       { en: '+ Add Education',        ar: '+ إضافة تعليم'    },
  skills:             { en: 'Skills',                 ar: 'المهارات'          },
  languages:          { en: 'Languages',              ar: 'اللغات'            },
  present:            { en: 'Present',                ar: 'حتى الآن'          },
};
const t = (key, isRTL) => ui[key][isRTL ? 'ar' : 'en'];

const EditorPanel = () => {
  const { cvData, updateSection } = useCV();
  const { isRTL } = useAuth();
  const [openSection, setOpenSection] = useState('personalInfo');

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    updateSection('personalInfo', { ...cvData.personalInfo, [name]: value });
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const labelClass = 'block text-xs font-medium text-slate-500 mb-1';
  const inputClass = 'input-field py-2 text-sm';

  const AccordionHeader = ({ titleKey, section }) => (
    <div
      className="flex justify-between items-center p-4 bg-white border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={() => toggleSection(section)}
      style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
    >
      <h3 className="font-medium text-slate-800">{t(titleKey, isRTL)}</h3>
      <svg
        className={`w-5 h-5 text-slate-400 transform transition-transform ${openSection === section ? 'rotate-180' : ''}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  return (
    <div
      className="flex flex-col pb-20"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ fontFamily: isRTL ? "'Tajawal', Arial, sans-serif" : undefined }}
    >

      {/* Personal Info */}
      <div>
        <AccordionHeader titleKey="personalInfo" section="personalInfo" />
        {openSection === 'personalInfo' && (
          <div className="p-4 space-y-4 bg-slate-50/50 border-b border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>{t('fullName', isRTL)}</label>
                <input type="text" name="fullName" value={cvData.personalInfo.fullName} onChange={handlePersonalInfoChange} className={inputClass} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>{t('jobTitle', isRTL)}</label>
                <input type="text" name="jobTitle" value={cvData.personalInfo.jobTitle} onChange={handlePersonalInfoChange} className={inputClass} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>{t('email', isRTL)}</label>
                <input type="email" name="email" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} className={inputClass} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>{t('phone', isRTL)}</label>
                <input type="text" name="phone" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>{t('location', isRTL)}</label>
                <input type="text" name="location" value={cvData.personalInfo.location} onChange={handlePersonalInfoChange} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>{t('linkedin', isRTL)}</label>
                <input type="text" name="linkedin" value={cvData.personalInfo.linkedin || ''} onChange={handlePersonalInfoChange} className={inputClass} />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>{t('summary', isRTL)}</label>
                <textarea
                  name="summary"
                  value={cvData.personalInfo.summary}
                  onChange={handlePersonalInfoChange}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Experience */}
      <div>
        <AccordionHeader titleKey="experience" section="experience" />
        {openSection === 'experience' && (
          <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
            {cvData.experience.map((exp) => (
              <div key={exp.id} className="border border-slate-200 bg-white rounded-lg p-3">
                <div className="font-medium text-slate-800">{exp.jobTitle}</div>
                <div className="text-sm text-slate-500">
                  {exp.company} • {exp.startDate} - {exp.current ? t('present', isRTL) : exp.endDate}
                </div>
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-primary-400 hover:text-primary-600 transition-colors text-sm">
              {t('addExperience', isRTL)}
            </button>
          </div>
        )}
      </div>

      {/* Education */}
      <div>
        <AccordionHeader titleKey="education" section="education" />
        {openSection === 'education' && (
          <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
            {cvData.education.map((edu) => (
              <div key={edu.id} className="border border-slate-200 bg-white rounded-lg p-3">
                <div className="font-medium text-slate-800">{edu.degree}</div>
                <div className="text-sm text-slate-500">{edu.institution}</div>
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-primary-400 hover:text-primary-600 transition-colors text-sm">
              {t('addEducation', isRTL)}
            </button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div>
        <AccordionHeader titleKey="skills" section="skills" />
        {openSection === 'skills' && (
          <div className="p-4 bg-slate-50/50 border-b border-slate-100">
            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill, index) => (
                <div key={index} className="bg-white border border-slate-200 px-3 py-1 rounded-full text-sm text-slate-700 flex items-center gap-1">
                  {skill}
                  <button className="text-slate-400 hover:text-red-500">&times;</button>
                </div>
              ))}
              <button className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm hover:bg-slate-200">+</button>
            </div>
          </div>
        )}
      </div>

      {/* Languages */}
      {cvData.languages?.length > 0 && (
        <div>
          <AccordionHeader titleKey="languages" section="languages" />
          {openSection === 'languages' && (
            <div className="p-4 space-y-2 bg-slate-50/50 border-b border-slate-100">
              {cvData.languages.map((lang, i) => (
                <div key={i} className="border border-slate-200 bg-white rounded-lg p-3">
                  <div className="font-medium text-slate-800">{lang.name}</div>
                  <div className="text-sm text-slate-500">{lang.level}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default EditorPanel;
