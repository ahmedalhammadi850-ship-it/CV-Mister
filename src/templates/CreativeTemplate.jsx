const CreativeTemplate = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#7c3aed';
  const fontFamily = theme?.fontFamily || 'Inter, sans-serif';

  return (
    <div className="resume-page bg-white text-slate-800" style={{ fontFamily }}>

      {/* Top accent bar */}
      <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${primaryColor}, #ec4899)` }} />

      <div className="flex">
        {/* Left narrow sidebar */}
        <div className="w-[38%] p-8 bg-slate-50 border-r border-slate-100">

          {/* Name & Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-black leading-tight mb-1" style={{ color: primaryColor }}>
              {data.personalInfo.fullName}
            </h1>
            <div className="h-1 w-12 rounded-full mb-2" style={{ background: primaryColor }} />
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              {data.personalInfo.jobTitle}
            </h2>
          </div>

          {/* Contact */}
          <div className="mb-7">
            <h3 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Contact</h3>
            <div className="space-y-2 text-xs text-slate-600">
              {data.personalInfo.email && (
                <div className="flex items-start gap-2">
                  <span className="mt-0.5" style={{ color: primaryColor }}>✉</span>
                  <span className="break-all">{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <span style={{ color: primaryColor }}>✆</span>
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center gap-2">
                  <span style={{ color: primaryColor }}>⌖</span>
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
              {data.personalInfo.linkedin && (
                <div className="flex items-start gap-2">
                  <span style={{ color: primaryColor }}>⊞</span>
                  <span className="break-all">{data.personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {data.skills?.length > 0 && (
            <div className="mb-7">
              <h3 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages?.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: primaryColor }}>Languages</h3>
              <div className="space-y-2">
                {data.languages.map((lang, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{lang.name}</span>
                      <span className="text-slate-400">{lang.level}</span>
                    </div>
                    <div className="h-1 bg-slate-200 rounded-full">
                      <div
                        className="h-1 rounded-full"
                        style={{
                          backgroundColor: primaryColor,
                          width: lang.level === 'Native' ? '100%' : lang.level === 'Fluent' ? '90%' : lang.level === 'Advanced' ? '75%' : lang.level === 'Intermediate' ? '55%' : '30%'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right main content */}
        <div className="w-[62%] p-8">

          {data.personalInfo.summary && (
            <div className="mb-7">
              <h3 className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: primaryColor }}>About Me</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
            </div>
          )}

          {data.experience?.length > 0 && (
            <div className="mb-7">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: primaryColor }}>Experience</h3>
              <div className="space-y-5">
                {data.experience.map((exp, i) => (
                  <div key={i} className="relative pl-4">
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
                    <div className="absolute left-[3px] top-4 bottom-0 w-0.5 bg-slate-100" style={{ display: i === data.experience.length - 1 ? 'none' : 'block' }} />
                    <h4 className="font-bold text-slate-800 text-sm">{exp.jobTitle}</h4>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium" style={{ color: primaryColor }}>{exp.company}</span>
                      <span className="text-xs text-slate-400">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.education?.length > 0 && (
            <div className="mb-7">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: primaryColor }}>Education</h3>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <div key={i} className="pl-4 border-l-2" style={{ borderColor: `${primaryColor}40` }}>
                    <h4 className="font-bold text-slate-800 text-sm">{edu.degree}</h4>
                    <div className="flex justify-between">
                      <span className="text-xs text-slate-500">{edu.institution}</span>
                      <span className="text-xs text-slate-400">{edu.startDate} – {edu.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.projects?.length > 0 && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: primaryColor }}>Projects</h3>
              <div className="space-y-3">
                {data.projects.map((proj, i) => (
                  <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: `${primaryColor}08` }}>
                    <h4 className="font-bold text-sm text-slate-800">{proj.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
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

export default CreativeTemplate;
