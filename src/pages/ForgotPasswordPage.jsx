import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAuthError } from '../utils/authErrors';

const ForgotPasswordPage = () => {
  const { sendPasswordReset, isRTL } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(getAuthError(err.code, isRTL));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">

        <Link to="/" className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}>CV</div>
          <span className="font-bold text-xl text-slate-900">Mister</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          {sent ? (
            <div className="text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {isRTL ? 'تحقق من بريدك الإلكتروني' : 'Check your email'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  {isRTL
                    ? `أرسلنا رابط إعادة تعيين كلمة المرور إلى ${email}`
                    : `We sent a password reset link to ${email}`}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700 text-start">
                {isRTL
                  ? 'تحقق من مجلد البريد العشوائي إذا لم تجد الرسالة في صندوق الوارد.'
                  : "Didn't receive it? Check your spam folder or wait a few minutes."}
              </div>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => { setSent(false); setEmail(''); }}
                  className="w-full py-2.5 rounded-xl text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  {isRTL ? 'إعادة الإرسال' : 'Resend email'}
                </button>
                <Link
                  to="/login"
                  className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
                >
                  {isRTL ? 'العودة لتسجيل الدخول' : 'Back to sign in'}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-7">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot your password?'}
                </h1>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                  {isRTL
                    ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.'
                    : "No worries! Enter your email and we'll send you a reset link."}
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
                >
                  {loading
                    ? (isRTL ? 'جاري الإرسال...' : 'Sending...')
                    : (isRTL ? 'إرسال رابط الاسترداد' : 'Send reset link')}
                </button>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors font-medium"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {isRTL ? 'العودة لتسجيل الدخول' : 'Back to sign in'}
                </Link>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
