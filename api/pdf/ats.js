/**
 * POST /api/pdf/ats
 *
 * Universal server-side PDF generation using Puppeteer (headless Chromium).
 *
 * TWO RENDERING PATHS:
 *
 *  PRIMARY  — renderedHtml (client supplies browser-rendered outerHTML)
 *    The browser captures the exact HTML it rendered for the live preview and
 *    sends it here.  We wrap it in a minimal Puppeteer document with the same
 *    Google Fonts links.  No re-rendering → fonts, spacing and colours are
 *    pixel-identical to the preview.
 *
 *  FALLBACK — cvData + options (server re-renders the React component)
 *    Used when the client cannot supply pre-rendered HTML.  Font substitution
 *    is applied to minimise visual differences on Linux.
 *
 * Body shape:
 *  {
 *    renderedHtml?: string,   // PRIMARY: innerHTML of the live-preview element
 *    cvData?:       object,   // FALLBACK: raw CV data
 *    options: {
 *      templateId, isRTL, theme, visibleSections,
 *      visiblePersonalFields, sectionOrder, sectionNames,
 *      pageBreaks,   // number[] — pixel y-positions of page breaks
 *      totalHeight,  // number  — total content height in px
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
      // ── PRIMARY PATH ───────────────────────────────────────────────────────
      // Use the exact HTML the browser rendered for the live preview.
      // Pixel-perfect: same fonts, same styles, same layout as what the user sees.
      console.log('[PDF] source: browser-rendered HTML (pixel-perfect mode) — size:', renderedHtml.length, 'chars');
      html = buildHtmlFromRendered(renderedHtml, { isRTL, pageBreaks, totalHeight });
    } else if (cvData) {
      // ── FALLBACK PATH ──────────────────────────────────────────────────────
      // Server-render the React component from raw CV data.
      // Used by older clients or direct API calls.
      console.log('[PDF] source: server SSR fallback');
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
    res.setHeader('X-PDF-Source',         renderedHtml ? 'browser-rendered' : 'server-ssr');
    res.status(200).end(Buffer.from(pdf));
  } catch (err) {
    console.error('[PDF] ERROR:', err.message, err.stack?.slice(0, 500));
    res.status(500).json({ message: err.message || 'PDF generation failed' });
  }
}
