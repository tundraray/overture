import fs from 'fs';
for(const f of process.argv.slice(2)){ const t=fs.readFileSync(f,'utf8'); let mer=false,b=0,m=0,n=0;
 for(const l of t.split(/\r?\n/)){ if(/^```mermaid/.test(l)){mer=true;n++;continue;} if(/^```/.test(l)){mer=false;continue;} if(!mer)continue; m+=l.length+1;
  if(/^\s*(classDef|class |linkStyle|config:|theme|look:|primary|lineColor|flowchart:|curve:|themeCSS|@keyframes|---|sequence:|mirrorActors|actor|signal|note)/.test(l)) b+=l.length+1; }
 console.log(f.split('/').slice(-2).join('/'),'diagrams',n,'mermaid chars',m,(100*m/t.length).toFixed(0)+'%','styling/config/animation',b,(100*b/t.length).toFixed(0)+'% of doc');}
