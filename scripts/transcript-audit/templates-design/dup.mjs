import fs from 'fs';
// for each backticked identifier / DC id, in which top sections does it appear?
for (const f of process.argv.slice(2)){
  const lines=fs.readFileSync(f,'utf8').split(/\r?\n/); let sec='Header',code=false; const where=new Map();
  for(const l of lines){ if(/^```/.test(l)) code=!code; if(code) continue;
    let m; if(m=l.match(/^## (.*)/)) sec=m[1]; else if((m=l.match(/^### (.*)/))&&/Key Decisions|Architecture|Runtime Flows|Contract Definitions|Data Model|State Transitions/.test(m[1])) sec=m[1].replace(/ \(.*/,'');
    for(const id of l.match(/`[A-Za-z_][\w./:-]{3,}`/g)||[]){ (where.get(id)||where.set(id,new Set()).get(id)).add(sec); } }
  const core=['Acceptance Criteria','Runtime Flows','Contract Definitions','Test Strategy','Key Decisions','Architecture'];
  let n=0,c3=0,c4=0; const ex=[];
  for(const [id,s] of where){ const k=core.filter(x=>s.has(x)).length; n++; if(k>=3){c3++; if(ex.length<6) ex.push(id+':'+[...s].length);} if(k>=4)c4++; }
  console.log(f.split('/').slice(-2).join('/'),'identifiers',n,'in >=3 of 6 core sections',c3,'in >=4',c4,ex.join(' '));
  // DC ids: where defined & cited
  const dc=new Map(); sec='Header'; code=false;
  for(const l of lines){ let m; if(m=l.match(/^## (.*)/)) sec=m[1]; else if((m=l.match(/^### (.*)/))&&/Key Decisions|Architecture|Runtime Flows|Contract Definitions|Data Model|State Transitions/.test(m[1])) sec=m[1];
    for(const id of l.match(/\b(DC|UC|KD)-[EN]?\d+/g)||[]) (dc.get(id.split('-')[0])||dc.set(id.split('-')[0],{}).get(id.split('-')[0]))[sec]=((dc.get(id.split('-')[0])[sec])||0)+1; }
  console.log('  ', JSON.stringify(Object.fromEntries(dc)));
}
