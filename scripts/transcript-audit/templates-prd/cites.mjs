import fs from 'fs'; import path from 'path';
const root = 'D:/git/github/ai/agent-os/docs/features';
const feats = ['model-providers', 'self-learning', 'agent-platform', 'custom-agents'];
const cnt = (t, re) => (t.match(re) || []).length;
for (const f of feats) {
  const dir = path.join(root, f);
  const files = fs.readdirSync(dir).filter(x => x.endsWith('.md'));
  const plans = fs.readdirSync(dir, { withFileTypes: true }).filter(d => d.isDirectory()).flatMap(d => fs.readdirSync(path.join(dir, d.name)).filter(x => x.endsWith('.md')).map(x => d.name + '/' + x));
  console.log('\n== ' + f);
  for (const file of [...files, ...plans]) {
    const t = fs.readFileSync(path.join(dir, file), 'utf8');
    const row = { 'UC-': cnt(t, /\bUC-\d+/g), 'FR-': cnt(t, /\bFR-\d+/g), 'AC-': cnt(t, /\bAC-\d+\.\d+/g), 'NFR-': cnt(t, /\bNFR-\d+/g), 'MC-': cnt(t, /\bMC-\d+/g), 'KD-': cnt(t, /\bKD-\d+/g), 'Success Criteria': cnt(t, /Success Criteria/g), 'Risks': cnt(t, /\bRisks\b/g), 'Assumptions': cnt(t, /Assumptions/g), 'Constraints': cnt(t, /\bConstraints\b/g), "Won't Have": cnt(t, /Won.t Have/g), 'Background': cnt(t, /\bBackground\b/g), 'Terms': cnt(t, /\bTerms\b/g) };
    console.log(file.padEnd(46), Object.entries(row).filter(([, v]) => v).map(([k, v]) => `${k}${v}`).join(' '));
  }
  // diagrams and structure costs
  for (const d of ['prd', 'uxrd']) {
    const p = path.join(dir, d + '.md'); if (!fs.existsSync(p)) continue; const t = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
    const mer = [...t.matchAll(/```mermaid[\s\S]*?```/g)]; const merChars = mer.reduce((a, m) => a + m[0].length, 0);
    const fences = [...t.matchAll(/```\n[\s\S]*?```/g)]; const wf = fences.reduce((a, m) => a + m[0].length, 0);
    let extra = '';
    if (d === 'prd') {
      const fr = t.slice(t.indexOf('## Functional Requirements'), t.indexOf('## Non-Functional'));
      const ac = fr.split('\n').filter(l => /^\s+- AC-/.test(l)); const acChars = ac.reduce((a, l) => a + l.length + 1, 0);
      const frs = fr.split('\n').filter(l => /^- \*\*FR-/.test(l)).length;
      extra = ` FRs=${frs} ACs=${ac.length} acChars=${acChars} (${(100 * acChars / t.length).toFixed(0)}%)`;
      const bg = t.slice(t.indexOf('## Background'), t.indexOf('## Users and Use Cases')); const bgm = [...bg.matchAll(/```mermaid[\s\S]*?```/g)].reduce((a, m) => a + m[0].length, 0);
      extra += ` backgroundMermaid=${bgm} backgroundProse=${bg.length - bgm}`;
    } else {
      const mcStart = t.indexOf('## Content and Microcopy'); const mcEnd = t.indexOf('\n## ', mcStart + 5); const mc = t.slice(mcStart, mcEnd); const rest = t.slice(0, mcStart) + t.slice(mcEnd);
      const strs = [...new Set([...mc.matchAll(/«([^»]{12,})»/g)].map(m => m[1]))]; const dup = strs.filter(s => rest.includes(s));
      const dupChars = dup.reduce((a, s) => a + s.length, 0);
      extra = ` microcopyStrings=${strs.length} alsoOutsideTable=${dup.length} (${dupChars} chars)`;
      const impl = cnt(t, /\*\*(Implements|Реализует)[^*]*\*\*/g); extra += ` implementsLines=${impl}`;
      const kdHead = (t.match(/\| ID \|[^\n]*/) || [''])[0]; extra += ` KDcols="${kdHead}"`;
    }
    console.log(`  ${d}: total=${t.length} mermaid=${mer.length} blocks ${merChars} chars (${(100 * merChars / t.length).toFixed(0)}%) asciiWireframes=${fences.length} blocks ${wf} chars (${(100 * wf / t.length).toFixed(0)}%)${extra}`);
  }
}
