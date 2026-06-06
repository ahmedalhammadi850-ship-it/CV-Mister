export const arabicSampleData = {
  personalInfo: {
    fullName: "محمد الأحمد",
    jobTitle: "مدير مشاريع",
    email: "info@example.com",
    phone: "+966665555055",
    location: "الرياض، السعودية",
    linkedin: "",
    portfolio: "Web.site.com",
    github: "",
    summary: "إذا كنت لا تزال غير قادر على إلغاء تأمين الملف، فتأكد من أن التطبيق الذي يقفل الملف قد أُغلق بالكامل ولا يعمل في الخلفية. يمكنك التحقق من ذلك عبر إدارة المهام أو مراقب النشاط على نظام ماك.",
  },
  experience: [
    {
      id: "exp-1",
      jobTitle: "اسم الوظيفة",
      company: "اسم الشركة",
      location: "الموقع",
      startDate: "2008",
      endDate: "2016",
      current: false,
      description: "إذا كنت لا تزال غير قادر على إلغاء تأمين الملف، فتأكد من أن التطبيق الذي يقفل الملف قد أُغلق بالكامل ولا يعمل في الخلفية. يمكنك التحقق من ذلك عبر إدارة المهام.",
    },
    {
      id: "exp-2",
      jobTitle: "اسم الوظيفة",
      company: "اسم الشركة",
      location: "الموقع",
      startDate: "2008",
      endDate: "2016",
      current: false,
      description: "إذا كنت لا تزال غير قادر على إلغاء تأمين الملف، فتأكد من أن التطبيق الذي يقفل الملف قد أُغلق بالكامل ولا يعمل في الخلفية. يمكنك التحقق من ذلك عبر إدارة المهام.",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "اسم الجامعة",
      institution: "التخصص",
      location: "",
      startDate: "2013",
      endDate: "2018",
      description: "إذا كنت لا تزال غير قادر على إلغاء تأمين الملف.",
    },
    {
      id: "edu-2",
      degree: "اسم الجامعة",
      institution: "التخصص",
      location: "",
      startDate: "2013",
      endDate: "2018",
      description: "إذا كنت لا تزال غير قادر على إلغاء تأمين الملف.",
    },
  ],
  skills: [
    { name: "مهارة اللغة", level: 5 },
    { name: "مهارة ثانية", level: 4 },
    { name: "مهارة ثالثة", level: 3 },
    { name: "مهارة رابعة", level: 4 },
  ],
  projects: [],
  languages: [
    { id: "lang-1", name: "FN",  proficiency: 5 },
    { id: "lang-2", name: "EN",  proficiency: 4 },
    { id: "lang-3", name: "AR",  proficiency: 4 },
  ],
  certificates: [],
  interests: [
    { id: "int-1", name: "🏊 السباحة" },
    { id: "int-2", name: "📚 القراءة" },
    { id: "int-3", name: "✈️ السفر" },
    { id: "int-4", name: "💻 التقنية" },
  ],
  courses: [],
  awards: [],
  organisations: [],
  publications: [],
  references: [],
  customSections: [],
};

export const blankData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    github: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
  certificates: [],
  interests: [],
  courses: [],
  awards: [],
  organisations: [],
  publications: [],
  references: [],
  customSections: [],
};

export const sampleData = {
  personalInfo: {
    fullName: "John Doe",
    jobTitle: "Senior Frontend Developer",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    location: "New York, USA",
    linkedin: "linkedin.com/in/johndoe",
    portfolio: "johndoe.dev",
    github: "github.com/johndoe",
    summary: "Passionate Frontend Developer with 5+ years of experience building scalable web applications. Proficient in React, TypeScript, and modern CSS frameworks. Strong advocate for clean code, web accessibility, and excellent user experiences."
  },
  experience: [
    {
      id: "exp-1",
      jobTitle: "Senior Frontend Developer",
      company: "TechNova Solutions",
      location: "New York, USA",
      startDate: "Jan 2021",
      endDate: "Present",
      current: true,
      description: "Led the front-end team in migrating a legacy monolith to a modern React micro-frontend architecture.\nMentored junior developers and established code review guidelines, increasing overall code quality.\nImplemented advanced performance optimizations that reduced initial load time by 40%."
    },
    {
      id: "exp-2",
      jobTitle: "Frontend Developer",
      company: "Creative Web Agency",
      location: "San Francisco, CA",
      startDate: "Mar 2018",
      endDate: "Dec 2020",
      current: false,
      description: "Developed and maintained 15+ responsive websites for diverse clients using React and Vue.js.\nCollaborated closely with UI/UX designers to translate Figma designs into pixel-perfect, accessible components.\nIntegrated RESTful APIs and optimized state management using Redux."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Technology",
      location: "Boston, MA",
      startDate: "Sep 2014",
      endDate: "May 2018",
      description: "Graduated with Honors (Cum Laude). Core coursework in Data Structures, Algorithms, and Web Development."
    }
  ],
  skills: [
    { name: "JavaScript (ES6+)", level: 90 },
    { name: "TypeScript",        level: 80 },
    { name: "React.js",          level: 90 },
    { name: "Next.js",           level: 70 },
    { name: "Tailwind CSS",      level: 80 },
    { name: "HTML5/CSS3",        level: 90 },
    { name: "Git/GitHub",        level: 80 },
    { name: "RESTful APIs",      level: 70 },
    { name: "GraphQL",           level: 60 },
    { name: "Jest/Testing Library", level: 70 },
  ],
  projects: [
    {
      id: "proj-1",
      title: "E-Commerce Dashboard",
      link: "github.com/johndoe/dashboard",
      description: "Built a fully responsive admin dashboard for e-commerce platforms using React, Tailwind CSS, and Recharts for data visualization."
    }
  ],
  languages: [
    { id: "lang-1", name: "English", level: "Native" },
    { id: "lang-2", name: "Spanish", level: "Intermediate" }
  ],
  certificates: [],
  interests: [],
  courses: [],
  awards: [],
  organisations: [],
  publications: [],
  references: [],
  customSections: [],
};
