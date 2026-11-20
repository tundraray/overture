---
name: work-planning
description: 'This skill governs how a work plan is written — checking it against current code, delegating wide searches, frontmatter rules within a part, phase design, test placement, the draft check, the response to the caller, self-validation, and update mode. Automatically loaded when creating or updating a work plan, or when "work plan", "phase breakdown", "phase design", "work items", "test placement", "plan frontmatter", or "plan: N of M" are mentioned.'
---

# Work Planning

What every planner (`work-planner`, `gamedev-work-planner`) does the same way. The plan's sections are the plan template's (`documentation-criteria`); the inputs and the phase structure are the agent's own.

## Checking the Plan Against Current Code

A plan states which files each phase touches. Those paths are the executor's expected scope — a missing path that touches a contract or another part stops the executor mid-phase and costs an escalation round trip. Guessing the list is what produces that.

The Design Doc was approved before earlier parts and plans changed the code. Before an existing path or symbol goes into a phase, check it yourself: Glob for a path, LSP for a symbol (`code-navigation`, "Tool by Question"). Compare the symbol's current signature (`hover`) with the Design Doc contract. Every site that must change with it (`findReferences`, `goToImplementation`) goes into Target Files. When the code contradicts the Design Doc (a symbol is gone, or its signature differs from the contract), the sources disagree: record both sides in `openQuestions`. Don't build the plan around either one.

## Delegating a Wide Search

Spawn `code-explorer` for what reaches past the files the Design Doc names. Beyond it, spawn only `document-reviewer` for the draft check; sequencing the workflow belongs to the orchestrator.

| Planning question | Ask code-explorer |
|-------------------|-------------------|
| Does this change ripple past its own module? | `query: every consumer of <symbol>; breadth: thorough` |
| Which producer and consumer sit on this boundary? | `query: where <value> is written and where it is read; breadth: medium` — gives the work item that crosses the boundary the other side's file |

```
subagent_type: code-explorer   # or <plugin>:code-explorer, as the Agent tool lists it
prompt: "query: every writer and reader of the checkout session cookie; breadth: medium"
```

Use the result to populate **Target Files** per phase, the other side's file in a work item that crosses a boundary, and the phase ordering. Two phases whose location sets overlap cannot run in either order — record the dependency.

**Self-serve before recording an open question.** A fact discoverable in the code is answered, not deferred: run one `code-explorer` query before an unknown becomes an `openQuestions` entry, and one broader retry (`breadth: thorough`) when the first comes back empty. Then stop — a product or priority call, another team's decision, or a genuine contradiction between sources goes to the user. The entry records what was searched, so the reader can tell a decision nobody can make from a lookup nobody ran.

## The Plan File

The plan is written to `docs/features/{feature}/{part}/{plan-name}.md`, with checkboxes for progress tracking. Its frontmatter is defined in `documentation-criteria`, "Plans within a part". When writing or updating a plan:

- **`plan: N of M` and `depends-on` are written only when the part has more than one plan.** When the work genuinely needs a second pass, give every plan in the part its `plan: N of M` and each plan after the first its `depends-on` — do not drop an unannounced plan file into the directory. `depends-on` fixes the order, so sequencing never relies on filename sort.
- **`design` points at the governing design** — `design-{part}.md` for this plan's part, where `part` is a name from the Delivery Parts section (the PRD's; on the gamedev path, the feature spec's). A plan whose part has no approved design is a plan without a specification — stop and report instead of writing one. The single exemption is the simplified plan — small scale, or gamedev Prototype mode at any scale: there is no Design Doc, `design: none`, and the work items cite the PRD's requirements (the feature spec's acceptance criteria). It is the same template with the parts that cite a design (Patterns, Contracts) absent — except that a phase that builds UI keeps Contracts, holding only the UXRD and design-system pointer line. A plan for a part whose `dependsOn` parts are not yet built is planned against their designs; say so in the plan's Notes.

## Phase Design

The executor is given the plan and a phase number and reads that phase section cold; there is no further breakdown between the plan and the code.

1. **Phase size**: A phase is what one executor run finishes and one commit holds — about 5 Target Files. More work means more phases
2. **Work items**: Each says what it delivers and how — the function, component, or wiring to add or change, and the approach — in the order the items are done, and ends with what it covers. A design decision is cited by its Design Doc section, not restated
3. **Target Files**: Every file the phase is expected to touch, implementation and test alike; the list is the executor's expected scope
4. **Built-in Quality**: A work item's unit tests are written test-first with it (Red-Green-Refactor); the phase's Proof Obligations name them
5. **Design Doc Compliance**: Work items derive from Design Doc specifications; an implementation sample complies strictly with the Design Doc's decisions and contracts
6. **Contracts**: A phase points at what binds it — the Design Doc sections it implements or consumes, the sections whose exact values it must reproduce (naming the kind of value), and an ADR section when one binds the phase. A phase that builds UI also points at the UXRD screens, screen states, element and microcopy IDs it builds and the design-system component spec it must reproduce exactly. The value stays at its owner; the executor reads it there

**Phase completion — 3 elements**:
1. **Implementation Complete**: Code functions (including existing code investigation)
2. **Quality Complete**: Unit tests written test-first and passing; the touched package typechecks
3. **Integration Complete**: Coordination with other components verified

**Implementation approach.** Select the implementation approach per `implementation-approach`, and divide the work into phases based on that approach and the technical dependencies the Design Doc's components and contracts show.

**Dependencies**:
- Phases run in number order; a phase carries `Depends on` only when it reads an earlier phase's deliverable
- Each phase leaves the code in a working, committable state

**Operational verification.** Identify each integration point — where new code joins existing code, found from the Design Doc's flows and contracts and the codebase — and place its operational verification in the phase that completes it. A phase that completes none has no such section.

## Placing Tests

**Reading the test skeletons** (when their paths were provided): read them with the Read tool and extract the meta information from their comments:
- `// @category:` → Test classification (core-functionality, edge-case, e2e, etc.)
- `// @dependency:` → Phase placement: `none` → earlier phases; `[component name]` → the phase after that component's implementation; `full-system` → the phase that completes the journey

**Test budget (per part)** — apply `testing-principles` Test Selection before placing anything:
- Map every AC to exactly one proving test at the lowest sufficient level; several ACs on one rule share one table-driven test
- Integration and E2E counts stay within the per-part limits in `integration-e2e-testing` (the skeletons from `acceptance-test-generator` already respect them); a skeleton set over budget is merged before it is placed, and the plan states for each extra test the defect only it catches
- No phase carries a test that another phase's test already proves — the phase cites it instead

**Test classification**:
- Setup items (Mock preparation, measurement tools, Helpers, etc.) → Prioritize in Phase 1
- Integration and E2E tests → Written in the phase whose code they exercise (an E2E test: the phase that completes its journey). No phase of the plan runs them; the feature's one full run does, after the last part is built
- Non-functional requirement checks (performance, latency, frame budget, memory) → final phase, as profiling or measurement scripts run on demand, outside the regular suite
- Risk levels ("high risk", "required", etc.) → Move to earlier phases

**Property-based tests.** When the Design Doc or acceptance-test-generator identifies property-based test candidates, the plan has dedicated work items for them, in the same phase as the integration tests for the related feature — never in the final phase. Each names the input generators it needs and the property that must hold.

**Proof Obligations** (per phase):
- A phase names the tests it adds by title and the AC or risk each proves; ACs on one rule share one table-driven test
- Specify traceability per AC: the one test that proves it (`AC-1 → <test title>`), never several, and the regression it turns red on; the form is the planner's

**Patterns** (when `docs/code-system/` exists): a phase that touches a block in the Design Doc's Building-block Inventory names the pattern path for it (`reused` / `extended` → `docs/code-system/patterns/{name}.md`; `new` → the Design Doc Key Decision, plus the pattern path when the Key Decision created one).

## Writing and the Draft Check

Compose the whole plan, then write it once. After the Write, before Self-Validation and the response, unless the prompt says `draft_check: skip`, run the draft check on the written plan with `doc_type: WorkPlan` (`documentation-criteria`, "Draft Check"). Whether an update or revision is checked, and how, is set by that section's step 2. The simplified plan (`design: none`) gets no draft check; the planner returns `draftCheck.verdict: "skipped"` for it.

## Response to Caller

The document goes to disk; this response carries its path.

```json
{
  "status": "completed|blocked|escalation_needed",
  "documents": [{"path": "docs/features/{feature}/{part}/{plan-name}.md", "action": "created|updated"}],
  "summary": "[what the document establishes, in one or two sentences]",
  "draftCheck": {"verdict": "[reviewer status | not_run | skipped]", "fixed": ["[issue id: one line]"], "open": [{"severity": "", "issue": "", "why_open": "needs user decision | deferred | could not resolve"}]},
  "openQuestions": [
    {"question": "[what is unresolved]", "blocks": "[the decision it blocks]", "owner": "[who resolves it]"}
  ],
  "nextSteps": ["[what the caller should do next]"]
}
```

Return the path even when the run ends in `blocked` — a partially written document the caller cannot find is worse than none.

## Self-Validation [BLOCKING — before output]

Settle each item while composing, before the Write — on a revision, at the scope `documentation-criteria` "Revising a Document" sets. After the Write the items are a check. The planner's own items are added to these.

- [ ] Every Design Doc item is cited by a work item's "covers", or listed under the Snapshot's "Design items no phase covers" with its reason
- [ ] Every Design Doc section with an exact value a phase must reproduce, and every ADR section that binds a phase, is pointed at from that phase's Contracts; no value is copied into the plan
- [ ] Frontmatter is complete; when the part has more than one plan, `plan: N of M` matches the part's plan count
- [ ] Target Files per phase were obtained from a resolved search, not assumed; every existing path and symbol a phase names was checked against current code
- [ ] Phases and tests follow Phase Design and Placing Tests
- [ ] The returned `documents[].path` matches the file actually written
- [ ] Only what this document owns and has decided (`documentation-criteria`, "Write what this document decides")
- [ ] On a revision: every place that depends on the change agrees with it, and nothing points at removed content (`documentation-criteria`, "Revising a Document")

## Update Mode

- **Constraint**: Structural changes (phases, work items) are made only before execution starts; a plan in progress gets a new plan in the chain instead
- **Processing**: Fold the change into the body as current truth, and update the Snapshot when it changed
- **Validation**: dependents, cuts, and Self-Validation scope follow `documentation-criteria`, "Revising a Document"
