import fs from 'fs';
const D='D:/Temp/claude/bd9c3d61b915fdf1/02d27133-30ff-50b7-96b9-97d00d34f081/scratchpad/authors/out';
const all=JSON.parse(fs.readFileSync(D+'/all.json','utf8'));
const ty=r=>r.agentType.replace('fullstack-overture:','');
const MINE=/prd-creator|ux-designer|technical-designer|work-planner|acceptance-test-generator|document-reviewer/;
const pats={date:/(^|[;&| ])date( |$|;)|Get-Date/, lsp:/^LSP/, standardsCfg:/eslint|biome|prettier|tsconfig|\.github.workflows|vitest\.config|knip/i, web:/^(WebSearch|WebFetch)/, context7:/context7/, todo:/^TodoWrite/, skillTool:/^Skill /, sleep:/sleep \d|Monitor|tasks.*\.output/, gitCommit:/git (add|commit)/, c4ref:/c4-levels/, proseRef:/ai-tells|sentence-craft/, tmpl:/-template\.md/, authoring:/authoring-rules/, projctx:/project-context/, memory:/agent-memory/, toolsearch:/^ToolSearch/, bigRead:/tool-results/};
const m={};
for(const r of all){if(!MINE.test(ty(r)))continue; const k=ty(r); m[k]=m[k]||{runs:0}; m[k].runs++; const seen={}; for(const c of r.calls){const s=c.name+' '+c.input; if(c.name==='USER'||c.name==='SubagentHandback')continue; for(const[p,re]of Object.entries(pats)) if(re.test(s)){m[k][p]=(m[k][p]||0)+1; if(!seen[p]){seen[p]=1;m[k][p+'Runs']=(m[k][p+'Runs']||0)+1;}}}}
for(const[k,v]of Object.entries(m))console.log(k,JSON.stringify(v));
// mentions of skill names / concepts in handbacks
const words=['coding-principles','testing-principles','ai-development-guide','code-navigation','implementation-approach','technical-spec','project-context','YAGNI','Test Selection','findReferences','LSP','resolvedBy','R\d{1,2}\b|T[1-5]\b|P[1-5]\b','redraw','scores'];
const w={};
for(const r of all){if(!MINE.test(ty(r)))continue; const txt=r.calls.filter(c=>c.name==='SubagentHandback').map(c=>c.input).join(' '); const k=ty(r); w[k]=w[k]||{}; for(const x of words) if(new RegExp(x).test(txt)) w[k][x]=(w[k][x]||0)+1;}
for(const[k,v]of Object.entries(w))console.log(k,JSON.stringify(v));
