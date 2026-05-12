import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: __FIREBASE_API_KEY__,
  authDomain: 'cv-mister-e4bbc.firebaseapp.com',
  projectId: 'cv-mister-e4bbc',
  storageBucket: 'cv-mister-e4bbc.firebasestorage.app',
  messagingSenderId: '804951280569',
  appId: '1:804951280569:web:5a75c62431fc26a6118468',
  measurementId: 'G-QCHVRHXEBZ',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
