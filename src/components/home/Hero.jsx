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
    <section className="relative min-h-screen flex items-center overflow-hidden pt-6 pb-24"
      style={{ background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 30%, #24243e 60%, #0f0c29 100%)' }}>

      {/* ── Stunning Background ── */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>

        {/* Aurora mesh layers */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(99,102,241,0.35) 0%, transparent 60%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 50% at 80% 70%, rgba(168,85,247,0.30) 0%, transparent 55%)',
        }} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(59,130,246,0.15) 0%, transparent 60%)',
        }} />

        {/* Animated orbs */}
        <div className="orb absolute w-[700px] h-[700px] -top-48 -left-32" style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)',
          animationDelay: '0s',
          opacity: 0.6,
        }} />
        <div className="orb absolute w-[600px] h-[600px] -bottom-32 right-0" style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.45) 0%, transparent 70%)',
          animationDelay: '4s',
          opacity: 0.5,
        }} />
        <div className="orb absolute w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%)',
          animationDelay: '2s',
          opacity: 0.4,
        }} />
        <div className="orb absolute w-[350px] h-[350px] top-1/4 right-1/4" style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.25) 0%, transparent 70%)',
          animationDelay: '6s',
          opacity: 0.4,
        }} />

        {/* Grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }} />

        {/* Dot grid overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />

        {/* Top fade for header readability */}
        <div className="absolute top-0 left-0 right-0 h-24" style={{
          background: 'linear-gradient(to bottom, rgba(15,12,41,0.6) 0%, transparent 100%)',
        }} />

        {/* Glowing horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.4) 30%, rgba(168,85,247,0.6) 50%, rgba(99,102,241,0.4) 70%, transparent 100%)',
          transform: 'translateY(-120px)',
        }} />

        {/* Floating geometric shapes */}
        <div className="absolute top-[15%] left-[8%] w-16 h-16 border border-indigo-500/20 rounded-lg rotate-12 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-[25%] right-[10%] w-10 h-10 border border-purple-500/25 rounded-full animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-[20%] left-[15%] w-8 h-8 border border-blue-500/20 rounded-lg -rotate-6 animate-float" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-[30%] right-[12%] w-14 h-14 border border-pink-500/20 rounded-xl rotate-45 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[60%] left-[5%] w-6 h-6 bg-indigo-500/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-[40%] right-[5%] w-5 h-5 bg-purple-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />

        {/* Noise texture overlay for depth */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Top badge */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 shadow-lg animate-fade-in"
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
            </span>
            <span className="text-sm font-semibold text-indigo-300">
              {isRTL ? 'منشئ السيرة الذاتية الذكي' : 'AI-Powered Resume Builder'}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading font-extrabold mb-6 leading-[1.06] tracking-tight animate-slide-up text-white"
            style={{ fontSize: 'clamp(3rem, 6.5vw, 5rem)', animationDelay: '0.1s' }}
          >
            {isRTL ? (
              <>
                ابنِ سيرتك الذاتية<br />
                <span style={{
                  background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>واحصل على وظيفة أحلامك</span>
              </>
            ) : (
              <>
                Land your dream job<br />
                <span style={{
                  background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>with a stunning CV</span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p
            className="text-xl mb-10 leading-relaxed max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.2s', color: 'rgba(203,213,225,0.9)' }}
          >
            {isRTL
              ? 'أنشئ سيرتك الذاتية الاحترافية في دقائق. قوالب متوافقة مع ATS، تخصيص كامل، وتصدير بصيغة PDF.'
              : 'Create a professional, ATS-optimized resume in minutes. Choose from premium templates, customize every detail, and export to PDF instantly.'}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            {features.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: 'rgba(226,232,240,0.9)',
                  backdropFilter: 'blur(8px)',
                }}>
                <svg className="w-3.5 h-3.5" style={{ color: '#a78bfa' }} viewBox="0 0 20 20" fill="currentColor">
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
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-semibold text-white text-base transition-all duration-300 hover:scale-105 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
                boxShadow: '0 8px 32px rgba(99,102,241,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset',
              }}
            >
              <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="relative z-10">{isRTL ? 'ابدأ مجاناً' : 'Build your resume — free'}</span>
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #4338ca 0%, #6d28d9 50%, #9333ea 100%)' }}
              />
            </Link>
            <Link
              to="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: 'rgba(226,232,240,0.95)',
                backdropFilter: 'blur(12px)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
                e.currentTarget.style.borderColor = 'rgba(167,139,250,0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
              }}
            >
              {isRTL ? 'استعرض القوالب' : 'View templates'}
              <svg className="w-4 h-4" style={{ color: 'rgba(167,139,250,0.8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? 'M11 17l-5-5m0 0l5-5m-5 5h12' : 'M13 7l5 5m0 0l-5 5m5-5H6'} />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div
            className="inline-flex items-center divide-x animate-fade-in rounded-2xl overflow-hidden"
            style={{
              animationDelay: '0.5s',
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              divideColor: 'rgba(255,255,255,0.1)',
            }}
          >
            {stats.map(({ value, label }, i) => (
              <div key={i} className="px-8 py-4 text-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                <div className="text-2xl font-heading font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg, #c7d2fe 0%, #e9d5ff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{value}</div>
                <div className="text-xs font-medium mt-0.5 whitespace-nowrap" style={{ color: 'rgba(148,163,184,0.9)' }}>{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
