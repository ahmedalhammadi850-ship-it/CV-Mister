import { db } from '../firebase';
import {
  doc, getDoc, setDoc, updateDoc,
  collection, query, where, getDocs, deleteDoc,
} from 'firebase/firestore';

const FREE_LIMIT = 1;
const PRO_LIMIT  = 2;

// ─── User ─────────────────────────────────────────────────────
export async function getOrCreateUser(uid, email) {
  const userRef = doc(db, 'users', uid);
  const snap    = await getDoc(userRef);

  if (!snap.exists()) {
    const userData = {
      email:           email.toLowerCase(),
      firstName:       null,
      lastName:        null,
      profileImageUrl: null,
      plan:            'free',
      cvCount:         0,
      planExpiresAt:   null,
      firebaseUid:     uid,
      createdAt:       new Date().toISOString(),
      updatedAt:       new Date().toISOString(),
    };
    await setDoc(userRef, userData);
    return { id: uid, ...userData };
  }

  const userData = snap.data();
  if (
    (userData.plan === 'business' || userData.plan === 'pro') &&
    userData.planExpiresAt &&
    new Date() > new Date(userData.planExpiresAt)
  ) {
    const update = { plan: 'free', planExpiresAt: null, updatedAt: new Date().toISOString() };
    await updateDoc(userRef, update);
    userData.plan = 'free';
    userData.planExpiresAt = null;
  }

  return { id: uid, ...userData };
}

export async function registerUserProfile(uid, email, firstName, lastName) {
  const userRef = doc(db, 'users', uid);
  const snap    = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      email:           email.toLowerCase(),
      firstName:       firstName || null,
      lastName:        lastName  || null,
      profileImageUrl: null,
      plan:            'free',
      cvCount:         0,
      planExpiresAt:   null,
      firebaseUid:     uid,
      createdAt:       new Date().toISOString(),
      updatedAt:       new Date().toISOString(),
    });
  } else {
    await updateDoc(userRef, {
      firstName: firstName || snap.data().firstName || null,
      lastName:  lastName  || snap.data().lastName  || null,
      updatedAt: new Date().toISOString(),
    });
  }
}

export async function getUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return { id: uid, ...snap.data() };
}

// ─── CVs ──────────────────────────────────────────────────────
export async function getUserCVs(uid) {
  const q    = query(collection(db, 'cvs'), where('userId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => {
      const ta = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const tb = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      return tb - ta;
    });
}

export async function saveUserCV(uid, cvEntry) {
  const { id, name, cvData, template, theme, atsScore, sectionOrder, visibleSections, visiblePersonalFields, sectionNames } = cvEntry;

  const cvRef  = doc(db, 'cvs', id);
  const cvSnap = await getDoc(cvRef);
  const isNew  = !cvSnap.exists();

  const userSnap = await getDoc(doc(db, 'users', uid));
  const userData = userSnap.data() || {};
  const plan     = userData.plan || 'free';

  if (plan === 'free') {
    const createdAt = userData.createdAt ? new Date(userData.createdAt) : null;
    if (createdAt) {
      const expiry = new Date(createdAt);
      expiry.setMonth(expiry.getMonth() + 1);
      if (new Date() > expiry) {
        return { error: { message: 'انتهت فترة الاستخدام المجاني. قم بالترقية للاستمرار.', freeExpired: true } };
      }
    }
  }

  if (isNew) {
    const proLimit  = userData.cvLimit || PRO_LIMIT;
    const limit     = plan === 'business' ? Infinity : plan === 'pro' ? proLimit : FREE_LIMIT;
    const countSnap = await getDocs(query(collection(db, 'cvs'), where('userId', '==', uid)));
    const count     = countSnap.size;
    if (count >= limit) {
      return {
        error: {
          message:      plan === 'free'
            ? `وصلت للحد المجاني (${FREE_LIMIT} سيرة). قم بالترقية للحصول على المزيد.`
            : `وصلت لحد الخطة المدفوعة (${proLimit} سيرة). قم بتجديد الاشتراك.`,
          limitReached: true,
          plan,
          limit:        isFinite(limit) ? limit : null,
          count,
        },
      };
    }
  }

  const now = new Date().toISOString();
  await setDoc(cvRef, {
    userId:               uid,
    name,
    cvData,
    template,
    theme,
    atsScore,
    sectionOrder:         sectionOrder         || null,
    visibleSections:      visibleSections      || null,
    visiblePersonalFields:visiblePersonalFields|| null,
    sectionNames:         sectionNames         || null,
    lastModified:         now,
    downloadCount:        cvSnap.data()?.downloadCount || 0,
  });

  return { ok: true };
}

export async function deleteUserCV(cvId) {
  await deleteDoc(doc(db, 'cvs', cvId));
}

export async function getUserCV(cvId) {
  const snap = await getDoc(doc(db, 'cvs', cvId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function renameUserCV(cvId, name) {
  await updateDoc(doc(db, 'cvs', cvId), { name, lastModified: new Date().toISOString() });
}

export async function incrementCVDownload(cvId) {
  try {
    const ref  = doc(db, 'cvs', cvId);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { downloadCount: (snap.data().downloadCount || 0) + 1 });
    }
  } catch { /* non-critical */ }
}

// ─── Template Config ───────────────────────────────────────────
const DEFAULT_TEMPLATE_CONFIG = {
  minimal: true, modern: false, classic: false, creative: false,
  executive: false, professional: false, elegant: false, tech: false, arabic: false,
};

export async function getTemplateConfig() {
  try {
    const snap   = await getDocs(collection(db, 'templateConfig'));
    const config = { ...DEFAULT_TEMPLATE_CONFIG };
    snap.docs.forEach(d => {
      config[d.id] = d.data().isFree ?? DEFAULT_TEMPLATE_CONFIG[d.id] ?? false;
    });
    return config;
  } catch {
    return DEFAULT_TEMPLATE_CONFIG;
  }
}

// ─── Pricing ──────────────────────────────────────────────────
export const DEFAULT_PRICING = {
  pro_price:         3,
  pro_name:          'احترافي',
  pro_name_en:       'Professional',
  pro_desc:          'الخيار المثالي للباحثين عن عمل بجدية',
  pro_desc_en:       'Ideal for serious job seekers',
  business_price:    15,
  business_name:     'أعمال',
  business_name_en:  'Business',
  business_desc:     'للشركات والفرق التي تحتاج إلى حلول متكاملة',
  business_desc_en:  'For companies and teams needing complete solutions',
  free_name:         'مجاني',
  free_name_en:      'Free',
  free_desc:         'مثالي للبدء وتجربة المنصة',
  free_desc_en:      'Perfect to get started and try the platform',
  payment_account:   '00154578',
  payment_bank:      'بنك التضامن — Tadhamon Bank',
  payment_beneficiary: 'أحمد عبدالله عقلان الحمادي',
  free_features: [
    { label: 'سيرة ذاتية واحدة',          labelEn: '1 resume',                 included: true  },
    { label: 'قالب أساسي',                labelEn: 'Basic template',           included: true  },
    { label: 'تصدير PDF',                 labelEn: 'PDF export',               included: true  },
    { label: 'دعم اللغة العربية',          labelEn: 'Arabic language support',  included: true  },
    { label: 'اقتراحات الذكاء الاصطناعي', labelEn: 'AI suggestions',           included: false },
    { label: 'رسالة تغطية',               labelEn: 'Cover letter',             included: false },
  ],
  pro_features: [
    { label: '2 سير ذاتية',               labelEn: '2 resumes',                included: true },
    { label: 'جميع القوالب (25+)',          labelEn: 'All templates (25+)',      included: true },
    { label: 'تصدير PDF عالي الجودة',      labelEn: 'High-quality PDF export',  included: true },
    { label: 'دعم العربية والإنجليزية',    labelEn: 'Arabic & English support', included: true },
    { label: 'اقتراحات الذكاء الاصطناعي', labelEn: 'AI suggestions',           included: true },
    { label: 'رسالة تغطية',               labelEn: 'Cover letter',             included: true },
  ],
  business_features: [
    { label: 'سير ذاتية غير محدودة',       labelEn: 'Unlimited resumes',        included: true },
    { label: 'جميع القوالب + حصرية',       labelEn: 'All templates + exclusive',included: true },
    { label: 'تصدير PDF عالي الجودة',      labelEn: 'High-quality PDF export',  included: true },
    { label: 'دعم كامل متعدد اللغات',      labelEn: 'Full multilingual support', included: true },
    { label: 'ذكاء اصطناعي متقدم',         labelEn: 'Advanced AI',              included: true },
    { label: 'رسائل تغطية غير محدودة',     labelEn: 'Unlimited cover letters',  included: true },
  ],
};

export async function getPricing() {
  try {
    const snap   = await getDoc(doc(db, 'appConfig', 'pricing'));
    const stored = snap.exists() ? snap.data() : {};
    return { ...DEFAULT_PRICING, ...stored };
  } catch {
    return DEFAULT_PRICING;
  }
}

// ─── Navbar ───────────────────────────────────────────────────
const DEFAULT_NAVBAR = {
  home_ar: 'الرئيسية', home_en: 'Home',
  templates_ar: 'القوالب', templates_en: 'Templates',
  pricing_ar: 'الأسعار', pricing_en: 'Pricing',
  about_ar: 'من نحن', about_en: 'About',
};

let _navbarCache = null;
let _navbarFetchedAt = 0;

export async function getNavbar() {
  const now = Date.now();
  if (_navbarCache && now - _navbarFetchedAt < 60000) return _navbarCache;
  try {
    const snap   = await getDoc(doc(db, 'appConfig', 'navbar'));
    const stored = snap.exists() ? snap.data() : {};
    _navbarCache = { ...DEFAULT_NAVBAR, ...stored };
    _navbarFetchedAt = now;
    return _navbarCache;
  } catch {
    return DEFAULT_NAVBAR;
  }
}

// ─── Payment Requests ─────────────────────────────────────────
export async function submitPaymentRequest(uid, { receiptImage, plan }) {
  const targetPlan = plan === 'business' ? 'business' : 'pro';
  const amount     = targetPlan === 'business' ? 15 : 3;

  const q            = query(collection(db, 'paymentRequests'), where('userId', '==', uid), where('status', '==', 'pending'));
  const existingSnap = await getDocs(q);
  if (!existingSnap.empty) {
    throw new Error('لديك طلب ترقية قيد المراجعة بالفعل');
  }

  const id = `pay-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  await setDoc(doc(db, 'paymentRequests', id), {
    userId:     uid,
    receiptImage,
    plan:       targetPlan,
    amount,
    status:     'pending',
    createdAt:  new Date().toISOString(),
    reviewedAt: null,
    notes:      null,
  });
  return { success: true, id };
}

export async function getUserPaymentRequests(uid) {
  const q    = query(collection(db, 'paymentRequests'), where('userId', '==', uid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── Business Contact ─────────────────────────────────────────
export async function submitBusinessContact(uid, data) {
  const { name, email, company, teamSize, message, receiptImage, plan, amount } = data;
  const id = `biz-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  await setDoc(doc(db, 'businessContacts', id), {
    userId:      uid || null,
    name:        name    || '—',
    email:       email   || '—',
    company:     company || 'business',
    teamSize:    teamSize || null,
    message:     message  || null,
    receiptImage,
    plan:        plan   || 'business',
    amount:      amount || 15,
    status:      'pending',
    createdAt:   new Date().toISOString(),
  });
  return { success: true };
}
