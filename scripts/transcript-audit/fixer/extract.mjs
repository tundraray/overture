import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const ROOT = 'C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os';
const OUT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const sessions = ['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9', 'eae5f417-51c8-495d-8f00-5ecd3d2d6117', 'bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const trunc = (s, n = 200) => { s = String(s ?? '').replace(/\s+/g, ' '); return s.length > n ? s.slice(0, n) + '…' : s; };

function keyInput(name, inp) {
  if (!inp) return '';
  if (name === 'Bash' || name === 'PowerShell') return (inp.run_in_background ? '[BG] ' : '') + (inp.timeout ? `[t=${inp.timeout}] ` : '') + inp.command;
  if (name === 'Read') return inp.file_path + (inp.offset ? ` @${inp.offset}+${inp.limit ?? ''}` : '');
  if (name === 'Edit' || name === 'Write' || name === 'MultiEdit') return inp.file_path;
  if (name === 'Grep') return `${inp.pattern} in ${inp.path ?? '.'} ${inp.glob ?? ''}`;
  if (name === 'Glob') return `${inp.pattern} in ${inp.path ?? '.'}`;
  if (name === 'Skill') return inp.skill;
  if (name === 'TodoWrite') return (inp.todos || []).map(t => t.status[0]).join('');
  return JSON.stringify(inp);
}

const all = [];
for (const s of sessions) {
  const dir = `${ROOT}/${s}/subagents`;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.meta.json'))) {
    const meta = JSON.parse(fs.readFileSync(`${dir}/${f}`, 'utf8'));
    if (!/quality-fixer/.test(meta.agentType || '')) continue;
    const jf = `${dir}/${f.replace('.meta.json', '.jsonl')}`;
    if (!fs.existsSync(jf)) { console.log('MISSING', s, f); continue; }
    const rl = readline.createInterface({ input: fs.createReadStream(jf), crlfDelay: Infinity });
    const a = { session: s.slice(0, 8), file: f.replace('.meta.json', ''), type: meta.agentType.split(':').pop(), desc: meta.description, prompt: '', calls: [], final: '', finalLen: 0, t0: null, t1: null, texts: [] };
    const byId = new Map();
    for await (const line of rl) {
      if (!line.trim()) continue;
      let o; try { o = JSON.parse(line); } catch { continue; }
      const ts = o.timestamp;
      if (ts) { if (!a.t0) a.t0 = ts; a.t1 = ts; }
      const m = o.message; if (!m) continue;
      const content = m.content;
      if (o.type === 'user') {
        if (typeof content === 'string') { if (!a.prompt) a.prompt = content; continue; }
        for (const c of content || []) {
          if (c.type === 'text' && !a.prompt) a.prompt = c.text;
          if (c.type === 'tool_result') {
            const call = byId.get(c.tool_use_id); if (!call) continue;
            let txt = typeof c.content === 'string' ? c.content : (c.content || []).map(x => x.text || '').join('\n');
            call.resLen = txt.length; call.err = !!c.is_error; call.tEnd = ts;
            call.res = txt;
          }
        }
      } else if (o.type === 'assistant') {
        for (const c of content || []) {
          if (c.type === 'tool_use') {
            if (byId.has(c.id)) continue;
            const call = { id: c.id, name: c.name, key: keyInput(c.name, c.input), t: ts, input: c.input };
            byId.set(c.id, call); a.calls.push(call);
          } else if (c.type === 'text' && c.text.trim()) {
            a.final = c.text; a.finalLen = c.text.length; a.texts.push({ t: ts, text: c.text });
          }
        }
      }
    }
    all.push(a);
  }
}
all.sort((x, y) => x.t0 < y.t0 ? -1 : 1);
fs.writeFileSync(`${OUT}/all.json`, JSON.stringify(all));
// per-agent readable trace
for (const a of all) {
  const lines = [`# ${a.session} ${a.file} ${a.type} ${a.t0} -> ${a.t1} (${((new Date(a.t1) - new Date(a.t0)) / 60000).toFixed(1)} min) calls=${a.calls.length}`, `PROMPT: ${a.prompt}`, ''];
  let i = 0;
  for (const c of a.calls) {
    const dur = c.tEnd ? ((new Date(c.tEnd) - new Date(c.t)) / 1000).toFixed(0) : '?';
    lines.push(`${++i}. [${c.t?.slice(11, 19)}] ${c.name} ${dur}s res=${c.resLen}${c.err ? ' ERR' : ''} :: ${trunc(c.key, 400)}`);
    if (c.err) lines.push(`    ERR> ${trunc(c.res, 300)}`);
    else if (c.name === 'Bash' || c.name === 'PowerShell') lines.push(`    > ${trunc((c.res || '').slice(-400), 300)}`);
  }
  lines.push('', `FINAL (${a.finalLen} chars): ${a.final}`);
  fs.writeFileSync(`${OUT}/${a.session}-${a.file}.txt`, lines.join('\n'));
}
// summary
for (const a of all) {
  const cnt = {}; for (const c of a.calls) cnt[c.name] = (cnt[c.name] || 0) + 1;
  const errs = a.calls.filter(c => c.err).length;
  console.log(`${a.session} ${a.file} ${a.type.replace('quality-fixer', 'qf')} ${a.t0.slice(5, 16)} ${((new Date(a.t1) - new Date(a.t0)) / 60000).toFixed(1)}m calls=${a.calls.length} err=${errs} final=${a.finalLen} ${JSON.stringify(cnt)} | ${trunc(a.prompt, 160)}`);
}
