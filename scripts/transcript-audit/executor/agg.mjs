import fs from 'fs';
const D = JSON.parse(fs.readFileSync('D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/executor/executors.json', 'utf8'));
const med = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)] ?? 0; };
const sum = a => a.reduce((x, y) => x + y, 0);
const dur = a => (new Date(a.end) - new Date(a.start)) / 60000;
const isShell = c => c.name === 'Bash' || c.name === 'PowerShell';
const cls = c => {
  if (!isShell(c)) return null; const k = c.key;
  const r = [];
  if (/\bgit\b/.test(k)) r.push('git');
  if (/vitest|jest|pnpm[^|;&]*\btest\b|npm (run )?test|playwright/.test(k)) r.push('test');
  if (/tsc\b|typecheck|type-check/.test(k)) r.push('typecheck');
  if (/\blint\b|eslint|biome|prettier|format/.test(k)) r.push('lint');
  if (/\bbuild\b/.test(k)) r.push('build');
  if (/knip/.test(k)) r.push('knip');
  if (/curl|docker|psql/.test(k)) r.push('ops');
  if (/^\s*(cat|head|tail|sed|ls|find|grep|rg|wc|awk)\b/.test(k) && !r.length) r.push('fsread');
  if (!r.length) r.push('other');
  return r;
};
console.log('instances', D.length, 'by type', JSON.stringify(D.reduce((m, a) => (m[a.session + ' ' + a.type] = (m[a.session + ' ' + a.type] || 0) + 1, m), {})));
console.log('calls total', sum(D.map(a => a.calls.length)), 'median', med(D.map(a => a.calls.length)), 'max', Math.max(...D.map(a => a.calls.length)));
console.log('dur min total', sum(D.map(dur)).toFixed(0), 'median', med(D.map(dur)).toFixed(1), 'max', Math.max(...D.map(dur)).toFixed(0));
const tools = {}; for (const a of D) for (const c of a.calls) tools[c.name] = (tools[c.name] || 0) + 1;
console.log('tools', JSON.stringify(Object.entries(tools).sort((a, b) => b[1] - a[1])));
// errors
const errs = {}; let errN = 0;
for (const a of D) for (const c of a.calls) if (c.err) { errN++; const k = c.name + ' | ' + (c.res || '').replace(/\s+/g, ' ').slice(0, 90); errs[k] = (errs[k] || 0) + 1; }
console.log('errors', errN, 'instances', D.filter(a => a.calls.some(c => c.err)).length);
console.log(Object.entries(errs).sort((a, b) => b[1] - a[1]).slice(0, 45).map(e => e[1] + ' ' + e[0]).join('\n'));
// shell classes
const sc = {}; const scInst = {};
for (const a of D) { const seen = new Set(); for (const c of a.calls) for (const k of cls(c) || []) { sc[k] = (sc[k] || 0) + 1; seen.add(k); } for (const k of seen) scInst[k] = (scInst[k] || 0) + 1; }
console.log('shell classes', JSON.stringify(sc), 'inst', JSON.stringify(scInst));
// skills
const sk = {}; let skInst = 0, skDup = 0;
for (const a of D) { const s = a.calls.filter(c => c.name === 'Skill').map(c => c.key); if (s.length) skInst++; if (new Set(s).size < s.length) skDup++; for (const k of s) sk[k] = (sk[k] || 0) + 1; }
console.log('skills inst', skInst, 'dupInst', skDup, JSON.stringify(sk));
// skill file reads via Read
const skr = {}; for (const a of D) for (const c of a.calls) if (c.name === 'Read' && /skills[\\/].*SKILL\.md|skills[\\/].*references/.test(c.key)) { const k = c.key.replace(/.*skills[\\/]/, '').replace(/ \[.*/, ''); skr[k] = (skr[k] || 0) + 1; }
console.log('skill Reads', JSON.stringify(skr));
// reads
let reads = 0, rereads = 0, rereadInst = 0, fullBig = 0; const docReads = {};
for (const a of D) {
  const seen = new Map(); let rr = 0;
  for (const c of a.calls) if (c.name === 'Read') {
    reads++; const p = c.key.replace(/ \[.*/, '').replace(/\\/g, '/').toLowerCase();
    if (seen.has(c.key.toLowerCase())) { rr++; } seen.set(c.key.toLowerCase(), 1);
    if (!/\[/.test(c.key) && c.resSize > 40000) fullBig++;
    let m;
    if (/docs\/features\/.*\/prd\.md/.test(p)) m = 'prd'; else if (/uxrd\.md/.test(p)) m = 'uxrd'; else if (/design-[^/]*\.md/.test(p)) m = 'design'; else if (/docs\/adr/.test(p)) m = 'adr'; else if (/docs\/code-system/.test(p)) m = 'code-system'; else if (/docs\/design-system/.test(p)) m = 'design-system'; else if (/docs\/features\/.*\.md/.test(p)) m = 'plan/task'; else if (/claude\.md|memory/.test(p)) m = 'claude/memory';
    if (m) { docReads[m] = docReads[m] || { n: 0, bytes: 0, inst: new Set() }; docReads[m].n++; docReads[m].bytes += c.resSize || 0; docReads[m].inst.add(a.file); }
  }
  rereads += rr; if (rr) rereadInst++;
}
console.log('reads', reads, 'exact rereads', rereads, 'inst', rereadInst, 'full>40k', fullBig);
console.log('docReads', JSON.stringify(Object.fromEntries(Object.entries(docReads).map(([k, v]) => [k, { n: v.n, kb: Math.round(v.bytes / 1024), inst: v.inst.size }]))));
// same-path reads (any range)
let pathRe = 0; for (const a of D) { const m = {}; for (const c of a.calls) if (c.name === 'Read') { const p = c.key.replace(/ \[.*/, ''); m[p] = (m[p] || 0) + 1; } pathRe += sum(Object.values(m).map(v => v - 1)); }
console.log('same-path re-reads (any range)', pathRe);
// todo
const td = D.map(a => a.calls.filter(c => c.name === 'TodoWrite').length); console.log('TodoWrite total', sum(td), 'median', med(td), 'max', Math.max(...td), 'inst', td.filter(x => x).length);
// plan/task edits
const pe = D.map(a => a.calls.filter(c => /Edit|Write/.test(c.name) && /docs[\\/]features/.test(c.key)).length); console.log('doc edits total', sum(pe), 'median', med(pe), 'max', Math.max(...pe));
// tests
const tr = D.map(a => a.calls.filter(c => (cls(c) || []).includes('test')).length); console.log('test runs total', sum(tr), 'median', med(tr), 'max', Math.max(...tr));
const tc = D.map(a => a.calls.filter(c => (cls(c) || []).includes('typecheck')).length); console.log('typecheck total', sum(tc), 'median', med(tc), 'max', Math.max(...tc));
// runs with no edit since previous run of same class
let noEdit = { test: 0, typecheck: 0, lint: 0, build: 0 }, sameCmd = 0;
for (const a of D) { const last = {}; let editSince = {}; let lastCmd = null;
  for (const c of a.calls) {
    if (/^(Edit|Write|MultiEdit)$/.test(c.name) && !/docs[\\/]/.test(c.key)) { for (const k in editSince) editSince[k] = true; lastCmd = null; }
    for (const k of cls(c) || []) if (k in noEdit) { if (last[k] && !editSince[k]) noEdit[k]++; last[k] = true; editSince[k] = false; }
    if (isShell(c) && (cls(c).some(k => k in noEdit))) { if (lastCmd === c.key) sameCmd++; lastCmd = c.key; }
  } }
console.log('runs w/o code edit since prev same-class run', JSON.stringify(noEdit), 'identical cmd repeated', sameCmd);
// e2e / integration runs
let integ = 0, integInst = new Set(), whole = 0, wholeInst = new Set();
for (const a of D) for (const c of a.calls) if ((cls(c) || []).includes('test')) {
  if (/e2e|integration|\.int\.|playwright|test:e2e|test:int/.test(c.key)) { integ++; integInst.add(a.file); }
  else if (!/\.(test|spec)\.|[-]t |--testNamePattern|src\/|test\/|tests\//.test(c.key)) { whole++; wholeInst.add(a.file); }
}
console.log('integ/e2e runs', integ, 'inst', integInst.size, 'unfiltered suite runs', whole, 'inst', wholeInst.size);
// time in shell classes
const tt = {}; for (const a of D) for (const c of a.calls) if (c.rt) for (const k of cls(c) || []) tt[k] = (tt[k] || 0) + (new Date(c.rt) - new Date(c.t)) / 60000;
console.log('wall min by shell class', JSON.stringify(Object.fromEntries(Object.entries(tt).map(([k, v]) => [k, Math.round(v)]))));
// git subcommands
const g = {}; for (const a of D) for (const c of a.calls) if (isShell(c)) for (const m of c.key.matchAll(/\bgit\s+(?:-C \S+\s+)?([a-z-]+)/g)) g[m[1]] = (g[m[1]] || 0) + 1;
console.log('git', JSON.stringify(g));
// final
console.log('finalLen median', med(D.map(a => a.finalLen)), 'max', Math.max(...D.map(a => a.finalLen)), '>6000:', D.filter(a => a.finalLen > 6000).length, 'non-JSON start', D.filter(a => !/^\s*(```json)?\s*\{/.test(a.final)).length, 'text blocks median', med(D.map(a => a.texts)));
console.log('promptLen median', med(D.map(a => a.promptLen)), 'max', Math.max(...D.map(a => a.promptLen)));
// grep/glob repeats
let srep = 0, sN = 0; for (const a of D) { const s = new Set(); for (const c of a.calls) if (/Grep|Glob/.test(c.name)) { sN++; if (s.has(c.key)) srep++; s.add(c.key); } }
console.log('search', sN, 'exact repeats', srep);
const lsp = {}; for (const a of D) for (const c of a.calls) if (c.name === 'LSP') { const o = (c.key.match(/"operation":"(\w+)"/) || [])[1]; lsp[o] = (lsp[o] || 0) + 1; }
console.log('LSP', JSON.stringify(lsp), 'LSP err', D.flatMap(a => a.calls).filter(c => c.name === 'LSP' && (c.err || /No (references|definition|symbols|hover)|not found|No LSP/i.test(c.res || ''))).length);
// outliers
console.log('\nTOP by calls'); for (const a of [...D].sort((x, y) => y.calls.length - x.calls.length).slice(0, 12)) console.log(a.session, a.file, a.type, a.calls.length, dur(a).toFixed(0) + 'm', a.desc);
console.log('TOP by dur'); for (const a of [...D].sort((x, y) => dur(y) - dur(x)).slice(0, 8)) console.log(a.session, a.file, a.type, a.calls.length, dur(a).toFixed(0) + 'm', a.desc);
// per session summary
for (const s of [...new Set(D.map(a => a.session))]) { const A = D.filter(a => a.session === s); console.log(s, 'n', A.length, 'medCalls', med(A.map(a => a.calls.length)), 'medDur', med(A.map(dur)).toFixed(1), 'medTests', med(A.map(a => a.calls.filter(c => (cls(c) || []).includes('test')).length)), 'skillcalls', sum(A.map(a => a.calls.filter(c => c.name === 'Skill').length)), 'start', A.map(a => a.start).sort()[0], 'end', A.map(a => a.end).sort().pop()); }
