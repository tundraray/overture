import fs from 'fs';
const all = JSON.parse(fs.readFileSync('agents.json','utf8'));
const T = new Set(process.argv.slice(2));
for (const a of all.filter(a=>T.has(a.type)).sort((x,y)=>(x.first||'').localeCompare(y.first||''))) {
  const hb=a.calls.find(c=>c.name==='SubagentHandback');
  console.log(`${a.sess} ${a.id.slice(6,16)} ${a.type} d${a.depth} ${a.first?.slice(5,16)} ${Math.round(a.wall/60)}m calls=${a.calls.length} out=${Math.round(a.outTok/1000)}k hb=${hb?.msgLen} p=${a.promptLen} | ${a.desc}`);
}
