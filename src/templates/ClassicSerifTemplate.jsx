import { resolveTheme, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

const labels = {
  summary:       { en: 'Summary',             ar: 'الملخص المهني'        },
  experience:    { en: 'Professional Experience', ar: 'الخبرة المهنية'  },
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
  present:       { en: 'Present',             ar: 'حتى الآن'             },
  contact:       { en: 'Contact',             ar: 'التواصل'              },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages', 'certificates', 'awards'];

const SIDEBAR_SECTIONS = new Set(['skills', 'languages', 'certificates', 'interests', 'courses', 'awards', 'organisations']);
const MAIN_SECTIONS    = new Set(['summary', 'experience', 'education', 'projects', 'publications', 'references']);

const ClassicSerifTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);
    const accent       = theme?.primaryColor || '#1e3a5f';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || (isRTL ? 'right' : 'left');
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const contactRows = [
    vis.email     !== false && info.email     && { icon: '✉', text: info.email },
    vis.phone     !== false && info.phone     && { icon: '✆', text: info.phone },
    vis.location  !== false && info.location  && { icon: '⌖', text: info.location },
    vis.linkedin  !== false && info.linkedin  && { icon: 'in', text: info.linkedin },
    vis.portfolio !== false && info.portfolio && { icon: '⬡', text: info.portfolio },
  ].filter(Boolean);

  const sidebar = {
    wrapper: {
      width: '220px', minWidth: '220px', backgroundColor: theme?.sidebarColor || '#f4f6f8',
      padding: '28pt 18pt', boxSizing: 'border-box', direction: dir,
    },
    name: {
      fontSize: sz.name, fontWeight: '700', color: accent,
      marginBottom: '3pt', lineHeight: 1.2,
      textAlign: headerAlign,
    },
    jobTitle: {
      fontSize: sz.meta, color: '#666', marginBottom: '14pt',
      textAlign: headerAlign,
    },
    divider: { borderTop: `2px solid ${accent}`, marginBottom: '12pt' },
    sectionLabel: {
      fontSize: '8pt', fontWeight: '700', color: accent,
      textTransform: 'uppercase', letterSpacing: '0.12em',
      marginBottom: '8pt', marginTop: '14pt',
    },
    contactRow: {
      display: 'flex', alignItems: 'flex-start', gap: '6pt',
      marginBottom: '6pt', fontSize: sz.meta, color: '#333',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    icon: {
      width: '14pt', textAlign: 'center', color: accent,
      flexShrink: 0, fontSize: '9pt', marginTop: '1pt',
    },
    skillItem: {
      fontSize: sz.meta, color: '#333', marginBottom: '5pt',
      paddingLeft: isRTL ? '0' : '8pt', paddingRight: isRTL ? '8pt' : '0',
      position: 'relative',
    },
    dot: {
      position: 'absolute', [isRTL ? 'right' : 'left']: '0',
      top: '5pt', width: '4pt', height: '4pt',
      borderRadius: '50%', backgroundColor: accent,
    },
  };

  const main = {
    wrapper: { flex: 1, padding: '28pt 28pt 28pt 22pt', boxSizing: 'border-box', direction: dir },
    sectionLabel: {
      fontSize: sz.heading, fontWeight: '700', color: accent,
      marginTop: sectionMt, marginBottom: '6pt',
      borderBottom: `1.5px solid ${accent}`, paddingBottom: '3pt',
      textAlign: headingAlign,
      ...BREAK_HEADING,
    },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8pt', flexDirection: isRTL ? 'row-reverse' : 'row' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1 },
    date: { fontSize: sz.meta, color: '#666', whiteSpace: 'nowrap', flexShrink: 0 },
    company: { fontSize: sz.meta, color: '#555', marginBottom: '4pt', fontStyle: 'italic' },
    body: { fontSize: sz.body, color: '#222', lineHeight, whiteSpace: 'pre-line' },
    item: { marginBottom: '10pt', ...BREAK_ITEM },
  };

  const renderSideSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills">
            <div style={sidebar.divider} />
            <div style={sidebar.sectionLabel}>{tr('skills', isRTL)}</div>
            {data.skills.map((sk, i) => (
              <div key={i} style={{ position: 'relative', ...sidebar.skillItem }}>
                <span style={sidebar.dot} />
                {sk.name || sk}
              </div>
            ))}
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages">
            <div style={sidebar.divider} />
            <div style={sidebar.sectionLabel}>{tr('languages', isRTL)}</div>
            {data.languages.map((l, i) => (
              <div key={i} style={{ ...sidebar.skillItem, position: 'relative' }}>
                <span style={sidebar.dot} />
                {l.name}{l.level ? ` — ${l.level}` : ''}
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <div style={sidebar.divider} />
            <div style={sidebar.sectionLabel}>{tr('certificates', isRTL)}</div>
            {data.certificates.map((c, i) => (
              <div key={i} style={{ ...sidebar.skillItem, position: 'relative' }}>
                <span style={sidebar.dot} />
                {c.name || c}
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests">
            <div style={sidebar.divider} />
            <div style={sidebar.sectionLabel}>{tr('interests', isRTL)}</div>
            {data.interests.map((it, i) => (
              <div key={i} style={{ ...sidebar.skillItem, position: 'relative' }}>
                <span style={sidebar.dot} />
                {it.name || it}
              </div>
            ))}
          </section>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <section key="awards">
            <div style={sidebar.divider} />
            <div style={sidebar.sectionLabel}>{tr('awards', isRTL)}</div>
            {data.awards.map((a, i) => (
              <div key={i} style={{ ...sidebar.skillItem, position: 'relative', paddingLeft: isRTL ? '0' : '8pt', paddingRight: isRTL ? '8pt' : '0' }}>
                <span style={sidebar.dot} />
                <div style={{ fontSize: sz.meta, fontWeight: '600', color: '#222' }}>{a.title || a.name || a}</div>
                {a.issuer && <div style={{ fontSize: '8pt', color: '#666' }}>{a.issuer}</div>}
              </div>
            ))}
          </section>
        ) : null;

      default: return null;
    }
  };

  const renderMainSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return info.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <div style={main.sectionLabel}>{tr('summary', isRTL)}</div>
            <div style={main.body}>{info.summary}</div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <div style={main.sectionLabel}>{tr('experience', isRTL)}</div>
            {data.experience.map((e, i) => (
              <div key={i} style={main.item}>
                <div style={main.row}>
                  <div style={main.role}>{e.jobTitle}</div>
                  <div style={main.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={main.company}>{e.company}{e.location ? `, ${e.location}` : ''}</div>
                {e.description && <div style={main.body}>{e.description}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <div style={main.sectionLabel}>{tr('education', isRTL)}</div>
            {data.education.map((e, i) => (
              <div key={i} style={main.item}>
                <div style={main.row}>
                  <div style={main.role}>{e.degree}</div>
                  <div style={main.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={main.company}>{e.institution}{e.location ? `, ${e.location}` : ''}</div>
                {e.description && <div style={main.body}>{e.description}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <div style={main.sectionLabel}>{tr('projects', isRTL)}</div>
            {data.projects.map((p, i) => (
              <div key={i} style={main.item}>
                <div style={{ ...main.role, marginBottom: '2pt' }}>{p.name}</div>
                {p.url && <div style={{ fontSize: sz.meta, color: accent, marginBottom: '3pt' }}>{p.url}</div>}
                {p.description && <div style={main.body}>{p.description}</div>}
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
    <div style={{ fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: theme?.bgColor || '#ffffff', width: '794px', minHeight: '1122px', boxSizing: 'border-box', display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', direction: 'ltr' }}>
      {/* Sidebar */}
      <div style={sidebar.wrapper}>
        {/* Photo */}
        {vis.photo !== false && (
          <div style={{ width: '80pt', height: '80pt', borderRadius: '50%', overflow: 'hidden', margin: `0 auto 12pt`, border: `2px solid ${accent}`, backgroundColor: `${accent}33` }}>
            <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width: '100%', height: '100%', objectFit: info.photo ? 'cover' : 'contain' }} />
          </div>
        )}
        <div style={sidebar.name}>{info.fullName || 'Your Name'}</div>
        <div style={sidebar.jobTitle}>{info.jobTitle || ''}</div>
        <div style={sidebar.divider} />

        {/* Contact */}
        <div style={sidebar.sectionLabel}>{tr('contact', isRTL)}</div>
        {contactRows.map((row, i) => (
          <div key={i} style={sidebar.contactRow}>
            <span style={sidebar.icon}>{row.icon}</span>
            <span style={{ wordBreak: 'break-all', lineHeight: 1.3 }}>{row.text}</span>
          </div>
        ))}

        {sideKeys.map(k => renderSideSection(k))}
      </div>

      {/* Main */}
      <div style={main.wrapper}>
        {mainKeys.map(k => renderMainSection(k))}
      </div>
    </div>
  );
};

export default ClassicSerifTemplate;
