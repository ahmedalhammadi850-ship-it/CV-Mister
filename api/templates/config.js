import { getDb } from "../_lib/firebase.js";

const DEFAULT_CONFIG = {
  minimal: true,
  modern: false,
  classic: false,
  creative: false,
  executive: false,
  professional: false,
  elegant: false,
  tech: false,
  arabic: false,
};

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  try {
    const db = getDb();
    const snap = await db.collection("templateConfig").get();
    const config = { ...DEFAULT_CONFIG };
    snap.docs.forEach(doc => {
      config[doc.id] = doc.data().isFree ?? DEFAULT_CONFIG[doc.id] ?? false;
    });
    return res.json(config);
  } catch (err) {
    return res.json(DEFAULT_CONFIG);
  }
}
