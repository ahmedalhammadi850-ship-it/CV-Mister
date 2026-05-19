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

const VelvetTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);
    const accent = theme?.primaryColor || '#0f2942';
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';

  const show = (key) => visibleSections[key] !== false;

  const accentLight = accent + '18';
  const accentMid   = accent + '33';

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      width: '794px', minHeight: '1122px', boxSizing: 'border-box', direction: dir,
    },
    header: {
      backgroundColor: accent,
      padding: '28pt 40pt 20pt',
      textAlign: 'center',
      ...BREAK_ITEM,
    },
    name: {
      fontSize: sz.name, fontWeight: '800', color: '#ffffff',
      letterSpacing: '1.5px', lineHeight: 1.15, marginBottom: '5pt',
      textTransform: 'uppercase',
    },
    jobTitle: {
      fontSize: '10.5pt', color: 'rgba(255,255,255,0.72)',
      fontWeight: '400', letterSpacing: '2px', textTransform: 'uppercase',
      marginBottom: '0',
    },
    contactStrip: {
      backgroundColor: accent + 'dd',
      padding: '8pt 40pt',
      display: 'flex', flexWrap: 'wrap', gap: '0',
      justifyContent: 'center', alignItems: 'center',
    },
    contactPart: {
      fontSize: sz.meta, color: 'rgba(255,255,255,0.85)',
      paddingRight: isRTL ? '0' : '14pt', paddingLeft: isRTL ? '14pt' : '0',
      borderRight: isRTL ? 'none' : '1px solid rgba(255,255,255,0.3)',
      borderLeft: isRTL ? '1px solid rgba(255,255,255,0.3)' : 'none',
      marginBottom: '2pt',
    },
    contactLast: {
      fontSize: sz.meta, color: 'rgba(255,255,255,0.85)',
      marginBottom: '2pt',
    },
    body_area: {
      padding: `20pt ${padding} 28pt`,
      lineHeight,
    },
    headingWrap: {
      display: 'flex', alignItems: 'center', gap: '0',
      marginTop: sectionMt, marginBottom: '9pt',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      ...BREAK_HEADING,
    },
    headingBadge: {
      backgroundColor: accent,
      color: '#fff',
      fontSize: sz.heading,
      fontWeight: '700',
      padding: '3pt 12pt',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      borderRadius: isRTL ? '0 3pt 3pt 0' : '3pt 0 0 3pt',
      flexShrink: 0,
    },
    headingLine: {
      flex: 1, height: '28pt',
      backgroundColor: accentLight,
      borderRadius: isRTL ? '3pt 0 0 3pt' : '0 3pt 3pt 0',
    },
    meta:    { fontSize: sz.meta, color: '#666', marginBottom: '3pt' },
    company: { fontSize: sz.meta, color: accent, fontWeight: '700', marginBottom: '3pt' },
    body:    { fontSize: sz.body, color: '#333', lineHeight, whiteSpace: 'pre-line', marginTop: '3pt' },
    row: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      flexDirection: isRTL ? 'row-reverse' : 'row', gap: '8pt',
    },
    role:    { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1, minWidth: 0 },
    date: {
      fontSize: sz.meta, color: accent, whiteSpace: 'nowrap', flexShrink: 0,
      fontWeight: '600', backgroundColor: accentLight,
      padding: '1pt 7pt', borderRadius: '10pt',
    },
    tag: {
      display: 'inline-block', backgroundColor: accentLight, color: accent,
      border: `1px solid ${accentMid}`,
      borderRadius: '3pt', padding: '2pt 8pt', fontSize: sz.meta,
      marginRight: isRTL ? '0' : '4pt', marginLeft: isRTL ? '4pt' : '0',
      marginBottom: '4pt', fontWeight: '500',
    },
    item:    { marginBottom: '12pt', ...BREAK_ITEM },
    itemSm:  { marginBottom: '7pt',  ...BREAK_ITEM },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const SectionHeading = ({ label }) => (
    <div style={s.headingWrap}>
      <div style={s.headingBadge}>{label}</div>
      <div style={s.headingLine} />
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
                <div style={s.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
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
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.skills.map((sk, i) => <span key={i} style={s.tag}>{sk.name || sk}</span>)}
            </div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <SectionHeading label={tr('languages', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.languages.map((l, i) => <span key={i} style={s.tag}>{l.name}{l.level ? ` · ${l.level}` : ''}</span>)}
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
                {p.link && <div style={{ ...s.meta, color: accent }}>{p.link}</div>}
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
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
        <h1 style={s.name}>{data.personalInfo.fullName}</h1>
        {data.personalInfo.jobTitle && <p style={s.jobTitle}>{data.personalInfo.jobTitle}</p>}
      </div>
      {contactParts.length > 0 && (
        <div style={s.contactStrip}>
          {contactParts.map((part, i) => (
            <span key={i} style={i < contactParts.length - 1 ? s.contactPart : s.contactLast}>
              {part.trim()}
            </span>
          ))}
        </div>
      )}
      <div style={s.body_area}>
        {sectionOrder.map(key => renderSection(key))}
      </div>
    </article>
  );
};

export default VelvetTemplate;
