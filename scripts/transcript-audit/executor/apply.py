import io


def load(p):
    return io.open(p, encoding='utf-8', newline='').read()


def save(p, s):
    io.open(p, 'w', encoding='utf-8', newline='').write(s)


def cut(s, start, end, repl=''):
    """replace from start marker (inclusive) up to end marker (exclusive)"""
    assert s.count(start) == 1, ('start', start, s.count(start))
    i = s.index(start)
    j = s.index(end, i + len(start))
    return s[:i] + repl + s[j:]


def rep(s, a, b):
    assert s.count(a) == 1, (a, s.count(a))
    return s.replace(a, b)


NOTES = "If you learn something the next phase cannot see in the code, leave it in the phase's `#### Investigation Notes` in a few lines.\n"
BIND = (
    "#### Binding Decision Check\n\n"
    "*Required when the plan's ADR Bindings table has one or more rows whose \"Covered By Phase(s)\" names this phase.*\n\n"
    "Before the TDD cycle, read each row's ADR Source Section and judge the planned approach against the row's Compliance Check. An approach that fails a row → stop and escalate with `escalation_type: \"binding_decision_violation\"` and `stage: \"pre_implementation\"`. The Exit Gate judges the rows again against the final implementation.\n\n"
    "#### Reference Contract Check\n\n"
    "*Required when the plan's Reference Contract Values table has one or more rows whose \"Covered By Phase(s)\" names this phase.*\n\n"
    "Before the TDD cycle, read each row's Design Doc section and judge whether the planned approach reproduces the row's Required Observable Value. One that does not → stop and escalate with `escalation_type: \"design_compliance_violation\"`, `details.design_doc_expectation` = the row's Required Observable Value, `details.actual_situation` = the planned approach. The Exit Gate judges the rows again against the final implementation.\n\n"
)
THIRD = "A third attempt at the same failure in the same file → stop patching and escalate with what was tried (`design_compliance_violation`, listing the attempts in `attempted_approaches`).\n\n"

for fe in (False, True):
    p = 'agents/task-executor-frontend.md' if fe else 'agents/task-executor.md'
    s = load(p)
    crlf = '\r\n' in s
    s = s.replace('\r\n', '\n')
    n0 = s.count('\n')
    # item 3: skills
    if fe:
        s = rep(s, "skills: typescript-rules, typescript-testing, testing-principles, frontend-ai-guide, ai-development-guide, implementation-approach, code-navigation, design-system, code-system",
                "skills: typescript-rules, typescript-testing, testing-principles, implementation-approach, code-navigation, design-system, code-system")
    else:
        s = rep(s, "skills: coding-principles, testing-principles, ai-development-guide, implementation-approach, code-navigation, code-system",
                "skills: coding-principles, testing-principles, implementation-approach, code-navigation, code-system")
    # item 8: Mandatory Rules ceremony
    if fe:
        s = cut(s, "## Mandatory Rules\n", "## Mandatory Judgment Criteria",
                "## Package Manager\n\nUse the appropriate run command based on the `packageManager` field in package.json.\n\n")
    else:
        s = cut(s, "## Mandatory Rules\n", "## Mandatory Judgment Criteria")
    # item 9: authority + responsibilities -> one statement
    s = cut(s, "## Implementation Authority and Responsibility Boundaries\n", "## Workflow\n",
            "The plan is approved: start implementing at once, and escalate only for a design deviation or a shortcut fix.\n\n")
    if not fe:
        s = cut(s, "#### Test Environment Check\n", "#### Pre-implementation Verification",
                "#### Test Environment Check\n**Before starting the TDD cycle**: inspect project files and commands to confirm the test runner works. Unavailable → escalate with `escalation_type: \"test_environment_not_ready\"`.\n\n")
    # item 1: binding / reference contract checks without the notes procedure
    s = cut(s, "#### Binding Decision Check\n", "#### Reference Representativeness", BIND)
    s = rep(s, " Runs after Pre-implementation Verification, before the Binding Decision Check.", " Runs after Pre-implementation Verification.")
    if fe:
        s = rep(s, "adopt only with justification recorded in Investigation Notes", "adopt only with a reason you can state")
    else:
        s = rep(s, "adopt only with explicit justification recorded in Investigation Notes (consistency", "adopt only with a reason you can state (consistency")
    # implementation flow
    if fe:
        s = rep(s, "4. **Progress Update [MANDATORY]**: Change the completed work item from `[ ]` → `[x]` in the plan (Edit; cannot be omitted)",
                "4. **Progress Update**: `[ ]` → `[x]` on the work item in the plan, by Edit")
        s = rep(s, "1. **Red**: Create a failing React Testing Library test — only", "1. **Red**: Create a failing React Testing Library test, co-located with the component — only")
    else:
        s = rep(s, "4. **Progress Update**: `[ ]` → `[x]` on the work item in the plan\n", "4. **Progress Update**: `[ ]` → `[x]` on the work item in the plan, by Edit\n")
        s = rep(s, "**Per work item that adds behaviour, follow RED-GREEN-REFACTOR** (see testing-principles skill):", "**Per work item that adds behaviour** (`testing-principles`, RED-GREEN-REFACTOR):")
        s = cut(s, "**Test types**:\n", "#### Operation Verification",
                "Integration and E2E tests: write the files the phase calls for and do not run them — their first run is the feature run.\n\n")
    s = rep(s, "none of them is this agent's.\n\n", "none of them is this agent's, and neither are commits.\n\n" + THIRD)
    # operation verification
    s = rep(s, "- Record reason if unable to verify\n- Include results in structured response\n", "- Say in `changeSummary` what was verified and how, or why it could not be\n")
    s = rep(s, "or list what was left in `runnableCheck.reason`", "or list what was left in `changeSummary`")
    # completion + notes sentence
    s = rep(s, "and operation verification is done.\n", "and operation verification is done. " + NOTES)
    # delegating
    s = cut(s, "## Delegating a Wide Search\n", "## Structured Response Specification")
    # item 2: response
    s = cut(s, "**runnableCheck.result** / **runnableCheck.substance**", "### 1. Phase Completion Response")
    s = cut(s, "Report in the following JSON format upon phase completion", "```json\n{\n  \"status\": \"completed\"",
            "Report in the following JSON format upon phase completion. In Fix Mode `phase` is `null`.\n\n")
    s = cut(s, "  \"phaseName\":", "  \"filesModified\":",
            "  \"changeSummary\": \"[Two or three sentences: what was built and what the diff does not show — what was verified and how, anything left behind]\",\n")
    s = cut(s, "  \"newTestsPassed\":", "  \"requiresTestReview\":")
    s = rep(s, "  \"readyForQualityCheck\": true,\n  \"nextActions\": \"Overall quality verification by quality assurance process\"\n", "  \"readyForQualityCheck\": true\n")
    # exit gate
    s = rep(s, "☐ Fresh Mode: all the phase's Work Items ticked in the plan, with evidence (or", "☐ Fresh Mode: all the phase's Work Items ticked in the plan (or")
    s = rep(s, "☐ Implementation is consistent with the Investigation Notes recorded during background understanding\n", "")
    s = rep(s, " against the **final** implementation, with evidence in Investigation Notes (when such rows exist)", " against the **final** implementation (when such rows exist)")
    s = rep(s, "☐ When test evidence is cited, `runnableCheck.substance` and `runnableCheck.substanceIssue` are populated\n", "")
    # execution principles + MCP tools: to end of file
    i = s.index("## Execution Principles\n")
    s = s[:i].rstrip('\n') + '\n'
    n1 = s.count('\n')
    if crlf:
        s = s.replace('\n', '\r\n')
    save(p, s)
    print(p, n0, '->', n1, 'crlf' if crlf else 'lf')
