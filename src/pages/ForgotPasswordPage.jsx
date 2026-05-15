import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordPage = () => {
  const { sendPasswordReset, isRTL } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordReset(email);
      setSent(true);
    } catch (err) {
      const map = {
        'auth/user-not-found': isRTL ? 'لا يوجد حساب بهذا البريد.' : 'No account found with this email.',
        'auth/invalid-email':  isRTL ? 'البريد الإلكتروني غير صالح.' : 'Invalid email address.',
      };
      setError(map[err.code] || (isRTL ? 'حدث خطأ. حاول مجدداً.' : 'Something went wrong. Try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 space-y-6">
          <div className="text-center space-y-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto"
              style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
            >
              CV
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isRTL ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              {isRTL
                ? 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.'
                : 'Enter your email and we\'ll send you a password reset link.'}
            </p>
          </div>

          {sent ? (
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-slate-900 font-semibold">
                  {isRTL ? 'تم الإرسال!' : 'Email sent!'}
                </p>
                <p className="text-slate-500 text-sm">
                  {isRTL
                    ? `أرسلنا رابط إعادة التعيين إلى ${email}`
                    : `We sent a reset link to ${email}`}
                </p>
                <p className="text-slate-400 text-xs mt-2">
                  {isRTL ? 'تحقق من مجلد Spam إذا لم تجده.' : "Check your spam folder if you don't see it."}
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-3.5 px-6 rounded-2xl text-white font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
              >
                {isRTL ? 'العودة لتسجيل الدخول' : 'Back to sign in'}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-200 disabled:opacity-60 disabled:scale-100"
                style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
              >
                {loading
                  ? (isRTL ? 'جارٍ الإرسال...' : 'Sending...')
                  : (isRTL ? 'إرسال رابط إعادة التعيين' : 'Send reset link')}
              </button>

              <Link
                to="/login"
                className="block text-center text-slate-400 text-sm hover:text-slate-600 transition-colors"
              >
                ← {isRTL ? 'العودة لتسجيل الدخول' : 'Back to sign in'}
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
