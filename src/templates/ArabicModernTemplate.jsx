import { resolveTheme, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

const labels = {
  summary:       { en: 'Profile',            ar: 'نبذة تعريفية'         },
  experience:    { en: 'Work Experience',     ar: 'الخبرات المهنية'      },
  education:     { en: 'Education',          ar: 'التعليم'              },
  skills:        { en: 'Skills',             ar: 'المهارات'             },
  languages:     { en: 'Languages',          ar: 'اللغات'               },
  projects:      { en: 'Projects',           ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',       ar: 'الدورات التدريبية'    },
  interests:     { en: 'Interests',          ar: 'الاهتمامات'           },
  courses:       { en: 'Courses',            ar: 'الدورات'              },
  awards:        { en: 'Awards',             ar: 'الجوائز'              },
  organisations: { en: 'Organisations',      ar: 'المنظمات'             },
  publications:  { en: 'Publications',       ar: 'المنشورات'            },
  references:    { en: 'References',         ar: 'المراجع'              },
  present:       { en: 'Present',            ar: 'حتى الآن'             },
};

const DEFAULT_ORDER = ['summary', 'experience', 'skills', 'education', 'certificates', 'courses', 'languages', 'awards', 'interests'];

const BarRating = ({ level = 3, accent }) => {
    const lvl = level > 5 ? Math.round(level / 20) : level;
  if (lvl <= 0) return null;
  const filled = Math.min(Math.max(Math.round(lvl), 1), 5);
  return (
    <div style={{ display: 'flex', gap: '3pt', alignItems: 'center', marginTop: '2pt' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ flex: 1, height: '4pt', borderRadius: '2pt', backgroundColor: i <= filled ? accent : '#e5e7eb' }} />
      ))}
    </div>
  );
};

const DotsRating = ({ level = 3, accent }) => {
  const lvl = level > 5 ? Math.round(level / 20) : level;
  if (lvl <= 0) return null;
  const filled = Math.min(Math.max(Math.round(lvl), 1), 5);
  return (
    <span style={{ display: 'inline-flex', gap: '3pt', verticalAlign: 'middle' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: i <= filled ? accent : '#e5e7eb', display: 'inline-block' }} />
      ))}
    </span>
  );
};

const ArabicModernTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const accent       = theme?.primaryColor || '#2a7d6e';
  const accentLight  = accent + '18';
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = 'rtl';
  const show = (key) => visibleSections[key] !== false;
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const contactItems = [
    vis.email     !== false && info.email     && { icon: '✉', text: info.email },
    vis.phone     !== false && info.phone     && { icon: '✆', text: info.phone },
    vis.location  !== false && info.location  && { icon: '⌖', text: info.location },
    vis.linkedin  !== false && info.linkedin  && { icon: 'in', text: info.linkedin },
    vis.portfolio !== false && info.portfolio && { icon: '⬡', text: info.portfolio },
  ].filter(Boolean);

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#fff',
      width: '794px', minHeight: '1122px', boxSizing: 'border-box', direction: dir,
    },
    header: {
      backgroundColor: accent,
      padding: '24pt 32pt',
      direction: 'rtl',
    },
    headerTop: {
      display: 'flex', alignItems: 'center', gap: '18pt',
      flexDirection: 'row-reverse', marginBottom: '14pt',
    },
    photoWrap: {
      width: '78pt', height: '78pt', borderRadius: '50%',
      overflow: 'hidden', flexShrink: 0,
      border: '2.5px solid rgba(255,255,255,0.5)',
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    nameBlock: { flex: 1, textAlign: 'right' },
    name: { fontSize: sz.name, fontWeight: '700', color: '#fff', lineHeight: 1.2, marginBottom: '3pt' },
    jobBox: {
      display: 'inline-block',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '4pt', padding: '3pt 10pt',
      fontSize: sz.meta, color: '#fff', fontWeight: '600',
    },
    contactStrip: {
      borderTop: '1px solid rgba(255,255,255,0.25)',
      paddingTop: '10pt',
      display: 'flex', flexWrap: 'wrap', gap: '12pt',
      flexDirection: 'row-reverse',
    },
    contactItem: {
      display: 'flex', alignItems: 'center', gap: '5pt',
      fontSize: sz.meta, color: 'rgba(255,255,255,0.9)',
      flexDirection: 'row-reverse',
    },
    contactIcon: { fontSize: '9pt', opacity: 0.7 },
    body: { padding: `16pt 28pt`, direction: 'rtl' },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: '#fff',
      backgroundColor: accent,
      padding: '4pt 10pt',
      marginTop: sectionMt, marginBottom: '8pt',
      borderRadius: '3pt',
      textAlign: 'right',
      ...BREAK_HEADING,
    },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8pt', flexDirection: 'row-reverse' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1, textAlign: 'right' },
    date: {
      fontSize: sz.meta, color: accent, whiteSpace: 'nowrap', flexShrink: 0,
      fontWeight: '600',
    },
    company: { fontSize: sz.meta, color: '#555', marginBottom: '3pt', textAlign: 'right' },
    bodyText: { fontSize: sz.body, color: '#444', lineHeight, whiteSpace: 'pre-line', textAlign: 'right' },
    item: { marginBottom: '12pt', ...BREAK_ITEM },
    skillItem: { marginBottom: '8pt' },
    skillRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse', marginBottom: '3pt' },
    skillName: { fontSize: sz.body, color: '#222', textAlign: 'right' },
    langRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse', marginBottom: '6pt', fontSize: sz.body },
    bullet: { fontSize: sz.body, color: '#444', marginBottom: '4pt', textAlign: 'right' },
    tag: { display: 'inline-block', background: accentLight, border: `1px solid ${accent}44`, borderRadius: '3pt', padding: '2pt 7pt', fontSize: sz.meta, color: accent, marginLeft: '4pt', marginBottom: '4pt' },
  };

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return info.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('summary', true)}</h2>
            <div style={s.bodyText}>{info.summary}</div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <h2 style={s.heading}>{tr('experience', true)}</h2>
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{e.jobTitle}</h3>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', true) : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                {e.description && <div style={s.bodyText}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <h2 style={s.heading}>{tr('education', true)}</h2>
            {data.education.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{e.degree}</h3>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={s.company}>{e.institution}{e.location ? ` · ${e.location}` : ''}</div>
                {e.description && <div style={s.bodyText}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('skills', true)}</h2>
            {data.skills.map((sk, i) => (
              <div key={i} style={s.skillItem}>
                <div style={s.skillRow}>
                  <span style={s.skillName}>{sk.name || sk}</span>
                </div>
                <BarRating level={sk.level || 3} accent={accent} />
              </div>
            ))}
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('languages', true)}</h2>
            {data.languages.map((l, i) => (
              <div key={i} style={s.langRow}>
                <DotsRating level={l.proficiency || 3} accent={accent} />
                <span>{l.name}</span>
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <h2 style={s.heading}>{tr('certificates', true)}</h2>
            {data.certificates.map((c, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={s.company}>{c.issuer}</div>}
                {c.description && <div style={s.bodyText}><span style={{fontWeight:c?.descriptionBold?700:undefined,fontStyle:c?.descriptionItalic?"italic":undefined}}>{c.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses">
            <h2 style={s.heading}>{tr('courses', true)}</h2>
            {data.courses.map((c, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.institution && <div style={s.company}>{c.institution}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <section key="awards">
            <h2 style={s.heading}>{tr('awards', true)}</h2>
            {data.awards.map((a, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{a.title || a.name}</h3>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={s.company}>{a.issuer}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('interests', true)}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{typeof item === 'string' ? item : item.name}</span>)}
            </div>
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <h2 style={s.heading}>{tr('projects', true)}</h2>
            {data.projects.map((p, i) => (
              <div key={i} style={s.item}>
                <h3 style={s.role}>{p.title || p.name}</h3>
                {p.link && <div style={{ fontSize: sz.meta, color: accent, textAlign: 'right' }}>{p.link}</div>}
                {p.description && <div style={s.bodyText}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            <h2 style={s.heading}>{tr('references', true)}</h2>
            {data.references.map((r, i) => (
              <div key={i} style={s.item}>
                <h3 style={s.role}>{r.name}</h3>
                {(r.title || r.company) && <div style={s.company}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
                {(r.email || r.phone) && <div style={s.bodyText}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
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
              <h2 style={s.heading}>{sec.title}</h2>
              {sec.items.map((item, idx) => (
                <div key={idx} style={s.item}>
                  {item.title && <h3 style={s.role}>{item.title}</h3>}
                  {item.subtitle && <div style={s.company}>{item.subtitle}</div>}
                  {item.description && <div style={s.bodyText}><span style={{fontWeight:item?.descriptionBold?700:undefined,fontStyle:item?.descriptionItalic?"italic":undefined}}>{item.description}</span></div>}
                </div>
              ))}
            </div>
          );
        }
        return null;
    }
  };

  return (
    <article style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerTop}>
          {vis.photo !== false && (
            <div style={s.photoWrap}>
              <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width: '100%', height: '100%', objectFit: info.photo ? 'cover' : 'contain' }} />
            </div>
          )}
          <div style={s.nameBlock}>
            <h1 style={s.name}>{info.fullName || 'الاسم الكامل'}</h1>
            {info.jobTitle && <div style={s.jobBox}>{info.jobTitle}</div>}
          </div>
        </div>
        {contactItems.length > 0 && (
          <div style={s.contactStrip}>
            {contactItems.map((item, i) => (
              <div key={i} style={s.contactItem}>
                <span style={s.contactIcon}>{item.icon}</span>
                <span style={{ wordBreak: 'break-all' }}>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={s.body}>
        {sectionOrder.map(k => renderSection(k))}
      </div>
    </article>
  );
};

export default ArabicModernTemplate;
