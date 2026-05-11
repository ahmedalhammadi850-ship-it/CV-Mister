import { Link } from 'react-router-dom';
import { useCV } from '../context/CVContext';
import ModernTemplate from '../templates/ModernTemplate';
import ClassicTemplate from '../templates/ClassicTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import ExecutiveTemplate from '../templates/ExecutiveTemplate';
import { sampleData } from '../utils/sampleData';

const templates = [
  {
    id: 'modern',
    name: 'Modern',
    arabicName: 'عصري',
    description: 'Two-column layout with a bold colored sidebar.',
    arabicDescription: 'تصميم عمودين مع شريط جانبي ملون وجذاب.',
    color: '#4f46e5',
    component: ModernTemplate,
  },
  {
    id: 'classic',
    name: 'Classic',
    arabicName: 'كلاسيكي',
    description: 'Traditional elegant single-column design.',
    arabicDescription: 'تصميم تقليدي أنيق بعمود واحد.',
    color: '#1e3a5f',
    component: ClassicTemplate,
  },
  {
    id: 'creative',
    name: 'Creative',
    arabicName: 'إبداعي',
    description: 'Vibrant layout with gradient accents and skill bars.',
    arabicDescription: 'تصميم نابض بالحياة مع تدرجات لونية وأشرطة مهارات.',
    color: '#7c3aed',
    component: CreativeTemplate,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    arabicName: 'بسيط',
    description: 'Clean whitespace-driven typography-first design.',
    arabicDescription: 'تصميم نظيف يعتمد على المساحة البيضاء والطباعة.',
    color: '#111827',
    component: MinimalTemplate,
  },
  {
    id: 'executive',
    name: 'Executive',
    arabicName: 'تنفيذي',
    description: 'Prestigious dark header with gold accents for senior roles.',
    arabicDescription: 'رأسية داكنة مع لمسات ذهبية للمناصب القيادية.',
    color: '#0f2942',
    component: ExecutiveTemplate,
  },
];

const PREVIEW_SCALE = 0.28;
const PREVIEW_WIDTH = 794;
const PREVIEW_HEIGHT = 1122;

const TemplateCard = ({ template, isSelected, onSelect }) => {
  const Component = template.component;
  const previewTheme = { primaryColor: template.color, fontFamily: 'Inter, sans-serif' };

  return (
    <div
      className={`group rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl ${
        isSelected
          ? 'border-primary-500 shadow-lg shadow-primary-100'
          : 'border-slate-200 hover:border-primary-300'
      }`}
      onClick={() => onSelect(template.id)}
    >
      {/* Template Preview */}
      <div
        className="relative overflow-hidden bg-slate-100"
        style={{ height: PREVIEW_HEIGHT * PREVIEW_SCALE }}
      >
        <div
          style={{
            transform: `scale(${PREVIEW_SCALE})`,
            transformOrigin: 'top left',
            width: PREVIEW_WIDTH,
            height: PREVIEW_HEIGHT,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <Component data={sampleData} theme={previewTheme} />
        </div>

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {isSelected ? (
              <span className="bg-white text-primary-600 font-semibold text-sm px-4 py-2 rounded-full shadow-md">
                ✓ Selected
              </span>
            ) : (
              <span className="bg-white text-slate-700 font-semibold text-sm px-4 py-2 rounded-full shadow-md">
                Use Template
              </span>
            )}
          </div>
        </div>

        {/* Selected badge */}
        {isSelected && (
          <div
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md"
            style={{ backgroundColor: '#4f46e5' }}
          >
            ✓
          </div>
        )}
      </div>

      {/* Card info */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.color }} />
            <h3 className="font-bold text-slate-800">{template.name}</h3>
          </div>
          {isSelected && (
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">{template.description}</p>
      </div>
    </div>
  );
};

const TemplatesPage = () => {
  const { selectedTemplate, setSelectedTemplate, isRTL } = useCV();

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
              ? 'كل قالب مصمم باحترافية عالية ومحسّن لأنظمة تتبع المتقدمين.'
              : 'Every template is professionally designed and optimized for applicant tracking systems.'}
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
              onSelect={setSelectedTemplate}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 mb-4 text-sm">
            {isRTL
              ? `تم اختيار قالب "${templates.find(t => t.id === selectedTemplate)?.arabicName || ''}"`
              : `"${templates.find(t => t.id === selectedTemplate)?.name || ''}" template selected`}
          </p>
          <Link
            to="/builder"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base"
          >
            {isRTL ? 'ابدأ بناء سيرتك الذاتية ←' : 'Start Building Your Resume →'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TemplatesPage;
