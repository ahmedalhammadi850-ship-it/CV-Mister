import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

const labels = {
  summary:       { en: 'Professional Summary', ar: 'الملخص المهني'       },
  experience:    { en: 'Work Experience',      ar: 'الخبرات المهنية'      },
  education:     { en: 'Education',            ar: 'التعليم'              },
  skills:        { en: 'Skills',               ar: 'المهارات'             },
  languages:     { en: 'Languages',            ar: 'اللغات'               },
  projects:      { en: 'Projects',             ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',         ar: 'الدورات التدريبية'    },
  interests:     { en: 'Interests',            ar: 'الاهتمامات'           },
  courses:       { en: 'Courses',              ar: 'الدورات التدريبية'    },
  awards:        { en: 'Awards',               ar: 'الجوائز'              },
  organisations: { en: 'Organisations',        ar: 'المنظمات'             },
  publications:  { en: 'Publications',         ar: 'المنشورات'            },
  references:    { en: 'References',           ar: 'المراجع'              },
  contact:       { en: 'Contact',              ar: 'الاتصال'              },
  present:       { en: 'Present',              ar: 'حتى الآن'             },
};
const tr = (key, isRTL) => labels[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const DEFAULT_ORDER = ['summary','experience','education','projects','publications','references','skills','languages','certificates','courses','awards','interests','organisations'];

const SIDEBAR_SECTIONS = new Set(['skills','languages','interests','courses','awards','certificates','organisations']);
const MAIN_SECTIONS    = new Set(['summary','experience','education','projects','publications','references']);

const Bar = ({ level=3, filled, empty }) => {
  const n = Math.min(Math.max(Math.round(level),1),5);
  return (
    <div style={{ display:'flex', gap:'3pt', marginTop:'3pt' }}>
      {[1,2,3,4,5].map(i=>(
        <div key={i} style={{ flex:1, height:'5pt', borderRadius:'3pt', backgroundColor: i<=n ? filled : empty }} />
      ))}
    </div>
  );
};

const Dots = ({ level=3, filled, empty }) => {
  const n = Math.min(Math.max(Math.round(level),1),5);
  return (
    <span style={{ display:'inline-flex', gap:'3pt', verticalAlign:'middle' }}>
      {[1,2,3,4,5].map(i=>(
        <span key={i} style={{ width:'8pt', height:'8pt', borderRadius:'50%', display:'inline-block', backgroundColor: i<=n ? filled : empty }} />
      ))}
    </span>
  );
};

const ArabicSlateSidebarTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent     = theme?.primaryColor || '#1f3c5c';
  const accentMid  = accent + 'dd';
  const { sz, font, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const show = k => visibleSections[k] !== false;

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const contactItems = [
    vis.phone     !== false && info.phone     && { icon:'📞', text: info.phone    },
    vis.email     !== false && info.email     && { icon:'✉',  text: info.email    },
    vis.location  !== false && info.location  && { icon:'📍', text: info.location },
    vis.linkedin  !== false && info.linkedin  && { icon:'in', text: info.linkedin },
    vis.portfolio !== false && info.portfolio && { icon:'🌐', text: info.portfolio},
  ].filter(Boolean);

  /* ── Sidebar ── */
  const sb = {
    wrap:{
      width:'210px', minWidth:'210px',
      background: `linear-gradient(180deg, ${accent} 0%, #2c5070 100%)`,
      padding:'0 0 22pt',
      boxSizing:'border-box',
      direction:'rtl',
    },
    topBand:{
      backgroundColor: accent,
      padding:'22pt 13pt 14pt',
    },
    photoWrap:{
      width:'76pt', height:'76pt', borderRadius:'50%',
      overflow:'hidden', margin:'0 auto 10pt',
      border:'3px solid rgba(255,255,255,0.35)',
      backgroundColor:'rgba(255,255,255,0.12)',
      display:'flex', alignItems:'center', justifyContent:'center',
    },
    initials:{ fontSize:'22pt', fontWeight:'700', color:'#fff' },
    innerPad:{ padding:'0 13pt' },
    sectionBox:{
      backgroundColor:'rgba(255,255,255,0.12)',
      borderRadius:'4pt',
      padding:'4pt 8pt',
      marginBottom:'8pt',
      marginTop: sectionMt,
      ...BREAK_HEADING,
    },
    sectionLabel:{ fontSize:'8.5pt', fontWeight:'700', color:'#fff', textAlign:'right', letterSpacing:'0.05em' },
    contactRow:{
      display:'flex', gap:'7pt', marginBottom:'7pt',
      fontSize:sz.meta, color:'rgba(255,255,255,0.88)',
      alignItems:'flex-start', flexDirection:'row-reverse',
    },
    icon:{ flexShrink:0, fontSize:'9pt', color:'rgba(255,255,255,0.55)', marginTop:'1pt', width:'11pt', textAlign:'center' },
    skillItem:{ marginBottom:'8pt' },
    skillName:{ fontSize:sz.meta, color:'#fff', textAlign:'right', marginBottom:'2pt' },
    langRow:{
      display:'flex', justifyContent:'space-between', alignItems:'center',
      flexDirection:'row-reverse', marginBottom:'7pt',
    },
    langName:{ fontSize:sz.meta, color:'#fff' },
    bullet:{ fontSize:sz.meta, color:'rgba(255,255,255,0.85)', marginBottom:'4pt', textAlign:'right' },
  };

  /* ── Main ── */
  const mn = {
    wrap:{ flex:1, padding:'0', boxSizing:'border-box', direction:'rtl', backgroundColor:'#fff', display:'flex', flexDirection:'column' },
    nameBar:{
      backgroundColor:'#f0f4f8',
      borderBottom:`3px solid ${accent}`,
      padding:'18pt 20pt 14pt',
      textAlign:'right',
    },
    name:{ fontSize:sz.name, fontWeight:'700', color:'#1a202c', lineHeight:1.2, marginBottom:'2pt' },
    jobTitle:{ fontSize:sz.body, color:accent, fontStyle:'italic', fontWeight:'600' },
    content:{ padding:'16pt 20pt 18pt', flex:1 },
    heading:{
      fontSize:sz.heading, fontWeight:'700', color:accent,
      textAlign:'right', marginBottom:'8pt', marginTop: sectionMt,
      display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'8pt',
      ...BREAK_HEADING,
    },
    headingLine:{ flex:1, height:'1.5px', backgroundColor: accent+'44' },
    row:{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8pt', flexDirection:'row-reverse' },
    role:{ fontSize:sz.body, fontWeight:'700', color:'#1a202c', flex:1, textAlign:'right' },
    date:{ fontSize:sz.meta, color:'#888', whiteSpace:'nowrap', flexShrink:0 },
    company:{ fontSize:sz.meta, color:accent, fontWeight:'600', marginBottom:'3pt', textAlign:'right' },
    bodyText:{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line', textAlign:'right' },
    item:{ marginBottom:'12pt', ...BREAK_ITEM },
  };

  const SBSection = ({ label, children }) => (
    <div style={{ padding:'0 13pt' }}>
      <div style={sb.sectionBox}><div style={sb.sectionLabel}>{label}</div></div>
      {children}
    </div>
  );

  const MNHeading = ({ label }) => (
    <div style={mn.heading}>
      <span>{label}</span>
      <div style={mn.headingLine} />
    </div>
  );

  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch(key) {
      case 'skills': return data.skills?.length > 0 ? (
        <SBSection key="skills" label={tr('skills',true)}>
          {data.skills.map((sk,i)=>(
            <div key={i} style={sb.skillItem}>
              <div style={sb.skillName}>{sk.name||sk}</div>
              <Bar level={sk.level||3} filled="rgba(255,255,255,0.9)" empty="rgba(255,255,255,0.2)" />
            </div>
          ))}
        </SBSection>
      ) : null;

      case 'languages': return data.languages?.length > 0 ? (
        <SBSection key="languages" label={tr('languages',true)}>
          {data.languages.map((l,i)=>(
            <div key={i} style={sb.langRow}>
              <Dots level={l.proficiency||3} filled="#fff" empty="rgba(255,255,255,0.2)" />
              <span style={sb.langName}>{l.name}</span>
            </div>
          ))}
        </SBSection>
      ) : null;

      case 'certificates':
      case 'courses': {
        const items = data[key];
        if(!items?.length) return null;
        return (
          <SBSection key={key} label={tr(key,true)}>
            {items.map((c,i)=>(
              <div key={i} style={{ marginBottom:'7pt', paddingRight:'0' }}>
                <div style={{ ...sb.bullet, fontWeight:'600', color:'#fff' }}>{c.name||c.title||c}</div>
                {(c.institution||c.issuer) && <div style={{ ...sb.bullet, fontSize:'8pt', color:'rgba(255,255,255,0.6)' }}>{c.institution||c.issuer}</div>}
                {c.date && <div style={{ ...sb.bullet, fontSize:'8pt', color:'rgba(255,255,255,0.5)' }}>{c.date}</div>}
              </div>
            ))}
          </SBSection>
        );
      }

      case 'awards': return data.awards?.length > 0 ? (
        <SBSection key="awards" label={tr('awards',true)}>
          {data.awards.map((a,i)=>(
            <div key={i} style={{ marginBottom:'6pt' }}>
              <div style={{ ...sb.bullet, fontWeight:'600', color:'#fff' }}>{a.title||a.name||a}</div>
              {a.issuer && <div style={{ ...sb.bullet, fontSize:'8pt', color:'rgba(255,255,255,0.6)' }}>{a.issuer}</div>}
            </div>
          ))}
        </SBSection>
      ) : null;

      case 'interests': return data.interests?.length > 0 ? (
        <SBSection key="interests" label={tr('interests',true)}>
          <div style={{ display:'flex', flexWrap:'wrap', flexDirection:'row-reverse', gap:'3pt' }}>
            {data.interests.map((item,i)=>(
              <span key={i} style={{ background:'rgba(255,255,255,0.15)', borderRadius:'3pt', padding:'2pt 6pt', fontSize:sz.meta, color:'#fff' }}>{item.name||item}</span>
            ))}
          </div>
        </SBSection>
      ) : null;

      case 'organisations': return data.organisations?.length > 0 ? (
        <SBSection key="organisations" label={tr('organisations',true)}>
          {data.organisations.map((o,i)=>(<div key={i} style={sb.bullet}>• {o.name||o}</div>))}
        </SBSection>
      ) : null;

      default: return null;
    }
  };

  const renderMain = (key) => {
    if (!show(key)) return null;
    switch(key) {
      case 'summary': return info.summary ? (
        <div key="summary" style={{ ...BREAK_ITEM, marginBottom:'12pt' }}>
          <MNHeading label={tr('summary',true)} />
          <div style={mn.bodyText}>{info.summary}</div>
        </div>
      ) : null;

      case 'experience': return data.experience?.length > 0 ? (
        <div key="experience">
          <MNHeading label={tr('experience',true)} />
          {data.experience.map((e,i)=>(
            <div key={i} style={mn.item}>
              <div style={mn.row}>
                <div style={mn.role}>{e.jobTitle}</div>
                <div style={mn.date}>{e.startDate} – {e.current?tr('present',true):e.endDate}</div>
              </div>
              <div style={mn.company}>{e.company}{e.location?` · ${e.location}`:''}</div>
              {e.description && <div style={mn.bodyText}>{e.description}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'education': return data.education?.length > 0 ? (
        <div key="education">
          <MNHeading label={tr('education',true)} />
          {data.education.map((e,i)=>(
            <div key={i} style={mn.item}>
              <div style={mn.row}>
                <div style={mn.role}>{e.degree}</div>
                <div style={mn.date}>{e.startDate} – {e.endDate}</div>
              </div>
              <div style={mn.company}>{e.institution}{e.location?` · ${e.location}`:''}</div>
              {e.description && <div style={mn.bodyText}>{e.description}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'projects': return data.projects?.length > 0 ? (
        <div key="projects">
          <MNHeading label={tr('projects',true)} />
          {data.projects.map((p,i)=>(
            <div key={i} style={mn.item}>
              <div style={mn.role}>{p.title||p.name}</div>
              {p.link && <div style={{ fontSize:sz.meta, color:accent, textAlign:'right' }}>{p.link}</div>}
              {p.description && <div style={mn.bodyText}>{p.description}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'publications': return data.publications?.length > 0 ? (
        <div key="publications">
          <MNHeading label={tr('publications',true)} />
          {data.publications.map((p,i)=>(
            <div key={i} style={mn.item}>
              <div style={mn.row}>
                <div style={mn.role}>{p.title}</div>
                {p.date && <div style={mn.date}>{p.date}</div>}
              </div>
              {p.publisher && <div style={mn.company}>{p.publisher}</div>}
              {p.description && <div style={mn.bodyText}>{p.description}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'references': return data.references?.length > 0 ? (
        <div key="references">
          <MNHeading label={tr('references',true)} />
          {data.references.map((r,i)=>(
            <div key={i} style={mn.item}>
              <div style={mn.role}>{r.name}</div>
              {(r.title||r.company) && <div style={mn.company}>{[r.title,r.company].filter(Boolean).join(' — ')}</div>}
              {(r.email||r.phone) && <div style={mn.bodyText}>{[r.email,r.phone].filter(Boolean).join(' | ')}</div>}
            </div>
          ))}
        </div>
      ) : null;

      default:
        if (key.startsWith('csec-') && data.customSections) {
          const sec = data.customSections.find(s=>s.id===key);
          if (!sec||!sec.items?.length) return null;
          return (
            <div key={key}>
              <MNHeading label={sec.title} />
              {sec.items.map((item,idx)=>(
                <div key={idx} style={mn.item}>
                  {item.title && <div style={mn.role}>{item.title}</div>}
                  {item.subtitle && <div style={mn.company}>{item.subtitle}</div>}
                  {item.description && <div style={mn.bodyText}>{item.description}</div>}
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
  const initials = (info.fullName||'').split(' ').map(w=>w[0]).slice(0,2).join('');

  return (
    <div style={{ fontFamily:font, fontSize:sz.body, color:'#1a202c', backgroundColor:'#fff', width:'794px', minHeight:'1122px', boxSizing:'border-box', display:'flex', flexDirection:'row-reverse', direction:'rtl' }}>
      {/* ── Sidebar RIGHT ── */}
      <div style={sb.wrap}>
        <div style={sb.topBand}>
          {info.photo ? (
            <div style={sb.photoWrap}>
              <img src={info.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
          ) : (
            <div style={sb.photoWrap}><span style={sb.initials}>{initials}</span></div>
          )}
        </div>

        <div style={{ padding:'12pt 13pt 0' }}>
          <div style={{ ...sb.sectionBox, marginTop:'0' }}>
            <div style={sb.sectionLabel}>{tr('contact',true)}</div>
          </div>
          {contactItems.map((row,i)=>(
            <div key={i} style={sb.contactRow}>
              <span style={sb.icon}>{row.icon}</span>
              <span style={{ wordBreak:'break-all', lineHeight:1.3, textAlign:'right' }}>{row.text}</span>
            </div>
          ))}
        </div>

        {sideKeys.map(k=>renderSidebar(k))}
      </div>

      {/* ── Main LEFT ── */}
      <div style={mn.wrap}>
        <div style={mn.nameBar}>
          <div style={mn.name}>{info.fullName||'الاسم الكامل'}</div>
          {info.jobTitle && <div style={mn.jobTitle}>{info.jobTitle}</div>}
        </div>
        <div style={mn.content}>
          {mainKeys.map(k=>renderMain(k))}
        </div>
      </div>
    </div>
  );
};

export default ArabicSlateSidebarTemplate;
