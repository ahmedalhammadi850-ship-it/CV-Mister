import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Hero = () => {
  const { isRTL } = useAuth();

  const stats = [
    { value: '50K+', label: isRTL ? 'سيرة ذاتية مُنشأة' : 'Resumes built' },
    { value: '98%',  label: isRTL ? 'نجاح ATS'           : 'ATS pass rate' },
    { value: '4.9★', label: isRTL ? 'تقييم المستخدمين'   : 'User rating'   },
  ];

  const features = isRTL
    ? ['قوالب احترافية', 'متوافق مع ATS', 'تصدير PDF فوري', 'دعم العربية']
    : ['Professional templates', 'ATS-optimized', 'Instant PDF export', 'Arabic & English'];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-6 pb-24">

      {/* ── Background ── */}
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(160deg, #fafbff 0%, #f0eeff 50%, #fdf4ff 100%)' }}>
        <div className="orb absolute w-[700px] h-[700px] opacity-40 -top-48 -left-32"
          style={{ background: 'radial-gradient(circle, #c7d2fe 0%, transparent 70%)', animationDelay: '0s' }} />
        <div className="orb absolute w-[600px] h-[600px] opacity-30 -bottom-32 right-0"
          style={{ background: 'radial-gradient(circle, #f5d0fe 0%, transparent 70%)', animationDelay: '4s' }} />
        <div className="orb absolute w-[400px] h-[400px] opacity-20 top-1/2 left-1/2 -translate-x-1/2"
          style={{ background: 'radial-gradient(circle, #a5b4fc 0%, transparent 70%)', animationDelay: '2s' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #6366f128 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">

          {/* Top badge */}
          <div
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-indigo-100 rounded-full px-4 py-2 mb-8 shadow-sm animate-fade-in"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
            </span>
            <span className="text-sm font-semibold text-indigo-700">
              {isRTL ? 'منشئ السيرة الذاتية الذكي' : 'AI-Powered Resume Builder'}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading font-extrabold text-slate-900 mb-6 leading-[1.06] tracking-tight animate-slide-up"
            style={{ fontSize: 'clamp(3rem, 6.5vw, 5rem)', animationDelay: '0.1s' }}
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
            className="text-xl text-slate-500 mb-10 leading-relaxed max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            {isRTL
              ? 'أنشئ سيرتك الذاتية الاحترافية في دقائق. قوالب متوافقة مع ATS، تخصيص كامل، وتصدير بصيغة PDF.'
              : 'Create a professional, ATS-optimized resume in minutes. Choose from premium templates, customize every detail, and export to PDF instantly.'}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            {features.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 shadow-sm">
                <svg className="w-3.5 h-3.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {f}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link
              to="/builder"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-semibold text-white text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', boxShadow: '0 8px 32px rgba(79,70,229,0.4)' }}
            >
              <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="relative z-10">{isRTL ? 'ابدأ مجاناً' : 'Build your resume — free'}</span>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)' }}
              />
            </Link>
            <Link
              to="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-semibold text-slate-700 text-base bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-200 shadow-sm"
            >
              {isRTL ? 'استعرض القوالب' : 'View templates'}
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? 'M11 17l-5-5m0 0l5-5m-5 5h12' : 'M13 7l5 5m0 0l-5 5m5-5H6'} />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div
            className="inline-flex items-center divide-x divide-slate-200 bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl px-2 py-1 shadow-sm animate-fade-in"
            style={{ animationDelay: '0.5s' }}
          >
            {stats.map(({ value, label }, i) => (
              <div key={i} className="px-8 py-3 text-center">
                <div className="text-2xl font-heading font-extrabold text-slate-900">{value}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5 whitespace-nowrap">{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
