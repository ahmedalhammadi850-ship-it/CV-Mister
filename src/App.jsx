import { Routes, Route, Navigate } from 'react-router-dom';
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

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
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
      <Routes>
        <Route path="/login"           element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/signup"          element={<GuestRoute><SignupPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />

        <Route path="/"          element={<Layout><HomePage /></Layout>} />
        <Route path="/templates" element={<Layout><TemplatesPage /></Layout>} />
        <Route path="/about"     element={<Layout><AboutPage /></Layout>} />

        <Route path="/dashboard"   element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
        <Route path="/builder"     element={<Layout><BuilderPage /></Layout>} />
        <Route path="/builder/:id" element={<Layout><BuilderPage /></Layout>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
