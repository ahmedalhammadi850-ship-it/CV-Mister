/*
  ATS-SAFE: Single column, clear section headings, no emoji, plain text contact labels.
*/
const ClassicTemplate = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#1e3a5f';
  const fontFamily = theme?.fontFamily || 'Georgia, serif';

  const sectionHeading = {
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: primaryColor,
    marginBottom: '0.5rem',
    paddingBottom: '0.3rem',
    borderBottom: `1px solid ${primaryColor}`,
  };

  return (
    <div className="resume-page bg-white text-slate-800 p-10" style={{ fontFamily }}>

      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', letterSpacing: '0.05em', color: primaryColor, marginBottom: '0.25rem' }}>
          {data.personalInfo.fullName}
        </h1>
        <h2 style={{ fontSize: '1rem', color: '#64748b', fontWeight: '400', marginBottom: '0.75rem' }}>
          {data.personalInfo.jobTitle}
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', fontSize: '0.78rem', color: '#475569' }}>
          {data.personalInfo.email && <span>Email: {data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>Phone: {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>Location: {data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>LinkedIn: {data.personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Professional Summary */}
      {data.personalInfo.summary && (
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={sectionHeading}>Professional Summary</p>
          <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.7' }}>{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience?.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={sectionHeading}>Work Experience</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '0.875rem', color: '#1e293b' }}>{exp.jobTitle}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
                      {exp.company}{exp.location ? `, ${exp.location}` : ''}
                    </p>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: '1.65', marginTop: '0.25rem', whiteSpace: 'pre-line' }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={sectionHeading}>Education</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '0.875rem', color: '#1e293b' }}>{edu.degree}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>{edu.institution}</p>
                  {edu.description && (
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.15rem' }}>{edu.description}</p>
                  )}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div style={{ marginBottom: '1.25rem' }}>
          <p style={sectionHeading}>Skills</p>
          <p style={{ fontSize: '0.8rem', color: '#475569' }}>{data.skills.join(' | ')}</p>
        </div>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <div>
          <p style={sectionHeading}>Languages</p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: '#475569' }}>
            {data.languages.map((lang, i) => (
              <span key={i}><strong>{lang.name}</strong> – {lang.level}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
