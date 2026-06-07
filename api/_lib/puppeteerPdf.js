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
 *
 * 2-PASS PDF GENERATION (for browser-captured HTML):
 *   Pass 1 — measureBreaks(html): renders the unsliced template, computes smart
 *             page-break positions from Puppeteer's own layout engine.
 *   Pass 2 — generatePdfFromHtml(slicedHtml): renders the sliced HTML and exports PDF.
 *
 * This eliminates browser↔Puppeteer font-metric discrepancies: the page breaks
 * are derived from the SAME rendering that produces the PDF, so content always
 * falls on the correct page.
 */

import puppeteer from "puppeteer-core";
import { execSync } from "child_process";

let _browser = null;

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;

  // Prefer Nix-store chromium (contains its own shared libraries); skip /tmp paths
  // which are puppeteer-downloaded binaries that lack system NSS/libnss3.
  const candidates = [
    // Nix profile paths
    "/nix/var/nix/profiles/default/bin/chromium",
    "/run/current-system/sw/bin/chromium",
    // Standard Linux paths
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
  ];

  // Try `which` but reject anything in /tmp
  for (const cmd of ["chromium", "chromium-browser"]) {
    try {
      const p = execSync(`which ${cmd} 2>/dev/null`).toString().trim();
      if (p && !p.startsWith("/tmp")) return p;
    } catch (_) {}
  }

  // Try nix-store path via readlink resolution
  try {
    const nixPath = execSync(
      "readlink -f $(which chromium 2>/dev/null) 2>/dev/null"
    ).toString().trim();
    if (nixPath && !nixPath.startsWith("/tmp")) return nixPath;
  } catch (_) {}

  for (const c of candidates) {
    try {
      execSync(`test -x "${c}"`, { stdio: "ignore" });
      return c;
    } catch (_) {}
  }

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

// Vercel-specific Chromium URL for @sparticuz/chromium-min
// Must match the chromium-min version installed in package.vercel.json.
// v149+ uses architecture-specific pack names (pack.x64.tar / pack.arm64.tar).
const SPARTICUZ_CHROMIUM_URL =
  "https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar";

async function getBrowser() {
  if (_browser) {
    try {
      const pages = await _browser.pages();
      if (pages !== null) return _browser;
    } catch (_) {
      _browser = null;
    }
  }

  let executablePath;
  let launchArgs = LAUNCH_ARGS;
  let headless = true;

  if (process.env.VERCEL) {
    const chromium = (await import("@sparticuz/chromium-min")).default;
    executablePath = await chromium.executablePath(SPARTICUZ_CHROMIUM_URL);
    // v149 args already include --no-sandbox, --no-zygote, --headless='shell', etc.
    // Merge but avoid duplicating flags already in chromium.args.
    launchArgs = [...chromium.args, "--font-render-hinting=none", "--disable-dev-shm-usage"];
    // v149 uses --headless='shell' via args; pass headless:false so puppeteer
    // doesn't add its own conflicting --headless flag.
    headless = false;
    console.log(`[Puppeteer] Vercel — sparticuz Chromium v149 at: ${executablePath}`);
  } else {
    executablePath = findChromium();
    console.log(`[Puppeteer] Launching Chromium at: ${executablePath}`);
  }

  _browser = await puppeteer.launch({
    executablePath,
    headless,
    args: launchArgs,
  });
  _browser.on("disconnected", () => { _browser = null; });
  return _browser;
}

process.on("exit", () => { if (_browser) _browser.close().catch(() => {}); });

/**
 * Shared helper — open a page, set content, wait for fonts.
 * Returns the Puppeteer Page object (caller must close it).
 */
async function _openPage(html, viewportHeight = 1122) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setViewport({ width: 794, height: viewportHeight, deviceScaleFactor: 1 });
  await page.emulateMediaType("screen");

  const opts = { waitUntil: "networkidle0", timeout: 30000 };
  if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3001;
    opts.baseURL = `http://127.0.0.1:${PORT}`;
  }
  await page.setContent(html, opts);

  // Wait for every @font-face to fully load and flush into the rendering pipeline
  await page.evaluate(async () => {
    await document.fonts.ready;
    const pending = [];
    document.fonts.forEach(f => {
      if (f.status !== "loaded") pending.push(f.load().catch(() => {}));
    });
    if (pending.length) await Promise.all(pending);
    // Two rAF ticks so the compositor has fully applied font metrics
    await new Promise(r =>
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 150)))
    );
  });

  return page;
}

// ── Constants shared with LivePreview.jsx ────────────────────────────────────
const PAGE_H  = 1122;  // A4 height at 96 dpi  (must match LivePreview.jsx)
const MARGIN  =   48;  // top/bottom page margin (must match LivePreview.jsx)
const MIN_PAGE_CONTENT = 200; // minimum content per page (must match LivePreview.jsx)
// Heading orphan threshold — must match HEADING_ORPHAN_PX in LivePreview.jsx.
const HEADING_ORPHAN_PX = 40;

/**
 * Pass 1 — measure smart page-break positions using Puppeteer's own layout.
 *
 * Renders the UNSLICED template HTML, then runs the same smart-break algorithm
 * as LivePreview.jsx inside Puppeteer's JavaScript engine so the measurements
 * reflect Puppeteer's exact font metrics rather than the user's browser.
 *
 * @param   {string} html  — Complete HTML document (single-page, no slices)
 * @returns {Promise<{breaks: number[], totalHeight: number}>}
 */
export async function measureBreaks(html) {
  // Very tall viewport so nothing is clipped during measurement
  const page = await _openPage(html, 10000);
  try {
    const result = await page.evaluate((PAGE_H, MARGIN, MIN_PAGE_CONTENT, HEADING_ORPHAN_PX) => {
      // The template root div is the first child of <body>
      const container = document.body.firstElementChild;
      if (!container) return { breaks: [], totalHeight: PAGE_H };

      const totalHeight = container.scrollHeight;
      if (totalHeight <= PAGE_H) return { breaks: [], totalHeight };

      // Mirror of computeSmartBreaks in LivePreview.jsx
      const containerTop = container.getBoundingClientRect().top;

      const candidates = Array.from(container.querySelectorAll("*")).filter(el => {
        const s = getComputedStyle(el);
        return (
          s.breakInside      === "avoid" ||
          s.pageBreakInside  === "avoid" ||
          s.breakAfter       === "avoid" ||
          s.pageBreakAfter   === "avoid"
        );
      });

      const breaks = [];
      let pageStart = 0;

      while (pageStart + PAGE_H < totalHeight) {
        const rawBreak = pageStart + PAGE_H - MARGIN;
        let bestBreak = rawBreak;

        // Do NOT push elements based on break-inside:avoid — causes large gaps.
        // Only fix orphaned headings: if an h1/h2/h3 ends within HEADING_ORPHAN_PX
        // of the break, pull the break back to before the heading.
        container.querySelectorAll('h1, h2, h3').forEach(heading => {
          const rect = heading.getBoundingClientRect();
          const hTop = rect.top    - containerTop;
          const hBot = rect.bottom - containerTop;
          if (
            hBot > pageStart + MARGIN &&
            hBot <= bestBreak &&
            (bestBreak - hBot) <= HEADING_ORPHAN_PX
          ) {
            bestBreak = Math.min(bestBreak, hTop);
          }
        });

        breaks.push(bestBreak);
        pageStart = bestBreak;
      }

      return { breaks, totalHeight };
    }, PAGE_H, MARGIN, MIN_PAGE_CONTENT, HEADING_ORPHAN_PX);

    console.log(
      `[Puppeteer] measureBreaks → totalHeight: ${result.totalHeight}px, breaks: ${result.breaks.length}`
    );
    return result;
  } finally {
    await page.close().catch(() => {});
  }
}

/**
 * Pass 2 — generate a PDF buffer from a pre-built HTML document.
 *
 * @param {string} html              — Complete HTML document (may include page slices)
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

  const page = await _openPage(html, viewportHeight);
  try {
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
