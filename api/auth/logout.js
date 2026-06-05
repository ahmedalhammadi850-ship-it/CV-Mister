import { clearUserCookie } from "../_lib/token.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });
  clearUserCookie(res);
  return res.json({ message: "تم تسجيل الخروج" });
}
