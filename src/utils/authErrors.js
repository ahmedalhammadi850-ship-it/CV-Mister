export function getAuthError(code, isRTL) {
  const errors = {
    'auth/user-not-found':          { en: 'No account found with this email.',       ar: 'لا يوجد حساب بهذا البريد الإلكتروني.' },
    'auth/wrong-password':          { en: 'Incorrect password. Please try again.',    ar: 'كلمة المرور غير صحيحة. حاول مجدداً.' },
    'auth/invalid-credential':      { en: 'Invalid email or password.',               ar: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' },
    'auth/email-already-in-use':    { en: 'This email is already registered.',        ar: 'هذا البريد الإلكتروني مسجّل مسبقاً.' },
    'auth/weak-password':           { en: 'Password must be at least 6 characters.',  ar: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.' },
    'auth/invalid-email':           { en: 'Please enter a valid email address.',      ar: 'أدخل بريداً إلكترونياً صحيحاً.' },
    'auth/too-many-requests':       { en: 'Too many attempts. Please try again later.', ar: 'محاولات كثيرة. يرجى المحاولة لاحقاً.' },
    'auth/network-request-failed':  { en: 'Network error. Check your connection.',   ar: 'خطأ في الشبكة. تحقق من اتصالك.' },
    'auth/user-disabled':           { en: 'This account has been disabled.',          ar: 'تم تعطيل هذا الحساب.' },
    'auth/popup-closed-by-user':    { en: 'Sign-in popup was closed.',               ar: 'تم إغلاق نافذة تسجيل الدخول.' },
  };
  const found = errors[code];
  if (found) return isRTL ? found.ar : found.en;
  return isRTL ? 'حدث خطأ. يرجى المحاولة مجدداً.' : 'Something went wrong. Please try again.';
}
