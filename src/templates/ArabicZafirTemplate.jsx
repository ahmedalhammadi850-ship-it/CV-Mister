import { resolveTheme, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

const L = {
  summary:       { ar: 'الملخص المهني',     en: 'Professional Summary' },
  experience:    { ar: 'الخبرة العملية',    en: 'Work Experience'      },
  education:     { ar: 'المؤهلات العلمية',  en: 'Education'            },
  skills:        { ar: 'المهارات',           en: 'Skills'               },
  languages:     { ar: 'اللغات',             en: 'Languages'            },
  interests:     { ar: 'الاهتمامات',         en: 'Interests'            },
  contact:       { ar: 'التواصل',            en: 'Contact'              },
  projects:      { ar: 'المشاريع',           en: 'Projects'             },
  certificates:  { ar: 'الشهادات',           en: 'Certificates'         },
  courses:       { ar: 'الدورات',            en: 'Courses'              },
  awards:        { ar: 'الجوائز',            en: 'Awards'               },
  organisations: { ar: 'المنظمات',           en: 'Organisations'        },
  publications:  { ar: 'المنشورات',          en: 'Publications'         },
  references:    { ar: 'المراجع',            en: 'References'           },
  present:       { ar: 'حتى الآن',           en: 'Present'              },
};

const PLUM    = '#2d1040';
const PLUM2   = '#3d1a55';
const COPPER  = '#c07840';
const COPPER2 = '#e09858';
const CREAM   = '#fdfaf5';
const CHARCOAL= '#2d2d3a';
const SIDEBAR_W = 215;

const DEFAULT_ORDER = [
  'summary','experience','education','projects','publications','references',
  'skills','languages','interests','certificates','courses','awards','organisations',
];
const SIDEBAR_KEYS = new Set(['skills','languages','interests','certificates','courses','awards','organisations']);
const MAIN_KEYS    = new Set(['summary','experience','education','projects','publications','references']);

/* ── SVG Icons ──────────────────────────────────────────────── */
const PhoneIcon    = () => <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M3 1h3l1.5 3.5-2 1.2c.8 1.6 2.3 3.1 3.8 3.8l1.2-2L14 9v3c0 1.1-.9 1-2 .7C5 11 1 6 1 3c-.3-1.1-.1-2 1-2z" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" fill="none"/></svg>;
const EmailIcon    = () => <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2"/><path d="M1 3.5l6 4.5 6-4.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2"/></svg>;
const LocationIcon = () => <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4z" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2"/><circle cx="7" cy="5" r="1.5" fill="rgba(255,255,255,0.75)"/></svg>;
const GlobeIcon    = () => <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2"/><path d="M7 1.5c-1.5 1.5-2.5 3.3-2.5 5.5S5.5 11 7 12.5M7 1.5c1.5 1.5 2.5 3.3 2.5 5.5S8.5 11 7 12.5M1.5 7h11" stroke="rgba(255,255,255,0.75)" strokeWidth="1.1"/></svg>;
const LinkedinIcon = () => <svg width="10" height="10" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2"/><path d="M4 6v4M4 4.5v.5M7 10V8a1.5 1.5 0 0 1 3 0v2M7 6v4" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="round"/></svg>;
const GitHubIcon = () => <svg width="11" height="11" viewBox="0 0 16 16" fill="rgba(255,255,255,0.7)"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>;
const CICON = { phone:<PhoneIcon/>, email:<EmailIcon/>, location:<LocationIcon/>, portfolio:<GlobeIcon/>, linkedin:<LinkedinIcon/> };

/* ── Skill fill bar ─────────────────────────────────────────── */
const SkillBar = ({ level = 3, accent }) => {
    if ((level ?? 0) <= 0) return null;
  const pct = level > 5 ? Math.min(level, 100) : (Math.min(Math.max(level, 1), 5) / 5) * 100;
  return (
    <div style={{ height:'5pt', borderRadius:'3pt', backgroundColor:'rgba(255,255,255,0.1)', marginTop:'3pt', overflow:'hidden' }}>
      <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(to right, ${accent}, ${COPPER2})`, borderRadius:'3pt' }} />
    </div>
  );
};

/* ── Language circle gauge ──────────────────────────────────── */
const LangGauge = ({ pct = 75, label, accent }) => {
  const r = 16, circ = 2 * Math.PI * r, dash = (pct / 100) * circ;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2pt' }}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3.5"/>
        <circle cx="22" cy="22" r={r} fill="none" stroke={accent} strokeWidth="3.5"
          strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4} strokeLinecap="round"/>
        <text x="22" y="26" textAnchor="middle" fontSize="9" fontWeight="700" fill="#fff">{pct}</text>
      </svg>
      <div style={{ fontSize:'6.5pt', color:'rgba(255,255,255,0.65)', textAlign:'center' }}>{label}</div>
    </div>
  );
};

/* ── Sidebar section title ──────────────────────────────────── */
const SbTitle = ({ label, isRTL, accent }) => (
  <div style={{
    fontSize:'7pt', fontWeight:'800', letterSpacing:'0.12em', textTransform:'uppercase',
    color: accent, marginTop:'18pt', marginBottom:'9pt', textAlign:'center',
    display:'flex', alignItems:'center', gap:'5pt',
    ...BREAK_HEADING,
  }}>
    <div style={{ flex:1, height:'1px', background:`linear-gradient(${isRTL?'to left':'to right'}, transparent, ${accent}50)` }}/>
    <span>{label}</span>
    <div style={{ flex:1, height:'1px', background:`linear-gradient(${isRTL?'to right':'to left'}, transparent, ${accent}50)` }}/>
  </div>
);

/* ── Decorative diamond row ─────────────────────────────────── */
const DiamondRow = ({ accent }) => (
  <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'5pt', margin:'4pt 0' }}>
    {[1,2,3].map(i => (
      <div key={i} style={{
        width: i===2?'6pt':'4pt', height: i===2?'6pt':'4pt',
        backgroundColor: i===2?accent:`${accent}60`,
        transform:'rotate(45deg)',
      }}/>
    ))}
  </div>
);

/* ── Main section heading ───────────────────────────────────── */
const MainHeading = ({ label, accent, isRTL }) => {
  const dir = isRTL ? 'rtl' : 'ltr';
  return (
    <div style={{ marginTop:'16pt', marginBottom:'6pt', direction:dir, ...BREAK_HEADING }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8pt', direction:dir }}>
        {!isRTL && <div style={{ width:'18pt', height:'2.5px', background:`linear-gradient(to right, ${accent}, ${COPPER2})`, borderRadius:'2px', flexShrink:0 }} />}
        <span style={{ fontSize:'10.5pt', fontWeight:'800', color:CHARCOAL, letterSpacing:'-0.01em', whiteSpace:'nowrap' }}>{label}</span>
        {isRTL && <div style={{ width:'18pt', height:'2.5px', background:`linear-gradient(to left, ${accent}, ${COPPER2})`, borderRadius:'2px', flexShrink:0 }} />}
        <div style={{ flex:1, height:'1px', backgroundColor:`${accent}25` }} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const ArabicZafirTemplate = ({
  data, theme,
  isRTL = true,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const accent = theme?.primaryColor || COPPER;
  const { sz, font, lineHeight } = resolveTheme(theme, isRTL);
  const dir   = isRTL ? 'rtl' : 'ltr';
  const align = isRTL ? 'right' : 'left';
  const show  = k => visibleSections[k] !== false;
  const tr = (key, isRTL) => sectionNames?.[key] || (L[key]?.[isRTL ? 'ar' : 'en'] ?? key);
  const info  = data?.personalInfo || {};
  const vis   = visiblePersonalFields || {};
  const initials = (info.fullName || '').split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('');

  const contactItems = [
    vis.phone     !== false && info.phone     && { key:'phone',     text:info.phone     },
    vis.email     !== false && info.email     && { key:'email',     text:info.email     },
    vis.location  !== false && info.location  && { key:'location',  text:info.location  },
    vis.portfolio !== false && info.portfolio && { key:'portfolio', text:info.portfolio  },
    vis.linkedin  !== false && info.linkedin  && { key:'linkedin',  text:info.linkedin  },
    vis.github    !== false && info.github    && { key:'github',    text:info.github    },
  ].filter(Boolean);

  /* ── SIDEBAR ─────────────────────────────────────────────── */
  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'skills': return data.skills?.length > 0 ? (
        <section key="skills" style={BREAK_ITEM}>
          <SbTitle label={tr('skills', isRTL)} isRTL={isRTL} accent={accent} />
          {data.skills.map((sk, i) => (
            <div key={i} style={{ marginBottom:'9pt', direction:dir }}>
              <div style={{ fontSize:'8pt', color:'rgba(255,255,255,0.88)', fontWeight:'600', textAlign:align }}>
                {typeof sk === 'string' ? sk : (sk.name || sk)}
              </div>
              <SkillBar level={typeof sk === 'object' ? (sk.level || 0) : 0} accent={accent} />
            </div>
          ))}
        </section>
      ) : null;

      case 'languages': return data.languages?.length > 0 ? (
        <section key="languages" style={BREAK_ITEM}>
          <SbTitle label={tr('languages', isRTL)} isRTL={isRTL} accent={accent} />
          <div style={{ display:'flex', flexWrap:'wrap', gap:'5pt', justifyContent:'center' }}>
            {data.languages.map((l, i) => {
              const map = { native:100, fluent:90, advanced:80, 'upper-intermediate':75, intermediate:65, elementary:45, beginner:35 };
              const pct = l.proficiency ? Math.round(l.proficiency * 20) : (map[(l.level || '').toLowerCase()] ?? 75);
              return <LangGauge key={i} pct={pct} label={(l.name || '').slice(0, 3).toUpperCase()} accent={accent} />;
            })}
          </div>
        </section>
      ) : null;

      case 'interests': return data.interests?.length > 0 ? (
        <section key="interests" style={BREAK_ITEM}>
          <SbTitle label={tr('interests', isRTL)} isRTL={isRTL} accent={accent} />
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4pt', justifyContent:'center' }}>
            {data.interests.map((item, i) => (
              <span key={i} style={{
                background:'rgba(255,255,255,0.08)', border:`1px solid ${accent}45`,
                borderRadius:'20pt', padding:'2.5pt 8pt',
                fontSize:'7pt', color:'rgba(255,255,255,0.82)',
              }}>{typeof item === 'string' ? item : item.name}</span>
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
            <SbTitle label={tr(key, isRTL)} isRTL={isRTL} accent={accent} />
            {items.map((c, i) => (
              <div key={i} style={{ marginBottom:'5pt', direction:dir, textAlign:align }}>
                <div style={{ fontSize:'7.5pt', color:'rgba(255,255,255,0.88)', fontWeight:'600' }}>{c.name || c.title || c}</div>
                {(c.institution || c.issuer) && <div style={{ fontSize:'6.5pt', color:`${accent}cc` }}>{c.institution || c.issuer}</div>}
              </div>
            ))}
          </div>
        );
      }

      case 'awards': return data.awards?.length > 0 ? (
        <section key="awards" style={BREAK_ITEM}>
          <SbTitle label={tr('awards', isRTL)} isRTL={isRTL} accent={accent} />
          {data.awards.map((a, i) => (
            <div key={i} style={{ fontSize:'7.5pt', color:'rgba(255,255,255,0.82)', textAlign:align, direction:dir, marginBottom:'4pt' }}>
              {a.title || a.name || a}
            </div>
          ))}
        </section>
      ) : null;

      case 'organisations': return data.organisations?.length > 0 ? (
        <section key="organisations" style={BREAK_ITEM}>
          <SbTitle label={tr('organisations', isRTL)} isRTL={isRTL} accent={accent} />
          {data.organisations.map((o, i) => (
            <div key={i} style={{ fontSize:'7.5pt', color:'rgba(255,255,255,0.75)', textAlign:align, direction:dir, marginBottom:'4pt' }}>
              {o.name || o}
            </div>
          ))}
        </section>
      ) : null;

      default: return null;
    }
  };

  /* ── MAIN ────────────────────────────────────────────────── */
  const renderMain = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary': return info.summary ? (
        <section key="summary" style={BREAK_ITEM}>
          <MainHeading label={tr('summary', isRTL)} accent={accent} isRTL={isRTL} />
          <div style={{
            fontSize:sz.body, color:'#4a5568', lineHeight, textAlign:align,
            whiteSpace:'pre-line', direction:dir,
            padding:'8pt 10pt',
            background:`${accent}08`,
            borderRadius:'4pt',
            ...(isRTL ? { borderRight:`3px solid ${accent}40` } : { borderLeft:`3px solid ${accent}40` }),
          }}>{info.summary}</div>
        </section>
      ) : null;

      case 'experience': return data.experience?.length > 0 ? (
        <section key="experience">
          <MainHeading label={tr('experience', isRTL)} accent={accent} isRTL={isRTL} />
          {data.experience.map((e, i) => (
            <div key={i} style={{ marginBottom:'13pt', ...BREAK_ITEM, display:'flex', gap:'9pt', direction:dir }}>
              {!isRTL && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'2pt', flexShrink:0 }}>
                  <div style={{ width:'10pt', height:'10pt', borderRadius:'50%', background:`linear-gradient(135deg, ${accent}, ${COPPER2})`, boxShadow:`0 0 0 3pt ${accent}18`, flexShrink:0 }} />
                  {i < (data.experience.length - 1) && <div style={{ flex:1, width:'1.5px', background:`linear-gradient(to bottom, ${accent}40, transparent)`, minHeight:'20pt' }} />}
                </div>
              )}
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'6pt', direction:dir }}>
                  <div style={{ fontSize:sz.body, fontWeight:'800', color:CHARCOAL, textAlign:align }}>{e.jobTitle}</div>
                  <div style={{
                    fontSize:'7pt', color:'#fff', whiteSpace:'nowrap', flexShrink:0,
                    background:`linear-gradient(135deg, ${accent}, ${COPPER2})`,
                    padding:'2pt 7pt', borderRadius:'20pt',
                  }}>
                    {e.startDate}{(e.endDate || e.current) ? ` – ${e.current ? tr('present', isRTL) : e.endDate}` : ''}
                  </div>
                </div>
                <div style={{ fontSize:'8.5pt', color:accent, fontWeight:'700', marginBottom:'3pt', textAlign:align, direction:dir }}>
                  {e.company}{e.location ? ` · ${e.location}` : ''}
                </div>
                {e.description && (
                  <div style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line', textAlign:align, direction:dir }}>
                    <span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span>
                  </div>
                )}
              </div>
              {isRTL && (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'2pt', flexShrink:0 }}>
                  <div style={{ width:'10pt', height:'10pt', borderRadius:'50%', background:`linear-gradient(135deg, ${accent}, ${COPPER2})`, boxShadow:`0 0 0 3pt ${accent}18`, flexShrink:0 }} />
                  {i < (data.experience.length - 1) && <div style={{ flex:1, width:'1.5px', background:`linear-gradient(to bottom, ${accent}40, transparent)`, minHeight:'20pt' }} />}
                </div>
              )}
            </div>
          ))}
        </section>
      ) : null;

      case 'education': return data.education?.length > 0 ? (
        <section key="education">
          <MainHeading label={tr('education', isRTL)} accent={accent} isRTL={isRTL} />
          {data.education.map((e, i) => (
            <div key={i} style={{
              marginBottom:'10pt', ...BREAK_ITEM,
              ...(isRTL ? { paddingRight:'10pt', marginRight:'2pt', borderRight:`2px solid ${accent}25` } : { paddingLeft:'10pt', marginLeft:'2pt', borderLeft:`2px solid ${accent}25` }),
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'6pt', direction:dir }}>
                <div style={{ fontSize:sz.body, fontWeight:'800', color:CHARCOAL, textAlign:align }}>{e.degree}</div>
                <div style={{ fontSize:'7.5pt', color:'#888', whiteSpace:'nowrap', flexShrink:0 }}>
                  {e.startDate}{e.endDate ? ` – ${e.endDate}` : ''}
                </div>
              </div>
              <div style={{ fontSize:'8.5pt', color:accent, fontWeight:'700', marginBottom:'3pt', textAlign:align, direction:dir }}>
                {e.institution}{e.location ? ` · ${e.location}` : ''}
              </div>
              {e.description && <div style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line', textAlign:align, direction:dir }}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>}
            </div>
          ))}
        </section>
      ) : null;

      case 'projects': return data.projects?.length > 0 ? (
        <section key="projects">
          <MainHeading label={tr('projects', isRTL)} accent={accent} isRTL={isRTL} />
          {data.projects.map((p, i) => (
            <div key={i} style={{
              marginBottom:'10pt', ...BREAK_ITEM, direction:dir, textAlign:align,
              ...(isRTL ? { paddingRight:'10pt', borderRight:`2px solid ${accent}25` } : { paddingLeft:'10pt', borderLeft:`2px solid ${accent}25` }),
            }}>
              <div style={{ fontSize:sz.body, fontWeight:'800', color:CHARCOAL }}>{p.title || p.name}</div>
              {p.link && <div style={{ fontSize:'7.5pt', color:accent }}>{p.link}</div>}
              {p.description && <div style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line' }}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>}
            </div>
          ))}
        </section>
      ) : null;

      case 'publications': return data.publications?.length > 0 ? (
        <section key="publications">
          <MainHeading label={tr('publications', isRTL)} accent={accent} isRTL={isRTL} />
          {data.publications.map((p, i) => (
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM, direction:dir }}>
              <div style={{ display:'flex', justifyContent: isRTL ? 'flex-end' : 'flex-start', alignItems:'flex-start', gap:'6pt' }}>
                <div style={{ fontSize:sz.body, fontWeight:'700', color:CHARCOAL, flex:1, textAlign:align }}>{p.title}</div>
                {p.date && <div style={{ fontSize:'7.5pt', color:'#888', whiteSpace:'nowrap' }}>{p.date}</div>}
              </div>
              {p.publisher && <div style={{ fontSize:'8.5pt', color:accent, textAlign:align }}>{p.publisher}</div>}
              {p.description && <div style={{ fontSize:sz.body, color:'#555', lineHeight, textAlign:align }}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>}
            </div>
          ))}
        </section>
      ) : null;

      case 'references': return data.references?.length > 0 ? (
        <section key="references">
          <MainHeading label={tr('references', isRTL)} accent={accent} isRTL={isRTL} />
          {data.references.map((r, i) => (
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM, direction:dir, textAlign:align }}>
              <div style={{ fontSize:sz.body, fontWeight:'700', color:CHARCOAL }}>{r.name}</div>
              {(r.title || r.company) && <div style={{ fontSize:'8.5pt', color:accent }}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
              {(r.email || r.phone) && <div style={{ fontSize:sz.body, color:'#555' }}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
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
              <MainHeading label={sec.title} accent={accent} isRTL={isRTL} />
              {sec.items.map((item, idx) => (
                <div key={idx} style={{ marginBottom:'10pt', ...BREAK_ITEM, direction:dir, textAlign:align }}>
                  {item.title && <div style={{ fontSize:sz.body, fontWeight:'700', color:CHARCOAL }}>{item.title}</div>}
                  {item.subtitle && <div style={{ fontSize:'8pt', color:accent }}>{item.subtitle}</div>}
                  {item.description && <div style={{ fontSize:sz.body, color:'#555', lineHeight }}><span style={{fontWeight:item?.descriptionBold?700:undefined,fontStyle:item?.descriptionItalic?"italic":undefined}}>{item.description}</span></div>}
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
      fontFamily:font, fontSize:sz.body, color:CHARCOAL,
      width:'794px', minHeight:'1122px', boxSizing:'border-box',
      backgroundColor:CREAM, display:'flex', flexDirection:'column',
    }}>

      {/* ══ FULL-WIDTH HEADER ════════════════════════════════ */}
      <div style={{
        background:`linear-gradient(135deg, ${PLUM} 0%, #1e0830 50%, ${PLUM2} 100%)`,
        flexShrink:0, position:'relative', overflow:'hidden',
        padding:'24pt 30pt 20pt',
      }}>
        {/* Decorative top shimmer */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'3pt', background:`linear-gradient(to right, transparent, ${accent}, ${COPPER2}, ${accent}, transparent)` }} />

        {/* Decorative circle ornaments */}
        <div style={{ position:'absolute', top:'-25pt', left:'-15pt', width:'90pt', height:'90pt', borderRadius:'50%', border:`1px solid ${accent}18`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-20pt', right:'-10pt', width:'70pt', height:'70pt', borderRadius:'50%', border:`1px solid ${accent}15`, pointerEvents:'none' }} />

        {/* Content row */}
        <div style={{ display:'flex', alignItems:'center', gap:'20pt', direction:dir }}>

          {/* Photo */}
          {vis.photo !== false && (
            <div style={{ flexShrink:0 }}>
              <div style={{
                width:'82pt', height:'82pt', borderRadius:'50%',
                border:`2.5px solid ${accent}`,
                boxShadow:`0 0 0 5pt ${PLUM}, 0 0 0 7.5pt ${accent}40, 0 4px 20px rgba(0,0,0,0.4)`,
                overflow:'hidden',
                backgroundColor:'rgba(255,255,255,0.08)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width:'100%', height:'100%', objectFit: info.photo ? 'cover' : 'contain' }} />
              </div>
            </div>
          )}

          {/* Name + title + contact */}
          <div style={{ flex:1, direction:dir }}>
            <div style={{ fontSize:sz.name, fontWeight:'900', color:'#ffffff', lineHeight:1.05, marginBottom:'3pt', letterSpacing:'-0.02em', textAlign:align }}>
              {info.fullName || ''}
            </div>
            {info.jobTitle && (
              <div style={{ fontSize:'11pt', color:accent, fontWeight:'600', textAlign:align, marginBottom:'10pt', letterSpacing:'0.01em' }}>
                {info.jobTitle}
              </div>
            )}
            {/* Contact row */}
            {contactItems.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'10pt', direction:dir, justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
                {contactItems.slice(0, 5).map((row, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'4pt', direction:'ltr' }}>
                    {CICON[row.key] || <GlobeIcon />}
                    <span style={{ fontSize:'7pt', color:'rgba(255,255,255,0.72)', lineHeight:1.3 }}>{row.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Decorative bottom line with diamonds */}
        <div style={{ display:'flex', alignItems:'center', gap:'0', marginTop:'16pt' }}>
          <div style={{ flex:1, height:'1px', background:`linear-gradient(to right, transparent, ${accent}50)` }}/>
          <div style={{ width:'5pt', height:'5pt', backgroundColor:accent, transform:'rotate(45deg)', margin:'0 6pt', flexShrink:0 }}/>
          <div style={{ width:'8pt', height:'8pt', backgroundColor:accent, transform:'rotate(45deg)', margin:'0 4pt', flexShrink:0 }}/>
          <div style={{ width:'5pt', height:'5pt', backgroundColor:accent, transform:'rotate(45deg)', margin:'0 6pt', flexShrink:0 }}/>
          <div style={{ flex:1, height:'1px', background:`linear-gradient(to left, transparent, ${accent}50)` }}/>
        </div>
      </div>

      {/* ══ BODY ═════════════════════════════════════════════ */}
      <div style={{ display:'flex', flexDirection: isRTL ? 'row-reverse' : 'row', flex:1 }}>

        {/* SIDEBAR */}
        <div style={{
          width:`${SIDEBAR_W}px`, flexShrink:0,
          background:`linear-gradient(180deg, ${PLUM} 0%, #1a0d2e 100%)`,
          padding:'14pt 14pt 24pt',
          boxSizing:'border-box', minHeight:'800px', direction:dir,
        }}>
          {sideKeys.map(k => renderSidebar(k))}
        </div>

        {/* MAIN */}
        <div style={{
          flex:1, padding:'16pt 22pt 28pt',
          boxSizing:'border-box', backgroundColor:'#fff',
          direction:dir,
        }}>
          {mainKeys.map(k => renderMain(k))}
        </div>
      </div>
    </div>
  );
};

export default ArabicZafirTemplate;
