import { resolveTheme, buildContact, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';
import BulletDesc from './BulletDesc';

const labels = {
  summary:       { en: 'Profile',               ar: 'الملف الشخصي'         },
  experience:    { en: 'Work Experience',        ar: 'الخبرة العملية'       },
  education:     { en: 'Education',             ar: 'التعليم'              },
  skills:        { en: 'Skills',                ar: 'المهارات'             },
  languages:     { en: 'Languages',             ar: 'اللغات'               },
  projects:      { en: 'Projects',              ar: 'المشاريع'             },
  certificates:  { en: 'Certifications',        ar: 'الشهادات والاعتمادات'  },
  interests:     { en: 'Interests',             ar: 'الاهتمامات'           },
  courses:       { en: 'Courses & Training',    ar: 'الدورات والتدريب'     },
  awards:        { en: 'Awards & Honours',      ar: 'الجوائز والتكريمات'   },
  organisations: { en: 'Organisations',         ar: 'المنظمات والجمعيات'   },
  publications:  { en: 'Publications',          ar: 'المنشورات والأبحاث'   },
  references:    { en: 'References',            ar: 'المراجع والتزكيات'    },
  present:       { en: 'Present',               ar: 'حتى الآن'             },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages'];

const PrestigeTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);
    const accent = theme?.primaryColor || '#1b2a4a';
  const { sz, font, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;

  /* Contact info for header */
  const vis = visiblePersonalFields || {};
  const info = data.personalInfo || {};
  const contactParts = [
    vis.email     !== false && info.email     && info.email,
    vis.phone     !== false && info.phone     && info.phone,
    vis.location  !== false && info.location  && info.location,
    vis.linkedin  !== false && info.linkedin  && info.linkedin,
    vis.portfolio !== false && info.portfolio && info.portfolio,
    vis.github    !== false && info.github    && info.github,
  ].filter(Boolean);

  const s = {
    page: {
      fontFamily: font,
      fontSize: sz.body,
      color: '#1a1a1a',
      backgroundColor: '#ffffff',
      lineHeight,
      width: '794px',
      minHeight: '1122px',
      boxSizing: 'border-box',
      direction: dir,
    },

    /* ── Solid dark header ── */
    header: {
      backgroundColor: accent,
      padding: '32pt 42pt 24pt',
      textAlign: 'center',
    },
    name: {
      fontSize: sz.name,
      fontWeight: '800',
      color: '#ffffff',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginBottom: '5pt',
      lineHeight: 1.15,
    },
    jobTitle: {
      fontSize: '11pt',
      color: 'rgba(255,255,255,0.80)',
      fontWeight: '400',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      marginBottom: '14pt',
    },
    dividerDot: {
      display: 'inline-block',
      width: '30pt',
      height: '1pt',
      backgroundColor: 'rgba(255,255,255,0.35)',
      verticalAlign: 'middle',
      margin: '0 6pt',
    },
    contactRow: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '0',
      fontSize: sz.meta,
      color: 'rgba(255,255,255,0.75)',
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
    },
    contactSep: {
      display: 'inline-block',
      width: '3pt',
      height: '3pt',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.4)',
      margin: '0 8pt',
      verticalAlign: 'middle',
    },

    /* ── Body ── */
    body_wrap: {
      padding: '22pt 42pt 36pt',
    },
    heading: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10pt',
      marginTop: sectionMt,
      marginBottom: '10pt',
      ...BREAK_HEADING,
    },
    headingLine: {
      flex: 1,
      height: '1px',
      backgroundColor: '#d0d5e0',
    },
    headingText: {
      fontSize: sz.heading,
      fontWeight: '700',
      color: accent,
      textTransform: 'uppercase',
      letterSpacing: '0.10em',
      whiteSpace: 'nowrap',
    },
    roleRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '12pt',
      marginBottom: '2pt',
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
      color: '#666',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      fontWeight: '500',
    },
    company: {
      fontSize: sz.meta,
      color: accent,
      marginBottom: '3pt',
      fontWeight: '500',
    },
    bodyText: {
      fontSize: sz.body,
      color: '#333',
      lineHeight,
      whiteSpace: 'pre-line',
    },
    item: { marginBottom: '12pt', ...BREAK_ITEM },
    itemSm: { marginBottom: '8pt', ...BREAK_ITEM },
    skillPill: {
      display: 'inline-block',
      background: accent + '12',
      color: accent,
      border: `1px solid ${accent}30`,
      borderRadius: '3pt',
      padding: '2pt 8pt',
      fontSize: sz.meta,
      marginRight: '5pt',
      marginBottom: '5pt',
      fontWeight: '500',
    },
  };

  const SectionHead = ({ label }) => (
    <div style={s.heading}>
      <div style={s.headingLine} />
      <div style={s.headingText}>{label}</div>
      <div style={s.headingLine} />
    </div>
  );

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return data.personalInfo?.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <SectionHead label={tr('summary', isRTL)} />
            <div style={ta({ ...s.bodyText, textAlign: 'center', fontStyle: 'italic', color: '#444' }, data.personalInfo?.summaryAlign)}>
              <span style={{fontWeight:data.personalInfo?.summaryBold?700:undefined,fontStyle:data.personalInfo?.summaryItalic?"italic":undefined}}>{data.personalInfo.summary}</span>
            </div>
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
                <div style={s.company}>{e.company}{e.location ? `  ·  ${e.location}` : ''}</div>
                <BulletDesc text={e.description} style={s.bodyText} bold={e?.descriptionBold} italic={e?.descriptionItalic} />
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
                {e.description && <BulletDesc text={e.description} style={s.bodyText} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" style={BREAK_ITEM}>
            <SectionHead label={tr('skills', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0' }}>
              {data.skills.map((sk, i) => <span key={i} style={s.skillPill}>{sk.name || sk}</span>)}
            </div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <SectionHead label={tr('languages', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0' }}>
              {data.languages.map((l, i) => (
                <span key={i} style={s.skillPill}>{l.name} — {l.level}</span>
              ))}
            </div>
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <SectionHead label={tr('projects', isRTL)} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.itemSm}>
                <h3 style={s.role}>{p.title}</h3>
                {p.link && <div style={{ ...s.company, fontSize: sz.meta }}>{p.link}</div>}
                <BulletDesc text={p.description} style={s.bodyText} bold={p?.descriptionBold} italic={p?.descriptionItalic} />
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
                {c.description && <BulletDesc text={c.description} style={s.bodyText} bold={c?.descriptionBold} italic={c?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={BREAK_ITEM}>
            <SectionHead label={tr('interests', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0' }}>
              {data.interests.map((item, i) => <span key={i} style={s.skillPill}>{typeof item === 'string' ? item : item.name}</span>)}
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
                {a.description && <BulletDesc text={a.description} style={s.bodyText} bold={a?.descriptionBold} italic={a?.descriptionItalic} />}
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
                {p.description && <BulletDesc text={p.description} style={s.bodyText} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
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
                <h3 style={s.role}>{r.name}</h3>
                {(r.title || r.company) && <div style={s.company}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
                {(r.email || r.phone) && <div style={s.bodyText}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
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
                  {item.title && <h3 style={s.role}>{item.title}</h3>}
                  {item.subtitle && <div style={s.company}>{item.subtitle}</div>}
                  {item.description && <BulletDesc text={item.description} style={s.bodyText} bold={item?.descriptionBold} italic={item?.descriptionItalic} />}
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

      {/* ── Dark header ── */}
      <div style={s.header}>
        <h1 style={s.name}>{info.fullName}</h1>
        {info.jobTitle && <p style={s.jobTitle}>{info.jobTitle}</p>}
        {contactParts.length > 0 && (
          <div style={s.contactRow}>
            {contactParts.map((part, i) => (
              <span key={i} style={s.contactItem}>
                {i > 0 && <span style={s.contactSep} />}
                {part}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={s.body_wrap}>
        {sectionOrder.map(key => renderSection(key))}
      </div>

    </article>
  );
};

export default PrestigeTemplate;
