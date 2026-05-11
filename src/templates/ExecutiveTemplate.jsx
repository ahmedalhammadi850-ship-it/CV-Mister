const SIZES = {
  small:  { name: '18pt', heading: '12pt', body: '10pt', meta: '9pt'  },
  medium: { name: '20pt', heading: '14pt', body: '11pt', meta: '10pt' },
  large:  { name: '22pt', heading: '16pt', body: '13pt', meta: '11pt' },
};

const labels = {
  execSummary: { en: 'Executive Summary',      ar: 'الملخص التنفيذي'   },
  experience:  { en: 'Professional Experience', ar: 'الخبرة المهنية'   },
  education:   { en: 'Education',               ar: 'التعليم'           },
  skills:      { en: 'Core Competencies',       ar: 'الكفاءات الأساسية' },
  languages:   { en: 'Languages',               ar: 'اللغات'            },
  email:       { en: 'Email',                   ar: 'البريد الإلكتروني' },
  phone:       { en: 'Phone',                   ar: 'الهاتف'            },
  location:    { en: 'Location',                ar: 'الموقع'            },
  linkedin:    { en: 'LinkedIn',                ar: 'لينكد إن'          },
  present:     { en: 'Present',                 ar: 'حتى الآن'          },
};
const tr = (key, isRTL) => labels[key][isRTL ? 'ar' : 'en'];

const ExecutiveTemplate = ({ data, theme, isRTL = false }) => {
  const accent = theme?.primaryColor || '#0f2942';
  const gold = '#c9a84c';
  const sz = SIZES[theme?.fontSize || 'medium'];
  const dir = isRTL ? 'rtl' : 'ltr';
  const font = isRTL ? "'Tajawal', Arial, sans-serif" : "'Calibri', 'Carlito', Arial, sans-serif";

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      padding: '36pt 44pt', lineHeight: isRTL ? 1.8 : 1.4, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    name:    { fontSize: sz.name,    fontWeight: '700', color: accent, marginBottom: '2pt', textTransform: 'uppercase', letterSpacing: '0.04em' },
    jobTitle:{ fontSize: sz.body,    color: '#555', marginBottom: '6pt', letterSpacing: '0.06em', textTransform: 'uppercase' },
    contact: { fontSize: sz.meta,    color: '#444', marginBottom: '10pt' },
    hdivider:{ borderBottom: `3px double ${accent}`, marginBottom: '14pt' },
    role:    { fontSize: sz.body,    fontWeight: '700', marginBottom: '1pt' },
    meta:    { fontSize: sz.meta,    color: '#555', marginBottom: '4pt' },
    body:    { fontSize: sz.body,    color: '#222', lineHeight: isRTL ? 1.9 : 1.5, whiteSpace: 'pre-line' },
    row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' },
    date:    { fontSize: sz.meta, color: '#555', whiteSpace: 'nowrap', marginLeft: isRTL ? 0 : '12pt', marginRight: isRTL ? '12pt' : 0 },
  };

  const SectionHeading = ({ labelKey }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8pt', marginTop: '14pt', marginBottom: '8pt', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      <div style={{ fontSize: sz.heading, fontWeight: '700', color: accent, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {tr(labelKey, isRTL)}
      </div>
      <div style={{ flex: 1, borderBottom: `1px solid ${gold}` }} />
    </div>
  );

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
      <div style={s.hdivider} />

      {data.personalInfo.summary && <>
        <SectionHeading labelKey="execSummary" />
        <div style={{ ...s.body, fontStyle: 'italic' }}>{data.personalInfo.summary}</div>
      </>}

      {data.experience?.length > 0 && <>
        <SectionHeading labelKey="experience" />
        {data.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: '10pt' }}>
            <div style={s.row}>
              <div style={s.role}>{e.jobTitle}</div>
              <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
            </div>
            <div style={{ ...s.meta, fontWeight: '600' }}>{e.company}{e.location ? `، ${e.location}` : ''}</div>
            <div style={s.body}>{e.description}</div>
          </div>
        ))}
      </>}

      {data.education?.length > 0 && <>
        <SectionHeading labelKey="education" />
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
        <SectionHeading labelKey="skills" />
        <div style={s.body}>{data.skills.join(' | ')}</div>
      </>}

      {data.languages?.length > 0 && <>
        <SectionHeading labelKey="languages" />
        <div style={s.body}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
      </>}
    </div>
  );
};

export default ExecutiveTemplate;
