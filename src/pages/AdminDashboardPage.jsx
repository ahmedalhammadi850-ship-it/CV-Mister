import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── helpers ─── */
const fmt = (d) => d ? new Date(d).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';
const fmtFull = (d) => d ? new Date(d).toLocaleString('ar-SA') : '—';

const STATUS_COLORS = {
  pending:  { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'قيد المراجعة' },
  approved: { bg: 'bg-green-100',  text: 'text-green-700',  label: 'مقبول' },
  rejected: { bg: 'bg-red-100',    text: 'text-red-700',    label: 'مرفوض' },
};

/* ─── Stat Card ─── */
const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-900">{value ?? '—'}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ─── Change Password Modal ─── */
const ChangePasswordModal = ({ onClose }) => {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.newPassword !== form.confirm) { setError('كلمة المرور الجديدة غير متطابقة'); return; }
    if (form.newPassword.length < 6) { setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/password', {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message); return; }
      setSuccess(data.message);
      setTimeout(onClose, 1500);
    } catch { setError('حدث خطأ'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <form onSubmit={handle} onClick={e => e.stopPropagation()}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-7">
        <h3 className="text-xl font-bold text-slate-900 mb-6">تغيير كلمة المرور</h3>
        {error   && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}
        {success && <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm">{success}</div>}
        {[
          { key: 'currentPassword', label: 'كلمة المرور الحالية' },
          { key: 'newPassword',     label: 'كلمة المرور الجديدة' },
          { key: 'confirm',         label: 'تأكيد كلمة المرور الجديدة' },
        ].map(({ key, label }) => (
          <div key={key} className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            <input
              type="password"
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
            />
          </div>
        ))}
        <div className="flex gap-3 mt-6">
          <button type="submit" disabled={loading}
            className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 disabled:opacity-50 transition">
            {loading ? 'جارٍ الحفظ...' : 'حفظ كلمة المرور'}
          </button>
          <button type="button" onClick={onClose}
            className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-200 transition">
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

/* ─── Receipt Image Modal ─── */
const ReceiptModal = ({ url, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-2xl p-4 max-w-lg w-full shadow-2xl">
      <button onClick={onClose} className="absolute top-3 left-3 text-slate-500 hover:text-slate-800">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <img src={url} alt="صورة الحوالة" className="w-full rounded-xl object-contain max-h-[70vh]" />
    </div>
  </div>
);

/* ─── Main Admin Dashboard ─── */
const ALL_TEMPLATES = [
  { id: 'modern',             ar: 'عصري' },
  { id: 'classic',            ar: 'كلاسيكي' },
  { id: 'creative',           ar: 'إبداعي' },
  { id: 'minimal',            ar: 'بسيط' },
  { id: 'executive',          ar: 'تنفيذي' },
  { id: 'atsclean',           ar: 'ATS نظيف' },
  { id: 'atspro',             ar: 'ATS احترافي' },
  { id: 'atssimple',          ar: 'ATS بسيط جداً' },
  { id: 'atsbold',            ar: 'ATS قوي' },
  { id: 'atscompact',         ar: 'ATS مضغوط' },
  { id: 'atsmodern',          ar: 'ATS عصري' },
  { id: 'atsharvard',         ar: 'ATS هارفارد' },
  { id: 'atscenter',          ar: 'ATS توسيط' },
  { id: 'atselegant',         ar: 'ATS أنيق' },
  { id: 'prestige',           ar: 'بريستيج' },
  { id: 'classicserif',       ar: 'كلاسيك سيريف' },
  { id: 'atlanticblue',       ar: 'أتلانتيك بلو' },
  { id: 'mercuryflow',        ar: 'ميركوري فلو' },
  { id: 'editorialrule',      ar: 'إديتوريال رول' },
  { id: 'sidebarlight',       ar: 'شريط جانبي فاتح' },
  { id: 'tealpro',            ar: 'تيل برو' },
  { id: 'roseelegant',        ar: 'روز إيليغانت' },
  { id: 'darkheader',         ar: 'هيدر داكن' },
  { id: 'arabicnavy',         ar: 'نيفي عربي' },
  { id: 'arabicpro',          ar: 'عربي احترافي' },
  { id: 'arabictealsidebar',  ar: 'شريط زمردي عربي' },
  { id: 'arabicslatesidebar', ar: 'شريط كحلي عربي' },
  { id: 'arabicmodern',       ar: 'عصري عربي' },
  { id: 'arabiccard',         ar: 'بطاقة عربية' },
  { id: 'arabicvelvet',       ar: 'مخمل عربي' },
  { id: 'arabicaurora',       ar: 'أورورا عربي' },
  { id: 'arabicgem',          ar: 'جوهرة عربية' },
  { id: 'arabicwave',         ar: 'موجة عربية' },
  { id: 'arabicluxe',         ar: 'لوكس عربي' },
  { id: 'arabiczafir',        ar: 'زافير عربي' },
  { id: 'arabicelite',        ar: 'إيليت عربي' },
  { id: 'englishhorizon',     ar: 'هورايزون إنجليزي' },
  { id: 'englishapex',        ar: 'أبيكس إنجليزي' },
  { id: 'velvet',             ar: 'مخمل' },
  { id: 'aurora',             ar: 'أورورا' },
];

const N8N_KEYS = [
  { key: 'N8N_AI_WEBHOOK_URL',      label: 'رابط الذكاء الاصطناعي (AI Rewrite)',  desc: 'يُستخدم لإعادة صياغة النصوص بالذكاء الاصطناعي' },
  { key: 'N8N_CHAT_WEBHOOK_URL',    label: 'رابط المحادثة (Chat)',                desc: 'يُستخدم لمساعد الدردشة' },
  { key: 'N8N_PAYMENT_WEBHOOK_URL', label: 'رابط الدفع (Payment)',               desc: 'يُستخدم عند قبول طلبات الدفع' },
];

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const [admin, setAdmin]         = useState(null);
  const [stats, setStats]         = useState(null);
  const [users, setUsers]         = useState([]);
  const [cvs, setCvs]             = useState([]);
  const [payments, setPayments]   = useState([]);
  const [bizContacts, setBiz]     = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading]     = useState(true);
  const [showPassModal, setShowPassModal]     = useState(false);
  const [receiptUrl, setReceiptUrl]           = useState(null);
  const [actionLoading, setActionLoading]     = useState({});
  const [sideOpen, setSideOpen]               = useState(false);
  const [searchUser, setSearchUser]           = useState('');
  const [searchCV, setSearchCV]               = useState('');
  const [statusFilter, setStatusFilter]       = useState('all');
  const [templateConfig, setTemplateConfig]   = useState({});
  const [tplSaving, setTplSaving]             = useState({});
  const [n8nSettings, setN8nSettings]         = useState({});
  const [n8nEditing, setN8nEditing]           = useState({});
  const [n8nSaving, setN8nSaving]             = useState({});
  const [n8nMsg, setN8nMsg]                   = useState({});
  const [pricingEdit, setPricingEdit]         = useState({
    pro_price: 3, pro_name: 'احترافي', pro_name_en: 'Professional', pro_desc: 'الخيار المثالي للباحثين عن عمل بجدية', pro_desc_en: 'Ideal for serious job seekers',
    business_price: 15, business_name: 'أعمال', business_name_en: 'Business', business_desc: 'للشركات والفرق التي تحتاج إلى حلول متكاملة', business_desc_en: 'For companies and teams needing complete solutions',
    free_name: 'مجاني', free_name_en: 'Free', free_desc: 'مثالي للبدء وتجربة المنصة', free_desc_en: 'Perfect to get started and try the platform',
    payment_account: '00154578', payment_bank: 'بنك التضامن — Tadhamon Bank', payment_beneficiary: 'أحمد عبدالله عقلان الحمادي',
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
      { label: 'دعم كامل متعدد اللغات',      labelEn: 'Full multilingual support',included: true },
      { label: 'ذكاء اصطناعي متقدم',         labelEn: 'Advanced AI',              included: true },
      { label: 'رسائل تغطية غير محدودة',     labelEn: 'Unlimited cover letters',  included: true },
    ],
  });
  const [pricingSaving, setPricingSaving]     = useState(false);
  const [pricingMsg, setPricingMsg]           = useState('');
  const [navbarEdit, setNavbarEdit]           = useState({ home_ar: 'الرئيسية', home_en: 'Home', templates_ar: 'القوالب', templates_en: 'Templates', pricing_ar: 'الأسعار', pricing_en: 'Pricing', about_ar: 'من نحن', about_en: 'About' });
  const [navbarSaving, setNavbarSaving]       = useState(false);
  const [navbarMsg, setNavbarMsg]             = useState('');

  const apiFetch = useCallback(async (url) => {
    const res = await fetch(url, { credentials: 'include' });
    if (res.status === 401) { navigate('/admin/login'); throw new Error('Unauthorized'); }
    if (!res.ok) throw new Error('Error');
    return res.json();
  }, [navigate]);

  useEffect(() => {
    const init = async () => {
      try {
        const [me, st, u, c, p, b, tpl, n8n, pricing, navbar] = await Promise.all([
          apiFetch('/api/admin/me'),
          apiFetch('/api/admin/stats'),
          apiFetch('/api/admin/users'),
          apiFetch('/api/admin/cvs'),
          apiFetch('/api/admin/payment-requests'),
          apiFetch('/api/admin/business-contacts'),
          fetch('/api/templates/config').then(r => r.json()),
          apiFetch('/api/admin/settings'),
          apiFetch('/api/admin/pricing').catch(() => ({})),
          apiFetch('/api/admin/navbar').catch(() => ({})),
        ]);
        setAdmin(me); setStats(st); setUsers(u); setCvs(c); setPayments(p); setBiz(b);
        setTemplateConfig(tpl);
        setN8nSettings(n8n);
        setN8nEditing(n8n);
        if (pricing && Object.keys(pricing).length) {
          setPricingEdit(prev => ({ ...prev, ...pricing }));
        }
        if (navbar && Object.keys(navbar).length) {
          setNavbarEdit(prev => ({ ...prev, ...navbar }));
        }
      } catch { /* redirect handled */ }
      finally { setLoading(false); }
    };
    init();
  }, [apiFetch]);

  const handleToggleTemplate = async (id, currentFree) => {
    setTplSaving(s => ({ ...s, [id]: true }));
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_free: !currentFree }),
      });
      if (res.ok) {
        setTemplateConfig(prev => ({ ...prev, [id]: !currentFree }));
      }
    } finally {
      setTplSaving(s => ({ ...s, [id]: false }));
    }
  };

  const handleSaveNavbar = async () => {
    setNavbarSaving(true);
    setNavbarMsg('');
    try {
      const res = await fetch('/api/admin/navbar', {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(navbarEdit),
      });
      if (res.ok) setNavbarMsg('✓ تم الحفظ');
      else setNavbarMsg('✗ فشل الحفظ');
    } catch { setNavbarMsg('✗ خطأ'); }
    finally {
      setNavbarSaving(false);
      setTimeout(() => setNavbarMsg(''), 3000);
    }
  };

  const updateFeature = (plan, index, field, value) => {
    setPricingEdit(s => {
      const key = `${plan}_features`;
      const updated = s[key].map((f, i) => i === index ? { ...f, [field]: value } : f);
      return { ...s, [key]: updated };
    });
  };

  const handleSavePricing = async () => {
    setPricingSaving(true);
    setPricingMsg('');
    try {
      const body = {
        free_features: pricingEdit.free_features,
        pro_features: pricingEdit.pro_features,
        business_features: pricingEdit.business_features,
      };
      const res = await fetch('/api/admin/pricing', {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) setPricingMsg('✓ تم الحفظ');
      else setPricingMsg('✗ فشل الحفظ');
    } catch { setPricingMsg('✗ خطأ'); }
    finally {
      setPricingSaving(false);
      setTimeout(() => setPricingMsg(''), 3000);
    }
  };

  const handleSaveN8n = async (key) => {
    setN8nSaving(s => ({ ...s, [key]: true }));
    setN8nMsg(m => ({ ...m, [key]: '' }));
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value: n8nEditing[key] }),
      });
      const data = await res.json();
      if (!res.ok) { setN8nMsg(m => ({ ...m, [key]: data.message || 'خطأ' })); return; }
      setN8nSettings(s => ({ ...s, [key]: n8nEditing[key] }));
      setN8nMsg(m => ({ ...m, [key]: '✓ تم الحفظ' }));
      setTimeout(() => setN8nMsg(m => ({ ...m, [key]: '' })), 2000);
    } catch { setN8nMsg(m => ({ ...m, [key]: 'حدث خطأ' })); }
    finally { setN8nSaving(s => ({ ...s, [key]: false })); }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    navigate('/admin/login');
  };

  const handlePaymentAction = async (id, status) => {
    setActionLoading(l => ({ ...l, [id]: true }));
    try {
      const res = await fetch(`/api/admin/payment-requests/${id}`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setPayments(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      }
    } finally { setActionLoading(l => ({ ...l, [id]: false })); }
  };

  const handleBizAction = async (id, status) => {
    setActionLoading(l => ({ ...l, [id]: true }));
    try {
      const res = await fetch(`/api/admin/business-contacts/${id}`, {
        method: 'PATCH', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBiz(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      }
    } finally { setActionLoading(l => ({ ...l, [id]: false })); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم وجميع بياناته؟')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) setUsers(prev => prev.filter(u => u.id !== id));
    } catch { alert('حدث خطأ أثناء الحذف'); }
  };

  const TABS = [
    { key: 'overview',   label: 'الإحصائيات',    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { key: 'users',      label: 'المستخدمون',    badge: stats?.users, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { key: 'cvs',        label: 'السير الذاتية', badge: stats?.cvs, icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { key: 'payments',   label: 'طلبات الدفع',   badge: stats?.pendingPayments || null, icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
    { key: 'business',   label: 'تواصل الأعمال', badge: bizContacts.length || null, icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { key: 'templates',  label: 'القوالب',       icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z' },
    { key: 'settings',   label: 'الإعدادات',     icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ];

  const filteredUsers = users.filter(u =>
    `${u.firstName || ''} ${u.lastName || ''} ${u.email || ''}`.toLowerCase().includes(searchUser.toLowerCase())
  );
  const [cvDownloadFilter, setCvDownloadFilter] = useState(false);
  const filteredCVs = cvs
    .filter(c => `${c.name || ''} ${c.userEmail || ''} ${c.userFirstName || ''}`.toLowerCase().includes(searchCV.toLowerCase()))
    .filter(c => !cvDownloadFilter || (c.downloadCount || 0) > 0)
    .sort((a, b) => cvDownloadFilter ? (b.downloadCount || 0) - (a.downloadCount || 0) : 0);
  const filteredPayments = payments.filter(p =>
    statusFilter === 'all' || p.status === statusFilter
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full" dir="rtl">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-700">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-white text-sm">لوحة الأدمن</p>
          <p className="text-xs text-slate-400">CV Mister</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSideOpen(false); }}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
            }`}>
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            <span className="flex-1 text-right">{tab.label}</span>
            {tab.badge > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-indigo-500/20 text-indigo-400'}`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-700 p-3 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {admin?.username?.[0] || 'أ'}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{admin?.username || 'أدمن'}</p>
            <p className="text-xs text-slate-500">مشرف النظام</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          تسجيل الخروج
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center" dir="rtl">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">جارٍ التحميل...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-800 border-l border-slate-700 h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {sideOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" dir="rtl">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSideOpen(false)} />
          <aside className="relative w-64 bg-slate-800 h-full shadow-2xl flex flex-col">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSideOpen(true)} className="lg:hidden text-slate-400 hover:text-white transition">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">
                {TABS.find(t => t.key === activeTab)?.label}
              </h1>
              <p className="text-xs text-slate-500">مرحباً، {admin?.username} 👋</p>
            </div>
          </div>
          <button onClick={() => setShowPassModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm hover:bg-slate-700 transition border border-slate-700">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            تغيير كلمة المرور
          </button>
        </div>

        <div className="p-6">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <StatCard icon={<svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>} color="bg-indigo-50" label="إجمالي المستخدمين" value={stats?.users} />
                <StatCard icon={<svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} color="bg-emerald-50" label="السير الذاتية المُنشأة" value={stats?.cvs} />
                <StatCard icon={<svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="bg-amber-50" label="طلبات دفع قيد المراجعة" value={stats?.pendingPayments} />
                <StatCard icon={<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="bg-green-50" label="طلبات دفع مقبولة" value={stats?.approvedPayments} />
                <StatCard icon={<svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>} color="bg-violet-50" label="مستخدمون نزّلوا سيرة ذاتية" value={stats?.usersWithDownloads} sub={`${stats?.totalDownloads ?? 0} تنزيل إجمالاً`} />
                <StatCard icon={<svg className="w-6 h-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} color="bg-sky-50" label="طلبات الأعمال" value={stats?.businessContacts} />
              </div>

              {/* Recent Payments */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="font-bold text-white">أحدث طلبات الدفع</h3>
                  <button onClick={() => setActiveTab('payments')} className="text-indigo-400 text-sm hover:text-indigo-300 transition">عرض الكل</button>
                </div>
                <div className="divide-y divide-slate-700">
                  {payments.slice(0, 5).map(p => {
                    const st = STATUS_COLORS[p.status] || STATUS_COLORS.pending;
                    return (
                      <div key={p.id} className="px-6 py-4 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{p.userFirstName || '—'} {p.userLastName || ''}</p>
                          <p className="text-xs text-slate-400">{p.userEmail || '—'} · {fmt(p.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm font-bold text-emerald-400">${p.amount}</span>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>{st.label}</span>
                        </div>
                      </div>
                    );
                  })}
                  {payments.length === 0 && (
                    <div className="px-6 py-10 text-center text-slate-500 text-sm">لا توجد طلبات دفع</div>
                  )}
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="font-bold text-white">أحدث المستخدمين</h3>
                  <button onClick={() => setActiveTab('users')} className="text-indigo-400 text-sm hover:text-indigo-300 transition">عرض الكل</button>
                </div>
                <div className="divide-y divide-slate-700">
                  {users.slice(0, 5).map(u => (
                    <div key={u.id} className="px-6 py-4 flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(u.firstName || u.email || '?')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">{u.firstName || '—'} {u.lastName || ''}</p>
                        <p className="text-xs text-slate-400">{u.email || '—'}</p>
                      </div>
                      <p className="text-xs text-slate-500 flex-shrink-0">{fmt(u.createdAt)}</p>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="px-6 py-10 text-center text-slate-500 text-sm">لا يوجد مستخدمون</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="البحث عن مستخدم..." className="w-full pr-9 pl-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
                <span className="text-slate-400 text-sm">{filteredUsers.length} مستخدم</span>
              </div>
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">المستخدم</th>
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">البريد الإلكتروني</th>
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">نوع الحساب</th>
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">تاريخ التسجيل</th>
                        <th className="px-5 py-3.5" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                {(u.firstName || u.email || '?')[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-white text-sm">{u.firstName || '—'} {u.lastName || ''}</p>
                                <p className="text-xs text-slate-400 md:hidden">{u.email || '—'}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-300 hidden md:table-cell">{u.email || '—'}</td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <div className="flex flex-col gap-1">
                              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold w-fit ${u.plan === 'pro' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-600/40 text-slate-400'}`}>
                                {u.plan === 'pro' ? '⭐ Pro' : 'مجاني'}
                              </span>
                              <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium w-fit ${u.hasPassword ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                {u.hasPassword ? 'بريد' : 'OIDC'}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell">{fmt(u.createdAt)}</td>
                          <td className="px-5 py-4">
                            <button onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="px-6 py-16 text-center text-slate-500 text-sm">لا يوجد مستخدمون</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── CVs ── */}
          {activeTab === 'cvs' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input value={searchCV} onChange={e => setSearchCV(e.target.value)} placeholder="البحث في السير الذاتية..." className="w-full pr-9 pl-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                </div>
                <button
                  onClick={() => setCvDownloadFilter(f => !f)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${cvDownloadFilter ? 'bg-violet-600 text-white border-violet-600 shadow-lg' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  نزّلوا سيرة ذاتية فقط
                </button>
                <span className="text-slate-400 text-sm">{filteredCVs.length} سيرة</span>
              </div>
              <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">اسم السيرة</th>
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden md:table-cell">المالك</th>
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">القالب</th>
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">ATS</th>
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">التحميلات</th>
                        <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wide hidden lg:table-cell">آخر تعديل</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                      {filteredCVs.map(c => (
                        <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-medium text-white">{c.name}</p>
                            <p className="text-xs text-slate-400 md:hidden">{c.userEmail || '—'}</p>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <p className="text-slate-200">{c.userFirstName || ''} {c.userLastName || ''}</p>
                            <p className="text-xs text-slate-500">{c.userEmail || '—'}</p>
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300 capitalize">{c.template}</span>
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <span className={`font-semibold text-sm ${c.atsScore >= 85 ? 'text-emerald-400' : c.atsScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                              {c.atsScore ?? '—'}
                            </span>
                          </td>
                          <td className="px-5 py-4 hidden lg:table-cell">
                            <span className="flex items-center gap-1.5 text-slate-300 font-semibold text-sm">
                              <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              {c.downloadCount ?? 0}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-400 text-xs hidden lg:table-cell">{fmt(c.lastModified)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredCVs.length === 0 && (
                    <div className="px-6 py-16 text-center text-slate-500 text-sm">لا توجد سير ذاتية</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── PAYMENTS ── */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {['all', 'pending', 'approved', 'rejected'].map(s => (
                  <button key={s} onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${statusFilter === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'}`}>
                    {s === 'all' ? 'الكل' : STATUS_COLORS[s]?.label}
                    <span className="ms-2 opacity-70">
                      ({s === 'all' ? payments.length : payments.filter(p => p.status === s).length})
                    </span>
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredPayments.map(p => {
                  const st = STATUS_COLORS[p.status] || STATUS_COLORS.pending;
                  return (
                    <div key={p.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-white">{p.userFirstName || '—'} {p.userLastName || ''}</p>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>{st.label}</span>
                          </div>
                          <p className="text-sm text-slate-400">{p.userEmail || '—'}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                            <span>الخطة: <span className="text-slate-300">{p.plan}</span></span>
                            <span>المبلغ: <span className="text-emerald-400 font-semibold">${p.amount}</span></span>
                            <span>التاريخ: {fmt(p.createdAt)}</span>
                          </div>
                          {p.reviewedAt && <p className="text-xs text-slate-500">تمت المراجعة: {fmtFull(p.reviewedAt)}</p>}
                          {p.notes && <p className="text-xs text-slate-400 mt-1">ملاحظات: {p.notes}</p>}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {p.receiptImage && (
                            <button onClick={() => setReceiptUrl(p.receiptImage)}
                              className="px-3 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs hover:bg-slate-600 transition flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                              عرض الحوالة
                            </button>
                          )}
                          {p.status !== 'approved' && (
                            <button onClick={() => handlePaymentAction(p.id, 'approved')}
                              disabled={actionLoading[p.id]}
                              className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs hover:bg-emerald-700 disabled:opacity-50 transition flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              قبول
                            </button>
                          )}
                          {p.status !== 'rejected' && (
                            <button onClick={() => handlePaymentAction(p.id, 'rejected')}
                              disabled={actionLoading[p.id]}
                              className="px-3 py-2 rounded-xl bg-red-600/80 text-white text-xs hover:bg-red-700 disabled:opacity-50 transition flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              رفض
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {filteredPayments.length === 0 && (
                  <div className="bg-slate-800 rounded-2xl border border-slate-700 px-6 py-16 text-center text-slate-500 text-sm">
                    لا توجد طلبات دفع
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── BUSINESS CONTACTS ── */}
          {activeTab === 'business' && (
            <div className="space-y-3">
              {bizContacts.map(b => (
                <div key={b.id} className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-semibold text-white">{b.name}</p>
                      <p className="text-sm text-slate-400">{b.email} · {b.company}</p>
                      {b.teamSize && <p className="text-xs text-slate-500">حجم الفريق: {b.teamSize}</p>}
                      {b.message && <p className="text-sm text-slate-300 mt-2 max-w-lg">{b.message}</p>}
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span>الخطة: <span className="text-slate-300">{b.plan}</span></span>
                        <span>المبلغ: <span className="text-emerald-400 font-semibold">${b.amount}</span></span>
                        <span>{fmt(b.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {b.receiptImage && (
                        <button onClick={() => setReceiptUrl(b.receiptImage)}
                          className="px-3 py-2 rounded-xl bg-slate-700 text-slate-300 text-xs hover:bg-slate-600 transition flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          عرض الحوالة
                        </button>
                      )}
                      <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${STATUS_COLORS[b.status]?.bg} ${STATUS_COLORS[b.status]?.text}`}>
                        {STATUS_COLORS[b.status]?.label || b.status}
                      </span>
                      {b.status !== 'approved' && (
                        <button
                          onClick={() => handleBizAction(b.id, 'approved')}
                          disabled={!!actionLoading[b.id]}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          موافقة
                        </button>
                      )}
                      {b.status !== 'rejected' && (
                        <button
                          onClick={() => handleBizAction(b.id, 'rejected')}
                          disabled={!!actionLoading[b.id]}
                          className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          رفض
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {bizContacts.length === 0 && (
                <div className="bg-slate-800 rounded-2xl border border-slate-700 px-6 py-16 text-center text-slate-500 text-sm">
                  لا توجد طلبات أعمال
                </div>
              )}
            </div>
          )}

          {/* ── TEMPLATES ── */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-5">
                <h3 className="font-bold text-white mb-1">إدارة القوالب</h3>
                <p className="text-slate-400 text-sm mb-5">حدّد أي القوالب مجانية وأيها مدفوعة. المستخدمون المجانيون لا يستطيعون استخدام القوالب المدفوعة.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ALL_TEMPLATES.map(tpl => {
                    const isFree = !!templateConfig[tpl.id];
                    const saving = !!tplSaving[tpl.id];
                    return (
                      <div key={tpl.id}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-700/60 border border-slate-600 gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isFree ? 'bg-green-400' : 'bg-indigo-400'}`} />
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{tpl.ar}</p>
                            <p className="text-slate-500 text-xs">{tpl.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isFree ? 'bg-green-500/20 text-green-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                            {isFree ? 'مجاني' : 'مدفوع'}
                          </span>
                          <button
                            onClick={() => handleToggleTemplate(tpl.id, isFree)}
                            disabled={saving}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50 ${isFree ? 'bg-green-500' : 'bg-slate-600'}`}
                          >
                            <span
                              className="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200"
                              style={{ transform: isFree ? 'translateX(24px)' : 'translateX(4px)' }}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <p className="text-slate-500 text-xs mt-4 text-center">
                  {Object.values(templateConfig).filter(Boolean).length} قالب مجاني من أصل {ALL_TEMPLATES.length}
                </p>
              </div>
            </div>
          )}

          {/* ── SETTINGS ── */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-4">

              {/* ── Navbar Labels ── */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">التحكم في شريط التنقل</h3>
                    <p className="text-slate-400 text-xs">تعديل نصوص روابط القائمة العلوية</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'home',      labelAr: 'الرئيسية', labelEn: 'Home'      },
                    { key: 'templates', labelAr: 'القوالب',  labelEn: 'Templates' },
                    { key: 'pricing',   labelAr: 'الأسعار',  labelEn: 'Pricing'   },
                    { key: 'about',     labelAr: 'من نحن',   labelEn: 'About'     },
                  ].map(({ key, labelAr, labelEn }) => (
                    <div key={key} className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
                      <p className="text-xs text-slate-500 mb-3 font-semibold uppercase tracking-wide">
                        {labelAr} / {labelEn}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">عربي</label>
                          <input
                            type="text"
                            value={navbarEdit[`${key}_ar`]}
                            onChange={e => setNavbarEdit(s => ({ ...s, [`${key}_ar`]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
                            dir="rtl"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-500 mb-1">English</label>
                          <input
                            type="text"
                            value={navbarEdit[`${key}_en`]}
                            onChange={e => setNavbarEdit(s => ({ ...s, [`${key}_en`]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-5">
                  {navbarMsg && (
                    <span className={`text-sm font-medium ${navbarMsg.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>
                      {navbarMsg}
                    </span>
                  )}
                  <button
                    onClick={handleSaveNavbar}
                    disabled={navbarSaving}
                    className="mr-auto py-2.5 px-6 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    {navbarSaving ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    حفظ التنقل
                  </button>
                </div>
              </div>

              {/* ── Pricing Restrictions ── */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">قيود الخطط</h3>
                    <p className="text-slate-400 text-xs">تحكم في ما يظهر مضمّناً أو مستبعداً في كل خطة</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mb-5 mr-12">اضغط ✓ أو ✗ لتغيير الحالة — عدّل النص العربي والإنجليزي لكل ميزة</p>

                <div className="space-y-4">

                  {/* Free */}
                  <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
                      <p className="text-sm font-semibold text-slate-300">الخطة المجانية (Free)</p>
                    </div>
                    <div className="space-y-2">
                      {pricingEdit.free_features.map((f, i) => (
                        <div key={i} className="grid grid-cols-[auto_1fr_1fr] gap-2 items-center">
                          <button type="button" onClick={() => updateFeature('free', i, 'included', !f.included)}
                            title={f.included ? 'مضمّن — اضغط للاستبعاد' : 'مستبعد — اضغط للتضمين'}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors border ${f.included ? 'bg-emerald-500/20 text-emerald-400 border-emerald-700/40' : 'bg-red-500/10 text-red-400 border-red-700/30'}`}>
                            {f.included
                              ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                              : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            }
                          </button>
                          <input type="text" value={f.label} onChange={e => updateFeature('free', i, 'label', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-slate-500/60" dir="rtl" placeholder="عربي" />
                          <input type="text" value={f.labelEn} onChange={e => updateFeature('free', i, 'labelEn', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-slate-500/60" dir="ltr" placeholder="English" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pro */}
                  <div className="bg-slate-900/60 rounded-xl p-4 border border-indigo-800/50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"></span>
                      <p className="text-sm font-semibold text-indigo-400">الخطة الاحترافية (Pro)</p>
                    </div>
                    <div className="space-y-2">
                      {pricingEdit.pro_features.map((f, i) => (
                        <div key={i} className="grid grid-cols-[auto_1fr_1fr] gap-2 items-center">
                          <button type="button" onClick={() => updateFeature('pro', i, 'included', !f.included)}
                            title={f.included ? 'مضمّن — اضغط للاستبعاد' : 'مستبعد — اضغط للتضمين'}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors border ${f.included ? 'bg-emerald-500/20 text-emerald-400 border-emerald-700/40' : 'bg-red-500/10 text-red-400 border-red-700/30'}`}>
                            {f.included
                              ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                              : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            }
                          </button>
                          <input type="text" value={f.label} onChange={e => updateFeature('pro', i, 'label', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/60" dir="rtl" placeholder="عربي" />
                          <input type="text" value={f.labelEn} onChange={e => updateFeature('pro', i, 'labelEn', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500/60" dir="ltr" placeholder="English" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Business */}
                  <div className="bg-slate-900/60 rounded-xl p-4 border border-amber-800/50">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                      <p className="text-sm font-semibold text-amber-400">خطة الأعمال (Business)</p>
                    </div>
                    <div className="space-y-2">
                      {pricingEdit.business_features.map((f, i) => (
                        <div key={i} className="grid grid-cols-[auto_1fr_1fr] gap-2 items-center">
                          <button type="button" onClick={() => updateFeature('business', i, 'included', !f.included)}
                            title={f.included ? 'مضمّن — اضغط للاستبعاد' : 'مستبعد — اضغط للتضمين'}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors border ${f.included ? 'bg-emerald-500/20 text-emerald-400 border-emerald-700/40' : 'bg-red-500/10 text-red-400 border-red-700/30'}`}>
                            {f.included
                              ? <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                              : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            }
                          </button>
                          <input type="text" value={f.label} onChange={e => updateFeature('business', i, 'label', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/60" dir="rtl" placeholder="عربي" />
                          <input type="text" value={f.labelEn} onChange={e => updateFeature('business', i, 'labelEn', e.target.value)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/60" dir="ltr" placeholder="English" />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="flex items-center justify-between mt-5">
                  {pricingMsg && (
                    <span className={`text-sm font-medium ${pricingMsg.startsWith('✓') ? 'text-emerald-400' : 'text-red-400'}`}>
                      {pricingMsg}
                    </span>
                  )}
                  <button
                    onClick={handleSavePricing}
                    disabled={pricingSaving}
                    className="mr-auto py-2.5 px-6 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
                  >
                    {pricingSaving ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    حفظ الأسعار كاملاً
                  </button>
                </div>
              </div>

              {/* n8n Webhooks */}
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">n8n Webhooks</h3>
                    <p className="text-slate-400 text-xs">روابط الـ webhook الخاصة بـ n8n</p>
                  </div>
                </div>

                {/* Header row */}
                <div className="grid grid-cols-[200px_1fr_80px] gap-3 mb-2 px-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Key</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Value</span>
                  <span />
                </div>

                <div className="space-y-3">
                  {N8N_KEYS.map(({ key, label }) => (
                    <div key={key} className="grid grid-cols-[200px_1fr_80px] gap-3 items-center">
                      {/* Key */}
                      <div className="bg-slate-900 rounded-xl px-3 py-2.5 border border-slate-700">
                        <p className="text-xs font-mono text-orange-400 truncate">{key}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate">{label}</p>
                      </div>
                      {/* Value */}
                      <input
                        type="text"
                        value={n8nEditing[key] ?? ''}
                        onChange={e => setN8nEditing(s => ({ ...s, [key]: e.target.value }))}
                        placeholder="https://..."
                        dir="ltr"
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition"
                      />
                      {/* Save button */}
                      <button
                        onClick={() => handleSaveN8n(key)}
                        disabled={n8nSaving[key] || n8nEditing[key] === n8nSettings[key]}
                        className="py-2.5 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-1"
                      >
                        {n8nSaving[key] ? (
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                        ) : n8nMsg[key] ? (
                          <span className="text-green-300">✓</span>
                        ) : 'حفظ'}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-slate-600 text-xs mt-4 text-center font-mono">انسخ الـ Key والـ Value لاستخدامها في Vercel Environment Variables</p>
              </div>
              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h3 className="font-bold text-white mb-1">معلومات حساب الأدمن</h3>
                <p className="text-slate-400 text-sm mb-5">بيانات الدخول الخاصة بك كمشرف للنظام</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <span className="text-slate-400 text-sm">اسم المستخدم</span>
                    <span className="text-white font-medium">{admin?.username}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <span className="text-slate-400 text-sm">الدور</span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">مشرف النظام</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-400 text-sm">كلمة المرور</span>
                    <span className="text-slate-500 text-sm">••••••••••</span>
                  </div>
                </div>
                <button onClick={() => setShowPassModal(true)}
                  className="mt-5 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  تغيير كلمة المرور
                </button>
              </div>

              <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h3 className="font-bold text-white mb-1">إحصائيات النظام</h3>
                <p className="text-slate-400 text-sm mb-5">ملخص سريع عن حالة المنصة</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'المستخدمون', value: stats?.users },
                    { label: 'السير الذاتية', value: stats?.cvs },
                    { label: 'طلبات الدفع', value: (stats?.pendingPayments || 0) + (stats?.approvedPayments || 0) },
                    { label: 'طلبات الأعمال', value: stats?.businessContacts },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-700/50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-white">{item.value ?? '—'}</p>
                      <p className="text-xs text-slate-400 mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {showPassModal && <ChangePasswordModal onClose={() => setShowPassModal(false)} />}
      {receiptUrl && <ReceiptModal url={receiptUrl} onClose={() => setReceiptUrl(null)} />}
    </div>
  );
};

export default AdminDashboardPage;
