---
name: documentation-criteria
description: This skill should be used when the user asks to "write a GDD", "write a feature spec", "write a market analysis", "write a UXRD", "write an ADR", "create a design doc", "make a work plan", "create task files", "update the design system", or "revise a document", or needs guidance on document templates, writing a document for a cold reader, creation criteria, or determining which documents are required for a given change scope.
---

# Documentation Creation Criteria

Read [authoring-rules.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/authoring-rules.md) before writing, revising, or reviewing any document. It holds Writing for the Reader, Revising a Document, and Draft Check.

## Templates

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

## Creation Decision Matrix

| Condition | Required Documents | Creation Order |
|-----------|-------------------|----------------|
| New Game Project | Market Analysis → GDD → Feature Spec (full) per feature → [UXRD] → Design Doc per part → [ADR] → Work Plan per part | After Feature Spec approval |
| New Game Feature (large) | GDD update → Feature Spec (full) → [UXRD] → Design Doc per part → [ADR] → Work Plan per part | After Feature Spec approval |
| Medium scale | Feature Spec (lite) → [UXRD] → Design Doc per part → [ADR] → Work Plan per part | After Feature Spec approval |
| Art/Visual Change | Art Direction → Feature Spec (lite) → [UXRD] → Design Doc per part | After Feature Spec approval |
| Small scale, or Prototype mode at any scale | Feature Spec (lite) → simplified Work Plan | After Feature Spec approval |

Documents in `[brackets]` are conditional.

**A feature spec is written at every scale.** It is the feature-level product document — the PRD's role in the shared workflow — and its depth follows the scale: `full` at large (every template section), `lite` at medium and small (every section not marked *(full depth)*). The GDD stays at project level. Design Docs and work plans are written per part; the parts list is the feature spec's Delivery Parts section (see "Parts and plans").

## ADR Creation Conditions

**An ADR is written after the Design Doc, not before it**, and only when a decision the design made passes all three parts of the test:

1. **Costly to reverse** — undoing it later means migrating data, breaking consumers, or coordinated changes across repositories
2. **Binds beyond this feature** — future unrelated work must comply with it
3. **Had real alternatives** — a genuine choice existed and one was taken

Fail any one → no ADR; record the reasoning in the Design Doc. Most features produce none.

Game-specific decisions that commonly meet all three: save-file format, netcode authority model, the engine or renderer target, and the analytics event schema other tools consume. Ordinary mechanics tuning, adding a state to an existing machine, or picking a tween library do not.

## Detailed Document Definitions

**One fact, one document.** Each fact has exactly one home — the document whose definition (below, or in `references/authoring-rules.md`) includes it. A later document cites an earlier one by ID (`AC-1`, `OQ-2`, `KD-3`) and never retells it: a retold requirement drifts from its source at the first revision of either, and the reviewer cannot tell which copy is meant. The chain is GDD (the game's vision and systems) → Feature Spec (what the player achieves with one feature) → UXRD when the feature has a UI surface (what the player sees and does) → Design Doc (how the system does it); the design system, shared by every feature, holds how the HUD and menus look and how each component works.

*No PRD is produced on the gamedev path: the feature spec plays its role and carries the Delivery Parts.*

### GDD (Game Design Document)

**Purpose**: Define game vision, core mechanics, progression, and systems

**Includes**:
- Core loop
- Game pillars
- Progression systems

**Excludes**:
- Technical implementation (→Design Doc)
- Market analysis (→Market Analysis)
- Balancing values of a feature (→Feature Spec, which owns them)
- Detailed art specifications (→the Art Direction document; the GDD states the direction in a few lines)

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
- AC coverage: each user-visible feature-spec acceptance criterion cited by ID in the flow or screen state that delivers it
- Component Inventory: each component the feature uses, linked to its design-system spec and marked reused, extended, or new
- User flows through the screens, each citing the acceptance-criteria IDs it implements
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

**Lifecycle**: the `design-system` skill, "Workflow".

## Scale Axes

**File count is one scale signal, not the deciding rule.** Contract, data, boundary, and decision risk can each raise the scale on their own — a two-file change that breaks a save-file format or a networked contract is not a small-scale change. Take the scale and its `decidingAxis` from `task-analyzer`'s five-axis assessment ("Estimate Task Scale"), which owns the axes; on the gamedev path a save-format migration counts as a persisted-data migration. The highest scale any axis triggers wins.

## Storage Locations

Documents are grouped **by feature**, not by document type. Game-wide documents (GDD, market analysis) stay global, as do ADRs — a decision usually outlives and spans features — and the design system, which every feature's UI shares.

```
docs/
├── adr/ADR-0007-save-format.md
├── design-system/{README,foundations}.md, components/{component-name}.md
├── game-design/{project}-gdd.md, features/{feature}-spec.md
├── art/{project}-art-direction.md
├── analytics/{project}-analytics.md
├── resources/market-research/{market_overview,summary}.md
└── features/{feature}/
    ├── uxrd.md
    ├── design-{part}.md
    └── {part}/
        ├── {plan-name}.md
        └── {plan-name}/{_overview,task-01}.md, analysis/{topic}.md
```

| Document | Path | Naming Convention | Template |
|----------|------|------------------|----------|
| ADR | `docs/adr/` | `ADR-[4-digits]-[title].md` | [adr-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/adr-template.md) |
| Design Doc | `docs/features/{feature}/` | `design-{part}.md` | [design-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/design-template.md) |
| Work Plan | `docs/features/{feature}/{part}/` | `YYYYMMDD-{type}-{description}.md` | [plan-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/plan-template.md) |
| Task File | `docs/features/{feature}/{part}/{plan-name}/` | `task-{number}.md` | [task-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/task-template.md) |
| Analysis deliverable | `docs/features/{feature}/{part}/{plan-name}/analysis/` | `{topic}.md` | — |
| UXRD | `docs/features/{feature}/` | `uxrd.md` | [uxrd-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/uxrd-template.md) |
| Design System | `docs/design-system/` | `README.md`, `foundations.md`, `components/{component-name}.md` | [design-system-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/design-system-template.md) |
| GDD | `docs/game-design/` | `[project-name]-gdd.md` | [gdd-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/gdd-template.md) |
| Market Analysis | `docs/resources/market-research/` | `market_overview.md`, `summary.md` | [market-analysis-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/market-analysis-template.md) |
| Feature Spec | `docs/game-design/features/` | `[feature-name]-spec.md` | [feature-spec-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/feature-spec-template.md) |
| Art Direction | `docs/art/` | `[project-name]-art-direction.md` | N/A |
| Analytics Setup | `docs/analytics/` | `[project-name]-analytics.md` | [analytics-setup-template.md](${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/references/analytics-setup-template.md) |


### Parts and plans

A **part** is one independently designable slice of a feature — `core`, `combat`, `hud`, `save-migration`. Every feature has at least one, so every agent resolves paths with a single glob. `design-{part}.md` and the directory `{part}/` share the part name and are read as a pair.

The split is a product-phase decision: `requirement-analyzer` proposes it in `parts[]`, `mid-game-designer` refines it into the feature spec's Delivery Parts section, and the user confirms it at Feature Spec approval, before any design begins. The confirmed Delivery Parts are the only source of part names — a designer does not invent one. Cut along a real seam (engine systems versus HUD, a save-format migration versus the feature it enables, two mechanics with separate state owners); keep one part when one Design Doc holds the feature coherently. Every part takes `technical-designer` in the technical phase — the gamedev plugin ships no frontend designer; a part cut along `ui`, `hud`, or `menu` adds `ui-analyzer` to `codebase-analyzer`. Do not split by schedule — the six game phases are phases within one plan, not parts. Every Must Have acceptance criterion belongs to exactly one part, and a Should Have or Could Have belongs to a part or is explicitly deferred; `dependsOn` is acyclic and fixes the order parts are designed and built in; a change to the list goes back through `mid-game-designer` in `update` mode and Feature Spec re-approval; an already implemented part is frozen.

A part may hold several plans, each paired with a directory of the same name holding its decomposition. Each plan declares its position in frontmatter:

```yaml
---
feature: combat-rework
part: core
design: design-core.md
plan: 1 of 2
status: active                # draft | active | completed
depends-on:                   # previous plan filename; omit for the first
temporary: true               # AI working file (documentation-criteria)
---
```

`design` is `none` only for a simplified plan — small scale, or Prototype mode at any scale (`workflow-gamedev`) — where the lite feature spec is the specification and the plan traces to its acceptance criteria.

Exactly one plan per part may be `active`. Escalate rather than guess when two claim it, when the file count disagrees with the `M` in `plan: N of M`, or when a `depends-on` names a missing file.

## Diagram Requirements

Required diagrams for each document. Every diagram follows the `mermaid-diagrams` skill (palette, redraw test, path animation, render check):

| Document | Required Diagrams | Purpose |
|----------|------------------|---------|
| Feature Spec | Part dependency diagram (three or more parts) | Show the order parts are designed and built in |
| ADR | Option comparison diagram (when needed) | Visualize trade-offs |
| Design Doc | the C1–C4 levels the change touches, at least one (`mermaid-diagrams` `references/c4-levels.md`); a sequence diagram per AC that crosses a container boundary or has a failure path that changes state | Zoom from context to code as far as the change reaches; show each such flow as the running system executes it |
