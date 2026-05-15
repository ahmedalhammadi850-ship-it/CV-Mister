import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import AboutPage from './pages/AboutPage';
import TemplatesPage from './pages/TemplatesPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PricingPage from './pages/PricingPage';
import UpgradePage from './pages/UpgradePage';
import BusinessContactPage from './pages/BusinessContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ChatWidget from './components/ChatWidget';

function BusinessExpiredModal() {
  const { currentUser, isRTL } = useAuth();
  const navigate = useNavigate();
  if (!currentUser?.subscriptionExpired) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-red-100">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          {isRTL ? 'انتهى اشتراكك' : 'Subscription Expired'}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-2">
          {isRTL
            ? 'لقد انتهت صلاحية اشتراكك في خطة الأعمال.'
            : 'Your Business plan subscription has expired.'}
        </p>
        <p className="text-slate-400 text-xs leading-relaxed mb-6">
          {isRTL
            ? 'يرجى التواصل معنا وإرسال إيصال الدفع لتجديد اشتراكك والاستمرار في الاستفادة من جميع الميزات.'
            : 'Please contact us and send your payment receipt to renew and continue enjoying all features.'}
        </p>
        <button
          onClick={() => navigate('/business-contact')}
          className="w-full py-3 rounded-2xl text-white font-bold text-sm transition-all mb-2"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
        >
          {isRTL ? '🔄 تجديد الاشتراك — $15/شهر' : '🔄 Renew Subscription — $15/mo'}
        </button>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

function GuestRoute({ children }) {
  const { currentUser } = useAuth();
  if (currentUser) return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  const { isRTL } = useAuth();

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <BusinessExpiredModal />
      <ChatWidget />
      <Routes>
        <Route path="/login"           element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signup"          element={<GuestRoute><SignupPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route path="/"          element={<Layout><HomePage /></Layout>} />
        <Route path="/templates" element={<Layout><TemplatesPage /></Layout>} />
        <Route path="/about"     element={<Layout><AboutPage /></Layout>} />
        <Route path="/pricing"   element={<Layout><PricingPage /></Layout>} />
        <Route path="/upgrade"          element={<Layout><UpgradePage /></Layout>} />
        <Route path="/business-contact" element={<Layout><BusinessContactPage /></Layout>} />

        <Route path="/dashboard"   element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/builder"     element={<Layout><BuilderPage /></Layout>} />
        <Route path="/builder/:id" element={<Layout><BuilderPage /></Layout>} />

        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
