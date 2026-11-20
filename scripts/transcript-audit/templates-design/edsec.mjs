import fs from 'fs'; import path from 'path';
const root='D:/git/github/ai/agent-os/docs/features'; const lms={};
const E=JSON.parse(fs.readFileSync('edits.json','utf8'));
for(const feat of fs.readdirSync(root)) for(const f of fs.readdirSync(path.join(root,feat)).filter(x=>/^design-.*\.md$/.test(x))){
  const lm=lms[feat+'/'+f]=[]; let h2='Header',h3='';
  for(const l of fs.readFileSync(path.join(root,feat,f),'utf8').split(/\r?\n/)){ let m; if(m=l.match(/^## (.*)/)){h2=m[1];h3='';} else if(m=l.match(/^### (.*)/))h3=m[1];
    let s=h2==='Design'?h3.replace(/ \(.*/,''):(h2==='Snapshot'&&/Key/.test(h3)?'Key Decisions':h2); if(/^FR-|^NFR/.test(s))s='Acceptance Criteria'; if(!/Snapshot|Key Decisions|Terms|^Part|Building|Acceptance|Architecture|Runtime Flows|Contract Def|Data Model|State Trans|Test Strategy|Security|Risks|Open Q|Appendix|Update History|Header/.test(s)) s='other (author-added/old)';
    lm.push([l,s]); } }
const cnt={}; let un=0;
for(const e of E){ const lm=lms[e.doc]; if(!lm){un++;continue;} let sec=null;
  for(const frag of e.n.split(/\r?\n/).concat(e.o.split(/\r?\n/))){ const t=frag.trim(); if(t.length<30) continue; const hit=lm.find(([l])=>l.includes(t.slice(0,80))); if(hit){sec=hit[1];break;} }
  if(!sec){un++;continue;} cnt[sec]=(cnt[sec]||0)+1; }
const tot=Object.values(cnt).reduce((a,b)=>a+b,0); console.log('mapped',tot,'unmapped',un);
for(const [k,v] of Object.entries(cnt).sort((a,b)=>b[1]-a[1])) console.log(String(v).padStart(4),(100*v/tot).toFixed(0)+'%',k);
