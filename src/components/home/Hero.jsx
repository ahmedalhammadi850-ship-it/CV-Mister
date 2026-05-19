import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Hero = () => {
  const { isRTL } = useAuth();
  const { isDark } = useTheme();

  const stats = [
    { value: '50K+', label: isRTL ? 'سيرة ذاتية مُنشأة' : 'Resumes built' },
    { value: '98%',  label: isRTL ? 'نجاح ATS'           : 'ATS pass rate' },
    { value: '4.9★', label: isRTL ? 'تقييم المستخدمين'   : 'User rating'   },
  ];

  const features = isRTL
    ? ['قوالب احترافية', 'متوافق مع ATS', 'تصدير PDF فوري', 'دعم العربية']
    : ['Professional templates', 'ATS-optimized', 'Instant PDF export', 'Arabic & English'];

  const heroBg = isDark
    ? 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.18) 0%, #0f172a 70%)'
    : 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.07) 0%, #ffffff 70%)';

  const pillBg = isDark ? 'rgba(99,102,241,0.15)' : '#f8f7ff';
  const pillBorder = isDark ? 'rgba(99,102,241,0.3)' : 'rgba(99,102,241,0.15)';

  const ctaSecBg = isDark ? '#1e293b' : '#f8f9fa';
  const ctaSecBorder = isDark ? '#334155' : '#e2e8f0';
  const ctaSecColor = isDark ? '#cbd5e1' : '#334155';

  const statsBg = isDark ? '#1e293b' : '#f8f7ff';
  const statsBorder = isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.12)';
  const statsInnerBorder = isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)';
  const statLabelColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-6 pb-24" style={{ background: heroBg }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 10 }}>
        <div className="max-w-4xl mx-auto text-center">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-10"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#6366f1' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#6366f1' }} />
            </span>
            <span className="text-sm font-semibold" style={{ color: isDark ? '#a5b4fc' : '#4f46e5' }}>
              {isRTL ? 'منشئ السيرة الذاتية الذكي' : 'AI-Powered Resume Builder'}
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading font-extrabold mb-6 leading-[1.08] tracking-tight"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', color: isDark ? '#f1f5f9' : '#0f172a' }}
          >
            {isRTL ? (
              <>
                ابنِ سيرتك الذاتية<br />
                <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #c026d3 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  واحصل على وظيفة أحلامك
                </span>
              </>
            ) : (
              <>
                Land your dream job<br />
                <span style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #c026d3 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  with a stunning CV
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-xl mb-10 leading-relaxed max-w-2xl mx-auto" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
            {isRTL
              ? 'أنشئ سيرتك الذاتية الاحترافية في دقائق. قوالب متوافقة مع ATS، تخصيص كامل، وتصدير بصيغة PDF.'
              : 'Create a professional, ATS-optimized resume in minutes. Choose from premium templates, customize every detail, and export to PDF instantly.'}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {features.map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium"
                style={{ background: pillBg, border: `1px solid ${pillBorder}`, color: isDark ? '#818cf8' : '#4f46e5' }}>
                <svg className="w-3.5 h-3.5" style={{ color: '#7c3aed' }} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {f}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
            <Link
              to="/builder?template=minimal"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-semibold text-white text-base transition-all duration-300 hover:scale-105 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)', boxShadow: '0 6px 30px rgba(79,70,229,0.35)' }}
            >
              <svg className="w-4 h-4 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="relative z-10">{isRTL ? 'ابدأ مجاناً' : 'Build your resume — free'}</span>
            </Link>

            <Link
              to="/templates"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-200"
              style={{ background: ctaSecBg, border: `1.5px solid ${ctaSecBorder}`, color: ctaSecColor }}
            >
              {isRTL ? 'استعرض القوالب' : 'View templates'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? 'M11 17l-5-5m0 0l5-5m-5 5h12' : 'M13 7l5 5m0 0l-5 5m5-5H6'} />
              </svg>
            </Link>
          </div>

          {/* Stats */}
          <div
            className="flex w-full sm:w-auto sm:inline-flex items-center rounded-2xl overflow-hidden"
            style={{ background: statsBg, border: `1px solid ${statsBorder}`, boxShadow: '0 4px 24px rgba(79,70,229,0.08)' }}
          >
            {stats.map(({ value, label }, i) => (
              <div key={i} className="flex-1 sm:flex-none px-4 sm:px-8 py-4 sm:py-5 text-center" style={{
                borderRight: i < stats.length - 1 ? `1px solid ${statsInnerBorder}` : 'none',
              }}>
                <div className="text-xl sm:text-2xl font-heading font-extrabold"
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #c026d3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {value}
                </div>
                <div className="text-xs font-medium mt-1 whitespace-nowrap" style={{ color: statLabelColor }}>{label}</div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
