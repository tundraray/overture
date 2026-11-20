import fs from 'fs'; import readline from 'readline';
const [,, file, out] = process.argv;
const rl = readline.createInterface({input: fs.createReadStream(file)});
const seen = new Set(); const uses = new Map(); const agentById=new Map();
const t = s => (s||'').replace(/\s+/g,' '); const ts = s => s ? s.slice(8,16).replace('T',' ') : '';
const spawns=[], direct=[], sends=[], prompts=[], errs=[]; let nA=0, aBytes=0; let first, last; const hbSample=[];
const usage={in:0,out:0,cr:0,cc:0,turns:0}; const seenMsg=new Set();
for await (const l of rl) {
  let o; try { o = JSON.parse(l);} catch { continue; }
  if (o.isSidechain) continue; if (o.timestamp){ first=first||o.timestamp; last=o.timestamp; }
  const m = o.message; if (!m) continue;
  if (o.type==='assistant' && m.usage && m.id && !seenMsg.has(m.id)) { seenMsg.add(m.id); usage.turns++; usage.in+=m.usage.input_tokens||0; usage.out+=m.usage.output_tokens||0; usage.cr+=m.usage.cache_read_input_tokens||0; usage.cc+=m.usage.cache_creation_input_tokens||0; }
  const content = typeof m.content==='string' ? [{type:'text', text:m.content}] : (m.content||[]);
  for (const c of content) {
    if (o.type==='user') {
      if (c.type==='text') { const hb=c.text.match(/<agent-message from="([^"]+)"/); if (hb){ const a=agentById.get(hb[1]); if(a){ a.hb.push({at:o.timestamp,bytes:c.text.length}); } if (hbSample.length<1 && c.text.length>6000 && c.text.length<9000) hbSample.push(c.text);} }
      else if (c.type==='tool_result') { const u=uses.get(c.tool_use_id)||{}; let s = typeof c.content==='string'?c.content:(c.content||[]).map(x=>x.text||'').join('');
        const aid=s.match(/agentId: (\w+)/); if (u.name==='Agent'){ if (/Async agent launched/.test(s)&&aid) agentById.set(aid[1],u.rec); else if(u.rec){u.rec.sync={at:o.timestamp,bytes:s.length}; if(c.is_error)u.rec.err=t(s).slice(0,150);} }
        if (c.is_error) errs.push(`${ts(o.timestamp)} ${u.name}: ${t(s).slice(0,220)}`);
        if (u.d) { u.d.res=s.length; u.d.dt=Math.round((new Date(o.timestamp)-new Date(u.time))/1000); u.d.err=!!c.is_error; }
      }
    } else if (o.type==='assistant') {
      if (c.type==='text') { nA++; aBytes+=c.text.length; }
      else if (c.type==='tool_use') { if (seen.has(c.id)) continue; seen.add(c.id); const i=c.input||{}; const u={name:c.name,time:o.timestamp}; uses.set(c.id,u);
        if (c.name==='Agent'){ u.rec={at:o.timestamp,type:(i.subagent_type||'?').replace('fullstack-overture:',''),desc:i.description,p:(i.prompt||'').length,hb:[]}; spawns.push(u.rec); prompts.push({type:u.rec.type,prompt:i.prompt||''}); }
        else if (c.name==='SendMessage'){ sends.push(`${ts(o.timestamp)} to=${i.to} ${(i.message||'').length}b ${t(i.message||JSON.stringify(i)).slice(0,130)}`); }
        else if (c.name==='AskUserQuestion'){}
        else { u.d={at:ts(o.timestamp),name:c.name,arg:t(i.command||i.file_path||i.pattern||i.skill||JSON.stringify(i)).slice(0,150)}; direct.push(u.d); }
      }
    }
  }
}
const L=[]; L.push(`SESSION ${first} -> ${last}; assistantTexts=${nA} bytes=${aBytes}; usage=${JSON.stringify(usage)}`);
L.push('## SPAWNS'); for (const s of spawns){ const end = s.hb.length? s.hb[s.hb.length-1].at : s.sync?.at; const firstEnd = s.hb.length? s.hb[0].at : s.sync?.at; const ran= firstEnd? Math.round((new Date(firstEnd)-new Date(s.at))/1000):'?'; const bytes = s.hb.reduce((a,b)=>a+b.bytes,0)+(s.sync?.bytes||0);
  L.push(`${ts(s.at)} ${s.type} | ${s.desc} | p=${s.p} ran=${ran}s hb=${s.hb.length}x${bytes}b${s.err?' ERR '+s.err:''}`); }
L.push('## DIRECT'); for (const d of direct) L.push(`${d.at} ${d.name} ${d.res}b dt=${d.dt}s${d.err?' ERR':''} ${d.arg}`);
L.push('## SENDS'); L.push(...sends); L.push('## ERRORS'); L.push(...errs);
// repeated lines across prompts
const cnt=new Map(); for (const p of prompts){ const set=new Set(p.prompt.split(/\n|(?<=\.)\s+/).map(x=>x.trim()).filter(x=>x.length>50)); for (const s of set) cnt.set(s,(cnt.get(s)||0)+1); }
L.push('## REPEATED PROMPT SENTENCES'); [...cnt].filter(([s,n])=>n>=8).sort((a,b)=>b[1]*b[0].length-a[1]*a[0].length).slice(0,25).forEach(([s,n])=>L.push(`${n}x ${s.length}b: ${s.slice(0,200)}`));
const bt={}; for (const p of prompts){ const b=bt[p.type]=bt[p.type]||{n:0,b:0,max:0}; b.n++; b.b+=p.prompt.length; b.max=Math.max(b.max,p.prompt.length);} L.push('## PROMPT BYTES '+JSON.stringify(bt));
fs.writeFileSync(out, L.join('\n')); if (hbSample[0]) fs.writeFileSync(out+'.hb.txt', hbSample[0]);
fs.writeFileSync(out+'.prompts.json', JSON.stringify(prompts));
console.log(L[0]);
