import { getUserFromReq } from "../_lib/token.js";
import { getDb } from "../_lib/firebase.js";

const cooldowns = new Map();

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
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
    const existingSnap = await db
      .collection("paymentRequests")
      .where("userId", "==", uid)
      .where("status", "==", "pending")
      .get();
    if (!existingSnap.empty) {
      return res.status(400).json({ message: "لديك طلب ترقية قيد المراجعة بالفعل" });
    }

    const id = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    await db.collection("paymentRequests").doc(id).set({
      userId: uid,
      receiptImage,
      plan: targetPlan,
      amount,
      status: "pending",
      createdAt: new Date().toISOString(),
      reviewedAt: null,
      notes: null,
    });
    return res.status(201).json({ success: true, id });
  } catch (err) {
    console.error("[payment-requests]", err.message);
    return res.status(500).json({ message: "حدث خطأ، حاول مجدداً" });
  }
}
