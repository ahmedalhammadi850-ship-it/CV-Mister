import { resolveTheme, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';
import BulletDesc from './BulletDesc';

const GitHubIcon = () => <svg width="9" height="9" viewBox="0 0 16 16" fill="rgba(255,255,255,0.85)"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>;

const TEAL  = '#0e5f6e';
const TEAL2 = '#1a7a8a';
const LIGHT = '#e8f4f6';

const DEFAULT_ORDER = [
  'summary','experience','education','projects','publications','references',
  'skills','languages','interests','certificates','courses','awards','organisations',
];
const SIDEBAR_KEYS = new Set(['skills','languages','interests','certificates','courses','awards','organisations']);
const MAIN_KEYS    = new Set(['summary','experience','education','projects','publications','references']);

/* ── Bilingual labels ───────────────────────────────────────── */
const L = {
  summary:       { en: 'Professional Summary', ar: 'نبذة مهنية'        },
  experience:    { en: 'Work Experience',       ar: 'الخبرة المهنية'   },
  education:     { en: 'Education',            ar: 'التعليم'           },
  skills:        { en: 'Skills',               ar: 'المهارات'          },
  languages:     { en: 'Languages',            ar: 'اللغات'            },
  interests:     { en: 'Interests',            ar: 'الاهتمامات'        },
  contact:       { en: 'Contact',              ar: 'التواصل'           },
  projects:      { en: 'Projects',             ar: 'المشاريع'          },
  certificates:  { en: 'Certificates',         ar: 'الشهادات'          },
  courses:       { en: 'Courses',              ar: 'الدورات'           },
  awards:        { en: 'Awards',               ar: 'الجوائز'           },
  organisations: { en: 'Organisations',        ar: 'المنظمات'          },
  publications:  { en: 'Publications',         ar: 'المنشورات'         },
  references:    { en: 'References',           ar: 'المراجع'           },
  present:       { en: 'Present',              ar: 'حتى الآن'          },
};

/* ── Progress bar ───────────────────────────────────────────── */
const ProgressBar = ({ level=3, accent }) => {
  if ((level ?? 0) <= 0) return null;
  const pct = level > 5 ? Math.min(level, 100) : (Math.min(Math.max(level,1),5)/5)*100;
  return (
    <div style={{ height:'5pt', borderRadius:'3pt', backgroundColor:'#d0e8ec', overflow:'hidden', marginTop:'2pt' }}>
      <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(to right, ${accent}, ${TEAL2})`, borderRadius:'3pt' }} />
    </div>
  );
};

/* ── Dot rating ─────────────────────────────────────────────── */
const DotRating = ({ level=3, accent }) => {
  const lvl = level > 5 ? Math.round(level / 20) : level;
  if (lvl <= 0) return null;
  const n = Math.min(Math.max(Math.round(lvl),1),5);
  return (
    <div style={{ display:'flex', gap:'3pt', marginTop:'2pt' }}>
      {[1,2,3,4,5].map(i=>(
        <div key={i} style={{
          width:'8pt', height:'8pt', borderRadius:'50%',
          backgroundColor: i<=n ? accent : '#c8dfe4',
        }}/>
      ))}
    </div>
  );
};

/* ── Sidebar section heading ────────────────────────────────── */
const SbHeading = ({ label, accent, isRTL }) => {
  const borderStyle = isRTL
    ? { borderRight:`1.5px solid ${accent}`, paddingRight:'7pt', textAlign:'right' }
    : { borderLeft:`1.5px solid ${accent}`,  paddingLeft:'7pt',  textAlign:'left'  };
  return (
    <div style={{
      fontSize:'7.5pt', fontWeight:'800', color:accent,
      textTransform:'uppercase', letterSpacing:'0.1em',
      paddingBottom:'4pt', marginBottom:'8pt', marginTop:'14pt',
      ...borderStyle, ...BREAK_HEADING,
    }}>{label}</div>
  );
};

/* ── Main section heading ───────────────────────────────────── */
const MainHeading = ({ label, accent, isRTL }) => {
  const dir = isRTL ? 'rtl' : 'ltr';
  return (
    <div style={{ marginTop:'15pt', marginBottom:'8pt', direction:dir, ...BREAK_HEADING }}>
      <div style={{ display:'flex', alignItems:'center', gap:'8pt' }}>
        {!isRTL && <div style={{ width:'4pt', height:'16pt', backgroundColor:accent, borderRadius:'2pt', flexShrink:0 }} />}
        <div style={{ fontSize:'11pt', fontWeight:'800', color:'#1a202c', letterSpacing:'-0.01em' }}>{label}</div>
        {isRTL && <div style={{ width:'4pt', height:'16pt', backgroundColor:accent, borderRadius:'2pt', flexShrink:0 }} />}
        <div style={{ flex:1, height:'1px', backgroundColor:'#d0e8ec' }} />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════ */
const EnglishHorizonTemplate = ({
  data, theme,
  isRTL = false,
  visibleSections={}, visiblePersonalFields={},
  sectionOrder=DEFAULT_ORDER,
  sectionNames={},
}) => {
  const tr = (key, isRTL) => sectionNames?.[key] || (L[key]?.[isRTL ? 'ar' : 'en'] ?? key);
  const accent = theme?.primaryColor || TEAL;
  const { sz, font, lineHeight } = resolveTheme(theme, isRTL);
  const dir   = isRTL ? 'rtl' : 'ltr';
  const align = isRTL ? 'right' : 'left';
  const show  = k => visibleSections[k] !== false;
  const info  = data?.personalInfo || {};
  const vis   = visiblePersonalFields || {};
  const initials = (info.fullName||'').split(/\s+/).map(w=>w[0]).filter(Boolean).slice(0,2).join('');

  /* Split name: first part bold-white, last word dimmed */
  const nameParts = (info.fullName||'').trim().split(/\s+/);
  const firstName = nameParts.slice(0,-1).join(' ') || nameParts[0] || '';
  const lastName  = nameParts.length>1 ? nameParts[nameParts.length-1] : '';

  const contactItems = [
    vis.phone     !==false && info.phone     && { key:'phone',     text:info.phone     },
    vis.email     !==false && info.email     && { key:'email',     text:info.email     },
    vis.location  !==false && info.location  && { key:'location',  text:info.location  },
    vis.portfolio !==false && info.portfolio && { key:'portfolio', text:info.portfolio  },
    vis.linkedin  !==false && info.linkedin  && { key:'linkedin',  text:info.linkedin   },
    vis.github    !==false && info.github    && { key:'github',    text:info.github     },
  ].filter(Boolean);

  /* ── SIDEBAR ─────────────────────────────────────────────── */
  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch(key) {

      case 'skills': return data.skills?.length>0 ? (
        <section key="skills" style={BREAK_ITEM}>
          <SbHeading label={tr('skills',isRTL)} accent={accent} isRTL={isRTL} />
          {data.skills.map((sk,i)=>(
            <div key={i} style={{ marginBottom:'8pt' }}>
              <div style={{ fontSize:'8.5pt', color:'#2d3748', fontWeight:'600', marginBottom:'2pt', textAlign:align }}>
                {typeof sk==='string' ? sk : (sk.name||sk)}
              </div>
              <ProgressBar level={typeof sk==='object'?(sk.level||0):0} accent={accent} />
            </div>
          ))}
        </section>
      ):null;

      case 'languages': return data.languages?.length>0 ? (
        <section key="languages" style={BREAK_ITEM}>
          <SbHeading label={tr('languages',isRTL)} accent={accent} isRTL={isRTL} />
          {data.languages.map((l,i)=>(
            <div key={i} style={{ marginBottom:'8pt', breakInside:'avoid', pageBreakInside:'avoid' }}>
              <div style={{ fontSize:'8.5pt', color:'#2d3748', fontWeight:'600', marginBottom:'2pt', textAlign:align }}>{l.name}</div>
              <DotRating level={l.proficiency||3} accent={accent} />
            </div>
          ))}
        </section>
      ):null;

      case 'interests': return data.interests?.length>0 ? (
        <section key="interests" style={BREAK_ITEM}>
          <SbHeading label={tr('interests',isRTL)} accent={accent} isRTL={isRTL} />
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4pt' }}>
            {data.interests.map((item,i)=>(
              <span key={i} style={{
                background:LIGHT, border:`1px solid ${accent}30`,
                borderRadius:'3pt', padding:'2pt 7pt',
                fontSize:'7.5pt', color:'#4a5568',
              }}>{item.name||item}</span>
            ))}
          </div>
        </section>
      ):null;

      case 'certificates':
      case 'courses': {
        const items = data[key];
        if(!items?.length) return null;
        return (
          <div key={key} style={BREAK_ITEM}>
            <SbHeading label={tr(key,isRTL)} accent={accent} isRTL={isRTL} />
            {items.map((c,i)=>(
              <div key={i} style={{ marginBottom:'5pt', textAlign:align }}>
                <div style={{ fontSize:'8pt', color:'#2d3748', fontWeight:'600' }}>{c.name||c.title||c}</div>
                {(c.institution||c.issuer)&&<div style={{ fontSize:'7pt', color:'#718096' }}>{c.institution||c.issuer}</div>}
              </div>
            ))}
          </div>
        );
      }

      case 'awards': return data.awards?.length>0 ? (
        <section key="awards" style={BREAK_ITEM}>
          <SbHeading label={tr('awards',isRTL)} accent={accent} isRTL={isRTL} />
          {data.awards.map((a,i)=>(
            <div key={i} style={{ fontSize:'8pt', color:'#2d3748', marginBottom:'4pt', textAlign:align }}>
              {a.title||a.name||a}
            </div>
          ))}
        </section>
      ):null;

      case 'organisations': return data.organisations?.length>0 ? (
        <section key="organisations" style={BREAK_ITEM}>
          <SbHeading label={tr('organisations',isRTL)} accent={accent} isRTL={isRTL} />
          {data.organisations.map((o,i)=>(
            <div key={i} style={{ fontSize:'8pt', color:'#4a5568', marginBottom:'4pt', textAlign:align }}>{o.name||o}</div>
          ))}
        </section>
      ):null;

      default: return null;
    }
  };

  /* ── MAIN ────────────────────────────────────────────────── */
  const renderMain = (key) => {
    if (!show(key)) return null;
    switch(key) {

      case 'summary': return info.summary ? (
        <section key="summary" style={BREAK_ITEM}>
          <MainHeading label={tr('summary',isRTL)} accent={accent} isRTL={isRTL} />
          <div style={{ fontSize:sz.body, color:'#4a5568', lineHeight, whiteSpace:'pre-line', textAlign:align, direction:dir }}>
            {info.summary}
          </div>
        </section>
      ):null;

      case 'experience': return data.experience?.length>0 ? (
        <section key="experience">
          <MainHeading label={tr('experience',isRTL)} accent={accent} isRTL={isRTL} />
          {data.experience.map((e,i)=>(
            <div key={i} style={{ marginBottom:'13pt', ...BREAK_ITEM, display:'flex', gap:'10pt', direction:dir }}>
              {/* Timeline dot */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'1pt', flexShrink:0 }}>
                <div style={{ width:'9pt', height:'9pt', borderRadius:'50%', backgroundColor:accent, flexShrink:0 }} />
                {i<(data.experience.length-1)&&<div style={{ flex:1, width:'1.5px', backgroundColor:`${accent}30`, minHeight:'20pt' }} />}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'6pt' }}>
                  <div style={{ fontSize:sz.body, fontWeight:'800', color:'#1a202c', textAlign:align }}>{e.jobTitle}</div>
                  <div style={{
                    fontSize:'7.5pt', color:'#fff', whiteSpace:'nowrap', flexShrink:0,
                    background:accent, padding:'2pt 8pt', borderRadius:'20pt',
                  }}>
                    {e.startDate}{(e.endDate||e.current)?` – ${e.current?tr('present',isRTL):e.endDate}`:''}
                  </div>
                </div>
                <div style={{ fontSize:'8.5pt', color:accent, fontWeight:'700', marginBottom:'3pt', textAlign:align }}>
                  {e.company}{e.location?` · ${e.location}`:''}
                </div>
                {e.description&&(
                  <BulletDesc text={e.description} style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line', textAlign:align, direction:dir }} bold={e?.descriptionBold} italic={e?.descriptionItalic} />
                )}
              </div>
            </div>
          ))}
        </section>
      ):null;

      case 'education': return data.education?.length>0 ? (
        <section key="education">
          <MainHeading label={tr('education',isRTL)} accent={accent} isRTL={isRTL} />
          {data.education.map((e,i)=>(
            <div key={i} style={{ marginBottom:'11pt', ...BREAK_ITEM, display:'flex', gap:'10pt', direction:dir }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'1pt', flexShrink:0 }}>
                <div style={{ width:'9pt', height:'9pt', borderRadius:'50%', backgroundColor:accent, border:`2px solid ${LIGHT}`, flexShrink:0 }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'6pt' }}>
                  <div style={{ fontSize:sz.body, fontWeight:'800', color:'#1a202c', textAlign:align }}>{e.degree}</div>
                  <div style={{ fontSize:'7.5pt', color:'#718096', whiteSpace:'nowrap', flexShrink:0 }}>
                    {e.startDate}{e.endDate?` – ${e.endDate}`:''}
                  </div>
                </div>
                <div style={{ fontSize:'8.5pt', color:accent, fontWeight:'700', marginBottom:'3pt', textAlign:align }}>
                  {e.institution}{e.location?` · ${e.location}`:''}
                </div>
                {e.description&&<BulletDesc text={e.description} style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line', textAlign:align, direction:dir }} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
              </div>
            </div>
          ))}
        </section>
      ):null;

      case 'projects': return data.projects?.length>0 ? (
        <section key="projects">
          <MainHeading label={tr('projects',isRTL)} accent={accent} isRTL={isRTL} />
          {data.projects.map((p,i)=>(
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM, textAlign:align, direction:dir }}>
              <div style={{ fontSize:sz.body, fontWeight:'800', color:'#1a202c' }}>{p.title||p.name}</div>
              {p.link&&<div style={{ fontSize:'8pt', color:accent }}>{p.link}</div>}
              {p.description&&<BulletDesc text={p.description} style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line' }} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
            </div>
          ))}
        </section>
      ):null;

      case 'publications': return data.publications?.length>0 ? (
        <section key="publications">
          <MainHeading label={tr('publications',isRTL)} accent={accent} isRTL={isRTL} />
          {data.publications.map((p,i)=>(
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM, direction:dir }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ fontSize:sz.body, fontWeight:'700', color:'#1a202c', flex:1, textAlign:align }}>{p.title}</div>
                {p.date&&<div style={{ fontSize:'8pt', color:'#718096', whiteSpace:'nowrap', marginLeft:'8pt' }}>{p.date}</div>}
              </div>
              {p.publisher&&<div style={{ fontSize:'8.5pt', color:accent, textAlign:align }}>{p.publisher}</div>}
              {p.description&&<BulletDesc text={p.description} style={{ fontSize:sz.body, color:'#555', lineHeight, textAlign:align }} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
            </div>
          ))}
        </section>
      ):null;

      case 'references': return data.references?.length>0 ? (
        <section key="references">
          <MainHeading label={tr('references',isRTL)} accent={accent} isRTL={isRTL} />
          {data.references.map((r,i)=>(
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM, textAlign:align, direction:dir }}>
              <div style={{ fontSize:sz.body, fontWeight:'700', color:'#1a202c' }}>{r.name}</div>
              {(r.title||r.company)&&<div style={{ fontSize:'8.5pt', color:accent }}>{[r.title,r.company].filter(Boolean).join(' — ')}</div>}
              {(r.email||r.phone)&&<div style={{ fontSize:sz.body, color:'#555' }}>{[r.email,r.phone].filter(Boolean).join(' | ')}</div>}
            </div>
          ))}
        </section>
      ):null;

      default:
        if(key.startsWith('csec-')&&data.customSections){
          const sec=data.customSections.find(s=>s.id===key);
          if(!sec||!sec.items?.length) return null;
          return (
            <div key={key}>
              <MainHeading label={sec.title} accent={accent} isRTL={isRTL} />
              {sec.items.map((item,idx)=>(
                <div key={idx} style={{ marginBottom:'10pt', ...BREAK_ITEM, textAlign:align, direction:dir }}>
                  {item.title&&<div style={{ fontSize:sz.body, fontWeight:'700', color:'#1a202c' }}>{item.title}</div>}
                  {item.subtitle&&<div style={{ fontSize:'8pt', color:accent }}>{item.subtitle}</div>}
                  {item.description&&<BulletDesc text={item.description} style={{ fontSize:sz.body, color:'#555', lineHeight }} bold={item?.descriptionBold} italic={item?.descriptionItalic} />}
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
  const SIDEBAR_W = 210;

  /* ══════════════════════ RENDER ═══════════════════════════ */
  return (
    <div style={{
      fontFamily:font, fontSize:sz.body, color:'#2d3748',
      width:'794px', minHeight:'1122px',
      boxSizing:'border-box', backgroundColor:'#fff',
      display:'flex', flexDirection:'column',
    }}>

      {/* ══ HEADER ════════════════════════════════════════════ */}
      <div style={{
        background:`linear-gradient(135deg, ${TEAL} 0%, ${TEAL2} 100%)`,
        display:'flex', flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems:'stretch', flexShrink:0,
        minHeight:'110pt',
      }}>
        {/* Photo side */}
        {vis.photo !== false && (
          <div style={{
            width:'100pt', flexShrink:0,
            display:'flex', alignItems:'center', justifyContent:'center',
            padding: isRTL ? '18pt 18pt 18pt 0' : '18pt 0 18pt 18pt',
          }}>
            <div style={{
              width:'72pt', height:'72pt', borderRadius:'50%',
              overflow:'hidden', flexShrink:0,
              border:'3px solid rgba(255,255,255,0.5)',
              boxShadow:'0 4px 20px rgba(0,0,0,0.25)',
              backgroundColor:'rgba(255,255,255,0.15)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width:'100%', height:'100%', objectFit: info.photo ? 'cover' : 'contain' }} />
            </div>
          </div>
        )}

        {/* Center: name + title */}
        <div style={{ flex:1, padding:'20pt 16pt', display:'flex', flexDirection:'column', justifyContent:'center', direction:dir }}>
          <div style={{ lineHeight:1.05, marginBottom:'5pt', textAlign:align }}>
            <span style={{ fontSize:sz.name, fontWeight:'900', color:'rgba(255,255,255,0.92)', letterSpacing:'-0.02em' }}>
              {firstName}{' '}
            </span>
            <span style={{ fontSize:sz.name, fontWeight:'900', color:'rgba(255,255,255,0.55)', letterSpacing:'-0.02em' }}>
              {lastName}
            </span>
          </div>
          {info.jobTitle&&(
            <div style={{
              display:'inline-flex', alignItems:'center', gap:'5pt',
              justifyContent: align==='right' ? 'flex-end' : 'flex-start',
            }}>
              <div style={{ width:'20pt', height:'2px', backgroundColor:'rgba(255,255,255,0.4)' }}/>
              <span style={{ fontSize:'10pt', color:'rgba(255,255,255,0.75)', fontWeight:'500', letterSpacing:'0.02em' }}>
                {info.jobTitle}
              </span>
            </div>
          )}
        </div>

        {/* Contact strip */}
        <div style={{
          width:'190pt', flexShrink:0,
          backgroundColor:'rgba(0,0,0,0.18)',
          padding:'16pt',
          display:'flex', flexDirection:'column', justifyContent:'center', gap:'6pt',
        }}>
          {contactItems.slice(0,5).map((row,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'6pt', direction:'ltr' }}>
              <div style={{
                width:'16pt', height:'16pt', borderRadius:'50%', flexShrink:0,
                backgroundColor:'rgba(255,255,255,0.15)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {row.key==='phone'    &&<svg width="9" height="9" viewBox="0 0 14 14" fill="none"><path d="M3 1h3l1.5 3.5-2 1.2c.8 1.6 2.3 3.1 3.8 3.8l1.2-2L14 9v3c0 1.1-.9 1-2 .7C5 11 1 6 1 3c-.3-1.1-.1-2 1-2z" stroke="#fff" strokeWidth="1.3" fill="none"/></svg>}
                {row.key==='email'    &&<svg width="9" height="9" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1" stroke="#fff" strokeWidth="1.3"/><path d="M1 3.5l6 4.5 6-4.5" stroke="#fff" strokeWidth="1.3"/></svg>}
                {row.key==='location' &&<svg width="9" height="9" viewBox="0 0 14 14" fill="none"><path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4z" stroke="#fff" strokeWidth="1.3"/><circle cx="7" cy="5" r="1.5" fill="#fff"/></svg>}
                {row.key==='portfolio'&&<svg width="9" height="9" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#fff" strokeWidth="1.3"/><path d="M7 1.5c-1.5 1.5-2.5 3.3-2.5 5.5S5.5 11 7 12.5M7 1.5c1.5 1.5 2.5 3.3 2.5 5.5S8.5 11 7 12.5M1.5 7h11" stroke="#fff" strokeWidth="1.1"/></svg>}
                {row.key==='github'  &&<svg width="9" height="9" viewBox="0 0 16 16" fill="rgba(255,255,255,0.85)"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>}
                {row.key==='linkedin' &&<svg width="9" height="9" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="#fff" strokeWidth="1.3"/><path d="M4 6v4M4 4.5v.5M7 10V8a1.5 1.5 0 0 1 3 0v2M7 6v4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round"/></svg>}
              </div>
              <span style={{ fontSize:'7.5pt', color:'rgba(255,255,255,0.85)', wordBreak:'break-all', lineHeight:1.3 }}>
                {row.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ BODY ═════════════════════════════════════════════ */}
      <div style={{
        display:'flex',
        flexDirection: isRTL ? 'row-reverse' : 'row',
        flex:1,
      }}>

        {/* SIDEBAR */}
        <div style={{
          width:`${SIDEBAR_W}px`, flexShrink:0,
          backgroundColor:LIGHT,
          borderRight: isRTL ? 'none' : `2px solid ${TEAL}15`,
          borderLeft:  isRTL ? `2px solid ${TEAL}15` : 'none',
          padding:'18pt 16pt 24pt',
          boxSizing:'border-box',
          minHeight:'800px',
          direction:dir,
        }}>
          {sideKeys.map(k=>renderSidebar(k))}
        </div>

        {/* MAIN */}
        <div style={{
          flex:1, padding:'18pt 22pt 28pt',
          boxSizing:'border-box', backgroundColor:'#fff',
          direction:dir,
        }}>
          {mainKeys.map(k=>renderMain(k))}
        </div>
      </div>
    </div>
  );
};

export default EnglishHorizonTemplate;
