import fs from 'fs'; import readline from 'readline'; import path from 'path';
const base = 'C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os';
const sessions = ['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9', 'eae5f417-51c8-495d-8f00-5ecd3d2d6117', 'bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const out = [];
for (const s of sessions) {
  const dir = `${base}/${s}/subagents`; if (!fs.existsSync(dir)) continue;
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
  for (const f of walk(dir).filter(f => f.endsWith('.jsonl'))) {
    let meta = {}; try { meta = JSON.parse(fs.readFileSync(f.replace(/\.jsonl$/, '.meta.json'), 'utf8')) } catch { }
    const type = (meta.agentType || '').replace(/^.*:/, ''); if (!/prd-creator|ux-designer/.test(type)) continue;
    const seen = new Set();
    const rl = readline.createInterface({ input: fs.createReadStream(f), crlfDelay: Infinity });
    for await (const line of rl) {
      if (!line.includes('"Edit"')) continue; let j; try { j = JSON.parse(line) } catch { continue }
      const c = j.message?.content; if (!Array.isArray(c)) continue;
      for (const b of c) {
        if (b.type !== 'tool_use' || b.name !== 'Edit' || seen.has(b.id)) continue; seen.add(b.id);
        const m = (b.input.file_path || '').match(/features[\\/]+([\w-]+)[\\/]+(prd|uxrd)\.md/); if (!m) continue;
        const os = b.input.old_string || '', ns = b.input.new_string || '';
        let p = 0; while (p < os.length && p < ns.length && os[p] === ns[p]) p++; let q = 0; while (q < os.length - p && q < ns.length - p && os[os.length - 1 - q] === ns[ns.length - 1 - q]) q++;
        out.push({ doc: m[2], feat: m[1], desc: meta.description, ctx: os.slice(Math.max(0, p - 100), p), del: os.slice(p, os.length - q), add: ns.slice(p, ns.length - q) });
      }
    }
  }
}
fs.writeFileSync(new URL('./edits.json', import.meta.url), JSON.stringify(out));
console.log(out.length);
