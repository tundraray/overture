import fs from 'node:fs';
const all = JSON.parse(fs.readFileSync(new URL('./all.json', import.meta.url)));
const pats = {
  lint: /\b(lint|oxlint|eslint)\b/,
  knip: /\bknip\b/,
  typecheck: /\b(typecheck|tsc)\b/,
  build: /\bbuild\b/,
  format: /\b(prettier|format(:check)?)\b/,
  unit: /(pnpm[^|;&]*\btest\b(?!:)|vitest run|turbo[^|;&]*\btest\b)/,
  e2e: /(test:e2e|e2e-spec|test:int|\.int\.|playwright test|test:all|e2e\b)/,
  coverage: /coverage|test:cov/,
  gitStatus: /git status/, gitDiff: /git diff/, gitLog: /git (log|show)/, gitOther: /git (stash|checkout|restore|add|commit|reset)/,
  pkgjson: /package\.json/,
  docs: /docs\/(features|adr|code-system|design-system)/,
  sedEdit: /sed -i|python - <<|node -e .*writeFileSync|perl -pi/,
  sleep: /\bsleep \d+/,
  cicfg: /\.github|turbo\.json|knip\.json|README|CLAUDE\.md/,
};
const tot = {}; const rows = [];
for (const a of all) {
  const r = { id: `${a.session} ${a.file.slice(6, 12)} ${a.type.replace('quality-fixer', 'qf')}`, min: ((new Date(a.t1) - new Date(a.t0)) / 60000).toFixed(1), calls: a.calls.length, err: a.calls.filter(c => c.err).length };
  let firstCheck = -1, i = 0, shellSec = 0, bg = 0;
  for (const c of a.calls) {
    i++;
    if (c.name === 'Bash' || c.name === 'PowerShell') {
      const d = c.tEnd ? (new Date(c.tEnd) - new Date(c.t)) / 1000 : 0; shellSec += d;
      if (/^\[BG\]/.test(c.key)) bg++;
      for (const [k, p] of Object.entries(pats)) if (p.test(c.key)) { r[k] = (r[k] || 0) + 1; tot[k] = (tot[k] || 0) + 1; }
      if (firstCheck < 0 && /(lint|knip|typecheck|tsc|vitest|pnpm[^|;&]*test|turbo)/.test(c.key) && !/^(cat|grep|ls|sed -n)/.test(c.key.replace(/^\[.*?\] /g, ''))) firstCheck = i;
    }
    if (['Read', 'Grep', 'Glob', 'Edit', 'Write', 'Monitor', 'Agent', 'Skill', 'TodoWrite', 'ToolSearch'].includes(c.name)) r[c.name] = (r[c.name] || 0) + 1;
    if (c.name.startsWith('mcp__')) r.mcp = (r.mcp || 0) + 1;
    if (c.name === 'SubagentHandback') { r.hb = (r.hb || 0) + 1; r.hbLen = JSON.stringify(c.input).length; }
  }
  r.firstCheck = firstCheck; r.shellMin = (shellSec / 60).toFixed(1); r.bg = bg;
  r.scope = (a.prompt.match(/scope:\s*\w+/i) || [''])[0];
  rows.push(r);
}
for (const r of rows) console.log(JSON.stringify(r));
console.log('TOTAL', JSON.stringify(tot));
