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
// Max px to pull a break back when an AVOID-INSIDE element spans the break.
// Set high enough to protect individual bullet lines (~20px) AND complete resume
// items (job entries, education blocks, ~150-200px). Elements larger than this
// are split at rawBreak; Phase 3 (greedy fill) then minimises the resulting gap.
// Must match MAX_PULL_AVOID in LivePreview.jsx.
const MAX_PULL_AVOID = 200;
// Max px to pull a break back for a heading-orphan fix.
// Headings are small; the greedy-fill phase recovers the resulting gap.
// Must match MAX_PULL in LivePreview.jsx.
const MAX_PULL = 100;
// BOTTOM_BLANK — blank px reserved at the bottom of each page for the raw break.
// Must match BOTTOM_BLANK in src/components/builder/LivePreview.jsx.
const BOTTOM_BLANK = 15;
// MAX_BOTTOM_GAP — maximum allowed blank px at the bottom of any PDF page.
// The greedy-fill phase packs complete avoid-elements into any gap > this.
// Must match MAX_BOTTOM_GAP in src/components/builder/LivePreview.jsx.
const MAX_BOTTOM_GAP = 15;

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
    const result = await page.evaluate((PAGE_H, MARGIN, MIN_PAGE_CONTENT, HEADING_ORPHAN_PX, MAX_PULL_AVOID, MAX_PULL, BOTTOM_BLANK, MAX_BOTTOM_GAP) => {
      // The template root div is the first child of <body>
      const container = document.body.firstElementChild;
      if (!container) return { breaks: [], pageReport: [], totalHeight: PAGE_H };

      const totalHeight = container.scrollHeight;
      if (totalHeight <= PAGE_H) return { breaks: [], pageReport: [], totalHeight };

      // Mirror of computeSmartBreaks in LivePreview.jsx.
      const containerTop = container.getBoundingClientRect().top;

      const breaks = [];
      const pageReport = [];
      let pageStart = 0;
      let pageIndex = 1;

      while (pageStart + PAGE_H < totalHeight) {
        const rawBreak = pageStart + PAGE_H - BOTTOM_BLANK;
        let bestBreak = rawBreak;

        // ── Phase 1: Avoid splitting break-inside:avoid elements ─────────────
        // Pull the break back ONLY if the pull ≤ MAX_PULL_AVOID (= MAX_BOTTOM_GAP).
        // This guarantees the pull itself leaves ≤ 15px blank at the page bottom.
        // Larger elements are split at rawBreak (gap = 0, no blank wasted).
        const avoidEls = Array.from(container.querySelectorAll("*")).filter(el => {
          const s = getComputedStyle(el);
          return s.breakInside === "avoid" || s.pageBreakInside === "avoid";
        });

        for (const el of avoidEls) {
          const rect = el.getBoundingClientRect();
          const elTop = rect.top    - containerTop;
          const elBot = rect.bottom - containerTop;

          if (elTop < bestBreak && elBot > bestBreak) {
            if (elTop > pageStart + MIN_PAGE_CONTENT && (rawBreak - elTop) <= MAX_PULL_AVOID) {
              bestBreak = elTop;
            }
          }
        }

        // ── Phase 2: Heading orphan fix ───────────────────────────────────────
        // A section heading with break-after:avoid must NOT be the last element
        // on a page. Pull the break to before the heading.
        Array.from(container.querySelectorAll('*')).forEach(el => {
          const cs = getComputedStyle(el);
          if (cs.breakAfter !== 'avoid' && cs.pageBreakAfter !== 'avoid') return;
          const rect = el.getBoundingClientRect();
          const hTop = rect.top    - containerTop;
          const hBot = rect.bottom - containerTop;
          if (
            hBot > pageStart + MARGIN &&
            hBot <= bestBreak &&
            (bestBreak - hBot) <= HEADING_ORPHAN_PX &&
            (rawBreak - hTop) <= MAX_PULL
          ) {
            bestBreak = Math.min(bestBreak, hTop);
          }
        });

        // ── Phase 3: Greedy forward fill (minimize bottom blank space) ────────
        // After pull-backs, the gap = rawBreak - bestBreak may be > MAX_BOTTOM_GAP.
        // Greedily include complete avoid-elements that start at/after bestBreak
        // and end at/before rawBreak to reduce the gap.
        //
        // This handles cases like:
        //   • A section was pulled to the next page (heading orphan) but its
        //     first few items actually fit in the remaining space.
        //   • Bullet-point lines that can fill the bottom of the page.
        if (rawBreak - bestBreak > MAX_BOTTOM_GAP) {
          const avoidPositions = avoidEls
            .map(el => {
              const r = el.getBoundingClientRect();
              return { top: r.top - containerTop, bot: r.bottom - containerTop };
            })
            .filter(({ top, bot }) =>
              top >= bestBreak - 2 &&   // starts at or after current break
              bot  <= rawBreak     &&   // fits entirely before raw break
              bot  >  bestBreak         // actually adds content
            )
            .sort((a, b) => a.top - b.top);

          for (const { top, bot } of avoidPositions) {
            if (top >= bestBreak - 2) {
              bestBreak = Math.max(bestBreak, bot);
            }
          }
        }

        const gap = Math.round(rawBreak - bestBreak);
        pageReport.push({
          page:       pageIndex,
          breakAt:    Math.round(bestBreak),
          rawBreak:   Math.round(rawBreak),
          bottomGap:  gap,
          gapOk:      gap <= MAX_BOTTOM_GAP,
        });

        breaks.push(bestBreak);
        pageStart = bestBreak;
        pageIndex++;
      }

      return { breaks, pageReport, totalHeight };
    }, PAGE_H, MARGIN, MIN_PAGE_CONTENT, HEADING_ORPHAN_PX, MAX_PULL_AVOID, MAX_PULL, BOTTOM_BLANK, MAX_BOTTOM_GAP);

    // Diagnostic: log which fonts actually loaded so we can detect fallback-to-Arial.
    const fontStatus = await page.evaluate(() => {
      const loaded = [], failed = [];
      document.fonts.forEach(f => {
        (f.status === 'loaded' ? loaded : failed).push(`${f.family}:${f.weight}`);
      });
      const root = document.body.firstElementChild;
      const resolvedFont = root ? getComputedStyle(root).fontFamily : 'n/a';
      return { loaded: loaded.length, failed: failed.length, failedList: failed.slice(0, 5), resolvedFont };
    });

    // ── Page-break report ────────────────────────────────────────────────────
    console.log(
      `[Puppeteer] measureBreaks → totalHeight: ${result.totalHeight}px, breaks: ${result.breaks.length}` +
      ` | fonts loaded: ${fontStatus.loaded}, failed: ${fontStatus.failed}` +
      (fontStatus.failed > 0 ? ` [${fontStatus.failedList.join(', ')}]` : '') +
      ` | resolvedFont: ${fontStatus.resolvedFont}`
    );
    if (result.pageReport && result.pageReport.length > 0) {
      console.log('[Puppeteer] ── Page-break report ──────────────────────────────────');
      for (const r of result.pageReport) {
        const status = r.gapOk ? '✓' : '✗';
        console.log(
          `[Puppeteer]  Page ${r.page}: breakAt=${r.breakAt}px  rawBreak=${r.rawBreak}px` +
          `  bottomGap=${r.bottomGap}px  [${status} ≤${MAX_BOTTOM_GAP}px rule ${r.gapOk ? 'OK' : 'VIOLATED'}]`
        );
      }
      const violations = result.pageReport.filter(r => !r.gapOk);
      if (violations.length === 0) {
        console.log(`[Puppeteer]  All ${result.pageReport.length} page(s) respect the ≤${MAX_BOTTOM_GAP}px bottom-gap rule ✓`);
      } else {
        console.log(`[Puppeteer]  ${violations.length}/${result.pageReport.length} page(s) exceed the ${MAX_BOTTOM_GAP}px limit (content too tall to fill gap)`);
      }
      console.log('[Puppeteer] ────────────────────────────────────────────────────────');
    }

    return { breaks: result.breaks, totalHeight: result.totalHeight, pageReport: result.pageReport };
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
