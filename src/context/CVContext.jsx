import React, { createContext, useContext, useState, useEffect } from 'react';
import { sampleData, blankData } from '../utils/sampleData';
import { saveCV, getCVById, getSavedCVs, deleteCV as deleteCVLocal, duplicateCV as duplicateCVLocal } from '../utils/cvStorage';
import { useAuth } from './AuthContext';

export const CVContext = createContext();

const DEFAULT_SECTION_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

const ALL_POSSIBLE_SECTIONS = [
  'summary', 'experience', 'education', 'skills', 'projects', 'languages',
  'certificates', 'interests', 'courses', 'awards', 'organisations', 'publications', 'references',
];

async function fetchAPICVs() {
  try {
    const res = await fetch('/api/cvs', { credentials: 'include' });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function saveAPICV(entry) {
  try {
    const res = await fetch('/api/cvs', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data };
    }
    return { ok: true };
  } catch (e) {
    console.error('API CV save failed', e);
    return { error: { message: 'Network error' } };
  }
}

async function deleteAPICV(id) {
  try {
    await fetch(`/api/cvs/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  } catch (e) {
    console.error('API CV delete failed', e);
  }
}

async function duplicateAPICV(entry) {
  try {
    const res = await fetch('/api/cvs', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data };
    }
    return { ok: true };
  } catch (e) {
    console.error('API CV duplicate failed', e);
    return { error: { message: 'Network error' } };
  }
}

export function CVProvider({ children }) {
  const { currentUser } = useAuth();
  const [cvData, setCvData] = useState(sampleData);
  const [selectedTemplate, setSelectedTemplate] = useState('minimal');
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
    headingAlign: 'left',
    headerAlign: 'left',
    sidebarColor: '',
    bgColor: '',
  });

  const [sectionOrder, setSectionOrder] = useState(DEFAULT_SECTION_ORDER);

  const [visibleSections, setVisibleSections] = useState({
    summary: true,
    experience: true,
    education: true,
    skills: true,
    projects: true,
    languages: true,
    certificates: true,
    interests: true,
    courses: true,
    awards: true,
    organisations: true,
    publications: true,
    references: true,
  });

  const [visiblePersonalFields, setVisiblePersonalFields] = useState({
    photo: true,
    email: true,
    phone: true,
    location: true,
    linkedin: true,
    portfolio: true,
  });

  const [sectionNames, setSectionNames] = useState({});

  const renameSectionName = (key, name) => {
    setSectionNames(prev => ({ ...prev, [key]: name }));
  };

  useEffect(() => {
    if (currentUser) {
      fetchAPICVs().then(apiCVs => {
        if (apiCVs.length > 0) {
          apiCVs.forEach(cv => saveCV({
            id: cv.id,
            name: cv.name,
            cvData: cv.cvData,
            template: cv.template,
            theme: cv.theme,
            atsScore: cv.atsScore,
            sectionOrder: cv.sectionOrder,
            visibleSections: cv.visibleSections,
            visiblePersonalFields: cv.visiblePersonalFields,
            sectionNames: cv.sectionNames,
          }));
          setSavedCVs(getSavedCVs());
        }
      });
    }
  }, [currentUser]);

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

  const addSection = (key) => {
    setSectionOrder(prev => {
      if (prev.includes(key)) return prev;
      return [...prev, key];
    });
    setVisibleSections(prev => ({ ...prev, [key]: true }));
    if (!cvData[key]) {
      setCvData(prev => ({ ...prev, [key]: [] }));
    }
  };

  const addCustomSection = (title) => {
    const id = `csec-${Date.now()}`;
    const newSection = { id, title, items: [] };
    setCvData(prev => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSection],
    }));
    setSectionOrder(prev => [...prev, id]);
    setVisibleSections(prev => ({ ...prev, [id]: true }));
    return id;
  };

  const updateCustomSection = (id, updated) => {
    setCvData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).map(s => s.id === id ? updated : s),
    }));
  };

  const deleteCustomSection = (id) => {
    setCvData(prev => ({
      ...prev,
      customSections: (prev.customSections || []).filter(s => s.id !== id),
    }));
    setSectionOrder(prev => prev.filter(k => k !== id));
    setVisibleSections(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const saveCurrentCV = async (name) => {
    const isNew = !currentCVId;
    const id = currentCVId || `cv-${Date.now()}`;
    const cvName = name || currentCVName;

    if (currentUser) {
      const entry = {
        id,
        name: cvName,
        cvData,
        template: selectedTemplate,
        theme,
        sectionNames,
        sectionOrder,
        visibleSections,
        visiblePersonalFields,
        atsScore: 95,
      };
      const result = await saveAPICV(entry);
      if (result?.error) {
        if (isNew) {
          deleteCVLocal(id);
          setSavedCVs(getSavedCVs());
        }
        return { error: result.error };
      }
    }

    const entry = saveCV({
      id,
      name: cvName,
      cvData,
      template: selectedTemplate,
      theme,
      sectionNames,
      sectionOrder,
      visibleSections,
      visiblePersonalFields,
      atsScore: 95,
    });
    setCurrentCVId(id);
    setCurrentCVName(cvName);
    setSavedCVs(getSavedCVs());
    window.dispatchEvent(new Event('cv_saved'));

    return { ok: true, entry };
  };

  const loadCVById = (id) => {
    const cv = getCVById(id);
    if (!cv) return false;
    setCvData(cv.cvData);
    setSelectedTemplate(cv.template);
    setTheme(cv.theme);
    setCurrentCVId(cv.id);
    setCurrentCVName(cv.name);
    setSectionNames(cv.sectionNames || {});
    if (cv.sectionOrder) setSectionOrder(cv.sectionOrder);
    if (cv.visibleSections) setVisibleSections(cv.visibleSections);
    if (cv.visiblePersonalFields) setVisiblePersonalFields(cv.visiblePersonalFields);
    return true;
  };

  const deleteCV = (id) => {
    deleteCVLocal(id);
    setSavedCVs(getSavedCVs());
    if (currentUser) {
      deleteAPICV(id);
    }
  };

  const duplicateCV = async (id) => {
    const copy = duplicateCVLocal(id);
    if (!copy) return null;
    setSavedCVs(getSavedCVs());
    if (currentUser) {
      const result = await duplicateAPICV(copy);
      if (result?.error) {
        deleteCVLocal(copy.id);
        setSavedCVs(getSavedCVs());
        return { error: result.error };
      }
    }
    return copy;
  };

  const startNewCV = () => {
    setCvData(blankData);
    setSelectedTemplate('minimal');
    setTheme({
      primaryColor: '#4f46e5',
      fontFamily: 'Calibri',
      fontSize: 'medium',
      lineHeight: 'normal',
      pagePadding: 'medium',
      sectionSpacing: 'medium',
      headingAlign: 'left',
      headerAlign: 'left',
      sidebarColor: '',
      bgColor: '',
    });
    setSectionOrder(DEFAULT_SECTION_ORDER);
    setCurrentCVId(null);
    setCurrentCVName('My Resume');
    setSectionNames({});
  };

  const previewTemplate = (templateId, templateColor) => {
    setCvData(sampleData);
    setSelectedTemplate(templateId || 'modern');
    setTheme({
      primaryColor: templateColor || '#4f46e5',
      fontFamily: 'Calibri',
      fontSize: 'medium',
      lineHeight: 'normal',
      pagePadding: 'medium',
      sectionSpacing: 'medium',
      headingAlign: 'left',
      headerAlign: 'left',
    });
    setSectionOrder(DEFAULT_SECTION_ORDER);
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
    addSection,
    visibleSections,
    toggleSection,
    visiblePersonalFields,
    togglePersonalField,
    currentCVId,
    currentCVName,
    setCurrentCVName,
    savedCVs,
    setSavedCVs,
    saveCurrentCV,
    loadCVById,
    deleteCV,
    duplicateCV,
    startNewCV,
    previewTemplate,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection,
    sectionNames,
    renameSectionName,
  };

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
}
