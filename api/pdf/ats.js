/**
 * POST /api/pdf/ats
 *
 * Universal server-side PDF generation using Puppeteer (headless Chromium).
 * Handles ALL templates — not just ATS — by server-rendering the SAME React
 * component used in the browser preview via react-dom/server renderToStaticMarkup.
 *
 * When pageBreaks are supplied (pixel y-positions computed client-side by the
 * smart-break algorithm in LivePreview), the PDF pages exactly match the page
 * boundaries the user sees in the preview pane.
 *
 * Body:
 *   {
 *     cvData,
 *     options: {
 *       templateId, isRTL, theme, visibleSections,
 *       visiblePersonalFields, sectionOrder, sectionNames,
 *       pageBreaks,   // number[] — pixel y-positions of page breaks (from LivePreview)
 *       totalHeight,  // number  — total template content height in px
 *     }
 *   }
 */

import { getUserFromReq }        from '../_lib/token.js';
import { buildAtsHtmlFromReact } from '../_lib/atsReactRenderer.js';
import { generatePdfFromHtml }   from '../_lib/puppeteerPdf.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  const user = getUserFromReq(req);

  console.log('[PDF] handler reached — method:', req.method);

  try {
    const { cvData, options = {} } = req.body || {};
    if (!cvData) return res.status(400).json({ message: 'cvData is required' });

    const { templateId, isRTL, pageBreaks = [], totalHeight = 1122 } = options;

    console.log('[PDF] templateId  :', templateId);
    console.log('[PDF] isRTL       :', isRTL);
    console.log('[PDF] pageBreaks  :', pageBreaks);
    console.log('[PDF] totalHeight :', totalHeight);
    console.log('[PDF] userId      :', user?.userId ?? '(unauthenticated)');

    // Build HTML by server-rendering the exact same React component the
    // preview uses — guaranteed visual parity with zero duplication.
    // pageBreaks are forwarded so the multi-page HTML matches the preview layout.
    const html = await buildAtsHtmlFromReact(cvData, options);
    const pdf  = await generatePdfFromHtml(html, { totalHeight, pageBreakCount: pageBreaks.length });

    console.log('[PDF] PDF generated — size (bytes):', pdf.length);

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
    console.error('[PDF] ERROR:', err.message, err.stack?.slice(0, 500));
    res.status(500).json({ message: err.message || 'PDF generation failed' });
  }
}
