import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';

const Header = () => {
  const { isRTL, toggleRTL, currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { to: '/',          label: isRTL ? 'الرئيسية' : 'Home'      },
    { to: '/templates', label: isRTL ? 'القوالب'  : 'Templates'  },
    { to: '/builder',   label: isRTL ? 'المنشئ'   : 'Builder'    },
    { to: '/about',     label: isRTL ? 'من نحن'   : 'About'      },
  ];

  const isActive = (path) => location.pathname === path;

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

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
            <span className="font-heading font-bold text-xl text-slate-900 tracking-tight">Mister</span>
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
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-all"
                >
                  {currentUser.profileImage ? (
                    <img
                      src={currentUser.profileImage}
                      alt="avatar"
                      className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)' }}
                    >
                      {initials}
                    </div>
                  )}
                  <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">
                    {currentUser.displayName}
                  </span>
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 w-56 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs text-slate-400">{isRTL ? 'مسجّل دخول بـ' : 'Signed in as'}</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">{currentUser.displayName}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                      </Link>
                      <Link
                        to="/builder"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {isRTL ? 'سيرة ذاتية جديدة' : 'New Resume'}
                      </Link>
                    </div>
                    <div className="border-t border-slate-100 py-1">
                      <a
                        href="/api/logout"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {isRTL ? 'تسجيل الخروج' : 'Sign out'}
                      </a>
                    </div>
                  </div>
                )}
              </div>
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

            {currentUser && (
              <Link
                to="/dashboard"
                className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 transition-all"
              >
                {isRTL ? 'لوحة التحكم' : 'Dashboard'}
              </Link>
            )}

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
