import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

const labels = {
  summary:       { en: 'Professional Summary',  ar: 'الملخص المهني'        },
  experience:    { en: 'Work Experience',        ar: 'الخبرة العملية'       },
  education:     { en: 'Education',              ar: 'التعليم'              },
  skills:        { en: 'Skills',                 ar: 'المهارات'             },
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
 * ATS Harvard — modelled after the classic Harvard resume format.
 * Highest ATS parse rate of all templates:
 *   • Centered name header with contact info below
 *   • Full-width thin rules ABOVE each section heading
 *   • Section heading: left-aligned bold text, no background, no colour fill
 *   • Job entries: bold role left | date right — company italic below
 *   • Skills as inline comma-separated plain text
 *   • Zero decorative elements — pure typography hierarchy
 */
const ATSHarvardTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);
    const accent = theme?.primaryColor || '#1a3a5c';
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
      padding,
      lineHeight,
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
      direction: dir,
      textAlign: isRTL ? 'right' : 'left',
    },
    headerCenter: {
      textAlign: headerAlign,
      marginBottom: '8pt',
      ...BREAK_ITEM,
    },
    name: {
      fontSize: sz.name,
      fontWeight: '800',
      color: '#000',
      letterSpacing: '0.02em',
      marginBottom: '3pt',
    },
    jobTitle: {
      fontSize: '10pt',
      color: '#333',
      fontWeight: '500',
      marginBottom: '3pt',
    },
    contact: {
      fontSize: sz.meta,
      color: '#333',
      marginBottom: '0',
    },
    sectionWrap: {
      marginTop: sectionMt,
      ...BREAK_HEADING,
    },
    ruleTop: {
      borderTop: `1.5px solid ${accent}`,
      marginBottom: '4pt',
    },
    heading: {
      fontSize: sz.heading,
      fontWeight: '800',
      color: '#000',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      marginBottom: '6pt',
      textAlign: headingAlign,
    },
    roleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '12pt',
      marginBottom: '0pt',
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
      color: '#333',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
    company: {
      fontSize: sz.meta,
      color: '#333',
      fontStyle: 'italic',
      marginBottom: '2pt',
    },
    body: {
      fontSize: sz.body,
      color: '#111',
      lineHeight: '1.4',
      whiteSpace: 'pre-line',
    },
    item: { marginBottom: '9pt', ...BREAK_ITEM },
    itemSm: { marginBottom: '6pt', ...BREAK_ITEM },
    skillsText: {
      fontSize: sz.body,
      color: '#111',
      lineHeight: '1.6',
    },
    tag: {
      display: 'inline-block',
      border: '1px solid #bbb',
      color: '#333',
      borderRadius: '2pt',
      padding: '1pt 4pt',
      fontSize: sz.meta,
      marginRight: '3pt',
      marginBottom: '3pt',
    },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const SectionHead = ({ label }) => (
    <div style={s.sectionWrap}>
      <div style={s.ruleTop} />
      <h2 style={s.heading}>{label}</h2>
    </div>
  );

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return data.personalInfo?.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <SectionHead label={tr('summary', isRTL)} />
            <div style={ta(s.body, data.personalInfo?.summaryAlign)}><span style={{fontWeight:data.personalInfo?.summaryBold?700:undefined,fontStyle:data.personalInfo?.summaryItalic?"italic":undefined}}>{data.personalInfo.summary}</span></div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <SectionHead label={tr('experience', isRTL)} />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{e.jobTitle}</h3>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? `, ${e.location}` : ''}</div>
                <div style={ta(s.body, e.descriptionAlign)}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <SectionHead label={tr('education', isRTL)} />
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
            <SectionHead label={tr('skills', isRTL)} />
            <div style={s.skillsText}>{data.skills.map(sk => sk.name || sk).join(', ')}</div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <SectionHead label={tr('languages', isRTL)} />
            <div style={s.skillsText}>{data.languages.map(l => `${l.name} (${l.level})`).join(', ')}</div>
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <SectionHead label={tr('projects', isRTL)} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.role}>{p.title}{p.link ? <span style={{ ...s.company, marginLeft: '6pt' }}> · {p.link}</span> : ''}</div>
                <div style={ta(s.body, p.descriptionAlign)}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <SectionHead label={tr('certificates', isRTL)} />
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
            <SectionHead label={tr('interests', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3pt' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{typeof item === 'string' ? item : item.name}</span>)}
            </div>
          </section>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses">
            <SectionHead label={tr('courses', isRTL)} />
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
            <SectionHead label={tr('awards', isRTL)} />
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
            <SectionHead label={tr('organisations', isRTL)} />
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
            <SectionHead label={tr('publications', isRTL)} />
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
            <SectionHead label={tr('references', isRTL)} />
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
              <SectionHead label={sec.title} />
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
      <div style={s.headerCenter}>
        <h1 style={s.name}>{data.personalInfo.fullName}</h1>
        {data.personalInfo.jobTitle && <p style={s.jobTitle}>{data.personalInfo.jobTitle}</p>}
        {contact && <address style={s.contact}>{contact}</address>}
      </div>
      {sectionOrder.map(key => renderSection(key))}
    </article>
  );
};

export default ATSHarvardTemplate;
