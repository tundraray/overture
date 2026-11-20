import io
def load(p):
    s=io.open(p,encoding='utf-8',newline='').read(); nl='\r\n' if '\r\n' in s else '\n'; return s.replace('\r\n','\n'),nl
def save(p,s,nl): io.open(p,'w',encoding='utf-8',newline='').write(s.replace('\n',nl)); print(p,s.count('\n'))
def cut(s,start,end,repl=''):
    a=s.index(start); b=s.index(end,a+len(start)); return s[:a]+repl+s[b:]
def rep(s,a,b,n=1):
    assert s.count(a)==n,(s.count(a),a[:80]); return s.replace(a,b)
def ed(p,fn):
    s,nl=load(p); s=fn(s); save(p,s,nl)
RULE='Stop where `workflow-orchestration`, "Explicit Stop Points", says a decision is still the user\'s; otherwise report and continue'
MARK='**Stop at every `[Stop: ...]` marker** → Wait for user approval before proceeding'

STOP='''## Explicit Stop Points

Autonomous execution MUST stop and wait for user input at these points.
**Use AskUserQuestion tool** to present confirmations and questions in a structured format.

| Phase | Stop Point | Once per | User Action Required |
|-------|------------|----------|---------------------|
| Product | After requirement-analyzer completes | feature | Confirm requirements and scale / answer questions |
| Product | After prd-creator returns the PRD (with its draft check) | feature | Approve PRD, including the Delivery Parts split — every scale |
| Product | After ux-designer (gamedev: game-ui-designer) returns the UXRD (with its draft check; frontend/UI work) | feature | Approve UXRD, with the design-system files it created or changed |
| Technical | After design-sync completes consistency verification | part | Approve that part's Design Doc, with the code-system files it created or changed |
| Technical | After technical-designer(-frontend) returns the ADR (with its draft check; only when an ADR was written) | ADR | Approve ADR |
| Execution | After the planner returns the work plan (with its draft check; small scale and gamedev Prototype: the simplified plan, which is not reviewed) | part | Batch approval for that part's implementation |

**At a document stop** the orchestrator shows the document path and the author's `draftCheck.open` items in plain words, and asks: approve, request changes (one owner pass in `mode: update` with the user's instruction verbatim, then the same stop), or independent review — a cold `document-reviewer` run, after which "Revision Loop" applies. No option is preselected; independent review is marked recommended only when `draftCheck.verdict` is `not_run`. `design-sync` before the Design Doc stop stays automatic.

**After batch approval**: Autonomous execution proceeds without stops until the current part's completion report or an escalation. The next part begins with its own plan and batch approval. `/build` and `/front-build` started on their own take the batch approval as their first question; a plan already approved in this session is not asked again.

'''
def orch(s):
    s=rep(s,'| Stop point reached ("Explicit Stop Points") | Wait for the user\'s decision |','| Stop point reached | Wait for user approval |')
    s=cut(s,'## Explicit Stop Points\n','## Scale Determination and Document Requirements\n',STOP)
    s=rep(s,'| The UXRD (the PRD when there is no UI surface) |','| UXRD approval |')
    s=rep(s,"| The last part's Design Doc and test skeletons |",'| Design Doc approval |')
    s=rep(s,'and the plan is the boundary past which the work runs autonomously.','and batch approval — the authority boundary — gates the plan.')
    s=rep(s,'Everything after the plan — entry conditions','Everything after batch approval — entry conditions')
    s=rep(s,'Start/stop autonomous execution, escalation decisions','Start/stop autonomous execution after approval, escalation decisions')
    s=s.rstrip('\n')+'''

## Required Dialogue Points with Humans

### Basic Principles
- **Stopping is mandatory**: Always wait for human response at the following timings
- **Confirmation → Agreement cycle**: After document generation, proceed to next step after agreement or fix instructions in update mode
- **Specific questions**: Make decisions easy with options (A/B/C) or comparison tables
'''
    return s
ed('skills/workflow-orchestration/SKILL.md',orch)

def tech(s):
    s=cut(s,'ending when every part\'s Design Doc is verified','. Automat','ending at Design Doc approval')
    s=rep(s,'ends when every part\'s design is verified and committed — before','ends when the design is approved — before')
    s=rep(s,' Code-system files it creates or changes are committed with the Design Doc\n',' Code-system files it creates or changes are approved with the Design Doc\n')
    s=rep(s,"   Then commit the Design Doc, report it, and continue — or stop when the author or `design-sync` left something open (`workflow-orchestration`, \"Explicit Stop Points\")\n","   **[Stop: Design Doc approval — part `{part}`]**\n")
    a=s.index('6. **acceptance-test-generator**'); s=s[:a]+"   **[Stop: ADR approval]** — only when an ADR was written\n"+s[a:]
    s=rep(s,'## Revision Loop\n','''## Stop Points

| Stop | After | What the user decides |
|------|-------|----------------------|
| Design Doc approval | design-sync completes consistency verification for a part | Whether the technical approach for that part is right — one stop per part |
| ADR approval | technical-designer(-frontend) returns the ADR with its draft check | Whether the decision and its rejected alternatives are right — only when an ADR was written |

Each stop shows the author's `draftCheck.open` items and offers independent review as an option — see `workflow-orchestration`, "Explicit Stop Points".

Batch approval, the authority boundary into autonomous work, belongs to `workflow-execution` — it gates the plan, and the plan is produced there.

## Revision Loop
''')
    s=rep(s,'Parts are designed in dependency order, each finished before the next begins.','Parts are designed in dependency order, each to approval before the next begins.')
    s=rep(s,'the backend part is designed **before** the frontend part','the backend part reaches approval **before** the frontend part is designed')
    return s
ed('skills/workflow-technical/SKILL.md',tech)

def prod(s):
    a=s.index('## Stop Points\n'); b=s.index('When `requirement-analyzer` reports a `decidingAxis`')
    s=s[:a]+'''## Stop Points

Every stop in this phase is a genuine decision gate, not a status update. Use `AskUserQuestion` so the choice is structured. A document stop shows the author's `draftCheck.open` items and offers independent review as an option — see `workflow-orchestration`, "Explicit Stop Points".

| Stop | After | What the user decides |
|------|-------|----------------------|
| Requirement confirmation | requirement-analyzer | Whether the understood scope and scale match intent; answers to open questions; a first look at the proposed parts |
| PRD approval | prd-creator returns the PRD with its draft check | Whether the requirements and success criteria are right, and whether the Delivery Parts split is the right one — every scale |
| UXRD approval | ux-designer returns the UXRD with its draft check | Whether the flows, states, and accessibility posture are right, and the design-system foundations and components the UXRD created or changed — only when the work has a UI surface |

Each stop happens **once per feature**. Per-part stops begin in the technical phase.

'''+s[b:]
    return s
ed('skills/workflow-product/SKILL.md',prod)

def execu(s):
    s=rep(s,'work plan creation, the start of autonomous execution, the phase cycle','work plan creation, batch approval, the phase cycle')
    s=rep(s,'planning the work, and then running the loop','planning the work, obtaining batch approval, and then running the loop')
    s=rep(s,'plan the first part, build it through','plan the first part, take its batch approval, build it through')
    s=rep(s,'\n### Flow\n',"\nCommit strategy is asked once, before the first part's batch approval, and holds for the feature. Batch approval is taken per part: it approves one plan, and one plan covers one part.\n\n### Flow\n")
    s=cut(s,'3. **Report and continue**','4. The phase cycle','3. **Commit strategy selection** — ask the user, first part only (see below)\n\n   **[Stop: batch approval — part `{part}`]** — shows the plan path and the planner\'s `draftCheck.open` items, and offers independent review as an option; when the user picks it, `workflow-orchestration`, "Revision Loop" applies before approval\n\n')
    s=rep(s,'Its completion report names the next part in the list, whose planning then starts; the last part','Its completion report names the next part in the list; the last part')
    s=cut(s,'### The plan is the authority boundary\n','Small scale, and gamedev Prototype','### Batch approval is the authority boundary\n\nEverything before it is reviewed by a human; everything after runs autonomously until completion or escalation. Do not reach it with an unresolved question — after it, no one is asked again.\n\n')
    s=rep(s,', and the loop runs. The parts list has one entry.',', batch approval is taken, and the loop runs. The parts list has one entry.')
    s=cut(s,'Autonomous mode starts once the plan is written',' Before entering the loop','Autonomous mode starts after batch approval.')
    s=rep(s,'the plan delegates authority to the subagents','batch approval delegates authority to the subagents')
    s=cut(s,'`per-phase` applies without asking and holds for the feature.','\n\n| Strategy |','**Ask before batch approval**, so the user approves the plan and its commit granularity together; `/build` and `/front-build` started on their own ask both in one question.')
    return s
ed('skills/workflow-execution/SKILL.md',execu)

def design(s):
    s=rep(s,'description: Execute from requirement analysis through PRD to a verified design document for every part','description: Execute from requirement analysis through PRD to design document approval for every part')
    s=rep(s,"It ends when every part's Design Doc is verified and committed.","It ends when every part's Design Doc is approved.")
    s=rep(s,'   - '+RULE,'   - '+MARK)
    s=rep(s,'has its `design-{part}.md` and test skeletons','has an approved `design-{part}.md`')
    s=rep(s,'**CRITICAL**: NEVER skip prd-creator, design-sync, or acceptance-test-generator.','**CRITICAL**: NEVER skip prd-creator, design-sync, acceptance-test-generator, or a stopping point defined in the skill flows.')
    s=rep(s,' → design-sync\n',' → design-sync → [Stop: Design Doc approval — part X]\n')
    s=rep(s,' → ADR   (only when',' → ADR → [Stop: ADR approval]   (only when')
    s=rep(s,'**Responsibility Boundary**: This command completes with a Design Doc for every part.','**Responsibility Boundary**: This command completes with design document approval for every part.')
    s=rep(s,'**Scope**: Up to a Design Doc for every part.','**Scope**: Up to design document approval for every part.')
    s=rep(s,'Report the clean verification result with the Design Doc and continue','Present the clean verification result and proceed to the Design Doc approval stop')
    s=rep(s,'fact gathering, Design Doc, design-sync\n','fact gathering, Design Doc, design-sync, user approval\n')
    s=rep(s,'- [ ] ADR written for any decision','- [ ] ADR written and approved for any decision')
    a=s.index('**Important**: This command ends'); s=s[:a].rstrip('\n')+'\n- Approval status: User approved, all parts\n\n**Important**: This command ends with design approval. Does not propose transition to next phase.\n'
    return s
ed('commands/design.md',design)

def impl(s,gd=False):
    s=rep(s,'   - '+RULE,'   - At a document stop → `workflow-orchestration`, "Explicit Stop Points"\n   - '+MARK)
    s=rep(s,"3. **Enter autonomous mode** once the current part's plan is written with nothing open","3. **Enter autonomous mode** only after the batch approval of the current part's plan")
    s=rep(s,'Execute all steps and sub-agents defined','Execute all steps, sub-agents, and stopping points defined')
    s=rep(s,'- Invoke next sub-agent defined in flow','- Recognize mandatory stopping points\n- Invoke next sub-agent defined in flow')
    s=rep(s,'design every part before planning any — `workflow-technical`, "Flow".','design every part to approval before planning any — `workflow-technical`, "Flow". One `[Stop: Design Doc approval — part X]` per part.')
    s=rep(s,'for each part, plan → execute phase by phase','for each part, plan → batch approval → execute phase by phase')
    s=rep(s,'"One part at a time". The last part','"One part at a time". One batch approval per part. The last part')
    s=rep(s,"\nThe orchestrator does not add","\nCommit strategy is asked once per feature, before the first part's batch approval. The orchestrator does not add")
    if gd:
        s=rep(s,"- **Commit strategy** — `per-phase` unless the user's request says otherwise (\"Commit Strategy Selection\"); it commits per plan phase","- **Commit strategy** — asked once per feature, after feature spec approval and before the first part's batch approval (\"Commit Strategy Selection\"); `per-phase` commits per plan phase")
    else:
        s=rep(s,"- **Commit strategy** — `per-phase` unless the user's request says otherwise (\"Commit Strategy Selection\")","- **Commit strategy** — asked once per feature, after PRD approval and before the first part's batch approval (\"Commit Strategy Selection\")")
    return s
ed('commands/implement.md',impl)
ed('gamedev/commands/implement.md',lambda s: impl(s,True))
ed('gamedev/skills/workflow-gamedev/SKILL.md',lambda s: rep(rep(s,'Each stop happens once per feature (Scenario A: once per feature the GDD defines). The technical and execution phases stop only for what is left open.','Each stop happens once per feature (Scenario A: once per feature the GDD defines). Per-part stops begin in `workflow-technical`.\n\nThe technical phase adds Design Doc approval and, when one is written, ADR approval. Batch approval belongs to `workflow-execution`.'),'Work plan and execution','Work plan, batch approval, and execution'))

for f in ('commands/build.md','commands/front-build.md'):
    ed(f,lambda s: rep(rep(s,'1. **Plan approval and commit strategy**','1. **Batch approval and commit strategy**'),'and the question asks the approval alone','and the question asks the approval alone; a plan already approved in this session (batch approval in `/implement` or `/create-plan`) is not asked again'))

def cplan(s,build='/build'):
    s=rep(s,'**Responsibility Boundary**: This command completes with the work plan; `'+build+'` takes its approval.','**Responsibility Boundary**: This command completes with work plan approval.')
    s=rep(s,'Report the plan per `workflow-orchestration`, "Explicit Stop Points". An independent review, when the user asks for one:','Present the plan at the stop per `workflow-orchestration`, "Explicit Stop Points". An independent review:')
    s=rep(s,'**Scope**: Up to work plan creation.','**Scope**: Up to work plan creation and obtaining approval for plan content.')
    s=rep(s,'End with the following standard response\n','End with the following standard response after plan content approval\n')
    s=rep(s,'[plan-name].md\n\nPlease provide','[plan-name].md\n- Status: Approved\n\nPlease provide')
    s=rep(s,', when the user asks for it\n- ',', when the user asks for it at plan approval\n- Plan approval obtainment\n- ') if False else s
    return s
def cp(s):
    s=cplan(s)
    s=rep(s,'description: Create work plan from design document','description: Create work plan from design document and obtain plan approval')
    s=rep(s,'   - '+RULE+'\n3. **Scope**: Complete when the work plan is written','   - **Stop and obtain approval** for plan content before completion\n3. **Scope**: Complete when work plan receives approval')
    s=rep(s,'**Think deeply** Create a work plan','5. **Plan Approval**\n   - Interact with user to complete plan and obtain approval for plan content\n\n**Think deeply** Create a work plan')
    return s
ed('commands/create-plan.md',cp)
def fp(s):
    s=cplan(s,'/front-build')
    s=rep(s,'description: Create frontend work plan from design document','description: Create frontend work plan from design document and obtain plan approval')
    s=rep(s,'\n\n**Think deeply** Create a work plan','\n- Then interact with user to obtain approval for plan content\n\n**Think deeply** Create a work plan')
    return s
ed('commands/front-plan.md',fp)
def fdesign(s):
    s=rep(s,'- Commit the Design Doc with the code-system files it created or changed, report it with its alternatives and trade-offs, and continue — or stop for what is left open\n','- **[STOP]**: Present design alternatives and trade-offs, obtain user approval — one stop per part, with the code-system files the design created or changed\n')
    s=rep(s,'approved design [path]"`\n','approved design [path]"` → **[STOP]**: ADR approval\n')
    s=rep(s,'**Responsibility Boundary**: This command completes with a Design Doc for every frontend part.','**Responsibility Boundary**: This command completes with design document approval for every frontend part.')
    s=rep(s,'**Scope**: Up to a frontend Design Doc (and ADR, when one is written) for every part.','**Scope**: Up to frontend design document (ADR/Design Doc) approval for every part.')
    a=s.index('**Important**: This command ends'); s=s[:a].rstrip('\n')+'\n- Approval status: User approved\n\n**Important**: This command ends with design approval. Does not propose transition to next phase.\n'
    return s
ed('commands/front-design.md',fdesign)
ed('agents/design-sync.md',lambda s: rep(s,'The caller decides whether to continue or stop on `syncStatus`','The caller gates the Design Doc approval stop on `syncStatus`'))
def idx(s):
    s=rep(s,'tags: [work-plan, plan-approval, autonomous-execution','tags: [work-plan, batch-approval, autonomous-execution')
    s=rep(s,'Work plan creation and review, the start of autonomous execution, running','Work plan creation and review, batch approval, running')
    s=rep(s,"up to every part's verified Design Doc",'up to Design Doc approval')
    return s
ed('skills/task-analyzer/references/skills-index.yaml',idx)
