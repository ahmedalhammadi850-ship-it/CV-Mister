import { getUserFromReq } from "./_lib/token.js";
import { getDb } from "./_lib/firebase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  try {
    const { name, email, company, teamSize, message, receiptImage, plan, amount } = req.body || {};
    if (!receiptImage) return res.status(400).json({ message: "صورة الحوالة مطلوبة" });

    const payload = getUserFromReq(req);
    const userId = payload?.userId || null;
    const id = `biz-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const db = getDb();

    await db.collection("businessContacts").doc(id).set({
      userId,
      name: name || "—",
      email: email || "—",
      company: company || "business",
      teamSize: teamSize || null,
      message: message || null,
      receiptImage,
      plan: plan || "business",
      amount: amount || 15,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("[business-contact]", err.message);
    return res.status(500).json({ message: "حدث خطأ، حاول مجدداً" });
  }
}
