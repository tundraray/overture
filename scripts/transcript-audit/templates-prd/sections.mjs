import fs from 'fs';
const [,, kind, ...feats] = process.argv;
for (const f of feats) {
  const p = `D:/git/github/ai/agent-os/docs/features/${f}/${kind}.md`;
  const t = fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
  const lines = t.split('\n');
  let secs=[]; let cur={h:'(header)',lvl:1,start:1,chars:0}; let fence=false;
  lines.forEach((l,i)=>{
    if (/^```/.test(l)) fence=!fence;
    const m = !fence && l.match(/^(#{2,3}) (.*)/);
    if (m) { cur.end=i; secs.push(cur); cur={h:m[2],lvl:m[1].length,start:i+1,chars:0}; }
    cur.chars += l.length+1;
  });
  cur.end=lines.length; secs.push(cur);
  const total=t.length;
  const uh = secs.filter(s=>/Update History|История/.test(s.h)).reduce((a,s)=>a+s.chars,0);
  console.log(`\n=== ${f}/${kind}.md total ${total} chars, ${lines.length} lines; excl Update History ${total-uh}`);
  // h2 rollup
  let h2=null; const roll=[];
  for (const s of secs){ if(s.lvl<=2){h2={h:s.h,start:s.start,chars:0,subs:[]};roll.push(h2);} h2.chars+=s.chars; if(s.lvl===3) h2.subs.push(s); h2.end=s.end; }
  for (const r of roll){
    console.log(`${String(r.start).padStart(4)}-${String(r.end).padEnd(4)} ${String(r.chars).padStart(6)} ${(100*r.chars/total).toFixed(1).padStart(5)}%  ## ${r.h}`);
    if (process.env.SUBS) for (const s of r.subs) console.log(`      ${String(s.start).padStart(4)}-${String(s.end).padEnd(4)} ${String(s.chars).padStart(6)} ${(100*s.chars/total).toFixed(1).padStart(5)}%    ### ${s.h.slice(0,70)}`);
  }
}
