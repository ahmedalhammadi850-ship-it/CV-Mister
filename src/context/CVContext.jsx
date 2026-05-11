import React, { createContext, useContext, useState } from 'react';
import { sampleData } from '../utils/sampleData';

const CVContext = createContext();

export function useCV() {
  return useContext(CVContext);
}

export function CVProvider({ children }) {
  const [cvData, setCvData] = useState(sampleData);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const [theme, setTheme] = useState({
    primaryColor: '#4f46e5',
    fontFamily: 'Calibri',
    fontSize: 'medium',
    lineHeight: 'normal',
    pagePadding: 'medium',
    sectionSpacing: 'medium',
  });

  const [visibleSections, setVisibleSections] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    languages: true,
  });

  const [visiblePersonalFields, setVisiblePersonalFields] = useState({
    email: true,
    phone: true,
    location: true,
    linkedin: true,
    portfolio: true,
  });

  const updateSection = (section, data) => {
    setCvData(prev => ({ ...prev, [section]: data }));
  };

  const toggleSection = (key) => {
    setVisibleSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePersonalField = (key) => {
    setVisiblePersonalFields(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const value = {
    cvData,
    setCvData,
    updateSection,
    selectedTemplate,
    setSelectedTemplate,
    theme,
    setTheme,
    visibleSections,
    toggleSection,
    visiblePersonalFields,
    togglePersonalField,
  };

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
}
