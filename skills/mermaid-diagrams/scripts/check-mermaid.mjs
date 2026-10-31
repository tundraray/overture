#!/usr/bin/env node
/**
 * Render and check every Mermaid block of a Markdown document.
 *
 * Usage: node check-mermaid.mjs <doc.md> <outdir> [mmdc-dir]
 *
 *   <outdir>   scratch folder for bNN.mmd / .svg / .png / .log (never the repo)
 *   [mmdc-dir] folder with @mermaid-js/mermaid-cli pinned to mermaid 11.16.1;
 *              defaults to <outdir>/../mmdc and is installed there on first use
 *
 * Checks (rules in ../SKILL.md):
 *   - every block renders without a syntax error
 *   - source lint: forbidden syntax (section 7)
 *   - path flowcharts: scoped keyframes, every path edge animated, keyframe
 *     names unique across the document (section 5)
 *   - sequence diagrams: every message has an animation rule, no rule hits a
 *     missing message, delays strictly increase, no reply without an earlier
 *     request, no message sent by a store; warns when runtime flows differ in
 *     journey shape (sections 5-6)
 *   - redraw test (warnings): node budget per C-level, node labels over two
 *     lines, edge labels over four words (section 3)
 *
 * Exits 1 on any problem. Dependency-free apart from mermaid-cli itself.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

const [docArg, outArg, mmdcArg] = process.argv.slice(2);
if (!docArg || !outArg) {
  console.error('usage: node check-mermaid.mjs <doc.md> <outdir> [mmdc-dir]');
  process.exit(2);
}
const doc = resolve(docArg);
const out = resolve(outArg);
const mmdcDir = resolve(mmdcArg ?? join(dirname(out), 'mmdc'));

const KEYWORDS = new Set(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'infinite', 'normal', 'reverse', 'alternate', 'none', 'forwards', 'backwards', 'both', 'running', 'paused', 'step-start', 'step-end']);
const problems = [];
const warnings = [];

// --- mermaid-cli, pinned -----------------------------------------------------

function mmdcEntry() {
  const pkgPath = join(mmdcDir, 'node_modules', '@mermaid-js', 'mermaid-cli', 'package.json');
  if (!existsSync(pkgPath)) return null;
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin.mmdc;
  return join(dirname(pkgPath), bin);
}

if (!mmdcEntry()) {
  mkdirSync(mmdcDir, { recursive: true });
  writeFileSync(
    join(mmdcDir, 'package.json'),
    JSON.stringify(
      {
        private: true,
        dependencies: { '@mermaid-js/mermaid-cli': '11.16.0' },
        overrides: { mermaid: '11.16.1' },
      },
      null,
      2,
    ),
  );
  console.log(`installing mermaid-cli into ${mmdcDir} ...`);
  const r = spawnSync('npm install --silent --no-audit --no-fund', { cwd: mmdcDir, stdio: 'inherit', shell: true });
  if (r.status !== 0 || !mmdcEntry()) {
    console.error('mermaid-cli install failed — diagrams were NOT checked');
    process.exit(2);
  }
}
const entry = mmdcEntry();

// --- extract blocks ----------------------------------------------------------

mkdirSync(out, { recursive: true });
for (const f of readdirSync(out)) if (/^b\d+\.(mmd|svg|png|log)$/.test(f)) rmSync(join(out, f));

const blocks = [];
{
  const lines = readFileSync(doc, 'utf8').split(/\r?\n/);
  let cur = null;
  let indent = 0;
  lines.forEach((line, i) => {
    if (!cur && /^\s*```mermaid\s*$/.test(line)) {
      indent = line.match(/^\s*/)[0].length;
      cur = { line: i + 1, src: [] };
    } else if (cur && /^\s*```\s*$/.test(line)) {
      blocks.push({ ...cur, src: cur.src.join('\n') });
      cur = null;
    } else if (cur) {
      cur.src.push(line.slice(Math.min(indent, line.match(/^\s*/)[0].length)));
    }
  });
}
if (blocks.length === 0) {
  console.log('no mermaid blocks found');
  process.exit(0);
}

// --- render ------------------------------------------------------------------

blocks.forEach((b, k) => {
  b.name = `b${String(k + 1).padStart(2, '0')}`;
  b.label = `${b.name} (line ${b.line})`;
  const base = join(out, b.name);
  writeFileSync(`${base}.mmd`, b.src);
  let ok = true;
  let log = '';
  try {
    log += execFileSync(process.execPath, [entry, '-q', '-i', `${base}.mmd`, '-o', `${base}.svg`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (e) {
    ok = false;
    log += `${e.stdout ?? ''}${e.stderr ?? ''}`;
  }
  b.svg = existsSync(`${base}.svg`) ? readFileSync(`${base}.svg`, 'utf8') : '';
  if (ok && /Syntax error/i.test(b.svg)) ok = false;
  if (ok) {
    try {
      execFileSync(process.execPath, [entry, '-q', '-i', `${base}.mmd`, '-o', `${base}.png`, '-s', '2'], {
        stdio: 'ignore',
      });
    } catch {
      /* the PNG is a convenience; the SVG decides */
    }
  }
  writeFileSync(`${base}.log`, log);
  console.log(`${ok ? 'PASS' : 'FAIL'} ${b.label}`);
  if (!ok) problems.push(`${b.label}: does not render — see ${base}.log`);
});

// --- source lint -------------------------------------------------------------

const FORBIDDEN = [
  [/fontFamily|fontSize/, 'custom font in themeVariables'],
  [/mirrorActors\s*:\s*false/, 'mirrorActors: false'],
  [/^\s*link\s+\S+\s*:/m, 'sequence actor link menu'],
  [/^\s*links?\s+\S+\s*:\s*\{/m, 'sequence actor links menu'],
  [/\bclick\s+\S+\s+(href|call)\b/, 'link inside a diagram (click)'],
  [/<a\s+href/i, 'link inside a diagram (<a href>)'],
  [/\[\s*(Person|Software System|Container|Component|Data Store)\s*\]/, 'C4 element-type tag in a label'],
  [/\[(NEW|MODIFY|READ)\]/, 'change tag inside a diagram — use node colour'],
  [/"[^"\n]*\b[WR]\d+\b[^"\n]*"|\|[^|\n]*\b[WR]\d+\b[^|\n]*\|/, 'step code (W1/R1) in a label — number the node instead'],
];

const keyframeOwners = new Map();

for (const b of blocks) {
  const body = b.src.replace(/^---[\s\S]*?\n---\n/, '');
  for (const [re, what] of FORBIDDEN) {
    const target = what.startsWith('custom font') || what.startsWith('mirrorActors') ? b.src : body;
    if (re.test(target)) problems.push(`${b.label}: ${what}`);
  }

  for (const m of b.src.matchAll(/@keyframes\s+([\w-]+)/g)) {
    const owner = keyframeOwners.get(m[1]);
    if (owner && owner !== b.name) problems.push(`${b.label}: keyframe "${m[1]}" also defined in ${owner} — scope it per diagram`);
    keyframeOwners.set(m[1], b.name);
  }

  const kind = (body.match(/^\s*(\w[\w-]*)/m) || [])[1];
  if (kind === 'flowchart' || kind === 'graph') {
    checkRedraw(b, body);
    checkFlowchart(b, body);
  }
  if (kind === 'sequenceDiagram') checkStoreReplies(b, body);
}

// Redraw test (section 3): node budget per level, label length. Warnings — the
// reviewer looks at the PNG and decides.
function checkRedraw(b, body) {
  const title = (b.src.match(/^\s*title:\s*"?([^"\n]*)/m) || [])[1] ?? '';
  const level = (title.match(/^C([1-4])\b/) || [])[1];
  const budget = { 1: 6, 2: 8, 3: 10, 4: 10 }[level] ?? 10;
  const SKIP = /^(subgraph|end|classDef|class|style|linkStyle|click|direction|flowchart|graph)\b/;
  const nodes = new Set();
  for (const raw of body.split('\n')) {
    const line = raw.replace(/%%.*$/, '').trim();
    if (!line || SKIP.test(line)) continue;
    for (const m of line.matchAll(/\[\s*"([^"]*)"\s*\]|\(\s*"([^"]*)"\s*\)|\{\s*"([^"]*)"\s*\}/g)) {
      const label = m[1] ?? m[2] ?? m[3];
      const lines = label.split(/<br\s*\/?>/i).length;
      if (lines > 2) warnings.push(`${b.label}: node label "${label.replace(/<[^>]+>/g, ' ').slice(0, 40)}" has ${lines} lines — a name plus one role line`);
    }
    for (const m of line.matchAll(/\|\s*"?([^|"]*)"?\s*\||(?:--|-\.|==)\s+"?([^"\->=.|]+?)"?\s+(?:-->|\.->|==>|---)/g)) {
      m[1] ??= m[2];
      const words = m[1].replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
      if (words > 4) warnings.push(`${b.label}: edge label "${m[1].trim()}" has ${words} words — 1–4 domain words`);
    }
    const ids = line
      .replace(/"[^"]*"/g, '""')
      .replace(/\|[^|]*\|/g, ' ')
      .replace(/(?:--|-\.|==)\s+[^\->=.]+?\s+(?:-->|\.->|==>|---)/g, ' --> ')
      .replace(/:::[\w-]+/g, '')
      .replace(/@\{[^}]*\}/g, '[]')
      .replace(/\[[^\]]*\]|\([^)]*\)|\{[^}]*\}/g, ' ')
      .replace(/\b\w+@(?=[-=.~])/g, ' ');
    for (const m of ids.matchAll(/[A-Za-z_]\w*/g)) nodes.add(m[0]);
  }
  if (nodes.size > budget) {
    warnings.push(`${b.label}: ${nodes.size} nodes, budget ${budget}${level ? ` for C${level}` : ''} — split it${level === '4' ? ' (one long C4 chain may exceed it if it stays readable)' : ''}`);
  }
}

// A store never replies (section 6): a database participant sends no message.
function checkStoreReplies(b, body) {
  const stores = new Set(
    [...body.matchAll(/^\s*participant\s+(\w+)@\{[^}]*["']?type["']?\s*:\s*["']database["']/gm)].map((m) => m[1]),
  );
  if (stores.size === 0) return;
  for (const m of body.matchAll(/^\s*(\w+)\s*(?:-->>|->>|-->|->|--x|-x|--\)|-\))\s*[+-]?\s*(\w+)\s*:/gm)) {
    if (stores.has(m[1])) problems.push(`${b.label}: store ${m[1]} sends a message to ${m[2]} — describe row state with a Note over the writer and the store`);
  }
}

function checkFlowchart(b, body) {
  const edgeIds = [...body.matchAll(/\b([A-Za-z_][\w]*)@(?:--|==|-\.)/g)].map((m) => m[1]);
  if (edgeIds.length === 0) {
    if (/\(\[\s*"?▶/.test(body)) warnings.push(`${b.label}: flowchart with an entry node but no path animation — fine only if it shows no path`);
    return;
  }
  if (!/@keyframes/.test(b.src)) problems.push(`${b.label}: path edges without themeCSS keyframes`);
  const animated = new Set();
  for (const m of body.matchAll(/^\s*classDef\s+([\w-]+)\s+([^\n]*)$/gm)) if (/animation\s*:/.test(m[2])) animated.add(m[1]);
  const edgeClass = new Map();
  for (const m of body.matchAll(/^\s*class\s+([\w,]+)\s+([\w-]+)\s*$/gm)) for (const id of m[1].split(',')) edgeClass.set(id, m[2]);
  for (const id of edgeIds) {
    const cls = edgeClass.get(id);
    if (!cls || !animated.has(cls)) problems.push(`${b.label}: path edge ${id} has no animated class`);
  }
}

// --- sequence diagrams (rendered SVG) ----------------------------------------

const attr = (tag, name) => (tag.match(new RegExp(`\\s${name}="([^"]*)"`)) || [])[1];
const shapes = new Map();

for (const b of blocks) {
  if (!b.svg || !/messageLine[01]/.test(b.svg)) continue;
  const lines = [...b.svg.matchAll(/<line\b[^>]*class="messageLine[01]"[^>]*>/g)]
    .map(([tag]) => ({
      y: parseFloat(attr(tag, 'y1')),
      reply: /messageLine1/.test(tag),
      id: attr(tag, 'data-id'),
      from: attr(tag, 'data-from'),
      to: attr(tag, 'data-to'),
    }))
    .filter((l) => l.id)
    .sort((a, c) => a.y - c.y);
  const texts = [...b.svg.matchAll(/<text\b([^>]*class="messageText"[^>]*)>([\s\S]*?)<\/text>/g)]
    .map((m) => ({ y: parseFloat(attr(m[1], 'y')), t: m[2].replace(/<[^>]+>/g, '') }))
    .sort((a, c) => a.y - c.y);
  const rules = new Map();
  for (const m of b.svg.matchAll(/\[data-id=["']?(i\d+)["']?\][^{]*\{([^}]*)\}/g)) {
    const anim = (m[2].match(/animation\s*:\s*([^;]+)/) || [])[1];
    if (!anim) continue;
    const times = [...anim.matchAll(/([\d.]+)s\b/g)].map((t) => parseFloat(t[1]));
    const kf = anim.split(/\s+/).find((t) => /^[A-Za-z_][\w-]*$/.test(t) && !KEYWORDS.has(t));
    rules.set(m[1], { delay: times[1] ?? 0, kf: kf ?? '?' });
  }

  console.log(`\n== ${b.label} sequence`);
  if (rules.size === 0) problems.push(`${b.label}: sequence diagram without path animation`);
  let prev = -1;
  const seen = new Set();
  lines.forEach((l, k) => {
    const r = rules.get(l.id);
    // a message's text is drawn above its line: take the nearest text above it
    const text = texts.filter((t) => t.y <= l.y).at(-1)?.t ?? '?';
    console.log(
      `  ${String(k + 1).padStart(2)}. ${l.id.padEnd(5)} ${`${l.from}->${l.to}`.padEnd(14)} ${l.reply ? 'reply' : 'call '} ` +
        `delay=${r ? `${r.delay}s` : '-'} ${r ? r.kf : '—'} | ${text}`,
    );
    if (rules.size && !r) problems.push(`${b.label}: message ${k + 1} (${l.id}) has no animation rule`);
    if (r) {
      if (r.delay <= prev) problems.push(`${b.label}: delay of message ${k + 1} (${l.id}) does not increase`);
      prev = r.delay;
    }
    if (l.reply && !seen.has(`${l.to}>${l.from}`)) problems.push(`${b.label}: reply ${l.from}->${l.to} (message ${k + 1}) has no earlier request`);
    seen.add(`${l.from}>${l.to}`);
  });
  const ids = new Set(lines.map((l) => l.id));
  for (const id of rules.keys()) if (!ids.has(id)) problems.push(`${b.label}: animation rule for ${id} hits no message`);

  // read-path shape: from the first message sent by a participant not seen before
  const parts = new Set();
  let start = 0;
  for (let k = 0; k < lines.length; k++) {
    if (k > 0 && !parts.has(lines[k].from)) {
      start = k;
      break;
    }
    parts.add(lines[k].from).add(lines[k].to);
  }
  shapes.set(b.label, lines.slice(start).map((l) => `${l.from}->${l.to}`).join(' , '));
}

if (new Set(shapes.values()).size > 1) {
  warnings.push(`runtime flows differ in journey shape — check they are meant to:\n${[...shapes].map(([n, s]) => `      ${n}: ${s}`).join('\n')}`);
}

// --- report ------------------------------------------------------------------

console.log(`\n${blocks.length} block(s), SVG/PNG in ${out}`);
if (warnings.length) console.log(`\nWARNINGS:\n${warnings.map((w) => `  - ${w}`).join('\n')}`);
if (problems.length) {
  console.log(`\nPROBLEMS:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
  process.exit(1);
}
console.log('\nOK');

