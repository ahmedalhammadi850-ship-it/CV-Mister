const STORAGE_KEY = 'cv_mister_cvs';

export function getSavedCVs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCV({ id, name, cvData, template, theme, atsScore = 95, sectionOrder, visibleSections, visiblePersonalFields, sectionNames }) {
  const cvs = getSavedCVs();
  const now = new Date().toISOString();
  const existing = cvs.findIndex(c => c.id === id);
  const entry = { id, name, cvData, template, theme, atsScore, lastModified: now, sectionOrder, visibleSections, visiblePersonalFields, sectionNames };
  if (existing >= 0) {
    cvs[existing] = entry;
  } else {
    cvs.unshift(entry);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
  return entry;
}

export function deleteCV(id) {
  const cvs = getSavedCVs().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
}

export function getCVById(id) {
  return getSavedCVs().find(c => c.id === id) || null;
}

export function duplicateCV(id) {
  const cv = getCVById(id);
  if (!cv) return null;
  const newId = `cv-${Date.now()}`;
  const copy = { ...cv, id: newId, name: cv.name + ' (Copy)', lastModified: new Date().toISOString() };
  const cvs = getSavedCVs();
  cvs.unshift(copy);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cvs));
  return copy;
}

export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
