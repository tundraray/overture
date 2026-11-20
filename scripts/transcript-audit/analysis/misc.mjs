import fs from 'fs';
const all = JSON.parse(fs.readFileSync('D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/analysis/agents.json', 'utf8'));
const EX = new Set(['task-executor', 'task-executor-frontend', 'quality-fixer', 'quality-fixer-frontend', 'prd-creator', 'ux-designer', 'technical-designer', 'technical-designer-frontend', 'work-planner', 'acceptance-test-generator', 'document-reviewer']);
const mine = all.filter(a => !EX.has(a.type));
console.log('--- LSP / ToolSearch');
for (const a of mine) for (const c of a.calls) if (c.name === 'LSP' || c.name === 'ToolSearch') console.log(a.type, a.sess, a.id.slice(6, 14), c.name, c.in.slice(0, 120), '->', (c.res || '').slice(0, 200), c.resLen);
console.log('--- handback heads');
const seen = {};
for (const a of mine) { seen[a.type] = (seen[a.type] || 0) + 1; if (seen[a.type] > 3) continue; const hb = a.calls.find(c => c.name === 'SubagentHandback'); console.log(`\n[${a.type} ${a.id.slice(6, 14)} len=${hb?.msgLen}] PROMPT-TAIL: …${a.prompt.slice(-260)}\n  HB: ${hb?.msg.slice(0, 260)}`); }
// time split: per type, share of calls that are shell text search vs Grep/Read; first-call latency
console.log('--- git diff/status details for reviewers');
const R = new Set(['code-reviewer', 'code-verifier', 'security-reviewer', 'test-auditor', 'integration-test-reviewer']);
let whole = 0, stat = 0, perfile = 0, status = 0, insts = 0, wholeLen = 0;
for (const a of all.filter(a => R.has(a.type))) { insts++; for (const c of a.calls) if (c.name === 'Bash' || c.name === 'PowerShell') {
  const parts = c.in.split(/;|&&/);
  for (const p of parts) { if (/git status/.test(p)) status++; if (/git diff/.test(p)) { if (/--stat|--name-only|--name-status|--numstat/.test(p)) stat++; else if (/\.(tsx?|md|json|sql)\b/.test(p)) perfile++; else { whole++; wholeLen += c.resLen || 0; } } } } }
console.log({ insts, status, stat, perfile, whole, wholeLen });
// dup reads incl partial within instance, and doc full reads >40k by type
console.log('--- big full reads (file, count, total chars) in slice');
const big = {};
for (const a of mine) for (const c of a.calls) if (c.name === 'Read' && (c.resLen || 0) > 40000) { const k = a.type + ' ' + c.in.split(/[\\/]/).slice(-2).join('/'); big[k] = big[k] || [0, 0]; big[k][0]++; big[k][1] += c.resLen; }
for (const [k, v] of Object.entries(big).sort((a, b) => b[1][1] - a[1][1]).slice(0, 30)) console.log(k, v.join(' '));
