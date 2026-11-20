import fs from 'fs';
const all = JSON.parse(fs.readFileSync('agents.json','utf8'));
const types = process.argv.slice(2);
for (const t of types) {
  const h = {}; let n=0; const hb=[]; const pre={};
  for (const a of all.filter(a=>a.type===t)) {
    for (const p of a.preloaded) pre[p.skill]=p.len;
    for (const c of a.calls) {
      if (c.name==='SubagentHandback') hb.push(c.msgLen);
      if (c.name!=='Bash' && c.name!=='PowerShell') continue; n++;
      let cmd=c.in.replace(/^cd \S+\s*(&&|;)\s*/,'').replace(/^(\w+=\S+\s+)+/,'');
      let k=cmd.split(/\s+/).slice(0, /^(git|pnpm|npm|npx|node)$/.test(cmd.split(/\s+/)[0])?2:1).join(' ');
      h[k]=(h[k]||0)+1;
    }
  }
  console.log('\n==',t,'bash',n,'handback lens',hb.sort((a,b)=>a-b).join(','));
  console.log(' preloaded chars', JSON.stringify(pre), 'sum', Object.values(pre).reduce((a,b)=>a+b,0));
  console.log(' ', Object.entries(h).sort((a,b)=>b[1]-a[1]).slice(0,22).map(([k,v])=>`${k}:${v}`).join('  '));
}
