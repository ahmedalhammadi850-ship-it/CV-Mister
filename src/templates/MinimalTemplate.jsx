const MinimalTemplate = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#111827';
  const fontFamily = theme?.fontFamily || 'Inter, sans-serif';

  return (
    <div className="resume-page bg-white text-slate-800 p-12" style={{ fontFamily }}>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-light tracking-tight text-slate-900 mb-1">
          {data.personalInfo.fullName}
        </h1>
        <p className="text-base text-slate-400 font-light">{data.personalInfo.jobTitle}</p>
        <div className="flex flex-wrap gap-5 mt-3 text-xs text-slate-400">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>{data.personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-8 pb-8 border-b border-slate-100">
          <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="mb-8 pb-8 border-b border-slate-100">
          <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium mb-5">Experience</h3>
          <div className="space-y-6">
            {data.experience.map((exp, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{exp.jobTitle}</h4>
                  <p className="text-sm text-slate-400 mb-2">{exp.company}</p>
                  <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 whitespace-nowrap">
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
        <div className="mb-8 pb-8 border-b border-slate-100">
          <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium mb-5">Education</h3>
          <div className="space-y-4">
            {data.education.map((edu, i) => (
              <div key={i} className="grid grid-cols-[1fr_auto] gap-4">
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{edu.degree}</h4>
                  <p className="text-sm text-slate-400">{edu.institution}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom row: Skills + Languages */}
      <div className="grid grid-cols-2 gap-8">
        {data.skills?.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {data.languages?.length > 0 && (
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium mb-3">Languages</h3>
            <div className="space-y-1">
              {data.languages.map((lang, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-slate-600">{lang.name}</span>
                  <span className="text-slate-400">{lang.level}</span>
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
