/*
  ATS-SAFE: Single column flow. Header contains all contact info as plain text.
  No emoji, standard section names, logical reading order top-to-bottom.
*/
const ExecutiveTemplate = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#0f2942';
  const gold = '#c9a84c';
  const fontFamily = theme?.fontFamily || 'Georgia, serif';

  const sectionHeading = (label) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
      <h3 style={{
        fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase',
        letterSpacing: '0.22em', color: primaryColor, whiteSpace: 'nowrap',
      }}>
        {label}
      </h3>
      <div style={{ flex: 1, height: '1px', backgroundColor: gold }} />
    </div>
  );

  return (
    <div className="resume-page bg-white text-slate-800" style={{ fontFamily }}>

      {/* Header */}
      <div style={{ backgroundColor: primaryColor, color: '#fff', padding: '2.25rem 2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '700', letterSpacing: '0.04em', marginBottom: '0.2rem' }}>
              {data.personalInfo.fullName}
            </h1>
            <h2 style={{ fontSize: '0.9rem', fontWeight: '300', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
              {data.personalInfo.jobTitle}
            </h2>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.72rem', opacity: 0.75, lineHeight: '1.9' }}>
            {data.personalInfo.email && <div>Email: {data.personalInfo.email}</div>}
            {data.personalInfo.phone && <div>Phone: {data.personalInfo.phone}</div>}
            {data.personalInfo.location && <div>Location: {data.personalInfo.location}</div>}
            {data.personalInfo.linkedin && <div>LinkedIn: {data.personalInfo.linkedin}</div>}
          </div>
        </div>
      </div>

      {/* Gold divider */}
      <div style={{ height: '4px', background: `linear-gradient(90deg, ${gold}, #e8d48b, ${gold})` }} />

      <div style={{ padding: '2rem 2.5rem' }}>

        {/* Professional Summary */}
        {data.personalInfo.summary && (
          <div style={{ marginBottom: '1.75rem' }}>
            <p style={{
              fontSize: '0.82rem', color: '#475569', lineHeight: '1.75',
              fontStyle: 'italic',
              borderLeft: `4px solid ${gold}`,
              paddingLeft: '1rem',
            }}>
              {data.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Work Experience */}
        {data.experience?.length > 0 && (
          <div style={{ marginBottom: '1.75rem' }}>
            {sectionHeading('Professional Experience')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.1rem' }}>
                    <h4 style={{ fontWeight: '700', fontSize: '0.9rem', color: '#0f172a' }}>{exp.jobTitle}</h4>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8', marginLeft: '1rem', whiteSpace: 'nowrap' }}>
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', fontWeight: '600', color: gold, marginBottom: '0.3rem' }}>{exp.company}</p>
                  <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: '1.65', whiteSpace: 'pre-line' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <div style={{ marginBottom: '1.75rem' }}>
            {sectionHeading('Education')}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h4 style={{ fontWeight: '700', fontSize: '0.875rem', color: '#1e293b' }}>{edu.degree}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{edu.institution}</p>
                  <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{edu.startDate} – {edu.endDate}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills + Languages side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {data.skills?.length > 0 && (
            <div>
              {sectionHeading('Skills')}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {data.skills.map((skill, i) => (
                  <span key={i} style={{
                    fontSize: '0.7rem', color: '#475569',
                    border: `1px solid ${gold}`, padding: '2px 8px',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.languages?.length > 0 && (
            <div>
              {sectionHeading('Languages')}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                {data.languages.map((lang, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                    <span style={{ color: '#334155' }}>{lang.name}</span>
                    <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
