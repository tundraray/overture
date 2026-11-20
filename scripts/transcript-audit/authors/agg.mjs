import fs from 'fs';
const D = 'D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/authors/out';
const all = JSON.parse(fs.readFileSync(D + '/all.json', 'utf8'));
const AUTH = /prd-creator|ux-designer|technical-designer|work-planner|acceptance-test-generator/;
const norm = p => String(p).replace(/\\/g, '/').replace(/ @.*| \+\d+$| \[.*/, '').toLowerCase();
const byId = new Map(all.map(r => [r.file.replace(/^agent-|\.jsonl$/g, ''), r]));
const children = r => all.filter(x => x.parent === r.file.replace(/^agent-|\.jsonl$/g, '') && x.session === r.session);
const rows = [];
for (const r of all) {
  const ty = r.agentType.replace('fullstack-overture:', '');
  if (!AUTH.test(ty) && !/document-reviewer/.test(ty)) continue;
  const c = r.calls; const cnt = n => c.filter(x => x.name === n).length;
  const reads = c.filter(x => x.name === 'Read'); const rf = {}; for (const x of reads) { const k = norm(x.input); rf[k] = (rf[k] || 0) + 1; }
  const dupReads = Object.values(rf).reduce((a, b) => a + (b - 1), 0);
  const docW = {}; for (const x of c) if (/^(Write|Edit|MultiEdit)$/.test(x.name)) { const k = norm(x.input); docW[k] = docW[k] || { W: 0, E: 0 }; docW[k][x.name === 'Write' ? 'W' : 'E']++; }
  const skills = c.filter(x => x.name === 'Skill').map(x => x.input.replace('fullstack-overture:', ''));
  const agents = c.filter(x => x.name === 'Agent' || x.name === 'Task').map(x => x.input.split(' :: ')[0].replace('fullstack-overture:', ''));
  const errs = c.filter(x => x.err).length; const hook = c.filter(x => x.resHead && /hook|document-guard|denied/i.test(x.resHead)).length;
  const mermaid = c.filter(x => /check-mermaid/.test(x.input)).length;
  const srcReads = reads.filter(x => !/\/docs\/|\.claude|plugins|scratchpad|skills\//i.test(norm(x.input))).length;
  const pluginReads = reads.filter(x => /\.claude\/plugins|skills\//i.test(norm(x.input))).length;
  const docReads = reads.filter(x => /\/docs\//i.test(norm(x.input))).length;
  const kids = children(r);
  rows.push({ s: r.session, f: r.file.slice(6, 23), ty, depth: r.depth, parentTy: r.parent && byId.get(r.parent) ? byId.get(r.parent).agentType.replace('fullstack-overture:', '') : '', n: c.length, dur: r.durMin, out: r.outTok, Read: reads.length, dupReads, srcReads, pluginReads, docReads, Grep: cnt('Grep'), Glob: cnt('Glob'), Bash: cnt('Bash') + cnt('PowerShell'), LSP: cnt('LSP'), Write: cnt('Write'), Edit: cnt('Edit') + cnt('MultiEdit'), Todo: cnt('TodoWrite'), skills, agents, errs, hook, mermaid, docW, finalLen: r.finalLen, promptLen: r.promptLen, kidsOut: kids.reduce((a, k) => a + k.outTok, 0), kidsCalls: kids.reduce((a, k) => a + k.calls.length, 0), desc: r.description });
}
fs.writeFileSync(D + '/rows.json', JSON.stringify(rows));
const sum = (a, f) => a.reduce((x, y) => x + f(y), 0);
const types = [...new Set(rows.map(r => r.ty + (r.depth > 1 ? '*' : '')))].sort();
console.log('type n | calls Read dup src plugin doc Grep Glob Bash LSP Write Edit Todo Skill Agent errs hook mermaid | dur out finalLen>4k');
for (const t of types) {
  const a = rows.filter(r => r.ty + (r.depth > 1 ? '*' : '') === t);
  const g = f => sum(a, f);
  console.log(t, a.length, '|', g(r => r.n), g(r => r.Read), g(r => r.dupReads), g(r => r.srcReads), g(r => r.pluginReads), g(r => r.docReads), g(r => r.Grep), g(r => r.Glob), g(r => r.Bash), g(r => r.LSP), g(r => r.Write), g(r => r.Edit), g(r => r.Todo), g(r => r.skills.length), g(r => r.agents.length), g(r => r.errs), g(r => r.hook), g(r => r.mermaid), '|', g(r => r.dur).toFixed(0), g(r => r.out), a.filter(r => r.finalLen > 4000).length);
}
// skills
const sk = {}; for (const r of rows) for (const s of r.skills) { const k = r.ty + ' -> ' + s; sk[k] = (sk[k] || 0) + 1; }
console.log('\nSKILL calls'); for (const [k, v] of Object.entries(sk).sort()) console.log(' ', k, v);
const ag = {}; for (const r of rows) for (const s of r.agents) { const k = r.ty + ' -> ' + s; ag[k] = (ag[k] || 0) + 1; }
console.log('\nAGENT spawns'); for (const [k, v] of Object.entries(ag).sort()) console.log(' ', k, v);
console.log('\nper instance');
for (const r of rows.filter(r => r.depth === 1 || !/document-reviewer/.test(r.ty)).sort((a, b) => a.ty.localeCompare(b.ty) || b.n - a.n)) {
  const dw = Object.entries(r.docW).map(([k, v]) => `${k.split('/').slice(-2).join('/')}:W${v.W}E${v.E}`).join(' ');
  console.log(r.s, r.f, r.ty, 'n', r.n, 'dur', r.dur, 'out', r.out, 'R', r.Read, 'dup', r.dupReads, 'src', r.srcReads, 'G', r.Grep + r.Glob, 'B', r.Bash, 'T', r.Todo, 'err', r.errs, 'mm', r.mermaid, 'sk', r.skills.length, 'ag', r.agents.join(','), 'fin', r.finalLen, '|', dw.slice(0, 300), '|', (r.desc || '').slice(0, 60));
}
