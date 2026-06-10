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
      requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 300)))
    );
  });

  // Extra guard: verify document.fonts.status is 'loaded' before proceeding.
  // waitForFunction polls the page until the condition is true (or timeout).
  // This catches rare cases where the evaluate above resolves but Chromium hasn't
  // fully committed the font metrics into its layout pipeline yet.
  try {
    await page.waitForFunction(() => document.fonts.status === 'loaded', { timeout: 5000 });
  } catch (_) {
    console.warn('[Puppeteer] document.fonts.status did not reach "loaded" within 5s — proceeding anyway');
  }
  // Final 300ms pause: Chromium's PDF compositor runs on a separate thread and can
  // lag the JS engine by a frame or two. Without this pause, the very first line of
  // each page can render with wrong metrics (before the thread applies the fonts),
  // causing the last line of a page to appear cut off in the exported PDF.
  await new Promise(r => setTimeout(r, 300));

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
const MAX_PULL = 200;
// BOTTOM_BLANK — blank px reserved at the bottom of each page for the raw break.
// Must match BOTTOM_BLANK in src/components/builder/LivePreview.jsx.
const BOTTOM_BLANK = 15;
// MAX_BOTTOM_GAP — maximum allowed blank px at the bottom of any PDF page.
// The greedy-fill phase packs complete avoid-elements into any gap > this.
// Must match MAX_BOTTOM_GAP in src/components/builder/LivePreview.jsx.
const MAX_BOTTOM_GAP = 15;

// Maximum distance (px) Phase 4 is allowed to snap bestBreak back from rawBreak.
// When the nearest text-line boundary is farther than this, the content between
// rawBreak and that boundary is section-spacing (not text), so it is cleaner to
// break at rawBreak and get a 0-gap than to pull back and leave a large blank.
// Must match MAX_PHASE4_SNAP in src/components/builder/LivePreview.jsx.
const MAX_PHASE4_SNAP = 40;
// MIN_PHANTOM_PAGE — minimum real content on the last page before we consider
// the break a phantom caused by CSS bottom-padding and remove it.
// Must match MIN_PHANTOM_PAGE in src/components/builder/LivePreview.jsx.
const MIN_PHANTOM_PAGE = 50;

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
    const result = await page.evaluate((PAGE_H, MARGIN, MIN_PAGE_CONTENT, HEADING_ORPHAN_PX, MAX_PULL_AVOID, MAX_PULL, BOTTOM_BLANK, MAX_BOTTOM_GAP, MIN_PHANTOM_PAGE, MAX_PHASE4_SNAP) => {
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

      while (true) {
        // Pages 2+ have MARGIN px of white at top; their usable content height
        // is PAGE_H − MARGIN (1074 px).  Using PAGE_H for all pages creates a
        // 33 px dead zone (1107→1074) where content is clipped in both preview
        // and PDF.  Mirror of the same fix in LivePreview.jsx computeSmartBreaks.
        const isFirstPage   = pageStart === 0;
        const pageTopMargin = isFirstPage ? 0 : MARGIN;
        const pageVisibleH  = PAGE_H - pageTopMargin;   // 1122 for p1, 1074 for p2+

        if (pageStart + pageVisibleH >= totalHeight) break;

        const rawBreak = pageStart + pageVisibleH - BOTTOM_BLANK;
        let bestBreak = rawBreak;

        // ── avoidEls: built once, shared by Phase 1 & Phase 3 ─────────────────
        // Must stay in sync with the avoidEls filter in LivePreview.jsx.
        const MAX_LINE_H = 35; // px — covers one line at up to ~14pt / line-height 1.8
        const avoidEls = Array.from(container.querySelectorAll("*")).filter(el => {
          const s = getComputedStyle(el);
          if (s.breakInside === "avoid" || s.pageBreakInside === "avoid") return true;
          const d = s.display;
          if (d === "none" || d === "contents" || d === "table" || d === "table-row") return false;
          const h = el.getBoundingClientRect().height;
          return h > 0 && h <= MAX_LINE_H;
        });

        // ── Phase 4 (PRIMARY — runs FIRST): Line-boundary snap at rawBreak ─────
        // Scans ALL elements that straddle rawBreak and finds the MAXIMUM lastSafe
        // (nearest text-line bottom to rawBreak) across all of them.
        // Using max() instead of the smallest element prevents large gaps caused
        // by tall containers whose last text line is far above rawBreak.
        // Only applied when the snap is ≤ MAX_PHASE4_SNAP (40 px): a larger snap
        // means the nearest text is in a distant section, and breaking at rawBreak
        // itself (gap=0) is cleaner than a large blank at the page bottom.
        // Must stay in sync with Phase 4 in LivePreview.jsx computeSmartBreaks.
        {
          let ph4BestSnap = null;
          const ph4Els = container.querySelectorAll('p, li, td, th, address, div, span');
          for (const el of ph4Els) {
            const hasText = Array.from(el.childNodes).some(
              n => n.nodeType === 3 && n.textContent.trim().length > 0
            );
            if (!hasText) continue;
            const r  = el.getBoundingClientRect();
            const eT = r.top    - containerTop;
            const eB = r.bottom - containerTop;
            if (eT >= rawBreak || eB <= rawBreak) continue; // must straddle rawBreak
            if (eT >= rawBreak - 3) continue;               // already at element top
            try {
              const range = document.createRange();
              range.selectNodeContents(el);
              const rects = Array.from(range.getClientRects());
              for (const rect of rects) {
                const rBot = rect.bottom - containerTop;
                if (rBot <= rawBreak - 1 && (ph4BestSnap === null || rBot > ph4BestSnap)) {
                  ph4BestSnap = rBot;
                }
              }
            } catch (_) {}
          }
          if (ph4BestSnap !== null && rawBreak - ph4BestSnap <= MAX_PHASE4_SNAP) {
            bestBreak = ph4BestSnap;
          }
        }

        // ── Phase 1: Micro-pull for tiny atomic elements only ──────────────────
        // After line-snapping, only pull back further for tiny elements whose top
        // is within MAX_BOTTOM_GAP (15 px) of rawBreak. Protects single-line atoms
        // (dates, role titles). Large blocks are split at the Phase 4 line boundary.
        // Must stay in sync with Phase 1 in LivePreview.jsx computeSmartBreaks.
        for (const el of avoidEls) {
          const rect = el.getBoundingClientRect();
          const elTop = rect.top    - containerTop;
          const elBot = rect.bottom - containerTop;
          if (elTop < bestBreak && elBot > bestBreak) {
            if (elTop > pageStart + MIN_PAGE_CONTENT && (rawBreak - elTop) <= MAX_BOTTOM_GAP) {
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
        // If bestBreak is still > MAX_BOTTOM_GAP below rawBreak (e.g. after a
        // heading orphan pull), greedily include complete avoid-elements that fit.
        // Capped at rawBreak so Phase 3 never enters the BOTTOM_BLANK reserved zone.
        // ANCESTOR GUARD: skip sub-elements whose break-inside:avoid ancestor spans
        // into page 2 — including them would orphan that container's content.
        if (rawBreak - bestBreak > MAX_BOTTOM_GAP) {
          // A container is "unbreakable" only if it has content that already
          // started on this page (t < bestBreak - 2).  If the container starts
          // exactly at bestBreak (e.g. Phase 2 pulled the break to the heading's
          // top which is the first child of a break-inside:avoid item div), the
          // container hasn't started on page 1 yet — treating it as unbreakable
          // would block Phase 3 from filling any elements and force the entire
          // section to page 2 as one block.
          const unbreakableContainers = new Set(
            avoidEls.filter(el => {
              const r = el.getBoundingClientRect();
              const t = r.top    - containerTop;
              const b = r.bottom - containerTop;
              return t < bestBreak - 2 && b > rawBreak;
            })
          );
          const isInsideUnbreakable = (el) => {
            let p = el.parentElement;
            while (p && p !== container) {
              if (unbreakableContainers.has(p)) return true;
              p = p.parentElement;
            }
            return false;
          };

          const avoidPositions = avoidEls
            .map(el => {
              const r = el.getBoundingClientRect();
              return { top: r.top - containerTop, bot: r.bottom - containerTop, el };
            })
            .filter(({ top, bot, el }) =>
              top >= bestBreak - 2 &&
              bot  <= rawBreak     &&
              bot  >  bestBreak    &&
              !isInsideUnbreakable(el)
            )
            .sort((a, b) => a.top - b.top);

          for (const { top, bot, el } of avoidPositions) {
            // A break-after:avoid heading must NOT be stranded at the bottom
            // of the page without its content.  Stop here — leave the heading
            // on page 2 where its content is.
            const cs = getComputedStyle(el);
            if (cs.breakAfter === 'avoid' || cs.pageBreakAfter === 'avoid') break;

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

      // Phantom-page guard — remove trailing breaks where the last page has
      // fewer than MIN_PHANTOM_PAGE px of content (likely just CSS bottom padding).
      // Must match the same guard in LivePreview.jsx computeSmartBreaks.
      //
      // SAFETY CHECK: never remove a break if doing so would cause the preceding
      // page to exceed its visible height.  Without this, content just over one
      // page tall can lose its only break and be clipped in the downloaded PDF.
      while (breaks.length > 0 && totalHeight - breaks[breaks.length - 1] < MIN_PHANTOM_PAGE) {
        const prevBreakStart    = breaks.length >= 2 ? breaks[breaks.length - 2] : 0;
        const isPrevFirstPage   = prevBreakStart === 0;
        const prevPageTopMargin = isPrevFirstPage ? 0 : MARGIN;
        const prevPageVisibleH  = PAGE_H - prevPageTopMargin;
        if (totalHeight - prevBreakStart > prevPageVisibleH) break;
        breaks.pop();
        pageReport.pop();
      }

      return { breaks, pageReport, totalHeight };
    }, PAGE_H, MARGIN, MIN_PAGE_CONTENT, HEADING_ORPHAN_PX, MAX_PULL_AVOID, MAX_PULL, BOTTOM_BLANK, MAX_BOTTOM_GAP, MIN_PHANTOM_PAGE, MAX_PHASE4_SNAP);

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
