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
  // NOTE: --single-process is intentionally omitted.
  // It eliminates the GPU/compositor subprocess which Chromium relies on to
  // embed fonts as real CIDFont (Type2) glyphs in the PDF.  With it present,
  // Chromium falls back to converting every glyph to a bezier path (Type3),
  // which looks correct on screen but cannot be selected, copied, or parsed
  // by ATS software.
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
  // Prevent glyph-level hinting from triggering path-based fallback rendering
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
 * @param {string} html - Complete HTML document
 * @returns {Promise<Buffer>}
 */
export async function generatePdfFromHtml(html) {
  const browser = await getBrowser();
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: "networkidle0", timeout: 30000 });

    // Ensure every @font-face is fully loaded and flushed into Chromium's
    // internal font pipeline before PDF generation begins.
    //
    // document.fonts.ready resolves when the layout engine is satisfied, but
    // Chromium's PDF compositor has its own pipeline.  The two-stage wait below
    // (explicit per-font load + rAF + 150 ms settle) ensures glyphs are
    // committed as CIDFont (Type2, selectable) rather than as bezier paths
    // (Type3, visually identical but unselectable / ATS-opaque).
    await page.evaluate(async () => {
      // 1. Resolve the global fonts-ready promise
      await document.fonts.ready;

      // 2. Explicitly load every declared @font-face so the browser cannot
      //    defer them as "optional" during PDF rendering
      const loadPromises = [];
      document.fonts.forEach((face) => {
        if (face.status !== "loaded") {
          loadPromises.push(face.load().catch(() => {}));
        }
      });
      if (loadPromises.length) await Promise.all(loadPromises);

      // 3. Yield to the rendering pipeline so compositing is flushed before
      //    Chromium takes the PDF snapshot
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 150)));
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
