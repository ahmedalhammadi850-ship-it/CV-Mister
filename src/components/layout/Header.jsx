import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Header = () => {
  const { isRTL, toggleRTL, currentUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="glass-nav sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-premium">
                CV
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight text-slate-900">
                Mister
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 rtl:space-x-reverse">
            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Home</Link>
            <Link to="/templates" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Templates</Link>
            <Link to="/builder" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Builder</Link>
            <Link to="/about" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">About Us</Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleRTL}
              className="text-slate-500 hover:text-slate-900 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isRTL ? 'English' : 'عربي'}
            </button>
            
            {currentUser ? (
              <Link to="/builder" className="btn-primary">
                My Resumes
              </Link>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium px-4 py-2 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="btn-primary py-2 px-5 rounded-lg shadow-md hover:shadow-lg">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Home</Link>
            <Link to="/templates" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Templates</Link>
            <Link to="/builder" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">Builder</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50">About</Link>
            
            <button 
              onClick={toggleRTL}
              className="w-full text-left rtl:text-right block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50"
            >
              {isRTL ? 'Switch to English' : 'Switch to Arabic'}
            </button>
            
            {!currentUser && (
              <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col gap-2 px-3">
                <Link to="/login" className="w-full text-center py-2 px-4 border border-slate-300 rounded-lg text-slate-700 bg-white">Log in</Link>
                <Link to="/signup" className="w-full text-center py-2 px-4 rounded-lg text-white bg-primary-600">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
