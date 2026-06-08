/**
 * test-ats-pdf.mjs — ATS PDF vs Preview Runtime Test
 *
 * For each ATS template:
 *   1. Build single-page HTML with rich test data (SSR via buildAtsHtmlFromReact)
 *   2. Load in Puppeteer → measure page-break positions + section y-positions
 *   3. Build sliced HTML using those SAME breaks
 *   4. Load sliced HTML in Puppeteer → detect visible section positions globally,
 *      map each element's getBoundingClientRect().top to the page-slice it falls in
 *   5. Compare "preview page" vs "PDF page" for every section
 *   6. Report PASS/FAIL
 *
 * Key insight: each .page-slice wraps the FULL template (content outside
 * the slice is clipped by overflow:hidden + translateY). DOM containment alone
 * always finds every section in slice-1. We must use getBoundingClientRect()
 * globally and compare against each slice's y-range to detect visibility.
 *
 * Run: node --experimental-vm-modules scripts/test-ats-pdf.mjs
 *  or: npx tsx --tsconfig tsconfig.server.json scripts/test-ats-pdf.mjs
 */

import puppeteer      from 'puppeteer-core';
import { execSync }   from 'child_process';
import { buildAtsHtmlFromReact } from '../api/_lib/atsReactRenderer.js';

// ── Constants (must match LivePreview.jsx / puppeteerPdf.js) ─────────────────
const PAGE_H          = 1122;
const MARGIN          = 48;
const BOTTOM_BLANK    = 15;
const MIN_PAGE_CONTENT= 200;
const HEADING_ORPHAN  = 120;
const MAX_PULL_AVOID  = 200;
const MAX_PULL        = 100;
const MAX_BOTTOM_GAP  = 15;

// ── Find Chromium ─────────────────────────────────────────────────────────────
function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  for (const cmd of ['chromium', 'chromium-browser']) {
    try {
      const p = execSync(`which ${cmd} 2>/dev/null`).toString().trim();
      if (p) return p;
    } catch (_) {}
  }
  for (const c of ['/nix/var/nix/profiles/default/bin/chromium', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    try { execSync(`test -x "${c}"`, { stdio: 'ignore' }); return c; } catch (_) {}
  }
  return '/usr/bin/chromium';
}

const LAUNCH_ARGS = [
  '--no-sandbox','--disable-setuid-sandbox','--disable-dev-shm-usage',
  '--disable-gpu','--no-zygote','--font-render-hinting=slight',
];

// ── Rich test data — produces 2-3 pages in every ATS template ────────────────
const TEST_DATA = {
  personalInfo: {
    fullName:  'Alexander William Thompson',
    jobTitle:  'Senior Software Engineer',
    email:     'alexander.thompson@email.com',
    phone:     '+1 (555) 123-4567',
    location:  'San Francisco, CA',
    linkedin:  'linkedin.com/in/athompson',
    website:   'athompson.dev',
    summary:
      'Highly motivated Senior Software Engineer with 8+ years of experience building ' +
      'scalable distributed systems and leading cross-functional engineering teams. ' +
      'Proven track record of delivering complex projects on time and under budget. ' +
      'Expert in cloud architecture, microservices, and modern DevOps practices. ' +
      'Passionate about clean code, technical mentorship, and driving engineering ' +
      'excellence across organisations.',
  },
  experience: [
    {
      jobTitle:'Senior Software Engineer', company:'TechCorp Solutions',
      location:'San Francisco, CA', startDate:'Jan 2020', endDate:'', current:true,
      description:
        '• Led architecture design for a distributed payment processing system handling 50M+ transactions daily\n' +
        '• Reduced API latency by 60% through strategic caching and database query optimisation\n' +
        '• Mentored a team of 8 junior and mid-level engineers through weekly code reviews\n' +
        '• Implemented CI/CD pipelines reducing deployment time from 2 hours to 8 minutes\n' +
        '• Collaborated with product and design to define requirements for 3 major product launches',
    },
    {
      jobTitle:'Software Engineer', company:'DataStream Inc.',
      location:'New York, NY', startDate:'Mar 2017', endDate:'Dec 2019', current:false,
      description:
        '• Built real-time data streaming pipeline processing 10 TB per day using Kafka and Spark\n' +
        '• Designed microservices architecture migrating from legacy monolith, improving scalability 3×\n' +
        '• Developed RESTful APIs consumed by 200,000+ active mobile users\n' +
        '• Optimised PostgreSQL queries reducing average query time from 800 ms to 45 ms\n' +
        '• Maintained 99.99% SLA for critical production systems via on-call rotation',
    },
    {
      jobTitle:'Junior Software Developer', company:'StartupXYZ',
      location:'Austin, TX', startDate:'Jun 2015', endDate:'Feb 2017', current:false,
      description:
        '• Developed frontend features using React and TypeScript for SaaS platform with 5,000+ users\n' +
        '• Integrated Stripe payment gateway reducing checkout abandonment by 25%\n' +
        '• Fixed 150+ bugs and raised test coverage from 40% to 85%\n' +
        '• Built internal admin dashboard used by customer success team',
    },
  ],
  education: [
    {
      degree:'Master of Science in Computer Science', institution:'Stanford University',
      location:'Stanford, CA', startDate:'2013', endDate:'2015',
      description:'Specialisation in Distributed Systems. GPA 3.9/4.0.',
    },
    {
      degree:'Bachelor of Science in Computer Engineering',
      institution:'University of California, Berkeley',
      location:'Berkeley, CA', startDate:'2009', endDate:'2013',
      description:"Minor in Mathematics. Dean's List every semester.",
    },
  ],
  skills: [
    {name:'Python'},{name:'TypeScript'},{name:'Java'},{name:'Go'},
    {name:'React'},{name:'Node.js'},{name:'PostgreSQL'},{name:'MongoDB'},
    {name:'Redis'},{name:'Apache Kafka'},{name:'Docker'},{name:'Kubernetes'},
    {name:'AWS'},{name:'Google Cloud'},{name:'Terraform'},{name:'GraphQL'},
    {name:'gRPC'},{name:'Elasticsearch'},
  ],
  projects: [
    {
      title:'Open Source Distributed Cache Library', link:'github.com/athompson/distcache',
      description:
        '• High-performance distributed caching library in Go — 100k+ ops/sec\n' +
        '• 2,000+ GitHub stars, 150+ contributors worldwide\n' +
        '• Consistent hashing and automatic replication for fault tolerance',
    },
    {
      title:'Real-Time Analytics Dashboard', link:'analytics.athompson.dev',
      description:
        '• Full-stack analytics platform using WebSockets and D3.js\n' +
        '• Supports 50,000 concurrent users with sub-100 ms refresh rate\n' +
        '• Featured in TechCrunch as top developer tool of 2022',
    },
  ],
  languages: [
    {name:'English', level:'Native'}, {name:'Spanish', level:'Professional'},
    {name:'French',  level:'Intermediate'}, {name:'Mandarin', level:'Basic'},
  ],
  certificates: [
    {name:'AWS Solutions Architect Professional', issuer:'Amazon Web Services', date:'2023'},
    {name:'Google Cloud Professional Data Engineer', issuer:'Google',           date:'2022'},
    {name:'Certified Kubernetes Administrator',    issuer:'CNCF',               date:'2021'},
  ],
  interests: [{name:'Open Source'},{name:'Technical Writing'},{name:'Rock Climbing'},{name:'Chess'}],
};

const SECTION_ORDER    = ['summary','experience','education','skills','projects','languages','certificates','interests'];
const VISIBLE_SECTIONS = Object.fromEntries(SECTION_ORDER.map(s => [s, true]));
const TEMPLATES        = ['atsbold','atscenter','atsclean','atscompact','atselegant','atsharvard','atsmodern','atspro','atssimple'];

// Labels to detect each section — short heading text prefix match (case-insensitive)
const SECTION_LABELS = {
  summary:      ['professional summary','summary','ملخص','about me'],
  experience:   ['work experience','professional experience','experience','الخبرة','employment history'],
  education:    ['education','academic','التعليم'],
  skills:       ['technical skills','skills','المهارات','competencies','core skills'],
  projects:     ['projects','personal projects','المشاريع','portfolio','key projects'],
  languages:    ['languages','اللغات'],
  certificates: ['certifications','certificates','الشهادات','credentials','licenses'],
  interests:    ['interests','hobbies','اهتمام','activities'],
};

// ── ANSI colours ──────────────────────────────────────────────────────────────
const R = s => `\x1b[31m${s}\x1b[0m`;
const G = s => `\x1b[32m${s}\x1b[0m`;
const Y = s => `\x1b[33m${s}\x1b[0m`;
const B = s => `\x1b[1m${s}\x1b[0m`;

function pageFor(y, breaks) {
  for (let i = 0; i < breaks.length; i++) if (y < breaks[i]) return i + 1;
  return breaks.length + 1;
}

// ═══════════════════════════════════════════════════════════════════════════════
// runInPage: loads html, evaluates fn, closes page.
// Uses a very tall viewport so all content is accessible via getBoundingClientRect.
// ═══════════════════════════════════════════════════════════════════════════════
async function runInPage(browser, html, evaluateFn, ...args) {
  const page = await browser.newPage();
  await page.setViewport({ width: 794, height: 30000, deviceScaleFactor: 1 });
  try {
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 });
    return await page.evaluate(evaluateFn, ...args);
  } finally {
    await page.close();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// measurePreview: single-page HTML → { breaks, totalHeight, sectionYPositions }
//
// Runs the full smart-break algorithm in Puppeteer (mirror of LivePreview.jsx)
// AND captures section heading y-positions for the "preview page" map.
// ═══════════════════════════════════════════════════════════════════════════════
async function measurePreview(browser, html) {
  return runInPage(browser, html,
    (constants, sectionLabels) => {
      const { PAGE_H, MARGIN, MIN_PAGE_CONTENT, HEADING_ORPHAN, MAX_PULL_AVOID, MAX_PULL, BOTTOM_BLANK, MAX_BOTTOM_GAP } = constants;

      const container = document.body.firstElementChild;
      if (!container) return { breaks: [], totalHeight: PAGE_H, sectionYPositions: {} };

      const totalHeight  = container.scrollHeight;
      const containerTop = container.getBoundingClientRect().top;
      const allEls       = Array.from(container.querySelectorAll('*'));

      // ── Capture section y-positions ─────────────────────────────────────────
      const sectionYPositions = {};
      for (const [sec, labels] of Object.entries(sectionLabels)) {
        for (const el of allEls) {
          const text = (el.textContent || '').trim().toLowerCase();
          if (text.length > 0 && text.length < 100 &&
              labels.some(lbl => text === lbl || text.startsWith(lbl + ' ') || text.startsWith(lbl + '\n'))) {
            const y = el.getBoundingClientRect().top - containerTop;
            if (y >= 0 && sectionYPositions[sec] === undefined) {
              sectionYPositions[sec] = y;
              break;
            }
          }
        }
      }

      if (totalHeight <= PAGE_H) return { breaks: [], totalHeight, sectionYPositions };

      // ── Smart break algorithm (mirror of LivePreview.jsx computeSmartBreaks) ─
      const breaks = [];
      let pageStart = 0;

      while (pageStart + PAGE_H < totalHeight) {
        const rawBreak = pageStart + PAGE_H - BOTTOM_BLANK;
        let bestBreak  = rawBreak;

        const avoidEls = allEls.filter(el => {
          const s = getComputedStyle(el);
          return s.breakInside === 'avoid' || s.pageBreakInside === 'avoid';
        });

        for (const el of avoidEls) {
          const r = el.getBoundingClientRect();
          const elTop = r.top  - containerTop;
          const elBot = r.bottom - containerTop;
          if (elTop < bestBreak && elBot > bestBreak) {
            if (elTop > pageStart + MIN_PAGE_CONTENT && (rawBreak - elTop) <= MAX_PULL_AVOID) {
              bestBreak = elTop;
            }
          }
        }

        allEls.forEach(el => {
          const cs = getComputedStyle(el);
          if (cs.breakAfter !== 'avoid' && cs.pageBreakAfter !== 'avoid') return;
          const r = el.getBoundingClientRect();
          const hTop = r.top    - containerTop;
          const hBot = r.bottom - containerTop;
          if (hBot > pageStart + MARGIN && hBot <= bestBreak &&
              (bestBreak - hBot) <= HEADING_ORPHAN && (rawBreak - hTop) <= MAX_PULL) {
            bestBreak = Math.min(bestBreak, hTop);
          }
        });

        if (rawBreak - bestBreak > MAX_BOTTOM_GAP) {
          const avoidPos = avoidEls
            .map(el => { const r = el.getBoundingClientRect(); return { top: r.top - containerTop, bot: r.bottom - containerTop }; })
            .filter(({ top, bot }) => top >= bestBreak - 2 && bot <= rawBreak && bot > bestBreak)
            .sort((a, b) => a.top - b.top);
          for (const { top, bot } of avoidPos) {
            if (top >= bestBreak - 2) bestBreak = Math.max(bestBreak, bot);
          }
        }

        breaks.push(bestBreak);
        pageStart = bestBreak;
      }

      return { breaks, totalHeight, sectionYPositions };
    },
    { PAGE_H, MARGIN, MIN_PAGE_CONTENT, HEADING_ORPHAN, MAX_PULL_AVOID, MAX_PULL, BOTTOM_BLANK, MAX_BOTTOM_GAP },
    SECTION_LABELS
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// measurePdfPages: sliced HTML → { [section]: pageNumber }
//
// KEY FIX: Each .page-slice contains the FULL template. DOM containment always
// finds every section in slice-1 (clipped by overflow:hidden but still in DOM).
//
// Correct detection: find all matching elements globally in the document,
// use getBoundingClientRect().top to get their ACTUAL y in the document,
// then compare against each slice's y-range in the document to find which
// slice the element's visible position falls in.
//
// For a section at template y=1418 (break at 1043):
//   Slice-1 clone: doc y=1418 → within slice-2's doc range [1043, 2165] → page 2 ✓
//   Slice-2 clone: doc y=1091+(1418-1035)=1474 → within slice-2's doc range → page 2 ✓
// Both copies consistently map to page 2 — the correct answer.
// ═══════════════════════════════════════════════════════════════════════════════
async function measurePdfPages(browser, html) {
  return runInPage(browser, html, (sectionLabels) => {
    const slices = Array.from(document.querySelectorAll('.page-slice'));
    if (slices.length === 0) return {};

    // Compute each slice's y-range in the document
    const sliceRanges = slices.map(slice => {
      const rect = slice.getBoundingClientRect();
      return { top: Math.round(rect.top), bottom: Math.round(rect.bottom) };
    });

    // Collect ALL elements in the document
    const allEls = Array.from(document.querySelectorAll('*'));

    const result = {};

    for (const [sec, labels] of Object.entries(sectionLabels)) {
      // Gather all candidate elements and their document y-positions
      const candidates = [];
      for (const el of allEls) {
        const text = (el.textContent || '').trim().toLowerCase();
        if (text.length > 0 && text.length < 100 &&
            labels.some(lbl => text === lbl || text.startsWith(lbl + ' ') || text.startsWith(lbl + '\n'))) {
          const docY = Math.round(el.getBoundingClientRect().top);
          candidates.push({ el, docY });
        }
      }

      // Map each candidate to a page-slice by its document y-position
      // Take the LOWEST page number found across all candidates (first occurrence)
      let bestPage = undefined;
      for (const { docY } of candidates) {
        for (let i = 0; i < sliceRanges.length; i++) {
          const { top, bottom } = sliceRanges[i];
          if (docY >= top && docY < bottom) {
            const pageNum = i + 1;
            if (bestPage === undefined || pageNum < bestPage) {
              bestPage = pageNum;
            }
            break;
          }
        }
      }

      if (bestPage !== undefined) result[sec] = bestPage;
    }

    return result;
  }, SECTION_LABELS);
}

// ═══════════════════════════════════════════════════════════════════════════════
// testTemplate: full test for one template
// ═══════════════════════════════════════════════════════════════════════════════
async function testTemplate(browser, templateId) {
  const baseOpts = {
    templateId, isRTL: false, theme: {},
    visibleSections: VISIBLE_SECTIONS, visiblePersonalFields: {},
    sectionOrder: SECTION_ORDER, sectionNames: {},
  };

  // Step 1: Build single-page (preview) HTML via React SSR
  const previewHtml = await buildAtsHtmlFromReact(TEST_DATA, {
    ...baseOpts, pageBreaks: [], totalHeight: 99999,
  });

  // Step 2: Measure breaks + section y-positions (simulates browser preview)
  const { breaks, totalHeight, sectionYPositions } = await measurePreview(browser, previewHtml);

  const previewPages = breaks.length + 1;

  // Determine which page each section falls on based on break positions
  const previewSectionPages = {};
  for (const [sec, y] of Object.entries(sectionYPositions)) {
    previewSectionPages[sec] = pageFor(y, breaks);
  }

  if (breaks.length === 0) {
    return {
      templateId, previewPages: 1, pdfPages: 1, breaks: [], match: true, issues: [],
      previewSectionPages, pdfSectionPages: previewSectionPages,
      note: 'Single page — no breaks to validate.',
    };
  }

  // Step 3: Build sliced PDF HTML using the SAME breaks as preview
  const pdfHtml = await buildAtsHtmlFromReact(TEST_DATA, {
    ...baseOpts, pageBreaks: breaks, totalHeight,
  });

  // Step 4: Detect section pages in sliced HTML using document y-position
  const pdfSectionPages = await measurePdfPages(browser, pdfHtml);

  const pdfPages = breaks.length + 1;

  // Step 5: Compare
  const issues = [];
  for (const sec of SECTION_ORDER) {
    const pp = previewSectionPages[sec];
    const dp = pdfSectionPages[sec];
    if (pp === undefined || dp === undefined) continue;
    if (pp !== dp) {
      issues.push({
        section: sec, previewPage: pp, pdfPage: dp,
        yInPreview: Math.round(sectionYPositions[sec] || 0),
      });
    }
  }

  return {
    templateId, previewPages, pdfPages,
    breaks: breaks.map(b => Math.round(b)),
    previewSectionPages, pdfSectionPages, sectionYPositions,
    match: pdfPages === previewPages && issues.length === 0,
    issues,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// main
// ═══════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log(B('\n══════════════════════════════════════════════════════════════'));
  console.log(B('  ATS PDF vs Preview — Actual Runtime Comparison Test'));
  console.log(B('══════════════════════════════════════════════════════════════\n'));
  console.log('  Rich test data: 3 experience entries, 2 education,');
  console.log('  18 skills, 2 projects, 4 languages, 3 certs, 4 interests\n');
  console.log('  Detection: getBoundingClientRect() in full document (not DOM containment)\n');

  const chromiumPath = findChromium();
  console.log(`  Chromium: ${chromiumPath}\n`);

  const browser = await puppeteer.launch({
    executablePath: chromiumPath,
    headless: true,
    args: LAUNCH_ARGS,
  });

  const summaryRows = [];

  try {
    for (const templateId of TEMPLATES) {
      process.stdout.write(`  Testing ${B(templateId.padEnd(13))}... `);
      try {
        const result = await testTemplate(browser, templateId);
        summaryRows.push(result);

        const statusLine = result.match ? G('PASS') : R('FAIL');
        console.log(`${statusLine}  (preview: ${result.previewPages}p, pdf: ${result.pdfPages}p, break: ${(result.breaks || []).join(' | ') || 'none'}px)`);

        // Per-section detail
        console.log('           Sections:');
        for (const sec of SECTION_ORDER) {
          const pp = result.previewSectionPages?.[sec];
          const dp = result.pdfSectionPages?.[sec];
          if (pp === undefined && dp === undefined) continue;
          const detected = pp !== undefined && dp !== undefined;
          const same   = detected && pp === dp;
          const icon   = same ? G('✓') : R('✗');
          const detail = !detected
            ? Y(`${sec.padEnd(13)} (not detected in one or both)`)
            : same
              ? `${sec.padEnd(13)} Preview=P${pp}  PDF=P${dp}  y≈${Math.round(result.sectionYPositions?.[sec] || 0)}px`
              : R(`${sec.padEnd(13)} Preview=P${pp}  PDF=P${dp}  ← MISMATCH  y≈${Math.round(result.sectionYPositions?.[sec] || 0)}px`);
          console.log(`             ${icon}  ${detail}`);
        }

        if (result.issues.length > 0) {
          console.log(R(`\n           ⚠ Issues (${result.issues.length}):`));
          for (const iss of result.issues) {
            console.log(R(`             "${iss.section}": Preview=P${iss.previewPage} → PDF=P${iss.pdfPage}  (template y≈${iss.yInPreview}px)`));
          }
        }
        if (result.note) console.log(Y(`           Note: ${result.note}`));
        console.log();

      } catch (err) {
        console.log(R('ERROR'));
        console.log(R(`           ${err.message}`));
        if (err.stack) console.log(err.stack.split('\n').slice(1, 4).map(l => '           ' + l).join('\n'));
        summaryRows.push({ templateId, match: false, issues: [], error: err.message });
        console.log();
      }
    }
  } finally {
    await browser.close();
  }

  // ── Final summary table ───────────────────────────────────────────────────
  console.log(B('══════════════════════════════════════════════════════════════'));
  console.log(B('  FINAL REPORT'));
  console.log(B('══════════════════════════════════════════════════════════════\n'));
  console.log('  ' + B('Template'.padEnd(15)) + B('Result  ') + B('Issues'));
  console.log('  ' + '─'.repeat(62));

  let pass = 0;
  for (const r of summaryRows) {
    const label  = r.error ? R('ERROR ') : r.match ? G('PASS  ') : R('FAIL  ');
    const detail = r.error
      ? R(r.error.slice(0, 55))
      : r.issues.length === 0
        ? (r.note ? Y('single page') : G('all sections match'))
        : R(r.issues.map(i => `"${i.section}": P${i.previewPage}→PDF P${i.pdfPage}`).join(', '));
    console.log('  ' + r.templateId.padEnd(15) + label + detail);
    if (r.match && !r.error) pass++;
  }

  const total = summaryRows.length;
  console.log('\n  ' + '─'.repeat(62));
  const verdict = pass === total
    ? G(`\n  ${pass}/${total} PASS`)
    : R(`\n  ${pass}/${total} PASS  (${total - pass} template${total - pass > 1 ? 's' : ''} FAILED)`);
  console.log(verdict + '\n');

  process.exit(pass === total ? 0 : 1);
}

main().catch(err => {
  console.error(R('\nFatal: ' + err.message + '\n' + (err.stack || '')));
  process.exit(1);
});
