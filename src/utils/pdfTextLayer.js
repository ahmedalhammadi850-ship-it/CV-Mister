/**
 * pdfTextLayer.js
 *
 * Injects an invisible text layer into an existing jsPDF document.
 * Used after image-based (screenshot) PDF generation to make the file
 * fully ATS-parseable — every character becomes a real PDF text operator
 * while the visual appearance stays identical (renderingMode: 'invisible').
 *
 * Call this after all pages have been added with pdf.addImage(), and
 * before pdf.save() / pdf.output().
 */

function safe(v) {
  return v ? String(v).trim() : '';
}

function dateRange(start, end, current, isRTL) {
  const present = isRTL ? 'حتى الآن' : 'Present';
  return [safe(start), current ? present : safe(end)].filter(Boolean).join(' – ');
}

/**
 * @param {import('jspdf').jsPDF} pdf   - The jsPDF instance (pages already added)
 * @param {object}               cvData - CV data object
 * @param {object}               opts   - { isRTL, visibleSections, sectionOrder, sectionNames }
 */
export function injectTextLayer(pdf, cvData, opts = {}) {
  const {
    isRTL = false,
    visibleSections = {},
    sectionOrder = ['summary', 'experience', 'education', 'skills', 'languages', 'projects'],
    sectionNames: _sectionNames = {},
  } = opts;

  const show = (k) => visibleSections[k] !== false;

  const PAGE_H    = 297;
  const X_LTR     = 8;
  const X_RTL     = 202;
  const LINE_H    = 4.2;
  const BOTTOM    = PAGE_H - 6;
  const totalPages = pdf.getNumberOfPages();

  let currentPage = 1;
  let y = 8;

  pdf.setPage(1);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');

  /** Write one string as invisible text, wrapping at ~100 chars */
  const write = (text) => {
    if (!text || !String(text).trim()) return;
    const str = String(text).trim();
    // Break into safe-length chunks (ATS reads the full text stream anyway)
    const maxLen = 100;
    for (let i = 0; i < str.length; i += maxLen) {
      const chunk = str.slice(i, i + maxLen);
      pdf.text(chunk, isRTL ? X_RTL : X_LTR, y, {
        renderingMode: 'invisible',
      });
      y += LINE_H;
      if (y > BOTTOM) {
        if (currentPage < totalPages) {
          currentPage++;
          pdf.setPage(currentPage);
          y = 8;
        }
        // If no more pages, stop — better to lose trailing text than crash
      }
    }
  };

  const writeParts = (...parts) => {
    const joined = parts.filter(Boolean).join('  |  ');
    if (joined) write(joined);
  };

  // ── Personal info / header ───────────────────────────────────────────────
  const pi = cvData?.personalInfo ?? {};
  if (pi.fullName)  write(pi.fullName);
  if (pi.jobTitle)  write(pi.jobTitle);

  const contact = [
    pi.email, pi.phone, pi.location, pi.linkedin, pi.portfolio,
  ].filter(Boolean);
  if (contact.length) write(contact.join('  |  '));
  if (pi.summary)   write(pi.summary);

  // ── Sections ─────────────────────────────────────────────────────────────
  const renderSection = (key) => {
    if (!show(key)) return;

    switch (key) {

      case 'summary':
        // Already written above (kept for cases where summary is section-ordered)
        break;

      case 'experience':
        (cvData.experience || []).forEach(e => {
          writeParts(safe(e.jobTitle), safe(e.company), safe(e.location));
          const dr = dateRange(e.startDate, e.endDate, e.current, isRTL);
          if (dr) write(dr);
          if (e.description) write(safe(e.description));
        });
        break;

      case 'education':
        (cvData.education || []).forEach(e => {
          writeParts(safe(e.degree), safe(e.institution));
          const dr = dateRange(e.startDate, e.endDate, false, isRTL);
          if (dr) write(dr);
          if (e.description) write(safe(e.description));
        });
        break;

      case 'skills':
        if (cvData.skills?.length) {
          write(cvData.skills.map(s => safe(s.name || s)).filter(Boolean).join(', '));
        }
        break;

      case 'languages':
        if (cvData.languages?.length) {
          write(cvData.languages
            .map(l => [safe(l.name), safe(l.level)].filter(Boolean).join(' '))
            .filter(Boolean)
            .join(', ')
          );
        }
        break;

      case 'projects':
        (cvData.projects || []).forEach(p => {
          if (p.title)       write(safe(p.title));
          if (p.link)        write(safe(p.link));
          if (p.description) write(safe(p.description));
        });
        break;

      case 'certificates':
        (cvData.certificates || []).forEach(c => {
          writeParts(safe(c.name), safe(c.issuer), safe(c.date));
          if (c.description) write(safe(c.description));
        });
        break;

      case 'interests':
        if (cvData.interests?.length) {
          write(cvData.interests
            .map(i => safe(typeof i === 'string' ? i : i.name))
            .filter(Boolean)
            .join(', ')
          );
        }
        break;

      case 'courses':
        (cvData.courses || []).forEach(c => {
          writeParts(safe(c.name), safe(c.institution), safe(c.date));
        });
        break;

      case 'awards':
        (cvData.awards || []).forEach(a => {
          writeParts(safe(a.title), safe(a.issuer), safe(a.date));
          if (a.description) write(safe(a.description));
        });
        break;

      case 'organisations':
        (cvData.organisations || []).forEach(o => {
          writeParts(safe(o.name), safe(o.role), safe(o.date));
        });
        break;

      case 'publications':
        (cvData.publications || []).forEach(p => {
          writeParts(safe(p.title), safe(p.publisher), safe(p.date));
          if (p.description) write(safe(p.description));
        });
        break;

      case 'references':
        (cvData.references || []).forEach(r => {
          writeParts(safe(r.name), safe(r.title), safe(r.company));
          writeParts(safe(r.email), safe(r.phone));
        });
        break;

      default:
        if (key.startsWith('csec-') && cvData.customSections) {
          const sec = cvData.customSections.find(s => s.id === key);
          if (sec?.title) write(safe(sec.title));
          (sec?.items || []).forEach(item => {
            if (item.title)       write(safe(item.title));
            if (item.subtitle)    write(safe(item.subtitle));
            if (item.description) write(safe(item.description));
          });
        }
    }
  };

  for (const key of sectionOrder) {
    renderSection(key);
  }
}
