import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

const labels = {
  summary:       { en: 'Summary',              ar: 'الملخص المهني'        },
  experience:    { en: 'Work Experience',      ar: 'الخبرة العملية'       },
  education:     { en: 'Education',            ar: 'التعليم'              },
  skills:        { en: 'Skills',               ar: 'المهارات'             },
  languages:     { en: 'Languages',            ar: 'اللغات'               },
  projects:      { en: 'Projects',             ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',         ar: 'الشهادات والاعتمادات'  },
  interests:     { en: 'Interests & Hobbies',  ar: 'الاهتمامات والهوايات' },
  courses:       { en: 'Courses & Training',   ar: 'الدورات والتدريب'     },
  awards:        { en: 'Awards & Honours',     ar: 'الجوائز والتكريمات'   },
  organisations: { en: 'Organisations',        ar: 'المنظمات والجمعيات'   },
  publications:  { en: 'Publications',         ar: 'المنشورات والأبحاث'   },
  references:    { en: 'References',           ar: 'المراجع والتزكيات'    },
  present:       { en: 'Present',              ar: 'حتى الآن'             },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

const MinimalTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);
    const accent = theme?.primaryColor || '#374151';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || (isRTL ? 'right' : 'left');
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';

  const show = (key) => visibleSections[key] !== false;

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      padding, lineHeight, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    name:    { fontSize: sz.name,    fontWeight: '700', color: '#111', marginBottom: '2pt', letterSpacing: '-0.01em', textAlign: headerAlign },
    jobTitle:{ fontSize: sz.body,    color: '#777', marginBottom: '8pt', textAlign: headerAlign },
    contact: { fontSize: sz.meta,    color: '#555', marginBottom: '16pt', paddingBottom: '12pt', borderBottom: `1px solid ${accent}`, textAlign: headerAlign },
    heading: { fontSize: sz.heading, fontWeight: '700', color: accent, marginTop: sectionMt, marginBottom: '2pt', textAlign: headingAlign, ...BREAK_HEADING },
    divider: { borderBottom: `1px solid ${accent}30`, marginBottom: '8pt' },
    meta:    { fontSize: sz.meta,    color: '#666', marginBottom: '4pt' },
    body:    { fontSize: sz.body,    color: '#333', lineHeight, whiteSpace: 'pre-line' },
    row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', gap: '12pt' },
    role:    { fontSize: sz.body, fontWeight: '700', marginBottom: '1pt', flex: 1, minWidth: 0 },
    date:    { fontSize: sz.meta, color: '#888', whiteSpace: 'nowrap', flexShrink: 0 },
    tag:     { display: 'inline-block', border: `1px solid ${accent}50`, color: accent, borderRadius: '3pt', padding: '1pt 5pt', fontSize: sz.meta, marginRight: '4pt', marginBottom: '3pt' },
    item:    { marginBottom: '10pt', ...BREAK_ITEM },
    itemSm:  { marginBottom: '6pt',  ...BREAK_ITEM },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return data.personalInfo?.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('summary', isRTL)}</h2>
            <div style={s.divider} />
            <div style={ta({ ...s.body, marginBottom: '4pt' }, data.personalInfo?.summaryAlign)}><span style={{fontWeight:data.personalInfo?.summaryBold?700:undefined,fontStyle:data.personalInfo?.summaryItalic?"italic":undefined}}>{data.personalInfo.summary}</span></div>
          </section>
        ) : null;
      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <h2 style={s.heading}>{tr('experience', isRTL)}</h2>
            <div style={s.divider} />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{e.jobTitle}</h3>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.meta}>{e.company}</div>
                <div style={ta(s.body, e.descriptionAlign)}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>
              </div>
            ))}
          </section>
        ) : null;
      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <h2 style={s.heading}>{tr('education', isRTL)}</h2>
            <div style={s.divider} />
            {data.education.map((e, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{e.degree}</h3>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={s.meta}>{e.institution}</div>
                {e.description && <div style={ta(s.body, e.descriptionAlign)}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('skills', isRTL)}</h2>
            <div style={s.divider} />
            <div style={s.body}>{data.skills.map(sk => sk.name || sk).join(' | ')}</div>
          </section>
        ) : null;
      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('languages', isRTL)}</h2>
            <div style={s.divider} />
            <div style={s.body}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
          </section>
        ) : null;
      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <h2 style={s.heading}>{tr('projects', isRTL)}</h2>
            <div style={s.divider} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <h3 style={s.role}>{p.title}</h3>
                {p.link && <div style={s.meta}>{p.link}</div>}
                <div style={ta(s.body, p.descriptionAlign)}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>
              </div>
            ))}
          </section>
        ) : null;
      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <h2 style={s.heading}>{tr('certificates', isRTL)}</h2>
            <div style={s.divider} />
            {data.certificates.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={s.meta}>{c.issuer}</div>}
                {c.description && <div style={ta(s.body, c.descriptionAlign)}><span style={{fontWeight:c?.descriptionBold?700:undefined,fontStyle:c?.descriptionItalic?"italic":undefined}}>{c.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('interests', isRTL)}</h2>
            <div style={s.divider} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{typeof item === 'string' ? item : item.name}</span>)}
            </div>
          </section>
        ) : null;
      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses">
            <h2 style={s.heading}>{tr('courses', isRTL)}</h2>
            <div style={s.divider} />
            {data.courses.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.institution && <div style={s.meta}>{c.institution}</div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'awards':
        return data.awards?.length > 0 ? (
          <section key="awards">
            <h2 style={s.heading}>{tr('awards', isRTL)}</h2>
            <div style={s.divider} />
            {data.awards.map((a, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{a.title}</h3>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={s.meta}>{a.issuer}</div>}
                {a.description && <div style={ta(s.body, a.descriptionAlign)}><span style={{fontWeight:a?.descriptionBold?700:undefined,fontStyle:a?.descriptionItalic?"italic":undefined}}>{a.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'organisations':
        return data.organisations?.length > 0 ? (
          <section key="organisations">
            <h2 style={s.heading}>{tr('organisations', isRTL)}</h2>
            <div style={s.divider} />
            {data.organisations.map((o, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{o.name}</h3>
                  {o.date && <div style={s.date}>{o.date}</div>}
                </div>
                {o.role && <div style={s.meta}>{o.role}</div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'publications':
        return data.publications?.length > 0 ? (
          <section key="publications">
            <h2 style={s.heading}>{tr('publications', isRTL)}</h2>
            <div style={s.divider} />
            {data.publications.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{p.title}</h3>
                  {p.date && <div style={s.date}>{p.date}</div>}
                </div>
                {p.publisher && <div style={s.meta}>{p.publisher}</div>}
                {p.description && <div style={ta(s.body, p.descriptionAlign)}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            <h2 style={s.heading}>{tr('references', isRTL)}</h2>
            <div style={s.divider} />
            {data.references.map((r, i) => (
              <div key={i} style={s.itemSm}>
                <h3 style={s.role}>{r.name}</h3>
                {(r.title || r.company) && <div style={s.meta}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
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
              <div style={s.divider} />
              {sec.items.map((item, i) => (
                <div key={i} style={s.itemSm}>
                  {item.title && <h3 style={s.role}>{item.title}</h3>}
                  {item.subtitle && <div style={s.meta}>{item.subtitle}</div>}
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
      <div style={BREAK_ITEM}>
        <h1 style={s.name}>{data.personalInfo.fullName}</h1>
        <p style={s.jobTitle}>{data.personalInfo.jobTitle}</p>
        {contact && <address style={s.contact}>{contact}</address>}
      </div>
      {sectionOrder.map(key => renderSection(key))}
    </article>
  );
};

export default MinimalTemplate;
