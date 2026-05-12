import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuthError } from '../utils/authErrors';

const EyeIcon = ({ open }) => open ? (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
) : (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const LoginPage = () => {
  const { signIn, isRTL } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(getAuthError(err.code, isRTL));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[45%] flex-col justify-between p-12 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #312e81 0%, #4f46e5 45%, #7c3aed 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="absolute bottom-10 -left-16 w-80 h-80 rounded-full opacity-10" style={{ background: 'rgba(255,255,255,0.2)' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5 border-2 border-white" />
        </div>

        <Link to="/" className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-bold text-white text-sm border border-white/30">CV</div>
          <span className="font-bold text-2xl tracking-tight">Mister</span>
        </Link>

        <div className="z-10 space-y-6">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold leading-tight">
              {isRTL ? 'ابنِ سيرتك الذاتية بثقة' : 'Build your resume with confidence'}
            </h2>
            <p className="text-indigo-200 text-lg leading-relaxed">
              {isRTL
                ? 'أنشئ سيرة ذاتية احترافية في دقائق باستخدام قوالبنا الأنيقة.'
                : 'Create a professional resume in minutes with our elegant templates.'}
            </p>
          </div>

          <div className="space-y-3">
            {[
              { en: '10+ professional templates',    ar: '+١٠ قوالب احترافية'            },
              { en: 'ATS-optimized for job boards',  ar: 'محسّنة لأنظمة تتبع المتقدمين' },
              { en: 'Download as PDF instantly',     ar: 'تنزيل فوري بصيغة PDF'          },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-indigo-100 text-sm">{isRTL ? item.ar : item.en}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-indigo-300 text-sm z-10">© 2025 CV Mister. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm space-y-8">

          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>CV</div>
            <span className="font-bold text-xl text-slate-900">Mister</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isRTL ? 'مرحباً بعودتك' : 'Welcome back'}
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              {isRTL ? 'أدخل بيانات حسابك للمتابعة' : 'Sign in to your account to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {isRTL ? 'البريد الإلكتروني' : 'Email address'}
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={isRTL ? 'example@email.com' : 'you@example.com'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-slate-700">
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </label>
                <Link to="/forgot-password" className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors">
                  {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
            >
              {loading
                ? (isRTL ? 'جاري تسجيل الدخول...' : 'Signing in...')
                : (isRTL ? 'تسجيل الدخول' : 'Sign in')}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            {isRTL ? 'ليس لديك حساب؟' : "Don't have an account?"}{' '}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              {isRTL ? 'أنشئ حساباً' : 'Sign up free'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
