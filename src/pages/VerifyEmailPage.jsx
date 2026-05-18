import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const VerifyEmailPage = () => {
  const { isRTL, resendVerification, signOutUser, currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [noSession, setNoSession] = useState(false);
  const intervalRef = useRef(null);

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
        await refreshUser();
        setVerified(true);
        setTimeout(() => setRedirecting(true), 2000);
        return true;
      }
    } catch {}
    return false;
  };

  const handleManualCheck = async () => {
    setChecking(true);
    setError('');
    const u = auth.currentUser;
    if (!u) {
      setChecking(false);
      setNoSession(true);
      return;
    }
    try {
      await u.reload();
      if (u.emailVerified) {
        clearInterval(intervalRef.current);
        await refreshUser();
        setVerified(true);
        setTimeout(() => setRedirecting(true), 2000);
      } else {
        setError(isRTL ? 'لم يتم التحقق بعد. تأكد من الضغط على الرابط في الإيميل.' : 'Not verified yet. Make sure you clicked the link in the email.');
      }
    } catch {
      setError(isRTL ? 'حدث خطأ. حاول مرة أخرى.' : 'Something went wrong. Try again.');
    }
    setChecking(false);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setEmail(user.email || '');
    } else {
      // No session on this device — show manual option after short delay
      const t = setTimeout(() => setNoSession(true), 1500);
      return () => clearTimeout(t);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setNoSession(true);
        return;
      }
      if (firebaseUser.email) setEmail(firebaseUser.email);
      try { await firebaseUser.reload(); } catch {}
      if (firebaseUser.emailVerified) {
        clearInterval(intervalRef.current);
        await refreshUser();
        setVerified(true);
        setTimeout(() => setRedirecting(true), 2000);
      }
    });

    checkVerified().then((alreadyVerified) => {
      if (!alreadyVerified) {
        intervalRef.current = setInterval(checkVerified, 3000);
      }
    });

    return () => {
      clearInterval(intervalRef.current);
      unsubscribe();
    };
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

  // ── Verified success screen ──────────────────────────────────────────
  if (verified || redirecting) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }}
      >
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto bg-green-100">
              <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {isRTL ? '✅ تم التحقق من الإيميل!' : '✅ Email Verified!'}
              </h1>
              <p className="text-slate-500 text-sm">
                {isRTL ? 'جارٍ الانتقال إلى لوحة التحكم...' : 'Redirecting to your dashboard...'}
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── No session on this device ────────────────────────────────────────
  if (noSession) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-6"
        dir={isRTL ? 'rtl' : 'ltr'}
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }}
      >
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto bg-indigo-100">
              <svg className="w-10 h-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {isRTL ? 'تحققت من إيميلك؟' : 'Did you verify your email?'}
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                {isRTL
                  ? 'إذا ضغطت على رابط التحقق في الإيميل، يمكنك الآن تسجيل الدخول.'
                  : 'If you clicked the verification link in your email, you can now log in.'}
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 rounded-2xl text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
            >
              {isRTL ? 'تسجيل الدخول' : 'Log in'}
            </button>
            <button
              onClick={handleBack}
              className="w-full py-2.5 rounded-2xl text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              {isRTL ? 'رجوع' : 'Go back'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Waiting screen (user is logged in on this device) ────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
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
                ? 'افتح الإيميل وانقر على الرابط، ثم اضغط الزر أدناه.'
                : "Open the email, click the link, then press the button below."}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-indigo-500 text-xs font-medium">
            <div className="w-3 h-3 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            {isRTL ? 'في انتظار التحقق...' : 'Waiting for verification...'}
          </div>

          <button
            onClick={handleManualCheck}
            disabled={checking}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
          >
            {checking
              ? (isRTL ? 'جارٍ التحقق...' : 'Checking...')
              : (isRTL ? '✓ لقد تحققت من إيميلي' : '✓ I verified my email')}
          </button>

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
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
