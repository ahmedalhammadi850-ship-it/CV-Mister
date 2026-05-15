import bcrypt from "bcryptjs";
import { query } from "../_lib/db.js";
import { setAdminCookie } from "../_lib/token.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ message: "اسم المستخدم وكلمة المرور مطلوبان" });

    const result = await query("SELECT * FROM admin_config WHERE username=$1 LIMIT 1", [username]);
    const admin = result.rows[0];
    if (!admin) return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ message: "بيانات الدخول غير صحيحة" });

    setAdminCookie(res, admin.id, admin.username);
    return res.json({ username: admin.username });
  } catch (err) {
    console.error("[admin/login]", err.message);
    return res.status(500).json({ message: "حدث خطأ" });
  }
}
