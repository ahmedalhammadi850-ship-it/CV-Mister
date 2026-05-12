import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

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
const tr = (key, isRTL) => labels[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

/**
 * ATS Compact — dense single-column layout ideal for experienced candidates.
 * Fits more content per page with tighter spacing while remaining 100% ATS-safe.
 *   • Slim top header with name + contact on same visual block
 *   • Section headings: colored text label + full-width light rule
 *   • Skills as inline pipe-separated list — maximum content density
 *   • Reduced vertical gaps between items
 */
const ATSCompactTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent = theme?.primaryColor || '#1b4f72';
  const { sz, font, lineHeight } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;

  const compactPadding = '28pt 32pt';
  const compactMt = '10pt';

  const s = {
    page: {
      fontFamily: font,
      fontSize: sz.body,
      color: '#111',
      backgroundColor: '#ffffff',
      padding: compactPadding,
      lineHeight: '1.35',
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
      direction: dir,
      textAlign: isRTL ? 'right' : 'left',
    },
    headerTop: {
      borderBottom: `2px solid ${accent}`,
      paddingBottom: '7pt',
      marginBottom: '8pt',
      ...BREAK_ITEM,
    },
    name: {
      fontSize: sz.name,
      fontWeight: '800',
      color: '#000',
      display: 'inline',
    },
    jobTitleInline: {
      fontSize: '10pt',
      color: accent,
      fontWeight: '600',
      marginLeft: '8pt',
    },
    contact: {
      fontSize: sz.meta,
      color: '#444',
      marginTop: '3pt',
    },
    headingRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '6pt',
      marginTop: compactMt,
      marginBottom: '4pt',
      ...BREAK_HEADING,
    },
    headingLabel: {
      fontSize: '8.5pt',
      fontWeight: '800',
      color: accent,
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      whiteSpace: 'nowrap',
    },
    headingRule: {
      flex: 1,
      borderBottom: `1px solid ${accent}`,
      opacity: 0.4,
    },
    roleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '8pt',
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
      color: '#555',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    },
    company: {
      fontSize: sz.meta,
      color: '#444',
      marginBottom: '2pt',
    },
    body: {
      fontSize: sz.body,
      color: '#222',
      lineHeight: '1.35',
      whiteSpace: 'pre-line',
    },
    item: { marginBottom: '7pt', ...BREAK_ITEM },
    itemSm: { marginBottom: '5pt', ...BREAK_ITEM },
    skills: {
      fontSize: sz.body,
      color: '#222',
      lineHeight: '1.5',
    },
    tag: {
      display: 'inline-block',
      border: '1px solid #ccc',
      color: '#333',
      borderRadius: '2pt',
      padding: '0pt 4pt',
      fontSize: sz.meta,
      marginRight: '3pt',
      marginBottom: '2pt',
    },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const SectionHead = ({ label }) => (
    <div style={s.headingRow}>
      <div style={s.headingLabel}>{label}</div>
      <div style={s.headingRule} />
    </div>
  );

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return data.personalInfo?.summary ? (
          <div key="summary" style={BREAK_ITEM}>
            <SectionHead label={tr('summary', isRTL)} />
            <div style={s.body}>{data.personalInfo.summary}</div>
          </div>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <div key="experience">
            <SectionHead label={tr('experience', isRTL)} />
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
            <SectionHead label={tr('education', isRTL)} />
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
            <SectionHead label={tr('skills', isRTL)} />
            <div style={s.skills}>{data.skills.join(' | ')}</div>
          </div>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages" style={BREAK_ITEM}>
            <SectionHead label={tr('languages', isRTL)} />
            <div style={s.skills}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
          </div>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <div key="projects">
            <SectionHead label={tr('projects', isRTL)} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.role}>{p.title}{p.link ? <span style={{ ...s.company, marginLeft: '6pt', fontStyle: 'italic' }}> · {p.link}</span> : ''}</div>
                <div style={s.body}>{p.description}</div>
              </div>
            ))}
          </div>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <div key="certificates">
            <SectionHead label={tr('certificates', isRTL)} />
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
            <SectionHead label={tr('interests', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3pt' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{item.name || item}</span>)}
            </div>
          </div>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <div key="courses">
            <SectionHead label={tr('courses', isRTL)} />
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
            <SectionHead label={tr('awards', isRTL)} />
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
            <SectionHead label={tr('organisations', isRTL)} />
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
            <SectionHead label={tr('publications', isRTL)} />
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
            <SectionHead label={tr('references', isRTL)} />
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
              <SectionHead label={sec.title} />
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
      <div style={s.headerTop}>
        <div>
          <span style={s.name}>{data.personalInfo.fullName}</span>
          {data.personalInfo.jobTitle && (
            <span style={s.jobTitleInline}>· {data.personalInfo.jobTitle}</span>
          )}
        </div>
        {contact && <div style={s.contact}>{contact}</div>}
      </div>
      {sectionOrder.map(key => renderSection(key))}
    </div>
  );
};

export default ATSCompactTemplate;
