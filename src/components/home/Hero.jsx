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
      style={{ background: '#050310' }}>

      {/* ── Stunning Background ── */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>

        {/* Deep base gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(160deg, #0d0221 0%, #0a0118 25%, #060014 50%, #0a0220 75%, #0d0221 100%)',
        }} />

        {/* Aurora layer 1 — electric violet */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 110% 70% at 15% 20%, rgba(124,58,237,0.55) 0%, transparent 55%)',
        }} />

        {/* Aurora layer 2 — cobalt blue */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 90% 60% at 85% 15%, rgba(37,99,235,0.45) 0%, transparent 50%)',
        }} />

        {/* Aurora layer 3 — hot pink center */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 55% at 50% 60%, rgba(219,39,119,0.3) 0%, transparent 55%)',
        }} />

        {/* Aurora layer 4 — teal accent bottom right */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 70% 50% at 90% 85%, rgba(20,184,166,0.25) 0%, transparent 50%)',
        }} />

        {/* Aurora layer 5 — cyan shimmer top right */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 40% at 80% 30%, rgba(6,182,212,0.2) 0%, transparent 50%)',
        }} />

        {/* Animated pulsing orbs */}
        <div className="orb absolute w-[800px] h-[800px] -top-60 -left-40" style={{
          background: 'radial-gradient(circle, rgba(109,40,217,0.6) 0%, rgba(124,58,237,0.3) 35%, transparent 70%)',
          animationDelay: '0s',
          opacity: 0.7,
        }} />
        <div className="orb absolute w-[700px] h-[700px] -bottom-40 -right-20" style={{
          background: 'radial-gradient(circle, rgba(219,39,119,0.5) 0%, rgba(168,85,247,0.3) 35%, transparent 70%)',
          animationDelay: '5s',
          opacity: 0.6,
        }} />
        <div className="orb absolute w-[500px] h-[500px] top-1/3 left-1/2 -translate-x-1/2" style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.4) 0%, rgba(99,102,241,0.2) 40%, transparent 70%)',
          animationDelay: '2.5s',
          opacity: 0.5,
        }} />
        <div className="orb absolute w-[400px] h-[400px] bottom-1/4 left-1/4" style={{
          background: 'radial-gradient(circle, rgba(20,184,166,0.35) 0%, transparent 70%)',
          animationDelay: '7s',
          opacity: 0.45,
        }} />

        {/* Glowing mesh grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }} />

        {/* Fine dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />

        {/* Radial spotlight center */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(109,40,217,0.12) 0%, transparent 70%)',
        }} />

        {/* Top header fade */}
        <div className="absolute top-0 left-0 right-0 h-28" style={{
          background: 'linear-gradient(to bottom, rgba(5,3,16,0.75) 0%, transparent 100%)',
        }} />

        {/* Glowing arc line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px]" style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.5) 20%, rgba(219,39,119,0.8) 50%, rgba(124,58,237,0.5) 80%, transparent 100%)',
          transform: 'translateY(-150px)',
          filter: 'blur(1px)',
        }} />
        <div className="absolute top-1/2 left-0 right-0 h-px" style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 20%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.15) 80%, transparent 100%)',
          transform: 'translateY(-150px)',
        }} />

        {/* Floating geometric shapes */}
        <div className="absolute top-[14%] left-[7%] w-20 h-20 rounded-2xl rotate-12 animate-float"
          style={{ border: '1px solid rgba(139,92,246,0.35)', animationDelay: '0s', boxShadow: '0 0 20px rgba(139,92,246,0.15) inset' }} />
        <div className="absolute top-[22%] right-[9%] w-12 h-12 rounded-full animate-float"
          style={{ border: '1px solid rgba(219,39,119,0.4)', animationDelay: '1.5s', boxShadow: '0 0 15px rgba(219,39,119,0.15) inset' }} />
        <div className="absolute bottom-[18%] left-[13%] w-10 h-10 rounded-xl -rotate-6 animate-float"
          style={{ border: '1px solid rgba(37,99,235,0.3)', animationDelay: '3s', boxShadow: '0 0 12px rgba(37,99,235,0.12) inset' }} />
        <div className="absolute bottom-[28%] right-[11%] w-16 h-16 rounded-2xl rotate-45 animate-float"
          style={{ border: '1px solid rgba(20,184,166,0.3)', animationDelay: '2s', boxShadow: '0 0 18px rgba(20,184,166,0.1) inset' }} />
        <div className="absolute top-[58%] left-[4%] w-7 h-7 rounded-full animate-float"
          style={{ background: 'rgba(124,58,237,0.3)', animationDelay: '4s', boxShadow: '0 0 14px rgba(124,58,237,0.5)' }} />
        <div className="absolute top-[38%] right-[4%] w-5 h-5 rounded-full animate-float"
          style={{ background: 'rgba(219,39,119,0.35)', animationDelay: '1s', boxShadow: '0 0 12px rgba(219,39,119,0.5)' }} />
        <div className="absolute top-[70%] right-[20%] w-8 h-8 rounded-lg rotate-12 animate-float"
          style={{ border: '1px solid rgba(6,182,212,0.3)', animationDelay: '3.5s', boxShadow: '0 0 14px rgba(6,182,212,0.12) inset' }} />
        <div className="absolute top-[10%] left-[40%] w-4 h-4 rounded-full animate-float"
          style={{ background: 'rgba(6,182,212,0.4)', animationDelay: '5s', boxShadow: '0 0 10px rgba(6,182,212,0.6)' }} />

        {/* Bottom vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-40" style={{
          background: 'linear-gradient(to top, rgba(5,3,16,0.6) 0%, transparent 100%)',
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
