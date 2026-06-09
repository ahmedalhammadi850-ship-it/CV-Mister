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
  let   fontFamily     = theme?.fontFamily     || (isRTL ? 'Tajawal' : 'Inter');
  const pagePadding    = theme?.pagePadding    || 'medium';
  const lineHeightKey  = theme?.lineHeight     || 'normal';
  const sectionSpacing = theme?.sectionSpacing || 'medium';

  if (isRTL && LATIN_ONLY_FONTS.has(fontFamily)) {
    fontFamily = 'Tajawal';
  }
  if (!isRTL && ARABIC_FONTS.has(fontFamily)) {
    fontFamily = 'Inter';
  }

  // For LTR: Calibri is a Windows-only system font — it is not installed on
  // Linux (Puppeteer/server). If the stack starts with Calibri, Windows Chrome
  // uses it while Puppeteer falls back to Inter, causing ~80-100 px of layout
  // drift between preview and PDF (blank space / content clipping).
  // Fix: when fontFamily is Calibri, skip it and use Inter directly so both
  // the browser preview and Puppeteer always render with the same web font.
  // For all other LTR fonts (Inter, Merriweather, etc.) keep Inter as fallback.
  // For RTL: Tajawal is always a Google Font, so the stack is already consistent.
  const baseFont = isRTL
    ? `'${fontFamily}', 'Tajawal', Arial, sans-serif`
    : fontFamily === 'Calibri'
      ? `'Inter', Arial, sans-serif`
      : `'${fontFamily}', 'Inter', Arial, sans-serif`;

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

/* ── Print break helpers (use as inline styles) ── */
export const BREAK_ITEM    = { breakInside: 'avoid', pageBreakInside: 'avoid' };
// BREAK_HEADING: prevent the heading from being orphaned (break-after:avoid)
// AND prevent the heading itself from being split horizontally (break-inside:avoid).
// Both are needed: break-after keeps heading with its content; break-inside
// prevents the heading's flex row (text + decorative lines) from being sliced.
export const BREAK_HEADING = {
  breakAfter:   'avoid', pageBreakAfter:  'avoid',
  breakInside:  'avoid', pageBreakInside: 'avoid',
};

/* ── Text-align helper: merges a stored align value into a style object ── */
export function ta(style, align) {
  return align ? { ...style, textAlign: align } : style;
}
