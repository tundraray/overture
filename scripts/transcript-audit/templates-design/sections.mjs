import fs from 'fs';
const files = process.argv.slice(2);
for (const f of files) {
  const t = fs.readFileSync(f,'utf8');
  const lines = t.split(/\r?\n/);
  const total = t.length;
  let secs=[]; let cur={h:'(header)',lvl:1,start:1,chars:0,mer:0,merChars:0}; let inCode=false; let inMer=false;
  lines.forEach((l,i)=>{
    if (/^```/.test(l)) { if(!inCode){inCode=true; inMer=/^```mermaid/.test(l); if(inMer)cur.mer++;} else {inCode=false; inMer=false;} }
    const m = !inCode && l.match(/^(#{2,3}) (.*)/);
    if (m) { secs.push(cur); cur={h:m[1]+' '+m[2],lvl:m[1].length,start:i+1,chars:0,mer:0,merChars:0}; }
    cur.chars += l.length+1; if(inMer) cur.merChars+=l.length+1;
  });
  secs.push(cur);
  console.log('\n=== '+f.split('/').slice(-2).join('/')+'  total '+total+' lines '+lines.length);
  for (const s of secs) console.log(String(s.start).padStart(5), String(s.chars).padStart(7), (100*s.chars/total).toFixed(1).padStart(5)+'%', s.mer?('mer'+s.mer+':'+s.merChars).padEnd(12):''.padEnd(12), s.h.slice(0,70));
}
