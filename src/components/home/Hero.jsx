import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ResumeCard = () => (
  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100" style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.12)' }}>
    {/* Resume Header */}
    <div className="px-8 py-6" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl border-2 border-white/40">
          AH
        </div>
        <div>
          <div className="h-4 w-32 bg-white/90 rounded-full mb-2"></div>
          <div className="h-2.5 w-24 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </div>
    {/* Resume Body */}
    <div className="px-8 py-5 space-y-4">
      <div>
        <div className="h-2 w-20 bg-primary-200 rounded-full mb-3"></div>
        <div className="space-y-1.5">
          <div className="h-2 w-full bg-slate-100 rounded-full"></div>
          <div className="h-2 w-5/6 bg-slate-100 rounded-full"></div>
          <div className="h-2 w-4/6 bg-slate-100 rounded-full"></div>
        </div>
      </div>
      <div className="h-px bg-slate-100"></div>
      <div>
        <div className="h-2 w-24 bg-primary-200 rounded-full mb-3"></div>
        <div className="flex gap-2 flex-wrap">
          {['React', 'TypeScript', 'Node.js', 'Python'].map(s => (
            <span key={s} className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary-50 text-primary-700 border border-primary-100">
              {s}
            </span>
          ))}
        </div>
      </div>
      <div className="h-px bg-slate-100"></div>
      <div>
        <div className="h-2 w-28 bg-primary-200 rounded-full mb-3"></div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-primary-400 mt-1 flex-shrink-0"></div>
          <div className="space-y-1.5 flex-1">
            <div className="h-2 w-3/4 bg-slate-100 rounded-full"></div>
            <div className="h-2 w-1/2 bg-slate-100 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
    {/* ATS Score Badge */}
    <div className="px-8 pb-5">
      <div className="flex items-center justify-between bg-green-50 rounded-xl px-4 py-3 border border-green-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-green-700">ATS Score</span>
        </div>
        <span className="text-sm font-bold text-green-600">98 / 100</span>
      </div>
    </div>
  </div>
);

const Hero = () => {
  const { isRTL } = useAuth();

  const stats = [
    { value: '50K+', label: isRTL ? 'سيرة ذاتية' : 'Resumes built' },
    { value: '98%', label: isRTL ? 'نجاح ATS' : 'ATS pass rate' },
    { value: '4.9★', label: isRTL ? 'تقييم المستخدمين' : 'User rating' },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-6 pb-20">
      {/* Background */}
      <div className="absolute inset-0 -z-10" style={{ background: 'linear-gradient(145deg, #f8f9ff 0%, #f0eeff 40%, #fdf4ff 100%)' }}>
        <div
          className="orb absolute w-[500px] h-[500px] opacity-40 -top-40 -left-20"
          style={{ background: 'radial-gradient(circle, #c7d2fe, transparent)', animationDelay: '0s' }}
        />
        <div
          className="orb absolute w-[400px] h-[400px] opacity-30 -bottom-20 -right-20"
          style={{ background: 'radial-gradient(circle, #f5d0fe, transparent)', animationDelay: '4s' }}
        />
        <div
          className="orb absolute w-[300px] h-[300px] opacity-20 top-1/2 left-1/3"
          style={{ background: 'radial-gradient(circle, #a5b4fc, transparent)', animationDelay: '2s' }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">

          {/* Left — Text */}
          <div className="flex-1 text-center lg:text-start max-w-xl mx-auto lg:mx-0">
            <div className="section-tag mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary-500 inline-block"></span>
              {isRTL ? 'منشئ السيرة الذاتية الذكي' : 'AI-Powered Resume Builder'}
            </div>

            <h1
              className="font-heading font-extrabold text-slate-900 mb-6 leading-[1.1] animate-slide-up"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', animationDelay: '0.1s' }}
            >
              {isRTL ? (
                <>ابنِ سيرتك الذاتية<br /><span className="heading-gradient">واحصل على وظيفة أحلامك</span></>
              ) : (
                <>Land your dream job<br /><span className="heading-gradient">with a stunning CV</span></>
              )}
            </h1>

            <p
              className="text-lg text-slate-500 mb-8 leading-relaxed animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              {isRTL
                ? 'أنشئ سيرتك الذاتية الاحترافية في دقائق. قوالب متوافقة مع ATS، تخصيص كامل، وتصدير بصيغة PDF.'
                : 'Create a professional, ATS-optimized resume in minutes. Choose from premium templates, customize every detail, and export to PDF instantly.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/builder" className="btn-primary w-full sm:w-auto text-base px-7 py-3.5">
                {isRTL ? 'ابدأ مجاناً' : 'Build your resume — free'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/templates" className="btn-secondary w-full sm:w-auto text-base px-7 py-3.5">
                {isRTL ? 'استعرض القوالب' : 'View templates'}
              </Link>
            </div>

            {/* Stats */}
            <div
              className="flex items-center justify-center lg:justify-start gap-8 animate-fade-in"
              style={{ animationDelay: '0.5s' }}
            >
              {stats.map(({ value, label }, i) => (
                <div key={i} className="text-center lg:text-start">
                  <div className="stat-number">{value}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Resume Card */}
          <div className="flex-1 w-full max-w-sm mx-auto lg:mx-0 animate-slide-up relative" style={{ animationDelay: '0.4s' }}>
            {/* Floating badges */}
            <div
              className="absolute -top-4 -left-6 z-10 bg-white rounded-2xl shadow-lg px-3 py-2 flex items-center gap-2 animate-float border border-slate-100"
              style={{ animationDelay: '0s' }}
            >
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">ATS Approved</div>
                <div className="text-xs text-slate-400">98% pass rate</div>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -right-4 z-10 bg-white rounded-2xl shadow-lg px-3 py-2.5 flex items-center gap-2 border border-slate-100"
              style={{ animation: 'float 6s ease-in-out 2s infinite' }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">AI Optimized</div>
                <div className="text-xs text-slate-400">Instant results</div>
              </div>
            </div>

            <ResumeCard />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
