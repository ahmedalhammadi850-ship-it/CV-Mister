import express from "express";
import bcrypt from "bcryptjs";
import { getDb, verifyFirebaseToken } from "./_lib/firebase.js";
import { getN8nSettings, invalidateCache } from "./_lib/n8nSettings.js";
import {
  getUserFromReq,
  getAdminFromReq,
  setUserCookie,
  setAdminCookie,
  clearUserCookie,
  clearAdminCookie,
} from "./_lib/token.js";

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// ── ping ──────────────────────────────────────────────────────────────────────
app.get("/api/ping", (req, res) => res.json({ ok: true }));

// ── navbar ────────────────────────────────────────────────────────────────────
const NAVBAR_DEFAULTS = {
  home_ar: "الرئيسية", home_en: "Home",
  templates_ar: "القوالب", templates_en: "Templates",
  pricing_ar: "الأسعار", pricing_en: "Pricing",
  about_ar: "من نحن", about_en: "About",
};
app.get("/api/navbar", async (req, res) => {
  try {
    const db = getDb();
    const snap = await db.doc("appConfig/navbar").get();
    return res.json({ ...NAVBAR_DEFAULTS, ...(snap.exists ? snap.data() : {}) });
  } catch {
    return res.json(NAVBAR_DEFAULTS);
  }
});

// ── pricing ───────────────────────────────────────────────────────────────────
const PRICING_DEFAULTS = {
  pro_price: 3, pro_name: "احترافي", pro_name_en: "Professional",
  pro_desc: "الخيار المثالي للباحثين عن عمل بجدية",
  pro_desc_en: "Ideal for serious job seekers",
  business_price: 15, business_name: "أعمال", business_name_en: "Business",
  business_desc: "للشركات والفرق التي تحتاج إلى حلول متكاملة",
  business_desc_en: "For companies and teams needing complete solutions",
  free_name: "مجاني", free_name_en: "Free",
  free_desc: "مثالي للبدء وتجربة المنصة", free_desc_en: "Perfect to get started and try the platform",
  payment_account: "00154578", payment_bank: "بنك التضامن — Tadhamon Bank",
  payment_beneficiary: "أحمد عبدالله عقلان الحمادي",
  free_features: [
    { label: "سيرة ذاتية واحدة",          labelEn: "1 resume",                included: true  },
    { label: "قالب أساسي",                labelEn: "Basic template",          included: true  },
    { label: "تصدير PDF",                 labelEn: "PDF export",              included: true  },
    { label: "دعم اللغة العربية",          labelEn: "Arabic language support", included: true  },
    { label: "اقتراحات الذكاء الاصطناعي", labelEn: "AI suggestions",          included: false },
    { label: "رسالة تغطية",               labelEn: "Cover letter",            included: false },
  ],
  pro_features: [
    { label: "2 سير ذاتية",               labelEn: "2 resumes",               included: true },
    { label: "جميع القوالب (25+)",          labelEn: "All templates (25+)",     included: true },
    { label: "تصدير PDF عالي الجودة",      labelEn: "High-quality PDF export", included: true },
    { label: "دعم العربية والإنجليزية",    labelEn: "Arabic & English support",included: true },
    { label: "اقتراحات الذكاء الاصطناعي", labelEn: "AI suggestions",          included: true },
    { label: "رسالة تغطية",               labelEn: "Cover letter",            included: true },
  ],
  business_features: [
    { label: "سير ذاتية غير محدودة",       labelEn: "Unlimited resumes",          included: true },
    { label: "جميع القوالب + حصرية",       labelEn: "All templates + exclusive",  included: true },
    { label: "تصدير PDF عالي الجودة",      labelEn: "High-quality PDF export",    included: true },
    { label: "دعم كامل متعدد اللغات",      labelEn: "Full multilingual support",  included: true },
    { label: "ذكاء اصطناعي متقدم",         labelEn: "Advanced AI",               included: true },
    { label: "رسائل تغطية غير محدودة",     labelEn: "Unlimited cover letters",   included: true },
  ],
};
app.get("/api/pricing", async (req, res) => {
  try {
    const db = getDb();
    const snap = await db.doc("appConfig/pricing").get();
    return res.json({ ...PRICING_DEFAULTS, ...(snap.exists ? snap.data() : {}) });
  } catch {
    return res.json(PRICING_DEFAULTS);
  }
});

// ── templates/config ──────────────────────────────────────────────────────────
const DEFAULT_TEMPLATE_CONFIG = {
  minimal: true, modern: false, classic: false, creative: false,
  executive: false, professional: false, elegant: false, tech: false, arabic: false,
};
app.get("/api/templates/config", async (req, res) => {
  try {
    const db = getDb();
    const snap = await db.collection("templateConfig").get();
    const config = { ...DEFAULT_TEMPLATE_CONFIG };
    snap.docs.forEach(doc => { config[doc.id] = doc.data().isFree ?? DEFAULT_TEMPLATE_CONFIG[doc.id] ?? false; });
    return res.json(config);
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

// ── debug ─────────────────────────────────────────────────────────────────────
app.get("/api/debug", async (req, res) => {
  const info = {
    has_firebase_client_email: !!process.env.FIREBASE_CLIENT_EMAIL,
    has_firebase_private_key:  !!process.env.FIREBASE_PRIVATE_KEY,
    has_firebase_project_id:   !!process.env.FIREBASE_PROJECT_ID,
    has_session_secret:        !!process.env.SESSION_SECRET,
    firebase_project_id:       process.env.FIREBASE_PROJECT_ID || "(not set)",
    private_key_starts:        (process.env.FIREBASE_PRIVATE_KEY || "").slice(0, 40).replace(/\n/g, "\\n"),
    node_version:              process.version,
    firebase_test:             "not_run",
    firebase_error:            null,
  };
  try {
    const db = getDb();
    const snap = await db.collection("users").limit(1).get();
    info.firebase_test = `ok — users collection reachable (${snap.size} doc checked)`;
  } catch (err) {
    info.firebase_test  = "FAILED";
    info.firebase_error = err.message;
  }
  return res.json(info);
});

// ── font-proxy ────────────────────────────────────────────────────────────────
app.get("/api/font-proxy", async (req, res) => {
  const url = req.query.url;
  if (!url || !url.startsWith("https://fonts.googleapis.com/")) {
    return res.status(400).send("Invalid font URL");
  }
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" },
    });
    const css = await response.text();
    const rewritten = css.replace(
      /url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/g,
      "url(/api/font-file?url=$1)"
    );
    res.setHeader("Content-Type", "text/css");
    res.setHeader("Cache-Control", "public, max-age=86400");
    return res.send(rewritten);
  } catch {
    return res.status(500).send("");
  }
});

// ── font-file ─────────────────────────────────────────────────────────────────
app.get("/api/font-file", async (req, res) => {
  const url = req.query.url;
  if (!url || !url.startsWith("https://fonts.gstatic.com/")) {
    return res.status(400).send("Invalid font file URL");
  }
  try {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    res.setHeader("Content-Type", "font/woff2");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=604800");
    return res.end(Buffer.from(buffer));
  } catch {
    return res.status(500).send("");
  }
});

// ── auth/firebase-sync ────────────────────────────────────────────────────────
app.post("/api/auth/firebase-sync", async (req, res) => {
  try {
    const { idToken } = req.body || {};
    if (!idToken) return res.status(400).json({ message: "Missing idToken" });
    const firebaseUser = await verifyFirebaseToken(idToken);
    const { localId: uid, email, emailVerified } = firebaseUser;
    if (!emailVerified) return res.status(403).json({ message: "Email not verified" });
    const db = getDb();
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    let userData;
    if (!userSnap.exists) {
      userData = {
        email: email.toLowerCase(), firstName: null, lastName: null,
        profileImageUrl: null, plan: "free", cvCount: 0, planExpiresAt: null,
        firebaseUid: uid, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      };
      await userRef.set(userData);
    } else {
      userData = userSnap.data();
      if ((userData.plan === "business" || userData.plan === "pro") &&
          userData.planExpiresAt && new Date() > new Date(userData.planExpiresAt)) {
        await userRef.update({ plan: "free", planExpiresAt: null, updatedAt: new Date().toISOString() });
        userData.plan = "free";
      }
    }
    setUserCookie(res, uid);
    return res.json({
      id: uid, email: userData.email,
      firstName: userData.firstName || null, lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      plan: userData.plan || "free", cvCount: userData.cvCount || 0,
      planExpiresAt: userData.planExpiresAt || null, createdAt: userData.createdAt || null,
      cvLimit: userData.cvLimit ?? null,
    });
  } catch (error) {
    console.error("[firebase-sync]", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// ── auth/firebase-register ────────────────────────────────────────────────────
app.post("/api/auth/firebase-register", async (req, res) => {
  try {
    const { idToken, firstName, lastName } = req.body || {};
    if (!idToken || !firstName) return res.status(400).json({ message: "Missing idToken or firstName" });
    const firebaseUser = await verifyFirebaseToken(idToken);
    const { localId: uid, email } = firebaseUser;
    if (!email) return res.status(400).json({ message: "No email in Firebase token" });
    const db = getDb();
    const userRef = db.collection("users").doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      await userRef.set({
        email: email.toLowerCase(), firstName: firstName || null, lastName: lastName || null,
        profileImageUrl: null, plan: "free", cvCount: 0, planExpiresAt: null,
        firebaseUid: uid, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      });
    } else {
      const data = userSnap.data();
      if (!data.firstName && firstName) {
        await userRef.update({ firstName, lastName: lastName || null, updatedAt: new Date().toISOString() });
      }
    }
    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("[firebase-register]", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// ── auth/logout ───────────────────────────────────────────────────────────────
app.post("/api/auth/logout", (req, res) => {
  clearUserCookie(res);
  return res.json({ message: "تم تسجيل الخروج" });
});

// ── auth/user ─────────────────────────────────────────────────────────────────
app.get("/api/auth/user", async (req, res) => {
  try {
    const payload = getUserFromReq(req);
    if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
    const db = getDb();
    const userSnap = await db.collection("users").doc(payload.userId).get();
    if (!userSnap.exists) return res.status(401).json({ message: "غير مصادق" });
    const user = userSnap.data();
    let plan = user.plan || "free";
    if ((plan === "business" || plan === "pro") && user.planExpiresAt && new Date() > new Date(user.planExpiresAt)) {
      plan = "free";
      await db.collection("users").doc(payload.userId).update({ plan: "free", planExpiresAt: null, updatedAt: new Date().toISOString() });
    }
    return res.json({
      id: payload.userId, email: user.email,
      firstName: user.firstName || null, lastName: user.lastName || null,
      profileImageUrl: user.profileImageUrl || null,
      plan, cvCount: user.cvCount || 0,
      planExpiresAt: user.planExpiresAt || null, cvLimit: user.cvLimit ?? null,
    });
  } catch (error) {
    console.error("[auth/user]", error.message);
    return res.status(500).json({ message: error.message });
  }
});

// ── cvs ───────────────────────────────────────────────────────────────────────
const FREE_LIMIT = 1;
const PRO_LIMIT  = 2;

app.get("/api/cvs", async (req, res) => {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.collection("cvs").where("userId", "==", payload.userId).get();
    const cvs = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const ta = a.lastModified ? new Date(a.lastModified).getTime() : 0;
        const tb = b.lastModified ? new Date(b.lastModified).getTime() : 0;
        return tb - ta;
      });
    return res.json(cvs);
  } catch (err) {
    console.error("[cvs GET]", err.message);
    return res.status(500).json({ message: "Failed to fetch CVs" });
  }
});

app.post("/api/cvs", async (req, res) => {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  const uid = payload.userId;
  try {
    const { id, name, cvData, template, theme, atsScore, sectionOrder, visibleSections, visiblePersonalFields, sectionNames } = req.body || {};
    const db = getDb();
    const cvRef = db.collection("cvs").doc(id);
    const cvSnap = await cvRef.get();
    const isNew = !cvSnap.exists;
    const userSnap = await db.collection("users").doc(uid).get();
    const userData = userSnap.data() || {};
    const plan = userData.plan || "free";
    if (plan === "free") {
      const createdAt = userData.createdAt ? new Date(userData.createdAt) : null;
      if (createdAt) {
        const expiryDate = new Date(createdAt);
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        if (new Date() > expiryDate) {
          return res.status(403).json({ message: "انتهت فترة الاستخدام المجاني. قم بالترقية للاستمرار.", freeExpired: true });
        }
      }
    }
    if (isNew) {
      const proLimit = userData.cvLimit || PRO_LIMIT;
      const limit = plan === "business" ? Infinity : plan === "pro" ? proLimit : FREE_LIMIT;
      const countSnap = await db.collection("cvs").where("userId", "==", uid).get();
      const count = countSnap.size;
      if (count >= limit) {
        return res.status(403).json({
          message: plan === "free"
            ? `وصلت للحد المجاني (${FREE_LIMIT} سيرة). قم بالترقية للحصول على المزيد.`
            : `وصلت لحد الخطة المدفوعة (${proLimit} سيرة). قم بتجديد الاشتراك.`,
          limitReached: true, plan, limit: isFinite(limit) ? limit : null, count,
        });
      }
    }
    const now = new Date().toISOString();
    await cvRef.set({
      userId: uid, name, cvData, template, theme, atsScore,
      sectionOrder: sectionOrder || null, visibleSections: visibleSections || null,
      visiblePersonalFields: visiblePersonalFields || null, sectionNames: sectionNames || null,
      lastModified: now, downloadCount: cvSnap.data()?.downloadCount || 0,
    });
    return res.json({ id, userId: uid, name, cvData, template, theme, atsScore, sectionOrder, visibleSections, visiblePersonalFields, sectionNames, lastModified: now });
  } catch (err) {
    console.error("[cvs POST]", err.message);
    return res.status(500).json({ message: "Failed to save CV" });
  }
});

app.get("/api/cvs/:id", async (req, res) => {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.collection("cvs").doc(req.params.id).get();
    if (!snap.exists || snap.data().userId !== payload.userId) return res.status(404).json({ message: "CV not found" });
    return res.json({ id: snap.id, ...snap.data() });
  } catch {
    return res.status(500).json({ message: "Failed to fetch CV" });
  }
});

app.patch("/api/cvs/:id", async (req, res) => {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const { name } = req.body || {};
    if (!name?.trim()) return res.status(400).json({ message: "Name is required" });
    const db = getDb();
    const snap = await db.collection("cvs").doc(req.params.id).get();
    if (!snap.exists || snap.data().userId !== payload.userId) return res.status(404).json({ message: "CV not found" });
    const now = new Date().toISOString();
    await db.collection("cvs").doc(req.params.id).update({ name: name.trim(), lastModified: now });
    return res.json({ id: req.params.id, ...snap.data(), name: name.trim(), lastModified: now });
  } catch {
    return res.status(500).json({ message: "Failed to rename CV" });
  }
});

app.delete("/api/cvs/:id", async (req, res) => {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.collection("cvs").doc(req.params.id).get();
    if (snap.exists && snap.data().userId === payload.userId) {
      await db.collection("cvs").doc(req.params.id).delete();
    }
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ message: "Failed to delete CV" });
  }
});

app.post("/api/cvs/:id/download", async (req, res) => {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const cvRef = db.collection("cvs").doc(req.params.id);
    const snap = await cvRef.get();
    if (!snap.exists || snap.data().userId !== payload.userId) return res.status(404).json({ message: "CV not found" });
    const newCount = (snap.data().downloadCount || 0) + 1;
    await cvRef.update({ downloadCount: newCount });
    return res.json({ downloadCount: newCount });
  } catch {
    return res.status(500).json({ message: "Failed to track download" });
  }
});

// ── payment-requests ──────────────────────────────────────────────────────────
const cooldowns = new Map();
app.post("/api/payment-requests", async (req, res) => {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  const uid = payload.userId;
  const lastTime = cooldowns.get(uid);
  if (lastTime && Date.now() - lastTime < 30000) {
    const remaining = Math.ceil((30000 - (Date.now() - lastTime)) / 1000);
    return res.status(429).json({ message: `يرجى الانتظار ${remaining} ثانية`, remaining });
  }
  cooldowns.set(uid, Date.now());
  try {
    const { receiptImage, plan } = req.body || {};
    if (!receiptImage) return res.status(400).json({ message: "صورة الحوالة مطلوبة" });
    const targetPlan = plan === "business" ? "business" : "pro";
    const amount = targetPlan === "business" ? 15 : 3;
    const db = getDb();
    const existingSnap = await db.collection("paymentRequests").where("userId", "==", uid).where("status", "==", "pending").get();
    if (!existingSnap.empty) return res.status(400).json({ message: "لديك طلب ترقية قيد المراجعة بالفعل" });
    const id = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    await db.collection("paymentRequests").doc(id).set({
      userId: uid, receiptImage, plan: targetPlan, amount, status: "pending",
      createdAt: new Date().toISOString(), reviewedAt: null, notes: null,
    });
    return res.status(201).json({ success: true, id });
  } catch (err) {
    console.error("[payment-requests]", err.message);
    return res.status(500).json({ message: "حدث خطأ، حاول مجدداً" });
  }
});

app.get("/api/payment-requests/my", async (req, res) => {
  const payload = getUserFromReq(req);
  if (!payload?.userId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.collection("paymentRequests").where("userId", "==", payload.userId).get();
    const requests = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(requests);
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

// ── business-contact ──────────────────────────────────────────────────────────
app.post("/api/business-contact", async (req, res) => {
  try {
    const { name, email, company, teamSize, message, receiptImage, plan, amount } = req.body || {};
    if (!receiptImage) return res.status(400).json({ message: "صورة الحوالة مطلوبة" });
    const payload = getUserFromReq(req);
    const userId = payload?.userId || null;
    const id = `biz-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const db = getDb();
    await db.collection("businessContacts").doc(id).set({
      userId, name: name || "—", email: email || "—", company: company || "business",
      teamSize: teamSize || null, message: message || null, receiptImage,
      plan: plan || "business", amount: amount || 15, status: "pending",
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("[business-contact]", err.message);
    return res.status(500).json({ message: "حدث خطأ، حاول مجدداً" });
  }
});

// ── payment-webhook ───────────────────────────────────────────────────────────
app.post("/api/payment-webhook", async (req, res) => {
  const settings = await getN8nSettings();
  const webhookUrl = settings.N8N_PAYMENT_WEBHOOK_URL;
  if (!webhookUrl) return res.json({ success: false });
  try {
    const { receiptImage, fileName = "receipt.jpg", fileType = "image/jpeg", ...rest } = req.body || {};
    if (receiptImage) {
      const base64Data = receiptImage.replace(/^data:[^;]+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");
      try {
        const { default: FormDataNode } = await import("form-data");
        const form = new FormDataNode();
        form.append("data", buffer, { filename: fileName, contentType: fileType });
        form.append("fileName", fileName);
        form.append("fileType", fileType);
        Object.entries(rest).forEach(([k, v]) => form.append(k, String(v)));
        await fetch(webhookUrl, { method: "POST", headers: form.getHeaders(), body: form.getBuffer() });
      } catch {
        await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...rest, fileName, fileType, receiptImage }) });
      }
    } else {
      await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(req.body) });
    }
    return res.json({ success: true });
  } catch (err) {
    console.error("[payment-webhook]", err.message);
    return res.json({ success: false, error: err.message });
  }
});

// ── ai/rewrite ────────────────────────────────────────────────────────────────
app.post("/api/ai/rewrite", async (req, res) => {
  const { text, action, language } = req.body || {};
  if (!text || !action) return res.status(400).json({ message: "text and action are required" });
  const settings = await getN8nSettings();
  const webhookUrl = settings.N8N_AI_WEBHOOK_URL;
  if (!webhookUrl) return res.status(503).json({ message: "AI service not configured" });
  try {
    const response = await fetch(webhookUrl, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, action, language }),
    });
    const raw = await response.text();
    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = { output: raw }; }
    const result =
      parsed?.result || parsed?.output || parsed?.text || parsed?.message ||
      (Array.isArray(parsed) && (parsed[0]?.result || parsed[0]?.output)) ||
      (typeof parsed === "string" ? parsed : null);
    if (result) return res.json({ result });
    return res.status(503).json({ message: "No result from AI" });
  } catch {
    return res.status(503).json({ message: "AI service error" });
  }
});

// ── chat ──────────────────────────────────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const settings = await getN8nSettings();
  const CHAT_WEBHOOK = settings.N8N_CHAT_WEBHOOK_URL;
  if (!CHAT_WEBHOOK) return res.status(503).json({ reply: "" });
  try {
    const { message, language, sessionId } = req.body || {};
    const response = await fetch(CHAT_WEBHOOK, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatInput: message, message, input: message, language: language || "ar", sessionId: sessionId || "default-session" }),
    });
    const raw = await response.text();
    let parsed = null;
    try { parsed = JSON.parse(raw); } catch { parsed = { output: raw }; }
    const reply =
      parsed?.output || parsed?.reply || parsed?.text || parsed?.response || parsed?.answer ||
      parsed?.chatOutput || parsed?.message ||
      (Array.isArray(parsed) && (parsed[0]?.output || parsed[0]?.reply || parsed[0]?.text || parsed[0]?.message)) ||
      (typeof parsed === "string" ? parsed : null) || "";
    return res.json({ reply });
  } catch (err) {
    console.error("Chat proxy error:", err);
    return res.status(500).json({ reply: "" });
  }
});

// ── admin/login ───────────────────────────────────────────────────────────────
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ message: "اسم المستخدم وكلمة المرور مطلوبان" });
    const db = getDb();
    const snap = await db.collection("adminConfig").where("username", "==", username).limit(1).get();
    if (snap.empty) return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    const doc = snap.docs[0];
    const admin = doc.data();
    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });
    setAdminCookie(res, doc.id, admin.username);
    return res.json({ username: admin.username });
  } catch (err) {
    console.error("[admin/login]", err.message);
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

// ── admin/logout ──────────────────────────────────────────────────────────────
app.post("/api/admin/logout", (req, res) => {
  clearAdminCookie(res);
  return res.json({ message: "تم تسجيل الخروج" });
});

// ── admin/me ──────────────────────────────────────────────────────────────────
app.get("/api/admin/me", (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  return res.json({ username: admin.adminUsername });
});

// ── admin/password ────────────────────────────────────────────────────────────
app.patch("/api/admin/password", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ message: "جميع الحقول مطلوبة" });
  if (newPassword.length < 6) return res.status(400).json({ message: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" });
  try {
    const db = getDb();
    const snap = await db.collection("adminConfig").doc(admin.adminId).get();
    if (!snap.exists) return res.status(404).json({ message: "المستخدم غير موجود" });
    const valid = await bcrypt.compare(currentPassword, snap.data().passwordHash);
    if (!valid) return res.status(401).json({ message: "كلمة المرور الحالية غير صحيحة" });
    const newHash = await bcrypt.hash(newPassword, 12);
    await db.collection("adminConfig").doc(admin.adminId).update({ passwordHash: newHash, updatedAt: new Date().toISOString() });
    return res.json({ message: "تم تغيير كلمة المرور بنجاح" });
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

// ── admin/stats ───────────────────────────────────────────────────────────────
app.get("/api/admin/stats", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const [usersSnap, cvsSnap, pendingSnap, approvedSnap, bizSnap] = await Promise.all([
      db.collection("users").get(), db.collection("cvs").get(),
      db.collection("paymentRequests").where("status", "==", "pending").get(),
      db.collection("paymentRequests").where("status", "==", "approved").get(),
      db.collection("businessContacts").get(),
    ]);
    const downloadedUserIds = new Set();
    let totalDownloads = 0;
    cvsSnap.docs.forEach(doc => {
      const data = doc.data();
      if ((data.downloadCount || 0) > 0) {
        downloadedUserIds.add(data.userId);
        totalDownloads += data.downloadCount;
      }
    });
    return res.json({
      users: usersSnap.size, cvs: cvsSnap.size,
      pendingPayments: pendingSnap.size, approvedPayments: approvedSnap.size,
      businessContacts: bizSnap.size, usersWithDownloads: downloadedUserIds.size, totalDownloads,
    });
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

// ── admin/cvs ─────────────────────────────────────────────────────────────────
app.get("/api/admin/cvs", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const cvsSnap = await db.collection("cvs").get();
    const cvs = cvsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const userIds = [...new Set(cvs.map(cv => cv.userId).filter(Boolean))];
    const userMap = {};
    for (let i = 0; i < userIds.length; i += 30) {
      const chunk = userIds.slice(i, i + 30);
      const usersSnap = await db.collection("users").where("__name__", "in", chunk).get();
      usersSnap.docs.forEach(d => { userMap[d.id] = d.data(); });
    }
    const result = cvs
      .map(cv => ({
        id: cv.id, name: cv.name, template: cv.template, atsScore: cv.atsScore,
        downloadCount: cv.downloadCount || 0, lastModified: cv.lastModified, userId: cv.userId,
        userEmail: userMap[cv.userId]?.email || null,
        userFirstName: userMap[cv.userId]?.firstName || null,
        userLastName: userMap[cv.userId]?.lastName || null,
      }))
      .sort((a, b) => new Date(b.lastModified || 0) - new Date(a.lastModified || 0));
    return res.json(result);
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

// ── admin/users ───────────────────────────────────────────────────────────────
app.get("/api/admin/users", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.collection("users").get();
    const users = snap.docs
      .map(doc => {
        const d = doc.data();
        return { id: doc.id, email: d.email, firstName: d.firstName || null, lastName: d.lastName || null, createdAt: d.createdAt, plan: d.plan || "free", cvCount: d.cvCount || 0 };
      })
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return res.json(users);
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

app.delete("/api/admin/users/:id", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const id = req.params.id;
    const [cvsSnap, paysSnap] = await Promise.all([
      db.collection("cvs").where("userId", "==", id).get(),
      db.collection("paymentRequests").where("userId", "==", id).get(),
    ]);
    await Promise.all([
      ...cvsSnap.docs.map(d => d.ref.delete()),
      ...paysSnap.docs.map(d => d.ref.delete()),
      db.collection("users").doc(id).delete(),
    ]);
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

// ── admin/navbar ──────────────────────────────────────────────────────────────
const NAVBAR_ALLOWED_KEYS = ["home_ar","home_en","templates_ar","templates_en","pricing_ar","pricing_en","about_ar","about_en"];
app.get("/api/admin/navbar", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.doc("appConfig/navbar").get();
    return res.json(snap.exists ? snap.data() : {});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
app.patch("/api/admin/navbar", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const updates = req.body || {};
    const filtered = {};
    for (const key of NAVBAR_ALLOWED_KEYS) { if (key in updates) filtered[key] = String(updates[key]); }
    if (!Object.keys(filtered).length) return res.status(400).json({ message: "لا توجد بيانات صالحة" });
    const db = getDb();
    await db.doc("appConfig/navbar").set(filtered, { merge: true });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── admin/pricing ─────────────────────────────────────────────────────────────
const PRICING_ALLOWED_KEYS = ["pro_price","business_price","free_features","pro_features","business_features"];
app.get("/api/admin/pricing", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.doc("appConfig/pricing").get();
    return res.json(snap.exists ? snap.data() : {});
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
app.patch("/api/admin/pricing", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const updates = req.body || {};
    const filtered = {};
    for (const key of PRICING_ALLOWED_KEYS) { if (key in updates) filtered[key] = updates[key]; }
    if (!Object.keys(filtered).length) return res.status(400).json({ message: "لا توجد بيانات صالحة" });
    const db = getDb();
    await db.doc("appConfig/pricing").set(filtered, { merge: true });
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── admin/settings ────────────────────────────────────────────────────────────
app.get("/api/admin/settings", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.doc("appConfig/n8n").get();
    const stored = snap.exists ? snap.data() : {};
    const defaults = {
      N8N_AI_WEBHOOK_URL: process.env.N8N_AI_WEBHOOK_URL || "",
      N8N_CHAT_WEBHOOK_URL: process.env.N8N_CHAT_WEBHOOK_URL || "",
      N8N_PAYMENT_WEBHOOK_URL: process.env.N8N_PAYMENT_WEBHOOK_URL || "",
    };
    return res.json({ ...defaults, ...stored });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
app.patch("/api/admin/settings", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const { key, value } = req.body || {};
    const allowed = ["N8N_AI_WEBHOOK_URL", "N8N_CHAT_WEBHOOK_URL", "N8N_PAYMENT_WEBHOOK_URL"];
    if (!key || !allowed.includes(key)) return res.status(400).json({ message: "مفتاح غير مسموح به" });
    const db = getDb();
    await db.doc("appConfig/n8n").set({ [key]: value ?? "" }, { merge: true });
    invalidateCache();
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// ── admin/payment-requests ────────────────────────────────────────────────────
app.get("/api/admin/payment-requests", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.collection("paymentRequests").get();
    const requests = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const userIds = [...new Set(requests.map(r => r.userId).filter(Boolean))];
    const userMap = {};
    for (let i = 0; i < userIds.length; i += 30) {
      const chunk = userIds.slice(i, i + 30);
      const usersSnap = await db.collection("users").where("__name__", "in", chunk).get();
      usersSnap.docs.forEach(d => { userMap[d.id] = d.data(); });
    }
    const result = requests
      .map(r => ({ ...r, userEmail: userMap[r.userId]?.email || null, userFirstName: userMap[r.userId]?.firstName || null, userLastName: userMap[r.userId]?.lastName || null }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(result);
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

app.patch("/api/admin/payment-requests/:id", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  const { status, notes } = req.body || {};
  if (!["approved", "rejected", "pending"].includes(status)) return res.status(400).json({ message: "حالة غير صحيحة" });
  try {
    const db = getDb();
    const ref = db.collection("paymentRequests").doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: "الطلب غير موجود" });
    const now = new Date().toISOString();
    await ref.update({ status, notes: notes || null, reviewedAt: now });
    const data = snap.data();
    if (status === "approved" && data.userId) {
      const approvedPlan = data.plan === "business" ? "business" : "pro";
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
      const [userSnap, cvsSnap] = await Promise.all([
        db.collection("users").doc(data.userId).get(),
        db.collection("cvs").where("userId", "==", data.userId).get(),
      ]);
      const userData = userSnap.data() || {};
      const actualCvCount = cvsSnap.size;
      const storedLimit = typeof userData.cvLimit === "number" ? userData.cvLimit : 0;
      const baseline = Math.max(storedLimit, actualCvCount);
      const newCvLimit = approvedPlan === "business" ? null : baseline + 2;
      await db.collection("users").doc(data.userId).update({ plan: approvedPlan, planExpiresAt: expiresAt.toISOString(), updatedAt: now, cvLimit: newCvLimit });
    }
    if (status === "rejected" && data.userId) {
      await db.collection("users").doc(data.userId).update({ plan: "free", planExpiresAt: null, updatedAt: now });
    }
    return res.json({ id: req.params.id, ...data, status, notes: notes || null, reviewedAt: now });
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

// ── admin/business-contacts ───────────────────────────────────────────────────
app.get("/api/admin/business-contacts", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  try {
    const db = getDb();
    const snap = await db.collection("businessContacts").get();
    const contacts = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(contacts);
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

app.patch("/api/admin/business-contacts/:id", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  const { status } = req.body || {};
  if (!["approved", "rejected", "pending"].includes(status)) return res.status(400).json({ message: "حالة غير صحيحة" });
  try {
    const db = getDb();
    const ref = db.collection("businessContacts").doc(req.params.id);
    const snap = await ref.get();
    if (!snap.exists) return res.status(404).json({ message: "الطلب غير موجود" });
    await ref.update({ status });
    const data = snap.data();
    const now = new Date().toISOString();
    if (status === "approved" && data.userId) {
      const expires = new Date();
      expires.setDate(expires.getDate() + 30);
      await db.collection("users").doc(data.userId).update({ plan: "business", planExpiresAt: expires.toISOString(), updatedAt: now });
    }
    if (status === "rejected" && data.userId) {
      await db.collection("users").doc(data.userId).update({ plan: "free", planExpiresAt: null, updatedAt: now });
    }
    return res.json({ id: req.params.id, ...data, status });
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

// ── pdf/ats ───────────────────────────────────────────────────────────────────
// Pixel-perfect PDF via Puppeteer + React SSR (same as api/pdf/ats.js on Replit).
// Uses @sparticuz/chromium-min for the Chromium binary on Vercel serverless.
app.post("/api/pdf/ats", async (req, res) => {
  console.log("[PDF] handler reached — method:", req.method);
  try {
    const { buildAtsHtmlFromReact, buildHtmlFromRendered } = await import("./_lib/atsReactRenderer.js");
    const { generatePdfFromHtml } = await import("./_lib/puppeteerPdf.js");
    const { cvData, renderedHtml, options = {} } = req.body || {};
    const { templateId, isRTL, pageBreaks = [], totalHeight = 1122 } = options;

    console.log("[PDF] templateId  :", templateId);
    console.log("[PDF] isRTL       :", isRTL);
    console.log("[PDF] pageBreaks  :", pageBreaks.length);
    console.log("[PDF] totalHeight :", totalHeight);

    let html;
    if (cvData) {
      console.log("[PDF] source: SSR primary — template:", templateId);
      html = await buildAtsHtmlFromReact(cvData, options);
    } else if (renderedHtml) {
      console.log("[PDF] source: browser-rendered HTML fallback");
      html = buildHtmlFromRendered(renderedHtml, { isRTL, pageBreaks, totalHeight });
    } else {
      return res.status(400).json({ message: "cvData or renderedHtml is required" });
    }

    const pdf = await generatePdfFromHtml(html, {
      totalHeight,
      pageBreakCount: pageBreaks.length,
    });

    console.log("[PDF] generated — size (bytes):", pdf.length);

    const name = cvData?.personalInfo?.fullName
      ? `${cvData.personalInfo.fullName} - CV`
      : "CV";
    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(name)}.pdf"`);
    res.setHeader("Content-Length",       pdf.length);
    res.setHeader("Cache-Control",        "no-store");
    res.setHeader("X-PDF-Source",         cvData ? "ssr-puppeteer" : "browser-rendered");
    return res.status(200).end(Buffer.from(pdf));
  } catch (err) {
    console.error("[PDF] ERROR:", err.message, err.stack?.slice(0, 800));
    return res.status(500).json({ message: err.message || "PDF generation failed" });
  }
});

// ── admin/templates ───────────────────────────────────────────────────────────
app.patch("/api/admin/templates/:id", async (req, res) => {
  const admin = getAdminFromReq(req);
  if (!admin?.adminId) return res.status(401).json({ message: "غير مصادق" });
  const { is_free } = req.body || {};
  if (typeof is_free !== "boolean") return res.status(400).json({ message: "قيمة is_free يجب أن تكون boolean" });
  try {
    const db = getDb();
    await db.collection("templateConfig").doc(req.params.id).set(
      { isFree: is_free, updatedAt: new Date().toISOString() },
      { merge: true }
    );
    return res.json({ templateId: req.params.id, isFree: is_free });
  } catch {
    return res.status(500).json({ message: "حدث خطأ" });
  }
});

export default app;
