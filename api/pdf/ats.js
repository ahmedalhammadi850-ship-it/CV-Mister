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
 *    Puppeteer's font metrics, NOT the browser's.  This eliminates the
 *    browser↔Puppeteer font-metric discrepancy that caused content to land on
 *    the wrong page.
 *
 *  Pass 2 — buildHtmlFromRendered(renderedHtml, puppeteerBreaks)
 *            → generatePdfFromHtml(slicedHtml)
 *    The sliced HTML is built using the breaks measured in pass 1, then
 *    rendered to PDF.  Because the breaks come from the same rendering engine
 *    that produces the final output, content always falls on the correct page.
 *
 * WHY THE 2-PASS APPROACH FIXES THE MISMATCH:
 *   The user's browser (Chrome on Windows/Mac) renders fonts with OS-level
 *   hinting and sub-pixel antialiasing.  Puppeteer (headless Chromium on
 *   Linux, --font-render-hinting=none) renders the same font files with
 *   slightly different character advance widths.  Over many lines of text the
 *   difference accumulates — a section that ended at y=900 in the browser may
 *   end at y=920 in Puppeteer.  If we slice at the browser's y=900, the PDF
 *   clips the section mid-way.  Measuring in Puppeteer first and slicing at
 *   its own y=920 gives a perfect result.
 *
 * SSR FALLBACK (no renderedHtml):
 *   Used for direct API calls or old clients that don't supply pre-rendered
 *   HTML.  Page-break positions come from the browser (forwarded in options).
 *   Layout may differ slightly from the preview.
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Body shape:
 *  {
 *    cvData:        object,   // CV data — used for filename + SSR fallback
 *    renderedHtml?: string,   // browser innerHTML — primary PDF source
 *    options: {
 *      templateId,
 *      isRTL, theme,
 *      visibleSections, visiblePersonalFields, sectionOrder, sectionNames,
 *      pageBreaks,   // number[] — browser breaks (ignored in 2-pass; kept for SSR fallback)
 *      totalHeight,  // number  — browser totalHeight (ignored in 2-pass; kept for SSR fallback)
 *    }
 *  }
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
      // Pass 1: build an unsliced HTML document and render it in Puppeteer to
      //         get page-break positions measured by Puppeteer's own engine.
      console.log('[PDF] source: browser-captured HTML (2-pass) — size:', renderedHtml.length, 'chars');

      const singlePageHtml = buildHtmlFromRendered(renderedHtml, {
        isRTL,
        pageBreaks: [],   // no slicing — measure the full template
        totalHeight: 99999,
      });

      console.log('[PDF] Pass 1: measuring page breaks in Puppeteer…');
      const { breaks: puppeteerBreaks, totalHeight: puppeteerHeight } =
        await measureBreaks(singlePageHtml);

      console.log('[PDF] Pass 1 done — puppeteerBreaks:', puppeteerBreaks, '| puppeteerHeight:', puppeteerHeight);

      // Pass 2: build sliced HTML using Puppeteer's own measurements.
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
