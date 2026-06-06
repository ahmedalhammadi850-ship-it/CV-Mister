/**
 * POST /api/pdf/ats
 *
 * Server-side ATS PDF generation using Puppeteer (headless Chromium).
 *
 * HTML is produced by server-rendering the SAME React template component
 * used in the browser preview (via react-dom/server renderToStaticMarkup),
 * so the PDF is a pixel-perfect replica of what the user sees.
 *
 * Text is always 100 % selectable and ATS-parseable because Chromium
 * embeds fonts as real CIDFontType2 glyphs (not rasterised paths).
 *
 * Body:
 *   { cvData, options: { templateId, isRTL, theme, visibleSections,
 *                        visiblePersonalFields, sectionOrder, sectionNames } }
 */

import { getUserFromReq }          from '../_lib/token.js';
import { buildAtsHtmlFromReact }   from '../_lib/atsReactRenderer.js';
import { generatePdfFromHtml }     from '../_lib/puppeteerPdf.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const user = getUserFromReq(req);

  console.log('[PDF-ATS] handler reached — method:', req.method);

  try {
    const { cvData, options = {} } = req.body || {};
    if (!cvData) return res.status(400).json({ message: 'cvData is required' });

    console.log('[PDF-ATS] templateId :', options.templateId);
    console.log('[PDF-ATS] isRTL      :', options.isRTL);
    console.log('[PDF-ATS] userId     :', user?.userId ?? '(unauthenticated)');

    // Build HTML by server-rendering the exact same React component the
    // preview uses — guaranteed visual parity with zero duplication.
    const html = await buildAtsHtmlFromReact(cvData, options);
    const pdf  = await generatePdfFromHtml(html);

    console.log('[PDF-ATS] PDF generated — size (bytes):', pdf.length);

    const name = cvData?.personalInfo?.fullName
      ? `${cvData.personalInfo.fullName} - CV`
      : 'CV';

    res.setHeader('Content-Type',        'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(name)}.pdf"`);
    res.setHeader('Content-Length',       pdf.length);
    res.setHeader('Cache-Control',        'no-store');
    res.setHeader('X-PDF-Source',         'server-puppeteer-react');
    res.status(200).end(Buffer.from(pdf));
  } catch (err) {
    console.error('[PDF-ATS] ERROR:', err.message, err.stack);
    res.status(500).json({ message: err.message || 'PDF generation failed' });
  }
}
