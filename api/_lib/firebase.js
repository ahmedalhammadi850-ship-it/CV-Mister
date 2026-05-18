import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { createRestDb } from "./firestore-rest.js";

const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY || "AIzaSyAWOigTY6lsunLk6tTgeoXTm4JmwWUR4No";
const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "cv-mister-e4bbc";

function hasAdminCredentials() {
  return !!(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL);
}

function parsePrivateKey(raw = "") {
  return raw.trim().replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");
}

function ensureInit() {
  if (getApps().length > 0) return;
  initializeApp({
    credential: cert({
      projectId: PROJECT_ID,
      clientEmail: (process.env.FIREBASE_CLIENT_EMAIL || "").trim(),
      privateKey: parsePrivateKey(process.env.FIREBASE_PRIVATE_KEY),
    }),
  });
}

export function getDb(idToken) {
  if (hasAdminCredentials()) {
    ensureInit();
    return getFirestore();
  }
  if (idToken) return createRestDb(idToken);
  throw new Error("No Firebase Admin credentials and no ID token provided");
}

export function getAdminAuth() {
  ensureInit();
  return getAuth();
}

async function verifyTokenViaREST(idToken) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!res.ok) {
    const e = await res.json().catch(() => ({}));
    throw new Error(e?.error?.message || "Token verification failed");
  }
  const data = await res.json();
  const user = data.users?.[0];
  if (!user) throw new Error("User not found");
  return {
    localId: user.localId,
    email: user.email || "",
    emailVerified: user.emailVerified === true,
  };
}

export async function verifyFirebaseToken(idToken) {
  if (hasAdminCredentials()) {
    try {
      ensureInit();
      const decoded = await getAdminAuth().verifyIdToken(idToken);
      return {
        localId: decoded.uid,
        email: decoded.email || "",
        emailVerified: decoded.email_verified !== false,
      };
    } catch {
      // fall through to REST
    }
  }
  return verifyTokenViaREST(idToken);
}
