/**
 * puppeteerPdf.js
 *
 * Singleton Puppeteer browser manager + PDF-from-HTML utility.
 * Chromium is provided by the system (Nix package).
 *
 * IMPORTANT: We call page.emulateMediaType('screen') before rendering.
 * Without this, Chromium switches to print-mode when page.pdf() is called,
 * which applies different default CSS (stripping backgrounds, changing spacing,
 * ignoring screen-only rules) and makes the PDF look different from the preview.
 * Forcing 'screen' mode makes Chromium render exactly as the browser preview does.
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
 * @param {number} [opts.totalHeight=1122]
 * @param {number} [opts.pageBreakCount=0]
 * @returns {Promise<Buffer>}
 */
export async function generatePdfFromHtml(html, opts = {}) {
  const { totalHeight = 1122, pageBreakCount = 0 } = opts;

  const viewportHeight = pageBreakCount > 0
    ? Math.ceil((pageBreakCount + 1) * 1122)
    : Math.max(1122, Math.ceil(totalHeight));

  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 794, height: viewportHeight, deviceScaleFactor: 1 });

    // ── CRITICAL: Force screen media type ─────────────────────────────────────
    // By default, page.pdf() puts Chromium in "print" media mode, which applies
    // different default browser styles than what the user sees in the preview
    // (which is always "screen" mode). Forcing "screen" here makes Chromium
    // render with exactly the same CSS rules as the live preview — ensuring
    // fonts, spacing, backgrounds, and element sizing are pixel-identical.
    await page.emulateMediaType('screen');

    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for every @font-face to fully load and flush into the rendering pipeline
    await page.evaluate(async () => {
      await document.fonts.ready;
      const loadPromises = [];
      document.fonts.forEach((face) => {
        if (face.status !== "loaded") {
          loadPromises.push(face.load().catch(() => {}));
        }
      });
      if (loadPromises.length) await Promise.all(loadPromises);
      // Two rAF ticks to ensure compositing is flushed before capture
      await new Promise(resolve =>
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(resolve, 150)))
      );
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
