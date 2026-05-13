import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BusinessContactPage = () => {
  const { isRTL, currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    company: '',
    teamSize: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/business-contact', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'حدث خطأ'); return; }
      setDone(true);
    } catch {
      setError('تعذّر الإرسال، تحقق من اتصالك');
    } finally {
      setLoading(false);
    }
  };

  /* ── Success ── */
  if (done) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir="rtl">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">تم استلام طلبك!</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          شكراً لاهتمامك بخطة الأعمال. سيتواصل معك فريقنا خلال 24 ساعة على البريد الإلكتروني المُدخل.
        </p>
        <button
          onClick={() => navigate('/pricing')}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)' }}
        >
          العودة للأسعار
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4" dir="rtl">
      <div className="max-w-lg mx-auto">

        {/* Back */}
        <button
          onClick={() => navigate('/pricing')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          العودة للأسعار
        </button>

        {/* Header card */}
        <div
          className="rounded-3xl p-6 mb-6 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#134e4a 0%,#0f766e 60%,#14b8a6 100%)' }}
        >
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              🏢 خطة الأعمال
            </span>
            <h1 className="text-2xl font-bold mb-1">تواصل مع فريقنا</h1>
            <p className="text-white/70 text-sm">للشركات والفرق التي تحتاج إلى حلول متكاملة</p>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-white/70 text-lg">$</span>
              <span className="text-5xl font-extrabold leading-none">15</span>
              <span className="text-white/60 text-sm mb-1">/ شهرياً</span>
            </div>
          </div>
        </div>

        {/* What you get */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ما تحصل عليه
          </h2>
          <div className="grid grid-cols-1 gap-2.5">
            {[
              'سير ذاتية غير محدودة لجميع أعضاء الفريق',
              'جميع القوالب بما فيها القوالب الحصرية',
              'تصدير PDF عالي الجودة',
              'دعم كامل للغة العربية والإنجليزية',
              'ذكاء اصطناعي متقدم لجميع الأعضاء',
              'رسائل تغطية غير محدودة',
              'دعم فني متخصص',
            ].map((f) => (
              <div key={f} className="flex items-start gap-3">
                <svg className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-slate-700">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-5">
          <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            بيانات التواصل
          </h2>

          <div className="flex flex-col gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                الاسم الكامل <span className="text-red-400">*</span>
              </label>
              <input
                value={form.name}
                onChange={set('name')}
                placeholder="أحمد محمد"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-300"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                البريد الإلكتروني <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="ahmed@company.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-300"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                اسم الشركة / المؤسسة <span className="text-red-400">*</span>
              </label>
              <input
                value={form.company}
                onChange={set('company')}
                placeholder="شركة النجاح للتوظيف"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-300"
              />
            </div>

            {/* Team size */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                حجم الفريق
              </label>
              <select
                value={form.teamSize}
                onChange={set('teamSize')}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
              >
                <option value="">اختر...</option>
                <option value="1-5">1 – 5 أشخاص</option>
                <option value="6-20">6 – 20 شخصاً</option>
                <option value="21-50">21 – 50 شخصاً</option>
                <option value="50+">أكثر من 50 شخصاً</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                رسالتك (اختياري)
              </label>
              <textarea
                value={form.message}
                onChange={set('message')}
                rows={4}
                placeholder="أخبرنا عن احتياجات شركتك..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-300 resize-none"
              />
            </div>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={onSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg"
          style={{ background: 'linear-gradient(135deg,#0f766e,#14b8a6)' }}
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              جاري الإرسال...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              إرسال الطلب
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
          سيتواصل معك فريقنا خلال 24 ساعة على بريدك الإلكتروني
        </p>
      </div>
    </div>
  );
};

export default BusinessContactPage;
