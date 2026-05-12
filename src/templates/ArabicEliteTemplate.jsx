import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

/* ─── labels ─────────────────────────────────────────────────── */
const L = {
  summary:      'نبذة علي',
  experience:   'خبرات العمل',
  education:    'الدراسة',
  skills:       'المهارات',
  languages:    'اللغات',
  interests:    'الاهتمامات',
  contact:      'معلومات التواصل',
  projects:     'المشاريع',
  certificates: 'الشهادات',
  courses:      'الدورات',
  awards:       'الجوائز',
  organisations:'المنظمات',
  publications: 'المنشورات',
  references:   'المراجع',
  present:      'حتى الآن',
};

const DARK = '#1b3747';
const SIDEBAR_W = 236;

/* ─── Section heading used in the WHITE main area ────────────── */
/*  Visual (RTL): [─── LINE ─────] [TEXT] [●CIRCLE]              */
const MainHeading = ({ label, accent }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '7pt',
    direction: 'rtl', marginBottom: '9pt', marginTop: '13pt',
    ...BREAK_HEADING,
  }}>
    {/* circle icon — first in DOM → appears on RIGHT in RTL flex */}
    <div style={{
      width: '22pt', height: '22pt', borderRadius: '50%',
      backgroundColor: accent, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: '#fff' }} />
    </div>
    {/* heading text */}
    <div style={{ fontSize: '11pt', fontWeight: '700', color: '#1a202c', whiteSpace: 'nowrap' }}>
      {label}
    </div>
    {/* line fills remaining space on the LEFT */}
    <div style={{ flex: 1, height: '1.5px', backgroundColor: '#cde6ec' }} />
  </div>
);

/* ─── Sidebar section title ───────────────────────────────────── */
const SbHeading = ({ label }) => (
  <div style={{
    fontSize: '9pt', fontWeight: '700', color: '#fff',
    textAlign: 'center', letterSpacing: '0.04em',
    borderBottom: '1px solid rgba(255,255,255,0.22)',
    paddingBottom: '4pt', marginBottom: '8pt', marginTop: '14pt',
    ...BREAK_HEADING,
  }}>{label}</div>
);

/* ─── Contact row: icon (LEFT) + text (RIGHT) ────────────────── */
const ContactRow = ({ icon, text }) => (
  <div style={{
    display: 'flex', flexDirection: 'row', alignItems: 'center',
    gap: '7pt', marginBottom: '7pt', direction: 'ltr',
  }}>
    {/* icon circle */}
    <div style={{
      width: '20pt', height: '20pt', borderRadius: '50%', flexShrink: 0,
      border: '1.5px solid rgba(255,255,255,0.35)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '8pt', color: 'rgba(255,255,255,0.9)',
    }}>
      {icon}
    </div>
    {/* text */}
    <span style={{ fontSize: '8.5pt', color: 'rgba(255,255,255,0.88)', wordBreak: 'break-all', lineHeight: 1.3 }}>
      {text}
    </span>
  </div>
);

/* ─── 5-Star rating ───────────────────────────────────────────── */
const Stars = ({ level = 3 }) => {
  const n = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '2pt' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? '#f5c518' : 'rgba(255,255,255,0.2)', fontSize: '10pt', lineHeight: 1 }}>
          ★
        </span>
      ))}
    </div>
  );
};

/* ─── Circular language gauge ─────────────────────────────────── */
const LangGauge = ({ pct = 75, label, accent }) => {
  const r = 20, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3pt' }}>
      <svg width="52" height="52" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
        <circle
          cx="26" cy="26" r={r} fill="none"
          stroke={accent} strokeWidth="4"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
        />
        <text x="26" y="31" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{pct}</text>
      </svg>
      <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>{label}</div>
    </div>
  );
};

/* ─── Interest box ────────────────────────────────────────────── */
const InterestBox = ({ label }) => (
  <div style={{
    border: '1px solid rgba(255,255,255,0.25)', borderRadius: '5pt',
    padding: '5pt 7pt', fontSize: '8pt', color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.08)', textAlign: 'center',
  }}>
    {label}
  </div>
);

/* ═══════════════════════════════════════════════════════════════ */
const DEFAULT_ORDER = [
  'summary','experience','education','projects','publications','references',
  'skills','languages','certificates','courses','awards','interests','organisations',
];
const SIDEBAR_KEYS = new Set(['skills','languages','interests','courses','awards','certificates','organisations','publications','references']);
const MAIN_KEYS    = new Set(['summary','experience','education','projects']);

const ArabicEliteTemplate = ({
  data, theme,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent = theme?.primaryColor || '#2a8e9e';
  const { sz, font, lineHeight } = resolveTheme(theme, true);
  const show = k => visibleSections[k] !== false;
  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const initials = (info.fullName || '').split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('');

  const contactItems = [
    vis.phone     !== false && info.phone     && { icon: '📞', text: info.phone     },
    vis.email     !== false && info.email     && { icon: '✉',  text: info.email     },
    vis.location  !== false && info.location  && { icon: '📍', text: info.location  },
    vis.portfolio !== false && info.portfolio && { icon: '🌐', text: info.portfolio  },
    vis.linkedin  !== false && info.linkedin  && { icon: 'in', text: info.linkedin  },
  ].filter(Boolean);

  /* ── SIDEBAR sections ───────────────────────────────────────── */
  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch (key) {

      case 'skills': return data.skills?.length > 0 ? (
        <div key="skills" style={BREAK_ITEM}>
          <SbHeading label={L.skills} />
          {data.skills.map((sk, i) => (
            <div key={i} style={{ marginBottom: '8pt', direction: 'rtl' }}>
              <div style={{ fontSize: '9pt', color: '#fff', textAlign: 'right', marginBottom: '3pt' }}>
                {typeof sk === 'string' ? sk : (sk.name || sk)}
              </div>
              <Stars level={typeof sk === 'object' ? (sk.level || 3) : 3} />
            </div>
          ))}
        </div>
      ) : null;

      case 'languages': return data.languages?.length > 0 ? (
        <div key="languages" style={BREAK_ITEM}>
          <SbHeading label={L.languages} />
          <div style={{ display: 'flex', flexDirection: 'row', gap: '6pt', flexWrap: 'wrap', justifyContent: 'center' }}>
            {data.languages.map((l, i) => {
              const map = { native:100, fluent:90, advanced:80, 'upper-intermediate':75, intermediate:65, elementary:45, beginner:35 };
              const pct = l.proficiency
                ? Math.round(l.proficiency * 20)
                : map[(l.level || '').toLowerCase()] ?? 75;
              const shortName = (l.name || '').slice(0, 2).toUpperCase();
              return <LangGauge key={i} pct={pct} label={shortName} accent={accent} />;
            })}
          </div>
        </div>
      ) : null;

      case 'interests': return data.interests?.length > 0 ? (
        <div key="interests" style={BREAK_ITEM}>
          <SbHeading label={L.interests} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5pt' }}>
            {data.interests.map((item, i) => (
              <InterestBox key={i} label={item.name || item} />
            ))}
          </div>
        </div>
      ) : null;

      case 'certificates':
      case 'courses': {
        const items = data[key];
        if (!items?.length) return null;
        return (
          <div key={key} style={BREAK_ITEM}>
            <SbHeading label={L[key] || key} />
            {items.map((c, i) => (
              <div key={i} style={{ marginBottom: '6pt', textAlign: 'right', direction: 'rtl' }}>
                <div style={{ fontSize: '8.5pt', color: '#fff', fontWeight: '600' }}>{c.name || c.title || c}</div>
                {(c.institution || c.issuer) && <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.55)' }}>{c.institution || c.issuer}</div>}
              </div>
            ))}
          </div>
        );
      }

      case 'awards': return data.awards?.length > 0 ? (
        <div key="awards" style={BREAK_ITEM}>
          <SbHeading label={L.awards} />
          {data.awards.map((a, i) => (
            <div key={i} style={{ fontSize: '8.5pt', color: '#fff', textAlign: 'right', direction: 'rtl', marginBottom: '5pt' }}>
              {a.title || a.name || a}
            </div>
          ))}
        </div>
      ) : null;

      case 'organisations': return data.organisations?.length > 0 ? (
        <div key="organisations" style={BREAK_ITEM}>
          <SbHeading label={L.organisations} />
          {data.organisations.map((o, i) => (
            <div key={i} style={{ fontSize: '8.5pt', color: 'rgba(255,255,255,0.85)', textAlign: 'right', direction: 'rtl', marginBottom: '4pt' }}>
              {o.name || o}
            </div>
          ))}
        </div>
      ) : null;

      default: return null;
    }
  };

  /* ── MAIN sections ──────────────────────────────────────────── */
  const renderMain = (key) => {
    if (!show(key)) return null;
    switch (key) {

      case 'summary': return info.summary ? (
        <div key="summary" style={BREAK_ITEM}>
          <MainHeading label={L.summary} accent={accent} />
          <div style={{ fontSize: sz.body, color: '#444', lineHeight, textAlign: 'right', whiteSpace: 'pre-line', direction: 'rtl' }}>
            {info.summary}
          </div>
        </div>
      ) : null;

      case 'experience': return data.experience?.length > 0 ? (
        <div key="experience">
          <MainHeading label={L.experience} accent={accent} />
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '11pt', ...BREAK_ITEM }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6pt', direction: 'rtl' }}>
                <div style={{ fontSize: sz.body, fontWeight: '700', color: '#1a202c', flex: 1, textAlign: 'right' }}>
                  {e.jobTitle}
                </div>
                <div style={{ fontSize: '8.5pt', color: '#888', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {e.startDate}{e.endDate || e.current ? ` - ${e.current ? L.present : e.endDate}` : ''}
                </div>
              </div>
              <div style={{ fontSize: '8.5pt', color: accent, fontWeight: '600', textAlign: 'right', direction: 'rtl', marginBottom: '2pt' }}>
                {e.company}{e.location ? ` · ${e.location}` : ''}
              </div>
              {e.description && (
                <div style={{ fontSize: sz.body, color: '#555', lineHeight, textAlign: 'right', whiteSpace: 'pre-line', direction: 'rtl' }}>
                  {e.description}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null;

      case 'education': return data.education?.length > 0 ? (
        <div key="education">
          <MainHeading label={L.education} accent={accent} />
          {data.education.map((e, i) => (
            <div key={i} style={{ marginBottom: '11pt', ...BREAK_ITEM }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6pt', direction: 'rtl' }}>
                <div style={{ fontSize: sz.body, fontWeight: '700', color: '#1a202c', flex: 1, textAlign: 'right' }}>
                  {e.degree}
                </div>
                <div style={{ fontSize: '8.5pt', color: '#888', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {e.startDate}{e.endDate ? ` - ${e.endDate}` : ''}
                </div>
              </div>
              <div style={{ fontSize: '8.5pt', color: accent, fontWeight: '600', textAlign: 'right', direction: 'rtl', marginBottom: '2pt' }}>
                {e.institution}{e.location ? ` · ${e.location}` : ''}
              </div>
              {e.description && (
                <div style={{ fontSize: sz.body, color: '#555', lineHeight, textAlign: 'right', whiteSpace: 'pre-line', direction: 'rtl' }}>
                  {e.description}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null;

      case 'projects': return data.projects?.length > 0 ? (
        <div key="projects">
          <MainHeading label={L.projects} accent={accent} />
          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '11pt', ...BREAK_ITEM }}>
              <div style={{ fontSize: sz.body, fontWeight: '700', color: '#1a202c', textAlign: 'right', direction: 'rtl' }}>
                {p.title || p.name}
              </div>
              {p.link && <div style={{ fontSize: '8.5pt', color: accent, textAlign: 'right' }}>{p.link}</div>}
              {p.description && (
                <div style={{ fontSize: sz.body, color: '#555', lineHeight, textAlign: 'right', whiteSpace: 'pre-line', direction: 'rtl' }}>
                  {p.description}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null;

      default:
        if (key.startsWith('csec-') && data.customSections) {
          const sec = data.customSections.find(s => s.id === key);
          if (!sec || !sec.items?.length) return null;
          return (
            <div key={key}>
              <MainHeading label={sec.title} accent={accent} />
              {sec.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '10pt', ...BREAK_ITEM }}>
                  {item.title    && <div style={{ fontSize: sz.body, fontWeight:'700', color:'#1a202c', textAlign:'right', direction:'rtl' }}>{item.title}</div>}
                  {item.subtitle && <div style={{ fontSize:'8.5pt', color:accent, textAlign:'right', direction:'rtl' }}>{item.subtitle}</div>}
                  {item.description && <div style={{ fontSize: sz.body, color:'#555', lineHeight, textAlign:'right', direction:'rtl' }}>{item.description}</div>}
                </div>
              ))}
            </div>
          );
        }
        return null;
    }
  };

  const sideKeys = sectionOrder.filter(k => SIDEBAR_KEYS.has(k));
  const mainKeys = sectionOrder.filter(k => MAIN_KEYS.has(k));

  /* ═══════════════════════════ RENDER ══════════════════════════ */
  return (
    <div style={{
      fontFamily: font, fontSize: sz.body, color: '#1a202c',
      width: '794px', minHeight: '1122px',
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box',
    }}>

      {/* ══ FULL-WIDTH DARK HEADER ═══════════════════════════════ */}
      <div style={{
        backgroundColor: DARK,
        display: 'flex',
        flexDirection: 'row',   /* LTR: left=main-name, right=sidebar-photo */
        minHeight: '110pt',
        flexShrink: 0,
      }}>
        {/* LEFT portion of header — name & title */}
        <div style={{
          flex: 1,
          padding: '22pt 22pt 18pt 20pt',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          direction: 'rtl',
          textAlign: 'right',
          borderBottom: `3px solid ${accent}`,
        }}>
          <div style={{ fontSize: sz.name, fontWeight: '800', color: '#fff', lineHeight: 1.15, marginBottom: '5pt' }}>
            {info.fullName || 'الاسم الكامل'}
          </div>
          {info.jobTitle && (
            <div style={{ fontSize: sz.body, color: 'rgba(255,255,255,0.72)', fontStyle: 'italic' }}>
              {info.jobTitle}
            </div>
          )}
        </div>

        {/* RIGHT portion of header — profile photo */}
        <div style={{
          width: `${SIDEBAR_W}px`,
          flexShrink: 0,
          backgroundColor: DARK,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14pt 0',
        }}>
          <div style={{
            width: '75pt', height: '75pt', borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid rgba(255,255,255,0.4)',
            backgroundColor: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {info.photo ? (
              <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '20pt', fontWeight: '700', color: '#fff' }}>{initials}</span>
            )}
          </div>
        </div>
      </div>

      {/* ══ TWO-COLUMN BODY ══════════════════════════════════════ */}
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0 }}>

        {/* LEFT — white main content */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: '16pt 20pt 20pt 16pt',
          boxSizing: 'border-box',
          direction: 'rtl',
        }}>
          {mainKeys.map(k => renderMain(k))}
        </div>

        {/* RIGHT — dark sidebar */}
        <div style={{
          width: `${SIDEBAR_W}px`,
          flexShrink: 0,
          backgroundColor: DARK,
          padding: '14pt 12pt 20pt',
          boxSizing: 'border-box',
          direction: 'rtl',
        }}>
          {/* Contact info */}
          {contactItems.length > 0 && (
            <div style={BREAK_ITEM}>
              <SbHeading label={L.contact} />
              {contactItems.map((row, i) => (
                <ContactRow key={i} icon={row.icon} text={row.text} />
              ))}
            </div>
          )}

          {sideKeys.map(k => renderSidebar(k))}
        </div>
      </div>
    </div>
  );
};

export default ArabicEliteTemplate;
