import fs from 'fs';
for (const f of ['model-providers', 'self-learning', 'agent-platform', 'custom-agents']) {
  const t = fs.readFileSync(`D:/git/github/ai/agent-os/docs/features/${f}/uxrd.md`, 'utf8').replace(/\r\n/g, '\n');
  const lines = t.split('\n'); let lang = null; let wf = 0, mer = 0, wfN = 0, merN = 0; let sec = ''; const per = {};
  let statesRows = 0, statesChars = 0, layoutChars = 0, inStates = false;
  for (const l of lines) {
    const m = l.match(/^```(\w*)/);
    if (m) { if (lang === null) { lang = m[1] || 'plain'; if (lang === 'plain') wfN++; if (lang === 'mermaid') merN++; } else lang = null; }
    if (lang === 'plain' || (m && lang === null)) { }
    if (lang === 'plain') wf += l.length + 1; if (lang === 'mermaid') mer += l.length + 1;
    const h = lang === null && l.match(/^## (.*)/); if (h) sec = h[1];
    if (lang !== null) { per[sec + '|' + lang] = (per[sec + '|' + lang] || 0) + l.length + 1; }
  }
  const impl = lines.filter(l => /Implements|Реализует|Выполняет/.test(l)).map(l => l.slice(0, 110));
  const stateTables = lines.filter(l => /^\| (Состояние|State) \|/.test(l)).map(l => l.slice(0, 80));
  console.log(`\n${f}: total ${t.length}; wireframes ${wfN} blocks ${wf} chars (${(100 * wf / t.length).toFixed(0)}%); mermaid ${merN} blocks ${mer} (${(100 * mer / t.length).toFixed(0)}%)`);
  console.log(' fenced by section:', JSON.stringify(per));
  console.log(' implements lines:', impl.length, impl.slice(0, 3));
  console.log(' state table headers:', stateTables.length, [...new Set(stateTables)].slice(0, 3));
  const flowHeads = lines.filter(l => /^#{3,4} /.test(l) && lines.indexOf(l) > lines.indexOf('## User Flows') && lines.indexOf(l) < lines.findIndex(x => /^## Screens/.test(x))).map(l => l.slice(0, 70));
  console.log(' flow headings:', flowHeads);
}
