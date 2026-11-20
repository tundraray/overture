import io
p='skills/workflow-execution/SKILL.md'
s=io.open(p,encoding='utf-8',newline='').read()
nl='\r\n' if '\r\n' in s else '\n'
s=s.replace('\r\n','\n')
def cut(start,end,repl=''):
    global s
    a=s.index(start); b=s.index(end,a+len(start)); s=s[:a]+repl+s[b:]
def rep(a,b):
    global s
    assert s.count(a)==1,(s.count(a),a[:70]); s=s.replace(a,b)
cut('## Entry Gate [BLOCKING]\n','## Planning\n')
cut('4. **`{planner}`** (`update` mode) → set the approved plan','5. The phase cycle, post-implementation')
rep('5. The phase cycle, post-implementation','4. The phase cycle, post-implementation')
cut('- **No path**: read every plan','- **No plan under `docs/features/*/*/`**',
'''- **No path**: read the plans at `docs/features/*/*/*.md` and take the one that holds an unticked or `[🔄]` work item and whose `depends-on` plans are fully ticked. A plan with every work item ticked is finished
- **Several plans qualify**: take the most recently modified plan file — the executor ticks work items in it — and report the choice and the alternatives
''')
cut("**Normalizing output into one `requiredFixes[]`**","**Candidate patterns.**",
"`drift` means the code moved past the document (code-verifier: \"document update needed\") — it goes to the completion report, not to the executor.\n\n")
rep("1. `task-executor` in **Fix Mode** with the normalized array and `Design Doc: [path]`","1. `task-executor` in **Fix Mode** with the failed verifiers' findings — the paths of their reports — and `Design Doc: [path]`")
rep("when normalization yields no items, e.g. only `drift`, skip it","when the failures hold nothing to fix, e.g. only `drift`, skip it")
rep("The last part is the one whose plan chain is finished while every other part in the parts list already has a `completed` plan chain.","The last part is the one whose plan chain is finished while every other part in the parts list is already built — every work item of its plans ticked.")
rep("Before the completion report, close the plan this run executed.\n\n- Invoke `{planner}` in `update` mode to set the plan's frontmatter `status` to `completed`, so the next run resolves the following plan in the chain\n","Before the completion report:\n\n")
rep("| **Same error occurs 3 times** | STOP. Run the Error-Fixing Impulse Control Protocol below before any further fix. |","| **Same error occurs 3 times** | STOP. Present the error and a proposed approach to the user; fix only after approval. |")
cut('## Error-Fixing Impulse Control Protocol\n','## Exit Gate [BLOCKING]\n')
a=s.index('## Exit Gate [BLOCKING]\n')
s=s[:a]+'''## Completion Report

The run ends with a completion report; reporting completion over an unverified item removes the reader's reason to look, so the report names every gap. It states:

- What was built and what was verified; any phase left unticked, uncommitted (under `manual`, and under `per-feature` on a part that is not the last, the changes are in the working tree) or escalated
- Verification findings still open after cycle 2, and `security-reviewer` notes from an `approved_with_notes` verdict
- Last part: the feature run's result. Any other part: that the feature run is still to come
- Acceptance criteria proven only against mocks (no real-dependency check yet) and any verification deferred to another part
- Candidate patterns and architectural drift under one heading, for the user to confirm into the code system — or that there were none
- The next plan in the part's chain, or the next part to plan — its `dependsOn` parts are now built, not only designed
'''
io.open(p,'w',encoding='utf-8',newline='').write(s.replace('\n',nl)); print(s.count('\n'))
