/*
  ATS-SAFE: DOM order = name → title → contact → summary → experience → education → skills → languages
  CSS Grid positions sidebar sections visually in column 1 without changing read order.
*/
const ModernTemplate = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#4f46e5';
  const fontFamily = theme?.fontFamily || 'Inter, sans-serif';

  const sidebarStyle = { backgroundColor: primaryColor, color: '#fff' };
  const headingStyle = {
    fontSize: '0.65rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    marginBottom: '0.75rem',
    paddingBottom: '0.4rem',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  };

  return (
    <div
      className="resume-page bg-white text-slate-800"
      style={{
        fontFamily,
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
      }}
    >
      {/* ── BLOCK 1 (DOM first): Sidebar top — name, title, contact ── */}
      <div style={{ ...sidebarStyle, gridColumn: 1, gridRow: 1, padding: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '0.25rem' }}>
          {data.personalInfo.fullName}
        </h1>
        <h2 style={{ fontSize: '0.875rem', fontWeight: '300', opacity: 0.85, marginBottom: '1.75rem' }}>
          {data.personalInfo.jobTitle}
        </h2>

        <div>
          <p style={headingStyle}>Contact</p>
          <div style={{ fontSize: '0.75rem', opacity: 0.9, lineHeight: '1.8' }}>
            {data.personalInfo.phone && (
              <div>Phone: {data.personalInfo.phone}</div>
            )}
            {data.personalInfo.email && (
              <div>Email: {data.personalInfo.email}</div>
            )}
            {data.personalInfo.location && (
              <div>Location: {data.personalInfo.location}</div>
            )}
            {data.personalInfo.linkedin && (
              <div>LinkedIn: {data.personalInfo.linkedin}</div>
            )}
            {data.personalInfo.portfolio && (
              <div>Portfolio: {data.personalInfo.portfolio}</div>
            )}
          </div>
        </div>
      </div>

      {/* ── BLOCK 2 (DOM second): Main — summary, experience, education ── */}
      <div style={{ gridColumn: 2, gridRow: '1 / 3', padding: '2rem', backgroundColor: '#fff' }}>
        {data.personalInfo.summary && (
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{
              fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase',
              letterSpacing: '0.12em', color: primaryColor, marginBottom: '0.5rem',
            }}>
              Professional Summary
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: '1.7' }}>
              {data.personalInfo.summary}
            </p>
          </div>
        )}

        {data.experience?.length > 0 && (
          <div style={{ marginBottom: '1.75rem' }}>
            <h3 style={{
              fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase',
              letterSpacing: '0.12em', color: primaryColor, marginBottom: '1rem',
            }}>
              Work Experience
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {data.experience.map((exp, i) => (
                <div key={i} style={{ paddingLeft: '1rem', borderLeft: `2px solid ${primaryColor}`, position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: '-5px', top: '4px',
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: primaryColor,
                  }} />
                  <h4 style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e293b' }}>{exp.jobTitle}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>
                    {exp.company} | {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education?.length > 0 && (
          <div>
            <h3 style={{
              fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase',
              letterSpacing: '0.12em', color: primaryColor, marginBottom: '0.75rem',
            }}>
              Education
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h4 style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1e293b' }}>{edu.degree}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {edu.institution} | {edu.startDate} – {edu.endDate}
                  </p>
                  {edu.description && (
                    <p style={{ fontSize: '0.75rem', color: '#475569', marginTop: '0.2rem' }}>{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── BLOCK 3 (DOM third): Sidebar bottom — skills, languages ── */}
      <div style={{ ...sidebarStyle, gridColumn: 1, gridRow: 2, padding: '0 2rem 2rem' }}>
        {data.skills?.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={headingStyle}>Skills</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {data.skills.map((skill, i) => (
                <span key={i} style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.7rem',
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {data.languages?.length > 0 && (
          <div>
            <p style={headingStyle}>Languages</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {data.languages.map((lang, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.9 }}>
                  <span>{lang.name}</span>
                  <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernTemplate;
