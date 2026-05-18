import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

const EmailActionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isRTL, refreshUser } = useAuth();

  const [status, setStatus] = useState('loading'); // loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    // If no oobCode, Firebase already verified the email and redirected here
    if (!oobCode) {
      setStatus('success');
      setTimeout(() => navigate('/login', { replace: true }), 3000);
      return;
    }

    applyActionCode(auth, oobCode)
      .then(async () => {
        // Force reload so emailVerified updates
        try {
          if (auth.currentUser) {
            await auth.currentUser.reload();
            await refreshUser();
          }
        } catch {}
        setStatus('success');
        setTimeout(() => navigate('/login', { replace: true }), 3000);
      })
      .catch((err) => {
        if (err.code === 'auth/invalid-action-code') {
          // Code already used — email was already verified
          setStatus('success');
          setTimeout(() => navigate('/login', { replace: true }), 3000);
        } else {
          setStatus('error');
          setErrorMsg(
            isRTL
              ? 'انتهت صلاحية الرابط أو تم استخدامه من قبل. اطلب رابطاً جديداً.'
              : 'The link has expired or already been used. Request a new one.'
          );
        }
      });
  }, []);

  const bg = 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)';

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: bg }}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-10 text-center space-y-5">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-slate-500 font-medium">
            {isRTL ? 'جارٍ التحقق...' : 'Verifying your email...'}
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: bg }}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-10 text-center space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-green-100">
            <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {isRTL ? 'تم التحقق من بريدك الإلكتروني!' : 'Email Verified!'}
            </h1>
            <p className="text-slate-500 text-sm">
              {isRTL
                ? 'حسابك مفعّل الآن. سيتم تحويلك لتسجيل الدخول...'
                : 'Your account is now active. Redirecting to login...'}
            </p>
          </div>
          <div className="flex justify-center pt-1">
            <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          </div>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
          >
            {isRTL ? 'تسجيل الدخول الآن' : 'Log in now'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: bg }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-10 text-center space-y-5" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto bg-red-100">
          <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            {isRTL ? 'رابط غير صالح' : 'Invalid Link'}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">{errorMsg}</p>
        </div>
        <button
          onClick={() => navigate('/signup', { replace: true })}
          className="w-full py-3 rounded-2xl text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
        >
          {isRTL ? 'إنشاء حساب جديد' : 'Create a new account'}
        </button>
      </div>
    </div>
  );
};

export default EmailActionPage;
