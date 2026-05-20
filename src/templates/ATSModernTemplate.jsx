import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

const labels = {
  summary:       { en: 'Professional Summary',  ar: 'الملخص المهني'        },
  experience:    { en: 'Work Experience',        ar: 'الخبرة العملية'       },
  education:     { en: 'Education',              ar: 'التعليم'              },
  skills:        { en: 'Core Competencies',      ar: 'الكفاءات الأساسية'   },
  languages:     { en: 'Languages',              ar: 'اللغات'               },
  projects:      { en: 'Projects',               ar: 'المشاريع'             },
  certificates:  { en: 'Certifications',         ar: 'الشهادات والاعتمادات'  },
  interests:     { en: 'Interests',              ar: 'الاهتمامات'           },
  courses:       { en: 'Courses & Training',     ar: 'الدورات والتدريب'     },
  awards:        { en: 'Awards & Honours',       ar: 'الجوائز والتكريمات'   },
  organisations: { en: 'Organisations',          ar: 'المنظمات والجمعيات'   },
  publications:  { en: 'Publications',           ar: 'المنشورات والأبحاث'   },
  references:    { en: 'References',             ar: 'المراجع والتزكيات'    },
  present:       { en: 'Present',                ar: 'حتى الآن'             },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

/**
 * ATS Modern — clean contemporary look, fully ATS-safe single column.
 * Distinguishing features:
 *   • Solid top accent stripe as header background
 *   • Name in large white text on the accent stripe
 *   • Section headings: bold colored text, no background, thin bottom underline
 *   • Skills displayed as a 3-column text grid (readable as plain text by ATS)
 *   • Generous but structured whitespace
 */
const ATSModernTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);
    const accent = theme?.primaryColor || '#0d4f6e';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || (isRTL ? 'right' : 'left');
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;

  const s = {
    page: {
      fontFamily: font,
      fontSize: sz.body,
      color: '#111',
      backgroundColor: '#ffffff',
      lineHeight,
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
      direction: dir,
      textAlign: isRTL ? 'right' : 'left',
    },
    stripe: { textAlign: headerAlign,
      backgroundColor: accent,
      padding: `22pt ${padding.split(' ')[1] || '32pt'} 18pt`,
      ...BREAK_ITEM,
    },
    name: {
      fontSize: sz.name,
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: '2pt',
      letterSpacing: '-0.01em',
    },
    jobTitle: {
      fontSize: '10.5pt',
      color: 'rgba(255,255,255,0.85)',
      fontWeight: '500',
      marginBottom: '6pt',
    },
    contact: {
      fontSize: sz.meta,
      color: 'rgba(255,255,255,0.9)',
    },
    body_wrap: {
      padding: `14pt ${padding.split(' ')[1] || '32pt'}`,
    },
    heading: {
      fontSize: sz.heading,
      fontWeight: '800',
      color: accent,
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
      marginTop: sectionMt,
      marginBottom: '2pt',
      paddingBottom: '3pt',
      borderBottom: `2px solid ${accent}`,
      textAlign: headingAlign,
      ...BREAK_HEADING,
    },
    spacer: { marginBottom: '7pt' },
    roleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '12pt',
      marginBottom: '1pt',
    },
    role: {
      fontSize: sz.body,
      fontWeight: '700',
      color: '#000',
      flex: 1,
      minWidth: 0,
    },
    date: {
      fontSize: sz.meta,
      color: '#555',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      fontWeight: '600',
    },
    company: {
      fontSize: sz.meta,
      color: accent,
      marginBottom: '3pt',
      fontWeight: '500',
    },
    body: {
      fontSize: sz.body,
      color: '#222',
      lineHeight,
      whiteSpace: 'pre-line',
    },
    item: { marginBottom: '10pt', ...BREAK_ITEM },
    itemSm: { marginBottom: '7pt', ...BREAK_ITEM },
    skillsGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4pt 0',
    },
    skillCol: {
      width: '33.33%',
      fontSize: sz.body,
      color: '#222',
      display: 'flex',
      alignItems: 'center',
      gap: '5pt',
      paddingRight: '8pt',
      marginBottom: '3pt',
    },
    skillDot: {
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      backgroundColor: accent,
      flexShrink: 0,
      display: 'inline-block',
    },
    tag: {
      display: 'inline-block',
      border: `1px solid ${accent}`,
      color: '#333',
      borderRadius: '3pt',
      padding: '1pt 5pt',
      fontSize: sz.meta,
      marginRight: '4pt',
      marginBottom: '3pt',
    },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return data.personalInfo?.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('summary', isRTL)}</h2>
            <div style={{ ...s.spacer }} />
            <div style={ta(s.body, data.personalInfo?.summaryAlign)}><span style={{fontWeight:data.personalInfo?.summaryBold?700:undefined,fontStyle:data.personalInfo?.summaryItalic?"italic":undefined}}>{data.personalInfo.summary}</span></div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <h2 style={s.heading}>{tr('experience', isRTL)}</h2>
            <div style={s.spacer} />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{e.jobTitle}</h3>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                <div style={ta(s.body, e.descriptionAlign)}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <h2 style={s.heading}>{tr('education', isRTL)}</h2>
            <div style={s.spacer} />
            {data.education.map((e, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{e.degree}</h3>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={s.company}>{e.institution}</div>
                {e.description && <div style={ta(s.body, e.descriptionAlign)}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('skills', isRTL)}</h2>
            <div style={s.spacer} />
            <div style={s.skillsGrid}>
              {data.skills.map((skill, i) => (
                <div key={i} style={s.skillCol}>
                  <span style={s.skillDot} />
                  <span>{skill.name || skill}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('languages', isRTL)}</h2>
            <div style={s.spacer} />
            <div style={s.skillsGrid}>
              {data.languages.map((l, i) => (
                <div key={i} style={s.skillCol}>
                  <span style={s.skillDot} />
                  <span>{l.name} ({l.level})</span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <h2 style={s.heading}>{tr('projects', isRTL)}</h2>
            <div style={s.spacer} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <h3 style={s.role}>{p.title}</h3>
                {p.link && <div style={s.company}>{p.link}</div>}
                <div style={ta(s.body, p.descriptionAlign)}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <h2 style={s.heading}>{tr('certificates', isRTL)}</h2>
            <div style={s.spacer} />
            {data.certificates.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={s.company}>{c.issuer}</div>}
                {c.description && <div style={ta(s.body, c.descriptionAlign)}><span style={{fontWeight:c?.descriptionBold?700:undefined,fontStyle:c?.descriptionItalic?"italic":undefined}}>{c.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('interests', isRTL)}</h2>
            <div style={s.spacer} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{typeof item === 'string' ? item : item.name}</span>)}
            </div>
          </section>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses">
            <h2 style={s.heading}>{tr('courses', isRTL)}</h2>
            <div style={s.spacer} />
            {data.courses.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
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
            <h2 style={s.heading}>{tr('awards', isRTL)}</h2>
            <div style={s.spacer} />
            {data.awards.map((a, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{a.title}</h3>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={s.company}>{a.issuer}</div>}
                {a.description && <div style={ta(s.body, a.descriptionAlign)}><span style={{fontWeight:a?.descriptionBold?700:undefined,fontStyle:a?.descriptionItalic?"italic":undefined}}>{a.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'organisations':
        return data.organisations?.length > 0 ? (
          <section key="organisations">
            <h2 style={s.heading}>{tr('organisations', isRTL)}</h2>
            <div style={s.spacer} />
            {data.organisations.map((o, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{o.name}</h3>
                  {o.date && <div style={s.date}>{o.date}</div>}
                </div>
                {o.role && <div style={s.company}>{o.role}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'publications':
        return data.publications?.length > 0 ? (
          <section key="publications">
            <h2 style={s.heading}>{tr('publications', isRTL)}</h2>
            <div style={s.spacer} />
            {data.publications.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{p.title}</h3>
                  {p.date && <div style={s.date}>{p.date}</div>}
                </div>
                {p.publisher && <div style={s.company}>{p.publisher}</div>}
                {p.description && <div style={ta(s.body, p.descriptionAlign)}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            <h2 style={s.heading}>{tr('references', isRTL)}</h2>
            <div style={s.spacer} />
            {data.references.map((r, i) => (
              <div key={i} style={s.itemSm}>
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
              <div style={s.spacer} />
              {sec.items.map((item, i) => (
                <div key={i} style={s.itemSm}>
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
      <div style={s.stripe}>
        <h1 style={s.name}>{data.personalInfo.fullName}</h1>
        <p style={s.jobTitle}>{data.personalInfo.jobTitle}</p>
        {contact && <address style={s.contact}>{contact}</address>}
      </div>
      <div style={s.body_wrap}>
        {sectionOrder.map(key => renderSection(key))}
      </div>
    </article>
  );
};

export default ATSModernTemplate;
