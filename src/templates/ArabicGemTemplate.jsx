import { resolveTheme, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';
import BulletDesc from './BulletDesc';

const labels = {
  summary:       { ar: 'الملخص المهني',        en: 'Professional Summary'  },
  experience:    { ar: 'الخبرة المهنية',        en: 'Work Experience'       },
  education:     { ar: 'التعليم',               en: 'Education'             },
  skills:        { ar: 'المهارات',              en: 'Skills'                },
  languages:     { ar: 'اللغات',                en: 'Languages'             },
  projects:      { ar: 'المشاريع',              en: 'Projects'              },
  certificates:  { ar: 'الشهادات',              en: 'Certificates'          },
  interests:     { ar: 'الاهتمامات',            en: 'Interests'             },
  courses:       { ar: 'الدورات التدريبية',      en: 'Courses'               },
  awards:        { ar: 'الجوائز',               en: 'Awards'                },
  organisations: { ar: 'المنظمات',              en: 'Organisations'         },
  publications:  { ar: 'المنشورات',             en: 'Publications'          },
  references:    { ar: 'المراجع',               en: 'References'            },
  present:       { ar: 'حتى الآن',              en: 'Present'               },
};

const DEFAULT_ORDER = ['summary','skills','languages','certificates','courses','awards','interests','experience','education','projects','publications','references','organisations'];

const SIDEBAR_SECTIONS = new Set(['summary','skills','languages','certificates','courses','awards','interests','organisations']);
const MAIN_SECTIONS    = new Set(['experience','education','projects','publications','references']);

/* ── 5-segment skill bar ── */
const SkillBar = ({ level = 3, filled, empty }) => {
    const lvl = level > 5 ? Math.round(level / 20) : level;
  if (lvl <= 0) return null;
  const n = Math.min(Math.max(Math.round(lvl), 1), 5);
  return (
    <div style={{ display:'flex', gap:'3pt', marginTop:'3pt', direction:'ltr' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          flex:1, height:'5pt', borderRadius:'3pt',
          backgroundColor: i <= n ? filled : empty,
        }} />
      ))}
    </div>
  );
};

/* ── Decorative diamond SVG icon for main headings ── */
const DiamondIcon = ({ color }) => (
  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0, marginTop:'1pt' }}>
    <rect x="2" y="2" width="10" height="10" rx="1" transform="rotate(45 7 7)" fill={color} />
  </svg>
);

/* ── Phone icon ── */
const PhoneIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0 }}>
    <path d="M3 1h3l1.5 3.5-2 1.2c.8 1.6 2.3 3.1 3.8 3.8l1.2-2L14 9v3c0 1.1-.9 1-2 .7C5 11 1 6 1 3c-.3-1.1-.1-2 1-2z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
  </svg>
);

/* ── Email icon ── */
const EmailIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0 }}>
    <rect x="1" y="2.5" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M1 4l6 4.5L13 4" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);

/* ── Location icon ── */
const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0 }}>
    <path d="M7 1C4.79 1 3 2.79 3 5c0 3.18 4 8 4 8s4-4.82 4-8c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.3" fill="none"/>
    <circle cx="7" cy="5" r="1.5" fill="currentColor"/>
  </svg>
);

/* ── LinkedIn icon ── */
const LinkedInIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0 }}>
    <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M3.5 5.5v5M3.5 3.5v.5M6 5.5v5M6 7.5c0-1.1.9-2 2-2s2 .9 2 2v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

/* ── Globe icon ── */
const GitHubIcon = () => <svg width="11" height="11" viewBox="0 0 16 16" fill="rgba(255,255,255,0.7)"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>;
const GlobeIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0 }}>
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
    <path d="M7 1c-2 2-3 4-3 6s1 4 3 6M7 1c2 2 3 4 3 6s-1 4-3 6M1 7h12" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);

const ArabicGemTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const accent     = theme?.primaryColor || '#1a6464';
  const gold       = '#c9a56e';
  const accentDark = accent;
  const { sz, font, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const show = k => visibleSections[k] !== false;
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const contactItems = [
    vis.phone     !== false && info.phone     && { icon: <PhoneIcon />,    text: info.phone    },
    vis.email     !== false && info.email     && { icon: <EmailIcon />,    text: info.email    },
    vis.location  !== false && info.location  && { icon: <PinIcon />,     text: info.location },
    vis.linkedin  !== false && info.linkedin  && { icon: <LinkedInIcon />, text: info.linkedin },
    vis.portfolio !== false && info.portfolio && { icon: <GlobeIcon />,   text: info.portfolio},
    vis.github    !== false && info.github    && { icon: <GitHubIcon />, text: info.github   },
  ].filter(Boolean);

  const initials = (info.fullName || '')
    .trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('');

  /* ── Geometric SVG pattern for sidebar top ── */
  const patternSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><rect width='40' height='40' fill='none'/><line x1='0' y1='20' x2='20' y2='0' stroke='rgba(255,255,255,0.08)' stroke-width='1'/><line x1='20' y1='0' x2='40' y2='20' stroke='rgba(255,255,255,0.08)' stroke-width='1'/><line x1='0' y1='20' x2='20' y2='40' stroke='rgba(255,255,255,0.08)' stroke-width='1'/><line x1='20' y1='40' x2='40' y2='20' stroke='rgba(255,255,255,0.08)' stroke-width='1'/><circle cx='20' cy='20' r='2' fill='rgba(255,255,255,0.1)'/><circle cx='0' cy='0' r='2' fill='rgba(255,255,255,0.06)'/><circle cx='40' cy='0' r='2' fill='rgba(255,255,255,0.06)'/><circle cx='0' cy='40' r='2' fill='rgba(255,255,255,0.06)'/><circle cx='40' cy='40' r='2' fill='rgba(255,255,255,0.06)'/></svg>`;
  const patternUrl = `url("data:image/svg+xml,${encodeURIComponent(patternSvg)}")`;

  /* ── Styles ── */
  const sb = {
    col: {
      width: '230px', minWidth: '230px',
      backgroundColor: theme?.sidebarColor || accentDark,
      boxSizing: 'border-box',
      direction: 'rtl',
    },
    topZone: {
      backgroundImage: patternUrl,
      backgroundColor: theme?.sidebarColor || accentDark,
      backgroundSize: '40px 40px',
      padding: '22pt 14pt 16pt',
      textAlign: 'center',
    },
    photoWrap: {
      width: '80pt', height: '80pt',
      borderRadius: '50%',
      overflow: 'hidden',
      margin: '0 auto 10pt',
      border: `3pt solid ${gold}`,
      backgroundColor: 'rgba(255,255,255,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    },
    initials: {
      fontSize: '22pt', fontWeight: '700', color: '#fff', lineHeight: 1,
    },
    name: {
      fontSize: '14pt', fontWeight: '800', color: '#fff',
      lineHeight: 1.25, marginBottom: '4pt',
      textAlign: 'center',
    },
    jobTitle: {
      fontSize: sz.meta, color: gold,
      fontWeight: '600', marginBottom: '12pt',
      textAlign: 'center',
    },
    divider: {
      height: '1px',
      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
      marginBottom: '10pt',
    },
    contactRow: {
      display: 'flex', alignItems: 'flex-start', gap: '6pt',
      marginBottom: '5pt', color: 'rgba(255,255,255,0.88)',
      fontSize: sz.meta, direction: 'ltr',
      flexDirection: 'row-reverse',
    },
    contactText: {
      flex: 1, lineHeight: 1.3, wordBreak: 'break-all',
      textAlign: 'right',
    },
    bodyZone: {
      padding: '10pt 14pt 18pt',
    },
    sectionHeading: {
      display: 'flex', alignItems: 'center', gap: '6pt',
      flexDirection: 'row',
      backgroundColor: 'rgba(255,255,255,0.12)',
      borderRight: `3pt solid ${gold}`,
      padding: '4pt 8pt 4pt 6pt',
      marginBottom: '8pt',
      marginTop: sectionMt,
      borderRadius: '2pt 0 0 2pt',
      ...BREAK_HEADING,
    },
    sectionHeadingText: {
      fontSize: sz.meta, fontWeight: '700', color: '#fff',
      letterSpacing: '0.03em', flex: 1, textAlign: 'right',
    },
    sectionIcon: {
      width: '14pt', height: '14pt',
      backgroundColor: gold,
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      fontSize: '7pt', color: accentDark, fontWeight: '800',
    },
    skillRow: {
      marginBottom: '8pt', direction: 'rtl', ...BREAK_ITEM,
    },
    skillName: {
      fontSize: sz.meta, color: 'rgba(255,255,255,0.9)',
      fontWeight: '500', marginBottom: '2pt', textAlign: 'right',
    },
    langRow: {
      display: 'flex', alignItems: 'center', gap: '8pt',
      flexDirection: 'row-reverse',
      marginBottom: '7pt', ...BREAK_ITEM,
    },
    langName: {
      fontSize: sz.meta, color: 'rgba(255,255,255,0.9)',
      fontWeight: '500', minWidth: '40pt', textAlign: 'right',
    },
    certItem: {
      fontSize: sz.meta, color: 'rgba(255,255,255,0.85)',
      marginBottom: '5pt', lineHeight: 1.35, textAlign: 'right',
      paddingRight: '8pt',
      borderRight: `1.5pt solid ${gold}`,
    },
    bodyText: {
      fontSize: sz.meta, color: 'rgba(255,255,255,0.82)',
      lineHeight: 1.5, textAlign: 'right',
    },
  };

  const mn = {
    col: {
      flex: 1, backgroundColor: theme?.bgColor || '#fff',
      padding: '22pt 20pt 22pt 18pt',
      boxSizing: 'border-box',
      direction: 'rtl',
    },
    sectionWrap: {
      marginTop: sectionMt,
      ...BREAK_HEADING,
    },
    sectionRow: {
      display: 'flex', alignItems: 'center', gap: '7pt',
      flexDirection: 'row',
      marginBottom: '4pt',
    },
    sectionTitle: {
      fontSize: sz.heading, fontWeight: '800', color: accentDark,
      flex: 1, textAlign: 'right',
    },
    sectionLine: {
      height: '2px',
      background: `linear-gradient(270deg, ${accentDark}, ${accentDark}22)`,
      marginBottom: '10pt',
    },
    expItem: {
      marginBottom: '13pt',
      ...BREAK_ITEM,
    },
    jobRow: {
      display: 'flex', alignItems: 'flex-start', gap: '8pt',
      flexDirection: 'row-reverse',
      justifyContent: 'space-between',
      marginBottom: '2pt',
    },
    jobTitle: {
      fontSize: sz.body, fontWeight: '800', color: '#111',
      flex: 1, textAlign: 'right',
    },
    dateBadge: {
      fontSize: sz.meta, color: '#fff',
      backgroundColor: accentDark,
      padding: '1.5pt 7pt', borderRadius: '10pt',
      whiteSpace: 'nowrap', flexShrink: 0, fontWeight: '600',
    },
    companyRow: {
      display: 'flex', alignItems: 'center', gap: '5pt',
      flexDirection: 'row-reverse',
      marginBottom: '4pt',
    },
    company: {
      fontSize: sz.meta, color: accentDark, fontWeight: '700',
    },
    location: {
      fontSize: sz.meta, color: '#888',
    },
    desc: {
      fontSize: sz.meta, color: '#333',
      lineHeight: 1.6, whiteSpace: 'pre-line', textAlign: 'right',
    },
    bullet: {
      display: 'flex', alignItems: 'flex-start', gap: '6pt',
      flexDirection: 'row-reverse',
      marginBottom: '3pt',
    },
    bulletDot: {
      width: '4pt', height: '4pt', borderRadius: '50%',
      backgroundColor: gold, flexShrink: 0, marginTop: '5pt',
    },
    eduItem: {
      marginBottom: '10pt',
      ...BREAK_ITEM,
    },
    degree: {
      fontSize: sz.body, fontWeight: '700', color: '#111',
      textAlign: 'right', marginBottom: '2pt',
    },
    institution: {
      fontSize: sz.meta, color: accentDark, fontWeight: '600',
      textAlign: 'right', marginBottom: '2pt',
    },
    eduDate: {
      fontSize: sz.meta, color: '#666', textAlign: 'right',
    },
  };

  /* ── Sidebar section heading ── */
  const SbHeading = ({ label, icon }) => (
    <div style={sb.sectionHeading}>
      <span style={sb.sectionIcon}>{icon}</span>
      <span style={sb.sectionHeadingText}>{label}</span>
    </div>
  );

  /* ── Main section heading ── */
  const MnHeading = ({ label }) => (
    <div style={mn.sectionWrap}>
      <div style={mn.sectionRow}>
        <DiamondIcon color={gold} />
        <div style={mn.sectionTitle}>{label}</div>
      </div>
      <div style={mn.sectionLine} />
    </div>
  );

  /* ── Sidebar sections ── */
  const renderSidebar = (key) => {
    if (!show(key) || !SIDEBAR_SECTIONS.has(key)) return null;

    switch (key) {
      case 'summary':
        return data.personalInfo?.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <SbHeading label={tr('summary', true)} icon="✦" />
            <div style={ta(sb.bodyText, data.personalInfo?.summaryAlign)}><span style={{fontWeight:data.personalInfo?.summaryBold?700:undefined,fontStyle:data.personalInfo?.summaryItalic?"italic":undefined}}>{data.personalInfo.summary}</span></div>
          </section>
        ) : null;

      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" style={BREAK_ITEM}>
            <SbHeading label={tr('skills', true)} icon="◆" />
            {data.skills.map((sk, i) => (
              <div key={i} style={sb.skillRow}>
                <div style={sb.skillName}>{sk.name || sk}</div>
                <SkillBar level={sk.level || 0} filled={gold} empty="rgba(255,255,255,0.2)" />
              </div>
            ))}
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <SbHeading label={tr('languages', true)} icon="◉" />
            {data.languages.map((l, i) => (
              <div key={i} style={sb.langRow}>
                <div style={sb.langName}>{l.name}</div>
                <div style={{ flex: 1 }}>
                  <SkillBar level={l.proficiency || l.level || 3} filled={gold} empty="rgba(255,255,255,0.2)" />
                </div>
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates" style={BREAK_ITEM}>
            <SbHeading label={tr('certificates', true)} icon="★" />
            {data.certificates.map((c, i) => (
              <div key={i} style={{ ...sb.certItem, marginBottom: '6pt' }}>
                <div style={{ fontWeight: '600', color: '#fff', marginBottom: '1pt' }}>{c.name}</div>
                {c.issuer && <div style={{ fontSize: '7pt', color: gold }}>{c.issuer}</div>}
                {c.date && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.6)' }}>{c.date}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses" style={BREAK_ITEM}>
            <SbHeading label={tr('courses', true)} icon="◈" />
            {data.courses.map((c, i) => (
              <div key={i} style={{ ...sb.certItem, marginBottom: '6pt' }}>
                <div style={{ fontWeight: '600', color: '#fff' }}>{c.name}</div>
                {c.institution && <div style={{ fontSize: '7pt', color: gold }}>{c.institution}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <section key="awards" style={BREAK_ITEM}>
            <SbHeading label={tr('awards', true)} icon="🏆" />
            {data.awards.map((a, i) => (
              <div key={i} style={{ ...sb.certItem, marginBottom: '6pt' }}>
                <div style={{ fontWeight: '600', color: '#fff' }}>{a.title}</div>
                {a.issuer && <div style={{ fontSize: '7pt', color: gold }}>{a.issuer}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={BREAK_ITEM}>
            <SbHeading label={tr('interests', true)} icon="♥" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt', justifyContent: 'flex-end' }}>
              {data.interests.map((item, i) => (
                <span key={i} style={{
                  fontSize: '7pt', color: '#fff',
                  border: `1px solid ${gold}55`, borderRadius: '10pt',
                  padding: '1.5pt 6pt', backgroundColor: 'rgba(255,255,255,0.1)',
                }}>{typeof item === 'string' ? item : item.name}</span>
              ))}
            </div>
          </section>
        ) : null;

      case 'organisations':
        return data.organisations?.length > 0 ? (
          <section key="organisations" style={BREAK_ITEM}>
            <SbHeading label={tr('organisations', true)} icon="◈" />
            {data.organisations.map((o, i) => (
              <div key={i} style={{ ...sb.certItem, marginBottom: '5pt' }}>
                <div style={{ fontWeight: '600', color: '#fff' }}>{o.name}</div>
                {o.role && <div style={{ fontSize: '7pt', color: gold }}>{o.role}</div>}
              </div>
            ))}
          </section>
        ) : null;

      default: return null;
    }
  };

  /* ── Main sections ── */
  const renderMain = (key) => {
    if (!show(key) || !MAIN_SECTIONS.has(key)) return null;

    switch (key) {
      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            {data.experience.map((e, i) => (
              <div key={i} style={mn.expItem}>
                {i === 0 && <MnHeading label={tr('experience', true)} />}
                <div style={mn.jobRow}>
                  <div style={mn.jobTitle}>{e.jobTitle}</div>
                  <div style={mn.dateBadge}>
                    {e.startDate}{e.startDate ? '–' : ''}{e.current ? tr('present', true) : e.endDate}
                  </div>
                </div>
                <div style={mn.companyRow}>
                  <div style={mn.company}>{e.company}</div>
                  {e.location && <div style={mn.location}>· {e.location}</div>}
                </div>
                {e.description && (
                  <BulletDesc text={e.description} style={mn.desc} bold={e?.descriptionBold} italic={e?.descriptionItalic} />
                )}
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            {data.education.map((e, i) => (
              <div key={i} style={mn.eduItem}>
                {i === 0 && <MnHeading label={tr('education', true)} />}
                <div style={mn.jobRow}>
                  <div style={mn.degree}>{e.degree}</div>
                  {(e.startDate || e.endDate) && (
                    <div style={mn.dateBadge}>{e.startDate}{e.startDate ? '–' : ''}{e.endDate}</div>
                  )}
                </div>
                <div style={mn.institution}>{e.institution}</div>
                {e.description && <BulletDesc text={e.description} style={{ ...mn.desc, marginTop: '3pt' }} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            {data.projects.map((p, i) => (
              <div key={i} style={mn.eduItem}>
                {i === 0 && <MnHeading label={tr('projects', true)} />}
                <div style={mn.degree}>{p.title}</div>
                {p.link && <div style={{ ...mn.institution, fontSize: sz.meta }}>{p.link}</div>}
                {p.description && <BulletDesc text={p.description} style={mn.desc} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'publications':
        return data.publications?.length > 0 ? (
          <section key="publications">
            {data.publications.map((p, i) => (
              <div key={i} style={mn.eduItem}>
                {i === 0 && <MnHeading label={tr('publications', true)} />}
                <div style={mn.jobRow}>
                  <div style={mn.degree}>{p.title}</div>
                  {p.date && <div style={mn.dateBadge}>{p.date}</div>}
                </div>
                {p.publisher && <div style={mn.institution}>{p.publisher}</div>}
                {p.description && <BulletDesc text={p.description} style={mn.desc} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            {data.references.map((r, i) => (
              <div key={i} style={mn.eduItem}>
                {i === 0 && <MnHeading label={tr('references', true)} />}
                <div style={mn.degree}>{r.name}</div>
                {(r.title || r.company) && <div style={mn.institution}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
                {(r.email || r.phone) && <div style={mn.desc}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
              </div>
            ))}
          </section>
        ) : null;

      default: return null;
    }
  };

  const sideKeys = sectionOrder.filter(k => SIDEBAR_SECTIONS.has(k));
  const mainKeys = sectionOrder.filter(k => MAIN_SECTIONS.has(k));

  return (
    <div style={{
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a',
      backgroundColor: '#fff', width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', display: 'flex',
      flexDirection: 'row', direction: 'ltr',
    }}>
      {/* ── LEFT SIDEBAR ── */}
      <div style={sb.col}>
        {/* Top zone: pattern + photo + name */}
        <div style={sb.topZone}>
          {/* Photo */}
          {vis.photo !== false && (
            <div style={sb.photoWrap}>
              <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width:'100%', height:'100%', objectFit: info.photo ? 'cover' : 'contain' }} />
            </div>
          )}

          {/* Name + Job */}
          <div style={sb.name}>{info.fullName || 'الاسم الكامل'}</div>
          {info.jobTitle && <div style={sb.jobTitle}>{info.jobTitle}</div>}

          {/* Contact info */}
          {contactItems.length > 0 && (
            <div style={{ marginTop: '8pt' }}>
              <div style={sb.divider} />
              {contactItems.map((row, i) => (
                <div key={i} style={sb.contactRow}>
                  <span style={{ color: gold, display:'flex', alignItems:'center' }}>{row.icon}</span>
                  <span style={sb.contactText}>{row.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar sections */}
        <div style={sb.bodyZone}>
          {sideKeys.map(k => renderSidebar(k))}
        </div>
      </div>

      {/* ── RIGHT MAIN CONTENT ── */}
      <div style={mn.col}>
        {mainKeys.map(k => renderMain(k))}
      </div>
    </div>
  );
};

export default ArabicGemTemplate;
