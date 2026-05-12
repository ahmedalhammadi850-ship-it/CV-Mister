import { useCV } from '../../context/CVContext';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
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
  addContent:    { en: '+ Add Content',          ar: '+ إضافة محتوى'    },
  addContentTitle: { en: 'Add Content',          ar: 'إضافة محتوى'      },
  addContentSub: { en: 'Choose a section to add to your resume', ar: 'اختر قسماً لإضافته إلى سيرتك الذاتية' },
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

const CONTENT_SECTIONS = [
  {
    key: 'personalInfo',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    en: { title: 'Personal Info', desc: 'Your name, contact details and profile summary.' },
    ar: { title: 'المعلومات الشخصية', desc: 'اسمك وبيانات التواصل والملخص المهني.' },
    color: '#4f46e5',
  },
  {
    key: 'experience',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    en: { title: 'Experience', desc: 'Work history, roles, and key achievements.' },
    ar: { title: 'الخبرة العملية', desc: 'سجل عملك وأدوارك وإنجازاتك الرئيسية.' },
    color: '#0891b2',
  },
  {
    key: 'education',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
    en: { title: 'Education', desc: 'Degrees, schools, honors, and achievements.' },
    ar: { title: 'التعليم والمؤهلات', desc: 'درجاتك العلمية ومدارسك وأوسمتك.' },
    color: '#7c3aed',
  },
  {
    key: 'skills',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    en: { title: 'Skills', desc: 'Hard and soft skills that set you apart.' },
    ar: { title: 'المهارات', desc: 'مهاراتك التقنية والشخصية التي تميّزك.' },
    color: '#0f766e',
  },
  {
    key: 'languages',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    en: { title: 'Languages', desc: 'Languages you speak and proficiency level.' },
    ar: { title: 'اللغات', desc: 'اللغات التي تتحدثها ومستوى إتقانك.' },
    color: '#0369a1',
  },
  {
    key: 'design',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    en: { title: 'Design & Style', desc: 'Colors, fonts, and visual customization.' },
    ar: { title: 'التصميم والأسلوب', desc: 'الألوان والخطوط والتخصيص البصري.' },
    color: '#b45309',
  },
];

/* ── Add Content Modal ── */
const AddContentModal = ({ isRTL, onClose, onSelect }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ maxHeight: '85vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t('addContentTitle', isRTL)}</h2>
            <p className="text-sm text-slate-400 mt-0.5">{t('addContentSub', isRTL)}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="overflow-y-auto flex-1 p-4">
          <div className="grid grid-cols-2 gap-3">
            {CONTENT_SECTIONS.map((section) => (
              <button
                key={section.key}
                onClick={() => onSelect(section.key)}
                className="text-start p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50/80 hover:shadow-md transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors"
                  style={{ background: section.color + '18', color: section.color }}
                >
                  {section.icon}
                </div>
                <p className="font-semibold text-slate-800 text-sm leading-snug">
                  {isRTL ? section.ar.title : section.en.title}
                </p>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
                  {isRTL ? section.ar.desc : section.en.desc}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const EditorPanel = () => {
  const { cvData, updateSection, theme, setTheme } = useCV();
  const { isRTL } = useAuth();
  const [openSection, setOpenSection] = useState('personalInfo');
  const [showAddContent, setShowAddContent] = useState(false);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    updateSection('personalInfo', { ...cvData.personalInfo, [name]: value });
  };

  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  const handleAddContentSelect = (sectionKey) => {
    setShowAddContent(false);
    setOpenSection(sectionKey);
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
    <>
      {showAddContent && (
        <AddContentModal
          isRTL={isRTL}
          onClose={() => setShowAddContent(false)}
          onSelect={handleAddContentSelect}
        />
      )}

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

        {/* ── Add Content Button ── */}
        <div className="p-4 mt-2">
          <button
            onClick={() => setShowAddContent(true)}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t('addContent', isRTL)}
          </button>
        </div>

      </div>
    </>
  );
};

export default EditorPanel;
