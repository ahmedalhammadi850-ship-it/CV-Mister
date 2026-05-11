const ModernTemplate = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#4f46e5';
  const fontFamily = theme?.fontFamily || 'Inter, sans-serif';

  return (
    <div 
      className="resume-page bg-white text-slate-800 flex"
      style={{ fontFamily }}
    >
      {/* Left Sidebar */}
      <div className="w-1/3 text-white p-8" style={{ backgroundColor: primaryColor }}>
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-1 tracking-tight">{data.personalInfo.fullName}</h1>
          <h2 className="text-lg opacity-90 font-light">{data.personalInfo.jobTitle}</h2>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-2 uppercase tracking-wider text-sm">Contact</h3>
          <div className="space-y-3 text-sm opacity-90">
            {data.personalInfo.phone && <div className="flex items-center gap-2"><span>📱</span> {data.personalInfo.phone}</div>}
            {data.personalInfo.email && <div className="flex items-center gap-2"><span>✉️</span> {data.personalInfo.email}</div>}
            {data.personalInfo.location && <div className="flex items-center gap-2"><span>📍</span> {data.personalInfo.location}</div>}
            {data.personalInfo.linkedin && <div className="flex items-center gap-2"><span>💼</span> {data.personalInfo.linkedin}</div>}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-2 uppercase tracking-wider text-sm">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="bg-white/10 px-2 py-1 rounded text-xs">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 border-b border-white/20 pb-2 uppercase tracking-wider text-sm">Languages</h3>
          <div className="space-y-2">
            {data.languages.map((lang, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span>{lang.name}</span>
                <span className="opacity-75 text-xs">{lang.level}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Content Area */}
      <div className="w-2/3 p-8 bg-white text-slate-800">
        
        {data.personalInfo.summary && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 uppercase tracking-wider text-sm" style={{ color: primaryColor }}>Profile</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {data.personalInfo.summary}
            </p>
          </div>
        )}

        {data.experience && data.experience.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-sm" style={{ color: primaryColor }}>Experience</h3>
            <div className="space-y-6">
              {data.experience.map((exp, i) => (
                <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: primaryColor }}>
                  <div className="absolute w-3 h-3 rounded-full -left-[7px] top-1" style={{ backgroundColor: primaryColor }}></div>
                  <h4 className="font-bold text-slate-800">{exp.jobTitle}</h4>
                  <div className="text-sm font-medium text-slate-600 mb-1">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education && data.education.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 uppercase tracking-wider text-sm" style={{ color: primaryColor }}>Education</h3>
            <div className="space-y-4">
              {data.education.map((edu, i) => (
                <div key={i}>
                  <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                  <div className="text-sm font-medium text-slate-600">{edu.institution} | {edu.startDate} - {edu.endDate}</div>
                  <p className="text-sm text-slate-600 mt-1">
                    {edu.description}
                  </p>
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
