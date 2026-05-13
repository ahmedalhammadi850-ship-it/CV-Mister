import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ACCOUNT = '00154578';

const Step = ({ n, label, isRTL }) => (
  <div className="flex items-start gap-3">
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
      style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
      {n}
    </div>
    <p className="text-sm text-slate-700 leading-relaxed pt-1">{label}</p>
  </div>
);

const UpgradePage = () => {
  const { isRTL, currentUser } = useAuth();
  const navigate = useNavigate();

  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputRef   = useRef();
  const timerRef   = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startCooldown = (seconds = 30) => {
    setCooldown(seconds);
    timerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  /* redirect if not logged in */
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">يجب تسجيل الدخول أولاً</p>
          <Link to="/login" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  const copyAccount = () => {
    navigator.clipboard.writeText(ACCOUNT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pickFile = (f) => {
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { setError('حجم الملف يتجاوز 10MB'); return; }
    if (!['image/jpeg','image/jpg','image/png','image/webp'].includes(f.type)) {
      setError('يرجى رفع صورة PNG, JPG, أو WEBP'); return;
    }
    setError('');
    setFile(f);
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target.result);
    reader.readAsDataURL(f);
  };

  const onDrop = useCallback(e => {
    e.preventDefault(); setDragging(false);
    pickFile(e.dataTransfer.files[0]);
  }, []);

  const onSubmit = async () => {
    if (!file) { setError('يرجى رفع صورة الحوالة'); return; }
    if (cooldown > 0) { setError(`يرجى الانتظار ${cooldown} ثانية قبل إعادة الإرسال`); return; }
    setLoading(true); setError('');
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target.result;
        const res = await fetch('/api/payment-requests', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiptImage: base64 }),
        });
        const data = await res.json();
        if (!res.ok) {
          const remaining = data.remaining || 30;
          if (res.status === 429) { startCooldown(remaining); }
          setError(data.message || 'حدث خطأ');
          setLoading(false);
          return;
        }
        startCooldown(30);
        setDone(true);
      };
      reader.readAsDataURL(file);
    } catch {
      setError('تعذّر الإرسال، تحقق من اتصالك'); setLoading(false);
    }
  };

  /* ── Success state ── */
  if (done) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">تم استلام طلبك!</h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          سنراجع إيصال الحوالة خلال دقائق ونُفعّل اشتراكك فور التأكيد.
          سيصلك إشعار عند تفعيل الحساب.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-3.5 rounded-2xl text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
        >
          العودة إلى لوحة التحكم
        </button>
      </div>
    </div>
  );

  /* ── Main form ── */
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
        <div className="rounded-3xl p-6 mb-5 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 60%,#c026d3 100%)' }}>
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              ⭐ الأكثر شيوعاً
            </span>
            <h1 className="text-2xl font-bold mb-1">ترقية إلى Pro</h1>
            <p className="text-white/70 text-sm">جميع القوالب + ميزات متقدمة</p>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-white/70 text-lg">$</span>
              <span className="text-5xl font-extrabold leading-none">3</span>
              <span className="text-white/60 text-sm mb-1">/ شهرياً</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-5">
          <h2 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            خطوات الترقية
          </h2>
          <div className="flex flex-col gap-4">
            <Step n="1" label="قم بتحويل المبلغ عبر الحوالة البنكية أو المحفظة الإلكترونية" />
            <Step n="2" label="التقط صورة واضحة لإيصال التحويل" />
            <Step n="3" label="ارفع الصورة أدناه وسنراجعها خلال دقائق" />
          </div>
        </div>

        {/* Bank info */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            بيانات التحويل
          </h2>
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <div>
              <p className="text-xs text-slate-400 mb-0.5">البنك</p>
              <p className="font-semibold text-slate-900 text-sm">بنك التضامن — Tadhamon Bank</p>
            </div>
            <div className="h-px bg-slate-200" />
            <div>
              <p className="text-xs text-slate-400 mb-0.5">اسم المستفيد</p>
              <p className="font-semibold text-slate-900 text-sm">أحمد عبدالله عقلان الحمادي</p>
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">رقم الحساب</p>
                <p className="font-bold text-slate-900 text-lg tracking-widest">{ACCOUNT}</p>
              </div>
              <button
                onClick={copyAccount}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    تم النسخ
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    نسخ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            رفع صورة الحوالة
          </h2>

          {preview ? (
            /* Preview */
            <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-200">
              <img src={preview} alt="receipt" className="w-full max-h-64 object-contain bg-slate-100" />
              <button
                onClick={() => { setFile(null); setPreview(null); }}
                className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                جاهز للإرسال
              </div>
            </div>
          ) : (
            /* Drop zone */
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all ${
                dragging
                  ? 'border-indigo-400 bg-indigo-50'
                  : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-semibold text-slate-700 text-sm">اسحب صورة الحوالة هنا</p>
                <p className="text-slate-400 text-xs mt-1">أو اضغط لاختيار ملف — PNG, JPG, WEBP (حتى 10MB)</p>
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={e => pickFile(e.target.files[0])}
          />
        </div>

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
          disabled={loading || !file || cooldown > 0}
          className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              جاري الإرسال...
            </>
          ) : cooldown > 0 ? (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              انتظر {cooldown} ثانية
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              إرسال طلب الترقية
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
          سيتم مراجعة طلبك خلال دقائق وتفعيل اشتراكك فور التأكيد
        </p>
      </div>
    </div>
  );
};

export default UpgradePage;
