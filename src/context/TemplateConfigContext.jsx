import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';

const TemplateConfigContext = createContext({ freeTemplates: new Set(['minimal']), loading: true, refresh: () => {} });

export const TemplateConfigProvider = ({ children }) => {
  const [freeTemplates, setFreeTemplates] = useState(new Set(['minimal']));
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await apiFetch('/api/templates/config');
      if (!res.ok) return;
      const config = await res.json();
      const freeSet = new Set(Object.entries(config).filter(([, v]) => v).map(([k]) => k));
      setFreeTemplates(freeSet);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  return (
    <TemplateConfigContext.Provider value={{ freeTemplates, loading, refresh }}>
      {children}
    </TemplateConfigContext.Provider>
  );
};

export const useTemplateConfig = () => useContext(TemplateConfigContext);
