import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

/* ── Labels ──────────────────────────────────────────────────── */
const L = {
  summary:       { ar: 'نبذة مهنية',        en: 'Professional Summary' },
  experience:    { ar: 'الخبرة المهنية',    en: 'Work Experience'      },
  education:     { ar: 'المؤهلات العلمية',  en: 'Education'            },
  skills:        { ar: 'المهارات',           en: 'Skills'               },
  languages:     { ar: 'اللغات',             en: 'Languages'            },
  interests:     { ar: 'الاهتمامات',         en: 'Interests'            },
  contact:       { ar: 'بيانات التواصل',    en: 'Contact'              },
  projects:      { ar: 'المشاريع',           en: 'Projects'             },
  certificates:  { ar: 'الشهادات',           en: 'Certificates'         },
  courses:       { ar: 'الدورات',            en: 'Courses'              },
  awards:        { ar: 'الجوائز',            en: 'Awards'               },
  organisations: { ar: 'المنظمات',           en: 'Organisations'        },
  publications:  { ar: 'المنشورات',          en: 'Publications'         },
  references:    { ar: 'المراجع',            en: 'References'           },
  present:       { ar: 'حتى الآن',           en: 'Present'              },
};
const tr = (key, isRTL) => L[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const SIDEBAR_W = 210;
const GOLD      = '#b8892a';
const GOLD_LIGHT= '#d4a843';
const NAVY      = '#0d1b2e';

const DEFAULT_ORDER = [
  'summary','experience','education','projects','publications','references',
  'skills','languages','interests','certificates','courses','awards','organisations',
];
const SIDEBAR_KEYS = new Set(['skills','languages','interests','certificates','courses','awards','organisations']);
const MAIN_KEYS    = new Set(['summary','experience','education','projects','publications','references']);

/* ── SVG Icons ─────────────────────────────────────────────── */
const PhoneIcon    = ({c='#fff'}) => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 1h3l1.5 3.5-2 1.2c.8 1.6 2.3 3.1 3.8 3.8l1.2-2L14 9v3c0 1.1-.9 1-2 .7C5 11 1 6 1 3c-.3-1.1-.1-2 1-2z" stroke={c} strokeWidth="1.2" fill="none"/></svg>;
const EmailIcon    = ({c='#fff'}) => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1" stroke={c} strokeWidth="1.2"/><path d="M1 3.5l6 4.5 6-4.5" stroke={c} strokeWidth="1.2"/></svg>;
const LocationIcon = ({c='#fff'}) => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4z" stroke={c} strokeWidth="1.2"/><circle cx="7" cy="5" r="1.5" fill={c}/></svg>;
const GlobeIcon    = ({c='#fff'}) => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke={c} strokeWidth="1.2"/><path d="M7 1.5c-1.5 1.5-2.5 3.3-2.5 5.5S5.5 11 7 12.5M7 1.5c1.5 1.5 2.5 3.3 2.5 5.5S8.5 11 7 12.5M1.5 7h11" stroke={c} strokeWidth="1.1"/></svg>;
const LinkedinIcon = ({c='#fff'}) => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke={c} strokeWidth="1.2"/><path d="M4 6v4M4 4.5v.5M7 10V8a1.5 1.5 0 0 1 3 0v2M7 6v4" stroke={c} strokeWidth="1.2" strokeLinecap="round"/></svg>;
const CICON = { phone:<PhoneIcon/>, email:<EmailIcon/>, location:<LocationIcon/>, portfolio:<GlobeIcon/>, linkedin:<LinkedinIcon/> };

const ISummary    = () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4" r="3" fill={GOLD}/><path d="M1 13c0-3.3 2.7-5 6-5s6 1.7 6 5" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round"/></svg>;
const IExperience = () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1" y="4" width="12" height="9" rx="1.5" stroke={GOLD} strokeWidth="1.3"/><path d="M4.5 4V2.5A1.5 1.5 0 0 1 6 1h2a1.5 1.5 0 0 1 1.5 1.5V4" stroke={GOLD} strokeWidth="1.3"/><line x1="1" y1="8" x2="13" y2="8" stroke={GOLD} strokeWidth="1"/></svg>;
const IEducation  = () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 2L1 5.5l6 3.5 6-3.5L7 2z" fill={GOLD}/><path d="M4 7.5v3c0 1 1.3 2 3 2s3-1 3-2v-3" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round"/></svg>;
const IProjects   = () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 3h4l2 2h6v7a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3z" stroke={GOLD} strokeWidth="1.3"/></svg>;
const SICON = { summary:<ISummary/>, experience:<IExperience/>, education:<IEducation/>, projects:<IProjects/> };

/* ── Main section heading ─────────────────────────────────── */
const MainHeading = ({ label, iconKey, accent, isRTL }) => {
  const dir = isRTL ? 'rtl' : 'ltr';
  const gradDir = isRTL ? 'to left' : 'to right';
  const borderSide = isRTL ? { borderRight:`2.5px solid ${accent}` } : { borderLeft:`2.5px solid ${accent}` };
  const justifyLine = isRTL ? 'flex-end' : 'flex-start';
  return (
    <div style={{ direction:dir, marginTop:'15pt', marginBottom:'4pt', ...BREAK_HEADING }}>
      <div style={{ display:'flex', alignItems:'center', gap:'7pt', direction:dir }}>
        <div style={{ fontSize:'11pt', fontWeight:'800', color:NAVY, letterSpacing:'-0.01em' }}>{label}</div>
        {SICON[iconKey] || null}
        <div style={{ flex:1, height:'1.5px', background:`linear-gradient(${gradDir}, transparent, ${accent})` }} />
      </div>
      <div style={{ display:'flex', justifyContent:justifyLine }}>
        <div style={{ width:'32pt', height:'2.5px', backgroundColor:accent, borderRadius:'2px', marginTop:'3pt' }} />
      </div>
    </div>
  );
};

/* ── Sidebar section title ────────────────────────────────── */
const SbTitle = ({ label, isRTL, accent }) => {
  const borderStyle = isRTL
    ? { borderRight:`2.5px solid ${accent}`, paddingRight:'7pt', textAlign:'right' }
    : { borderLeft:`2.5px solid ${accent}`,  paddingLeft:'7pt',  textAlign:'left'  };
  return (
    <div style={{
      fontSize:'8pt', fontWeight:'800', color:accent,
      letterSpacing:'0.08em', textTransform:'uppercase',
      marginBottom:'8pt', marginTop:'15pt',
      ...borderStyle, ...BREAK_HEADING,
    }}>{label}</div>
  );
};

/* ── Skill diamond bar ─────────────────────────────────────── */
const DiamondBar = ({ level=3, accent }) => {
  const n = Math.min(Math.max(Math.round(level),1),5);
  return (
    <div style={{ display:'flex', gap:'4pt', direction:'ltr', marginTop:'2pt' }}>
      {[1,2,3,4,5].map(i=>(
        <div key={i} style={{
          width:'9pt', height:'9pt',
          backgroundColor: i<=n ? accent : 'rgba(255,255,255,0.12)',
          transform:'rotate(45deg)', flexShrink:0,
        }}/>
      ))}
    </div>
  );
};

/* ── Circular language gauge ────────────────────────────────── */
const LangGauge = ({ pct=75, label, accent }) => {
  const r=18, circ=2*Math.PI*r, dash=(pct/100)*circ;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'2pt' }}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"/>
        <circle cx="24" cy="24" r={r} fill="none" stroke={accent} strokeWidth="4"
          strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={circ/4} strokeLinecap="round"/>
        <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">{pct}</text>
      </svg>
      <div style={{ fontSize:'7pt', color:'rgba(255,255,255,0.7)', textAlign:'center' }}>{label}</div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
const ArabicLuxeTemplate = ({
  data, theme,
  visibleSections={}, visiblePersonalFields={},
  sectionOrder=DEFAULT_ORDER,
}) => {
  /* ── Layout is always RTL/Arabic — matches the reference design ── */
  const isRTL = true;
  const accent = theme?.primaryColor || GOLD;
  const { sz, font, lineHeight } = resolveTheme(theme, true);
  const dir   = 'rtl';
  const align = 'right';
  const show  = k => visibleSections[k] !== false;
  const info  = data?.personalInfo || {};
  const vis   = visiblePersonalFields || {};
  const initials = (info.fullName||'').split(/\s+/).map(w=>w[0]).filter(Boolean).slice(0,2).join('');

  const contactItems = [
    vis.phone     !==false && info.phone     && { key:'phone',     text:info.phone     },
    vis.email     !==false && info.email     && { key:'email',     text:info.email     },
    vis.location  !==false && info.location  && { key:'location',  text:info.location  },
    vis.portfolio !==false && info.portfolio && { key:'portfolio', text:info.portfolio  },
    vis.linkedin  !==false && info.linkedin  && { key:'linkedin',  text:info.linkedin  },
  ].filter(Boolean);

  /* ── SIDEBAR ─────────────────────────────────────────────── */
  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch(key) {

      case 'skills': return data.skills?.length>0 ? (
        <div key="skills" style={BREAK_ITEM}>
          <SbTitle label={tr('skills',isRTL)} isRTL={isRTL} accent={accent} />
          {data.skills.map((sk,i)=>(
            <div key={i} style={{ marginBottom:'9pt', direction:dir }}>
              <div style={{ fontSize:'8.5pt', color:'#fff', textAlign:align, marginBottom:'3pt' }}>
                {typeof sk==='string' ? sk : (sk.name||sk)}
              </div>
              <DiamondBar level={typeof sk==='object'?(sk.level||3):3} accent={accent} />
            </div>
          ))}
        </div>
      ):null;

      case 'languages': return data.languages?.length>0 ? (
        <div key="languages" style={BREAK_ITEM}>
          <SbTitle label={tr('languages',isRTL)} isRTL={isRTL} accent={accent} />
          <div style={{ display:'flex', flexWrap:'wrap', gap:'5pt', justifyContent:'center' }}>
            {data.languages.map((l,i)=>{
              const map={native:100,fluent:90,advanced:80,'upper-intermediate':75,intermediate:65,elementary:45,beginner:35};
              const pct=l.proficiency?Math.round(l.proficiency*20):(map[(l.level||'').toLowerCase()]??75);
              const shortName=(l.name||'').slice(0,3).toUpperCase();
              return <LangGauge key={i} pct={pct} label={shortName} accent={accent} />;
            })}
          </div>
        </div>
      ):null;

      case 'interests': return data.interests?.length>0 ? (
        <div key="interests" style={BREAK_ITEM}>
          <SbTitle label={tr('interests',isRTL)} isRTL={isRTL} accent={accent} />
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4pt', justifyContent:align==='right'?'flex-end':'flex-start', direction:dir }}>
            {data.interests.map((item,i)=>(
              <span key={i} style={{
                background:'rgba(255,255,255,0.1)', border:`1px solid ${accent}40`,
                borderRadius:'20pt', padding:'3pt 8pt',
                fontSize:'7.5pt', color:'rgba(255,255,255,0.88)',
              }}>{item.name||item}</span>
            ))}
          </div>
        </div>
      ):null;

      case 'certificates':
      case 'courses': {
        const items = data[key];
        if(!items?.length) return null;
        return (
          <div key={key} style={BREAK_ITEM}>
            <SbTitle label={tr(key,isRTL)} isRTL={isRTL} accent={accent} />
            {items.map((c,i)=>(
              <div key={i} style={{ marginBottom:'5pt', direction:dir, textAlign:align }}>
                <div style={{ fontSize:'8pt', color:'#fff', fontWeight:'600' }}>{c.name||c.title||c}</div>
                {(c.institution||c.issuer)&&<div style={{ fontSize:'7pt', color:`${accent}cc` }}>{c.institution||c.issuer}</div>}
              </div>
            ))}
          </div>
        );
      }

      case 'awards': return data.awards?.length>0 ? (
        <div key="awards" style={BREAK_ITEM}>
          <SbTitle label={tr('awards',isRTL)} isRTL={isRTL} accent={accent} />
          {data.awards.map((a,i)=>(
            <div key={i} style={{ fontSize:'8pt', color:'#fff', textAlign:align, direction:dir, marginBottom:'4pt' }}>
              {a.title||a.name||a}
            </div>
          ))}
        </div>
      ):null;

      case 'organisations': return data.organisations?.length>0 ? (
        <div key="organisations" style={BREAK_ITEM}>
          <SbTitle label={tr('organisations',isRTL)} isRTL={isRTL} accent={accent} />
          {data.organisations.map((o,i)=>(
            <div key={i} style={{ fontSize:'8pt', color:'rgba(255,255,255,0.8)', textAlign:align, direction:dir, marginBottom:'4pt' }}>
              {o.name||o}
            </div>
          ))}
        </div>
      ):null;

      default: return null;
    }
  };

  /* ── MAIN ────────────────────────────────────────────────── */
  const renderMain = (key) => {
    if (!show(key)) return null;
    switch(key) {

      case 'summary': return info.summary ? (
        <div key="summary" style={BREAK_ITEM}>
          <MainHeading label={tr('summary',isRTL)} iconKey="summary" accent={accent} isRTL={isRTL} />
          <div style={{
            fontSize:sz.body, color:'#4a5568', lineHeight,
            textAlign:align, whiteSpace:'pre-line', direction:dir,
            ...(isRTL
              ? { borderRight:`3px solid ${accent}20`, paddingRight:'10pt', marginRight:'3pt' }
              : { borderLeft:`3px solid ${accent}20`,  paddingLeft:'10pt',  marginLeft:'3pt'  }),
          }}>{info.summary}</div>
        </div>
      ):null;

      case 'experience': return data.experience?.length>0 ? (
        <div key="experience">
          <MainHeading label={tr('experience',isRTL)} iconKey="experience" accent={accent} isRTL={isRTL} />
          {data.experience.map((e,i)=>(
            <div key={i} style={{
              marginBottom:'12pt', ...BREAK_ITEM,
              ...(isRTL
                ? { paddingRight:'10pt', marginRight:'3pt', borderRight:`3px solid ${accent}20` }
                : { paddingLeft:'10pt',  marginLeft:'3pt',  borderLeft:`3px solid ${accent}20`  }),
            }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:'6pt', direction:dir }}>
                <div style={{ fontSize:sz.body, fontWeight:'800', color:NAVY, flex:1, textAlign:align }}>{e.jobTitle}</div>
                <div style={{ fontSize:'8pt', color:'#888', whiteSpace:'nowrap', flexShrink:0, background:`${accent}15`, padding:'1.5pt 6pt', borderRadius:'20pt' }}>
                  {e.startDate}{(e.endDate||e.current)?` – ${e.current?tr('present',isRTL):e.endDate}`:''}
                </div>
              </div>
              <div style={{ fontSize:'8.5pt', color:accent, fontWeight:'700', textAlign:align, direction:dir, marginBottom:'3pt' }}>
                {e.company}{e.location?` · ${e.location}`:''}
              </div>
              {e.description&&(
                <div style={{ fontSize:sz.body, color:'#555', lineHeight, textAlign:align, whiteSpace:'pre-line', direction:dir }}>
                  {e.description}
                </div>
              )}
            </div>
          ))}
        </div>
      ):null;

      case 'education': return data.education?.length>0 ? (
        <div key="education">
          <MainHeading label={tr('education',isRTL)} iconKey="education" accent={accent} isRTL={isRTL} />
          {data.education.map((e,i)=>(
            <div key={i} style={{
              marginBottom:'11pt', ...BREAK_ITEM,
              ...(isRTL
                ? { paddingRight:'10pt', marginRight:'3pt', borderRight:`3px solid ${accent}20` }
                : { paddingLeft:'10pt',  marginLeft:'3pt',  borderLeft:`3px solid ${accent}20`  }),
            }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:'6pt', direction:dir }}>
                <div style={{ fontSize:sz.body, fontWeight:'800', color:NAVY, flex:1, textAlign:align }}>{e.degree}</div>
                <div style={{ fontSize:'8pt', color:'#888', whiteSpace:'nowrap', flexShrink:0, background:`${accent}15`, padding:'1.5pt 6pt', borderRadius:'20pt' }}>
                  {e.startDate}{e.endDate?` – ${e.endDate}`:''}
                </div>
              </div>
              <div style={{ fontSize:'8.5pt', color:accent, fontWeight:'700', textAlign:align, direction:dir, marginBottom:'3pt' }}>
                {e.institution}{e.location?` · ${e.location}`:''}
              </div>
              {e.description&&(
                <div style={{ fontSize:sz.body, color:'#555', lineHeight, textAlign:align, whiteSpace:'pre-line', direction:dir }}>
                  {e.description}
                </div>
              )}
            </div>
          ))}
        </div>
      ):null;

      case 'projects': return data.projects?.length>0 ? (
        <div key="projects">
          <MainHeading label={tr('projects',isRTL)} iconKey="projects" accent={accent} isRTL={isRTL} />
          {data.projects.map((p,i)=>(
            <div key={i} style={{
              marginBottom:'10pt', ...BREAK_ITEM,
              ...(isRTL
                ? { paddingRight:'10pt', marginRight:'3pt', borderRight:`3px solid ${accent}20` }
                : { paddingLeft:'10pt',  marginLeft:'3pt',  borderLeft:`3px solid ${accent}20`  }),
            }}>
              <div style={{ fontSize:sz.body, fontWeight:'800', color:NAVY, textAlign:align, direction:dir }}>{p.title||p.name}</div>
              {p.link&&<div style={{ fontSize:'8pt', color:accent, textAlign:align }}>{p.link}</div>}
              {p.description&&<div style={{ fontSize:sz.body, color:'#555', lineHeight, textAlign:align, whiteSpace:'pre-line', direction:dir }}>{p.description}</div>}
            </div>
          ))}
        </div>
      ):null;

      case 'publications': return data.publications?.length>0 ? (
        <div key="publications">
          <MainHeading label={tr('publications',isRTL)} iconKey={null} accent={accent} isRTL={isRTL} />
          {data.publications.map((p,i)=>(
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:'6pt', direction:dir }}>
                <div style={{ fontSize:sz.body, fontWeight:'700', color:NAVY, flex:1, textAlign:align }}>{p.title}</div>
                {p.date&&<div style={{ fontSize:'8pt', color:'#888', whiteSpace:'nowrap' }}>{p.date}</div>}
              </div>
              {p.publisher&&<div style={{ fontSize:'8.5pt', color:accent, textAlign:align, direction:dir }}>{p.publisher}</div>}
              {p.description&&<div style={{ fontSize:sz.body, color:'#555', lineHeight, textAlign:align, direction:dir }}>{p.description}</div>}
            </div>
          ))}
        </div>
      ):null;

      case 'references': return data.references?.length>0 ? (
        <div key="references">
          <MainHeading label={tr('references',isRTL)} iconKey={null} accent={accent} isRTL={isRTL} />
          {data.references.map((r,i)=>(
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM }}>
              <div style={{ fontSize:sz.body, fontWeight:'700', color:NAVY, textAlign:align, direction:dir }}>{r.name}</div>
              {(r.title||r.company)&&<div style={{ fontSize:'8.5pt', color:accent, textAlign:align, direction:dir }}>{[r.title,r.company].filter(Boolean).join(' — ')}</div>}
              {(r.email||r.phone)&&<div style={{ fontSize:sz.body, color:'#555', textAlign:align, direction:dir }}>{[r.email,r.phone].filter(Boolean).join(' | ')}</div>}
            </div>
          ))}
        </div>
      ):null;

      default:
        if(key.startsWith('csec-')&&data.customSections){
          const sec=data.customSections.find(s=>s.id===key);
          if(!sec||!sec.items?.length) return null;
          return (
            <div key={key}>
              <MainHeading label={sec.title} iconKey={null} accent={accent} isRTL={isRTL} />
              {sec.items.map((item,idx)=>(
                <div key={idx} style={{ marginBottom:'10pt', ...BREAK_ITEM }}>
                  {item.title&&<div style={{ fontSize:sz.body, fontWeight:'700', color:NAVY, textAlign:align, direction:dir }}>{item.title}</div>}
                  {item.subtitle&&<div style={{ fontSize:'8pt', color:accent, textAlign:align, direction:dir }}>{item.subtitle}</div>}
                  {item.description&&<div style={{ fontSize:sz.body, color:'#555', lineHeight, textAlign:align, direction:dir }}>{item.description}</div>}
                </div>
              ))}
            </div>
          );
        }
        return null;
    }
  };

  const sideKeys = sectionOrder.filter(k=>SIDEBAR_KEYS.has(k));
  const mainKeys = sectionOrder.filter(k=>MAIN_KEYS.has(k));

  /* ══════════════════════ RENDER ═══════════════════════════ */
  return (
    <div style={{
      fontFamily:font, fontSize:sz.body, color:'#1a202c',
      width:'794px', minHeight:'1122px', boxSizing:'border-box',
      display:'flex', flexDirection:'row', backgroundColor:'#f8f6f1',
    }}>

      {/* ══ MAIN AREA (always left in DOM → left side visually) ══ */}
      <div style={{
        flex:1, backgroundColor:'#fff',
        display:'flex', flexDirection:'column',
        boxSizing:'border-box', minHeight:'1122px',
      }}>
        {/* Header strip in main area */}
        <div style={{
          background:`linear-gradient(135deg, #f8f5ee 0%, #f0ece0 100%)`,
          padding:'26pt 24pt 18pt',
          direction:dir, flexShrink:0,
          borderBottom:`3px solid ${GOLD}`,
        }}>
          <div style={{ fontSize:sz.name, fontWeight:'900', color:NAVY, lineHeight:1.1, marginBottom:'5pt', letterSpacing:'-0.02em', textAlign:align }}>
            {info.fullName||''}
          </div>
          {info.jobTitle&&(
            <div style={{ fontSize:'11pt', color:GOLD, fontWeight:'700', letterSpacing:'0.01em', textAlign:align }}>
              {info.jobTitle}
            </div>
          )}
        </div>

        {/* Main sections */}
        <div style={{ padding:'8pt 24pt 28pt', flex:1, direction:dir, boxSizing:'border-box' }}>
          {mainKeys.map(k=>renderMain(k))}
        </div>
      </div>

      {/* ══ SIDEBAR (rendered second → always on RIGHT) ══════ */}
      <div style={{
        width:`${SIDEBAR_W}px`, flexShrink:0,
        backgroundColor:NAVY,
        display:'flex', flexDirection:'column',
        boxSizing:'border-box', minHeight:'1122px',
      }}>
        {/* Top gold strip */}
        <div style={{ height:'6pt', background:`linear-gradient(to right, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`, flexShrink:0 }} />

        {/* Profile photo */}
        <div style={{ display:'flex', justifyContent:'center', paddingTop:'20pt', paddingBottom:'12pt', flexShrink:0 }}>
          <div style={{
            width:'85pt', height:'85pt', borderRadius:'50%',
            overflow:'hidden', flexShrink:0,
            border:`2px solid ${GOLD}`,
            boxShadow:`0 0 0 4px ${NAVY}, 0 0 0 7px ${GOLD}40`,
            backgroundColor:'rgba(255,255,255,0.1)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            {info.photo
              ? <img src={info.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <span style={{ fontSize:'22pt', fontWeight:'800', color:GOLD }}>{initials}</span>
            }
          </div>
        </div>

        {/* Name + title */}
        <div style={{ textAlign:'center', paddingBottom:'14pt', paddingLeft:'10pt', paddingRight:'10pt', flexShrink:0 }}>
          <div style={{ fontSize:'11pt', fontWeight:'800', color:'#fff', lineHeight:1.2, marginBottom:'3pt' }}>
            {info.fullName||''}
          </div>
          {info.jobTitle&&(
            <div style={{
              display:'inline-block',
              background:`linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
              color:NAVY, fontSize:'7.5pt', fontWeight:'700',
              padding:'2pt 10pt', borderRadius:'20pt',
            }}>{info.jobTitle}</div>
          )}
        </div>

        {/* Gold divider */}
        <div style={{ height:'1px', background:`linear-gradient(to right, transparent, ${GOLD}80, transparent)`, flexShrink:0 }} />

        {/* Contact */}
        <div style={{ padding:'12pt 14pt 0', flexShrink:0 }}>
          <SbTitle label={tr('contact',isRTL)} isRTL={isRTL} accent={accent} />
          {contactItems.map((row,i)=>(
            <div key={i} style={{ display:'flex', flexDirection:'row', alignItems:'center', gap:'7pt', marginBottom:'8pt' }}>
              <div style={{
                width:'20pt', height:'20pt', borderRadius:'50%', flexShrink:0,
                background:`linear-gradient(135deg, ${GOLD}40, ${GOLD}20)`,
                border:`1px solid ${GOLD}50`,
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>{CICON[row.key]||<GlobeIcon/>}</div>
              <span style={{ fontSize:'7.5pt', color:'rgba(255,255,255,0.85)', wordBreak:'break-all', lineHeight:1.3, textAlign:'left' }}>
                {row.text}
              </span>
            </div>
          ))}
        </div>

        {/* Sidebar sections */}
        <div style={{ padding:'0 14pt', flex:1 }}>
          {sideKeys.map(k=>renderSidebar(k))}
        </div>

        {/* Bottom gold strip */}
        <div style={{ height:'6pt', background:`linear-gradient(to right, ${GOLD}, ${GOLD_LIGHT}, ${GOLD})`, flexShrink:0, marginTop:'auto' }} />
      </div>

    </div>
  );
};

export default ArabicLuxeTemplate;
