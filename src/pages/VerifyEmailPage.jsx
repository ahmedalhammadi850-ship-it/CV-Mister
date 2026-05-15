import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';

const VerifyEmailPage = () => {
  const { isRTL, resendVerification, signOutUser } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setEmail(user.email || '');
  }, []);

  const handleCheckVerified = async () => {
    setChecking(true);
    setError('');
    try {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }
      await user.reload();
      if (user.emailVerified) {
        navigate('/dashboard');
      } else {
        setError(
          isRTL
            ? 'لم يتم التحقق من البريد بعد. تأكد من النقر على الرابط في الإيميل.'
            : 'Email not verified yet. Please click the link in your inbox.'
        );
      }
    } catch {
      setError(isRTL ? 'حدث خطأ، حاول مرة أخرى.' : 'Something went wrong. Try again.');
    } finally {
      setChecking(false);
    }
  };

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
              {isRTL
                ? `أرسلنا رابط التحقق إلى`
                : `We sent a verification link to`}
            </p>
            {email && (
              <p className="text-indigo-600 font-semibold text-sm break-all">{email}</p>
            )}
            <p className="text-slate-400 text-xs leading-relaxed pt-1">
              {isRTL
                ? 'افتح الإيميل وانقر على الرابط، ثم اضغط على الزر أدناه.'
                : 'Open the email, click the link, then press the button below.'}
            </p>
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

          <button
            onClick={handleCheckVerified}
            disabled={checking}
            className="w-full py-3.5 px-6 rounded-2xl text-white font-bold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:scale-100"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
          >
            {checking
              ? (isRTL ? 'جارٍ التحقق...' : 'Checking...')
              : (isRTL ? '✓ تحققت من الإيميل، تابع' : '✓ I verified my email, continue')}
          </button>

          <div className="flex items-center gap-4 pt-2">
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
            {isRTL
              ? 'لم تجد الإيميل؟ تحقق من مجلد الـ Spam'
              : "Can't find the email? Check your spam folder"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
