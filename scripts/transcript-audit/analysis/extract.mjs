import fs from 'fs';
import path from 'path';
import readline from 'readline';

const ROOT = 'C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os/';
const SESS = ['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9', 'eae5f417-51c8-495d-8f00-5ecd3d2d6117', 'bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const OUT = 'D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/analysis/agents.json';
const tr = (s, n = 200) => (s == null ? '' : String(s).replace(/\s+/g, ' ').slice(0, n));

function keyInput(name, inp) {
  if (!inp) return '';
  if (name === 'Read') return tr(inp.file_path) + (inp.offset || inp.limit ? ` [${inp.offset || 0}+${inp.limit || ''}]` : '');
  if (name === 'Bash' || name === 'PowerShell') return tr(inp.command, 300);
  if (name === 'Grep') return tr(`${inp.pattern} | ${inp.path || ''} | ${inp.glob || ''} | ${inp.output_mode || ''}`);
  if (name === 'Glob') return tr(`${inp.pattern} | ${inp.path || ''}`);
  if (name === 'Skill') return tr(inp.skill);
  if (name === 'LSP') return tr(`${inp.operation} ${inp.filePath || ''}:${inp.line || ''} ${inp.query || ''}`);
  if (name === 'Agent' || name === 'Task') return tr(`${inp.subagent_type} :: ${inp.description} :: ${inp.prompt}`, 300);
  if (name === 'TodoWrite') return `${(inp.todos || []).length} todos`;
  if (name === 'Edit' || name === 'Write') return tr(inp.file_path);
  return tr(JSON.stringify(inp));
}

async function one(sess, file) {
  const id = file.replace('.jsonl', '');
  const dir = path.join(ROOT, sess, 'subagents');
  let meta = {};
  try { meta = JSON.parse(fs.readFileSync(path.join(dir, id + '.meta.json'), 'utf8')); } catch {}
  const a = { sess: sess.slice(0, 8), id, type: (meta.agentType || '?').replace('fullstack-overture:', ''), desc: meta.description, depth: meta.spawnDepth, parent: meta.parentAgentId, model: meta.model,
    prompt: '', promptLen: 0, calls: [], preloaded: [], outTok: 0, inTok: 0, cacheRead: 0, cacheCreate: 0, first: null, last: null, final: '', finalLen: 0, turns: 0 };
  const seenTool = new Map(); const seenMsg = new Set();
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(dir, file)), crlfDelay: Infinity });
  let firstUser = true;
  for await (const line of rl) {
    if (!line) continue;
    let o; try { o = JSON.parse(line); } catch { continue; }
    if (o.timestamp) { if (!a.first) a.first = o.timestamp; a.last = o.timestamp; }
    const m = o.message; if (!m) continue;
    if (o.type === 'user') {
      const c = m.content;
      if (typeof c === 'string') { if (firstUser) { a.prompt = tr(c, 1500); a.promptLen = c.length; firstUser = false; } continue; }
      if (!Array.isArray(c)) continue;
      for (const b of c) {
        if (b.type === 'text') {
          const mm = /Base directory for this skill: (\S+)/.exec(b.text || '');
          if (mm) a.preloaded.push({ skill: mm[1].split(/[\\/]/).pop(), len: b.text.length, afterCalls: a.calls.length });
          else if (firstUser && !/command-message/.test(b.text)) { a.prompt = tr(b.text, 1500); a.promptLen = b.text.length; firstUser = false; }
        } else if (b.type === 'tool_result') {
          const t = seenTool.get(b.tool_use_id);
          let len = 0, txt = '';
          if (typeof b.content === 'string') { len = b.content.length; txt = b.content; }
          else if (Array.isArray(b.content)) for (const x of b.content) { if (x.type === 'text') { len += x.text.length; txt += x.text; } }
          if (t) { t.resLen = len; t.err = !!b.is_error; t.resTs = o.timestamp; if (b.is_error || t.name === 'LSP') t.res = tr(txt, 300); else if (t.name === 'Bash' || t.name === 'PowerShell') t.res = tr(txt, 120); }
        }
      }
    } else if (o.type === 'assistant') {
      const mid = m.id;
      if (mid && !seenMsg.has(mid)) { seenMsg.add(mid); a.turns++; }
      const u = m.usage;
      if (u && mid) { a._u = a._u || {}; a._u[mid] = u; }
      for (const b of m.content || []) {
        if (b.type === 'tool_use') {
          if (seenTool.has(b.id)) continue;
          const t = { name: b.name, in: keyInput(b.name, b.input), ts: o.timestamp }; if (b.name === 'SubagentHandback') { t.msgLen = (b.input.message || '').length; t.msg = tr(b.input.message, 3000); }
          seenTool.set(b.id, t); a.calls.push(t);
        } else if (b.type === 'text' && b.text) { a.final = b.text; }
      }
    }
  }
  for (const u of Object.values(a._u || {})) { a.outTok += u.output_tokens || 0; a.inTok += u.input_tokens || 0; a.cacheRead += u.cache_read_input_tokens || 0; a.cacheCreate += u.cache_creation_input_tokens || 0; }
  delete a._u;
  a.finalLen = a.final.length; a.final = tr(a.final, 2500);
  a.wall = a.first && a.last ? (new Date(a.last) - new Date(a.first)) / 1000 : 0;
  return a;
}

const all = [];
for (const s of SESS) {
  const files = fs.readdirSync(path.join(ROOT, s, 'subagents')).filter(f => f.endsWith('.jsonl'));
  for (const f of files) all.push(await one(s, f));
}
fs.writeFileSync(OUT, JSON.stringify(all));
const by = {};
for (const a of all) { const k = a.type; by[k] = by[k] || { n: 0, calls: 0, wall: 0, out: 0, cr: 0 }; by[k].n++; by[k].calls += a.calls.length; by[k].wall += a.wall; by[k].out += a.outTok; by[k].cr += a.cacheRead; }
console.log('type | n | calls | wall_h | outTok_k | cacheRead_M');
for (const [k, v] of Object.entries(by).sort((x, y) => y[1].wall - x[1].wall)) console.log(`${k} | ${v.n} | ${v.calls} | ${(v.wall / 3600).toFixed(1)} | ${(v.out / 1000).toFixed(0)} | ${(v.cr / 1e6).toFixed(0)}`);
console.log('total', all.length);
