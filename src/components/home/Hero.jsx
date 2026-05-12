import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


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


        </div>
      </div>
    </section>
  );
};

export default Hero;
