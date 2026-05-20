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
 * ATS Compact — redesigned with a professional centered header and
 * bold full-width section rules. Stays fully single-column and ATS-safe.
 *   • Centered name + job title + contact info header
 *   • Section headings: bold ALL-CAPS text + full-width rule below
 *   • Tight compact spacing throughout
 *   • Skills as pipe-separated plain text
 */
const ATSCompactTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);
    const accent = theme?.primaryColor || '#1b4f72';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || (isRTL ? 'right' : 'left');
  const { font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;

  /*
   * ATS-optimal fixed font sizes (independent of theme size slider):
   *   Name        : 16pt  — readable, not overwhelming for ATS parsers
   *   Job title   : 11pt  — standard body-level, clearly subordinate
   *   Contact/meta: 10pt  — minimum comfortable reading size
   *   Body text   : 10.5pt — ATS sweet-spot (10–11pt range)
   *   Section head: 11pt  — ATS reads headings as plain text; bold = enough
   */
  const ATS = {
    name:    '16pt',
    title:   '11pt',
    contact: '10pt',
    heading: '11pt',
    body:    '10.5pt',
    meta:    '10pt',
  };

  const s = {
    page: {
      fontFamily: font,
      fontSize: ATS.body,
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

    /* ── Header ── */
    header: {
      textAlign: headerAlign,
      paddingBottom: '8pt',
      marginBottom: '4pt',
      ...BREAK_ITEM,
    },
    name: {
      fontSize: ATS.name,
      fontWeight: '800',
      color: '#000',
      letterSpacing: '0.01em',
      marginBottom: '2pt',
    },
    jobTitle: {
      fontSize: ATS.title,
      color: accent,
      fontWeight: '600',
      marginBottom: '4pt',
    },
    contact: {
      fontSize: ATS.contact,
      color: '#333',
    },

    /* ── Section heading ── */
    sectionBlock: {
      marginTop: sectionMt,
      marginBottom: '5pt',
      ...BREAK_HEADING,
    },
    headingText: {
      fontSize: ATS.heading,
      fontWeight: '800',
      color: '#000',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginBottom: '2pt',
      textAlign: headingAlign,
    },
    headingRule: {
      borderBottom: `1.5px solid ${accent}`,
    },

    /* ── Content rows ── */
    roleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '8pt',
      marginBottom: '0pt',
      marginTop: '5pt',
    },
    role: {
      fontSize: ATS.body,
      fontWeight: '700',
      color: '#000',
      flex: 1,
      minWidth: 0,
    },
    date: {
      fontSize: ATS.meta,
      color: '#444',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
    company: {
      fontSize: ATS.meta,
      color: '#444',
      fontStyle: 'italic',
      marginBottom: '2pt',
    },
    body: {
      fontSize: ATS.body,
      color: '#222',
      lineHeight: '1.38',
      whiteSpace: 'pre-line',
    },
    item: { marginBottom: '7pt', ...BREAK_ITEM },
    itemSm: { marginBottom: '5pt', ...BREAK_ITEM },
    skillsText: {
      fontSize: ATS.body,
      color: '#222',
      lineHeight: '1.5',
      marginTop: '3pt',
    },
    tag: {
      display: 'inline-block',
      border: '1px solid #ccc',
      color: '#333',
      borderRadius: '2pt',
      padding: '0pt 4pt',
      fontSize: ATS.meta,
      marginRight: '3pt',
      marginBottom: '2pt',
    },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const SectionHead = ({ label }) => (
    <div style={s.sectionBlock}>
      <div style={s.headingText}>{label}</div>
      <div style={s.headingRule} />
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
                <div style={s.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
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
            <div style={s.skillsText}>{data.skills.map(sk => sk.name || sk).join(' | ')}</div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <SectionHead label={tr('languages', isRTL)} />
            <div style={s.skillsText}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <SectionHead label={tr('projects', isRTL)} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={{ ...s.role, marginTop: '5pt' }}>{p.title}</div>
                {p.link && <div style={s.company}>{p.link}</div>}
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3pt', marginTop: '3pt' }}>
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
                <div style={{ ...s.role, marginTop: '5pt' }}>{r.name}</div>
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
                  {item.title && <div style={{ ...s.role, marginTop: '5pt' }}>{item.title}</div>}
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
      {/* Centered professional header */}
      <div style={s.header}>
        <h1 style={s.name}>{data.personalInfo.fullName}</h1>
        {data.personalInfo.jobTitle && <p style={s.jobTitle}>{data.personalInfo.jobTitle}</p>}
        {contact && <address style={s.contact}>{contact}</address>}
      </div>
      {/* Full-width rule separating header from body */}
      <div style={{ borderBottom: `2px solid ${accent}`, marginBottom: '2pt' }} />
      {sectionOrder.map(key => renderSection(key))}
    </article>
  );
};

export default ATSCompactTemplate;
