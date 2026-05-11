import { useAuth } from '../../context/AuthContext';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: { en: 'ATS-Friendly Templates', ar: 'قوالب متوافقة مع ATS' },
    description: { en: 'Every template is engineered to pass Applicant Tracking Systems — no tables, no images, no hidden text.', ar: 'كل قالب مصمم للنجاح في أنظمة تتبع المتقدمين. بدون جداول أو صور مخفية.' },
    color: 'from-green-400 to-emerald-500',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: { en: 'Live Preview', ar: 'معاينة فورية' },
    description: { en: 'Watch your resume update in real time as you type. What you see is exactly what you get in the final PDF.', ar: 'شاهد تحديثات سيرتك الذاتية فوراً أثناء الكتابة. ما تراه هو ما ستحصل عليه.' },
    color: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: { en: 'AI Writing Assistant', ar: 'مساعد كتابة ذكي' },
    description: { en: "Stuck on wording? Our AI suggests powerful action verbs and bullet points tailored to your industry.", ar: 'توقفت عن الكتابة؟ يقترح مساعدنا الذكي أفعالاً قوية ونقاطاً تناسب مجالك.' },
    color: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    title: { en: 'Full RTL Support', ar: 'دعم كامل للغة العربية' },
    description: { en: 'Native Arabic support with proper RTL layout. Seamlessly switch between English and Arabic resumes.', ar: 'دعم نصي كامل للغة العربية مع تخطيط RTL صحيح. قم بالتبديل بسهولة.' },
    color: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: { en: 'Deep Customization', ar: 'تخصيص شامل' },
    description: { en: 'Change fonts, colors, spacing, and layout. Every element is adjustable to reflect your personal brand.', ar: 'غيّر الخطوط والألوان والمسافات والتخطيط. كل عنصر قابل للتعديل.' },
    color: 'from-pink-400 to-rose-500',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: { en: 'Cloud Sync', ar: 'مزامنة سحابية' },
    description: { en: 'Your resumes are securely saved in the cloud. Access, edit, and share from any device, anywhere.', ar: 'سيرتك محفوظة في السحابة بأمان. تصفح وعدل وشارك من أي جهاز.' },
    color: 'from-teal-400 to-cyan-500',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
  },
];

const HowItWorks = ({ isRTL }) => {
  const steps = isRTL
    ? [
        { num: '01', title: 'اختر قالبك', desc: 'استعرض مجموعتنا من القوالب الاحترافية المتوافقة مع ATS.' },
        { num: '02', title: 'أضف معلوماتك', desc: 'أملأ بياناتك بسهولة بمساعدة المحرر الذكي.' },
        { num: '03', title: 'صدّر ووظّف', desc: 'حمّل سيرتك بصيغة PDF عالية الجودة في ثانية.' },
      ]
    : [
        { num: '01', title: 'Pick a template', desc: 'Browse our curated library of professional, ATS-optimized templates.' },
        { num: '02', title: 'Add your details', desc: 'Fill in your information with the help of our AI-powered editor and suggestions.' },
        { num: '03', title: 'Export & apply', desc: 'Download your resume as a pixel-perfect PDF and start applying immediately.' },
      ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-10 mb-8" style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }}>
      <div className="text-center mb-10">
        <div className="section-tag mx-auto mb-4">
          {isRTL ? 'كيف يعمل' : 'How it works'}
        </div>
        <h3 className="text-2xl font-heading font-bold text-slate-900">
          {isRTL ? 'ثلاث خطوات فقط' : 'Three steps to your best resume'}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* Connector line */}
        <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-primary-200 via-accent-200 to-primary-200 z-0" />
        {steps.map((step, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center text-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg mb-4 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${i === 0 ? '#4f46e5, #6366f1' : i === 1 ? '#7c3aed, #a855f7' : '#c026d3, #e879f9'})` }}
            >
              {step.num}
            </div>
            <h4 className="font-heading font-bold text-slate-900 mb-2">{step.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Features = () => {
  const { isRTL } = useAuth();

  return (
    <section className="py-24 relative" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="section-tag mx-auto mb-4">
            {isRTL ? 'المميزات' : 'Features'}
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">
            {isRTL ? 'كل ما تحتاجه للحصول على المقابلة' : 'Everything you need to get the interview'}
          </h2>
          <p className="text-lg text-slate-500">
            {isRTL
              ? 'أدوات متكاملة تجعلك تبرز من بين آلاف المتقدمين وتصل لوظيفة أحلامك.'
              : "We've built every tool you need to craft a resume that gets noticed and lands interviews."}
          </p>
        </div>

        {/* How It Works */}
        <HowItWorks isRTL={isRTL} />

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className={`group p-7 rounded-2xl border ${feature.bg} ${feature.border} card-hover`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-5 shadow-sm transition-transform duration-300 group-hover:scale-110`}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-heading font-bold text-slate-900 mb-2">
                {feature.title[isRTL ? 'ar' : 'en']}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {feature.description[isRTL ? 'ar' : 'en']}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
