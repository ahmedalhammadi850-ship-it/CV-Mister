import { resolveTheme, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

const L = {
  summary:       { ar: 'نبذة عني',         en: 'About Me'        },
  experience:    { ar: 'خبرات العمل',      en: 'Work Experience' },
  education:     { ar: 'الدراسة',          en: 'Education'       },
  skills:        { ar: 'المهارات',         en: 'Skills'          },
  languages:     { ar: 'اللغات',           en: 'Languages'       },
  interests:     { ar: 'الهوايات',         en: 'Interests'       },
  contact:       { ar: 'معلومات التواصل',  en: 'Contact Info'    },
  projects:      { ar: 'المشاريع',         en: 'Projects'        },
  certificates:  { ar: 'الشهادات',         en: 'Certificates'    },
  courses:       { ar: 'الدورات',          en: 'Courses'         },
  awards:        { ar: 'الجوائز',          en: 'Awards'          },
  organisations: { ar: 'المنظمات',         en: 'Organisations'   },
  publications:  { ar: 'المنشورات',        en: 'Publications'    },
  references:    { ar: 'المراجع',          en: 'References'      },
  present:       { ar: 'حتى الآن',         en: 'Present'         },
};

const SIDEBAR_W = 205;

const DEFAULT_ORDER = [
  'summary', 'experience', 'education', 'projects', 'publications', 'references',
  'skills', 'languages', 'interests', 'certificates', 'courses', 'awards', 'organisations',
];
const SIDEBAR_KEYS = new Set(['skills', 'languages', 'interests', 'certificates', 'courses', 'awards', 'organisations']);
const MAIN_KEYS    = new Set(['summary', 'experience', 'education', 'projects', 'publications', 'references']);

/* ── Wave SVG separator ── */
const WaveSep = ({ accent }) => (
  <svg width="100%" height="10" viewBox="0 0 300 10" preserveAspectRatio="none"
    style={{ display: 'block', marginTop: '2pt', marginBottom: '8pt' }}>
    <path d="M0 5 Q37.5 0 75 5 Q112.5 10 150 5 Q187.5 0 225 5 Q262.5 10 300 5"
      stroke={accent} strokeWidth="1.8" fill="none" strokeLinecap="round" />
  </svg>
);

/* ── Star rating ── */
const Stars = ({ level = 3 }) => {
    const lvl = level > 5 ? Math.round(level / 20) : level;
  if (lvl <= 0) return null;
  const n = Math.min(Math.max(Math.round(lvl), 1), 5);
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '2pt' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= n ? '#f5c518' : 'rgba(255,255,255,0.2)', fontSize: '11pt', lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
};

/* ── Circular language gauge ── */
const LangGauge = ({ pct = 75, label, accent }) => {
  const r = 19, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2pt' }}>
      <svg width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r={r} fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="4" />
        <circle cx="25" cy="25" r={r} fill="none" stroke={accent} strokeWidth="4"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round" />
        <text x="25" y="30" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{pct}</text>
      </svg>
      <div style={{ fontSize: '7pt', color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>{label}</div>
    </div>
  );
};

/* ── Contact icon SVGs ── */
const PhoneIcon    = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 1h3l1.5 3.5-2 1.2c.8 1.6 2.3 3.1 3.8 3.8l1.2-2L14 9v3c0 1.1-.9 1-2 .7C5 11 1 6 1 3c-.3-1.1-.1-2 1-2z" stroke="#fff" strokeWidth="1.2" fill="none"/></svg>;
const EmailIcon    = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1" stroke="#fff" strokeWidth="1.2"/><path d="M1 3.5l6 4.5 6-4.5" stroke="#fff" strokeWidth="1.2"/></svg>;
const LocationIcon = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4z" stroke="#fff" strokeWidth="1.2"/><circle cx="7" cy="5" r="1.5" fill="#fff"/></svg>;
const GlobeIcon    = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#fff" strokeWidth="1.2"/><path d="M7 1.5c-1.5 1.5-2.5 3.3-2.5 5.5S5.5 11 7 12.5M7 1.5c1.5 1.5 2.5 3.3 2.5 5.5S8.5 11 7 12.5M1.5 7h11" stroke="#fff" strokeWidth="1.1"/></svg>;
const LinkedinIcon = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="#fff" strokeWidth="1.2"/><path d="M4 6v4M4 4.5v.5M7 10V8a1.5 1.5 0 0 1 3 0v2M7 6v4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const CONTACT_ICON = { phone: <PhoneIcon/>, email: <EmailIcon/>, location: <LocationIcon/>, portfolio: <GlobeIcon/>, linkedin: <LinkedinIcon/> };

/* ── Section icon SVGs (for main area headings) ── */
const SummaryIcon    = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4" r="3" fill="#fff"/><path d="M1 13c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/></svg>;
const BriefcaseIcon  = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><rect x="1" y="4" width="12" height="9" rx="1.5" stroke="#fff" strokeWidth="1.3"/><path d="M4.5 4V2.5A1.5 1.5 0 0 1 6 1h2a1.5 1.5 0 0 1 1.5 1.5V4" stroke="#fff" strokeWidth="1.3"/><line x1="1" y1="8" x2="13" y2="8" stroke="#fff" strokeWidth="1.1"/></svg>;
const GraduationIcon = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M7 2L1 5.5l6 3.5 6-3.5L7 2z" fill="#fff"/><path d="M4 7.5v3c0 1 1.3 2 3 2s3-1 3-2v-3" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const FolderIcon     = () => <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 3h4l2 2h6v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3z" stroke="#fff" strokeWidth="1.3"/></svg>;
const SECTION_ICON   = { summary: <SummaryIcon/>, experience: <BriefcaseIcon/>, education: <GraduationIcon/>, projects: <FolderIcon/> };

/* ── Main section heading: [icon-box] [title] ~~wave~~ ── */
const MainHeading = ({ label, iconKey, accent }) => (
  <div style={{ direction: 'rtl', ...BREAK_HEADING, marginTop: '14pt' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '7pt', direction: 'rtl' }}>
      <div style={{
        width: '22pt', height: '22pt', borderRadius: '6pt',
        backgroundColor: accent, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {SECTION_ICON[iconKey] || <div style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: '#fff' }} />}
      </div>
      <div style={{ fontSize: '10.5pt', fontWeight: '700', color: '#2c3e50' }}>{label}</div>
    </div>
    <WaveSep accent={accent} />
  </div>
);

/* ── Sidebar section heading: solid teal banner ── */
const SbHeading = ({ label, accent }) => (
  <div style={{
    backgroundColor: accent,
    color: '#fff',
    fontSize: '8pt', fontWeight: '700',
    textAlign: 'center', letterSpacing: '0.03em',
    padding: '4pt 6pt', borderRadius: '3pt',
    marginBottom: '9pt', marginTop: '14pt',
    ...BREAK_HEADING,
  }}>{label}</div>
);

/* ════════════════════════════════════════════════════════════════ */
const ArabicWaveTemplate = ({
  data, theme,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const accent = theme?.primaryColor || '#2a8a96';
  const DARK   = '#1b2d45';
  const { sz, font, lineHeight } = resolveTheme(theme, true);
  const show = k => visibleSections[k] !== false;
  const tr = (key, isRTL) => sectionNames?.[key] || (L[key]?.[isRTL ? 'ar' : 'en'] ?? key);
  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const initials = (info.fullName || '').split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('');

  const contactItems = [
    vis.phone     !== false && info.phone     && { key: 'phone',     text: info.phone     },
    vis.email     !== false && info.email     && { key: 'email',     text: info.email     },
    vis.location  !== false && info.location  && { key: 'location',  text: info.location  },
    vis.portfolio !== false && info.portfolio && { key: 'portfolio', text: info.portfolio  },
    vis.linkedin  !== false && info.linkedin  && { key: 'linkedin',  text: info.linkedin  },
  ].filter(Boolean);

  /* ── Sidebar sections ── */
  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch (key) {

      case 'skills': return data.skills?.length > 0 ? (
        <section key="skills" style={BREAK_ITEM}>
          <SbHeading label={tr('skills', true)} accent={accent} />
          {data.skills.map((sk, i) => (
            <div key={i} style={{ marginBottom: '9pt', direction: 'rtl' }}>
              <div style={{ fontSize: '8.5pt', color: '#fff', textAlign: 'right', marginBottom: '3pt' }}>
                {typeof sk === 'string' ? sk : (sk.name || sk)}
              </div>
              <Stars level={typeof sk === 'object' ? (sk.level || 0) : 0} />
            </div>
          ))}
        </section>
      ) : null;

      case 'languages': return data.languages?.length > 0 ? (
        <section key="languages" style={BREAK_ITEM}>
          <SbHeading label={tr('languages', true)} accent={accent} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6pt', justifyContent: 'center' }}>
            {data.languages.map((l, i) => {
              const map = { native: 100, fluent: 90, advanced: 80, 'upper-intermediate': 75, intermediate: 65, elementary: 45, beginner: 35 };
              const pct = l.proficiency ? Math.round(l.proficiency * 20) : (map[(l.level || '').toLowerCase()] ?? 75);
              const shortName = (l.name || '').slice(0, 2).toUpperCase();
              return <LangGauge key={i} pct={pct} label={shortName} accent={accent} />;
            })}
          </div>
        </section>
      ) : null;

      case 'interests': return data.interests?.length > 0 ? (
        <section key="interests" style={BREAK_ITEM}>
          <SbHeading label={tr('interests', true)} accent={accent} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5pt', justifyContent: 'center' }}>
            {data.interests.map((item, i) => (
              <div key={i} style={{
                width: '38pt', height: '38pt', borderRadius: '50%',
                border: '1.5px solid rgba(255,255,255,0.28)',
                backgroundColor: 'rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '7pt', color: '#fff', textAlign: 'center',
                padding: '3pt', boxSizing: 'border-box', lineHeight: 1.2,
              }}>
                {(typeof item === 'string' ? item : item.name).slice(0, 4)}
              </div>
            ))}
          </div>
        </section>
      ) : null;

      case 'certificates':
      case 'courses': {
        const items = data[key];
        if (!items?.length) return null;
        return (
          <div key={key} style={BREAK_ITEM}>
            <SbHeading label={tr(key, true)} accent={accent} />
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
        <section key="awards" style={BREAK_ITEM}>
          <SbHeading label={tr('awards', true)} accent={accent} />
          {data.awards.map((a, i) => (
            <div key={i} style={{ fontSize: '8pt', color: '#fff', textAlign: 'right', direction: 'rtl', marginBottom: '4pt' }}>
              {a.title || a.name || a}
            </div>
          ))}
        </section>
      ) : null;

      case 'organisations': return data.organisations?.length > 0 ? (
        <section key="organisations" style={BREAK_ITEM}>
          <SbHeading label={tr('organisations', true)} accent={accent} />
          {data.organisations.map((o, i) => (
            <div key={i} style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.85)', textAlign: 'right', direction: 'rtl', marginBottom: '4pt' }}>
              {o.name || o}
            </div>
          ))}
        </section>
      ) : null;

      default: return null;
    }
  };

  /* ── Main sections ── */
  const renderMain = (key) => {
    if (!show(key)) return null;
    switch (key) {

      case 'summary': return info.summary ? (
        <section key="summary" style={BREAK_ITEM}>
          <MainHeading label={tr('summary', true)} iconKey="summary" accent={accent} />
          <div style={{ fontSize: sz.body, color: '#555', lineHeight, textAlign: 'right', whiteSpace: 'pre-line', direction: 'rtl' }}>
            {info.summary}
          </div>
        </section>
      ) : null;

      case 'experience': return data.experience?.length > 0 ? (
        <section key="experience">
          <MainHeading label={tr('experience', true)} iconKey="experience" accent={accent} />
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom: '11pt', ...BREAK_ITEM }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6pt', direction: 'rtl' }}>
                <div style={{ fontSize: sz.body, fontWeight: '700', color: '#222', flex: 1, textAlign: 'right' }}>{e.jobTitle}</div>
                <div style={{ fontSize: '8pt', color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {e.startDate}{(e.endDate || e.current) ? ` - ${e.current ? tr('present', true) : e.endDate}` : ''}
                </div>
              </div>
              <div style={{ fontSize: '8.5pt', color: accent, fontWeight: '600', textAlign: 'right', direction: 'rtl', marginBottom: '3pt' }}>
                {e.company}{e.location ? ` · ${e.location}` : ''}
              </div>
              {e.description && (
                <div style={{ fontSize: sz.body, color: '#555', lineHeight, textAlign: 'right', whiteSpace: 'pre-line', direction: 'rtl' }}>
                  <span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span>
                </div>
              )}
            </div>
          ))}
        </section>
      ) : null;

      case 'education': return data.education?.length > 0 ? (
        <section key="education">
          <MainHeading label={tr('education', true)} iconKey="education" accent={accent} />
          {data.education.map((e, i) => (
            <div key={i} style={{ marginBottom: '11pt', ...BREAK_ITEM }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6pt', direction: 'rtl' }}>
                <div style={{ fontSize: sz.body, fontWeight: '700', color: '#222', flex: 1, textAlign: 'right' }}>{e.degree}</div>
                <div style={{ fontSize: '8pt', color: '#999', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {e.startDate}{e.endDate ? ` - ${e.endDate}` : ''}
                </div>
              </div>
              <div style={{ fontSize: '8.5pt', color: accent, fontWeight: '600', textAlign: 'right', direction: 'rtl', marginBottom: '3pt' }}>
                {e.institution}{e.location ? ` · ${e.location}` : ''}
              </div>
              {e.description && (
                <div style={{ fontSize: sz.body, color: '#555', lineHeight, textAlign: 'right', whiteSpace: 'pre-line', direction: 'rtl' }}>
                  <span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span>
                </div>
              )}
            </div>
          ))}
        </section>
      ) : null;

      case 'projects': return data.projects?.length > 0 ? (
        <section key="projects">
          <MainHeading label={tr('projects', true)} iconKey="projects" accent={accent} />
          {data.projects.map((p, i) => (
            <div key={i} style={{ marginBottom: '10pt', ...BREAK_ITEM }}>
              <div style={{ fontSize: sz.body, fontWeight: '700', color: '#222', textAlign: 'right', direction: 'rtl' }}>{p.title || p.name}</div>
              {p.link && <div style={{ fontSize: '8pt', color: accent, textAlign: 'right' }}>{p.link}</div>}
              {p.description && (
                <div style={{ fontSize: sz.body, color: '#555', lineHeight, textAlign: 'right', whiteSpace: 'pre-line', direction: 'rtl' }}>
                  <span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span>
                </div>
              )}
            </div>
          ))}
        </section>
      ) : null;

      case 'publications': return data.publications?.length > 0 ? (
        <section key="publications">
          <MainHeading label={tr('publications', true)} iconKey={null} accent={accent} />
          {data.publications.map((p, i) => (
            <div key={i} style={{ marginBottom: '10pt', ...BREAK_ITEM }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6pt', direction: 'rtl' }}>
                <div style={{ fontSize: sz.body, fontWeight: '700', color: '#222', flex: 1, textAlign: 'right' }}>{p.title}</div>
                {p.date && <div style={{ fontSize: '8pt', color: '#999', whiteSpace: 'nowrap' }}>{p.date}</div>}
              </div>
              {p.publisher && <div style={{ fontSize: '8.5pt', color: accent, textAlign: 'right', direction: 'rtl' }}>{p.publisher}</div>}
              {p.description && <div style={{ fontSize: sz.body, color: '#555', lineHeight, textAlign: 'right', direction: 'rtl' }}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>}
            </div>
          ))}
        </section>
      ) : null;

      case 'references': return data.references?.length > 0 ? (
        <section key="references">
          <MainHeading label={tr('references', true)} iconKey={null} accent={accent} />
          {data.references.map((r, i) => (
            <div key={i} style={{ marginBottom: '10pt', ...BREAK_ITEM }}>
              <div style={{ fontSize: sz.body, fontWeight: '700', color: '#222', textAlign: 'right', direction: 'rtl' }}>{r.name}</div>
              {(r.title || r.company) && <div style={{ fontSize: '8.5pt', color: accent, textAlign: 'right', direction: 'rtl' }}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
              {(r.email || r.phone) && <div style={{ fontSize: sz.body, color: '#555', textAlign: 'right', direction: 'rtl' }}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
            </div>
          ))}
        </section>
      ) : null;

      default:
        if (key.startsWith('csec-') && data.customSections) {
          const sec = data.customSections.find(s => s.id === key);
          if (!sec || !sec.items?.length) return null;
          return (
            <div key={key}>
              <MainHeading label={sec.title} iconKey={null} accent={accent} />
              {sec.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '10pt', ...BREAK_ITEM }}>
                  {item.title    && <div style={{ fontSize: sz.body, fontWeight: '700', color: '#222', textAlign: 'right', direction: 'rtl' }}>{item.title}</div>}
                  {item.subtitle && <div style={{ fontSize: '8pt', color: accent, textAlign: 'right', direction: 'rtl' }}>{item.subtitle}</div>}
                  {item.description && <div style={{ fontSize: sz.body, color: '#555', lineHeight, textAlign: 'right', direction: 'rtl' }}><span style={{fontWeight:item?.descriptionBold?700:undefined,fontStyle:item?.descriptionItalic?"italic":undefined}}>{item.description}</span></div>}
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

  /* ══════════════════════════ RENDER ═══════════════════════════ */
  return (
    <div style={{
      fontFamily: font,
      fontSize: sz.body,
      color: '#1a202c',
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: '#f0f3f8',
    }}>
      {/* ══ RIGHT SIDEBAR ══════════════════════════════════════ */}
      <div style={{
        width: `${SIDEBAR_W}px`,
        flexShrink: 0,
        backgroundColor: DARK,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minHeight: '1122px',
      }}>
        {/* Profile photo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: '20pt',
          paddingBottom: '14pt',
          flexShrink: 0,
        }}>
          {vis.photo !== false && (
            <div style={{
              width: '88pt',
              height: '88pt',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `3.5px solid ${accent}`,
              boxShadow: `0 0 0 5px rgba(255,255,255,0.09)`,
              backgroundColor: 'rgba(255,255,255,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width: '100%', height: '100%', objectFit: info.photo ? 'cover' : 'contain' }} />
            </div>
          )}
        </div>

        {/* Contact */}
        <div style={{ padding: '0 13pt', flexShrink: 0 }}>
          {contactItems.length > 0 && (
            <div style={BREAK_ITEM}>
              <div style={{
                backgroundColor: accent,
                color: '#fff',
                fontSize: '8pt', fontWeight: '700',
                textAlign: 'center', letterSpacing: '0.03em',
                padding: '4pt 6pt', borderRadius: '3pt',
                marginBottom: '9pt',
              }}>
                {tr('contact', true)}
              </div>
              {contactItems.map((row, i) => (
                <div key={i} style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center',
                  gap: '7pt', marginBottom: '8pt',
                }}>
                  <div style={{
                    width: '20pt', height: '20pt', borderRadius: '50%', flexShrink: 0,
                    border: '1.5px solid rgba(255,255,255,0.28)',
                    backgroundColor: 'rgba(255,255,255,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {CONTACT_ICON[row.key] || <GlobeIcon />}
                  </div>
                  <span style={{ fontSize: '7.5pt', color: 'rgba(255,255,255,0.85)', wordBreak: 'break-all', lineHeight: 1.3 }}>
                    {row.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar sections */}
        <div style={{ padding: '0 13pt', flex: 1 }}>
          {sideKeys.map(k => renderSidebar(k))}
        </div>
      </div>

      {/* ══ LEFT MAIN CONTENT ═══════════════════════════════════ */}
      <div style={{
        flex: 1,
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minHeight: '1122px',
      }}>
        {/* Name / title header */}
        <div style={{
          backgroundColor: '#f0f3f8',
          padding: '24pt 22pt 20pt',
          direction: 'rtl',
          flexShrink: 0,
          borderBottom: `3px solid ${accent}`,
        }}>
          <div style={{
            fontSize: sz.name,
            fontWeight: '800',
            color: accent,
            lineHeight: 1.15,
            marginBottom: '4pt',
          }}>
            {info.fullName || 'الاسم الكامل'}
          </div>
          {info.jobTitle && (
            <div style={{ fontSize: '10pt', color: '#666', fontWeight: '500' }}>
              {info.jobTitle}
            </div>
          )}
        </div>

        {/* Sections body */}
        <div style={{
          padding: '6pt 22pt 28pt',
          flex: 1,
          direction: 'rtl',
          boxSizing: 'border-box',
        }}>
          {mainKeys.map(k => renderMain(k))}
        </div>
      </div>
    </div>
  );
};

export default ArabicWaveTemplate;
