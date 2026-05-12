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

      <style>{`
        .hero-section {
          background: #07071a;
        }
        @keyframes drift {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          25%      { transform: translate(18px, -28px) scale(1.04); }
          50%      { transform: translate(-12px, 14px) scale(0.98); }
          75%      { transform: translate(22px, 8px) scale(1.02); }
        }
        @keyframes driftSlow {
          0%,100% { transform: translate(0px, 0px) scale(1); }
          33%      { transform: translate(-24px, 20px) scale(1.06); }
          66%      { transform: translate(16px, -18px) scale(0.96); }
        }
        @keyframes twinkle {
          0%,100% { opacity: 0.2; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.4); }
        }
        @keyframes floatUp {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-14px); }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .star { animation: twinkle ease-in-out infinite; }
        .float-shape { animation: floatUp ease-in-out infinite; }
      `}</style>

      {/* ═══════════════ BACKGROUND LAYER ═══════════════ */}
      <div className="hero-section absolute inset-0" style={{ zIndex: 0 }}>

        {/* SVG noise filter for texture */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
              <feBlend in="SourceGraphic" mode="overlay" />
            </filter>
          </defs>
        </svg>

        {/* Noise texture overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          opacity: 0.03,
          zIndex: 1,
        }} />

        {/* ── Aurora glow 1: top-left purple ── */}
        <div className="absolute" style={{
          width: '780px', height: '780px',
          top: '-280px', left: '-180px',
          background: 'radial-gradient(ellipse at center, rgba(120,60,255,0.38) 0%, rgba(90,40,200,0.18) 45%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'drift 18s ease-in-out infinite',
          zIndex: 2,
        }} />

        {/* ── Aurora glow 2: bottom-right indigo ── */}
        <div className="absolute" style={{
          width: '720px', height: '720px',
          bottom: '-220px', right: '-160px',
          background: 'radial-gradient(ellipse at center, rgba(80,100,255,0.32) 0%, rgba(60,70,200,0.14) 45%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          animation: 'driftSlow 22s ease-in-out infinite reverse',
          zIndex: 2,
        }} />

        {/* ── Aurora glow 3: center-top violet ── */}
        <div className="absolute" style={{
          width: '600px', height: '400px',
          top: '-60px', left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse at center, rgba(140,80,255,0.22) 0%, rgba(100,60,220,0.08) 55%, transparent 75%)',
          borderRadius: '50%',
          filter: 'blur(50px)',
          animation: 'drift 14s ease-in-out infinite',
          animationDelay: '-7s',
          zIndex: 2,
        }} />

        {/* ── Aurora glow 4: mid-right pink ── */}
        <div className="absolute" style={{
          width: '380px', height: '380px',
          top: '25%', right: '8%',
          background: 'radial-gradient(circle, rgba(200,70,220,0.18) 0%, rgba(180,60,200,0.07) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          animation: 'driftSlow 16s ease-in-out infinite',
          animationDelay: '-4s',
          zIndex: 2,
        }} />

        {/* ── Aurora glow 5: mid-left cyan accent ── */}
        <div className="absolute" style={{
          width: '300px', height: '300px',
          bottom: '20%', left: '10%',
          background: 'radial-gradient(circle, rgba(0,180,220,0.14) 0%, rgba(0,140,200,0.05) 55%, transparent 72%)',
          borderRadius: '50%',
          filter: 'blur(35px)',
          animation: 'drift 12s ease-in-out infinite',
          animationDelay: '-9s',
          zIndex: 2,
        }} />

        {/* ── Pixel grid ── */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(150,120,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(150,120,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          zIndex: 3,
        }} />

        {/* ── Dot grid overlay ── */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          zIndex: 3,
        }} />

        {/* ── Center spotlight ── */}
        <div className="absolute" style={{
          width: '900px', height: '500px',
          top: '0', left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(110,70,255,0.18) 0%, transparent 65%)',
          zIndex: 4,
          pointerEvents: 'none',
        }} />

        {/* ── Glowing line across center ── */}
        <div className="absolute left-0 right-0" style={{
          top: '48%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(120,80,255,0.0) 15%, rgba(140,100,255,0.5) 35%, rgba(180,140,255,0.85) 50%, rgba(140,100,255,0.5) 65%, rgba(120,80,255,0.0) 85%, transparent 100%)',
          zIndex: 5,
        }} />
        <div className="absolute left-0 right-0" style={{
          top: 'calc(48% - 40px)',
          height: '80px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(130,90,255,0.0) 20%, rgba(150,110,255,0.06) 40%, rgba(160,120,255,0.1) 50%, rgba(150,110,255,0.06) 60%, rgba(130,90,255,0.0) 80%, transparent 100%)',
          zIndex: 5,
        }} />

        {/* ── Twinkling stars ── */}
        {[
          { top: '8%',  left: '12%',  size: 2, delay: '0s',   dur: '3s'  },
          { top: '14%', left: '72%',  size: 1.5, delay: '1.2s', dur: '4s'  },
          { top: '22%', left: '35%',  size: 2.5, delay: '0.6s', dur: '2.5s'},
          { top: '31%', left: '88%',  size: 1.5, delay: '2s',   dur: '3.5s'},
          { top: '40%', left: '5%',   size: 2, delay: '0.3s', dur: '4.5s'},
          { top: '52%', left: '55%',  size: 1.5, delay: '1.8s', dur: '3s'  },
          { top: '61%', left: '20%',  size: 2, delay: '0.9s', dur: '2.8s'},
          { top: '68%', left: '80%',  size: 1.5, delay: '2.4s', dur: '3.8s'},
          { top: '75%', left: '45%',  size: 2.5, delay: '0.5s', dur: '4.2s'},
          { top: '82%', left: '62%',  size: 1.5, delay: '1.5s', dur: '3.2s'},
          { top: '18%', left: '50%',  size: 1.5, delay: '3s',   dur: '4s'  },
          { top: '45%', left: '92%',  size: 2, delay: '1.1s', dur: '3.6s'},
        ].map((s, i) => (
          <div key={i} className="star absolute rounded-full" style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            background: 'white',
            boxShadow: `0 0 ${s.size * 3}px rgba(200,180,255,0.9)`,
            animationDuration: s.dur,
            animationDelay: s.delay,
            zIndex: 6,
          }} />
        ))}

        {/* ── Decorative floating shapes ── */}
        {/* Top-left square */}
        <div className="float-shape absolute" style={{
          top: '10%', left: '5%',
          width: '88px', height: '88px',
          borderRadius: '18px',
          border: '1px solid rgba(160,120,255,0.3)',
          background: 'rgba(100,60,255,0.04)',
          backdropFilter: 'blur(6px)',
          boxShadow: '0 0 30px rgba(130,80,255,0.08) inset, 0 0 0 1px rgba(180,150,255,0.06)',
          transform: 'rotate(12deg)',
          animationDuration: '7s',
          animationDelay: '0s',
          zIndex: 6,
        }} />

        {/* Top-right circle */}
        <div className="float-shape absolute" style={{
          top: '16%', right: '6%',
          width: '60px', height: '60px',
          borderRadius: '50%',
          border: '1px solid rgba(140,100,255,0.28)',
          background: 'rgba(80,50,200,0.04)',
          backdropFilter: 'blur(4px)',
          boxShadow: '0 0 20px rgba(120,80,240,0.07) inset',
          animationDuration: '9s',
          animationDelay: '1.5s',
          zIndex: 6,
        }} />

        {/* Bottom-left small square */}
        <div className="float-shape absolute" style={{
          bottom: '22%', left: '9%',
          width: '44px', height: '44px',
          borderRadius: '10px',
          border: '1px solid rgba(0,180,220,0.25)',
          background: 'rgba(0,140,200,0.03)',
          boxShadow: '0 0 16px rgba(0,160,210,0.07) inset',
          transform: 'rotate(-8deg)',
          animationDuration: '8s',
          animationDelay: '3s',
          zIndex: 6,
        }} />

        {/* Bottom-right diamond */}
        <div className="float-shape absolute" style={{
          bottom: '28%', right: '8%',
          width: '70px', height: '70px',
          borderRadius: '14px',
          border: '1px solid rgba(200,80,220,0.2)',
          background: 'rgba(160,60,200,0.03)',
          transform: 'rotate(45deg)',
          animationDuration: '10s',
          animationDelay: '0.8s',
          zIndex: 6,
        }} />

        {/* Left mid dot */}
        <div className="float-shape absolute rounded-full" style={{
          top: '52%', left: '3%',
          width: '22px', height: '22px',
          background: 'radial-gradient(circle, rgba(140,100,255,0.5) 0%, rgba(100,60,220,0.2) 60%, transparent 100%)',
          boxShadow: '0 0 18px rgba(130,80,255,0.5)',
          animationDuration: '6s',
          animationDelay: '2s',
          zIndex: 6,
        }} />

        {/* Right mid cyan dot */}
        <div className="float-shape absolute rounded-full" style={{
          top: '35%', right: '3%',
          width: '14px', height: '14px',
          background: 'radial-gradient(circle, rgba(0,200,240,0.6) 0%, rgba(0,160,200,0.2) 60%, transparent 100%)',
          boxShadow: '0 0 14px rgba(0,190,230,0.6)',
          animationDuration: '7.5s',
          animationDelay: '4s',
          zIndex: 6,
        }} />

        {/* Small top pink dot */}
        <div className="float-shape absolute rounded-full" style={{
          top: '12%', left: '38%',
          width: '10px', height: '10px',
          background: 'radial-gradient(circle, rgba(240,80,180,0.7) 0%, transparent 70%)',
          boxShadow: '0 0 12px rgba(230,70,170,0.6)',
          animationDuration: '5.5s',
          animationDelay: '1s',
          zIndex: 6,
        }} />

        {/* ── Glass card decorative (right side) ── */}
        <div className="absolute" style={{
          top: '30%', right: '-20px',
          width: '140px', height: '90px',
          borderRadius: '16px',
          border: '1px solid rgba(180,150,255,0.15)',
          background: 'linear-gradient(135deg, rgba(100,70,255,0.08) 0%, rgba(80,50,200,0.04) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(80,50,200,0.08)',
          animation: 'floatUp 8s ease-in-out infinite',
          animationDelay: '2s',
          zIndex: 6,
        }} />

        {/* ── Glass card decorative (left side) ── */}
        <div className="absolute" style={{
          top: '55%', left: '-24px',
          width: '110px', height: '70px',
          borderRadius: '14px',
          border: '1px solid rgba(140,110,255,0.12)',
          background: 'linear-gradient(135deg, rgba(80,50,200,0.06) 0%, rgba(60,40,160,0.03) 100%)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 24px rgba(60,40,180,0.07)',
          animation: 'floatUp 9s ease-in-out infinite',
          animationDelay: '5s',
          zIndex: 6,
        }} />

        {/* ── Top vignette ── */}
        <div className="absolute top-0 left-0 right-0" style={{
          height: '200px',
          background: 'linear-gradient(to bottom, rgba(7,7,26,0.95) 0%, rgba(7,7,26,0.4) 60%, transparent 100%)',
          zIndex: 7,
        }} />

        {/* ── Bottom vignette ── */}
        <div className="absolute bottom-0 left-0 right-0" style={{
          height: '160px',
          background: 'linear-gradient(to top, rgba(7,7,26,0.85) 0%, transparent 100%)',
          zIndex: 7,
        }} />

        {/* ── Left edge vignette ── */}
        <div className="absolute top-0 bottom-0 left-0" style={{
          width: '180px',
          background: 'linear-gradient(to right, rgba(7,7,26,0.6) 0%, transparent 100%)',
          zIndex: 7,
        }} />

        {/* ── Right edge vignette ── */}
        <div className="absolute top-0 bottom-0 right-0" style={{
          width: '180px',
          background: 'linear-gradient(to left, rgba(7,7,26,0.6) 0%, transparent 100%)',
          zIndex: 7,
        }} />
      </div>

      {/* ═══════════════ CONTENT ═══════════════ */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-10 animate-fade-in"
            style={{
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(14px)',
              border: '1px solid rgba(180,150,255,0.2)',
              boxShadow: '0 0 24px rgba(130,80,255,0.08)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#a78bfa' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#a78bfa' }} />
            </span>
            <span className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>
              {isRTL ? 'منشئ السيرة الذاتية الذكي' : 'AI-Powered Resume Builder'}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading font-extrabold mb-6 leading-[1.08] tracking-tight animate-slide-up text-white"
            style={{ fontSize: 'clamp(3rem, 7vw, 5.2rem)', animationDelay: '0.1s', textShadow: '0 0 60px rgba(120,80,255,0.25)' }}
          >
            {isRTL ? (
              <>
                ابنِ سيرتك الذاتية<br />
                <span style={{
                  background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 40%, #f472b6 80%, #fb7185 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>واحصل على وظيفة أحلامك</span>
              </>
            ) : (
              <>
                Land your dream job<br />
                <span style={{
                  background: 'linear-gradient(135deg, #a78bfa 0%, #c084fc 40%, #f472b6 80%, #fb7185 100%)',
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
            style={{ animationDelay: '0.2s', color: 'rgba(200,210,230,0.8)' }}
          >
            {isRTL
              ? 'أنشئ سيرتك الذاتية الاحترافية في دقائق. قوالب متوافقة مع ATS، تخصيص كامل، وتصدير بصيغة PDF.'
              : 'Create a professional, ATS-optimized resume in minutes. Choose from premium templates, customize every detail, and export to PDF instantly.'}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            {features.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(180,150,255,0.18)',
                  color: 'rgba(220,215,240,0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 2px 12px rgba(100,70,220,0.06)',
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
                background: 'linear-gradient(135deg, #5b3cf5 0%, #7c3aed 50%, #a855f7 100%)',
                boxShadow: '0 6px 40px rgba(110,60,240,0.55), 0 0 0 1px rgba(255,255,255,0.08) inset',
              }}
            >
              <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="relative z-10">{isRTL ? 'ابدأ مجاناً' : 'Build your resume — free'}</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #4c30d6 0%, #6d28d9 50%, #9333ea 100%)' }} />
            </Link>

            <Link
              to="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(200,180,255,0.18)',
                color: 'rgba(220,215,240,0.95)',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 2px 20px rgba(100,70,220,0.08)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                e.currentTarget.style.borderColor = 'rgba(200,180,255,0.18)';
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
            className="inline-flex items-center animate-fade-in rounded-2xl overflow-hidden"
            style={{
              animationDelay: '0.5s',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(180,150,255,0.12)',
              boxShadow: '0 8px 40px rgba(80,50,200,0.12), 0 0 0 1px rgba(255,255,255,0.04) inset',
            }}
          >
            {stats.map(({ value, label }, i) => (
              <div key={i} className="px-8 py-5 text-center" style={{
                borderRight: i < stats.length - 1 ? '1px solid rgba(180,150,255,0.1)' : 'none',
              }}>
                <div className="text-2xl font-heading font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg, #c7d2fe 0%, #e9d5ff 60%, #fbcfe8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>{value}</div>
                <div className="text-xs font-medium mt-1 whitespace-nowrap" style={{ color: 'rgba(160,150,200,0.9)' }}>{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
