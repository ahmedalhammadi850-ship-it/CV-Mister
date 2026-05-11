const SIZES = {
  small:  { name: '18pt', heading: '12pt', body: '10pt', meta: '9pt'  },
  medium: { name: '20pt', heading: '14pt', body: '11pt', meta: '10pt' },
  large:  { name: '22pt', heading: '16pt', body: '13pt', meta: '11pt' },
};

const labels = {
  summary:    { en: 'Professional Summary',  ar: 'الملخص المهني'     },
  experience: { en: 'Work Experience',       ar: 'الخبرة العملية'    },
  education:  { en: 'Education',             ar: 'التعليم'           },
  skills:     { en: 'Skills',                ar: 'المهارات'          },
  languages:  { en: 'Languages',             ar: 'اللغات'            },
  projects:   { en: 'Projects',              ar: 'المشاريع'          },
  email:      { en: 'Email',                 ar: 'البريد الإلكتروني' },
  phone:      { en: 'Phone',                 ar: 'الهاتف'            },
  location:   { en: 'Location',              ar: 'الموقع'            },
  linkedin:   { en: 'LinkedIn',              ar: 'لينكد إن'          },
  present:    { en: 'Present',               ar: 'حتى الآن'          },
};
const tr = (key, isRTL) => labels[key][isRTL ? 'ar' : 'en'];

const CreativeTemplate = ({ data, theme, isRTL = false }) => {
  const accent = theme?.primaryColor || '#7c3aed';
  const sz = SIZES[theme?.fontSize || 'medium'];
  const dir = isRTL ? 'rtl' : 'ltr';
  const font = isRTL ? "'Tajawal', Arial, sans-serif" : "'Calibri', 'Carlito', Arial, sans-serif";
  const borderSide = isRTL ? 'borderRight' : 'borderLeft';

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      padding: '36pt 44pt', lineHeight: isRTL ? 1.8 : 1.4, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    bar:     { width: '48pt', height: '3pt', backgroundColor: accent, marginBottom: '8pt', marginLeft: isRTL ? 'auto' : 0, marginRight: isRTL ? 0 : 'auto' },
    name:    { fontSize: sz.name,    fontWeight: '700', color: '#1a1a1a', marginBottom: '2pt', lineHeight: 1.2 },
    jobTitle:{ fontSize: sz.body,    color: accent, fontWeight: '600', marginBottom: '6pt' },
    contact: { fontSize: sz.meta,    color: '#444', marginBottom: '14pt' },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: '#1a1a1a', marginTop: '14pt', marginBottom: '4pt',
      paddingLeft: isRTL ? 0 : '8pt', paddingRight: isRTL ? '8pt' : 0,
      [borderSide]: `3pt solid ${accent}`,
    },
    role:    { fontSize: sz.body,    fontWeight: '700', marginBottom: '1pt' },
    meta:    { fontSize: sz.meta,    color: '#555', marginBottom: '4pt' },
    body:    { fontSize: sz.body,    color: '#222', lineHeight: isRTL ? 1.9 : 1.5, whiteSpace: 'pre-line' },
    row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' },
    date:    { fontSize: sz.meta, color: '#666', whiteSpace: 'nowrap', marginLeft: isRTL ? 0 : '12pt', marginRight: isRTL ? '12pt' : 0 },
  };

  const contact = [
    data.personalInfo.email    && `${tr('email', isRTL)}: ${data.personalInfo.email}`,
    data.personalInfo.phone    && `${tr('phone', isRTL)}: ${data.personalInfo.phone}`,
    data.personalInfo.location && `${tr('location', isRTL)}: ${data.personalInfo.location}`,
    data.personalInfo.linkedin && `${tr('linkedin', isRTL)}: ${data.personalInfo.linkedin}`,
  ].filter(Boolean).join('   |   ');

  return (
    <div style={s.page}>
      <div style={s.bar} />
      <div style={s.name}>{data.personalInfo.fullName}</div>
      <div style={s.jobTitle}>{data.personalInfo.jobTitle}</div>
      <div style={s.contact}>{contact}</div>

      {data.personalInfo.summary && <>
        <div style={s.heading}>{tr('summary', isRTL)}</div>
        <div style={{ ...s.body, marginTop: '6pt' }}>{data.personalInfo.summary}</div>
      </>}

      {data.experience?.length > 0 && <>
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

      {data.education?.length > 0 && <>
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

      {data.skills?.length > 0 && <>
        <div style={s.heading}>{tr('skills', isRTL)}</div>
        <div style={{ ...s.body, marginTop: '6pt' }}>{data.skills.join(' | ')}</div>
      </>}

      {data.languages?.length > 0 && <>
        <div style={s.heading}>{tr('languages', isRTL)}</div>
        <div style={{ ...s.body, marginTop: '6pt' }}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
      </>}

      {data.projects?.length > 0 && <>
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
