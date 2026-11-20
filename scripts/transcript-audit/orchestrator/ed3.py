import io
def load(p):
    s=io.open(p,encoding='utf-8',newline='').read(); nl='\r\n' if '\r\n' in s else '\n'; return s.replace('\r\n','\n'),nl
def save(p,s,nl): io.open(p,'w',encoding='utf-8',newline='').write(s.replace('\n',nl)); print(p,s.count('\n'))
def cut(s,start,end,repl=''):
    a=s.index(start); b=s.index(end,a+len(start)); return s[:a]+repl+s[b:]
def rep(s,a,b,n=1):
    assert s.count(a)==n,(s.count(a),a[:80]); return s.replace(a,b)
STOP='''## Explicit Stop Points

Stop and ask, with `AskUserQuestion`, where a decision is the user's and still open: the requirements and scale after requirement-analyzer; the PRD with its Delivery Parts; the UXRD with its design-system files; anything an author returned as open (`openQuestions`, `draftCheck.open`); an escalation or an auto-stop trigger. Everywhere else — a Design Doc after `design-sync`, an ADR, a work plan, a finished part — commit the document, report it in one or two lines, and continue: a stop with nothing to decide costs the user's absence in hours and gets a bare "continue" when they return.

**At a stop on a document** the orchestrator shows the document path and the author's open items in plain words, and asks: approve, request changes (one owner pass in `mode: update` with the user's instruction verbatim, then the same stop), or independent review — a cold `document-reviewer` run, after which "Revision Loop" applies. No option is preselected; independent review is marked recommended only when `draftCheck.verdict` is `not_run`.

A plan started on its own with `/build` or `/front-build` takes one approval before anything runs: nothing in that session shows the user has seen the plan.

'''
# orchestration
p='skills/workflow-orchestration/SKILL.md'; s,nl=load(p)
s=rep(s,'| Stop point reached | Wait for user approval |','| Stop point reached ("Explicit Stop Points") | Wait for the user\'s decision |')
s=cut(s,'## Explicit Stop Points\n','## Scale Determination and Document Requirements\n',STOP)
s=rep(s,"; during execution `update` mode is requested only to add a file to a phase's Target Files when that resolves an `out_of_scope_file` escalation",'')
s=rep(s,'| Product | `workflow-product` | What to build and why | UXRD approval |','| Product | `workflow-product` | What to build and why | The UXRD (the PRD when there is no UI surface) |')
s=rep(s,'| Technical | `workflow-technical` | How to build it | Design Doc approval |','| Technical | `workflow-technical` | How to build it | The last part\'s Design Doc and test skeletons |')
s=rep(s,'and batch approval — the authority boundary — gates the plan.','and the plan is the boundary past which the work runs autonomously.')
s=rep(s,'Everything after batch approval — entry conditions','Everything after the plan — entry conditions')
s=rep(s,'Start/stop autonomous execution after approval, escalation decisions','Start/stop autonomous execution, escalation decisions')
a=s.index('## Required Dialogue Points with Humans\n'); s=s[:a].rstrip('\n')+'\n'
save(p,s,nl)
# technical
p='skills/workflow-technical/SKILL.md'; s,nl=load(p)
s=rep(s,'consuming `focusAreas` into its **Appendix: Fact Disposition** and `conformance` into its code-system reading','consuming `focusAreas` and `conformance`')
s=rep(s,' Code-system files it creates or changes are approved with the Design Doc\n',' Code-system files it creates or changes are committed with the Design Doc\n')
s=rep(s,"   **[Stop: Design Doc approval — part `{part}`]**\n","   Then commit the Design Doc, report it, and continue — or stop when the author or `design-sync` left something open (`workflow-orchestration`, \"Explicit Stop Points\")\n")
s=rep(s,"   **[Stop: ADR approval]** — only when an ADR was written\n","")
s=rep(s," A reviewer then cannot distinguish a deliberate omission from an oversight. The design's Appendix: Fact Disposition makes each fact's treatment explicit.","")
s=cut(s,'## Stop Points\n','## Revision Loop\n')
save(p,s,nl)
# product
p='skills/workflow-product/SKILL.md'; s,nl=load(p)
a=s.index('## Stop Points\n'); b=s.index('When `requirement-analyzer` reports a `decidingAxis`')
s=s[:a]+'## Stop Points\n\nEvery stop marked in the flow above is a decision that is the user\'s — `workflow-orchestration`, "Explicit Stop Points", holds the rule and how a document stop is presented.\n\n'+s[b:]
save(p,s,nl)
# execution
p='skills/workflow-execution/SKILL.md'; s,nl=load(p)
s=rep(s,'planning the work, obtaining batch approval, and then running the loop','planning the work, and then running the loop')
s=rep(s,'plan the first part, take its batch approval, build it through','plan the first part, build it through')
s=rep(s,"Commit strategy is asked once, before the first part's batch approval, and holds for the feature. Batch approval is taken per part: it approves one plan, and one plan covers one part.\n\n",'')
s=cut(s,'3. **Commit strategy selection**','4. The phase cycle','3. **Report and continue** — commit the plan and report its path in one or two lines; stop only when the planner returned something open (`workflow-orchestration`, "Explicit Stop Points")\n')
s=rep(s,'Its completion report names the next part in the list; the last part','Its completion report names the next part in the list, whose planning then starts; the last part')
s=cut(s,'### Batch approval is the authority boundary\n','Small scale, and gamedev Prototype','### The plan is the authority boundary\n\nEverything after the plan runs autonomously until completion or escalation, so anything the planner left open is put to the user before the loop starts — after it, no one is asked again.\n\n')
s=rep(s,', batch approval is taken, and the loop runs.',', and the loop runs.')
s=rep(s,'Autonomous mode starts after batch approval.','Autonomous mode starts once the plan is written with nothing open — or, for a plan started on its own with `/build` or `/front-build`, once the user approves it.')
s=rep(s,'batch approval delegates authority to the subagents','the plan delegates authority to the subagents')
s=rep(s,'**Ask before batch approval**, so the user approves the plan and its commit granularity together.','`per-phase` applies without asking and holds for the feature. Ask only when the user\'s request or an earlier choice does not settle it; `/build` and `/front-build` ask it together with their plan approval.')
s=cut(s,'**Pass/fail criteria**:\n','`drift` means the code moved past')
s=rep(s,'**Fix cycle** (any verifier failed — maximum 2 cycles;','**Fix cycle** (a verifier returned a finding of the types in step 1 — maximum 2 cycles; a `security-reviewer` `blocked` goes to the user;')
s=cut(s,'→ commit per strategy → re-run **only the failed verifiers**','## The Feature Run\n','→ commit per strategy. Then re-run a verifier only on the fix locations, and only where the fix was not mechanical: a rename or a moved block needs no second opinion, a changed behaviour does\n\nAfter cycle 2, escalate every remaining finding.\n\n')
s=rep(s,"An `out_of_scope_file` escalation resolved by widening the phase needs no review round: `{planner}` in `update` mode adds the file to the phase's Target Files, and the phase is retried.","An `out_of_scope_file` escalation means the phase needs a change that crosses a part boundary or a contract — the executor makes and reports a smaller edit itself — so it goes to the user like any other escalation.")
save(p,s,nl)
