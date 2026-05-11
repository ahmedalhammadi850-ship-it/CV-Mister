const t = {
  summary:    { en: 'Work Experience',       ar: 'الخبرة العملية'    },
  experience: { en: 'Work Experience',       ar: 'الخبرة العملية'    },
  education:  { en: 'Education',             ar: 'التعليم'           },
  skills:     { en: 'Skills',                ar: 'المهارات'          },
  languages:  { en: 'Languages',             ar: 'اللغات'            },
  email:      { en: 'Email',                 ar: 'البريد الإلكتروني' },
  phone:      { en: 'Phone',                 ar: 'الهاتف'            },
  location:   { en: 'Location',              ar: 'الموقع'            },
  linkedin:   { en: 'LinkedIn',              ar: 'لينكد إن'          },
  present:    { en: 'Present',               ar: 'حتى الآن'          },
};
const tr = (key, isRTL) => t[key][isRTL ? 'ar' : 'en'];

const MinimalTemplate = ({ data, theme, isRTL = false }) => {
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
      padding: '40pt 50pt',
      lineHeight: isRTL ? 1.8 : 1.45,
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
      direction: dir,
      textAlign: isRTL ? 'right' : 'left',
    },
    name: { fontSize: '20pt', fontWeight: '700', color: '#111', marginBottom: '2pt', letterSpacing: '-0.01em' },
    jobTitle: { fontSize: '11pt', color: '#777', fontWeight: '400', marginBottom: '8pt' },
    contactRow: {
      fontSize: '10pt', color: '#555', marginBottom: '16pt',
      paddingBottom: '12pt', borderBottom: '1px solid #ddd',
    },
    sectionHeading: {
      fontSize: '14pt', fontWeight: '700', color: '#111',
      marginTop: '16pt', marginBottom: '2pt',
    },
    divider: { borderBottom: '1px solid #e0e0e0', marginBottom: '8pt' },
    jobRole: { fontSize: '11pt', fontWeight: '700', marginBottom: '1pt' },
    jobMeta: { fontSize: '10pt', color: '#666', marginBottom: '4pt' },
    bodyText: { fontSize: '11pt', color: '#333', lineHeight: isRTL ? 1.9 : 1.55, whiteSpace: 'pre-line' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' },
    date: { fontSize: '10pt', color: '#888', whiteSpace: 'nowrap', marginLeft: isRTL ? 0 : '12pt', marginRight: isRTL ? '12pt' : 0 },
  };

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

      {data.personalInfo.summary && (
        <div style={{ marginBottom: '4pt' }}>
          <div style={s.bodyText}>{data.personalInfo.summary}</div>
        </div>
      )}

      {data.experience?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>{tr('experience', isRTL)}</div>
          <div style={s.divider} />
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '10pt' }}>
              <div style={s.row}>
                <div style={s.jobRole}>{exp.jobTitle}</div>
                <div style={s.date}>{exp.startDate} – {exp.current ? tr('present', isRTL) : exp.endDate}</div>
              </div>
              <div style={s.jobMeta}>{exp.company}</div>
              <div style={s.bodyText}>{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {data.education?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>{tr('education', isRTL)}</div>
          <div style={s.divider} />
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
          <div style={s.sectionHeading}>{tr('skills', isRTL)}</div>
          <div style={s.divider} />
          <div style={s.bodyText}>{data.skills.join(' | ')}</div>
        </div>
      )}

      {data.languages?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>{tr('languages', isRTL)}</div>
          <div style={s.divider} />
          <div style={s.bodyText}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
