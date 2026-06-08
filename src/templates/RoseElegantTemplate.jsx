import { resolveTheme, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';
import BulletDesc from './BulletDesc';

const labels = {
  summary:       { en: 'Profile',            ar: 'نبذة تعريفية'         },
  experience:    { en: 'Work Experience',     ar: 'الخبرة العملية'       },
  education:     { en: 'Education',          ar: 'التعليم'              },
  skills:        { en: 'Skills',             ar: 'المهارات'             },
  languages:     { en: 'Languages',          ar: 'اللغات'               },
  projects:      { en: 'Projects',           ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',       ar: 'الشهادات'             },
  interests:     { en: 'Interests',          ar: 'الاهتمامات'           },
  courses:       { en: 'Courses',            ar: 'الدورات'              },
  awards:        { en: 'Awards',             ar: 'الجوائز'              },
  organisations: { en: 'Organisations',      ar: 'المنظمات'             },
  publications:  { en: 'Publications',       ar: 'المنشورات'            },
  references:    { en: 'References',         ar: 'المراجع'              },
  present:       { en: 'Present',            ar: 'حتى الآن'             },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'languages', 'projects', 'certificates', 'awards'];

const DotsRating = ({ level = 3, accent }) => {
    const filled = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <span style={{ display: 'inline-flex', gap: '3pt', verticalAlign: 'middle' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: i <= filled ? accent : '#f0d6df', display: 'inline-block' }} />
      ))}
    </span>
  );
};

const RoseElegantTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const accent       = theme?.primaryColor || '#c0395e';
  const accentLight  = accent + '18';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

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
      fontFamily: font, fontSize: sz.body, color: '#2c2c2c', backgroundColor: '#fff',
      width: '794px', minHeight: '1122px', boxSizing: 'border-box',
      direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    header: {
      backgroundColor: accentLight,
      padding: '28pt 36pt',
      display: 'flex',
      alignItems: 'center',
      gap: '20pt',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    photoWrap: {
      width: '80pt', height: '80pt', borderRadius: '50%',
      overflow: 'hidden', flexShrink: 0,
      border: `3px solid ${accent}`,
    },
    headerText: { flex: 1 },
    name: { fontSize: sz.name, fontWeight: '700', color: accent, lineHeight: 1.2, marginBottom: '3pt' },
    jobTitle: { fontSize: sz.body, color: '#555', marginBottom: '8pt' },
    contactStrip: {
      display: 'flex', flexWrap: 'wrap', gap: '6pt',
      fontSize: sz.meta, color: '#666',
    },
    contactPill: {
      display: 'inline-flex', alignItems: 'center', gap: '4pt',
      background: '#fff', border: `1px solid ${accent}44`,
      borderRadius: '20pt', padding: '2pt 8pt',
      color: '#555', fontSize: sz.meta,
    },
    content: { padding: `16pt ${padding.split(' ')[1] || '36pt'}` },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: accent,
      marginTop: sectionMt, marginBottom: '8pt',
      display: 'flex', alignItems: 'center', gap: '8pt',
      textAlign: headingAlign,
      ...BREAK_HEADING,
    },
    headingLine: { flex: 1, height: '1.5px', backgroundColor: accent + '44' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10pt', flexDirection: isRTL ? 'row-reverse' : 'row' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#1a1a1a', flex: 1 },
    date: {
      fontSize: sz.meta, color: '#fff', whiteSpace: 'nowrap', flexShrink: 0,
      background: accent, borderRadius: '10pt', padding: '1pt 8pt',
    },
    company: { fontSize: sz.meta, color: accent, fontWeight: '600', marginBottom: '3pt' },
    body: { fontSize: sz.body, color: '#444', lineHeight, whiteSpace: 'pre-line' },
    item: { marginBottom: '12pt', ...BREAK_ITEM },
    tag: { display: 'inline-block', background: accentLight, border: `1px solid ${accent}44`, borderRadius: '4pt', padding: '2pt 8pt', fontSize: sz.meta, color: accent, marginRight: '5pt', marginBottom: '4pt' },
    skillRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7pt', fontSize: sz.body, flexDirection: isRTL ? 'row-reverse' : 'row' },
  };

  const SectionHeading = ({ label }) => (
    <div style={{ ...s.heading, justifyContent: headingAlign === 'center' ? 'center' : 'flex-start' }}>
      <span>{label}</span>
      <div style={s.headingLine} />
    </div>
  );

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return info.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <SectionHeading label={tr('summary', isRTL)} />
            <div style={ta(s.body, info.summaryAlign)}>{info.summary}</div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <SectionHeading label={tr('experience', isRTL)} />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <div>
                    <h3 style={s.role}>{e.jobTitle}</h3>
                    <div style={s.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                  </div>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                {e.description && <BulletDesc text={e.description} style={ta(s.body, e.descriptionAlign)} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <SectionHeading label={tr('education', isRTL)} />
            {data.education.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <div>
                    <h3 style={s.role}>{e.degree}</h3>
                    <div style={s.company}>{e.institution}{e.location ? ` · ${e.location}` : ''}</div>
                  </div>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
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
              {data.skills.map((sk, i) => <span key={i} style={s.tag}>{sk.name || sk}</span>)}
            </div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <SectionHeading label={tr('languages', isRTL)} />
            {data.languages.map((l, i) => (
              <div key={i} style={s.skillRow}>
                <span>{l.name} <span style={{ color: '#999', fontSize: sz.meta }}>({l.level})</span></span>
                <DotsRating level={l.proficiency || 3} accent={accent} />
              </div>
            ))}
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <SectionHeading label={tr('projects', isRTL)} />
            {data.projects.map((p, i) => (
              <div key={i} style={s.item}>
                <h3 style={s.role}>{p.title || p.name}</h3>
                {p.link && <div style={{ ...s.body, color: accent, fontSize: sz.meta }}>{p.link}</div>}
                {p.description && <BulletDesc text={p.description} style={ta(s.body, p.descriptionAlign)} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <SectionHeading label={tr('certificates', isRTL)} />
            {data.certificates.map((c, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={s.company}>{c.issuer}</div>}
                {c.description && <BulletDesc text={c.description} style={ta(s.body, c.descriptionAlign)} bold={c?.descriptionBold} italic={c?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <section key="awards">
            <SectionHeading label={tr('awards', isRTL)} />
            {data.awards.map((a, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{a.title || a.name}</h3>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={s.company}>{a.issuer}</div>}
                {a.description && <BulletDesc text={a.description} style={ta(s.body, a.descriptionAlign)} bold={a?.descriptionBold} italic={a?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={BREAK_ITEM}>
            <SectionHeading label={tr('interests', isRTL)} />
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{typeof item === 'string' ? item : item.name}</span>)}
            </div>
          </section>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses">
            <SectionHeading label={tr('courses', isRTL)} />
            {data.courses.map((c, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{c.name}</h3>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.institution && <div style={s.company}>{c.institution}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'organisations':
        return data.organisations?.length > 0 ? (
          <section key="organisations">
            <SectionHeading label={tr('organisations', isRTL)} />
            {data.organisations.map((o, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{o.name}</h3>
                  {o.date && <div style={s.date}>{o.date}</div>}
                </div>
                {o.role && <div style={s.company}>{o.role}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            <SectionHeading label={tr('references', isRTL)} />
            {data.references.map((r, i) => (
              <div key={i} style={s.item}>
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
              {sec.items.map((item, idx) => (
                <div key={idx} style={s.item}>
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
      {/* Header */}
      <div style={s.header}>
        {vis.photo !== false && (
          <div style={s.photoWrap}>
            <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width: '100%', height: '100%', objectFit: info.photo ? 'cover' : 'contain' }} />
          </div>
        )}
        <div style={s.headerText}>
          <h1 style={s.name}>{info.fullName || 'Your Name'}</h1>
          <p style={s.jobTitle}>{info.jobTitle || ''}</p>
          {contactParts.length > 0 && (
            <div style={s.contactStrip}>
              {contactParts.map((p, i) => (
                <span key={i} style={s.contactPill}>{p}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={s.content}>
        {sectionOrder.map(k => renderSection(k))}
      </div>
    </article>
  );
};

export default RoseElegantTemplate;
