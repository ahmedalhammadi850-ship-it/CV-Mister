import { useState, useRef } from 'react';
import { useCV } from '../../context/useCV';
import { useAuth } from '../../context/AuthContext';
import { useTemplateConfig } from '../../context/TemplateConfigContext';

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

const FONTS_EN = [
  { label: 'Calibri',        value: 'Calibri'        },
  { label: 'Arial',          value: 'Arial'          },
  { label: 'Georgia',        value: 'Georgia'        },
  { label: 'Times New Roman',value: 'Times New Roman'},
  { label: 'Verdana',        value: 'Verdana'        },
  { label: 'Trebuchet MS',   value: 'Trebuchet MS'   },
];

const FONTS_AR = [
  { label: 'تجوال',          value: 'Tajawal'               },
  { label: 'كايرو',          value: 'Cairo'                 },
  { label: 'أميري',          value: 'Amiri'                 },
  { label: 'نوتو نسخ',       value: 'Noto Naskh Arabic'     },
  { label: 'شهرزاد',         value: 'Scheherazade New'      },
];

const TEMPLATES = [
  { value: 'modern',    en: 'Modern',    ar: 'عصري'        },
  { value: 'classic',   en: 'Classic',   ar: 'كلاسيكي'     },
  { value: 'creative',  en: 'Creative',  ar: 'إبداعي'      },
  { value: 'minimal',   en: 'Minimal',   ar: 'بسيط'        },
  { value: 'executive', en: 'Executive', ar: 'تنفيذي'      },
  { value: 'atsclean',  en: 'ATS Clean',   ar: 'ATS نظيف'      },
  { value: 'atspro',    en: 'ATS Pro',     ar: 'ATS احترافي'   },
  { value: 'atssimple',  en: 'ATS Simple',   ar: 'ATS بسيط جداً' },
  { value: 'atsbold',    en: 'ATS Bold',     ar: 'ATS قوي'       },
  { value: 'atscompact', en: 'ATS Compact',  ar: 'ATS مضغوط'     },
  { value: 'atsmodern',  en: 'ATS Modern',   ar: 'ATS عصري'      },
  { value: 'atsharvard', en: 'ATS Harvard',  ar: 'ATS هارفارد'   },
  { value: 'atscenter',  en: 'ATS Center',   ar: 'ATS توسيط'     },
  { value: 'atselegant', en: 'ATS Elegant',  ar: 'ATS أنيق'      },
  { value: 'prestige',      en: 'Prestige',        ar: 'بريستيج'          },
  { value: 'classicserif',  en: 'Classic Serif',   ar: 'كلاسيك سيريف'     },
  { value: 'atlanticblue',  en: 'Atlantic Blue',   ar: 'أتلانتيك بلو'     },
  { value: 'mercuryflow',   en: 'Mercury Flow',    ar: 'ميركوري فلو'      },
  { value: 'editorialrule', en: 'Editorial Rule',  ar: 'إديتوريال رول'    },
  { value: 'sidebarlight', en: 'Sidebar Light',   ar: 'شريط جانبي فاتح'  },
  { value: 'tealpro',      en: 'Teal Pro',        ar: 'تيل برو'          },
  { value: 'roseelegant',  en: 'Rose Elegant',    ar: 'روز إيليغانت'     },
  { value: 'darkheader',   en: 'Dark Header',     ar: 'هيدر داكن'        },
  { value: 'arabicnavy',         en: 'Arabic Navy',          ar: 'نيفي عربي'           },
  { value: 'arabicpro',          en: 'Arabic Pro',           ar: 'عربي احترافي'        },
  { value: 'arabictealsidebar',  en: 'Arabic Teal Sidebar',  ar: 'شريط زمردي عربي'     },
  { value: 'arabicslatesidebar', en: 'Arabic Slate Sidebar', ar: 'شريط كحلي عربي'      },
  { value: 'arabicmodern', en: 'Arabic Modern',   ar: 'عصري عربي'        },
  { value: 'arabiccard',   en: 'Arabic Card',     ar: 'بطاقة عربية'      },
];

const ui = {
  basics:           { en: 'Basics',           ar: 'الأساسيات'        },
  layoutSpacing:    { en: 'Layout & Spacing',  ar: 'التخطيط والمسافات' },
  design:           { en: 'Design',           ar: 'التصميم'           },
  personalDetails:  { en: 'Personal details', ar: 'البيانات الشخصية'  },
  sections:         { en: 'Sections',         ar: 'الأقسام'           },
  other:            { en: 'Other',            ar: 'أخرى'              },
  template:         { en: 'Template',         ar: 'القالب'            },
  fontFamily:       { en: 'Font Family',      ar: 'نوع الخط'          },
  accentColor:      { en: 'Accent Color',     ar: 'اللون الرئيسي'     },
  fontSize:         { en: 'Font Size',        ar: 'حجم الخط'          },
  lineHeight:       { en: 'Line Height',       ar: 'ارتفاع السطر'       },
  pagePadding:      { en: 'Page Margins',      ar: 'هوامش الصفحة'       },
  sectionSpacing:   { en: 'Section Spacing',   ar: 'مسافة بين الأقسام'  },
  headingAlign:     { en: 'Heading Alignment', ar: 'محاذاة العناوين'     },
  headerAlign:      { en: 'Name Alignment',    ar: 'محاذاة الاسم'       },
  alignLeft:        { en: 'Left',              ar: 'يسار'               },
  alignCenter:      { en: 'Center',            ar: 'وسط'                },
  alignRight:       { en: 'Right',             ar: 'يمين'               },
  small:            { en: 'Small',            ar: 'صغير'              },
  medium:           { en: 'Medium',           ar: 'متوسط'             },
  large:            { en: 'Large',            ar: 'كبير'              },
  compact:          { en: 'Compact',          ar: 'مضغوط'             },
  relaxed:          { en: 'Relaxed',          ar: 'مريح'              },
  narrow:           { en: 'Narrow',           ar: 'ضيق'              },
  wide:             { en: 'Wide',             ar: 'واسع'              },
  email:            { en: 'Email',            ar: 'البريد الإلكتروني' },
  phone:            { en: 'Phone',            ar: 'الهاتف'            },
  location:         { en: 'Location',         ar: 'الموقع'            },
  linkedin:         { en: 'LinkedIn',         ar: 'لينكد إن'          },
  portfolio:        { en: 'Portfolio',        ar: 'البورتفوليو'        },
  summary:          { en: 'Summary',          ar: 'الملخص المهني'     },
  experience:       { en: 'Experience',       ar: 'الخبرة'            },
  education:        { en: 'Education',        ar: 'التعليم'           },
  skills:           { en: 'Skills',           ar: 'المهارات'          },
  projects:         { en: 'Projects',         ar: 'المشاريع'          },
  languages:        { en: 'Languages',        ar: 'اللغات'            },
  pageSize:         { en: 'Page Size',        ar: 'حجم الصفحة'        },
  dateFormat:       { en: 'Date Format',      ar: 'تنسيق التاريخ'     },
};
const t = (key, isRTL) => ui[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${checked ? 'bg-indigo-600' : 'bg-slate-200'}`}
  >
    <span
      className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transform transition-transform duration-200 ${checked ? 'translate-x-4.5' : 'translate-x-0.5'}`}
      style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
    />
  </button>
);

const AccordionSection = ({ titleKey, isRTL, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-slate-800 font-semibold text-sm hover:bg-slate-50 transition-colors"
        style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
      >
        <span>{t(titleKey, isRTL)}</span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 space-y-4 bg-slate-50/40">
          {children}
        </div>
      )}
    </div>
  );
};

const SegmentedControl = ({ options, value, onChange, isRTL }) => (
  <div className="flex gap-1.5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
    {options.map(opt => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`flex-1 py-2 px-1 rounded-lg text-xs font-medium border transition-all text-center leading-tight ${
          value === opt.value
            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
        }`}
      >
        {t(opt.labelKey, isRTL)}
      </button>
    ))}
  </div>
);

const SectionToggleRow = ({ labelKey, checked, onChange, isRTL }) => (
  <div
    className="flex items-center justify-between py-1"
    style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
  >
    <span className="text-sm text-slate-700">{t(labelKey, isRTL)}</span>
    <Toggle checked={checked} onChange={onChange} />
  </div>
);

const labelClass = 'block text-xs font-medium text-slate-500 mb-2';

const SECTION_LABELS = {
  summary:    { en: 'Summary',    ar: 'الملخص المهني'  },
  experience: { en: 'Experience', ar: 'الخبرة'         },
  education:  { en: 'Education',  ar: 'التعليم'        },
  skills:     { en: 'Skills',     ar: 'المهارات'       },
  projects:   { en: 'Projects',   ar: 'المشاريع'       },
  languages:  { en: 'Languages',  ar: 'اللغات'         },
};

const DraggableSectionList = ({ sectionOrder, visibleSections, toggleSection, reorderSections, isRTL }) => {
  const dragIndex = useRef(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const handleDragStart = (e, index) => {
    dragIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (dragIndex.current !== null && dragIndex.current !== index) {
      reorderSections(dragIndex.current, index);
    }
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  return (
    <div className="space-y-1.5">
      {sectionOrder.map((key, index) => {
        const label = SECTION_LABELS[key]?.[isRTL ? 'ar' : 'en'] ?? key;
        const isDragOver = dragOverIndex === index;
        return (
          <div
            key={key}
            draggable
            onDragStart={e => handleDragStart(e, index)}
            onDragOver={e => handleDragOver(e, index)}
            onDrop={e => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-white border transition-all cursor-grab active:cursor-grabbing select-none ${
              isDragOver
                ? 'border-indigo-400 shadow-md bg-indigo-50 scale-[1.01]'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
            }`}
            style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}
          >
            {/* Drag handle */}
            <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
            </svg>

            {/* Index badge */}
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {index + 1}
            </span>

            {/* Label */}
            <span className="flex-1 text-sm font-medium text-slate-700">{label}</span>

            {/* Toggle */}
            <button
              onClick={() => toggleSection(key)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
                visibleSections[key] ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200"
                style={{ transform: visibleSections[key] ? 'translateX(18px)' : 'translateX(2px)' }}
              />
            </button>
          </div>
        );
      })}
      <p className="text-xs text-slate-400 text-center pt-1">
        {isRTL ? '← اسحب للترتيب' : 'Drag to reorder'}
      </p>
    </div>
  );
};

const LockIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UpgradeModal = ({ isRTL, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    onClick={onClose}
  >
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4"
      dir={isRTL ? 'rtl' : 'ltr'}
      onClick={e => e.stopPropagation()}
    >
      <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          {isRTL ? 'هذا القالب للمستخدمين المدفوعين' : 'Pro Template'}
        </h3>
        <p className="text-sm text-slate-500">
          {isRTL
            ? 'قم بترقية خطتك للوصول إلى جميع القوالب الاحترافية'
            : 'Upgrade your plan to unlock all professional templates'}
        </p>
      </div>
      <a
        href="/pricing"
        className="w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold text-center hover:bg-indigo-700 transition-colors"
      >
        {isRTL ? '⚡ ترقية الآن' : '⚡ Upgrade Now'}
      </a>
      <button
        onClick={onClose}
        className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
      >
        {isRTL ? 'ليس الآن' : 'Maybe later'}
      </button>
    </div>
  </div>
);

const CustomizePanel = () => {
  const {
    theme, setTheme,
    selectedTemplate, setSelectedTemplate,
    sectionOrder, reorderSections,
    visibleSections, toggleSection,
    visiblePersonalFields, togglePersonalField,
  } = useCV();
  const { isRTL, currentUser } = useAuth();
  const { freeTemplates } = useTemplateConfig();
  const isFreeUser = !currentUser || currentUser.plan === 'free';
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  return (
    <div className="flex flex-col pb-20" dir={isRTL ? 'rtl' : 'ltr'}>

      {showUpgradeModal && (
        <UpgradeModal isRTL={isRTL} onClose={() => setShowUpgradeModal(false)} />
      )}

      {/* ── Basics ── */}
      <AccordionSection titleKey="basics" isRTL={isRTL} defaultOpen>

        {/* Template */}
        <div>
          <label className={labelClass}>{t('template', isRTL)}</label>
          {isFreeUser && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-2 flex items-center gap-1.5">
              <LockIcon />
              {isRTL ? 'القالب المجاني: Minimal فقط — القوالب الأخرى تتطلب ترقية' : 'Free template: Minimal only — others require upgrade'}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map(tpl => {
              const isLocked = isFreeUser && !freeTemplates.has(tpl.value);
              const isActive = selectedTemplate === tpl.value;
              return (
                <button
                  key={tpl.value}
                  onClick={() => {
                    if (isLocked) {
                      setShowUpgradeModal(true);
                    } else {
                      setSelectedTemplate(tpl.value);
                    }
                  }}
                  className={`relative py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : isLocked
                        ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-pointer hover:border-amber-300 hover:bg-amber-50/50'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1">
                    {isLocked && <LockIcon />}
                    {isRTL ? tpl.ar : tpl.en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Family */}
        <div>
          <label className={labelClass}>{t('fontFamily', isRTL)}</label>
          <div className="grid grid-cols-1 gap-1.5">
            {(isRTL ? FONTS_AR : FONTS_EN).map(f => (
              <button
                key={f.value}
                onClick={() => setTheme({ ...theme, fontFamily: f.value })}
                className={`w-full text-right px-3 py-2 rounded-lg text-sm border transition-all ${
                  theme.fontFamily === f.value
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                }`}
                style={{
                  fontFamily: `'${f.value}', sans-serif`,
                  textAlign: isRTL ? 'right' : 'left',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </AccordionSection>

      {/* ── Layout & Spacing ── */}
      <AccordionSection titleKey="layoutSpacing" isRTL={isRTL}>

        <div>
          <label className={labelClass}>{t('pagePadding', isRTL)}</label>
          <SegmentedControl
            value={theme.pagePadding}
            onChange={v => setTheme({ ...theme, pagePadding: v })}
            isRTL={isRTL}
            options={[
              { value: 'narrow', labelKey: 'narrow' },
              { value: 'medium', labelKey: 'medium' },
              { value: 'wide',   labelKey: 'wide'   },
            ]}
          />
        </div>

        <div>
          <label className={labelClass}>{t('sectionSpacing', isRTL)}</label>
          <SegmentedControl
            value={theme.sectionSpacing}
            onChange={v => setTheme({ ...theme, sectionSpacing: v })}
            isRTL={isRTL}
            options={[
              { value: 'compact', labelKey: 'compact' },
              { value: 'medium',  labelKey: 'medium'  },
              { value: 'relaxed', labelKey: 'relaxed' },
            ]}
          />
        </div>

        <div>
          <label className={labelClass}>{t('lineHeight', isRTL)}</label>
          <SegmentedControl
            value={theme.lineHeight}
            onChange={v => setTheme({ ...theme, lineHeight: v })}
            isRTL={isRTL}
            options={[
              { value: 'compact', labelKey: 'compact' },
              { value: 'normal',  labelKey: 'medium'  },
              { value: 'relaxed', labelKey: 'relaxed' },
            ]}
          />
        </div>

        <div>
          <label className={labelClass}>{t('headingAlign', isRTL)}</label>
          <div className="flex gap-1.5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            {[
              { value: 'left', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h10M4 14h16M4 18h10" />
                </svg>
              ), label: t('alignLeft', isRTL) },
              { value: 'center', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 10h10M4 14h16M7 18h10" />
                </svg>
              ), label: t('alignCenter', isRTL) },
              { value: 'right', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 10h10M4 14h16M10 18h10" />
                </svg>
              ), label: t('alignRight', isRTL) },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setTheme({ ...theme, headingAlign: opt.value })}
                title={opt.label}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg border text-xs font-medium transition-all ${
                  theme.headingAlign === opt.value
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>{t('headerAlign', isRTL)}</label>
          <div className="flex gap-1.5" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
            {[
              { value: 'left', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h10M4 14h16M4 18h10" />
                </svg>
              ), label: t('alignLeft', isRTL) },
              { value: 'center', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 10h10M4 14h16M7 18h10" />
                </svg>
              ), label: t('alignCenter', isRTL) },
              { value: 'right', icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M10 10h10M4 14h16M10 18h10" />
                </svg>
              ), label: t('alignRight', isRTL) },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setTheme({ ...theme, headerAlign: opt.value })}
                title={opt.label}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 rounded-lg border text-xs font-medium transition-all ${
                  theme.headerAlign === opt.value
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {opt.icon}
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </AccordionSection>

      {/* ── Design ── */}
      <AccordionSection titleKey="design" isRTL={isRTL}>

        {/* Accent Color */}
        <div>
          <label className={labelClass}>{t('accentColor', isRTL)}</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {COLORS.map(c => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => setTheme({ ...theme, primaryColor: c.value })}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
                style={{
                  backgroundColor: c.value,
                  borderColor: theme.primaryColor === c.value ? '#fff' : 'transparent',
                  boxShadow: theme.primaryColor === c.value ? `0 0 0 2.5px ${c.value}` : 'none',
                }}
              />
            ))}
            <label
              className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-slate-400 relative overflow-hidden"
              title="Custom color"
            >
              <span className="text-slate-400 text-xs font-bold select-none">+</span>
              <input
                type="color"
                value={theme.primaryColor}
                onChange={e => setTheme({ ...theme, primaryColor: e.target.value })}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </label>
          </div>
        </div>

        {/* Sidebar Color */}
        <div>
          <label className={labelClass}>{isRTL ? 'لون الشريط الجانبي' : 'Sidebar Color'}</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {[
              { label: 'Default',  value: '' },
              { label: 'Navy',     value: '#1a2744' },
              { label: 'Slate',    value: '#334155' },
              { label: 'Teal',     value: '#0d6e6e' },
              { label: 'Indigo',   value: '#3730a3' },
              { label: 'Brown',    value: '#4a2c17' },
              { label: 'Charcoal', value: '#2d3748' },
              { label: 'Forest',   value: '#1a4731' },
              { label: 'Burgundy', value: '#6b1a1a' },
            ].map(c => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => setTheme({ ...theme, sidebarColor: c.value })}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
                style={{
                  backgroundColor: c.value || '#e2e8f0',
                  borderColor: theme.sidebarColor === c.value ? '#fff' : 'transparent',
                  boxShadow: theme.sidebarColor === c.value ? `0 0 0 2.5px ${c.value || '#94a3b8'}` : 'none',
                }}
              >
                {!c.value && <span className="text-slate-400 text-[8px] font-bold leading-none flex items-center justify-center h-full">✕</span>}
              </button>
            ))}
            <label className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-slate-400 relative overflow-hidden" title="Custom">
              <span className="text-slate-400 text-xs font-bold select-none">+</span>
              <input type="color" value={theme.sidebarColor || '#334155'} onChange={e => setTheme({ ...theme, sidebarColor: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            </label>
          </div>
        </div>

        {/* Background Color */}
        <div>
          <label className={labelClass}>{isRTL ? 'لون الخلفية' : 'Background Color'}</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {[
              { label: 'Default',     value: '' },
              { label: 'White',       value: '#ffffff' },
              { label: 'Cream',       value: '#fdf8f3' },
              { label: 'Light Gray',  value: '#f8f9fa' },
              { label: 'Light Blue',  value: '#f0f4ff' },
              { label: 'Light Green', value: '#f0fff4' },
              { label: 'Warm',        value: '#fff9f0' },
              { label: 'Rose',        value: '#fff5f5' },
              { label: 'Lavender',    value: '#f5f3ff' },
            ].map(c => (
              <button
                key={c.value}
                title={c.label}
                onClick={() => setTheme({ ...theme, bgColor: c.value })}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none"
                style={{
                  backgroundColor: c.value || '#e2e8f0',
                  borderColor: theme.bgColor === c.value ? '#4f46e5' : '#d1d5db',
                  boxShadow: theme.bgColor === c.value ? `0 0 0 2.5px #4f46e5` : 'none',
                }}
              >
                {!c.value && <span className="text-slate-400 text-[8px] font-bold leading-none flex items-center justify-center h-full">✕</span>}
              </button>
            ))}
            <label className="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-slate-400 relative overflow-hidden" title="Custom">
              <span className="text-slate-400 text-xs font-bold select-none">+</span>
              <input type="color" value={theme.bgColor || '#ffffff'} onChange={e => setTheme({ ...theme, bgColor: e.target.value })} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
            </label>
          </div>
        </div>

        {/* Font Size */}
        <div>
          <label className={labelClass}>{t('fontSize', isRTL)}</label>
          <SegmentedControl
            value={theme.fontSize}
            onChange={v => setTheme({ ...theme, fontSize: v })}
            isRTL={isRTL}
            options={[
              { value: 'small',  labelKey: 'small'  },
              { value: 'medium', labelKey: 'medium' },
              { value: 'large',  labelKey: 'large'  },
            ]}
          />
          <div className="mt-2.5 p-2.5 bg-white border border-slate-200 rounded-lg" style={{ direction: 'ltr' }}>
            <span style={{
              fontFamily: theme.fontFamily,
              fontSize: theme.fontSize === 'small' ? '10pt' : theme.fontSize === 'large' ? '13pt' : '11pt',
              color: theme.primaryColor,
              fontWeight: '700',
            }}>
              {theme.fontSize === 'small' ? 'Aa — Small (10pt)' : theme.fontSize === 'large' ? 'Aa — Large (13pt)' : 'Aa — Medium (11pt)'}
            </span>
          </div>
        </div>
      </AccordionSection>

      {/* ── Personal details ── */}
      <AccordionSection titleKey="personalDetails" isRTL={isRTL}>
        <p className="text-xs text-slate-400 -mt-1 mb-1">
          {isRTL ? 'اختر الحقول التي تظهر في السيرة الذاتية' : 'Choose which fields appear on the CV'}
        </p>
        {Object.keys(visiblePersonalFields).map(key => (
          <SectionToggleRow
            key={key}
            labelKey={key}
            checked={visiblePersonalFields[key]}
            onChange={() => togglePersonalField(key)}
            isRTL={isRTL}
          />
        ))}
      </AccordionSection>

      {/* ── Sections ── */}
      <AccordionSection titleKey="sections" isRTL={isRTL}>
        <p className="text-xs text-slate-400 -mt-1 mb-2">
          {isRTL ? 'اسحب لإعادة الترتيب • مفتاح التبديل لإظهار/إخفاء' : 'Drag to reorder • Toggle to show/hide'}
        </p>
        <DraggableSectionList
          sectionOrder={sectionOrder}
          visibleSections={visibleSections}
          toggleSection={toggleSection}
          reorderSections={reorderSections}
          isRTL={isRTL}
        />
      </AccordionSection>

      {/* ── Other ── */}
      <AccordionSection titleKey="other" isRTL={isRTL}>
        <div>
          <label className={labelClass}>{t('pageSize', isRTL)}</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="a4">A4</option>
            <option value="letter">US Letter</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>{t('dateFormat', isRTL)}</label>
          <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="mmm-yyyy">Jan 2024</option>
            <option value="mm-yyyy">01/2024</option>
            <option value="yyyy">2024</option>
          </select>
        </div>
      </AccordionSection>

    </div>
  );
};

export default CustomizePanel;
