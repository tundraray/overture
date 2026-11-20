import fs from 'fs';
const all = JSON.parse(fs.readFileSync('D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/analysis/agents.json', 'utf8'));
const EX = new Set(['task-executor', 'task-executor-frontend', 'quality-fixer', 'quality-fixer-frontend', 'prd-creator', 'ux-designer', 'technical-designer', 'technical-designer-frontend', 'work-planner', 'acceptance-test-generator', 'document-reviewer']);
const mine = all.filter(a => !EX.has(a.type));
const RUN = /\b(vitest|jest|tsc\b|pnpm (run )?(test|lint|typecheck|build|check)|npm (run )?(test|lint|typecheck|build)|turbo|eslint|biome|playwright test|nx (run|test|lint|build))/i;
const GIT = /\bgit\s+(-C \S+\s+)?(status|diff|log|show|ls-files|blame|rev-parse|branch|merge-base|cat-file|stash|grep)/;
const by = {};
for (const a of mine) {
  const s = by[a.type] = by[a.type] || { n: 0, calls: 0, wall: 0, tools: {}, skill: {}, skillDup: 0, skillPre: 0, pre: {}, run: 0, runInst: 0, git: {}, gitInst: 0, err: 0, errInst: 0, todo: 0, rereadSame: 0, rereadInst: 0, fullBig: 0, lsp: 0, lspErr: 0, grep: 0, dupSearch: 0, finalLen: [], spawn: 0, shellRead: 0, write: 0 };
  s.n++; s.calls += a.calls.length; s.wall += a.wall; s.finalLen.push(a.finalLen);
  const pre = new Set(a.preloaded.filter(p => p.afterCalls === 0).map(p => p.skill));
  for (const p of pre) s.pre[p] = (s.pre[p] || 0) + 1;
  const seenSkill = new Set(), reads = {}, searches = {};
  let ran = 0, git = 0, err = 0, rr = 0;
  for (const c of a.calls) {
    s.tools[c.name] = (s.tools[c.name] || 0) + 1;
    if (c.err) { err++; }
    if (c.name === 'Skill') { const k = c.in.replace('fullstack-overture:', ''); s.skill[k] = (s.skill[k] || 0) + 1; if (seenSkill.has(k)) s.skillDup++; if (pre.has(k)) s.skillPre++; seenSkill.add(k); }
    if (c.name === 'Bash' || c.name === 'PowerShell') {
      if (RUN.test(c.in)) { ran++; }
      const g = GIT.exec(c.in); if (g) { git++; s.git[g[2]] = (s.git[g[2]] || 0) + 1; }
      if (/^\s*(cat|head|tail|sed -n|wc|ls|find|grep|rg|Get-Content|Select-String|Get-ChildItem)\b/.test(c.in)) s.shellRead++;
    }
    if (c.name === 'Read') { const f = c.in.replace(/ \[.*$/, '').replace(/\\/g, '/').toLowerCase(); const full = !/\[/.test(c.in); reads[f] = reads[f] || []; reads[f].push({ full, len: c.resLen || 0 }); if (full && (c.resLen || 0) > 40000) s.fullBig++; }
    if (c.name === 'Grep' || c.name === 'Glob') { s.grep++; searches[c.name + c.in] = (searches[c.name + c.in] || 0) + 1; }
    if (c.name === 'LSP') { s.lsp++; if (c.err || /error|not available|no lsp|No LSP/i.test(c.res || '')) s.lspErr++; }
    if (c.name === 'TodoWrite') s.todo++;
    if (c.name === 'Agent' || c.name === 'Task') s.spawn++;
    if (c.name === 'Write' || c.name === 'Edit') s.write++;
  }
  for (const v of Object.values(reads)) { const fulls = v.filter(x => x.full).length; if (fulls > 1) rr += fulls - 1; }
  for (const v of Object.values(searches)) if (v > 1) s.dupSearch += v - 1;
  s.run += ran; if (ran) s.runInst++; if (git) s.gitInst++; s.err += err; if (err) s.errInst++; s.rereadSame += rr; if (rr) s.rereadInst++;
}
for (const [k, s] of Object.entries(by).sort((x, y) => y[1].calls - x[1].calls)) {
  s.finalLen.sort((a, b) => a - b);
  console.log(`\n== ${k} n=${s.n} calls=${s.calls} wall=${(s.wall / 60).toFixed(0)}min medFinal=${s.finalLen[s.finalLen.length >> 1]} maxFinal=${s.finalLen.at(-1)}`);
  console.log(' tools', JSON.stringify(s.tools));
  console.log(' preloaded', JSON.stringify(s.pre));
  console.log(' skillCalls', JSON.stringify(s.skill), 'dup', s.skillDup, 'alreadyPreloaded', s.skillPre);
  console.log(` run(test/tsc/lint) ${s.run} in ${s.runInst} inst | git ${JSON.stringify(s.git)} in ${s.gitInst} inst | err ${s.err} in ${s.errInst} | todo ${s.todo} | fullReRead ${s.rereadSame} in ${s.rereadInst} | fullBig>40k ${s.fullBig} | lsp ${s.lsp} err ${s.lspErr} | search ${s.grep} dup ${s.dupSearch} | spawn ${s.spawn} | shellRead ${s.shellRead} | write ${s.write}`);
}
