import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

const L = {
  summary:       { en: 'Professional Summary', ar: 'الملخص المهني'      },
  experience:    { en: 'Work Experience',       ar: 'الخبرة العملية'     },
  education:     { en: 'Education',             ar: 'المؤهلات العلمية'   },
  skills:        { en: 'Skills',                ar: 'المهارات'           },
  languages:     { en: 'Languages',             ar: 'اللغات'             },
  interests:     { en: 'Interests',             ar: 'الاهتمامات'         },
  contact:       { en: 'Contact',               ar: 'التواصل'            },
  projects:      { en: 'Projects',              ar: 'المشاريع'           },
  certificates:  { en: 'Certificates',          ar: 'الشهادات'           },
  courses:       { en: 'Courses',               ar: 'الدورات'            },
  awards:        { en: 'Awards',                ar: 'الجوائز'            },
  organisations: { en: 'Organisations',         ar: 'المنظمات'           },
  publications:  { en: 'Publications',          ar: 'المنشورات'          },
  references:    { en: 'References',            ar: 'المراجع'            },
  present:       { en: 'Present',               ar: 'حتى الآن'           },
};
const tr = (key, isRTL) => L[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const NAVY    = '#0f172a';
const NAVY2   = '#1e293b';
const INDIGO  = '#4f46e5';
const INDIGO2 = '#818cf8';
const WHITE   = '#ffffff';
const OFFWHITE= '#f8fafc';
const TEXT    = '#1e293b';
const MUTED   = '#64748b';
const SIDEBAR_W = 240;

const DEFAULT_ORDER = [
  'summary','experience','education','projects','publications','references',
  'skills','languages','interests','certificates','courses','awards','organisations',
];
const SIDEBAR_KEYS = new Set(['skills','languages','interests','certificates','courses','awards','organisations']);
const MAIN_KEYS    = new Set(['summary','experience','education','projects','publications','references']);

/* ── SVG Icons (white on dark sidebar) ─────────────────────── */
const PhoneIcon    = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 1h3l1.5 3.5-2 1.2c.8 1.6 2.3 3.1 3.8 3.8l1.2-2L14 9v3c0 1.1-.9 1-2 .7C5 11 1 6 1 3c-.3-1.1-.1-2 1-2z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" fill="none"/></svg>;
const EmailIcon    = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/><path d="M1 3.5l6 4.5 6-4.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/></svg>;
const LocationIcon = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4z" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/><circle cx="7" cy="5" r="1.5" fill="rgba(255,255,255,0.7)"/></svg>;
const GlobeIcon    = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/><path d="M7 1.5c-1.5 1.5-2.5 3.3-2.5 5.5S5.5 11 7 12.5M7 1.5c1.5 1.5 2.5 3.3 2.5 5.5S8.5 11 7 12.5M1.5 7h11" stroke="rgba(255,255,255,0.7)" strokeWidth="1.1"/></svg>;
const LinkedinIcon = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2"/><path d="M4 6v4M4 4.5v.5M7 10V8a1.5 1.5 0 0 1 3 0v2M7 6v4" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const CICON = { phone:<PhoneIcon/>, email:<EmailIcon/>, location:<LocationIcon/>, portfolio:<GlobeIcon/>, linkedin:<LinkedinIcon/> };

/* ── Segmented skill bar ────────────────────────────────────── */
const SegmentBar = ({ level = 3, accent }) => {
  const lvl = level > 5 ? Math.round(level / 20) : level;
  if (lvl <= 0) return null;
  const n = Math.min(Math.max(Math.round(lvl), 1), 5);
  return (
    <div style={{ display:'flex', gap:'3pt', marginTop:'3pt', direction:'ltr' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          flex:1, height:'5pt', borderRadius:'2pt',
          backgroundColor: i <= n ? accent : 'rgba(255,255,255,0.12)',
          transition:'background 0.2s',
        }}/>
      ))}
    </div>
  );
};

/* ── Dot rating for languages ───────────────────────────────── */
const DotRow = ({ level = 3, accent }) => {
  const n = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <div style={{ display:'flex', gap:'4pt', marginTop:'3pt', direction:'ltr' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width:'8pt', height:'8pt', borderRadius:'50%',
          backgroundColor: i <= n ? accent : 'rgba(255,255,255,0.15)',
        }}/>
      ))}
    </div>
  );
};

/* ── Sidebar section heading ────────────────────────────────── */
const SbHeading = ({ label, accent, isRTL }) => (
  <div style={{
    fontSize:'7pt', fontWeight:'800', letterSpacing:'0.14em', textTransform:'uppercase',
    color:accent, marginTop:'18pt', marginBottom:'9pt',
    paddingBottom:'5pt',
    borderBottom:`1.5px solid ${accent}35`,
    textAlign: isRTL ? 'right' : 'left',
    ...BREAK_HEADING,
  }}>{label}</div>
);

/* ── Main section heading ───────────────────────────────────── */
const MainHeading = ({ label, accent, isRTL }) => {
  const dir = isRTL ? 'rtl' : 'ltr';
  return (
    <div style={{ marginTop:'18pt', marginBottom:'7pt', direction:dir, ...BREAK_HEADING }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8pt', direction:dir }}>
        {!isRTL && <div style={{ width:'4pt', height:'18pt', backgroundColor:accent, borderRadius:'2pt', flexShrink:0 }} />}
        <span style={{ fontSize:'11pt', fontWeight:'800', color:TEXT, letterSpacing:'-0.01em' }}>{label}</span>
        {isRTL && <div style={{ width:'4pt', height:'18pt', backgroundColor:accent, borderRadius:'2pt', flexShrink:0 }} />}
        <div style={{ flex:1, height:'1px', backgroundColor:`${accent}20` }} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const EnglishApexTemplate = ({
  data, theme,
  isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent = theme?.primaryColor || INDIGO;
  const { sz, font, lineHeight } = resolveTheme(theme, isRTL);
  const dir   = isRTL ? 'rtl' : 'ltr';
  const align = isRTL ? 'right' : 'left';
  const show  = k => visibleSections[k] !== false;
  const info  = data?.personalInfo || {};
  const vis   = visiblePersonalFields || {};
  const initials = (info.fullName || '').split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('');

  const contactItems = [
    vis.phone     !== false && info.phone     && { key:'phone',     text:info.phone     },
    vis.email     !== false && info.email     && { key:'email',     text:info.email     },
    vis.location  !== false && info.location  && { key:'location',  text:info.location  },
    vis.portfolio !== false && info.portfolio && { key:'portfolio', text:info.portfolio  },
    vis.linkedin  !== false && info.linkedin  && { key:'linkedin',  text:info.linkedin  },
  ].filter(Boolean);

  /* ── SIDEBAR ─────────────────────────────────────────────── */
  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'skills': return data.skills?.length > 0 ? (
        <div key="skills" style={BREAK_ITEM}>
          <SbHeading label={tr('skills', isRTL)} accent={accent} isRTL={isRTL} />
          {data.skills.map((sk, i) => (
            <div key={i} style={{ marginBottom:'9pt' }}>
              <div style={{ fontSize:'8pt', color:'rgba(255,255,255,0.88)', fontWeight:'600', textAlign:align }}>
                {typeof sk === 'string' ? sk : (sk.name || sk)}
              </div>
              <SegmentBar level={typeof sk === 'object' ? (sk.level || 0) : 0} accent={accent} />
            </div>
          ))}
        </div>
      ) : null;

      case 'languages': return data.languages?.length > 0 ? (
        <div key="languages" style={BREAK_ITEM}>
          <SbHeading label={tr('languages', isRTL)} accent={accent} isRTL={isRTL} />
          {data.languages.map((l, i) => {
            const map = { native:5, fluent:4, advanced:4, 'upper-intermediate':3, intermediate:3, elementary:2, beginner:1 };
            const lvl = l.proficiency || map[(l.level || '').toLowerCase()] || 3;
            return (
              <div key={i} style={{ marginBottom:'8pt' }}>
                <div style={{ fontSize:'8pt', color:'rgba(255,255,255,0.88)', fontWeight:'600', textAlign:align }}>{l.name}</div>
                <DotRow level={lvl} accent={accent} />
              </div>
            );
          })}
        </div>
      ) : null;

      case 'interests': return data.interests?.length > 0 ? (
        <div key="interests" style={BREAK_ITEM}>
          <SbHeading label={tr('interests', isRTL)} accent={accent} isRTL={isRTL} />
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4pt' }}>
            {data.interests.map((item, i) => (
              <span key={i} style={{
                background:'rgba(255,255,255,0.08)', border:`1px solid ${accent}40`,
                borderRadius:'3pt', padding:'2pt 7pt',
                fontSize:'7pt', color:'rgba(255,255,255,0.8)',
              }}>{item.name || item}</span>
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
            <SbHeading label={tr(key, isRTL)} accent={accent} isRTL={isRTL} />
            {items.map((c, i) => (
              <div key={i} style={{ marginBottom:'5pt', textAlign:align }}>
                <div style={{ fontSize:'7.5pt', color:'rgba(255,255,255,0.88)', fontWeight:'600' }}>{c.name || c.title || c}</div>
                {(c.institution || c.issuer) && <div style={{ fontSize:'6.5pt', color:`${accent}bb` }}>{c.institution || c.issuer}</div>}
              </div>
            ))}
          </div>
        );
      }

      case 'awards': return data.awards?.length > 0 ? (
        <div key="awards" style={BREAK_ITEM}>
          <SbHeading label={tr('awards', isRTL)} accent={accent} isRTL={isRTL} />
          {data.awards.map((a, i) => (
            <div key={i} style={{ fontSize:'7.5pt', color:'rgba(255,255,255,0.8)', marginBottom:'4pt', textAlign:align }}>
              {a.title || a.name || a}
            </div>
          ))}
        </div>
      ) : null;

      case 'organisations': return data.organisations?.length > 0 ? (
        <div key="organisations" style={BREAK_ITEM}>
          <SbHeading label={tr('organisations', isRTL)} accent={accent} isRTL={isRTL} />
          {data.organisations.map((o, i) => (
            <div key={i} style={{ fontSize:'7.5pt', color:'rgba(255,255,255,0.75)', marginBottom:'4pt', textAlign:align }}>
              {o.name || o}
            </div>
          ))}
        </div>
      ) : null;

      default: return null;
    }
  };

  /* ── MAIN ────────────────────────────────────────────────── */
  const renderMain = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary': return info.summary ? (
        <div key="summary" style={BREAK_ITEM}>
          <MainHeading label={tr('summary', isRTL)} accent={accent} isRTL={isRTL} />
          <div style={{
            fontSize:sz.body, color:'#4a5568', lineHeight,
            whiteSpace:'pre-line', textAlign:align, direction:dir,
            padding:'8pt 10pt',
            backgroundColor:OFFWHITE,
            borderRadius:'4pt',
            ...(isRTL ? { borderRight:`3px solid ${accent}` } : { borderLeft:`3px solid ${accent}` }),
          }}>{info.summary}</div>
        </div>
      ) : null;

      case 'experience': return data.experience?.length > 0 ? (
        <div key="experience">
          <MainHeading label={tr('experience', isRTL)} accent={accent} isRTL={isRTL} />
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom:'14pt', ...BREAK_ITEM, display:'flex', gap:'10pt', direction:dir }}>
              {!isRTL && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'2pt', flexShrink:0 }}>
                  <div style={{ width:'10pt', height:'10pt', borderRadius:'50%', backgroundColor:accent, boxShadow:`0 0 0 3pt ${accent}20`, flexShrink:0 }} />
                  {i < (data.experience.length - 1) && <div style={{ flex:1, width:'2px', backgroundColor:`${accent}25`, minHeight:'20pt' }} />}
                </div>
              )}
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8pt', direction:dir }}>
                  <div style={{ fontSize:sz.body, fontWeight:'800', color:TEXT, textAlign:align }}>{e.jobTitle}</div>
                  <div style={{
                    fontSize:'7pt', color:WHITE, whiteSpace:'nowrap', flexShrink:0,
                    backgroundColor:accent, padding:'2pt 8pt', borderRadius:'20pt',
                  }}>
                    {e.startDate}{(e.endDate || e.current) ? ` – ${e.current ? tr('present', isRTL) : e.endDate}` : ''}
                  </div>
                </div>
                <div style={{ fontSize:'8.5pt', color:accent, fontWeight:'700', marginBottom:'3pt', textAlign:align, direction:dir }}>
                  {e.company}{e.location ? ` · ${e.location}` : ''}
                </div>
                {e.description && (
                  <div style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line', textAlign:align, direction:dir }}>
                    {e.description}
                  </div>
                )}
              </div>
              {isRTL && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'2pt', flexShrink:0 }}>
                  <div style={{ width:'10pt', height:'10pt', borderRadius:'50%', backgroundColor:accent, boxShadow:`0 0 0 3pt ${accent}20`, flexShrink:0 }} />
                  {i < (data.experience.length - 1) && <div style={{ flex:1, width:'2px', backgroundColor:`${accent}25`, minHeight:'20pt' }} />}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null;

      case 'education': return data.education?.length > 0 ? (
        <div key="education">
          <MainHeading label={tr('education', isRTL)} accent={accent} isRTL={isRTL} />
          {data.education.map((e, i) => (
            <div key={i} style={{
              marginBottom:'11pt', ...BREAK_ITEM,
              padding:'8pt 10pt',
              backgroundColor: i % 2 === 0 ? OFFWHITE : WHITE,
              borderRadius:'4pt',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'6pt', direction:dir }}>
                <div style={{ fontSize:sz.body, fontWeight:'800', color:TEXT, textAlign:align }}>{e.degree}</div>
                <div style={{ fontSize:'7.5pt', color:MUTED, whiteSpace:'nowrap', flexShrink:0 }}>
                  {e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}
                </div>
              </div>
              <div style={{ fontSize:'8.5pt', color:accent, fontWeight:'700', marginBottom:'3pt', textAlign:align, direction:dir }}>
                {e.institution}{e.location ? ` · ${e.location}` : ''}
              </div>
              {e.description && <div style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line', textAlign:align, direction:dir }}>{e.description}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'projects': return data.projects?.length > 0 ? (
        <div key="projects">
          <MainHeading label={tr('projects', isRTL)} accent={accent} isRTL={isRTL} />
          {data.projects.map((p, i) => (
            <div key={i} style={{
              marginBottom:'10pt', ...BREAK_ITEM, direction:dir, textAlign:align,
              ...(isRTL ? { paddingRight:'10pt', borderRight:`2px solid ${accent}30` } : { paddingLeft:'10pt', borderLeft:`2px solid ${accent}30` }),
            }}>
              <div style={{ fontSize:sz.body, fontWeight:'800', color:TEXT }}>{p.title || p.name}</div>
              {p.link && <div style={{ fontSize:'7.5pt', color:accent }}>{p.link}</div>}
              {p.description && <div style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line' }}>{p.description}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'publications': return data.publications?.length > 0 ? (
        <div key="publications">
          <MainHeading label={tr('publications', isRTL)} accent={accent} isRTL={isRTL} />
          {data.publications.map((p, i) => (
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM, direction:dir }}>
              <div style={{ display:'flex', justifyContent: isRTL ? 'flex-end' : 'flex-start', alignItems:'flex-start', gap:'6pt' }}>
                <div style={{ fontSize:sz.body, fontWeight:'700', color:TEXT, flex:1, textAlign:align }}>{p.title}</div>
                {p.date && <div style={{ fontSize:'7.5pt', color:MUTED, whiteSpace:'nowrap' }}>{p.date}</div>}
              </div>
              {p.publisher && <div style={{ fontSize:'8.5pt', color:accent, textAlign:align }}>{p.publisher}</div>}
              {p.description && <div style={{ fontSize:sz.body, color:'#555', lineHeight, textAlign:align }}>{p.description}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'references': return data.references?.length > 0 ? (
        <div key="references">
          <MainHeading label={tr('references', isRTL)} accent={accent} isRTL={isRTL} />
          {data.references.map((r, i) => (
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM, direction:dir, textAlign:align }}>
              <div style={{ fontSize:sz.body, fontWeight:'700', color:TEXT }}>{r.name}</div>
              {(r.title || r.company) && <div style={{ fontSize:'8.5pt', color:accent }}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
              {(r.email || r.phone) && <div style={{ fontSize:sz.body, color:'#555' }}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
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
              <MainHeading label={sec.title} accent={accent} isRTL={isRTL} />
              {sec.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom:'10pt', ...BREAK_ITEM, direction:dir, textAlign:align }}>
                  {item.title && <div style={{ fontSize:sz.body, fontWeight:'700', color:TEXT }}>{item.title}</div>}
                  {item.subtitle && <div style={{ fontSize:'8pt', color:accent }}>{item.subtitle}</div>}
                  {item.description && <div style={{ fontSize:sz.body, color:'#555', lineHeight }}>{item.description}</div>}
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

  return (
    <div style={{
      fontFamily:font, fontSize:sz.body, color:TEXT,
      width:'794px', minHeight:'1122px', boxSizing:'border-box',
      backgroundColor: theme?.bgColor || WHITE, display:'flex',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      direction: 'ltr',
    }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════ */}
      <div style={{
        width:`${SIDEBAR_W}px`, flexShrink:0,
        background: theme?.sidebarColor ? theme.sidebarColor : `linear-gradient(180deg, ${NAVY} 0%, ${NAVY2} 100%)`,
        display:'flex', flexDirection:'column',
        boxSizing:'border-box', minHeight:'1122px',
      }}>
        {/* Accent top bar */}
        <div style={{ height:'5pt', background:`linear-gradient(to right, ${accent}, ${INDIGO2})`, flexShrink:0 }} />

        {/* Profile section */}
        <div style={{ padding:'22pt 16pt 16pt', flexShrink:0, textAlign:'center' }}>
          {/* Photo / default avatar circle */}
          {vis.photo !== false && (
            <div style={{
              width:'84pt', height:'84pt', borderRadius:'50%',
              border:`3px solid ${accent}`,
              boxShadow:`0 0 0 5pt ${NAVY2}, 0 0 0 7pt ${accent}30, 0 8px 24px rgba(0,0,0,0.5)`,
              overflow:'hidden', margin:'0 auto 12pt',
              backgroundColor:'rgba(255,255,255,0.06)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width:'100%', height:'100%', objectFit: info.photo ? 'cover' : 'contain' }} />
            </div>
          )}

          {/* Name */}
          <div style={{ fontSize:'12.5pt', fontWeight:'900', color:WHITE, lineHeight:1.15, marginBottom:'4pt', letterSpacing:'-0.02em' }}>
            {info.fullName || ''}
          </div>

          {/* Job title badge */}
          {info.jobTitle && (
            <div style={{
              display:'inline-block',
              background:`linear-gradient(135deg, ${accent}, ${INDIGO2})`,
              color:WHITE, fontSize:'7.5pt', fontWeight:'700',
              padding:'3pt 10pt', borderRadius:'20pt',
              marginBottom:'14pt', letterSpacing:'0.02em',
            }}>{info.jobTitle}</div>
          )}

          {/* Divider */}
          <div style={{ height:'1px', background:`linear-gradient(to right, transparent, ${accent}60, transparent)`, marginBottom:'0pt' }} />
        </div>

        {/* Contact */}
        {contactItems.length > 0 && (
          <div style={{ padding:'0 16pt', flexShrink:0 }}>
            <div style={{
              fontSize:'7pt', fontWeight:'800', letterSpacing:'0.14em', textTransform:'uppercase',
              color:accent, marginBottom:'8pt', paddingBottom:'5pt',
              borderBottom:`1.5px solid ${accent}35`,
              textAlign: isRTL ? 'right' : 'left',
            }}>{tr('contact', isRTL)}</div>
            {contactItems.map((row, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'7pt', marginBottom:'7pt', direction: isRTL ? 'rtl' : 'ltr' }}>
                <div style={{
                  width:'18pt', height:'18pt', borderRadius:'50%', flexShrink:0,
                  backgroundColor:`${accent}20`, display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {CICON[row.key] || <GlobeIcon />}
                </div>
                <span style={{ fontSize:'7pt', color:'rgba(255,255,255,0.78)', wordBreak:'break-all', lineHeight:1.4, textAlign:align }}>
                  {row.text}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Sidebar sections */}
        <div style={{ padding:'0 16pt', flex:1 }}>
          {sideKeys.map(k => renderSidebar(k))}
        </div>

        {/* Bottom accent bar */}
        <div style={{ height:'4pt', background:`linear-gradient(to right, ${accent}, ${INDIGO2})`, flexShrink:0, marginTop:'auto' }} />
      </div>

      {/* ══ MAIN AREA ════════════════════════════════════════ */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        backgroundColor:WHITE, boxSizing:'border-box',
      }}>
        {/* Thin top accent strip on main */}
        <div style={{ height:'5pt', background:`linear-gradient(to right, ${accent}30, transparent)`, flexShrink:0 }} />

        {/* Main content */}
        <div style={{ padding:'18pt 22pt 28pt', flex:1, direction:dir }}>
          {mainKeys.map(k => renderMain(k))}
        </div>
      </div>
    </div>
  );
};

export default EnglishApexTemplate;
