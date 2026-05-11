/*
  ATS-SAFE | Calibri 11pt body / 14pt headings / 20pt name
  Bold heading row with full-width line. Professional executive style.
*/
const ExecutiveTemplate = ({ data, theme }) => {
  const accentColor = theme?.primaryColor || '#0f2942';

  const s = {
    page: {
      fontFamily: "'Calibri', 'Carlito', Arial, sans-serif",
      fontSize: '11pt',
      color: '#1a1a1a',
      backgroundColor: '#ffffff',
      padding: '36pt 44pt',
      lineHeight: 1.4,
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
    },
    name: {
      fontSize: '20pt',
      fontWeight: '700',
      color: accentColor,
      marginBottom: '2pt',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    },
    jobTitle: {
      fontSize: '11pt',
      color: '#555',
      marginBottom: '6pt',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      fontWeight: '400',
    },
    contactRow: {
      fontSize: '10pt',
      color: '#444',
      marginBottom: '10pt',
    },
    headerDivider: {
      borderBottom: `3px double ${accentColor}`,
      marginBottom: '14pt',
    },
    sectionRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '8pt',
      marginTop: '14pt',
      marginBottom: '8pt',
    },
    sectionHeadingText: {
      fontSize: '14pt',
      fontWeight: '700',
      color: accentColor,
      whiteSpace: 'nowrap',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
    },
    sectionLine: {
      flex: 1,
      borderBottom: `1px solid ${accentColor}`,
    },
    jobRole: { fontSize: '11pt', fontWeight: '700', marginBottom: '1pt' },
    jobMeta: { fontSize: '10pt', color: '#555', marginBottom: '4pt' },
    bodyText: { fontSize: '11pt', color: '#222', lineHeight: 1.5, whiteSpace: 'pre-line' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    date: { fontSize: '10pt', color: '#555', whiteSpace: 'nowrap', marginLeft: '12pt' },
  };

  const SectionHeading = ({ label }) => (
    <div style={s.sectionRow}>
      <div style={s.sectionHeadingText}>{label}</div>
      <div style={s.sectionLine} />
    </div>
  );

  return (
    <div style={s.page}>

      {/* Name */}
      <div style={s.name}>{data.personalInfo.fullName}</div>
      <div style={s.jobTitle}>{data.personalInfo.jobTitle}</div>

      {/* Contact */}
      <div style={s.contactRow}>
        {[
          data.personalInfo.email && `Email: ${data.personalInfo.email}`,
          data.personalInfo.phone && `Phone: ${data.personalInfo.phone}`,
          data.personalInfo.location && `Location: ${data.personalInfo.location}`,
          data.personalInfo.linkedin && `LinkedIn: ${data.personalInfo.linkedin}`,
        ].filter(Boolean).join('   |   ')}
      </div>
      <div style={s.headerDivider} />

      {/* Summary */}
      {data.personalInfo.summary && (
        <div>
          <SectionHeading label="Executive Summary" />
          <div style={{ ...s.bodyText, fontStyle: 'italic' }}>{data.personalInfo.summary}</div>
        </div>
      )}

      {/* Work Experience */}
      {data.experience?.length > 0 && (
        <div>
          <SectionHeading label="Professional Experience" />
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '10pt' }}>
              <div style={s.row}>
                <div style={s.jobRole}>{exp.jobTitle}</div>
                <div style={s.date}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              </div>
              <div style={{ ...s.jobMeta, fontWeight: '600' }}>
                {exp.company}{exp.location ? `, ${exp.location}` : ''}
              </div>
              <div style={s.bodyText}>{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div>
          <SectionHeading label="Education" />
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

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div>
          <SectionHeading label="Core Competencies" />
          <div style={s.bodyText}>{data.skills.join(' | ')}</div>
        </div>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <div>
          <SectionHeading label="Languages" />
          <div style={s.bodyText}>
            {data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveTemplate;
