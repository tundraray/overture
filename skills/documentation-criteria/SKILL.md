---
name: documentation-criteria
description: This skill should be used when the user asks to "create a PRD", "write a UXRD", "write an ADR", "create a design doc", "make a work plan", "create task files", "update the design system", or "revise a document", or needs guidance on document templates, writing a document for a cold reader, creation criteria, or determining which documents are required for a given change scope.
---

# Documentation Creation Criteria

Read [authoring-rules.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/authoring-rules.md) before writing, revising, or reviewing any document. It holds Writing for the Reader, Revising a Document, and Draft Check.

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

Documents in `[brackets]` are conditional.

**A PRD is written at every scale.** Its depth varies — `full` at large scale, `lite` at medium and small (see "PRD depth" below) — but the document always exists, so the feature's requirements and its Delivery Parts have one home regardless of how the work was routed.

**Design Docs and work plans are written per part** (see "Parts" under Storage Locations).

**File count is one scale signal, not the deciding rule.** Contract, data, boundary, and decision risk can each raise the scale on their own — a two-file change that breaks a public contract or migrates persisted data is not a small-scale change. Take the scale and its `decidingAxis` from `task-analyzer`'s five-axis assessment ("Estimate Task Scale"), which owns the axes; the highest scale any axis triggers wins.

## ADR Creation Conditions

**An ADR is written after the Design Doc, not before it.** It extracts a decision the design made, so it outlives the feature that produced it. Most features produce none.

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

## Detailed Document Definitions

**One fact, one document.** Each fact has exactly one home — the document whose definition (below, or in `references/authoring-rules.md`) includes it. A later document cites an earlier one by ID (`UC-2`, `AC-01.3`, `FR-05`, `KD-3`) and never retells it: a retold requirement drifts from its source at the first revision of either, and the reviewer cannot tell which copy is meant. The chain is PRD (what the user achieves) → UXRD (what the user sees and does) → Design Doc (how the system does it); the design system, shared by every feature, holds how the interface looks and how each component works.

### PRD (Product Requirements Document)

**Purpose**: Define business requirements and user value

**Includes**:
- Business requirements and user value
- Users and use cases
- Functional requirements, each a capability with an observable outcome and an acceptance criterion, prioritized by MoSCoW; Won't Have records every exclusion with its reason
- Success criteria — how, after release, the goal is seen to be reached
- Constraints and risks at product level — constraints, the assumptions the decision rests on, product risks
- **Delivery Parts** — the partition of the requirements into independently designable slices, each with the requirements it covers and the parts it depends on (see "Parts" below)
- Part dependency diagram (three or more parts, at either depth)

**PRD depth**:

| Depth | When | Sections |
|-------|------|----------|
| `full` | Large scale | Every template section, including Constraints and Risks |
| `lite` | Medium and small scale | Snapshot, Background, Users and Use Cases, Functional Requirements with MoSCoW and acceptance criteria, Non-Functional Requirements only where the feature sets one, Delivery Parts, Success Criteria, Constraints and Risks when the feature has any, Undetermined Items while any remain |

A lite PRD is a short document, not a sketchy one: every requirement it lists still carries an acceptance criterion and a MoSCoW priority, and every Must Have belongs to a part. `document-reviewer` receives the depth and applies Gate 0 accordingly. An existing PRD is updated rather than duplicated, at whatever depth it already has.

**Excludes**:
- **How the system does it** (→Design Doc) — field and schema lists, storage technology, protocols, library choices and versions, file paths, process and recovery mechanics; an inventory of existing dependencies (→the design's codebase analysis). A requirement states the capability and its observable outcome; a technical choice the user fixed as a product decision is one line in Constraints and Risks
- Technical selection rationale (→ADR)
- **Implementation phases** (→Work Plan) — a part is a slice of *what* is built; a phase is a step in *when* it is built. Parts belong in the PRD, phases do not.
- **Task breakdown** (→Work Plan)
- **How the interface looks and behaves** (→UXRD and the design system) — screen states (loading, empty, error), microcopy, ARIA attributes and focus behaviour, breakpoints, design tokens, animation. The PRD states the observable outcome ("the open thread is marked as current") and, in Non-Functional Requirements, the target level ("WCAG 2.1 AA", "usable from 360 px") — not how either is met
- **Decisions for the design and ADR signals** (→requirement-analyzer output and the Design Doc) — a list of technical questions the design must settle is not a product requirement

### UXRD (UX Requirements Document)

**Purpose**: Specify what the user sees and does for the PRD's requirements that have a user-visible surface. Written when the work has a UI surface, after PRD approval.

**Includes**:
- AC coverage: each user-visible PRD acceptance criterion cited by ID in the flow or screen state that delivers it
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
- Terms already in the PRD's Terms

### Design System

**Purpose**: Hold the product's visual language and its reusable components — how they look and work, without code. It lives in `docs/design-system/`, is shared by every feature, and is owned by `ux-designer`.

**Includes**:
- `README.md`: the source (brand book, external design system, or defined here), the direction in one phrase with references, and an index
- `foundations.md`: typography, color roles for light and dark, spacing and density, shape and elevation, motion, iconography
- `components/{component-name}.md`: purpose, anatomy, variants and sizes, states, content rules, accessibility, and the UXRDs it is used in

**Excludes**:
- Feature flows, screens, and copy (→UXRD)
- Code of any kind — CSS, token source, props, markup (→implementation)
- What a brand book or external design system already defines (cite it; fill only its gaps)

**Lifecycle**: the `design-system` skill, "Workflow".

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

A **part** is one independently designable slice of a feature — a short kebab-case name such as `core`, `api`, `checkout-ui`, or `migration`. Every feature has at least one.

`design-{part}.md` and the directory `{part}/` share the part name and are read as a pair — the design states what to build, the directory holds the plans that build it.

#### Where parts are decided

Splitting into parts is a **product-phase decision**: proposed by the model, confirmed by the user, and settled before any design begins.

The decision follows one path at every scale, because a PRD exists at every scale:

| Step | Agent | Record |
|------|-------|--------|
| Propose | `requirement-analyzer` | `parts[]` in its analysis — preliminary, shown at the requirement confirmation stop |
| Refine | `prd-creator` | PRD, "Delivery Parts" section — the authoritative record |
| Confirm | user | PRD approval stop |

At small scale the proposal is one part and the refinement is a one-row table. At medium scale a split rarely exceeds two parts.

The confirmed Delivery Parts section is the **parts list**. It is handed from phase to phase and is the only source of part names: a designer does not invent one, and a plan's `part:` frontmatter must name one from the list.

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
- **Changing the parts list is a PRD change.** It goes through `prd-creator` in `update` mode and back to the PRD approval stop. Designs of parts the change does not touch stay approved, and an already implemented part is frozen — a change that would alter it is a new feature, not a revision.

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
temporary: true               # required — AI working file (authoring-rules.md, Temporary Working Files)
---
```

The frontmatter is the single source of truth for plan sequencing.

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

### Small scale

Small scale produces a lite PRD and a simplified work plan, and no Design Doc. The plan's `design:` frontmatter is therefore `none` with the note `small scale — the PRD is the specification`; `work-planner`'s rule that a plan needs an approved design is exempted at this scale only, and the plan's task lines cite PRD requirements instead of Design Doc items.

## Diagram Requirements

Required diagrams for each document. Every diagram follows the `mermaid-diagrams` skill (palette, redraw test, path animation, render check):

| Document | Required Diagrams | Purpose |
|----------|------------------|---------|
| PRD | Part dependency diagram (three or more parts, either depth) | Clarify the order parts are designed in |
| ADR | Option comparison diagram (when needed) | Visualize trade-offs |
| Design Doc | the C1–C4 levels the change touches, at least one (`mermaid-diagrams` `references/c4-levels.md`); a sequence diagram per AC that crosses a container boundary or has a failure path that changes state | Zoom from context to code as far as the change reaches; show each such flow as the running system executes it |
