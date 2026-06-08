/**
 * GET /api/verify-pagination
 *
 * Fast server-side verification — tests all 38 templates with comprehensive
 * multi-page CV data.  Skips PDF generation (SSR + measureBreaks only) for
 * speed.  Returns JSON with per-template break positions, page counts, and
 * quality metrics.
 */

import { buildAtsHtmlFromReact } from '../api/_lib/atsReactRenderer.js';
import { measureBreaks }          from '../api/_lib/puppeteerPdf.js';

// ── Comprehensive English test CV — forces 3+ pages ──────────────────────────
const EN_CV = {
  personalInfo: {
    fullName: 'Alexandra Johnson',
    jobTitle: 'Senior Software Engineer',
    email: 'alexandra.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexandrajohnson',
    github: 'github.com/alexandrajohnson',
    website: 'alexandrajohnson.dev',
    summary: 'Experienced software engineer with 10+ years of expertise designing, developing, and maintaining large-scale distributed systems. Proficient in microservices architecture, cloud platforms (AWS, GCP), and modern frontend frameworks. Proven track record leading cross-functional teams to deliver complex projects on time and within budget. Passionate about code quality, performance optimisation, and developer experience. Strong advocate for test-driven development and continuous integration best practices.',
  },
  experience: [
    {
      company: 'TechCorp Global Solutions Inc.',
      position: 'Staff Software Engineer',
      startDate: '2021-01', endDate: '', current: true,
      description: '• Led design and implementation of a next-generation microservices platform serving 50M+ daily active users, reducing latency by 40%\n• Architected a real-time data pipeline using Apache Kafka and Apache Flink processing 2 TB of data daily\n• Mentored team of 12 engineers through weekly 1:1s, code reviews, and technical presentations\n• Drove adoption of platform engineering best practices, reducing deployment time from 2 hours to 8 minutes\n• Collaborated with product managers and designers to define technical roadmaps for 3 major product lines\n• Implemented comprehensive monitoring using Prometheus, Grafana, and distributed tracing with Jaeger',
    },
    {
      company: 'StartupXYZ Inc.',
      position: 'Senior Software Engineer',
      startDate: '2018-03', endDate: '2020-12', current: false,
      description: '• Built and launched a B2B SaaS platform from scratch, growing to $5M ARR within 18 months\n• Designed and implemented a multi-tenant PostgreSQL architecture supporting 500+ enterprise clients\n• Led migration from monolith to microservices, decomposing 400K LOC codebase into 35 services\n• Implemented CI/CD pipeline using GitHub Actions, Docker, and Kubernetes on AWS EKS\n• Developed GraphQL API serving 10,000+ requests per second with 99.99% uptime SLA\n• Optimised database queries reducing average API response time from 800 ms to 45 ms',
    },
    {
      company: 'MegaCorp Technology Division',
      position: 'Software Engineer II',
      startDate: '2015-06', endDate: '2018-02', current: false,
      description: '• Developed customer-facing features for enterprise CRM platform used by 10,000+ businesses worldwide\n• Built real-time collaboration features using WebSockets and operational transforms\n• Designed and implemented RESTful APIs consumed by 3 mobile applications and 2 web applications\n• Contributed to open-source projects with 500+ GitHub stars\n• Participated in on-call rotations managing incident response for critical production systems\n• Improved test coverage from 45% to 92% across the codebase',
    },
    {
      company: 'Digital Agency Partners LLC',
      position: 'Junior Software Engineer',
      startDate: '2013-08', endDate: '2015-05', current: false,
      description: '• Developed responsive web applications for 20+ clients across retail, healthcare, and finance sectors\n• Built custom CMS themes and plugins for small and medium business clients\n• Implemented e-commerce solutions integrating multiple payment gateways\n• Created data visualisation dashboards using D3.js and Chart.js\n• Maintained and updated legacy PHP and Java applications',
    },
    {
      company: 'FreelanceTech Solutions',
      position: 'Freelance Developer',
      startDate: '2012-01', endDate: '2013-07', current: false,
      description: '• Designed and built custom web applications for 15+ clients across various industries\n• Developed mobile-responsive landing pages with A/B testing and conversion optimisation\n• Created REST APIs integrating with third-party payment gateways (Stripe, PayPal, Braintree)\n• Provided technical consulting and code reviews for early-stage startups',
    },
  ],
  education: [
    {
      school: 'University of California, Berkeley',
      degree: "Bachelor's Degree", field: 'Computer Science',
      startDate: '2008-09', endDate: '2012-06',
      description: "GPA 3.89/4.0 • Dean's Honor List (4 semesters) • ACM Programming finalist • TA for Data Structures",
    },
    {
      school: 'Stanford Online / Coursera',
      degree: 'Certificate', field: 'Machine Learning and Deep Learning Specialisation',
      startDate: '2019-01', endDate: '2019-06',
      description: 'Completed 5-course specialisation covering neural networks, CNNs, RNNs, and practical deep learning applications',
    },
    {
      school: 'AWS Training and Certification',
      degree: 'Professional Certification', field: 'AWS Solutions Architect Professional',
      startDate: '2020-03', endDate: '2020-03',
      description: 'Scored in top 10% of exam candidates globally',
    },
  ],
  skills: [
    { name: 'JavaScript / TypeScript', level: 5 },
    { name: 'Python', level: 5 },
    { name: 'Go', level: 4 },
    { name: 'Java', level: 4 },
    { name: 'React / Next.js', level: 5 },
    { name: 'Node.js', level: 5 },
    { name: 'GraphQL', level: 4 },
    { name: 'PostgreSQL / MySQL', level: 5 },
    { name: 'MongoDB / Redis', level: 4 },
    { name: 'AWS (EC2, S3, Lambda, RDS)', level: 5 },
    { name: 'Docker / Kubernetes', level: 4 },
    { name: 'Apache Kafka / RabbitMQ', level: 4 },
    { name: 'Terraform / Infrastructure as Code', level: 3 },
    { name: 'Machine Learning / TensorFlow', level: 3 },
    { name: 'System Design / Architecture', level: 5 },
  ],
  languages: [
    { language: 'English', proficiency: 'Native' },
    { language: 'Spanish', proficiency: 'Professional Working Proficiency' },
    { language: 'Mandarin', proficiency: 'Elementary' },
  ],
  projects: [
    {
      name: 'Open Source Distributed Cache Library',
      description: 'Published an open-source distributed caching library for Node.js with 2,000+ GitHub stars, supporting Redis Cluster, Memcached, and in-memory backends with automatic failover and circuit breaking',
      technologies: 'Node.js, TypeScript, Redis, Docker',
      link: 'github.com/alexandrajohnson/distcache',
    },
    {
      name: 'Real-Time Analytics Dashboard',
      description: 'Developed a real-time analytics dashboard processing 500K events/second using Apache Kafka and React with WebSocket live updates. Featured in InfoQ; received 3,000+ GitHub stars',
      technologies: 'Apache Kafka, Apache Flink, React, WebSockets, ClickHouse',
      link: 'github.com/alexandrajohnson/rt-analytics',
    },
    {
      name: 'AI-Powered Code Review Assistant',
      description: 'AI-powered code review tool integrating with GitHub PRs, using GPT-4 to identify bugs, security vulnerabilities, and suggest improvements. Used by 500+ developers daily',
      technologies: 'Python, FastAPI, OpenAI API, GitHub Actions, PostgreSQL',
      link: 'github.com/alexandrajohnson/ai-reviewer',
    },
  ],
};

// ── Comprehensive Arabic test CV — forces 2+ pages ────────────────────────────
const AR_CV = {
  personalInfo: {
    fullName: 'محمد عبدالرحمن الأحمدي',
    jobTitle: 'مهندس برمجيات أول',
    email: 'mohammed.alahmadi@example.com',
    phone: '+966 50 123 4567',
    location: 'الرياض، المملكة العربية السعودية',
    linkedin: 'linkedin.com/in/mohammedalahmadi',
    summary: 'مهندس برمجيات ذو خبرة تزيد عن 10 سنوات في تصميم وتطوير وصيانة الأنظمة الموزعة على نطاق واسع. متخصص في بنية الخدمات المصغرة والمنصات السحابية وأطر العمل الحديثة للواجهات الأمامية. سجل حافل في قيادة فرق متعددة التخصصات لتسليم مشاريع معقدة في الوقت المحدد وضمن الميزانية المقررة.',
  },
  experience: [
    {
      company: 'شركة تقنية السعودية المتقدمة',
      position: 'مهندس برمجيات رئيسي',
      startDate: '2021-01', endDate: '', current: true,
      description: '• قيادة تصميم وتنفيذ منصة الخدمات المصغرة من الجيل التالي التي تخدم أكثر من 50 مليون مستخدم نشط يومياً مما أدى إلى تقليل زمن الاستجابة بنسبة 40٪\n• تصميم خط بيانات في الوقت الفعلي باستخدام Apache Kafka وApache Flink لمعالجة 2 تيرابايت من البيانات يومياً\n• الإشراف وتوجيه فريق مكون من 12 مهندساً من خلال اجتماعات أسبوعية ومراجعات الكود والعروض التقنية\n• قيادة اعتماد أفضل ممارسات هندسة المنصات مما أدى إلى تقليل وقت النشر من ساعتين إلى 8 دقائق',
    },
    {
      company: 'شركة الحلول الرقمية المتكاملة',
      position: 'مهندس برمجيات أول',
      startDate: '2018-03', endDate: '2020-12', current: false,
      description: '• بناء وإطلاق منصة SaaS للشركات من الصفر ونموها لتحقيق إيرادات سنوية بقيمة 5 ملايين دولار خلال 18 شهراً\n• تصميم وتنفيذ بنية PostgreSQL متعددة المستأجرين تدعم أكثر من 500 عميل مؤسسي\n• قيادة الهجرة من النظام الأحادي إلى الخدمات المصغرة مع تقسيم قاعدة الكود البالغة 400 ألف سطر إلى 35 خدمة\n• تطوير واجهة برمجة تطبيقات GraphQL تخدم أكثر من 10000 طلب في الثانية بنسبة توفر 99.99٪',
    },
    {
      company: 'مجموعة تقنية المعلومات الخليجية',
      position: 'مهندس برمجيات',
      startDate: '2015-06', endDate: '2018-02', current: false,
      description: '• تطوير ميزات تواجه العملاء لمنصة إدارة علاقات العملاء المستخدمة من قبل أكثر من 10000 شركة حول العالم\n• بناء ميزات التعاون في الوقت الفعلي باستخدام WebSockets والتحويلات التشغيلية\n• تصميم وتنفيذ واجهات برمجة التطبيقات RESTful التي تستهلكها تطبيقات جوال وويب متعددة\n• تحسين تغطية الاختبارات من 45٪ إلى 92٪ في قاعدة الكود',
    },
    {
      company: 'شركة الابتكار التقني',
      position: 'مطور ويب',
      startDate: '2013-08', endDate: '2015-05', current: false,
      description: '• تطوير تطبيقات ويب متجاوبة لأكثر من 20 عميلاً في قطاعات التجزئة والرعاية الصحية والتمويل\n• بناء حلول التجارة الإلكترونية وبوابات الدفع الإلكتروني المتعددة\n• إنشاء لوحات معلومات تصور البيانات للمديرين التنفيذيين',
    },
  ],
  education: [
    {
      school: 'جامعة الملك فهد للبترول والمعادن',
      degree: 'بكالوريوس', field: 'علوم الحاسوب وهندسة البرمجيات',
      startDate: '2008-09', endDate: '2012-06',
      description: 'المعدل التراكمي: 3.89 من 4.0 • قائمة عميد الكلية (4 فصول دراسية) • رسالة التخرج حول الأنظمة الموزعة',
    },
    {
      school: 'معهد الملك عبدالله للتقنية',
      degree: 'ماجستير', field: 'الذكاء الاصطناعي وتعلم الآلة',
      startDate: '2016-09', endDate: '2018-06',
      description: 'التخصص في التعلم العميق ومعالجة اللغات الطبيعية وتطبيقات الرؤية الحاسوبية في الصناعة',
    },
  ],
  skills: [
    { name: 'JavaScript / TypeScript', level: 5 },
    { name: 'Python', level: 5 },
    { name: 'React / Next.js', level: 5 },
    { name: 'Node.js', level: 5 },
    { name: 'قواعد البيانات SQL/NoSQL', level: 4 },
    { name: 'AWS / خدمات سحابية', level: 4 },
    { name: 'Docker / Kubernetes', level: 4 },
    { name: 'تعلم الآلة / TensorFlow', level: 3 },
    { name: 'تصميم أنظمة موزعة', level: 5 },
    { name: 'قيادة الفرق التقنية', level: 4 },
  ],
  languages: [
    { language: 'العربية', proficiency: 'اللغة الأم' },
    { language: 'الإنجليزية', proficiency: 'متقدم (C1)' },
    { language: 'الفرنسية', proficiency: 'مبتدئ' },
  ],
  projects: [
    {
      name: 'نظام إدارة الوثائق الذكي',
      description: 'تطوير نظام ذكي لإدارة الوثائق الحكومية يستخدم تقنيات الذكاء الاصطناعي للتصنيف التلقائي والبحث الدلالي. النظام يخدم أكثر من 1000 موظف حكومي ويعالج آلاف الوثائق يومياً',
      technologies: 'Python, FastAPI, Elasticsearch, React, Docker',
      link: '',
    },
    {
      name: 'منصة التعليم الإلكتروني التفاعلية',
      description: 'بناء منصة تعليمية تفاعلية مكتملة باستخدام React وNode.js تدعم الفيديو المباشر والاختبارات التفاعلية وتتبع التقدم مع دعم كامل للغة العربية',
      technologies: 'React, Node.js, PostgreSQL, WebRTC, Redis',
      link: '',
    },
  ],
};

// ── Shared defaults ───────────────────────────────────────────────────────────
const DEF_VISIBLE = {
  summary: true, experience: true, education: true,
  skills: true, projects: true, languages: true,
};
const DEF_FIELDS  = {
  photo: false, email: true, phone: true,
  location: true, linkedin: true, github: true, website: true,
};
const DEF_ORDER = ['summary','experience','education','skills','projects','languages'];

// ── All 38 templates ──────────────────────────────────────────────────────────
const TEMPLATES = [
  // ATS Single-Column (9)
  { id: 'atsclean',          cat: 'ATS',            rtl: false },
  { id: 'atspro',            cat: 'ATS',            rtl: false },
  { id: 'atssimple',         cat: 'ATS',            rtl: false },
  { id: 'atsbold',           cat: 'ATS',            rtl: false },
  { id: 'atscompact',        cat: 'ATS',            rtl: false },
  { id: 'atsmodern',         cat: 'ATS',            rtl: false },
  { id: 'atsharvard',        cat: 'ATS',            rtl: false },
  { id: 'atscenter',         cat: 'ATS',            rtl: false },
  { id: 'atselegant',        cat: 'ATS',            rtl: false },
  // Modern Single-Column English (14)
  { id: 'modern',            cat: 'Modern-EN',      rtl: false },
  { id: 'classic',           cat: 'Modern-EN',      rtl: false },
  { id: 'creative',          cat: 'Modern-EN',      rtl: false },
  { id: 'minimal',           cat: 'Modern-EN',      rtl: false },
  { id: 'executive',         cat: 'Modern-EN',      rtl: false },
  { id: 'prestige',          cat: 'Modern-EN',      rtl: false },
  { id: 'mercuryflow',       cat: 'Modern-EN',      rtl: false },
  { id: 'editorialrule',     cat: 'Modern-EN',      rtl: false },
  { id: 'tealpro',           cat: 'Modern-EN',      rtl: false },
  { id: 'roseelegant',       cat: 'Modern-EN',      rtl: false },
  { id: 'velvet',            cat: 'Modern-EN',      rtl: false },
  { id: 'aurora',            cat: 'Modern-EN',      rtl: false },
  { id: 'englishhorizon',    cat: 'Modern-EN',      rtl: false },
  { id: 'englishapex',       cat: 'Modern-EN',      rtl: false },
  // English Sidebar/Two-Column (4)
  { id: 'classicserif',      cat: 'Sidebar-EN',     rtl: false },
  { id: 'atlanticblue',      cat: 'Sidebar-EN',     rtl: false },
  { id: 'sidebarlight',      cat: 'Sidebar-EN',     rtl: false },
  { id: 'darkheader',        cat: 'Sidebar-EN',     rtl: false },
  // Arabic Single-Column (3)
  { id: 'arabicmodern',      cat: 'Arabic-SC',      rtl: true  },
  { id: 'arabicwave',        cat: 'Arabic-SC',      rtl: true  },
  { id: 'arabiczafir',       cat: 'Arabic-SC',      rtl: true  },
  // Arabic Sidebar/Two-Column (6)
  { id: 'arabicgem',         cat: 'Arabic-Sidebar', rtl: true  },
  { id: 'arabicnavy',        cat: 'Arabic-Sidebar', rtl: true  },
  { id: 'arabicpro',         cat: 'Arabic-Sidebar', rtl: true  },
  { id: 'arabictealsidebar', cat: 'Arabic-Sidebar', rtl: true  },
  { id: 'arabicslatesidebar',cat: 'Arabic-Sidebar', rtl: true  },
  { id: 'arabiccard',        cat: 'Arabic-Sidebar', rtl: true  },
  // Arabic Hybrid (2)
  { id: 'arabicelite',       cat: 'Arabic-Hybrid',  rtl: true  },
  { id: 'arabicluxe',        cat: 'Arabic-Hybrid',  rtl: true  },
];

// ── Verify one template ───────────────────────────────────────────────────────
async function verifyOne(templateId, cvData, isRTL) {
  const options = {
    templateId, isRTL,
    theme: {},
    visibleSections:       DEF_VISIBLE,
    visiblePersonalFields: DEF_FIELDS,
    sectionOrder:          DEF_ORDER,
    sectionNames:          {},
    pageBreaks:  [],
    totalHeight: 1122,
  };

  let singlePageHtml;
  try {
    singlePageHtml = await buildAtsHtmlFromReact(cvData, options);
  } catch (err) {
    return { status: 'SSR_ERROR', error: err.message.slice(0, 200) };
  }

  let breaks = [], totalHeight = 1122, pageReport = [];
  try {
    const r = await measureBreaks(singlePageHtml);
    breaks       = r.breaks;
    totalHeight  = r.totalHeight;
    pageReport   = r.pageReport || [];
  } catch (err) {
    return { status: 'MEASURE_ERROR', error: err.message.slice(0, 200) };
  }

  const pageCount     = breaks.length + 1;
  const maxGap        = pageReport.length > 0
    ? Math.max(...pageReport.map(r => r.bottomGap)) : 0;
  const gapViolations = pageReport.filter(r => !r.gapOk).length;
  const lastBreak     = breaks[breaks.length - 1] ?? 0;
  const phantomRisk   = breaks.length > 0 && (totalHeight - lastBreak) < 50;

  // Check dead-zone: all breaks must satisfy sliceHeight ≤ 1059 (pages 2+)
  let deadZoneRisk = false;
  for (let i = 1; i < breaks.length; i++) {
    const slice = breaks[i] - breaks[i - 1];
    if (slice > 1059) { deadZoneRisk = true; break; }
  }

  return {
    status: 'OK',
    pageCount,
    totalHeight: Math.round(totalHeight),
    breaks: breaks.map(b => Math.round(b)),
    maxBottomGapPx: Math.round(maxGap),
    gapViolations,
    phantomRisk,
    deadZoneRisk,
  };
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'GET only' });

  const t0 = Date.now();
  const results = [];

  console.log(`\n[Verify] ════ Starting verification of ${TEMPLATES.length} templates ════`);

  for (const tmpl of TEMPLATES) {
    const cvData = tmpl.rtl ? AR_CV : EN_CV;
    const t1 = Date.now();
    const r  = await verifyOne(tmpl.id, cvData, tmpl.rtl);
    const ms = Date.now() - t1;

    const row = { id: tmpl.id, cat: tmpl.cat, rtl: tmpl.rtl, ms, ...r };
    results.push(row);

    const icon = r.status === 'OK' ? '✓' : '✗';
    const detail = r.status === 'OK'
      ? `${r.pageCount}p  totalH=${r.totalHeight}  breaks=[${r.breaks.join(',')}]  maxGap=${r.maxBottomGapPx}px${r.phantomRisk ? ' ⚠PHANTOM' : ''}${r.deadZoneRisk ? ' ⚠DEADZONE' : ''}`
      : r.error;
    console.log(`[Verify] ${icon} ${tmpl.id.padEnd(22)} ${detail}  (${ms}ms)`);
  }

  const totalMs    = Date.now() - t0;
  const passed     = results.filter(r => r.status === 'OK').length;
  const failed     = results.filter(r => r.status !== 'OK').length;
  const phantoms   = results.filter(r => r.status === 'OK' && r.phantomRisk).length;
  const deadZones  = results.filter(r => r.status === 'OK' && r.deadZoneRisk).length;
  const overallOK  = failed === 0 && deadZones === 0;

  const summary = {
    totalTemplates: TEMPLATES.length,
    passed, failed,
    phantomRiskCount: phantoms,
    deadZoneRiskCount: deadZones,
    totalMs,
    overallStatus: overallOK ? 'PASS ✓' : 'ISSUES FOUND ✗',
  };

  console.log(`\n[Verify] ════ SUMMARY ════`);
  console.log(`[Verify]  Templates : ${TEMPLATES.length}`);
  console.log(`[Verify]  Passed    : ${passed}`);
  console.log(`[Verify]  Failed    : ${failed}`);
  console.log(`[Verify]  Phantom ⚠ : ${phantoms}`);
  console.log(`[Verify]  Dead-zone⚠: ${deadZones}`);
  console.log(`[Verify]  Status    : ${summary.overallStatus}`);
  console.log(`[Verify]  Time      : ${totalMs}ms`);
  console.log(`[Verify] ═══════════════════\n`);

  res.status(200).json({ summary, results });
}
