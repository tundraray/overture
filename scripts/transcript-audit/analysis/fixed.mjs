import fs from 'fs';
import path from 'path';
import readline from 'readline';
const REPO = 'D:/git/github/ai/claude-code-workflows';
const ROOT = 'C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os/';
const SESS = ['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9', 'eae5f417-51c8-495d-8f00-5ecd3d2d6117', 'bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const all = JSON.parse(fs.readFileSync('D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/analysis/agents.json', 'utf8'));
// first-turn usage
const first = {};
for (const s of SESS) {
  const dir = path.join(ROOT, s, 'subagents');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.jsonl'))) {
    const rl = readline.createInterface({ input: fs.createReadStream(path.join(dir, f)), crlfDelay: Infinity });
    for await (const line of rl) {
      if (!line.includes('"type":"assistant"')) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      const u = o.message?.usage; if (!u) continue;
      first[f.replace('.jsonl', '')] = (u.input_tokens || 0) + (u.cache_read_input_tokens || 0) + (u.cache_creation_input_tokens || 0);
      break;
    }
    rl.close();
  }
}
const types = {};
for (const a of all) { const t = types[a.type] = types[a.type] || { n: 0, calls: 0, wall: 0, out: 0, ft: [], pre: {} }; t.n++; t.calls += a.calls.length; t.wall += a.wall; t.out += a.outTok; if (first[a.id]) t.ft.push(first[a.id]); for (const p of a.preloaded) if (p.afterCalls === 0) t.pre[p.skill] = p.len; }
const skillLen = n => { for (const base of ['skills', 'gamedev/skills']) { const p = `${REPO}/${base}/${n}/SKILL.md`; if (fs.existsSync(p)) return fs.readFileSync(p, 'utf8').length; } return null; };
console.log('type | n | calls | wall_h | out_k | agentChars | skillsChars(now) | fixedTok~(chars/4) | firstTurnInTok(median) | skills now');
for (const [k, t] of Object.entries(types).sort((a, b) => b[1].wall - a[1].wall)) {
  let ac = null, sk = [], sc = 0;
  for (const p of [`${REPO}/agents/${k}.md`, `${REPO}/gamedev/agents/${k}.md`]) if (fs.existsSync(p)) {
    const txt = fs.readFileSync(p, 'utf8'); ac = txt.length;
    const fm = /^---\n([\s\S]*?)\n---/.exec(txt.replace(/\r/g, ''));
    const m = fm && /^skills:\s*(.*)$/m.exec(fm[1]);
    if (m) { let list = m[1].trim() ? m[1].split(',').map(s => s.trim()) : [...fm[1].split(/^skills:.*$/m)[1].matchAll(/^\s+-\s+(\S+)/gm)].map(x => x[1]); for (const s of list) { const l = skillLen(s.replace(/^.*:/, '')); sk.push(`${s}=${l}`); sc += l || 0; } }
    break;
  }
  t.ft.sort((a, b) => a - b);
  const then = Object.values(t.pre).reduce((a, b) => a + b, 0);
  console.log(`${k} | ${t.n} | ${t.calls} | ${(t.wall / 3600).toFixed(1)} | ${Math.round(t.out / 1000)} | ${ac ?? '-'} | ${sc} (then ${then}) | ${ac ? Math.round((ac + sc) / 4000) + 'k' : '-'} | ${t.ft.length ? Math.round(t.ft[t.ft.length >> 1] / 1000) + 'k' : '-'} | ${sk.join(' ')}`);
}
