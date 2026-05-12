import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          name: user.displayName || user.email,
          displayName: user.displayName || user.email?.split('@')[0],
          profileImage: user.photoURL || null,
          email: user.email,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signUp = async (email, password, name) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
      setCurrentUser(prev => ({ ...prev, displayName: name, name }));
    }
    return cred;
  };

  const signOutUser = () => signOut(auth);

  const sendPasswordReset = (email) => sendPasswordResetEmail(auth, email);

  const toggleRTL = () => {
    setIsRTL(prev => {
      const next = !prev;
      document.documentElement.dir = next ? 'rtl' : 'ltr';
      return next;
    });
  };

  const value = {
    currentUser,
    loading,
    isRTL,
    toggleRTL,
    signIn,
    signUp,
    signOutUser,
    sendPasswordReset,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
