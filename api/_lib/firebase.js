import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function parsePrivateKey(raw = "") {
  // Remove surrounding quotes if Vercel added them
  let key = raw.trim().replace(/^["']|["']$/g, "");
  // Replace literal \n (text) with real newlines
  key = key.replace(/\\n/g, "\n");
  return key;
}

function ensureInit() {
  if (getApps().length > 0) return;
  const privateKey   = parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  const clientEmail  = (process.env.FIREBASE_CLIENT_EMAIL || "").trim();
  const projectId    = (process.env.FIREBASE_PROJECT_ID  || "cv-mister-e4bbc").trim();

  initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
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
    localId:       decoded.uid,
    email:         decoded.email || "",
    emailVerified: decoded.email_verified !== false,
  };
}
