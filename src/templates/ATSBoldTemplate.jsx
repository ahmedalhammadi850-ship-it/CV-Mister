import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

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
const tr = (key, isRTL) => labels[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

/**
 * ATS Bold — bold section blocks with a solid accent background on headings.
 * Still fully single-column and ATS-safe:
 *   • Section headings use a filled accent background bar (rendered as text by parsers)
 *   • Strong typographic hierarchy: bold role → italic company → body
 *   • Skills as vertical two-column grid rendered as plain text pairs
 *   • No images, tables, or multi-column layouts
 */
const ATSBoldTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent = theme?.primaryColor || '#155e75';
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
    header: {
      marginBottom: '12pt',
      paddingBottom: '10pt',
      borderBottom: `1px solid #ddd`,
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
      fontWeight: '500',
      marginBottom: '5pt',
    },
    contact: {
      fontSize: sz.meta,
      color: '#444',
    },
    headingBlock: {
      backgroundColor: accent,
      color: '#fff',
      fontSize: sz.heading,
      fontWeight: '800',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      padding: '3pt 8pt',
      marginTop: sectionMt,
      marginBottom: '8pt',
      textAlign: headingAlign,
      ...BREAK_HEADING,
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
      color: '#000',
      flex: 1,
      minWidth: 0,
    },
    date: {
      fontSize: sz.meta,
      color: '#555',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      fontStyle: 'italic',
    },
    company: {
      fontSize: sz.meta,
      color: '#444',
      fontStyle: 'italic',
      marginBottom: '3pt',
    },
    body: {
      fontSize: sz.body,
      color: '#222',
      lineHeight,
      whiteSpace: 'pre-line',
    },
    item: { marginBottom: '10pt', ...BREAK_ITEM },
    itemSm: { marginBottom: '7pt', ...BREAK_ITEM },
    skillGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '4pt 16pt',
    },
    skillItem: {
      fontSize: sz.body,
      color: '#111',
      display: 'flex',
      alignItems: 'center',
      gap: '5pt',
      minWidth: '180pt',
    },
    bullet: {
      color: accent,
      fontWeight: '900',
      fontSize: '10pt',
      lineHeight: 1,
    },
    tag: {
      display: 'inline-block',
      border: `1px solid ${accent}`,
      color: '#333',
      borderRadius: '2pt',
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
            <div style={s.headingBlock}>{tr('summary', isRTL)}</div>
            <div style={ta(s.body, data.personalInfo?.summaryAlign)}>{data.personalInfo.summary}</div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <div style={s.headingBlock}>{tr('experience', isRTL)}</div>
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{e.jobTitle}</h3>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                <div style={ta(s.body, e.descriptionAlign)}>{e.description}</div>
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <div style={s.headingBlock}>{tr('education', isRTL)}</div>
            {data.education.map((e, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{e.degree}</h3>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
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
            <div style={s.headingBlock}>{tr('skills', isRTL)}</div>
            <div style={s.skillGrid}>
              {data.skills.map((skill, i) => (
                <div key={i} style={s.skillItem}>
                  <span style={s.bullet}>▪</span>
                  <span>{skill.name || skill}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <div style={s.headingBlock}>{tr('languages', isRTL)}</div>
            <div style={s.skillGrid}>
              {data.languages.map((l, i) => (
                <div key={i} style={s.skillItem}>
                  <span style={s.bullet}>▪</span>
                  <span>{l.name} — {l.level}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <div style={s.headingBlock}>{tr('projects', isRTL)}</div>
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <h3 style={s.role}>{p.title}</h3>
                {p.link && <div style={s.company}>{p.link}</div>}
                <div style={ta(s.body, p.descriptionAlign)}>{p.description}</div>
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <div style={s.headingBlock}>{tr('certificates', isRTL)}</div>
            {data.certificates.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
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
            <div style={s.headingBlock}>{tr('interests', isRTL)}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{item.name || item}</span>)}
            </div>
          </section>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses">
            <div style={s.headingBlock}>{tr('courses', isRTL)}</div>
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
            <div style={s.headingBlock}>{tr('awards', isRTL)}</div>
            {data.awards.map((a, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
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
            <div style={s.headingBlock}>{tr('organisations', isRTL)}</div>
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
            <div style={s.headingBlock}>{tr('publications', isRTL)}</div>
            {data.publications.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
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
            <div style={s.headingBlock}>{tr('references', isRTL)}</div>
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
              <div style={s.headingBlock}>{sec.title}</div>
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

export default ATSBoldTemplate;
