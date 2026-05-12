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
        { year: '2024', title: 'بداية الفكرة', desc: 'لاحظنا أن الباحثين عن عمل في العالم العربي يواجهون تحديات كبيرة في إنشاء سير ذاتية احترافية تتوافق مع المعايير العالمية.', icon: '💡' },
        { year: '2025', title: 'إطلاق المنصة', desc: 'أطلقنا النسخة الأولى من CV-Mister مع دعم كامل للعربية والإنجليزية و5 قوالب احترافية.', icon: '🚀' },
        { year: '2026', title: 'الذكاء الاصطناعي', desc: 'دمجنا تقنيات الذكاء الاصطناعي المتقدمة لمساعدة المستخدمين في كتابة محتوى احترافي وتحسين سيرهم الذاتية تلقائياً.', icon: '🤖' },
      ],
    },
    mission: { tag: 'مهمتنا', title: 'لماذا نفعل ذلك؟', desc: 'تمكين كل باحث عن عمل في العالم العربي من تقديم نفسه بأفضل صورة ممكنة، من خلال أدوات ذكية وقوالب احترافية تتوافق مع المعايير العالمية والمحلية.', points: ['تبسيط عملية إنشاء السيرة الذاتية', 'توفير أدوات ذكاء اصطناعي متقدمة', 'دعم كامل للغة العربية'] },
    vision: { tag: 'رؤيتنا', title: 'إلى أين نتجه؟', desc: 'أن نكون المنصة الأولى والموثوقة لكل باحث عن عمل في المنطقة العربية، من خلال دمج التكنولوجيا المتطورة مع فهم عميق لاحتياجات سوق العمل المحلي والعالمي.', points: ['التوسع إلى +30 دولة', 'بناء أكبر قاعدة بيانات وظيفية عربية', 'تحقيق معدل توظيف +%90'] },
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
    cta: { title: 'ابدأ رحلتك معنا اليوم', sub: 'انضم لأكثر من 50,000 محترف بنوا مستقبلهم مع CV-Mister', btn: 'ابنِ سيرتك الذاتية مجاناً' },
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
        { year: '2024', title: 'The idea', desc: 'We noticed that job seekers in the Arab world face significant challenges creating professional resumes that meet global standards.', icon: '💡' },
        { year: '2025', title: 'Platform launch', desc: 'We launched the first version of CV-Mister with full Arabic and English support and 5 professional templates.', icon: '🚀' },
        { year: '2026', title: 'AI integration', desc: 'We integrated advanced AI technologies to help users write professional content and automatically improve their resumes.', icon: '🤖' },
      ],
    },
    mission: { tag: 'Our Mission', title: 'Why we do this', desc: 'Empowering every job seeker in the Arab world to present themselves in the best possible way, through smart tools and professional templates that meet both global and local standards.', points: ['Simplifying the resume creation process', 'Providing advanced AI writing tools', 'Full Arabic language support'] },
    vision: { tag: 'Our Vision', title: 'Where we are headed', desc: 'To be the first and most trusted platform for every job seeker in the Arab region, by merging advanced technology with a deep understanding of local and global job market needs.', points: ['Expanding to 30+ countries', 'Building the largest Arabic job database', 'Achieving a 90%+ employment rate'] },
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
    cta: { title: 'Start your journey with us today', sub: 'Join 50,000+ professionals who built their future with CV-Mister', btn: 'Build your resume — free' },
  },
};

const BG = {
  background: 'linear-gradient(135deg, #0f0c29 0%, #1a1040 30%, #24243e 60%, #0f0c29 100%)',
};

const glassDark = {
  background: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.10)',
};

const glassCard = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.10)',
};

function SectionTag({ children, purple }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold mb-4"
      style={{
        background: purple
          ? 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.15))'
          : 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))',
        color: purple ? '#e879f9' : '#a78bfa',
        border: `1px solid ${purple ? 'rgba(168,85,247,0.3)' : 'rgba(99,102,241,0.3)'}`,
      }}>
      {children}
    </span>
  );
}

export default function AboutPage() {
  const { isRTL } = useAuth();
  const t = isRTL ? content.ar : content.en;

  return (
    <div className="overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'} style={BG}>

      {/* shared background layers rendered once, sticky */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 20% 20%, rgba(99,102,241,0.28) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 55% at 80% 80%, rgba(168,85,247,0.22) 0%, transparent 55%)' }} />
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(99,102,241,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.07) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
      </div>

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center justify-center text-center overflow-hidden"
        style={{ zIndex: 1, background: 'linear-gradient(160deg, #06040f 0%, #0e0822 40%, #160d30 70%, #06040f 100%)' }}>

        {/* Deep aurora layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Primary spotlight — top left indigo */}
          <div className="absolute" style={{
            top: '-10%', left: '-5%', width: '70vw', height: '70vw', maxWidth: 900, maxHeight: 900,
            background: 'radial-gradient(ellipse, rgba(79,70,229,0.55) 0%, rgba(99,102,241,0.2) 35%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
          {/* Secondary spotlight — bottom right violet */}
          <div className="absolute" style={{
            bottom: '-15%', right: '-5%', width: '65vw', height: '65vw', maxWidth: 850, maxHeight: 850,
            background: 'radial-gradient(ellipse, rgba(139,92,246,0.5) 0%, rgba(168,85,247,0.18) 40%, transparent 70%)',
            filter: 'blur(50px)',
            animationDelay: '3s',
          }} />
          {/* Center cyan glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{
              width: '50vw', height: '30vw', maxWidth: 600, maxHeight: 360,
              background: 'radial-gradient(ellipse, rgba(56,189,248,0.12) 0%, transparent 70%)',
              filter: 'blur(30px)',
            }} />
          </div>
          {/* Pink accent — mid left */}
          <div className="absolute" style={{
            top: '40%', left: '10%', width: 300, height: 300,
            background: 'radial-gradient(circle, rgba(236,72,153,0.18) 0%, transparent 70%)',
            filter: 'blur(25px)',
            animationDelay: '5s',
          }} />

          {/* Aurora streak lines */}
          <div className="absolute inset-0" style={{
            background: `
              linear-gradient(105deg, transparent 30%, rgba(99,102,241,0.07) 50%, transparent 70%),
              linear-gradient(75deg,  transparent 20%, rgba(139,92,246,0.06) 45%, transparent 65%)
            `,
          }} />

          {/* Fine grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }} />

          {/* Dot matrix */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }} />

          {/* Glowing ring behind heading */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{
            width: 520, height: 520,
            border: '1px solid rgba(139,92,246,0.15)',
            borderRadius: '50%',
            boxShadow: '0 0 80px 10px rgba(99,102,241,0.1)',
          }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{
            width: 750, height: 750,
            border: '1px solid rgba(139,92,246,0.07)',
            borderRadius: '50%',
          }} />

          {/* Floating geometric shapes */}
          <div className="animate-float absolute top-[14%] left-[7%] w-16 h-16 rounded-2xl rotate-12"
            style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.06)', animationDelay: '0s' }} />
          <div className="animate-float absolute top-[20%] right-[9%] w-10 h-10 rounded-full"
            style={{ border: '1px solid rgba(168,85,247,0.35)', background: 'rgba(168,85,247,0.08)', animationDelay: '1.5s' }} />
          <div className="animate-float absolute bottom-[22%] left-[12%] w-8 h-8 rounded-xl -rotate-6"
            style={{ border: '1px solid rgba(56,189,248,0.25)', background: 'rgba(56,189,248,0.07)', animationDelay: '3s' }} />
          <div className="animate-float absolute bottom-[28%] right-[11%] w-14 h-14 rounded-2xl rotate-45"
            style={{ border: '1px solid rgba(236,72,153,0.25)', background: 'rgba(236,72,153,0.06)', animationDelay: '2s' }} />
          <div className="animate-float absolute top-[55%] left-[4%] w-5 h-5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.4)', animationDelay: '4s' }} />
          <div className="animate-float absolute top-[35%] right-[4%] w-4 h-4 rounded-full"
            style={{ background: 'rgba(168,85,247,0.4)', animationDelay: '1s' }} />
          <div className="animate-float absolute top-[72%] right-[18%] w-6 h-6 rounded-lg rotate-12"
            style={{ border: '1px solid rgba(56,189,248,0.3)', animationDelay: '2.5s' }} />

          {/* Horizontal glow line */}
          <div className="absolute left-0 right-0" style={{
            top: '50%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.25) 20%, rgba(168,85,247,0.45) 50%, rgba(99,102,241,0.25) 80%, transparent 100%)',
            transform: 'translateY(-80px)',
          }} />

          {/* Bottom gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-32" style={{
            background: 'linear-gradient(to top, rgba(6,4,15,0.8) 0%, transparent 100%)',
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6">

          {/* Badge */}
          <div className="animate-fade-in flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold"
              style={{
                background: 'rgba(99,102,241,0.15)',
                border: '1px solid rgba(99,102,241,0.35)',
                color: '#a5b4fc',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 20px rgba(99,102,241,0.2)',
              }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
              </span>
              {t.hero.tag}
            </span>
          </div>

          {/* Headline — Syne font */}
          <h1
            className="font-extrabold text-white mb-6 leading-[1.08] animate-slide-up"
            style={{
              fontFamily: "'Syne', 'Cairo', sans-serif",
              fontSize: 'clamp(2.6rem, 6.5vw, 5.2rem)',
              animationDelay: '0.1s',
              letterSpacing: isRTL ? '0' : '-0.02em',
              textShadow: '0 0 80px rgba(139,92,246,0.4)',
            }}
          >
            {isRTL ? (
              <>
                نحن نبني{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>مستقبل التوظيف</span>
              </>
            ) : (
              <>
                Building the{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>future</span>
                <br />of hiring
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl leading-relaxed animate-slide-up max-w-2xl mx-auto mb-12"
            style={{ animationDelay: '0.2s', color: 'rgba(203,213,225,0.8)', fontFamily: "'Space Grotesk', 'Tajawal', sans-serif" }}>
            {t.hero.subtitle}
          </p>

          {/* Scroll hint */}
          <div className="animate-fade-in flex flex-col items-center gap-2" style={{ animationDelay: '0.5s' }}>
            <span className="text-xs tracking-widest uppercase" style={{ color: 'rgba(148,163,184,0.6)', fontFamily: "'Syne', sans-serif" }}>
              {isRTL ? 'اكتشف المزيد' : 'Discover more'}
            </span>
            <div className="w-px h-10 rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(139,92,246,0.7), transparent)' }} />
          </div>
        </div>
      </section>

      {/* ─── Stats ────────────────────────────────────────────────────── */}
      <section className="relative py-20" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex justify-center"><SectionTag>{t.stats.tag}</SectionTag></div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">{t.stats.title}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {t.stats.items.map((s, i) => (
              <div key={i} className="rounded-3xl p-8 text-center overflow-hidden group card-hover" style={glassCard}>
                <div className="text-3xl font-heading font-extrabold mb-2"
                  style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>{s.value}</div>
                <div className="text-sm font-medium" style={{ color: 'rgba(148,163,184,0.9)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Timeline ─────────────────────────────────────────────────── */}
      <section className="relative py-20" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <div className="text-center mb-14">
            <div className="flex justify-center"><SectionTag>{t.timeline.tag}</SectionTag></div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">{t.timeline.title}</h2>
          </div>

          <div className="relative">
            <div className="absolute top-0 bottom-0 w-0.5 start-8 md:start-1/2 md:-translate-x-px"
              style={{ background: 'linear-gradient(to bottom, rgba(99,102,241,0.6), rgba(168,85,247,0.6))' }} />

            <div className="space-y-12">
              {t.timeline.items.map((item, i) => {
                const isRight = i % 2 === 0;
                return (
                  <div key={i} className={`relative flex items-start gap-6 md:gap-0 ${isRight ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`w-full md:w-5/12 ${isRight ? 'md:pe-10' : 'md:ps-10'} ms-16 md:ms-0`}>
                      <div className="rounded-2xl p-6 group card-hover" style={glassCard}>
                        <span className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-3"
                          style={{ background: 'rgba(99,102,241,0.2)', color: '#a78bfa', border: '1px solid rgba(99,102,241,0.3)' }}>
                          {item.year}
                        </span>
                        <h3 className="font-heading font-bold text-white text-lg mb-2">{item.title}</h3>
                        <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.85)' }}>{item.desc}</p>
                      </div>
                    </div>
                    <div className="absolute start-8 md:start-1/2 md:-translate-x-1/2 flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg border-2"
                        style={{ background: 'linear-gradient(135deg, #4f46e5, #a855f7)', borderColor: 'rgba(255,255,255,0.15)' }}>
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
      <section className="relative py-20" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Mission */}
            <div className="rounded-3xl p-10 relative overflow-hidden"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <div className="orb absolute w-64 h-64 opacity-30 -top-16 -end-16"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.6), transparent)' }} />
              <div className="relative z-10">
                <div className="flex"><SectionTag>{t.mission.tag}</SectionTag></div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">{t.mission.title}</h2>
                <p className="leading-relaxed mb-6" style={{ color: 'rgba(203,213,225,0.85)' }}>{t.mission.desc}</p>
                <ul className="space-y-3">
                  {t.mission.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}>
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium" style={{ color: 'rgba(226,232,240,0.9)' }}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Vision */}
            <div className="rounded-3xl p-10 relative overflow-hidden"
              style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
              <div className="orb absolute w-64 h-64 opacity-25 -bottom-16 -start-16"
                style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.6), transparent)', animationDelay: '2s' }} />
              <div className="relative z-10">
                <div className="flex"><SectionTag purple>{t.vision.tag}</SectionTag></div>
                <h2 className="text-2xl font-heading font-bold text-white mb-4">{t.vision.title}</h2>
                <p className="leading-relaxed mb-6" style={{ color: 'rgba(203,213,225,0.85)' }}>{t.vision.desc}</p>
                <ul className="space-y-3">
                  {t.vision.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)' }}>
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-medium" style={{ color: 'rgba(226,232,240,0.9)' }}>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pillars ──────────────────────────────────────────────────── */}
      <section className="relative py-20" style={{ zIndex: 1 }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex justify-center"><SectionTag>{t.pillars.tag}</SectionTag></div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">{t.pillars.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.pillars.items.map((item, i) => (
              <div key={i} className="group p-7 rounded-2xl card-hover transition-all duration-300"
                style={{
                  ...glassCard,
                  boxShadow: '0 2px 20px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; e.currentTarget.style.borderColor = 'rgba(167,139,250,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'; }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(99,102,241,0.2)' }}>
                  {item.icon}
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(148,163,184,0.85)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden" style={{ zIndex: 1 }}>
        <div className="absolute inset-0" style={{ background: 'rgba(99,102,241,0.08)', borderTop: '1px solid rgba(99,102,241,0.15)', borderBottom: '1px solid rgba(99,102,241,0.15)' }} />
        <div className="orb absolute w-[500px] h-[500px] opacity-30 -top-32 -start-24"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5), transparent)' }} />
        <div className="orb absolute w-[400px] h-[400px] opacity-20 -bottom-24 -end-20"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.5), transparent)', animationDelay: '3s' }} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">{t.cta.title}</h2>
          <p className="mb-8 text-lg" style={{ color: 'rgba(148,163,184,0.9)' }}>{t.cta.sub}</p>
          <Link
            to="/builder"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-lg transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #a855f7 100%)',
              boxShadow: '0 8px 32px rgba(99,102,241,0.45)',
            }}
          >
            {t.cta.btn}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={isRTL ? 'M11 17l-5-5m0 0l5-5m-5 5h12' : 'M13 7l5 5m0 0l-5 5m5-5H6'} />
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
