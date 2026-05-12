import React, { createContext, useContext, useState, useEffect } from 'react';
import { sampleData } from '../utils/sampleData';
import { saveCV, getCVById, getSavedCVs, deleteCV as deleteCVLocal } from '../utils/cvStorage';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection, doc, setDoc, getDocs, deleteDoc, query, orderBy,
} from 'firebase/firestore';

const CVContext = createContext();

export function useCV() {
  return useContext(CVContext);
}

const DEFAULT_SECTION_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

const ALL_POSSIBLE_SECTIONS = [
  'summary', 'experience', 'education', 'skills', 'projects', 'languages',
  'certificates', 'interests', 'courses', 'awards', 'organisations', 'publications', 'references',
];

async function fetchFirestoreCVs(uid) {
  try {
    const q = query(collection(db, 'users', uid, 'cvs'), orderBy('lastModified', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data());
  } catch {
    return [];
  }
}

async function saveFirestoreCV(uid, entry) {
  try {
    await setDoc(doc(db, 'users', uid, 'cvs', entry.id), entry);
  } catch (e) {
    console.error('Firestore save failed', e);
  }
}

async function deleteFirestoreCV(uid, id) {
  try {
    await deleteDoc(doc(db, 'users', uid, 'cvs', id));
  } catch (e) {
    console.error('Firestore delete failed', e);
  }
}

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
    certificates: true,
    interests: true,
    courses: true,
    awards: true,
    organisations: true,
    publications: true,
    references: true,
  });

  const [visiblePersonalFields, setVisiblePersonalFields] = useState({
    email: true,
    phone: true,
    location: true,
    linkedin: true,
    portfolio: true,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const firestoreCVs = await fetchFirestoreCVs(user.uid);
        if (firestoreCVs.length > 0) {
          firestoreCVs.forEach(cv => saveCV(cv));
          setSavedCVs(getSavedCVs());
        }
      }
    });
    return unsub;
  }, []);

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

    const user = auth.currentUser;
    if (user) {
      saveFirestoreCV(user.uid, entry);
    }

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

  const deleteCV = (id) => {
    deleteCVLocal(id);
    setSavedCVs(getSavedCVs());
    const user = auth.currentUser;
    if (user) {
      deleteFirestoreCV(user.uid, id);
    }
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
    saveCurrentCV,
    loadCVById,
    deleteCV,
    startNewCV,
  };

  return (
    <CVContext.Provider value={value}>
      {children}
    </CVContext.Provider>
  );
}
