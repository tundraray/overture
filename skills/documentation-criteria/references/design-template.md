# [Feature Name] Design Document — [part-name]

<!--
Reader order: header → Snapshot → what the part is and is not → design → how it is proven → Appendix: Evidence → Update History.
Text inside these comments is guidance for the author; it is not copied into the document.
Rules for every section: "Writing for the Reader" in documentation-criteria — current truth only (no who/when/which-review in the body),
a section marked "when applicable" is deleted when it does not apply (no N/A stub), paragraphs of at most four sentences, table cells of one phrase.
-->

| Status | Date | PRD | UXRD | Depends on |
|---|---|---|---|---|
| Draft / Approved | YYYY-MM-DD | [prd.md](./prd.md) | [uxrd.md](./uxrd.md) or — | [`design-[part].md`] or — |

## Snapshot

<!-- At most ten lines. A reader who stops here knows what changes, what does not, and what could go wrong. -->

- **Changes**: [two or three sentences — what this part adds or changes, in the user's and the system's terms]
- **Does not change**: [the one or two things a reader would otherwise assume change]
- **Biggest risk**: [one line, or "none above low"]
- **Open questions**: [count, with a link to Open Questions, or "none"]

### Key Decisions

<!-- Three to seven rows: the decisions a reviewer would argue about. Every other section cites the ID instead of re-arguing it. -->

| ID | Decision | Why | Rejected alternative |
|---|---|---|---|
| KD-1 | [what was decided] | [one phrase] | [the option not taken, one phrase] |

## Part

- **Part**: `[part-name]` — one entry of the PRD's Delivery Parts section (on the gamedev path, of the feature spec's Delivery Parts section)
- **Covers**: [requirement ids this part owns — the PRD holds their text]
- **Depends on**: [`design-[other-part].md` — the approved designs whose contracts this design consumes as written], or "none — first part"
- **Sibling parts**: [other parts of this feature; their requirements are out of scope here and appear only as contracts]

### Agreement Checklist

#### Scope
- [ ] [Features/components to change]
- [ ] [Features to add]

#### Non-Scope (Explicitly not changing)
- [ ] [Features/components not to change]
- [ ] [Existing logic to preserve]
- [ ] [Requirements owned by sibling parts]

#### Constraints
- [ ] Parallel operation: [Yes/No]
- [ ] Backward compatibility: [Required/Not required]
- [ ] Performance measurement: [Required/Not required]

## Acceptance Criteria (AC) - EARS Format

<!--
EARS keywords: When (event-triggered) · While (state-dependent) · If-then (conditional) · none (ubiquitous).
Format: [Keyword] <trigger/condition>, the system shall <expected behavior>.
Group by the PRD requirement each AC refines; the requirement text stays in the PRD.
-->

### [Requirement ID]: [short name]

- [ ] **When** user clicks login button with valid credentials, the system shall authenticate and redirect to dashboard
- [ ] **If** credentials are invalid, **then** the system shall display the invalid-credentials error (UXRD copy, `uxrd.md` E-2)

## Design

### Change Impact Map

```yaml
Change Target: [Component/feature to change]
Direct Impact:
  - [Files/functions requiring direct changes]
  - [Interface change points]
Indirect Impact:
  - [Data format changes]
  - [Processing time changes]
No Ripple Effect:
  - [Explicitly specify unaffected features]
```

### Architecture (C1–C4)

<!-- Diagrams carry this section; prose states only what a picture cannot — why. Every diagram follows the `mermaid-diagrams` skill (palette, path animation, redraw test); the levels are specified in its `references/c4-levels.md`. Node colour shows the change: green new, red changed, black unchanged. -->

#### C1 · Context

<!-- When applicable: an external actor or system changes behaviour. `flowchart LR`, ≤ 6 nodes: the product as one box, the people and external systems that use the running change. -->

#### C2 · Containers

<!-- `flowchart LR`, ≤ 8 nodes: apps, services, stores, and the calls between them inside a dashed product boundary. -->

| Container | Role | Change |
|---|---|---|
| [name] | [one line] | [NEW] / [MODIFY] / [READ] |

#### C3 · Components: [container]

<!-- One subsection per container marked [NEW] or [MODIFY] in C2. One `flowchart TB` per flow the part touches, titled **[container] — [flow]**, ≤ 10 nodes: caller on top, the container's components in call order inside its boundary, stores and external systems at the bottom. -->

| Component | Responsibility in this flow | Change |
|---|---|---|
| [name] | [one line] | [NEW] / [MODIFY] / [READ] |

#### C4 · Code flow: [scope]

<!-- When applicable: modules change. One vertical `flowchart TB` chain per entry point: changed classes, functions, or components as frames, step nodes `N · Name<br/>what it does`, arrows step to step, the return leg as its own steps. -->

**Code locations:**

- [relative link to file] — [a few general words, or nothing]

| Type | Name | Change | Notes |
|---|---|---|---|
| [Controller / Service / Component / Hook / ...] | [name as in code] | [NEW] / [MODIFY] | [route, rule, or constraint in words — no code] |

### Runtime Flows

<!-- One flow per user-visible behaviour in the acceptance criteria. The sequence diagram is the flow: drawn at C2 (participants are C2 nodes, under the same names), one journey shape across all flows, path animation per the `mermaid-diagrams` skill. -->

#### Flow 1: [name]

**Starts when:** [user action / request / event / schedule] · **AC:** [AC ids]

[`sequenceDiagram`]

**Outcome:** [result and persisted state the diagram does not show]

**Failure handling:**

- [what can go wrong] → [how it is handled, what the caller sees]

### Integration Points List

| Integration Point | Location | Old Implementation | New Implementation | Switching Method |
|-------------------|----------|-------------------|-------------------|------------------|
| Integration Point 1 | [Class/Function] | [Existing Process] | [New Process] | [DI/Factory etc.] |

### Contract Definitions

<!-- Contracts are tables, not source code. The schema, interface, or type is written at implementation from these tables; a code block here is a second copy that drifts from the first. -->

| Operation | Input | Output | Errors |
|---|---|---|---|
| [route / method / event name] | [shape name or "none"] | [status + shape name] | [status + error code, per case] |

#### [Shape name]

| Field | Type | Constraint | Meaning |
|---|---|---|---|
| [field] | [string / number / enum (a, b) / [Other shape] / nullable] | [required, length, range, format] | [what it is for the caller] |

### Data Contract

#### Component 1

```yaml
Input:
  Type: [Shape name from Contract Definitions]
  Preconditions: [Required items, format constraints]
  Validation: [Validation method]

Output:
  Type: [Shape name from Contract Definitions]
  Guarantees: [Conditions that must always be met]
  On Error: [Exception/null/default value]

Invariants:
  - [Conditions that remain unchanged before and after processing]
```

### Frontend Design (frontend parts only)

<!-- When a UXRD exists, its reuse and state tables are the source: cite them by ID and record here only what the design adds (paths, the technical decision). -->

#### Existing Component Reuse Map

| UI Element | Decision | Existing Component | Rationale |
|---|---|---|---|
| [element] | reuse / extend / new | [path or —] | [for `new`: what was searched and why nothing fit] |

#### State × Display Matrix

| Component | default | loading | empty | error | partial |
|---|---|---|---|---|---|
| [component] | [what renders] | [...] | [...] | [...] | [... or "—" when the state cannot occur] |

#### UI Action-API Contract Mapping

| UI Action | API Contract (from `dependsOn` design) | Request | Response handled | Error handled |
|---|---|---|---|---|
| [action] | [endpoint or operation, as written in the upstream design] | [shape] | [shape → state] | [status → state] |

### State Transitions and Invariants

<!-- When applicable: an entity moves through states. A `stateDiagram-v2`, then the invariants. -->

```yaml
System Invariants:
  - [Conditions that hold in any state]
```

### Error Handling

[Types of errors and how to handle them]

### Logging and Monitoring

[What to record in logs and how to monitor]

## Implementation Plan

### Implementation Approach

**Selected Approach**: [Approach name or combination]
**Selection Reason**: [Reason considering project constraints and technical dependencies]

### Technical Dependencies and Implementation Order

1. **[Component/Feature A]** — [why first; what depends on it]
2. **[Component/Feature B]** — [why after A]

### Integration Points

<!-- Each integration point names how it is verified. One integration case proves the wiring; E2E is reserved for the part's 1–2 journeys (`integration-e2e-testing`). -->

- **[Name]**: [Component A] → [Component B] — verified by [how]

### Migration Strategy

<!-- When applicable: existing data or behaviour must move. -->

[Technical migration approach, ensuring backward compatibility]

## Test Strategy

<!-- Use cases, in the words of the domain: who acts, from what state, what they do, what they observe. Every acceptance criterion is covered by at least one use case. No test code, test file names, framework, fixture, or helper names — how a use case becomes a test is decided by `acceptance-test-generator` and the task files. Delete a subsection that has no use cases. -->

### Main Use Cases

- **UC-1: [short name]** — covers [AC ids]
  - Given: [starting state, in domain terms]
  - When: [what the user or calling system does]
  - Then: [what they observe — concrete values, counts, status]

### Error and Edge Use Cases

- **UC-E1: [short name]** — covers [AC ids]
  - Given: [state that leads to the failure or boundary]
  - When: [action]
  - Then: [observable outcome — what the user sees, what stays unchanged]

### Non-Functional Use Cases

- **UC-N1: [short name]** — covers [NFR / AC ids]
  - Given: [load or data volume]
  - When: [action]
  - Then: [measurable threshold]

## Security Considerations

<!-- Answer each item against this part's trust boundaries. An item with no relevant boundary gets one line saying why — an unanswered question is not the same as an inapplicable one. -->

- **Authentication & Authorization**: [what protects new entry points and resource access]
- **Input Validation**: [where external input enters and how it is validated]
- **Sensitive Data Handling**: [what needs protection; what may appear in logs and error responses]

## Verification Strategy

<!-- What correctness means for this change and how it will be proven, at design time — distinct from the L1/L2/L3 completion tiers at task execution. -->

### Correctness Proof Method

- **Correctness definition**: [what "correct" means here]
- **Verification method**: [specific technique]
- **Verification timing**: [when]

### Early Verification Point

- **First verification target**: [smallest unit proving the approach works]
- **Success criteria**: [observable outcome]
- **Failure response**: [what to do if it fails]

### Output Comparison

<!-- When applicable: the design replaces or modifies existing behaviour. -->

- **Comparison input**: [identical input used for both implementations]
- **Expected output fields**: [specific fields compared]
- **Diff method**: [file diff, field-by-field JSON, row count plus spot check]
- **Transformation pipeline coverage**: [each step from codebase analysis `dataTransformationPipelines` and what the comparison covers]

## Risks and Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [Risk 1] | High/Medium/Low | High/Medium/Low | [Countermeasure] |

## Future Extensibility

<!-- When applicable. Capability-level items considered and excluded; element-level rejected alternatives belong in Appendix: Evidence → Minimal Surface Alternatives. -->

- **Deferred possibilities**: [capability — the requirement it would have served]
- **Intentional limitations**: [what was kept small, and why]

## Open Questions

<!-- When applicable. Each names the decision it blocks and who resolves it. -->

- [ ] [Question]: [blocks what] — [who resolves]

## Appendix: Evidence

<!-- The record that the design was grounded: the reviewer checks it, the reader reaches it by link. Nothing here restates the body; the body cites rows here by ID (fact_id, KD-n). -->

### Design Summary (Meta)

```yaml
design_type: "new_feature|extension|refactoring"
risk_level: "low|medium|high"
complexity_level: "low|medium|high"
complexity_rationale: "[Required if medium/high: (1) which requirements/ACs necessitate this complexity, (2) which constraints/risks it addresses]"
main_constraints:
  - "[constraint]"
biggest_risks:
  - "[risk]"
unknowns:
  - "[uncertainty]"
```

### Prerequisite ADRs

<!-- When applicable: an ADR exists that this design follows. -->

- [ADR File Name]: [Related decision items]

### Applicable Standards

<!-- Found before design work began. At least 3 explicit and 2 implicit; an implicit standard is confirmed with the user before the design relies on it. -->

| Standard | Type | Source | Impact on Design |
|----------|------|--------|-----------------|
| [e.g. Biome strict mode] | explicit | [biome.json] | [All new code must pass strict linting] |

### Existing Codebase Analysis

#### Implementation Path Mapping

| Type | Path | Description |
|------|------|-------------|
| Existing | src/[actual-path] | [Current implementation] |
| New | src/[planned-path] | [Planned new creation] |

#### Integration Point Map

```yaml
Integration Point 1:
  Existing Component: [Component/module name, function/method name]
  Integration Method: [Hook Addition / Call Addition / Data Reference / ...]
  Impact Level: High (process flow change) / Medium (data usage) / Low (read-only)
  Required Test Coverage: [Continuity verification of existing features]
```

#### Code Inspection Evidence

- **Examined**: [path:function] — [relevance]
- **Finding**: [finding, with the `code-explorer` coverage and `resolvedBy` that supports it] → [design decision it drives]

#### Data Representation Decision

<!-- When applicable: a new data structure is introduced. -->

| Data Structure | Decision | Rationale |
|---|---|---|
| [e.g. UserProfile] | **Reuse** existing [type] + extend | [one phrase] |

#### Field Propagation Map

<!-- When applicable: the change crosses layers. -->

```yaml
fields:
  - name: "[fieldName]"
    origin: "[API Request / Database / User Input]"
    transformations:
      - layer: "[API Layer]"
        type: "[RequestDTO]"
        validation: "[required, max 255 chars]"
    destination: "[Database table.column / API Response / UI Component]"
    loss_risk: "none | low | medium | high"
    loss_risk_reason: "[required when risk > none]"
```

#### Fact Disposition Table

<!-- One row per `focusAreas` entry from codebase analysis. Other sections cite the row by `fact_id` rather than restating it. A row per fact with an explicit disposition makes deliberate removal distinguishable from oversight. -->

| Fact ID | Focus Area | Disposition | Rationale | Evidence | Related Files |
|---------|------------|-------------|-----------|----------|---------------|
| [fact_id] | [area name] | preserve / transform / remove / out-of-scope | [preserve: "retained without modification"; transform: the new observable outcome; remove: reason plus PRD/UXRD citation; out-of-scope: the scope-defining section] | [evidence verbatim from focusAreas] | [paths from focusAreas.relatedFiles] |

#### Cross-Layer Assumptions

<!-- When applicable: this design relies on unverified claims from a prior-layer Design Doc. -->

- [claim]: [justification]; verify at [step or artifact]

### Minimal Surface Alternatives

<!--
When applicable: the design introduces persistent state, a public-contract element or cross-boundary field/prop, a behavioral mode/flag/variant, or a reusable abstraction / component split.
One entry per element. Resolution priority for "smallest": new persistent state → crosses a boundary → new concept/mode/flag/prop → breaking change or migration → subjective cost.
Backend columns: "Crosses module/service boundary", "New concept / mode / flag"; frontend: "Crosses component boundary", "New props / modes / variants".
-->

#### Element 1: [name of the new element]

- **Fixed requirements**: [AC reference]: [requirement]

| Alternative | Requirements covered (AC ref) | New persistent state (count) | New concept / mode / flag / prop (count) | Crosses boundary (yes/no) | Breaking change or migration (yes/no) | Cost notes |
|---|---|---|---|---|---|---|
| [The added element as proposed] | | | | | | |
| [Subtractive alternative] | | | | | | |

- **Selected**: [alternative] — [smallest considered; or the fixed requirement the smaller ones fail]
- **Rejected**: [alternative] — [one line why]

### Test Boundaries

| Component/Dependency | Mock? | Rationale |
|---------------------|-------|-----------|
| [External API / DB / file system / etc.] | [Yes/No] | [Why this boundary was chosen] |

- **Schema dependencies**: [tables/models this part reads or writes, with paths to their definitions]
- **Test data source**: [real database or substituted, in one phrase — fixtures and helpers are test code, not design]
- **Mock limitations acknowledged**: [what cannot be reliably tested with mocks alone]
- **Integration verification points**: [integration points requiring testing beyond unit-level mocks]

### References

- [Related documentation and links]

## Update History

<!-- One line per version, newest last: what changed in the design, in a phrase. No reviewer IDs, no "user decision of <date>" — the body states the current truth, this table says when it changed. -->

| Version | Date | Change |
|---------|------|--------|
| 1.0 | YYYY-MM-DD | Initial version |
