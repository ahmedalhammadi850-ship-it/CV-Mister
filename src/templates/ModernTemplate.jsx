const t = {
  summary:    { en: 'Professional Summary',  ar: 'الملخص المهني'     },
  experience: { en: 'Work Experience',       ar: 'الخبرة العملية'    },
  education:  { en: 'Education',             ar: 'التعليم'           },
  skills:     { en: 'Skills',                ar: 'المهارات'          },
  languages:  { en: 'Languages',             ar: 'اللغات'            },
  email:      { en: 'Email',                 ar: 'البريد الإلكتروني' },
  phone:      { en: 'Phone',                 ar: 'الهاتف'            },
  location:   { en: 'Location',              ar: 'الموقع'            },
  linkedin:   { en: 'LinkedIn',              ar: 'لينكد إن'          },
  present:    { en: 'Present',               ar: 'حتى الآن'          },
  to:         { en: 'to',                    ar: 'إلى'               },
};
const tr = (key, isRTL) => t[key][isRTL ? 'ar' : 'en'];

const ModernTemplate = ({ data, theme, isRTL = false }) => {
  const accentColor = theme?.primaryColor || '#4f46e5';
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
      padding: '36pt 42pt',
      lineHeight: isRTL ? 1.8 : 1.4,
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
      direction: dir,
      textAlign: isRTL ? 'right' : 'left',
    },
    name: {
      fontSize: '20pt',
      fontWeight: '700',
      color: accentColor,
      marginBottom: '3pt',
      lineHeight: 1.2,
    },
    jobTitle: { fontSize: '11pt', color: '#555', marginBottom: '6pt' },
    contactRow: {
      fontSize: '10pt',
      color: '#444',
      marginBottom: '14pt',
      borderBottom: `2px solid ${accentColor}`,
      paddingBottom: '8pt',
    },
    sectionHeading: {
      fontSize: '14pt',
      fontWeight: '700',
      color: accentColor,
      marginTop: '14pt',
      marginBottom: '6pt',
      borderBottom: `1px solid ${accentColor}`,
      paddingBottom: '2pt',
    },
    jobRole: { fontSize: '11pt', fontWeight: '700', marginBottom: '1pt' },
    jobMeta: { fontSize: '10pt', color: '#555', marginBottom: '4pt' },
    bodyText: { fontSize: '11pt', color: '#222', lineHeight: isRTL ? 1.9 : 1.5, whiteSpace: 'pre-line' },
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
        <div>
          <div style={s.sectionHeading}>{tr('summary', isRTL)}</div>
          <div style={s.bodyText}>{data.personalInfo.summary}</div>
        </div>
      )}

      {data.experience?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>{tr('experience', isRTL)}</div>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '10pt' }}>
              <div style={s.jobRole}>{exp.jobTitle}</div>
              <div style={s.jobMeta}>
                {exp.company}{exp.location ? `، ${exp.location}` : ''} — {exp.startDate} {tr('to', isRTL)} {exp.current ? tr('present', isRTL) : exp.endDate}
              </div>
              <div style={s.bodyText}>{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {data.education?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>{tr('education', isRTL)}</div>
          {data.education.map((edu, i) => (
            <div key={i} style={{ marginBottom: '8pt' }}>
              <div style={s.jobRole}>{edu.degree}</div>
              <div style={s.jobMeta}>{edu.institution} — {edu.startDate} {tr('to', isRTL)} {edu.endDate}</div>
              {edu.description && <div style={s.bodyText}>{edu.description}</div>}
            </div>
          ))}
        </div>
      )}

      {data.skills?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>{tr('skills', isRTL)}</div>
          <div style={s.bodyText}>{data.skills.join(' | ')}</div>
        </div>
      )}

      {data.languages?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>{tr('languages', isRTL)}</div>
          <div style={s.bodyText}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
