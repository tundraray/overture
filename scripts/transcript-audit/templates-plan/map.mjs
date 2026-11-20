import fs from 'fs';
const r=JSON.parse(fs.readFileSync('reads.json','utf8'));
const root='D:/git/github/ai/agent-os/docs/';
const heads={};
const H=f=>{ if(heads[f]) return heads[f]; let t; try{t=fs.readFileSync(root+f,'utf8').split(/\r?\n/)}catch{return heads[f]=[]} const h=[]; let phase=''; t.forEach((l,i)=>{ if(/^## /.test(l)){phase='';h.push([i+1,l.slice(3,40)])} else if(/^### /.test(l)){ h.push([i+1,(/Phase|Фаза/.test(l)?'PHASE ':'APPX ')+l.slice(4,30)]);} }); return heads[f]=h; };
const tally={};
for(const x of r.filter(x=>/task-executor/.test(x.agentType)&&x.kind==='plan'&&x.tool==='Read')){
  const m=x.extra.match(/off=(\d+)(?: lim=(\d+))?/); const h=H(x.file); let secs=new Set();
  if(!m){secs.add('WHOLE');} else { const a=+m[1], b=a+(+(m[2]||2000))-1; h.forEach(([ln,name],i)=>{ const end=(h[i+1]?.[0]??1e9)-1; if(ln<=b&&end>=a) secs.add(name.startsWith('PHASE')?'PHASE block':name); }); }
  for(const s of secs) tally[s]=(tally[s]||0)+1;
}
console.log('executor plan Read ranges by section (31 reads):',tally);
// design greps by executors
const g=r.filter(x=>/task-executor/.test(x.agentType)&&x.kind==='design'&&x.tool==='Grep');
console.log('\nexecutor design Grep sample:'); for(const x of g.filter((_,i)=>i%3===0).slice(0,18)) console.log(' ',x.file.split('/').pop(),x.extra.slice(0,150));
const d=r.filter(x=>/task-executor/.test(x.agentType)&&x.kind==='design'&&x.tool==='Read');
console.log('\nexecutor design Reads: whole',d.filter(x=>!x.extra.trim()).length,'ranged',d.filter(x=>x.extra.trim()).length);
// by session: executors total vs touching design
for(const s of ['2862','eae5','bb45']){ const ex=r.filter(x=>x.sess===s&&/task-executor/.test(x.agentType)); const u=f=>new Set(ex.filter(f).map(x=>x.agent)).size; console.log(s,'exec w/ any doc',u(()=>true),'design',u(x=>x.kind==='design'),'taskRead',u(x=>x.kind==='task'),'planRead/Grep',u(x=>x.kind==='plan'&&/Read|Grep/.test(x.tool)),'plan Bash',u(x=>x.kind==='plan'&&x.tool==='Bash')); }
