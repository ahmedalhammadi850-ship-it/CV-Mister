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
  free_features: [
    { label: "سيرة ذاتية واحدة",         labelEn: "1 resume",                   included: true  },
    { label: "قالب أساسي",               labelEn: "Basic template",             included: true  },
    { label: "تصدير PDF",                labelEn: "PDF export",                 included: true  },
    { label: "دعم اللغة العربية",         labelEn: "Arabic language support",    included: true  },
    { label: "اقتراحات الذكاء الاصطناعي",labelEn: "AI suggestions",             included: false },
    { label: "رسالة تغطية",              labelEn: "Cover letter",               included: false },
  ],
  pro_features: [
    { label: "2 سير ذاتية",               labelEn: "2 resumes",                  included: true },
    { label: "جميع القوالب (25+)",         labelEn: "All templates (25+)",        included: true },
    { label: "تصدير PDF عالي الجودة",     labelEn: "High-quality PDF export",    included: true },
    { label: "دعم العربية والإنجليزية",   labelEn: "Arabic & English support",   included: true },
    { label: "اقتراحات الذكاء الاصطناعي",labelEn: "AI suggestions",             included: true },
    { label: "رسالة تغطية",              labelEn: "Cover letter",               included: true },
  ],
  business_features: [
    { label: "سير ذاتية غير محدودة",      labelEn: "Unlimited resumes",          included: true },
    { label: "جميع القوالب + حصرية",      labelEn: "All templates + exclusive",  included: true },
    { label: "تصدير PDF عالي الجودة",     labelEn: "High-quality PDF export",    included: true },
    { label: "دعم كامل متعدد اللغات",     labelEn: "Full multilingual support",  included: true },
    { label: "ذكاء اصطناعي متقدم",        labelEn: "Advanced AI",                included: true },
    { label: "رسائل تغطية غير محدودة",    labelEn: "Unlimited cover letters",    included: true },
  ],
};

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });
  try {
    const db = getDb();
    const snap = await db.doc("appConfig/pricing").get();
    const stored = snap.exists ? snap.data() : {};
    return res.json({ ...DEFAULTS, ...stored });
  } catch {
    return res.json(DEFAULTS);
  }
}
