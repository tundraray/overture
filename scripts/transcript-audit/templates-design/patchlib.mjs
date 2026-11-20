import fs from 'fs';
const R='D:/git/github/ai/claude-code-workflows/';
export function patch(file, pairs){ let s=fs.readFileSync(R+file,'utf8'); const crlf=s.includes('\r\n'); if(crlf) s=s.replace(/\r\n/g,'\n');
  for(const [a,b] of pairs){ const n=s.split(a).length-1; if(n!==1){ console.error('FAIL',file,n,a.slice(0,70)); process.exitCode=1; continue; } s=s.replace(a,()=>b); }
  if(crlf) s=s.replace(/\n/g,'\r\n'); fs.writeFileSync(R+file,s); console.log('ok',file); }
