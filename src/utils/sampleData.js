export const blankData = {
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
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
    "JavaScript (ES6+)",
    "TypeScript",
    "React.js",
    "Next.js",
    "Tailwind CSS",
    "HTML5/CSS3",
    "Git/GitHub",
    "RESTful APIs",
    "GraphQL",
    "Jest/Testing Library"
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
