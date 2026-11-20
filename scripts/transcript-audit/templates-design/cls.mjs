import fs from 'fs';
const E=JSON.parse(fs.readFileSync('edits.json','utf8'));
function diff(o,n){ let a=0; while(a<o.length&&a<n.length&&o[a]===n[a])a++; let b=0; while(b<o.length-a&&b<n.length-a&&o[o.length-1-b]===n[n.length-1-b])b++; return [o.slice(a,o.length-b),n.slice(a,n.length-b)]; }
const cat={}; const samples={};
for(const e of E){ const [x,y]=diff(e.o,e.n); const both=x+' '+y; let k;
  const size=Math.max(x.length,y.length);
  if(/classDef|-->|->>|participant|subgraph|@keyframes|flowchart|sequenceDiagram|e\d+@/.test(both)) k='diagram source';
  else if(size<=3) k='typo/punctuation';
  else if(/`[^`]+`/.test(both)||/[A-Za-z]+[A-Z_][A-Za-z_]+|\w+\.(ts|tsx|md|json)|\/[a-z]+\//.test(both)) k= size<400?'identifier/path/name (small)':'passage with identifiers (large)';
  else if(/\d/.test(both)&&size<200) k='number/limit/count';
  else if(/\b(KD|DC|UC|AC|FR|NFR)-/.test(both)) k='ID citation';
  else k= size<200?'wording (small)':'prose passage (large)';
  cat[k]=(cat[k]||0)+1; (samples[k]=samples[k]||[]).push([x,y]); e.k=k; e.size=size; }
console.log(E.length,cat);
const sizes=E.map(e=>e.size).sort((a,b)=>a-b); console.log('median changed span',sizes[sizes.length>>1],'p25',sizes[sizes.length>>2],'p75',sizes[(sizes.length*3)>>2]);
let seed=7; const rnd=()=>{seed=(seed*1103515245+12345)%2147483648; return seed/2147483648;};
for(const k of ['identifier/path/name (small)','number/limit/count','wording (small)','passage with identifiers (large)']){ console.log('\n### '+k); const s=samples[k]||[]; for(let i=0;i<14&&s.length;i++){ const [x,y]=s[Math.floor(rnd()*s.length)]; console.log(' - ['+x.slice(0,150).replace(/\n/g,'⏎')+'] => ['+y.slice(0,150).replace(/\n/g,'⏎')+']'); } }
