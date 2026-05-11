const t = {
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
const tr = (key, isRTL) => t[key][isRTL ? 'ar' : 'en'];

const CreativeTemplate = ({ data, theme, isRTL = false }) => {
  const accentColor = theme?.primaryColor || '#7c3aed';
  const dir = isRTL ? 'rtl' : 'ltr';
  const font = isRTL
    ? "'Tajawal', Arial, sans-serif"
    : "'Calibri', 'Carlito', Arial, sans-serif";

  const borderSide = isRTL ? 'borderRight' : 'borderLeft';

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
    accentBar: {
      width: '48pt',
      height: '3pt',
      backgroundColor: accentColor,
      marginBottom: '8pt',
      marginLeft: isRTL ? 'auto' : 0,
      marginRight: isRTL ? 0 : 'auto',
    },
    name: { fontSize: '20pt', fontWeight: '700', color: '#1a1a1a', marginBottom: '2pt', lineHeight: 1.2 },
    jobTitle: { fontSize: '11pt', color: accentColor, fontWeight: '600', marginBottom: '6pt' },
    contactRow: { fontSize: '10pt', color: '#444', marginBottom: '14pt' },
    sectionHeading: {
      fontSize: '14pt', fontWeight: '700', color: '#1a1a1a',
      marginTop: '14pt', marginBottom: '4pt',
      paddingLeft: isRTL ? 0 : '8pt',
      paddingRight: isRTL ? '8pt' : 0,
      [borderSide]: `3pt solid ${accentColor}`,
    },
    jobRole: { fontSize: '11pt', fontWeight: '700', marginBottom: '1pt' },
    jobMeta: { fontSize: '10pt', color: '#555', marginBottom: '4pt' },
    bodyText: { fontSize: '11pt', color: '#222', lineHeight: isRTL ? 1.9 : 1.5, whiteSpace: 'pre-line' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' },
    date: { fontSize: '10pt', color: '#666', whiteSpace: 'nowrap', marginLeft: isRTL ? 0 : '12pt', marginRight: isRTL ? '12pt' : 0 },
  };

  const contactParts = [
    data.personalInfo.email    && `${tr('email', isRTL)}: ${data.personalInfo.email}`,
    data.personalInfo.phone    && `${tr('phone', isRTL)}: ${data.personalInfo.phone}`,
    data.personalInfo.location && `${tr('location', isRTL)}: ${data.personalInfo.location}`,
    data.personalInfo.linkedin && `${tr('linkedin', isRTL)}: ${data.personalInfo.linkedin}`,
  ].filter(Boolean);

  return (
    <div style={s.page}>
      <div style={s.accentBar} />
      <div style={s.name}>{data.personalInfo.fullName}</div>
      <div style={s.jobTitle}>{data.personalInfo.jobTitle}</div>
      <div style={s.contactRow}>{contactParts.join('   |   ')}</div>

      {data.personalInfo.summary && (
        <div>
          <div style={s.sectionHeading}>{tr('summary', isRTL)}</div>
          <div style={{ ...s.bodyText, marginTop: '6pt' }}>{data.personalInfo.summary}</div>
        </div>
      )}

      {data.experience?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>{tr('experience', isRTL)}</div>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginTop: '8pt', marginBottom: '6pt' }}>
              <div style={s.row}>
                <div style={s.jobRole}>{exp.jobTitle}</div>
                <div style={s.date}>{exp.startDate} – {exp.current ? tr('present', isRTL) : exp.endDate}</div>
              </div>
              <div style={{ ...s.jobMeta, color: accentColor, fontWeight: '600' }}>
                {exp.company}{exp.location ? `، ${exp.location}` : ''}
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
            <div key={i} style={{ marginTop: '8pt', marginBottom: '6pt' }}>
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
          <div style={{ ...s.bodyText, marginTop: '6pt' }}>{data.skills.join(' | ')}</div>
        </div>
      )}

      {data.languages?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>{tr('languages', isRTL)}</div>
          <div style={{ ...s.bodyText, marginTop: '6pt' }}>
            {data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}
          </div>
        </div>
      )}

      {data.projects?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>{tr('projects', isRTL)}</div>
          {data.projects.map((proj, i) => (
            <div key={i} style={{ marginTop: '6pt' }}>
              <div style={s.jobRole}>{proj.title}</div>
              <div style={s.bodyText}>{proj.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CreativeTemplate;
