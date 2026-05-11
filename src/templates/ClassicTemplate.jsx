const ClassicTemplate = ({ data, theme }) => {
  const primaryColor = theme?.primaryColor || '#1e3a5f';
  const fontFamily = theme?.fontFamily || 'Georgia, serif';

  return (
    <div className="resume-page bg-white text-slate-800 p-10" style={{ fontFamily }}>

      {/* Header */}
      <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: primaryColor }}>
        <h1 className="text-4xl font-bold tracking-wide mb-1" style={{ color: primaryColor }}>
          {data.personalInfo.fullName}
        </h1>
        <h2 className="text-lg text-slate-500 font-normal mb-3">{data.personalInfo.jobTitle}</h2>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
          {data.personalInfo.email && <span>✉ {data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>✆ {data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>⌖ {data.personalInfo.location}</span>}
          {data.personalInfo.linkedin && <span>⊞ {data.personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Summary */}
      {data.personalInfo.summary && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: primaryColor }}>
            Professional Summary
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      )}

      {/* Experience */}
      {data.experience?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>
            Work Experience
          </h3>
          <div className="space-y-5">
            {data.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800">{exp.jobTitle}</h4>
                    <span className="text-sm text-slate-600 italic">{exp.company}, {exp.location}</span>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap ml-4">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {data.education?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3 border-b pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>
            Education
          </h3>
          <div className="space-y-3">
            {data.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-800">{edu.degree}</h4>
                  <span className="text-sm text-slate-600 italic">{edu.institution}</span>
                  {edu.description && <p className="text-sm text-slate-500 mt-0.5">{edu.description}</p>}
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap ml-4">{edu.startDate} – {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {data.skills?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2 border-b pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>
            Skills
          </h3>
          <p className="text-sm text-slate-600">{data.skills.join(' • ')}</p>
        </div>
      )}

      {/* Languages */}
      {data.languages?.length > 0 && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2 border-b pb-1" style={{ color: primaryColor, borderColor: primaryColor }}>
            Languages
          </h3>
          <div className="flex gap-6 text-sm text-slate-600">
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
