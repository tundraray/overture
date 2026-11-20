import fs from 'fs';
const root='D:/git/github/ai/agent-os/docs/features/';
const plans=[
['model-providers/core/20261120-feature-model-providers-core.md','model-providers/design-core.md'],
['custom-agents/web/20261118-feature-custom-agents-web.md','custom-agents/design-web.md'],
['custom-agents/runtime/20261117-feature-custom-agents-runtime.md','custom-agents/design-runtime.md'],
['custom-agents/library/20261117-feature-custom-agents-library.md','custom-agents/design-library.md'],
['enterprise-access/admin/20261116-feature-enterprise-access-admin.md','enterprise-access/design-admin.md'],
['enterprise-access/access/20261116-feature-enterprise-access-access.md','enterprise-access/design-access.md'],
];
const norm=s=>s.toLowerCase().replace(/[`*_|]/g,'').replace(/\s+/g,' ').trim();
const agg={};
for(const [p,d] of plans){
  const t=fs.readFileSync(root+p,'utf8'); const dd=norm(fs.readFileSync(root+d,'utf8'));
  const lines=t.split(/\r?\n/); const total=t.length;
  const sec={}; let cur='frontmatter+title'; let inPhase=false; let sub='';
  const add=(k,n)=>{sec[k]=(sec[k]||0)+n};
  for(const l of lines){
    if(/^## /.test(l)){ inPhase=false; cur=l.replace(/^## /,'').trim(); if(/^Implementation Phases/.test(cur)) cur='Phases: preamble'; }
    else if(/^### /.test(l)){ const h=l.replace(/^### /,'').trim(); if(/Phase/.test(h)){inPhase=true; cur='Phase: header/purpose'; if(/Final|Quality Assurance/.test(h)) cur='Phase: QA phase';} else {inPhase=false; cur='Appx: '+h;} }
    else if(/^#### /.test(l) && inPhase && cur!=='Phase: QA phase'){ cur='Phase: '+l.replace(/^#### /,'').trim(); }
    let k=cur;
    if(inPhase && /^Phase: Tasks/.test(cur)){
      if(/^\s+- (Target Files|Файлы)/i.test(l)) k='Phase/task: Target Files line';
      else if(/^\s+- (Dependencies|Зависим)/i.test(l)) k='Phase/task: Dependencies line';
      else if(/^\s+- (Тест|Test)/i.test(l)) k='Phase/task: Tests line';
      else if(/^\s+- (Проверка|Verification|Completion)/i.test(l)) k='Phase/task: Verification line';
      else if(/^\s+- (Не трогает|Scope|Не запускать)/i.test(l)) k='Phase/task: Scope boundary line';
      else if(/^\s+- Pattern/i.test(l)) k='Phase/task: Pattern line';
      else if(/^- \[/.test(l)) k='Phase/task: title+covers';
      else k='Phase/task: how (body)';
    }
    add(k,l.length+1);
  }
  console.log('\n=== '+p+' total '+total);
  for(const [k,v] of Object.entries(sec)) { console.log(String(v).padStart(7), (100*v/total).toFixed(1).padStart(5)+'%', k); (agg[k]=agg[k]||[]).push(100*v/total); }
  // RCV overlap
  const m=t.match(/### Reference Contract Values[\s\S]*?(?=\n### |\n## )/);
  if(m){ const rows=m[0].split(/\r?\n/).filter(r=>/^\|/.test(r)).slice(2);
    let exact=0, chars=0, exactChars=0, shingleHit=0, shingleTot=0;
    const hdr=m[0].split(/\r?\n/).find(r=>/^\|/.test(r)).split('|').map(s=>s.trim());
    const vi=hdr.findIndex(h=>/verbatim|Observable/i.test(h));
    for(const r of rows){ const c=r.split('|'); const v=norm(c[vi]||''); if(!v) continue; chars+=v.length;
      if(dd.includes(v)){exact++; exactChars+=v.length;}
      const w=v.split(' '); for(let i=0;i+4<=w.length;i++){shingleTot++; if(dd.includes(w.slice(i,i+4).join(' '))) shingleHit++;}
    }
    console.log('RCV rows',rows.length,'cols',hdr.filter(Boolean).join(' / '),'| value chars',chars,'| rows found verbatim in DD',exact,'| 4-word shingles found in DD',(100*shingleHit/shingleTot).toFixed(0)+'%');
  }
  const cb=(t.match(/^\s*- \[[ x🔄]\]/gmu)||[]).length; console.log('checkboxes',cb,'phases',(t.match(/^### .*Phase/gm)||[]).length);
}
console.log('\n=== mean share');
for(const [k,v] of Object.entries(agg)) console.log((v.reduce((a,b)=>a+b,0)/plans.length).toFixed(1).padStart(5)+'%', 'n='+v.length, k);
