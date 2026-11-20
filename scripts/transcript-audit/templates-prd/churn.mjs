import fs from 'fs';
const j = JSON.parse(fs.readFileSync('D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/authors/out/all.json', 'utf8'));
const mode = process.argv[2] || 'shape';
const out = [];
for (const a of j) {
  if (!/prd-creator|ux-designer/.test(a.agentType)) continue;
  for (const c of a.calls) {
    if (c.name !== 'Edit') continue;
    const i = c.input; const s = typeof i === 'string' ? i : JSON.stringify(i);
    const m = s.match(/(prd|uxrd)\.md/); if (!m) continue;
    out.push({ t: a.agentType.replace(/.*:/, ''), doc: m[1], desc: a.description, i });
  }
}
if (mode === 'shape') { console.log(out.length); console.log(JSON.stringify(out[0]).slice(0, 1200)); console.log(JSON.stringify(out[200] || out[5]).slice(0, 1200)); const d = {}; for (const o of out) d[o.t + '|' + o.doc + '|' + o.desc] = (d[o.t + '|' + o.doc + '|' + o.desc] || 0) + 1; console.log(d); }
else {
  const doc = mode; const sel = out.filter(o => o.doc === doc); const step = Math.max(1, Math.floor(sel.length / +(process.argv[3] || 40)));
  for (let k = 0; k < sel.length; k += step) { const o = sel[k]; const i = o.i; const os = (i.old_string ?? i.old ?? JSON.stringify(i)).toString(); const ns = (i.new_string ?? i.new ?? '').toString();
    // show differing middle
    let p = 0; while (p < os.length && p < ns.length && os[p] === ns[p]) p++; let q = 0; while (q < os.length - p && q < ns.length - p && os[os.length - 1 - q] === ns[ns.length - 1 - q]) q++;
    console.log(`#${k} [${o.desc?.slice(0, 50)}] ctx:…${os.slice(Math.max(0, p - 90), p).replace(/\n/g, '⏎')}\n   - ${os.slice(p, os.length - q).slice(0, 260).replace(/\n/g, '⏎')}\n   + ${ns.slice(p, ns.length - q).slice(0, 260).replace(/\n/g, '⏎')}`); }
}
