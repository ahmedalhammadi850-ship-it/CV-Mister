import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

const labels = {
  summary:     { ar: 'نبذة عني'          },
  experience:  { ar: 'خبرات العمل'       },
  education:   { ar: 'الدراسة'           },
  skills:      { ar: 'المهارات'          },
  languages:   { ar: 'اللغات'            },
  interests:   { ar: 'الاهتمامات'        },
  contact:     { ar: 'معلومات التواصل'   },
  projects:    { ar: 'المشاريع'          },
  certificates:{ ar: 'الشهادات'          },
  courses:     { ar: 'الدورات'           },
  awards:      { ar: 'الجوائز'           },
  organisations:{ ar: 'المنظمات'         },
  publications:{ ar: 'المنشورات'         },
  references:  { ar: 'المراجع'           },
  present:     { ar: 'حتى الآن'          },
};
const tr = (key) => labels[key]?.ar ?? key;

const DEFAULT_ORDER = [
  'summary','experience','education','projects','publications','references',
  'skills','languages','certificates','courses','awards','interests','organisations',
];
const SIDEBAR_SECTIONS = new Set(['skills','languages','interests','courses','awards','certificates','organisations','references','publications']);
const MAIN_SECTIONS    = new Set(['summary','experience','education','projects']);

/* ── 5-Star rating ── */
const Stars = ({ level = 3, filled, empty }) => {
  const n = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <div style={{ display: 'flex', gap: '3pt', flexDirection: 'row-reverse', justifyContent: 'flex-start' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? filled : empty, fontSize: '10pt', lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
};

/* ── Circular language gauge ── */
const LangCircle = ({ pct = 75, color, bg }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3pt' }}>
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke={bg} strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
        <text x="28" y="33" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{pct}</text>
      </svg>
    </div>
  );
};

/* ── Contact icon circle ── */
const ContactIcon = ({ icon, iconColor }) => (
  <div style={{
    width: '22pt', height: '22pt', borderRadius: '50%',
    backgroundColor: iconColor,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, fontSize: '9pt', color: '#fff',
  }}>
    {icon}
  </div>
);

/* ── Section heading for main area (with circular icon + line) ── */
const SectionHeading = ({ label, accent }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: '8pt',
    flexDirection: 'row-reverse',
    marginBottom: '10pt', marginTop: '14pt',
    ...BREAK_HEADING,
  }}>
    <div style={{
      width: '26pt', height: '26pt', borderRadius: '50%',
      backgroundColor: accent, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: '8pt', height: '8pt', borderRadius: '50%', backgroundColor: '#fff' }} />
    </div>
    <div style={{
      fontSize: '12pt', fontWeight: '700', color: accent,
      whiteSpace: 'nowrap', direction: 'rtl',
    }}>{label}</div>
    <div style={{ flex: 1, height: '1.5px', backgroundColor: '#d0e8ec' }} />
  </div>
);

/* ── Sidebar section title ── */
const SbTitle = ({ label }) => (
  <div style={{
    fontSize: '9pt', fontWeight: '700', color: '#fff',
    textAlign: 'right', letterSpacing: '0.04em',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
    paddingBottom: '4pt', marginBottom: '8pt', marginTop: '14pt',
    ...BREAK_HEADING,
  }}>{label}</div>
);

const ArabicEliteTemplate = ({
  data, theme,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent = theme?.primaryColor || '#1f7a8a';
  const sidebarBg = '#1B3747';
  const { sz, font, lineHeight } = resolveTheme(theme, true);
  const show = k => visibleSections[k] !== false;

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const initials = (info.fullName || '').split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('');

  const contactItems = [
    vis.phone     !== false && info.phone     && { icon: '📞', text: info.phone     },
    vis.email     !== false && info.email     && { icon: '✉',  text: info.email     },
    vis.location  !== false && info.location  && { icon: '📍', text: info.location  },
    vis.portfolio !== false && info.portfolio && { icon: '🌐', text: info.portfolio  },
    vis.linkedin  !== false && info.linkedin  && { icon: 'in', text: info.linkedin  },
  ].filter(Boolean);

  /* ── SIDEBAR ── */
  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'skills': return data.skills?.length > 0 ? (
        <div key="skills" style={BREAK_ITEM}>
          <SbTitle label={tr('skills')} />
          {data.skills.map((sk, i) => (
            <div key={i} style={{ marginBottom: '8pt' }}>
              <div style={{ fontSize: sz.meta, color: '#fff', textAlign: 'right', marginBottom: '3pt' }}>
                {sk.name || sk}
              </div>
              <Stars level={sk.level || 3} filled="#f0b429" empty="rgba(255,255,255,0.2)" />
            </div>
          ))}
        </div>
      ) : null;

      case 'languages': return data.languages?.length > 0 ? (
        <div key="languages" style={BREAK_ITEM}>
          <SbTitle label={tr('languages')} />
          <div style={{ display: 'flex', flexDirection: 'row-reverse', gap: '8pt', flexWrap: 'wrap', justifyContent: 'center' }}>
            {data.languages.map((l, i) => {
              const levelMap = { native:100, fluent:90, advanced:80, 'upper-intermediate':75, intermediate:65, elementary:45, beginner:35 };
              const pct = l.proficiency
                ? Math.round(l.proficiency * 20)
                : l.level
                  ? (levelMap[(l.level||'').toLowerCase()] ?? 70)
                  : 75;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4pt' }}>
                  <LangCircle pct={pct} color={accent} bg="rgba(255,255,255,0.15)" />
                  <div style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.85)', textAlign: 'center', maxWidth: '56pt' }}>
                    {l.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null;

      case 'interests': return data.interests?.length > 0 ? (
        <div key="interests" style={BREAK_ITEM}>
          <SbTitle label={tr('interests')} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5pt', flexDirection: 'row-reverse', justifyContent: 'flex-start' }}>
            {data.interests.map((item, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
                borderRadius: '6pt', padding: '5pt 7pt',
                fontSize: sz.meta, color: '#fff', textAlign: 'center',
                minWidth: '36pt',
              }}>
                {item.name || item}
              </div>
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
            <SbTitle label={tr(key)} />
            {items.map((c, i) => (
              <div key={i} style={{ marginBottom: '6pt', textAlign: 'right' }}>
                <div style={{ fontSize: sz.meta, color: '#fff', fontWeight: '600' }}>{c.name || c.title || c}</div>
                {(c.institution || c.issuer) && <div style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.6)' }}>{c.institution || c.issuer}</div>}
              </div>
            ))}
          </div>
        );
      }

      case 'awards': return data.awards?.length > 0 ? (
        <div key="awards" style={BREAK_ITEM}>
          <SbTitle label={tr('awards')} />
          {data.awards.map((a, i) => (
            <div key={i} style={{ marginBottom: '6pt', textAlign: 'right' }}>
              <div style={{ fontSize: sz.meta, color: '#fff', fontWeight: '600' }}>{a.title || a.name || a}</div>
            </div>
          ))}
        </div>
      ) : null;

      case 'organisations': return data.organisations?.length > 0 ? (
        <div key="organisations" style={BREAK_ITEM}>
          <SbTitle label={tr('organisations')} />
          {data.organisations.map((o, i) => (
            <div key={i} style={{ fontSize: sz.meta, color: 'rgba(255,255,255,0.85)', textAlign: 'right', marginBottom: '4pt' }}>
              {o.name || o}
            </div>
          ))}
        </div>
      ) : null;

      default: return null;
    }
  };

  /* ── MAIN ── */
  const renderMain = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary': return info.summary ? (
        <div key="summary" style={BREAK_ITEM}>
          <SectionHeading label={tr('summary')} accent={accent} />
          <div style={{ fontSize: sz.body, color: '#444', lineHeight, textAlign: 'right', whiteSpace: 'pre-line', direction: 'rtl' }}>
            {info.summary}
          </div>
        </div>
      ) : null;

      case 'experience': return data.experience?.length > 0 ? (
        <div key="experience">
          <SectionHeading label={tr('experience')} accent={accent} />
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '12pt', ...BREAK_ITEM }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row-reverse', gap: '6pt' }}>
                <div style={{ fontSize: sz.body, fontWeight: '700', color: '#1a202c', textAlign: 'right', flex: 1 }}>
                  {e.jobTitle}
                </div>
                <div style={{ fontSize: sz.meta, color: '#888', whiteSpace: 'nowrap', flexShrink: 0, direction: 'rtl' }}>
                  {e.startDate} – {e.current ? tr('present') : e.endDate}
                </div>
              </div>
              <div style={{ fontSize: sz.meta, color: accent, fontWeight: '600', textAlign: 'right', marginBottom: '3pt' }}>
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
          <SectionHeading label={tr('education')} accent={accent} />
          {data.education.map((e, i) => (
            <div key={i} style={{ marginBottom: '12pt', ...BREAK_ITEM }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row-reverse', gap: '6pt' }}>
                <div style={{ fontSize: sz.body, fontWeight: '700', color: '#1a202c', textAlign: 'right', flex: 1 }}>
                  {e.degree}
                </div>
                <div style={{ fontSize: sz.meta, color: '#888', whiteSpace: 'nowrap', flexShrink: 0, direction: 'rtl' }}>
                  {e.startDate} – {e.endDate}
                </div>
              </div>
              <div style={{ fontSize: sz.meta, color: accent, fontWeight: '600', textAlign: 'right', marginBottom: '3pt' }}>
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
          <SectionHeading label={tr('projects')} accent={accent} />
          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '12pt', ...BREAK_ITEM }}>
              <div style={{ fontSize: sz.body, fontWeight: '700', color: '#1a202c', textAlign: 'right' }}>
                {p.title || p.name}
              </div>
              {p.link && <div style={{ fontSize: sz.meta, color: accent, textAlign: 'right' }}>{p.link}</div>}
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
              <SectionHeading label={sec.title} accent={accent} />
              {sec.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '10pt', ...BREAK_ITEM }}>
                  {item.title && <div style={{ fontSize: sz.body, fontWeight: '700', color: '#1a202c', textAlign: 'right' }}>{item.title}</div>}
                  {item.subtitle && <div style={{ fontSize: sz.meta, color: accent, fontWeight: '600', textAlign: 'right' }}>{item.subtitle}</div>}
                  {item.description && <div style={{ fontSize: sz.body, color: '#555', lineHeight, textAlign: 'right', direction: 'rtl' }}>{item.description}</div>}
                </div>
              ))}
            </div>
          );
        }
        return null;
    }
  };

  const sideKeys = sectionOrder.filter(k => SIDEBAR_SECTIONS.has(k));
  const mainKeys = sectionOrder.filter(k => MAIN_SECTIONS.has(k));

  return (
    <div style={{
      fontFamily: font, fontSize: sz.body, color: '#1a202c',
      backgroundColor: '#fff', width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', display: 'flex', flexDirection: 'row-reverse',
      direction: 'rtl',
    }}>

      {/* ══ SIDEBAR (RIGHT) ══ */}
      <div style={{
        width: '220px', minWidth: '220px',
        backgroundColor: sidebarBg,
        padding: '24pt 13pt 20pt',
        boxSizing: 'border-box',
        direction: 'rtl',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* Photo */}
        <div style={{
          width: '80pt', height: '80pt', borderRadius: '50%',
          overflow: 'hidden', margin: '0 auto 10pt',
          border: '3px solid rgba(255,255,255,0.35)',
          backgroundColor: 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {info.photo ? (
            <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '22pt', fontWeight: '700', color: '#fff' }}>{initials}</span>
          )}
        </div>

        {/* Contact section */}
        {show('contact') !== false && contactItems.length > 0 && (
          <div style={BREAK_ITEM}>
            <SbTitle label={tr('contact')} />
            {contactItems.map((row, i) => (
              <div key={i} style={{
                display: 'flex', gap: '7pt', marginBottom: '7pt',
                alignItems: 'flex-start', flexDirection: 'row-reverse',
              }}>
                <ContactIcon icon={row.icon} iconColor="rgba(255,255,255,0.15)" />
                <span style={{
                  fontSize: sz.meta, color: 'rgba(255,255,255,0.88)',
                  wordBreak: 'break-all', lineHeight: 1.4, textAlign: 'right', flex: 1,
                }}>
                  {row.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {sideKeys.map(k => renderSidebar(k))}
      </div>

      {/* ══ MAIN CONTENT (LEFT) ══ */}
      <div style={{
        flex: 1, padding: '26pt 22pt 20pt 18pt',
        boxSizing: 'border-box', direction: 'rtl', backgroundColor: '#fff',
      }}>

        {/* Name & title block */}
        <div style={{ marginBottom: '14pt', textAlign: 'right', ...BREAK_ITEM }}>
          <div style={{
            fontSize: sz.name, fontWeight: '700', color: '#1a202c',
            lineHeight: 1.15, marginBottom: '3pt',
          }}>
            {info.fullName || 'الاسم الكامل'}
          </div>
          {info.jobTitle && (
            <div style={{
              fontSize: sz.body, color: accent, fontWeight: '600',
              display: 'flex', alignItems: 'center', gap: '6pt', flexDirection: 'row-reverse',
            }}>
              <span style={{ color: accent }}>▶</span>
              <span>{info.jobTitle}</span>
            </div>
          )}
        </div>

        {mainKeys.map(k => renderMain(k))}
      </div>
    </div>
  );
};

export default ArabicEliteTemplate;
