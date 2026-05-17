import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function ensureInit() {
  if (getApps().length > 0) return;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID || "cv-mister-e4bbc",
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export function getDb() {
  ensureInit();
  return getFirestore();
}

export function getAdminAuth() {
  ensureInit();
  return getAuth();
}

export async function verifyFirebaseToken(idToken) {
  const decoded = await getAdminAuth().verifyIdToken(idToken);
  return {
    localId: decoded.uid,
    email: decoded.email || "",
    emailVerified: decoded.email_verified !== false,
  };
}
