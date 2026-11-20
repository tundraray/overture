import fs from 'node:fs';
const all = JSON.parse(fs.readFileSync(new URL('./all.json', import.meta.url)));
const dur = c => c.tEnd ? (new Date(c.tEnd) - new Date(c.t)) / 1000 : 0;
let T = { e2eSec: 0, totSec: 0, shellSec: 0, bg180: 0, poll: 0, skipGrep: 0, verbose: 0, opsVerif: 0, prose: 0, docsRead: 0, testEdits: 0 };
for (const a of all) {
  const id = `${a.session} ${a.file.slice(6, 12)}`;
  const tot = (new Date(a.t1) - new Date(a.t0)) / 1000;
  let e2e = 0, shell = 0, bg180 = 0, poll = 0, skipGrep = 0, verbose = 0, ops = 0, docs = [], testEdits = new Set(), srcEdits = new Set();
  let hb = [];
  for (const c of a.calls) {
    const d = dur(c);
    const k = c.key || '';
    if (c.name === 'Bash' || c.name === 'PowerShell') {
      shell += d;
      if (/(test:e2e|vitest\.config\.e2e|test:verify|vitest\.config\.verify|test:int|pnpm check\b)/.test(k) && d > 5) e2e += d;
      if (d >= 178 && d <= 183) bg180++;
      if (/tasks\/[a-z0-9]+\.output|until grep|for i in \$\(seq|sleep \d+; *(echo|cat|tail|sed)/.test(k)) poll++;
      if (/describe\.skip|it\.skip|it\.todo|skipIf|test\.todo/.test(k)) skipGrep++;
      if (/reporter=verbose|reporter verbose/.test(k)) verbose++;
      if (/curl .*localhost|dist\/main|pnpm dev\b|identity:super-admin/.test(k)) ops++;
      const m = k.match(/docs\/features\/[^\s'"|;)]+/g); if (m) docs.push(...m);
      const se = k.match(/(?:sed -i[^;&|]*?|p='|open\(')([\w./-]+\.(?:spec|test|e2e-spec|verify)\.tsx?)/g); if (se) se.forEach(x => testEdits.add(x.slice(-50)));
    }
    if (c.name === 'Monitor') poll++;
    if (c.name === 'Read' && /docs[\\/]/.test(k)) docs.push(k);
    if ((c.name === 'Edit' || c.name === 'Write') && /(spec|test|verify)\.tsx?$/.test(k)) testEdits.add(k.slice(-50));
    if ((c.name === 'Edit' || c.name === 'Write') && !/(spec|test|verify)\.tsx?$/.test(k)) srcEdits.add(k.slice(-50));
    if (c.name === 'SubagentHandback') hb.push(c.input.message || '');
  }
  const last = hb[hb.length - 1] || a.final;
  const isJson = /^\s*(```json\s*)?\{/.test(last);
  console.log(`${id} tot=${(tot / 60).toFixed(1)}m shell=${(shell / 60).toFixed(1)}m e2e=${(e2e / 60).toFixed(1)}m bg180=${bg180} poll=${poll} skipGrep=${skipGrep} verbose=${verbose} ops=${ops} docs=${new Set(docs).size} testEdits=${testEdits.size} hb=${hb.length} json=${isJson} len=${last.length} :: ${last.slice(0, 70).replace(/\s+/g, ' ')}`);
  T.e2eSec += e2e; T.totSec += tot; T.shellSec += shell; T.bg180 += bg180; T.poll += poll; T.skipGrep += skipGrep; T.verbose += verbose; T.opsVerif += ops ? 1 : 0; T.prose += isJson ? 0 : 1; T.testEdits += testEdits.size ? 1 : 0;
}
console.log(JSON.stringify(T), 'n=', all.length);
