import fs from 'fs'; import path from 'path'; import readline from 'readline';
const base='C:/Users/tundr/.claude/projects/D--git-github-ai-agent-os';
const sessions=['28626df2-d3ad-48f3-9042-0ea1a6ebb1f9','eae5f417-51c8-495d-8f00-5ecd3d2d6117','bb45672c-c0b7-4a03-b437-47f4b8c086ef'];
const want=/^(task-executor|task-executor-frontend|work-planner|acceptance-test-generator|code-verifier|code-reviewer|security-reviewer|design-sync|integration-test-reviewer)$/;
// build line map
const root='D:/git/github/ai/agent-os/docs/features'; const lms={};
function norm(h2,h3,h4){
  if(!h2) return '00 Header';
  if(/^Snapshot/.test(h2)) return /Key Decisions/.test(h3||'')?'02 Key Decisions':'01 Snapshot';
  if(/^Terms/.test(h2)) return '03 Terms'; if(/^Part\b/.test(h2)) return '04 Part';
  if(/^Building-block/.test(h2)) return '05 Building-block Inventory';
  if(/^Acceptance Criteria/.test(h2)) return '06 Acceptance Criteria';
  if(/^Design$/.test(h2)){
    if(/^Architecture/.test(h3||'')){ const m=(h4||'').match(/^C([1-4])/); return m?('07.'+m[1]+' C'+m[1]):'07.0 Architecture other'; }
    if(/^Runtime Flows/.test(h3||'')) return '08 Runtime Flows';
    if(/^Contract Definitions/.test(h3||'')) return '09 Contract Definitions';
    if(/^Data Model/.test(h3||'')) return '10 Data Model';
    if(/^State Transitions/.test(h3||'')) return '11 State Transitions and Invariants';
    return '12 Design: author-added h3';
  }
  if(/^Test Strategy/.test(h2)) return '13 Test Strategy';
  if(/^Security/.test(h2)) return '14 Security Considerations';
  if(/^Risks/.test(h2)) return '15 Risks and Mitigation';
  if(/^Open Questions/.test(h2)) return '16 Open Questions';
  if(/^Appendix/.test(h2)) return '17 Appendix: Fact Disposition';
  if(/^Update History/.test(h2)) return '18 Update History';
  return '99 other/old: '+h2.slice(0,30);
}
for(const feat of fs.readdirSync(root)) for(const f of fs.readdirSync(path.join(root,feat)).filter(x=>/^design-.*\.md$/.test(x))){
  const lm=(lms[feat+'/'+f]=new Map()); let h2='',h3='',h4='',code=false,mer=false;
  for(const l of fs.readFileSync(path.join(root,feat,f),'utf8').split(/\r?\n/)){
    if(/^```/.test(l)){ if(!code){code=true;mer=/mermaid/.test(l);} else {code=false;mer=false;} }
    if(!code){ let m; if(m=l.match(/^## (.*)/)){h2=m[1];h3='';h4='';} else if(m=l.match(/^### (.*)/)){h3=m[1];h4='';} else if(m=l.match(/^#### (.*)/)){h4=m[1];} }
    const t=l.trim(); if(t.length<25) continue;
    const key=norm(h2,h3,h4)+(mer?'|M':'');
    const k=t.slice(0,200); const e=lm.get(k); if(e===undefined) lm.set(k,key); else if(e!==key) lm.set(k,null);
  }
}
const stats={}; // agent -> section -> {calls, inst:Set, chars}
const whole={}; const instAll={}; const instTouched={}; const merChars={}; const totChars={};
const grepPatterns={};
for (const s of sessions){
  const dir=path.join(base,s,'subagents');
  for (const f of fs.readdirSync(dir).filter(x=>x.endsWith('.meta.json'))){
    let meta; try{meta=JSON.parse(fs.readFileSync(path.join(dir,f),'utf8'));}catch{continue;}
    const at=(meta.agentType||'').replace(/^.*:/,''); if(!want.test(at)) continue;
    const jf=path.join(dir,f.replace('.meta.json','.jsonl')); if(!fs.existsSync(jf)) continue;
    instAll[at]=(instAll[at]||0)+1; const id=f;
    const uses=new Map(); const done=new Set(); let touched=false, didWhole=false;
    const rl=readline.createInterface({input:fs.createReadStream(jf),crlfDelay:Infinity});
    for await (const line of rl){
      let o; try{o=JSON.parse(line);}catch{continue;}
      const c=o.message&&o.message.content; if(!Array.isArray(c)) continue;
      for(const b of c){
        if(b.type==='tool_use'&&!uses.has(b.id)){
          const js=JSON.stringify(b.input||{});
          if(/design-[\w-]+\.md/.test(js)&&!/design-template/.test(js)&&['Read','Grep','Bash'].includes(b.name)) uses.set(b.id,b);
        } else if(b.type==='tool_result'&&uses.has(b.tool_use_id)&&!done.has(b.tool_use_id)){
          done.add(b.tool_use_id); const u=uses.get(b.tool_use_id);
          let txt=typeof b.content==='string'?b.content:(b.content||[]).map(x=>x.text||'').join('\n');
          const isWhole=u.name==='Read'&&!u.input.offset&&!u.input.limit;
          if(isWhole&&!/exceeds maximum|File content \(/.test(txt.slice(0,300))){ didWhole=true; touched=true; (whole[at]=whole[at]||{calls:0,inst:new Set()}).calls++; whole[at].inst.add(id); continue; }
          if(u.name==='Grep'){ (grepPatterns[at]=grepPatterns[at]||[]).push(u.input.pattern); }
          const secs=new Map();
          const dm=JSON.stringify(u.input).match(/design-[\w-]+\.md/g)||[]; const maps=Object.keys(lms).filter(k=>dm.includes(k.split('/')[1])).map(k=>lms[k]); if(!maps.length) continue;
          const cmd=u.input.command||''; const mode=(u.name==='Read'||(u.name==='Bash'&&/sed -n|awk /.test(cmd)))?'R':'G';
          let prev=null;
          for(let l of txt.split(/\r?\n/)){
            l=l.replace(/^\s*\d+[→\t:-]\s?/,'').replace(/^[^\s:]*design-[\w-]+\.md[:-]\d+[:-]/,'').trim();
            if(l.length<25) continue; let key; let found=false; for(const m of maps){ if(m.has(l.slice(0,200))){found=true; key=m.get(l.slice(0,200)); if(key) break;} }
            if(!found) continue; if(!key){ if(mode==='G'||!prev) continue; key=prev; } prev=key;
            let [sec,m]=key.split('|'); sec=mode+' '+sec; secs.set(sec,(secs.get(sec)||0)+l.length);
            totChars[at]=(totChars[at]||0)+l.length; if(m) merChars[at]=(merChars[at]||0)+l.length;
          }
          if(secs.size) touched=true;
          for(const [sec,ch] of secs){ const a=(stats[at]=stats[at]||{}); const e=(a[sec]=a[sec]||{calls:0,inst:new Set(),chars:0}); e.calls++; e.inst.add(id); e.chars+=ch; }
        }
      }
    }
    if(touched) instTouched[at]=(instTouched[at]||0)+1;
  }
}
for(const at of Object.keys(instAll).sort()){
  console.log(`\n## ${at}: instances ${instAll[at]}, touched design ${instTouched[at]||0}, whole-file reads ${whole[at]?whole[at].calls+' in '+whole[at].inst.size+' inst':0}, partial chars ${totChars[at]||0} (mermaid ${merChars[at]||0})`);
  const a=stats[at]||{}; for(const sec of Object.keys(a).sort()) console.log('  '+sec.padEnd(40), 'calls',String(a[sec].calls).padStart(4),' inst',String(a[sec].inst.size).padStart(3),' chars',String(a[sec].chars).padStart(7));
}
fs.writeFileSync('grep-patterns.json',JSON.stringify(grepPatterns,null,1));
