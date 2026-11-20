import fs from 'fs';
import path from 'path';
import readline from 'readline';
const ROOT = 'C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os/';
const SESS = { '28626df2': '28626df2-d3ad-48f3-9042-0ea1a6ebb1f9', 'eae5f417': 'eae5f417-51c8-495d-8f00-5ecd3d2d6117', 'bb45672c': 'bb45672c-c0b7-4a03-b437-47f4b8c086ef' };
const all = JSON.parse(fs.readFileSync('D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/analysis/agents.json', 'utf8'));
const T = new Set(process.argv.slice(2));
const agg = {};
for (const a of all.filter(a => T.has(a.type))) {
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(ROOT, SESS[a.sess], 'subagents', a.id + '.jsonl')), crlfDelay: Infinity });
  let msg = null;
  for await (const line of rl) { if (!line.includes('SubagentHandback')) continue; let o; try { o = JSON.parse(line); } catch { continue; } for (const b of o.message?.content || []) if (b.type === 'tool_use' && b.name === 'SubagentHandback') msg = b.input.message; }
  if (!msg) continue;
  const g = agg[a.type] = agg[a.type] || { n: 0, parsed: 0, total: 0, keys: {} };
  g.n++; g.total += msg.length;
  let j = null; const s = msg.indexOf('{'), e = msg.lastIndexOf('}');
  try { j = JSON.parse(msg.slice(s, e + 1)); } catch {}
  if (!j) { g.keys['(unparsed/prose)'] = (g.keys['(unparsed/prose)'] || 0) + msg.length; continue; }
  g.parsed++;
  for (const [k, v] of Object.entries(j)) g.keys[k] = (g.keys[k] || 0) + JSON.stringify(v).length;
}
for (const [t, g] of Object.entries(agg)) { console.log(`\n${t} n=${g.n} parsed=${g.parsed} totalChars=${g.total}`); for (const [k, v] of Object.entries(g.keys).sort((a, b) => b[1] - a[1])) console.log(`   ${k}: ${v} (${Math.round(100 * v / g.total)}%)`); }
