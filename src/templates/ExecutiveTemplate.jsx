const ExecutiveTemplate = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#0f2942';
  const fontFamily = theme?.fontFamily || 'Georgia, serif';

  return (
    <div className="resume-page bg-white text-slate-800" style={{ fontFamily }}>

      {/* Header with dark background */}
      <div className="px-10 py-8 text-white" style={{ backgroundColor: primaryColor }}>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-wide mb-1">{data.personalInfo.fullName}</h1>
            <h2 className="text-lg font-light opacity-80 uppercase tracking-widest">{data.personalInfo.jobTitle}</h2>
          </div>
          <div className="text-right text-xs opacity-75 space-y-1">
            {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
            {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
            {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
            {data.personalInfo.linkedin && <p>{data.personalInfo.linkedin}</p>}
          </div>
        </div>
      </div>

      {/* Gold/accent divider */}
      <div className="h-1" style={{ background: 'linear-gradient(90deg, #c9a84c, #e8d48b, #c9a84c)' }} />

      <div className="p-10">

        {/* Summary */}
        {data.personalInfo.summary && (
          <div className="mb-7">
            <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 pl-4" style={{ borderColor: '#c9a84c' }}>
              {data.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <div className="mb-7">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: primaryColor }}>
                Professional Experience
              </h3>
              <div className="flex-1 h-px" style={{ backgroundColor: '#c9a84c' }} />
            </div>
            <div className="space-y-5">
              {data.experience.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-slate-900">{exp.jobTitle}</h4>
                    <span className="text-xs text-slate-400 ml-4">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: '#c9a84c' }}>{exp.company}</p>
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education + Skills side by side */}
        <div className="grid grid-cols-2 gap-8">
          {data.education?.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: primaryColor }}>Education</h3>
                <div className="flex-1 h-px" style={{ backgroundColor: '#c9a84c' }} />
              </div>
              <div className="space-y-3">
                {data.education.map((edu, i) => (
                  <div key={i}>
                    <h4 className="font-bold text-slate-800 text-sm">{edu.degree}</h4>
                    <p className="text-sm text-slate-500">{edu.institution}</p>
                    <p className="text-xs text-slate-400">{edu.startDate} – {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {data.skills?.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: primaryColor }}>Skills</h3>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#c9a84c' }} />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="text-xs border px-2 py-0.5 text-slate-600" style={{ borderColor: '#c9a84c' }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.languages?.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: primaryColor }}>Languages</h3>
                  <div className="flex-1 h-px" style={{ backgroundColor: '#c9a84c' }} />
                </div>
                <div className="space-y-1">
                  {data.languages.map((lang, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-slate-700">{lang.name}</span>
                      <span className="text-slate-400 text-xs">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
