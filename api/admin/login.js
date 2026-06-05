import bcrypt from "bcryptjs";
import { getDb } from "../_lib/firebase.js";
import { setAdminCookie } from "../_lib/token.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
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
}
