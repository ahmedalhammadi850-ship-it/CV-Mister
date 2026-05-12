import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResumeCard = () => (
  <div
    className="bg-white rounded-2xl overflow-hidden relative"
    style={{ boxShadow: '0 40px 100px rgba(79,70,229,0.18), 0 8px 30px rgba(0,0,0,0.08)' }}
  >
    {/* Header */}
    <div className="px-7 pt-6 pb-5" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #a855f7 100%)' }}>
      <div className="flex items-center gap-3.5">
        <div className="w-13 h-13 rounded-xl bg-white/20 flex items-center justify-center text-white font-bold text-lg border border-white/30 backdrop-blur-sm shrink-0" style={{ width: 52, height: 52 }}>
          AH
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-3.5 w-28 bg-white rounded-full mb-2" style={{ opacity: 0.95 }} />
          <div className="h-2.5 w-20 bg-white/50 rounded-full" />
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="h-2 w-16 bg-white/40 rounded-full" />
          <div className="h-2 w-12 bg-white/30 rounded-full" />
        </div>
      </div>
    </div>

    {/* Body */}
    <div className="px-7 py-5 space-y-5">
      {/* Summary */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="h-2 w-2 rounded-full bg-indigo-400" />
          <div className="h-2 w-16 bg-indigo-200 rounded-full" />
        </div>
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-slate-100 rounded-full" />
          <div className="h-2 w-[90%] bg-slate-100 rounded-full" />
          <div className="h-2 w-[70%] bg-slate-100 rounded-full" />
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Experience */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="h-2 w-2 rounded-full bg-violet-400" />
          <div className="h-2 w-20 bg-violet-200 rounded-full" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-28 bg-slate-800/20 rounded-full" />
            <div className="h-2 w-16 bg-slate-100 rounded-full" />
          </div>
          <div className="h-2 w-24 bg-slate-100 rounded-full" />
          <div className="h-2 w-full bg-slate-100 rounded-full" />
          <div className="h-2 w-[80%] bg-slate-100 rounded-full" />
        </div>
      </div>

      <div className="h-px bg-slate-100" />

      {/* Skills */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <div className="h-2 w-2 rounded-full bg-purple-400" />
          <div className="h-2 w-14 bg-purple-200 rounded-full" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {['React', 'TypeScript', 'Node.js', 'Python'].map(s => (
            <span key={s} className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* ATS Score */}
    <div className="mx-7 mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl px-4 py-3 border border-emerald-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
        </span>
        <span className="text-xs font-semibold text-emerald-700">ATS Score</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-20 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" style={{ width: '98%' }} />
        </div>
        <span className="text-sm font-bold text-emerald-600">98/100</span>
      </div>
    </div>
  </div>
);

const Hero = () => {
  const { isRTL } = useAuth();

  const stats = [
    { value: '50K+', label: isRTL ? 'سيرة ذاتية' : 'Resumes built' },
    { value: '98%',  label: isRTL ? 'نجاح ATS'    : 'ATS pass rate' },
    { value: '4.9★', label: isRTL ? 'تقييم المستخدمين' : 'User rating' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-6 pb-24">

      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(160deg, #fafbff 0%, #f0eeff 45%, #fdf4ff 100%)' }}>
        {/* Orbs */}
        <div className="orb absolute w-[650px] h-[650px] opacity-35 -top-48 -left-32"
          style={{ background: 'radial-gradient(circle, #c7d2fe 0%, transparent 70%)', animationDelay: '0s' }} />
        <div className="orb absolute w-[500px] h-[500px] opacity-25 -bottom-24 right-0"
          style={{ background: 'radial-gradient(circle, #f5d0fe 0%, transparent 70%)', animationDelay: '4s' }} />
        <div className="orb absolute w-[350px] h-[350px] opacity-20 top-1/2 left-1/3"
          style={{ background: 'radial-gradient(circle, #a5b4fc 0%, transparent 70%)', animationDelay: '2s' }} />
        {/* Subtle dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #6366f130 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.6,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex flex-col lg:flex-row items-center gap-14 lg:gap-10 ${isRTL ? 'lg:flex-row-reverse' : ''}`}>

          {/* ── Left / Text ── */}
          <div className={`flex-1 max-w-2xl mx-auto lg:mx-0 ${isRTL ? 'text-center lg:text-right' : 'text-center lg:text-left'}`}>

            {/* Top badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-full px-4 py-2 mb-7 shadow-sm animate-fade-in">
              <span className="flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              <span className="text-sm font-semibold text-indigo-700">
                {isRTL ? 'منشئ السيرة الذاتية الذكي' : 'AI-Powered Resume Builder'}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="font-heading font-extrabold text-slate-900 mb-5 leading-[1.08] tracking-tight animate-slide-up"
              style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.2rem)', animationDelay: '0.1s' }}
            >
              {isRTL ? (
                <>
                  ابنِ سيرتك الذاتية<br />
                  <span className="heading-gradient">واحصل على وظيفة أحلامك</span>
                </>
              ) : (
                <>
                  Land your dream job<br />
                  <span className="heading-gradient">with a stunning CV</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg text-slate-500 mb-9 leading-relaxed max-w-lg animate-slide-up"
              style={{ animationDelay: '0.2s', marginLeft: isRTL ? 'auto' : undefined, marginRight: isRTL ? 'auto' : undefined }}
            >
              {isRTL
                ? 'أنشئ سيرتك الذاتية الاحترافية في دقائق. قوالب متوافقة مع ATS، تخصيص كامل، وتصدير بصيغة PDF.'
                : 'Create a professional, ATS-optimized resume in minutes. Choose from premium templates, customize every detail, and export to PDF instantly.'}
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-col sm:flex-row items-center gap-3 mb-12 animate-slide-up ${isRTL ? 'justify-center lg:justify-end' : 'justify-center lg:justify-start'}`}
              style={{ animationDelay: '0.3s' }}
            >
              <Link
                to="/builder"
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', boxShadow: '0 8px 30px rgba(79,70,229,0.35)' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {isRTL ? 'ابدأ مجاناً' : 'Build your resume — free'}
                <span
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)' }}
                />
              </Link>
              <Link
                to="/templates"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-slate-700 text-base bg-white border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/40 transition-all duration-200 shadow-sm"
              >
                {isRTL ? 'استعرض القوالب' : 'View templates'}
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? 'M11 17l-5-5m0 0l5-5m-5 5h12' : 'M13 7l5 5m0 0l-5 5m5-5H6'} />
                </svg>
              </Link>
            </div>

            {/* Stats */}
            <div
              className={`flex items-center gap-0 animate-fade-in ${isRTL ? 'justify-center lg:justify-end' : 'justify-center lg:justify-start'}`}
              style={{ animationDelay: '0.5s' }}
            >
              {stats.map(({ value, label }, i) => (
                <div key={i} className={`${isRTL ? 'text-center lg:text-right' : 'text-center lg:text-left'} ${i > 0 ? 'border-l border-slate-200 pl-8 ml-8' : ''}`}>
                  <div className="text-2xl font-heading font-extrabold text-slate-900">{value}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right / Resume Card ── */}
          <div className="flex-1 w-full max-w-[360px] mx-auto lg:mx-0 animate-slide-up relative" style={{ animationDelay: '0.4s' }}>

            {/* ATS badge */}
            <div
              className="absolute -top-5 -left-5 z-20 bg-white rounded-2xl shadow-xl px-3.5 py-2.5 flex items-center gap-2.5 border border-slate-100 animate-float"
              style={{ animationDelay: '0s' }}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <svg className="w-4.5 h-4.5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor" style={{ width: 18, height: 18 }}>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 leading-none mb-0.5">ATS Approved</div>
                <div className="text-[10px] text-slate-400 font-medium">98% pass rate</div>
              </div>
            </div>

            {/* AI badge */}
            <div
              className="absolute -bottom-5 -right-5 z-20 bg-white rounded-2xl shadow-xl px-3.5 py-2.5 flex items-center gap-2.5 border border-slate-100"
              style={{ animation: 'float 6s ease-in-out 2s infinite' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 leading-none mb-0.5">AI Optimized</div>
                <div className="text-[10px] text-slate-400 font-medium">Instant results</div>
              </div>
            </div>

            {/* Glow behind card */}
            <div
              className="absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-30 scale-95"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #a855f7, #c026d3)' }}
            />

            <ResumeCard />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
