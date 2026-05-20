import { resolveTheme, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

const labels = {
  summary:       { en: 'Profile',            ar: 'نبذة تعريفية'         },
  experience:    { en: 'Work Experience',     ar: 'الخبرة العملية'       },
  education:     { en: 'Education',          ar: 'التعليم'              },
  skills:        { en: 'Skills',             ar: 'المهارات'             },
  languages:     { en: 'Languages',          ar: 'اللغات'               },
  projects:      { en: 'Projects',           ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',       ar: 'الشهادات'             },
  interests:     { en: 'Interests',          ar: 'الاهتمامات'           },
  courses:       { en: 'Courses & Training', ar: 'الدورات والتدريب'     },
  awards:        { en: 'Awards',             ar: 'الجوائز'              },
  organisations: { en: 'Organisations',      ar: 'المنظمات'             },
  publications:  { en: 'Publications',       ar: 'المنشورات'            },
  references:    { en: 'References',         ar: 'المراجع'              },
  present:       { en: 'Present',            ar: 'حتى الآن'             },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'languages', 'projects', 'certificates', 'awards'];

const DotsRating = ({ level = 3, accent }) => {
    const filled = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <span style={{ display: 'inline-flex', gap: '3pt', verticalAlign: 'middle' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: i <= filled ? accent : '#e0e0e0', display: 'inline-block' }} />
      ))}
    </span>
  );
};

const TealProTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const accent       = theme?.primaryColor || '#2a9d8f';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || (isRTL ? 'center' : 'center');
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const contactParts = [
    vis.email     !== false && info.email     && info.email,
    vis.phone     !== false && info.phone     && info.phone,
    vis.location  !== false && info.location  && info.location,
    vis.linkedin  !== false && info.linkedin  && info.linkedin,
    vis.portfolio !== false && info.portfolio && info.portfolio,
  ].filter(Boolean);

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#222', backgroundColor: '#fff',
      padding, lineHeight, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    nameWrap: { textAlign: headerAlign, marginBottom: '4pt' },
    name: {
      fontSize: sz.name,
      fontWeight: '700',
      color: accent,
      fontStyle: 'italic',
      letterSpacing: '-0.5px',
    },
    jobTitle: { fontSize: sz.body, color: '#555', fontWeight: '400', marginTop: '2pt', display: 'block' },
    contactStrip: {
      display: 'flex', flexWrap: 'wrap', gap: '0',
      justifyContent: 'center',
      fontSize: sz.meta, color: '#555',
      borderTop: `1px solid ${accent}`,
      borderBottom: `1px solid ${accent}`,
      padding: '5pt 0', marginBottom: '14pt',
      marginTop: '8pt',
    },
    contactPart: { padding: '0 10pt', borderRight: `1px solid #ccc` },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: accent,
      marginTop: sectionMt, marginBottom: '6pt',
      borderBottom: `1.5px solid ${accent}`,
      paddingBottom: '3pt',
      textAlign: headingAlign === 'center' ? 'left' : headingAlign,
      ...BREAK_HEADING,
    },
    meta:   { fontSize: sz.meta, color: '#666', marginBottom: '3pt' },
    body:   { fontSize: sz.body, color: '#333', lineHeight, whiteSpace: 'pre-line' },
    row:    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10pt', flexDirection: isRTL ? 'row-reverse' : 'row' },
    role:   { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1 },
    date:   { fontSize: sz.meta, color: '#888', whiteSpace: 'nowrap', flexShrink: 0 },
    company:{ fontSize: sz.meta, color: accent, fontStyle: 'italic', marginBottom: '3pt' },
    item:   { marginBottom: '12pt', ...BREAK_ITEM },
    tag:    { display: 'inline-block', border: `1px solid ${accent}`, borderRadius: '12pt', padding: '2pt 9pt', fontSize: sz.meta, color: accent, marginRight: '5pt', marginBottom: '4pt' },
    skillRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6pt', fontSize: sz.body, flexDirection: isRTL ? 'row-reverse' : 'row' },
  };

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return info.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('summary', isRTL)}</h2>
            <div style={s.body}>{info.summary}</div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <h2 style={s.heading}>{tr('experience', isRTL)}</h2>
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <div>
                    <h3 style={s.role}>{e.jobTitle}</h3>
                    <div style={s.company}>{e.company}{e.location ? `, ${e.location}` : ''}</div>
                  </div>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                {e.description && <div style={ta(s.body, e.descriptionAlign)}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <h2 style={s.heading}>{tr('education', isRTL)}</h2>
            {data.education.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <div>
                    <h3 style={s.role}>{e.degree}</h3>
                    <div style={s.company}>{e.institution}{e.location ? `, ${e.location}` : ''}</div>
                  </div>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
                {e.description && <div style={ta(s.body, e.descriptionAlign)}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('skills', isRTL)}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt' }}>
              {data.skills.map((sk, i) => <span key={i} style={s.tag}>{sk.name || sk}</span>)}
            </div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('languages', isRTL)}</h2>
            {data.languages.map((l, i) => (
              <div key={i} style={s.skillRow}>
                <span>{l.name}</span>
                <DotsRating level={l.proficiency || 3} accent={accent} />
              </div>
            ))}
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <h2 style={s.heading}>{tr('projects', isRTL)}</h2>
            {data.projects.map((p, i) => (
              <div key={i} style={s.item}>
                <h3 style={s.role}>{p.title || p.name}</h3>
                {p.link && <div style={{ ...s.meta, color: accent }}>{p.link}</div>}
                {p.description && <div style={ta(s.body, p.descriptionAlign)}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <h2 style={s.heading}>{tr('certificates', isRTL)}</h2>
            {data.certificates.map((c, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={s.company}>{c.issuer}</div>}
                {c.description && <div style={ta(s.body, c.descriptionAlign)}><span style={{fontWeight:c?.descriptionBold?700:undefined,fontStyle:c?.descriptionItalic?"italic":undefined}}>{c.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <section key="awards">
            <h2 style={s.heading}>{tr('awards', isRTL)}</h2>
            {data.awards.map((a, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{a.title || a.name}</h3>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={s.company}>{a.issuer}</div>}
                {a.description && <div style={ta(s.body, a.descriptionAlign)}><span style={{fontWeight:a?.descriptionBold?700:undefined,fontStyle:a?.descriptionItalic?"italic":undefined}}>{a.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('interests', isRTL)}</h2>
            <div style={s.body}>{data.interests.map(i => typeof i === 'string' ? i : i.name).join('  •  ')}</div>
          </section>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses">
            <h2 style={s.heading}>{tr('courses', isRTL)}</h2>
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

      case 'organisations':
        return data.organisations?.length > 0 ? (
          <section key="organisations">
            <h2 style={s.heading}>{tr('organisations', isRTL)}</h2>
            {data.organisations.map((o, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{o.name}</h3>
                  {o.date && <div style={s.date}>{o.date}</div>}
                </div>
                {o.role && <div style={s.company}>{o.role}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            <h2 style={s.heading}>{tr('references', isRTL)}</h2>
            {data.references.map((r, i) => (
              <div key={i} style={s.item}>
                <h3 style={s.role}>{r.name}</h3>
                {(r.title || r.company) && <div style={s.company}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
                {(r.email || r.phone) && <div style={s.body}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
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
                  {item.description && <div style={ta(s.body, item.descriptionAlign)}><span style={{fontWeight:item?.descriptionBold?700:undefined,fontStyle:item?.descriptionItalic?"italic":undefined}}>{item.description}</span></div>}
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
      <div style={{ textAlign: 'center', marginBottom: '4pt' }}>
        {vis.photo !== false && (
          <div style={{ width: '70pt', height: '70pt', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 10pt', border: `2px solid ${accent}`, backgroundColor: `${accent}33` }}>
            <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width: '100%', height: '100%', objectFit: info.photo ? 'cover' : 'contain' }} />
          </div>
        )}
        <h1 style={s.name}>{info.fullName || 'Your Name'}</h1>
        <span style={s.jobTitle}>{info.jobTitle || ''}</span>
      </div>

      {/* Contact strip */}
      {contactParts.length > 0 && (
        <div style={s.contactStrip}>
          {contactParts.map((p, i) => (
            <span key={i} style={{ ...s.contactPart, borderRight: i < contactParts.length - 1 ? `1px solid #ccc` : 'none' }}>{p}</span>
          ))}
        </div>
      )}

      {sectionOrder.map(k => renderSection(k))}
    </article>
  );
};

export default TealProTemplate;
