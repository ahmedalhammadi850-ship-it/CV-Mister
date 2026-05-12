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

const ClassicTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent = theme?.primaryColor || '#1e3a5f';
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';

  const show = (key) => visibleSections[key] !== false;

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      padding, lineHeight, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    header:  { textAlign: 'center', borderBottom: `2px solid ${accent}`, paddingBottom: '10pt', marginBottom: '12pt', ...BREAK_ITEM },
    name:    { fontSize: sz.name,    fontWeight: '700', color: accent, marginBottom: '3pt' },
    jobTitle:{ fontSize: sz.body,    color: '#555', marginBottom: '5pt' },
    contact: { fontSize: sz.meta,    color: '#444' },
    heading: { fontSize: sz.heading, fontWeight: '700', color: accent, marginTop: sectionMt, marginBottom: '5pt', textTransform: 'uppercase', letterSpacing: '0.04em', ...BREAK_HEADING },
    divider: { borderBottom: `1px solid ${accent}`, marginBottom: '7pt' },
    meta:    { fontSize: sz.meta,    color: '#555', fontStyle: 'italic', marginBottom: '4pt' },
    body:    { fontSize: sz.body,    color: '#222', lineHeight, whiteSpace: 'pre-line' },
    row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', gap: '12pt' },
    role:    { fontSize: sz.body, fontWeight: '700', marginBottom: '1pt', flex: 1, minWidth: 0 },
    date:    { fontSize: sz.meta, color: '#555', whiteSpace: 'nowrap', flexShrink: 0 },
    tag:     { display: 'inline-block', border: `1px solid ${accent}`, color: accent, borderRadius: '3pt', padding: '1pt 5pt', fontSize: sz.meta, marginRight: '4pt', marginBottom: '3pt' },
    item:    { marginBottom: '10pt', ...BREAK_ITEM },
    itemSm:  { marginBottom: '6pt',  ...BREAK_ITEM },
  };

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return data.personalInfo?.summary ? (
          <div key="summary" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('summary', isRTL)}</div>
            <div style={s.divider} />
            <div style={s.body}>{data.personalInfo.summary}</div>
          </div>
        ) : null;
      case 'experience':
        return data.experience?.length > 0 ? (
          <div key="experience">
            <div style={s.heading}>{tr('experience', isRTL)}</div>
            <div style={s.divider} />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <div style={s.role}>{e.jobTitle}</div>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.meta}>{e.company}{e.location ? `، ${e.location}` : ''}</div>
                <div style={s.body}>{e.description}</div>
              </div>
            ))}
          </div>
        ) : null;
      case 'education':
        return data.education?.length > 0 ? (
          <div key="education">
            <div style={s.heading}>{tr('education', isRTL)}</div>
            <div style={s.divider} />
            {data.education.map((e, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <div style={s.role}>{e.degree}</div>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={s.meta}>{e.institution}</div>
                {e.description && <div style={s.body}>{e.description}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case 'skills':
        return data.skills?.length > 0 ? (
          <div key="skills" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('skills', isRTL)}</div>
            <div style={s.divider} />
            <div style={s.body}>{data.skills.join(' | ')}</div>
          </div>
        ) : null;
      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('languages', isRTL)}</div>
            <div style={s.divider} />
            <div style={s.body}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
          </div>
        ) : null;
      case 'projects':
        return data.projects?.length > 0 ? (
          <div key="projects">
            <div style={s.heading}>{tr('projects', isRTL)}</div>
            <div style={s.divider} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.role}>{p.title}</div>
                {p.link && <div style={s.meta}>{p.link}</div>}
                <div style={s.body}>{p.description}</div>
              </div>
            ))}
          </div>
        ) : null;
      case 'certificates':
        return data.certificates?.length > 0 ? (
          <div key="certificates">
            <div style={s.heading}>{tr('certificates', isRTL)}</div>
            <div style={s.divider} />
            {data.certificates.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <div style={s.role}>{c.name}</div>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={s.meta}>{c.issuer}</div>}
                {c.description && <div style={s.body}>{c.description}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case 'interests':
        return data.interests?.length > 0 ? (
          <div key="interests" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('interests', isRTL)}</div>
            <div style={s.divider} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{item.name || item}</span>)}
            </div>
          </div>
        ) : null;
      case 'courses':
        return data.courses?.length > 0 ? (
          <div key="courses">
            <div style={s.heading}>{tr('courses', isRTL)}</div>
            <div style={s.divider} />
            {data.courses.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <div style={s.role}>{c.name}</div>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.institution && <div style={s.meta}>{c.institution}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case 'awards':
        return data.awards?.length > 0 ? (
          <div key="awards">
            <div style={s.heading}>{tr('awards', isRTL)}</div>
            <div style={s.divider} />
            {data.awards.map((a, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <div style={s.role}>{a.title}</div>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={s.meta}>{a.issuer}</div>}
                {a.description && <div style={s.body}>{a.description}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case 'organisations':
        return data.organisations?.length > 0 ? (
          <div key="organisations">
            <div style={s.heading}>{tr('organisations', isRTL)}</div>
            <div style={s.divider} />
            {data.organisations.map((o, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <div style={s.role}>{o.name}</div>
                  {o.date && <div style={s.date}>{o.date}</div>}
                </div>
                {o.role && <div style={s.meta}>{o.role}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case 'publications':
        return data.publications?.length > 0 ? (
          <div key="publications">
            <div style={s.heading}>{tr('publications', isRTL)}</div>
            <div style={s.divider} />
            {data.publications.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <div style={s.role}>{p.title}</div>
                  {p.date && <div style={s.date}>{p.date}</div>}
                </div>
                {p.publisher && <div style={s.meta}>{p.publisher}</div>}
                {p.description && <div style={s.body}>{p.description}</div>}
              </div>
            ))}
          </div>
        ) : null;
      case 'references':
        return data.references?.length > 0 ? (
          <div key="references">
            <div style={s.heading}>{tr('references', isRTL)}</div>
            <div style={s.divider} />
            {data.references.map((r, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.role}>{r.name}</div>
                {(r.title || r.company) && <div style={s.meta}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
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
              {sec.items.map((item, i) => (
                <div key={i} style={s.itemSm}>
                  {item.title && <div style={s.role}>{item.title}</div>}
                  {item.subtitle && <div style={s.meta}>{item.subtitle}</div>}
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
      <div style={s.header}>
        <div style={s.name}>{data.personalInfo.fullName}</div>
        <div style={s.jobTitle}>{data.personalInfo.jobTitle}</div>
        {contact && <div style={s.contact}>{contact}</div>}
      </div>
      {sectionOrder.map(key => renderSection(key))}
    </div>
  );
};

export default ClassicTemplate;
