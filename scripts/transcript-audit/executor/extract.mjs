import fs from 'fs';
import readline from 'readline';
import path from 'path';
const root = 'C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os/';
const sessions = ['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9', 'eae5f417-51c8-495d-8f00-5ecd3d2d6117', 'bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const out = [];
const trunc = (s, n) => (s == null ? '' : String(s).length > n ? String(s).slice(0, n) + '…' : String(s));
function key(name, inp) {
  if (!inp) return '';
  if (name === 'Bash' || name === 'PowerShell') return inp.command;
  if (name === 'Read') return inp.file_path + (inp.offset || inp.limit ? ` [${inp.offset ?? 0}+${inp.limit ?? ''}]` : '');
  if (name === 'Edit' || name === 'Write' || name === 'MultiEdit') return inp.file_path;
  if (name === 'Grep') return `${inp.pattern} @ ${inp.path ?? ''} ${inp.glob ?? ''} ${inp.output_mode ?? ''}`;
  if (name === 'Glob') return `${inp.pattern} @ ${inp.path ?? ''}`;
  if (name === 'Skill') return inp.skill;
  if (name === 'TodoWrite') return (inp.todos || []).map(t => t.status[0]).join('');
  if (name === 'Agent' || name === 'Task') return `${inp.subagent_type}: ${inp.description}`;
  return JSON.stringify(inp);
}
const resText = c => typeof c === 'string' ? c : Array.isArray(c) ? c.map(x => x.text ?? '').join('\n') : '';
for (const s of sessions) {
  const dir = path.join(root, s, 'subagents');
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.meta.json'))) {
    const meta = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (!/task-executor(-frontend)?$/.test(meta.agentType || '')) continue;
    const jf = f.replace('.meta.json', '.jsonl');
    const a = { session: s.slice(0, 8), file: jf, type: meta.agentType.split(':')[1], desc: meta.description, depth: meta.spawnDepth, prompt: '', promptLen: 0, calls: [], final: '', finalLen: 0, start: null, end: null, outTok: 0, texts: 0 };
    const byId = new Map(); const seenMsg = new Set();
    const rl = readline.createInterface({ input: fs.createReadStream(path.join(dir, jf)), crlfDelay: Infinity });
    let first = true;
    for await (const line of rl) {
      if (!line.trim()) continue;
      let j; try { j = JSON.parse(line); } catch { continue; }
      const ts = j.timestamp;
      if (ts) { if (!a.start) a.start = ts; a.end = ts; }
      const m = j.message; if (!m) continue;
      if (j.type === 'user') {
        if (first) { const t = resText(m.content); a.prompt = trunc(t, 3000); a.promptLen = t.length; first = false; continue; }
        if (Array.isArray(m.content)) for (const c of m.content) {
          if (c.type === 'tool_result') {
            const call = byId.get(c.tool_use_id); if (!call) continue;
            const t = resText(c.content);
            call.resSize = t.length; call.err = !!c.is_error; call.rt = ts;
            call.res = trunc(t, c.is_error ? 400 : 250);
            if (/Bash|PowerShell/.test(call.name)) call.resTail = t.slice(-300);
          }
        }
      } else if (j.type === 'assistant' && Array.isArray(m.content)) {
        if (m.usage && !a.firstUsage) a.firstUsage = {i: m.usage.input_tokens, cc: m.usage.cache_creation_input_tokens, cr: m.usage.cache_read_input_tokens}; if (m.usage) a.lastCtx = (m.usage.input_tokens||0)+(m.usage.cache_creation_input_tokens||0)+(m.usage.cache_read_input_tokens||0); if (m.id && !seenMsg.has(m.id) && m.usage) { seenMsg.add(m.id); a.outTok += m.usage.output_tokens || 0; }
        for (const c of m.content) {
          if (c.type === 'tool_use') {
            if (byId.has(c.id)) continue;
            const call = { t: ts, name: c.name, key: trunc(key(c.name, c.input), c.name==='SubagentHandback'?3000:500) }; if (c.name==='SubagentHandback') call.len=(c.input.message||'').length; if (/Bash|PowerShell/.test(c.name)) call.len=(c.input.command||'').length;
            if (c.name === 'Edit') call.editLen = (c.input.new_string || '').length;
            if (c.name === 'Write') call.editLen = (c.input.content || '').length;
            byId.set(c.id, call); a.calls.push(call);
          } else if (c.type === 'text' && c.text.trim()) { a.final = trunc(c.text, 2500); a.finalLen = c.text.length; a.texts++; }
        }
      }
    }
    out.push(a);
  }
}
fs.writeFileSync('D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/executor/executors.json', JSON.stringify(out));
console.log(out.length);
