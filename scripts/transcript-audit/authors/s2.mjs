import fs from 'fs';
const D = 'D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/authors/out';
const all = JSON.parse(fs.readFileSync(D + '/all.json', 'utf8'));
const ty = r => r.agentType.replace('fullstack-overture:', '');
const id = r => r.file.replace(/^agent-|\.jsonl$/g, '');
const byId = new Map(all.map(r => [id(r), r]));
const AUTH = /^(prd-creator|ux-designer|technical-designer|technical-designer-frontend|work-planner|acceptance-test-generator)$/;
const nrm = s => s.replace(/\\/g, '/');
const sum = (a, f) => a.reduce((x, y) => x + (f(y) || 0), 0);
const mode = process.argv[2];
const real = r => r.calls.filter(c => c.name !== 'USER');

if (mode === 'preload') {
  const m = {};
  for (const r of all) { if (!AUTH.test(ty(r)) && ty(r) !== 'document-reviewer') continue; const k = ty(r); m[k] = m[k] || {}; for (const c of r.calls) if (c.name === 'USER') { const mm = /<command-name>([^<]+)<\/command-name>/.exec(c.input); if (mm) { const L = +/^\[(\d+)ch\]/.exec(c.input)[1]; m[k][mm[1]] = m[k][mm[1]] || { n: 0, ch: L }; m[k][mm[1]].n++; } } m[k]._runs = (m[k]._runs || 0) + 1; }
  for (const [k, v] of Object.entries(m)) { console.log(k, 'runs', v._runs, 'total preload ch/run ~', Object.entries(v).filter(([a]) => a !== '_runs').reduce((x, [, y]) => x + y.ch * y.n / v._runs, 0).toFixed(0)); console.log('   ', Object.entries(v).filter(([a]) => a !== '_runs').map(([a, b]) => `${a}:${b.n}x${b.ch}`).join(' ')); }
}
if (mode === 'plugreads') {
  // reads of plugin files / memory per type
  const m = {};
  for (const r of all) { if (!AUTH.test(ty(r)) && ty(r) !== 'document-reviewer') continue; const seen = {}; for (const c of real(r)) if (c.name === 'Read') { const p = nrm(c.input).replace(/ @.*| \+\d+$/, ''); let k = null; if (/plugins\/cache/.test(p)) k = p.replace(/.*plugins\/cache\/[^/]+\/[^/]+\/[^/]+\//, 'P/'); else if (/agent-memory/.test(p)) k = 'MEMORY/*'; else if (/\.claude\/skills/.test(p)) k = p.replace(/.*\.claude\//, ''); else if (/\.png$/.test(p)) k = 'PNG'; if (!k) continue; const kk = ty(r) + (r.depth > 1 ? '*' : '') + ' ' + k; m[kk] = m[kk] || { runs: 0, reads: 0, ch: 0 }; m[kk].reads++; m[kk].ch += c.resLen || 0; if (!seen[kk]) { seen[kk] = 1; m[kk].runs++; } } }
  for (const [k, v] of Object.entries(m).sort()) if (v.reads >= 3) console.log(k, 'runs', v.runs, 'reads', v.reads, 'ch', v.ch);
}
if (mode === 'reviewers') {
  const rows = [];
  for (const r of all) {
    if (ty(r) !== 'document-reviewer') continue;
    const c = real(r); const par = r.parent && byId.get(r.parent) ? ty(byId.get(r.parent)) : 'orchestrator';
    const hb = c.filter(x => x.name === 'SubagentHandback').pop(); const msg = hb ? hb.input : '';
    const hbLen = hb ? +/^\[(\d+)ch\]/.exec(msg)[1] : 0;
    const target = (/target:\s*(\S+)/.exec(r.prompt) || /Document:\s*(\S+)/.exec(r.prompt) || [])[1] || '';
    const tn = nrm(target).toLowerCase().split('/').pop();
    const scope = (/review_scope:\s*(\w+)/.exec(r.prompt) || [, /changed|diff/i.test(r.prompt) ? 'changes?' : '?'])[1];
    const tgtReads = c.filter(x => x.name === 'Read' && tn && nrm(x.input).toLowerCase().includes(tn));
    const src = c.filter(x => (x.name === 'Read' || x.name === 'Grep' || x.name === 'Glob' || x.name === 'Bash') && /apps\/|packages\/|src\//.test(nrm(x.input)) && !/docs\/features/.test(nrm(x.input).slice(0, 80))).length;
    const status = (/approved_with_conditions|needs_revision|rejected|approved/.exec(msg) || ['?'])[0];
    const isJson = /^\[\d+ch\]\s*(```json|\{)/.test(msg);
    const crit = (msg.match(/"severity":\s*"critical"|\bcritical\b/g) || []).length;
    const ids = new Set(msg.match(/\b[CIR]\d{3}\b/g) || []);
    rows.push({ s: r.session, f: id(r).slice(0, 9), par, scope, doc: tn, calls: c.length, dur: r.durMin, out: r.outTok, cacheRead: r.cacheRead, tgtReads: tgtReads.length, tgtCh: sum(tgtReads, x => x.resLen), src, mermaid: c.filter(x => /check-mermaid/.test(x.input)).length, png: c.filter(x => x.name === 'Read' && /\.png/.test(x.input)).length, mem: c.filter(x => /agent-memory/.test(x.input)).length, web: c.filter(x => /WebFetch|WebSearch/.test(x.name)).length, err: c.filter(x => x.err).length, hbLen, status, isJson, ids: ids.size, promptLen: r.promptLen });
  }
  fs.writeFileSync(D + '/reviewers.json', JSON.stringify(rows));
  const g = (a, f) => sum(a, f);
  for (const grp of ['nested', 'top']) { const a = rows.filter(r => grp === 'nested' ? r.par !== 'orchestrator' : r.par === 'orchestrator'); console.log(grp, 'n', a.length, 'calls', g(a, r => r.calls), 'dur', g(a, r => r.dur).toFixed(0), 'out', g(a, r => r.out), 'cacheRead', g(a, r => r.cacheRead), 'tgtReads', g(a, r => r.tgtReads), 'srcCalls', g(a, r => r.src), 'mermaid', g(a, r => r.mermaid), 'runsWithMermaid', a.filter(r => r.mermaid).length, 'png', g(a, r => r.png), 'mem', g(a, r => r.mem), 'web', g(a, r => r.web), 'hbLen avg', (g(a, r => r.hbLen) / a.length).toFixed(0), 'json', a.filter(r => r.isJson).length); const st = {}; a.forEach(r => st[r.status] = (st[r.status] || 0) + 1); console.log('  status', JSON.stringify(st)); const sc = {}; a.forEach(r => sc[r.scope] = (sc[r.scope] || 0) + 1); console.log('  scope', JSON.stringify(sc)); }
  for (const r of rows.sort((a, b) => a.s.localeCompare(b.s) || a.par.localeCompare(b.par))) console.log(r.s, r.f, r.par.padEnd(27), r.scope.padEnd(8), (r.doc || '').slice(0, 34).padEnd(34), 'n', r.calls, 'dur', r.dur, 'out', r.out, 'tgtR', r.tgtReads, 'src', r.src, 'mm', r.mermaid, 'png', r.png, 'web', r.web, 'hb', r.hbLen, r.status, 'ids', r.ids);
}
if (mode === 'segments') {
  // author runs split by handback: per segment edits, reviewer spawns, mermaid
  let tot = { runs: 0, segs: 0, segsWithReview: 0, reviewSpawns: 0 };
  for (const r of all) {
    if (!AUTH.test(ty(r))) continue; const segs = []; let cur = { calls: [], user: r.prompt.slice(0, 200) };
    for (const c of r.calls) { if (c.name === 'USER') { if (/command-name|system-reminder|\[Image/.test(c.input.slice(0, 200))) continue; if (cur.calls.length) segs.push(cur); cur = { calls: [], user: c.input.slice(0, 260) }; continue; } cur.calls.push(c); }
    if (cur.calls.length) segs.push(cur);
    tot.runs++;
    const line = segs.map(s => { const e = s.calls.filter(x => x.name === 'Edit' && /docs[\\/]/.test(x.input)).length; const w = s.calls.filter(x => x.name === 'Write' && /docs[\\/]/.test(x.input)).length; const a = s.calls.filter(x => x.name === 'Agent').map(x => x.input.split(' :: ')[0].replace('fullstack-overture:', '').replace('document-reviewer', 'DR').replace('code-explorer', 'CE')); const mm = s.calls.filter(x => /check-mermaid/.test(x.input)).length; const hb = s.calls.filter(x => x.name === 'SubagentHandback').pop(); tot.segs++; if (a.includes('DR')) tot.segsWithReview++; tot.reviewSpawns += a.filter(x => x === 'DR').length; const t0 = new Date(s.calls[0].ts), t1 = new Date(s.calls[s.calls.length - 1].ts); return `{n${s.calls.length} ${((t1 - t0) / 60000).toFixed(0)}m W${w}E${e} mm${mm} ${a.join('+')} hb${hb ? /^\[(\d+)/.exec(hb.input)[1] : '-'}}`; }).join(' ');
    if (process.argv[3] !== 'q') console.log(r.session, id(r).slice(0, 9), ty(r).padEnd(27), 'segs', segs.length, line);
  }
  console.log(JSON.stringify(tot));
}
