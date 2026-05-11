/*
  ATS-SAFE: CSS Grid reorders DOM so ATS reads:
  name → title → contact → summary → experience → education → projects → skills → languages
  Visual two-column layout is preserved via gridColumn/gridRow placement.
*/
const CreativeTemplate = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#7c3aed';
  const fontFamily = theme?.fontFamily || 'Inter, sans-serif';

  const sidebarHeading = {
    fontSize: '0.6rem',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: primaryColor,
    marginBottom: '0.6rem',
  };

  const mainHeading = { ...sidebarHeading };

  return (
    <div
      className="resume-page bg-white text-slate-800"
      style={{ fontFamily, display: 'flex', flexDirection: 'column' }}
    >
      {/* Top gradient bar */}
      <div style={{ height: '6px', background: `linear-gradient(90deg, ${primaryColor}, #ec4899)` }} />

      <div style={{ display: 'grid', gridTemplateColumns: '38% 62%', flex: 1 }}>

        {/* ── BLOCK 1 (DOM first): Sidebar top — name, title, contact ── */}
        <div style={{ gridColumn: 1, gridRow: 1, backgroundColor: '#f8fafc', borderRight: '1px solid #f1f5f9', padding: '2rem' }}>
          <h1 style={{ fontSize: '1.3rem', fontWeight: '900', color: primaryColor, lineHeight: 1.2, marginBottom: '0.2rem' }}>
            {data.personalInfo.fullName}
          </h1>
          <div style={{ height: '3px', width: '2.5rem', borderRadius: '2px', backgroundColor: primaryColor, marginBottom: '0.4rem' }} />
          <h2 style={{ fontSize: '0.7rem', fontWeight: '500', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
            {data.personalInfo.jobTitle}
          </h2>

          <div>
            <p style={sidebarHeading}>Contact</p>
            <div style={{ fontSize: '0.72rem', color: '#475569', lineHeight: '1.9' }}>
              {data.personalInfo.email && <div>Email: {data.personalInfo.email}</div>}
              {data.personalInfo.phone && <div>Phone: {data.personalInfo.phone}</div>}
              {data.personalInfo.location && <div>Location: {data.personalInfo.location}</div>}
              {data.personalInfo.linkedin && <div>LinkedIn: {data.personalInfo.linkedin}</div>}
            </div>
          </div>
        </div>

        {/* ── BLOCK 2 (DOM second): Main — summary, experience, education, projects ── */}
        <div style={{ gridColumn: 2, gridRow: '1 / 3', padding: '2rem' }}>
          {data.personalInfo.summary && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={mainHeading}>Professional Summary</p>
              <p style={{ fontSize: '0.78rem', color: '#475569', lineHeight: '1.7' }}>{data.personalInfo.summary}</p>
            </div>
          )}

          {data.experience?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={mainHeading}>Work Experience</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {data.experience.map((exp, i) => (
                  <div key={i} style={{ paddingLeft: '0.9rem', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: 0, top: '5px',
                      width: '7px', height: '7px', borderRadius: '50%',
                      backgroundColor: primaryColor,
                    }} />
                    <h4 style={{ fontWeight: '700', fontSize: '0.82rem', color: '#1e293b' }}>{exp.jobTitle}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: '600', color: primaryColor }}>{exp.company}</span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.education?.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={mainHeading}>Education</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {data.education.map((edu, i) => (
                  <div key={i} style={{ paddingLeft: '0.75rem', borderLeft: `2px solid ${primaryColor}40` }}>
                    <h4 style={{ fontWeight: '700', fontSize: '0.82rem', color: '#1e293b' }}>{edu.degree}</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{edu.institution}</span>
                      <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{edu.startDate} – {edu.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects?.length > 0 && (
            <div>
              <p style={mainHeading}>Projects</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {data.projects.map((proj, i) => (
                  <div key={i} style={{ padding: '0.6rem 0.75rem', borderRadius: '6px', backgroundColor: `${primaryColor}08` }}>
                    <h4 style={{ fontWeight: '700', fontSize: '0.8rem', color: '#1e293b' }}>{proj.title}</h4>
                    <p style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.2rem' }}>{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── BLOCK 3 (DOM third): Sidebar bottom — skills, languages ── */}
        <div style={{ gridColumn: 1, gridRow: 2, backgroundColor: '#f8fafc', borderRight: '1px solid #f1f5f9', padding: '0 2rem 2rem' }}>
          {data.skills?.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={sidebarHeading}>Skills</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {data.skills.map((skill, i) => (
                  <span key={i} style={{
                    fontSize: '0.68rem',
                    fontWeight: '500',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    backgroundColor: `${primaryColor}15`,
                    color: primaryColor,
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.languages?.length > 0 && (
            <div>
              <p style={sidebarHeading}>Languages</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data.languages.map((lang, i) => {
                  const pct = lang.level === 'Native' ? '100%' : lang.level === 'Fluent' ? '90%'
                    : lang.level === 'Advanced' ? '75%' : lang.level === 'Intermediate' ? '55%' : '30%';
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '3px' }}>
                        <span style={{ fontWeight: '500', color: '#334155' }}>{lang.name}</span>
                        <span style={{ color: '#94a3b8' }}>{lang.level}</span>
                      </div>
                      <div style={{ height: '3px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}>
                        <div style={{ height: '3px', width: pct, backgroundColor: primaryColor, borderRadius: '2px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CreativeTemplate;
