import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCV } from '../context/useCV';
import CVBuilder from '../components/builder/CVBuilder';

const BuilderPage = () => {
  const { id } = useParams();
  const { loadCVById, startNewCV } = useCV();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    if (id) {
      const found = loadCVById(id);
      if (!found) startNewCV();
    } else {
      startNewCV();
    }
  }, [id]);

  return (
    <div className="w-full">
      <CVBuilder />
    </div>
  );
};

export default BuilderPage;
