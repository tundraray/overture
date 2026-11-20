import fs from 'fs';
const r=JSON.parse(fs.readFileSync('reads.json','utf8'));
const types=process.argv[2].split(',');
for(const x of r){ if(!types.includes(x.type)) continue; if(!['Bash','Grep','Read','PowerShell'].includes(x.tool)) continue;
 console.log(`${x.type.slice(0,14)}|${x.agent}|${(x.ts||'').slice(5,10)}|${x.feat}/${x.doc}|${x.tool}|${x.tool==='Read'?`off=${x.offset} lim=${x.limit}`:x.tool==='Grep'?x.pattern:x.cmd.replace(/\n/g,' ⏎ ')}`.slice(0,330)); }
