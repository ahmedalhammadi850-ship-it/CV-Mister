import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

const labels = {
  summary:       { en: 'Summary',             ar: 'الملخص'               },
  experience:    { en: 'Work Experience',      ar: 'الخبرة العملية'       },
  education:     { en: 'Education',           ar: 'التعليم'              },
  skills:        { en: 'Skills',              ar: 'المهارات'             },
  languages:     { en: 'Languages',           ar: 'اللغات'               },
  projects:      { en: 'Projects',            ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',        ar: 'الشهادات'             },
  interests:     { en: 'Interests',           ar: 'الاهتمامات'           },
  courses:       { en: 'Courses',             ar: 'الدورات'              },
  awards:        { en: 'Awards',              ar: 'الجوائز'              },
  organisations: { en: 'Organisations',       ar: 'المنظمات'             },
  publications:  { en: 'Publications',        ar: 'المنشورات'            },
  references:    { en: 'References',          ar: 'المراجع'              },
  profile:       { en: 'Profile',             ar: 'نبذة تعريفية'         },
  present:       { en: 'Present',             ar: 'حتى الآن'             },
};
const tr = (key, isRTL) => labels[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages', 'certificates', 'awards'];

const SIDEBAR_SECTIONS = new Set(['skills', 'languages', 'interests', 'certificates', 'courses', 'awards', 'organisations']);
const MAIN_SECTIONS    = new Set(['summary', 'experience', 'education', 'projects', 'publications', 'references']);

const Dots = ({ level = 3, accent }) => {
  const filled = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <span style={{ display: 'inline-flex', gap: '3pt', marginLeft: '4pt' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: i <= filled ? '#fff' : 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
      ))}
    </span>
  );
};

const AtlanticBlueTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent = theme?.primaryColor || '#1e3d6e';
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

  const sb = {
    wrapper: {
      width: '240px', minWidth: '240px',
      backgroundColor: accent,
      padding: '32pt 18pt',
      boxSizing: 'border-box',
      direction: dir,
      color: '#fff',
    },
    name: { fontSize: '15pt', fontWeight: '700', color: '#fff', marginBottom: '3pt', lineHeight: 1.2 },
    jobTitle: { fontSize: sz.meta, color: 'rgba(255,255,255,0.72)', marginBottom: '20pt', fontStyle: 'italic' },
    divider: { borderTop: '1px solid rgba(255,255,255,0.25)', margin: '14pt 0 10pt' },
    sectionLabel: {
      fontSize: '8pt', fontWeight: '700', color: 'rgba(255,255,255,0.5)',
      textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10pt',
    },
    contactRow: {
      display: 'flex', gap: '7pt', marginBottom: '7pt',
      fontSize: sz.meta, color: 'rgba(255,255,255,0.85)',
      alignItems: 'flex-start',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    icon: { width: '14pt', textAlign: 'center', flexShrink: 0, fontSize: '9pt', marginTop: '1pt' },
    skillRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7pt', fontSize: sz.meta, color: '#fff', flexDirection: isRTL ? 'row-reverse' : 'row' },
    tag: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: '3pt', padding: '2pt 7pt', fontSize: sz.meta, color: '#fff', marginRight: '4pt', marginBottom: '4pt' },
  };

  const mn = {
    wrapper: { flex: 1, padding: '32pt 28pt 28pt 24pt', boxSizing: 'border-box', direction: dir },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: accent,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginTop: sectionMt, marginBottom: '8pt',
      borderBottom: `2px solid ${accent}`, paddingBottom: '3pt',
      textAlign: isRTL ? 'right' : 'left',
      ...BREAK_HEADING,
    },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8pt', flexDirection: isRTL ? 'row-reverse' : 'row' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1 },
    date: { fontSize: sz.meta, color: '#666', whiteSpace: 'nowrap', flexShrink: 0, background: accent + '14', padding: '1pt 6pt', borderRadius: '3pt' },
    company: { fontSize: sz.meta, color: accent, fontWeight: '600', marginBottom: '4pt' },
    body: { fontSize: sz.body, color: '#333', lineHeight, whiteSpace: 'pre-line' },
    item: { marginBottom: '12pt', ...BREAK_ITEM },
  };

  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'skills':
        return data.skills?.length > 0 ? (
          <div key="skills">
            <div style={sb.divider} />
            <div style={sb.sectionLabel}>{tr('skills', isRTL)}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.skills.map((sk, i) => (
                <span key={i} style={sb.tag}>{sk.name || sk}</span>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages">
            <div style={sb.divider} />
            <div style={sb.sectionLabel}>{tr('languages', isRTL)}</div>
            {data.languages.map((l, i) => (
              <div key={i} style={sb.skillRow}>
                <span>{l.name}</span>
                <Dots level={l.proficiency || 3} accent={accent} />
              </div>
            ))}
          </div>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <div key="interests">
            <div style={sb.divider} />
            <div style={sb.sectionLabel}>{tr('interests', isRTL)}</div>
            <div style={{ fontSize: sz.meta, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              {data.interests.map(i => i.name || i).join('  •  ')}
            </div>
          </div>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <div key="certificates">
            <div style={sb.divider} />
            <div style={sb.sectionLabel}>{tr('certificates', isRTL)}</div>
            {data.certificates.map((c, i) => (
              <div key={i} style={{ fontSize: sz.meta, color: 'rgba(255,255,255,0.85)', marginBottom: '4pt' }}>• {c.name || c}</div>
            ))}
          </div>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <div key="awards">
            <div style={sb.divider} />
            <div style={sb.sectionLabel}>{tr('awards', isRTL)}</div>
            {data.awards.map((a, i) => (
              <div key={i} style={{ marginBottom: '6pt' }}>
                <div style={{ fontSize: sz.meta, fontWeight: '600', color: '#fff' }}>{a.title || a.name || a}</div>
                {a.issuer && <div style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.6)' }}>{a.issuer}</div>}
              </div>
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

      case 'education':
        return data.education?.length > 0 ? (
          <div key="education">
            <div style={mn.heading}>{tr('education', isRTL)}</div>
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
            <div style={mn.heading}>{tr('projects', isRTL)}</div>
            {data.projects.map((p, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.role}>{p.name}</div>
                {p.url && <div style={{ fontSize: sz.meta, color: accent, marginBottom: '2pt' }}>{p.url}</div>}
                {p.description && <div style={mn.body}>{p.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      default: return null;
    }
  };

  const sideKeys = sectionOrder.filter(k => SIDEBAR_SECTIONS.has(k));
  const mainKeys = sectionOrder.filter(k => MAIN_SECTIONS.has(k));

  return (
    <div style={{ fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff', width: '794px', minHeight: '1122px', boxSizing: 'border-box', display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      {/* Sidebar */}
      <div style={sb.wrapper}>
        <div style={sb.name}>{info.fullName || 'Your Name'}</div>
        <div style={sb.jobTitle}>{info.jobTitle || ''}</div>

        {/* Contact */}
        <div style={sb.sectionLabel}>{tr('profile', isRTL)}</div>
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

export default AtlanticBlueTemplate;
