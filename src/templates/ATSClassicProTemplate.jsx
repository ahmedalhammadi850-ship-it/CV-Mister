import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING, ta } from './templateUtils';

const labels = {
  summary:       { en: 'Professional Summary',  ar: 'الملخص المهني'        },
  experience:    { en: 'Work Experience',        ar: 'الخبرة العملية'       },
  education:     { en: 'Education',              ar: 'التعليم'              },
  skills:        { en: 'Core Skills',            ar: 'المهارات الأساسية'   },
  languages:     { en: 'Languages',              ar: 'اللغات'               },
  projects:      { en: 'Projects',               ar: 'المشاريع'             },
  certificates:  { en: 'Certifications',         ar: 'الشهادات والاعتمادات' },
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
 * ATS Classic Pro — academic/professional centered style.
 * Distinguishing features:
 *  • Centered ALL-CAPS name with thin double-rule enclosure around contact line
 *  • Section headings: centered, uppercase, with full-width underline
 *  • Small-caps company names, italic date labels
 *  • Zero decorative graphics — maximum ATS parse rate
 */
const ATSClassicProTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const tr = (key) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);
  const accent = theme?.primaryColor || '#1a1a2e';
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;

  const resolvedHeaderAlign = isRTL ? 'right' : 'center';
  const resolvedHeadAlign   = isRTL ? 'right' : 'center';

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
    name: {
      fontSize: sz.name,
      fontWeight: '800',
      color: '#0a0a0a',
      textAlign: resolvedHeaderAlign,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: '3pt',
    },
    jobTitle: {
      fontSize: '11pt',
      color: accent,
      fontWeight: '600',
      textAlign: resolvedHeaderAlign,
      marginBottom: '5pt',
    },
    contactWrap: {
      borderTop: `1.5px solid ${accent}`,
      borderBottom: `1.5px solid ${accent}`,
      padding: '5pt 0',
      marginBottom: '4pt',
      textAlign: resolvedHeaderAlign,
    },
    contact: {
      fontSize: sz.meta,
      color: '#444',
    },
    heading: {
      textAlign: resolvedHeadAlign,
      fontSize: sz.heading,
      fontWeight: '800',
      color: '#0a0a0a',
      textTransform: 'uppercase',
      letterSpacing: '0.09em',
      marginTop: sectionMt,
      marginBottom: '2pt',
      ...BREAK_HEADING,
    },
    rule: {
      borderBottom: `1.5px solid ${accent}`,
      marginBottom: '7pt',
    },
    roleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '12pt',
      marginBottom: '1pt',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    role: { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1, minWidth: 0 },
    date: { fontSize: sz.meta, color: '#555', whiteSpace: 'nowrap', flexShrink: 0, fontStyle: 'italic' },
    company: { fontSize: sz.meta, color: '#444', marginBottom: '3pt', textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: sz.meta },
    body: { fontSize: sz.body, color: '#222', lineHeight, whiteSpace: 'pre-line' },
    item: { marginBottom: '10pt', ...BREAK_ITEM },
    itemSm: { marginBottom: '7pt', ...BREAK_ITEM },
    skillsText: { fontSize: sz.body, color: '#222', lineHeight: '1.7' },
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
            <h2 style={s.heading}>{tr('summary')}</h2>
            <div style={s.rule} />
            <div style={ta(s.body, data.personalInfo?.summaryAlign)}><span style={{ fontWeight: data.personalInfo?.summaryBold ? 700 : undefined, fontStyle: data.personalInfo?.summaryItalic ? 'italic' : undefined }}>{data.personalInfo.summary}</span></div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <h2 style={s.heading}>{tr('experience')}</h2>
            <div style={s.rule} />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{e.jobTitle}</h3>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present') : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                <div style={ta(s.body, e.descriptionAlign)}><span style={{ fontWeight: e?.descriptionBold ? 700 : undefined, fontStyle: e?.descriptionItalic ? 'italic' : undefined }}>{e.description}</span></div>
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <h2 style={s.heading}>{tr('education')}</h2>
            <div style={s.rule} />
            {data.education.map((e, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{e.degree}</h3>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={s.company}>{e.institution}</div>
                {e.description && <div style={ta(s.body, e.descriptionAlign)}><span style={{ fontWeight: e?.descriptionBold ? 700 : undefined, fontStyle: e?.descriptionItalic ? 'italic' : undefined }}>{e.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('skills')}</h2>
            <div style={s.rule} />
            <div style={s.skillsText}>{data.skills.map(sk => sk.name || sk).join('  ·  ')}</div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('languages')}</h2>
            <div style={s.rule} />
            <div style={s.skillsText}>{data.languages.map(l => `${l.name} (${l.level})`).join('  ·  ')}</div>
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <h2 style={s.heading}>{tr('projects')}</h2>
            <div style={s.rule} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <h3 style={s.role}>{p.title}</h3>
                {p.link && <div style={s.company}>{p.link}</div>}
                <div style={ta(s.body, p.descriptionAlign)}><span style={{ fontWeight: p?.descriptionBold ? 700 : undefined, fontStyle: p?.descriptionItalic ? 'italic' : undefined }}>{p.description}</span></div>
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <h2 style={s.heading}>{tr('certificates')}</h2>
            <div style={s.rule} />
            {data.certificates.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={s.company}>{c.issuer}</div>}
                {c.description && <div style={ta(s.body, c.descriptionAlign)}><span style={{ fontWeight: c?.descriptionBold ? 700 : undefined, fontStyle: c?.descriptionItalic ? 'italic' : undefined }}>{c.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={BREAK_ITEM}>
            <h2 style={s.heading}>{tr('interests')}</h2>
            <div style={s.rule} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{typeof item === 'string' ? item : item.name}</span>)}
            </div>
          </section>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses">
            <h2 style={s.heading}>{tr('courses')}</h2>
            <div style={s.rule} />
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
            <h2 style={s.heading}>{tr('awards')}</h2>
            <div style={s.rule} />
            {data.awards.map((a, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{a.title}</h3>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={s.company}>{a.issuer}</div>}
                {a.description && <div style={ta(s.body, a.descriptionAlign)}><span style={{ fontWeight: a?.descriptionBold ? 700 : undefined, fontStyle: a?.descriptionItalic ? 'italic' : undefined }}>{a.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'organisations':
        return data.organisations?.length > 0 ? (
          <section key="organisations">
            <h2 style={s.heading}>{tr('organisations')}</h2>
            <div style={s.rule} />
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
            <h2 style={s.heading}>{tr('publications')}</h2>
            <div style={s.rule} />
            {data.publications.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <h3 style={s.role}>{p.title}</h3>
                  {p.date && <div style={s.date}>{p.date}</div>}
                </div>
                {p.publisher && <div style={s.company}>{p.publisher}</div>}
                {p.description && <div style={ta(s.body, p.descriptionAlign)}><span style={{ fontWeight: p?.descriptionBold ? 700 : undefined, fontStyle: p?.descriptionItalic ? 'italic' : undefined }}>{p.description}</span></div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            <h2 style={s.heading}>{tr('references')}</h2>
            <div style={s.rule} />
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
              <div style={s.rule} />
              {sec.items.map((item, i) => (
                <div key={i} style={s.itemSm}>
                  {item.title && <h3 style={s.role}>{item.title}</h3>}
                  {item.subtitle && <div style={s.company}>{item.subtitle}</div>}
                  {item.description && <div style={ta(s.body, item.descriptionAlign)}><span style={{ fontWeight: item?.descriptionBold ? 700 : undefined, fontStyle: item?.descriptionItalic ? 'italic' : undefined }}>{item.description}</span></div>}
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
      <div style={{ ...BREAK_ITEM, marginBottom: '10pt' }}>
        <h1 style={s.name}>{data.personalInfo.fullName}</h1>
        {data.personalInfo.jobTitle && <p style={s.jobTitle}>{data.personalInfo.jobTitle}</p>}
        {contact && <div style={s.contactWrap}><address style={s.contact}>{contact}</address></div>}
      </div>
      {sectionOrder.map(key => renderSection(key))}
    </article>
  );
};

export default ATSClassicProTemplate;
