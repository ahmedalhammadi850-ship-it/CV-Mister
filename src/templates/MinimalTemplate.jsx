/*
  ATS-SAFE: Single-column, clean whitespace, plain text labels, no decorative characters.
*/
const MinimalTemplate = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#111827';
  const fontFamily = theme?.fontFamily || 'Inter, sans-serif';

  const sectionLabel = {
    fontSize: '0.62rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: '1.1rem',
  };

  const divider = {
    borderBottom: '1px solid #f1f5f9',
    paddingBottom: '1.75rem',
    marginBottom: '1.75rem',
  };

  return (
    <div className="resume-page bg-white text-slate-800 p-12" style={{ fontFamily }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.8rem', fontWeight: '300', letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '0.25rem', lineHeight: 1.1 }}>
          {data.personalInfo.fullName}
        </h1>
        <p style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '300', marginBottom: '0.75rem' }}>
          {data.personalInfo.jobTitle}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.75rem', color: '#94a3b8' }}>
          {data.personalInfo.email && <span>Email: {data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>Phone: {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>Location: {data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>LinkedIn: {data.personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div style={divider}>
          <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: '1.75', maxWidth: '42rem' }}>
            {data.personalInfo.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {data.experience?.length > 0 && (
        <div style={divider}>
          <p style={sectionLabel}>Work Experience</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {data.experience.map((exp, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontWeight: '600', fontSize: '0.875rem', color: '#1e293b', marginBottom: '0.15rem' }}>
                    {exp.jobTitle}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>{exp.company}</p>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.65', whiteSpace: 'pre-line' }}>
                    {exp.description}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div style={divider}>
          <p style={sectionLabel}>Education</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {data.education.map((edu, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}>
                <div>
                  <h4 style={{ fontWeight: '600', fontSize: '0.875rem', color: '#1e293b' }}>{edu.degree}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{edu.institution}</p>
                </div>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills + Languages */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {data.skills?.length > 0 && (
          <div>
            <p style={sectionLabel}>Skills</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {data.skills.map((skill, i) => (
                <span key={i} style={{
                  fontSize: '0.72rem', color: '#64748b',
                  backgroundColor: '#f8fafc', padding: '3px 10px', borderRadius: '4px',
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.languages?.length > 0 && (
          <div>
            <p style={sectionLabel}>Languages</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {data.languages.map((lang, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                  <span style={{ color: '#334155' }}>{lang.name}</span>
                  <span style={{ color: '#94a3b8' }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;
