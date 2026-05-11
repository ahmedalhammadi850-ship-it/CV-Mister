const t = {
  execSummary: { en: 'Executive Summary',     ar: 'الملخص التنفيذي'   },
  experience:  { en: 'Professional Experience', ar: 'الخبرة المهنية'  },
  education:   { en: 'Education',              ar: 'التعليم'           },
  skills:      { en: 'Core Competencies',      ar: 'الكفاءات الأساسية' },
  languages:   { en: 'Languages',              ar: 'اللغات'            },
  email:       { en: 'Email',                  ar: 'البريد الإلكتروني' },
  phone:       { en: 'Phone',                  ar: 'الهاتف'            },
  location:    { en: 'Location',               ar: 'الموقع'            },
  linkedin:    { en: 'LinkedIn',               ar: 'لينكد إن'          },
  present:     { en: 'Present',                ar: 'حتى الآن'          },
};
const tr = (key, isRTL) => t[key][isRTL ? 'ar' : 'en'];

const ExecutiveTemplate = ({ data, theme, isRTL = false }) => {
  const accentColor = theme?.primaryColor || '#0f2942';
  const gold = '#c9a84c';
  const dir = isRTL ? 'rtl' : 'ltr';
  const font = isRTL
    ? "'Tajawal', Arial, sans-serif"
    : "'Calibri', 'Carlito', Arial, sans-serif";

  const s = {
    page: {
      fontFamily: font,
      fontSize: '11pt',
      color: '#1a1a1a',
      backgroundColor: '#ffffff',
      padding: '36pt 44pt',
      lineHeight: isRTL ? 1.8 : 1.4,
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
      direction: dir,
      textAlign: isRTL ? 'right' : 'left',
    },
    name: {
      fontSize: '20pt', fontWeight: '700', color: accentColor, marginBottom: '2pt',
      textTransform: 'uppercase', letterSpacing: '0.04em',
    },
    jobTitle: { fontSize: '11pt', color: '#555', marginBottom: '6pt', letterSpacing: '0.06em', textTransform: 'uppercase' },
    contactRow: { fontSize: '10pt', color: '#444', marginBottom: '10pt' },
    headerDivider: { borderBottom: `3px double ${accentColor}`, marginBottom: '14pt' },
    jobRole: { fontSize: '11pt', fontWeight: '700', marginBottom: '1pt' },
    jobMeta: { fontSize: '10pt', color: '#555', marginBottom: '4pt' },
    bodyText: { fontSize: '11pt', color: '#222', lineHeight: isRTL ? 1.9 : 1.5, whiteSpace: 'pre-line' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' },
    date: { fontSize: '10pt', color: '#555', whiteSpace: 'nowrap', marginLeft: isRTL ? 0 : '12pt', marginRight: isRTL ? '12pt' : 0 },
  };

  const SectionHeading = ({ label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8pt', marginTop: '14pt', marginBottom: '8pt', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      <div style={{ fontSize: '14pt', fontWeight: '700', color: accentColor, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </div>
      <div style={{ flex: 1, borderBottom: `1px solid ${gold}` }} />
    </div>
  );

  const contactParts = [
    data.personalInfo.email    && `${tr('email', isRTL)}: ${data.personalInfo.email}`,
    data.personalInfo.phone    && `${tr('phone', isRTL)}: ${data.personalInfo.phone}`,
    data.personalInfo.location && `${tr('location', isRTL)}: ${data.personalInfo.location}`,
    data.personalInfo.linkedin && `${tr('linkedin', isRTL)}: ${data.personalInfo.linkedin}`,
  ].filter(Boolean);

  return (
    <div style={s.page}>
      <div style={s.name}>{data.personalInfo.fullName}</div>
      <div style={s.jobTitle}>{data.personalInfo.jobTitle}</div>
      <div style={s.contactRow}>{contactParts.join('   |   ')}</div>
      <div style={s.headerDivider} />

      {data.personalInfo.summary && (
        <div>
          <SectionHeading label={tr('execSummary', isRTL)} />
          <div style={{ ...s.bodyText, fontStyle: 'italic' }}>{data.personalInfo.summary}</div>
        </div>
      )}

      {data.experience?.length > 0 && (
        <div>
          <SectionHeading label={tr('experience', isRTL)} />
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '10pt' }}>
              <div style={s.row}>
                <div style={s.jobRole}>{exp.jobTitle}</div>
                <div style={s.date}>{exp.startDate} – {exp.current ? tr('present', isRTL) : exp.endDate}</div>
              </div>
              <div style={{ ...s.jobMeta, fontWeight: '600' }}>
                {exp.company}{exp.location ? `، ${exp.location}` : ''}
              </div>
              <div style={s.bodyText}>{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {data.education?.length > 0 && (
        <div>
          <SectionHeading label={tr('education', isRTL)} />
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '8pt' }}>
              <div style={s.row}>
                <div style={s.jobRole}>{edu.degree}</div>
                <div style={s.date}>{edu.startDate} – {edu.endDate}</div>
              </div>
              <div style={s.jobMeta}>{edu.institution}</div>
              {edu.description && <div style={s.bodyText}>{edu.description}</div>}
            </div>
          ))}
        </div>
      )}

      {data.skills?.length > 0 && (
        <div>
          <SectionHeading label={tr('skills', isRTL)} />
          <div style={s.bodyText}>{data.skills.join(' | ')}</div>
        </div>
      )}

      {data.languages?.length > 0 && (
        <div>
          <SectionHeading label={tr('languages', isRTL)} />
          <div style={s.bodyText}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
