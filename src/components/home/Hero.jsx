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

  const particles = [
    { size: 3, top: '15%', left: '20%', delay: '0s',   color: 'rgba(167,139,250,0.7)' },
    { size: 2, top: '30%', left: '75%', delay: '2s',   color: 'rgba(99,102,241,0.8)' },
    { size: 4, top: '60%', left: '8%',  delay: '4s',   color: 'rgba(192,132,252,0.6)' },
    { size: 2, top: '70%', left: '85%', delay: '1s',   color: 'rgba(6,182,212,0.7)' },
    { size: 3, top: '45%', left: '50%', delay: '5s',   color: 'rgba(167,139,250,0.5)' },
    { size: 2, top: '20%', left: '60%', delay: '3s',   color: 'rgba(236,72,153,0.5)' },
    { size: 3, top: '80%', left: '40%', delay: '6s',   color: 'rgba(99,102,241,0.6)' },
    { size: 2, top: '10%', left: '90%', delay: '1.5s', color: 'rgba(192,132,252,0.7)' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-6 pb-24"
      style={{ background: '#060611' }}>

      <style>{`
        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -40px) scale(1.05); }
          66%       { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes particleFloat {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.8; }
          50%       { transform: translate(10px, -20px) scale(1.3); opacity: 1; }
        }
      `}</style>

      {/* ── Background ── */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>

        {/* Base gradient */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #060611 0%, #0d0b2a 40%, #0a0620 70%, #03020f 100%)',
        }} />

        {/* Purple orb — top left */}
        <div className="absolute" style={{
          width: '900px', height: '900px',
          top: '-300px', left: '-200px',
          background: 'radial-gradient(circle, rgba(109,40,217,0.35) 0%, rgba(79,46,220,0.15) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'orbFloat 12s ease-in-out infinite',
        }} />

        {/* Indigo orb — bottom right */}
        <div className="absolute" style={{
          width: '800px', height: '800px',
          bottom: '-200px', right: '-150px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(67,56,202,0.12) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'orbFloat 15s ease-in-out infinite reverse',
        }} />

        {/* Pink orb — center right */}
        <div className="absolute" style={{
          width: '500px', height: '500px',
          top: '20%', right: '10%',
          background: 'radial-gradient(circle, rgba(192,38,211,0.2) 0%, rgba(168,85,247,0.08) 45%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(35px)',
          animation: 'orbFloat 10s ease-in-out infinite',
          animationDelay: '3s',
        }} />

        {/* Teal orb — bottom left */}
        <div className="absolute" style={{
          width: '400px', height: '400px',
          bottom: '10%', left: '15%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(14,165,233,0.06) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          animation: 'orbFloat 9s ease-in-out infinite reverse',
          animationDelay: '6s',
        }} />

        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Diagonal stripe */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 80px, rgba(139,92,246,0.03) 80px, rgba(139,92,246,0.03) 81px)',
        }} />

        {/* Glowing beam */}
        <div className="absolute left-0 right-0" style={{
          top: '42%', height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.6) 25%, rgba(167,139,250,0.9) 50%, rgba(139,92,246,0.6) 75%, transparent 100%)',
          filter: 'blur(0.5px)',
        }} />
        <div className="absolute left-0 right-0" style={{
          top: 'calc(42% - 30px)', height: '60px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.04) 25%, rgba(167,139,250,0.08) 50%, rgba(139,92,246,0.04) 75%, transparent 100%)',
        }} />

        {/* Floating particles */}
        {particles.map((p, i) => (
          <div key={i} className="absolute rounded-full" style={{
            width: p.size, height: p.size,
            top: p.top, left: p.left,
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: 'particleFloat 8s ease-in-out infinite',
            animationDelay: p.delay,
          }} />
        ))}

        {/* Floating geometric borders */}
        <div className="absolute rounded-2xl rotate-12 animate-float" style={{
          top: '12%', left: '6%', width: '80px', height: '80px',
          border: '1px solid rgba(139,92,246,0.35)',
          boxShadow: '0 0 20px rgba(139,92,246,0.1) inset',
          animationDelay: '0s',
        }} />
        <div className="absolute rounded-full animate-float" style={{
          top: '20%', right: '8%', width: '50px', height: '50px',
          border: '1px solid rgba(99,102,241,0.35)',
          boxShadow: '0 0 15px rgba(99,102,241,0.1) inset',
          animationDelay: '2s',
        }} />
        <div className="absolute rounded-xl -rotate-6 animate-float" style={{
          bottom: '20%', left: '12%', width: '42px', height: '42px',
          border: '1px solid rgba(6,182,212,0.3)',
          boxShadow: '0 0 12px rgba(6,182,212,0.1) inset',
          animationDelay: '4s',
        }} />
        <div className="absolute rounded-2xl rotate-45 animate-float" style={{
          bottom: '30%', right: '10%', width: '64px', height: '64px',
          border: '1px solid rgba(192,38,211,0.25)',
          boxShadow: '0 0 18px rgba(192,38,211,0.08) inset',
          animationDelay: '1s',
        }} />
        <div className="absolute rounded-full animate-float" style={{
          top: '55%', left: '3%', width: '24px', height: '24px',
          background: 'rgba(139,92,246,0.3)',
          boxShadow: '0 0 16px rgba(139,92,246,0.5)',
          animationDelay: '3s',
        }} />
        <div className="absolute rounded-full animate-float" style={{
          top: '35%', right: '3%', width: '16px', height: '16px',
          background: 'rgba(6,182,212,0.4)',
          boxShadow: '0 0 12px rgba(6,182,212,0.6)',
          animationDelay: '5s',
        }} />
        <div className="absolute rounded-full animate-float" style={{
          top: '10%', left: '40%', width: '12px', height: '12px',
          background: 'rgba(236,72,153,0.4)',
          boxShadow: '0 0 10px rgba(236,72,153,0.6)',
          animationDelay: '2.5s',
        }} />

        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-32" style={{
          background: 'linear-gradient(to bottom, rgba(6,6,17,0.8) 0%, transparent 100%)',
        }} />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40" style={{
          background: 'linear-gradient(to top, rgba(3,2,15,0.7) 0%, transparent 100%)',
        }} />
      </div>

      {/* ── Content ── */}
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
