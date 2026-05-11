import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Placeholder components
const Layout = ({ children }) => <div className="min-h-screen flex flex-col">{children}</div>;
const Header = () => <header className="p-4 bg-white shadow">Header <button onClick={() => document.documentElement.dir = document.documentElement.dir === 'rtl' ? 'ltr' : 'rtl'}>Toggle RTL</button></header>;
const Footer = () => <footer className="p-4 bg-slate-800 text-white mt-auto">Footer</footer>;

const HomePage = () => <div className="p-8"><h1 className="text-4xl font-heading text-primary-600">CV-Mister</h1><p className="mt-4 text-slate-600">Premium AI-Powered Resume Builder</p></div>;
const BuilderPage = () => <div className="p-8">Builder Page</div>;
const TemplatesPage = () => <div className="p-8">Templates Gallery</div>;
const AboutPage = () => <div className="p-8">About Us</div>;
const LoginPage = () => <div className="p-8">Login</div>;
const SignupPage = () => <div className="p-8">Sign Up</div>;

function App() {
  const { isRTL } = useAuth();

  return (
    <div className={`min-h-screen bg-slate-50 font-sans text-slate-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Main Routes */}
        <Route path="/" element={<Layout><Header /><HomePage /><Footer /></Layout>} />
        <Route path="/templates" element={<Layout><Header /><TemplatesPage /><Footer /></Layout>} />
        <Route path="/about" element={<Layout><Header /><AboutPage /><Footer /></Layout>} />
        
        {/* Protected Builder Route */}
        <Route path="/builder" element={<Layout><Header /><BuilderPage /></Layout>} />
        <Route path="/builder/:id" element={<Layout><Header /><BuilderPage /></Layout>} />
      </Routes>
    </div>
  );
}

export default App;
