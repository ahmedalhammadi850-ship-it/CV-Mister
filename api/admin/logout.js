import { clearAdminCookie } from "../_lib/token.js";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  clearAdminCookie(res);
  return res.json({ message: "تم تسجيل الخروج" });
}
