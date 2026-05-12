import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const { isRTL } = useAuth();

  useEffect(() => {
    window.location.href = '/api/login';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}
        >
          CV
        </div>
        <p className="text-slate-500 text-sm">
          {isRTL ? 'جاري التوجيه لإنشاء الحساب...' : 'Redirecting to sign up...'}
        </p>
        <a
          href="/api/login"
          className="inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm"
          style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}
        >
          {isRTL ? 'إنشاء حساب' : 'Sign up'}
        </a>
      </div>
    </div>
  );
};

export default SignupPage;
