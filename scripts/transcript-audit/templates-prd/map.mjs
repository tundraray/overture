import fs from 'fs';
const r = JSON.parse(fs.readFileSync(new URL('./reads.json', import.meta.url), 'utf8'));
const docs = {};
function load(feat, doc) {
  const k = feat + '/' + doc; if (docs[k] !== undefined) return docs[k];
  const p = `D:/git/github/ai/agent-os/docs/features/${feat}/${doc}.md`; if (!fs.existsSync(p)) return docs[k] = null;
  const lines = fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n').split('\n'); const sec = []; let cur = '(header)'; let fence = false;
  const norm = h => { h = h.replace(/[`*]/g, ''); if (/^Screen \d|^Экран/.test(h)) return 'Screens'; return h; };
  let h2 = '(header)';
  lines.forEach((l, i) => {
    if (/^```/.test(l)) fence = !fence; const m = !fence && l.match(/^(#{2,3}) (.*)/);
    if (m) {
      if (m[1].length === 2) { h2 = norm(m[2]); cur = h2; } else {
        const h3 = norm(m[2]);
        if (h2 === 'Functional Requirements') cur = 'FR/' + (/Must/.test(h3) ? 'Must' : /Should/.test(h3) ? 'Should' : /Could/.test(h3) ? 'Could' : /Won/.test(h3) ? "Won't" : h3);
        else if (['Constraints and Risks', 'Users and Use Cases', 'User Flows', 'Snapshot', 'Design System', 'Delivery Parts'].includes(h2)) cur = h2 + '/' + h3; else cur = h2;
      }
    }
    sec[i] = cur;
  });
  return docs[k] = { lines, sec };
}
const group = t => /technical-designer/.test(t) ? 'designer' : /work-planner|task-decomposer/.test(t) ? 'planner' : /acceptance-test/.test(t) ? 'testgen' : /task-executor|quality-fixer/.test(t) ? 'executor' : /code-verifier|code-reviewer|security-reviewer|test-auditor|integration-test/.test(t) ? 'verifier' : /document-reviewer/.test(t) ? 'docreview' : /prd-creator|ux-designer/.test(t) ? 'author' : 'other';
const tally = {}; const whole = {}; const unk = []; const agentsBySec = {};
function hit(x, lineIdxs) { if (process.env.TRACE && x.doc===process.env.TDOC) { const d0=load(x.feat,x.doc); const ss=new Set(lineIdxs.filter(i=>i>=0&&d0&&i<d0.lines.length).map(i=>d0.sec[i])); if([...ss].some(s=>s.includes(process.env.TRACE)) && group(x.type)!=="docreview") console.log("TRACE",x.type,x.agent,x.tool,(x.pattern||x.cmd||`off=${x.offset} lim=${x.limit}`).slice(0,170)); }
  const d = load(x.feat, x.doc); if (!d) return; const g = group(x.type); const secs = new Set(); for (const i of lineIdxs) if (i >= 0 && i < d.lines.length) secs.add(d.sec[i]);
  for (const s of secs) { const k = `${x.doc}|${s}`; tally[k] ??= {}; tally[k][g] = (tally[k][g] || 0) + 1; agentsBySec[k + '|' + g] ??= new Set(); agentsBySec[k + '|' + g].add(x.agent); }
}
function range(a, b) { const o = []; for (let i = a; i <= b; i++) o.push(i - 1); return o; }
function bre2js(p, ext) {
  if (ext) return p;
  let out = '';
  for (let i = 0; i < p.length; i++) {
    const c = p[i];
    if (c === '\\' && i + 1 < p.length) { const n = p[++i]; if ('|()+?{}'.includes(n)) out += n; else out += '\\' + n; }
    else if ('|()+?{}'.includes(c)) out += '\\' + c; else out += c;
  }
  return out;
}
function note(x, label) { const k = `${x.doc}|${label}`; tally[k] ??= {}; const g = group(x.type); tally[k][g] = (tally[k][g] || 0) + 1; agentsBySec[k + '|' + g] ??= new Set(); agentsBySec[k + '|' + g].add(x.agent); }
function grepHit(x, pat, ext, icase, limit) {
  const d = load(x.feat, x.doc); if (!d) return; let re; try { re = new RegExp(bre2js(pat, ext), icase ? 'iu' : 'u') } catch (e) { unk.push('badre ' + pat); return; }
  const idx = []; d.lines.forEach((l, i) => { if (re.test(l)) idx.push(i) });
  const body = idx.filter(i => !/^#/.test(d.lines[i]));
  if (idx.length && !body.length) { note(x, '(outline grep)'); return; }
  if (!idx.length) { note(x, '(grep, no match on disk now)'); return; }
  hit(x, (limit ? body.slice(0, limit) : body));
}
for (const x of r) {
  const g = group(x.type); if (g === 'author') continue;
  if (x.tool === 'Read') {
    if (!x.offset && !x.limit) { const k = `${x.doc}|WHOLE`; whole[k] ??= {}; whole[k][g] = (whole[k][g] || 0) + 1; }
    else { const a = x.offset || 1; const d = load(x.feat, x.doc); const b = x.limit ? a + x.limit - 1 : (d ? d.lines.length : a + 2000); hit(x, range(a, b)); }
  }
  else if (x.tool === 'Grep') { grepHit(x, x.pattern, true, false); }
  else if (x.tool === 'Bash' || x.tool === 'PowerShell') {
    const c = x.cmd; const segs = c.split(/;|&&|⏎|\n/);
    for (const s of segs) {
      const re = new RegExp(`${x.feat}/${x.doc}\\.md`); if (!re.test(s)) continue;
      let m;
      if ((m = s.match(/sed -n ['"]?([0-9,p; ]+)['"]?/))) { for (const rg of m[1].split(';')) { const mm = rg.match(/(\d+)(?:,(\d+))?p/); if (mm) hit(x, range(+mm[1], +(mm[2] || mm[1]))); } }
      else if ((m = s.match(/grep\s+((?:-[a-zA-Z]+\s+)*)(?:"((?:[^"\\]|\\.)*)"|'([^']*)')/))) {
        const flags = m[1] || ''; const pat = (m[2] ?? m[3]);
        if (/c/.test(flags) && !/n/.test(flags)) { note(x, '(count only)'); continue; }
        const hm = s.match(/head -n? ?(\d+)/); grepHit(x, pat, /E|P/.test(flags), /i/.test(flags), hm ? +hm[1] : 0);
      }
      else if ((m = s.match(/head -n? ?(\d+)/))) { hit(x, range(1, +m[1])); }
      else if (/\bcat\b/.test(s) && !/<</.test(s)) { const k = `${x.doc}|WHOLE`; whole[k] ??= {}; whole[k][g] = (whole[k][g] || 0) + 1; }
      else if (/\bwc\b|git (log|diff|show|status|add|commit)|\bcp\b|\bls\b|check-mermaid|diff /.test(s)) { }
      else unk.push(`${x.type}|${x.feat}/${x.doc}|${s.slice(0, 200)}`);
    }
  }
}
const order = Object.keys(tally).sort();
console.log('doc|section -> accesses by group (distinct agents)');
for (const k of order) { console.log(k.padEnd(52), Object.entries(tally[k]).map(([g, n]) => `${g}:${n}(${agentsBySec[k + '|' + g]?.size ?? '-'})`).join(' ')); }
console.log('WHOLE', JSON.stringify(whole));
console.log('unknown', unk.length); if (process.env.UNK) console.log(unk.join('\n'));
