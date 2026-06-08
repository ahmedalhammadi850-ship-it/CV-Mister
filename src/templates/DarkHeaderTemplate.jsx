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
  contact:       { en: 'Contact',            ar: 'التواصل'              },
  present:       { en: 'Present',            ar: 'حتى الآن'             },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'languages', 'projects', 'certificates', 'awards'];

const SIDEBAR_SECTIONS = new Set(['summary', 'skills', 'languages', 'interests', 'certificates', 'courses', 'awards', 'organisations']);
const MAIN_SECTIONS    = new Set(['experience', 'education', 'projects', 'publications', 'references']);

const DotsRating = ({ level = 3, accent }) => {
    const lvl = level > 5 ? Math.round(level / 20) : level;
  if (lvl <= 0) return null;
  const filled = Math.min(Math.max(Math.round(lvl), 1), 5);
  return (
    <span style={{ display: 'inline-flex', gap: '3pt', verticalAlign: 'middle' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: i <= filled ? accent : 'rgba(255,255,255,0.25)', display: 'inline-block' }} />
      ))}
    </span>
  );
};

const DarkHeaderTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const accent       = theme?.primaryColor || '#4a1f6e';
  const accentLight  = accent + 'cc';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const { sz, font, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const contactItems = [
    vis.email     !== false && info.email     && { icon: '✉', text: info.email },
    vis.phone     !== false && info.phone     && { icon: '✆', text: info.phone },
    vis.location  !== false && info.location  && { icon: '⌖', text: info.location },
    vis.linkedin  !== false && info.linkedin  && { icon: 'in', text: info.linkedin },
    vis.portfolio !== false && info.portfolio && { icon: '⬡', text: info.portfolio },
    vis.github    !== false && info.github    && { icon: 'gh', text: info.github },
  ].filter(Boolean);

  const header = {
    wrapper: {
      backgroundColor: accent,
      padding: '26pt 32pt',
      direction: dir,
    },
    top: {
      display: 'flex',
      alignItems: 'center',
      gap: '18pt',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      marginBottom: '14pt',
    },
    photoWrap: {
      width: '72pt', height: '72pt', borderRadius: '50%',
      overflow: 'hidden', flexShrink: 0,
      border: '2.5px solid rgba(255,255,255,0.5)',
    },
    textBlock: { flex: 1 },
    name: { fontSize: sz.name, fontWeight: '700', color: '#fff', lineHeight: 1.2, marginBottom: '3pt' },
    jobTitle: { fontSize: sz.body, color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' },
    contactRow: {
      display: 'flex', flexWrap: 'wrap', gap: '14pt',
      borderTop: '1px solid rgba(255,255,255,0.2)',
      paddingTop: '10pt',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    contactItem: {
      display: 'flex', alignItems: 'center', gap: '5pt',
      fontSize: sz.meta, color: 'rgba(255,255,255,0.85)',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    contactIcon: { fontSize: '9pt', opacity: 0.7 },
  };

  const sb = {
    wrapper: {
      width: '220px', minWidth: '220px',
      backgroundColor: '#f5f3f8',
      padding: '22pt 16pt',
      boxSizing: 'border-box',
      direction: dir,
      borderRight: isRTL ? 'none' : '1px solid #e8e0f0',
      borderLeft: isRTL ? '1px solid #e8e0f0' : 'none',
    },
    sectionLabel: {
      fontSize: '8pt', fontWeight: '700', color: accent,
      textTransform: 'uppercase', letterSpacing: '0.12em',
      marginBottom: '8pt', marginTop: sectionMt,
      borderBottom: `1.5px solid ${accent}55`,
      paddingBottom: '3pt',
      textAlign: headingAlign,
      ...BREAK_HEADING,
    },
    body: { fontSize: sz.body, color: '#3d3452', lineHeight, whiteSpace: 'pre-line' },
    skillRow: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      marginBottom: '6pt', fontSize: sz.meta, color: '#3d3452',
      flexDirection: isRTL ? 'row-reverse' : 'row', ...BREAK_ITEM,
    },
    tag: {
      display: 'inline-block',
      background: accent + '15',
      border: `1px solid ${accent}33`,
      borderRadius: '3pt', padding: '2pt 6pt',
      fontSize: sz.meta, color: accent,
      marginRight: '4pt', marginBottom: '4pt',
    },
  };

  const mn = {
    wrapper: { flex: 1, padding: '22pt 24pt', boxSizing: 'border-box', direction: dir, backgroundColor: '#fff' },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: accent,
      marginTop: sectionMt, marginBottom: '8pt',
      borderBottom: `2px solid ${accent}44`,
      paddingBottom: '3pt',
      textAlign: headingAlign,
      ...BREAK_HEADING,
    },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8pt', flexDirection: isRTL ? 'row-reverse' : 'row' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#1a1a2e', flex: 1 },
    date: {
      fontSize: sz.meta, color: '#fff', whiteSpace: 'nowrap', flexShrink: 0,
      background: accent, padding: '1pt 7pt', borderRadius: '10pt',
    },
    company: { fontSize: sz.meta, color: accent, fontWeight: '600', marginBottom: '3pt' },
    body: { fontSize: sz.body, color: '#444', lineHeight, whiteSpace: 'pre-line' },
    item: { marginBottom: '12pt', ...BREAK_ITEM },
  };

  const DotsForSidebar = ({ level = 3 }) => {
    const filled = Math.min(Math.max(Math.round(level), 1), 5);
    return (
      <span style={{ display: 'inline-flex', gap: '3pt', verticalAlign: 'middle' }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: i <= filled ? accent : '#d4c9e8', display: 'inline-block' }} />
        ))}
      </span>
    );
  };

  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return info.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('summary', isRTL)}</div>
            <div style={sb.body}>{info.summary}</div>
          </section>
        ) : null;

      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('skills', isRTL)}</div>
            {data.skills.map((sk, i) => (
              <div key={i} style={sb.skillRow}>
                <span>{sk.name || sk}</span>
                <DotsForSidebar level={sk.level || 0} />
              </div>
            ))}
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('languages', isRTL)}</div>
            {data.languages.map((l, i) => (
              <div key={i} style={sb.skillRow}>
                <span>{l.name}</span>
                <DotsForSidebar level={l.proficiency || 3} />
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('interests', isRTL)}</div>
            <div style={{ fontSize: sz.meta, color: '#3d3452', lineHeight: 1.6 }}>
              {data.interests.map(i => typeof i === 'string' ? i : i.name).join('  •  ')}
            </div>
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('certificates', isRTL)}</div>
            {data.certificates.map((c, i) => (
              <div key={i} style={{ fontSize: sz.meta, color: '#3d3452', marginBottom: '4pt' }}>• {c.name || c}</div>
            ))}
          </section>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <section key="awards" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('awards', isRTL)}</div>
            {data.awards.map((a, i) => (
              <div key={i} style={{ marginBottom: '6pt' }}>
                <div style={{ fontSize: sz.meta, fontWeight: '600', color: '#3d3452' }}>{a.title || a.name || a}</div>
                {a.issuer && <div style={{ fontSize: '8pt', color: '#7c6b9a' }}>{a.issuer}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <section key="courses" style={BREAK_ITEM}>
            <div style={sb.sectionLabel}>{tr('courses', isRTL)}</div>
            {data.courses.map((c, i) => (
              <div key={i} style={{ fontSize: sz.meta, color: '#3d3452', marginBottom: '4pt' }}>• {c.name || c}</div>
            ))}
          </section>
        ) : null;

      default: return null;
    }
  };

  const renderMain = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <div style={mn.heading}>{tr('experience', isRTL)}</div>
            {data.experience.map((e, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.row}>
                  <div>
                    <div style={mn.role}>{e.jobTitle}</div>
                    <div style={mn.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                  </div>
                  <div style={mn.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                {e.description && <BulletDesc text={e.description} style={mn.body} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <div style={mn.heading}>{tr('education', isRTL)}</div>
            {data.education.map((e, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.row}>
                  <div>
                    <div style={mn.role}>{e.degree}</div>
                    <div style={mn.company}>{e.institution}{e.location ? ` · ${e.location}` : ''}</div>
                  </div>
                  <div style={mn.date}>{e.startDate} – {e.endDate}</div>
                </div>
                {e.description && <BulletDesc text={e.description} style={mn.body} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <div style={mn.heading}>{tr('projects', isRTL)}</div>
            {data.projects.map((p, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.role}>{p.title || p.name}</div>
                {p.link && <div style={{ fontSize: sz.meta, color: accent, marginBottom: '2pt' }}>{p.link}</div>}
                {p.description && <BulletDesc text={p.description} style={mn.body} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'publications':
        return data.publications?.length > 0 ? (
          <section key="publications">
            <div style={mn.heading}>{tr('publications', isRTL)}</div>
            {data.publications.map((p, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.row}>
                  <div style={mn.role}>{p.title}</div>
                  {p.date && <div style={mn.date}>{p.date}</div>}
                </div>
                {p.publisher && <div style={mn.company}>{p.publisher}</div>}
                {p.description && <BulletDesc text={p.description} style={mn.body} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            <div style={mn.heading}>{tr('references', isRTL)}</div>
            {data.references.map((r, i) => (
              <div key={i} style={mn.item}>
                <div style={mn.role}>{r.name}</div>
                {(r.title || r.company) && <div style={mn.company}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
                {(r.email || r.phone) && <div style={mn.body}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
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
              <div style={mn.heading}>{sec.title}</div>
              {sec.items.map((item, idx) => (
                <div key={idx} style={mn.item}>
                  {item.title && <div style={mn.role}>{item.title}</div>}
                  {item.subtitle && <div style={mn.company}>{item.subtitle}</div>}
                  {item.description && <BulletDesc text={item.description} style={mn.body} bold={item?.descriptionBold} italic={item?.descriptionItalic} />}
                </div>
              ))}
            </div>
          );
        }
        return null;
    }
  };

  const sideKeys = sectionOrder.filter(k => SIDEBAR_SECTIONS.has(k));
  const mainKeys = sectionOrder.filter(k => MAIN_SECTIONS.has(k));

  return (
    <div style={{ fontFamily: font, fontSize: sz.body, color: '#2c2c2c', backgroundColor: '#fff', width: '794px', minHeight: '1122px', boxSizing: 'border-box', direction: dir }}>
      {/* Full-width dark header */}
      <div style={header.wrapper}>
        <div style={header.top}>
          {vis.photo !== false && (
            <div style={header.photoWrap}>
              <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width: '100%', height: '100%', objectFit: info.photo ? 'cover' : 'contain' }} />
            </div>
          )}
          <div style={header.textBlock}>
            <div style={header.name}>{info.fullName || 'Your Name'}</div>
            <div style={header.jobTitle}>{info.jobTitle || ''}</div>
          </div>
        </div>
        {contactItems.length > 0 && (
          <div style={header.contactRow}>
            {contactItems.map((item, i) => (
              <div key={i} style={header.contactItem}>
                <span style={header.contactIcon}>{item.icon}</span>
                <span style={{ wordBreak: 'break-all' }}>{item.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Two-column body */}
      <div style={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        {/* Sidebar */}
        <div style={sb.wrapper}>
          {sideKeys.map(k => renderSidebar(k))}
        </div>

        {/* Main */}
        <div style={mn.wrapper}>
          {mainKeys.map(k => renderMain(k))}
        </div>
      </div>
    </div>
  );
};

export default DarkHeaderTemplate;
