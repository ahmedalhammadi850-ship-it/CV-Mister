import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

const TEAL  = '#0e5f6e';
const TEAL2 = '#1a7a8a';
const LIGHT = '#e8f4f6';

const DEFAULT_ORDER = [
  'summary','experience','education','projects','publications','references',
  'skills','languages','interests','certificates','courses','awards','organisations',
];
const SIDEBAR_KEYS = new Set(['skills','languages','interests','certificates','courses','awards','organisations']);
const MAIN_KEYS    = new Set(['summary','experience','education','projects','publications','references']);

/* ── Labels ────────────────────────────────────────────────── */
const L = {
  summary:'Professional Summary', experience:'Work Experience',
  education:'Education', skills:'Skills', languages:'Languages',
  interests:'Interests', contact:'Contact', projects:'Projects',
  certificates:'Certificates', courses:'Courses', awards:'Awards',
  organisations:'Organisations', publications:'Publications',
  references:'References', present:'Present',
};

/* ── Contact SVG icons ─────────────────────────────────────── */
const PhoneIcon    = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 1h3l1.5 3.5-2 1.2c.8 1.6 2.3 3.1 3.8 3.8l1.2-2L14 9v3c0 1.1-.9 1-2 .7C5 11 1 6 1 3c-.3-1.1-.1-2 1-2z" stroke={TEAL} strokeWidth="1.3" fill="none"/></svg>;
const EmailIcon    = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1" stroke={TEAL} strokeWidth="1.3"/><path d="M1 3.5l6 4.5 6-4.5" stroke={TEAL} strokeWidth="1.3"/></svg>;
const LocationIcon = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4z" stroke={TEAL} strokeWidth="1.3"/><circle cx="7" cy="5" r="1.5" fill={TEAL}/></svg>;
const GlobeIcon    = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke={TEAL} strokeWidth="1.3"/><path d="M7 1.5c-1.5 1.5-2.5 3.3-2.5 5.5S5.5 11 7 12.5M7 1.5c1.5 1.5 2.5 3.3 2.5 5.5S8.5 11 7 12.5M1.5 7h11" stroke={TEAL} strokeWidth="1.1"/></svg>;
const LinkedinIcon = () => <svg width="11" height="11" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke={TEAL} strokeWidth="1.3"/><path d="M4 6v4M4 4.5v.5M7 10V8a1.5 1.5 0 0 1 3 0v2M7 6v4" stroke={TEAL} strokeWidth="1.3" strokeLinecap="round"/></svg>;
const CICON_SB = { phone:<PhoneIcon/>, email:<EmailIcon/>, location:<LocationIcon/>, portfolio:<GlobeIcon/>, linkedin:<LinkedinIcon/> };

/* ── Progress bar skill ─────────────────────────────────────── */
const ProgressBar = ({ level=3, accent }) => {
  const pct = (Math.min(Math.max(level,1),5)/5)*100;
  return (
    <div style={{ height:'5pt', borderRadius:'3pt', backgroundColor:'#e2e8f0', overflow:'hidden', marginTop:'2pt' }}>
      <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(to right, ${accent}, ${TEAL2})`, borderRadius:'3pt' }} />
    </div>
  );
};

/* ── Dot rating (languages sidebar) ────────────────────────── */
const DotRating = ({ level=3, accent }) => {
  const n = Math.min(Math.max(Math.round(level),1),5);
  return (
    <div style={{ display:'flex', gap:'3pt', marginTop:'2pt' }}>
      {[1,2,3,4,5].map(i=>(
        <div key={i} style={{
          width:'8pt', height:'8pt', borderRadius:'50%',
          backgroundColor: i<=n ? accent : '#e2e8f0',
        }}/>
      ))}
    </div>
  );
};

/* ── Sidebar section title ──────────────────────────────────── */
const SbHeading = ({ label, accent }) => (
  <div style={{
    fontSize:'7.5pt', fontWeight:'800', color:accent,
    textTransform:'uppercase', letterSpacing:'0.1em',
    borderBottom:`1.5px solid ${accent}`, paddingBottom:'4pt',
    marginBottom:'8pt', marginTop:'14pt', ...BREAK_HEADING,
  }}>{label}</div>
);

/* ── Main section heading ───────────────────────────────────── */
const MainHeading = ({ label, accent }) => (
  <div style={{ marginTop:'15pt', marginBottom:'8pt', ...BREAK_HEADING }}>
    <div style={{ display:'flex', alignItems:'center', gap:'8pt' }}>
      <div style={{ width:'4pt', height:'16pt', backgroundColor:accent, borderRadius:'2pt', flexShrink:0 }} />
      <div style={{ fontSize:'11pt', fontWeight:'800', color:'#1a202c', letterSpacing:'-0.01em' }}>{label}</div>
      <div style={{ flex:1, height:'1px', backgroundColor:'#e2e8f0' }} />
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════ */
const EnglishHorizonTemplate = ({
  data, theme, isRTL=false,
  visibleSections={}, visiblePersonalFields={},
  sectionOrder=DEFAULT_ORDER,
}) => {
  const accent = theme?.primaryColor || TEAL;
  const { sz, font, lineHeight } = resolveTheme(theme, false);
  const show = k => visibleSections[k] !== false;
  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};
  const initials = (info.fullName||'').split(/\s+/).map(w=>w[0]).filter(Boolean).slice(0,2).join('');

  const nameParts = (info.fullName||'Full Name').trim().split(/\s+/);
  const firstName = nameParts.slice(0,-1).join(' ') || nameParts[0];
  const lastName  = nameParts.length>1 ? nameParts[nameParts.length-1] : '';

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
          <SbHeading label={L.skills} accent={accent} />
          {data.skills.map((sk,i)=>(
            <div key={i} style={{ marginBottom:'8pt' }}>
              <div style={{ fontSize:'8.5pt', color:'#2d3748', fontWeight:'600', marginBottom:'2pt' }}>
                {typeof sk==='string' ? sk : (sk.name||sk)}
              </div>
              <ProgressBar level={typeof sk==='object'?(sk.level||3):3} accent={accent} />
            </div>
          ))}
        </div>
      ):null;

      case 'languages': return data.languages?.length>0 ? (
        <div key="languages" style={BREAK_ITEM}>
          <SbHeading label={L.languages} accent={accent} />
          {data.languages.map((l,i)=>(
            <div key={i} style={{ marginBottom:'8pt' }}>
              <div style={{ fontSize:'8.5pt', color:'#2d3748', fontWeight:'600', marginBottom:'2pt' }}>{l.name}</div>
              <DotRating level={l.proficiency||3} accent={accent} />
            </div>
          ))}
        </div>
      ):null;

      case 'interests': return data.interests?.length>0 ? (
        <div key="interests" style={BREAK_ITEM}>
          <SbHeading label={L.interests} accent={accent} />
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4pt' }}>
            {data.interests.map((item,i)=>(
              <span key={i} style={{
                background:LIGHT, border:`1px solid ${accent}30`,
                borderRadius:'3pt', padding:'2pt 7pt',
                fontSize:'7.5pt', color:'#4a5568',
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
            <SbHeading label={L[key]||key} accent={accent} />
            {items.map((c,i)=>(
              <div key={i} style={{ marginBottom:'5pt' }}>
                <div style={{ fontSize:'8pt', color:'#2d3748', fontWeight:'600' }}>{c.name||c.title||c}</div>
                {(c.institution||c.issuer)&&<div style={{ fontSize:'7pt', color:'#718096' }}>{c.institution||c.issuer}</div>}
              </div>
            ))}
          </div>
        );
      }

      case 'awards': return data.awards?.length>0 ? (
        <div key="awards" style={BREAK_ITEM}>
          <SbHeading label={L.awards} accent={accent} />
          {data.awards.map((a,i)=>(
            <div key={i} style={{ fontSize:'8pt', color:'#2d3748', marginBottom:'4pt' }}>
              {a.title||a.name||a}
            </div>
          ))}
        </div>
      ):null;

      case 'organisations': return data.organisations?.length>0 ? (
        <div key="organisations" style={BREAK_ITEM}>
          <SbHeading label={L.organisations} accent={accent} />
          {data.organisations.map((o,i)=>(
            <div key={i} style={{ fontSize:'8pt', color:'#4a5568', marginBottom:'4pt' }}>{o.name||o}</div>
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
          <MainHeading label={L.summary} accent={accent} />
          <div style={{ fontSize:sz.body, color:'#4a5568', lineHeight, whiteSpace:'pre-line' }}>
            {info.summary}
          </div>
        </div>
      ):null;

      case 'experience': return data.experience?.length>0 ? (
        <div key="experience">
          <MainHeading label={L.experience} accent={accent} />
          {data.experience.map((e,i)=>(
            <div key={i} style={{ marginBottom:'13pt', ...BREAK_ITEM, display:'flex', gap:'10pt' }}>
              {/* Timeline dot */}
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'1pt', flexShrink:0 }}>
                <div style={{ width:'9pt', height:'9pt', borderRadius:'50%', backgroundColor:accent, flexShrink:0 }} />
                {i<(data.experience.length-1)&&<div style={{ flex:1, width:'1.5px', backgroundColor:`${accent}30`, minHeight:'20pt' }} />}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'6pt' }}>
                  <div style={{ fontSize:sz.body, fontWeight:'800', color:'#1a202c' }}>{e.jobTitle}</div>
                  <div style={{
                    fontSize:'7.5pt', color:'#fff', whiteSpace:'nowrap', flexShrink:0,
                    background:accent, padding:'2pt 8pt', borderRadius:'20pt',
                  }}>
                    {e.startDate}{(e.endDate||e.current)?` – ${e.current?L.present:e.endDate}`:''}
                  </div>
                </div>
                <div style={{ fontSize:'8.5pt', color:accent, fontWeight:'700', marginBottom:'3pt' }}>
                  {e.company}{e.location?` · ${e.location}`:''}
                </div>
                {e.description&&(
                  <div style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line' }}>
                    {e.description}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ):null;

      case 'education': return data.education?.length>0 ? (
        <div key="education">
          <MainHeading label={L.education} accent={accent} />
          {data.education.map((e,i)=>(
            <div key={i} style={{ marginBottom:'11pt', ...BREAK_ITEM, display:'flex', gap:'10pt' }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', paddingTop:'1pt', flexShrink:0 }}>
                <div style={{ width:'9pt', height:'9pt', borderRadius:'50%', backgroundColor:accent, border:`2px solid ${LIGHT}`, flexShrink:0 }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'6pt' }}>
                  <div style={{ fontSize:sz.body, fontWeight:'800', color:'#1a202c' }}>{e.degree}</div>
                  <div style={{ fontSize:'7.5pt', color:'#718096', whiteSpace:'nowrap', flexShrink:0 }}>
                    {e.startDate}{e.endDate?` – ${e.endDate}`:''}
                  </div>
                </div>
                <div style={{ fontSize:'8.5pt', color:accent, fontWeight:'700', marginBottom:'3pt' }}>
                  {e.institution}{e.location?` · ${e.location}`:''}
                </div>
                {e.description&&<div style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line' }}>{e.description}</div>}
              </div>
            </div>
          ))}
        </div>
      ):null;

      case 'projects': return data.projects?.length>0 ? (
        <div key="projects">
          <MainHeading label={L.projects} accent={accent} />
          {data.projects.map((p,i)=>(
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM }}>
              <div style={{ fontSize:sz.body, fontWeight:'800', color:'#1a202c' }}>{p.title||p.name}</div>
              {p.link&&<div style={{ fontSize:'8pt', color:accent }}>{p.link}</div>}
              {p.description&&<div style={{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line' }}>{p.description}</div>}
            </div>
          ))}
        </div>
      ):null;

      case 'publications': return data.publications?.length>0 ? (
        <div key="publications">
          <MainHeading label={L.publications} accent={accent} />
          {data.publications.map((p,i)=>(
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <div style={{ fontSize:sz.body, fontWeight:'700', color:'#1a202c', flex:1 }}>{p.title}</div>
                {p.date&&<div style={{ fontSize:'8pt', color:'#718096', whiteSpace:'nowrap', marginLeft:'8pt' }}>{p.date}</div>}
              </div>
              {p.publisher&&<div style={{ fontSize:'8.5pt', color:accent }}>{p.publisher}</div>}
              {p.description&&<div style={{ fontSize:sz.body, color:'#555', lineHeight }}>{p.description}</div>}
            </div>
          ))}
        </div>
      ):null;

      case 'references': return data.references?.length>0 ? (
        <div key="references">
          <MainHeading label={L.references} accent={accent} />
          {data.references.map((r,i)=>(
            <div key={i} style={{ marginBottom:'10pt', ...BREAK_ITEM }}>
              <div style={{ fontSize:sz.body, fontWeight:'700', color:'#1a202c' }}>{r.name}</div>
              {(r.title||r.company)&&<div style={{ fontSize:'8.5pt', color:accent }}>{[r.title,r.company].filter(Boolean).join(' — ')}</div>}
              {(r.email||r.phone)&&<div style={{ fontSize:sz.body, color:'#555' }}>{[r.email,r.phone].filter(Boolean).join(' | ')}</div>}
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
              <MainHeading label={sec.title} accent={accent} />
              {sec.items.map((item,idx)=>(
                <div key={idx} style={{ marginBottom:'10pt', ...BREAK_ITEM }}>
                  {item.title&&<div style={{ fontSize:sz.body, fontWeight:'700', color:'#1a202c' }}>{item.title}</div>}
                  {item.subtitle&&<div style={{ fontSize:'8pt', color:accent }}>{item.subtitle}</div>}
                  {item.description&&<div style={{ fontSize:sz.body, color:'#555', lineHeight }}>{item.description}</div>}
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
        display:'flex', flexDirection:'row',
        alignItems:'stretch', flexShrink:0,
        minHeight:'110pt',
      }}>
        {/* Left: photo */}
        <div style={{
          width:'100pt', flexShrink:0,
          display:'flex', alignItems:'center', justifyContent:'center',
          padding:'18pt 0 18pt 18pt',
        }}>
          <div style={{
            width:'72pt', height:'72pt', borderRadius:'50%',
            overflow:'hidden', flexShrink:0,
            border:'3px solid rgba(255,255,255,0.5)',
            boxShadow:'0 4px 20px rgba(0,0,0,0.25)',
            backgroundColor:'rgba(255,255,255,0.15)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            {info.photo
              ? <img src={info.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
              : <span style={{ fontSize:'20pt', fontWeight:'800', color:'#fff' }}>{initials}</span>
            }
          </div>
        </div>

        {/* Center: name + title + summary snippet */}
        <div style={{ flex:1, padding:'20pt 16pt', display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ lineHeight:1.05, marginBottom:'5pt' }}>
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
              marginBottom:'8pt',
            }}>
              <div style={{ width:'20pt', height:'2px', backgroundColor:'rgba(255,255,255,0.4)' }}/>
              <span style={{ fontSize:'10pt', color:'rgba(255,255,255,0.75)', fontWeight:'500', letterSpacing:'0.02em' }}>
                {info.jobTitle}
              </span>
            </div>
          )}
        </div>

        {/* Right: contact strip */}
        <div style={{
          width:'190pt', flexShrink:0,
          backgroundColor:'rgba(0,0,0,0.18)',
          padding:'16pt 16pt',
          display:'flex', flexDirection:'column', justifyContent:'center', gap:'6pt',
        }}>
          {contactItems.slice(0,5).map((row,i)=>(
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'6pt' }}>
              <div style={{
                width:'16pt', height:'16pt', borderRadius:'50%', flexShrink:0,
                backgroundColor:'rgba(255,255,255,0.15)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                {/* White icon */}
                {row.key==='phone'    &&<svg width="9" height="9" viewBox="0 0 14 14" fill="none"><path d="M3 1h3l1.5 3.5-2 1.2c.8 1.6 2.3 3.1 3.8 3.8l1.2-2L14 9v3c0 1.1-.9 1-2 .7C5 11 1 6 1 3c-.3-1.1-.1-2 1-2z" stroke="#fff" strokeWidth="1.3" fill="none"/></svg>}
                {row.key==='email'    &&<svg width="9" height="9" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="12" height="9" rx="1" stroke="#fff" strokeWidth="1.3"/><path d="M1 3.5l6 4.5 6-4.5" stroke="#fff" strokeWidth="1.3"/></svg>}
                {row.key==='location' &&<svg width="9" height="9" viewBox="0 0 14 14" fill="none"><path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4z" stroke="#fff" strokeWidth="1.3"/><circle cx="7" cy="5" r="1.5" fill="#fff"/></svg>}
                {row.key==='portfolio'&&<svg width="9" height="9" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="#fff" strokeWidth="1.3"/><path d="M7 1.5c-1.5 1.5-2.5 3.3-2.5 5.5S5.5 11 7 12.5M7 1.5c1.5 1.5 2.5 3.3 2.5 5.5S8.5 11 7 12.5M1.5 7h11" stroke="#fff" strokeWidth="1.1"/></svg>}
                {row.key==='linkedin' &&<svg width="9" height="9" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="#fff" strokeWidth="1.3"/><path d="M4 6v4M4 4.5v.5M7 10V8a1.5 1.5 0 0 1 3 0v2M7 6v4" stroke="#fff" strokeWidth="1.3" strokeLinecap="round"/></svg>}
              </div>
              <span style={{ fontSize:'7.5pt', color:'rgba(255,255,255,0.85)', wordBreak:'break-all', lineHeight:1.3 }}>
                {row.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ BODY (sidebar left + main right) ════════════════ */}
      <div style={{ display:'flex', flexDirection:'row', flex:1 }}>

        {/* LEFT SIDEBAR */}
        <div style={{
          width:`${SIDEBAR_W}px`, flexShrink:0,
          backgroundColor:LIGHT,
          borderRight:`2px solid ${TEAL}15`,
          padding:'18pt 16pt 24pt',
          boxSizing:'border-box',
          minHeight:'800px',
        }}>
          {sideKeys.map(k=>renderSidebar(k))}
        </div>

        {/* RIGHT MAIN */}
        <div style={{
          flex:1, padding:'18pt 22pt 28pt',
          boxSizing:'border-box', backgroundColor:'#fff',
        }}>
          {mainKeys.map(k=>renderMain(k))}
        </div>
      </div>
    </div>
  );
};

export default EnglishHorizonTemplate;
