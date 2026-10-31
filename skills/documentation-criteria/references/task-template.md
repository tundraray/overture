---
temporary: true
---

# Task: [Task Name]

<!-- Temporary AI working file — not in git, deleted after the feature ships; it states exactly what the work plan and the documentation state. Written in the plan's language; headings stay as written, because the executor finds sections by them, and values copied verbatim stay verbatim. Guidance in these comments and in parenthesized "Include when" notes is not copied into the task. -->

Metadata:
- Dependencies: task-01 → Deliverable: {plan-dir}/analysis/research-results.md
- Provides: {plan-dir}/analysis/api-spec.md (for research/design tasks)

## Implementation Content
[Two or three sentences: what this task delivers and why, citing dependency deliverables when it builds on them]

## Target Files
- [ ] [Implementation file path]
- [ ] [Test file path]

<!-- Every file the task touches, implementation and test alike: this list is the executor's File Scope Constraint. -->

## Investigation Targets
Files to read before starting implementation (file path, with optional search hint):
- [e.g., src/orders/checkout (processOrder function) — taken from the plan's Target Files and Connection Map owners, and the paths the Design Doc names in its Appendix: Fact Disposition and the text under a diagram]

## Change Category
(Include only when the task is a bug fix, regression, state change, or boundary change — populated during task decomposition. Omit otherwise.)

`Change Category: <one or more of bug-fix, regression, state-change, boundary-change — comma-separated>`

## Binding Decisions
(Include when the work plan's ADR Bindings table covers this task. Omit otherwise.)

| Source | Axis | Decision | Compliance Check |
|---|---|---|---|
| [docs/adr/ADR-XXXX.md (§ Decision or § Implementation Guidance), matching the work plan row] | [Axis copied verbatim from the work plan's ADR Bindings row] | [Binding decision copied from the work plan row] | [Y/N-answerable positive predicate evaluating whether the implementation satisfies the decision] |

## Reference Contracts
(Include when the work plan's Reference Contract Values table covers this task. Omit otherwise.)

| Source | Contract Type | Required Observable Value | Compliance Check |
|---|---|---|---|
| [Design Doc path (§ Section), copied from the matching work plan row] | [exact-value / structure-order / derived-display / state-lifecycle-negative] | [Required Observable Value copied verbatim from the work plan row] | [Y/N-answerable positive predicate evaluating whether the implementation reproduces the value] |

## Investigation Notes
(Implementation observations are appended here before implementation begins. When Binding Decisions or Reference Contracts exist, record the planned approach and each Compliance Check result here — the Exit Gate re-reads them against the final implementation.)

## Implementation Steps (TDD: Red-Green-Refactor)
### 1. Red Phase
- [ ] Read all Investigation Targets and record key observations
- [ ] Review dependency deliverables (if any)
- [ ] Verify/create contract definitions
- [ ] Write failing tests — only for obligations whose **Proven by** is `new`; a step that adds no behaviour of its own (constant, schema declaration, wiring) gets no test
- [ ] Run tests and confirm failure

### 2. Green Phase
- [ ] Add minimal implementation to pass tests
- [ ] Run only added tests and confirm they pass

### 3. Refactor Phase
- [ ] Improve code (maintain passing tests)
- [ ] Confirm added tests still pass

## Operation Verification Methods
(Derived from the Verification Strategy in the work plan)
- **Verification method**: [what to verify and how — e.g. "compare new implementation output against src/legacy/order_calc", "run endpoint against test database and verify response matches contract"]
- **Success criteria**: [observable outcome proving correctness — e.g. "output matches the existing implementation for all input combinations", "API returns 200 with the expected schema"]
- **Failure response**: [what to do if verification fails — e.g. "reassess approach before proceeding", "escalate to user"]
- **Verification level**: [L1: functional operation as end-user feature / L2: new tests added and passing / L3: code builds without errors]

## Proof Obligations
(One entry per AC, claim, or applicable Failure Mode Checklist category this task covers. A passing test proves nothing unless it would fail for a named reason — that reason is the primary failure mode. Repeat the block once per claim; the heading carries the AC ID, claim ID, or `Failure Mode: <category>` so downstream review can resolve coverage per claim.
An obligation is not a test. It is discharged by the one lowest-level test that proves it (`testing-principles`, Test Selection); when an existing or planned test already proves it, cite that test and write none. Several obligations that exercise one rule share one table-driven test.)

### Obligation: [AC ID, claim ID, or Failure Mode category — e.g. `Failure Mode: missing-sort-key ordering`]
- **Claim**: [the AC behavior, claim, or failure-mode condition this task must prove]
- **Primary failure mode**: [the regression the test turns red on]
- **Boundary to exercise**: [public/integration boundary the test traverses, or "in-process unit"]
- **State assertion**: [observable state before → action → after for state-changing claims; "N/A" otherwise]
- **Mock boundary rationale**: [which boundaries may be mocked and why; "none" when all real]
- **Proven by**: [`new: <file> — <test title>` or `existing: <file> — <test title>`; for `new`, the defect it catches that no other test catches]
- **Residual**: [what this proof leaves unestablished, if any]

## Completion Criteria
- [ ] All added tests pass, and the run is substantive (no always-true assertions, no 0-match runner reports, no skipped tests on the running path)
- [ ] Operation verified per Operation Verification Methods above
- [ ] Each Proof Obligation is met: the test turns red under its primary failure mode and exercises the stated boundary
- [ ] Deliverables created (for research/design tasks)

## Notes
- Impact scope: [Areas where changes may propagate]
- Scope boundary: [Files to preserve unchanged — path and reason]
