import fs from 'fs'; import readline from 'readline';
const [,, file, n] = process.argv; let k=0;
const rl = readline.createInterface({input: fs.createReadStream(file)});
for await (const l of rl) { if(!l.includes('Subagent hand-back')) continue; let o; try{o=JSON.parse(l)}catch{continue}; if(o.isSidechain||o.type!=='user')continue; const c=o.message.content; const x=typeof c==='string'?c:c.map(y=>y.text||'').join(''); if(!/"phase"|taskName|filesModified/.test(x)) continue; if(++k==+n){ console.log(x.length); console.log(x.slice(0,1500)); console.log('.....'); console.log(x.slice(1500).replace(/\s+/g,' ').slice(0,3800)); break; } }
