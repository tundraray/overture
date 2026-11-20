import fs from 'fs';
const r = JSON.parse(fs.readFileSync(new URL('./reads.json', import.meta.url), 'utf8'));
const by = {};
const tok = {};
const classes = { 'AC-': /AC-\[?\d|AC-\\?\./, 'FR-': /FR-\[?\d/, 'NFR': /NFR/, 'UC-': /UC-\[?\d|Use Cases/, 'MC-': /MC-\[?\d/, 'KD-': /KD-\[?\d/, 'Delivery/part row': /Delivery|\^\| ?\\?`/, 'Success': /Success/, 'Risks/Constraints/Assumptions': /Risks|Constraints|Assumptions/, "Won't": /Won/, 'Snapshot': /Snapshot/, 'Terms': /Terms/, 'Background': /Background/, 'Inventory': /Inventory/, 'Responsive': /Responsive|Breakpoint|брейкпоинт/i, 'Accessibility': /Accessibility|aria|фокус/i, 'Screen': /Screen \d|Screens/, 'Flows': /Flow/ };
for (const x of r) {
  if (/prd-creator|ux-designer/.test(x.type)) continue;
  if (!['Read', 'Grep', 'Bash', 'PowerShell'].includes(x.tool)) continue;
  const k = `${x.type}|${x.doc}`; by[k] ??= new Set(); by[k].add(x.agent);
  const s = x.tool === 'Grep' ? x.pattern : x.tool === 'Read' ? '' : x.cmd;
  for (const [c, re] of Object.entries(classes)) if (re.test(s)) { const kk = `${x.doc}|${c}`; tok[kk] ??= {}; const g = x.type === 'document-reviewer' ? 'docreview' : 'downstream'; tok[kk][g] ??= new Set(); tok[kk][g].add(x.agent); }
}
console.log(Object.entries(by).sort().map(([k, v]) => `${k}: ${v.size} agents`).join('\n'));
console.log('--- pattern classes: distinct agents whose grep/sed commands name the token');
console.log(Object.entries(tok).sort().map(([k, v]) => `${k.padEnd(40)} downstream:${v.downstream?.size || 0} docreview:${v.docreview?.size || 0}`).join('\n'));
