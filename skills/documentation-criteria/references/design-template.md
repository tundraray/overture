# [Feature Name] Design Document — [part-name]

<!-- Guidance for the author sits in comments like this one; every section follows "Writing for the Reader" in documentation-criteria. -->

**Status:** Draft / Approved · **Date:** YYYY-MM-DD · **PRD:** [prd.md](./prd.md) · **UXRD:** [uxrd.md](./uxrd.md) or none · **Depends on:** [`design-[part].md#contract-definitions`] or nothing

## Snapshot

<!-- Answers: what is this, why is it needed, and what could go wrong? At most ten lines. -->

**Overview.** [Three to five plain sentences: the problem this part solves, what it adds or changes, and how it works in outline — as you would explain it to a colleague who has not followed the feature. No IDs, no code names the reader has not met.]

- **Does not change**: [the one or two things a reader would otherwise assume change]
- **Biggest risk**: [one line, or "none above low"]
- **Open questions**: [a link to Open Questions, or "none"]

### Key Decisions

<!-- Answers: why is it built this way and not another? Three to seven decisions a reviewer would argue about. -->

#### KD-1: [what was decided, in one sentence]

[Why: the problem it settles and what it buys, in words a newcomer follows — the reason, not the mechanism behind it. Then the options a reviewer would raise, by name, and why each lost — a sentence or two each.]

## Terms

<!-- When applicable: the document leans on five or more words a cold reader may not know. -->

- **[word]** — [what it means in this design, in a few plain words]

## Part

<!-- Answers: what does this part leave alone, and what must the design respect? -->

- **Prerequisite ADRs**: [a link to each existing ADR this design follows], or "none"

**Out of scope**

- [existing behaviour, component, or data this part leaves as it is, in a sentence]

**Constraints**

- [each constraint agreed for this part — parallel operation, backward compatibility, performance measurement — in a sentence, with how the design meets it; the project's standing rules stay in project-context and the code system]

## Building-block Inventory

<!-- Answers: which blocks of this part follow a catalogued pattern, and which are new? A row only for a block that cites a code-system pattern or is `new`. Present when docs/code-system/ exists. -->

Follows the [code system](../../code-system/README.md).

| Building block | Pattern | Status | Note |
|---|---|---|---|
| [OrderService] | [service-module.md](../../code-system/patterns/service-module.md) | reused | — |
| [PaymentGateway client] | [outbound-adapter.md](../../code-system/patterns/outbound-adapter.md) | extended | [what was added — a method, a port] |
| [Refund scheduler] | [new pattern — KD-2](../../code-system/patterns/scheduled-job.md) | new | [what was searched in the catalogue and the code, and why nothing fit] |

## Acceptance Criteria

<!-- Answers: what must be true when this part is done? -->

### [Requirement ID]: [short name]

- From the PRD: [the IDs of the criteria that hold as written — AC-01.1, AC-01.2]
- When a user signs in with valid credentials, they land on the dashboard (DC-1).
- When the credentials are wrong, the sign-in form shows the invalid-credentials message (`uxrd.md` MC-2) and the user stays on it (DC-2).

## Design

### Architecture (C1–C4)

<!-- Answers: how does it work? Every diagram follows the `mermaid-diagrams` skill; which levels are drawn, and how, is in its `references/c4-levels.md`. Delete the subsection of a level not drawn. -->

#### C1 · Context

<!-- `references/c4-levels.md`, "C1 · Context". -->

#### C2 · Containers

<!-- `references/c4-levels.md`, "C2 · Containers". -->

#### C3 · Components: [container]

<!-- `references/c4-levels.md`, "C3 · Components". -->

#### C4 · Code flow: [scope]

<!-- `references/c4-levels.md`, "C4 · Code flow". -->

### Runtime Flows

<!-- Answers: what happens, step by step, when the system runs? One flow per acceptance criterion that crosses a container boundary or has a failure path that changes state, drawn per the `mermaid-diagrams` skill. -->

#### Flow 1: [name]

**Starts when:** [user action / request / event / schedule], for [the IDs of the criteria this flow delivers]

[`sequenceDiagram`]

[Only what the diagram cannot show: what is persisted, and a failure no contract states.]

### Contract Definitions

<!-- Answers: what can a caller — another part, the UI, an external system — rely on? Only what this part offers: a contract it consumes is the link under Depends on. Exact where a value crosses that boundary; nothing about what sits behind it. -->

- **[route / method / event name]** — [what it does for the caller, naming its input, in a sentence]. Returns [result, by name]. [Each failure the caller handles, and what it sees.]

**[Shape name]**

<!-- When applicable: a shape another part or the UI uses. -->

- `[field]` — [what it is for the caller; optional or nullable when it is; its limit or allowed values when a caller relies on them]

**Error handling**

<!-- When applicable: errors several operations share. -->

- `[ERROR_CODE]` — [status code, when it happens, what the caller sees]

**Runtime settings**

<!-- When applicable: settings an operator sets. -->

- `[SETTING_NAME]` — default `[value]`; [what it changes]

### Data Model

<!-- When applicable: the part adds or changes persistent stores. -->

[What is stored, how the stores relate, and which rule each store enforces.]

### State Transitions and Invariants

<!-- When applicable: an entity moves through states. -->

[`stateDiagram-v2`]

**Invariants**

1. [a rule that holds in every state, in a sentence]

## Security Considerations

<!-- Answers: who could misuse it, and what protects against that? One line when the part adds no new entry point. -->

- **Authentication & Authorization**: [what protects new entry points and resource access]
- **Input Validation**: [where external input enters and how it is validated]
- **Sensitive Data Handling**: [what needs protection; what may appear in logs and error responses]

## Risks and Mitigation

<!-- Answers: what could go wrong, and what reduces it? -->

- **[Risk, in a sentence]** — [impact and how likely, in a few words]. [How the design reduces it.]

## Open Questions

<!-- When applicable. Answers: what is not decided yet? -->

- [The question, in a sentence] It blocks [which decision]; [who] resolves it.

## Update History

<!-- One line per version, newest last. -->

| Version | Date | Change |
|---------|------|--------|
| 1.0 | YYYY-MM-DD | Initial version |
