# [Feature Name] Design Document — [part-name]

<!-- Guidance for the author sits in comments like this one; every section follows "Writing for the Reader" in documentation-criteria. -->

**Status:** Draft / Approved · **Date:** YYYY-MM-DD · **PRD:** [prd.md](./prd.md) · **UXRD:** [uxrd.md](./uxrd.md) or none · **Depends on:** [`design-[part].md`] or nothing

## Snapshot

<!-- Answers: what is this, and what could go wrong? At most ten lines. -->

**Overview.** [Three to five plain sentences: the problem this part solves, what it adds or changes, and how it works in outline — as you would explain it to a colleague who has not followed the feature. No IDs, no code names the reader has not met.]

- **Does not change**: [the one or two things a reader would otherwise assume change]
- **Biggest risk**: [one line, or "none above low"]
- **Open questions**: [a link to Open Questions, or "none"]

### Key Decisions

<!-- Answers: why is it built this way and not another? Three to seven decisions a reviewer would argue about, each with every option not taken. This is the one place a decision is argued; every other section cites the ID instead of re-arguing it. A breaking change to an existing contract, and a data migration, are decisions here.
When choosing, prefer the option adding the least: new persistent state, then crossing a boundary, then a new concept/mode/flag/prop, then a breaking change. -->

#### KD-1: [what was decided, in one sentence]

[Why, in words a newcomer follows. Then each option not taken, by name, and why it was not taken — a sentence or two each.]

## Terms

<!-- When applicable: the document leans on five or more words a cold reader may not know. -->

- **[word]** — [what it means in this design, in a few plain words]

## Part

<!-- Answers: what does this part cover, and what does it leave alone? Scope as agreed with the user: what this part leaves as it is, and what the design must respect. -->

- **Part**: `[part-name]` — one entry of the PRD's Delivery Parts section (on the gamedev path, of the feature spec's Delivery Parts section)
- **Covers**: [the ID of each requirement this part owns — the PRD holds the full text]
- **Depends on**: [link to the contract section of each approved upstream design, e.g. `design-[other-part].md#contract-definitions` — cited, never restated: a copy forces a revision every time upstream changes], or "none — first part"
- **Prerequisite ADRs**: [a link to each existing ADR this design follows], or "none"
- **Sibling parts**: [other parts of this feature; their requirements are out of scope here and appear only as contracts]

**Out of scope**

- [existing behaviour, component, or data this part leaves as it is, in a sentence]

**Constraints**

- [each agreed constraint — parallel operation, backward compatibility, performance measurement — in a sentence, with how the design meets it]

## Acceptance Criteria

<!--
Answers: what must be true when this part is done?
A PRD criterion that already states testable behaviour is cited by its ID under its requirement, never restated in words.
Write a criterion of your own only where the design refines a PRD criterion into system behaviour the PRD does not spell out — a trigger, a state, an error case. Give it an ID (`DC-1`, `DC-2`) so flows and use cases can cite it.
Each is one plain sentence a person reads: what happens, and when. No table mapping criteria to sections or use cases, and no prose saying where each one is handled: each use case in Test Strategy names the criteria it covers.
-->

### [Requirement ID]: [short name]

- From the PRD: [the IDs of the criteria that hold as written — AC-01.1, AC-01.2]
- When a user signs in with valid credentials, they land on the dashboard (DC-1).
- When the credentials are wrong, the sign-in form shows the invalid-credentials message (`uxrd.md` MC-2) and the user stays on it (DC-2).

## Design

### Architecture (C1–C4)

<!-- Answers: how does it work? Diagrams carry this section; prose states only what a picture cannot — why. Every diagram follows the `mermaid-diagrams` skill; which levels are drawn, and how, is in its `references/c4-levels.md`. Delete the subsection of a level not drawn. -->

#### C1 · Context

<!-- `references/c4-levels.md`, "C1 · Context". -->

#### C2 · Containers

<!-- `references/c4-levels.md`, "C2 · Containers". -->

#### C3 · Components: [container]

<!-- `references/c4-levels.md`, "C3 · Components". -->

#### C4 · Code flow: [scope]

<!-- `references/c4-levels.md`, "C4 · Code flow". -->

### Runtime Flows

<!-- One flow per acceptance criterion that crosses a container boundary or has a failure path that changes state; every other criterion is covered by its use cases in Test Strategy. The sequence diagram is the flow: drawn at container level (participants are containers, under their C2 names), one journey shape across all flows, path animation per the `mermaid-diagrams` skill. -->

#### Flow 1: [name]

**Starts when:** [user action / request / event / schedule], for [the IDs of the criteria this flow delivers]

[`sequenceDiagram`]

**Outcome:** [result and persisted state the diagram does not show]

**Failure handling:**

- [what can go wrong] → [how it is handled, what the caller sees]

### Contract Definitions

<!-- Answers: what can a caller — another part, the UI — rely on? What each operation offers its caller, at the design's altitude ("Writing for the Reader"). Sibling parts cite this section. No source code and no full copy of a schema — the schema or type is written at implementation. An exact value a caller or the work plan relies on is written exactly: limits, enum values, status codes, timeouts, setting names and defaults. -->

- **[route / method / event name]** — [what it does for the caller, naming its input, in a sentence]. Returns [result, by name]. [Each failure the caller handles, and what it sees.]

<!-- Only for a shape another part or the UI uses: the fields a caller must understand, as a list, with the exact limits and allowed values it relies on. -->

**[Shape name]**

- `[field]` — [what it is for the caller; optional or nullable when it is; its limit or allowed values when a caller relies on them]

**Error handling**

<!-- When applicable: errors several operations share. -->

- `[ERROR_CODE]` — [status code, when it happens, what the caller sees]

**Runtime settings**

<!-- When applicable: each setting the part reads. -->

- `[SETTING_NAME]` — default `[value]`; [what it changes]

### Data Model

<!-- When applicable: the part adds or changes persistent stores. In sentences: what each store holds, how stores relate, and the invariant each store guarantees — not columns, types, or indexes: those are the migration's. -->

[What is stored, how the stores relate, and which rule each store enforces.]

### State Transitions and Invariants

<!-- When applicable: an entity moves through states. A `stateDiagram-v2`, then the invariants as plain sentences — the rule, not the mechanism that enforces it. -->

**Invariants**

1. [a rule that holds in every state, in a sentence]

## Test Strategy

<!-- Answers: how will we know it works? Use cases, in the words of the domain: who acts, from what state, what they do, what they observe. Every acceptance criterion is covered by at least one use case. No test code, test file names, framework, fixture, or helper names — how a use case becomes a test is decided by `acceptance-test-generator` and the task files. Delete a subsection that has no use cases. -->

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

<!-- Answers: who could misuse it, and what protects against that? Answer each item against this part's trust boundaries. An item with no relevant boundary gets one line saying why — an unanswered question is not the same as an inapplicable one. -->

- **Authentication & Authorization**: [what protects new entry points and resource access]
- **Input Validation**: [where external input enters and how it is validated]
- **Sensitive Data Handling**: [what needs protection; what may appear in logs and error responses]

## Risks and Mitigation

<!-- Answers: what could go wrong, and what reduces it? -->

- **[Risk, in a sentence]** — [impact and how likely, in a few words]. [How the design reduces it.]

## Open Questions

<!-- When applicable. Answers: what is not decided yet? Each names the decision it blocks and who resolves it. -->

- [The question, in a sentence] It blocks [which decision]; [who] resolves it.

## Appendix: Fact Disposition

<!-- What the design does with the existing behaviour codebase analysis found (`focusAreas`). A row only for a fact the design transforms, removes, or puts out of scope, one phrase per cell; the facts it preserves go in one sentence under the table. Every fact appears once, so a deliberate removal is distinguishable from an oversight. The analyzer output holds the evidence; this records only what happened to each fact, the file it lives in, and where the design handles it. -->

| Fact | Disposition | Handled in |
|------|-------------|------------|
| [the fact in a few words, the file it lives in (fact_id)] | transform / remove / out-of-scope | [the decision or section, in words with its ID] |

The design preserves [each remaining fact in a few words, with its fact_id].

## Update History

<!-- One line per version, newest last: what changed in the design, in a phrase. No reviewer IDs, no "user decision of <date>" — the body states the current truth, this table says when it changed.
After approval the design changes only when a decision, contract, or AC changes; implementation details found during execution (package versions, file or function names) go to the task files, not the design. -->

| Version | Date | Change |
|---------|------|--------|
| 1.0 | YYYY-MM-DD | Initial version |
