import {edit, must, ceremony} from './edit1.mjs';
edit('code-explorer', t=>{
  t=must(t,'skills: code-navigation, coding-principles','skills: code-navigation');
  t=ceremony(t);
  t=must(t,/- \*\*fanout\*\* \(optional, default `true`\)[^\n]*\n/,'');
  t=must(t,'Run all seven unless `categories` restricts them. They are disjoint, which makes them natural fan-out directions.','Run all seven unless `categories` restricts them.');
  t=must(t,/## Parallel Fan-Out\n[\s\S]*?(?=## Output Format)/,'');
  t=must(t,/  "fanout": \[\n[^\n]*\n  \],\n/,'');
  t=must(t,/## Completion Criteria\n[\s\S]*?(?=## Self-Validation)/,'');
  t=must(t,'Completion Criteria confirm the steps ran. These confirm the output is *correct*. Run each item before producing the final JSON.','Run each item before producing the final JSON.');
  t=must(t,/- \[ \] When fanned out: `locations`[^\n]*\n- \[ \] When fanned out: every child[^\n]*\n- \[ \] `answer` was written from the merged set[^\n]*\n/,'');
  t=must(t,/- Spawning any agent other than `code-explorer`\n- Fanning out when[^\n]*\n/,'- Spawning another agent — the caller already splits a wide question into several queries\n');
  return t;
});
