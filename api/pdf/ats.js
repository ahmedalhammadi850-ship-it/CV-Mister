/**
 * POST /api/pdf/ats
 *
 * Server-side ATS PDF generation using jsPDF native text operators.
 * Every character is written with doc.text() — no html2canvas, no addImage,
 * no Puppeteer.  Text is always 100 % selectable and ATS-parseable.
 *
 * Works identically on Replit (Express) and Vercel (serverless Lambda)
 * because it has no dependency on Chromium or any system-level binary.
 *
 * Body:
 *   { cvData, options: { templateId, isRTL, theme, visibleSections,
 *                        visiblePersonalFields, sectionOrder, sectionNames } }
 */

import { getUserFromReq }       from "../_lib/token.js";
import { generateATSPdfBuffer } from "../_lib/atsServerPdf.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const user = getUserFromReq(req);

  console.log("[PDF-DEBUG][api/pdf/ats] handler reached — method:", req.method);

  try {
    const { cvData, options = {} } = req.body || {};
    if (!cvData) return res.status(400).json({ message: "cvData is required" });

    console.log("[PDF-DEBUG][api/pdf/ats] templateId :", options.templateId);
    console.log("[PDF-DEBUG][api/pdf/ats] isRTL      :", options.isRTL);
    console.log("[PDF-DEBUG][api/pdf/ats] userId     :", user?.userId ?? "(unauthenticated)");

    const pdf = await generateATSPdfBuffer(cvData, options);

    console.log("[PDF-DEBUG][api/pdf/ats] PDF generated — size (bytes):", pdf.length);

    const name = cvData?.personalInfo?.fullName
      ? `${cvData.personalInfo.fullName} - CV`
      : "CV";

    res.setHeader("Content-Type",        "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(name)}.pdf"`);
    res.setHeader("Content-Length",       pdf.length);
    res.setHeader("Cache-Control",        "no-store");
    res.setHeader("X-PDF-Source",        "server-jspdf");
    res.status(200).end(Buffer.from(pdf));
  } catch (err) {
    console.error("[PDF-DEBUG][api/pdf/ats] ERROR:", err.message, err.stack);
    res.status(500).json({ message: err.message || "PDF generation failed" });
  }
}
