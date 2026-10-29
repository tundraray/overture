---
name: workflow-gamedev
description: This skill governs the product phase for game development — scenario detection, development modes, market analysis, GDD, and the game design disciplines that precede technical design. Automatically loaded when orchestrating game development work, or when "GDD", "game design", "core loop", "game feel", "art direction", or "prototype mode" are mentioned.
---

# Game Development Product Phase

This skill replaces `workflow-product` for game development. Everything after it is unchanged: the technical phase is `workflow-technical`, and planning plus execution is `workflow-execution` (substituting `gamedev-work-planner` for the planner). Shared mechanics — invoking agents, response contracts, delegation boundaries, file ownership, TodoWrite — are in `workflow-orchestration`.

A game feature and a service endpoint need the same design rigour, the same codebase fact gathering, and the same verification. What differs is upstream: what "the product" is, who defines it, and how a project starts.

## Scope

**In scope**: scenario detection, development-mode routing, market analysis, GDD, feature specs, mechanics and game-feel specification, art direction, game UI/UX, analytics design, and the stop points gating each.

**Out of scope**: codebase fact gathering, Design Doc, ADR, and test skeletons — all `workflow-technical`, used unchanged. Work plan, batch approval, and decomposition — all `workflow-execution`.

## Gamedev Agents

| Agent | Owns |
|-------|------|
| **producer-agent** | Project scope and timeline; project config, team selection, resource plan |
| **market-analyst** | Market analysis, competitor research, Go/No-Go |
| **sr-game-designer** | Game vision — GDD (pillars, core loop, progression) |
| **mid-game-designer** | Feature specifications derived from GDD systems |
| **mechanics-developer** | Game mechanics architecture |
| **game-feel-developer** | Game feel specification (juice, feedback, responsiveness) |
| **sr-game-artist** | Art direction, style guide, colour palette — *what* |
| **technical-artist** | Pipeline specs, atlas optimization, shaders — *how* |
| **ui-ux-agent** | Game UI/UX — HUD, menus, interaction, accessibility |
| **data-scientist** | Analytics and telemetry design, KPIs, A/B tests |

### Principles

- **GDD is a first-class artifact** and the single source of truth for game design. Every agent references it for design decisions; changes to it require `document-reviewer` approval. Feature specs derive from GDD systems rather than restating them.
- **Art has two owners.** `sr-game-artist` defines what it looks like; `technical-artist` defines how it ships. Consult both before any art-related implementation task — a style decision with no pipeline behind it produces assets the build cannot use.
- **producer-agent holds scope authority.** When a design decision expands scope or timeline, it routes there rather than being absorbed silently.

## Scenario Detection

`requirement-analyzer` selects the flow from what already exists in the repository:

```yaml
scenarioDetection:
  checkProjectConfig: "Does docs/project-config.json exist?"
  checkGDD: "Does docs/game-design/*-gdd.md exist?"

  rules:
    - condition: "No project-config.json AND no GDD"
      scenario: "A (New Project)"
    - condition: "project-config.json exists AND GDD exists"
      scenario: "B (Existing Project)"
    - condition: "project-config.json exists AND no GDD"
      scenario: "B (Existing Project, pre-GDD)"
      note: "Consider creating the GDD first — feature specs derive from it"
```

## Development Mode Routing

Detected by `requirement-analyzer` from the user's request. Confirm the detected mode at the first stop rather than assuming it.

| Mode | Description | Flow modification |
|------|-------------|-------------------|
| **Full Development** | Standard scale-based flow | None |
| **Design Only** | Run the product phase to completion, stop before technical design | Deliver the design package; no implementation |
| **Prototype** | requirement-analyzer → sr-game-designer (core loop only) → mid-game-designer (lite feature spec, one part) → simplified plan | Skip market analysis, art direction, and analytics; the lite spec still exists, so the execution entry gate and the parts list hold |

## Flow

### Scenario A — New Project

1. **requirement-analyzer** → requirements + project discovery + preliminary part proposal
   **[Stop: requirements + development mode selection]**
2. **market-analyst** → market analysis, competitor research, Go/No-Go
   **[Stop: Go/No-Go]**
3. **producer-agent** → project config, team selection, resource plan
4. **sr-game-designer** → GDD (vision, pillars, core loop, progression)
5. **document-reviewer** → GDD review
   **[Stop: GDD approval]**
6. **mid-game-designer** (`depth: full`) → one feature spec per feature the GDD defines, each with its **Delivery Parts** section refining the part proposal → **document-reviewer** (`doc_type: FeatureSpec`)
   **[Stop: Feature Spec approval — includes the parts split]** — once per feature
7. **mechanics-developer** → game mechanics architecture
8. **game-feel-developer** → game feel specification
9. **sr-game-artist** → art direction, style guide, palette
   **technical-artist** → pipeline specs, atlas optimization, shader requirements
10. **ui-ux-agent** → game UI/UX: HUD, menus, interaction, accessibility
11. **data-scientist** → analytics and telemetry design, KPIs, A/B tests

**Design Only mode stops here** — deliver the design package.

→ hand off to `workflow-technical`, **once per feature spec**: each feature the GDD defines has its own spec, its own parts list, and its own run of the technical and execution phases. The exit gate and handoff below are evaluated per feature.

### Scenario B — Large Feature in an existing project

1. **requirement-analyzer** → requirements analysis + preliminary part proposal
   **[Stop: requirements confirmation]**
2. **sr-game-designer** → GDD update for the new feature
3. **document-reviewer** → GDD review
   **[Stop: GDD approval]**
4. **mid-game-designer** (`depth: full`) → feature spec with Delivery Parts → **document-reviewer** (`doc_type: FeatureSpec`)
   **[Stop: Feature Spec approval — includes the parts split]**
5. **mechanics-developer** → mechanics architecture for the feature
6. *[Conditional, by feature type]* **game-feel-developer**, **sr-game-artist**, **ui-ux-agent**, **data-scientist**

→ hand off to `workflow-technical`

### Medium scale

1. **requirement-analyzer** → requirement analysis + preliminary part proposal
   **[Stop: requirements confirmation]**
2. *[Conditional]* **sr-game-designer** → game design spec (when new mechanics are involved)
3. **mid-game-designer** (`depth: lite`, or `update` when a spec already covers the feature) → feature spec with Delivery Parts → **document-reviewer** (`doc_type: FeatureSpec`, `depth: lite`)
   **[Stop: Feature Spec approval — includes the parts split]**
4. **mechanics-developer** → mechanics architecture (when new systems are involved)
5. *[Conditional]* **ui-ux-agent** (UI work), **game-feel-developer** (polish work)

→ hand off to `workflow-technical`

### Small scale

1. **requirement-analyzer** → requirement analysis + single-part proposal
   **[Stop: requirements confirmation]**
2. **mid-game-designer** (`depth: lite`) → a short feature spec: the change, its acceptance criteria, one part → **document-reviewer**
   **[Stop: Feature Spec approval]**

No technical documents → `workflow-execution` for a simplified plan whose traceability maps to the spec's acceptance criteria.

The feature spec plays the role the PRD plays in `workflow-product`: it exists at every scale, its depth follows the scale, and its Delivery Parts section is the only source of part names. The GDD stays at project level and does not carry parts.

## Stop Points

| Stop | After | What the user decides |
|------|-------|----------------------|
| Requirements + mode | requirement-analyzer | Scope, scale, which development mode applies; a first look at the proposed parts |
| Go/No-Go | market-analyst | Whether the project proceeds at all (Scenario A) |
| GDD approval | document-reviewer completes GDD review | Whether the vision, pillars, and core loop are right (Scenario A and B) |
| Feature Spec approval | document-reviewer completes feature spec review | Whether the acceptance criteria are right, and whether the Delivery Parts split is the right one — every scale |

Each stop happens once per feature (Scenario A: once per feature the GDD defines). Per-part stops begin in `workflow-technical`.

The technical phase adds Design Doc approval and, when one is written, ADR approval. Batch approval belongs to `workflow-execution`.

## Exit Gate [BLOCKING]

Run before handing off to `workflow-technical`. Same contract as `workflow-product`, with the game artifacts substituted.

☐ The user has confirmed requirements and the detected development mode
☐ Scenario (A or B) is recorded, with the evidence that selected it
☐ Go/No-Go decision recorded (Scenario A)
☐ GDD exists and is approved, or an explicit note that this feature does not change it
☐ Feature spec exists at the depth the scale requires and is approved
☐ Conditional disciplines are either produced or explicitly marked not applicable — game feel, art direction, UI/UX, analytics
☐ The parts list is confirmed — the approved feature spec's Delivery Parts section. Every part has a name, what it covers, a `cutAlong` seam, and `dependsOn` entries naming other parts in the list, with no cycle
☐ Every open question is written down with the decision it blocks and who resolves it
☐ Every `document-reviewer` verdict is `approved`, or the user accepted the open findings and the owner recorded them in the document

**Handoff payload**:

| Item | Form |
|------|------|
| GDD | `docs/game-design/{project}-gdd.md`, or "unchanged by this feature" — context for the designers |
| Feature spec | `docs/game-design/features/{feature}-spec.md`, with its depth — stands in for the PRD at the technical entry gate |
| Discipline outputs | Paths for mechanics, game feel, art direction, UI/UX, analytics — or "N/A" each; the `ui-ux-agent` output stands in for the UXRD |
| Parts list | `{name, covers, cutAlong, dependsOn}` per part, in dependency order — copied from the feature spec's Delivery Parts; `workflow-technical` designs one `design-{part}.md` per entry |
| Scale | `{small\|medium\|large}` plus `decidingAxis` |
| Open questions | List of `question → decision it blocks → owner` |

**Design Only mode terminates here** — deliver the payload as the design package rather than handing off.

**ENFORCEMENT**: an unchecked item means the phase is not finished. A discipline left neither produced nor marked N/A becomes an unowned gap that surfaces during implementation.

## Phase Note for Execution

The 6 game development phases (Core Mechanics, Game Feel, Art, UI, Analytics, QA) are phases **within one work plan**, not separate plans. The `per-phase` commit strategy in `workflow-execution` groups commits by them. Reach for a second plan only when a later pass is genuinely deferred — a post-playtest tuning round — rather than to model the phase sequence.
