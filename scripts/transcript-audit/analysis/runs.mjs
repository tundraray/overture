import fs from 'fs';
const all = JSON.parse(fs.readFileSync('D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/analysis/agents.json', 'utf8'));
const T = new Set(['code-reviewer', 'code-verifier', 'security-reviewer', 'test-auditor', 'integration-test-reviewer', 'codebase-analyzer', 'ui-analyzer', 'requirement-analyzer', 'design-sync', 'code-explorer', 'expert-analyst', 'Explore', 'task-decomposer']);
const RUN = /\b(vitest|jest|tsc|pnpm|npm|npx|turbo|eslint|biome|playwright|knip|docker|curl|psql)\b/i;
const st = {};
for (const a of all.filter(a => T.has(a.type))) {
  const s = st[a.type] = st[a.type] || { n: 0, json: 0, hbTot: 0, runInst: 0, runs: 0, runSec: 0, errs: {}, sleep: 0 };
  s.n++;
  const hb = a.calls.find(c => c.name === 'SubagentHandback');
  if (hb) { s.hbTot += hb.msgLen; if (/^\s*(```json\s*)?\{/.test(hb.msg)) s.json++; }
  let r = 0;
  for (const c of a.calls) {
    if ((c.name === 'Bash' || c.name === 'PowerShell')) {
      const cmd = c.in;
      if (RUN.test(cmd) && !/^\s*(grep|rg|cat|sed|ls|git|wc|find|head)\b/.test(cmd.replace(/^cd \S+\s*(&&|;)\s*/, ''))) {
        r++; const d = c.resTs ? (new Date(c.resTs) - new Date(c.ts)) / 1000 : 0; s.runSec += d;
        console.log(`${a.type} ${a.sess} ${a.id.slice(6, 16)} ${Math.round(d)}s :: ${cmd.slice(0, 190)}`);
      }
    }
    if (c.err) { const k = (c.name + ': ' + (c.res || '').slice(0, 90)); s.errs[k] = (s.errs[k] || 0) + 1; }
  }
  if (r) { s.runInst++; s.runs += r; }
}
for (const [k, s] of Object.entries(st)) { console.log(`\n${k} n=${s.n} jsonHandback=${s.json} hbAvg=${Math.round(s.hbTot / s.n)} runInst=${s.runInst} runs=${s.runs} runSec=${Math.round(s.runSec)}`); for (const [e, n] of Object.entries(s.errs)) console.log('   ERR x' + n, e); }
