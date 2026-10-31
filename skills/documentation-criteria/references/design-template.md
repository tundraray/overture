# [Feature Name] Design Document — [part-name]

<!--
Reader order: header → Snapshot → what the part is and is not → design → how it is proven → Appendix: Evidence → Update History.
Text inside these comments is guidance for the author; it is not copied into the document.
Every section follows "Writing for the Reader" in documentation-criteria: written for a cold reader, in sentences rather than shorthand,
at the design's altitude rather than the code's; a section marked "when applicable" is deleted when it does not apply.
-->

| Status | Date | PRD | UXRD | Depends on |
|---|---|---|---|---|
| Draft / Approved | YYYY-MM-DD | [prd.md](./prd.md) | [uxrd.md](./uxrd.md) or — | [`design-[part].md`] or — |

## Snapshot

<!-- At most ten lines. A cold reader who stops here can say what this part does, how it works in outline, and what could go wrong. -->

**Overview.** [Three to five plain sentences: the problem this part solves, what it adds or changes, and how it works in outline — as you would explain it to a colleague who has not followed the feature. No IDs, no code names the reader has not met.]

- **Does not change**: [the one or two things a reader would otherwise assume change]
- **Biggest risk**: [one line, or "none above low"]
- **Open questions**: [a link to Open Questions, or "none"]

### Key Decisions

<!-- Three to seven rows: the decisions a reviewer would argue about, each with every option not taken. This is the one place a decision is argued; every other section cites the ID instead of re-arguing it.
The Rejected alternatives cell names the options; why each was not taken is a sentence under the table.
When choosing, prefer the option adding the least: new persistent state, then crossing a boundary, then a new concept/mode/flag/prop, then a breaking change. -->

| ID | Decision | Why | Rejected alternatives |
|---|---|---|---|
| KD-1 | [what was decided, in a sentence] | [the reason, in words a newcomer follows] | [each option not taken, by name] |

[KD-1: why each rejected option was not taken, in a sentence or two.]

### Terms

<!-- When applicable: the document leans on five or more words a cold reader may not know. -->

- **[word]** — [what it means in this design, in a few plain words]

## Part

- **Part**: `[part-name]` — one entry of the PRD's Delivery Parts section (on the gamedev path, of the feature spec's Delivery Parts section)
- **Covers**: [requirement ids this part owns — the PRD holds their text]
- **Depends on**: [link to the contract section of each approved upstream design, e.g. `design-[other-part].md#contract-definitions` — cited, never restated: a copy forces a revision every time upstream changes], or "none — first part"
- **Sibling parts**: [other parts of this feature; their requirements are out of scope here and appear only as contracts]

<!-- Scope as agreed with the user. What changes is the Change column of the C2, C3, and C4 tables; this section says what does not, and what the design must respect. -->

**Out of scope**

- [existing behaviour, component, or data this part leaves as it is, in a sentence]

**Constraints**

- [each agreed constraint — parallel operation, backward compatibility, performance measurement — in a sentence, with how the design meets it]

## Acceptance Criteria (AC) - EARS Format

<!--
A PRD criterion that already states testable behaviour applies as written: cite its ID under its requirement, do not restate it.
Write an EARS criterion only where the design refines a PRD criterion into system behaviour the PRD does not spell out — a trigger, a state, an error case.
No table mapping criteria to sections or use cases, and no prose saying where each one is handled: each use case in Test Strategy names the criteria it covers.
EARS keywords: When (event-triggered) · While (state-dependent) · If-then (conditional) · none (ubiquitous).
Format: [Keyword] <trigger/condition>, the system shall <expected behavior>.
-->

### [Requirement ID]: [short name]

- Applies as written: [PRD AC ids]
- [ ] **When** user clicks login button with valid credentials, the system shall authenticate and redirect to dashboard
- [ ] **If** credentials are invalid, **then** the system shall display the invalid-credentials error (UXRD copy, `uxrd.md` E-2)

## Design

### Architecture (C1–C4)

<!-- Diagrams carry this section; prose states only what a picture cannot — why. Every diagram follows the `mermaid-diagrams` skill (palette, path animation, redraw test); the levels are specified in its `references/c4-levels.md`. Node colour shows the change: green new, red changed, black unchanged. The Change columns of the C2, C3, and C4 tables are the change impact: built from the resolved consumer list, they name every changed caller; what stays untouched is in Part, Out of scope. -->

#### C1 · Context

<!-- When applicable: an external actor or system changes behaviour. `flowchart LR`, ≤ 6 nodes: the product as one box, the people and external systems that use the running change. -->

#### C2 · Containers

<!-- `flowchart LR`, ≤ 8 nodes: apps, services, stores, and the calls between them inside a dashed product boundary. -->

| Container | Role | Change |
|---|---|---|
| [name] | [one line] | [NEW] / [MODIFY] / [REMOVE] / [READ] |

#### C3 · Components: [container]

<!-- One subsection per container marked [NEW] or [MODIFY] in C2. One `flowchart TB` per flow the part touches, titled **[container] — [flow]**, ≤ 10 nodes: caller on top, the container's components in call order inside its boundary, stores and external systems at the bottom. -->

| Component | Responsibility in this flow | Change |
|---|---|---|
| [name] | [one line] | [NEW] / [MODIFY] / [REMOVE] / [READ] |

#### C4 · Code flow: [scope]

<!-- When applicable: modules change. One vertical `flowchart TB` chain per entry point: changed classes, functions, or components as frames, step nodes `N · Name<br/>what it does`, arrows step to step, the return leg as its own steps. -->

**Code locations:**

- [relative link to file] — [a few general words, or nothing]

| Type | Name | Change | Notes |
|---|---|---|---|
| [Controller / Service / Component / Hook / ...] | [name as in code] | [NEW] / [MODIFY] / [REMOVE] | [route, rule, or constraint in words — no code] |

### Runtime Flows

<!-- One flow per user-visible behaviour in the acceptance criteria. The sequence diagram is the flow: drawn at C2 (participants are C2 nodes, under the same names), one journey shape across all flows, path animation per the `mermaid-diagrams` skill. -->

#### Flow 1: [name]

**Starts when:** [user action / request / event / schedule] · **AC:** [AC ids]

[`sequenceDiagram`]

**Outcome:** [result and persisted state the diagram does not show]

**Failure handling:**

- [what can go wrong] → [how it is handled, what the caller sees]

### Integration Points List

<!-- Each integration point names how it is verified. One integration case proves the wiring; E2E is reserved for the part's 1–2 journeys (`integration-e2e-testing`). -->

| Integration Point | Location | Old Implementation | New Implementation | Switching Method | Verified by |
|-------------------|----------|-------------------|-------------------|------------------|-------------|
| Integration Point 1 | [Class/Function] | [Existing Process] | [New Process] | [DI/Factory etc.] | [integration case / E2E journey] |

### Contract Definitions

<!-- What each operation offers its caller, at the design's altitude ("Writing for the Reader"): what it does, what it returns, which failures the caller handles. Contracts are tables, not source code — the schema or type is written at implementation; a code block here, or a table that copies one field by field, is a second copy that drifts.
A precondition or guarantee the row does not make obvious is one or two sentences under the table. -->

| Operation | What it does | Output | Errors |
|---|---|---|---|
| [route / method / event name] | [what it does for the caller, naming its input, in a sentence] | [status + shape name] | [status + error code, per case] |

#### Interface Change Matrix

<!-- When applicable: an existing operation, signature, or prop changes. One row per change, from the resolved consumer list. An indirect effect on an unchanged caller — a data format or timing change — is recorded in How existing callers keep working. -->

| Existing | New | Conversion required | How existing callers keep working |
|---|---|---|---|
| [operation or prop as it is] | [as it becomes] | [yes / no] | [adapter, wrapper, or migration path — or "unchanged"] |

#### [Shape name]

<!-- Only for a shape another part or the UI uses; any other shape is named in a sentence. The fields a caller must understand. A length, size, or format limit is written only when a requirement sets it or another part relies on it, and then in Meaning with its source. -->

| Field | Type | Meaning |
|---|---|---|
| [field] | [string / number / enum (a, b) / [Other shape]; optional or nullable] | [what it is for the caller] |

### Data Model

<!-- When applicable: the part adds or changes persistent stores. What each store holds, how stores relate, and the constraints that keep the invariants — not column lists, types, or indexes: those are the migration's. -->

| Store | Holds | Related to | Enforces |
|---|---|---|---|
| [table / collection / key space] | [what one record is, in words] | [other store, and how] | [the invariant this store guarantees, or —] |

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

<!-- When applicable: an entity moves through states. A `stateDiagram-v2`, then the invariants as plain sentences — the rule, not the mechanism that enforces it. -->

**Invariants**

1. [a rule that holds in every state, in a sentence]

### Error Handling

[Types of errors and how to handle them]

### Logging and Monitoring

[What to record in logs and how to monitor]

### Implementation Approach

**Selected Approach**: [vertical / horizontal / hybrid] — [one-line reason]

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

<!-- When applicable. Capability-level items considered and excluded; element-level rejected alternatives belong in Key Decisions. -->

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

<!-- Found before design work began: the standards the design relies on, with no count to reach. An implicit standard is confirmed with the user at the Design Doc approval stop. -->

| Standard | Type | Source | Impact on Design |
|----------|------|--------|-----------------|
| [e.g. Biome strict mode] | explicit | [biome.json] | [All new code must pass strict linting] |

### Existing Codebase Analysis

#### Code Inspection Evidence

- **Examined**: [path:function] — [relevance]
- **Finding**: [finding, with the `code-explorer` coverage and `resolvedBy` that supports it] → [KD-n or section it drives]

#### Field Propagation Map

<!-- When applicable: the change crosses layers. -->

```yaml
fields:
  - name: "[fieldName]"
    origin: "[API Request / Database / User Input]"
    transformations:
      - layer: "[API Layer]"
        transformation: "[what happens to the field here]"
    destination: "[Database table.column / API Response / UI Component]"
    loss_risk: "none | low | medium | high"
    loss_risk_reason: "[required when risk > none]"
```

#### Fact Disposition Table

<!-- One row per `focusAreas` entry from codebase analysis, one phrase per cell. The analyzer output already holds the evidence and files; this table records only what happened to each fact and where. A row per fact with an explicit disposition makes deliberate removal distinguishable from oversight. -->

| Fact ID | Disposition | Handled in |
|---------|-------------|------------|
| [fact_id] | preserve / transform / remove / out-of-scope | [KD-n or section] |

#### Cross-Layer Assumptions

<!-- When applicable: this design relies on unverified claims from a prior-layer Design Doc. -->

- [claim]: [justification]; verify at [step or artifact]

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

<!-- One line per version, newest last: what changed in the design, in a phrase. No reviewer IDs, no "user decision of <date>" — the body states the current truth, this table says when it changed.
After approval the design changes only when a decision, contract, or AC changes; implementation details found during execution (package versions, file or function names) go to the task files, not the design. -->

| Version | Date | Change |
|---------|------|--------|
| 1.0 | YYYY-MM-DD | Initial version |
