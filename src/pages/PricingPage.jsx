import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CHECK = (
  <svg className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
);

const CROSS = (
  <svg className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DEFAULTS = {
  pro_price: 3,
  pro_name: 'احترافي',
  pro_name_en: 'Professional',
  business_price: 15,
  business_name: 'أعمال',
  business_name_en: 'Business',
};

const faqs = [
  {
    q: 'هل يمكنني تجربة المنصة مجاناً؟',
    qEn: 'Can I try the platform for free?',
    a: 'نعم! يمكنك إنشاء سيرة ذاتية واحدة مجاناً بالكامل دون الحاجة لبطاقة ائتمان.',
    aEn: 'Yes! You can create one resume completely free with no credit card required.',
  },
  {
    q: 'هل يمكنني إلغاء الاشتراك في أي وقت؟',
    qEn: 'Can I cancel my subscription anytime?',
    a: 'بالتأكيد. يمكنك إلغاء اشتراكك في أي وقت دون أي رسوم إضافية.',
    aEn: 'Absolutely. You can cancel your subscription at any time with no extra charges.',
  },
  {
    q: 'ما هي طرق الدفع المتاحة؟',
    qEn: 'What payment methods are available?',
    a: 'نقبل الفيزا، ماستركارد، Apple Pay، وstcpay.',
    aEn: 'We accept Visa, Mastercard, Apple Pay, and stcpay.',
  },
];

const PricingPage = () => {
  const { isRTL, currentUser } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [pricing, setPricing] = useState(DEFAULTS);

  useEffect(() => {
    fetch('/api/pricing')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setPricing(prev => ({ ...prev, ...data })); })
      .catch(() => {});
  }, []);

  const plans = [
    {
      id: 'free',
      name: 'مجاني',
      nameEn: 'Free',
      desc: 'مثالي للبدء وتجربة المنصة',
      descEn: 'Perfect to get started and try the platform',
      price: 0,
      period: 'شهرياً',
      periodEn: 'month',
      cta: 'ابدأ مجاناً',
      ctaEn: 'Get started free',
      ctaTo: '/signup',
      popular: false,
      gradient: null,
      features: [
        { label: 'سيرة ذاتية واحدة',               labelEn: '1 resume',                        included: true  },
        { label: 'قالب أساسي',                       labelEn: 'Basic template',                  included: true  },
        { label: 'تصدير PDF',                        labelEn: 'PDF export',                      included: true  },
        { label: 'دعم اللغة العربية',                labelEn: 'Arabic language support',          included: true  },
        { label: 'اقتراحات الذكاء الاصطناعي',       labelEn: 'AI suggestions',                  included: false },
        { label: 'رسالة تغطية',                      labelEn: 'Cover letter',                    included: false },
      ],
    },
    {
      id: 'pro',
      name: pricing.pro_name,
      nameEn: pricing.pro_name_en,
      desc: 'الخيار المثالي للباحثين عن عمل بجدية',
      descEn: 'Ideal for serious job seekers',
      price: pricing.pro_price,
      period: 'شهرياً',
      periodEn: 'month',
      cta: 'اشترك الآن',
      ctaEn: 'Subscribe now',
      ctaTo: '/upgrade',
      popular: true,
      gradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #c026d3 100%)',
      features: [
        { label: '2 سير ذاتية',                      labelEn: '2 resumes',                       included: true },
        { label: 'جميع القوالب (25+)',                labelEn: 'All templates (25+)',              included: true },
        { label: 'تصدير PDF عالي الجودة',            labelEn: 'High-quality PDF export',         included: true },
        { label: 'دعم اللغة العربية والإنجليزية',    labelEn: 'Arabic & English support',        included: true },
        { label: 'اقتراحات الذكاء الاصطناعي',       labelEn: 'AI suggestions',                  included: true },
        { label: 'رسالة تغطية',                      labelEn: 'Cover letter',                    included: true },
      ],
    },
    {
      id: 'business',
      name: pricing.business_name,
      nameEn: pricing.business_name_en,
      desc: 'للشركات والفرق التي تحتاج إلى حلول متكاملة',
      descEn: 'For companies and teams needing complete solutions',
      price: pricing.business_price,
      period: 'شهرياً',
      periodEn: 'month',
      cta: 'تواصل معنا',
      ctaEn: 'Contact us',
      ctaTo: '/business-contact',
      popular: false,
      gradient: null,
      features: [
        { label: 'سير ذاتية غير محدودة',             labelEn: 'Unlimited resumes',               included: true },
        { label: 'جميع القوالب + حصرية',             labelEn: 'All templates + exclusive',       included: true },
        { label: 'تصدير PDF عالي الجودة',            labelEn: 'High-quality PDF export',         included: true },
        { label: 'دعم كامل متعدد اللغات',            labelEn: 'Full multilingual support',       included: true },
        { label: 'ذكاء اصطناعي متقدم',              labelEn: 'Advanced AI',                      included: true },
        { label: 'رسائل تغطية غير محدودة',           labelEn: 'Unlimited cover letters',         included: true },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-16 text-center px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(ellipse, #818cf8 0%, transparent 70%)' }} />
        </div>
        <div className="relative max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-5 border border-indigo-100">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {isRTL ? 'الأسعار' : 'Pricing'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4 leading-tight">
            {isRTL ? 'خطط تناسب الجميع' : 'Plans for Everyone'}
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            {isRTL
              ? 'اختر الخطة المناسبة لك وابدأ في بناء سيرتك الذاتية المثالية اليوم'
              : 'Choose the right plan and start building your perfect resume today'}
          </p>
        </div>
      </section>

      {/* ── Plans Grid ── */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => {
            const isPro = plan.popular;
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl flex flex-col transition-all duration-200 ${
                  isPro
                    ? 'shadow-2xl shadow-indigo-200/60 scale-[1.02] md:scale-105'
                    : 'shadow-sm hover:shadow-lg border border-slate-100 bg-white'
                }`}
                style={isPro ? { background: plan.gradient } : {}}
              >
                {/* Popular badge */}
                {isPro && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-indigo-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-indigo-100">
                      {isRTL ? '⭐ الأكثر شيوعاً' : '⭐ Most Popular'}
                    </span>
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Plan name */}
                  <div className="mb-6">
                    <h2 className={`text-xl font-bold mb-1 ${isPro ? 'text-white' : 'text-slate-900'}`}>
                      {isRTL ? plan.name : plan.nameEn}
                    </h2>
                    <p className={`text-sm leading-relaxed ${isPro ? 'text-white/70' : 'text-slate-500'}`}>
                      {isRTL ? plan.desc : plan.descEn}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-end gap-1">
                      <span className={`text-2xl font-bold ${isPro ? 'text-white/80' : 'text-slate-500'}`}>$</span>
                      <span className={`text-5xl font-extrabold leading-none ${isPro ? 'text-white' : 'text-slate-900'}`}>
                        {plan.price}
                      </span>
                    </div>
                    <p className={`text-sm mt-1.5 ${isPro ? 'text-white/60' : 'text-slate-400'}`}>
                      / {isRTL ? plan.period : plan.periodEn}
                    </p>
                  </div>

                  {/* CTA */}
                  <Link
                    to={currentUser && plan.ctaTo === '/signup' ? '/dashboard' : plan.ctaTo}
                    className={`w-full text-center py-3.5 rounded-2xl font-bold text-sm transition-all mb-8 block ${
                      isPro
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-lg'
                        : plan.id === 'business'
                          ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                    }`}
                  >
                    {isRTL ? plan.cta : plan.ctaEn}
                  </Link>

                  {/* Divider */}
                  <div className={`h-px mb-6 ${isPro ? 'bg-white/20' : 'bg-slate-100'}`} />

                  {/* Features */}
                  <ul className="flex flex-col gap-3.5 flex-1">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {f.included
                          ? isPro
                            ? <svg className="w-4 h-4 text-white flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                            : CHECK
                          : CROSS
                        }
                        <span className={`text-sm leading-snug ${
                          !f.included ? 'text-slate-300' : isPro ? 'text-white' : 'text-slate-700'
                        }`}>
                          {isRTL ? f.label : f.labelEn}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">
          {isRTL ? 'أسئلة شائعة' : 'Frequently Asked Questions'}
        </h2>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const open = openFaq === i;
            return (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(open ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-start gap-4"
                >
                  <span className="font-semibold text-slate-900 text-sm leading-snug">
                    {isRTL ? faq.q : faq.qEn}
                  </span>
                  <svg
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {open && (
                  <div className="px-6 pb-5 -mt-1">
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {isRTL ? faq.a : faq.aEn}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="pb-20 px-6 text-center">
        <div
          className="max-w-2xl mx-auto rounded-3xl p-10"
          style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 60%, #c026d3 100%)' }}
        >
          <h3 className="text-2xl font-bold text-white mb-3">
            {isRTL ? 'ابدأ مجاناً الآن' : 'Start Free Today'}
          </h3>
          <p className="text-white/70 text-sm mb-7">
            {isRTL ? 'لا تحتاج إلى بطاقة ائتمان' : 'No credit card required'}
          </p>
          <Link
            to={currentUser ? '/builder' : '/signup'}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-colors text-sm shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            {isRTL ? 'إنشاء سيرة ذاتية مجاناً' : 'Create Free Resume'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
