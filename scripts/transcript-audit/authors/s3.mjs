import fs from 'fs';
const D='D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/authors/out';
const all=JSON.parse(fs.readFileSync(D+'/all.json','utf8'));
const ty=r=>r.agentType.replace('fullstack-overture:','');
const AUTH=/^(prd-creator|ux-designer|technical-designer|technical-designer-frontend|work-planner|acceptance-test-generator)$/;
const agg={};
for(const r of all){ if(!AUTH.test(ty(r)))continue; const a=agg[ty(r)]=agg[ty(r)]||{runs:0,dr:0,waitMin:0,preEdits:0,postEdits:0,createRuns:0,hb:0,hbJson:0,hbCh:0,mem:0,memW:0,git:0,mm:0,mmFail:0,png:0,srcCalls:0,ce:0,todo:0,docReadsDup:0,selfDocReads:0, cp:0, drSmall:0, wholeRewrites:0};
 a.runs++; const c=r.calls; let firstWrite=-1;
 const written=new Set();
 c.forEach((x,i)=>{
  if(x.name==='Write'&&/docs./.test(x.input)){ const p=x.input.replace(/ \[.*/,'').toLowerCase(); if(written.has(p))a.wholeRewrites++; written.add(p); if(firstWrite<0){firstWrite=i;a.createRuns++;} }
  if(x.name==='SubagentHandback'){a.hb++; const m=x.input.replace(/^.\d+ch.\s*/,''); a.hbCh+=+/^\[(\d+)/.exec(x.input)[1]; if(/^(```json|\{)/.test(m))a.hbJson++;}
  if(/agent-memory/.test(x.input)){a.mem++; if(/^(Write|Edit)$/.test(x.name)||/cat >|>>/.test(x.input))a.memW++;}
  if(/git (add|commit|push)/.test(x.input))a.git++;
  if(/check-mermaid/.test(x.input)){a.mm++; if(/PROBLEM|FAIL|Error|not render/i.test(x.resHead||''))a.mmFail++;}
  if(x.name==='Read'&&/\.png/.test(x.input))a.png++;
  if(/^(Read|Grep|Glob|Bash|LSP)$/.test(x.name)&&/(apps|packages).|node_modules/.test(x.input)&&!/check-mermaid|docs.features/.test(x.input.slice(0,120)))a.srcCalls++;
  if(x.name==='Agent'&&/code-explorer/.test(x.input))a.ce++;
  if(x.name==='TodoWrite')a.todo++;
  if(/\bcp\b.*base|Copy-Item/.test(x.input))a.cp++;
  if(x.name==='Agent'&&/document-reviewer/.test(x.input)){a.dr++; const nx=c[i+1]; // wait until next non-memory call
    let j=i+1; while(c[j]&&(/agent-memory/.test(c[j].input)))j++; const end=c[j]; if(end)a.waitMin+=(new Date(end.ts)-new Date(x.resTs||x.ts))/60000;
    // edits before (since first write or segment start) and after until handback
    let pre=0; for(let k=i-1;k>=0&&c[k].name!=='SubagentHandback';k--) if(c[k].name==='Edit'&&/docs./.test(c[k].input))pre++;
    let post=0; for(let k=i+1;k<c.length&&c[k].name!=='SubagentHandback';k++) if(c[k].name==='Edit'&&/docs./.test(c[k].input))post++;
    a.preEdits+=pre;a.postEdits+=post; if(pre<=8&&firstWrite<0)a.drSmall++;
  }
 });
}
for(const[k,v]of Object.entries(agg)){for(const f in v)if(typeof v[f]==='number')v[f]=Math.round(v[f]);console.log(k,JSON.stringify(v));}
