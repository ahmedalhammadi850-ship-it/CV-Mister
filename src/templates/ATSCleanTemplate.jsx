import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

const labels = {
  summary:       { en: 'Professional Summary',  ar: 'الملخص المهني'        },
  experience:    { en: 'Work Experience',        ar: 'الخبرة العملية'       },
  education:     { en: 'Education',              ar: 'التعليم'              },
  skills:        { en: 'Core Skills',            ar: 'المهارات الأساسية'   },
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
 * ATS Clean — ultra-readable single-column template.
 * Rules followed for maximum ATS parse rate:
 *   • No tables, no columns, no floats
 *   • Section headings are ALL-CAPS plain text with a full-width rule
 *   • Skills listed as plain comma-separated text
 *   • No icons, no images, no decorative elements
 *   • Standard section labels that every ATS recognises
 */
const ATSCleanTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent = theme?.primaryColor || '#1a56a0';
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
    name: {
      fontSize: sz.name,
      fontWeight: '800',
      color: '#0d0d0d',
      marginBottom: '2pt',
      letterSpacing: '-0.01em',
    },
    jobTitle: {
      fontSize: '11pt',
      color: accent,
      fontWeight: '600',
      marginBottom: '6pt',
    },
    contact: {
      fontSize: sz.meta,
      color: '#444',
      marginBottom: '10pt',
      paddingBottom: '10pt',
      borderBottom: `2px solid ${accent}`,
    },
    heading: {
      fontSize: sz.heading,
      fontWeight: '800',
      color: '#0d0d0d',
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      marginTop: sectionMt,
      marginBottom: '3pt',
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
    },
    company: {
      fontSize: sz.meta,
      color: '#444',
      marginBottom: '3pt',
      fontStyle: 'italic',
    },
    body: {
      fontSize: sz.body,
      color: '#222',
      lineHeight,
      whiteSpace: 'pre-line',
    },
    item: { marginBottom: '10pt', ...BREAK_ITEM },
    itemSm: { marginBottom: '7pt', ...BREAK_ITEM },
    skillsText: {
      fontSize: sz.body,
      color: '#222',
      lineHeight: '1.7',
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
          <div key="summary" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('summary', isRTL)}</div>
            <div style={s.rule} />
            <div style={s.body}>{data.personalInfo.summary}</div>
          </div>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <div key="experience">
            <div style={s.heading}>{tr('experience', isRTL)}</div>
            <div style={s.rule} />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.roleRow}>
                  <div style={s.role}>{e.jobTitle}</div>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                <div style={s.body}>{e.description}</div>
              </div>
            ))}
          </div>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <div key="education">
            <div style={s.heading}>{tr('education', isRTL)}</div>
            <div style={s.rule} />
            {data.education.map((e, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <div style={s.role}>{e.degree}</div>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={s.company}>{e.institution}</div>
                {e.description && <div style={s.body}>{e.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return data.skills?.length > 0 ? (
          <div key="skills" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('skills', isRTL)}</div>
            <div style={s.rule} />
            <div style={s.skillsText}>{data.skills.join('  ·  ')}</div>
          </div>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('languages', isRTL)}</div>
            <div style={s.rule} />
            <div style={s.skillsText}>{data.languages.map(l => `${l.name} (${l.level})`).join('  ·  ')}</div>
          </div>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <div key="projects">
            <div style={s.heading}>{tr('projects', isRTL)}</div>
            <div style={s.rule} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.role}>{p.title}</div>
                {p.link && <div style={s.company}>{p.link}</div>}
                <div style={s.body}>{p.description}</div>
              </div>
            ))}
          </div>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <div key="certificates">
            <div style={s.heading}>{tr('certificates', isRTL)}</div>
            <div style={s.rule} />
            {data.certificates.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <div style={s.role}>{c.name}</div>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={s.company}>{c.issuer}</div>}
                {c.description && <div style={s.body}>{c.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <div key="interests" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('interests', isRTL)}</div>
            <div style={s.rule} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{item.name || item}</span>)}
            </div>
          </div>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <div key="courses">
            <div style={s.heading}>{tr('courses', isRTL)}</div>
            <div style={s.rule} />
            {data.courses.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <div style={s.role}>{c.name}</div>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.institution && <div style={s.company}>{c.institution}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <div key="awards">
            <div style={s.heading}>{tr('awards', isRTL)}</div>
            <div style={s.rule} />
            {data.awards.map((a, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <div style={s.role}>{a.title}</div>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={s.company}>{a.issuer}</div>}
                {a.description && <div style={s.body}>{a.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'organisations':
        return data.organisations?.length > 0 ? (
          <div key="organisations">
            <div style={s.heading}>{tr('organisations', isRTL)}</div>
            <div style={s.rule} />
            {data.organisations.map((o, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <div style={s.role}>{o.name}</div>
                  {o.date && <div style={s.date}>{o.date}</div>}
                </div>
                {o.role && <div style={s.company}>{o.role}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'publications':
        return data.publications?.length > 0 ? (
          <div key="publications">
            <div style={s.heading}>{tr('publications', isRTL)}</div>
            <div style={s.rule} />
            {data.publications.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.roleRow}>
                  <div style={s.role}>{p.title}</div>
                  {p.date && <div style={s.date}>{p.date}</div>}
                </div>
                {p.publisher && <div style={s.company}>{p.publisher}</div>}
                {p.description && <div style={s.body}>{p.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <div key="references">
            <div style={s.heading}>{tr('references', isRTL)}</div>
            <div style={s.rule} />
            {data.references.map((r, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.role}>{r.name}</div>
                {(r.title || r.company) && <div style={s.company}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
                {(r.email || r.phone) && <div style={s.body}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
              </div>
            ))}
          </div>
        ) : null;

      default:
        if (key.startsWith('csec-') && data.customSections) {
          const sec = data.customSections.find(s => s.id === key);
          if (!sec || !sec.items?.length) return null;
          return (
            <div key={key}>
              <div style={s.heading}>{sec.title}</div>
              <div style={s.rule} />
              {sec.items.map((item, i) => (
                <div key={i} style={s.itemSm}>
                  {item.title && <div style={s.role}>{item.title}</div>}
                  {item.subtitle && <div style={s.company}>{item.subtitle}</div>}
                  {item.description && <div style={s.body}>{item.description}</div>}
                </div>
              ))}
            </div>
          );
        }
        return null;
    }
  };

  return (
    <div style={s.page}>
      <div style={{ ...BREAK_ITEM, marginBottom: '10pt' }}>
        <div style={s.name}>{data.personalInfo.fullName}</div>
        <div style={s.jobTitle}>{data.personalInfo.jobTitle}</div>
        {contact && <div style={s.contact}>{contact}</div>}
      </div>
      {sectionOrder.map(key => renderSection(key))}
    </div>
  );
};

export default ATSCleanTemplate;
