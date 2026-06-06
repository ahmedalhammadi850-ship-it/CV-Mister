/**
 * puppeteerPdf.js
 *
 * Singleton Puppeteer browser manager + PDF-from-HTML utility.
 * Chromium is provided by the system (Nix package).
 */

import puppeteer from "puppeteer-core";
import { execSync } from "child_process";

let _browser = null;

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  try {
    return execSync("which chromium 2>/dev/null").toString().trim();
  } catch (_) {}
  try {
    return execSync("which chromium-browser 2>/dev/null").toString().trim();
  } catch (_) {}
  return "/usr/bin/chromium";
}

const LAUNCH_ARGS = [
  "--no-sandbox",
  "--disable-setuid-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--no-zygote",
  "--disable-extensions",
  "--disable-background-networking",
  "--disable-default-apps",
  "--disable-sync",
  "--disable-translate",
  "--hide-scrollbars",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-first-run",
  "--safebrowsing-disable-auto-update",
  // Preserve font hinting so glyphs are embedded as real CIDFont (Type2)
  // rather than bezier paths (Type3) in the PDF — keeps text selectable/ATS-readable.
  "--font-render-hinting=none",
];

async function getBrowser() {
  if (_browser) {
    try {
      const pages = await _browser.pages();
      if (pages !== null) return _browser;
    } catch (_) {
      _browser = null;
    }
  }
  const executablePath = findChromium();
  console.log(`[Puppeteer] Launching Chromium at: ${executablePath}`);
  _browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: LAUNCH_ARGS,
  });
  _browser.on("disconnected", () => { _browser = null; });
  return _browser;
}

process.on("exit", () => { if (_browser) _browser.close().catch(() => {}); });

/**
 * Generate a PDF buffer from an HTML string.
 *
 * @param {string} html              - Complete HTML document
 * @param {object} [opts]
 * @param {number} [opts.totalHeight=1122]     - Total template content height in px.
 *   Used to set a viewport tall enough to lay out the full document before
 *   Puppeteer captures the PDF (avoids partial-layout issues with multi-page docs).
 * @param {number} [opts.pageBreakCount=0]     - Number of explicit page breaks.
 *   When > 0, the HTML uses .page-slice containers for per-slice layout.
 * @returns {Promise<Buffer>}
 */
export async function generatePdfFromHtml(html, opts = {}) {
  const { totalHeight = 1122, pageBreakCount = 0 } = opts;

  // For multi-page documents, set the viewport tall enough to hold all slices.
  // Each slice is exactly 1122px (A4 at 96 dpi); single-page uses 1122px.
  const viewportHeight = pageBreakCount > 0
    ? Math.ceil((pageBreakCount + 1) * 1122)
    : Math.max(1122, Math.ceil(totalHeight));

  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 794, height: viewportHeight, deviceScaleFactor: 1 });

    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    // Ensure every @font-face is fully loaded and flushed into Chromium's
    // internal font pipeline before PDF generation begins.
    await page.evaluate(async () => {
      await document.fonts.ready;

      const loadPromises = [];
      document.fonts.forEach((face) => {
        if (face.status !== "loaded") {
          loadPromises.push(face.load().catch(() => {}));
        }
      });
      if (loadPromises.length) await Promise.all(loadPromises);

      // Yield to the rendering pipeline so compositing is flushed
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 200)));
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    });
    return pdf;
  } finally {
    await page.close().catch(() => {});
  }
}
