import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

const labels = {
  summary:       { en: 'Professional Summary', ar: 'الملخص المهني'       },
  experience:    { en: 'Work Experience',      ar: 'الخبرات المهنية'      },
  education:     { en: 'Education',           ar: 'التعليم'              },
  skills:        { en: 'Skills',              ar: 'المهارات'             },
  languages:     { en: 'Languages',           ar: 'اللغات'               },
  projects:      { en: 'Projects',            ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',        ar: 'الدورات التدريبية'    },
  interests:     { en: 'Interests',           ar: 'الاهتمامات'           },
  courses:       { en: 'Courses',             ar: 'الدورات'              },
  awards:        { en: 'Awards',              ar: 'الجوائز'              },
  organisations: { en: 'Organisations',       ar: 'المنظمات'             },
  publications:  { en: 'Publications',        ar: 'المنشورات'            },
  references:    { en: 'References',          ar: 'المراجع'              },
  contact:       { en: 'Contact',             ar: 'للتواصل'              },
  present:       { en: 'Present',             ar: 'حتى الآن'             },
  to:            { en: 'to',                  ar: 'إلى'                  },
};
const tr = (key, isRTL) => labels[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'certificates', 'courses', 'awards', 'skills', 'languages', 'interests'];

const SIDEBAR_SECTIONS = new Set(['skills', 'languages', 'interests', 'courses', 'awards', 'organisations', 'certificates']);
const MAIN_SECTIONS    = new Set(['summary', 'experience', 'education', 'projects', 'publications', 'references']);

const BarRating = ({ level = 3, barColor, bgColor }) => {
  const filled = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <div style={{ display: 'flex', gap: '3pt', alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width: '22pt', height: '4pt', borderRadius: '2pt', backgroundColor: i <= filled ? barColor : bgColor }} />
      ))}
    </div>
  );
};

const ArabicNavyTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent       = theme?.primaryColor || '#1a2744';
  const accentMid    = '#243160';
  const headingAlign = theme?.headingAlign || 'right';
  const { sz, font, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = 'rtl';
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

  const sb = {
    wrapper: {
      width: '215px', minWidth: '215px',
      backgroundColor: accent,
      padding: '28pt 14pt',
      boxSizing: 'border-box',
      direction: 'rtl',
    },
    photoWrap: {
      width: '80pt', height: '80pt', borderRadius: '50%',
      overflow: 'hidden', margin: '0 auto 14pt',
      border: '2.5px solid rgba(255,255,255,0.35)',
      backgroundColor: accentMid,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    initials: { fontSize: '24pt', fontWeight: '700', color: '#fff' },
    name: { fontSize: sz.heading, fontWeight: '700', color: '#fff', textAlign: 'center', lineHeight: 1.3, marginBottom: '3pt' },
    jobTitle: { fontSize: sz.meta, color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginBottom: '16pt', fontStyle: 'italic' },
    sectionLabel: {
      fontSize: '8.5pt', fontWeight: '700', color: '#fff',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginBottom: '8pt', marginTop: sectionMt,
      borderBottom: '1px solid rgba(255,255,255,0.25)',
      paddingBottom: '4pt', textAlign: 'right',
      ...BREAK_HEADING,
    },
    contactRow: {
      display: 'flex', gap: '6pt', marginBottom: '6pt',
      fontSize: sz.meta, color: 'rgba(255,255,255,0.85)',
      alignItems: 'flex-start', flexDirection: 'row-reverse',
      wordBreak: 'break-all',
    },
    icon: { width: '12pt', textAlign: 'center', flexShrink: 0, fontSize: '9pt', color: 'rgba(255,255,255,0.6)', marginTop: '1pt' },
    skillName: { fontSize: sz.meta, color: '#fff', marginBottom: '3pt', textAlign: 'right' },
    skillItem: { marginBottom: '8pt' },
    tag: { display: 'inline-block', background: 'rgba(255,255,255,0.12)', borderRadius: '3pt', padding: '2pt 6pt', fontSize: sz.meta, color: '#fff', marginLeft: '4pt', marginBottom: '4pt' },
    bullet: { fontSize: sz.meta, color: 'rgba(255,255,255,0.8)', marginBottom: '4pt', textAlign: 'right' },
  };

  const mn = {
    wrapper: { flex: 1, padding: '28pt 22pt 22pt', boxSizing: 'border-box', direction: 'rtl', backgroundColor: '#fff' },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: accent,
      marginTop: sectionMt, marginBottom: '8pt',
      borderBottom: `2px solid ${accent}`,
      paddingBottom: '3pt', textAlign: 'right',
      ...BREAK_HEADING,
    },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8pt', flexDirection: 'row-reverse' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1, textAlign: 'right' },
    date: { fontSize: sz.meta, color: '#888', whiteSpace: 'nowrap', flexShrink: 0 },
    company: { fontSize: sz.meta, color: accent, fontWeight: '600', marginBottom: '3pt', textAlign: 'right' },
    body: { fontSize: sz.body, color: '#444', lineHeight, whiteSpace: 'pre-line', textAlign: 'right' },
    item: { marginBottom: '12pt', ...BREAK_ITEM },
    bullet: { fontSize: sz.body, color: '#333', marginBottom: '4pt', textAlign: 'right' },
  };

  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'skills':
        return data.skills?.length > 0 ? (
          <div key="skills" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('skills', true)}</div>
            {data.skills.map((sk, i) => (
              <div key={i} style={sb.skillItem}>
                <div style={sb.skillName}>{sk.name || sk}</div>
                <BarRating level={sk.level || 3} barColor="rgba(255,255,255,0.9)" bgColor="rgba(255,255,255,0.2)" />
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('languages', true)}</div>
            {data.languages.map((l, i) => (
              <div key={i} style={sb.skillItem}>
                <div style={sb.skillName}>{l.name}</div>
                <BarRating level={l.proficiency || 3} barColor="rgba(255,255,255,0.9)" bgColor="rgba(255,255,255,0.2)" />
              </div>
            ))}
          </div>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <div key="interests" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('interests', true)}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
              {data.interests.map((item, i) => <span key={i} style={sb.tag}>{item.name || item}</span>)}
            </div>
          </div>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <div key="certificates" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('certificates', true)}</div>
            {data.certificates.map((c, i) => (
              <div key={i} style={sb.bullet}>• {c.name || c}</div>
            ))}
          </div>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <div key="courses" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('courses', true)}</div>
            {data.courses.map((c, i) => (
              <div key={i} style={sb.bullet}>• {c.name || c}</div>
            ))}
          </div>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <div key="awards" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('awards', true)}</div>
            {data.awards.map((a, i) => (
              <div key={i} style={{ ...sb.bullet, marginBottom: '6pt' }}>
                <div style={{ fontWeight: '600', color: '#fff', fontSize: sz.meta }}>{a.title || a.name || a}</div>
                {a.issuer && <div style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.6)' }}>{a.issuer}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'organisations':
        return data.organisations?.length > 0 ? (
          <div key="organisations" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('organisations', true)}</div>
            {data.organisations.map((o, i) => (
              <div key={i} style={sb.bullet}>• {o.name || o}</div>
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
            <div style={mn.heading}>{tr('summary', true)}</div>
            <div style={mn.body}>{info.summary}</div>
          </div>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <div key="experience">
            <div style={mn.heading}>{tr('experience', true)}</div>
            {data.experience.map((e, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.row}>
                  <div style={mn.role}>{e.jobTitle}</div>
                  <div style={mn.date}>{e.startDate} – {e.current ? tr('present', true) : e.endDate}</div>
                </div>
                <div style={mn.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                {e.description && <div style={mn.body}>{e.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <div key="education">
            <div style={mn.heading}>{tr('education', true)}</div>
            {data.education.map((e, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.row}>
                  <div style={mn.role}>{e.degree}</div>
                  <div style={mn.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={mn.company}>{e.institution}{e.location ? ` · ${e.location}` : ''}</div>
                {e.description && <div style={mn.body}>{e.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <div key="projects">
            <div style={mn.heading}>{tr('projects', true)}</div>
            {data.projects.map((p, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.role}>{p.title || p.name}</div>
                {p.link && <div style={{ fontSize: sz.meta, color: accent, textAlign: 'right' }}>{p.link}</div>}
                {p.description && <div style={mn.body}>{p.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'publications':
        return data.publications?.length > 0 ? (
          <div key="publications">
            <div style={mn.heading}>{tr('publications', true)}</div>
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
            <div style={mn.heading}>{tr('references', true)}</div>
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
  const initials = (info.fullName || '').split(' ').map(w => w[0]).slice(0, 2).join('');

  return (
    <div style={{ fontFamily: font, fontSize: sz.body, color: '#222', backgroundColor: '#fff', width: '794px', minHeight: '1122px', boxSizing: 'border-box', display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
      {/* Sidebar — RIGHT in RTL */}
      <div style={sb.wrapper}>
        {vis.photo !== false && info.photo && (
          <div style={sb.photoWrap}>
            <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <div style={sb.name}>{info.fullName || 'الاسم الكامل'}</div>
        <div style={sb.jobTitle}>{info.jobTitle || ''}</div>

        <div style={sb.sectionLabel}>{tr('contact', true)}</div>
        {contactItems.map((row, i) => (
          <div key={i} style={sb.contactRow}>
            <span style={sb.icon}>{row.icon}</span>
            <span style={{ lineHeight: 1.3, textAlign: 'right' }}>{row.text}</span>
          </div>
        ))}

        {sideKeys.map(k => renderSidebar(k))}
      </div>

      {/* Main — LEFT in RTL */}
      <div style={mn.wrapper}>
        {mainKeys.map(k => renderMain(k))}
      </div>
    </div>
  );
};

export default ArabicNavyTemplate;
