/**
 * POST /api/pdf/ats
 *
 * Pixel-perfect PDF generation.
 *
 * ════════════════════════════════════════════════════════════════════════════
 * PRIMARY PATH — Preview is the Source of Truth (browser-captured HTML):
 *
 *   The browser already computed correct page-break positions in LivePreview
 *   via computeSmartBreaks().  Those positions are forwarded here in
 *   options.pageBreaks.  We use them directly — no Puppeteer re-measurement.
 *
 *   Why this is safe:
 *     • renderedHtml is the browser's exact DOM innerHTML — same HTML that
 *       produced the preview the user sees.
 *     • page-break positions come from the same DOM measurement (scrollHeight,
 *       getBoundingClientRect) that drove the preview layout.
 *     • Puppeteer renders that same HTML; the LAST_PAGE_SSR_BUFFER (+200 px)
 *       in atsReactRenderer.js absorbs any sub-pixel font-metric drift so
 *       the last page never clips content.
 *
 *   Result: PDF pages ≡ Preview pages (same sections, same boundaries).
 *
 * FALLBACK — Puppeteer re-measurement (no preview breaks available):
 *
 *   Used when options.pageBreaks is empty (old clients or SSR-only calls).
 *   Puppeteer renders the full template and runs the smart-break algorithm
 *   itself.  This path existed previously as "Pass 1" and is kept for
 *   backwards-compatibility only.
 *
 * SSR FALLBACK (no renderedHtml):
 *   Used for direct API calls.  Breaks come from options.pageBreaks.
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
    const {
      templateId, isRTL,
      theme, visibleSections, visiblePersonalFields, sectionOrder, sectionNames,
      pageBreaks: previewBreaks = [],
      totalHeight: previewTotalHeight = 1122,
    } = options;

    console.log('[PDF] templateId  :', templateId);
    console.log('[PDF] isRTL       :', isRTL);
    console.log('[PDF] userId      :', user?.userId ?? '(unauthenticated)');

    let html;
    let finalBreaks;
    let finalHeight;
    let debugReport = null;

    if (renderedHtml) {
      // ── PRIMARY PATH: browser-captured HTML + preview breaks ──────────────

      console.log('[PDF] source: browser-captured HTML — size:', renderedHtml.length, 'chars');
      console.log('[PDF] Preview Page Breaks:', JSON.stringify(previewBreaks));

      if (previewBreaks && previewBreaks.length > 0) {
        // ── USE PREVIEW BREAKS DIRECTLY (source of truth) ────────────────
        finalBreaks = previewBreaks;
        finalHeight = previewTotalHeight;

        console.log('[PDF] Using preview breaks directly (no Puppeteer re-measurement).');
        console.log('[PDF] PDF Page Breaks   :', JSON.stringify(finalBreaks));
        console.log('[PDF] Match: TRUE — Preview breaks == PDF breaks');

        debugReport = {
          source: 'preview',
          previewBreaks,
          pdfBreaks: finalBreaks,
          match: true,
        };

      } else {
        // ── FALLBACK: no preview breaks — measure in Puppeteer ───────────
        console.log('[PDF] No preview breaks provided — falling back to Puppeteer measurement.');

        const singlePageHtml = buildHtmlFromRendered(renderedHtml, {
          isRTL,
          pageBreaks:  [],
          totalHeight: 99999,
        });

        const { breaks: puppeteerBreaks, totalHeight: puppeteerHeight, pageReport } =
          await measureBreaks(singlePageHtml);

        console.log('[PDF] Puppeteer Page Breaks:', JSON.stringify(puppeteerBreaks));
        console.log('[PDF] Preview Page Breaks  :', JSON.stringify(previewBreaks));
        console.log('[PDF] Match: N/A — no preview breaks to compare');

        if (pageReport && pageReport.length > 0) {
          console.log('[PDF] Page-break report:', JSON.stringify(pageReport, null, 2));
        }

        finalBreaks = puppeteerBreaks;
        finalHeight = puppeteerHeight;

        debugReport = {
          source: 'puppeteer-fallback',
          previewBreaks,
          pdfBreaks: finalBreaks,
          match: false,
          pageReport,
        };
      }

      html = buildHtmlFromRendered(renderedHtml, {
        isRTL,
        pageBreaks:  finalBreaks,
        totalHeight: finalHeight,
      });

    } else if (cvData) {
      // ── SSR FALLBACK: server-render from raw CV data ─────────────────────
      console.log('[PDF] source: SSR fallback — template:', templateId, '— pageBreaks:', previewBreaks.length);
      html = await buildAtsHtmlFromReact(cvData, options);
      finalBreaks = previewBreaks;
      finalHeight = previewTotalHeight;

      debugReport = {
        source: 'ssr',
        previewBreaks,
        pdfBreaks: previewBreaks,
        match: true,
      };

    } else {
      return res.status(400).json({ message: 'renderedHtml or cvData is required' });
    }

    // ── Debug: detect first differing break if needed ───────────────────────
    if (debugReport && !debugReport.match && debugReport.previewBreaks?.length > 0 && debugReport.pdfBreaks?.length > 0) {
      const p = debugReport.previewBreaks;
      const d = debugReport.pdfBreaks;
      const minLen = Math.min(p.length, d.length);
      for (let i = 0; i < minLen; i++) {
        if (Math.abs(p[i] - d[i]) > 1) {
          console.log(`[PDF] First differing break at index ${i}: Preview=${p[i]}px  PDF=${d[i]}px  Δ=${d[i] - p[i]}px`);
          debugReport.firstDiff = { index: i, preview: p[i], pdf: d[i], delta: d[i] - p[i] };
          break;
        }
      }
      if (!debugReport.firstDiff && p.length !== d.length) {
        console.log(`[PDF] Page count mismatch: Preview has ${p.length + 1} pages, PDF has ${d.length + 1} pages`);
        debugReport.firstDiff = { pageCountMismatch: true, previewPages: p.length + 1, pdfPages: d.length + 1 };
      }
    }

    console.log('[PDF] Generating PDF…');
    const pdf = await generatePdfFromHtml(html, {
      totalHeight: finalHeight,
      pageBreakCount: finalBreaks.length,
    });

    console.log('[PDF] PDF generated — size (bytes):', pdf.length);

    const name = cvData?.personalInfo?.fullName
      ? `${cvData.personalInfo.fullName} - CV`
      : 'CV';

    res.setHeader('Content-Type',        'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(name)}.pdf"`);
    res.setHeader('Content-Length',       pdf.length);
    res.setHeader('Cache-Control',        'no-store');
    res.setHeader('X-PDF-Source',         debugReport?.source ?? 'unknown');
    res.setHeader('X-PDF-Break-Match',    debugReport?.match ? 'true' : 'false');
    if (debugReport) {
      res.setHeader('X-PDF-Debug', JSON.stringify({
        previewBreaks: debugReport.previewBreaks,
        pdfBreaks:     debugReport.pdfBreaks,
        match:         debugReport.match,
        ...(debugReport.firstDiff ? { firstDiff: debugReport.firstDiff } : {}),
      }));
    }

    res.status(200).end(Buffer.from(pdf));
  } catch (err) {
    console.error('[PDF] ERROR:', err.message, err.stack?.slice(0, 500));
    res.status(500).json({ message: err.message || 'PDF generation failed' });
  }
}
