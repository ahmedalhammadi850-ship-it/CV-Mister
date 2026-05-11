import { Link, useNavigate } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import { useAuth } from '../context/AuthContext';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import { sampleData } from '../utils/sampleData';

const templates = [
  {
    id: 'modern',
    name: 'Modern',         arabicName: 'عصري',
    desc: 'Simple layout with a strong accent color on the name and section headings.',
    arabicDesc: 'تصميم بسيط مع تمييز لوني قوي على الاسم وعناوين الأقسام.',
    color: '#4f46e5',
    component: ModernTemplate,
  },
  {
    id: 'classic',
    name: 'Classic',        arabicName: 'كلاسيكي',
    desc: 'Centered header, elegant dividers, traditional single-column layout.',
    arabicDesc: 'رأسية مركزية، فواصل أنيقة، تصميم تقليدي بعمود واحد.',
    color: '#1e3a5f',
    component: ClassicTemplate,
  },
  {
    id: 'creative',
    name: 'Creative',       arabicName: 'إبداعي',
    desc: 'Left accent bar with colored company names and a modern feel.',
    arabicDesc: 'شريط لوني جانبي مع أسماء شركات ملوّنة وإحساس عصري.',
    color: '#7c3aed',
    component: CreativeTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal',        arabicName: 'بسيط',
    desc: 'Maximum whitespace, light grey dividers, clean typography.',
    arabicDesc: 'مساحة بيضاء واسعة، فواصل رمادية خفيفة، طباعة نظيفة.',
    color: '#374151',
    component: MinimalTemplate,
  },
  {
    id: 'executive',
    name: 'Executive',      arabicName: 'تنفيذي',
    desc: 'Uppercase name, double-line divider, gold section rule lines.',
    arabicDesc: 'اسم بأحرف كبيرة، خط مزدوج فاصل، خطوط ذهبية للأقسام.',
    color: '#0f2942',
    component: ExecutiveTemplate,
  },
];

const PREVIEW_SCALE = 0.28;
const PREVIEW_W = 794;
const PREVIEW_H = 1122;

const TemplateCard = ({ template, isSelected, isRTL, onSelect, onUse }) => {
  const Component = template.component;
  const previewTheme = { primaryColor: template.color };

  return (
    <div
      className={`group rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl ${
        isSelected ? 'border-primary-500 shadow-lg shadow-primary-100' : 'border-slate-200 hover:border-primary-300'
      }`}
      onClick={() => onUse(template.id)}
    >
      {/* Live mini preview */}
      <div className="relative overflow-hidden bg-slate-100" style={{ height: PREVIEW_H * PREVIEW_SCALE }}>
        <div
          style={{
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: isRTL ? 'top right' : 'top left',
            width: PREVIEW_W,
            height: PREVIEW_H,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <Component data={sampleData} theme={previewTheme} isRTL={isRTL} />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="bg-white text-slate-700 font-semibold text-sm px-4 py-2 rounded-full shadow-md">
              {isSelected
                ? (isRTL ? '✓ محدد' : '✓ Selected')
                : (isRTL ? 'استخدام القالب' : 'Use Template')}
            </span>
          </div>
        </div>

        {isSelected && (
          <div
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
            style={{ backgroundColor: '#4f46e5' }}
          >
            ✓
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.color }} />
            <h3 className="font-bold text-slate-800">
              {isRTL ? template.arabicName : template.name}
            </h3>
          </div>
          {isSelected && (
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              {isRTL ? 'نشط' : 'Active'}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">
          {isRTL ? template.arabicDesc : template.desc}
        </p>
      </div>
    </div>
  );
};

const TemplatesPage = () => {
  const { selectedTemplate, setSelectedTemplate } = useCV();
  const { isRTL } = useAuth();
  const navigate = useNavigate();

  const active = templates.find(t => t.id === selectedTemplate);

  const handleUse = (id) => {
    setSelectedTemplate(id);
    navigate('/builder');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-white border-b border-slate-100 py-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <span>✦</span>
            <span>{isRTL ? 'معرض القوالب' : 'Template Gallery'}</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            {isRTL ? 'اختر قالبك المثالي' : 'Choose Your Perfect Template'}
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-base">
            {isRTL
              ? 'كل قالب مصمم باحترافية عالية ومتوافق مع خط Calibri وأنظمة ATS.'
              : 'Every template uses Calibri font and is fully optimized for applicant tracking systems.'}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              isSelected={selectedTemplate === template.id}
              isRTL={isRTL}
              onSelect={setSelectedTemplate}
              onUse={handleUse}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 mb-4 text-sm">
            {isRTL
              ? `تم اختيار قالب "${active?.arabicName || ''}"`
              : `"${active?.name || ''}" template selected`}
          </p>
          <Link to="/builder" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base">
            {isRTL ? '→ ابدأ بناء سيرتك الذاتية' : 'Start Building Your Resume →'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
