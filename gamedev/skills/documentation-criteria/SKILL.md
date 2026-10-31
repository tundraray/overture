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
- **[gdd-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/gdd-template.md)** - Game Design Document template
- **[market-analysis-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/market-analysis-template.md)** - Market Analysis template
- **[feature-spec-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/feature-spec-template.md)** - Feature Specification template
- **[analytics-setup-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/analytics-setup-template.md)** - Analytics Setup template
- **[engine-setup-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/engine-setup-template.md)** - Engine Setup template
- **[handoff-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/handoff-template.md)** - Handoff Document template

## Creation Decision Matrix

| Condition | Required Documents | Creation Order |
|-----------|-------------------|----------------|
| New Game Project | Market Analysis → GDD → Feature Spec (full) per feature → Design Doc per part → [ADR] → Work Plan per part | After Feature Spec approval |
| New Game Feature (large) | GDD update → Feature Spec (full) → Design Doc per part → [ADR] → Work Plan per part | After Feature Spec approval |
| Medium scale | Feature Spec (lite) → Design Doc per part → [ADR] → Work Plan per part | After Feature Spec approval |
| Art/Visual Change | Art Direction → Feature Spec (lite) → Design Doc per part | After Feature Spec approval |
| Small scale | Feature Spec (lite) → simplified Work Plan | After Feature Spec approval |

**The ADR follows the Design Doc**, and is written only when a decision the design made passes all three parts of the test below. Most features produce none. Documents in `[brackets]` are conditional.

**A feature spec is written at every scale.** It is the feature-level product document — the PRD's role in the shared workflow — and its depth follows the scale: `full` at large (every template section), `lite` at medium and small (Feature Overview, Problem Statement, User Stories, Acceptance Criteria, Delivery Parts, Integration Points). The GDD stays at project level. Design Docs and work plans are written per part; the parts list is the feature spec's Delivery Parts section (see "Parts and plans").

## ADR Creation Conditions

**An ADR is written after the Design Doc, not before it**, and only when a decision the design made passes all three parts of the test:

1. **Costly to reverse** — undoing it later means migrating data, breaking consumers, or coordinated changes across repositories
2. **Binds beyond this feature** — future unrelated work must comply with it
3. **Had real alternatives** — a genuine choice existed and one was taken

Fail any one → no ADR; record the reasoning in the Design Doc.

Game-specific decisions that commonly meet all three: save-file format, netcode authority model, the engine or renderer target, and the analytics event schema other tools consume. Ordinary mechanics tuning, adding a state to an existing machine, or picking a tween library do not.

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
- **Verified or assumed, never guessed.** A claim about how a library, framework, or existing code behaves is either verified — with how: the installed version, the code location, a spike — or written as an assumption with the check that will settle it in the plan. Internals that do not show at a contract boundary (call order inside a library, exception class names, props of a third-party component, the database lock mode or lock order behind an invariant) are not written at all; the design states the invariant, implementation decides the mechanism.
- **No references that go stale on their own.** No line numbers into another document, no version tags in headers of generated files, no counts of something listed elsewhere — tasks, tests, cases ("19 tasks", "3/14"); a list counts itself, no status line that narrates which versions are pending. Line numbers into the codebase belong only to Appendix: Evidence, as a snapshot.
- **Undecided stays an open question.** An acceptance criterion whose outcome is not decided cites the open question and states nothing else — no list of acceptable alternatives, no "guarantee" the design rates as low certainty. The decision is written once, when it is made.

**Size.** Soft targets for the document, in characters, excluding Update History: PRD or Feature Spec lite 15 000, PRD or Feature Spec full 30 000, UXRD 40 000, design-system component spec 6 000, Design Doc 45 000 per part (Appendix: Evidence included), ADR 10 000. Over the target, the author merges restated content into a citation — and `document-reviewer` raises a `recommended` issue naming what to move or cut. The target is a signal, not a cap.

## Revising a Document

An edit is finished when nothing else still says the old thing. Most findings on a re-review sit not in the edited lines but in the places that relied on them.

- **Dependents.** After an edit, find every place that cites, depends on, or restates what changed in this document, and make it agree. A dependent in another document — found by searching for the changed IDs — is named in the response (`nextSteps`), not edited; the orchestrator routes it to its owner.
- **Cuts.** Removing or merging content leaves no reference pointing at what was removed. Passages that share words but make different claims are not duplicates, and both stay.
- **Self-check scope.** A new document, or a change to sections, numbering, or IDs, runs the author's whole Self-Validation. A targeted edit runs the items whose subject it touched, plus the dependents check above; the diagram render check runs on every revision.

## Detailed Document Definitions

**One fact, one document.** Each fact has exactly one home — the document listed below as including it. A later document cites an earlier one by ID (`AC-1`, `OQ-2`, `KD-3`) and never retells it: a retold requirement drifts from its source at the first revision of either, and the reviewer cannot tell which copy is meant. The chain is GDD (the game's vision and systems) → Feature Spec (what the player achieves with one feature) → UXRD when the feature has a UI surface (what the player sees and does) → Design Doc (how the system does it); the design system, shared by every feature, holds how the HUD and menus look and how each component works.

### PRD (Product Requirements Document)

*Not produced on the gamedev path: the feature spec plays this role and carries the Delivery Parts. The template is kept for reverse-engineering an existing non-game module.*

**Purpose**: Define business requirements and user value

**Includes**:
- Business requirements and user value
- Success metrics and KPIs (measurable format)
- User stories and use cases
- MoSCoW prioritization (Must/Should/Could/Won't)
- MVP and Future phase separation
- User journey diagram (required)
- Scope boundary diagram (required)

**Excludes**:
- Technical implementation details (→Design Doc)
- Technical selection rationale (→ADR)
- **Implementation phases** (→Work Plan)
- **Task breakdown** (→Work Plan)
- **How the interface looks and behaves** (→UXRD and the design system)

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

### GDD (Game Design Document)

**Purpose**: Define game vision, core mechanics, progression, and systems

**Includes**:
- Core loop
- Game pillars
- Progression systems
- Balancing parameters
- Content specifications

**Excludes**:
- Technical implementation (→Design Doc)
- Market analysis (→Market Analysis)
- Art specifications (→Art Direction)

### Market Analysis

**Purpose**: Validate market opportunity and competitive positioning

**Includes**:
- Competitor analysis
- Market sizing
- Target audience
- Monetization potential
- Risk assessment
- Go/No-Go recommendation

**Excludes**:
- Game design details (→GDD)
- Technical specs (→Design Doc)

### Feature Specification

**Purpose**: Detailed specification of a single game feature or system

**Includes**:
- User stories
- Acceptance criteria (Must / Should / Could)
- **Delivery Parts** — the partition of the acceptance criteria into independently designable parts, with dependencies (see "Parts and plans")
- Integration points
- Balancing parameters and edge cases (full depth)

**Excludes**:
- Full game vision (→GDD)
- Technical implementation details and the questions the design must settle (→Design Doc)
- Implementation plan (→Work Plan)
- **How the interface looks and behaves** (→UXRD and the design system) — HUD and menu states, microcopy, focus and input navigation, resolutions, design tokens, UI animation. The spec states the observable outcome ("the player sees remaining ammo at all times") and the target level ("readable at 720p", "WCAG 2.1 AA for menus") — not how either is met

### UXRD (UX Requirements Document)

**Purpose**: Specify what the player sees and does for the feature spec's acceptance criteria that have a UI surface — HUD, menus, dialogs. Written by `game-ui-designer` when the feature has a UI surface, after Feature Spec approval.

**Includes**:
- AC Traceability: each user-visible feature-spec acceptance criterion by ID → the screen, state, and element that deliver it
- Component Inventory: each component the feature uses, linked to its design-system spec and marked reused, extended, or new
- User flows through the screens, each citing the user stories it implements
- Screens: wireframe, layout, and the screen's own states (loading, empty, error)
- Global accessibility rules (target level cited from the feature spec, focus and input navigation across screens, announcements), behaviour per resolution or breakpoint, and the feature's one list of microcopy
- UX decisions taken here, each with an ID other documents cite — including any change to an existing foundation or component

**Excludes**:
- Feature overview, user stories, and acceptance criteria text (→Feature Spec; cite by ID)
- Component specs — anatomy, variants, states, per-component accessibility — and foundations — typography, color, spacing, shape, motion, icons (→Design System; link)
- Component implementation, state management, API contracts (→Design Doc)

### Design System

**Purpose**: Hold the game's UI visual language and its reusable components — how they look and work, without code. It lives in `docs/design-system/`, is shared by every feature, and is owned by `game-ui-designer`.

**Includes**:
- `README.md`: the source (the art direction in `docs/art/`, the GDD, an external design system, or defined here), the direction in one phrase with references, and an index
- `foundations.md`: typography, color roles, spacing and density, shape and elevation, motion, iconography
- `components/{component-name}.md`: purpose, anatomy, variants and sizes, states, content rules, accessibility, and the UXRDs it is used in

**Excludes**:
- Feature flows, screens, and copy (→UXRD)
- Code of any kind — theme config, token source, GameObject setup, markup (→implementation)
- What the art direction or an external design system already defines (cite it; fill only its gaps)

**Lifecycle**: the first UXRD that needs a design system and finds none creates it with the components that feature needs. Later UXRDs follow it and add or extend components in the same pass. Changing an existing foundation or component is a Key Decision of the UXRD that changes it.

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

## Scale Axes

**File count is one scale signal, not the deciding rule.** Contract, data, boundary, and decision risk can each raise the scale on their own — a two-file change that breaks a save-file format or a networked contract is not a small-scale change. Take the scale and its `decidingAxis` from `task-analyzer`'s assessment; where none is available, evaluate directly:

| Axis | Small | Medium | Large |
|------|-------|--------|-------|
| Estimated files | 1-2 | 3-5 | 6+ |
| Observable outcomes | One behavior | Multiple related behaviors | Multiple independently verifiable outcomes |
| Contracts/data | No public contract or persisted-data change | Backward-compatible contract change | Breaking contract, save-format migration, or persisted-data migration |
| Boundaries | One local module/component | Multiple modules in one layer | Cross-layer, cross-service, or external-system boundary |
| Decision risk | Existing pattern applies directly | One bounded technical decision; complex logic (3+ interacting state variables, 5+ coordinated async operations) or a new pattern | Architecture, security, compliance, or irreversible operational decision |

Select the highest scale triggered by any observed axis.

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

Documents are grouped **by feature**, not by document type. Game-wide documents (GDD, market analysis) stay global, as do ADRs — a decision usually outlives and spans features — and the design system, which every feature's UI shares.

```
docs/
├── adr/ADR-0007-save-format.md
├── design-system/{README,foundations}.md, components/{component-name}.md
├── game-design/{project}-gdd.md
└── features/{feature}/
    ├── prd.md
    ├── uxrd.md
    ├── design-{part}.md
    └── {part}/
        ├── {plan-name}.md
        └── {plan-name}/{_overview,task-01}.md, analysis/{topic}.md
```

| Document | Path | Naming Convention | Template |
|----------|------|------------------|----------|
| PRD | `docs/features/{feature}/` | `prd.md` | [prd-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/prd-template.md) |
| ADR | `docs/adr/` | `ADR-[4-digits]-[title].md` | [adr-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/adr-template.md) |
| Design Doc | `docs/features/{feature}/` | `design-{part}.md` | [design-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/design-template.md) |
| Work Plan | `docs/features/{feature}/{part}/` | `YYYYMMDD-{type}-{description}.md` | [plan-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/plan-template.md) |
| Task File | `docs/features/{feature}/{part}/{plan-name}/` | `task-{number}.md` | [task-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/task-template.md) |
| Analysis deliverable | `docs/features/{feature}/{part}/{plan-name}/analysis/` | `{topic}.md` | — |
| UXRD | `docs/features/{feature}/` | `uxrd.md` | [uxrd-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/uxrd-template.md) |
| Design System | `docs/design-system/` | `README.md`, `foundations.md`, `components/{component-name}.md` | [design-system-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/design-system-template.md) |
| GDD | `docs/game-design/` | `[project-name]-gdd.md` | [gdd-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/gdd-template.md) |
| Market Analysis | `docs/market-research/` | `[project-name]-market-analysis.md` | [market-analysis-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/market-analysis-template.md) |
| Feature Spec | `docs/game-design/features/` | `[feature-name]-spec.md` | [feature-spec-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/feature-spec-template.md) |
| Art Direction | `docs/art/` | `[project-name]-art-direction.md` | N/A |
| Analytics Setup | `docs/analytics/` | `[project-name]-analytics.md` | [analytics-setup-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/analytics-setup-template.md) |
| Handoff | `docs/handoffs/` | `[handoff-name]-handoff.md` | [handoff-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/handoff-template.md) |


### Parts and plans

A **part** is one independently designable slice of a feature — `core`, `combat`, `hud`, `save-migration`. Every feature has at least one, so every agent resolves paths with a single glob. `design-{part}.md` and the directory `{part}/` share the part name and are read as a pair.

The split is a product-phase decision: `requirement-analyzer` proposes it in `parts[]`, `mid-game-designer` refines it into the feature spec's Delivery Parts section, and the user confirms it at Feature Spec approval, before any design begins. The confirmed Delivery Parts are the only source of part names — a designer does not invent one. Cut along a real seam (engine systems versus HUD, a save-format migration versus the feature it enables, two mechanics with separate state owners); keep one part when one Design Doc holds the feature coherently. A part cut along `ui`, `hud`, or `menu` takes `technical-designer-frontend` and `ui-analyzer` in the technical phase; every other seam takes `technical-designer` and `codebase-analyzer`. Do not split by schedule — the six game phases are phases within one plan, not parts. Every requirement belongs to exactly one part; `dependsOn` is acyclic and fixes the order parts are designed and built in; a change to the list goes back through `mid-game-designer` in `update` mode and Feature Spec re-approval; a part whose plan is `completed` is frozen.

A part may hold several plans, each paired with a directory of the same name holding its decomposition. Each plan declares its position in frontmatter:

```yaml
---
feature: combat-rework
part: core
design: design-core.md
plan: 1 of 2
status: active                # draft | active | completed
depends-on:                   # previous plan filename; omit for the first
---
```

Exactly one plan per part may be `active`. Escalate rather than guess when two claim it, when the file count disagrees with `M`, or when a `depends-on` names a missing file.

The 6 game phases (Core Mechanics, Game Feel, Art, UI, Analytics, QA) are phases *within* one plan, not separate plans. Reach for a second plan when a later pass is genuinely deferred — a post-playtest tuning round — not to model the phase sequence.

*Note: Work plans are excluded by `.gitignore`

## ADR Status
`Proposed` → `Accepted` → `Deprecated`/`Superseded`/`Rejected`

Check existing ADRs before design and implementation; the Design Doc lists them as Prerequisite ADRs. No rule pre-decides that an ADR will be written — the three-part test is applied to the finished design.

## Diagram Requirements

Required diagrams for each document. Every diagram follows the `mermaid-diagrams` skill (palette, redraw test, path animation, render check):

| Document | Required Diagrams | Purpose |
|----------|------------------|---------|
| PRD | User journey diagram, Scope boundary diagram | Clarify user experience and scope |
| ADR | Option comparison diagram (when needed) | Visualize trade-offs |
| Design Doc | C2 container diagram always; C1, C3, C4 when they apply; a sequence diagram per runtime flow | Zoom from context to code; show each flow as the running system executes it |
| Work Plan | Phase structure diagram, Task dependency diagram | Clarify implementation order |

## Common ADR Relationships
1. **At creation**: Identify common technical areas (logging, error handling, async processing, etc.), reference existing common ADRs
2. **When missing**: Consider creating necessary common ADRs
3. **Design Doc**: Specify common ADRs in "Prerequisite ADRs" section
4. **Compliance check**: Verify design aligns with common ADR decisions