import fs from 'fs';
const R='D:/git/github/ai/claude-code-workflows/agents/';
function edit(name, fn){ const p=R+name+'.md'; const raw=fs.readFileSync(p,'utf8'); const crlf=raw.includes('\r\n'); let t=raw.replace(/\r\n/g,'\n'); const before=t.split('\n').length; t=fn(t); if(crlf) t=t.replace(/\n/g,'\r\n'); fs.writeFileSync(p,t); console.log(name, before,'->',t.split('\n').length); }
function must(t, a, b){ if(typeof a==='string'? !t.includes(a) : !a.test(t)) throw new Error('no match: '+String(a).slice(0,80)); return t.replace(a,b); }
// generic: TodoWrite + Skill File Loading stanzas
export function ceremony(t){
  t=t.replace(/\*\*TodoWrite Registration\*\*:[^\n]*\n\n?/,'');
  t=t.replace(/\*\*Skill File Loading\*\*:[^\n]*\n(?:- [^\n]*\n)+\n?/,'');
  // drop a heading left with no body
  t=t.replace(/## (Mandatory Rules|Initial Required Tasks|Required Initial Tasks|Initial Mandatory Tasks)\n\n(?=## )/g,'');
  return t;
}
export {edit, must};
