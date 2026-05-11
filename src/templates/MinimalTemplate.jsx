const SIZES = {
  small:  { name: '18pt', heading: '12pt', body: '10pt', meta: '9pt'  },
  medium: { name: '20pt', heading: '14pt', body: '11pt', meta: '10pt' },
  large:  { name: '22pt', heading: '16pt', body: '13pt', meta: '11pt' },
};

const labels = {
  experience: { en: 'Work Experience', ar: 'الخبرة العملية' },
  education:  { en: 'Education',       ar: 'التعليم'        },
  skills:     { en: 'Skills',          ar: 'المهارات'       },
  languages:  { en: 'Languages',       ar: 'اللغات'         },
  email:      { en: 'Email',           ar: 'البريد الإلكتروني' },
  phone:      { en: 'Phone',           ar: 'الهاتف'         },
  location:   { en: 'Location',        ar: 'الموقع'         },
  linkedin:   { en: 'LinkedIn',        ar: 'لينكد إن'       },
  present:    { en: 'Present',         ar: 'حتى الآن'       },
};
const tr = (key, isRTL) => labels[key][isRTL ? 'ar' : 'en'];

const MinimalTemplate = ({ data, theme, isRTL = false }) => {
  const sz = SIZES[theme?.fontSize || 'medium'];
  const dir = isRTL ? 'rtl' : 'ltr';
  const font = isRTL ? "'Tajawal', Arial, sans-serif" : "'Calibri', 'Carlito', Arial, sans-serif";

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      padding: '40pt 50pt', lineHeight: isRTL ? 1.8 : 1.45, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    name:    { fontSize: sz.name,    fontWeight: '700', color: '#111', marginBottom: '2pt', letterSpacing: '-0.01em' },
    jobTitle:{ fontSize: sz.body,    color: '#777', marginBottom: '8pt' },
    contact: { fontSize: sz.meta,    color: '#555', marginBottom: '16pt', paddingBottom: '12pt', borderBottom: '1px solid #ddd' },
    heading: { fontSize: sz.heading, fontWeight: '700', color: '#111', marginTop: '16pt', marginBottom: '2pt' },
    divider: { borderBottom: '1px solid #e0e0e0', marginBottom: '8pt' },
    role:    { fontSize: sz.body,    fontWeight: '700', marginBottom: '1pt' },
    meta:    { fontSize: sz.meta,    color: '#666', marginBottom: '4pt' },
    body:    { fontSize: sz.body,    color: '#333', lineHeight: isRTL ? 1.9 : 1.55, whiteSpace: 'pre-line' },
    row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' },
    date:    { fontSize: sz.meta, color: '#888', whiteSpace: 'nowrap', marginLeft: isRTL ? 0 : '12pt', marginRight: isRTL ? '12pt' : 0 },
  };

  const contact = [
    data.personalInfo.email    && `${tr('email', isRTL)}: ${data.personalInfo.email}`,
    data.personalInfo.phone    && `${tr('phone', isRTL)}: ${data.personalInfo.phone}`,
    data.personalInfo.location && `${tr('location', isRTL)}: ${data.personalInfo.location}`,
    data.personalInfo.linkedin && `${tr('linkedin', isRTL)}: ${data.personalInfo.linkedin}`,
  ].filter(Boolean).join('   |   ');

  return (
    <div style={s.page}>
      <div style={s.name}>{data.personalInfo.fullName}</div>
      <div style={s.jobTitle}>{data.personalInfo.jobTitle}</div>
      <div style={s.contact}>{contact}</div>

      {data.personalInfo.summary && <div style={{ ...s.body, marginBottom: '4pt' }}>{data.personalInfo.summary}</div>}

      {data.experience?.length > 0 && <>
        <div style={s.heading}>{tr('experience', isRTL)}</div>
        <div style={s.divider} />
        {data.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: '10pt' }}>
            <div style={s.row}>
              <div style={s.role}>{e.jobTitle}</div>
              <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
            </div>
            <div style={s.meta}>{e.company}</div>
            <div style={s.body}>{e.description}</div>
          </div>
        ))}
      </>}

      {data.education?.length > 0 && <>
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
      </>}

      {data.skills?.length > 0 && <>
        <div style={s.heading}>{tr('skills', isRTL)}</div>
        <div style={s.divider} />
        <div style={s.body}>{data.skills.join(' | ')}</div>
      </>}

      {data.languages?.length > 0 && <>
        <div style={s.heading}>{tr('languages', isRTL)}</div>
        <div style={s.divider} />
        <div style={s.body}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
      </>}
    </div>
  );
};

export default MinimalTemplate;
