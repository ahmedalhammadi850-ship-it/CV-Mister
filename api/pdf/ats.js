/**
 * POST /api/pdf/ats
 *
 * Pixel-perfect PDF generation using browser-computed page breaks.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * SINGLE-PASS PIPELINE (browser-captured HTML path):
 *
 *  The client sends:
 *    • renderedHtml  — the exact innerHTML the browser used for the live preview
 *    • pageBreaks    — the break positions computed by computeSmartBreaks()
 *                      in LivePreview.jsx (same values the user sees)
 *    • totalHeight   — scrollHeight of the off-screen measurement container
 *
 *  We build sliced HTML using those browser break positions and hand it to
 *  Puppeteer for rendering.  Because the break positions come from the same
 *  algorithm that drives the preview, the PDF pages are identical to what
 *  the user sees.
 *
 * WHY WE NO LONGER RE-MEASURE IN PUPPETEER (old "2-pass" approach):
 *   Puppeteer (headless Chromium on Linux, --font-render-hinting=none) uses
 *   slightly different character advance widths than the user's desktop browser.
 *   Re-measuring in Puppeteer produced break points that differed from the
 *   preview — sections moved between pages, content appeared in unexpected
 *   positions.  Trusting the browser's own measurements gives the user
 *   exactly what they saw in the preview.
 *
 * SSR FALLBACK (no renderedHtml):
 *   Used for direct API calls or old clients that don't supply pre-rendered
 *   HTML.  Page-break positions come from the browser (forwarded in options).
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
 *      pageBreaks,   // number[] — browser break positions (used directly)
 *      totalHeight,  // number  — browser scrollHeight
 *    }
 *  }
 */

import { getUserFromReq }                              from '../_lib/token.js';
import { buildHtmlFromRendered, buildAtsHtmlFromReact } from '../_lib/atsReactRenderer.js';
import { generatePdfFromHtml }                          from '../_lib/puppeteerPdf.js';

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
    let finalPageBreakCount = pageBreaks.length;

    if (renderedHtml) {
      // ── SINGLE-PASS PATH: use browser-computed break positions ─────────────
      //
      // The browser already computed the correct break positions via the same
      // computeSmartBreaks() algorithm that drives the live preview.  We use
      // those positions directly — no Puppeteer re-measurement needed.
      console.log('[PDF] source: browser-captured HTML — size:', renderedHtml.length, 'chars');
      console.log('[PDF] using browser breaks:', pageBreaks.length, 'break(s)');

      html = buildHtmlFromRendered(renderedHtml, {
        isRTL,
        pageBreaks,
        totalHeight,
      });
      finalPageBreakCount = pageBreaks.length;

    } else if (cvData) {
      // ── SSR FALLBACK: server-render from raw CV data ───────────────────────
      console.log('[PDF] source: SSR fallback — template:', templateId, '— pageBreaks:', pageBreaks.length);
      html = await buildAtsHtmlFromReact(cvData, options);
      finalPageBreakCount = pageBreaks.length;

    } else {
      return res.status(400).json({ message: 'renderedHtml or cvData is required' });
    }

    console.log('[PDF] generating PDF…');
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
    res.setHeader('X-PDF-Source',         renderedHtml ? 'browser-single-pass' : 'ssr-fallback');
    res.status(200).end(Buffer.from(pdf));
  } catch (err) {
    console.error('[PDF] ERROR:', err.message, err.stack?.slice(0, 500));
    res.status(500).json({ message: err.message || 'PDF generation failed' });
  }
}
