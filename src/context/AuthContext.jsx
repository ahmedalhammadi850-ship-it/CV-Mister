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
import { getOrCreateUser, registerUserProfile, getUser } from '../lib/firestore';

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
    let subscriptionExpired = false;
    if (dbUser.plan === 'free') {
      if (planExpiresAt && planExpiresAt < now) {
        subscriptionExpired = true;
      } else if (dbUser.createdAt) {
        const createdAt = new Date(dbUser.createdAt);
        const freeExpiry = new Date(createdAt);
        freeExpiry.setMonth(freeExpiry.getMonth() + 1);
        if (now > freeExpiry) subscriptionExpired = true;
      }
    }
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
      subscriptionExpired,
      cvLimit:             dbUser.cvLimit ?? null,
    };
  };

  const syncWithFirestore = async (firebaseUser) => {
    try {
      const dbUser = await getOrCreateUser(firebaseUser.uid, firebaseUser.email || '');
      return buildUser(dbUser);
    } catch {
      return null;
    }
  };

  const buildFallbackUser = (firebaseUser) => ({
    uid:                 firebaseUser.uid,
    id:                  firebaseUser.uid,
    email:               firebaseUser.email || '',
    name:                firebaseUser.displayName || firebaseUser.email || '',
    displayName:         firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
    profileImage:        firebaseUser.photoURL || null,
    plan:                'free',
    cvCount:             0,
    planExpiresAt:       null,
    daysLeft:            null,
    subscriptionExpired: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        const user = await syncWithFirestore(firebaseUser);
        setCurrentUser(user || buildFallbackUser(firebaseUser));
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (firstName, lastName, email, password) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await registerUserProfile(credential.user.uid, email, firstName, lastName);
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
    const user = await syncWithFirestore(credential.user);
    setCurrentUser(user || buildFallbackUser(credential.user));
    return user;
  };

  const signOutUser = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const sendPasswordReset  = async (email) => sendPasswordResetEmail(auth, email);

  const resendVerification = async () => {
    const u = auth.currentUser;
    if (u) {
      try {
        await sendEmailVerification(u, {
          url: `${window.location.origin}/email-action`,
          handleCodeInApp: true,
        });
      } catch {
        await sendEmailVerification(u);
      }
    }
  };

  const refreshUser = async () => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser && firebaseUser.emailVerified) {
      try {
        const dbUser = await getUser(firebaseUser.uid);
        if (dbUser) setCurrentUser(buildUser(dbUser));
        else setCurrentUser(buildFallbackUser(firebaseUser));
      } catch {
        setCurrentUser(buildFallbackUser(firebaseUser));
      }
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
