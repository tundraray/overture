import fs from 'fs';
const R='D:/git/github/ai/claude-code-workflows/';
function patch(file, pairs){ let s=fs.readFileSync(R+file,'utf8'); const crlf=s.includes('\r\n'); if(crlf) s=s.replace(/\r\n/g,'\n');
  for(const [a,b] of pairs){ const n=s.split(a).length-1; if(n!==1){ console.error('FAIL',file,n,a.slice(0,70)); process.exitCode=1; continue; } s=s.replace(a,()=>b); }
  if(crlf) s=s.replace(/\n/g,'\r\n'); fs.writeFileSync(R+file,s); console.log('ok',file); }
patch('skills/documentation-criteria/references/authoring-rules.md',[
[`**Order.** A short header`,
`**Purpose first.** Before saying what something is, say why it is there: the problem it answers and what it buys. The Snapshot does this for the document, and each Key Decision for itself. A reader who cannot tell why a thing exists cannot judge whether it is right.

**Order.** A short header`],
[`the appendix (**Appendix: Fact Disposition** in a Design Doc, **Appendix: Traceability** in a work plan)`,`the appendix (**Appendix: Traceability** in a work plan)`],
[`a \`KD-n\` heading with a paragraph of why and the options not taken, in a UXRD a table`,`a \`KD-n\` heading with a paragraph of why and the options a reviewer would raise, in a UXRD a table`],
[`**Terms.** A word the cold reader`,
`**The picture carries the explanation.** A section that describes a structure, a flow, or a state change leads with its diagram, and the text under it says only what the picture cannot: reasons, limits, what is persisted. A reader grasps structure and flow from a picture faster than from prose, and long prose around a picture only repeats it.

**Terms.** A word the cold reader`],
[`**Write what this document decides, and only what is decided.**`,
`**Fix what others depend on; leave the rest to the implementer.** A document fixes what someone other than the implementer relies on — behaviour a user can observe, what crosses a boundary between parts or systems (API shapes, events, persisted data, shared enums, limits), and decisions that are costly to reverse — and gives the reason for each. What lives inside one part and can change during implementation without anyone outside noticing — internal names, file layout, helper structure, local constants, the order of internal steps, the exact wording of internal messages — is left to the implementer and not written down. Every pinned detail is a future revision, and a revision costs a review round.

**Write what this document decides, and only what is decided.**`],
[`Design Doc 45 000 per part (appendix included), ADR 10 000`,`Design Doc 45 000 per part, ADR 10 000`],
[`2. **Update or revision.** Before the first edit, the author copies the current version out of the repository with the shell — \`cp docs/features/{feature}/prd.md <scratchpad>/prd.base.md\`, where \`<scratchpad>\` is the session's scratchpad directory. The document guard allows a copy whose destination is outside the repository. After its edits the author spawns the reviewer with the same coordinates, \`review_scope: changes\`, \`diff_base\` set to the copy, and the issues the revision was asked to fix, if any.`,
`2. **Update or revision.** A revision gets a draft check when it alters a requirement, a decision, or a contract. A wording or detail fix gets none, and the author returns \`"verdict": "skipped"\`. For a checked revision, before the first edit the author copies the current version out of the repository with the shell — \`cp docs/features/{feature}/prd.md <scratchpad>/prd.base.md\`, where \`<scratchpad>\` is the session's scratchpad directory. The document guard allows a copy whose destination is outside the repository. After its edits the author spawns the reviewer with the same coordinates, \`review_scope: changes\`, \`diff_base\` set to the copy, and the issues the revision was asked to fix, if any.`],
[`- Rationale (why that selection was made)
- Option comparison (at least two real options) and trade-offs
- Architecture impact`,
`- Each real option (at least two), and why it won or lost
- Consequences: what is accepted by choosing this`],
[`- **Existing codebase analysis** (required), disposed of in Appendix: Fact Disposition
- Key decisions, each with the options not taken — a breaking change`,
`- **Existing codebase analysis** (required) as the ground the design stands on: what it changes or removes shows in Key Decisions, what it leaves alone in Out of scope
- Key decisions, each with its reason and the options a reviewer would raise — a breaking change`],
[`- Interface and contract definitions
- Data flow and component design`,`- Contract definitions: what crosses the part's boundary
- Architecture and runtime flows, as diagrams`],
]);
