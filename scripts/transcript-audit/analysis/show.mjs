import fs from 'fs';
const all = JSON.parse(fs.readFileSync('D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/analysis/agents.json', 'utf8'));
const [id, w = '150', mode = 'seq'] = process.argv.slice(2);
const a = all.find(x => x.id.includes(id));
console.log(`## ${a.sess} ${a.id} ${a.type} wall=${Math.round(a.wall)}s out=${a.outTok} turns=${a.turns} promptLen=${a.promptLen}`);
if (mode !== 'hb') console.log('PROMPT:', a.prompt.slice(0, 1200));
let prev = a.first;
if (mode === 'seq') for (const [i, c] of a.calls.entries()) {
  const dt = Math.round((new Date(c.ts) - new Date(prev)) / 1000); prev = c.ts;
  console.log(`${i} +${dt}s ${c.name} ${c.in.slice(0, +w)} -> ${c.resLen ?? ''}${c.err ? ' ERR ' + (c.res || '').slice(0, 160) : ''}`);
}
const hb = a.calls.find(c => c.name === 'SubagentHandback');
if (hb) console.log('HANDBACK len', hb.msgLen, ':', hb.msg.slice(0, mode === 'hb' ? 3000 : 700));
