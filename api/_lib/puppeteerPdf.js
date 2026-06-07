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
  // "slight" hinting is closer to what desktop Chrome uses on Windows/macOS,
  // reducing the character-advance discrepancy that caused Puppeteer to measure
  // content ~10-20% taller than the browser preview (leading to PDF=2 pages
  // when Preview=1 page).  "none" produced mathematically-pure but OS-mismatched
  // metrics; "slight" aligns pixel advances without sacrificing cross-platform
  // consistency on Linux Chromium.
  "--font-render-hinting=slight",
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
    launchArgs = [...chromium.args, "--font-render-hinting=slight", "--disable-dev-shm-usage"];
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

// Must stay in sync with ALL_GOOGLE_FONTS_URL in api/_lib/atsReactRenderer.js.
// Contains every font used by all templates so one proxy fetch covers all of them.
const ALL_GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?' +
  'family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400' +
  '&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400' +
  '&family=Inter:wght@400;500;600;700;800' +
  '&family=Merriweather:ital,wght@0,300;0,400;0,700;1,400' +
  '&family=Outfit:wght@400;500;600;700;800' +
  '&family=Tajawal:wght@300;400;500;700' +
  '&family=Cairo:wght@300;400;600;700' +
  '&family=Amiri:ital,wght@0,400;0,700;1,400' +
  '&family=Noto+Naskh+Arabic:wght@400;500;600;700' +
  '&family=Scheherazade+New:wght@400;700' +
  '&display=swap';

/**
 * Shared helper — open a page, set content, inject fonts, wait for fonts.
 * Returns the Puppeteer Page object (caller must close it).
 *
 * FONT INJECTION STRATEGY
 * -----------------------
 * Puppeteer headless Chrome on Linux does NOT reliably process <link rel="stylesheet">
 * elements during page.setContent() — even with waitUntil:"networkidle0" the
 * @font-face rules may never be registered (document.fonts shows 0 entries).
 * Without web fonts the page renders with the Linux system font (DejaVu/Liberation),
 * which is ~20% wider than Inter → content measures ~200 px taller in Puppeteer
 * than in the browser → wrong page count.
 *
 * Fix: fetch the Google Fonts CSS server-side using Node.js fetch() (always
 * reliable), rewrite relative /api/font-file?url= paths to absolute
 * http://127.0.0.1:PORT/api/font-file?url= URLs (so Chromium can load the
 * font files without depending on the page's base URL setting), then inject
 * the result via page.addStyleTag({ content }) which is guaranteed to be
 * registered before the font-wait evaluate runs.
 */
async function _openPage(html, viewportHeight = 1122) {
  const browser = await getBrowser();
  const page = await browser.newPage();

  await page.setViewport({ width: 794, height: viewportHeight, deviceScaleFactor: 1 });
  await page.emulateMediaType("screen");

  const opts = { waitUntil: "networkidle0", timeout: 30000 };
  const PORT = process.env.PORT || 3001;
  if (!process.env.VERCEL) {
    opts.baseURL = `http://127.0.0.1:${PORT}`;
  }
  await page.setContent(html, opts);

  // ── Force-inject font CSS via server-side fetch + addStyleTag ──────────────
  // (skipped on Vercel where Chromium has direct internet access and the <link>
  //  tag uses the real Google Fonts URL, which works fine)
  if (!process.env.VERCEL) {
    try {
      const proxyCssUrl =
        `http://127.0.0.1:${PORT}/api/font-proxy?url=` +
        encodeURIComponent(ALL_GOOGLE_FONTS_URL);
      const cssResp = await fetch(proxyCssUrl, { signal: AbortSignal.timeout(10000) });
      if (cssResp.ok) {
        const css = await cssResp.text();
        // Rewrite relative /api/font-file?url= → absolute http://127.0.0.1:PORT/api/font-file?url=
        // so Chromium can load the actual woff2 files without base-URL resolution.
        const absoluteCss = css.replace(
          /url\(\/api\/font-file\?url=/g,
          `url(http://127.0.0.1:${PORT}/api/font-file?url=`
        );
        await page.addStyleTag({ content: absoluteCss });
        console.log("[Puppeteer] Font CSS injected via addStyleTag");
      } else {
        console.warn(`[Puppeteer] font-proxy returned HTTP ${cssResp.status} — fonts may fall back to system`);
      }
    } catch (err) {
      console.warn("[Puppeteer] Font CSS injection failed:", err.message, "— falling back to system fonts");
    }
  }

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
const HEADING_ORPHAN_PX = 120;
// Max px to pull a break back to avoid splitting a break-inside:avoid element
// OR to handle a heading orphan. Measured from rawBreak so the two adjustments
// cannot compound. Must match MAX_PULL in LivePreview.jsx.
const MAX_PULL = 20;
// PDF_BOTTOM_MARGIN — extra px deducted from the raw break point to leave
// white space at the bottom of each PDF page.
//
// Set to 0: the natural MARGIN (48 px ≈ 36 pt) already provides a comfortable
// bottom-of-page white zone, and adding 20 px more was causing the PDF to break
// 20 px earlier than the preview (rawBreak_PDF=1054 vs rawBreak_Preview=1074),
// producing PDF=2 pages when Preview=1 page for borderline-length resumes.
// With 0, both paths use rawBreak = PAGE_H - MARGIN = 1074, so page capacity is
// identical and the Preview→PDF page count is consistent.
const PDF_BOTTOM_MARGIN = 0;

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
    const result = await page.evaluate((PAGE_H, MARGIN, MIN_PAGE_CONTENT, HEADING_ORPHAN_PX, MAX_PULL, PDF_BOTTOM_MARGIN) => {
      // The template root div is the first child of <body>
      const container = document.body.firstElementChild;
      if (!container) return { breaks: [], totalHeight: PAGE_H };

      const totalHeight = container.scrollHeight;
      if (totalHeight <= PAGE_H) return { breaks: [], totalHeight };

      // Mirror of computeSmartBreaks in LivePreview.jsx, with PDF_BOTTOM_MARGIN
      // subtracted so every page naturally has white space before the page edge.
      const containerTop = container.getBoundingClientRect().top;

      const breaks = [];
      let pageStart = 0;

      while (pageStart + PAGE_H < totalHeight) {
        const rawBreak = pageStart + PAGE_H - MARGIN - PDF_BOTTOM_MARGIN;
        let bestBreak = rawBreak;

        // Avoid splitting elements with break-inside:avoid (e.g. cv item cards).
        // Pull the break back to the element's top when it falls inside one,
        // but only if pulling back stays within MAX_PULL of the raw break point.
        const avoidEls = Array.from(container.querySelectorAll("*")).filter(el => {
          const s = getComputedStyle(el);
          return s.breakInside === "avoid" || s.pageBreakInside === "avoid";
        });

        for (const el of avoidEls) {
          const rect = el.getBoundingClientRect();
          const elTop = rect.top    - containerTop;
          const elBot = rect.bottom - containerTop;

          // Element spans the current candidate break point?
          if (elTop < bestBreak && elBot > bestBreak) {
            // Only pull back if it stays within MAX_PULL of the RAW break point.
            // Using rawBreak (not bestBreak) prevents the heading orphan check
            // below from compounding this pull into a large blank area.
            if (elTop > pageStart + MIN_PAGE_CONTENT && (rawBreak - elTop) <= MAX_PULL) {
              bestBreak = elTop;
            }
          }
        }

        // Orphan fix: any element with break-after:avoid (BREAK_HEADING — section
        // heading wrappers) must NOT be the last visible element on a page.
        // Templates use both <h2> tags AND plain <div>/<section> elements with
        // breakAfter:avoid inline style, so we match on computed style, not tag name.
        // Cap: only move the heading if (rawBreak - hTop) <= MAX_PULL so the two
        // adjustments cannot compound into a large blank gap at the page bottom.
        Array.from(container.querySelectorAll('*')).forEach(el => {
          const cs = getComputedStyle(el);
          if (cs.breakAfter !== 'avoid' && cs.pageBreakAfter !== 'avoid') return;
          const rect = el.getBoundingClientRect();
          const hTop = rect.top    - containerTop;
          const hBot = rect.bottom - containerTop;
          if (
            hBot > pageStart + MARGIN &&
            hBot <= bestBreak &&
            (bestBreak - hBot) <= 120 &&
            (rawBreak - hTop) <= MAX_PULL
          ) {
            bestBreak = Math.min(bestBreak, hTop);
          }
        });

        breaks.push(bestBreak);
        pageStart = bestBreak;
      }

      return { breaks, totalHeight };
    }, PAGE_H, MARGIN, MIN_PAGE_CONTENT, HEADING_ORPHAN_PX, MAX_PULL, PDF_BOTTOM_MARGIN);

    // Diagnostic: log which fonts actually loaded so we can detect fallback-to-Arial.
    const fontStatus = await page.evaluate(() => {
      const loaded = [], failed = [];
      document.fonts.forEach(f => {
        (f.status === 'loaded' ? loaded : failed).push(`${f.family}:${f.weight}`);
      });
      // Also sample the computed font-family of the first text node to verify
      // the resolved font matches what the template declares.
      const root = document.body.firstElementChild;
      const resolvedFont = root ? getComputedStyle(root).fontFamily : 'n/a';
      return { loaded: loaded.length, failed: failed.length, failedList: failed.slice(0, 5), resolvedFont };
    });
    console.log(
      `[Puppeteer] measureBreaks → totalHeight: ${result.totalHeight}px, breaks: ${result.breaks.length}` +
      ` | fonts loaded: ${fontStatus.loaded}, failed: ${fontStatus.failed}` +
      (fontStatus.failed > 0 ? ` [${fontStatus.failedList.join(', ')}]` : '') +
      ` | resolvedFont: ${fontStatus.resolvedFont}`
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
