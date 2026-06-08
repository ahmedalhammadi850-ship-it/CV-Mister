import { resolveTheme, BREAK_ITEM, BREAK_HEADING, ta} from './templateUtils';
import BulletDesc from './BulletDesc';

const labels = {
  summary:       { en: 'Summary',             ar: 'الملخص المهني'        },
  experience:    { en: 'Experience',           ar: 'الخبرة العملية'       },
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

const DEFAULT_ORDER = ['summary', 'experience', 'education', 'skills', 'projects', 'languages', 'certificates', 'awards'];

const DotsRating = ({ level = 3, accent }) => {
    const lvl = level > 5 ? Math.round(level / 20) : level;
  const filled = Math.min(Math.max(Math.round(lvl), 1), 5);
  return (
    <span style={{ display: 'inline-flex', gap: '3pt', verticalAlign: 'middle' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ width: '7pt', height: '7pt', borderRadius: '50%', backgroundColor: i <= filled ? accent : '#e0e0e0', display: 'inline-block' }} />
      ))}
    </span>
  );
};

const EditorialRuleTemplate = ({
  data, theme, isRTL = false,
  visibleSections = {}, visiblePersonalFields = {},
  sectionOrder = DEFAULT_ORDER, sectionNames = {},
}) => {
  const accent       = theme?.primaryColor || '#2c3e50';
  const headingAlign = theme?.headingAlign || (isRTL ? 'right' : 'left');
  const headerAlign  = theme?.headerAlign  || (isRTL ? 'right' : 'left');
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';
  const show = (key) => visibleSections[key] !== false;
  const tr = (key, isRTL) => sectionNames?.[key] || (labels[key]?.[isRTL ? 'ar' : 'en'] ?? key);

  const info = data?.personalInfo || {};
  const vis  = visiblePersonalFields || {};

  const contactParts = [
    vis.phone     !== false && info.phone     && info.phone,
    vis.email     !== false && info.email     && info.email,
    vis.location  !== false && info.location  && info.location,
    vis.linkedin  !== false && info.linkedin  && info.linkedin,
    vis.portfolio !== false && info.portfolio && info.portfolio,
    vis.github    !== false && info.github    && info.github,
  ].filter(Boolean);

  const BOTTOM_SECTIONS = new Set(['skills', 'languages', 'interests', 'certificates', 'courses', 'awards', 'organisations']);

  const nameJustify = headerAlign === 'center' ? 'center' : headerAlign === 'right' ? (isRTL ? 'flex-start' : 'flex-end') : (isRTL ? 'flex-end' : 'flex-start');

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a',
      backgroundColor: '#ffffff',
      padding,
      width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir,
    },
    nameRow: {
      display: 'flex',
      justifyContent: headerAlign === 'center' ? 'center' : 'space-between',
      alignItems: 'flex-end',
      marginBottom: '4pt',
      flexDirection: isRTL ? 'row-reverse' : 'row',
      flexWrap: 'wrap', gap: '4pt',
    },
    name: { fontSize: sz.name, fontWeight: '700', color: '#111', lineHeight: 1.1, letterSpacing: '-0.02em', textAlign: headerAlign },
    jobTitle: { fontSize: sz.body, color: '#666', fontStyle: 'italic', paddingBottom: '4pt', textAlign: headerAlign },
    mainRule: { borderTop: `3px solid ${accent}`, marginBottom: '4pt' },
    thinRule: { borderTop: '1px solid #ddd', marginBottom: '8pt' },
    contactRow: {
      display: 'flex', flexWrap: 'wrap', gap: '4pt 0',
      fontSize: sz.meta, color: '#555',
      marginBottom: '20pt',
      justifyContent: headerAlign === 'center' ? 'center' : (isRTL ? 'flex-end' : 'flex-start'),
      flexDirection: isRTL ? 'row-reverse' : 'row',
    },
    contactSep: { padding: '0 8pt', color: '#bbb' },
    heading: {
      fontSize: sz.heading, fontWeight: '700', color: accent,
      textTransform: 'uppercase', letterSpacing: '0.10em',
      marginTop: sectionMt, marginBottom: '4pt',
      textAlign: headingAlign,
      ...BREAK_HEADING,
    },
    headingRule: { borderTop: `2px solid ${accent}`, marginBottom: '8pt' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8pt', flexDirection: isRTL ? 'row-reverse' : 'row' },
    role: { fontSize: sz.body, fontWeight: '700', color: '#111', flex: 1 },
    date: { fontSize: sz.meta, color: '#888', whiteSpace: 'nowrap', flexShrink: 0, fontStyle: 'italic' },
    company: { fontSize: sz.meta, color: '#555', marginBottom: '4pt' },
    bodyText: { fontSize: sz.body, color: '#333', lineHeight, whiteSpace: 'pre-line' },
    item: { marginBottom: '10pt', ...BREAK_ITEM },
    twoCol: { display: 'flex', gap: '24pt', flexDirection: isRTL ? 'row-reverse' : 'row' },
    col: { flex: 1 },
    skillRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6pt', flexDirection: isRTL ? 'row-reverse' : 'row', ...BREAK_ITEM },
    skillName: { fontSize: sz.body, color: '#333' },
  };

  const SectionHead = ({ labelKey }) => (
    <div style={BREAK_HEADING}>
      <h2 style={s.heading}>{tr(labelKey, isRTL)}</h2>
      <div style={s.headingRule} />
    </div>
  );

  const renderMainSection = (key) => {
    if (!show(key) || BOTTOM_SECTIONS.has(key)) return null;
    switch (key) {
      case 'summary':
        return info.summary ? (
          <section key="summary" style={BREAK_ITEM}>
            <SectionHead labelKey="summary" />
            <div style={s.bodyText}>{info.summary}</div>
          </section>
        ) : null;

      case 'experience':
        return data.experience?.length > 0 ? (
          <section key="experience">
            <SectionHead labelKey="experience" />
            {data.experience.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{e.jobTitle}</h3>
                  <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
                </div>
                <div style={s.company}>{e.company}{e.location ? `, ${e.location}` : ''}</div>
                {e.description && <BulletDesc text={e.description} style={s.bodyText} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'education':
        return data.education?.length > 0 ? (
          <section key="education">
            <SectionHead labelKey="education" />
            {data.education.map((e, i) => (
              <div key={i} style={s.item}>
                <div style={s.row}>
                  <h3 style={s.role}>{e.degree}</h3>
                  <div style={s.date}>{e.startDate} – {e.endDate}</div>
                </div>
                <div style={s.company}>{e.institution}{e.location ? `, ${e.location}` : ''}</div>
                {e.description && <BulletDesc text={e.description} style={s.bodyText} bold={e?.descriptionBold} italic={e?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      case 'projects':
        return data.projects?.length > 0 ? (
          <section key="projects">
            <SectionHead labelKey="projects" />
            {data.projects.map((p, i) => (
              <div key={i} style={s.item}>
                <h3 style={s.role}>{p.name}</h3>
                {p.url && <div style={{ fontSize: sz.meta, color: accent, marginBottom: '2pt' }}>{p.url}</div>}
                {p.description && <BulletDesc text={p.description} style={s.bodyText} bold={p?.descriptionBold} italic={p?.descriptionItalic} />}
              </div>
            ))}
          </section>
        ) : null;

      default: return null;
    }
  };

  const bottomKeys = sectionOrder.filter(k => BOTTOM_SECTIONS.has(k) && show(k));

  const renderBottomSection = (key) => {
    switch (key) {
      case 'skills':
        return data.skills?.length > 0 ? (
          <section key="skills" style={s.col}>
            <SectionHead labelKey="skills" />
            {data.skills.map((sk, i) => (
              <div key={i} style={s.skillRow}>
                <span style={s.skillName}>{sk.name || sk}</span>
                <DotsRating level={sk.level || 3} accent={accent} />
              </div>
            ))}
          </section>
        ) : null;

      case 'languages':
        return data.languages?.length > 0 ? (
          <section key="languages" style={s.col}>
            <SectionHead labelKey="languages" />
            {data.languages.map((l, i) => (
              <div key={i} style={s.skillRow}>
                <span style={s.skillName}>{l.name}</span>
                <DotsRating level={l.proficiency || 3} accent={accent} />
              </div>
            ))}
          </section>
        ) : null;

      case 'certificates':
        return data.certificates?.length > 0 ? (
          <section key="certificates" style={s.col}>
            <SectionHead labelKey="certificates" />
            {data.certificates.map((c, i) => (
              <div key={i} style={{ fontSize: sz.body, color: '#333', marginBottom: '5pt' }}>
                <div style={{ fontWeight: '600' }}>{c.name || c}</div>
                {c.issuer && <div style={{ color: '#777', fontSize: sz.meta }}>{c.issuer}</div>}
              </div>
            ))}
          </section>
        ) : null;

      case 'interests':
        return data.interests?.length > 0 ? (
          <section key="interests" style={s.col}>
            <SectionHead labelKey="interests" />
            <div style={{ fontSize: sz.body, color: '#333', lineHeight: 1.7 }}>
              {data.interests.map(i => typeof i === 'string' ? i : i.name).join('  ·  ')}
            </div>
          </section>
        ) : null;

      case 'awards':
        return data.awards?.length > 0 ? (
          <section key="awards" style={s.col}>
            <SectionHead labelKey="awards" />
            {data.awards.map((a, i) => (
              <div key={i} style={{ marginBottom: '5pt' }}>
                <div style={{ fontWeight: '600', fontSize: sz.body }}>{a.title || a.name || a}</div>
                {a.issuer && <div style={{ color: '#777', fontSize: sz.meta }}>{a.issuer}</div>}
              </div>
            ))}
          </section>
        ) : null;

      default: return null;
    }
  };

  const bottomPairs = [];
  for (let i = 0; i < bottomKeys.length; i += 2) {
    bottomPairs.push(bottomKeys.slice(i, i + 2));
  }

  return (
    <article style={s.page}>
      {/* Header */}
      <div style={s.nameRow}>
        <h1 style={s.name}>{info.fullName || 'Your Name'}</h1>
        <p style={s.jobTitle}>{info.jobTitle || ''}</p>
      </div>
      <div style={s.mainRule} />
      <div style={s.thinRule} />

      {/* Contact */}
      {contactParts.length > 0 && (
        <div style={s.contactRow}>
          {contactParts.map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <span style={s.contactSep}>|</span>}
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Main sections */}
      {sectionOrder.map(k => renderMainSection(k))}

      {/* Bottom two-column grid */}
      {bottomPairs.map((pair, i) => (
        <div key={i} style={{ ...s.twoCol, marginTop: i === 0 ? sectionMt : '0' }}>
          {pair.map(k => renderBottomSection(k))}
          {pair.length === 1 && <div style={s.col} />}
        </div>
      ))}
    </article>
  );
};

export default EditorialRuleTemplate;
