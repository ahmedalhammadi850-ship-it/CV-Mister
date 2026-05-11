import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import BuilderPage from './pages/BuilderPage';
import AboutPage from './pages/AboutPage';
import TemplatesPage from './pages/TemplatesPage';

const LoginPage = () => <div className="p-8">Login</div>;
const SignupPage = () => <div className="p-8">Sign Up</div>;

function App() {
  const { isRTL } = useAuth();

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/templates" element={<Layout><TemplatesPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />

        <Route path="/builder" element={<Layout><BuilderPage /></Layout>} />
        <Route path="/builder/:id" element={<Layout><BuilderPage /></Layout>} />
      </Routes>
    </div>
  );
}

export default App;
