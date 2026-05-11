import { resolveTheme, buildContact } from './templateUtils';

const labels = {
  execSummary: { en: 'Executive Summary',      ar: 'الملخص التنفيذي'   },
  experience:  { en: 'Professional Experience', ar: 'الخبرة المهنية'   },
  education:   { en: 'Education',               ar: 'التعليم'           },
  skills:      { en: 'Core Competencies',       ar: 'الكفاءات الأساسية' },
  languages:   { en: 'Languages',               ar: 'اللغات'            },
  projects:    { en: 'Projects',                ar: 'المشاريع'          },
  present:     { en: 'Present',                 ar: 'حتى الآن'          },
};
const tr = (key, isRTL) => labels[key][isRTL ? 'ar' : 'en'];

const ExecutiveTemplate = ({ data, theme, isRTL = false, visibleSections = {}, visiblePersonalFields = {} }) => {
  const accent = theme?.primaryColor || '#0f2942';
  const gold = '#c9a84c';
  const { sz, font, padding, lineHeight, sectionMt } = resolveTheme(theme, isRTL);
  const dir = isRTL ? 'rtl' : 'ltr';

  const show = (key) => visibleSections[key] !== false;

  const s = {
    page: {
      fontFamily: font, fontSize: sz.body, color: '#1a1a1a', backgroundColor: '#ffffff',
      padding, lineHeight, width: '794px', minHeight: '1122px',
      boxSizing: 'border-box', direction: dir, textAlign: isRTL ? 'right' : 'left',
    },
    name:    { fontSize: sz.name,    fontWeight: '700', color: accent, marginBottom: '2pt', textTransform: 'uppercase', letterSpacing: '0.04em' },
    jobTitle:{ fontSize: sz.body,    color: '#555', marginBottom: '6pt', letterSpacing: '0.06em', textTransform: 'uppercase' },
    contact: { fontSize: sz.meta,    color: '#444', marginBottom: '10pt' },
    hdivider:{ borderBottom: `3px double ${accent}`, marginBottom: '14pt' },
    role:    { fontSize: sz.body,    fontWeight: '700', marginBottom: '1pt' },
    meta:    { fontSize: sz.meta,    color: '#555', marginBottom: '4pt' },
    body:    { fontSize: sz.body,    color: '#222', lineHeight, whiteSpace: 'pre-line' },
    row:     { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: isRTL ? 'row-reverse' : 'row' },
    date:    { fontSize: sz.meta, color: '#555', whiteSpace: 'nowrap', marginLeft: isRTL ? 0 : '12pt', marginRight: isRTL ? '12pt' : 0 },
  };

  const SectionHeading = ({ labelKey }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8pt', marginTop: sectionMt, marginBottom: '8pt', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
      <div style={{ fontSize: sz.heading, fontWeight: '700', color: accent, whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {tr(labelKey, isRTL)}
      </div>
      <div style={{ flex: 1, borderBottom: `1px solid ${gold}` }} />
    </div>
  );

  const contact = buildContact(data.personalInfo, visiblePersonalFields, isRTL);

  return (
    <div style={s.page}>
      <div style={s.name}>{data.personalInfo.fullName}</div>
      <div style={s.jobTitle}>{data.personalInfo.jobTitle}</div>
      {contact && <div style={s.contact}>{contact}</div>}
      <div style={s.hdivider} />

      {show('summary') && data.personalInfo.summary && <>
        <SectionHeading labelKey="execSummary" />
        <div style={{ ...s.body, fontStyle: 'italic' }}>{data.personalInfo.summary}</div>
      </>}

      {show('experience') && data.experience?.length > 0 && <>
        <SectionHeading labelKey="experience" />
        {data.experience.map((e, i) => (
          <div key={i} style={{ marginBottom: '10pt' }}>
            <div style={s.row}>
              <div style={s.role}>{e.jobTitle}</div>
              <div style={s.date}>{e.startDate} – {e.current ? tr('present', isRTL) : e.endDate}</div>
            </div>
            <div style={{ ...s.meta, fontWeight: '600' }}>{e.company}{e.location ? `، ${e.location}` : ''}</div>
            <div style={s.body}>{e.description}</div>
          </div>
        ))}
      </>}

      {show('education') && data.education?.length > 0 && <>
        <SectionHeading labelKey="education" />
        {data.education.map((e, i) => (
          <div key={i} style={{ marginBottom: '8pt' }}>
            <div style={s.row}>
              <div style={s.role}>{e.degree}</div>
              <div style={s.date}>{e.startDate} – {e.endDate}</div>
            </div>
            <div style={s.meta}>{e.institution}</div>
            {e.description && <div style={s.body}>{e.description}</div>}
          </div>
        ))}
      </>}

      {show('skills') && data.skills?.length > 0 && <>
        <SectionHeading labelKey="skills" />
        <div style={s.body}>{data.skills.join(' | ')}</div>
      </>}

      {show('languages') && data.languages?.length > 0 && <>
        <SectionHeading labelKey="languages" />
        <div style={s.body}>{data.languages.map(l => `${l.name} (${l.level})`).join(' | ')}</div>
      </>}

      {show('projects') && data.projects?.length > 0 && <>
        <SectionHeading labelKey="projects" />
        {data.projects.map((p, i) => (
          <div key={i} style={{ marginBottom: '8pt' }}>
            <div style={s.role}>{p.title}</div>
            <div style={s.body}>{p.description}</div>
          </div>
        ))}
      </>}
    </div>
  );
};

export default ExecutiveTemplate;
