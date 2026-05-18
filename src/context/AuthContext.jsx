import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [isRTL, setIsRTL]             = useState(false);
  const unsubUserRef                  = useRef(null);

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
      const idToken = await firebaseUser.getIdToken();
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

  const stopUserListener = () => {
    if (unsubUserRef.current) {
      unsubUserRef.current();
      unsubUserRef.current = null;
    }
  };

  const startUserListener = (uid) => {
    stopUserListener();
    const userRef = doc(db, 'users', uid);
    unsubUserRef.current = onSnapshot(
      userRef,
      (snap) => {
        if (snap.exists()) {
          setCurrentUser(buildUser({ id: snap.id, ...snap.data() }));
        }
      },
      () => { /* permission-denied: rules not updated yet, silently ignore */ }
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      stopUserListener();
      if (firebaseUser && firebaseUser.emailVerified) {
        const user = await syncWithBackend(firebaseUser);
        setCurrentUser(user);
        if (user?.uid) startUserListener(user.uid);
      } else {
        setCurrentUser(null);
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      }
      setLoading(false);
    });
    return () => { unsubscribe(); stopUserListener(); };
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
    const actionCodeSettings = {
      url: `${window.location.origin}/verify-email`,
      handleCodeInApp: false,
    };
    await sendEmailVerification(credential.user, actionCodeSettings);
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
    setCurrentUser(user);
    if (user?.uid) startUserListener(user.uid);
    return user;
  };

  const signOutUser = async () => {
    stopUserListener();
    await signOut(auth);
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setCurrentUser(null);
  };

  const sendPasswordReset  = async (email) => sendPasswordResetEmail(auth, email);
  const resendVerification = async () => {
    const u = auth.currentUser;
    if (u) {
      const actionCodeSettings = {
        url: `${window.location.origin}/verify-email`,
        handleCodeInApp: false,
      };
      await sendEmailVerification(u, actionCodeSettings);
    }
  };
  const refreshUser        = async () => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser && firebaseUser.emailVerified) {
      const user = await syncWithBackend(firebaseUser);
      if (user) setCurrentUser(user);
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
