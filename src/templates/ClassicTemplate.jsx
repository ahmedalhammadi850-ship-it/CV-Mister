import { resolveTheme, buildContact } from './templateUtils';

const labels = {
  summary:    { en: 'Professional Summary',  ar: 'الملخص المهني'     },
  experience: { en: 'Work Experience',       ar: 'الخبرة العملية'    },
  education:  { en: 'Education',             ar: 'التعليم'           },
  skills:     { en: 'Skills',                ar: 'المهارات'          },
  languages:  { en: 'Languages',             ar: 'اللغات'            },
  projects:   { en: 'Projects',              ar: 'المشاريع'          },
  present:    { en: 'Present',               ar: 'حتى الآن'          },
};
const tr = (key, isRTL) => labels[key][isRTL ? 'ar' : 'en'];

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

const ClassicTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent = theme?.primaryColor || '#1e3a5f';
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';

  const show = (key) => visibleSections[key] !== false;

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      padding, lineHeight, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    header:  { textAlign: 'center', borderBottom: `2px solid ${accent}`, paddingBottom: '10pt', marginBottom: '12pt' },
    name:    { fontSize: sz.name,    fontWeight: '700', color: accent, marginBottom: '3pt' },
    jobTitle:{ fontSize: sz.body,    color: '#555', marginBottom: '5pt' },
    contact: { fontSize: sz.meta,    color: '#444' },
    heading: { fontSize: sz.heading, fontWeight: '700', color: accent, marginTop: sectionMt, marginBottom: '5pt', textTransform: 'uppercase', letterSpacing: '0.04em' },
    divider: { borderBottom: `1px solid ${accent}`, marginBottom: '7pt' },
    role:    { fontSize: sz.body,    fontWeight: '700', marginBottom: '1pt' },
    meta:    { fontSize: sz.meta,    color: '#555', fontStyle: 'italic', marginBottom: '4pt' },
    body:    { fontSize: sz.body,    color: '#222', lineHeight, whiteSpace: 'pre-line' },
    row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' },
    date:    { fontSize: sz.meta, color: '#555', whiteSpace: 'nowrap', marginLeft: isRTL ? 0 : '12pt', marginRight: isRTL ? '12pt' : 0 },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return data.personalInfo.summary ? (
          <div key="summary">
            <div style={s.heading}>{tr('summary', isRTL)}</div>
            <div style={s.divider} />
            <div style={s.body}>{data.personalInfo.summary}</div>
          </div>
        ) : null;
      case 'experience':
        return data.experience?.length > 0 ? (
          <div key="experience">
            <div style={s.heading}>{tr('experience', isRTL)}</div>
            <div style={s.divider} />
            {data.experience.map((e, i) => (
              <div key={i} style={{ marginBottom: '10pt' }}>
                <div style={s.row}>
                  <div style={s.role}>{e.jobTitle}</div>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.meta}>{e.company}{e.location ? `، ${e.location}` : ''}</div>
                <div style={s.body}>{e.description}</div>
              </div>
            ))}
          </div>
        ) : null;
      case 'education':
        return data.education?.length > 0 ? (
          <div key="education">
            <div style={s.heading}>{tr('education', isRTL)}</div>
            <div style={s.divider} />
            {data.education.map((e, i) => (
              <div key={i} style={{ marginBottom: '8pt' }}>
                <div style={s.row}>
                  <div style={s.role}>{e.degree}</div>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={s.meta}>{e.institution}</div>
                {e.description && <div style={s.body}>{e.description}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case 'skills':
        return data.skills?.length > 0 ? (
          <div key="skills">
            <div style={s.heading}>{tr('skills', isRTL)}</div>
            <div style={s.divider} />
            <div style={s.body}>{data.skills.join(' | ')}</div>
          </div>
        ) : null;
      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages">
            <div style={s.heading}>{tr('languages', isRTL)}</div>
            <div style={s.divider} />
            <div style={s.body}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
          </div>
        ) : null;
      case 'projects':
        return data.projects?.length > 0 ? (
          <div key="projects">
            <div style={s.heading}>{tr('projects', isRTL)}</div>
            <div style={s.divider} />
            {data.projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '8pt' }}>
                <div style={s.role}>{p.title}</div>
                <div style={s.body}>{p.description}</div>
              </div>
            ))}
          </div>
        ) : null;
      default: return null;
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.name}>{data.personalInfo.fullName}</div>
        <div style={s.jobTitle}>{data.personalInfo.jobTitle}</div>
        {contact && <div style={s.contact}>{contact}</div>}
      </div>
      {sectionOrder.map(key => renderSection(key))}
    </div>
  );
};

export default ClassicTemplate;
