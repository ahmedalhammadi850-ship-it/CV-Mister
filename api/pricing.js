import { getDb } from "./_lib/firebase.js";

const DEFAULTS = {
  pro_price: 3,
  pro_name: "احترافي",
  pro_name_en: "Professional",
  pro_desc: "الخيار المثالي للباحثين عن عمل بجدية",
  pro_desc_en: "Ideal for serious job seekers",
  business_price: 15,
  business_name: "أعمال",
  business_name_en: "Business",
  business_desc: "للشركات والفرق التي تحتاج إلى حلول متكاملة",
  business_desc_en: "For companies and teams needing complete solutions",
  free_name: "مجاني",
  free_name_en: "Free",
  free_desc: "مثالي للبدء وتجربة المنصة",
  free_desc_en: "Perfect to get started and try the platform",
  payment_account: "00154578",
  payment_bank: "بنك التضامن — Tadhamon Bank",
  payment_beneficiary: "أحمد عبدالله عقلان الحمادي",
};

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  try {
    const db = getDb();
    const snap = await db.doc("appConfig/pricing").get();
    const stored = snap.exists ? snap.data() : {};
    return res.json({ ...DEFAULTS, ...stored });
  } catch {
    return res.json(DEFAULTS);
  }
}
