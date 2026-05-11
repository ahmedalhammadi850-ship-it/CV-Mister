/*
  ATS-SAFE | Calibri 11pt body / 14pt headings / 20pt name
  Maximum whitespace, minimal styling. Thin grey dividers only.
*/
const MinimalTemplate = ({ data, theme }) => {
  const s = {
    page: {
      fontFamily: "'Calibri', 'Carlito', Arial, sans-serif",
      fontSize: '11pt',
      color: '#1a1a1a',
      backgroundColor: '#ffffff',
      padding: '40pt 50pt',
      lineHeight: 1.45,
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
    },
    name: {
      fontSize: '20pt',
      fontWeight: '700',
      color: '#111',
      marginBottom: '2pt',
      letterSpacing: '-0.01em',
    },
    jobTitle: {
      fontSize: '11pt',
      color: '#777',
      fontWeight: '400',
      marginBottom: '8pt',
    },
    contactRow: {
      fontSize: '10pt',
      color: '#555',
      marginBottom: '16pt',
      paddingBottom: '12pt',
      borderBottom: '1px solid #ddd',
    },
    sectionHeading: {
      fontSize: '14pt',
      fontWeight: '700',
      color: '#111',
      marginTop: '16pt',
      marginBottom: '2pt',
    },
    divider: {
      borderBottom: '1px solid #e0e0e0',
      marginBottom: '8pt',
    },
    jobRole: { fontSize: '11pt', fontWeight: '700', marginBottom: '1pt' },
    jobMeta: { fontSize: '10pt', color: '#666', marginBottom: '4pt' },
    bodyText: { fontSize: '11pt', color: '#333', lineHeight: 1.55, whiteSpace: 'pre-line' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    date: { fontSize: '10pt', color: '#888', whiteSpace: 'nowrap', marginLeft: '12pt' },
  };

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

      {/* Summary */}
      {data.personalInfo.summary && (
        <div style={{ marginBottom: '4pt' }}>
          <div style={s.bodyText}>{data.personalInfo.summary}</div>
        </div>
      )}

      {/* Work Experience */}
      {data.experience?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>Work Experience</div>
          <div style={s.divider} />
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '10pt' }}>
              <div style={s.row}>
                <div style={s.jobRole}>{exp.jobTitle}</div>
                <div style={s.date}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</div>
              </div>
              <div style={s.jobMeta}>{exp.company}</div>
              <div style={s.bodyText}>{exp.description}</div>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>Education</div>
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

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>Skills</div>
          <div style={s.divider} />
          <div style={s.bodyText}>{data.skills.join(' | ')}</div>
        </div>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <div>
          <div style={s.sectionHeading}>Languages</div>
          <div style={s.divider} />
          <div style={s.bodyText}>
            {data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
