import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { isRTL } = useAuth();
  const t = (en, ar) => isRTL ? ar : en;

  const productLinks = [
    { label: { en: 'Home', ar: 'الرئيسية' }, to: '/' },
    { label: { en: 'Resume Builder', ar: 'منشئ السيرة' }, to: '/builder' },
    { label: { en: 'CV Templates', ar: 'قوالب السيرة' }, to: '/templates' },
    { label: { en: 'About Us', ar: 'من نحن' }, to: '/about' },
  ];


  return (
    <footer style={{ background: '#0f0f1a', color: '#cbd5e1' }}>

      {/* CTA Banner */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div
          className="relative rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.14) 50%, rgba(192,38,211,0.12) 100%)',
            border: '1px solid rgba(139,92,246,0.25)',
          }}
        >
          <div className="absolute -top-20 -start-20 w-72 h-72 rounded-full pointer-events-none" style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)',
            filter: 'blur(40px)',
          }} />
          <div className="absolute -bottom-16 -end-16 w-60 h-60 rounded-full pointer-events-none" style={{
            background: 'radial-gradient(circle, rgba(192,38,211,0.15), transparent)',
            filter: 'blur(30px)',
          }} />

          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
              {t('Ready to land your next role?', 'هل أنت مستعد للوظيفة التالية؟')}
            </h3>
            <p className="text-slate-400">
              {t('Join 50,000+ professionals who built their resume with CV-Mister.', 'انضم لأكثر من 50,000 محترف بنوا سيرتهم الذاتية معنا.')}
            </p>
          </div>
          <Link
            to="/builder"
            className="relative z-10 flex-shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}
          >
            {t('Build for free', 'ابدأ مجاناً')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? 'M11 17l-5-5m0 0l5-5m-5 5h12' : 'M13 7l5 5m0 0l-5 5m5-5H6'} />
            </svg>
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Main Footer Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className={`flex flex-col md:flex-row items-start justify-center gap-16 mb-12 ${isRTL ? 'md:flex-row-reverse' : ''}`}>

          {/* Column 1: Brand + Contact */}
          <div className="flex flex-col items-center text-center">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #4f46e5, #a855f7)',
                  boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
                }}
              >
                CV
              </div>
              <span className="font-heading font-bold text-xl text-white">Mister</span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-xs">
              {t(
                'Build your professional resume in minutes. AI-powered, ATS-friendly, and beautifully designed.',
                'أنشئ سيرتك الذاتية الاحترافية في دقائق. مدعوم بالذكاء الاصطناعي ومتوافق مع ATS.'
              )}
            </p>

            <div className="flex flex-col items-center">
              <p className="text-xs font-semibold uppercase tracking-widest mb-3 text-indigo-400">
                {t('Contact us', 'تواصل معنا')}
              </p>
              <a
                href="mailto:ahmedalhammadi266@gmail.com"
                className="inline-flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.18)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(168,85,247,0.3))' }}>
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-300">
                  ahmedalhammadi266@gmail.com
                </span>
              </a>
            </div>
          </div>

          {/* Column 2: Links */}
          <div className="flex flex-col items-center text-center">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-5 text-indigo-400">
              {t('Links', 'الروابط')}
            </h4>
            <ul className="space-y-3.5">
              {productLinks.map(({ label, to }, idx) => (
                <li key={idx}>
                  <Link
                    to={to}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {label[isRTL ? 'ar' : 'en']}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div
          className="pt-8 flex flex-col items-center gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CV-Mister.{' '}
            {t('All rights reserved.', 'جميع الحقوق محفوظة.')}
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{t('Made with', 'صُنع بـ')}</span>
            <span className="text-pink-400">♥</span>
            <span>{t('for job seekers everywhere', 'لكل باحث عن عمل')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
