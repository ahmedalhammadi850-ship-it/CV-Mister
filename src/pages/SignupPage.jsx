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

const SignupPage = () => {
  const { signUp, isRTL } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError(isRTL ? 'كلمتا المرور غير متطابقتين.' : 'Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError(isRTL ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.' : 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name);
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
        style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #4f46e5 50%, #c026d3 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.15)' }} />
          <div className="absolute top-16 -left-10 w-60 h-60 rounded-full opacity-10" style={{ background: 'rgba(255,255,255,0.2)' }} />
        </div>

        <Link to="/" className="flex items-center gap-3 z-10">
          <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-bold text-white text-sm border border-white/30">CV</div>
          <span className="font-bold text-2xl tracking-tight">Mister</span>
        </Link>

        <div className="z-10 space-y-8">
          <div className="space-y-3">
            <h2 className="text-4xl font-bold leading-tight">
              {isRTL ? 'انضم إلى آلاف المحترفين' : 'Join thousands of professionals'}
            </h2>
            <p className="text-purple-200 text-lg leading-relaxed">
              {isRTL
                ? 'أنشئ سيرتك الذاتية واحصل على وظيفة أحلامك بسرعة.'
                : 'Create your resume and land your dream job faster.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { num: '50K+', label: isRTL ? 'مستخدم نشط'   : 'Active Users'      },
              { num: '10+',  label: isRTL ? 'قالب احترافي'  : 'Pro Templates'     },
              { num: '95%',  label: isRTL ? 'توافق ATS'     : 'ATS Compatible'    },
              { num: '4.9',  label: isRTL ? 'تقييم المستخدمين' : 'User Rating'    },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/10">
                <p className="text-2xl font-bold">{s.num}</p>
                <p className="text-purple-200 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-purple-300 text-sm z-10">© 2025 CV Mister. {isRTL ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-sm space-y-6 py-8">

          <div className="lg:hidden flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}>CV</div>
            <span className="font-bold text-xl text-slate-900">Mister</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isRTL ? 'إنشاء حساب جديد' : 'Create your account'}
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              {isRTL ? 'مجاني تماماً — لا بطاقة ائتمانية مطلوبة' : 'Free forever — no credit card required'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                {isRTL ? 'الاسم الكامل' : 'Full name'}
              </label>
              <input
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder={isRTL ? 'أحمد محمد' : 'John Smith'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
              />
            </div>

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
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {isRTL ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm pr-12"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {isRTL ? 'تأكيد كلمة المرور' : 'Confirm password'}
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm pr-12"
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  <EyeIcon open={showConfirm} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)' }}
            >
              {loading
                ? (isRTL ? 'جاري إنشاء الحساب...' : 'Creating account...')
                : (isRTL ? 'إنشاء حساب مجاني' : 'Create free account')}
            </button>

            <p className="text-xs text-slate-400 text-center">
              {isRTL
                ? 'بالتسجيل، أنت توافق على شروط الاستخدام وسياسة الخصوصية.'
                : 'By signing up, you agree to our Terms of Service and Privacy Policy.'}
            </p>
          </form>

          <p className="text-center text-sm text-slate-500">
            {isRTL ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
              {isRTL ? 'تسجيل الدخول' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
