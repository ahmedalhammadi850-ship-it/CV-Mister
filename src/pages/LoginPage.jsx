import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { isRTL } = useAuth();

  return (
    <div className="min-h-screen flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)' }}
      >
        {/* Background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 right-16 w-64 h-64 rounded-full bg-white/10" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-sm">
            CV
          </div>
          <span className="text-white font-bold text-xl">Mister</span>
        </div>

        {/* Center content */}
        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white/90 text-sm font-medium">
              {isRTL ? 'موثوق من 50,000+ محترف' : 'Trusted by 50,000+ professionals'}
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            {isRTL
              ? 'ابنِ سيرتك الذاتية\nالمثالية اليوم'
              : 'Build your perfect\nresume today'}
          </h2>
          <p className="text-white/70 text-lg leading-relaxed">
            {isRTL
              ? 'نماذج احترافية، تحسين ATS، وتصدير PDF فوري.'
              : 'Professional templates, ATS optimization, and instant PDF export.'}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: '50K+', label: isRTL ? 'سيرة مبنية' : 'Resumes built' },
              { value: '98%',  label: isRTL ? 'نسبة ATS'   : 'ATS pass rate' },
              { value: '4.9★', label: isRTL ? 'تقييم'      : 'User rating'   },
            ].map((s) => (
              <div key={s.value} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-white/60 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative bg-white/10 backdrop-blur rounded-2xl p-5">
          <p className="text-white/90 text-sm leading-relaxed italic">
            {isRTL
              ? '"حصلت على وظيفتي الأولى بعد أسبوع من استخدام CV Mister!"'
              : '"Got my dream job within a week of using CV Mister!"'}
          </p>
          <p className="text-white/60 text-xs mt-2">— Sarah K., Software Engineer</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)' }}
            >
              CV
            </div>
            <span className="font-bold text-xl text-slate-900">Mister</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900">
                {isRTL ? 'مرحباً بعودتك 👋' : 'Welcome back 👋'}
              </h1>
              <p className="text-slate-500 text-sm">
                {isRTL
                  ? 'سجّل دخولك للمتابعة'
                  : 'Sign in to continue'}
              </p>
            </div>

            {/* Sign in button */}
            <a
              href="/api/login"
              className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-2xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-200"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
              </svg>
              {isRTL ? 'تسجيل الدخول' : 'Continue'}
            </a>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-slate-400 text-xs">
                {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Sign up link */}
            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-sm transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
            >
              {isRTL ? 'إنشاء حساب جديد' : 'Create a free account'}
            </Link>

            {/* Features */}
            <div className="pt-2 space-y-2.5">
              {[
                isRTL ? '✓ نماذج احترافية متعددة'    : '✓ Multiple professional templates',
                isRTL ? '✓ تحسين ATS تلقائي'          : '✓ Automatic ATS optimization',
                isRTL ? '✓ تصدير PDF فوري مجاناً'     : '✓ Free instant PDF export',
              ].map((f) => (
                <p key={f} className="text-slate-500 text-xs">{f}</p>
              ))}
            </div>
          </div>

          {/* Back home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-slate-400 text-sm hover:text-slate-600 transition-colors">
              ← {isRTL ? 'العودة للرئيسية' : 'Back to home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
