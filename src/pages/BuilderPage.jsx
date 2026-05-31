import { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCV } from '../context/useCV';
import CVBuilder from '../components/builder/CVBuilder';

const BuilderPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { loadCVById, loadCVByIdFromAPI, startNewCV, previewTemplate } = useCV();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const fromTemplate = searchParams.get('from') === 'template';
    const templateParam = searchParams.get('template');
    if (id) {
      // Try localStorage first (fast path)
      const found = loadCVById(id);
      if (!found) {
        // Fallback: load directly from API (handles race condition where
        // Firestore sync hasn't written to localStorage yet)
        loadCVByIdFromAPI(id).then(ok => {
          if (!ok) startNewCV();
        });
      }
    } else if (!fromTemplate) {
      startNewCV();
      if (templateParam) {
        previewTemplate(templateParam);
      }
    }
    // if fromTemplate=true, data was already set by TemplatesPage before navigation
  }, [id]);

  return (
    <div className="w-full">
      <CVBuilder />
    </div>
  );
};

export default BuilderPage;
