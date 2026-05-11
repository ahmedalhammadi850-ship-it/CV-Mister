import React, { createContext, useContext, useState, useEffect } from 'react';
// import { auth } from '../firebase/config';
// import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Mock auth for now until firebase is fully setup
    const user = { uid: '123', email: 'user@example.com', displayName: 'Demo User' };
    setCurrentUser(user);
    setLoading(false);
    
    /*
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
    */
  }, []);

  const toggleRTL = () => {
    setIsRTL(prev => !prev);
    document.documentElement.dir = !isRTL ? 'rtl' : 'ltr';
  };

  const value = {
    currentUser,
    loading,
    isRTL,
    toggleRTL,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
