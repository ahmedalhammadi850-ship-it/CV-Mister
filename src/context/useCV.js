import { useContext } from 'react';
import { CVContext } from './CVContext';

export function useCV() {
  return useContext(CVContext);
}
