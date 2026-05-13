import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const REVIEW_WEBHOOK = 'https://ahmed144.app.n8n.cloud/webhook-test/b091e0d0-e2ed-4429-b40d-628e66276696';

const TEMPLATE_COLORS = {
  modern: { from: '#4f46e5', to: '#818cf8' },
  classic: { from: '#1e3a5f', to: '#2563eb' },
  creative: { from: '#7c3aed', to: '#c026d3' },
  minimal: { from: '#374151', to: '#6b7280' },
  executive: { from: '#0f766e', to: '#14b8a6' },
  professional: { from: '#b45309', to: '#f59e0b' },
  elegant: { from: '#be185d', to: '#f43f5e' },
  tech: { from: '#0369a1', to: '#38bdf8' },
  arabic: { from: '#065f46', to: '#10b981' },
};
const getColors = (t) => TEMPLATE_COLORS[t?.toLowerCase()] || TEMPLATE_COLORS.modern;

function ScoreRing({ score, size = 80, stroke = 7 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const fill = circ * (1 - (score || 0) / 100);
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={fill}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
}

function ScoreCard({ label, score, icon, isRTL }) {
  const color = score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-500' : 'text-red-500';
  const bg = score >= 80 ? 'bg-emerald-50' : score >= 60 ? 'bg-amber-50' : 'bg-red-50';
  return (
    <div className={`rounded-2xl p-4 flex flex-col items-center gap-2 ${bg}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="relative flex items-center justify-center">
        <ScoreRing score={score} size={72} stroke={6} />
        <span className={`absolute text-lg font-black ${color}`}>{score}</span>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-slate-600">{icon} {label}</p>
      </div>
    </div>
  );
}

function Suggestion({ type, text, isRTL }) {
  const styles = {
    positive: { bg: 'bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500', icon: '✓' },
    warning: { bg: 'bg-amber-50 border-amber-100', dot: 'bg-amber-400', icon: '!' },
    critical: { bg: 'bg-red-50 border-red-100', dot: 'bg-red-500', icon: '✕' },
    tip: { bg: 'bg-indigo-50 border-indigo-100', dot: 'bg-indigo-500', icon: '→' },
  };
  const s = styles[type] || styles.tip;
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${s.bg} text-sm`} dir={isRTL ? 'rtl' : 'ltr'}>
      <span className={`mt-0.5 w-5 h-5 rounded-full ${s.dot} flex items-center justify-center text-white text-xs flex-shrink-0`}>{s.icon}</span>
      <p className="text-slate-700 leading-relaxed">{text}</p>
    </div>
  );
}

export default function CVReviewView({ isRTL, onBack }) {
  const navigate = useNavigate();
  const [cvs, setCvs] = useState([]);
  const [loadingCVs, setLoadingCVs] = useState(true);
  const [selectedCV, setSelectedCV] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('review');

  useEffect(() => {
    fetch('/api/cvs', { credentials: 'include' })
      .then(r => r.json())
      .then(data => { setCvs(Array.isArray(data) ? data : []); setLoadingCVs(false); })
      .catch(() => setLoadingCVs(false));
  }, []);

  const buildCVSummary = (cv) => {
    const d = cv.data || {};
    const parts = [];
    if (d.personalInfo) {
      const p = d.personalInfo;
      if (p.fullName) parts.push(`الاسم: ${p.fullName}`);
      if (p.jobTitle) parts.push(`المسمى الوظيفي: ${p.jobTitle}`);
      if (p.email) parts.push(`البريد: ${p.email}`);
      if (p.phone) parts.push(`الهاتف: ${p.phone}`);
      if (p.city || p.country) parts.push(`الموقع: ${[p.city, p.country].filter(Boolean).join(', ')}`);
      if (p.summary) parts.push(`الملخص المهني: ${p.summary}`);
    }
    if (d.experience?.length) {
      parts.push(`\nالخبرة العملية (${d.experience.length} وظيفة):`);
      d.experience.forEach((e, i) => {
        parts.push(`${i + 1}. ${e.jobTitle || ''} في ${e.company || ''} (${e.startDate || ''} - ${e.endDate || e.current ? 'الحاضر' : ''})`);
        if (e.description) parts.push(`   الوصف: ${e.description}`);
      });
    }
    if (d.education?.length) {
      parts.push(`\nالتعليم (${d.education.length} درجة):`);
      d.education.forEach((e, i) => {
        parts.push(`${i + 1}. ${e.degree || ''} في ${e.institution || ''} (${e.graduationYear || ''})`);
      });
    }
    if (d.skills?.length) {
      const skillList = d.skills.map(s => typeof s === 'string' ? s : s.name || '').filter(Boolean);
      parts.push(`\nالمهارات: ${skillList.join(', ')}`);
    }
    if (d.languages?.length) {
      const langList = d.languages.map(l => `${l.name || l} (${l.level || ''})`).filter(Boolean);
      parts.push(`اللغات: ${langList.join(', ')}`);
    }
    if (d.certifications?.length) {
      parts.push(`الشهادات: ${d.certifications.map(c => c.name || c).join(', ')}`);
    }
    return parts.join('\n');
  };

  const analyzeCV = async () => {
    if (!selectedCV) return;
    setAnalyzing(true);
    setResult(null);
    setError('');

    const summary = buildCVSummary(selectedCV);

    try {
      const res = await fetch(REVIEW_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvName: selectedCV.name,
          template: selectedCV.template,
          cvData: selectedCV.data,
          cvSummary: summary,
          language: isRTL ? 'ar' : 'en',
          action: 'review',
        }),
      });

      let parsed = null;
      if (res.ok) {
        try {
          const raw = await res.json();
          parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
          if (parsed?.output) {
            try { parsed = JSON.parse(parsed.output); } catch { parsed = { feedback: parsed.output }; }
          }
        } catch {
          parsed = null;
        }
      }

      if (parsed && (parsed.scores || parsed.suggestions || parsed.feedback || parsed.overallScore !== undefined)) {
        setResult(parsed);
      } else {
        setResult(generateLocalReview(selectedCV, isRTL));
      }
    } catch {
      setResult(generateLocalReview(selectedCV, isRTL));
    } finally {
      setAnalyzing(false);
    }
  };

  const generateLocalReview = (cv, rtl) => {
    const d = cv.data || {};
    const scores = {
      overall: 0,
      ats: 0,
      completeness: 0,
      language: 0,
      design: 0,
    };
    const suggestions = [];

    let totalFields = 0, filledFields = 0;
    const p = d.personalInfo || {};
    ['fullName', 'jobTitle', 'email', 'phone', 'summary', 'city'].forEach(f => {
      totalFields++;
      if (p[f]) filledFields++;
    });
    if (!p.summary) suggestions.push({ type: 'critical', text: rtl ? 'الملخص المهني مفقود — أضف ملخصاً قوياً يبرز قيمتك للمُوظِّف.' : 'Professional summary is missing — add a strong summary to highlight your value.' });
    if (!p.phone) suggestions.push({ type: 'warning', text: rtl ? 'رقم الهاتف غير موجود — تأكد من إضافة معلومات التواصل كاملة.' : 'Phone number is missing — make sure all contact info is complete.' });
    if (p.summary && p.summary.length < 50) suggestions.push({ type: 'warning', text: rtl ? 'الملخص المهني قصير جداً — اجعله بين 80-120 كلمة لأفضل تأثير.' : 'Professional summary is too short — aim for 80-120 words for best impact.' });
    if (p.summary && p.summary.length >= 80) suggestions.push({ type: 'positive', text: rtl ? 'الملخص المهني ممتاز من حيث الطول والتفصيل.' : 'Professional summary has great length and detail.' });

    const exp = d.experience || [];
    totalFields += 3; if (exp.length > 0) filledFields += 3;
    if (exp.length === 0) suggestions.push({ type: 'critical', text: rtl ? 'لا توجد خبرات عمل — أضف خبراتك حتى لو كانت تدريبية أو تطوعية.' : 'No work experience added — include internships or volunteer work if applicable.' });
    if (exp.length >= 2) suggestions.push({ type: 'positive', text: rtl ? `ممتاز! لديك ${exp.length} خبرات عمل مسجّلة.` : `Great! You have ${exp.length} work experiences listed.` });
    exp.forEach((e, i) => {
      if (!e.description || e.description.length < 30) suggestions.push({ type: 'warning', text: rtl ? `وصف الوظيفة "${e.jobTitle || (i + 1)}" غير كافٍ — أضف إنجازات وأرقاماً محددة.` : `Job description for "${e.jobTitle || (i + 1)}" is too brief — add achievements and metrics.` });
    });

    const edu = d.education || [];
    totalFields += 2; if (edu.length > 0) filledFields += 2;
    if (edu.length === 0) suggestions.push({ type: 'warning', text: rtl ? 'لا يوجد قسم تعليم — حتى الدورات التدريبية مهمة.' : 'No education section — even training courses matter.' });

    const skills = d.skills || [];
    totalFields += 2;
    if (skills.length > 5) filledFields += 2;
    else if (skills.length > 0) filledFields += 1;
    if (skills.length < 5) suggestions.push({ type: 'warning', text: rtl ? `لديك ${skills.length} مهارات فقط — أضف المزيد من المهارات التقنية والشخصية (اهدف لـ 8-15).` : `Only ${skills.length} skills listed — add more technical and soft skills (aim for 8-15).` });
    if (skills.length >= 8) suggestions.push({ type: 'positive', text: rtl ? 'قسم المهارات قوي ومتنوع.' : 'Strong and diverse skills section.' });

    const langs = d.languages || [];
    if (langs.length === 0) suggestions.push({ type: 'tip', text: rtl ? 'أضف اللغات التي تتقنها — مهم جداً في سوق العمل الخليجي.' : 'Add languages you know — very important in Gulf job markets.' });
    if (langs.length >= 2) suggestions.push({ type: 'positive', text: rtl ? 'تعدد اللغات ميزة تنافسية ممتازة.' : 'Multilingual skills are a strong competitive advantage.' });

    if (cv.template && cv.template !== 'minimal') suggestions.push({ type: 'positive', text: rtl ? `القالب "${cv.template}" يعطي مظهراً احترافياً مميزاً.` : `The "${cv.template}" template gives a distinctive professional look.` });
    suggestions.push({ type: 'tip', text: rtl ? 'استخدم كلمات مفتاحية من الوصف الوظيفي المستهدف لتجاوز فلاتر ATS.' : 'Use keywords from your target job description to pass ATS filters.' });
    suggestions.push({ type: 'tip', text: rtl ? 'احرص على أن يكون طول السيرة الذاتية صفحة واحدة إن كانت خبرتك أقل من 5 سنوات.' : 'Keep your CV to one page if you have less than 5 years of experience.' });

    scores.completeness = Math.round((filledFields / totalFields) * 100);
    scores.ats = Math.max(30, Math.min(95, scores.completeness - 5 + (skills.length >= 5 ? 10 : 0) + (exp.length >= 1 ? 5 : 0)));
    scores.language = p.summary ? Math.min(95, 65 + Math.min(30, Math.floor(p.summary.length / 10))) : 50;
    scores.design = cv.template ? 82 : 60;
    scores.overall = Math.round((scores.completeness + scores.ats + scores.language + scores.design) / 4);

    return {
      overallScore: scores.overall,
      scores: {
        ats: scores.ats,
        completeness: scores.completeness,
        language: scores.language,
        design: scores.design,
      },
      suggestions: suggestions.slice(0, 10),
      summary: rtl
        ? `تم تحليل سيرتك الذاتية "${cv.name}" بنجاح. النتيجة الإجمالية ${scores.overall}/100.`
        : `CV "${cv.name}" analyzed successfully. Overall score: ${scores.overall}/100.`,
    };
  };

  const tabs = [
    { key: 'review', label: isRTL ? '🔍 اختبار السيرة' : '🔍 CV Review' },
    { key: 'improve', label: isRTL ? '✨ تحسين السيرة' : '✨ Improve CV' },
    { key: 'tips', label: isRTL ? '💡 نصائح احترافية' : '💡 Pro Tips' },
  ];

  return (
    <div className="min-h-screen" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
          </svg>
          {isRTL ? 'العودة' : 'Back'}
        </button>
        <div className="h-4 w-px bg-slate-200" />
        <span className="text-sm font-bold text-slate-800">{isRTL ? 'مركز تحليل وتحسين السيرة الذاتية' : 'CV Analysis & Improvement Center'}</span>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 px-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                tab === t.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* ══════════════ TAB: REVIEW ══════════════ */}
        {tab === 'review' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">
                {isRTL ? 'اختبر سيرتك الذاتية' : 'Test Your CV'}
              </h2>
              <p className="text-slate-500 text-sm">
                {isRTL
                  ? 'اختر سيرتك الذاتية وسنحللها ونعطيك نتائج تفصيلية ونقاطاً قابلة للتحسين'
                  : 'Select your CV and we\'ll analyze it with detailed scores and actionable improvements'}
              </p>
            </div>

            {/* CV selector */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black">1</span>
                {isRTL ? 'اختر السيرة الذاتية للتحليل' : 'Select a CV to Analyze'}
              </h3>

              {loadingCVs ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
              ) : cvs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm mb-3">{isRTL ? 'لا توجد سير ذاتية بعد' : 'No CVs yet'}</p>
                  <button
                    onClick={() => navigate('/builder')}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    {isRTL ? 'إنشاء سيرة ذاتية' : 'Create a CV'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {cvs.map(cv => {
                    const colors = getColors(cv.template);
                    const sel = selectedCV?.id === cv.id;
                    return (
                      <button
                        key={cv.id}
                        onClick={() => { setSelectedCV(cv); setResult(null); setError(''); }}
                        className={`rounded-2xl border-2 transition-all overflow-hidden text-start ${
                          sel ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="h-14 relative" style={{ background: `linear-gradient(135deg,${colors.from},${colors.to})` }}>
                          {sel && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold text-slate-800 truncate">{cv.name}</p>
                          <p className="text-xs text-slate-400 capitalize">{cv.template}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Analyze button */}
            {selectedCV && !result && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-4 text-sm flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black">2</span>
                  {isRTL ? 'ابدأ التحليل' : 'Start Analysis'}
                </h3>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-5">
                  <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: `linear-gradient(135deg,${getColors(selectedCV.template).from},${getColors(selectedCV.template).to})` }} />
                  <div>
                    <p className="font-semibold text-slate-800">{selectedCV.name}</p>
                    <p className="text-xs text-slate-400 capitalize">{isRTL ? 'القالب:' : 'Template:'} {selectedCV.template}</p>
                  </div>
                </div>
                <button
                  onClick={analyzeCV}
                  disabled={analyzing}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  style={{ background: analyzing ? '#6366f1' : 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
                >
                  {analyzing ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {isRTL ? 'جاري التحليل...' : 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      {isRTL ? '🔍 تحليل السيرة الذاتية' : '🔍 Analyze CV'}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Results */}
            {result && (
              <div className="space-y-5 animate-in fade-in duration-500">
                {/* Overall score */}
                <div
                  className="rounded-2xl p-6 text-white relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
                >
                  <div className="absolute top-0 end-0 w-48 h-48 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4" />
                  <div className="relative flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                      <ScoreRing score={result.overallScore} size={100} stroke={9} />
                      <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white">{result.overallScore}</span>
                    </div>
                    <div>
                      <p className="text-white/70 text-sm mb-1">{isRTL ? 'النتيجة الإجمالية' : 'Overall Score'}</p>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {result.overallScore >= 80 ? (isRTL ? 'ممتاز! 🌟' : 'Excellent! 🌟')
                          : result.overallScore >= 60 ? (isRTL ? 'جيد 👍' : 'Good 👍')
                          : (isRTL ? 'يحتاج تحسين 📝' : 'Needs Improvement 📝')}
                      </h3>
                      <p className="text-white/65 text-xs leading-relaxed">{result.summary}</p>
                    </div>
                  </div>
                </div>

                {/* Score breakdown */}
                {result.scores && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h3 className="font-bold text-slate-800 mb-4 text-sm">{isRTL ? 'تفاصيل النقاط' : 'Score Breakdown'}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <ScoreCard label={isRTL ? 'توافق ATS' : 'ATS Match'} score={result.scores.ats ?? 0} icon="🤖" isRTL={isRTL} />
                      <ScoreCard label={isRTL ? 'الاكتمال' : 'Completeness'} score={result.scores.completeness ?? 0} icon="📋" isRTL={isRTL} />
                      <ScoreCard label={isRTL ? 'اللغة' : 'Language'} score={result.scores.language ?? 0} icon="✍️" isRTL={isRTL} />
                      <ScoreCard label={isRTL ? 'التصميم' : 'Design'} score={result.scores.design ?? 0} icon="🎨" isRTL={isRTL} />
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions?.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h3 className="font-bold text-slate-800 mb-4 text-sm">{isRTL ? 'التوصيات والملاحظات' : 'Recommendations & Feedback'}</h3>
                    <div className="space-y-2.5">
                      {result.suggestions.map((s, i) => (
                        <Suggestion key={i} type={s.type} text={s.text} isRTL={isRTL} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback text */}
                {result.feedback && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                    <h3 className="font-bold text-slate-800 mb-3 text-sm">{isRTL ? 'التقييم التفصيلي' : 'Detailed Feedback'}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{result.feedback}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={() => navigate(`/builder/${selectedCV.id}`)}
                    className="flex-1 py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {isRTL ? 'تحسين السيرة الآن' : 'Improve CV Now'}
                  </button>
                  <button
                    onClick={() => { setResult(null); setSelectedCV(null); }}
                    className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors"
                  >
                    {isRTL ? 'تحليل سيرة أخرى' : 'Analyze Another'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════ TAB: IMPROVE ══════════════ */}
        {tab === 'improve' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{isRTL ? 'تحسين سيرتك الذاتية' : 'Improve Your CV'}</h2>
              <p className="text-slate-500 text-sm">{isRTL ? 'اختر أي سيرة ذاتية وانتقل مباشرة لتحريرها وتحسينها' : 'Select any CV and jump directly to editing and improving it'}</p>
            </div>
            {loadingCVs ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2].map(i => <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />)}
              </div>
            ) : cvs.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
                <p className="text-slate-400 mb-4">{isRTL ? 'لا توجد سير ذاتية بعد' : 'No CVs yet'}</p>
                <button
                  onClick={() => navigate('/builder')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
                >
                  {isRTL ? 'إنشاء سيرة ذاتية جديدة' : 'Create New CV'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cvs.map(cv => {
                  const colors = getColors(cv.template);
                  return (
                    <div key={cv.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                      <div className="h-16 relative" style={{ background: `linear-gradient(135deg,${colors.from},${colors.to})` }}>
                        <div className="absolute inset-0 flex flex-col justify-center gap-1 px-6 opacity-40">
                          <div className="h-2 bg-white rounded-full w-2/5" />
                          <div className="h-1.5 bg-white rounded-full w-1/3" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-slate-800 mb-1">{cv.name}</h4>
                        <p className="text-xs text-slate-400 mb-4 capitalize">{isRTL ? 'القالب:' : 'Template:'} {cv.template}</p>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => navigate(`/builder/${cv.id}`)}
                            className="py-2.5 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1"
                            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)' }}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            {isRTL ? 'تحرير وتحسين' : 'Edit & Improve'}
                          </button>
                          <button
                            onClick={() => { setSelectedCV(cv); setTab('review'); setResult(null); }}
                            className="py-2.5 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-semibold flex items-center justify-center gap-1 hover:bg-indigo-100 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            {isRTL ? 'تحليل' : 'Analyze'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <button
                  onClick={() => navigate('/builder')}
                  className="bg-white rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center gap-2 p-8 text-slate-400 hover:text-indigo-600"
                >
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-sm font-semibold">{isRTL ? 'سيرة جديدة' : 'New CV'}</span>
                </button>
              </div>
            )}

            {/* Quick improvement tips */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="font-bold text-slate-800 mb-4 text-sm">{isRTL ? '⚡ خطوات التحسين السريع' : '⚡ Quick Improvement Steps'}</h3>
              <div className="space-y-3">
                {[
                  { step: '01', title: isRTL ? 'أضف ملخصاً مهنياً قوياً' : 'Add a Strong Professional Summary', desc: isRTL ? 'اكتب 3-4 جمل تبرز قيمتك وخبرتك وأهدافك المهنية' : 'Write 3-4 sentences highlighting your value and career goals' },
                  { step: '02', title: isRTL ? 'استخدم أفعالاً قوية' : 'Use Action Verbs', desc: isRTL ? 'ابدأ وصف كل خبرة بأفعال مثل: قدت، طورت، حققت، نفذت' : 'Start each experience with verbs like: led, developed, achieved, implemented' },
                  { step: '03', title: isRTL ? 'أضف الأرقام والإنجازات' : 'Add Numbers & Achievements', desc: isRTL ? 'مثال: "زدت المبيعات بنسبة 30%" أفضل من "حسّنت المبيعات"' : 'E.g. "Increased sales by 30%" beats "improved sales"' },
                  { step: '04', title: isRTL ? 'طابق الكلمات المفتاحية' : 'Match Keywords', desc: isRTL ? 'انسخ الكلمات المفتاحية من الوصف الوظيفي إلى سيرتك الذاتية' : 'Copy keywords from the job description into your CV' },
                  { step: '05', title: isRTL ? 'احذف المعلومات الغير ضرورية' : 'Remove Unnecessary Info', desc: isRTL ? 'لا تضع الصورة الشخصية، تاريخ الميلاد، أو الحالة الاجتماعية للوظائف الغربية' : 'Skip photo, date of birth, marital status for Western jobs' },
                ].map(item => (
                  <div key={item.step} className="flex gap-4 items-start">
                    <span className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black flex-shrink-0">{item.step}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ TAB: TIPS ══════════════ */}
        {tab === 'tips' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{isRTL ? 'نصائح احترافية' : 'Professional Tips'}</h2>
              <p className="text-slate-500 text-sm">{isRTL ? 'أسرار خبراء التوظيف لسيرة ذاتية تفوز بالمقابلة' : 'Recruitment experts\' secrets to a CV that wins interviews'}</p>
            </div>

            {[
              {
                emoji: '🎯', title: isRTL ? 'خصّص سيرتك لكل وظيفة' : 'Tailor Your CV for Each Job',
                tips: isRTL
                  ? ['لا ترسل نفس السيرة لكل وظيفة', 'اقرأ الوصف الوظيفي جيداً واستخدم كلماته', 'رتّب الخبرات حسب أهميتها للوظيفة المستهدفة']
                  : ['Never send the same CV to every job', 'Read the JD carefully and use its language', 'Order experiences by relevance to the target role'],
              },
              {
                emoji: '🤖', title: isRTL ? 'اجتز فلاتر ATS' : 'Pass ATS Filters',
                tips: isRTL
                  ? ['استخدم عناوين أقسام قياسية (الخبرة، التعليم، المهارات)', 'تجنب الجداول والأعمدة المعقدة في التنسيق', 'أضف الكلمات المفتاحية من الوصف الوظيفي بشكل طبيعي']
                  : ['Use standard section headings (Experience, Education, Skills)', 'Avoid complex tables and multi-column layouts', 'Add keywords from the JD naturally in context'],
              },
              {
                emoji: '✍️', title: isRTL ? 'اكتب بشكل مقنع' : 'Write Persuasively',
                tips: isRTL
                  ? ['ابدأ كل نقطة بفعل قوي (قاد، طوّر، حقق، نفّذ)', 'أضف أرقاماً ونسبة مئوية كلما أمكن', 'ركّز على الإنجازات لا على المهام']
                  : ['Start each bullet with a strong verb (led, built, achieved)', 'Add numbers and percentages whenever possible', 'Focus on achievements, not just duties'],
              },
              {
                emoji: '📐', title: isRTL ? 'التصميم المثالي' : 'Perfect Design',
                tips: isRTL
                  ? ['اجعل السيرة صفحة واحدة إن كانت خبرتك أقل من 5 سنوات', 'استخدم خط واضح بحجم 10-12pt', 'اترك مساحات بيضاء كافية لسهولة القراءة']
                  : ['Keep to 1 page if under 5 years of experience', 'Use a clear font at 10-12pt size', 'Leave enough white space for easy reading'],
              },
              {
                emoji: '🌟', title: isRTL ? 'للسوق الخليجي خصوصاً' : 'Specifically for Gulf Market',
                tips: isRTL
                  ? ['اذكر الجنسية والتأشيرة الحالية إن كنت خارج الدولة', 'المهارات اللغوية مهمة جداً — اذكر مستواك بدقة', 'الشهادات والدورات التدريبية تزيد فرصك كثيراً']
                  : ['Mention nationality and current visa if outside the country', 'Language skills are very important — be precise about your level', 'Certifications and training courses greatly boost your chances'],
              },
            ].map(section => (
              <div key={section.title} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">{section.emoji}</span>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
