import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';
import BulletDesc from './BulletDesc';

const labels = {
  summary:       { en: 'Professional Summary',  ar: 'الملخص المهني'        },
  experience:    { en: 'Work Experience',        ar: 'الخبرة العملية'       },
  education:     { en: 'Education',              ar: 'التعليم'              },
  skills:        { en: 'Key Skills',             ar: 'المهارات الرئيسية'   },
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
 * ATS Pro — professional single-column with a subtle left accent bar on headings.
 * ATS best practices:
 *   • Strictly single-column — no side panels or tables
 *   • Left border on headings (decorative only, parsed as plain text by ATS)
 *   • Skills as readable comma/bullet separated plain text
 *   • All contact info in plain text header block
 *   • Clean, high-contrast typography
 */
const ATSProTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);
    const accent = theme?.primaryColor || '#0f4c75';
  const accentLight = accent + '18';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || (isRTL ? 'right' : 'left');
  const justifyHeading = headingAlign === 'center' ? 'center' : ((headingAlign === 'right') !== isRTL) ? 'flex-end' : 'flex-start';
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;

  const s = {
    page: {
      fontFamily: font,
      fontSize: sz.body,
      color: '#111111',
      backgroundColor: '#ffffff',
      padding,
      lineHeight,
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
      direction: dir,
      textAlign: isRTL ? 'right' : 'left',
    },
    header: {
      backgroundColor: accentLight,
      borderLeft: isRTL ? 'none' : `5px solid ${accent}`,
      borderRight: isRTL ? `5px solid ${accent}` : 'none',
      padding: '14pt 16pt',
      marginBottom: '14pt',
      textAlign: headerAlign,
      ...BREAK_ITEM,
    },
    name: {
      fontSize: sz.name,
      fontWeight: '800',
      color: accent,
      marginBottom: '2pt',
      letterSpacing: '-0.01em',
    },
    jobTitle: {
      fontSize: '11pt',
      color: '#333',
      fontWeight: '600',
      marginBottom: '6pt',
    },
    contact: {
      fontSize: sz.meta,
      color: '#444',
    },
    headingWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '8pt',
      marginTop: sectionMt,
      marginBottom: '6pt',
      justifyContent: justifyHeading,
      ...BREAK_HEADING,
    },
    headingBar: {
      width: '4px',
      height: '16px',
      backgroundColor: accent,
      borderRadius: '2px',
      flexShrink: 0,
    },
    heading: {
      fontSize: sz.heading,
      fontWeight: '800',
      color: '#111',
      textTransform: 'uppercase',
      letterSpacing: '0.07em',
    },
    rule: {
      borderBottom: '1px solid #e0e0e0',
      marginBottom: '8pt',
    },
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
      color: '#111',
      flex: 1,
      minWidth: 0,
    },
    date: {
      fontSize: sz.meta,
      color: '#555',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      fontWeight: '500',
      backgroundColor: accentLight,
      padding: '1pt 5pt',
      borderRadius: '2pt',
    },
    company: {
      fontSize: sz.meta,
      color: accent,
      marginBottom: '3pt',
      fontWeight: '600',
    },
    location: {
      fontSize: sz.meta,
      color: '#666',
    },
    body: {
      fontSize: sz.body,
      color: '#222',
      lineHeight,
      whiteSpace: 'pre-line',
    },
    item: { marginBottom: '11pt', ...BREAK_ITEM },
    itemSm: { marginBottom: '7pt', ...BREAK_ITEM },
    skillPill: {
      display: 'inline-block',
      backgroundColor: accentLight,
      color: '#222',
      border: `1px solid ${accent}30`,
      borderRadius: '3pt',
      padding: '2pt 7pt',
      fontSize: sz.meta,
      marginRight: '4pt',
      marginBottom: '4pt',
      fontWeight: '500',
    },
    tag: {
      display: 'inline-block',
      border: '1px solid #ccc',
      color: '#444',
      borderRadius: '3pt',
      padding: '1pt 5pt',
      fontSize: sz.meta,
      marginRight: '4pt',
      marginBottom: '3pt',
    },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const SectionHeading = ({ label }) => (
    <>
      <div style={s.headingWrapper}>
        <div style={s.headingBar} />
        <h2 style={s.heading}>{label}</h2>
      </div>
      <div style={s.rule} />
    </>
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
            <SectionHeading label={tr('experience', isRTL)} />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{e.jobTitle}</h3>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? <span style={{ ...s.location, marginLeft: '6pt' }}>· {e.location}</span> : ''}</div>
                <BulletDesc text={e.description} style={ta(s.body, e.descriptionAlign)} bold={e?.descriptionBold} italic={e?.descriptionItalic} />
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
                <div style={s.roleRow}>
                  <h3 style={s.role}>{e.degree}</h3>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
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
              {data.skills.map((skill, i) => (
                <span key={i} style={s.skillPill}>{skill.name || skill}</span>
              ))}
            </div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <SectionHeading label={tr('languages', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.languages.map((l, i) => (
                <span key={i} style={s.skillPill}>{l.name} — {l.level}</span>
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
                {p.link && <div style={s.company}>{p.link}</div>}
                <BulletDesc text={p.description} style={ta(s.body, p.descriptionAlign)} bold={p?.descriptionBold} italic={p?.descriptionItalic} />
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
                <div style={s.roleRow}>
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt' }}>
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
            <SectionHeading label={tr('awards', isRTL)} />
            {data.awards.map((a, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
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
            <SectionHeading label={tr('publications', isRTL)} />
            {data.publications.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
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
            <SectionHeading label={tr('references', isRTL)} />
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
              <SectionHeading label={sec.title} />
              {sec.items.map((item, i) => (
                <div key={i} style={s.itemSm}>
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

  return (
    <article style={s.page}>
      <div style={s.header}>
        <h1 style={s.name}>{data.personalInfo.fullName}</h1>
        <p style={s.jobTitle}>{data.personalInfo.jobTitle}</p>
        {contact && <address style={s.contact}>{contact}</address>}
      </div>
      {sectionOrder.map(key => renderSection(key))}
    </article>
  );
};

export default ATSProTemplate;
