import { resolveTheme, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';
import BulletDesc from './BulletDesc';

const labels = {
  summary:       { en: 'Summary',             ar: 'الملخص'               },
  experience:    { en: 'Work Experience',      ar: 'الخبرة العملية'       },
  education:     { en: 'Education',           ar: 'التعليم'              },
  skills:        { en: 'Skills',              ar: 'المهارات'             },
  languages:     { en: 'Languages',           ar: 'اللغات'               },
  projects:      { en: 'Projects',            ar: 'المشاريع'             },
  certificates:  { en: 'Certificates',        ar: 'الشهادات'             },
  interests:     { en: 'Interests',           ar: 'الاهتمامات'           },
  courses:       { en: 'Courses',             ar: 'الدورات'              },
  awards:        { en: 'Awards',              ar: 'الجوائز'              },
  organisations: { en: 'Organisations',       ar: 'المنظمات'             },
  publications:  { en: 'Publications',        ar: 'المنشورات'            },
  references:    { en: 'References',          ar: 'المراجع'              },
  profile:       { en: 'Profile',             ar: 'نبذة تعريفية'         },
  present:       { en: 'Present',             ar: 'حتى الآن'             },
};

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages', 'certificates', 'awards'];

const SIDEBAR_SECTIONS = new Set(['skills', 'languages', 'interests', 'certificates', 'courses', 'awards', 'organisations']);
const MAIN_SECTIONS    = new Set(['summary', 'experience', 'education', 'projects', 'publications', 'references']);

const Dots = ({ level = 3, accent }) => {
  const filled = Math.min(Math.max(Math.round(level), 1), 5);
  return (
    <span style={{ display: 'inline-flex', gap: '3pt', marginLeft: '4pt' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: i <= filled ? '#fff' : 'rgba(255,255,255,0.3)', display: 'inline-block' }} />
      ))}
    </span>
  );
};

const PhoneIcon = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M3 1h3l1.5 3.5-2 1.2c.8 1.6 2.3 3.1 3.8 3.8l1.2-2L14 9v3c0 1.1-.9 1-2 .7C5 11 1 6 1 3c-.3-1.1-.1-2 1-2z" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" fill="none" />
  </svg>
);
const EmailIcon = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <rect x="1" y="2.5" width="12" height="9" rx="1" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
    <path d="M1 3.5l6 4.5 6-4.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
  </svg>
);
const LocationIcon = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <path d="M7 1a4 4 0 0 1 4 4c0 3-4 8-4 8S3 8 3 5a4 4 0 0 1 4-4z" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
    <circle cx="7" cy="5" r="1.5" fill="rgba(255,255,255,0.75)" />
  </svg>
);
const LinkedinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <rect x="1" y="1" width="12" height="12" rx="2" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
    <path d="M4 6v4M4 4.5v.5M7 10V8a1.5 1.5 0 0 1 3 0v2M7 6v4" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const GlobeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="7" cy="7" r="5.5" stroke="rgba(255,255,255,0.75)" strokeWidth="1.2" />
    <path d="M7 1.5c-1.5 1.5-2.5 3.3-2.5 5.5S5.5 11 7 12.5M7 1.5c1.5 1.5 2.5 3.3 2.5 5.5S8.5 11 7 12.5M1.5 7h11" stroke="rgba(255,255,255,0.75)" strokeWidth="1.1" />
  </svg>
);
const GitHubIcon = () => <svg width="11" height="11" viewBox="0 0 16 16" fill="rgba(255,255,255,0.7)"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>;
const CONTACT_ICON_MAP = { phone: <PhoneIcon />, email: <EmailIcon />, location: <LocationIcon />, linkedin: <LinkedinIcon />, portfolio: <GlobeIcon />, github: <GitHubIcon /> };

const AtlanticBlueTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const accent       = theme?.primaryColor || '#1e3d6e';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || (isRTL ? 'right' : 'left');
  const { sz, font, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;
  const tr = (key, rtl) => sectionNames?.[key] || (labels[key]?.[rtl ? 'ar' : 'en'] ?? key);

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const contactItems = [
    vis.phone     !== false && info.phone     && { iconKey: 'phone',     text: info.phone },
    vis.email     !== false && info.email     && { iconKey: 'email',     text: info.email },
    vis.location  !== false && info.location  && { iconKey: 'location',  text: info.location },
    vis.linkedin  !== false && info.linkedin  && { iconKey: 'linkedin',  text: info.linkedin },
    vis.portfolio !== false && info.portfolio && { iconKey: 'portfolio', text: info.portfolio },
    vis.github    !== false && info.github    && { iconKey: 'github',    text: info.github    },
  ].filter(Boolean);

  const sb = {
    wrapper: {
      width: '240px', minWidth: '240px',
      backgroundColor: theme?.sidebarColor || accent,
      padding: '32pt 18pt',
      boxSizing: 'border-box',
      direction: dir,
      color: '#fff',
    },
    name: { fontSize: sz.name, fontWeight: '700', color: '#fff', marginBottom: '3pt', lineHeight: 1.2, textAlign: headerAlign },
    jobTitle: { fontSize: sz.meta, color: 'rgba(255,255,255,0.72)', marginBottom: '20pt', fontStyle: 'italic', textAlign: headerAlign },
    divider: { borderTop: '1px solid rgba(255,255,255,0.25)', margin: '14pt 0 10pt' },
    sectionLabel: {
      fontSize: '8pt', fontWeight: '700', color: 'rgba(255,255,255,0.5)',
      textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '10pt',
    },
    contactRow: {
      display: 'flex', gap: '7pt', marginBottom: '7pt',
      fontSize: sz.meta, color: 'rgba(255,255,255,0.85)',
      alignItems: 'flex-start',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    icon: { width: '14pt', textAlign: 'center', flexShrink: 0, fontSize: '9pt', marginTop: '1pt' },
    skillRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7pt', fontSize: sz.meta, color: '#fff', flexDirection: isRTL ? 'row-reverse' : 'row', ...BREAK_ITEM },
    tag: { display: 'inline-block', background: 'rgba(255,255,255,0.15)', borderRadius: '3pt', padding: '2pt 7pt', fontSize: sz.meta, color: '#fff', marginRight: '4pt', marginBottom: '4pt' },
  };

  const mn = {
    wrapper: { flex: 1, padding: '32pt 28pt 28pt 24pt', boxSizing: 'border-box', direction: dir, backgroundColor: theme?.bgColor || '#ffffff' },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: accent,
      textTransform: 'uppercase', letterSpacing: '0.08em',
      marginTop: sectionMt, marginBottom: '8pt',
      borderBottom: `2px solid ${accent}`, paddingBottom: '3pt',
      textAlign: headingAlign,
      ...BREAK_HEADING,
    },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8pt', flexDirection: isRTL ? 'row-reverse' : 'row' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1 },
    date: { fontSize: sz.meta, color: '#666', whiteSpace: 'nowrap', flexShrink: 0, background: accent + '14', padding: '1pt 6pt', borderRadius: '3pt' },
    company: { fontSize: sz.meta, color: accent, fontWeight: '600', marginBottom: '4pt' },
    body: { fontSize: sz.body, color: '#333', lineHeight, whiteSpace: 'pre-line' },
    item: { marginBottom: '12pt', ...BREAK_ITEM },
  };

  const renderSidebar = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills">
            <div style={sb.divider} />
            <div style={sb.sectionLabel}>{tr('skills', isRTL)}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {data.skills.map((sk, i) => (
                <span key={i} style={sb.tag}>{sk.name || sk}</span>
              ))}
            </div>
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages">
            <div style={sb.divider} />
            <div style={sb.sectionLabel}>{tr('languages', isRTL)}</div>
            {data.languages.map((l, i) => (
              <div key={i} style={sb.skillRow}>
                <span>{l.name}</span>
                <Dots level={l.proficiency || 3} accent={accent} />
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests">
            <div style={sb.divider} />
            <div style={sb.sectionLabel}>{tr('interests', isRTL)}</div>
            <div style={{ fontSize: sz.meta, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
              {data.interests.map(i => typeof i === 'string' ? i : i.name).join('  •  ')}
            </div>
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates">
            <div style={sb.divider} />
            <div style={sb.sectionLabel}>{tr('certificates', isRTL)}</div>
            {data.certificates.map((c, i) => (
              <div key={i} style={{ fontSize: sz.meta, color: 'rgba(255,255,255,0.85)', marginBottom: '4pt' }}>• {c.name || c}</div>
            ))}
          </section>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <section key="awards">
            <div style={sb.divider} />
            <div style={sb.sectionLabel}>{tr('awards', isRTL)}</div>
            {data.awards.map((a, i) => (
              <div key={i} style={{ marginBottom: '6pt' }}>
                <div style={{ fontSize: sz.meta, fontWeight: '600', color: '#fff' }}>{a.title || a.name || a}</div>
                {a.issuer && <div style={{ fontSize: '8pt', color: 'rgba(255,255,255,0.6)' }}>{a.issuer}</div>}
              </div>
            ))}
          </section>
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
            <div style={mn.heading}>{tr('summary', isRTL)}</div>
            <div style={mn.body}>{info.summary}</div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            {data.experience.map((e, i) => (
              <div key={i} style={mn.item}>
                {i === 0 && <div style={mn.heading}>{tr('experience', isRTL)}</div>}
                <div style={{ display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', gap: '10pt' }}>
                  {/* Timeline dot */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: '3pt' }}>
                    <div style={{ width: '9pt', height: '9pt', borderRadius: '50%', backgroundColor: accent, flexShrink: 0 }} />
                    {i < data.experience.length - 1 && (
                      <div style={{ width: '1.5px', flex: 1, backgroundColor: accent + '33', marginTop: '3pt', minHeight: '20pt' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={mn.row}>
                      <div style={mn.role}>{e.jobTitle}</div>
                      <div style={mn.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                    </div>
                    <div style={mn.company}>{e.company}{e.location ? ` · ${e.location}` : ''}</div>
                    {e.description && <BulletDesc text={e.description} style={mn.body} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            {data.education.map((e, i) => (
              <div key={i} style={mn.item}>
                {i === 0 && <div style={mn.heading}>{tr('education', isRTL)}</div>}
                <div style={mn.row}>
                  <div style={mn.role}>{e.degree}</div>
                  <div style={mn.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={mn.company}>{e.institution}{e.location ? ` · ${e.location}` : ''}</div>
                {e.description && <BulletDesc text={e.description} style={mn.body} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            {data.projects.map((p, i) => (
              <div key={i} style={mn.item}>
                {i === 0 && <div style={mn.heading}>{tr('projects', isRTL)}</div>}
                <div style={mn.role}>{p.name}</div>
                {p.url && <div style={{ fontSize: sz.meta, color: accent, marginBottom: '2pt' }}>{p.url}</div>}
                {p.description && <BulletDesc text={p.description} style={mn.body} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      default: return null;
    }
  };

  const sideKeys = sectionOrder.filter(k => SIDEBAR_SECTIONS.has(k));
  const mainKeys = sectionOrder.filter(k => MAIN_SECTIONS.has(k));
  const initials = (info.fullName || '').split(/\s+/).map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();

  return (
    <div style={{ fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff', width: '794px', minHeight: '1122px', boxSizing: 'border-box', display: 'flex', flexDirection: isRTL ? 'row-reverse' : 'row', direction: 'ltr' }}>
      {/* Sidebar */}
      <div style={sb.wrapper}>
        {/* Photo / Default avatar circle */}
        {vis.photo !== false && (
          <div style={{ width: '84pt', height: '84pt', borderRadius: '50%', overflow: 'hidden', margin: `0 auto 14pt`, border: '3px solid rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img src={info.photo || '/default-avatar.svg'} alt="" style={{ width: '100%', height: '100%', objectFit: info.photo ? 'cover' : 'contain' }} />
          </div>
        )}
        <div style={sb.name}>{info.fullName || 'Your Name'}</div>
        <div style={sb.jobTitle}>{info.jobTitle || ''}</div>

        {/* Contact */}
        <div style={sb.sectionLabel}>{tr('profile', isRTL)}</div>
        {contactItems.map((row, i) => (
          <div key={i} style={sb.contactRow}>
            <span style={sb.icon}>{CONTACT_ICON_MAP[row.iconKey] || <GlobeIcon />}</span>
            <span style={{ wordBreak: 'break-all', lineHeight: 1.3 }}>{row.text}</span>
          </div>
        ))}

        {sideKeys.map(k => renderSidebar(k))}
      </div>

      {/* Main */}
      <div style={mn.wrapper}>
        {mainKeys.map(k => renderMain(k))}
      </div>
    </div>
  );
};

export default AtlanticBlueTemplate;
