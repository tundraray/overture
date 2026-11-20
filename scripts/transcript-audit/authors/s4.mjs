import fs from 'fs';
const D='D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/authors/out';
const all=JSON.parse(fs.readFileSync(D+'/all.json','utf8'));
const ty=r=>r.agentType.replace('fullstack-overture:','');
const AUTH=/^(prd-creator|ux-designer|technical-designer|technical-designer-frontend|work-planner)$/;
const med=a=>a.length?a.sort((x,y)=>x-y)[a.length>>1]:0;
const out={};
for(const r of all){ if(!AUTH.test(ty(r)))continue; const c=r.calls; const o=out[ty(r)]=out[ty(r)]||{create:0,selfEdits:[],selfMin:[],selfCalls:[],preWriteMin:[],writeCh:[],editOld:[],editNew:[],postEdits:[],postMin:[],total:[]};
 for(const x of c) if(x.name==='Edit'&&/docs./.test(x.input)){const m=/old (\d+) new (\d+)/.exec(x.input); if(m){o.editOld.push(+m[1]);o.editNew.push(+m[2]);}}
 const w=c.findIndex(x=>x.name==='Write'&&/docs.features|docs.adr/i.test(x.input)); const d=c.findIndex((x,i)=>i>w&&x.name==='Agent'&&/document-reviewer/.test(x.input));
 if(w<0||d<0)continue; o.create++;
 const t=i=>new Date(c[i].ts)/60000; const t0=new Date(r.start)/60000;
 o.preWriteMin.push(t(w)-t0); o.writeCh.push(+/\[(\d+)ch\]/.exec(c[w].input)[1]);
 o.selfEdits.push(c.slice(w+1,d).filter(x=>x.name==='Edit'&&/docs./.test(x.input)).length); o.selfCalls.push(d-w-1); o.selfMin.push(t(d)-t(w));
 let h=c.findIndex((x,i)=>i>d&&x.name==='SubagentHandback'); if(h<0)h=c.length-1;
 const back=c.findIndex((x,i)=>i>d&&x.name==='USER'&&/hand-back|agent-message|task-notification/i.test(x.input));
 o.postEdits.push(c.slice(d+1,h).filter(x=>x.name==='Edit'&&/docs./.test(x.input)).length); if(back>0){o.postMin.push(t(h)-t(back)); o.wait=(o.wait||[]); o.wait.push(t(back)-t(d));}
 o.total.push(t(h)-t0);
}
for(const[k,o]of Object.entries(out)){console.log(k,'createRunsWithDR',o.create,'| median: preWrite min',med(o.preWriteMin).toFixed(1),'writeCh',med(o.writeCh),'self-pass calls',med(o.selfCalls),'edits',med(o.selfEdits),'min',med(o.selfMin).toFixed(1),'| wait',med(o.wait||[]).toFixed(1),'| post-review edits',med(o.postEdits),'min',med(o.postMin).toFixed(1),'| total',med(o.total).toFixed(1),'| edit old/new median',med(o.editOld),med(o.editNew),'n edits',o.editOld.length,'<300ch',o.editOld.filter(x=>x<300).length);}
