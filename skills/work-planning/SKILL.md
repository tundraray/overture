---
name: work-planning
description: This skill governs how a work plan is written — checking it against current code, delegating wide searches, frontmatter rules within a part, task design, test placement, the draft check, the response to the caller, self-validation, and update mode. Automatically loaded when creating or updating a work plan, or when "work plan", "phase breakdown", "task breakdown", "test placement", "plan frontmatter", or "plan: N of M" are mentioned.
---

# Work Planning

What every planner (`work-planner`, `gamedev-work-planner`) does the same way. The plan's sections are the plan template's (`documentation-criteria`); the inputs and the phase structure are the agent's own.

## Checking the Plan Against Current Code

A plan states which files each task touches. Those paths become the executor's **File Scope Constraint** — a path missing from Target Files blocks the executor mid-task and costs an escalation round trip. Guessing the list is what produces that.

The Design Doc was approved before earlier parts and plans changed the code. Before an existing path or symbol goes into a task, check it yourself: Glob for a path, LSP for a symbol (`code-navigation`, "Tool by Question"). Compare the symbol's current signature (`hover`) with the Design Doc contract. Every site that must change with it (`findReferences`, `goToImplementation`) goes into Target Files. When the code contradicts the Design Doc (a symbol is gone, or its signature differs from the contract), the sources disagree: record both sides in `openQuestions`. Don't build the plan around either one.

## Delegating a Wide Search

Spawn `code-explorer` for what reaches past the files the Design Doc names. Beyond it, spawn only `document-reviewer` for the draft check; sequencing the workflow belongs to the orchestrator.

| Planning question | Ask code-explorer |
|-------------------|-------------------|
| Does this change ripple past its own module? | `query: every consumer of <symbol>; breadth: thorough` |
| Which producer and consumer sit on this boundary? | `query: where <value> is written and where it is read; breadth: medium` — fills the Connection Map's Owner columns, which require concrete paths |

```
subagent_type: code-explorer   # or <plugin>:code-explorer, as the Agent tool lists it
prompt: "query: every writer and reader of the checkout session cookie; breadth: medium"
```

Use the result to populate **Target Files** per task, the **Connection Map** owners, and the phase ordering. Two tasks whose location sets overlap cannot run in either order — record the dependency.

**Self-serve before recording an open question.** A fact discoverable in the code is answered, not deferred: run one `code-explorer` query before an unknown becomes an `openQuestions` entry, and one broader retry (`breadth: thorough`) when the first comes back empty. Then stop — a product or priority call, another team's decision, or a genuine contradiction between sources goes to the user. The entry records what was searched, so the reader can tell a decision nobody can make from a lookup nobody ran.

## The Plan File

The plan is written to `docs/features/{feature}/{part}/{plan-name}.md`, with checkboxes for progress tracking. Its frontmatter is defined in `documentation-criteria`, "Plans within a part". When writing or updating a plan:

- **Exactly one plan per part may be `active`.** When activating a plan, confirm no sibling already is.
- **Set `M` in `plan: N of M` deliberately.** When the work genuinely needs a second pass, raise `M` on every plan in the part and add the new plan with the next `N` — do not drop an unannounced plan file into the directory.
- **`depends-on` fixes the order**, so sequencing never relies on filename sort. Omit it only for `N: 1`.
- **`design` points at the governing design** — `design-{part}.md` for this plan's part, where `part` is a name from the Delivery Parts section (the PRD's; on the gamedev path, the feature spec's). A plan whose part has no approved design is a plan without a specification — stop and report instead of writing one. The single exemption is the simplified plan — small scale, or gamedev Prototype mode at any scale: there is no Design Doc, `design: none`, and the task lines cite the PRD's requirements (the feature spec's acceptance criteria). A plan for a part whose `dependsOn` parts are not yet built is planned against their designs; say so in the plan's Connection Map.

## Task Design

1. **Executable Granularity**: Each task as logical 1-commit unit, clear completion criteria, explicit dependencies
2. **Built-in Quality**: Simultaneous test implementation
3. **Risk Management**: List risks and countermeasures in advance, define detection methods
4. **Ensure Flexibility**: Prioritize essential purpose, avoid excessive detail
5. **Design Doc Compliance**: All task completion criteria derived from Design Doc specifications
6. **Implementation Pattern Consistency**: When including implementation samples, MUST ensure strict compliance with the Design Doc's decisions and contracts

**Task completion — 3 elements**:
1. **Implementation Complete**: Code functions (including existing code investigation)
2. **Quality Complete**: Tests, static checking, linting pass
3. **Integration Complete**: Coordination with other components verified

**Implementation approach.** Select the implementation approach per `implementation-approach` and name it, with its reason, in the plan's Overview. Decompose tasks based on that approach and the technical dependencies the Design Doc's components and contracts show, following verification levels (L1/L2/L3) from implementation-approach skill.

**Dependencies**:
- Clearly define dependencies, and explicitly identify tasks that can run in parallel
- Dependencies up to 2 levels maximum (A→B→C acceptable, A→B→C→D requires redesign); reconsider division for 3+ chain dependencies
- Each task provides value independently as much as possible

**Operational verification.** Identify each integration point — where new code joins existing code, found from the Design Doc's flows and contracts and the codebase — and place its operational verification procedure in the phase that completes it.

## Placing Tests

**Reading the test skeletons** (when their paths were provided): read them with the Read tool and extract the meta information from their comments:
- `// @category:` → Test classification (core-functionality, edge-case, e2e, etc.)
- `// @dependency:` → Phase placement: `none` → earlier phases; `[component name]` → the phase after that component's implementation; `full-system` → final phase

**Test budget (per part)** — apply `testing-principles` Test Selection before placing anything:
- Map every AC to exactly one proving test at the lowest sufficient level; several ACs on one rule share one table-driven test
- Integration and E2E counts stay within the per-part limits in `integration-e2e-testing` (the skeletons from `acceptance-test-generator` already respect them); a skeleton set over budget is merged before it is placed, and the plan states for each extra test the defect only it catches
- No task carries a test that another task's test already proves — the task cites it instead

**Test classification**:
- Setup items (Mock preparation, measurement tools, Helpers, etc.) → Prioritize in Phase 1
- Integration tests → Place as create/execute tasks when relevant feature implementation is complete
- E2E tests → Place as execute-only tasks in final phase
- Non-functional requirement checks (performance, latency, frame budget, memory) → final phase, as profiling or measurement scripts run on demand, outside the regular suite
- Risk levels ("high risk", "required", etc.) → Move to earlier phases

**Property-based tests.** When the Design Doc or acceptance-test-generator identifies property-based test candidates, the plan has dedicated tasks for them, in the same phase as the integration tests for the related feature — never in the final phase. Each names the input generators it needs and the property that must hold.

**Task test lines**:
- A task names the tests it adds by title and the AC or risk each proves; ACs on one rule share one table-driven test
- Specify traceability per AC: the one test that proves it (`AC-1 → <test title>`), never several
- A phase is complete when the tests its tasks name pass — no case counts in the plan text

## Writing and the Draft Check

Compose the whole plan, then write it once. After the Write, before Self-Validation and the response, unless the prompt says `draft_check: skip`, run the draft check on the written plan with `doc_type: WorkPlan` (`documentation-criteria`, "Draft Check"). On an update or revision it runs on the diff against a copy saved before the first edit. The simplified plan (`design: none`) and the `status` flip get no draft check.

## Response to Caller

The document goes to disk; this response carries its path.

```json
{
  "status": "completed|blocked|escalation_needed",
  "documents": [{"path": "docs/features/{feature}/{part}/{plan-name}.md", "action": "created|updated"}],
  "summary": "[what the document establishes, in one or two sentences]",
  "planPosition": "N of M",
  "traceability": {"designItems": 0, "covered": 0, "gaps": []},
  "failureModes": {"applicable": 0, "covered": 0},
  "draftCheck": {"verdict": "[reviewer status | not_run | skipped]", "fixed": ["[issue id: one line]"], "open": [{"severity": "", "issue": "", "why_open": "needs user decision | recommended | deferred | could not resolve"}]},
  "openQuestions": [
    {"question": "[what is unresolved]", "blocks": "[the decision it blocks]", "owner": "[who resolves it]"}
  ],
  "nextSteps": ["[what the caller should do next]"]
}
```

Return the path even when the run ends in `blocked` — a partially written document the caller cannot find is worse than none.

## Self-Validation [BLOCKING — before output]

Settle each item while composing, before the Write — on a revision, at the scope `documentation-criteria` "Revising a Document" sets. After the Write the items are a check: a failing item is fixed with one Edit per affected region, not a run of small edits. The planner's own items are added to these.

- [ ] Every Design Doc item is cited by a task line's "covers", or listed under the Snapshot's "Design items no task covers" with its reason
- [ ] Every Failure Mode category that applies is listed with a covering task
- [ ] Reference Contract Values are copied verbatim from the Design Doc, not paraphrased
- [ ] Frontmatter is complete and consistent: `plan: N of M` matches the part's plan count, and no sibling is already `active`
- [ ] Target Files per task were obtained from a resolved search, not assumed — a missing path blocks the executor mid-task; every existing path and symbol a task names was checked against current code
- [ ] Tasks and tests follow Task Design and Placing Tests
- [ ] The returned `documents[].path` matches the file actually written
- [ ] Only what this document owns and has decided (`documentation-criteria`, "Write what this document decides")
- [ ] On a revision: every place that depends on the change agrees with it, and nothing points at removed content (`documentation-criteria`, "Revising a Document")

## Update Mode

- **Constraint**: Structural changes (phases, tasks, traceability) are made only before execution starts; a plan in progress gets a new plan in the chain instead. The frontmatter `status` flip (`active` after batch approval, `completed` in Final Cleanup) is exempt — it is the one update made to an executing or executed plan, and the planner is the only agent that makes it
- **Processing**: Add one line to Update History (a phrase per change); fold the change into the body as current truth, and update the Snapshot when it changed
- **Validation**: dependents, cuts, and Self-Validation scope follow `documentation-criteria`, "Revising a Document"
