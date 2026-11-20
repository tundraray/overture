import fs from 'fs';
const D='D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/authors/out';
const all=JSON.parse(fs.readFileSync(D+'/all.json','utf8'));
const ty=r=>r.agentType.replace('fullstack-overture:','');
let n=0,parsed=0; const sev={},cat={}; let chTot=0,chIssues=0,chOther=0; const fields={}; let condDup=0; let prose=0; const byDoc={};
let deferred=0;
for(const r of all){ if(ty(r)!=='document-reviewer')continue; const h=r.calls.filter(c=>c.name==='SubagentHandback').pop(); if(!h)continue; n++;
 const msg=h.input.replace(/^.\d+ch.\s*/,''); chTot+=msg.length;
 const i=msg.indexOf('{'); const j=msg.lastIndexOf('}'); let o=null; try{o=JSON.parse(msg.slice(i,j+1));}catch{}
 if(!o){continue;} parsed++; prose+=i;
 for(const k of Object.keys(o)){fields[k]=(fields[k]||0)+JSON.stringify(o[k]).length;}
 const dt=(o.metadata&&o.metadata.doc_type)||'?'; byDoc[dt]=byDoc[dt]||{n:0,critical:0,important:0,recommended:0};byDoc[dt].n++;
 for(const is of o.issues||[]){sev[is.severity]=(sev[is.severity]||0)+1;cat[is.category]=(cat[is.category]||0)+1;byDoc[dt][is.severity]=(byDoc[dt][is.severity]||0)+1;}
 deferred+=(o.deferred||[]).length;
}
console.log({n,parsed,avgCh:Math.round(chTot/n),avgProsePreamble:Math.round(prose/parsed)});
console.log('severity',sev,'deferred',deferred); console.log('category',cat); console.log('byDoc',JSON.stringify(byDoc));
const tot=Object.values(fields).reduce((a,b)=>a+b,0); console.log('field share %',Object.entries(fields).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+':'+(100*v/tot).toFixed(1)).join(' '));
// authors: draftCheck fixed/open counts
let af=0,ao=0,an=0; const why={};
for(const r of all){ if(!/prd-creator|ux-designer|technical-designer|work-planner/.test(ty(r)))continue; for(const h of r.calls.filter(c=>c.name==='SubagentHandback')){const msg=h.input; const m=/"draftCheck"\s*:\s*\{/.exec(msg); if(!m)continue; an++; const seg=msg.slice(m.index,m.index+20000); const fx=/"fixed"\s*:\s*\[([\s\S]*?)\]\s*,\s*"open"/.exec(seg); if(fx)af+=(fx[1].match(/"\s*,\s*"/g)||[]).length+(fx[1].trim()?1:0); for(const w of seg.match(/"why_open"\s*:\s*"[^"]+"/g)||[]){ao++; const k=w.replace(/.*:\s*"/,'').replace(/"$/,'').slice(0,30); why[k]=(why[k]||0)+1;}}}
console.log('author handbacks with draftCheck json',an,'fixed',af,'open',ao,why);
