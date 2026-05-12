import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordPage = () => {
  const { isRTL } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-8 space-y-6 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
          >
            CV
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900">
              {isRTL ? 'استعادة الوصول' : 'Recover Access'}
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              {isRTL
                ? 'يرجى تسجيل الدخول مباشرة للوصول إلى حسابك.'
                : 'Please sign in directly to access your account.'}
            </p>
          </div>
          <a
            href="/api/login"
            className="flex items-center justify-center gap-3 w-full py-3.5 px-6 rounded-2xl text-white font-semibold text-sm transition-all duration-200 hover:opacity-90 hover:scale-[1.02]"
            style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
          >
            {isRTL ? 'تسجيل الدخول' : 'Continue'}
          </a>
          <Link to="/login" className="block text-slate-400 text-sm hover:text-slate-600 transition-colors">
            ← {isRTL ? 'العودة لتسجيل الدخول' : 'Back to login'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
