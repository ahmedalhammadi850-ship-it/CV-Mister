/**
 * POST /api/pdf/ats
 *
 * Pixel-perfect PDF generation using server-side React rendering + Puppeteer.
 *
 * RENDERING STRATEGY (primary → fallback):
 *
 *  1. SSR PRIMARY — buildAtsHtmlFromReact(cvData, options)
 *     Always used when cvData is available (which the client always sends).
 *     Renders the EXACT selected template via react-dom/server renderToStaticMarkup.
 *     Templates use 100% inline styles so SSR output is identical to the browser
 *     preview.  Page-break positions (options.pageBreaks + totalHeight) come from
 *     the browser's smart-break algorithm and are forwarded here for multi-page layout.
 *     Fonts are loaded in Puppeteer via the same /api/font-proxy the browser uses,
 *     guaranteeing identical glyph metrics.
 *
 *  2. HTML FALLBACK — buildHtmlFromRendered(renderedHtml, options)
 *     Used only when cvData is absent but the client supplies pre-rendered HTML
 *     (backward-compatible / direct API calls from old clients).
 *
 * WHY SSR AS PRIMARY (not browser-captured innerHTML):
 *  • Works on every environment (Vercel serverless, Replit, bare Node).
 *  • No dependency on the browser's DOM capture timing or off-screen rendering.
 *  • Guaranteed to use the user's SELECTED template — no template mismatch.
 *  • Templates use inline React styles exclusively, so SSR == browser rendering.
 *
 * Body shape:
 *  {
 *    cvData:        object,   // CV data (always required for SSR primary)
 *    renderedHtml?: string,   // browser innerHTML — used only when cvData absent
 *    options: {
 *      templateId,            // MUST match the template shown in the preview
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

    if (cvData) {
      // ── PRIMARY PATH: SSR via React renderToStaticMarkup ───────────────────
      // Always preferred over browser-captured HTML because:
      //   • Guaranteed correct template (templateId from selectedTemplate state)
      //   • Works on every hosting environment
      //   • Templates use inline styles → SSR == browser rendering
      //   • Page-break positions from the browser are forwarded in options.pageBreaks
      console.log('[PDF] source: SSR primary — template:', templateId, '— pageBreaks:', pageBreaks.length);
      html = await buildAtsHtmlFromReact(cvData, options);

    } else if (renderedHtml) {
      // ── FALLBACK: pre-rendered HTML (old clients / direct API calls) ────────
      console.log('[PDF] source: browser-rendered HTML fallback — size:', renderedHtml.length, 'chars');
      html = buildHtmlFromRendered(renderedHtml, { isRTL, pageBreaks, totalHeight });

    } else {
      return res.status(400).json({ message: 'cvData or renderedHtml is required' });
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
    res.setHeader('X-PDF-Source',         cvData ? 'ssr-primary' : 'browser-rendered');
    res.status(200).end(Buffer.from(pdf));
  } catch (err) {
    console.error('[PDF] ERROR:', err.message, err.stack?.slice(0, 500));
    res.status(500).json({ message: err.message || 'PDF generation failed' });
  }
}
