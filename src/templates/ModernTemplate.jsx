/*
  ATS-SAFE | Calibri 11pt body / 14pt headings / 20pt name
  Single-column. No backgrounds, no icons, no complex tables.
*/
const ModernTemplate = ({ data, theme }) => {
  const accentColor = theme?.primaryColor || '#4f46e5';

  const s = {
    page: {
      fontFamily: "'Calibri', 'Carlito', Arial, sans-serif",
      fontSize: '11pt',
      color: '#1a1a1a',
      backgroundColor: '#ffffff',
      padding: '36pt 42pt',
      lineHeight: 1.4,
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
    },
    name: {
      fontSize: '20pt',
      fontWeight: '700',
      color: accentColor,
      marginBottom: '3pt',
      lineHeight: 1.2,
    },
    jobTitle: {
      fontSize: '11pt',
      color: '#555',
      marginBottom: '6pt',
    },
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
    bodyText: { fontSize: '11pt', color: '#222', lineHeight: 1.5, whiteSpace: 'pre-line' },
    skillsText: { fontSize: '11pt', color: '#222' },
  };

  return (
    <div style={s.page}>

      {/* Name & Title */}
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
          <div style={s.bodyText}>{data.personalInfo.summary}</div>
        </div>
      )}

      {/* Work Experience */}
      {data.experience?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>Work Experience</div>
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '10pt' }}>
              <div style={s.jobRole}>{exp.jobTitle}</div>
              <div style={s.jobMeta}>
                {exp.company}{exp.location ? `, ${exp.location}` : ''} — {exp.startDate} to {exp.current ? 'Present' : exp.endDate}
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
            <div key={i} style={{ marginBottom: '8pt' }}>
              <div style={s.jobRole}>{edu.degree}</div>
              <div style={s.jobMeta}>
                {edu.institution} — {edu.startDate} to {edu.endDate}
              </div>
              {edu.description && <div style={s.bodyText}>{edu.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>Skills</div>
          <div style={s.skillsText}>{data.skills.join(' | ')}</div>
        </div>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>Languages</div>
          <div style={s.skillsText}>
            {data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
