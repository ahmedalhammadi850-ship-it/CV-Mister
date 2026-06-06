/**
 * POST /api/pdf/ats
 *
 * Pixel-perfect PDF generation using Puppeteer.
 *
 * RENDERING STRATEGY (primary → fallback):
 *
 *  1. BROWSER-CAPTURED HTML PRIMARY — buildHtmlFromRendered(renderedHtml, options)
 *     Used when the client supplies renderedHtml (which it always does).
 *     The client captures the innerHTML of the EXACT off-screen DOM element that
 *     was used to measure totalHeight and pageBreaks — so the HTML, the page-break
 *     positions, and the total height are all perfectly consistent with each other.
 *     This guarantees the PDF layout is pixel-for-pixel identical to the preview.
 *
 *     WHY THIS IS NOW PRIMARY (was previously secondary):
 *       SSR (react-dom/server renderToStaticMarkup) re-renders the template from
 *       raw data on the server.  Even with identical fonts, sub-pixel differences
 *       in line-height rounding, em-unit resolution, and React hook behaviour
 *       (useEffect doesn't run in SSR) can produce a layout that is 50–200 px
 *       taller or shorter than the browser's live DOM.  When the server's layout
 *       differs from the browser's, content that was on page 1 in the preview
 *       spills onto page 2 in the PDF — or the last section gets clipped.
 *       Using the browser-captured HTML eliminates this class of bug entirely.
 *
 *  2. SSR FALLBACK — buildAtsHtmlFromReact(cvData, options)
 *     Used only when renderedHtml is absent (e.g. direct API calls, old clients,
 *     or if captureEl ref is null at download time).
 *     Still perfectly usable — just may have minor layout differences vs preview
 *     on templates that rely on browser-only font metrics.
 *
 * Body shape:
 *  {
 *    cvData:        object,   // CV data — used for filename + SSR fallback
 *    renderedHtml?: string,   // browser innerHTML — primary PDF source
 *    options: {
 *      templateId,
 *      isRTL, theme,
 *      visibleSections, visiblePersonalFields, sectionOrder, sectionNames,
 *      pageBreaks,   // number[] — pixel y-positions from browser smart-break algo
 *      totalHeight,  // number  — total content height in px from browser
 *    }
 *  }
 */

import { getUserFromReq }                              from '../_lib/token.js';
import { buildHtmlFromRendered, buildAtsHtmlFromReact } from '../_lib/atsReactRenderer.js';
import { generatePdfFromHtml }                         from '../_lib/puppeteerPdf.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const user = getUserFromReq(req);
  console.log('[PDF] handler reached — method:', req.method);

  try {
    const { cvData, renderedHtml, options = {} } = req.body || {};
    const { templateId, isRTL, pageBreaks = [], totalHeight = 1122 } = options;

    console.log('[PDF] templateId  :', templateId);
    console.log('[PDF] isRTL       :', isRTL);
    console.log('[PDF] pageBreaks  :', pageBreaks);
    console.log('[PDF] totalHeight :', totalHeight);
    console.log('[PDF] userId      :', user?.userId ?? '(unauthenticated)');

    let html;

    if (renderedHtml) {
      // ── PRIMARY PATH: browser-captured HTML ───────────────────────────────
      // The client sends the innerHTML of the hidden off-screen measurement div —
      // the same element whose scrollHeight = totalHeight and whose DOM was used
      // by the smart-break algorithm to compute pageBreaks.
      // All three values (HTML, totalHeight, pageBreaks) are mutually consistent,
      // so the PDF slices are guaranteed to fall at the same positions as the
      // preview page-frame boundaries.
      console.log('[PDF] source: browser-captured HTML — size:', renderedHtml.length, 'chars — pageBreaks:', pageBreaks.length);
      html = buildHtmlFromRendered(renderedHtml, { isRTL, pageBreaks, totalHeight });

    } else if (cvData) {
      // ── FALLBACK: SSR via React renderToStaticMarkup ───────────────────────
      // Used when renderedHtml is absent (direct API calls / old clients).
      // Layout may differ slightly from the browser preview due to SSR vs live-DOM
      // rendering differences (font metrics, hook side-effects, etc.).
      console.log('[PDF] source: SSR fallback — template:', templateId, '— pageBreaks:', pageBreaks.length);
      html = await buildAtsHtmlFromReact(cvData, options);

    } else {
      return res.status(400).json({ message: 'renderedHtml or cvData is required' });
    }

    const pdf = await generatePdfFromHtml(html, {
      totalHeight,
      pageBreakCount: pageBreaks.length,
    });

    console.log('[PDF] PDF generated — size (bytes):', pdf.length);

    const name = cvData?.personalInfo?.fullName
      ? `${cvData.personalInfo.fullName} - CV`
      : 'CV';

    res.setHeader('Content-Type',        'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(name)}.pdf"`);
    res.setHeader('Content-Length',       pdf.length);
    res.setHeader('Cache-Control',        'no-store');
    res.setHeader('X-PDF-Source',         renderedHtml ? 'browser-captured' : 'ssr-fallback');
    res.status(200).end(Buffer.from(pdf));
  } catch (err) {
    console.error('[PDF] ERROR:', err.message, err.stack?.slice(0, 500));
    res.status(500).json({ message: err.message || 'PDF generation failed' });
  }
}
