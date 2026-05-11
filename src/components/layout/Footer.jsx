import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { isRTL } = useAuth();

  const columns = [
    {
      title: { en: 'Product', ar: 'المنتج' },
      links: [
        { label: { en: 'Resume Builder', ar: 'منشئ السيرة' }, to: '/builder' },
        { label: { en: 'CV Templates', ar: 'قوالب السيرة' }, to: '/templates' },
        { label: { en: 'ATS Checker', ar: 'فاحص ATS' }, to: '#' },
        { label: { en: 'Cover Letters', ar: 'خطابات التغطية' }, to: '#' },
      ],
    },
    {
      title: { en: 'Resources', ar: 'الموارد' },
      links: [
        { label: { en: 'Career Blog', ar: 'مدونة المهنة' }, to: '#' },
        { label: { en: 'About Us', ar: 'من نحن' }, to: '/about' },
        { label: { en: 'Contact', ar: 'اتصل بنا' }, to: '#' },
        { label: { en: 'Help Center', ar: 'مركز المساعدة' }, to: '#' },
      ],
    },
    {
      title: { en: 'Legal', ar: 'قانوني' },
      links: [
        { label: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' }, to: '#' },
        { label: { en: 'Terms of Service', ar: 'شروط الخدمة' }, to: '#' },
        { label: { en: 'Cookie Policy', ar: 'سياسة الكوكيز' }, to: '#' },
      ],
    },
  ];

  const socialLinks = [
    {
      label: 'Twitter / X',
      href: '#',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
  ];

  const t = (en, ar) => isRTL ? ar : en;

  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* CTA Banner */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div
            className="rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.25) 0%, rgba(192,38,211,0.15) 100%)', border: '1px solid rgba(99,102,241,0.25)' }}
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
                {t('Ready to land your next role?', 'هل أنت مستعد للوظيفة التالية؟')}
              </h3>
              <p className="text-slate-400">
                {t('Join 50,000+ professionals who built their resume with CV-Mister.', 'انضم لأكثر من 50,000 محترف بنوا سيرتهم الذاتية معنا.')}
              </p>
            </div>
            <Link
              to="/builder"
              className="flex-shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)', boxShadow: '0 8px 25px rgba(79,70,229,0.4)' }}
            >
              {t('Build for free', 'ابدأ مجاناً')}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}
              >
                CV
              </div>
              <span className="font-heading font-bold text-xl text-white">Mister</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              {t(
                'Build your professional resume in minutes. AI-powered, ATS-friendly, and beautifully designed for every industry.',
                'أنشئ سيرتك الذاتية الاحترافية في دقائق. مدعوم بالذكاء الاصطناعي ومتوافق مع ATS.'
              )}
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-600 transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {col.title[isRTL ? 'ar' : 'en']}
              </h4>
              <ul className="space-y-3">
                {col.links.map(({ label, to }, idx) => (
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
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CV-Mister.{' '}
            {t('All rights reserved.', 'جميع الحقوق محفوظة.')}
          </p>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>{t('Made with', 'صُنع بـ')}</span>
            <span className="text-red-400">♥</span>
            <span>{t('for job seekers everywhere', 'لكل باحث عن عمل')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
