import fs from 'fs';
const D = 'D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/authors/out';
const all = JSON.parse(fs.readFileSync(D + '/all.json', 'utf8'));
const mode = process.argv[2];
const ty = r => r.agentType.replace('fullstack-overture:', '');
const MINE = /prd-creator|ux-designer|technical-designer|work-planner|acceptance-test-generator|document-reviewer/;
if (mode === 'dump') {
  const r = all.find(x => x.file.includes(process.argv[3]));
  const w = +(process.argv[4] || 170);
  console.log(r.session, r.file, r.agentType, r.description, 'promptLen', r.promptLen, 'dur', r.durMin, 'out', r.outTok);
  console.log('PROMPT:', r.prompt.slice(0, +(process.argv[5] || 1500)));
  const t0 = new Date(r.start);
  r.calls.forEach((c, i) => console.log(i, ((new Date(c.ts) - t0) / 60000).toFixed(1), c.name, c.input.replace(/D:\\\\?git\\\\?github\\\\?ai\\\\?agent-os\\\\?|D:\/git\/github\/ai\/agent-os\//gi, '').slice(0, w), c.resLen ?? '', c.err ? 'ERR' : '', c.resHead ? '=> ' + c.resHead.slice(0, 260) : ''));
  console.log('FINAL:', r.final.slice(0, 1500));
} else if (mode === 'bash') {
  const cat = {};
  const rx = [[/check-mermaid/, 'check-mermaid'], [/git (diff|log|show|status)/, 'git-inspect'], [/\bgit (add|commit|stash|checkout|restore)/, 'git-mutate'], [/\b(grep|rg|findstr|Select-String)\b/, 'grep'], [/\bwc\b|Measure-Object/, 'wc'], [/\b(sed -n|head|tail|cat|awk|Get-Content)\b/, 'cat/sed'], [/\bcp\b|Copy-Item/, 'cp'], [/\bdiff\b/, 'diff'], [/python|node /, 'script'], [/\bls\b|\bfind\b|Get-ChildItem|\bdir\b/, 'ls'], [/date/, 'date'], [/npm|pnpm|npx|vitest|jest|tsc/, 'npm']];
  for (const r of all) { if (!MINE.test(ty(r))) continue; for (const c of r.calls) if (c.name === 'Bash' || c.name === 'PowerShell') { const k = (rx.find(([x]) => x.test(c.input)) || [0, 'other'])[1]; const key = ty(r) + (r.depth > 1 ? '*' : ''); cat[key] = cat[key] || {}; cat[key][k] = (cat[key][k] || 0) + 1; } }
  for (const [k, v] of Object.entries(cat).sort()) console.log(k, JSON.stringify(v));
} else if (mode === 'errs') {
  for (const r of all) { if (!MINE.test(ty(r))) continue; for (const c of r.calls) if (c.err || (c.resHead && /hook|document-guard|denied|blocked/i.test(c.resHead) && c.name !== 'Agent')) console.log(r.session, r.file.slice(6, 14), ty(r), '|', c.name, c.input.slice(0, 110), '=>', (c.resHead || '').slice(0, 230)); }
} else if (mode === 'grepbash') {
  const re = new RegExp(process.argv[3], 'i');
  for (const r of all) { if (!MINE.test(ty(r))) continue; for (const c of r.calls) if (re.test(c.input)) console.log(r.session, r.file.slice(6, 14), ty(r), '|', c.name, c.input.slice(0, 230), '=>', c.resLen, (c.resHead || '').slice(0, 200)); }
} else if (mode === 'reads') {
  // most-read files per type
  const m = {};
  for (const r of all) { if (!MINE.test(ty(r))) continue; const seen = {}; for (const c of r.calls) if (c.name === 'Read') { const p = c.input.replace(/\\/g, '/').replace(/ @.*| \+\d+$/, '').replace(/.*agent-os\//i, '').replace(/.*plugins\/cache\/[^/]+\/[^/]+\/[^/]+\//, 'PLUGIN/'); const k = ty(r) + (r.depth > 1 ? '*' : '') + ' ' + p; m[k] = m[k] || { runs: 0, reads: 0, bytes: 0 }; m[k].reads++; m[k].bytes += c.resLen || 0; if (!seen[k]) { seen[k] = 1; m[k].runs++; } } }
  for (const [k, v] of Object.entries(m).filter(([k, v]) => v.reads >= +(process.argv[3] || 6)).sort((a, b) => b[1].bytes - a[1].bytes).slice(0, 70)) console.log(v.runs, v.reads, Math.round(v.bytes / 1000) + 'k', k);
}
if (mode === 'cdump') {
  const r = all.find(x => x.file.includes(process.argv[3]));
  console.log(r.session, r.file, r.agentType, '|', r.description, 'promptLen', r.promptLen, 'dur', r.durMin, 'out', r.outTok, 'calls', r.calls.length);
  console.log('PROMPT:', r.prompt.slice(0, +(process.argv[4] || 1200)).replace(/\s+/g,' '));
  const t0 = new Date(r.start); let prev = null, n = 0, first = 0; const out = [];
  const short = c => c.input.replace(/D:[\/]+git[\/]+github[\/]+ai[\/]+agent-os[\/]+/gi, '').replace(/D:[\/]+Temp[\/]+claude[\/]+\w+[\/]+[\w-]+[\/]+scratchpad/gi,'$S').replace(/C:[\/]+Users[\/]+tundr[\/]+\.claude[\/]+plugins[\/]+cache[\/]+[^\/]+[\/]+[^\/]+[\/]+[^\/]+/gi,'$P');
  const key = c => (c.name === 'Edit' || c.name==='Write') ? c.name + ' ' + short(c).replace(/ \[.*/, '') : null;
  const flush = () => { if (prev) out.push(`${first} x${n} ${prev}`); prev = null; n = 0; };
  r.calls.forEach((c, i) => { const k = key(c); const tm = ((new Date(c.ts) - t0) / 60000).toFixed(1); if (k && k === (prev||'').replace(/^\S+ /,'')) { n++; return; } flush(); if (k) { prev = tm + ' ' + k; n = 1; first = i; } else out.push(`${i} ${tm} ${c.name} ${short(c).slice(0, 190)} [${c.resLen ?? ''}]${c.err ? ' ERR' : ''}${(c.name==='Agent'||c.err) && c.resHead ? ' => ' + c.resHead.slice(0, 300) : ''}`); });
  flush(); console.log(out.join('\n')); console.log('FINAL:', r.final.slice(0, 600));
}
