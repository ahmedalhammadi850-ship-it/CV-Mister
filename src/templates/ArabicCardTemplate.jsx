import { resolveTheme, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';

const labels = {
  summary:       { en: 'Professional Summary', ar: 'الملخص المهني'       },
  experience:    { en: 'Work Experience',      ar: 'الخبرات المهنية'      },
  education:     { en: 'Education',           ar: 'التعليم'              },
  skills:        { en: 'Skills',              ar: 'المهارات'             },
  languages:     { en: 'Languages',           ar: 'اللغات'               },
  projects:      { en: 'Projects',            ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',        ar: 'الدورات التدريبية'    },
  interests:     { en: 'Interests',           ar: 'الاهتمامات'           },
  courses:       { en: 'Courses',             ar: 'الدورات'              },
  awards:        { en: 'Awards',              ar: 'الجوائز'              },
  organisations: { en: 'Organisations',       ar: 'المنظمات'             },
  publications:  { en: 'Publications',        ar: 'المنشورات'            },
  references:    { en: 'References',          ar: 'المراجع'              },
  contact:       { en: 'Contact',             ar: 'التواصل'              },
  present:       { en: 'Present',             ar: 'حتى الآن'             },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'certificates', 'courses', 'skills', 'languages', 'awards', 'interests'];

const SIDEBAR_SECTIONS = new Set(['contact_block', 'skills', 'languages', 'interests', 'courses', 'awards', 'certificates', 'organisations']);
const MAIN_SECTIONS    = new Set(['summary', 'experience', 'education', 'projects', 'publications', 'references']);

const BarRating = ({ level = 3, accent }) => {
    const lvl = level > 5 ? Math.round(level / 20) : level;
  if (lvl <= 0) return null;
  const filled = Math.min(Math.max(Math.round(lvl), 1), 5);
  return (
    <div style={{ display: 'flex', gap: '3pt', alignItems: 'center', marginTop: '3pt' }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ flex: 1, height: '5pt', borderRadius: '2.5pt', backgroundColor: i <= filled ? accent : '#e2e8f0' }} />
      ))}
    </div>
  );
};

const DotsRating = ({ level = 3, accent }) => {
  const lvl = level > 5 ? Math.round(level / 20) : level;
  const filled = Math.min(Math.max(Math.round(lvl), 1), 5);
  return (
    <span style={{ display: 'inline-flex', gap: '3pt', verticalAlign: 'middle' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: i <= filled ? accent : '#e2e8f0', display: 'inline-block' }} />
      ))}
    </span>
  );
};

const ArabicCardTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const accent       = theme?.primaryColor || '#2d6a8a';
  const accentLight  = accent + '15';
  const { sz, font, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = 'rtl';
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

  /* ── Sidebar (RIGHT side, RTL) ── */
  const sb = {
    wrapper: {
      width: '210px', minWidth: '210px',
      backgroundColor: theme?.sidebarColor || '#f7f9fc',
      padding: '24pt 14pt',
      boxSizing: 'border-box',
      direction: 'rtl',
      borderLeft: `3px solid ${accent}`,
    },
    photoWrap: {
      width: '76pt', height: '76pt', borderRadius: '50%',
      overflow: 'hidden', margin: '0 auto 12pt',
      border: `2.5px solid ${accent}`,
      backgroundColor: accentLight,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    initials: { fontSize: '22pt', fontWeight: '700', color: accent },
    name: { fontSize: sz.heading, fontWeight: '700', color: '#1a202c', textAlign: 'center', lineHeight: 1.3, marginBottom: '2pt' },
    jobTitle: { fontSize: sz.meta, color: accent, textAlign: 'center', marginBottom: '14pt', fontStyle: 'italic' },
    sectionCard: {
      backgroundColor: accent,
      borderRadius: '4pt',
      padding: '4pt 8pt',
      marginBottom: '8pt',
      marginTop: sectionMt,
      ...BREAK_HEADING,
    },
    sectionLabel: {
      fontSize: '8.5pt', fontWeight: '700', color: '#fff',
      textAlign: 'right', letterSpacing: '0.05em',
    },
    contactRow: {
      display: 'flex', gap: '6pt', marginBottom: '7pt',
      fontSize: sz.meta, color: '#4a5568',
      alignItems: 'flex-start', flexDirection: 'row-reverse',
    },
    icon: { width: '14pt', textAlign: 'center', flexShrink: 0, color: accent, fontSize: '9pt', marginTop: '1pt' },
    skillRow: { marginBottom: '8pt' },
    skillName: { fontSize: sz.meta, color: '#2d3748', textAlign: 'right', marginBottom: '2pt' },
    langRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row-reverse', marginBottom: '6pt' },
    bullet: { fontSize: sz.meta, color: '#4a5568', marginBottom: '4pt', textAlign: 'right' },
    tag: { display: 'inline-block', background: accentLight, border: `1px solid ${accent}44`, borderRadius: '3pt', padding: '2pt 6pt', fontSize: sz.meta, color: accent, marginLeft: '4pt', marginBottom: '4pt' },
  };

  /* ── Main (LEFT side, RTL) ── */
  const mn = {
    wrapper: { flex: 1, padding: '24pt 20pt', boxSizing: 'border-box', direction: 'rtl', backgroundColor: theme?.bgColor || '#fff' },
    nameBlock: {
      textAlign: 'right',
      paddingBottom: '12pt',
      borderBottom: `2px solid ${accent}`,
      marginBottom: '4pt',
    },
    name: { fontSize: sz.name, fontWeight: '700', color: '#1a202c', lineHeight: 1.2, marginBottom: '3pt' },
    jobTitle: { fontSize: sz.body, color: accent, fontStyle: 'italic' },
    sectionCard: {
      backgroundColor: accent,
      borderRadius: '4pt',
      padding: '4pt 10pt',
      marginBottom: '8pt',
      marginTop: sectionMt,
      ...BREAK_HEADING,
    },
    sectionLabel: {
      fontSize: sz.heading, fontWeight: '700', color: '#fff',
      textAlign: 'right',
    },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8pt', flexDirection: 'row-reverse' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#1a202c', flex: 1, textAlign: 'right' },
    date: { fontSize: sz.meta, color: '#718096', whiteSpace: 'nowrap', flexShrink: 0 },
    company: { fontSize: sz.meta, color: accent, fontWeight: '600', marginBottom: '3pt', textAlign: 'right' },
    body: { fontSize: sz.body, color: '#4a5568', lineHeight, whiteSpace: 'pre-line', textAlign: 'right' },
    item: { marginBottom: '12pt', ...BREAK_ITEM },
    bullet: { fontSize: sz.body, color: '#4a5568', marginBottom: '4pt', textAlign: 'right' },
  };

  const SidebarSection = ({ label, children }) => (
    <div style={BREAK_ITEM}>
      <div style={sb.sectionCard}>
        <div style={sb.sectionLabel}>{label}</div>
      </div>
      {children}
    </div>
  );

  const MainSection = ({ label, children }) => (
    <div>
      <div style={mn.sectionCard}>
        <div style={mn.sectionLabel}>{label}</div>
      </div>
      {children}
    </div>
  );

  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'skills':
        return data.skills?.length > 0 ? (
          <SidebarSection key="skills" label={tr('skills', true)}>
            {data.skills.map((sk, i) => (
              <div key={i} style={sb.skillRow}>
                <div style={sb.skillName}>{sk.name || sk}</div>
                <BarRating level={sk.level || 0} accent={accent} />
              </div>
            ))}
          </SidebarSection>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <SidebarSection key="languages" label={tr('languages', true)}>
            {data.languages.map((l, i) => (
              <div key={i} style={sb.langRow}>
                <DotsRating level={l.proficiency || 3} accent={accent} />
                <span style={{ fontSize: sz.meta, color: '#2d3748' }}>{l.name}</span>
              </div>
            ))}
          </SidebarSection>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <SidebarSection key="interests" label={tr('interests', true)}>
            <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row-reverse' }}>
              {data.interests.map((item, i) => <span key={i} style={sb.tag}>{typeof item === 'string' ? item : item.name}</span>)}
            </div>
          </SidebarSection>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <SidebarSection key="certificates" label={tr('certificates', true)}>
            {data.certificates.map((c, i) => (
              <div key={i} style={sb.bullet}>• {c.name || c}</div>
            ))}
          </SidebarSection>
        ) : null;

      case 'courses':
        return data.courses?.length > 0 ? (
          <SidebarSection key="courses" label={tr('courses', true)}>
            {data.courses.map((c, i) => (
              <div key={i} style={sb.bullet}>• {c.name || c}</div>
            ))}
          </SidebarSection>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <SidebarSection key="awards" label={tr('awards', true)}>
            {data.awards.map((a, i) => (
              <div key={i} style={{ marginBottom: '6pt' }}>
                <div style={{ fontSize: sz.meta, fontWeight: '600', color: '#2d3748', textAlign: 'right' }}>{a.title || a.name || a}</div>
                {a.issuer && <div style={{ fontSize: '8pt', color: '#718096', textAlign: 'right' }}>{a.issuer}</div>}
              </div>
            ))}
          </SidebarSection>
        ) : null;

      case 'organisations':
        return data.organisations?.length > 0 ? (
          <SidebarSection key="organisations" label={tr('organisations', true)}>
            {data.organisations.map((o, i) => (
              <div key={i} style={sb.bullet}>• {o.name || o}</div>
            ))}
          </SidebarSection>
        ) : null;

      default: return null;
    }
  };

  const renderMain = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return info.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <MainSection label={tr('summary', true)}>
              <div style={mn.body}>{info.summary}</div>
            </MainSection>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <MainSection label={tr('experience', true)}>
              {data.experience.map((e, i) => (
                <div key={i} style={mn.item}>
                  <div style={mn.row}>
                    <div style={mn.role}>{e.jobTitle}</div>
                    <div style={mn.date}>{e.startDate} – {e.current ? tr('present', true) : e.endDate}</div>
                  </div>
                  <div style={mn.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                  {e.description && <div style={mn.body}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>}
                </div>
              ))}
            </MainSection>
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <MainSection label={tr('education', true)}>
              {data.education.map((e, i) => (
                <div key={i} style={mn.item}>
                  <div style={mn.row}>
                    <div style={mn.role}>{e.degree}</div>
                    <div style={mn.date}>{e.startDate} – {e.endDate}</div>
                  </div>
                  <div style={mn.company}>{e.institution}{e.location ? ` · ${e.location}` : ''}</div>
                  {e.description && <div style={mn.body}><span style={{fontWeight:e?.descriptionBold?700:undefined,fontStyle:e?.descriptionItalic?"italic":undefined}}>{e.description}</span></div>}
                </div>
              ))}
            </MainSection>
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <MainSection label={tr('projects', true)}>
              {data.projects.map((p, i) => (
                <div key={i} style={mn.item}>
                  <div style={mn.role}>{p.title || p.name}</div>
                  {p.link && <div style={{ fontSize: sz.meta, color: accent, textAlign: 'right' }}>{p.link}</div>}
                  {p.description && <div style={mn.body}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>}
                </div>
              ))}
            </MainSection>
          </section>
        ) : null;

      case 'publications':
        return data.publications?.length > 0 ? (
          <section key="publications">
            <MainSection label={tr('publications', true)}>
              {data.publications.map((p, i) => (
                <div key={i} style={mn.item}>
                  <div style={mn.row}>
                    <div style={mn.role}>{p.title}</div>
                    {p.date && <div style={mn.date}>{p.date}</div>}
                  </div>
                  {p.publisher && <div style={mn.company}>{p.publisher}</div>}
                  {p.description && <div style={mn.body}><span style={{fontWeight:p?.descriptionBold?700:undefined,fontStyle:p?.descriptionItalic?"italic":undefined}}>{p.description}</span></div>}
                </div>
              ))}
            </MainSection>
          </section>
        ) : null;

      case 'references':
        return data.references?.length > 0 ? (
          <section key="references">
            <MainSection label={tr('references', true)}>
              {data.references.map((r, i) => (
                <div key={i} style={mn.item}>
                  <div style={mn.role}>{r.name}</div>
                  {(r.title || r.company) && <div style={mn.company}>{[r.title, r.company].filter(Boolean).join(' — ')}</div>}
                  {(r.email || r.phone) && <div style={mn.body}>{[r.email, r.phone].filter(Boolean).join(' | ')}</div>}
                </div>
              ))}
            </MainSection>
          </section>
        ) : null;

      default:
        if (key.startsWith('csec-') && data.customSections) {
          const sec = data.customSections.find(s => s.id === key);
          if (!sec || !sec.items?.length) return null;
          return (
            <div key={key}>
              <MainSection label={sec.title}>
                {sec.items.map((item, idx) => (
                  <div key={idx} style={mn.item}>
                    {item.title && <div style={mn.role}>{item.title}</div>}
                    {item.subtitle && <div style={mn.company}>{item.subtitle}</div>}
                    {item.description && <div style={mn.body}><span style={{fontWeight:item?.descriptionBold?700:undefined,fontStyle:item?.descriptionItalic?"italic":undefined}}>{item.description}</span></div>}
                  </div>
                ))}
              </MainSection>
            </div>
          );
        }
        return null;
    }
  };

  const sideKeys = sectionOrder.filter(k => SIDEBAR_SECTIONS.has(k));
  const mainKeys = sectionOrder.filter(k => MAIN_SECTIONS.has(k));
  const initials = (info.fullName || '').split(' ').map(w => w[0]).slice(0, 2).join('');

  return (
    <div style={{ fontFamily: font, fontSize: sz.body, color: '#1a202c', backgroundColor: '#fff', width: '794px', minHeight: '1122px', boxSizing: 'border-box', display: 'flex', flexDirection: 'row-reverse', direction: 'rtl' }}>
      {/* Sidebar (RIGHT in RTL) */}
      <div style={sb.wrapper}>
        {vis.photo !== false && (
          <div style={sb.photoWrap}>
            <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width: '100%', height: '100%', objectFit: info.photo ? 'cover' : 'contain' }} />
          </div>
        )}
        <div style={sb.name}>{info.fullName || 'الاسم الكامل'}</div>
        <div style={sb.jobTitle}>{info.jobTitle || ''}</div>

        <SidebarSection label={tr('contact', true)}>
          {contactItems.map((row, i) => (
            <div key={i} style={sb.contactRow}>
              <span style={sb.icon}>{row.icon}</span>
              <span style={{ wordBreak: 'break-all', lineHeight: 1.3 }}>{row.text}</span>
            </div>
          ))}
        </SidebarSection>

        {sideKeys.map(k => renderSidebar(k))}
      </div>

      {/* Main (LEFT in RTL) */}
      <div style={mn.wrapper}>
        {mainKeys.map(k => renderMain(k))}
      </div>
    </div>
  );
};

export default ArabicCardTemplate;
