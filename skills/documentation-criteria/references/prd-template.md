# PRD: [Feature Name]

<!--
Depth: `full` | `lite` — set by scale (documentation-criteria, "PRD depth"). Sections marked (full depth) are omitted in a lite PRD.
The PRD says what the user achieves, not what the screen looks like or how the system does it. Screen states, microcopy, ARIA and focus behaviour,
breakpoints, tokens, and animation belong to the UXRD; field lists, storage, protocols, libraries and their versions, file paths, and process
mechanics belong to the Design Doc. A technical choice the user fixed as a product decision is one line in Constraints and Risks.
Later documents cite this PRD by ID (UC-2, AC-01.3) instead of restating it.
Reader rules: documentation-criteria, "Writing for the Reader". Guidance in these comments is not copied into the document.
-->

| Status | Date | Depth | UXRD | Designs |
|---|---|---|---|---|
| Draft / Approved | YYYY-MM-DD | full / lite | [uxrd.md](./uxrd.md) or — | [design-[part].md] or — |

## Snapshot

<!-- At most ten lines. The Overview is the story a newcomer needs; the bullets are what they would ask next. -->

**Overview.** [Three to five plain sentences: what problem the users have today, what they can do once this ships, and the core capabilities that make it possible. No IDs.]

- **For**: [primary users]
- **Not included**: [the one or two things a reader would expect here, from Won't Have]
- **Parts**: [part names, in build order]
- **Biggest risk**: [one line]
- **Open questions**: [a link to Undetermined Items, or "none"]

## Terms

<!-- When applicable: the document leans on five or more words a newcomer may not know. One line each. Later documents add only terms that are new to them. -->

- **[Term]**: [what it means here, in a few plain words]

## Background

<!-- At most three short paragraphs: what exists today, why now, and the context a reader needs to judge the problem. The Overview already states the problem; do not restate it. Market context, when needed, goes to Appendix → References. -->

[What exists today and why this is needed now]

## Users and Use Cases

### Users

- **[User type]** — [who they are, and what matters to them in this feature]

### Use Cases

<!-- Who, what they achieve, the outcome, and why it matters to them — no interface elements (buttons, menus, keys) and no system internals; the UXRD draws the path through the screens and later documents cite these IDs. -->

- **UC-1**: [user] [achieves what] → [outcome], so that [value]
- **UC-2**: [user] [achieves what] → [outcome], so that [value]

### User Journey Diagram *(full depth)*

```mermaid
---
config:
  theme: base
  look: classic
  themeVariables:
    primaryColor: "#eef1f5"
    primaryBorderColor: "#4b5563"
    primaryTextColor: "#1a1a1a"
    lineColor: "#6b7280"
---
journey
    title [Primary user journey]
    section [Stage 1]
      [Step]: 5: [User]
    section [Stage 2]
      [Step]: 3: [User]
```

## Functional Requirements

<!-- Every requirement carries a MoSCoW priority and an acceptance criterion. A requirement states a capability and its observable outcome; how the system delivers it is the Design Doc's.
`Won't Have` is recorded, not omitted — an unlisted exclusion is rediscovered during implementation.
IDs: requirements `FR-01`, their criteria `AC-01.1`, `AC-01.2`; later documents cite these. -->

### Must Have (MVP)

- **FR-01. [Short name].** [What the user or the system can do, in one or two sentences]
  - AC-01.1: Given [state], when [action], then [observable outcome for the user — "the open thread is marked as current", not its markup or styling ("`aria-current` is set", "a skeleton is shown")]
- **FR-02. [Short name].** [...]
  - AC-02.1: [...]

### Should Have

- **FR-03. [Short name].** [...]
  - AC-03.1: [...]

### Could Have

- **FR-04. [Short name].** [...]
  - AC-04.1: [...]

### Won't Have

<!-- Everything a reader might expect here that is not delivered: deferred to a later release, or not part of this feature at all. -->

- [What is left out] — [later release / not this feature], [why]

## Non-Functional Requirements

<!-- Only the categories this feature sets a requirement for — performance, reliability, security, scalability, accessibility and responsiveness; delete the rest. When the feature sets none, one line: "none beyond project defaults".
Each requirement has an ID (`NFR-01`) and states a target and how it is measured. Accessibility and responsiveness give the target level only ("WCAG 2.1 AA", "usable from 360 px width"); how each is met is the UXRD's. -->

### [Category]

- **NFR-01**: [target, and how it is measured]

## Delivery Parts

<!-- Parts split the feature into independently designable slices. Each part receives its own Design Doc (`design-{part}.md`) and its own work plans, designed and built in the dependency order below. The split is proposed here and confirmed by the user at PRD approval; criteria are in the `documentation-criteria` skill, "Parts". -->

| Part | Covers | Cut along | Depends on | Rationale |
|------|--------|-----------|------------|-----------|
| `[part-name]` | [FR-01, FR-03] | [backend / frontend / domain / release-unit] | — | [Why this is a separate slice, one sentence] |
| `[part-name]` | [FR-02] | [...] | `[part-name]` | [...] |

<!-- **Coverage**: every Must Have requirement above appears in exactly one row. Should Have and Could Have requirements appear in a row or are deferred here: -->

- Deferred: [FR-nn assigned to no part] — [why]

<!-- **Single part**: when the whole feature is one slice, write one row and say why in its rationale ("one layer, one domain, one design holds it"). One part is the common case. -->

### Part Dependency Diagram

<!-- When applicable: three or more parts (with two, the Depends on column already says it). An arrow points from a part to the part whose approved design it consumes. -->

```mermaid
---
config:
  theme: base
  look: classic
  themeVariables:
    primaryColor: "#eef1f5"
    primaryBorderColor: "#4b5563"
    primaryTextColor: "#1a1a1a"
    lineColor: "#6b7280"
  flowchart:
    curve: step
---
graph LR
    api[api] --> web[web]
```

## Success Criteria

<!-- How we will know, after release, that the feature reached its goal: what is measured, the target, and where it is read — as many as the goal needs, no fixed count.
Acceptance criteria prove the feature works; success criteria prove it was worth building. Never restate an acceptance criterion as a test run.
When the feature is an internal capability with no measure beyond its acceptance criteria, write one line naming the use cases that prove it. -->

- [what is measured] — [target], read from [where], by [when]

## Constraints and Risks

<!-- Required at full depth; at lite depth, when the feature has any. Product-level only: no inventory of dependencies, versions, or file paths — codebase facts belong to the design's analysis. -->

### Constraints

- [a limit the solution must respect — business, legal, a deadline, or a technical choice the user fixed as a product decision — in a sentence]

### Assumptions

- [what the decision rests on that is not yet confirmed] — [how and when it is checked]

### Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| [what could make the feature fail its users or its goal] | High/Medium/Low | High/Medium/Low | [Countermeasure] |

## Undetermined Items

- [Question] — [the options or what it affects]; blocks [what]; resolved by [who]

<!-- *Discuss with user until this section is empty, then delete after confirmation* -->

## Appendix *(full depth)*

### References

- [Related document 1]

## Update History

<!-- One line per version, newest last, a phrase per change. No reviewer IDs. -->

| Version | Date | Change |
|---------|------|--------|
| 1.0 | YYYY-MM-DD | Initial version |
