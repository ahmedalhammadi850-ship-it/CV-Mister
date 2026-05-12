import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const content = {
  ar: {
    hero: {
      tag: 'من نحن',
      title: 'نحن نبني مستقبل التوظيف',
      subtitle: 'منصة متكاملة تمزج بين خبرة الموارد البشرية وتقنيات الذكاء الاصطناعي لمساعدتك في الحصول على وظيفة أحلامك',
    },
    stats: {
      tag: 'إنجازاتنا بالأرقام',
      title: 'أرقام نفتخر بها',
      items: [
        { value: '+50,000', label: 'مستخدم نشط' },
        { value: '+5M', label: 'سيرة ذاتية' },
        { value: '+15', label: 'دولة' },
        { value: '%98', label: 'رضا المستخدمين' },
      ],
    },
    timeline: {
      tag: 'كيف بدأت القصة؟',
      title: 'رحلتنا',
      items: [
        {
          year: '2024',
          title: 'بداية الفكرة',
          desc: 'لاحظنا أن الباحثين عن عمل في العالم العربي يواجهون تحديات كبيرة في إنشاء سير ذاتية احترافية تتوافق مع المعايير العالمية.',
          icon: '💡',
        },
        {
          year: '2025',
          title: 'إطلاق المنصة',
          desc: 'أطلقنا النسخة الأولى من CV-Mister مع دعم كامل للعربية والإنجليزية و5 قوالب احترافية.',
          icon: '🚀',
        },
        {
          year: '2026',
          title: 'الذكاء الاصطناعي',
          desc: 'دمجنا تقنيات الذكاء الاصطناعي المتقدمة لمساعدة المستخدمين في كتابة محتوى احترافي وتحسين سيرهم الذاتية تلقائياً.',
          icon: '🤖',
        },
      ],
    },
    mission: {
      tag: 'مهمتنا',
      title: 'لماذا نفعل ذلك؟',
      desc: 'تمكين كل باحث عن عمل في العالم العربي من تقديم نفسه بأفضل صورة ممكنة، من خلال أدوات ذكية وقوالب احترافية تتوافق مع المعايير العالمية والمحلية.',
      points: [
        'تبسيط عملية إنشاء السيرة الذاتية',
        'توفير أدوات ذكاء اصطناعي متقدمة',
        'دعم كامل للغة العربية',
      ],
    },
    vision: {
      tag: 'رؤيتنا',
      title: 'إلى أين نتجه؟',
      desc: 'أن نكون المنصة الأولى والموثوقة لكل باحث عن عمل في المنطقة العربية، من خلال دمج التكنولوجيا المتطورة مع فهم عميق لاحتياجات سوق العمل المحلي والعالمي.',
      points: [
        'التوسع إلى +30 دولة',
        'بناء أكبر قاعدة بيانات وظيفية عربية',
        'تحقيق معدل توظيف +%90',
      ],
    },
    pillars: {
      tag: 'ما الذي يميزنا؟',
      title: 'ركائز قوتنا',
      items: [
        { icon: '⚡', title: 'تكنولوجيا متقدمة', desc: 'نستخدم أحدث تقنيات الذكاء الاصطناعي والواجهات الحديثة' },
        { icon: '🔒', title: 'أمان وموثوقية', desc: 'بياناتك محمية بأعلى معايير الأمان والخصوصية' },
        { icon: '✨', title: 'تجربة مستخدم فريدة', desc: 'واجهة سهلة وبديهية مصممة لراحتك' },
        { icon: '📈', title: 'تحسين مستمر', desc: 'نطور منصتنا باستمرار بناءً على ملاحظات المستخدمين' },
        { icon: '🌐', title: 'دعم متعدد اللغات', desc: 'دعم كامل للعربية والإنجليزية مع اتجاهات مثالية' },
        { icon: '🏆', title: 'معايير عالمية', desc: 'قوالب مصممة وفق أفضل الممارسات العالمية في التوظيف' },
      ],
    },
    cta: {
      title: 'ابدأ رحلتك معنا اليوم',
      sub: 'انضم لأكثر من 50,000 محترف بنوا مستقبلهم مع CV-Mister',
      btn: 'ابنِ سيرتك الذاتية مجاناً',
    },
  },
  en: {
    hero: {
      tag: 'About Us',
      title: "We're building the future of hiring",
      subtitle: 'A complete platform blending HR expertise with AI technology to help you land your dream job.',
    },
    stats: {
      tag: 'Our achievements',
      title: 'Numbers we are proud of',
      items: [
        { value: '50K+', label: 'Active users' },
        { value: '5M+', label: 'Resumes created' },
        { value: '15+', label: 'Countries' },
        { value: '98%', label: 'User satisfaction' },
      ],
    },
    timeline: {
      tag: 'How did it start?',
      title: 'Our journey',
      items: [
        {
          year: '2024',
          title: 'The idea',
          desc: 'We noticed that job seekers in the Arab world face significant challenges creating professional resumes that meet global standards.',
          icon: '💡',
        },
        {
          year: '2025',
          title: 'Platform launch',
          desc: 'We launched the first version of CV-Mister with full Arabic and English support and 5 professional templates.',
          icon: '🚀',
        },
        {
          year: '2026',
          title: 'AI integration',
          desc: 'We integrated advanced AI technologies to help users write professional content and automatically improve their resumes.',
          icon: '🤖',
        },
      ],
    },
    mission: {
      tag: 'Our Mission',
      title: 'Why we do this',
      desc: 'Empowering every job seeker in the Arab world to present themselves in the best possible way, through smart tools and professional templates that meet both global and local standards.',
      points: [
        'Simplifying the resume creation process',
        'Providing advanced AI writing tools',
        'Full Arabic language support',
      ],
    },
    vision: {
      tag: 'Our Vision',
      title: 'Where we are headed',
      desc: 'To be the first and most trusted platform for every job seeker in the Arab region, by merging advanced technology with a deep understanding of local and global job market needs.',
      points: [
        'Expanding to 30+ countries',
        'Building the largest Arabic job database',
        'Achieving a 90%+ employment rate',
      ],
    },
    pillars: {
      tag: 'What sets us apart',
      title: 'Our strengths',
      items: [
        { icon: '⚡', title: 'Advanced technology', desc: 'We use the latest AI technologies and modern interfaces' },
        { icon: '🔒', title: 'Security & reliability', desc: 'Your data is protected by the highest security and privacy standards' },
        { icon: '✨', title: 'Unique user experience', desc: 'An easy, intuitive interface designed for your comfort' },
        { icon: '📈', title: 'Continuous improvement', desc: 'We constantly develop our platform based on user feedback' },
        { icon: '🌐', title: 'Multi-language support', desc: 'Full Arabic and English support with perfect directionality' },
        { icon: '🏆', title: 'Global standards', desc: 'Templates designed according to the best global hiring practices' },
      ],
    },
    cta: {
      title: 'Start your journey with us today',
      sub: 'Join 50,000+ professionals who built their future with CV-Mister',
      btn: 'Build your resume — free',
    },
  },
};

export default function AboutPage() {
  const { isRTL } = useAuth();
  const t = isRTL ? content.ar : content.en;

  return (
    <div className="overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="relative py-36 flex items-center justify-center text-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 55%, #581c87 80%, #1e1b4b 100%)' }}
      >
        {/* Large soft orbs */}
        <div className="absolute" style={{
          top: '-20%', left: '-10%', width: '65vw', height: '65vw', maxWidth: 700, maxHeight: 700,
          background: 'radial-gradient(ellipse, rgba(139,92,246,0.5) 0%, rgba(99,102,241,0.15) 45%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
        <div className="absolute" style={{
          bottom: '-20%', right: '-8%', width: '55vw', height: '55vw', maxWidth: 620, maxHeight: 620,
          background: 'radial-gradient(ellipse, rgba(217,70,239,0.45) 0%, rgba(168,85,247,0.12) 45%, transparent 70%)',
          filter: 'blur(55px)',
          animationDelay: '3s',
        }} />
        <div className="absolute" style={{
          top: '30%', right: '15%', width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(56,189,248,0.2) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }} />

        {/* Shiny diagonal streak */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.04) 50%, transparent 65%)',
        }} />

        {/* Dot grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />

        {/* Fine grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />

        {/* Glowing rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" style={{
          width: 480, height: 480,
          border: '1px solid rgba(167,139,250,0.2)',
          boxShadow: '0 0 60px 8px rgba(139,92,246,0.12)',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none" style={{
          width: 680, height: 680,
          border: '1px solid rgba(167,139,250,0.08)',
        }} />

        {/* Floating shapes */}
        <div className="animate-float absolute top-[15%] left-[8%] w-14 h-14 rounded-2xl rotate-12"
          style={{ border: '1.5px solid rgba(167,139,250,0.4)', background: 'rgba(139,92,246,0.1)', animationDelay: '0s' }} />
        <div className="animate-float absolute top-[18%] right-[10%] w-9 h-9 rounded-full"
          style={{ border: '1.5px solid rgba(217,70,239,0.4)', background: 'rgba(217,70,239,0.1)', animationDelay: '1.8s' }} />
        <div className="animate-float absolute bottom-[18%] left-[14%] w-8 h-8 rounded-xl -rotate-12"
          style={{ border: '1.5px solid rgba(56,189,248,0.35)', background: 'rgba(56,189,248,0.08)', animationDelay: '3.2s' }} />
        <div className="animate-float absolute bottom-[22%] right-[9%] w-12 h-12 rounded-2xl rotate-45"
          style={{ border: '1.5px solid rgba(244,114,182,0.35)', background: 'rgba(244,114,182,0.08)', animationDelay: '2s' }} />
        <div className="animate-float absolute top-[50%] left-[4%] w-5 h-5 rounded-full"
          style={{ background: 'rgba(139,92,246,0.5)', animationDelay: '4s' }} />
        <div className="animate-float absolute top-[38%] right-[5%] w-4 h-4 rounded-full"
          style={{ background: 'rgba(217,70,239,0.5)', animationDelay: '1s' }} />

        {/* Horizontal glow line */}
        <div className="absolute left-0 right-0 h-px" style={{
          top: '50%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.3) 20%, rgba(217,70,239,0.5) 50%, rgba(139,92,246,0.3) 80%, transparent 100%)',
          transform: 'translateY(-60px)',
        }} />

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24" style={{
          background: 'linear-gradient(to top, rgba(30,27,75,0.6) 0%, transparent 100%)',
        }} />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6">

          {/* Badge */}
          <div className="flex justify-center mb-7 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold"
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#e0e7ff',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 24px rgba(139,92,246,0.25)',
              }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-300" />
              </span>
              {t.hero.tag}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-heading font-extrabold mb-6 leading-tight animate-slide-up"
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
              animationDelay: '0.1s',
              color: '#ffffff',
              textShadow: '0 0 60px rgba(139,92,246,0.5)',
            }}
          >
            {isRTL ? (
              <>
                نحن نبني{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 50%, #f9a8d4 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>مستقبل التوظيف</span>
              </>
            ) : (
              <>
                Building the{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #c4b5fd 0%, #f0abfc 50%, #f9a8d4 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>future</span>
                {' '}of hiring
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg leading-relaxed animate-slide-up max-w-2xl mx-auto"
            style={{ animationDelay: '0.2s', color: 'rgba(224,231,255,0.75)' }}>
            {t.hero.subtitle}
          </p>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-tag mx-auto mb-4">{t.stats.tag}</div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">{t.stats.title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {t.stats.items.map((s, i) => (
              <div
                key={i}
                className="relative rounded-3xl p-8 text-center overflow-hidden group card-hover"
                style={{
                  background: 'linear-gradient(135deg, #f8f9ff 0%, #f0eeff 100%)',
                  border: '1px solid rgba(99,102,241,0.12)',
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.05) 0%, rgba(192,38,211,0.05) 100%)' }}
                />
                <div className="stat-number mb-2">{s.value}</div>
                <div className="text-slate-500 font-medium text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Timeline ─────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-14">
            <div className="section-tag mx-auto mb-4">{t.timeline.tag}</div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">{t.timeline.title}</h2>
          </div>

          <div className="relative">
            {/* vertical line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 start-8 md:start-1/2 md:-translate-x-px"
              style={{ background: 'linear-gradient(to bottom, #c7d2fe, #f5d0fe)' }}
            />

            <div className="space-y-12">
              {t.timeline.items.map((item, i) => {
                const isRight = i % 2 === 0;
                return (
                  <div key={i} className={`relative flex items-start gap-6 md:gap-0 ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    {/* Content card — half width on md */}
                    <div className={`w-full md:w-5/12 ${isRight ? 'md:pe-10' : 'md:ps-10'} ms-16 md:ms-0`}>
                      <div
                        className="rounded-2xl p-6 group card-hover"
                        style={{
                          background: 'white',
                          border: '1px solid rgba(99,102,241,0.12)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        }}
                      >
                        <span
                          className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                          style={{
                            background: 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(192,38,211,0.12))',
                            color: '#4f46e5',
                          }}
                        >
                          {item.year}
                        </span>
                        <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    {/* Circle node */}
                    <div className="absolute start-8 md:start-1/2 md:-translate-x-1/2 -translate-y-0 flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md border-2 border-white"
                        style={{ background: 'linear-gradient(135deg, #4f46e5, #c026d3)' }}
                      >
                        {item.icon}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mission + Vision ─────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Mission */}
            <div
              className="rounded-3xl p-10 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #eef2ff 0%, #f0eeff 100%)',
                border: '1px solid rgba(99,102,241,0.15)',
              }}
            >
              <div
                className="orb absolute w-64 h-64 opacity-30 -top-16 -end-16"
                style={{ background: 'radial-gradient(circle, #a5b4fc, transparent)' }}
              />
              <div className="relative z-10">
                <div className="section-tag mb-5">{t.mission.tag}</div>
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">{t.mission.title}</h2>
                <p className="text-slate-600 leading-relaxed mb-6">{t.mission.desc}</p>
                <ul className="space-y-3">
                  {t.mission.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vision */}
            <div
              className="rounded-3xl p-10 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%)',
                border: '1px solid rgba(192,38,211,0.15)',
              }}
            >
              <div
                className="orb absolute w-64 h-64 opacity-25 -bottom-16 -start-16"
                style={{ background: 'radial-gradient(circle, #f0abfc, transparent)', animationDelay: '2s' }}
              />
              <div className="relative z-10">
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(192,38,211,0.12) 0%, rgba(217,70,239,0.08) 100%)',
                    color: '#a21caf',
                    border: '1px solid rgba(192,38,211,0.2)',
                  }}
                >
                  {t.vision.tag}
                </div>
                <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">{t.vision.title}</h2>
                <p className="text-slate-600 leading-relaxed mb-6">{t.vision.desc}</p>
                <ul className="space-y-3">
                  {t.vision.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg, #c026d3, #e879f9)' }}
                      >
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700 font-medium">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pillars ──────────────────────────────────────────────────── */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 100%)' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="section-tag mx-auto mb-4">{t.pillars.tag}</div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-900">{t.pillars.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.pillars.items.map((item, i) => (
              <div
                key={i}
                className="group p-7 rounded-2xl card-hover"
                style={{
                  background: 'white',
                  border: '1px solid rgba(99,102,241,0.1)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(192,38,211,0.1))' }}
                >
                  {item.icon}
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div
          className="orb absolute w-96 h-96 opacity-20 -top-24 -start-24"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }}
        />
        <div
          className="orb absolute w-80 h-80 opacity-15 -bottom-20 -end-20"
          style={{ background: 'radial-gradient(circle, #c026d3, transparent)', animationDelay: '3s' }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">{t.cta.title}</h2>
          <p className="text-slate-400 mb-8 text-lg">{t.cta.sub}</p>
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-lg transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #c026d3 100%)',
              boxShadow: '0 8px 30px rgba(79,70,229,0.4)',
            }}
          >
            {t.cta.btn}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
