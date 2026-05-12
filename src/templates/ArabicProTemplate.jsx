import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

const labels = {
  summary:       { en: 'Professional Summary', ar: 'الملخص المهني'          },
  experience:    { en: 'Work Experience',      ar: 'خبرات العمل'             },
  education:     { en: 'Education',            ar: 'المؤهلات التعليمية'      },
  skills:        { en: 'Skills',               ar: 'المهارات المهنية'         },
  languages:     { en: 'Languages',            ar: 'اللغات'                  },
  projects:      { en: 'Projects',             ar: 'المشاريع'                },
  certificates:  { en: 'Certificates',         ar: 'الدورات التدريبية'       },
  interests:     { en: 'Interests',            ar: 'الاهتمامات والهوايات'    },
  courses:       { en: 'Courses',              ar: 'الدورات التدريبية'       },
  awards:        { en: 'Awards',               ar: 'الجوائز'                 },
  organisations: { en: 'Organisations',        ar: 'المنظمات'                },
  publications:  { en: 'Publications',         ar: 'المنشورات'               },
  references:    { en: 'References',           ar: 'المراجع'                 },
  present:       { en: 'Present',              ar: 'حتى الآن'                },
};
const tr = (key, isRTL) => labels[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const DEFAULT_ORDER = [
  'summary','experience','education','interests','projects','publications','references',
  'certificates','courses','skills','languages','awards','organisations',
];

const SIDEBAR_SECTIONS = new Set(['certificates','courses','skills','languages','awards','organisations','interests']);
const MAIN_SECTIONS    = new Set(['summary','experience','education','projects','publications','references']);
// interests can go in either — we allow it in main if not in sidebar order

/* ── Skill bar with percentage label ── */
const SkillBar = ({ level = 3, accent, bg }) => {
  const pct = Math.round((Math.min(Math.max(level, 1), 5) / 5) * 100);
  return (
    <div style={{ position:'relative', height:'8pt', borderRadius:'4pt', backgroundColor: bg, overflow:'hidden', marginTop:'2pt' }}>
      <div style={{ position:'absolute', top:0, right:0, height:'100%', width:`${pct}%`, backgroundColor: accent, borderRadius:'4pt' }} />
      <span style={{
        position:'absolute', top:'50%', left:'4pt', transform:'translateY(-50%)',
        fontSize:'6.5pt', fontWeight:'700', color:'#fff', lineHeight:1,
      }}>{pct}%</span>
    </div>
  );
};

/* ── Language bar (no percentage, just fill) ── */
const LangBar = ({ level = 3, accent, bg }) => {
  const pct = Math.round((Math.min(Math.max(level, 1), 5) / 5) * 100);
  return (
    <div style={{ position:'relative', height:'7pt', borderRadius:'4pt', backgroundColor: bg, overflow:'hidden', marginTop:'2pt' }}>
      <div style={{ position:'absolute', top:0, right:0, height:'100%', width:`${pct}%`, backgroundColor: accent, borderRadius:'4pt' }} />
    </div>
  );
};

const ArabicProTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent      = theme?.primaryColor || '#2a7f8a';
  const accentDark  = accent;
  const lightGray   = '#f4f6f8';
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

  const initials = (info.fullName || '').split(' ').map(w => w[0]).slice(0, 2).join('');

  /* ─────────────── SIDEBAR styles ─────────────── */
  const sb = {
    wrap:{
      width:'215px', minWidth:'215px',
      backgroundColor: accentDark,
      padding:'14pt 13pt 22pt',
      boxSizing:'border-box',
      direction:'rtl',
    },
    sectionBadge:{
      display:'flex', alignItems:'center', justifyContent:'center',
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderRadius:'4pt',
      padding:'4pt 10pt',
      marginBottom:'10pt', marginTop: sectionMt,
      ...BREAK_HEADING,
    },
    sectionLabel:{ fontSize:'9.5pt', fontWeight:'700', color:'#fff', textAlign:'center', letterSpacing:'0.04em' },
    skillName:{ fontSize:sz.meta, color:'#fff', textAlign:'right', marginBottom:'2pt' },
    skillItem:{ marginBottom:'9pt' },
    bullet:{ fontSize:sz.meta, color:'rgba(255,255,255,0.88)', marginBottom:'5pt', textAlign:'right', paddingRight:'6pt', position:'relative' },
    bulletDot:{ content:'""', position:'absolute', right:0, top:'5pt', width:'4pt', height:'4pt', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.5)' },
    tag:{ display:'inline-block', background:'rgba(255,255,255,0.15)', borderRadius:'3pt', padding:'2pt 7pt', fontSize:sz.meta, color:'#fff', marginLeft:'4pt', marginBottom:'4pt' },
  };

  /* ─────────────── MAIN styles ─────────────── */
  const mn = {
    wrap:{ flex:1, padding:'0', boxSizing:'border-box', direction:'rtl', display:'flex', flexDirection:'column' },
    content:{ padding:'14pt 18pt 16pt', flex:1 },
    sectionBadge:{
      display:'inline-flex', alignItems:'center',
      backgroundColor: accentDark,
      borderRadius:'4pt',
      padding:'3pt 14pt',
      marginBottom:'9pt', marginTop: sectionMt,
      ...BREAK_HEADING,
    },
    sectionLabel:{ fontSize:'9.5pt', fontWeight:'700', color:'#fff', letterSpacing:'0.04em' },
    row:{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8pt', flexDirection:'row-reverse' },
    role:{ fontSize:sz.body, fontWeight:'700', color:'#1a202c', flex:1, textAlign:'right' },
    date:{ fontSize:sz.meta, color:'#888', whiteSpace:'nowrap', flexShrink:0 },
    company:{ fontSize:sz.meta, color: accentDark, fontWeight:'700', marginBottom:'3pt', textAlign:'right' },
    bodyText:{ fontSize:sz.body, color:'#555', lineHeight, whiteSpace:'pre-line', textAlign:'right' },
    bullet:{ fontSize:sz.body, color:'#444', marginBottom:'3pt', textAlign:'right', paddingRight:'10pt', position:'relative' },
    item:{ marginBottom:'12pt', ...BREAK_ITEM },
  };

  /* ─────────────── Sidebar sections ─────────────── */
  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch(key) {
      case 'skills': return data.skills?.length > 0 ? (
        <div key="skills" style={BREAK_ITEM}>
          <div style={sb.sectionBadge}><span style={sb.sectionLabel}>{tr('skills', true)}</span></div>
          {data.skills.map((sk, i) => (
            <div key={i} style={sb.skillItem}>
              <div style={sb.skillName}>{sk.name || sk}</div>
              <SkillBar level={sk.level || 3} accent="rgba(255,255,255,0.85)" bg="rgba(255,255,255,0.15)" />
            </div>
          ))}
        </div>
      ) : null;

      case 'languages': return data.languages?.length > 0 ? (
        <div key="languages" style={BREAK_ITEM}>
          <div style={sb.sectionBadge}><span style={sb.sectionLabel}>{tr('languages', true)}</span></div>
          {data.languages.map((l, i) => (
            <div key={i} style={sb.skillItem}>
              <div style={sb.skillName}>{l.name}</div>
              <LangBar level={l.proficiency || 3} accent="rgba(255,255,255,0.85)" bg="rgba(255,255,255,0.15)" />
            </div>
          ))}
        </div>
      ) : null;

      case 'certificates':
      case 'courses': {
        const items = data[key];
        if (!items?.length) return null;
        return (
          <div key={key} style={BREAK_ITEM}>
            <div style={sb.sectionBadge}><span style={sb.sectionLabel}>{tr(key, true)}</span></div>
            {items.map((c, i) => (
              <div key={i} style={{ marginBottom:'7pt', position:'relative' }}>
                <div style={{ width:'5pt', height:'5pt', borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.55)', display:'inline-block', marginLeft:'6pt', verticalAlign:'middle' }} />
                <span style={{ fontSize:sz.meta, color:'rgba(255,255,255,0.9)' }}>{c.name || c.title || c}</span>
                {c.date && <div style={{ fontSize:'7.5pt', color:'rgba(255,255,255,0.55)', textAlign:'right', marginTop:'1pt' }}>{c.date}</div>}
                {(c.institution || c.issuer) && <div style={{ fontSize:'7.5pt', color:'rgba(255,255,255,0.55)', textAlign:'right' }}>{c.institution || c.issuer}</div>}
              </div>
            ))}
          </div>
        );
      }

      case 'awards': return data.awards?.length > 0 ? (
        <div key="awards" style={BREAK_ITEM}>
          <div style={sb.sectionBadge}><span style={sb.sectionLabel}>{tr('awards', true)}</span></div>
          {data.awards.map((a, i) => (
            <div key={i} style={{ marginBottom:'6pt' }}>
              <div style={sb.bullet}>• {a.title || a.name || a}</div>
              {a.issuer && <div style={{ fontSize:'8pt', color:'rgba(255,255,255,0.55)', textAlign:'right' }}>{a.issuer}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'interests': return data.interests?.length > 0 ? (
        <div key="interests" style={BREAK_ITEM}>
          <div style={sb.sectionBadge}><span style={sb.sectionLabel}>{tr('interests', true)}</span></div>
          <div style={{ display:'flex', flexWrap:'wrap', flexDirection:'row-reverse', gap:'3pt' }}>
            {data.interests.map((item, i) => (
              <span key={i} style={sb.tag}>{item.name || item}</span>
            ))}
          </div>
        </div>
      ) : null;

      case 'organisations': return data.organisations?.length > 0 ? (
        <div key="organisations" style={BREAK_ITEM}>
          <div style={sb.sectionBadge}><span style={sb.sectionLabel}>{tr('organisations', true)}</span></div>
          {data.organisations.map((o, i) => (
            <div key={i} style={sb.bullet}>• {o.name || o}</div>
          ))}
        </div>
      ) : null;

      default: return null;
    }
  };

  /* ─────────────── Main sections ─────────────── */
  const MNSection = ({ label }) => (
    <div style={mn.sectionBadge}><span style={mn.sectionLabel}>{label}</span></div>
  );

  const renderMain = (key) => {
    if (!show(key)) return null;
    switch(key) {
      case 'summary': return info.summary ? (
        <div key="summary" style={BREAK_ITEM}>
          <MNSection label={tr('summary', true)} />
          <div style={mn.bodyText}>{info.summary}</div>
        </div>
      ) : null;

      case 'experience': return data.experience?.length > 0 ? (
        <div key="experience">
          <MNSection label={tr('experience', true)} />
          {data.experience.map((e, i) => (
            <div key={i} style={mn.item}>
              <div style={mn.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
              <div style={mn.row}>
                <div style={mn.role}>{e.jobTitle}</div>
                <div style={mn.date}>{e.startDate} – {e.current ? tr('present', true) : e.endDate}</div>
              </div>
              {e.description && <div style={mn.bodyText}>{e.description}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'education': return data.education?.length > 0 ? (
        <div key="education">
          <MNSection label={tr('education', true)} />
          {data.education.map((e, i) => (
            <div key={i} style={mn.item}>
              <div style={{ ...mn.role, color: accentDark, marginBottom:'1pt' }}>{e.degree}</div>
              <div style={mn.row}>
                <div style={{ fontSize:sz.meta, color:'#666', textAlign:'right' }}>{e.institution}{e.location ? ` · ${e.location}` : ''}</div>
                <div style={mn.date}>{e.startDate} – {e.endDate}</div>
              </div>
              {e.description && <div style={mn.bodyText}>{e.description}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'interests': return data.interests?.length > 0 && !SIDEBAR_SECTIONS.has('interests') ? (
        <div key="interests" style={BREAK_ITEM}>
          <MNSection label={tr('interests', true)} />
          <div style={{ display:'flex', flexWrap:'wrap', flexDirection:'row-reverse', gap:'4pt' }}>
            {data.interests.map((item, i) => (
              <span key={i} style={{ background: accentDark + '18', border:`1px solid ${accentDark}44`, borderRadius:'4pt', padding:'2pt 8pt', fontSize:sz.meta, color: accentDark }}>{item.name || item}</span>
            ))}
          </div>
        </div>
      ) : null;

      case 'projects': return data.projects?.length > 0 ? (
        <div key="projects">
          <MNSection label={tr('projects', true)} />
          {data.projects.map((p, i) => (
            <div key={i} style={mn.item}>
              <div style={mn.role}>{p.title || p.name}</div>
              {p.link && <div style={{ fontSize:sz.meta, color: accentDark, textAlign:'right' }}>{p.link}</div>}
              {p.description && <div style={mn.bodyText}>{p.description}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'publications': return data.publications?.length > 0 ? (
        <div key="publications">
          <MNSection label={tr('publications', true)} />
          {data.publications.map((p, i) => (
            <div key={i} style={mn.item}>
              <div style={mn.row}>
                <div style={mn.role}>{p.title}</div>
                {p.date && <div style={mn.date}>{p.date}</div>}
              </div>
              {p.publisher && <div style={{ fontSize:sz.meta, color: accentDark, textAlign:'right' }}>{p.publisher}</div>}
              {p.description && <div style={mn.bodyText}>{p.description}</div>}
            </div>
          ))}
        </div>
      ) : null;

      case 'references': return data.references?.length > 0 ? (
        <div key="references">
          <MNSection label={tr('references', true)} />
          {data.references.map((r, i) => (
            <div key={i} style={mn.item}>
              <div style={mn.role}>{r.name}</div>
              {(r.title || r.company) && <div style={{ fontSize:sz.meta, color: accentDark, textAlign:'right' }}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
              {(r.email || r.phone) && <div style={mn.bodyText}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
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
              <MNSection label={sec.title} />
              {sec.items.map((item, idx) => (
                <div key={idx} style={mn.item}>
                  {item.title && <div style={mn.role}>{item.title}</div>}
                  {item.subtitle && <div style={{ fontSize:sz.meta, color: accentDark, textAlign:'right' }}>{item.subtitle}</div>}
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
  const mainKeys = sectionOrder.filter(k => MAIN_SECTIONS.has(k) || (k === 'interests' && !SIDEBAR_SECTIONS.has(k)));

  /* ─────────────── RENDER ─────────────── */
  return (
    <div style={{ fontFamily:font, fontSize:sz.body, color:'#1a202c', backgroundColor: lightGray, width:'794px', minHeight:'1122px', boxSizing:'border-box', direction:'rtl' }}>

      {/* ══ HEADER ══ */}
      <div style={{
        backgroundColor: accentDark,
        padding:'0',
        position:'relative',
        minHeight:'90pt',
        display:'flex',
        flexDirection:'row-reverse',
        alignItems:'stretch',
        direction:'rtl',
      }}>
        {/* Photo — far right, overlapping bottom */}
        <div style={{
          width:'90pt', flexShrink:0,
          display:'flex', alignItems:'flex-end', justifyContent:'center',
          paddingBottom:'0', paddingTop:'10pt', paddingRight:'12pt',
          position:'relative',
        }}>
          {info.photo ? (
            <div style={{ width:'80pt', height:'80pt', borderRadius:'50%', overflow:'hidden', border:'3px solid rgba(255,255,255,0.5)', backgroundColor:'rgba(255,255,255,0.15)', marginBottom:'-20pt', zIndex:2, position:'relative' }}>
              <img src={info.photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
          ) : (
            <div style={{ width:'80pt', height:'80pt', borderRadius:'50%', overflow:'hidden', border:'3px solid rgba(255,255,255,0.5)', backgroundColor:'rgba(255,255,255,0.15)', marginBottom:'-20pt', zIndex:2, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontSize:'22pt', fontWeight:'700', color:'#fff' }}>{initials}</span>
            </div>
          )}
        </div>

        {/* Name + job title */}
        <div style={{ flex:1, padding:'14pt 14pt 10pt', textAlign:'right' }}>
          <div style={{ fontSize: sz.name, fontWeight:'800', color:'#fff', lineHeight:1.15, marginBottom:'3pt' }}>
            {info.fullName || 'الاسم الكامل'}
          </div>
          {info.jobTitle && (
            <div style={{ fontSize:sz.body, color:'rgba(255,255,255,0.75)', fontStyle:'italic', marginBottom:'8pt' }}>
              {info.jobTitle}
            </div>
          )}
          {/* Contact items */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:'8pt', flexDirection:'row-reverse' }}>
            {contactItems.map((row, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'4pt', flexDirection:'row-reverse', fontSize:sz.meta, color:'rgba(255,255,255,0.88)' }}>
                <span style={{ fontSize:'9pt', opacity:0.7 }}>{row.icon}</span>
                <span style={{ wordBreak:'break-all' }}>{row.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ BODY (two columns) ══ */}
      <div style={{ display:'flex', flexDirection:'row-reverse', direction:'rtl', paddingTop:'22pt' }}>

        {/* RIGHT SIDEBAR */}
        <div style={sb.wrap}>
          {sideKeys.map(k => renderSidebar(k))}
        </div>

        {/* LEFT MAIN */}
        <div style={{ ...mn.wrap, backgroundColor:'#fff' }}>
          <div style={mn.content}>
            {mainKeys.map(k => renderMain(k))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArabicProTemplate;
