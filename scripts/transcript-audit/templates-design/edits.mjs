import fs from 'fs'; import path from 'path'; import readline from 'readline';
const base='C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os';
const sessions=['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9','eae5f417-51c8-495d-8f00-5ecd3d2d6117','bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const out=[];
for (const s of sessions){ const dir=path.join(base,s,'subagents');
  for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.meta.json'))){
    let meta; try{meta=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));}catch{continue;}
    if(!/technical-designer/.test(meta.agentType||'')) continue;
    const jf=path.join(dir,f.replace('.meta.json','.jsonl')); if(!fs.existsSync(jf)) continue; const seen=new Set(); let wrote=false;
    const rl=readline.createInterface({input:fs.createReadStream(jf),crlfDelay:Infinity});
    for await (const line of rl){ if(!line.includes('design-')) continue; let o; try{o=JSON.parse(line);}catch{continue;}
      const c=o.message&&o.message.content; if(!Array.isArray(c)) continue;
      for(const b of c){ if(b.type!=='tool_use'||seen.has(b.id)) continue; seen.add(b.id); const i=b.input||{};
        if(!/design-[\w-]+\.md$/.test(i.file_path||'')) continue;
        if(b.name==='Write') wrote=true;
        if(b.name==='Edit') out.push({f:f.slice(6,14),doc:i.file_path.split(/[\/]/).slice(-2).join('/'),afterWrite:wrote,o:i.old_string||'',n:i.new_string||''}); } } } }
fs.writeFileSync('edits.json',JSON.stringify(out)); console.log(out.length, out.filter(e=>e.afterWrite).length);
