---
name: documentation-criteria
description: This skill should be used when the user asks to "create a PRD", "write an ADR", "create a design doc", "make a work plan", "create task files", or needs guidance on document templates, creation criteria, or determining which documents are required for a given change scope.
---

# Documentation Creation Criteria

## Templates

- **[prd-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/prd-template.md)** - Product Requirements Document template
- **[adr-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/adr-template.md)** - Architecture Decision Record template
- **[design-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/design-template.md)** - Technical Design Document template
- **[plan-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/plan-template.md)** - Work Plan template
- **[task-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/task-template.md)** - Task file template for implementation tasks
- **[uxrd-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/uxrd-template.md)** - UX Requirements Document template
- **[design-system-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/design-system-template.md)** - Design system templates: README, foundations, component spec

## Creation Decision Matrix

| Condition | Required Documents | Creation Order |
|-----------|-------------------|----------------|
| Large scale | PRD (full) → [UXRD] → Design Doc per part → [ADR] → Work Plan per part | After PRD approval |
| Medium scale | PRD (lite) → [UXRD] → Design Doc per part → [ADR] → Work Plan per part | After PRD approval |
| Small scale | PRD (lite) → simplified Work Plan | After PRD approval |

**The ADR follows the Design Doc**, and is written only when a decision the design made passes all three parts of the test below. Most features produce none. Documents in `[brackets]` are conditional.

**A PRD is written at every scale.** Its depth varies — `full` at large scale, `lite` at medium and small (see "PRD depth" below) — but the document always exists, so the feature's requirements and its Delivery Parts have one home regardless of how the work was routed. Without it, medium-scale work had no record of *what* was agreed and the parts list lived only in conversation.

**Design Docs and work plans are written per part.** The split into parts is proposed by `requirement-analyzer`, refined by `prd-creator` into the PRD's Delivery Parts section, and confirmed by the user at PRD approval — before any design begins. See "Parts" under Storage Locations.

**File count is one scale signal, not the deciding rule.** Contract, data, boundary, and decision risk can each raise the scale on their own — a two-file change that breaks a public contract or migrates persisted data is not a small-scale change. Take the scale and its `decidingAxis` from `task-analyzer`'s 5-axis assessment; where no analysis is available, evaluate the axes directly:

| Axis | Small | Medium | Large |
|------|-------|--------|-------|
| Estimated files | 1-2 | 3-5 | 6+ |
| Observable outcomes | One behavior | Multiple related behaviors | Multiple independently verifiable outcomes |
| Contracts/data | No public contract or persisted-data change | Backward-compatible contract change | Breaking contract, schema migration, or persisted-data migration |
| Boundaries | One local module/component | Multiple modules in one layer | Cross-layer, cross-service, or external-system boundary |
| Decision risk | Existing pattern applies directly | One bounded technical decision; complex logic (3+ interacting state variables, 5+ coordinated async operations) or a new pattern | Architecture, security, compliance, or irreversible operational decision |

Select the highest scale triggered by any observed axis.

## ADR Creation Conditions

**An ADR is written after the Design Doc, not before it.** Which decisions are genuinely architecture-binding is only visible once the design exists; writing the ADR first means committing before understanding. The ADR extracts a decision the design made, so it outlives the feature that produced it.

**ADRs are rare by design.** A record that gets written for every change stops being read — and a decision log nobody reads is worse than none, because it looks like governance while providing none.

### The test

Write an ADR only when **all three** hold:

1. **Costly to reverse** — undoing it later means migrating data, breaking consumers, or coordinated changes across repositories. If a future developer can simply change it, it belongs in the Design Doc.
2. **Binds beyond this feature** — future unrelated work must comply with it. A choice that constrains only the code in this change is a design detail, not an architecture decision.
3. **Had real alternatives** — a genuine choice existed and one was taken. When only one option was viable, there is no decision to record; state the constraint in the Design Doc instead.

Fail any one → no ADR. Record the reasoning in the Design Doc, where it belongs.

### Signals worth applying the test to

These commonly — not always — meet all three. Treat them as prompts to run the test, not as automatic triggers:

- **Persistence and data flow**: storage medium changes, a new persisted format, a change in where the system of record lives
- **Contract shape crossing a boundary**: a schema or API shape other teams or services consume
- **Dependency direction**: a new layer, an inverted dependency, a module boundary moved
- **Foundational external dependency**: a framework or platform choice future code will be written against — *not* every library addition
- **Security or compliance posture**: an authentication model, a data residency or retention decision

### Signals that usually fail the test

Deep nesting, a function used in several places, adding a state to an existing machine, coordinating a few async calls, or adopting a utility library are ordinary design work. They belong in the Design Doc's Key Decisions, which already record what was compared and why.

## Writing for the Reader

A document is read far more often than it is written, and most readers stop after the first screen. Every PRD, UXRD, Design Doc, ADR, and work plan — and in gamedev every GDD and Feature Spec — follows these rules; the templates are laid out to match them.

**Order.** A short header (status, date, links to the neighbouring documents — no more than five fields) → **Snapshot** → the body → **Appendix: Evidence** (Design Doc) → **Update History**, always last. A reader learns what the document decides before how it was researched or how it got here. An ADR's Status and Decision sections are its header and Snapshot, and it has no Update History: a changed decision is a new ADR that supersedes it.

**Snapshot.** At most ten lines at the top: what changes, what does not, the biggest risk, how many questions are open. A cold reader who stops there can say what the document decides. A Design Doc and a UXRD add a **Key Decisions** table (ID, decision, why, rejected alternative — three to seven rows); the rest of the document cites `KD-n` instead of re-arguing the decision.

**Current truth only.** The body states what is true now. Who decided, on which date, in which version, or in answer to which review finding belongs to Update History and to git — not to requirements, acceptance criteria, table cells, or design text. "(user decision 2026-10-28)", "v1.2:", "per review I003" in the body are defects. Update History has one line per version, a phrase per change, no reviewer IDs.

**Delete, don't stub.** A section marked *when applicable* is deleted when it does not apply — no "N/A", no "does not exist", no placeholder sentence. Template guidance in `<!-- -->` comments is never copied into the document. A mandatory section that has nothing to say answers in one line with the reason.

**Short units.** A paragraph has at most four sentences. A table cell holds one phrase; reasoning goes under the table or into Key Decisions. A list item is one statement.

**Words before IDs.** Prose names things in words and adds the ID in parentheses — "the open thread is marked as current (AC-01.2)" — not "AC-01.2, SB-06, UX-04". Each ID is defined in exactly one place and cited everywhere else.

**Cite by path and ID, never by version.** A link to a neighbouring document names its path and the section or ID — `uxrd.md` TH-08 — not "UXRD v1.6". A version in a citation goes stale on the neighbour's next edit and turns every edit into a round of edits elsewhere.

**Write what this document decides, and only what is decided.** Every statement in a document is a promise that has to stay true. Detail that the document does not own, or that is not settled, goes stale and comes back as a review finding:
- **One owner per value.** A number, a UI string, a threshold, or a limit is written in the document that owns it. Everywhere else cites it by ID without repeating the value — "within the title latency budget (AC-17.1)", not "within 10 s (AC-17.1)". A repeated value drifts at the owner's next edit.
- **Verified or assumed, never guessed.** A claim about how a library, framework, or existing code behaves is either verified — with how: the installed version, the code location, a spike — or written as an assumption with the check that will settle it in the plan. Internals that do not show at a contract boundary (call order inside a library, exception class names, props of a third-party component) are not written at all; implementation decides them.
- **No references that go stale on their own.** No line numbers into another document, no version tags in headers of generated files, no counts of something listed elsewhere — tasks, tests, cases ("19 tasks", "3/14"); a list counts itself, no status line that narrates which versions are pending. Line numbers into the codebase belong only to Appendix: Evidence, as a snapshot.
- **Undecided stays an open question.** An acceptance criterion whose outcome is not decided cites the open question and states nothing else — no list of acceptable alternatives, no "guarantee" the design rates as low certainty. The decision is written once, when it is made.

**Size.** Soft targets for the document, in characters, excluding Update History: PRD or Feature Spec lite 15 000, PRD or Feature Spec full 30 000, UXRD 40 000, design-system component spec 6 000, Design Doc 45 000 per part (Appendix: Evidence included), ADR 10 000. Over the target, the author merges restated content into a citation or splits the part — and `document-reviewer` raises a `recommended` issue naming what to move or cut; past twice the target the issue is `important`, because a document that large holds more statements than anyone keeps consistent. The target is a signal, not a cap.

## Detailed Document Definitions

**One fact, one document.** Each fact has exactly one home — the document listed below as including it. A later document cites an earlier one by ID (`UC-2`, `AC-01.3`, `FR-05`, `D-03`) and never retells it: a retold requirement drifts from its source at the first revision of either, and the reviewer cannot tell which copy is meant. The chain is PRD (what the user achieves) → UXRD (what the user sees and does) → Design Doc (how the system does it); the design system, shared by every feature, holds how the interface looks and how each component works.

### PRD (Product Requirements Document)

**Purpose**: Define business requirements and user value

**Includes**:
- Business requirements and user value
- Success metrics and KPIs (measurable format)
- User stories and use cases
- MoSCoW prioritization (Must/Should/Could/Won't)
- MVP and Future phase separation
- **Delivery Parts** — the partition of the requirements into independently designable slices, each with the requirements it covers and the parts it depends on (see "Parts" below)
- User journey diagram (full depth)
- Scope boundary diagram (full depth)
- Part dependency diagram (required when there is more than one part, at either depth)

**PRD depth**:

| Depth | When | Sections |
|-------|------|----------|
| `full` | Large scale | Every template section, market research, user journey and scope boundary diagrams |
| `lite` | Medium and small scale | Overview (summary, background), User Stories and Use Cases, Functional Requirements with MoSCoW and acceptance criteria, Non-Functional Requirements only where the feature sets one, Delivery Parts, Success Criteria (at least one observable outcome), Undetermined Items. Technical Considerations, Appendix, market research, and the two feature-level diagrams are omitted |

A lite PRD is a short document, not a sketchy one: every requirement it lists still carries an acceptance criterion and a MoSCoW priority, and every Must Have belongs to a part. `document-reviewer` receives the depth and applies Gate 0 accordingly. An existing PRD is updated rather than duplicated, at whatever depth it already has.

**Excludes**:
- Technical implementation details (→Design Doc)
- Technical selection rationale (→ADR)
- **Implementation phases** (→Work Plan) — a part is a slice of *what* is built; a phase is a step in *when* it is built. Parts belong in the PRD, phases do not.
- **Task breakdown** (→Work Plan)
- **How the interface looks and behaves** (→UXRD and the design system) — screen states (loading, empty, error), microcopy, ARIA attributes and focus behaviour, breakpoints, design tokens, animation. The PRD states the observable outcome ("the open thread is marked as current") and, in Non-Functional Requirements, the target level ("WCAG 2.1 AA", "usable from 360 px") — not how either is met
- **Decisions for the design and ADR signals** (→requirement-analyzer output and the Design Doc) — a list of technical questions the design must settle is not a product requirement

### UXRD (UX Requirements Document)

**Purpose**: Specify what the user sees and does for the PRD's requirements that have a user-visible surface. Written when the work has a UI surface, after PRD approval.

**Includes**:
- AC Traceability: each user-visible PRD acceptance criterion by ID → the screen, state, and element that deliver it
- Component Inventory: each component the feature uses, linked to its design-system spec and marked reused, extended, or new
- User flows through the screens, each citing the PRD use cases it implements
- Screens: wireframe, layout, and the screen's own states (loading, empty, error)
- Global accessibility rules (target level cited from the PRD, focus order across screens, announcements), responsive behaviour per screen, and the feature's one list of microcopy
- UX decisions taken here, each with an ID other documents cite — including any change to an existing foundation or component

**Excludes**:
- Summary, background, users, use cases, requirements, and acceptance criteria text (→PRD; cite by ID)
- Success metrics and priorities (→PRD)
- Component specs — anatomy, variants, states, per-component accessibility — and foundations — typography, color, spacing, shape, motion, icons (→Design System; link)
- Component implementation, state management, API contracts (→Design Doc)
- Terms already in the PRD glossary

### Design System

**Purpose**: Hold the product's visual language and its reusable components — how they look and work, without code. It lives in `docs/design-system/`, is shared by every feature, and is owned by `ux-designer` (gamedev: `game-ui-designer`).

**Includes**:
- `README.md`: the source (brand book, external design system, or defined here), the direction in one phrase with references, and an index
- `foundations.md`: typography, color roles for light and dark, spacing and density, shape and elevation, motion, iconography
- `components/{component-name}.md`: purpose, anatomy, variants and sizes, states, content rules, accessibility, and the UXRDs it is used in

**Excludes**:
- Feature flows, screens, and copy (→UXRD)
- Code of any kind — CSS, token source, props, markup (→implementation)
- What a brand book or external design system already defines (cite it; fill only its gaps)

**Lifecycle**: the first UXRD that needs a design system and finds none creates it with the components that feature needs. Later UXRDs follow it and add or extend components in the same pass. Changing an existing foundation or component is a Key Decision of the UXRD that changes it.

### ADR (Architecture Decision Record)

**Purpose**: Record technical decision rationale and background

**Includes**:
- Decision (what was selected)
- Rationale (why that selection was made)
- Option comparison (minimum 3 options) and trade-offs
- Architecture impact
- Principled implementation guidelines (e.g., "Use dependency injection")

**Excludes**:
- Implementation schedule, duration (→Work Plan)
- Detailed implementation procedures (→Design Doc)
- Specific code examples (→Design Doc)
- Resource assignments (→Work Plan)

### Design Document

**Purpose**: Define technical implementation methods in detail

**Includes**:
- **Existing codebase analysis** (required)
  - Code locations, existing and new (C4)
  - Integration point clarification (connection points with existing code even for new implementations)
- Technical implementation approach (vertical/horizontal/hybrid)
- Interface and contract definitions
- Data flow and component design
- **E2E verification procedures at integration points**
- **Acceptance criteria (measurable format)**
- Change impact map (clearly specify direct impact/indirect impact/no ripple effect)
- Complete enumeration of integration points
- Data contract clarification
- **Agreement checklist** (agreements with stakeholders)
- **Prerequisite ADRs** (including common ADRs)

**Required Structural Elements**:
```yaml
Change Impact Map:
  Change Target: [Component/Feature]
  Direct Impact: [Files/Functions]
  Indirect Impact: [Data format/Processing time]
  No Ripple Effect: [Unaffected features]

Interface Change Matrix:
  Existing: [Function/method/operation name]
  New: [Function/method/operation name]
  Conversion Required: [Yes/No]
  Compatibility Method: [Approach]
```

**Excludes**:
- Source code of any kind — schemas, interfaces, function bodies, snippets of changed files (→written at implementation; contracts are field tables)
- Test code, test file names, fixtures, test helpers, mocking mechanics (→acceptance-test-generator and task files; the Design Doc states use cases)
- Why that technology was chosen (→Reference ADR)
- Implementation order, when to implement, duration (→Work Plan)
- Who will implement (→Work Plan)

### Work Plan

**Purpose**: Implementation task management and progress tracking

**Includes**:
- Task breakdown and dependencies (maximum 2 levels)
- Schedule and duration estimates
- **Copy E2E verification procedures from Design Doc** (cannot delete, can add)
- **Phase 4 Quality Assurance Phase (required)**
- Progress records (checkbox format)

**Excludes**:
- Technical rationale (→ADR)
- Design details (→Design Doc)

**Phase Division Criteria**:
1. **Phase 1: Foundation Implementation** - Contract definitions, interfaces/signatures, test preparation
2. **Phase 2: Core Feature Implementation** - Business logic, unit tests
3. **Phase 3: Integration Implementation** - External connections, presentation layer
4. **Phase 4: Quality Assurance (Required)** - Acceptance criteria achievement, all tests passing, quality checks

**Three Elements of Task Completion Definition**:
1. **Implementation Complete**: Code is functional
2. **Quality Complete**: Tests, static checks, linting pass
3. **Integration Complete**: Verified connection with other components

## Creation Process

Each step names the evidence that must exist before the next step starts. A step without its output evidence has not completed, regardless of elapsed effort.

**1. Problem Analysis** — change scale assessment, ADR condition check
- *Output evidence*: confirmed scale with its deciding axis named; a named source for each existing document consulted
- *Transition*: proceed when the scale and every applicable ADR condition have an explicit yes/no

**2. ADR Option Consideration** (ADR only) — compare 3+ options, specify trade-offs
- *Output evidence*: at least 3 options with trade-offs stated as concrete costs, not generic caveats
- *Transition*: proceed when the selected option names what the rejected options fail to satisfy

**3. Creation** — use templates, include measurable conditions
- *Output evidence*: every mandatory template section filled (or answered in one line with the reason), every *when applicable* section that does not apply deleted; every acceptance criterion measurable
- *Transition*: proceed when no section is silently empty — an unanswered question is not the same as an inapplicable one

**4. Approval** — "Accepted" after review enables implementation
- *Output evidence*: reviewer verdict recorded; every blocking issue resolved or explicitly deferred with justification
- *Transition*: implementation begins only on an approved verdict

## Storage Locations

Documents are grouped **by feature**, not by document type. Everything a feature produces lives under one directory, so the whole record of a change is readable in one place. ADRs and the design system are the exceptions: a decision usually outlives and spans features, and every feature's UI shares one design system, so both stay global.

```
docs/
├── adr/
│   └── ADR-0007-token-storage.md
├── design-system/
│   ├── README.md
│   ├── foundations.md
│   └── components/
│       └── {component-name}.md
└── features/
    └── {feature}/
        ├── prd.md
        ├── uxrd.md
        ├── design-{part}.md
        └── {part}/
            ├── {plan-name}.md          # e.g. 20260726-feature-auth.md
            └── {plan-name}/            # same name as its plan file
                ├── _overview.md
                ├── task-01.md
                └── analysis/
                    └── {topic}.md
```

| Document | Path | Naming Convention | Template |
|----------|------|------------------|----------|
| PRD | `docs/features/{feature}/` | `prd.md` | [prd-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/prd-template.md) |
| UXRD | `docs/features/{feature}/` | `uxrd.md` | [uxrd-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/uxrd-template.md) |
| Design System | `docs/design-system/` | `README.md`, `foundations.md`, `components/{component-name}.md` | [design-system-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/design-system-template.md) |
| ADR | `docs/adr/` | `ADR-[4-digits]-[title].md` | [adr-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/adr-template.md) |
| Design Doc | `docs/features/{feature}/` | `design-{part}.md` | [design-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/design-template.md) |
| Work Plan | `docs/features/{feature}/{part}/` | `YYYYMMDD-{type}-{description}.md` | [plan-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/plan-template.md) |
| Task File | `docs/features/{feature}/{part}/{plan-name}/` | `task-{number}.md` | [task-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/task-template.md) |
| Analysis deliverable | `docs/features/{feature}/{part}/{plan-name}/analysis/` | `{topic}.md` | — |

### Parts

A **part** is one independently designable slice of a feature — a short kebab-case name such as `core`, `api`, `checkout-ui`, or `migration`. Every feature has at least one, even when it is the only one: a uniform depth lets every agent resolve paths with a single glob instead of two.

`design-{part}.md` and the directory `{part}/` share the part name and are read as a pair — the design states what to build, the directory holds the plans that build it.

#### Where parts are decided

Splitting into parts is a **product-phase decision**: proposed by the model, confirmed by the user, and settled before any design begins. A split chosen later — by whoever happens to write the first Design Doc — is a split nobody agreed to, and the contract between the halves is then invented inside one of them.

The decision follows one path at every scale, because a PRD exists at every scale:

| Step | Agent | Record |
|------|-------|--------|
| Propose | `requirement-analyzer` | `parts[]` in its analysis — preliminary, shown at the requirement confirmation stop |
| Refine | `prd-creator` | PRD, "Delivery Parts" section — the authoritative record |
| Confirm | user | PRD approval stop |

At small scale the proposal is one part and the refinement is a one-row table; the path is the same so that no agent has to ask which record is authoritative. At medium scale a split rarely exceeds two parts.

The confirmed Delivery Parts section is the **parts list**. It is handed from phase to phase and is the only source of part names: a designer does not invent one, and a plan's `part:` frontmatter must name one from the list. (`workflow-gamedev` has no PRD; there the feature spec written by `mid-game-designer` plays the same role, and its Delivery Parts section is the list.)

#### What a part record carries

| Field | Meaning |
|-------|---------|
| `name` | Short kebab-case identifier; becomes `design-{name}.md` and `{name}/` |
| `covers` | The requirements this part delivers — by id or title from the PRD or the requirement analysis |
| `cutAlong` | The seam the slice is cut on: `backend`, `frontend`, `domain` (a bounded context), `release-unit` |
| `dependsOn` | Parts whose approved design this part consumes as a contract; empty for the first |
| `rationale` | Why this is a separate part — or why the feature is one part — in one sentence |

#### How to split

Cut along a seam where the two sides carry different design concerns and meet at a contract:

- **By layer** — a service contract and the screen consuming it (`api`, `web`)
- **By domain** — two bounded contexts with their own data owners (`billing`, `notifications`)
- **By release unit** — a data migration that must land before the feature it enables (`migration`, `core`)

Keep **one part** when the requirements share one layer and one domain and a single Design Doc holds them coherently. One part is the common case. Do **not** split by schedule (foundation / core / integration are work-plan phases), by estimated size, or into a part that owns no Must Have requirement.

#### Rules

- **One design per part.** When a change needs materially different designs — a service contract and the screen consuming it — those are separate parts, not two documents in one.
- **Every Must Have requirement belongs to exactly one part.** Should Have and Could Have requirements belong to a part or are explicitly deferred. A requirement in no part is work that silently does not happen; one in two parts is designed twice.
- **Dependencies are acyclic, and design order is dependency order.** A part is designed only after every part in its `dependsOn` has an approved design, so its designer reads a verified contract rather than a proposed one.
- **PRD and UXRD sit at feature level.** They describe the feature as a whole; the parts list is a section of the PRD, not a reason to split the PRD. A UI part reads the feature's single `uxrd.md`.
- **Changing the parts list is a PRD change.** It goes through `prd-creator` in `update` mode and back through PRD review and approval. Designs of parts the change does not touch stay approved, and a part whose plan is already `completed` is frozen — a change that would alter it is a new feature, not a revision.

### Plans within a part

A part may need more than one work plan — a first pass and a hardening pass, for example. Each plan file is paired with a directory of the **same name** holding its decomposition, so two plans never contend for one task directory.

Each plan declares its own position and state in frontmatter:

```yaml
---
feature: user-auth              # required
part: core                      # required
design: design-core.md          # required — back-reference to the governing design
plan: 2 of 3                    # required — position and expected total
status: active                  # draft | active | completed
depends-on: 20260726-feature-auth.md  # omitted for the first plan
---
```

The frontmatter is the single source of truth for plan sequencing — there is no separate index file to drift out of sync with the directory.

| Question | Answer |
|----------|--------|
| How many plans should this part have? | the `M` in `plan: N of M` |
| Which plan runs now? | the one with `status: active` |
| What order? | the `depends-on` chain, not filename sort |
| Is the part done? | every plan `completed`, and the file count matches `M` |

**Escalate rather than guess** when: two plans claim `status: active`; no plan is active while the part has unfinished work; the number of plan files disagrees with `M`; or a `depends-on` names a file that does not exist. Each of these means the part's state is ambiguous, and picking one reading silently produces work against the wrong plan.

### Resolution globs

| To find | Glob |
|---------|------|
| Every PRD | `docs/features/*/prd.md` |
| Every UXRD | `docs/features/*/uxrd.md` |
| Every component spec | `docs/design-system/components/*.md` |
| Parts list of a feature | `docs/features/{feature}/prd.md`, section "Delivery Parts" |
| Every Design Doc | `docs/features/*/design-*.md` |
| Design for one part | `docs/features/{feature}/design-{part}.md` |
| Every work plan | `docs/features/*/*/*.md` |
| Plans of one part | `docs/features/{feature}/{part}/*.md` |
| Tasks of one plan | `docs/features/{feature}/{part}/{plan-name}/task-*.md` |
| Every ADR | `docs/adr/ADR-*.md` |

**Layer determination**: a design's layer is not encoded in its filename. Read the document (React/component/UI signals versus API/data/infrastructure signals) or take it from the part name where the part is layer-defined.

*Note: work plans and task files are ephemeral working state and are excluded by `.gitignore`.*

### Small scale

Small scale produces a lite PRD and a simplified work plan, and no Design Doc. The plan's `design:` frontmatter is therefore `none` with the note `small scale — the PRD is the specification`; `work-planner`'s rule that a plan needs an approved design is exempted at this scale only, and the plan's traceability table maps to PRD requirements instead of Design Doc items.

## ADR Status
`Proposed` → `Accepted` → `Deprecated`/`Superseded`/`Rejected`

Check existing ADRs before design and implementation; the Design Doc lists them as Prerequisite ADRs. No rule pre-decides that an ADR will be written — the three-part test above is applied to the finished design.

## Diagram Requirements

Required diagrams for each document. Every diagram follows the `mermaid-diagrams` skill (palette, redraw test, path animation, render check):

| Document | Required Diagrams | Purpose |
|----------|------------------|---------|
| PRD | User journey diagram and Scope boundary diagram (full depth); Part dependency diagram (when more than one part, either depth) | Clarify user experience, scope, and the order parts are designed in |
| ADR | Option comparison diagram (when needed) | Visualize trade-offs |
| Design Doc | C2 container diagram always; C1, C3, C4 when they apply; a sequence diagram per runtime flow | Zoom from context to code; show each flow as the running system executes it |
| Work Plan | Phase structure diagram, Task dependency diagram | Clarify implementation order |

## Common ADR Relationships
1. **At creation**: Identify common technical areas (logging, error handling, async processing, etc.), reference existing common ADRs
2. **When missing**: Consider creating necessary common ADRs
3. **Design Doc**: Specify common ADRs in "Prerequisite ADRs" section
4. **Compliance check**: Verify design aligns with common ADR decisions