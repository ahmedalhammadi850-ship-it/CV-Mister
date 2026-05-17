import { getDb } from "./_lib/firebase.js";

const DEFAULTS = {
  home_ar:      'الرئيسية',
  home_en:      'Home',
  templates_ar: 'القوالب',
  templates_en: 'Templates',
  pricing_ar:   'الأسعار',
  pricing_en:   'Pricing',
  about_ar:     'من نحن',
  about_en:     'About',
};

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const db = getDb();
    const snap = await db.doc('appConfig/navbar').get();
    const stored = snap.exists ? snap.data() : {};
    return res.json({ ...DEFAULTS, ...stored });
  } catch {
    return res.json(DEFAULTS);
  }
}
