import fs from 'fs'; import readline from 'readline';
const [,, file, out] = process.argv;
const rl = readline.createInterface({input: fs.createReadStream(file)});
const seen = new Set(); const uses = new Map(); const lines=[]; const users=[]; const agentById=new Map();
const st = {handbackBytes:0, handbacks:0, assistTextBytes:0, agentRuns:[]};
const t = s => (s||'').replace(/\s+/g,' ');
const ts = s => s ? s.slice(8,19).replace('T',' ') : '';
for await (const l of rl) {
  let o; try { o = JSON.parse(l);} catch { continue; }
  if (o.isSidechain) continue;
  const time = ts(o.timestamp);
  if (o.type==='system') { if (/compact/i.test(o.subtype||'')) lines.push(`${time} === COMPACT ${JSON.stringify(o.compactMetadata||{})}`); continue; }
  const m = o.message; if (!m) continue;
  const content = typeof m.content==='string' ? [{type:'text', text:m.content}] : (m.content||[]);
  for (const c of content) {
    if (o.type==='user') {
      if (c.type==='text') {
        const x=c.text;
        if (o.isCompactSummary) { lines.push(`${time} [compact-summary ${x.length}b]`); continue;}
        if (/^<task-notification>/.test(x) || /^<system-reminder>/.test(x.trim()) || /local-command-caveat/.test(x)) continue;
        const hb = x.match(/<agent-message from="([^"]+)"/);
        if (hb) { const a=agentById.get(hb[1]); st.handbacks++; st.handbackBytes+=x.length; let dur='?'; if (a){dur=Math.round((new Date(o.timestamp)-new Date(a.time))/1000); st.agentRuns.push({type:a.type,dur,bytes:x.length,desc:a.desc});}
          const body = t(x.split('[Subagent hand-back]')[1]||x).replace(/^.*?final report of a subagent[^.]*\./,'');
          lines.push(`${time}   << HANDBACK ${a?a.type+' "'+a.desc+'"':hb[1]} ${x.length}b ran=${dur}s: ${t(body).slice(-0+0,0)}${t(x).slice(-260)}`); continue; }
        if (o.isMeta) { lines.push(`${time} META(${x.length}): ${t(x).slice(0,100)}`); continue; }
        lines.push(`${time} USER(${x.length}): ${t(x).slice(0,500)}`); users.push(`${time} USER(${x.length}): ${t(x).slice(0,1200)}`);
      }
      else if (c.type==='tool_result') {
        const u = uses.get(c.tool_use_id)||{}; let s = typeof c.content==='string'?c.content:(c.content||[]).map(x=>x.text||'').join('');
        const aid = s.match(/agentId: (\w+)/);
        if ((u.name==='Agent') && /Async agent launched/.test(s)) { if (aid) agentById.set(aid[1], u); continue; }
        if (u.name==='Agent') { const dur=Math.round((new Date(o.timestamp)-new Date(u.time))/1000); st.agentRuns.push({type:u.type,dur,bytes:s.length,desc:u.desc, sync:true}); }
        const err = c.is_error?' ERROR':'';
        const dur = u.time ? Math.round((new Date(o.timestamp)-new Date(u.time))/1000) : '';
        const keep = c.is_error ? 300 : (u.name==='AskUserQuestion'? 500 : (u.name==='Agent'||u.name==='SendMessage' ? 200 : 60));
        if (!c.is_error && ['Read','Edit','Write','TodoWrite','Grep','Glob','ToolSearch'].includes(u.name)) { lines.push(`${time}   <- ${u.name} ${s.length}b`); continue; }
        lines.push(`${time}   <- ${u.name||'?'} ${s.length}b${err} dt=${dur}s: ${t(s).slice(0,keep)}`);
        if (u.name==='AskUserQuestion') users.push(`${time} ASKANSWER: ${t(s).slice(0,900)}`);
      }
    } else if (o.type==='assistant') {
      if (c.type==='text') { st.assistTextBytes+=c.text.length; lines.push(`${time} A(${c.text.length}): ${t(c.text).slice(0,160)}`); users.push(`${time}    A(${c.text.length}): ${t(c.text).slice(0,200)}`); }
      else if (c.type==='tool_use') {
        if (seen.has(c.id)) continue; seen.add(c.id);
        const i=c.input||{}; let d='';
        uses.set(c.id,{name:c.name,time:o.timestamp,type:(i.subagent_type||'').replace('fullstack-overture:',''),desc:i.description});
        if (c.name==='Agent') d=`[${(i.subagent_type||'').replace('fullstack-overture:','')}] "${i.description}" p=${(i.prompt||'').length}b: ${t(i.prompt).slice(0,170)}`;
        else if (c.name==='Skill') d=i.skill+' '+(i.args||'').slice(0,100);
        else if (c.name==='Bash'||c.name==='PowerShell') d=t(i.command).slice(0,200);
        else if (c.name==='AskUserQuestion') { d=t(JSON.stringify((i.questions||[]).map(q=>q.question+' :: '+(q.options||[]).map(o=>o.label).join(' | ')))).slice(0,500); users.push(`${time} ASK: ${d}`);}
        else if (c.name==='TodoWrite') d=(i.todos||[]).length+' todos';
        else if (c.name==='SendMessage') d=`to=${i.to} ${(i.message||i.content||'').length}b: ${t(i.message||i.content||JSON.stringify(i)).slice(0,200)}`;
        else d=t(JSON.stringify(i)).slice(0,170);
        lines.push(`${time} T ${c.name}: ${d}`);
      }
    }
  }
}
fs.writeFileSync(out, lines.join('\n')); fs.writeFileSync(out.replace('.txt','.users.txt'), users.join('\n'));
const by={}; for (const r of st.agentRuns){ const b=by[r.type]=by[r.type]||{n:0,sec:0,bytes:0}; b.n++; b.sec+=(+r.dur||0); b.bytes+=r.bytes; }
fs.writeFileSync(out.replace('.txt','.runs.json'), JSON.stringify(st.agentRuns));
console.log(lines.length, 'handbacks',st.handbacks,st.handbackBytes,'assistText',st.assistTextBytes); console.table(by);
