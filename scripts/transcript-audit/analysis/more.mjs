import fs from 'fs';
const all = JSON.parse(fs.readFileSync('D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/analysis/agents.json', 'utf8'));
const EX = new Set(['task-executor', 'task-executor-frontend', 'quality-fixer', 'quality-fixer-frontend', 'prd-creator', 'ux-designer', 'technical-designer', 'technical-designer-frontend', 'work-planner', 'acceptance-test-generator', 'document-reviewer']);
const mine = all.filter(a => !EX.has(a.type));
const BS = String.fromCharCode(92);
const norm = p => p.split(BS).join('/').toLowerCase();
// A: designer prompts after analyzers
console.log('--- designer prompt lengths (d1)');
for (const a of all.filter(a => /technical-designer|ux-designer|prd-creator/.test(a.type) && a.depth === 1).sort((x, y) => x.first.localeCompare(y.first))) console.log(a.sess, a.first.slice(5, 16), a.type, 'promptLen', a.promptLen, '|', a.desc);
// B: verdicts
console.log('--- reviewer verdicts');
const R = new Set(['code-reviewer', 'code-verifier', 'security-reviewer', 'test-auditor', 'integration-test-reviewer', 'design-sync']);
for (const a of all.filter(a => R.has(a.type)).sort((x, y) => x.first.localeCompare(y.first))) {
  const hb = a.calls.find(c => c.name === 'SubagentHandback'); const m = hb?.msg || '';
  const v = (m.match(/(verdict|Verdict|syncStatus|consistencyScore|"status"|"decision"|complianceRate)[^.,\n}]{0,70}/g) || []).slice(0, 3).join(' ; ');
  console.log(a.sess, a.first.slice(5, 16), a.type, a.id.slice(6, 12), '|', a.desc, '|', v.slice(0, 200));
}
// I: repeated reads of same file within instance (any range)
console.log('--- repeat reads per type (Read tool, same file >1 time; wasted chars = all but largest)');
const rr = {};
for (const a of mine) { const m = {}; for (const c of a.calls) if (c.name === 'Read') { const f = norm(c.in.replace(/ \[.*$/, '')); (m[f] = m[f] || []).push({ full: !/\[/.test(c.in), len: c.resLen || 0 }); }
  const s = rr[a.type] = rr[a.type] || { inst: 0, n: 0, files: 0, extra: 0, chars: 0, fullThenPart: 0 }; s.n++; let hit = 0;
  for (const v of Object.values(m)) if (v.length > 1) { hit = 1; s.files++; s.extra += v.length - 1; if (v[0].full && v[0].len < 60000) { s.fullThenPart++; s.chars += v.slice(1).reduce((x, y) => x + y.len, 0); } }
  s.inst += hit; }
for (const [k, s] of Object.entries(rr)) console.log(k, JSON.stringify(s));
// L: general-purpose list
console.log('--- general-purpose / Explore');
for (const a of mine.filter(a => /general-purpose|Explore/.test(a.type)).sort((x, y) => x.first.localeCompare(y.first))) { const t = {}; for (const c of a.calls) t[c.name.replace(/mcp__plugin_playwright_playwright__/, 'pw_')] = (t[c.name.replace(/mcp__plugin_playwright_playwright__/, 'pw_')] || 0) + 1; console.log(a.sess, a.first.slice(5, 16), a.type, 'd' + a.depth, Math.round(a.wall / 60) + 'm', a.calls.length, '|', a.desc, '|', Object.entries(t).filter(x => /Edit|Write|pw_|Web/.test(x[0])).map(x => x.join(':')).join(' ')); }
// skill-file reads & plugin path reads
let skr = 0; for (const a of mine) for (const c of a.calls) if (/SKILL\.md|plugins.cache/i.test(c.in) && !/project-context/.test(c.in)) { skr++; if (skr < 8) console.log('SKILLREAD', a.type, a.id.slice(6, 12), c.name, c.in.slice(0, 160)); }
console.log('skill-file reads', skr);
// project-context reads
let pc = 0; for (const a of mine) for (const c of a.calls) if (/project-context/.test(c.in)) pc++; console.log('project-context reads', pc);
// CLAUDE.md reads
let cm = 0; for (const a of mine) for (const c of a.calls) if (/CLAUDE\.md/.test(c.in)) cm++; console.log('CLAUDE.md reads', cm);
// thinking gaps: time between last tool result and handback
console.log('--- time from last non-handback call to handback (s), per type median; and handback share of wall');
const g = {};
for (const a of mine) { const i = a.calls.findIndex(c => c.name === 'SubagentHandback'); if (i < 1) continue; const d = (new Date(a.calls[i].ts) - new Date(a.calls[i - 1].resTs || a.calls[i - 1].ts)) / 1000; (g[a.type] = g[a.type] || []).push([d, a.wall]); }
for (const [k, v] of Object.entries(g)) { const tot = v.reduce((s, x) => s + x[0], 0), w = v.reduce((s, x) => s + x[1], 0); console.log(k, 'n', v.length, 'writeHandback total min', (tot / 60).toFixed(0), 'of wall min', (w / 60).toFixed(0), Math.round(100 * tot / w) + '%'); }
