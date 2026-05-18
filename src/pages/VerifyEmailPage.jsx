import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

const VerifyEmailPage = () => {
  const { isRTL, resendVerification, signOutUser, currentUser } = useAuth();
  const navigate = useNavigate();
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [redirecting, setRedirecting] = useState(false);
  const intervalRef = useRef(null);

  // Once redirecting=true AND currentUser is set by onAuthStateChanged, go to dashboard
  useEffect(() => {
    if (redirecting && currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [redirecting, currentUser]);

  const checkVerified = async () => {
    try {
      const u = auth.currentUser;
      if (!u) return false;
      await u.reload();
      if (u.emailVerified) {
        clearInterval(intervalRef.current);
        setRedirecting(true);
        return true;
      }
    } catch {
    }
    return false;
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setEmail(user.email || '');

    // Check immediately in case user already verified (e.g. arrived via email link)
    checkVerified().then((alreadyVerified) => {
      if (!alreadyVerified) {
        intervalRef.current = setInterval(checkVerified, 3000);
      }
    });

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleResend = async () => {
    try {
      await resendVerification();
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch {
      setError(isRTL ? 'فشل إرسال الإيميل. حاول لاحقاً.' : 'Failed to resend. Try later.');
    }
  };

  const handleBack = async () => {
    clearInterval(intervalRef.current);
    await signOutUser();
    navigate('/signup');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">

          {redirecting ? (
            <div className="space-y-4 py-4">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto bg-green-100">
                <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isRTL ? 'تم التحقق! 🎉' : 'Verified! 🎉'}
              </h1>
              <p className="text-slate-500 text-sm">
                {isRTL ? 'جارٍ الانتقال إلى لوحة التحكم...' : 'Redirecting to your dashboard...'}
              </p>
              <div className="flex justify-center">
                <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : (
            <>
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #a855f7)' }}
              >
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  {isRTL ? 'تحقق من بريدك الإلكتروني' : 'Verify your email'}
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {isRTL ? 'أرسلنا رابط التحقق إلى' : 'We sent a verification link to'}
                </p>
                {email && (
                  <p className="text-indigo-600 font-semibold text-sm break-all">{email}</p>
                )}
                <p className="text-slate-400 text-xs leading-relaxed pt-1">
                  {isRTL
                    ? 'افتح الإيميل وانقر على الرابط — سيتم الانتقال تلقائياً.'
                    : 'Open the email and click the link — you\'ll be redirected automatically.'}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-indigo-500 text-xs font-medium">
                <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                {isRTL ? 'في انتظار التحقق...' : 'Waiting for verification...'}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              {resent && (
                <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-4 py-3 text-sm">
                  {isRTL ? '✓ تم إرسال الإيميل مجدداً!' : '✓ Verification email resent!'}
                </div>
              )}

              <div className="flex items-center gap-4">
                <button
                  onClick={handleResend}
                  className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                >
                  {isRTL ? 'إعادة الإرسال' : 'Resend email'}
                </button>
                <button
                  onClick={handleBack}
                  className="flex-1 py-2.5 px-4 rounded-2xl border-2 border-slate-200 text-slate-500 font-semibold text-sm hover:border-slate-300 transition-all"
                >
                  {isRTL ? 'رجوع' : 'Go back'}
                </button>
              </div>

              <p className="text-slate-400 text-xs">
                {isRTL ? 'لم تجد الإيميل؟ تحقق من مجلد الـ Spam' : "Can't find the email? Check your spam folder"}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
