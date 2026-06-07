/**
 * POST /api/pdf/ats
 *
 * Pixel-perfect PDF generation using a 2-pass Puppeteer approach.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * 2-PASS PIPELINE (browser-captured HTML path):
 *
 *  Pass 1 — measureBreaks(singlePageHtml)
 *    Puppeteer renders the unsliced template and runs the smart-break algorithm
 *    in its own JavaScript engine.  Page-break positions are derived from
 *    Puppeteer's font metrics, NOT the browser's.
 *
 *    The algorithm now correctly handles:
 *      • break-inside:avoid  — pulls breaks before element boundaries (MAX_PULL cap)
 *      • break-after:avoid   — detects heading wrappers (div/h2/etc.) with 120px window
 *
 *  Pass 2 — buildHtmlFromRendered(renderedHtml, puppeteerBreaks)
 *            → generatePdfFromHtml(slicedHtml)
 *    The sliced HTML is built using the breaks measured in pass 1, then
 *    rendered to PDF.  Because the breaks come from the same rendering engine
 *    that produces the final output, content always lands on the correct page
 *    and section headings are never orphaned.
 *
 * WHY 2-PASS (NOT browser breaks):
 *   The user's browser (Chrome on Windows/Mac) renders fonts with OS-level
 *   hinting and sub-pixel antialiasing.  Puppeteer (headless Chromium on
 *   Linux, --font-render-hinting=none) renders fonts with slightly different
 *   character advance widths.  Over many lines the difference accumulates.
 *   If we use the browser's breaks, Puppeteer may render text taller, causing
 *   content to overflow and be clipped.  Measuring IN Puppeteer ensures the
 *   breaks always match Puppeteer's own rendering → no overflow, no clipping.
 *
 * SSR FALLBACK (no renderedHtml):
 *   Used for direct API calls or old clients.  Breaks come from the browser.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { getUserFromReq }                              from '../_lib/token.js';
import { buildHtmlFromRendered, buildAtsHtmlFromReact } from '../_lib/atsReactRenderer.js';
import { measureBreaks, generatePdfFromHtml }           from '../_lib/puppeteerPdf.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const user = getUserFromReq(req);
  console.log('[PDF] handler reached — method:', req.method);

  try {
    const { cvData, renderedHtml, options = {} } = req.body || {};
    const { templateId, isRTL, pageBreaks = [], totalHeight = 1122 } = options;

    console.log('[PDF] templateId  :', templateId);
    console.log('[PDF] isRTL       :', isRTL);
    console.log('[PDF] userId      :', user?.userId ?? '(unauthenticated)');

    let html;
    let finalPageBreakCount = pageBreaks.length;

    if (renderedHtml) {
      // ── 2-PASS PATH: browser-captured HTML ────────────────────────────────
      //
      // Pass 1: render the FULL template (no slices) in Puppeteer so that
      //         break positions are measured by Puppeteer's own font engine.
      console.log('[PDF] source: browser-captured HTML (2-pass) — size:', renderedHtml.length, 'chars');

      const singlePageHtml = buildHtmlFromRendered(renderedHtml, {
        isRTL,
        pageBreaks:  [],     // no slicing — measure the full single-page template
        totalHeight: 99999,
      });

      console.log('[PDF] Pass 1: measuring page breaks in Puppeteer…');
      const { breaks: puppeteerBreaks, totalHeight: puppeteerHeight } =
        await measureBreaks(singlePageHtml);

      console.log('[PDF] Pass 1 done — puppeteerBreaks:', puppeteerBreaks, '| puppeteerHeight:', puppeteerHeight);

      // Pass 2: slice HTML using Puppeteer's own measured breaks.
      html = buildHtmlFromRendered(renderedHtml, {
        isRTL,
        pageBreaks:  puppeteerBreaks,
        totalHeight: puppeteerHeight,
      });
      finalPageBreakCount = puppeteerBreaks.length;

    } else if (cvData) {
      // ── SSR FALLBACK: server-render from raw CV data ───────────────────────
      console.log('[PDF] source: SSR fallback — template:', templateId, '— pageBreaks:', pageBreaks.length);
      html = await buildAtsHtmlFromReact(cvData, options);
      finalPageBreakCount = pageBreaks.length;

    } else {
      return res.status(400).json({ message: 'renderedHtml or cvData is required' });
    }

    console.log('[PDF] Pass 2: generating PDF…');
    const pdf = await generatePdfFromHtml(html, {
      totalHeight,
      pageBreakCount: finalPageBreakCount,
    });

    console.log('[PDF] PDF generated — size (bytes):', pdf.length);

    const name = cvData?.personalInfo?.fullName
      ? `${cvData.personalInfo.fullName} - CV`
      : 'CV';

    res.setHeader('Content-Type',        'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(name)}.pdf"`);
    res.setHeader('Content-Length',       pdf.length);
    res.setHeader('Cache-Control',        'no-store');
    res.setHeader('X-PDF-Source',         renderedHtml ? 'browser-2pass' : 'ssr-fallback');
    res.status(200).end(Buffer.from(pdf));
  } catch (err) {
    console.error('[PDF] ERROR:', err.message, err.stack?.slice(0, 500));
    res.status(500).json({ message: err.message || 'PDF generation failed' });
  }
}
