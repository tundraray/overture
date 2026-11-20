import fs from 'fs'; import readline from 'readline';
const [,, file, out] = process.argv;
const rl = readline.createInterface({input: fs.createReadStream(file)});
const seen = new Set(); const uses = new Map(); const lines=[];
const stats = {tools:{}, agents:{}, errors:0, compactions:0, resultBytes:{}, promptBytes:0, skills:{}};
const t = s => (s||'').replace(/\s+/g,' ');
const ts = s => s ? s.slice(5,19).replace('T',' ') : '';
for await (const l of rl) {
  let o; try { o = JSON.parse(l);} catch { continue; }
  if (o.isSidechain) continue;
  const time = ts(o.timestamp);
  if (o.type==='summary') continue;
  if (o.type==='system') { if (o.subtype==='compact_boundary'||/compact/i.test(o.subtype||'')) { stats.compactions++; lines.push(`${time} === COMPACT ${o.subtype} ${JSON.stringify(o.compactMetadata||{})}`);} continue; }
  const m = o.message; if (!m) continue;
  const content = typeof m.content==='string' ? [{type:'text', text:m.content}] : (m.content||[]);
  for (const c of content) {
    if (o.type==='user') {
      if (c.type==='text') { if (o.isCompactSummary) { lines.push(`${time} USER[compact-summary ${c.text.length}b]`); continue;} 
        const isMeta = o.isMeta ? 'META ' : ''; lines.push(`${time} ${isMeta}USER(${c.text.length}): ${t(c.text).slice(0, o.isMeta?150:700)}`); }
      else if (c.type==='tool_result') {
        const u = uses.get(c.tool_use_id)||{}; let s = typeof c.content==='string'?c.content:(c.content||[]).map(x=>x.text||'').join('');
        const err = c.is_error?' ERROR':''; if (c.is_error) stats.errors++;
        stats.resultBytes[u.name]=(stats.resultBytes[u.name]||0)+s.length;
        let dur=''; if (u.time) { dur = ' dt='+Math.round((new Date(o.timestamp)-new Date(u.time))/1000)+'s'; }
        const keep = (c.is_error|| u.name==='Agent'||u.name==='Task'||u.name==='AskUserQuestion') ? 500 : 120;
        lines.push(`${time}   <- ${u.name||'?'} res=${s.length}b${err}${dur}: ${t(s).slice(0,keep)}`);
      }
    } else if (o.type==='assistant') {
      if (c.type==='text') { lines.push(`${time} ASSIST(${c.text.length}): ${t(c.text).slice(0,400)}`); }
      else if (c.type==='tool_use') {
        if (seen.has(c.id)) continue; seen.add(c.id);
        uses.set(c.id,{name:c.name,time:o.timestamp});
        stats.tools[c.name]=(stats.tools[c.name]||0)+1;
        const i=c.input||{}; let d='';
        if (c.name==='Agent'||c.name==='Task') { stats.agents[i.subagent_type]=(stats.agents[i.subagent_type]||0)+1; stats.promptBytes+=(i.prompt||'').length; d=`[${i.subagent_type}] bg=${i.run_in_background} "${i.description}" prompt=${(i.prompt||'').length}b: ${t(i.prompt).slice(0,300)}`; }
        else if (c.name==='Skill') { stats.skills[i.skill]=(stats.skills[i.skill]||0)+1; d=i.skill+' '+(i.args||'').slice(0,100); }
        else if (c.name==='Bash'||c.name==='PowerShell') d=t(i.command).slice(0,250);
        else if (c.name==='AskUserQuestion') d=t(JSON.stringify(i)).slice(0,600);
        else if (c.name==='TodoWrite') d=(i.todos||[]).length+' todos';
        else d=t(JSON.stringify(i)).slice(0,200);
        lines.push(`${time} TOOL ${c.name}: ${d}`);
      }
    }
  }
}
lines.push('STATS '+JSON.stringify(stats,null,1));
fs.writeFileSync(out, lines.join('\n'));
console.log(lines.length, JSON.stringify(stats));
