import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

const labels = {
  execSummary:   { en: 'Executive Summary',      ar: 'الملخص التنفيذي'     },
  experience:    { en: 'Professional Experience', ar: 'الخبرة المهنية'     },
  education:     { en: 'Education',               ar: 'التعليم'             },
  skills:        { en: 'Core Competencies',       ar: 'الكفاءات الأساسية'  },
  languages:     { en: 'Languages',               ar: 'اللغات'              },
  projects:      { en: 'Projects',                ar: 'المشاريع'            },
  certificates:  { en: 'Certificates',            ar: 'الشهادات والاعتمادات'},
  interests:     { en: 'Interests & Hobbies',     ar: 'الاهتمامات والهوايات'},
  courses:       { en: 'Courses & Training',      ar: 'الدورات والتدريب'   },
  awards:        { en: 'Awards & Honours',        ar: 'الجوائز والتكريمات' },
  organisations: { en: 'Organisations',           ar: 'المنظمات والجمعيات' },
  publications:  { en: 'Publications',            ar: 'المنشورات والأبحاث' },
  references:    { en: 'References',              ar: 'المراجع والتزكيات'  },
  present:       { en: 'Present',                 ar: 'حتى الآن'            },
};
const tr = (key, isRTL) => labels[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

const ExecutiveTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent = theme?.primaryColor || '#0f2942';
  const gold = '#c9a84c';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || (isRTL ? 'right' : 'left');
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';

  const show = (key) => visibleSections[key] !== false;

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      padding, lineHeight, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    name:    { fontSize: sz.name,    fontWeight: '700', color: accent, marginBottom: '2pt', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: headerAlign },
    jobTitle:{ fontSize: sz.body,    color: '#555', marginBottom: '6pt', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: headerAlign },
    contact: { fontSize: sz.meta,    color: '#444', marginBottom: '10pt', textAlign: headerAlign },
    hdivider:{ borderBottom: `3px double ${accent}`, marginBottom: '14pt' },
    meta:    { fontSize: sz.meta,    color: '#555', marginBottom: '4pt' },
    body:    { fontSize: sz.body,    color: '#222', lineHeight, whiteSpace: 'pre-line' },
    row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', gap: '12pt' },
    role:    { fontSize: sz.body, fontWeight: '700', marginBottom: '1pt', flex: 1, minWidth: 0 },
    date:    { fontSize: sz.meta, color: '#555', whiteSpace: 'nowrap', flexShrink: 0 },
    tag:     { display: 'inline-block', border: `1px solid ${gold}`, color: accent, borderRadius: '3pt', padding: '1pt 6pt', fontSize: sz.meta, marginRight: '4pt', marginBottom: '3pt' },
    item:    { marginBottom: '10pt', ...BREAK_ITEM },
    itemSm:  { marginBottom: '6pt',  ...BREAK_ITEM },
  };

  const justifyHeading = headingAlign === 'center' ? 'center' : ((headingAlign === 'right') !== isRTL) ? 'flex-end' : 'flex-start';
  const SectionHeading = ({ labelKey }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8pt', marginTop: sectionMt, marginBottom: '8pt', flexDirection: headingAlign === 'right' ? (isRTL ? 'row' : 'row-reverse') : (isRTL ? 'row-reverse' : 'row'), justifyContent: justifyHeading, ...BREAK_HEADING }}>
      <div style={{ fontSize: sz.heading, fontWeight: '700', color: accent, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {tr(labelKey, isRTL)}
      </div>
      <div style={{ flex: 1, borderBottom: `1px solid ${gold}` }} />
    </div>
  );

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return data.personalInfo?.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <SectionHeading labelKey="execSummary" />
            <div style={ta({ ...s.body, fontStyle: 'italic' }, data.personalInfo?.summaryAlign)}>{data.personalInfo.summary}</div>
          </section>
        ) : null;
      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <SectionHeading labelKey="experience" />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{e.jobTitle}</h3>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={{ ...s.meta, fontWeight: '600' }}>{e.company}{e.location ? `، ${e.location}` : ''}</div>
                <div style={ta(s.body, e.descriptionAlign)}>{e.description}</div>
              </div>
            ))}
          </section>
        ) : null;
      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <SectionHeading labelKey="education" />
            {data.education.map((e, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{e.degree}</h3>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={s.meta}>{e.institution}</div>
                {e.description && <div style={ta(s.body, e.descriptionAlign)}>{e.description}</div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" style={BREAK_ITEM}>
            <SectionHeading labelKey="skills" />
            <div style={s.body}>{data.skills.map(sk => sk.name || sk).join(' | ')}</div>
          </section>
        ) : null;
      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <SectionHeading labelKey="languages" />
            <div style={s.body}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
          </section>
        ) : null;
      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <SectionHeading labelKey="projects" />
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <h3 style={s.role}>{p.title}</h3>
                {p.link && <div style={{ ...s.meta, color: gold }}>{p.link}</div>}
                <div style={ta(s.body, p.descriptionAlign)}>{p.description}</div>
              </div>
            ))}
          </section>
        ) : null;
      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <SectionHeading labelKey="certificates" />
            {data.certificates.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={{ ...s.meta, fontWeight: '600' }}>{c.issuer}</div>}
                {c.description && <div style={ta(s.body, c.descriptionAlign)}>{c.description}</div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={BREAK_ITEM}>
            <SectionHeading labelKey="interests" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4pt' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{typeof item === 'string' ? item : item.name}</span>)}
            </div>
          </section>
        ) : null;
      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses">
            <SectionHeading labelKey="courses" />
            {data.courses.map((c, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.institution && <div style={{ ...s.meta, fontWeight: '600' }}>{c.institution}</div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'awards':
        return data.awards?.length > 0 ? (
          <section key="awards">
            <SectionHeading labelKey="awards" />
            {data.awards.map((a, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{a.title}</h3>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={{ ...s.meta, fontWeight: '600' }}>{a.issuer}</div>}
                {a.description && <div style={ta(s.body, a.descriptionAlign)}>{a.description}</div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'organisations':
        return data.organisations?.length > 0 ? (
          <section key="organisations">
            <SectionHeading labelKey="organisations" />
            {data.organisations.map((o, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{o.name}</h3>
                  {o.date && <div style={s.date}>{o.date}</div>}
                </div>
                {o.role && <div style={{ ...s.meta, fontWeight: '600' }}>{o.role}</div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'publications':
        return data.publications?.length > 0 ? (
          <section key="publications">
            <SectionHeading labelKey="publications" />
            {data.publications.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <div style={s.row}>
                  <h3 style={s.role}>{p.title}</h3>
                  {p.date && <div style={s.date}>{p.date}</div>}
                </div>
                {p.publisher && <div style={{ ...s.meta, fontWeight: '600' }}>{p.publisher}</div>}
                {p.description && <div style={ta(s.body, p.descriptionAlign)}>{p.description}</div>}
              </div>
            ))}
          </section>
        ) : null;
      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            <SectionHeading labelKey="references" />
            {data.references.map((r, i) => (
              <div key={i} style={s.itemSm}>
                <h3 style={s.role}>{r.name}</h3>
                {(r.title || r.company) && <div style={{ ...s.meta, fontWeight: '600' }}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
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
              {sec.items.map((item, i) => (
                <div key={i} style={s.itemSm}>
                  {item.title && <h3 style={s.role}>{item.title}</h3>}
                  {item.subtitle && <div style={s.meta}>{item.subtitle}</div>}
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
      <div style={BREAK_ITEM}>
        <h1 style={s.name}>{data.personalInfo.fullName}</h1>
        <p style={s.jobTitle}>{data.personalInfo.jobTitle}</p>
        {contact && <address style={s.contact}>{contact}</address>}
        <div style={s.hdivider} />
      </div>
      {sectionOrder.map(key => renderSection(key))}
    </article>
  );
};

export default ExecutiveTemplate;
