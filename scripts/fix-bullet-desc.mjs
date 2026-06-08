/**
 * fix-bullet-desc.mjs  (v3 — handles all JSX description patterns)
 *
 * Strategy: anchor on the <span fontWeight/fontStyle> pattern (always identical),
 * then capture the surrounding <div style=…> … </div> regardless of whether
 * the style is a reference (s.body) or an inline object ({ … }) and whether
 * the block spans one line or multiple lines.
 *
 * Three cases handled:
 *  A) Single-line, style reference:
 *     <div style={REF}><span style={{…}}>{VAR.description}</span></div>
 *
 *  B) Single-line, inline style object:
 *     <div style={{ … }}><span style={{…}}>{VAR.description}</span></div>
 *
 *  C) Multi-line (with optional leading `VAR.description && (`):
 *     <div style={…}>
 *       <span style={{…}}>{VAR.description}</span>
 *     </div>
 *     [)]
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.resolve(__dirname, '../src/templates');

const IMPORT_LINE = "import BulletDesc from './BulletDesc';";

/** Find the matching closing `}` for an opening `{` at position `start` in `src`. */
function findClosingBrace(src, start) {
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Given the source string, find all `<div style=…>…{VAR.description}…</div>`
 * blocks and replace them with <BulletDesc … />.
 * Returns { result, count }.
 */
function replaceBulletDescs(src) {
  // Anchor: the span's fontWeight style (always identical across templates)
  const SPAN_ANCHOR = /fontWeight:([\w.?]+)\.descriptionBold\?700:undefined,fontStyle:([\w.?]+)\.descriptionItalic\?"italic":undefined\}\}>\{([\w.]+)\.description\}<\/span>/g;

  let result = src;
  let count = 0;

  // We'll collect replacements (in reverse order to not shift indices)
  const replacements = [];

  let m;
  // Reset lastIndex each iteration because we re-exec on `src` (original)
  SPAN_ANCHOR.lastIndex = 0;
  while ((m = SPAN_ANCHOR.exec(src)) !== null) {
    const varBold = m[1];   // e?, p?, item?, …
    const varDesc = m[3];   // e, p, item, …
    const base    = varBold.replace(/\?$/, ''); // strip trailing ?

    const spanStart = m.index; // index of 'fontWeight' … but we need the opening <span

    // Find the '<span' that opens this span (search backwards from spanStart)
    const spanTagStart = src.lastIndexOf('<span', spanStart);
    if (spanTagStart === -1) continue;

    // Find the closing </div> after the </span>
    const spanCloseTag = '</span>';
    const spanCloseIdx = src.indexOf(spanCloseTag, m.index + m[0].length - spanCloseTag.length);
    if (spanCloseIdx === -1) continue;
    const afterSpan = spanCloseIdx + spanCloseTag.length;

    // Now scan forward from afterSpan to find </div>
    // Skip optional whitespace / newlines
    let cursor = afterSpan;
    while (cursor < src.length && /[\s]/.test(src[cursor])) cursor++;
    if (src.slice(cursor, cursor + 6) !== '</div>') continue;
    const divCloseEnd = cursor + 6;

    // Now find the opening <div that wraps this span.
    // Search backwards from spanTagStart for '<div'
    const divTagStart = src.lastIndexOf('<div', spanTagStart);
    if (divTagStart === -1) continue;

    // Extract the style attribute from the opening <div>
    // The div tag ends at the first '>' (accounting for nested braces in style={…})
    // Find '>' that closes the opening <div tag
    let divTagEnd = -1;
    {
      let i = divTagStart + 4; // skip '<div'
      let braceDepth = 0;
      while (i < src.length) {
        if (src[i] === '{') braceDepth++;
        else if (src[i] === '}') braceDepth--;
        else if (src[i] === '>' && braceDepth === 0) { divTagEnd = i; break; }
        i++;
      }
    }
    if (divTagEnd === -1) continue;

    // Sanity check: the opening div should directly contain the span
    // (no other element between divTagEnd+1 and spanTagStart)
    const between = src.slice(divTagEnd + 1, spanTagStart).trim();
    if (between.length > 0 && between !== '') {
      // There's content between the div open and the span — might be a different div
      // Only skip if the content looks like a real element (not just whitespace)
      if (/<\w/.test(between)) continue;
    }

    // Extract the style expression: `style={…}` inside the div opening tag
    const divOpenTag = src.slice(divTagStart, divTagEnd + 1);
    const styleMatch = /style=(\{[^]*?\})/.exec(divOpenTag);
    if (!styleMatch) continue;

    // styleMatch[1] might be truncated if it contains nested braces — recompute
    const styleAttrStart = divTagStart + divOpenTag.indexOf('style=') + 6; // after 'style='
    if (src[styleAttrStart] !== '{') continue;
    const styleAttrEnd = findClosingBrace(src, styleAttrStart);
    if (styleAttrEnd === -1) continue;
    const styleExpr = src.slice(styleAttrStart, styleAttrEnd + 1); // includes outer { }

    // Check for a surrounding `&& (` / `)` that wraps the div (multiline case)
    // Look backwards from divTagStart for `&& (` on the same or previous line
    let blockStart = divTagStart;
    let blockEnd   = divCloseEnd;
    let hasAndGuard = false;
    let andGuardVar = '';
    {
      // Scan backwards through whitespace
      let i = divTagStart - 1;
      while (i >= 0 && /[ \t\r\n]/.test(src[i])) i--;
      if (i >= 1 && src[i] === '(' && src[i - 1] === ' ') {
        // possible `&& (` — check further back
        let j = i - 1;
        while (j >= 0 && /[ \t]/.test(src[j])) j--;
        if (j >= 1 && src.slice(j - 1, j + 1) === '&&') {
          // This is a && ( … ) guard. Find what comes before &&
          let k = j - 2;
          while (k >= 0 && /[ \t]/.test(src[k])) k--;
          // Scan back to get the guard expression (e.g. `e.description`)
          let guardEnd = k + 1;
          while (k >= 0 && /[\w.]/.test(src[k])) k--;
          const guardExpr = src.slice(k + 1, guardEnd); // e.g. "e.description"
          if (guardExpr.endsWith('.description')) {
            andGuardVar = guardExpr.split('.')[0];
            blockStart = k + 1; // include guard expression
            hasAndGuard = true;
          }
        }
      }
    }

    if (hasAndGuard) {
      // Also consume the closing `)` after </div>
      let i = divCloseEnd;
      while (i < src.length && /[ \t\r\n]/.test(src[i])) i++;
      if (src[i] === ')') blockEnd = i + 1;
    }

    const guardPrefix = hasAndGuard ? `${andGuardVar}.description && ` : '';
    const replacement = `${guardPrefix}<BulletDesc text={${varDesc}.description} style={${styleExpr}} bold={${base}?.descriptionBold} italic={${base}?.descriptionItalic} />`;

    replacements.push({ start: blockStart, end: blockEnd, replacement });
    count++;
  }

  // Apply replacements in reverse order (so indices stay valid)
  replacements.sort((a, b) => b.start - a.start);
  for (const { start, end, replacement } of replacements) {
    result = result.slice(0, start) + replacement + result.slice(end);
  }

  return { result, count };
}

const files = fs.readdirSync(TEMPLATES_DIR)
  .filter(f => f.endsWith('.jsx') && f !== 'BulletDesc.jsx');

let totalFiles = 0;
let totalReplaced = 0;

for (const file of files) {
  const filePath = path.join(TEMPLATES_DIR, file);
  const src = fs.readFileSync(filePath, 'utf8');

  // Skip if already fully converted
  if (!src.includes('.description}') && !src.includes('.description}</span>')) {
    console.log(`  ${file} — already clean`);
    continue;
  }

  const { result, count } = replaceBulletDescs(src);

  if (count > 0) {
    totalFiles++;
    totalReplaced += count;
    let out = result;
    if (!out.includes("import BulletDesc")) {
      out = out.replace(/(import .+?from\s+['"][^'"]+['"];?\n)/, `$1${IMPORT_LINE}\n`);
    }
    fs.writeFileSync(filePath, out, 'utf8');
    console.log(`✓ ${file} — ${count} replacement(s)`);
  } else {
    // Check if there are any remaining unpatched descriptions
    const remaining = (src.match(/\.descriptionBold\?700:undefined/g) || []).length;
    console.log(`  ${file} — no pattern found (${remaining} remaining spans)`);
  }
}

console.log(`\nDone. Updated ${totalFiles} files, ${totalReplaced} total replacements.`);

// Summary: check for any remaining unpatched patterns
console.log('\n--- Remaining unpatched spans ---');
for (const file of files) {
  const filePath = path.join(TEMPLATES_DIR, file);
  const src = fs.readFileSync(filePath, 'utf8');
  const remaining = (src.match(/\.descriptionBold\?700:undefined/g) || []).length;
  if (remaining > 0) console.log(`  ⚠ ${file}: ${remaining} span(s) remain`);
}
