import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TEMPLATES = [
  { name: 'Modern',    color: '#4f46e5' },
  { name: 'Executive', color: '#0f766e' },
  { name: 'Creative',  color: '#c026d3' },
  { name: 'Minimal',   color: '#475569' },
  { name: 'Classic',   color: '#b45309' },
];

const SignupPage = () => {
  const { signUp, isRTL } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(isRTL ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError(isRTL ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signUp(firstName, lastName, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left decorative panel */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/10" />
          <div className="absolute bottom-32 -right-24 w-72 h-72 rounded-full bg-purple-500/10" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}>CV</div>
          <span className="text-white font-bold text-xl">Mister</span>
        </div>

        <div className="relative space-y-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 rounded-full px-4 py-2">
              <span className="text-indigo-300 text-sm font-medium">
                {isRTL ? '🚀 ابدأ مجاناً اليوم' : '🚀 Start free today'}
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              {isRTL ? 'سيرتك الذاتية خطوتك الأولى نحو النجاح' : 'Your resume, your first step to success'}
            </h2>
            <p className="text-slate-400 text-lg">
              {isRTL ? 'انضم لآلاف المحترفين الذين بنوا سيرهم الذاتية معنا.' : 'Join thousands of professionals who built their resumes with us.'}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-slate-400 text-sm font-medium">{isRTL ? 'اختر من بين 5 نماذج احترافية:' : 'Choose from 5 professional templates:'}</p>
            <div className="flex gap-2 flex-wrap">
              {TEMPLATES.map((t) => (
                <div key={t.name} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: t.color }} />
                  <span className="text-white/80 text-xs font-medium">{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {[
              { icon: '📄', text: isRTL ? 'سيرة ذاتية احترافية في دقائق' : 'Professional resume in minutes' },
              { icon: '🎯', text: isRTL ? 'نتيجة ATS عالية تضمن وصولك' : 'High ATS score guarantees your reach' },
              { icon: '📥', text: isRTL ? 'تنزيل PDF مجاني وفوري' : 'Free instant PDF download' },
              { icon: '🔒', text: isRTL ? 'بياناتك آمنة ومحمية دائماً' : 'Your data is always safe & secure' },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-slate-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 text-xl">✓</div>
          <div>
            <p className="text-white text-sm font-semibold">{isRTL ? 'مجاني بالكامل للبدء' : 'Completely free to start'}</p>
            <p className="text-slate-400 text-xs">{isRTL ? 'لا يلزم بطاقة ائتمان' : 'No credit card required'}</p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)' }}>CV</div>
            <span className="font-bold text-xl text-slate-900">Mister</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 space-y-5">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900">{isRTL ? 'ابدأ مجاناً 🎉' : 'Get started free 🎉'}</h1>
              <p className="text-slate-500 text-sm">{isRTL ? 'أنشئ حسابك في ثوانٍ' : 'Create your account in seconds'}</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    {isRTL ? 'الاسم الأول *' : 'First name *'}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    placeholder={isRTL ? 'أحمد' : 'John'}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    {isRTL ? 'اسم العائلة' : 'Last name'}
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder={isRTL ? 'محمد' : 'Doe'}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  {isRTL ? 'البريد الإلكتروني' : 'Email address'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder={isRTL ? 'example@email.com' : 'you@example.com'}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                <p className="text-slate-400 text-xs">{isRTL ? '٦ أحرف على الأقل' : 'At least 6 characters'}</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  {isRTL ? 'تأكيد كلمة المرور' : 'Confirm password'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-200 disabled:opacity-60 disabled:scale-100"
                style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #c026d3 100%)' }}
              >
                {loading
                  ? (isRTL ? 'جارٍ إنشاء الحساب...' : 'Creating account...')
                  : (isRTL ? 'إنشاء الحساب' : 'Create Account')}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-slate-400 text-xs">{isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <Link
              to="/login"
              className="flex items-center justify-center w-full py-3.5 px-6 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-sm transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
            >
              {isRTL ? 'تسجيل الدخول' : 'Sign in instead'}
            </Link>

            <p className="text-slate-400 text-xs text-center leading-relaxed">
              {isRTL
                ? 'بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية.'
                : 'By signing up, you agree to our Terms of Service and Privacy Policy.'}
            </p>
          </div>

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
