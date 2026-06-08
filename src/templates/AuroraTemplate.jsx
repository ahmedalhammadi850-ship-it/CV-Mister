import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';
import BulletDesc from './BulletDesc';

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

const AuroraTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);
    const accent = theme?.primaryColor || '#059669';
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';

  const show = (key) => visibleSections[key] !== false;

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      padding, lineHeight, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    headerBlock: {
      marginBottom: '0',
      paddingBottom: '14pt',
      ...BREAK_ITEM,
    },
    nameRow: {
      display: 'flex', alignItems: 'flex-end',
      justifyContent: isRTL ? 'flex-end' : 'space-between',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      gap: '12pt', flexWrap: 'wrap',
      marginBottom: '4pt',
    },
    name: {
      fontSize: sz.name, fontWeight: '900', color: '#111',
      letterSpacing: '-0.5px', lineHeight: 1.1,
      flex: 1,
    },
    jobTitle: {
      fontSize: '10pt', color: accent, fontWeight: '700',
      letterSpacing: '1px', textTransform: 'uppercase',
      textAlign: isRTL ? 'left' : 'right', flexShrink: 0,
      paddingBottom: '3pt',
    },
    gradientBar: {
      height: '4pt',
      background: `linear-gradient(${isRTL ? '270deg' : '90deg'}, ${accent}, ${accent}55, transparent)`,
      marginBottom: '8pt',
      borderRadius: '2pt',
    },
    contactRow: {
      fontSize: sz.meta, color: '#555', marginBottom: '0',
      display: 'flex', flexWrap: 'wrap', gap: '0',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    contactPart: {
      paddingRight: isRTL ? '0' : '10pt', paddingLeft: isRTL ? '10pt' : '0',
      borderRight: isRTL ? 'none' : '1px solid #d1d5db',
      borderLeft: isRTL ? '1px solid #d1d5db' : 'none',
      marginBottom: '2pt',
    },
    contactLast: { marginBottom: '2pt' },
    headingWrap: {
      display: 'flex', alignItems: 'center', gap: '0',
      marginTop: sectionMt, marginBottom: '9pt',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      ...BREAK_HEADING,
    },
    headingLeft: {
      width: '4pt', height: '20pt', backgroundColor: accent,
      borderRadius: '2pt', flexShrink: 0,
      marginRight: isRTL ? '0' : '8pt',
      marginLeft: isRTL ? '8pt' : '0',
    },
    heading: {
      fontSize: sz.heading, fontWeight: '800', color: '#111',
      letterSpacing: '0.04em', textTransform: 'uppercase',
      flex: 1,
    },
    headingLine: {
      flex: 1, height: '1px',
      background: `linear-gradient(${isRTL ? '270deg' : '90deg'}, #d1d5db, transparent)`,
      marginLeft: isRTL ? '0' : '10pt',
      marginRight: isRTL ? '10pt' : '0',
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
      fontSize: sz.meta, color: '#fff', whiteSpace: 'nowrap', flexShrink: 0,
      fontWeight: '600', backgroundColor: accent,
      padding: '1.5pt 8pt', borderRadius: '2pt',
    },
    expItem: {
      marginBottom: '12pt',
      paddingLeft: isRTL ? '0' : '10pt',
      paddingRight: isRTL ? '10pt' : '0',
      borderLeft: isRTL ? 'none' : `2px solid ${accent}33`,
      borderRight: isRTL ? `2px solid ${accent}33` : 'none',
      ...BREAK_ITEM,
    },
    tag: {
      display: 'inline-block',
      background: '#f9fafb', color: '#374151',
      border: '1px solid #e5e7eb',
      borderRadius: '3pt', padding: '2pt 8pt', fontSize: sz.meta,
      marginRight: isRTL ? '0' : '4pt', marginLeft: isRTL ? '4pt' : '0',
      marginBottom: '4pt', fontWeight: '500',
    },
    item:    { marginBottom: '11pt', ...BREAK_ITEM },
    itemSm:  { marginBottom: '7pt',  ...BREAK_ITEM },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const SectionHeading = ({ label }) => (
    <div style={s.headingWrap}>
      <div style={s.headingLeft} />
      <h2 style={s.heading}>{label}</h2>
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
            <div style={ta(s.body, data.personalInfo?.summaryAlign)}><span style={{fontWeight:data.personalInfo?.summaryBold?700:undefined,fontStyle:data.personalInfo?.summaryItalic?"italic":undefined}}>{data.personalInfo.summary}</span></div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            {data.experience.map((e, i) => (
              <div key={i} style={s.expItem}>
                {i === 0 && <SectionHeading label={tr('experience', isRTL)} />}
                <div style={s.row}>
                  <h3 style={s.role}>{e.jobTitle}</h3>
                  <div style={s.date}>{e.startDate}{e.startDate ? ' – ' : ''}{e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                {e.description && <BulletDesc text={e.description} style={ta(s.body, e.descriptionAlign)} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            {data.education.map((e, i) => (
              <div key={i} style={s.expItem}>
                {i === 0 && <SectionHeading label={tr('education', isRTL)} />}
                <div style={s.row}>
                  <h3 style={s.role}>{e.degree}</h3>
                  <div style={s.date}>{e.startDate}{e.startDate ? ' – ' : ''}{e.endDate}</div>
                </div>
                <div style={s.company}>{e.institution}</div>
                {e.description && <BulletDesc text={e.description} style={ta(s.body, e.descriptionAlign)} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
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
            {data.projects.map((p, i) => (
              <div key={i} style={s.expItem}>
                {i === 0 && <SectionHeading label={tr('projects', isRTL)} />}
                <h3 style={s.role}>{p.title}</h3>
                {p.link && <div style={{ ...s.meta, color: accent }}>{p.link}</div>}
                {p.description && <BulletDesc text={p.description} style={ta(s.body, p.descriptionAlign)} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            {data.certificates.map((c, i) => (
              <div key={i} style={s.itemSm}>
                {i === 0 && <SectionHeading label={tr('certificates', isRTL)} />}
                <div style={s.row}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={s.company}>{c.issuer}</div>}
                {c.description && <BulletDesc text={c.description} style={ta(s.body, c.descriptionAlign)} bold={c?.descriptionBold} italic={c?.descriptionItalic} />}
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
            {data.courses.map((c, i) => (
              <div key={i} style={s.itemSm}>
                {i === 0 && <SectionHeading label={tr('courses', isRTL)} />}
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
            {data.awards.map((a, i) => (
              <div key={i} style={s.itemSm}>
                {i === 0 && <SectionHeading label={tr('awards', isRTL)} />}
                <div style={s.row}>
                  <h3 style={s.role}>{a.title}</h3>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={s.company}>{a.issuer}</div>}
                {a.description && <BulletDesc text={a.description} style={ta(s.body, a.descriptionAlign)} bold={a?.descriptionBold} italic={a?.descriptionItalic} />}
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
            {data.publications.map((p, i) => (
              <div key={i} style={s.itemSm}>
                {i === 0 && <SectionHeading label={tr('publications', isRTL)} />}
                <div style={s.row}>
                  <h3 style={s.role}>{p.title}</h3>
                  {p.date && <div style={s.date}>{p.date}</div>}
                </div>
                {p.publisher && <div style={s.company}>{p.publisher}</div>}
                {p.description && <BulletDesc text={p.description} style={ta(s.body, p.descriptionAlign)} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            {data.references.map((r, i) => (
              <div key={i} style={s.itemSm}>
                {i === 0 && <SectionHeading label={tr('references', isRTL)} />}
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
              {sec.items.map((item, i) => (
                <div key={i} style={s.itemSm}>
                  {i === 0 && <SectionHeading label={sec.title} />}
                  {item.title && <h3 style={s.role}>{item.title}</h3>}
                  {item.subtitle && <div style={s.company}>{item.subtitle}</div>}
                  {item.description && <BulletDesc text={item.description} style={ta(s.body, item.descriptionAlign)} bold={item?.descriptionBold} italic={item?.descriptionItalic} />}
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
      <header style={s.headerBlock}>
        <div style={s.nameRow}>
          <h1 style={s.name}>{data.personalInfo.fullName}</h1>
          {data.personalInfo.jobTitle && (
            <p style={s.jobTitle}>{data.personalInfo.jobTitle}</p>
          )}
        </div>
        <div style={s.gradientBar} />
        {contactParts.length > 0 && (
          <div style={s.contactRow}>
            {contactParts.map((part, i) => (
              <span key={i} style={i < contactParts.length - 1 ? s.contactPart : s.contactLast}>
                {part.trim()}
              </span>
            ))}
          </div>
        )}
      </header>
      {sectionOrder.map(key => renderSection(key))}
    </article>
  );
};

export default AuroraTemplate;
