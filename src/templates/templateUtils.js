export const SIZES = {
  small:  { name: '18pt', heading: '12pt', body: '10pt', meta: '9pt'  },
  medium: { name: '20pt', heading: '14pt', body: '11pt', meta: '10pt' },
  large:  { name: '22pt', heading: '16pt', body: '13pt', meta: '11pt' },
};

const PADDING = {
  narrow: '24pt 28pt',
  medium: '36pt 42pt',
  wide:   '48pt 56pt',
};

const LINE_HEIGHT = {
  compact: 1.2,
  normal:  1.4,
  relaxed: 1.7,
};

const LINE_HEIGHT_RTL = {
  compact: 1.5,
  normal:  1.8,
  relaxed: 2.1,
};

const SECTION_MT = {
  compact: '6pt',
  medium:  '14pt',
  relaxed: '22pt',
};

const LATIN_ONLY_FONTS = new Set([
  'Calibri', 'Arial', 'Georgia', 'Times New Roman',
  'Verdana', 'Trebuchet MS', 'Inter', 'Merriweather', 'Outfit',
]);

const ARABIC_FONTS = new Set([
  'Tajawal', 'Cairo', 'Amiri', 'Noto Naskh Arabic', 'Scheherazade New',
]);

export function resolveTheme(theme, isRTL) {
  const fontSize       = theme?.fontSize       || 'medium';
  let   fontFamily     = theme?.fontFamily     || (isRTL ? 'Tajawal' : 'Calibri');
  const pagePadding    = theme?.pagePadding    || 'medium';
  const lineHeightKey  = theme?.lineHeight     || 'normal';
  const sectionSpacing = theme?.sectionSpacing || 'medium';

  if (isRTL && LATIN_ONLY_FONTS.has(fontFamily)) {
    fontFamily = 'Tajawal';
  }
  if (!isRTL && ARABIC_FONTS.has(fontFamily)) {
    fontFamily = 'Calibri';
  }

  const baseFont = isRTL
    ? `'${fontFamily}', 'Tajawal', Arial, sans-serif`
    : `'${fontFamily}', 'Calibri', Arial, sans-serif`;

  return {
    sz: SIZES[fontSize],
    font: baseFont,
    padding: PADDING[pagePadding] || PADDING.medium,
    lineHeight: isRTL
      ? (LINE_HEIGHT_RTL[lineHeightKey] || 1.8)
      : (LINE_HEIGHT[lineHeightKey]     || 1.4),
    sectionMt: SECTION_MT[sectionSpacing] || SECTION_MT.medium,
  };
}

export function buildContact(info, visible, isRTL) {
  const labels = {
    email:     { en: 'Email',    ar: 'البريد الإلكتروني' },
    phone:     { en: 'Phone',    ar: 'الهاتف'            },
    location:  { en: 'Location', ar: 'الموقع'            },
    linkedin:  { en: 'LinkedIn', ar: 'لينكد إن'          },
    portfolio: { en: 'Portfolio',ar: 'البورتفوليو'        },
  };
  const L = (k) => labels[k]?.[isRTL ? 'ar' : 'en'] ?? k;

  const vis = visible || {};
  return [
    vis.email     !== false && info?.email     && `${L('email')}: ${info.email}`,
    vis.phone     !== false && info?.phone     && `${L('phone')}: ${info.phone}`,
    vis.location  !== false && info?.location  && `${L('location')}: ${info.location}`,
    vis.linkedin  !== false && info?.linkedin  && `${L('linkedin')}: ${info.linkedin}`,
    vis.portfolio !== false && info?.portfolio && `${L('portfolio')}: ${info.portfolio}`,
  ].filter(Boolean).join('   |   ');
}
