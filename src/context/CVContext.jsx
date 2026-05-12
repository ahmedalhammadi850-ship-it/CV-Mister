import React, { createContext, useContext, useState } from 'react';
import { sampleData } from '../utils/sampleData';
import { saveCV, getCVById, getSavedCVs } from '../utils/cvStorage';

const CVContext = createContext();

export function useCV() {
  return useContext(CVContext);
}

const DEFAULT_SECTION_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

export function CVProvider({ children }) {
  const [cvData, setCvData] = useState(sampleData);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [currentCVId, setCurrentCVId] = useState(null);
  const [currentCVName, setCurrentCVName] = useState('My Resume');
  const [savedCVs, setSavedCVs] = useState(() => getSavedCVs());

  const [theme, setTheme] = useState({
    primaryColor: '#4f46e5',
    fontFamily: 'Calibri',
    fontSize: 'medium',
    lineHeight: 'normal',
    pagePadding: 'medium',
    sectionSpacing: 'medium',
  });

  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);

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

  const reorderSections = (fromIndex, toIndex) => {
    setSectionOrder(prev => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  const saveCurrentCV = (name) => {
    const id = currentCVId || `cv-${Date.now()}`;
    const cvName = name || currentCVName;
    const entry = saveCV({
      id,
      name: cvName,
      cvData,
      template: selectedTemplate,
      theme,
      atsScore: 95,
    });
    setCurrentCVId(id);
    setCurrentCVName(cvName);
    setSavedCVs(getSavedCVs());
    window.dispatchEvent(new Event('cv_saved'));
    return entry;
  };

  const loadCVById = (id) => {
    const cv = getCVById(id);
    if (!cv) return false;
    setCvData(cv.cvData);
    setSelectedTemplate(cv.template);
    setTheme(cv.theme);
    setCurrentCVId(cv.id);
    setCurrentCVName(cv.name);
    return true;
  };

  const startNewCV = () => {
    setCvData(sampleData);
    setSelectedTemplate('modern');
    setTheme({
      primaryColor: '#4f46e5',
      fontFamily: 'Calibri',
      fontSize: 'medium',
      lineHeight: 'normal',
      pagePadding: 'medium',
      sectionSpacing: 'medium',
    });
    setCurrentCVId(null);
    setCurrentCVName('My Resume');
  };

  const value = {
    cvData,
    setCvData,
    updateSection,
    selectedTemplate,
    setSelectedTemplate,
    theme,
    setTheme,
    sectionOrder,
    reorderSections,
    visibleSections,
    toggleSection,
    visiblePersonalFields,
    togglePersonalField,
    currentCVId,
    currentCVName,
    setCurrentCVName,
    savedCVs,
    saveCurrentCV,
    loadCVById,
    startNewCV,
  };

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
}
