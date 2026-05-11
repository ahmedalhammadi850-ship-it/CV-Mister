import { useCV } from '../../context/CVContext';
import { useState } from 'react';

const EditorPanel = () => {
  const { cvData, updateSection } = useCV();
  const [openSection, setOpenSection] = useState('personalInfo');

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    updateSection('personalInfo', { ...cvData.personalInfo, [name]: value });
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const AccordionHeader = ({ title, section }) => (
    <div 
      className="flex justify-between items-center p-4 bg-white border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
      onClick={() => toggleSection(section)}
    >
      <h3 className="font-medium text-slate-800">{title}</h3>
      <svg 
        className={`w-5 h-5 text-slate-400 transform transition-transform ${openSection === section ? 'rotate-180' : ''}`} 
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );

  return (
    <div className="flex flex-col pb-20">
      
      {/* Personal Info Section */}
      <div>
        <AccordionHeader title="Personal Information" section="personalInfo" />
        {openSection === 'personalInfo' && (
          <div className="p-4 space-y-4 bg-slate-50/50 border-b border-slate-100">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Full Name</label>
                <input type="text" name="fullName" value={cvData.personalInfo.fullName} onChange={handlePersonalInfoChange} className="input-field py-2 text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Job Title</label>
                <input type="text" name="jobTitle" value={cvData.personalInfo.jobTitle} onChange={handlePersonalInfoChange} className="input-field py-2 text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Email</label>
                <input type="email" name="email" value={cvData.personalInfo.email} onChange={handlePersonalInfoChange} className="input-field py-2 text-sm" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Phone</label>
                <input type="text" name="phone" value={cvData.personalInfo.phone} onChange={handlePersonalInfoChange} className="input-field py-2 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Location</label>
                <input type="text" name="location" value={cvData.personalInfo.location} onChange={handlePersonalInfoChange} className="input-field py-2 text-sm" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Professional Summary</label>
                <textarea name="summary" value={cvData.personalInfo.summary} onChange={handlePersonalInfoChange} rows={4} className="input-field py-2 text-sm resize-none" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Experience Section */}
      <div>
        <AccordionHeader title="Experience" section="experience" />
        {openSection === 'experience' && (
          <div className="p-4 space-y-4 bg-slate-50/50 border-b border-slate-100">
            {cvData.experience.map((exp, index) => (
              <div key={exp.id} className="border border-slate-200 bg-white rounded-lg p-3">
                <div className="font-medium text-slate-800">{exp.jobTitle}</div>
                <div className="text-sm text-slate-500">{exp.company} • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-primary-400 hover:text-primary-600 transition-colors text-sm">
              + Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Education Section */}
      <div>
        <AccordionHeader title="Education" section="education" />
        {openSection === 'education' && (
          <div className="p-4 space-y-4 bg-slate-50/50 border-b border-slate-100">
            {cvData.education.map((edu, index) => (
              <div key={edu.id} className="border border-slate-200 bg-white rounded-lg p-3">
                <div className="font-medium text-slate-800">{edu.degree}</div>
                <div className="text-sm text-slate-500">{edu.institution}</div>
              </div>
            ))}
            <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-medium hover:border-primary-400 hover:text-primary-600 transition-colors text-sm">
              + Add Education
            </button>
          </div>
        )}
      </div>

      {/* Skills Section */}
      <div>
        <AccordionHeader title="Skills" section="skills" />
        {openSection === 'skills' && (
          <div className="p-4 bg-slate-50/50 border-b border-slate-100">
            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill, index) => (
                <div key={index} className="bg-white border border-slate-200 px-3 py-1 rounded-full text-sm text-slate-700 flex items-center gap-1">
                  {skill}
                  <button className="text-slate-400 hover:text-red-500">&times;</button>
                </div>
              ))}
              <button className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm hover:bg-slate-200">+</button>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default EditorPanel;
