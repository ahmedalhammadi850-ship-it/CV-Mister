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

const DARK    = '#1b3747';
const SIDEBAR_W = 238;

/* ─── SVG icons for section headings ─────────────────────────── */
const IconPerson = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="4" r="3" fill="#fff" />
    <path d="M1 13c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IconBriefcase = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="4" width="12" height="9" rx="1.5" stroke="#fff" strokeWidth="1.3" />
    <path d="M4.5 4V2.5A1.5 1.5 0 0 1 6 1h2a1.5 1.5 0 0 1 1.5 1.5V4" stroke="#fff" strokeWidth="1.3" />
    <line x1="1" y1="8" x2="13" y2="8" stroke="#fff" strokeWidth="1.1" />
  </svg>
);
const IconGraduation = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <path d="M7 2L1 5.5l6 3.5 6-3.5L7 2z" fill="#fff" />
    <path d="M4 7.5v3c0 1 1.3 2 3 2s3-1 3-2v-3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IconFolder = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <path d="M1 3h4l2 2h6v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3z" stroke="#fff" strokeWidth="1.3" />
  </svg>
);

const SECTION_ICON = {
  summary:    <IconPerson />,
  experience: <IconBriefcase />,
  education:  <IconGraduation />,
  projects:   <IconFolder />,
};

/* ─── SVG icons for contact items ────────────────────────────── */
const PhoneIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <path d="M3 1h3l1.5 3.5-2 1.2c.8 1.6 2.3 3.1 3.8 3.8l1.2-2L14 9v3c0 1.1-.9 1-2 .7C5 11 1 6 1 3c-.3-1.1-.1-2 1-2z" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" fill="none" />
  </svg>
);
const EmailIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="2.5" width="12" height="9" rx="1" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
    <path d="M1 3.5l6 4.5 6-4.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
  </svg>
);
const LocationIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4z" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
    <circle cx="7" cy="5" r="1.5" fill="rgba(255,255,255,0.85)" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
    <path d="M7 1.5c-1.5 1.5-2.5 3.3-2.5 5.5S5.5 11 7 12.5M7 1.5c1.5 1.5 2.5 3.3 2.5 5.5S8.5 11 7 12.5M1.5 7h11" stroke="rgba(255,255,255,0.85)" strokeWidth="1.1" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
    <rect x="1" y="1" width="12" height="12" rx="2" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" />
    <path d="M4 6v4M4 4.5v.5M7 10V8a1.5 1.5 0 0 1 3 0v2M7 6v4" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

const CONTACT_ICON = {
  phone:     <PhoneIcon />,
  email:     <EmailIcon />,
  location:  <LocationIcon />,
  portfolio: <GlobeIcon />,
  linkedin:  <LinkedinIcon />,
};

/* ─── Main section heading ────────────────────────────────────── */
/* Visual (left→right): [LINE─────────] [TEXT] [●CIRCLE]          */
/* In RTL flex: DOM [circle, text, line] → circle=RIGHT           */
const MainHeading = ({ label, accent, iconKey }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '8pt',
    direction: 'rtl', marginBottom: '9pt', marginTop: '14pt',
    ...BREAK_HEADING,
  }}>
    {/* circle icon → rightmost in RTL flex */}
    <div style={{
      width: '22pt', height: '22pt', borderRadius: '50%',
      backgroundColor: accent, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {SECTION_ICON[iconKey] || (
        <div style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: '#fff' }} />
      )}
    </div>
    <div style={{ fontSize: '10.5pt', fontWeight: '700', color: '#1a202c', whiteSpace: 'nowrap' }}>
      {label}
    </div>
    {/* line → leftmost in RTL flex */}
    <div style={{ flex: 1, height: '1.5px', backgroundColor: '#bde0e8' }} />
  </div>
);

/* ─── Sidebar section title ───────────────────────────────────── */
const SbHeading = ({ label }) => (
  <div style={{
    fontSize: '8.5pt', fontWeight: '700', color: '#fff',
    textAlign: 'center', letterSpacing: '0.04em',
    borderBottom: '1px solid rgba(255,255,255,0.22)',
    paddingBottom: '4pt', marginBottom: '8pt', marginTop: '14pt',
    ...BREAK_HEADING,
  }}>{label}</div>
);

/* ─── Contact row: icon circle (LEFT) + text (RIGHT) ─────────── */
/* direction:ltr row so icon is always visually LEFT               */
const ContactRow = ({ iconKey, text }) => (
  <div style={{
    display: 'flex', flexDirection: 'row', alignItems: 'center',
    gap: '7pt', marginBottom: '7pt', direction: 'ltr',
  }}>
    <div style={{
      width: '22pt', height: '22pt', borderRadius: '50%', flexShrink: 0,
      border: '1.5px solid rgba(255,255,255,0.30)',
      backgroundColor: 'rgba(255,255,255,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {CONTACT_ICON[iconKey] || <GlobeIcon />}
    </div>
    <span style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.85)', wordBreak: 'break-all', lineHeight: 1.3 }}>
      {text}
    </span>
  </div>
);

/* ─── Diamond rating ──────────────────────────────────────────── */
const Stars = ({ level = 3 }) => {
  const n = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '3pt', alignItems: 'center' }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="9" height="9" viewBox="0 0 10 10">
          <polygon
            points="5,0 10,5 5,10 0,5"
            fill={i <= n ? '#f5c518' : 'rgba(255,255,255,0.18)'}
          />
        </svg>
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
        <circle cx="26" cy="26" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
        <circle
          cx="26" cy="26" r={r} fill="none"
          stroke={accent} strokeWidth="4"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
        />
        <text x="26" y="31" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{pct}</text>
      </svg>
      <div style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>{label}</div>
    </div>
  );
};

/* ─── Interest box ────────────────────────────────────────────── */
const InterestBox = ({ label }) => (
  <div style={{
    border: '1px solid rgba(255,255,255,0.22)', borderRadius: '6pt',
    padding: '5pt 4pt', fontSize: '8pt', color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.07)', textAlign: 'center',
    lineHeight: 1.3,
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

  const initials = (info.fullName || '')
    .split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('');

  const contactItems = [
    vis.phone     !== false && info.phone     && { key: 'phone',     text: info.phone     },
    vis.email     !== false && info.email     && { key: 'email',     text: info.email     },
    vis.location  !== false && info.location  && { key: 'location',  text: info.location  },
    vis.portfolio !== false && info.portfolio && { key: 'portfolio', text: info.portfolio  },
    vis.linkedin  !== false && info.linkedin  && { key: 'linkedin',  text: info.linkedin  },
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
              <div style={{ fontSize: '8.5pt', color: '#fff', textAlign: 'right', marginBottom: '3pt' }}>
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
              <div key={i} style={{ marginBottom: '5pt', textAlign: 'right', direction: 'rtl' }}>
                <div style={{ fontSize: '8pt', color: '#fff', fontWeight: '600' }}>{c.name || c.title || c}</div>
                {(c.institution || c.issuer) && <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.55)' }}>{c.institution || c.issuer}</div>}
              </div>
            ))}
          </div>
        );
      }

      case 'awards': return data.awards?.length > 0 ? (
        <div key="awards" style={BREAK_ITEM}>
          <SbHeading label={L.awards} />
          {data.awards.map((a, i) => (
            <div key={i} style={{ fontSize: '8pt', color: '#fff', textAlign: 'right', direction: 'rtl', marginBottom: '4pt' }}>
              {a.title || a.name || a}
            </div>
          ))}
        </div>
      ) : null;

      case 'organisations': return data.organisations?.length > 0 ? (
        <div key="organisations" style={BREAK_ITEM}>
          <SbHeading label={L.organisations} />
          {data.organisations.map((o, i) => (
            <div key={i} style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.85)', textAlign: 'right', direction: 'rtl', marginBottom: '4pt' }}>
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
          <MainHeading label={L.summary} accent={accent} iconKey="summary" />
          <div style={{ fontSize: sz.body, color: '#444', lineHeight, textAlign: 'right', whiteSpace: 'pre-line', direction: 'rtl' }}>
            {info.summary}
          </div>
        </div>
      ) : null;

      case 'experience': return data.experience?.length > 0 ? (
        <div key="experience">
          <MainHeading label={L.experience} accent={accent} iconKey="experience" />
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '11pt', ...BREAK_ITEM }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6pt', direction: 'rtl' }}>
                <div style={{ fontSize: sz.body, fontWeight: '700', color: '#1a202c', flex: 1, textAlign: 'right' }}>
                  {e.jobTitle}
                </div>
                <div style={{ fontSize: '8pt', color: '#888', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {e.startDate}{(e.endDate || e.current) ? ` - ${e.current ? L.present : e.endDate}` : ''}
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
          <MainHeading label={L.education} accent={accent} iconKey="education" />
          {data.education.map((e, i) => (
            <div key={i} style={{ marginBottom: '11pt', ...BREAK_ITEM }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6pt', direction: 'rtl' }}>
                <div style={{ fontSize: sz.body, fontWeight: '700', color: '#1a202c', flex: 1, textAlign: 'right' }}>
                  {e.degree}
                </div>
                <div style={{ fontSize: '8pt', color: '#888', whiteSpace: 'nowrap', flexShrink: 0 }}>
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
          <MainHeading label={L.projects} accent={accent} iconKey="projects" />
          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '10pt', ...BREAK_ITEM }}>
              <div style={{ fontSize: sz.body, fontWeight: '700', color: '#1a202c', textAlign: 'right', direction: 'rtl' }}>
                {p.title || p.name}
              </div>
              {p.link && <div style={{ fontSize: '8pt', color: accent, textAlign: 'right' }}>{p.link}</div>}
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
              <MainHeading label={sec.title} accent={accent} iconKey={null} />
              {sec.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '10pt', ...BREAK_ITEM }}>
                  {item.title    && <div style={{ fontSize: sz.body, fontWeight:'700', color:'#1a202c', textAlign:'right', direction:'rtl' }}>{item.title}</div>}
                  {item.subtitle && <div style={{ fontSize:'8pt', color:accent, textAlign:'right', direction:'rtl' }}>{item.subtitle}</div>}
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
      fontFamily: font,
      fontSize: sz.body,
      color: '#1a202c',
      width: '794px',
      minHeight: '1122px',
      backgroundColor: DARK,   /* ← dark fills entire page */
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
    }}>

      {/* ══ HEADER (dark background, full width) ════════════════ */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        minHeight: '106pt',
        paddingTop: '20pt',
        paddingBottom: '18pt',
        flexShrink: 0,
      }}>
        {/* LEFT: name + job title */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingRight: '24pt',
          paddingLeft: '18pt',
          direction: 'rtl',
          textAlign: 'right',
        }}>
          <div style={{
            fontSize: sz.name,
            fontWeight: '800',
            color: '#fff',
            lineHeight: 1.15,
            marginBottom: '5pt',
          }}>
            {info.fullName || 'الاسم الكامل'}
          </div>
          {info.jobTitle && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5pt',
              direction: 'rtl',
            }}>
              {/* arrow icon before job title */}
              <span style={{ color: accent, fontSize: '10pt', lineHeight: 1 }}>▸</span>
              <span style={{ fontSize: sz.body, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
                {info.jobTitle}
              </span>
            </div>
          )}
        </div>

        {/* RIGHT: profile photo (sidebar-width column) */}
        <div style={{
          width: `${SIDEBAR_W}px`,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '78pt',
            height: '78pt',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `3.5px solid ${accent}`,
            backgroundColor: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: `0 0 0 4px rgba(255,255,255,0.12)`,
          }}>
            {(vis.photo !== false && info.photo) ? (
              <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '22pt', fontWeight: '700', color: '#fff' }}>{initials}</span>
            )}
          </div>
        </div>
      </div>

      {/* ══ BODY (white main card + transparent sidebar) ════════ */}
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: '860px' }}>

        {/* LEFT: white main content — rounded top corners create the wave */}
        <div style={{
          flex: 1,
          backgroundColor: '#fff',
          borderTopLeftRadius: '22pt',
          borderTopRightRadius: '22pt',
          padding: '16pt 20pt 24pt 16pt',
          boxSizing: 'border-box',
          direction: 'rtl',
          overflowX: 'hidden',
        }}>
          {mainKeys.map(k => renderMain(k))}
        </div>

        {/* RIGHT: sidebar — dark bg from parent shows through */}
        <div style={{
          width: `${SIDEBAR_W}px`,
          flexShrink: 0,
          padding: '10pt 12pt 24pt',
          boxSizing: 'border-box',
          direction: 'rtl',
        }}>
          {/* Contact section */}
          {contactItems.length > 0 && (
            <div style={BREAK_ITEM}>
              <SbHeading label={L.contact} />
              {contactItems.map((row, i) => (
                <ContactRow key={i} iconKey={row.key} text={row.text} />
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
