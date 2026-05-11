import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

const Header = () => {
  const { isRTL, toggleRTL, currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: isRTL ? 'الرئيسية' : 'Home' },
    { to: '/templates', label: isRTL ? 'القوالب' : 'Templates' },
    { to: '/builder', label: isRTL ? 'المنشئ' : 'Builder' },
    { to: '/about', label: isRTL ? 'من نحن' : 'About' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: scrolled ? '1px solid rgba(226,232,240,0.8)' : '1px solid rgba(255,255,255,0.3)',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md transition-transform duration-200 group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)' }}
            >
              CV
            </div>
            <span className="font-heading font-bold text-xl text-slate-900 tracking-tight">
              Mister
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleRTL}
              className="text-sm font-medium text-slate-500 hover:text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-100 transition-all duration-200"
            >
              {isRTL ? 'EN' : 'عربي'}
            </button>

            {currentUser ? (
              <Link to="/builder" className="btn-primary text-sm py-2 px-5">
                {isRTL ? 'سيرتي الذاتية' : 'My Resumes'}
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-primary-600 px-4 py-2 transition-colors duration-200"
                >
                  {isRTL ? 'تسجيل الدخول' : 'Log in'}
                </Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-5">
                  {isRTL ? 'ابدأ مجاناً' : 'Get started free'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(to)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </Link>
            ))}

            <button
              onClick={toggleRTL}
              className="w-full text-start block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
            >
              {isRTL ? 'Switch to English' : 'التبديل للعربية'}
            </button>

            {!currentUser && (
              <div className="pt-3 mt-3 border-t border-slate-100 flex flex-col gap-2">
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-medium border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-all"
                >
                  {isRTL ? 'تسجيل الدخول' : 'Log in'}
                </Link>
                <Link
                  to="/signup"
                  className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)' }}
                >
                  {isRTL ? 'ابدأ مجاناً' : 'Get started free'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
