/*
  ATS-SAFE | Calibri 11pt body / 14pt headings / 20pt name
  Left-aligned header with accent bar. Single column. No icons or backgrounds.
*/
const CreativeTemplate = ({ data, theme }) => {
  const accentColor = theme?.primaryColor || '#7c3aed';

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
    accentBar: {
      width: '48pt',
      height: '3pt',
      backgroundColor: accentColor,
      marginBottom: '8pt',
    },
    name: {
      fontSize: '20pt',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '2pt',
      lineHeight: 1.2,
    },
    jobTitle: {
      fontSize: '11pt',
      color: accentColor,
      fontWeight: '600',
      marginBottom: '6pt',
    },
    contactRow: {
      fontSize: '10pt',
      color: '#444',
      marginBottom: '14pt',
    },
    sectionHeading: {
      fontSize: '14pt',
      fontWeight: '700',
      color: '#1a1a1a',
      marginTop: '14pt',
      marginBottom: '4pt',
      paddingLeft: '8pt',
      borderLeft: `3pt solid ${accentColor}`,
    },
    jobRole: { fontSize: '11pt', fontWeight: '700', marginBottom: '1pt' },
    jobMeta: { fontSize: '10pt', color: '#555', marginBottom: '4pt' },
    bodyText: { fontSize: '11pt', color: '#222', lineHeight: 1.5, whiteSpace: 'pre-line' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    date: { fontSize: '10pt', color: '#666', whiteSpace: 'nowrap', marginLeft: '12pt' },
  };

  return (
    <div style={s.page}>

      {/* Accent bar + Name */}
      <div style={s.accentBar} />
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

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <div>
          <div style={s.sectionHeading}>Professional Summary</div>
          <div style={{ ...s.bodyText, marginTop: '6pt' }}>{data.personalInfo.summary}</div>
        </div>
      )}

      {/* Work Experience */}
      {data.experience?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>Work Experience</div>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginTop: '8pt', marginBottom: '6pt' }}>
              <div style={s.row}>
                <div style={s.jobRole}>{exp.jobTitle}</div>
                <div style={s.date}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              </div>
              <div style={{ ...s.jobMeta, color: accentColor, fontWeight: '600' }}>
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
          <div style={s.sectionHeading}>Education</div>
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

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>Skills</div>
          <div style={{ ...s.bodyText, marginTop: '6pt' }}>{data.skills.join(' | ')}</div>
        </div>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>Languages</div>
          <div style={{ ...s.bodyText, marginTop: '6pt' }}>
            {data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreativeTemplate;
