import { resolveTheme, BREAK_ITEM, BREAK_HEADING } from './templateUtils';

const labels = {
  summary:       { en: 'Summary',             ar: 'الملخص المهني'        },
  experience:    { en: 'Professional Experience', ar: 'الخبرة المهنية'  },
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
  present:       { en: 'Present',             ar: 'حتى الآن'             },
};
const tr = (key, isRTL) => labels[key]?.[isRTL ? 'ar' : 'en'] ?? key;

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages', 'certificates', 'awards'];

const MercuryFlowTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER,
}) => {
  const accent       = theme?.primaryColor || '#2a7d6e';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || (isRTL ? 'right' : 'left');
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const initials = (info.fullName || 'YN').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const contactParts = [
    vis.phone     !== false && info.phone     && info.phone,
    vis.email     !== false && info.email     && info.email,
    vis.location  !== false && info.location  && info.location,
    vis.linkedin  !== false && info.linkedin  && info.linkedin,
    vis.portfolio !== false && info.portfolio && info.portfolio,
  ].filter(Boolean);

  const hPad = padding.split(' ')[1] || '42pt';

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a',
      backgroundColor: '#ffffff', width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir,
    },
    header: {
      backgroundColor: accent,
      padding: `28pt ${hPad}`,
      display: 'flex',
      alignItems: 'center',
      gap: '22pt',
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    avatar: {
      width: '80pt', height: '80pt', borderRadius: '50%',
      backgroundColor: '#fff', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '22pt', fontWeight: '700', color: accent,
      border: '3px solid rgba(255,255,255,0.5)',
    },
    headerText: { flex: 1 },
    name: {
      fontSize: sz.name, fontWeight: '700', color: '#fff',
      marginBottom: '3pt', lineHeight: 1.2,
      textAlign: headerAlign,
    },
    jobTitle: {
      fontSize: sz.body, color: 'rgba(255,255,255,0.80)',
      marginBottom: '8pt', fontStyle: 'italic',
      textAlign: headerAlign,
    },
    contactStrip: {
      backgroundColor: '#f0f7f5',
      padding: '7pt 40pt',
      fontSize: sz.meta,
      color: '#444',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6pt 0',
      borderBottom: `2px solid ${accent}`,
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    contactItem: {
      display: 'flex', alignItems: 'center', gap: '4pt',
      paddingRight: '14pt', paddingLeft: isRTL ? '14pt' : '0',
    },
    contactDot: {
      width: '4pt', height: '4pt', borderRadius: '50%',
      backgroundColor: accent, display: 'inline-block', flexShrink: 0,
    },
    body: { padding: `24pt ${hPad}`, lineHeight },
    heading: {
      display: 'flex', alignItems: 'center', gap: '8pt',
      marginTop: sectionMt, marginBottom: '8pt',
      flexDirection: headingAlign === 'right'
        ? (isRTL ? 'row' : 'row-reverse')
        : headingAlign === 'center'
        ? 'row'
        : (isRTL ? 'row-reverse' : 'row'),
      justifyContent: headingAlign === 'center' ? 'center' : 'flex-start',
      ...BREAK_HEADING,
    },
    headingAccent: { width: '5pt', height: '18pt', backgroundColor: accent, borderRadius: '2pt', flexShrink: 0 },
    headingText: {
      fontSize: sz.heading, fontWeight: '700', color: '#111',
      textTransform: 'uppercase', letterSpacing: '0.06em',
    },
    headingRule: { flex: headingAlign === 'center' ? 'unset' : 1, width: headingAlign === 'center' ? '60pt' : 'auto', height: '1px', backgroundColor: '#ddd' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8pt', flexDirection: isRTL ? 'row-reverse' : 'row' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1 },
    date: { fontSize: sz.meta, color: '#fff', backgroundColor: accent, padding: '1pt 7pt', borderRadius: '10pt', whiteSpace: 'nowrap', flexShrink: 0 },
    company: { fontSize: sz.meta, color: '#555', marginBottom: '4pt' },
    bodyText: { fontSize: sz.body, color: '#333', lineHeight, whiteSpace: 'pre-line' },
    item: { marginBottom: '12pt', ...BREAK_ITEM },
    tag: { display: 'inline-block', background: accent + '18', color: accent, borderRadius: '12pt', padding: '2pt 10pt', fontSize: sz.meta, marginRight: '5pt', marginBottom: '5pt', fontWeight: '500' },
  };

  const SectionHead = ({ labelKey }) => (
    <div style={s.heading}>
      <span style={s.headingAccent} />
      <span style={s.headingText}>{tr(labelKey, isRTL)}</span>
      <span style={s.headingRule} />
    </div>
  );

  const renderSection = (key) => {
    if (!show(key)) return null;
    switch (key) {
      case 'summary':
        return info.summary ? (
          <div key="summary" style={BREAK_ITEM}>
            <SectionHead labelKey="summary" />
            <div style={s.bodyText}>{info.summary}</div>
          </div>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <div key="experience">
            <SectionHead labelKey="experience" />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <div style={s.role}>{e.jobTitle}</div>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
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
            <SectionHead labelKey="education" />
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
            <SectionHead labelKey="skills" />
            <div>
              {data.skills.map((sk, i) => (
                <span key={i} style={s.tag}>{sk.name || sk}</span>
              ))}
            </div>
          </div>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <div key="languages" style={BREAK_ITEM}>
            <SectionHead labelKey="languages" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6pt' }}>
              {data.languages.map((l, i) => (
                <div key={i} style={{ ...s.tag, background: '#f5f5f5', color: '#333', border: `1px solid ${accent}40` }}>
                  {l.name}{l.level ? ` · ${l.level}` : ''}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <div key="projects">
            <SectionHead labelKey="projects" />
            {data.projects.map((p, i) => (
              <div key={i} style={s.item}>
                <div style={s.role}>{p.name}</div>
                {p.url && <div style={{ fontSize: sz.meta, color: accent, marginBottom: '2pt' }}>{p.url}</div>}
                {p.description && <div style={s.bodyText}>{p.description}</div>}
              </div>
            ))}
          </div>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <div key="certificates" style={BREAK_ITEM}>
            <SectionHead labelKey="certificates" />
            {data.certificates.map((c, i) => (
              <div key={i} style={{ fontSize: sz.body, color: '#333', marginBottom: '4pt' }}>
                <span style={{ fontWeight: '600' }}>{c.name || c}</span>
                {c.issuer && <span style={{ color: '#777' }}> — {c.issuer}</span>}
              </div>
            ))}
          </div>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <div key="awards" style={BREAK_ITEM}>
            <SectionHead labelKey="awards" />
            {data.awards.map((a, i) => (
              <div key={i} style={{ marginBottom: '6pt', ...BREAK_ITEM }}>
                <span style={{ fontWeight: '600' }}>{a.title || a.name || a}</span>
                {a.issuer && <span style={{ color: '#777', fontSize: sz.meta }}> — {a.issuer}</span>}
              </div>
            ))}
          </div>
        ) : null;

      default: return null;
    }
  };

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <div style={s.avatar}>
          {(vis.photo !== false && info.photo)
            ? <img src={info.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            : initials
          }
        </div>
        <div style={s.headerText}>
          <div style={s.name}>{info.fullName || 'Your Name'}</div>
          <div style={s.jobTitle}>{info.jobTitle || ''}</div>
        </div>
      </div>

      {/* Contact strip */}
      {contactParts.length > 0 && (
        <div style={s.contactStrip}>
          {contactParts.map((c, i) => (
            <div key={i} style={s.contactItem}>
              <span style={s.contactDot} />
              <span>{c}</span>
            </div>
          ))}
        </div>
      )}

      {/* Body */}
      <div style={s.body}>
        {sectionOrder.map(k => renderSection(k))}
      </div>
    </div>
  );
};

export default MercuryFlowTemplate;
