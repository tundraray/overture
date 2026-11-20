import fs from 'fs';
import path from 'path';
import readline from 'readline';

const ROOT = 'C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os';
const SESSIONS = ['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9', 'eae5f417-51c8-495d-8f00-5ecd3d2d6117', 'bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const OUT = 'D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/authors/out';
fs.mkdirSync(OUT, { recursive: true });
const TYPES = /prd-creator|ux-designer|technical-designer|work-planner|acceptance-test-generator|document-reviewer/;
const t = (s, n = 200) => (s == null ? '' : String(s).replace(/\s+/g, ' ').slice(0, n));

function walk(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name).replace(/\\/g, '/');
    if (e.isDirectory()) walk(p, acc); else if (e.name.endsWith('.meta.json')) acc.push(p);
  }
  return acc;
}
function keyInput(name, inp) {
  if (!inp) return '';
  if (name === 'Read') return `${inp.file_path}${inp.offset ? ` @${inp.offset}+${inp.limit || ''}` : (inp.limit ? ` +${inp.limit}` : '')}`;
  if (name === 'Write') return `${inp.file_path} [${(inp.content || '').length}ch]`;
  if (name === 'Edit' || name === 'MultiEdit') return `${inp.file_path} [old ${(inp.old_string || '').length} new ${(inp.new_string || '').length}${inp.replace_all ? ' all' : ''}]`;
  if (name === 'Bash' || name === 'PowerShell') return t(inp.command, 260);
  if (name === 'Grep') return `${t(inp.pattern, 100)} in ${inp.path || '.'} ${inp.glob || ''} ${inp.output_mode || ''}`;
  if (name === 'Glob') return `${inp.pattern} in ${inp.path || '.'}`;
  if (name === 'Skill') return inp.skill;
  if (name === 'Agent' || name === 'Task') return `${inp.subagent_type} :: ${t(inp.description, 80)} :: ${t(inp.prompt, 200)}`;
  if (name === 'SubagentHandback') return `[${(inp.message||'').length}ch] ${String(inp.message||'').slice(0,60000)}`;
  if (name === 'TodoWrite') return `${(inp.todos || []).length} todos`;
  return t(JSON.stringify(inp), 200);
}
async function proc(metaPath, session) {
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  const jl = metaPath.replace(/\.meta\.json$/, '.jsonl');
  if (!fs.existsSync(jl)) return null;
  const rec = { session: session.slice(0, 8), file: path.basename(jl), agentType: meta.agentType, description: meta.description, parent: meta.parentAgentId || null, depth: meta.spawnDepth || 1, model: meta.model, calls: [], prompt: '', final: '', finalLen: 0, outTok: 0, inTok: 0, cacheRead: 0, cacheCreate: 0, start: null, end: null, promptLen: 0 };
  const seenUse = new Map(); const seenMsg = new Set();
  const rl = readline.createInterface({ input: fs.createReadStream(jl), crlfDelay: Infinity });
  let first = true;
  for await (const line of rl) {
    if (!line.trim()) continue;
    let o; try { o = JSON.parse(line); } catch { continue; }
    if (o.timestamp) { if (!rec.start) rec.start = o.timestamp; rec.end = o.timestamp; }
    const m = o.message; if (!m) continue;
    const content = m.content;
    if (o.type === 'user') {
      if (!first) { const tx = typeof content === 'string' ? content : (content || []).filter(c => c.type === 'text').map(c => c.text).join(' '); if (tx.trim()) rec.calls.push({ name: 'USER', input: `[${tx.length}ch] ` + tx.slice(0, 1500), ts: o.timestamp }); }
      if (first) { first = false; const txt = typeof content === 'string' ? content : (content || []).filter(c => c.type === 'text').map(c => c.text).join('\n'); rec.prompt = txt.slice(0, 3000); rec.promptLen = txt.length; }
      if (Array.isArray(content)) for (const c of content) if (c.type === 'tool_result') {
        const u = seenUse.get(c.tool_use_id); if (!u) continue;
        let txt = typeof c.content === 'string' ? c.content : (c.content || []).map(x => x.text || '').join('\n');
        u.resLen = txt.length; u.err = !!c.is_error; u.resTs = o.timestamp;
        if (c.is_error || /hook|denied|blocked/i.test(txt.slice(0, 300))) u.resHead = t(txt, 400);
        else if (/check-mermaid|mermaid/.test(u.input) || u.name === 'Agent' || u.name === 'Task') u.resHead = t(txt, 600);
      }
    } else if (o.type === 'assistant') {
      if (m.id && !seenMsg.has(m.id)) { seenMsg.add(m.id); }
      if (m.usage && m.id) { rec._u = rec._u || {}; rec._u[m.id] = m.usage; }
      if (Array.isArray(content)) for (const c of content) {
        if (c.type === 'tool_use') { if (seenUse.has(c.id)) continue; const u = { name: c.name, input: keyInput(c.name, c.input), ts: o.timestamp }; if (c.name === 'TodoWrite') u.todos = (c.input.todos || []).map(x => `${x.status[0]}:${t(x.content, 50)}`).join(' | '); seenUse.set(c.id, u); rec.calls.push(u); }
        else if (c.type === 'text' && c.text.trim()) { rec.final = c.text; }
      }
    }
  }
  for (const u of Object.values(rec._u || {})) { rec.outTok += u.output_tokens || 0; rec.inTok += u.input_tokens || 0; rec.cacheRead += u.cache_read_input_tokens || 0; rec.cacheCreate += u.cache_creation_input_tokens || 0; }
  delete rec._u;
  rec.finalLen = rec.final.length; rec.final = rec.final.slice(0, 2500);
  rec.durMin = rec.start && rec.end ? +((new Date(rec.end) - new Date(rec.start)) / 60000).toFixed(1) : 0;
  return rec;
}
const all = [];
for (const s of SESSIONS) {
  for (const mp of walk(path.join(ROOT, s).replace(/\\/g, '/'))) {
    const meta = JSON.parse(fs.readFileSync(mp, 'utf8'));
    const r = await proc(mp, s); if (r) all.push(r);
  }
}
fs.writeFileSync(OUT + '/all.json', JSON.stringify(all));
// aggregate
const agg = {};
for (const r of all) { const k = r.agentType + (r.depth > 1 ? ' (nested)' : ''); const a = agg[k] = agg[k] || { n: 0, calls: 0, dur: 0, out: 0 }; a.n++; a.calls += r.calls.length; a.dur += r.durMin; a.out += r.outTok; }
for (const [k, a] of Object.entries(agg).sort()) console.log(k.padEnd(60), 'n', a.n, 'calls', a.calls, 'avg', (a.calls / a.n).toFixed(0), 'min', a.dur.toFixed(0), 'outTok', a.out);
