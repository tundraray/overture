import fs from 'fs'; import path from 'path'; import readline from 'readline';
const base='C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os';
const sessions=['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9','eae5f417-51c8-495d-8f00-5ecd3d2d6117','bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const want=/task-executor|work-planner|acceptance-test-generator|code-verifier|code-reviewer|security-reviewer|design-sync|integration-test-reviewer|document-reviewer|quality-fixer/;
const out=[]; const inst={};
for (const s of sessions){
  const dir=path.join(base,s,'subagents'); if(!fs.existsSync(dir)) {console.error('no',dir);continue;}
  for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.meta.json'))){
    let meta; try{meta=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));}catch{continue;}
    const at=(meta.agentType||'').replace(/^.*:/,''); if(!want.test(at)) continue;
    const jf=path.join(dir,f.replace('.meta.json','.jsonl')); if(!fs.existsSync(jf)) continue;
    inst[at]=(inst[at]||0)+1;
    const seen=new Set(); let touched=false;
    const rl=readline.createInterface({input:fs.createReadStream(jf),crlfDelay:Infinity});
    for await (const line of rl){
      if(!line.includes('design-')) continue;
      let o; try{o=JSON.parse(line);}catch{continue;}
      const c=o.message&&o.message.content; if(!Array.isArray(c)) continue;
      for(const b of c){ if(b.type!=='tool_use'||seen.has(b.id)) continue; seen.add(b.id);
        const i=b.input||{}; const js=JSON.stringify(i);
        if(!/design-[\w-]+\.md/.test(js)) continue;
        if(!['Read','Grep','Bash','PowerShell'].includes(b.name)) continue;
        touched=true;
        out.push({s:s.slice(0,4),agent:at,file:f.slice(0,22),tool:b.name,input:i});
      }
    }
    if(touched) inst[at+'#touched']=(inst[at+'#touched']||0)+1;
  }
}
fs.writeFileSync('reads.json',JSON.stringify(out));
console.log(inst); console.log(out.length);
const agg={};
for(const r of out){const k=r.agent+' '+r.tool+(r.tool==='Read'?(r.input.offset||r.input.limit?' ranged':' whole'):''); agg[k]=(agg[k]||0)+1;}
console.log(agg);
