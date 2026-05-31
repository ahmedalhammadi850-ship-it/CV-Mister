import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';

const NAV_DEFAULTS = {
  home_ar: 'الرئيسية', home_en: 'Home',
  templates_ar: 'القوالب', templates_en: 'Templates',
  pricing_ar: 'الأسعار', pricing_en: 'Pricing',
  about_ar: 'من نحن', about_en: 'About',
};

let _navbarCache = null;
let _navbarFetchedAt = 0;

async function fetchNavbarLabels() {
  const now = Date.now();
  if (_navbarCache && now - _navbarFetchedAt < 60000) return _navbarCache;
  try {
    const res = await fetch('/api/navbar');
    if (res.ok) {
      _navbarCache = { ...NAV_DEFAULTS, ...await res.json() };
      _navbarFetchedAt = now;
      return _navbarCache;
    }
  } catch {}
  return NAV_DEFAULTS;
}

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
  </svg>
);

const Header = () => {
  const { isRTL, toggleRTL, currentUser, signOutUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [navLabels, setNavLabels] = useState(NAV_DEFAULTS);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNavbarLabels().then(setNavLabels);
  }, []);

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

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOutUser();
    window.location.href = '/';
  };

  const navLinks = [
    { to: '/',          label: isRTL ? navLabels.home_ar      : navLabels.home_en      },
    { to: '/templates', label: isRTL ? navLabels.templates_ar : navLabels.templates_en },
    { to: '/pricing',   label: isRTL ? navLabels.pricing_ar   : navLabels.pricing_en   },
    { to: '/about',     label: isRTL ? navLabels.about_ar     : navLabels.about_en     },
  ];

  const isActive = (path) => location.pathname === path;

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const headerBg = isDark
    ? 'rgba(15,23,42,0.97)'
    : '#ffffff';
  const headerBorder = isDark
    ? 'rgba(51,65,85,0.7)'
    : 'rgba(226,232,240,0.8)';
  const headerShadow = scrolled
    ? isDark
      ? '0 4px 20px rgba(0,0,0,0.4)'
      : '0 4px 20px rgba(0,0,0,0.06)'
    : 'none';

  const navLinkActive = isDark
    ? 'text-indigo-400 bg-indigo-950'
    : 'text-primary-600 bg-primary-50';
  const navLinkIdle = isDark
    ? 'text-slate-300 hover:text-white hover:bg-slate-800'
    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';

  const logoText = isDark ? '#f1f5f9' : '#0f172a';

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
        boxShadow: headerShadow,
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* Back to dashboard arrow — shown only inside the builder */}
          {location.pathname.startsWith('/builder') && (
            <button
              onClick={() => navigate('/dashboard')}
              aria-label={isRTL ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
              title={isRTL ? 'لوحة التحكم' : 'Dashboard'}
              className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 mr-1"
              style={{
                background: isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)',
                color: isDark ? '#a5b4fc' : '#4f46e5',
                border: `1px solid ${isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.2)'}`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.25)' : 'rgba(99,102,241,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)';
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md transition-transform duration-200 group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)' }}
            >
              CV
            </div>
            <span className="font-heading font-bold text-xl tracking-tight" style={{ color: logoText }}>Mister</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(to) ? navLinkActive : navLinkIdle
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(0,0,0,0.05)',
                color: isDark ? '#a5b4fc' : '#64748b',
                border: isDark ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.25)' : 'rgba(0,0,0,0.09)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isDark ? 'rgba(99,102,241,0.15)' : 'rgba(0,0,0,0.05)';
              }}
            >
              <span
                className="transition-all duration-300"
                style={{
                  display: 'flex',
                  transform: isDark ? 'rotate(0deg) scale(1)' : 'rotate(30deg) scale(0.9)',
                  opacity: isDark ? 1 : 0,
                  position: 'absolute',
                }}
              >
                <MoonIcon />
              </span>
              <span
                className="transition-all duration-300"
                style={{
                  display: 'flex',
                  transform: isDark ? 'rotate(-30deg) scale(0.9)' : 'rotate(0deg) scale(1)',
                  opacity: isDark ? 0 : 1,
                  position: 'absolute',
                }}
              >
                <SunIcon />
              </span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleRTL}
              className="text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200"
              style={{
                color: isDark ? '#94a3b8' : '#64748b',
                background: 'transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = isDark ? '#1e293b' : '#f1f5f9';
                e.currentTarget.style.color = isDark ? '#f1f5f9' : '#0f172a';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b';
              }}
            >
              {isRTL ? 'EN' : 'عربي'}
            </button>

            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                {currentUser.plan === 'business' && currentUser.daysLeft !== null && (
                  <span className={`mr-1 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                    currentUser.daysLeft <= 3
                      ? 'bg-red-100 text-red-600'
                      : currentUser.daysLeft <= 7
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isRTL ? `${currentUser.daysLeft} يوم` : `${currentUser.daysLeft}d`}
                  </span>
                )}
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl transition-all"
                  style={{
                    background: userMenuOpen
                      ? isDark ? '#1e293b' : '#f1f5f9'
                      : 'transparent',
                  }}
                  onMouseEnter={e => {
                    if (!userMenuOpen) e.currentTarget.style.background = isDark ? '#1e293b' : '#f1f5f9';
                  }}
                  onMouseLeave={e => {
                    if (!userMenuOpen) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {currentUser.profileImage ? (
                    <img
                      src={currentUser.profileImage}
                      alt="avatar"
                      className="w-8 h-8 rounded-lg object-cover border"
                      style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)' }}
                    >
                      {initials}
                    </div>
                  )}
                  <span className="text-sm font-medium max-w-[100px] truncate" style={{ color: isDark ? '#e2e8f0' : '#334155' }}>
                    {currentUser.displayName}
                  </span>
                  <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} style={{ color: isDark ? '#64748b' : '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-12 rounded-2xl shadow-xl z-50 w-56 py-2 overflow-hidden"
                    style={{
                      background: isDark ? '#1e293b' : '#ffffff',
                      border: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
                    }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
                      <p className="text-xs" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>{isRTL ? 'مسجّل دخول بـ' : 'Signed in as'}</p>
                      <p className="text-sm font-semibold truncate" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{currentUser.displayName}</p>
                      {currentUser.email && (
                        <p className="text-xs truncate mt-0.5" style={{ color: isDark ? '#64748b' : '#94a3b8' }}>{currentUser.email}</p>
                      )}
                    </div>
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: isDark ? '#cbd5e1' : '#334155' }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? '#334155' : '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg className="w-4 h-4" style={{ color: isDark ? '#64748b' : '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        {isRTL ? 'لوحة التحكم' : 'Dashboard'}
                      </Link>
                      <Link
                        to="/builder"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: isDark ? '#cbd5e1' : '#334155' }}
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? '#334155' : '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg className="w-4 h-4" style={{ color: isDark ? '#64748b' : '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {isRTL ? 'سيرة ذاتية جديدة' : 'New Resume'}
                      </Link>
                    </div>
                    <div className="py-1" style={{ borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 transition-colors"
                        onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {isRTL ? 'تسجيل الخروج' : 'Sign out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-sm font-medium px-4 py-2 transition-colors duration-200"
                  style={{ color: isDark ? '#94a3b8' : '#475569' }}
                  onMouseEnter={e => e.currentTarget.style.color = isDark ? '#e2e8f0' : '#4f46e5'}
                  onMouseLeave={e => e.currentTarget.style.color = isDark ? '#94a3b8' : '#475569'}
                >
                  {isRTL ? 'تسجيل الدخول' : 'Log in'}
                </Link>
                <Link
                  to="/signup"
                  className="text-sm py-2 px-5 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)' }}
                >
                  {isRTL ? 'ابدأ مجاناً' : 'Get started free'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
              style={{
                background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(0,0,0,0.05)',
                color: isDark ? '#a5b4fc' : '#64748b',
              }}
            >
              {isDark ? <MoonIcon /> : <SunIcon />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: isDark ? '#94a3b8' : '#475569' }}
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
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden"
          style={{
            borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
            background: isDark ? 'rgba(15,23,42,0.98)' : 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(to) ? navLinkActive : navLinkIdle
                }`}
              >
                {label}
              </Link>
            ))}

            {currentUser && (
              <Link
                to="/dashboard"
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${navLinkIdle}`}
              >
                {isRTL ? 'لوحة التحكم' : 'Dashboard'}
              </Link>
            )}

            <button
              onClick={toggleRTL}
              className={`w-full text-start block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${navLinkIdle}`}
            >
              {isRTL ? 'Switch to English' : 'التبديل للعربية'}
            </button>

            {currentUser ? (
              <div className="pt-3 mt-3" style={{ borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
                <button
                  onClick={handleSignOut}
                  className="w-full text-start block px-4 py-2.5 rounded-xl text-sm font-medium text-red-500"
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {isRTL ? 'تسجيل الخروج' : 'Sign out'}
                </button>
              </div>
            ) : (
              <div className="pt-3 mt-3 flex flex-col gap-2" style={{ borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
                <Link
                  to="/login"
                  className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-medium border transition-all"
                  style={{
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    color: isDark ? '#cbd5e1' : '#334155',
                    background: isDark ? '#1e293b' : '#ffffff',
                  }}
                >
                  {isRTL ? 'تسجيل الدخول' : 'Log in'}
                </Link>
                <Link
                  to="/signup"
                  className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)' }}
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
