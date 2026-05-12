import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: { en: 'ATS-Friendly Templates', ar: 'قوالب متوافقة مع ATS' },
    description: { en: 'Every template passes Applicant Tracking Systems — no tables, no hidden text, no images that get dropped.', ar: 'كل قالب مصمم للنجاح في أنظمة تتبع المتقدمين. بدون جداول أو صور مخفية.' },
    gradient: 'from-emerald-400 to-teal-500',
    light: 'bg-emerald-50',
    border: 'border-emerald-100',
    glow: 'rgba(52,211,153,0.15)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: { en: 'Live Preview', ar: 'معاينة فورية' },
    description: { en: 'Watch your resume update in real time as you type. What you see is exactly what you get in the PDF.', ar: 'شاهد تحديثات سيرتك الذاتية فوراً أثناء الكتابة. ما تراه هو ما ستحصل عليه.' },
    gradient: 'from-blue-400 to-indigo-500',
    light: 'bg-blue-50',
    border: 'border-blue-100',
    glow: 'rgba(99,102,241,0.15)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: { en: 'AI Writing Assistant', ar: 'مساعد كتابة ذكي' },
    description: { en: 'Stuck on wording? AI suggests powerful action verbs and bullet points tailored to your industry.', ar: 'توقفت عن الكتابة؟ يقترح مساعدنا الذكي أفعالاً قوية ونقاطاً تناسب مجالك.' },
    gradient: 'from-violet-400 to-purple-600',
    light: 'bg-violet-50',
    border: 'border-violet-100',
    glow: 'rgba(139,92,246,0.15)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    title: { en: 'Full RTL Support', ar: 'دعم كامل للعربية' },
    description: { en: 'Native Arabic support with proper RTL layout. Seamlessly switch between English and Arabic resumes.', ar: 'دعم نصي كامل للغة العربية مع تخطيط RTL صحيح. قم بالتبديل بسهولة.' },
    gradient: 'from-amber-400 to-orange-500',
    light: 'bg-amber-50',
    border: 'border-amber-100',
    glow: 'rgba(251,191,36,0.15)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    title: { en: 'Deep Customization', ar: 'تخصيص شامل' },
    description: { en: 'Change fonts, colors, spacing, and layout. Every element is adjustable to reflect your personal brand.', ar: 'غيّر الخطوط والألوان والمسافات. كل عنصر قابل للتعديل ليعكس هويتك.' },
    gradient: 'from-pink-400 to-rose-500',
    light: 'bg-pink-50',
    border: 'border-pink-100',
    glow: 'rgba(244,63,94,0.15)',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: { en: 'Cloud Sync', ar: 'مزامنة سحابية' },
    description: { en: 'Resumes are securely saved in the cloud. Access, edit, and share from any device, anywhere.', ar: 'سيرتك محفوظة في السحابة بأمان. تصفح وعدّل وشارك من أي جهاز.' },
    gradient: 'from-teal-400 to-cyan-500',
    light: 'bg-teal-50',
    border: 'border-teal-100',
    glow: 'rgba(20,184,166,0.15)',
  },
];

const HowItWorks = ({ isRTL }) => {
  const steps = isRTL
    ? [
        { num: '01', title: 'اختر قالبك', desc: 'استعرض مجموعتنا من القوالب الاحترافية المتوافقة مع ATS.', icon: '🎨' },
        { num: '02', title: 'أضف معلوماتك', desc: 'أملأ بياناتك بسهولة بمساعدة المحرر الذكي.', icon: '✏️' },
        { num: '03', title: 'صدّر ووظّف', desc: 'حمّل سيرتك بصيغة PDF عالية الجودة في ثانية.', icon: '🚀' },
      ]
    : [
        { num: '01', title: 'Pick a template', desc: 'Browse our curated library of professional, ATS-optimized templates.', icon: '🎨' },
        { num: '02', title: 'Add your details', desc: 'Fill in your information with the AI-powered editor and smart suggestions.', icon: '✏️' },
        { num: '03', title: 'Export & apply', desc: 'Download your pixel-perfect PDF resume and start applying immediately.', icon: '🚀' },
      ];

  const gradients = [
    'from-indigo-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-fuchsia-500 to-pink-600',
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl p-10 mb-8" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #2d1b69 100%)' }}>
      {/* Background dots */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }} />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />

      <div className="relative">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-3 py-1.5 mb-4">
            {isRTL ? 'كيف يعمل' : 'How it works'}
          </span>
          <h3 className="text-2xl md:text-3xl font-heading font-bold text-white">
            {isRTL ? 'ثلاث خطوات فقط' : 'Three steps to your best resume'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-fuchsia-500/50" />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-lg mb-5 shadow-2xl bg-gradient-to-br ${gradients[i]} text-white relative z-10`}
                style={{ boxShadow: `0 8px 30px ${i === 0 ? 'rgba(99,102,241,0.4)' : i === 1 ? 'rgba(139,92,246,0.4)' : 'rgba(217,70,239,0.4)'}` }}
              >
                <span className="text-2xl">{step.icon}</span>
              </div>
              <div className="text-xs font-bold text-indigo-400 mb-1">{step.num}</div>
              <h4 className="font-heading font-bold text-white mb-2">{step.title}</h4>
              <p className="text-sm text-slate-400 leading-relaxed max-w-[200px]">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const { isRTL } = useAuth();

  return (
    <>
      {/* ── Features Section ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #07041a 0%, #0b0820 50%, #0e0b28 100%)' }}>

        {/* Ambient orbs */}
        <div className="absolute -top-32 left-1/3 w-[600px] h-[600px] rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(219,39,119,0.14) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full pointer-events-none" style={{
          background: 'radial-gradient(circle, rgba(20,184,166,0.1) 0%, transparent 65%)',
          filter: 'blur(35px)',
        }} />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        {/* Top seamless fade from hero */}
        <div className="absolute top-0 left-0 right-0 h-20 pointer-events-none" style={{
          background: 'linear-gradient(180deg, #050310 0%, transparent 100%)',
        }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-3.5 py-1.5 mb-4"
              style={{ color: '#a78bfa', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)' }}>
              {isRTL ? 'المميزات' : 'Features'}
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-tight" style={{ color: '#f1f5f9' }}>
              {isRTL ? 'كل ما تحتاجه للحصول على المقابلة' : 'Everything you need to get the interview'}
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: 'rgba(148,163,184,0.8)' }}>
              {isRTL
                ? 'أدوات متكاملة تجعلك تبرز من بين آلاف المتقدمين وتصل لوظيفة أحلامك.'
                : "We've built every tool you need to craft a resume that gets noticed and lands interviews."}
            </p>
          </div>

          {/* How It Works */}
          <HowItWorks isRTL={isRTL} />

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative p-7 rounded-2xl transition-all duration-300 hover:-translate-y-1.5 overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.borderColor = feature.glow.replace('0.15', '0.55');
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top left, ${feature.glow.replace('0.15', '0.25')} 0%, transparent 65%)` }}
                />
                <div
                  className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  style={{ boxShadow: `0 6px 20px ${feature.glow.replace('0.15', '0.45')}` }}
                >
                  {feature.icon}
                </div>
                <h3 className="relative text-base font-heading font-bold mb-2" style={{ color: '#e2e8f0' }}>
                  {feature.title[isRTL ? 'ar' : 'en']}
                </h3>
                <p className="relative text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.78)' }}>
                  {feature.description[isRTL ? 'ar' : 'en']}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #2d1b69 100%)' }}>
        {/* BG orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 rounded-full px-3.5 py-1.5 mb-6">
              {isRTL ? 'ابدأ الآن' : 'Get started today'}
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-5 leading-tight">
              {isRTL
                ? (<>سيرتك الذاتية الأفضل<br /><span style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>تنتظرك الآن</span></>)
                : (<>Your best resume is<br /><span style={{ background: 'linear-gradient(90deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>one click away</span></>)
              }
            </h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed">
              {isRTL
                ? 'انضم لأكثر من 50 ألف محترف بنوا سيرهم الذاتية معنا وحصلوا على وظائف أحلامهم.'
                : 'Join over 50,000 professionals who built their resumes with us and landed their dream jobs.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/builder"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base transition-all duration-300 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', boxShadow: '0 8px 30px rgba(79,70,229,0.5)' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {isRTL ? 'ابنِ سيرتك مجاناً' : 'Build my resume — free'}
              </Link>
              <Link
                to="/templates"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-slate-200 text-base border border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-200"
              >
                {isRTL ? 'استعرض القوالب' : 'Browse templates'}
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
              {[
                { icon: '🔒', text: isRTL ? 'بيانات آمنة' : 'Secure data' },
                { icon: '⚡', text: isRTL ? 'مجاني دائماً' : 'Always free' },
                { icon: '📄', text: isRTL ? 'PDF بجودة عالية' : 'High-quality PDF' },
              ].map(({ icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-400 text-sm">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Features;
