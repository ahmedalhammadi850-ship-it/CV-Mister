import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TEMPLATES = [
  { name: 'Modern',    color: '#4f46e5' },
  { name: 'Executive', color: '#0f766e' },
  { name: 'Creative',  color: '#c026d3' },
  { name: 'Minimal',   color: '#475569' },
  { name: 'Classic',   color: '#b45309' },
];

const SignupPage = () => {
  const { isRTL } = useAuth();

  return (
    <div className="min-h-screen flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left panel — decorative */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }}
      >
        {/* Background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/10" />
          <div className="absolute bottom-32 -right-24 w-72 h-72 rounded-full bg-purple-500/10" />
        </div>

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}
          >
            CV
          </div>
          <span className="text-white font-bold text-xl">Mister</span>
        </div>

        {/* Center content */}
        <div className="relative space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 rounded-full px-4 py-2">
              <span className="text-indigo-300 text-sm font-medium">
                {isRTL ? '🚀 ابدأ مجاناً اليوم' : '🚀 Start free today'}
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              {isRTL
                ? 'سيرتك الذاتية\nخطوتك الأولى نحو النجاح'
                : 'Your resume,\nyour first step to success'}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              {isRTL
                ? 'انضم لآلاف المحترفين الذين بنوا سيرهم الذاتية معنا.'
                : 'Join thousands of professionals who built their resumes with us.'}
            </p>
          </div>

          {/* Template previews */}
          <div className="space-y-3">
            <p className="text-slate-400 text-sm font-medium">
              {isRTL ? 'اختر من بين 5 نماذج احترافية:' : 'Choose from 5 professional templates:'}
            </p>
            <div className="flex gap-2 flex-wrap">
              {TEMPLATES.map((t) => (
                <div
                  key={t.name}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2"
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                  <span className="text-white/80 text-xs font-medium">{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              { icon: '📄', text: isRTL ? 'سيرة ذاتية احترافية في دقائق' : 'Professional resume in minutes' },
              { icon: '🎯', text: isRTL ? 'نتيجة ATS عالية تضمن وصولك' : 'High ATS score guarantees your reach' },
              { icon: '📥', text: isRTL ? 'تنزيل PDF مجاني وفوري'       : 'Free instant PDF download' },
              { icon: '🔒', text: isRTL ? 'بياناتك آمنة ومحمية دائماً'  : 'Your data is always safe & secure' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-slate-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badge */}
        <div className="relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 text-xl">
            ✓
          </div>
          <div>
            <p className="text-white text-sm font-semibold">
              {isRTL ? 'مجاني بالكامل للبدء' : 'Completely free to start'}
            </p>
            <p className="text-slate-400 text-xs">
              {isRTL ? 'لا يلزم بطاقة ائتمان' : 'No credit card required'}
            </p>
          </div>
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
                {isRTL ? 'ابدأ مجاناً 🎉' : 'Get started free 🎉'}
              </h1>
              <p className="text-slate-500 text-sm">
                {isRTL
                  ? 'أنشئ حسابك في ثوانٍ'
                  : 'Create your account in seconds'}
              </p>
            </div>

            {/* Sign up button */}
            <a
              href="/api/login"
              className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-2xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-200"
              style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)' }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
              {isRTL ? 'إنشاء حساب' : 'Create Account'}
            </a>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-slate-400 text-xs">
                {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Login link */}
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-sm transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
            >
              {isRTL ? 'تسجيل الدخول' : 'Sign in instead'}
            </Link>

            {/* Terms */}
            <p className="text-slate-400 text-xs text-center leading-relaxed">
              {isRTL
                ? 'بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية.'
                : 'By signing up, you agree to our Terms of Service and Privacy Policy.'}
            </p>
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

export default SignupPage;
