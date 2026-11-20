import fs from 'fs';
const D = JSON.parse(fs.readFileSync('executors.json','utf8'));
const med = a => { const s=[...a].sort((x,y)=>x-y); return s[Math.floor(s.length/2)]??0; };
const sum = a => a.reduce((x,y)=>x+y,0);
const sh = c => c.name==='Bash'||c.name==='PowerShell';
const tm = c => c.rt ? (new Date(c.rt)-new Date(c.t))/60000 : 0;
const K = {
  pyedit: k=>/python3? -( <<|c)|python3? - <</.test(k) && /open\(|write\(/.test(k),
  shread: k=>/(^|[;&|]\s*|\bdo\s+)(cat|sed -n|head|tail|awk|grep|rg|ls|find|wc)\b/.test(k),
  gitdiff: k=>/\bgit\s+(-C \S+\s+)?(diff|status|show|log|stash|reset|checkout|rm|apply)\b/.test(k),
  test: k=>/vitest|jest\b|\btest(:\w+)?\b(?=[^/.\w-])|playwright test/.test(k) && /pnpm|npx|vitest/.test(k) && !/grep -[a-zA-Z]*n?.*vitest\.config/.test(k),
  e2e: k=>/(vitest|pnpm|npx)[^;&|]*(e2e|\.int\.|integration)/.test(k),
  typecheck: k=>/tsc\b|typecheck/.test(k),
  lint: k=>/eslint|oxlint|\blint\b|biome/.test(k),
  prettier: k=>/prettier|format\b/.test(k),
  build: k=>/(pnpm|turbo|npm)[^;&|]*\bbuild\b/.test(k),
  knip: k=>/knip/.test(k),
  crlf: k=>/\r|autocrlf|file -|crlf|CRLF/.test(k),
  docker: k=>/docker|psql|pg_dump|curl/.test(k),
};
const tot={}, inst={}, wall={};
for (const a of D){ const s=new Set(); for(const c of a.calls) if(sh(c)) for(const [n,f] of Object.entries(K)) if(f(c.key)){ tot[n]=(tot[n]||0)+1; wall[n]=(wall[n]||0)+tm(c); s.add(n);} for(const n of s) inst[n]=(inst[n]||0)+1; }
console.log('class: calls / instances / wall-min');
for (const n of Object.keys(K)) console.log(n.padEnd(10), tot[n]||0, inst[n]||0, (wall[n]||0).toFixed(0));
// per session rates
for (const s of [...new Set(D.map(a=>a.session))]) { const A=D.filter(a=>a.session===s); const r={}; for(const n of Object.keys(K)) r[n]=sum(A.map(a=>a.calls.filter(c=>sh(c)&&K[n](c.key)).length)); console.log(s, A.length, JSON.stringify(r)); }
// by type
for (const t of ['task-executor','task-executor-frontend']) { const A=D.filter(a=>a.type===t); const r={}; for(const n of Object.keys(K)) r[n]=sum(A.map(a=>a.calls.filter(c=>sh(c)&&K[n](c.key)).length)); console.log(t, A.length, 'Edit',sum(A.map(a=>a.calls.filter(c=>c.name==='Edit').length)),'Read',sum(A.map(a=>a.calls.filter(c=>c.name==='Read').length)), JSON.stringify(r)); }
// tool time vs think time
let toolT=0, allT=0; for(const a of D){ const d=(new Date(a.end)-new Date(a.start))/60000; if(d>100) continue; allT+=d; toolT+=sum(a.calls.map(tm)); }
console.log('wall excl outlier', allT.toFixed(0), 'in tools', toolT.toFixed(0));
console.log('outTok total', sum(D.map(a=>a.outTok)), 'median', med(D.map(a=>a.outTok)));
// handback
const hb=D.flatMap(a=>a.calls.filter(c=>c.name==='SubagentHandback').map(c=>({a,c})));
console.log('handback n',hb.length,'len median',med(hb.map(x=>x.c.len)),'max',Math.max(...hb.map(x=>x.c.len)),'>4000:',hb.filter(x=>x.c.len>4000).length,'>8000:',hb.filter(x=>x.c.len>8000).length,'total chars',sum(hb.map(x=>x.c.len)), 'json-start', hb.filter(x=>/^\s*(```json\s*)?\{/.test(x.c.key)).length);
console.log('multi-handback inst', D.filter(a=>a.calls.filter(c=>c.name==='SubagentHandback').length>1).map(a=>a.session+' '+a.file+' '+a.calls.filter(c=>c.name==='SubagentHandback').length).join('; '));
// pyedit size
const py=D.flatMap(a=>a.calls.filter(c=>sh(c)&&K.pyedit(c.key)));
console.log('pyedit n',py.length,'cmd chars total',sum(py.map(c=>c.len)),'median',med(py.map(c=>c.len)), 'err', py.filter(c=>c.err).length, 'assert fail', py.filter(c=>/AssertionError|Traceback/.test(c.res||'')).length);
const ed=D.flatMap(a=>a.calls.filter(c=>c.name==='Edit')); console.log('Edit n',ed.length,'err',ed.filter(c=>c.err).length,'Write n',D.flatMap(a=>a.calls.filter(c=>c.name==='Write')).length);
// instances: pyedit-users vs Edit-users
console.log('inst using pyedit',D.filter(a=>a.calls.some(c=>sh(c)&&K.pyedit(c.key))).length,'inst using Edit',D.filter(a=>a.calls.some(c=>c.name==='Edit')).length, 'inst pyedit only', D.filter(a=>a.calls.some(c=>sh(c)&&K.pyedit(c.key))&&!a.calls.some(c=>c.name==='Edit')).length);
// other task-file reads (task files other than own) 
let otherTask=0, otInst=0; for(const a of D){ const own=(a.prompt.match(/task-[\w.]+\.md/g)||[]); let n=0; for(const c of a.calls){ const ms=(c.key.match(/task-[\w.\[\]-]+\.md/g)||[]).filter(m=>!own.includes(m)); if(ms.length && (c.name==='Read'||sh(c))) n++; } otherTask+=n; if(n) otInst++; }
console.log('calls touching other task files',otherTask,'inst',otInst);
// shell read of docs
let docSh=0; for(const a of D) for(const c of a.calls) if(sh(c)&&K.shread(c.key)&&/docs[\/]|design-|prd\.md|uxrd|task-/.test(c.key)) docSh++;
console.log('shell reads on docs', docSh);
// ToolSearch & Monitor
for(const a of D) for(const c of a.calls) if(/ToolSearch|Monitor/.test(c.name)) console.log(a.session,a.file,c.name,c.key.slice(0,150));
// test detail: e2e time
const e2e=D.flatMap(a=>a.calls.filter(c=>sh(c)&&K.e2e(c.key)&&K.test(c.key)).map(c=>({a,c})));
console.log('e2e/int test runs',e2e.length,'inst',new Set(e2e.map(x=>x.a.file)).size,'wall',sum(e2e.map(x=>tm(x.c))).toFixed(0));
const longest=D.flatMap(a=>a.calls.map(c=>({a,c,d:tm(c)}))).sort((x,y)=>y.d-x.d).slice(0,15); for(const x of longest) console.log(x.d.toFixed(1)+'m',x.a.session,x.a.file.slice(6,16),x.c.name,x.c.key.replace(/\s+/g,' ').slice(0,170));
