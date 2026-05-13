import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

const labels = {
  summary:       { en: 'Profile',            ar: 'نبذة تعريفية'         },
  experience:    { en: 'Professional Experience', ar: 'الخبرة المهنية'  },
  education:     { en: 'Education',          ar: 'التعليم'              },
  skills:        { en: 'Skills',             ar: 'المهارات'             },
  languages:     { en: 'Languages',          ar: 'اللغات'               },
  projects:      { en: 'Projects',           ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',       ar: 'الشهادات'             },
  interests:     { en: 'Interests',          ar: 'الاهتمامات'           },
  courses:       { en: 'Courses',            ar: 'الدورات'              },
  awards:        { en: 'Awards',             ar: 'الجوائز'              },
  organisations: { en: 'Organisations',      ar: 'المنظمات'             },
  publications:  { en: 'Publications',       ar: 'المنشورات'            },
  references:    { en: 'References',         ar: 'المراجع'              },
  contact:       { en: 'Contact',            ar: 'التواصل'              },
  present:       { en: 'Present',            ar: 'حتى الآن'             },
};
const tr = (key, isRTL) => labels[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'languages', 'projects', 'certificates', 'awards'];

const SIDEBAR_SECTIONS = new Set(['skills', 'languages', 'interests', 'certificates', 'courses', 'awards', 'organisations', 'education']);
const MAIN_SECTIONS    = new Set(['summary', 'experience', 'projects', 'publications', 'references']);

const DotsRating = ({ level = 3, accent }) => {
  const filled = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <span style={{ display: 'inline-flex', gap: '3pt', verticalAlign: 'middle' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: i <= filled ? accent : '#dde3e9', display: 'inline-block' }} />
      ))}
    </span>
  );
};

const SidebarLightTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent       = theme?.primaryColor || '#3d6b8e';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || (isRTL ? 'right' : 'left');
  const { sz, font, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const contactItems = [
    vis.email     !== false && info.email     && { icon: '✉', text: info.email },
    vis.phone     !== false && info.phone     && { icon: '✆', text: info.phone },
    vis.location  !== false && info.location  && { icon: '⌖', text: info.location },
    vis.linkedin  !== false && info.linkedin  && { icon: 'in', text: info.linkedin },
    vis.portfolio !== false && info.portfolio && { icon: '⬡', text: info.portfolio },
  ].filter(Boolean);

  const sidebarBg   = '#f4f6f8';
  const sidebarText = '#2c3e50';

  const sb = {
    wrapper: {
      width: '230px', minWidth: '230px',
      backgroundColor: sidebarBg,
      padding: '32pt 16pt',
      boxSizing: 'border-box',
      direction: dir,
      borderRight: isRTL ? 'none' : `1px solid #e2e8f0`,
      borderLeft:  isRTL ? `1px solid #e2e8f0` : 'none',
    },
    photoWrap: {
      width: '88pt', height: '88pt', borderRadius: '50%', overflow: 'hidden',
      margin: `0 auto 14pt`,
      border: `3px solid ${accent}`,
      backgroundColor: accent + '22',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    initials: { fontSize: '28pt', fontWeight: '700', color: accent },
    name: { fontSize: sz.name, fontWeight: '700', color: sidebarText, marginBottom: '2pt', lineHeight: 1.2, textAlign: 'center' },
    jobTitle: { fontSize: sz.meta, color: accent, marginBottom: '18pt', textAlign: 'center', fontStyle: 'italic' },
    sectionLabel: {
      fontSize: '8pt', fontWeight: '700', color: accent,
      textTransform: 'uppercase', letterSpacing: '0.12em',
      marginBottom: '8pt', marginTop: sectionMt,
      borderBottom: `1.5px solid ${accent}`,
      paddingBottom: '3pt',
      textAlign: headingAlign,
      ...BREAK_HEADING,
    },
    contactRow: {
      display: 'flex', gap: '6pt', marginBottom: '6pt',
      fontSize: sz.meta, color: '#4a5568',
      alignItems: 'flex-start',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    icon: { width: '13pt', textAlign: 'center', flexShrink: 0, color: accent, fontSize: '9pt', marginTop: '1pt' },
    skillRow: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '6pt', fontSize: sz.meta, color: sidebarText,
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    tag: {
      display: 'inline-block',
      background: accent + '18',
      border: `1px solid ${accent}33`,
      borderRadius: '3pt', padding: '2pt 6pt',
      fontSize: sz.meta, color: accent,
      marginRight: '4pt', marginBottom: '4pt',
    },
  };

  const mn = {
    wrapper: { flex: 1, padding: '32pt 28pt 28pt', boxSizing: 'border-box', direction: dir, backgroundColor: '#fff' },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: accent,
      marginTop: sectionMt, marginBottom: '8pt',
      borderBottom: `2px solid ${accent}`,
      paddingBottom: '3pt',
      textAlign: headingAlign,
      ...BREAK_HEADING,
    },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8pt', flexDirection: isRTL ? 'row-reverse' : 'row' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#1a202c', flex: 1 },
    date: { fontSize: sz.meta, color: '#718096', whiteSpace: 'nowrap', flexShrink: 0 },
    company: { fontSize: sz.meta, color: accent, fontWeight: '600', marginBottom: '4pt' },
    body: { fontSize: sz.body, color: '#4a5568', lineHeight, whiteSpace: 'pre-line' },
    item: { marginBottom: '12pt', ...BREAK_ITEM },
  };

  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'skills':
        return data.skills?.length > 0 ? (
          <div key="skills" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('skills', isRTL)}</div>
            {data.skills.map((sk, i) => (
              <div key={i} style={sb.skillRow}>
                <span>{sk.name || sk}</span>
                <DotsRating level={sk.level || 3} accent={accent} />
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('languages', isRTL)}</div>
            {data.languages.map((l, i) => (
              <div key={i} style={sb.skillRow}>
                <span>{l.name}</span>
                <DotsRating level={l.proficiency || 3} accent={accent} />
              </div>
            ))}
          </div>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <div key="education" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('education', isRTL)}</div>
            {data.education.map((e, i) => (
              <div key={i} style={{ marginBottom: '10pt', ...BREAK_ITEM }}>
                <div style={{ fontSize: sz.meta, fontWeight: '700', color: sidebarText, lineHeight: 1.3 }}>{e.degree}</div>
                <div style={{ fontSize: sz.meta, color: accent, marginTop: '2pt' }}>{e.institution}</div>
                <div style={{ fontSize: '8pt', color: '#718096', marginTop: '1pt' }}>{e.startDate} – {e.endDate}</div>
              </div>
            ))}
          </div>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <div key="interests" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('interests', isRTL)}</div>
            <div style={{ fontSize: sz.meta, color: '#4a5568', lineHeight: 1.6 }}>
              {data.interests.map(i => i.name || i).join('  •  ')}
            </div>
          </div>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <div key="certificates" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('certificates', isRTL)}</div>
            {data.certificates.map((c, i) => (
              <div key={i} style={{ fontSize: sz.meta, color: '#4a5568', marginBottom: '4pt' }}>• {c.name || c}</div>
            ))}
          </div>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <div key="awards" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('awards', isRTL)}</div>
            {data.awards.map((a, i) => (
              <div key={i} style={{ marginBottom: '6pt' }}>
                <div style={{ fontSize: sz.meta, fontWeight: '600', color: sidebarText }}>{a.title || a.name || a}</div>
                {a.issuer && <div style={{ fontSize: '8pt', color: '#718096' }}>{a.issuer}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <div key="courses" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('courses', isRTL)}</div>
            {data.courses.map((c, i) => (
              <div key={i} style={{ fontSize: sz.meta, color: '#4a5568', marginBottom: '4pt' }}>• {c.name || c}</div>
            ))}
          </div>
        ) : null;

      default: return null;
    }
  };

  const renderMain = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return info.summary ? (
          <div key="summary" style={BREAK_ITEM}>
            <div style={mn.heading}>{tr('summary', isRTL)}</div>
            <div style={mn.body}>{info.summary}</div>
          </div>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <div key="experience">
            <div style={mn.heading}>{tr('experience', isRTL)}</div>
            {data.experience.map((e, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.row}>
                  <div style={mn.role}>{e.jobTitle}</div>
                  <div style={mn.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={mn.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                {e.description && <div style={mn.body}>{e.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <div key="projects">
            <div style={mn.heading}>{tr('projects', isRTL)}</div>
            {data.projects.map((p, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.role}>{p.title || p.name}</div>
                {p.link && <div style={{ fontSize: sz.meta, color: accent, marginBottom: '2pt' }}>{p.link}</div>}
                {p.description && <div style={mn.body}>{p.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'certificates':
        return !SIDEBAR_SECTIONS.has('certificates') && data.certificates?.length > 0 ? (
          <div key="certificates">
            <div style={mn.heading}>{tr('certificates', isRTL)}</div>
            {data.certificates.map((c, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.row}>
                  <div style={mn.role}>{c.name}</div>
                  {c.date && <div style={mn.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={mn.company}>{c.issuer}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'publications':
        return data.publications?.length > 0 ? (
          <div key="publications">
            <div style={mn.heading}>{tr('publications', isRTL)}</div>
            {data.publications.map((p, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.row}>
                  <div style={mn.role}>{p.title}</div>
                  {p.date && <div style={mn.date}>{p.date}</div>}
                </div>
                {p.publisher && <div style={mn.company}>{p.publisher}</div>}
                {p.description && <div style={mn.body}>{p.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <div key="references">
            <div style={mn.heading}>{tr('references', isRTL)}</div>
            {data.references.map((r, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.role}>{r.name}</div>
                {(r.title || r.company) && <div style={mn.company}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
                {(r.email || r.phone) && <div style={mn.body}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
              </div>
            ))}
          </div>
        ) : null;

      default:
        if (key.startsWith('csec-') && data.customSections) {
          const sec = data.customSections.find(s => s.id === key);
          if (!sec || !sec.items?.length) return null;
          return (
            <div key={key}>
              <div style={mn.heading}>{sec.title}</div>
              {sec.items.map((item, idx) => (
                <div key={idx} style={mn.item}>
                  {item.title && <div style={mn.role}>{item.title}</div>}
                  {item.subtitle && <div style={mn.company}>{item.subtitle}</div>}
                  {item.description && <div style={mn.body}>{item.description}</div>}
                </div>
              ))}
            </div>
          );
        }
        return null;
    }
  };

  const sideKeys = sectionOrder.filter(k => SIDEBAR_SECTIONS.has(k));
  const mainKeys = sectionOrder.filter(k => MAIN_SECTIONS.has(k));
  const initials = (info.fullName || '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ fontFamily: font, fontSize: sz.body, color: sidebarText, backgroundColor: '#ffffff', width: '794px', minHeight: '1122px', boxSizing: 'border-box', display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', direction: 'ltr' }}>
      {/* Sidebar */}
      <div style={sb.wrapper}>
        {vis.photo !== false && (info.photo ? (
          <div style={sb.photoWrap}>
            <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        ) : (
          <div style={sb.photoWrap}>
            <span style={sb.initials}>{initials}</span>
          </div>
        ))}

        <div style={sb.name}>{info.fullName || 'Your Name'}</div>
        <div style={sb.jobTitle}>{info.jobTitle || ''}</div>

        <div style={sb.sectionLabel}>{tr('contact', isRTL)}</div>
        {contactItems.map((row, i) => (
          <div key={i} style={sb.contactRow}>
            <span style={sb.icon}>{row.icon}</span>
            <span style={{ wordBreak: 'break-all', lineHeight: 1.3 }}>{row.text}</span>
          </div>
        ))}

        {sideKeys.map(k => renderSidebar(k))}
      </div>

      {/* Main */}
      <div style={mn.wrapper}>
        {mainKeys.map(k => renderMain(k))}
      </div>
    </div>
  );
};

export default SidebarLightTemplate;
