import io
def load(p):
    s=io.open(p,encoding='utf-8',newline='').read(); nl='\r\n' if '\r\n' in s else '\n'; return s.replace('\r\n','\n'),nl
def save(p,s,nl): io.open(p,'w',encoding='utf-8',newline='').write(s.replace('\n',nl)); print(p,s.count('\n'))
def cut(s,start,end,repl=''):
    a=s.index(start); b=s.index(end,a+len(start)); return s[:a]+repl+s[b:]
def rep(s,a,b,n=1):
    assert s.count(a)==n,(s.count(a),a[:80]); return s.replace(a,b)
RULE='Stop where `workflow-orchestration`, "Explicit Stop Points", says a decision is still the user\'s; otherwise report and continue'
def ed(p,fn):
    s,nl=load(p); s=fn(s); save(p,s,nl)

def technical(s):
    s=rep(s,'that the design must explicitly dispose of.','that the design must address.')
    s=rep(s,'Parts are designed in dependency order, each to approval before the next begins.','Parts are designed in dependency order, each finished before the next begins.')
    s=rep(s,'the backend part reaches approval **before** the frontend part is designed','the backend part is designed **before** the frontend part')
    return s
ed('skills/workflow-technical/SKILL.md',technical)
ed('skills/workflow-execution/SKILL.md',lambda s: rep(s,'with `requiredFixes`: from the failed verifiers, as returned,','with `requiredFixes`: from the verifiers, as returned,'))

def design(s):
    s=rep(s,'   - **Stop at every `[Stop: ...]` marker** → Wait for user approval before proceeding','   - '+RULE)
    s=rep(s,'has an approved `design-{part}.md`','has its `design-{part}.md` and test skeletons')
    s=rep(s,'**CRITICAL**: NEVER skip prd-creator, design-sync, acceptance-test-generator, or a stopping point defined in the skill flows.','**CRITICAL**: NEVER skip prd-creator, design-sync, or acceptance-test-generator.')
    s=rep(s,' → design-sync → [Stop: Design Doc approval — part X]',' → design-sync')
    s=rep(s,' → ADR → [Stop: ADR approval]   (only when',' → ADR   (only when')
    s=rep(s,'**Responsibility Boundary**: This command completes with design document approval for every part.','**Responsibility Boundary**: This command completes with a Design Doc for every part.')
    s=rep(s,'**Scope**: Up to design document approval for every part.','**Scope**: Up to a Design Doc for every part.')
    s=rep(s,'Present the clean verification result and proceed to the Design Doc approval stop','Report the clean verification result with the Design Doc and continue')
    s=rep(s,'fact gathering, Design Doc, design-sync, user approval','fact gathering, Design Doc, design-sync')
    s=rep(s,'- [ ] ADR written and approved for any decision','- [ ] ADR written for any decision')
    s=rep(s,'- Approval status: User approved, all parts\n','')
    s=rep(s,'**Important**: This command ends with design approval. Does not propose transition to next phase.','**Important**: This command ends when every part is designed; its report names planning the first part as the next step.')
    return s
ed('commands/design.md',design)

def impl(s,gd=False):
    s=rep(s,'   - At a document stop → `workflow-orchestration`, "Explicit Stop Points"\n   - **Stop at every `[Stop: ...]` marker** → Wait for user approval before proceeding','   - '+RULE)
    s=rep(s,"3. **Enter autonomous mode** only after the batch approval of the current part's plan","3. **Enter autonomous mode** once the current part's plan is written with nothing open")
    s=rep(s,'Execute all steps, sub-agents, and stopping points defined','Execute all steps and sub-agents defined')
    s=rep(s,'- Recognize mandatory stopping points\n','')
    s=rep(s,'design every part to approval before planning any — `workflow-technical`, "Flow". One `[Stop: Design Doc approval — part X]` per part.','design every part before planning any — `workflow-technical`, "Flow".')
    s=rep(s,'for each part, plan → batch approval → execute phase by phase','for each part, plan → execute phase by phase')
    s=rep(s,' One batch approval per part. The last part',' The last part')
    s=rep(s,"Commit strategy is asked once per feature, before the first part's batch approval. The orchestrator does not add","The orchestrator does not add")
    if gd:
        s=rep(s,"- **Commit strategy** — asked once per feature, after feature spec approval and before the first part's batch approval (\"Commit Strategy Selection\"); `per-phase` commits per plan phase","- **Commit strategy** — `per-phase` unless the user's request says otherwise (\"Commit Strategy Selection\"); it commits per plan phase")
        s=rep(s,'- [ ] Recognized stopping points\n','')
    else:
        s=rep(s,"- **Commit strategy** — asked once per feature, after PRD approval and before the first part's batch approval (\"Commit Strategy Selection\")","- **Commit strategy** — `per-phase` unless the user's request says otherwise (\"Commit Strategy Selection\")")
    return s
ed('commands/implement.md',impl)
ed('gamedev/commands/implement.md',lambda s: impl(s,True))
ed('gamedev/skills/workflow-gamedev/SKILL.md',lambda s: rep(s,'Each stop happens once per feature (Scenario A: once per feature the GDD defines). Per-part stops begin in `workflow-technical`.\n\nThe technical phase adds Design Doc approval and, when one is written, ADR approval. Batch approval belongs to `workflow-execution`.','Each stop happens once per feature (Scenario A: once per feature the GDD defines). The technical and execution phases stop only for what is left open.'))

for f in ('commands/build.md','commands/front-build.md'):
    ed(f,lambda s: rep(s,' Obtain batch approval before autonomous mode.',''))

def cplan(s):
    s=rep(s,'   - **Stop and obtain approval** for plan content before completion\n3. **Scope**: Complete when work plan receives approval','   - '+RULE+'\n3. **Scope**: Complete when the work plan is written')
    s=rep(s,'- Plan approval obtainment\n','')
    s=rep(s,'**Responsibility Boundary**: This command completes with work plan approval.','**Responsibility Boundary**: This command completes with the work plan; `/build` takes its approval.')
    s=rep(s,'Present the plan at the stop per `workflow-orchestration`, "Explicit Stop Points". An independent review:','Report the plan per `workflow-orchestration`, "Explicit Stop Points". An independent review, when the user asks for one:')
    s=cut(s,'5. **Plan Approval**\n','**Think deeply**')
    s=rep(s,'**Scope**: Up to work plan creation and obtaining approval for plan content.','**Scope**: Up to work plan creation.')
    s=rep(s,'End with the following standard response after plan content approval','End with the following standard response')
    s=rep(s,'- Status: Approved\n','')
    return s
ed('commands/create-plan.md',cplan)
def fplan(s):
    s=rep(s,'- Plan approval obtainment\n','')
    s=rep(s,'**Responsibility Boundary**: This command completes with work plan approval.','**Responsibility Boundary**: This command completes with the work plan; `/front-build` takes its approval.')
    s=rep(s,'Present the plan at the stop per `workflow-orchestration`, "Explicit Stop Points". An independent review:','Report the plan per `workflow-orchestration`, "Explicit Stop Points". An independent review, when the user asks for one:')
    s=rep(s,'- Then interact with user to obtain approval for plan content\n','')
    s=rep(s,'**Scope**: Up to work plan creation and obtaining approval for plan content.','**Scope**: Up to work plan creation.')
    s=rep(s,'End with the following standard response after plan content approval','End with the following standard response')
    s=rep(s,'- Status: Approved\n','')
    return s
ed('commands/front-plan.md',fplan)
def fdesign(s):
    s=rep(s,'- **[STOP]**: Present design alternatives and trade-offs, obtain user approval — one stop per part, with the code-system files the design created or changed\n','- Commit the Design Doc with the code-system files it created or changed, report it with its alternatives and trade-offs, and continue — or stop for what is left open\n')
    s=rep(s,' → **[STOP]**: ADR approval\n','\n')
    s=rep(s,'**Responsibility Boundary**: This command completes with design document approval for every frontend part.','**Responsibility Boundary**: This command completes with a Design Doc for every frontend part.')
    s=rep(s,'**Scope**: Up to frontend design document (ADR/Design Doc) approval for every part.','**Scope**: Up to a frontend Design Doc (and ADR, when one is written) for every part.')
    s=rep(s,'- Approval status: User approved\n','')
    s=rep(s,'**Important**: This command ends with design approval. Does not propose transition to next phase.','**Important**: This command ends when every frontend part is designed; its report names planning as the next step.')
    return s
ed('commands/front-design.md',fdesign)
