import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { sendEmailVerification } from 'firebase/auth';

const LoginPage = () => {
  const { signIn, isRTL } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resent, setResent] = useState(false);

  const firebaseErrorMessage = (code) => {
    const map = {
      'auth/invalid-credential':       isRTL ? 'البريد أو كلمة المرور غير صحيحة.' : 'Incorrect email or password.',
      'auth/user-not-found':           isRTL ? 'لا يوجد حساب بهذا البريد.' : 'No account found with this email.',
      'auth/wrong-password':           isRTL ? 'كلمة المرور غير صحيحة.' : 'Incorrect password.',
      'auth/too-many-requests':        isRTL ? 'محاولات كثيرة. حاول لاحقاً.' : 'Too many attempts. Try later.',
      'auth/email-not-verified':       isRTL ? 'يرجى تأكيد بريدك الإلكتروني أولاً.' : 'Please verify your email first.',
    };
    return map[code] || (isRTL ? 'حدث خطأ. حاول مجدداً.' : 'Something went wrong. Try again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowResend(false);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = firebaseErrorMessage(err.code);
      setError(msg);
      if (err.code === 'auth/email-not-verified') {
        setShowResend(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        setResent(true);
        navigate('/verify-email');
      }
    } catch {
      setError(isRTL ? 'فشل إرسال الإيميل.' : 'Failed to resend email.');
    }
  };

  return (
    <div className="min-h-screen flex" dir={isRTL ? 'rtl' : 'ltr'}>
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10" />
          <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 right-16 w-64 h-64 rounded-full bg-white/10" />
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-sm">CV</div>
          <span className="text-white font-bold text-xl">Mister</span>
        </div>

        <div className="relative space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white/90 text-sm font-medium">
              {isRTL ? 'موثوق من 50,000+ محترف' : 'Trusted by 50,000+ professionals'}
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            {isRTL ? 'ابنِ سيرتك الذاتية المثالية اليوم' : 'Build your perfect resume today'}
          </h2>
          <p className="text-white/70 text-lg">
            {isRTL ? 'نماذج احترافية، تحسين ATS، وتصدير PDF فوري.' : 'Professional templates, ATS optimization, and instant PDF export.'}
          </p>
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

        <div className="relative bg-white/10 backdrop-blur rounded-2xl p-5">
          <p className="text-white/90 text-sm italic">
            {isRTL ? '"حصلت على وظيفتي الأولى بعد أسبوع من استخدام CV Mister!"' : '"Got my dream job within a week of using CV Mister!"'}
          </p>
          <p className="text-white/60 text-xs mt-2">— Sarah K., Software Engineer</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)' }}>CV</div>
            <span className="font-bold text-xl text-slate-900">Mister</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 space-y-5">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-slate-900">{isRTL ? 'مرحباً بعودتك 👋' : 'Welcome back 👋'}</h1>
              <p className="text-slate-500 text-sm">{isRTL ? 'سجّل دخولك للمتابعة' : 'Sign in to your account'}</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm space-y-2">
                <p>{error}</p>
                {showResend && (
                  <button
                    onClick={handleResendVerification}
                    className="text-indigo-600 font-semibold underline text-xs hover:text-indigo-800"
                  >
                    {isRTL ? 'إعادة إرسال إيميل التحقق' : 'Resend verification email'}
                  </button>
                )}
              </div>
            )}

            {resent && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3 text-sm">
                {isRTL ? '✓ تم إرسال إيميل التحقق!' : '✓ Verification email sent!'}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">{isRTL ? 'البريد الإلكتروني' : 'Email address'}</label>
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
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">{isRTL ? 'كلمة المرور' : 'Password'}</label>
                  <Link to="/forgot-password" className="text-xs text-indigo-500 hover:text-indigo-700">
                    {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition"
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-slate-600">
                    {showPassword
                      ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:scale-100"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
              >
                {loading ? (isRTL ? 'جارٍ تسجيل الدخول...' : 'Signing in...') : (isRTL ? 'تسجيل الدخول' : 'Sign in')}
              </button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-slate-400 text-xs">{isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            <Link
              to="/signup"
              className="flex items-center justify-center w-full py-3.5 px-6 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-sm transition-all duration-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
            >
              {isRTL ? 'إنشاء حساب جديد' : 'Create a free account'}
            </Link>
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

export default LoginPage;
