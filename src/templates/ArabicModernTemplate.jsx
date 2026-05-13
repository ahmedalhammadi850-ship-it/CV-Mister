import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

const labels = {
  summary:       { en: 'Profile',            ar: 'نبذة تعريفية'         },
  experience:    { en: 'Work Experience',     ar: 'الخبرات المهنية'      },
  education:     { en: 'Education',          ar: 'التعليم'              },
  skills:        { en: 'Skills',             ar: 'المهارات'             },
  languages:     { en: 'Languages',          ar: 'اللغات'               },
  projects:      { en: 'Projects',           ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',       ar: 'الدورات التدريبية'    },
  interests:     { en: 'Interests',          ar: 'الاهتمامات'           },
  courses:       { en: 'Courses',            ar: 'الدورات'              },
  awards:        { en: 'Awards',             ar: 'الجوائز'              },
  organisations: { en: 'Organisations',      ar: 'المنظمات'             },
  publications:  { en: 'Publications',       ar: 'المنشورات'            },
  references:    { en: 'References',         ar: 'المراجع'              },
  present:       { en: 'Present',            ar: 'حتى الآن'             },
};
const tr = (key, isRTL) => labels[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const DEFAULT_ORDER = ['summary', 'experience', 'skills', 'education', 'certificates', 'courses', 'languages', 'awards', 'interests'];

const BarRating = ({ level = 3, accent }) => {
  const filled = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <div style={{ display: 'flex', gap: '3pt', alignItems: 'center', marginTop: '2pt' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ flex: 1, height: '4pt', borderRadius: '2pt', backgroundColor: i <= filled ? accent : '#e5e7eb' }} />
      ))}
    </div>
  );
};

const DotsRating = ({ level = 3, accent }) => {
  const filled = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <span style={{ display: 'inline-flex', gap: '3pt', verticalAlign: 'middle' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: i <= filled ? accent : '#e5e7eb', display: 'inline-block' }} />
      ))}
    </span>
  );
};

const ArabicModernTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent       = theme?.primaryColor || '#2a7d6e';
  const accentLight  = accent + '18';
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = 'rtl';
  const show = (key) => visibleSections[key] !== false;

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const contactItems = [
    vis.email     !== false && info.email     && { icon: '✉', text: info.email },
    vis.phone     !== false && info.phone     && { icon: '✆', text: info.phone },
    vis.location  !== false && info.location  && { icon: '⌖', text: info.location },
    vis.linkedin  !== false && info.linkedin  && { icon: 'in', text: info.linkedin },
    vis.portfolio !== false && info.portfolio && { icon: '⬡', text: info.portfolio },
  ].filter(Boolean);

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#fff',
      width: '794px', minHeight: '1122px', boxSizing: 'border-box', direction: dir,
    },
    header: {
      backgroundColor: accent,
      padding: '24pt 32pt',
      direction: 'rtl',
    },
    headerTop: {
      display: 'flex', alignItems: 'center', gap: '18pt',
      flexDirection: 'row-reverse', marginBottom: '14pt',
    },
    photoWrap: {
      width: '78pt', height: '78pt', borderRadius: '50%',
      overflow: 'hidden', flexShrink: 0,
      border: '2.5px solid rgba(255,255,255,0.5)',
      backgroundColor: 'rgba(255,255,255,0.15)',
    },
    nameBlock: { flex: 1, textAlign: 'right' },
    name: { fontSize: sz.name, fontWeight: '700', color: '#fff', lineHeight: 1.2, marginBottom: '3pt' },
    jobBox: {
      display: 'inline-block',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '4pt', padding: '3pt 10pt',
      fontSize: sz.meta, color: '#fff', fontWeight: '600',
    },
    contactStrip: {
      borderTop: '1px solid rgba(255,255,255,0.25)',
      paddingTop: '10pt',
      display: 'flex', flexWrap: 'wrap', gap: '12pt',
      flexDirection: 'row-reverse',
    },
    contactItem: {
      display: 'flex', alignItems: 'center', gap: '5pt',
      fontSize: sz.meta, color: 'rgba(255,255,255,0.9)',
      flexDirection: 'row-reverse',
    },
    contactIcon: { fontSize: '9pt', opacity: 0.7 },
    body: { padding: `16pt 28pt`, direction: 'rtl' },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: '#fff',
      backgroundColor: accent,
      padding: '4pt 10pt',
      marginTop: sectionMt, marginBottom: '8pt',
      borderRadius: '3pt',
      textAlign: 'right',
      ...BREAK_HEADING,
    },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8pt', flexDirection: 'row-reverse' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1, textAlign: 'right' },
    date: {
      fontSize: sz.meta, color: accent, whiteSpace: 'nowrap', flexShrink: 0,
      fontWeight: '600',
    },
    company: { fontSize: sz.meta, color: '#555', marginBottom: '3pt', textAlign: 'right' },
    bodyText: { fontSize: sz.body, color: '#444', lineHeight, whiteSpace: 'pre-line', textAlign: 'right' },
    item: { marginBottom: '12pt', ...BREAK_ITEM },
    skillItem: { marginBottom: '8pt' },
    skillRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse', marginBottom: '3pt' },
    skillName: { fontSize: sz.body, color: '#222', textAlign: 'right' },
    langRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse', marginBottom: '6pt', fontSize: sz.body },
    bullet: { fontSize: sz.body, color: '#444', marginBottom: '4pt', textAlign: 'right' },
    tag: { display: 'inline-block', background: accentLight, border: `1px solid ${accent}44`, borderRadius: '3pt', padding: '2pt 7pt', fontSize: sz.meta, color: accent, marginLeft: '4pt', marginBottom: '4pt' },
  };

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return info.summary ? (
          <div key="summary" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('summary', true)}</div>
            <div style={s.bodyText}>{info.summary}</div>
          </div>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <div key="experience">
            <div style={s.heading}>{tr('experience', true)}</div>
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <div style={s.role}>{e.jobTitle}</div>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', true) : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                {e.description && <div style={s.bodyText}>{e.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <div key="education">
            <div style={s.heading}>{tr('education', true)}</div>
            {data.education.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <div style={s.role}>{e.degree}</div>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={s.company}>{e.institution}{e.location ? ` · ${e.location}` : ''}</div>
                {e.description && <div style={s.bodyText}>{e.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'skills':
        return data.skills?.length > 0 ? (
          <div key="skills" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('skills', true)}</div>
            {data.skills.map((sk, i) => (
              <div key={i} style={s.skillItem}>
                <div style={s.skillRow}>
                  <span style={s.skillName}>{sk.name || sk}</span>
                </div>
                <BarRating level={sk.level || 3} accent={accent} />
              </div>
            ))}
          </div>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('languages', true)}</div>
            {data.languages.map((l, i) => (
              <div key={i} style={s.langRow}>
                <DotsRating level={l.proficiency || 3} accent={accent} />
                <span>{l.name}</span>
              </div>
            ))}
          </div>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <div key="certificates">
            <div style={s.heading}>{tr('certificates', true)}</div>
            {data.certificates.map((c, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <div style={s.role}>{c.name}</div>
                  {c.date && <div style={s.date}>{c.date}</div>}
                </div>
                {c.issuer && <div style={s.company}>{c.issuer}</div>}
                {c.description && <div style={s.bodyText}>{c.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <div key="courses">
            <div style={s.heading}>{tr('courses', true)}</div>
            {data.courses.map((c, i) => (
              <div key={i} style={s.item}>
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
            <div style={s.heading}>{tr('awards', true)}</div>
            {data.awards.map((a, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <div style={s.role}>{a.title || a.name}</div>
                  {a.date && <div style={s.date}>{a.date}</div>}
                </div>
                {a.issuer && <div style={s.company}>{a.issuer}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <div key="interests" style={BREAK_ITEM}>
            <div style={s.heading}>{tr('interests', true)}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
              {data.interests.map((item, i) => <span key={i} style={s.tag}>{item.name || item}</span>)}
            </div>
          </div>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <div key="projects">
            <div style={s.heading}>{tr('projects', true)}</div>
            {data.projects.map((p, i) => (
              <div key={i} style={s.item}>
                <div style={s.role}>{p.title || p.name}</div>
                {p.link && <div style={{ fontSize: sz.meta, color: accent, textAlign: 'right' }}>{p.link}</div>}
                {p.description && <div style={s.bodyText}>{p.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <div key="references">
            <div style={s.heading}>{tr('references', true)}</div>
            {data.references.map((r, i) => (
              <div key={i} style={s.item}>
                <div style={s.role}>{r.name}</div>
                {(r.title || r.company) && <div style={s.company}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
                {(r.email || r.phone) && <div style={s.bodyText}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
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
              {sec.items.map((item, idx) => (
                <div key={idx} style={s.item}>
                  {item.title && <div style={s.role}>{item.title}</div>}
                  {item.subtitle && <div style={s.company}>{item.subtitle}</div>}
                  {item.description && <div style={s.bodyText}>{item.description}</div>}
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
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerTop}>
          {vis.photo !== false && info.photo && (
            <div style={s.photoWrap}>
              <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={s.nameBlock}>
            <div style={s.name}>{info.fullName || 'الاسم الكامل'}</div>
            {info.jobTitle && <div style={s.jobBox}>{info.jobTitle}</div>}
          </div>
        </div>
        {contactItems.length > 0 && (
          <div style={s.contactStrip}>
            {contactItems.map((item, i) => (
              <div key={i} style={s.contactItem}>
                <span style={s.contactIcon}>{item.icon}</span>
                <span style={{ wordBreak: 'break-all' }}>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={s.body}>
        {sectionOrder.map(k => renderSection(k))}
      </div>
    </div>
  );
};

export default ArabicModernTemplate;
