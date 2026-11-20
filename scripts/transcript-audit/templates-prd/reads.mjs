import fs from 'fs'; import readline from 'readline'; import path from 'path';
const base='C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os';
const sessions=['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9','eae5f417-51c8-495d-8f00-5ecd3d2d6117','bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const out=[]; const agentCount={};
for (const s of sessions){
  const dir=`${base}/${s}/subagents`;
  if(!fs.existsSync(dir)) {console.error('no',dir);continue;}
  const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
  for (const f of walk(dir).filter(f=>f.endsWith('.jsonl'))){
    let type='?'; const mf=f.replace(/\.jsonl$/,'.meta.json');
    try{type=JSON.parse(fs.readFileSync(mf,'utf8')).agentType||'?'}catch{}
    type=type.replace(/^.*:/,'');
    agentCount[type]=(agentCount[type]||0)+1;
    const seen=new Set(); let firstTs=null;
    const rl=readline.createInterface({input:fs.createReadStream(f),crlfDelay:Infinity});
    for await (const line of rl){
      if(!/prd\.md|uxrd\.md/.test(line)) continue;
      let j; try{j=JSON.parse(line)}catch{continue}
      const c=j.message?.content; if(!Array.isArray(c)) continue;
      for(const b of c){
        if(b.type!=='tool_use'||seen.has(b.id)) continue; seen.add(b.id);
        const i=b.input||{}; const s2=JSON.stringify(i);
        const m=s2.match(/features[\/]+([\w-]+)[\/]+(prd|uxrd)\.md/);
        if(!m) continue;
        out.push({session:s.slice(0,4),agent:path.basename(f).slice(6,14),type,tool:b.name,feat:m[1],doc:m[2],offset:i.offset,limit:i.limit,pattern:i.pattern,cmd:i.command?.slice(0,300),ts:j.timestamp});
      }
    }
  }
}
fs.writeFileSync('reads.json',JSON.stringify(out));
console.log(agentCount);
const tally={};
for(const r of out){const k=`${r.type}|${r.doc}|${r.tool}${r.tool==='Read'?(r.offset||r.limit?':partial':':whole'):''}`;tally[k]=(tally[k]||0)+1;}
console.log(Object.entries(tally).sort().map(([k,v])=>`${v}\t${k}`).join('\n'));
