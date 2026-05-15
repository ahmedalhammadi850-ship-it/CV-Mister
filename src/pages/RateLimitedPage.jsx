const RateLimitedPage = ({ remainingMs }) => {
  const seconds = Math.ceil(remainingMs / 1000);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' }}
    >
      <div className="w-full max-w-md text-center space-y-6">
        <div
          className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto"
          style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
        >
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white">تم تعليق وصولك مؤقتاً</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            لقد قمت بتحديث الصفحة أكثر من 10 مرات في دقيقة واحدة.
            <br />
            يرجى الانتظار قبل المتابعة.
          </p>
        </div>

        <div
          className="rounded-3xl p-6 space-y-3"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <p className="text-white/50 text-xs uppercase tracking-widest font-semibold">الوقت المتبقي</p>
          <div className="text-6xl font-bold text-white tabular-nums">
            {seconds}
          </div>
          <p className="text-white/40 text-sm">ثانية</p>

          <div className="w-full bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${(seconds / 60) * 100}%`,
                background: 'linear-gradient(90deg, #4f46e5, #a855f7)',
              }}
            />
          </div>
        </div>

        <p className="text-white/30 text-xs">
          سيتم إلغاء الحجب تلقائياً عند انتهاء الوقت
        </p>
      </div>
    </div>
  );
};

export default RateLimitedPage;
