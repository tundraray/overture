---
name: documentation-criteria
description: This skill should be used when the user asks to "write a GDD", "write a feature spec", "write a market analysis", "write a UXRD", "write an ADR", "create a design doc", "make a work plan", "create task files", "update the design system", or "revise a document", or needs guidance on document templates, writing a document for a cold reader, creation criteria, or determining which documents are required for a given change scope.
---

# Documentation Creation Criteria

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
| New Game Project | Market Analysis → GDD → Feature Spec (full) per feature → Design Doc per part → [ADR] → Work Plan per part | After Feature Spec approval |
| New Game Feature (large) | GDD update → Feature Spec (full) → Design Doc per part → [ADR] → Work Plan per part | After Feature Spec approval |
| Medium scale | Feature Spec (lite) → Design Doc per part → [ADR] → Work Plan per part | After Feature Spec approval |
| Art/Visual Change | Art Direction → Feature Spec (lite) → Design Doc per part | After Feature Spec approval |
| Small scale, or Prototype mode at any scale | Feature Spec (lite) → simplified Work Plan | After Feature Spec approval |

**The ADR follows the Design Doc**, and is written only when a decision the design made passes all three parts of the test below. Most features produce none. Documents in `[brackets]` are conditional.

**A feature spec is written at every scale.** It is the feature-level product document — the PRD's role in the shared workflow — and its depth follows the scale: `full` at large (every template section), `lite` at medium and small (header and Snapshot, Problem Statement, User Stories, Acceptance Criteria, Delivery Parts, Integration Points). The GDD stays at project level. Design Docs and work plans are written per part; the parts list is the feature spec's Delivery Parts section (see "Parts and plans").

## ADR Creation Conditions

**An ADR is written after the Design Doc, not before it**, and only when a decision the design made passes all three parts of the test:

1. **Costly to reverse** — undoing it later means migrating data, breaking consumers, or coordinated changes across repositories
2. **Binds beyond this feature** — future unrelated work must comply with it
3. **Had real alternatives** — a genuine choice existed and one was taken

Fail any one → no ADR; record the reasoning in the Design Doc.

Game-specific decisions that commonly meet all three: save-file format, netcode authority model, the engine or renderer target, and the analytics event schema other tools consume. Ordinary mechanics tuning, adding a state to an existing machine, or picking a tween library do not.

## Writing for the Reader

A document is read far more often than it is written, and most readers stop after the first screen. Every document this plugin writes — GDD, Feature Spec, UXRD, Design Doc, ADR, work plan, and the market and analytics documents — follows these rules; the templates are laid out to match them. How the finished document reads, as a whole and sentence by sentence, is checked with the `prose` skill.

**The reader is cold.** They know the product and the codebase in general, but not this feature, and they read without the author or the conversation that produced the document — a teammate, the user at an approval stop, the implementer months later. **Lean** means the document says fewer things and says each one fully; the same content squeezed into shorthand is not lean, it is unreadable.

**Order.** A short header (status, date, links to the neighbouring documents — no more than five fields) → **Snapshot** → the body → the appendix (**Appendix: Fact Disposition** in a Design Doc, **Appendix: Traceability** in a work plan) → **Update History**, always last. A reader learns what the document decides before how it was researched or how it got here. An ADR's Status and Decision sections are its header and Snapshot, and it has no Update History: a changed decision is a new ADR that supersedes it.

**Snapshot.** At most ten lines at the top. It opens with **Overview** — three to five plain sentences telling what problem this solves and how, the way one explains it to a colleague: no IDs, no code names the reader has not met. Then what does not change, the biggest risk, and whether questions are open, with a link to them. A cold reader who stops there can say what the document decides. A Design Doc and a UXRD follow it with three to seven **Key Decisions** — in a Design Doc a `KD-n` heading with a paragraph of why and the options not taken, in a UXRD a table — not counted in the Snapshot's ten lines; the rest of the document cites `KD-n` instead of re-arguing the decision.

**Current truth only.** The body states what is true now. Who decided, on which date, in which version, or in answer to which review finding belongs to Update History and to git — not to requirements, acceptance criteria, table cells, or design text. "(user decision 2026-10-28)", "v1.2:", "per review I003" in the body are defects. Update History has one line per version, a phrase per change, no reviewer IDs.

**Delete, don't stub.** A section marked *when applicable* is deleted when it does not apply — no "N/A", no "does not exist", no placeholder sentence. Template guidance in `<!-- -->` comments is never copied into the document. A mandatory section that has nothing to say answers in one line with the reason.

**Short units.** A paragraph has at most four sentences. A table cell holds one phrase or short sentence; reasoning goes under the table or into Key Decisions. A list item is one statement.

**Sentences, not telegrams.** Write sentences with a subject and a verb, one idea each. A chain of noun phrases joined by commas, semicolons, and parentheses is shorthand only the author can expand — split it, or cut what the reader does not need. A table cell is one phrase a newcomer can read: "the event survives a crash because it is written in the same transaction", not "tx outbox, crash-safe". A table or diagram whose title does not say what it shows gets one lead sentence that does.

**Terms.** A word the cold reader may not know — a domain term, a technique, an abbreviation — is explained in a few words where it first appears. A document that leans on five or more such words gathers them in a short **Terms** list after the Snapshot instead.

**For people first.** The body is prose, lists, tables, and diagrams a person reads. YAML blocks, checklists of pointers or pre-ticked items, and tables that only map one ID set onto another do not appear in the body — progress checkboxes a reader or executor ticks, as in a work plan or task file, are not such a checklist: traceability is written once where the reader meets it ("covers AC-03.1" on a use case), and a record kept for tools goes to the document's appendix. No sentence only tells the reader where else to look; the link sits where the reader needs it.

**One language.** The document is written in the project's document language. Section headings keep the template's wording, because other documents and agents link to them by anchor; everything under a heading — labels, table headers, text — is in the document's language.

**Words before IDs.** Prose names things in words and adds the ID in parentheses — "the open thread is marked as current (AC-01.2)" — not "AC-01.2, SB-06, UX-04". A list citing PRD requirements or criteria by ID only (Covers, From the PRD, a flow's "for") is allowed. Each ID is defined in exactly one place and cited everywhere else.

**Cite by path and ID, never by version.** A link to a neighbouring document names its path and the section or ID — `uxrd.md` MC-8 — not "UXRD v1.6"; a UXRD element is cited by its ID (TH-10), not by its section number. A version in a citation goes stale on the neighbour's next edit and turns every edit into a round of edits elsewhere.

**Write what this document decides, and only what is decided.** Every statement in a document is a promise that has to stay true. Detail that the document does not own, or that is not settled, goes stale and comes back as a review finding:
- **One owner per value.** A number, a UI string, a threshold, or a limit is written in the document that owns it. Everywhere else cites it by ID without repeating the value — "within the title latency budget (AC-17.1)", not "within 10 s (AC-17.1)". A repeated value drifts at the owner's next edit. The one exception is a work plan's Reference Contract Values, which copy a binding value verbatim next to its source because the executor reads the task without the design open.
- **Verified or assumed, never guessed.** A claim about how a library, framework, or existing code behaves is either verified — with how: the installed version, the code location, a spike — or written as an assumption with the check that will settle it in the plan. Internals that do not show at a contract boundary (call order inside a library, exception class names, props of a third-party component, the database lock mode or lock order behind an invariant) are not written at all; the design states the invariant, implementation decides the mechanism.
- **The design's altitude, not the code's.** A contract, schema, or data model is described at the level its consumer and reviewer need: what each operation does, what it returns, which failures the caller handles, what each field means. Storage lengths and sizes no caller observes, full column lists, query conditions, and update guards are code — restated as table rows they are still code, and go stale the same way. An exact value a caller or test observes at the contract — a limit, an enum value, a status code, a timeout, a setting's name and default — is written as it is; the work plan's Reference Contract Values copy it.
- **No references that go stale on their own.** No line numbers into another document or the codebase, no version tags in headers of generated files, no counts of something listed elsewhere — tasks, tests, cases ("19 tasks", "3/14"); a list counts itself, no status line that narrates which versions are pending.
- **Undecided stays an open question.** An acceptance criterion whose outcome is not decided cites the open question and states nothing else — no list of acceptable alternatives, no "guarantee" the design rates as low certainty. The decision is written once, when it is made.

**Size.** Soft targets for the document, in characters, excluding Update History: PRD or Feature Spec lite 15 000, PRD or Feature Spec full 30 000, UXRD 40 000, design-system component spec 6 000, Design Doc 45 000 per part (appendix included), ADR 10 000. Over the target, the author merges restated content into a citation — and `document-reviewer` raises a `recommended` issue naming what to move or cut. The target is a signal, not a cap.

## Revising a Document

An edit is finished when nothing else still says the old thing. Most findings on a re-review sit not in the edited lines but in the places that relied on them.

- **Bounds.** A revision edits only the finding's span and the passages that depend on it; every other passage stays byte-for-byte. A sound paragraph reworded in passing is how a revision breaks a section that already passed review.
- **One write per region.** The change to a region — a section, a table, a diagram — is composed whole and written in one Write or Edit, not built up by a run of small edits.
- **Dependents.** After an edit, find every place that cites, depends on, or restates what changed in this document, and make it agree. A dependent in another document — found by searching for the changed IDs — is named in the response (`nextSteps`), not edited; the orchestrator routes it to its owner.
- **Cuts.** Removing or merging content leaves no reference pointing at what was removed. Passages that share words but make different claims are not duplicates, and both stay.
- **Self-check scope.** A new document settles every item of the author's Self-Validation while it is composed, before the Write; after the Write the items are a check, not an edit pass. A change to sections, numbering, or IDs checks every item again, and a targeted edit checks the items whose subject it touched, plus the dependents check above. The diagram render check runs on every revision.

## Draft Check

Before it returns, the author has its written document read cold by `document-reviewer`. Most review findings are visible from the author's own inputs to a reader who did not write the text, so the author catches them before the stop instead of after it. This applies to the authors of a GDD, Feature Spec, Design Doc, ADR, and work plan; the UXRD (`game-ui-designer`) has none. Task files and the simplified plan (`design: none`, at small scale and in gamedev Prototype) have no draft check. Neither has a document whose caller reviews it itself — the reverse-engineering generation loops, or a change to several documents reviewed as one set: the caller's prompt says `draft_check: skip`, and the author returns `"verdict": "skipped"`.

1. **Creation.** The author composes the whole document, writes it once to its path, and runs the checks it already runs on the written file, such as the diagram render check. It then spawns the reviewer with coordinates only: `target` (the document path, and for a UXRD the design-system files written with it), `doc_type`, `depth` for a PRD or Feature Spec, and `review_scope: full`. No summary, rationale, or self-assessment goes with them, because the reviewer reads cold.
2. **Update or revision.** Before the first edit, the author copies the current version out of the repository with the shell — `cp docs/features/{feature}/prd.md <scratchpad>/prd.base.md`, where `<scratchpad>` is the session's scratchpad directory. The document guard allows a copy whose destination is outside the repository. After its edits the author spawns the reviewer with the same coordinates, `review_scope: changes`, `diff_base` set to the copy, and the issues the revision was asked to fix, if any.
3. **One round.** The author fixes the `critical` and `important` issues its inputs resolve, one Edit per region within the bounds of "Revising a Document", and does not run the reviewer again. Issues that need a user decision (scope, product judgment), `recommended` issues, and `deferred` findings are returned, not acted on.
4. **Return.** The author's JSON response gains a `draftCheck` field. Every finding the reviewer returned appears in `fixed` or in `open`; none is dropped.

   ```json
   "draftCheck": {
     "verdict": "<reviewer status> | not_run | skipped",
     "fixed": ["<issue id: one line>"],
     "open": [{"severity": "...", "issue": "...", "why_open": "needs user decision | recommended | deferred | could not resolve"}]
   }
   ```

The reviewer is spawned like any helper, two levels below the main conversation:

```
subagent_type: document-reviewer   # or <plugin>:document-reviewer, as the Agent tool lists it
```

It owns no document and spawns nothing, so the guard's rule against one owner spawning another does not apply. When the Agent tool is unavailable, the author returns `"verdict": "not_run"` with the reason, and the orchestrator offers an independent review at the stop as the recommended option.

## Detailed Document Definitions

**One fact, one document.** Each fact has exactly one home — the document listed below as including it. A later document cites an earlier one by ID (`AC-1`, `OQ-2`, `KD-3`) and never retells it: a retold requirement drifts from its source at the first revision of either, and the reviewer cannot tell which copy is meant. The chain is GDD (the game's vision and systems) → Feature Spec (what the player achieves with one feature) → UXRD when the feature has a UI surface (what the player sees and does) → Design Doc (how the system does it); the design system, shared by every feature, holds how the HUD and menus look and how each component works.

*No PRD is produced on the gamedev path: the feature spec plays its role and carries the Delivery Parts.*

### ADR (Architecture Decision Record)

**Purpose**: Record technical decision rationale and background

**Includes**:
- Decision (what was selected)
- Rationale (why that selection was made)
- Option comparison (at least two real options) and trade-offs
- Architecture impact
- Principled implementation guidelines (e.g., "Use dependency injection")

**Excludes**:
- Implementation schedule (→Work Plan)
- Detailed implementation procedures (→Design Doc)
- Specific code examples (→Design Doc)
- Resource assignments (→Work Plan)

### Design Document

**Purpose**: Describe, for a person reading top to bottom, how the part works and why it is built that way

**Includes**:
- **Existing codebase analysis** (required): the facts it yielded that the design transforms, removes, or puts out of scope, one row each in the Fact Disposition Table; preserved facts in one sentence
- Key decisions, each with the options not taken — a breaking change to an existing contract, and a data migration, are decisions
- Interface and contract definitions
- Data flow and component design
- **Acceptance criteria**: the feature spec's criteria cited by ID; plain-sentence criteria only where the design refines one
- Scope agreed with the user: what is out of scope and the constraints the design meets
- **Prerequisite ADRs** (including common ADRs)

**Excludes**:
- Source code of any kind — schemas, interfaces, function bodies, snippets of changed files, and their copies as field-by-field tables (→written at implementation; contracts state what a caller needs)
- Test code, test file names, fixtures, test helpers, mock boundaries (→acceptance-test-generator and task files; the Design Doc states use cases)
- Why that technology was chosen (→Reference ADR)
- Implementation order and approach, the files to change, integration points and how each is verified, the verification strategy, when to implement (→Work Plan)
- Who will implement (→Work Plan)

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
- Implementation approach (vertical/horizontal/hybrid), and the integration points where new code joins existing code
- Verification: what correctness means for the part and how it is proven, the early verification point and the task that runs it, and each phase's operational verification
- **A final Quality Assurance phase (required)**
- Progress records (checkbox format)

**Excludes**:
- Technical rationale (→ADR)
- Design details (→Design Doc)

The planner composes the phases from technical dependencies and the implementation approach, and owns the completion definition of a task ("Task Completion Definition: 3 Elements").

## Scale Axes

**File count is one scale signal, not the deciding rule.** Contract, data, boundary, and decision risk can each raise the scale on their own — a two-file change that breaks a save-file format or a networked contract is not a small-scale change. Take the scale and its `decidingAxis` from `task-analyzer`'s five-axis assessment ("Estimate Task Scale"), which owns the axes; on the gamedev path a save-format migration counts as a persisted-data migration. The highest scale any axis triggers wins.

## Creation Process

Each step names the evidence that must exist before the next step starts. A step without its output evidence has not completed, regardless of elapsed effort.

**1. Problem Analysis** — change scale assessment
- *Output evidence*: confirmed scale with its deciding axis named; a named source for each existing document consulted
- *Transition*: proceed when the scale has an explicit deciding axis. Whether an ADR is written is decided after the Design Doc, by the test in "ADR Creation Conditions"

**2. ADR Option Consideration** (ADR only, after the Design Doc) — compare the real options, specify trade-offs
- *Output evidence*: at least two real options with trade-offs stated as concrete costs, not generic caveats
- *Transition*: proceed when the selected option names what the rejected options fail to satisfy

**3. Creation** — use templates, include measurable conditions
- *Output evidence*: every mandatory template section filled (or answered in one line with the reason), every *when applicable* section that does not apply deleted; every acceptance criterion measurable
- *Transition*: proceed when no section is silently empty — an unanswered question is not the same as an inapplicable one

**4. Approval** — the user's approval at the stop enables implementation (an ADR's status becomes `Accepted`)
- *Output evidence*: the draft check's verdict recorded; every blocking issue fixed or listed in `draftCheck.open` for the user
- *Transition*: implementation begins only on the user's approval

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

*Note: work plans, task files, and `_overview.md` are temporary AI working state, marked `temporary: true` in their frontmatter and excluded by `.gitignore`. A file with that marker is judged only by consistency with the documentation (PRD, UXRD, Design Doc, ADR) — "Writing for the Reader", the `prose` pass, and diagrams do not apply; once its part is implemented, a later documentation change — from this feature or another — never updates it; and it may be deleted once the feature is implemented.*

## ADR Status
`Proposed` → `Accepted` → `Deprecated`/`Superseded`/`Rejected`

Check existing ADRs before design and implementation; the Design Doc lists them under Part, Prerequisite ADRs. No rule pre-decides that an ADR will be written — the three-part test is applied to the finished design.

## Diagram Requirements

Required diagrams for each document. Every diagram follows the `mermaid-diagrams` skill (palette, redraw test, path animation, render check):

| Document | Required Diagrams | Purpose |
|----------|------------------|---------|
| Feature Spec | Part dependency diagram (three or more parts) | Show the order parts are designed and built in |
| ADR | Option comparison diagram (when needed) | Visualize trade-offs |
| Design Doc | the C1–C4 levels the change touches, at least one (`mermaid-diagrams` `references/c4-levels.md`); a sequence diagram per AC that crosses a container boundary or has a failure path that changes state | Zoom from context to code as far as the change reaches; show each such flow as the running system executes it |
| Work Plan | Phase structure diagram, Task dependency diagram | Clarify implementation order |

## Common ADR Relationships
1. **At creation**: Identify common technical areas (logging, error handling, async processing, etc.) and search `docs/adr/ADR-*.md` for decisions that already cover them
2. **Design Doc**: List those ADRs under Part, Prerequisite ADRs
3. **Compliance check**: Verify the design aligns with them

A missing common decision is not a reason to write an ADR on its own; it goes through the three-part test after the design like any other.