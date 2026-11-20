import fs from 'fs'; import path from 'path'; import readline from 'readline';
const base='C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os';
const sessions=['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9','eae5f417-51c8-495d-8f00-5ecd3d2d6117','bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const r={};
for (const s of sessions){ const dir=path.join(base,s,'subagents');
  for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.meta.json'))){
    let meta; try{meta=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));}catch{continue;}
    const at=(meta.agentType||'').replace(/^.*:/,''); const jf=path.join(dir,f.replace('.meta.json','.jsonl')); if(!fs.existsSync(jf)) continue;
    const e=(r[at]=r[at]||{inst:0,adrInst:0,read:0,readRanged:0,grep:0,bash:0}); e.inst++; const seen=new Set(); let t=false;
    const rl=readline.createInterface({input:fs.createReadStream(jf),crlfDelay:Infinity});
    for await (const line of rl){ if(!/ADR-\d{4}/.test(line)) continue; let o; try{o=JSON.parse(line);}catch{continue;}
      const c=o.message&&o.message.content; if(!Array.isArray(c)) continue;
      for(const b of c){ if(b.type!=='tool_use'||seen.has(b.id)) continue; seen.add(b.id); const i=b.input||{};
        if(b.name==='Read'&&/ADR-\d{4}[\w-]*\.md/.test(i.file_path||'')){t=true; e.read++; if(i.offset||i.limit) e.readRanged++;}
        else if(b.name==='Grep'&&/adr/i.test(i.path||'')){t=true;e.grep++;}
        else if(b.name==='Bash'&&/(sed|cat|grep|head|awk)[^;|&]*ADR-\d{4}[\w-]*\.md|docs\/adr/.test(i.command||'')){t=true;e.bash++;} } }
    if(t) e.adrInst++; } }
console.table(r);
