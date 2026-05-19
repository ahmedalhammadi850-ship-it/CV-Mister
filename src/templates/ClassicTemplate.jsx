import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

const labels = {
  summary:       { en: 'Professional Summary',  ar: 'الملخص المهني'        },
  experience:    { en: 'Work Experience',       ar: 'الخبرة العملية'       },
  education:     { en: 'Education',             ar: 'التعليم'              },
  skills:        { en: 'Skills',                ar: 'المهارات'             },
  languages:     { en: 'Languages',             ar: 'اللغات'               },
  projects:      { en: 'Projects',              ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',          ar: 'الشهادات والاعتمادات'  },
  interests:     { en: 'Interests & Hobbies',   ar: 'الاهتمامات والهوايات' },
  courses:       { en: 'Courses & Training',    ar: 'الدورات والتدريب'     },
  awards:        { en: 'Awards & Honours',      ar: 'الجوائز والتكريمات'   },
  organisations: { en: 'Organisations',         ar: 'المنظمات والجمعيات'   },
  publications:  { en: 'Publications',          ar: 'المنشورات والأبحاث'   },
  references:    { en: 'References',            ar: 'المراجع والتزكيات'    },
  present:       { en: 'Present',               ar: 'حتى الآن'             },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

const ClassicTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);
    const accent = theme?.primaryColor || '#1e3a5f';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || 'center';
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';

  const show = (key) => visibleSections[key] !== false;

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      padding, lineHeight, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    header: {
      textAlign: headerAlign,
      marginBottom: '14pt',
      paddingBottom: '12pt',
      ...BREAK_ITEM,
    },
    nameLine: {
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      gap: '10pt', marginBottom: '3pt',
    },
    nameRule: {
      flex: 1, height: '2px', backgroundColor: accent,
    },
    name: {
      fontSize: sz.name, fontWeight: '800', color: accent,
      letterSpacing: '1px', lineHeight: 1.2, whiteSpace: 'nowrap',
    },
    jobTitle: {
      fontSize: '10.5pt', color: '#555', marginBottom: '6pt',
      textAlign: 'center', letterSpacing: '0.5px',
    },
    contactRow: {
      fontSize: sz.meta, color: '#555',
      display: 'flex', flexWrap: 'wrap', gap: '0',
      justifyContent: 'center', alignItems: 'center',
    },
    contactDot: {
      color: accent, fontWeight: '700',
      paddingLeft: '6pt', paddingRight: '6pt',
      lineHeight: 1,
    },
    headingBlock: {
      marginTop: sectionMt, marginBottom: '7pt',
      ...BREAK_HEADING,
    },
    headingTop: { height: '2px', backgroundColor: accent, marginBottom: '3pt' },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: accent,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      textAlign: 'center',
    },
    headingBottom: { height: '1px', backgroundColor: accent + '44', marginTop: '3pt' },
    meta:    { fontSize: sz.meta, color: '#555', fontStyle: 'italic', marginBottom: '3pt' },
    company: { fontSize: sz.meta, color: '#333', fontWeight: '600', fontStyle: 'italic', marginBottom: '3pt' },
    body:    { fontSize: sz.body, color: '#222', lineHeight, whiteSpace: 'pre-line', marginTop: '3pt' },
    row: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      flexDirection: isRTL ? 'row-reverse' : 'row', gap: '8pt',
    },
    role:    { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1, minWidth: 0 },
    date:    { fontSize: sz.meta, color: '#555', whiteSpace: 'nowrap', flexShrink: 0, fontStyle: 'italic' },
    tag: {
      display: 'inline-block', border: `1px solid ${accent}55`,
      color: accent, borderRadius: '2pt', padding: '1pt 6pt',
      fontSize: sz.meta,
      marginRight: isRTL ? '0' : '4pt', marginLeft: isRTL ? '4pt' : '0',
      marginBottom: '3pt',
    },
    item:    { marginBottom: '11pt', ...BREAK_ITEM },
    itemSm:  { marginBottom: '7pt',  ...BREAK_ITEM },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const SectionHeading = ({ label }) => (
    <div style={s.headingBlock}>
      <div style={s.headingTop} />
      <h2 style={s.heading}>{label}</h2>
      <div style={s.headingBottom} />
    </div>
  );

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return data.personalInfo?.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <SectionHeading label={tr('summary', isRTL)} />
            <div style={ta(s.body, data.personalInfo?.summaryAlign)}>{data.personalInfo.summary}</div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <SectionHeading label={tr('experience', isRTL)} />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{e.jobTitle}</h3>
                  <div style={s.date}>{e.startDate}{e.startDate ? ' – ' : ''}{e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? `، ${e.location}` : ''}</div>
                {e.description && <div style={ta(s.body, e.descriptionAlign)}>{e.description}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <SectionHeading label={tr('education', isRTL)} />
            {data.education.map((e, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{e.degree}</h3>
                  <div style={s.date}>{e.startDate}{e.startDate ? ' – ' : ''}{e.endDate}</div>
                </div>
                <div style={s.company}>{e.institution}</div>
                {e.description && <div style={ta(s.body, e.descriptionAlign)}>{e.description}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" style={BREAK_ITEM}>
            <SectionHeading label={tr('skills', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', marginTop: '2pt' }}>
              {data.skills.map((sk, i) => (
                <span key={i} style={s.tag}>{sk.name || sk}</span>
              ))}
            </div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <SectionHeading label={tr('languages', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', marginTop: '2pt' }}>
              {data.languages.map((l, i) => (
                <span key={i} style={s.tag}>{l.name}{l.level ? ` · ${l.level}` : ''}</span>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <SectionHeading label={tr('projects', isRTL)} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <h3 style={s.role}>{p.title}</h3>
                {p.link && <div style={s.meta}>{p.link}</div>}
                {p.description && <div style={ta(s.body, p.descriptionAlign)}>{p.description}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <SectionHeading label={tr('certificates', isRTL)} />
            {data.certificates.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={s.company}>{c.issuer}</div>}
                {c.description && <div style={ta(s.body, c.descriptionAlign)}>{c.description}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={BREAK_ITEM}>
            <SectionHeading label={tr('interests', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', marginTop: '2pt' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{typeof item === 'string' ? item : item.name}</span>)}
            </div>
          </section>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses">
            <SectionHeading label={tr('courses', isRTL)} />
            {data.courses.map((c, i) => (
              <div key={i} style={s.itemSm}>
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
            <SectionHeading label={tr('awards', isRTL)} />
            {data.awards.map((a, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{a.title}</h3>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={s.company}>{a.issuer}</div>}
                {a.description && <div style={ta(s.body, a.descriptionAlign)}>{a.description}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'organisations':
        return data.organisations?.length > 0 ? (
          <section key="organisations">
            <SectionHeading label={tr('organisations', isRTL)} />
            {data.organisations.map((o, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
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
            <SectionHeading label={tr('publications', isRTL)} />
            {data.publications.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{p.title}</h3>
                  {p.date && <div style={s.date}>{p.date}</div>}
                </div>
                {p.publisher && <div style={s.company}>{p.publisher}</div>}
                {p.description && <div style={ta(s.body, p.descriptionAlign)}>{p.description}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            <SectionHeading label={tr('references', isRTL)} />
            {data.references.map((r, i) => (
              <div key={i} style={s.itemSm}>
                <h3 style={s.role}>{r.name}</h3>
                {(r.title || r.company) && <div style={s.company}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
                {(r.email || r.phone) && <div style={s.meta}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
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
              <SectionHeading label={sec.title} />
              {sec.items.map((item, i) => (
                <div key={i} style={s.itemSm}>
                  {item.title && <h3 style={s.role}>{item.title}</h3>}
                  {item.subtitle && <div style={s.company}>{item.subtitle}</div>}
                  {item.description && <div style={ta(s.body, item.descriptionAlign)}>{item.description}</div>}
                </div>
              ))}
            </div>
          );
        }
        return null;
    }
  };

  const contactParts = contact ? contact.split(' | ') : [];

  return (
    <article style={s.page}>
      <div style={s.header}>
        <div style={s.nameLine}>
          <div style={s.nameRule} />
          <h1 style={s.name}>{data.personalInfo.fullName}</h1>
          <div style={s.nameRule} />
        </div>
        {data.personalInfo.jobTitle && (
          <p style={s.jobTitle}>{data.personalInfo.jobTitle}</p>
        )}
        {contactParts.length > 0 && (
          <div style={s.contactRow}>
            {contactParts.map((part, i) => (
              <span key={i}>
                {i > 0 && <span style={s.contactDot}>·</span>}
                {part.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
      {sectionOrder.map(key => renderSection(key))}
    </article>
  );
};

export default ClassicTemplate;
