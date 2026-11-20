import fs from 'fs';
const all = JSON.parse(fs.readFileSync('D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/analysis/agents.json', 'utf8'));
const R = new Set(['code-reviewer', 'code-verifier', 'security-reviewer', 'test-auditor', 'integration-test-reviewer']);
const rev = all.filter(a => R.has(a.type)).sort((x, y) => x.first.localeCompare(y.first));
const groups = [];
for (const a of rev) { const g = groups.at(-1); if (g && a.sess === g[0].sess && (new Date(a.first) - new Date(g[0].first)) < 120000) g.push(a); else groups.push([a]); }
const BS = String.fromCharCode(92);
const files = a => {
  const m = new Map();
  for (const c of a.calls) {
    let ps = [];
    if (c.name === 'Read') ps = [c.in.replace(/ \[.*$/, '')];
    else if (c.name === 'Bash' || c.name === 'PowerShell') { if (/\b(cat|sed|head|tail|git diff|git show)\b/.test(c.in)) ps = (c.in.match(/[^\s"'|;]+\.(tsx?|md|json|sql|ya?ml|mjs|css)\b/g) || []); }
    for (let p of ps) { p = p.split(BS).join('/').replace(/^.*agent-os\//i, '').toLowerCase(); m.set(p, (m.get(p) || 0) + (c.resLen || 0)); }
  }
  return m;
};
let totU = 0, totS = 0;
for (const g of groups) {
  if (g.length < 2) continue;
  const fm = g.map(files); const cnt = new Map();
  for (const m of fm) for (const k of m.keys()) cnt.set(k, (cnt.get(k) || 0) + 1);
  const shared = [...cnt].filter(([k, v]) => v >= 2); const sum = fm.reduce((s, m) => s + m.size, 0);
  totU += cnt.size; totS += sum;
  console.log(`${g[0].sess} ${g[0].first.slice(5, 16)} [${g.map((a, i) => a.type + ':' + a.id.slice(6, 12) + '=' + fm[i].size).join(', ')}] unique=${cnt.size} sum=${sum} shared2+=${shared.length} shared3+=${shared.filter(x => x[1] >= 3).length} docs: ${shared.filter(x => /\.md$/.test(x[0])).map(x => x[0].split('/').slice(-2).join('/') + 'x' + x[1]).join(' ')}`);
}
console.log('unique', totU, 'sum', totS);
