/**
 * POST /api/pdf/ats
 *
 * Server-side ATS PDF generation via Puppeteer.
 * Accepts CV data + options, returns a binary PDF.
 * Auth is optional — unauthenticated users can still export (download log skipped).
 *
 * Body:
 *   { cvData, options: { templateId, isRTL, theme, visibleSections,
 *                        visiblePersonalFields, sectionOrder, sectionNames } }
 */

import { getUserFromReq } from "../_lib/token.js";
import { buildAtsHtml   } from "../_lib/atsHtmlTemplate.js";
import { generatePdfFromHtml } from "../_lib/puppeteerPdf.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  // Auth is optional for PDF generation — we only use it to log the download
  const user = getUserFromReq(req);

  try {
    const { cvData, options = {} } = req.body || {};
    if (!cvData) return res.status(400).json({ message: "cvData is required" });

    const html = await buildAtsHtml(cvData, options);
    const pdf  = await generatePdfFromHtml(html);

    const name = cvData?.personalInfo?.fullName
      ? `${cvData.personalInfo.fullName} - CV`
      : "CV";

    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(name)}.pdf"`);
    res.setHeader("Content-Length",       pdf.length);
    res.setHeader("Cache-Control",        "no-store");
    res.status(200).end(Buffer.from(pdf));
  } catch (err) {
    console.error("[pdf/ats]", err.message);
    res.status(500).json({ message: err.message || "PDF generation failed" });
  }
}
