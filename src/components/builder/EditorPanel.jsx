import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import ExperienceCard from './ExperienceCard';
import EducationCard from './EducationCard';
import SkillsEditor from './SkillsEditor';
import LanguagesEditor from './LanguagesEditor';

const ui = {
  personalInfo:  { en: 'Personal Information',  ar: 'المعلومات الشخصية' },
  fullName:      { en: 'Full Name',              ar: 'الاسم الكامل'      },
  jobTitle:      { en: 'Job Title',              ar: 'المسمى الوظيفي'   },
  email:         { en: 'Email',                  ar: 'البريد الإلكتروني' },
  phone:         { en: 'Phone',                  ar: 'الهاتف'            },
  location:      { en: 'Location',               ar: 'الموقع'            },
  linkedin:      { en: 'LinkedIn',               ar: 'لينكد إن'          },
  summary:       { en: 'Professional Summary',   ar: 'الملخص المهني'     },
  experience:    { en: 'Experience',             ar: 'الخبرة العملية'    },
  addExperience: { en: '+ Add Experience',       ar: '+ إضافة خبرة'     },
  education:     { en: 'Education',              ar: 'التعليم'           },
  addEducation:  { en: '+ Add Education',        ar: '+ إضافة تعليم'    },
  skills:        { en: 'Skills',                 ar: 'المهارات'          },
  languages:     { en: 'Languages',              ar: 'اللغات'            },
  present:       { en: 'Present',                ar: 'حتى الآن'          },
  design:        { en: 'Design & Style',         ar: 'التصميم والأسلوب'  },
  accentColor:   { en: 'Accent Color',           ar: 'اللون الرئيسي'     },
  fontSize:      { en: 'Font Size',              ar: 'حجم الخط'          },
  small:         { en: 'Small',                  ar: 'صغير'              },
  medium:        { en: 'Medium',                 ar: 'متوسط'             },
  large:         { en: 'Large',                  ar: 'كبير'              },
};
const t = (key, isRTL) => ui[key][isRTL ? 'ar' : 'en'];

const COLORS = [
  { label: 'Indigo',   value: '#4f46e5' },
  { label: 'Blue',     value: '#1d4ed8' },
  { label: 'Navy',     value: '#1e3a5f' },
  { label: 'Teal',     value: '#0f766e' },
  { label: 'Green',    value: '#15803d' },
  { label: 'Purple',   value: '#7c3aed' },
  { label: 'Crimson',  value: '#b91c1c' },
  { label: 'Orange',   value: '#c2410c' },
  { label: 'Charcoal', value: '#374151' },
  { label: 'Black',    value: '#111111' },
];

const EditorPanel = () => {
  const { cvData, updateSection, theme, setTheme } = useCV();
  const { isRTL } = useAuth();
  const [openSection, setOpenSection] = useState('personalInfo');

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    updateSection('personalInfo', { ...cvData.personalInfo, [name]: value });
  };

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

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

      {/* ── Design & Style ── */}
      <div>
        <AccordionHeader titleKey="design" section="design" />
        {openSection === 'design' && (
          <div className="p-4 space-y-5 bg-slate-50/50 border-b border-slate-100">

            {/* Accent Color */}
            <div>
              <label className={labelClass}>{t('accentColor', isRTL)}</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {COLORS.map(c => (
                  <button
                    key={c.value}
                    title={c.label}
                    onClick={() => setTheme({ ...theme, primaryColor: c.value })}
                    className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
                    style={{
                      backgroundColor: c.value,
                      borderColor: theme.primaryColor === c.value ? '#fff' : 'transparent',
                      boxShadow: theme.primaryColor === c.value ? `0 0 0 2px ${c.value}` : 'none',
                    }}
                  />
                ))}
                {/* Custom color picker */}
                <label className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-slate-400 relative overflow-hidden" title="Custom color">
                  <span className="text-slate-400 text-xs font-bold">+</span>
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={e => setTheme({ ...theme, primaryColor: e.target.value })}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </label>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className={labelClass}>{t('fontSize', isRTL)}</label>
              <div className="flex gap-2 mt-2">
                {(['small', 'medium', 'large']).map(size => (
                  <button
                    key={size}
                    onClick={() => setTheme({ ...theme, fontSize: size })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      theme.fontSize === size
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300'
                    }`}
                  >
                    {t(size, isRTL)}
                  </button>
                ))}
              </div>
              {/* Visual hint */}
              <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg" style={{ direction: 'ltr' }}>
                <span style={{
                  fontFamily: "'Calibri', Arial, sans-serif",
                  fontSize: theme.fontSize === 'small' ? '10pt' : theme.fontSize === 'large' ? '13pt' : '11pt',
                  color: theme.primaryColor,
                  fontWeight: '700',
                }}>
                  {theme.fontSize === 'small' ? 'Aa — Small (10pt)' : theme.fontSize === 'large' ? 'Aa — Large (13pt)' : 'Aa — Medium (11pt)'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Personal Info ── */}
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
                <textarea name="summary" value={cvData.personalInfo.summary} onChange={handlePersonalInfoChange} rows={4} className={`${inputClass} resize-none`} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Experience ── */}
      <div>
        <AccordionHeader titleKey="experience" section="experience" />
        {openSection === 'experience' && (
          <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
            {cvData.experience.map((exp) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                isRTL={isRTL}
                labelClass={labelClass}
                inputClass={inputClass}
                onChange={(field, value) => {
                  const updated = cvData.experience.map(e =>
                    e.id === exp.id ? { ...e, [field]: value } : e
                  );
                  updateSection('experience', updated);
                }}
                onDelete={() => {
                  updateSection('experience', cvData.experience.filter(e => e.id !== exp.id));
                }}
              />
            ))}
            <button
              onClick={() => {
                const newExp = {
                  id: `exp-${Date.now()}`,
                  jobTitle: '',
                  company: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: '',
                };
                updateSection('experience', [...cvData.experience, newExp]);
              }}
              className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-primary-400 hover:text-primary-600 transition-colors text-sm"
            >
              {t('addExperience', isRTL)}
            </button>
          </div>
        )}
      </div>

      {/* ── Education ── */}
      <div>
        <AccordionHeader titleKey="education" section="education" />
        {openSection === 'education' && (
          <div className="p-4 space-y-3 bg-slate-50/50 border-b border-slate-100">
            {cvData.education.map((edu) => (
              <EducationCard
                key={edu.id}
                edu={edu}
                isRTL={isRTL}
                labelClass={labelClass}
                inputClass={inputClass}
                onChange={(field, value) => {
                  const updated = cvData.education.map(e =>
                    e.id === edu.id ? { ...e, [field]: value } : e
                  );
                  updateSection('education', updated);
                }}
                onDelete={() => {
                  updateSection('education', cvData.education.filter(e => e.id !== edu.id));
                }}
              />
            ))}
            <button
              onClick={() => {
                const newEdu = {
                  id: `edu-${Date.now()}`,
                  degree: '',
                  institution: '',
                  location: '',
                  startDate: '',
                  endDate: '',
                  description: '',
                };
                updateSection('education', [...cvData.education, newEdu]);
              }}
              className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-primary-400 hover:text-primary-600 transition-colors text-sm"
            >
              {t('addEducation', isRTL)}
            </button>
          </div>
        )}
      </div>

      {/* ── Skills ── */}
      <div>
        <AccordionHeader titleKey="skills" section="skills" />
        {openSection === 'skills' && (
          <SkillsEditor
            skills={cvData.skills}
            isRTL={isRTL}
            updateSection={updateSection}
          />
        )}
      </div>

      {/* ── Languages ── */}
      <div>
        <AccordionHeader titleKey="languages" section="languages" />
        {openSection === 'languages' && (
          <LanguagesEditor
            languages={cvData.languages}
            isRTL={isRTL}
            updateSection={updateSection}
          />
        )}
      </div>

    </div>
  );
};

export default EditorPanel;
