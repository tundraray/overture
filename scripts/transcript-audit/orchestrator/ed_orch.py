import re,sys,io
p='skills/workflow-orchestration/SKILL.md'
s=io.open(p,encoding='utf-8',newline='').read()
nl='\r\n' if '\r\n' in s else '\n'
s=s.replace('\r\n','\n')
def cut(start,end,repl='',incl_end=False):
    global s
    a=s.index(start); b=s.index(end,a+len(start))
    if incl_end: b+=len(end)
    s=s[:a]+repl+s[b:]
def rep(a,b,count=1):
    global s
    assert s.count(a)>=1,a[:60]
    s=s.replace(a,b,count)
# A first action / session init / decision flow
cut('### First Action Rule\n','## Decision Flow When Receiving Tasks\n',
 '### Session Start\n\nBefore the first action in a new session, load the project-context skill: it holds the project-specific constraints every later decision depends on.\n\n')
cut('## Decision Flow When Receiving Tasks\n','### Requirement Change Detection During Flow\n','')
rep('### Requirement Change Detection During Flow','## Requirement Change Detection During Flow')
# B available subagents
cut('## Available Subagents\n','### Gamedev Substitutions\n','')
rep('### Gamedev Substitutions','## Gamedev Substitutions')
# C tool table
rep('| TodoWrite, TaskCreate / TaskUpdate | Progress tracking |\n','')
rep('| Bash | Shell operations (git commit, ls, verification commands) |','| Bash | Shell operations (git commit, ls) |')
# D
rep("; executors may Edit progress checkboxes and a phase's Investigation Notes; `status` flips go through the planner in `update` mode |","; executors may Edit progress checkboxes and a phase's Investigation Notes |")
# call examples
cut('### Execution Method\n','### Reviewers Are Cold Readers\n','')
# E structured response
cut('## Structured Response Specification\n','## Handling Requirement Changes\n',
'''## Structured Response Specification

Each subagent replies in JSON. A reply carries the status, the paths written, and what the orchestrator must decide; everything else goes to a file, and the next agent is handed that path — an orchestrator that receives findings inline pays for them on every later turn and then retypes them for the next agent. An author that runs a draft check (`documentation-criteria`, "Draft Check") also returns `draftCheck` (`verdict`, `fixed`, `open`). The fields the flow keys on:
- **requirement-analyzer**: status, scale, scaleRationale.decidingAxis, confidence, parts, requiredDocuments, scopeDependencies, questions
- **document authors** (prd-creator, ux-designer, technical-designer(-frontend), the planner): status, documents[].path, draftCheck, openQuestions
- **task-executor**: status, filesModified, testsAdded, requiresTestReview
- **quality-fixer**: status, approved, incompleteImplementations
- **document-reviewer**: status, revision_agent, issues
- **design-sync**: syncStatus, conflicts (with revision_agent)
- **integration-test-reviewer**: status, requiredFixes
- **code-verifier**, **code-reviewer**, **security-reviewer**, **test-auditor**: the verdict `workflow-execution`, "Post-Implementation Verification", reads, and the path of the findings

''')
# F
rep("during execution `update` mode is requested for the `status` flips (`active` after batch approval, `completed` in Final Cleanup) and to add a file","during execution `update` mode is requested only to add a file")
# G phase gates
cut('### Phase Gates\n','## Autonomous Execution Mode\n','')
# H
rep(', auto-stop triggers, and the error-fixing protocol — is governed',', and auto-stop triggers — is governed')
# I + J + K
cut('## TodoWrite Management\n','## Required Dialogue Points with Humans\n',
'''## Main Orchestrator Roles

1. **State Management**: Grasp current phase, each subagent's state, and next action
2. **Handoffs**: Pass the next agent the paths the previous one returned; when requirements change, integrate the initial and additional requirements explicitly
3. **Quality Assurance and Commit Execution**: After `approved: true` at a commit point of the chosen strategy, execute git commit
4. **Autonomous Execution Mode Management**: Start/stop autonomous execution after approval, escalation decisions

''')
cut('## Action Checklist\n','ZZZ_END','') if False else None
a=s.index('## Action Checklist\n'); s=s[:a].rstrip('\n')+'\n'
io.open(p,'w',encoding='utf-8',newline='').write(s.replace('\n',nl))
print(s.count('\n'))
