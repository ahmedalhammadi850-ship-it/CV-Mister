import { useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCV } from '../context/useCV';
import CVBuilder from '../components/builder/CVBuilder';

const BuilderPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { loadCVById, startNewCV } = useCV();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const fromTemplate = searchParams.get('from') === 'template';
    if (id) {
      const found = loadCVById(id);
      if (!found) startNewCV();
    } else if (!fromTemplate) {
      startNewCV();
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
