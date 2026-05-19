import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCV } from '../../context/useCV';
import { useAuth } from '../../context/AuthContext';
import EditorPanel from './EditorPanel';
import CustomizePanel from './CustomizePanel';
import LivePreview from './LivePreview';

const OverviewIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ContentIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CustomizeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const PANEL_TABS = [
  { key: 'overview',  enLabel: 'Overview',  arLabel: 'نظرة عامة', Icon: OverviewIcon  },
  { key: 'content',   enLabel: 'Content',   arLabel: 'المحتوى',   Icon: ContentIcon   },
  { key: 'customize', enLabel: 'Customize', arLabel: 'تخصيص',     Icon: CustomizeIcon },
];

const SaveModal = ({ isRTL, defaultName, onSave, onClose }) => {
  const [name, setName] = useState(defaultName);
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-bold text-slate-900 text-lg mb-1">
          {isRTL ? 'حفظ السيرة الذاتية' : 'Save Resume'}
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          {isRTL ? 'اختر اسماً لسيرتك الذاتية' : 'Give your resume a name'}
        </p>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSave(name)}
          autoFocus
          className="input-field py-2.5 text-sm w-full mb-4"
          placeholder={isRTL ? 'مثال: سيرتي الذاتية' : 'e.g. Software Engineer CV'}
        />
        <div className="flex gap-2">
          <button onClick={() => onSave(name)} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors text-sm">
            {isRTL ? 'حفظ' : 'Save'}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors text-sm">
            {isRTL ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
};

const LimitModal = ({ isRTL, plan, onClose, onUpgrade }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)' }}>
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${plan === 'pro' ? 'bg-indigo-100' : 'bg-amber-100'}`}>
        <svg className={`w-8 h-8 ${plan === 'pro' ? 'text-indigo-600' : 'text-amber-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {plan === 'pro'
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          }
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {plan === 'pro'
          ? (isRTL ? 'انتهت سيرك الذاتية' : 'CV Limit Reached')
          : (isRTL ? 'وصلت للحد الأقصى' : 'Limit Reached')}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">
        {plan === 'free'
          ? (isRTL ? 'لقد استخدمت سيرتك الذاتية المجانية. قم بالترقية للحصول على سيرتين (2).' : "You've used your free CV slot. Upgrade to create up to 2 CVs.")
          : (isRTL ? 'لقد وصلت لحد السيرتين الذاتيتين في خطة Pro. جدّد اشتراكك للاستمرار.' : "You've reached the 2-CV limit on your Pro plan. Renew your subscription to continue.")}
      </p>
      <div className="flex flex-col gap-2">
        <button onClick={onUpgrade} className="w-full py-3 rounded-2xl text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
          {plan === 'pro'
            ? (isRTL ? '🔄 تجديد الاشتراك — $3/شهر' : '🔄 Renew Subscription — $3/mo')
            : (isRTL ? '⭐ ترقية الآن — $3/شهر' : '⭐ Upgrade Now — $3/mo')}
        </button>
        <button onClick={onClose} className="w-full py-2.5 rounded-2xl text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors">
          {isRTL ? 'إغلاق' : 'Close'}
        </button>
      </div>
    </div>
  </div>
);

const FreeExpiredModal = ({ isRTL, onClose, onUpgrade }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)' }}>
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-rose-100">
        <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">
        {isRTL ? 'انتهت الفترة المجانية' : 'Free Trial Ended'}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6">
        {isRTL
          ? 'انتهت فترة الشهر المجاني. قم بالترقية إلى Professional للاستمرار في تعديل سيرتك الذاتية.'
          : 'Your free month has ended. Upgrade to Professional to continue editing your resume.'}
      </p>
      <div className="flex flex-col gap-2">
        <button onClick={onUpgrade} className="w-full py-3 rounded-2xl text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}>
          {isRTL ? '⭐ ترقية الآن — $3/شهر' : '⭐ Upgrade Now — $3/mo'}
        </button>
        <button onClick={onClose} className="w-full py-2.5 rounded-2xl text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors">
          {isRTL ? 'إغلاق' : 'Close'}
        </button>
      </div>
    </div>
  </div>
);

const PAGE_H_PX = 1122;

const CVBuilder = () => {
  const { selectedTemplate, cvData, theme, visibleSections, visiblePersonalFields, sectionOrder, saveCurrentCV, currentCVId, currentCVName } = useCV();
  const { isRTL, currentUser } = useAuth();
  const navigate = useNavigate();
  const [mobileTab, setMobileTab] = useState('editor');
  const [panelTab, setPanelTab] = useState('content');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showFreeExpiredModal, setShowFreeExpiredModal] = useState(false);
  const breakDataRef = useRef({ breaks: [], totalHeight: PAGE_H_PX });

  const handleSave = async (name) => {
    const result = await saveCurrentCV(name);
    setShowSaveModal(false);
    if (result?.error?.freeExpired) {
      setShowFreeExpiredModal(true);
      return;
    }
    if (result?.error?.limitReached) {
      setShowLimitModal(true);
      return;
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleSaveClick = () => {
    if (currentCVId) {
      handleSave(currentCVName);
    } else {
      setShowSaveModal(true);
    }
  };

  const handleDownloadPDF = async () => {
    setIsPrinting(true);

    // iOS Safari blocks window.open() after any await, so we must open it
    // synchronously here (directly from the user gesture).
    // Android Chrome supports a.download in async context — no pre-open needed.
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    let mobileWindow = null;
    if (isIOS) {
      mobileWindow = window.open('', '_blank');
      if (mobileWindow) {
        mobileWindow.document.write(
          '<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;color:#555;">' +
          '<p>' + (isRTL ? 'جارٍ إنشاء ملف PDF...' : 'Generating PDF…') + '</p></body></html>'
        );
      }
    }

    try {
      const [{ toPng }, { jsPDF }] = await Promise.all([
        import('html-to-image'),
        import('jspdf'),
      ]);

      await document.fonts.ready;

      const element = breakDataRef.current?.captureEl;
      if (!element) return;

      const PR = 2;
      const A4_W_MM = 210;
      const A4_H_MM = 297;
      const CONTENT_W = 794;

      // ── Font pre-loading ──────────────────────────────────────────────────────
      // Fetch the proxied Google Fonts CSS, then download every font binary and
      // embed it as a base64 data-URI so html-to-image gets pixel-perfect fonts
      // regardless of CORS or network timing.
      let injectedFontStyle = null;
      try {
        const proxyUrl = '/api/font-proxy?url=' + encodeURIComponent(
          'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Merriweather:wght@300;400;700&family=Tajawal:wght@300;400;500;700&family=Cairo:wght@300;400;600;700&family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Scheherazade+New:wght@400;700&display=swap'
        );
        const res = await fetch(proxyUrl);
        if (res.ok) {
          let css = await res.text();

          // Collect every font-file URL referenced in the CSS
          const fontUrlMatches = [...css.matchAll(/url\(([^)]+)\)/g)];
          const uniqueFontUrls = [...new Set(fontUrlMatches.map(m => m[1]))];

          // Fetch every font binary in parallel and convert to base64 data-URI
          const dataUriMap = {};
          await Promise.all(uniqueFontUrls.map(async (url) => {
            try {
              const fontRes = await fetch(url);
              if (!fontRes.ok) return;
              const buffer = await fontRes.arrayBuffer();
              const bytes  = new Uint8Array(buffer);
              let binary   = '';
              const chunk  = 8192;
              for (let i = 0; i < bytes.length; i += chunk) {
                binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
              }
              const ct = fontRes.headers.get('content-type') || 'font/woff2';
              dataUriMap[url] = `data:${ct};base64,${btoa(binary)}`;
            } catch (_) {}
          }));

          // Replace every proxy URL with the embedded data-URI
          for (const [url, dataUri] of Object.entries(dataUriMap)) {
            css = css.split(url).join(dataUri);
          }

          injectedFontStyle = document.createElement('style');
          injectedFontStyle.setAttribute('data-cv-pdf-fonts', '1');
          injectedFontStyle.textContent = css;
          // Inject into <head> so document.styleSheets picks it up for html-to-image
          document.head.appendChild(injectedFontStyle);
        }
      } catch (_) {}

      // Force-load every weight so the browser has them in its font cache
      const FONT_FAMILIES = [
        'Plus Jakarta Sans', 'DM Sans', 'Merriweather',
        'Tajawal', 'Cairo', 'Amiri', 'Noto Naskh Arabic', 'Scheherazade New',
      ];
      const FONT_WEIGHTS = ['300', '400', '500', '600', '700', '800'];
      await Promise.all(
        FONT_FAMILIES.flatMap(family =>
          FONT_WEIGHTS.map(w =>
            document.fonts.load(`${w} 16px "${family}"`).catch(() => {})
          )
        )
      );
      await document.fonts.ready;

      const captureH = element.scrollHeight;

      const wrapper = document.createElement('div');
      wrapper.style.cssText = [
        'position:fixed',
        `top:-${captureH + 200}px`,
        'left:0',
        `width:${CONTENT_W}px`,
        'z-index:99999',
        'background:#fff',
        'overflow:visible',
      ].join(';');

      const clone = element.cloneNode(true);
      clone.style.position = 'relative';
      clone.style.top      = '0';
      clone.style.left     = '0';
      clone.style.zIndex   = 'auto';
      clone.style.width    = `${CONTENT_W}px`;

      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      // ── System-font → web-font substitution ────────────────────────────────
      // html-to-image renders via SVG <foreignObject>, which blocks access to
      // OS system fonts (Calibri, Arial, Georgia, etc.) for security reasons.
      // We replace every system font in the clone's inline styles with the
      // nearest Google Font we have embedded, so the PDF stays pixel-perfect.
      const SYSTEM_FONT_MAP = {
        'calibri':         '"DM Sans"',
        'inter':           '"DM Sans"',
        'outfit':          '"Plus Jakarta Sans"',
        'trebuchet ms':    '"DM Sans"',
        'verdana':         '"DM Sans"',
        'arial':           '"DM Sans"',
        'georgia':         '"Merriweather"',
        'times new roman': '"Merriweather"',
      };
      clone.querySelectorAll('*').forEach(el => {
        const ff = el.style.fontFamily;
        if (!ff) return;
        let updated = ff;
        for (const [system, web] of Object.entries(SYSTEM_FONT_MAP)) {
          updated = updated.replace(
            new RegExp(`'${system}'|"${system}"`, 'gi'),
            web
          );
        }
        if (updated !== ff) el.style.fontFamily = updated;
      });

      // Wait for layout to settle
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      await document.fonts.ready;

      // Temporarily disable cross-origin stylesheets (e.g. from Google Translate
      // extension) to prevent SecurityError when html-to-image tries to read cssRules.
      const disabledSheets = [];
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const _ = sheet.cssRules;
        } catch (_e) {
          try {
            sheet.disabled = true;
            disabledSheets.push(sheet);
          } catch (_) {}
        }
      }

      let fullDataUrl;
      try {
        // Call toPng twice — first pass primes the image/font cache inside
        // html-to-image; second pass produces a clean consistent result.
        await toPng(clone, { backgroundColor: '#ffffff', width: CONTENT_W, height: captureH, pixelRatio: PR, cacheBust: false }).catch(() => {});
        fullDataUrl = await toPng(clone, {
          backgroundColor: '#ffffff',
          width: CONTENT_W,
          height: captureH,
          pixelRatio: PR,
          cacheBust: false,
        });
      } finally {
        for (const sheet of disabledSheets) {
          try { sheet.disabled = false; } catch (_) {}
        }
        if (injectedFontStyle) injectedFontStyle.remove();
        document.body.removeChild(wrapper);
      }

      if (!fullDataUrl || fullDataUrl === 'data:,') {
        throw new Error('html-to-image returned an empty result');
      }

      await new Promise(r => setTimeout(r, 0));

      const fullImg = await new Promise((resolve, reject) => {
        const im = new Image();
        im.onload = () => resolve(im);
        im.onerror = reject;
        im.src = fullDataUrl;
      });

      const { breaks } = breakDataRef.current;
      const contentRanges = [];
      let prev = 0;
      for (const brk of breaks) {
        if (brk > prev && brk < captureH) {
          contentRanges.push({ start: prev, end: brk });
          prev = brk;
        }
      }
      contentRanges.push({ start: prev, end: captureH });

      const imgW = CONTENT_W * PR;
      const a4H  = Math.round((A4_H_MM / A4_W_MM) * imgW);

      // Must match the MARGIN constant in LivePreview.jsx (48px) so the PDF
      // top-of-page white gap looks identical to the browser preview.
      const PAGE_TOP_MARGIN = 48;

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

      for (let i = 0; i < contentRanges.length; i++) {
        await new Promise(r => setTimeout(r, 0));
        if (i > 0) pdf.addPage();

        const { start, end } = contentRanges[i];
        const sliceH    = Math.round((end - start) * PR);
        // Pages 2+ get a top margin to match the live-preview white gap
        const marginTop = i > 0 ? Math.round(PAGE_TOP_MARGIN * PR) : 0;

        const a4Canvas = document.createElement('canvas');
        a4Canvas.width  = imgW;
        a4Canvas.height = a4H;
        const ctx = a4Canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, imgW, a4H);
        ctx.drawImage(
          fullImg,
          0, Math.round(start * PR), imgW, sliceH,
          0, marginTop,               imgW, sliceH
        );

        pdf.addImage(a4Canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, A4_W_MM, A4_H_MM);
      }

      const name = cvData.personalInfo?.fullName || 'Resume';
      const fileName = `${name} - CV.pdf`;
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      if (isIOS && mobileWindow) {
        // iOS Safari: navigate the pre-opened window to the blob URL.
        // Blob URLs are same-origin so Safari allows this; data: URIs
        // are blocked by Chrome (which is why we don't use datauristring).
        mobileWindow.location.href = blobUrl;
        setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
      } else {
        // Android Chrome + Desktop: a.download works fine in async context
        // because download links are never treated as popups.
        if (mobileWindow) mobileWindow.close();
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      }

      if (currentCVId) {
        fetch(`/api/cvs/${currentCVId}/download`, {
          method: 'POST', credentials: 'include',
        }).catch(() => {});
      }
    } catch (err) {
      if (mobileWindow) mobileWindow.close();
      console.error('PDF export failed:', err);
      alert(isRTL ? 'فشل تصدير PDF. حاول مرة أخرى.' : 'PDF export failed. Please try again.');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row h-[calc(100svh-64px)] md:h-[calc(100vh-72px)] overflow-hidden bg-slate-100"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {showLimitModal && (
        <LimitModal
          isRTL={isRTL}
          plan={currentUser?.plan || 'free'}
          onClose={() => setShowLimitModal(false)}
          onUpgrade={() => { setShowLimitModal(false); navigate('/upgrade'); }}
        />
      )}

      {showFreeExpiredModal && (
        <FreeExpiredModal
          isRTL={isRTL}
          onClose={() => setShowFreeExpiredModal(false)}
          onUpgrade={() => { setShowFreeExpiredModal(false); navigate('/upgrade'); }}
        />
      )}

      {showSaveModal && (
        <SaveModal
          isRTL={isRTL}
          defaultName={currentCVName}
          onSave={handleSave}
          onClose={() => setShowSaveModal(false)}
        />
      )}

      {saveToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl text-sm font-medium flex items-center gap-2 animate-fade-in no-print">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {isRTL ? 'تم الحفظ بنجاح!' : 'Saved successfully!'}
        </div>
      )}

      {/* Mobile top tabs */}
      <div className="md:hidden flex items-center bg-white border-b border-slate-200 sticky top-0 z-10 no-print">
        <button onClick={() => setMobileTab('editor')} className={`flex-1 py-3 text-sm font-medium ${mobileTab === 'editor' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>
          {isRTL ? 'تعديل' : 'Edit'}
        </button>
        <button onClick={() => setMobileTab('preview')} className={`flex-1 py-3 text-sm font-medium ${mobileTab === 'preview' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500'}`}>
          {isRTL ? 'معاينة' : 'Preview'}
        </button>
        {/* Quick-action icons always visible on mobile */}
        <div className="flex items-center gap-1 px-2 border-l border-slate-200">
          <button
            onClick={handleSaveClick}
            title={isRTL ? 'حفظ' : 'Save'}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Editor Sidebar ── */}
      <div className={`w-full md:w-[420px] lg:w-[460px] flex-1 md:flex-none md:flex-shrink-0 bg-white border-r border-slate-200 flex flex-col overflow-hidden no-print ${mobileTab === 'editor' ? 'flex' : 'hidden md:flex'}`}>
        <div className="flex border-b border-slate-100 bg-white sticky top-0 z-10 flex-shrink-0">
          {PANEL_TABS.map(({ key, enLabel, arLabel, Icon }) => {
            const active = panelTab === key;
            return (
              <button key={key} onClick={() => setPanelTab(key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-sm font-medium transition-colors border-b-2 ${
                  active ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon />
                <span>{isRTL ? arLabel : enLabel}</span>
              </button>
            );
          })}
        </div>
        <div className="overflow-y-auto flex-1">
          {panelTab === 'overview'  && <OverviewPanel cvData={cvData} theme={theme} selectedTemplate={selectedTemplate} visibleSections={visibleSections} isRTL={isRTL} setPanelTab={setPanelTab} />}
          {panelTab === 'content'   && <EditorPanel />}
          {panelTab === 'customize' && <CustomizePanel />}
        </div>
      </div>

      {/* ── Live Preview ── */}
      <div className={`flex-1 bg-slate-100 overflow-y-auto ${mobileTab === 'preview' ? 'block' : 'hidden md:block'}`}>

        {/* Top action bar */}
        <div className="sticky top-0 right-0 p-3 sm:p-4 flex justify-end gap-2 sm:gap-3 z-10 pointer-events-none no-print">
          <div className="pointer-events-auto">
            <button onClick={() => navigate('/dashboard')}
              className="bg-white border border-slate-200 text-slate-600 shadow-sm px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden sm:inline">{isRTL ? 'لوحة التحكم' : 'Dashboard'}</span>
            </button>
          </div>
          <div className="pointer-events-auto">
            <button onClick={handleSaveClick}
              className="bg-white border border-slate-200 text-slate-700 shadow-sm px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <span className="hidden sm:inline">{isRTL ? 'حفظ' : 'Save'}</span>
            </button>
          </div>
          <div className="pointer-events-auto">
            <button
              onClick={handleDownloadPDF}
              disabled={isPrinting}
              className="bg-indigo-600 text-white shadow-md px-3 sm:px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm disabled:opacity-70"
            >
              {isPrinting ? (
                <>
                  <svg className="w-4 h-4 flex-shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="hidden sm:inline">{isRTL ? 'جاري...' : 'Loading...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span className="hidden sm:inline">{isRTL ? 'تنزيل PDF' : 'Download PDF'}</span>
                  <span className="sm:hidden">PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-4 md:p-8 flex justify-center pb-20">
          <LivePreview breakDataRef={breakDataRef} />
        </div>
      </div>
    </div>
  );
};

/* ── Overview Panel ── */
const SECTION_LABELS = {
  summary:       { en: 'Summary',       ar: 'الملخص'      },
  experience:    { en: 'Experience',    ar: 'الخبرة'       },
  education:     { en: 'Education',     ar: 'التعليم'      },
  skills:        { en: 'Skills',        ar: 'المهارات'     },
  projects:      { en: 'Projects',      ar: 'المشاريع'     },
  languages:     { en: 'Languages',     ar: 'اللغات'       },
  certificates:  { en: 'Certificates',  ar: 'الشهادات'     },
  interests:     { en: 'Interests',     ar: 'الاهتمامات'   },
  courses:       { en: 'Courses',       ar: 'الدورات'      },
  awards:        { en: 'Awards',        ar: 'الجوائز'      },
  organisations: { en: 'Organisations', ar: 'المنظمات'     },
  publications:  { en: 'Publications',  ar: 'المنشورات'    },
  references:    { en: 'References',    ar: 'المراجع'      },
};

const OverviewPanel = ({ cvData, theme, selectedTemplate, visibleSections, isRTL, setPanelTab }) => {
  const completionItems = [
    { key: 'name',       label: isRTL ? 'الاسم'              : 'Name',       done: !!cvData.personalInfo.fullName  },
    { key: 'jobTitle',   label: isRTL ? 'المسمى الوظيفي'     : 'Job title',  done: !!cvData.personalInfo.jobTitle  },
    { key: 'email',      label: isRTL ? 'البريد الإلكتروني'  : 'Email',      done: !!cvData.personalInfo.email     },
    { key: 'summary',    label: isRTL ? 'الملخص المهني'      : 'Summary',    done: !!cvData.personalInfo.summary   },
    { key: 'experience', label: isRTL ? 'الخبرة'             : 'Experience', done: cvData.experience?.length > 0   },
    { key: 'education',  label: isRTL ? 'التعليم'            : 'Education',  done: cvData.education?.length > 0    },
    { key: 'skills',     label: isRTL ? 'المهارات'           : 'Skills',     done: cvData.skills?.length > 0       },
  ];
  const doneCount = completionItems.filter(i => i.done).length;
  const pct = Math.round((doneCount / completionItems.length) * 100);
  const activeSections = Object.entries(visibleSections).filter(([, v]) => v).map(([k]) => k);

  return (
    <div className="p-5 space-y-6 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800 text-sm">{isRTL ? 'اكتمال السيرة الذاتية' : 'CV Completion'}</span>
          <span className="text-sm font-bold text-indigo-600">{pct}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: theme.primaryColor }} />
        </div>
        <div className="space-y-1.5">
          {completionItems.map(item => (
            <div key={item.key} className="flex items-center gap-2 text-sm" style={{ flexDirection: isRTL ? 'row-reverse' : 'row' }}>
              <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                {item.done
                  ? <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  : <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                }
              </span>
              <span className={item.done ? 'text-slate-700' : 'text-slate-400'}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <p className="text-xs font-medium text-slate-400 mb-1">{isRTL ? 'القالب المحدد' : 'Active template'}</p>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-800 capitalize">{selectedTemplate}</span>
          <button onClick={() => setPanelTab('customize')} className="text-xs text-indigo-600 font-medium hover:underline">
            {isRTL ? 'تغيير' : 'Change'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-slate-400">{isRTL ? 'الأقسام الفعّالة' : 'Active sections'}</p>
          <button onClick={() => setPanelTab('customize')} className="text-xs text-indigo-600 font-medium hover:underline">
            {isRTL ? 'تعديل' : 'Edit'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activeSections.map(k => (
            <span key={k} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">
              {SECTION_LABELS[k]?.[isRTL ? 'ar' : 'en'] ?? k}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={() => setPanelTab('content')} className="flex flex-col items-center gap-1.5 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
          <ContentIcon />
          <span className="text-xs font-medium text-slate-600">{isRTL ? 'تعديل المحتوى' : 'Edit Content'}</span>
        </button>
        <button onClick={() => setPanelTab('customize')} className="flex flex-col items-center gap-1.5 p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-indigo-200 hover:bg-indigo-50/30 transition-all">
          <CustomizeIcon />
          <span className="text-xs font-medium text-slate-600">{isRTL ? 'تخصيص التصميم' : 'Customize Design'}</span>
        </button>
      </div>
    </div>
  );
};

export default CVBuilder;
