import fs from 'node:fs'; import readline from 'node:readline';
const ROOT='C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os';
const all=JSON.parse(fs.readFileSync(new URL('./all.json',import.meta.url)));
const full={bb45672c:'bb45672c-c0b7-4a03-b437-47f4b8c086ef',eae5f417:'eae5f417-51c8-495d-8f00-5ecd3d2d6117'};
for(const a of all){
  const rl=readline.createInterface({input:fs.createReadStream(`${ROOT}/${full[a.session]}/subagents/${a.file}.jsonl`)});
  let first=null,model='',skills=[],maxCtx=0,outTot=0,seen=new Set(),n=0;
  for await(const l of rl){ let o;try{o=JSON.parse(l)}catch{continue}
    if(l.includes('Base directory for this skill')){ const m=[...l.matchAll(/Base directory for this skill: [^\n"]*?skills[\\/]+([\w-]+)/g)].map(x=>x[1]); for(const s of m) if(!skills.includes(s)) skills.push(s); if(!o.message||o.type!=='assistant'){ const c=o.message?.content; const len=typeof c==='string'?c.length:JSON.stringify(c||o).length; skills.push('len'+len);} }
    if(o.type==='assistant'&&o.message?.usage){ const u=o.message.usage; const id=o.message.id; if(seen.has(id))continue; seen.add(id); n++; const inp=(u.input_tokens||0)+(u.cache_read_input_tokens||0)+(u.cache_creation_input_tokens||0); if(!first){first=inp;model=o.message.model} maxCtx=Math.max(maxCtx,inp); outTot+=u.output_tokens||0; }
  }
  console.log(a.session,a.file.slice(6,12),a.type.replace('quality-fixer','qf'),model,'firstIn='+first,'maxCtx='+maxCtx,'out='+outTot,'turns='+n,skills.join(','));
}
