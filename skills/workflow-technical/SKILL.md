---
name: workflow-technical
description: This skill governs the technical design phase — codebase fact gathering, Design Doc, consistency verification, a conditional ADR, and test skeletons, ending at Design Doc approval. Automatically loaded when creating a Design Doc or ADR, or when "technical design", "architecture decision", "design doc", or "fact gathering" are mentioned.
---

# Technical Design Phase

The technical phase answers **how to build it**. It begins with agreed requirements and ends when the design is approved — before anyone schedules the work.

Mechanics common to every phase — how to invoke subagents, response contracts, delegation boundaries, file ownership — live in `workflow-orchestration`. Requirements arrive from `workflow-product`. Planning and everything after belong to `workflow-execution`.

## Domain Independence

Layer selection between `technical-designer` and `technical-designer-frontend`, and between `codebase-analyzer` and `ui-analyzer`, follows the part being designed, not the domain — a part whose `cutAlong` is `frontend` takes the frontend pair, whatever the project is. gamedev-overture ships no frontend designer: a `ui`, `hud`, or `menu` part there takes `technical-designer` with `ui-analyzer` (`workflow-orchestration`, "Gamedev Substitutions").

## Flow

### Large and medium scale

The flow runs **once per part**, in the dependency order of the parts list, and **every part is designed before any part is planned**. A plan written against a design whose upstream contract is still open is a plan that will be rewritten; designing all parts first means execution starts with every contract settled.

**Once per feature, before the first part:**

1. *[Optional]* **expert-analyst** ×3-5 **in parallel** per the `expert-analysis-guide` heuristics, then synthesize. Skip for a pure bug fix. The synthesis is handed to every part's designer.

**For each part, in dependency order:**

2. **codebase-analyzer** (**ui-analyzer** for a frontend part) → read-only fact gathering, with the part's requirements passed as `requirements` → `focusAreas[]`; `codebase-analyzer` reads `docs/code-system/` first and reports `conformance`
3. **technical-designer(-frontend)** → `design-{part}.md`, consuming `focusAreas` and `conformance`, the expert synthesis when one was produced, and the approved designs of every part in `dependsOn` as contracts to consume rather than redefine, with its draft check (`document-reviewer`, including part scope). Code-system files it creates or changes are approved with the Design Doc
4. **design-sync** → explicit-conflict check against the already-approved Design Docs of sibling parts — the `dependsOn` designs first, since a contract mismatch there is the costliest to find later. Traceability to the PRD and UXRD is the draft check's job in step 3, not design-sync's
   **[Stop: Design Doc approval — part `{part}`]**
5. *[Conditional]* **technical-designer(-frontend)** → ADR, when a decision this design made passes the three-part test in `documentation-criteria`, with its draft check
   **[Stop: ADR approval]** — only when an ADR was written
6. **acceptance-test-generator** → integration and E2E test skeletons for this part

**After the last part:** hand off to `workflow-execution`, which plans and builds the parts one at a time in the same order.

A single-part feature runs steps 2-6 once; nothing else changes.

### Small scale

No technical documents (`documentation-criteria`, "Creation Decision Matrix"). → `workflow-execution`.

## Why Fact Gathering Precedes Design

`codebase-analyzer` and `ui-analyzer` are read-only and produce `focusAreas[]` — `fact_id`-anchored statements about existing behavior that the design must address.

Without them, a designer investigates ad hoc and the Design Doc records conclusions but not what was considered.

Run them **after** any expert analysis and **before** the designer, so the designer receives both the outside perspective and the ground truth.

## Stop Points

| Stop | After | What the user decides |
|------|-------|----------------------|
| Design Doc approval | design-sync completes consistency verification for a part | Whether the technical approach for that part is right — one stop per part |
| ADR approval | technical-designer(-frontend) returns the ADR with its draft check | Whether the decision and its rejected alternatives are right — only when an ADR was written |

Each stop shows the author's `draftCheck.open` items and offers independent review as an option — see `workflow-orchestration`, "Explicit Stop Points".

Batch approval, the authority boundary into autonomous work, belongs to `workflow-execution` — it gates the plan, and the plan is produced there.

## Revision Loop

Verdict handling, the two-review cap, re-review scope, and the one-round rule for a change that touches several documents are defined once in `workflow-orchestration`, "Revision Loop". The owners in this phase are `technical-designer(-frontend)` for an ADR or Design Doc. `design-sync` is a cold reader too: it reads the Design Docs on disk, not an account of how the part was designed.

## Part Sequencing

Parts are designed in dependency order, each to approval before the next begins. When a feature spans layers this means the backend part reaches approval **before** the frontend part is designed: the frontend designer then reads a verified contract instead of a proposed one, and records anything still unstable as an open question against the upstream design.

The same holds for any `dependsOn` edge — a domain part consuming another domain's events, a feature part building on a migration part. The upstream design is the contract; the downstream design consumes it and does not restate or alter it. When the downstream design finds the contract insufficient, that is a revision of the upstream design through its own revision loop, not a redefinition inside the downstream one.

The parts list itself is not changed in this phase. When design work shows the split was wrong — two parts that cannot be designed apart, or one that needs splitting — stop and return to the product phase, where the parts list is owned. See `documentation-criteria`, "Parts", for the layout and the split criteria.

## Handoff to `workflow-execution`

Planning cannot schedule what the design has not settled, so the phase hands over once every part in the parts list has an approved `design-{part}.md`, its ADR outcome and its test skeletons.

**Handoff payload** — concrete paths, not a summary:

| Item | Form |
|------|------|
| Parts list | Carried through in dependency order; each part now carries its design, ADRs, and skeleton paths |
| Design Docs | One `docs/features/{feature}/design-{part}.md` per part |
| ADRs | Paths of any written here, plus existing prerequisites; or "none passed the test" — per part |
| Test skeletons | Generated file paths, per part |
| PRD / UXRD and `docs/design-system/` (or feature spec / GDD) | Carried through for plan traceability |
| `docs/code-system/` | Carried through: the patterns each Design Doc cites reach its plan's phases |
