import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import bcrypt from "bcryptjs";

const projectId = process.env.FIREBASE_PROJECT_ID || "cv-mister-e4bbc";
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

if (!clientEmail || !privateKey) {
  console.error("❌ Missing FIREBASE_CLIENT_EMAIL or FIREBASE_PRIVATE_KEY env vars.");
  console.error("   Set them then re-run: node scripts/seed-firestore.mjs");
  process.exit(1);
}

initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
const db = getFirestore();

const ADMIN_USERNAME = process.env.SEED_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123";

const TEMPLATES = ["minimal","modern","classic","creative","executive","professional","elegant","tech","arabic"];

async function seed() {
  console.log(`🌱 Seeding Firestore (project: ${projectId})...`);

  // ── Admin config ──
  const adminRef = db.collection("adminConfig").doc("main");
  const adminSnap = await adminRef.get();
  if (!adminSnap.exists) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await adminRef.set({
      username: ADMIN_USERNAME,
      passwordHash: hash,
      updatedAt: new Date().toISOString(),
    });
    console.log(`✅ Admin created → username: ${ADMIN_USERNAME}  password: ${ADMIN_PASSWORD}`);
    console.log("⚠️  CHANGE the password immediately after first login!");
  } else {
    console.log("ℹ️  Admin config already exists — skipping.");
  }

  // ── Template config ──
  for (const t of TEMPLATES) {
    const ref = db.collection("templateConfig").doc(t);
    const snap = await ref.get();
    if (!snap.exists) {
      await ref.set({ isFree: t === "minimal", updatedAt: new Date().toISOString() });
      console.log(`✅ Template "${t}" → isFree: ${t === "minimal"}`);
    } else {
      console.log(`ℹ️  Template "${t}" already exists — skipping.`);
    }
  }

  console.log("\n✅ Seed complete! You can now deploy to Vercel.");
  process.exit(0);
}

seed().catch(err => { console.error("❌ Seed failed:", err.message); process.exit(1); });
