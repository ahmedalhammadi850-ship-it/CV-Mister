import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [isRTL, setIsRTL]             = useState(false);

  const buildUser = (dbUser) => {
    const planExpiresAt = dbUser.planExpiresAt ? new Date(dbUser.planExpiresAt) : null;
    const now = new Date();
    let daysLeft = null;
    if (planExpiresAt && dbUser.plan === 'business') {
      const diff = planExpiresAt - now;
      daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    const subscriptionExpired = dbUser.plan === 'free' && planExpiresAt && planExpiresAt < now;
    return {
      uid:                 dbUser.id || dbUser.uid,
      id:                  dbUser.id || dbUser.uid,
      name:                dbUser.firstName ? `${dbUser.firstName} ${dbUser.lastName || ''}`.trim() : dbUser.email,
      displayName:         dbUser.firstName ? `${dbUser.firstName} ${dbUser.lastName || ''}`.trim() : dbUser.email?.split('@')[0],
      profileImage:        dbUser.profileImageUrl || null,
      email:               dbUser.email,
      plan:                dbUser.plan || 'free',
      cvCount:             dbUser.cvCount || 0,
      planExpiresAt,
      daysLeft,
      subscriptionExpired: !!subscriptionExpired,
    };
  };

  const syncWithBackend = async (firebaseUser) => {
    try {
      const idToken = await firebaseUser.getIdToken(true);
      const res = await fetch('/api/auth/firebase-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) return null;
      const dbUser = await res.json();
      return buildUser(dbUser);
    } catch {
      return null;
    }
  };

  const buildFallbackUser = (firebaseUser) => ({
    uid:         firebaseUser.uid,
    id:          firebaseUser.uid,
    email:       firebaseUser.email || '',
    name:        firebaseUser.displayName || firebaseUser.email || '',
    displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
    profileImage: firebaseUser.photoURL || null,
    plan:        'free',
    cvCount:     0,
    planExpiresAt: null,
    daysLeft:    null,
    subscriptionExpired: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        const user = await syncWithBackend(firebaseUser);
        setCurrentUser(user || buildFallbackUser(firebaseUser));
      } else {
        setCurrentUser(null);
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (firstName, lastName, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await fetch('/api/auth/firebase-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        idToken: await credential.user.getIdToken(),
        firstName,
        lastName,
      }),
    });
    try {
      const actionCodeSettings = {
        url: `${window.location.origin}/email-action`,
        handleCodeInApp: true,
      };
      await sendEmailVerification(credential.user, actionCodeSettings);
    } catch {
      await sendEmailVerification(credential.user);
    }
    return credential.user;
  };

  const signIn = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (!credential.user.emailVerified) {
      await signOut(auth);
      const err = new Error(
        isRTL
          ? 'يرجى تأكيد بريدك الإلكتروني أولاً. تحقق من صندوق الوارد.'
          : 'Please verify your email first. Check your inbox.'
      );
      err.code = 'auth/email-not-verified';
      throw err;
    }
    const user = await syncWithBackend(credential.user);
    setCurrentUser(user || buildFallbackUser(credential.user));
    return user;
  };

  const signOutUser = async () => {
    await signOut(auth);
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setCurrentUser(null);
  };

  const sendPasswordReset  = async (email) => sendPasswordResetEmail(auth, email);
  const resendVerification = async () => {
    const u = auth.currentUser;
    if (u) {
      try {
        const actionCodeSettings = {
          url: `${window.location.origin}/email-action`,
          handleCodeInApp: true,
        };
        await sendEmailVerification(u, actionCodeSettings);
      } catch {
        await sendEmailVerification(u);
      }
    }
  };

  const refreshUser = async () => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser && firebaseUser.emailVerified) {
      const user = await syncWithBackend(firebaseUser);
      if (user) setCurrentUser(user);
      else setCurrentUser(buildFallbackUser(firebaseUser));
    }
  };

  const toggleRTL = () => {
    setIsRTL(prev => {
      const next = !prev;
      document.documentElement.dir = next ? 'rtl' : 'ltr';
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, isRTL, toggleRTL, signIn, signUp, signOutUser, sendPasswordReset, resendVerification, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
