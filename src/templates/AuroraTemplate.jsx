import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

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
const tr = (key, isRTL) => labels[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

const AuroraTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
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
      <div style={s.heading}>{label}</div>
      <div style={s.headingLine} />
    </div>
  );

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return data.personalInfo?.summary ? (
          <div key="summary" style={BREAK_ITEM}>
            <SectionHeading label={tr('summary', isRTL)} />
            <div style={s.body}>{data.personalInfo.summary}</div>
          </div>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <div key="experience">
            <SectionHeading label={tr('experience', isRTL)} />
            {data.experience.map((e, i) => (
              <div key={i} style={s.expItem}>
                <div style={s.row}>
                  <div style={s.role}>{e.jobTitle}</div>
                  <div style={s.date}>{e.startDate}{e.startDate ? ' – ' : ''}{e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                {e.description && <div style={s.body}>{e.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <div key="education">
            <SectionHeading label={tr('education', isRTL)} />
            {data.education.map((e, i) => (
              <div key={i} style={s.expItem}>
                <div style={s.row}>
                  <div style={s.role}>{e.degree}</div>
                  <div style={s.date}>{e.startDate}{e.startDate ? ' – ' : ''}{e.endDate}</div>
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
            <SectionHeading label={tr('skills', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.skills.map((sk, i) => <span key={i} style={s.tag}>{sk.name || sk}</span>)}
            </div>
          </div>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages" style={BREAK_ITEM}>
            <SectionHeading label={tr('languages', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.languages.map((l, i) => <span key={i} style={s.tag}>{l.name}{l.level ? ` · ${l.level}` : ''}</span>)}
            </div>
          </div>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <div key="projects">
            <SectionHeading label={tr('projects', isRTL)} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.expItem}>
                <div style={s.role}>{p.title}</div>
                {p.link && <div style={{ ...s.meta, color: accent }}>{p.link}</div>}
                {p.description && <div style={s.body}>{p.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <div key="certificates">
            <SectionHeading label={tr('certificates', isRTL)} />
            {data.certificates.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
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
            <SectionHeading label={tr('interests', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{item.name || item}</span>)}
            </div>
          </div>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <div key="courses">
            <SectionHeading label={tr('courses', isRTL)} />
            {data.courses.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
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
            <SectionHeading label={tr('awards', isRTL)} />
            {data.awards.map((a, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
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
            <SectionHeading label={tr('organisations', isRTL)} />
            {data.organisations.map((o, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
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
            <SectionHeading label={tr('publications', isRTL)} />
            {data.publications.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
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
            <SectionHeading label={tr('references', isRTL)} />
            {data.references.map((r, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.role}>{r.name}</div>
                {(r.title || r.company) && <div style={s.company}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
                {(r.email || r.phone) && <div style={s.meta}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
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
              <SectionHeading label={sec.title} />
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

  const contactParts = contact ? contact.split(' | ') : [];

  return (
    <div style={s.page}>
      <div style={s.headerBlock}>
        <div style={s.nameRow}>
          <div style={s.name}>{data.personalInfo.fullName}</div>
          {data.personalInfo.jobTitle && (
            <div style={s.jobTitle}>{data.personalInfo.jobTitle}</div>
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
      </div>
      {sectionOrder.map(key => renderSection(key))}
    </div>
  );
};

export default AuroraTemplate;
