import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRTL, setIsRTL] = useState(false);

  const buildUser = (user) => {
    const planExpiresAt = user.planExpiresAt ? new Date(user.planExpiresAt) : null;
    const now = new Date();
    let daysLeft = null;
    if (planExpiresAt && user.plan === 'business') {
      const diff = planExpiresAt - now;
      daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    // Was on business plan but now expired (auto-downgraded to free)
    const subscriptionExpired = user.plan === 'free' && planExpiresAt && planExpiresAt < now;
    return {
      uid: user.id,
      id: user.id,
      name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email,
      displayName: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email?.split('@')[0],
      profileImage: user.profileImageUrl || null,
      email: user.email,
      plan: user.plan || 'free',
      cvCount: user.cvCount || 0,
      planExpiresAt,
      daysLeft,
      subscriptionExpired: !!subscriptionExpired,
    };
  };

  const fetchUser = () => {
    return fetch('/api/auth/user', { credentials: 'include' })
      .then(res => {
        if (res.status === 401) return null;
        if (!res.ok) throw new Error('Failed to fetch user');
        return res.json();
      })
      .then(user => {
        setCurrentUser(user ? buildUser(user) : null);
      })
      .catch(() => setCurrentUser(null));
  };

  const refreshUser = () => fetchUser();

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
    setCurrentUser(buildUser(data));
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
    setCurrentUser(buildUser(data));
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
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
