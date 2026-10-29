---
name: workflow-technical
description: This skill governs the technical design phase — codebase fact gathering, Design Doc, consistency verification, a conditional ADR, and test skeletons, ending at Design Doc approval. Automatically loaded when creating a Design Doc or ADR, or when "technical design", "architecture decision", "design doc", or "fact gathering" are mentioned.
---

# Technical Design Phase

The technical phase answers **how to build it**. It begins with agreed requirements and ends when the design is approved — before anyone schedules the work.

Mechanics common to every phase — how to invoke subagents, response contracts, delegation boundaries, file ownership, TodoWrite — live in `workflow-orchestration`. Requirements arrive from `workflow-product`. Planning, decomposition, and everything after belong to `workflow-execution`.

## Domain Independence

This phase is identical for every domain — a game feature and a service endpoint need the same fact gathering, the same design rigour, and the same consistency verification. Planning is where the domain difference appears, and planning belongs to `workflow-execution`.

Layer selection between `technical-designer` and `technical-designer-frontend`, and between `codebase-analyzer` and `ui-analyzer`, follows the part being designed, not the domain — a part whose `cutAlong` is `frontend` (or `ui`, `hud`, `menu` on the gamedev path) takes the frontend pair, whatever the project is.

## Entry Gate [BLOCKING]

Run before invoking any agent in this phase. These are the product phase's outputs; a missing one means design would proceed on an assumption.

☐ Requirements are user-confirmed (`workflow-product` or `workflow-gamedev` exit gate passed)
☐ Product document received: the PRD path (`workflow-product`), or the feature spec path with the GDD as context (`workflow-gamedev`). This is the source of acceptance criteria for traceability below
☐ UX document received: the UXRD path, or the `ui-ux-agent` output path on the gamedev path, or an explicit "no UI surface"
☐ Parts list received — every part with a name, the requirements it covers, its `cutAlong` seam, and `dependsOn`, in an order where each part follows the parts it depends on. A design cannot start without a part name, and this phase does not invent one
☐ Scale and `decidingAxis` received
☐ Open questions received, and none of them blocks a decision this phase must make — when one does, return to the product phase rather than deciding it here

**ENFORCEMENT**: when an item is unchecked, stop and name the missing input and the phase that produces it. Do not substitute a plausible assumption for a product decision — that is how a design encodes something nobody agreed to.

## Flow

### Large and medium scale

The flow runs **once per part**, in the dependency order of the parts list, and **every part is designed before any part is planned**. A plan written against a design whose upstream contract is still open is a plan that will be rewritten; designing all parts first means execution starts with every contract settled.

**Once per feature, before the first part:**

1. *[Optional]* **expert-analyst** ×3-5 **in parallel** per the `expert-analysis-guide` heuristics, then synthesize. Skip for straightforward work or a pure bug fix. The synthesis is handed to every part's designer.

**For each part, in dependency order:**

2. **codebase-analyzer** (and **ui-analyzer** when the part has a UI surface) → read-only fact gathering scoped to the part's requirements → `focusAreas[]`
3. **technical-designer(-frontend)** → `design-{part}.md`, consuming `focusAreas` into the **Fact Disposition Table**, the expert synthesis when one was produced, and the approved designs of every part in `dependsOn` as contracts to consume rather than redefine
4. **document-reviewer** → Design Doc review, including part scope
5. **design-sync** → explicit-conflict check against the already-approved Design Docs of sibling parts — the `dependsOn` designs first, since a contract mismatch there is the costliest to find later. Traceability to the PRD and UXRD is `document-reviewer`'s job in step 4, not design-sync's
   **[Stop: Design Doc approval — part `{part}`]**
6. *[Conditional]* **technical-designer(-frontend)** → ADR, when a decision this design made passes the three-part test in `documentation-criteria`
7. **document-reviewer** → ADR review
   **[Stop: ADR approval]** — only when an ADR was written
8. **acceptance-test-generator** → integration and E2E test skeletons for this part

**After the last part:** run the exit gate and hand off to `workflow-execution`, which plans and builds the parts one at a time in the same order.

A single-part feature runs steps 2-8 once; nothing else changes.

### Small scale

No technical documents. → `workflow-execution`.

## Why the ADR Comes After the Design

Writing the ADR first means deciding before understanding. Which choices are genuinely architecture-binding — costly to reverse, constraining work beyond this feature, taken against real alternatives — is only visible once the design exists.

So the design surfaces the decision and the ADR **extracts** it, so it outlives the feature that produced it. The Design Doc records the full reasoning; the ADR records the part future unrelated work must comply with.

This means the Design Doc references **existing** ADRs as prerequisites, and any ADR written in step 6 records a decision this design made. The plan's ADR Bindings table then binds tasks to both.

**Most features produce no ADR.** A decision record written for every change stops being read.

## Why Fact Gathering Precedes Design

`codebase-analyzer` and `ui-analyzer` are read-only and produce `focusAreas[]` — `fact_id`-anchored statements about existing behavior that the design must explicitly dispose of.

Without them, a designer investigates ad hoc and the Design Doc records conclusions but not what was considered. A reviewer then cannot distinguish a deliberate omission from an oversight. The Fact Disposition Table makes each fact's treatment explicit: preserve, transform, remove, or out-of-scope, each with evidence.

Run them **after** any expert analysis and **before** the designer, so the designer receives both the outside perspective and the ground truth.

## Document Requirements by Scale

| Scale | Design Doc | ADR |
|-------|------------|-----|
| Small | Not needed | Not needed |
| Medium | **Required** | Rare※ |
| Large | **Required** | Rare※ |

※ Only when a decision the design made passes all three parts of the test in `documentation-criteria`: costly to reverse, binding beyond this feature, and taken against real alternatives. Most features produce none.

Scale comes from `task-analyzer`'s five-axis assessment, not file count alone. Work plans are produced in `workflow-execution`.

## Stop Points

| Stop | After | What the user decides |
|------|-------|----------------------|
| Design Doc approval | design-sync completes consistency verification for a part | Whether the technical approach for that part is right — one stop per part |
| ADR approval | document-reviewer completes ADR review | Whether the decision and its rejected alternatives are right — only when an ADR was written |

Batch approval, the authority boundary into autonomous work, belongs to `workflow-execution` — it gates the plan, and the plan is produced there.

## Revision Loop

Verdict handling, the two-review cap, re-review scope, and the one-round rule for a change that touches several documents are defined once in `workflow-orchestration`, "Revision Loop". The owners in this phase are `technical-designer(-frontend)` for an ADR or Design Doc. A re-review is a cold read of the coordinates only — path, `doc_type`, `review_scope: changes`, `diff_base`, and the prior issues verbatim; never the author's summary.

The same applies to `design-sync`: it reads the Design Docs on disk, not an account of how the part was designed. The orchestrator never edits a document itself.

## Part Sequencing

Parts are designed in dependency order, each to approval before the next begins. When a feature spans layers this means the backend part reaches approval **before** the frontend part is designed: the frontend designer then reads a verified contract instead of a proposed one, and can flag anything still unstable in its Cross-Layer Assumptions.

The same holds for any `dependsOn` edge — a domain part consuming another domain's events, a feature part building on a migration part. The upstream design is the contract; the downstream design consumes it and does not restate or alter it. When the downstream design finds the contract insufficient, that is a revision of the upstream design through its own revision loop, not a redefinition inside the downstream one.

The parts list itself is not changed in this phase. When design work shows the split was wrong — two parts that cannot be designed apart, or one that needs splitting — stop and return to the product phase, where the parts list is owned. See `documentation-criteria`, "Parts", for the layout and the split criteria.

## Exit Gate [BLOCKING]

Run before handing off to `workflow-execution`. When any item is unsatisfied, stay in this phase — planning cannot schedule what the design has not settled.

☐ Every part in the parts list has a `design-{part}.md` approved after `design-sync` consistency verification — no part is left undesigned, and no design exists for a part not in the list
☐ Each part's design was approved after the designs of every part in its `dependsOn`, and consumes their contracts as written
☐ Every `focusAreas` entry from fact gathering has a row in its part's Fact Disposition Table with a disposition and evidence — an unaddressed fact is an unexamined behavior
☐ Every acceptance criterion in the product documents (PRD and UXRD; feature spec and `ui-ux-agent` output on the gamedev path) is traceable to a section of exactly one part's Design Doc, or explicitly recorded as out of scope
☐ The ADR test was applied to each design and its outcome recorded — either an approved ADR, or a note that no decision passed all three parts
☐ Test skeletons are generated per part and their paths recorded
☐ Every `document-reviewer` verdict is `approved`, or the user accepted the open findings and the owner recorded them in the document

**Handoff payload** — concrete paths, not a summary:

| Item | Form |
|------|------|
| Parts list | Carried through in dependency order; each part now carries its design, ADRs, and skeleton paths |
| Design Docs | One `docs/features/{feature}/design-{part}.md` per part |
| ADRs | Paths of any written here, plus existing prerequisites; or "none passed the test" — per part |
| Test skeletons | Generated file paths, per part |
| PRD / UXRD (or feature spec / GDD) | Carried through for plan traceability |

**ENFORCEMENT**: an unchecked item means the phase is not finished. A design item missing from the payload cannot appear in the plan's traceability table, and a requirement reaching neither is how work silently disappears between phases.
