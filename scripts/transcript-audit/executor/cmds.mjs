import fs from 'fs';
const D = JSON.parse(fs.readFileSync('executors.json','utf8'));
const h={}; const ex={};
for (const a of D) for (const c of a.calls) if (/Bash|PowerShell/.test(c.name)) {
  let k=c.key.replace(/^\s*cd\s+("[^"]+"|\S+)\s*(&&|;)\s*/,'').replace(/^\s*(export \S+\s*(&&|;)\s*)+/,'');
  const w=k.trim().split(/\s+/).slice(0,3).join(' ').replace(/[A-Za-z]:[\/]\S+/g,'<p>').slice(0,50);
  const w2=k.trim().split(/\s+/)[0].replace(/[A-Za-z]:[\/]\S+/g,'<p>');
  h[w2]=(h[w2]||0)+1; (ex[w2]=ex[w2]||[]).push(k.slice(0,230));
}
const e=Object.entries(h).sort((a,b)=>b[1]-a[1]);
console.log(e.slice(0,40).map(x=>x[1]+' '+x[0]).join('\n'));
for (const w of ['pnpm','npx','node','python','python3','for','timeout']) { console.log('\n=='+w); const s=ex[w]||[]; for (let i=0;i<s.length;i+=Math.ceil(s.length/14)) console.log('  '+s[i].replace(/\n/g,' ⏎ ')); }
