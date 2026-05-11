import React, { createContext, useContext, useState } from 'react';
import { sampleData } from '../utils/sampleData';

const CVContext = createContext();

export function useCV() {
  return useContext(CVContext);
}

export function CVProvider({ children }) {
  // Main CV Data State
  const [cvData, setCvData] = useState(sampleData);
  
  // Customization State
  const [selectedTemplate, setSelectedTemplate] = useState('modern'); // classic, modern, creative, executive, minimal
  
  const [theme, setTheme] = useState({
    primaryColor: '#4f46e5', // Indigo-600
    fontFamily: 'Inter',
    fontSize: 'medium', // small, medium, large
  });

  // Action to update specific section data
  const updateSection = (section, data) => {
    setCvData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const value = {
    cvData,
    setCvData,
    updateSection,
    selectedTemplate,
    setSelectedTemplate,
    theme,
    setTheme
  };

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
}
