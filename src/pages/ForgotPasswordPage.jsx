import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ForgotPasswordPage = () => {
  const { isRTL } = useAuth();

  useEffect(() => {
    window.location.href = '/api/login';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="text-center space-y-4">
        <p className="text-slate-500 text-sm">
          {isRTL ? 'جاري التوجيه...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
