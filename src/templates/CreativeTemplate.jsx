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

const CreativeTemplate = ({ data, theme, isRTL = false, visibleSections = {}, visiblePersonalFields = {} }) => {
  const accent = theme?.primaryColor || '#7c3aed';
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const borderSide = isRTL ? 'borderRight' : 'borderLeft';

  const show = (key) => visibleSections[key] !== false;

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      padding, lineHeight, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    bar:     { width: '48pt', height: '3pt', backgroundColor: accent, marginBottom: '8pt', marginLeft: isRTL ? 'auto' : 0, marginRight: isRTL ? 0 : 'auto' },
    name:    { fontSize: sz.name,    fontWeight: '700', color: '#1a1a1a', marginBottom: '2pt', lineHeight: 1.2 },
    jobTitle:{ fontSize: sz.body,    color: accent, fontWeight: '600', marginBottom: '6pt' },
    contact: { fontSize: sz.meta,    color: '#444', marginBottom: '14pt' },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: '#1a1a1a', marginTop: sectionMt, marginBottom: '4pt',
      paddingLeft: isRTL ? 0 : '8pt', paddingRight: isRTL ? '8pt' : 0,
      [borderSide]: `3pt solid ${accent}`,
    },
    role:    { fontSize: sz.body,    fontWeight: '700', marginBottom: '1pt' },
    meta:    { fontSize: sz.meta,    color: '#555', marginBottom: '4pt' },
    body:    { fontSize: sz.body,    color: '#222', lineHeight, whiteSpace: 'pre-line' },
    row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' },
    date:    { fontSize: sz.meta, color: '#666', whiteSpace: 'nowrap', marginLeft: isRTL ? 0 : '12pt', marginRight: isRTL ? '12pt' : 0 },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  return (
    <div style={s.page}>
      <div style={s.bar} />
      <div style={s.name}>{data.personalInfo.fullName}</div>
      <div style={s.jobTitle}>{data.personalInfo.jobTitle}</div>
      {contact && <div style={s.contact}>{contact}</div>}

      {show('summary') && data.personalInfo.summary && <>
        <div style={s.heading}>{tr('summary', isRTL)}</div>
        <div style={{ ...s.body, marginTop: '6pt' }}>{data.personalInfo.summary}</div>
      </>}

      {show('experience') && data.experience?.length > 0 && <>
        <div style={s.heading}>{tr('experience', isRTL)}</div>
        {data.experience.map((e, i) => (
          <div key={i} style={{ marginTop: '8pt', marginBottom: '6pt' }}>
            <div style={s.row}>
              <div style={s.role}>{e.jobTitle}</div>
              <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
            </div>
            <div style={{ ...s.meta, color: accent, fontWeight: '600' }}>{e.company}{e.location ? `، ${e.location}` : ''}</div>
            <div style={s.body}>{e.description}</div>
          </div>
        ))}
      </>}

      {show('education') && data.education?.length > 0 && <>
        <div style={s.heading}>{tr('education', isRTL)}</div>
        {data.education.map((e, i) => (
          <div key={i} style={{ marginTop: '8pt', marginBottom: '6pt' }}>
            <div style={s.row}>
              <div style={s.role}>{e.degree}</div>
              <div style={s.date}>{e.startDate} – {e.endDate}</div>
            </div>
            <div style={s.meta}>{e.institution}</div>
            {e.description && <div style={s.body}>{e.description}</div>}
          </div>
        ))}
      </>}

      {show('skills') && data.skills?.length > 0 && <>
        <div style={s.heading}>{tr('skills', isRTL)}</div>
        <div style={{ ...s.body, marginTop: '6pt' }}>{data.skills.join(' | ')}</div>
      </>}

      {show('languages') && data.languages?.length > 0 && <>
        <div style={s.heading}>{tr('languages', isRTL)}</div>
        <div style={{ ...s.body, marginTop: '6pt' }}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
      </>}

      {show('projects') && data.projects?.length > 0 && <>
        <div style={s.heading}>{tr('projects', isRTL)}</div>
        {data.projects.map((p, i) => (
          <div key={i} style={{ marginTop: '6pt' }}>
            <div style={s.role}>{p.title}</div>
            <div style={s.body}>{p.description}</div>
          </div>
        ))}
      </>}
    </div>
  );
};

export default CreativeTemplate;
