import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(false);

  const fetchUser = () => {
    return fetch('/api/auth/user', { credentials: 'include' })
      .then(res => {
        if (res.status === 401) return null;
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(user => {
        if (user) {
          setCurrentUser({
            uid: user.id,
            id: user.id,
            name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email,
            displayName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email?.split('@')[0],
            profileImage: user.profileImageUrl || null,
            email: user.email,
          });
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  };

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, []);

  const signIn = async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'فشل تسجيل الدخول');
    setCurrentUser({
      uid: data.id,
      id: data.id,
      name: data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : data.email,
      displayName: data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : data.email?.split('@')[0],
      profileImage: data.profileImageUrl || null,
      email: data.email,
    });
    return data;
  };

  const signUp = async (firstName, lastName, email, password) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ firstName, lastName, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'فشل إنشاء الحساب');
    setCurrentUser({
      uid: data.id,
      id: data.id,
      name: data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : data.email,
      displayName: data.firstName ? `${data.firstName} ${data.lastName || ''}`.trim() : data.email?.split('@')[0],
      profileImage: data.profileImageUrl || null,
      email: data.email,
    });
    return data;
  };

  const signOutUser = async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setCurrentUser(null);
  };

  const sendPasswordReset = () => {};

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
