import fs from 'fs'; import readline from 'readline'; import path from 'path';
const base='C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os/';
const sessions=['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9','eae5f417-51c8-495d-8f00-5ecd3d2d6117','bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const kind=p=>{p=p.split(String.fromCharCode(92)).join('/'); const m=p.match(/docs\/(features\/[^\s"']+\.md|adr\/[^\s"']+\.md)/); if(!m) return null; const r=m[1];
  if(/^adr\//.test(r)) return ['adr',r];
  const parts=r.split('/'); const f=parts[parts.length-1];
  if(/^design-/.test(f)) return ['design',r]; if(f==='prd.md') return ['prd',r]; if(f==='uxrd.md') return ['uxrd',r];
  if(/task-\d+|_overview/.test(f)) return ['task',r]; if(/l1-browser/.test(f)) return ['other',r];
  if(parts.length===4 && /^\d{8}-/.test(f)) return ['plan',r];
  if(/analysis\//.test(r)) return ['analysis',r];
  return ['other',r]; };
const out=[]; 
async function scan(file,agentType,sess){ const seen=new Set();
  const rl=readline.createInterface({input:fs.createReadStream(file),crlfDelay:Infinity});
  for await(const line of rl){ if(!line.includes('"tool_use"')) continue; let o; try{o=JSON.parse(line)}catch{continue}
    const c=o.message?.content; if(!Array.isArray(c)) continue;
    for(const b of c){ if(b.type!=='tool_use'||seen.has(b.id)) continue; seen.add(b.id); const i=b.input||{};
      let p=i.file_path||i.path||''; let extra='';
      if(b.name==='Bash'||b.name==='PowerShell'){p=i.command||''; extra=(i.command||'').slice(0,200);}
      if(b.name==='Grep') extra='pattern='+i.pattern+(i.output_mode?' mode='+i.output_mode:'');
      if(b.name==='Read') extra=(i.offset!=null?'off='+i.offset:'')+(i.limit!=null?' lim='+i.limit:'');
      const k=kind(p); if(!k) continue;
      out.push({sess:sess.slice(0,4),agent:path.basename(file),agentType,tool:b.name,kind:k[0],file:k[1],extra});
    } } }
for(const s of sessions){
  await scan(base+s+'.jsonl','ORCHESTRATOR',s);
  const d=base+s+'/subagents/'; for(const f of fs.readdirSync(d).filter(f=>f.endsWith('.jsonl'))){
    let t='?'; try{t=JSON.parse(fs.readFileSync(d+f.replace('.jsonl','.meta.json'),'utf8')).agentType.replace('fullstack-overture:','')}catch{}
    await scan(d+f,t,s);} }
fs.writeFileSync('reads.json',JSON.stringify(out));
// summary: per agentType: number of agents total touching each kind, calls per kind/tool
const agents={}; for(const r of out){ const a=agents[r.agentType]=agents[r.agentType]||{}; const k=r.kind+':'+r.tool; (a[k]=a[k]||{calls:0,ag:new Set()}); a[k].calls++; a[k].ag.add(r.sess+r.agent); }
for(const [t,a] of Object.entries(agents)){ console.log('\n'+t); for(const [k,v] of Object.entries(a).sort()) console.log('  ',k.padEnd(22),'calls',String(v.calls).padStart(4),'agents',v.ag.size); }
