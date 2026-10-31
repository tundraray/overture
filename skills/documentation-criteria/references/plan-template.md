---
feature: [feature-name]           # directory under docs/features/
part: [part-name]                 # directory holding this plan
design: design-[part-name].md     # governing design, at feature level; `none` for a simplified plan (the PRD or feature spec is the specification)
plan: 1 of 1                      # position in the part, and expected total
status: draft                     # draft | active | completed
depends-on:                       # previous plan filename; omit for the first
temporary: true                   # AI working file — see documentation-criteria
---

<!--
Temporary AI working file — not in git, deleted after the feature ships. It must state exactly what the documentation states; nothing else is judged.
Text inside these comments is guidance for the author; it is not copied into the document.
-->

# Work Plan: [Feature Name] — [part-name]

Created Date: YYYY-MM-DD
Type: feature|fix|refactor

## Snapshot

<!-- What gets built, in what order, and what could go wrong. The why of the feature is the PRD's and the design's; cite them, don't retell them. -->

**Overview.** [Three to five plain sentences: what this plan builds, in what order, and why that order — including the implementation approach (vertical, horizontal, or hybrid, per `implementation-approach`) and its reason.]

- **Does not change**: [what a reader would otherwise assume this plan touches]
- **Biggest risk**: [one line, and the task that meets it first]
- **Open questions**: [each question and who resolves it, or "none"]
- **Design items no task covers**: [each item, why it is left out, and that the user confirmed it — or "none"]

## Implementation Phases

<!-- Phases follow the technical dependencies the Design Doc's components and contracts show, and the approach named in the Overview. Repeat the phase block per phase; the final phase is always Quality Assurance.
A task opens with one line saying, in words, what it delivers, ending with what it covers: the Design Doc section and AC IDs (the PRD's requirement IDs at small scale). Every Design Doc implementation target, connection or registration, contract change, verification requirement, and prerequisite is covered by some task line, or listed under "Design items no task covers" in the Snapshot.
Target Files, dependencies, and the tests it adds (by title, with what each proves) are sub-bullets. -->

### Phase 1: [Phase Name]
**Purpose**: [what this phase delivers, in one or two sentences]

#### Tasks
- [ ] Task 1: [what it delivers] — covers DD §[Section] / AC-[n]
- [ ] Task 2: [what it delivers] — covers DD §[Section] / AC-[n]

#### Operational Verification Procedures
1. [Operation verification steps — for each integration point this phase completes, where new code joins existing code]
2. [Expected result verification]
3. [Performance verification (when applicable)]

### Final Phase: Quality Assurance (Required)
**Purpose**: Overall quality assurance and Design Doc consistency verification

#### Tasks
- [ ] Verify all Design Doc acceptance criteria achieved
- [ ] Test set within the part budget (`testing-principles`, Test Selection); no two tests catch the same defect

#### Operational Verification Procedures
[End-to-end verification steps for the part's journeys]

## Verification Strategy

<!-- What correctness means for this part and how it will be proven — distinct from the L1/L2/L3 completion tiers at task execution. -->

- **Correctness definition and method**: [what "correct" means here, and the technique that proves it]
- **Early verification point**: [the smallest unit proving the approach works, its success criteria, and what to do if it fails] — run by [Phase X Task Y]
- **Output comparison** (when the part replaces existing behaviour): [identical input for both implementations, the fields compared, and how they are diffed]
- **Proof obligations**: from test skeleton annotations (primary failure mode, proof obligation) when skeletons exist; otherwise each AC's primary failure mode, plus every applicable Failure Mode Checklist category

## Risks and Countermeasures

- **Risk**: [Risk description]
  - **Impact**: [Impact assessment]
  - **Countermeasure**: [How to address it]

## Notes

<!-- When applicable: anything the executor must know that no section above holds. -->

## Appendix: Traceability

<!-- The record that the plan carries the design's exact values and constraints: the reviewer and the executors check it. A subsection marked "when applicable" is deleted when it does not apply. -->

### Reference Contract Values

<!-- When applicable: the Design Doc specifies a binding observable value the implementation must reproduce exactly — an exact value from Contract Definitions (a limit, enum value, status code, timeout, setting name or default), a column/label set and its order, a derived-display rule, or a state-lifecycle negative. Extract it from the Design Doc directly, not from a task line's summary. Serialized boundaries belong to the Connection Map; ADR-derived structural decisions to ADR Bindings. -->

| Design Doc (§ Section) | Contract Type | Required Observable Value (verbatim) | Covered By Task(s) |
|---|---|---|---|
| [docs/features/{feature}/design-{part}.md (§ Section)] | exact-value / structure-order / derived-display / state-lifecycle-negative | [exact value copied from the Design Doc — e.g. "the listed fields in the specified order"; "the label shows the looked-up name in place of the raw code"; "persisted state is applied only when an explicit restore signal is present"] | [Phase X Task Y] |

### Failure Mode Checklist

<!-- The categories: same-value, no-op, empty input, invalid option, missing config, unavailable boundary, shared-state dependency, rollback-only visibility, missing-sort-key ordering. Test suites most often omit them precisely because they are unglamorous. List only the ones that apply here, each with one phrase on where; none applies → "none". -->

| Category | Where it applies | Covered By Task(s) |
|---|---|---|
| [category] | [one phrase] | [Phase X Task Y] |

### UXRD Component → Task Mapping

<!-- When applicable: a UXRD is among the inputs. -->

| UXRD Element | States to Cover | Covered By Task(s) | Gap Status | Notes |
|---|---|---|---|---|
| [a UXRD element ID, or the Component Inventory name verbatim; never a section number] | [default / loading / empty / error / partial] | [Phase X Task Y] | covered | |

**Gap Status values**: `covered`, `gap` (requires justification in Notes and user confirmation before plan approval)

### ADR Bindings

<!-- When applicable: ADRs are provided as input or listed in the Design Doc's Prerequisite ADRs. One row per implementation-binding decision — one that constrains code placement, dependency direction, contract/schema shape, data flow, or persistence. Acceptance criteria and required behaviors live in the Design Doc. -->

| ADR | Source Section | Axis | Binding Decision | Covered By Task(s) |
|---|---|---|---|---|
| [docs/adr/ADR-XXXX.md] | Decision / Implementation Guidance | placement \| dependency_direction \| contract_schema \| data_flow \| persistence | [one binding decision sentence, copied or condensed from the named section] | [Phase X Task Y] |

### Connection Map

<!-- When applicable: the implementation crosses a package, service, or process boundary — or a value is serialized and re-parsed across a boundary even within one runtime: query strings, route/CLI arguments, environment variables, config entries, message payloads, storage keys, files. Producer and consumer must agree on the exact representation, and that agreement is invisible to the type system. -->

| Boundary | Owner (left side) | Owner (right side) | Serialized Format | Consumer Parse Rule | Expected Signal | Covered By Task(s) |
|---|---|---|---|---|---|---|
| [producing side → consuming side] | [file path(s)] | [file path(s)] | [exact representation the producer emits; "—" if not serialized] | [how the consumer decodes/validates it; "—" if not serialized] | [observable evidence the boundary works] | [Phase X Task Y on each side] |

## Update History

<!-- One line per version, newest last: what changed in the plan, in a phrase. -->

| Version | Date | Change |
|---------|------|--------|
| 1.0 | YYYY-MM-DD | Initial version |
