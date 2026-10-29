---
name: workflow-product
description: This skill governs the product phase of a workflow — turning a request into agreed requirements, a PRD, and a UXRD before any technical design begins. Automatically loaded when analyzing requirements, creating or updating a PRD or UXRD, or when "requirements", "product scope", "user value", "PRD", or "UXRD" are mentioned.
---

# Product Phase

The product phase answers **what to build and why**. It ends when the requirements, business value, and user experience are agreed — before anyone decides how to build it.

Mechanics common to every phase — how to invoke subagents, response contracts, delegation boundaries, file ownership, TodoWrite — live in the `workflow-orchestration` skill. Technical design picks up where this phase stops: see `workflow-technical`.

Keeping the phases separate is what stops a solution from being chosen before the problem is agreed. A Design Doc written while requirements are still moving encodes assumptions nobody signed off on.

## Scope

**In scope**: requirement analysis and scale determination, the split into parts and its confirmation, PRD creation and review, UXRD creation and review, and the stop points that gate each.

**Out of scope**: architecture decisions, interface definitions, data models, implementation planning — all `workflow-technical`. When a product question can only be settled by a technical fact ("is this even feasible?"), record it as an open question and resolve it in the technical phase rather than pre-deciding the design here.

## Entry Gate [BLOCKING]

This is the first phase, so its entry gate checks the session rather than a predecessor.

☐ The request is stated in the user's own terms, not already restated as a solution
☐ `rule-advisor` has run and its selected rules are registered in TodoWrite
☐ Any existing PRD or UXRD for this feature has been located (glob `docs/features/*/prd.md`, `docs/features/*/uxrd.md`) — an existing document is updated, not silently duplicated

**ENFORCEMENT**: when an item is unchecked, complete it before invoking any agent. Starting on an unlocated existing PRD produces a second one, and neither is then authoritative.

## Flow

The flow is the same shape at every scale — a PRD is always written — and differs in the PRD's depth and in whether a UXRD follows.

### Large scale

1. **requirement-analyzer** → requirement analysis + check for an existing PRD + preliminary part proposal
   **[Stop: requirement confirmation / question handling]**
2. **prd-creator** (`depth: full`) → PRD creation (update when one exists; new creation with thorough investigation when not), including the **Delivery Parts** section that refines the proposal
3. **document-reviewer** (`doc_type: PRD`, `depth: full`) → PRD review, including part coverage and dependencies
   **[Stop: PRD approval — includes the parts split]**
4. **ux-designer** → UXRD creation (when the work has a UI surface) → **document-reviewer**
   **[Stop: UXRD approval]**

→ hand off to `workflow-technical`

### Medium scale

1. **requirement-analyzer** → requirement analysis + check for an existing PRD + part proposal (rarely more than two parts)
   **[Stop: requirement confirmation / question handling]**
2. **prd-creator** (`depth: lite`, or `update` when a PRD already covers the feature) → PRD with Delivery Parts
3. **document-reviewer** (`doc_type: PRD`, `depth: lite`) → PRD review
   **[Stop: PRD approval — includes the parts split]**
4. **ux-designer** → UXRD creation (when the work has a UI surface) → **document-reviewer**
   **[Stop: UXRD approval]**

→ hand off to `workflow-technical`

### Small scale

1. **requirement-analyzer** → requirement analysis + single-part proposal
   **[Stop: requirement confirmation / question handling]**
2. **prd-creator** (`depth: lite`) → a short PRD: the requirement, its acceptance criterion, one part
3. **document-reviewer** (`doc_type: PRD`, `depth: lite`) → PRD review
   **[Stop: PRD approval]**

No UXRD, no technical documents → `workflow-execution` for a simplified plan.

A lite PRD for a two-file fix is a page, not a ceremony: it is where the acceptance criterion and the part name live, and the plan's traceability table points at it.

## Parts

A **part** is one independently designable slice of the feature; each gets its own Design Doc in the technical phase and its own plans in execution. The split is a product decision made here, because whoever splits the work also fixes where the contracts between the halves fall — and that is agreed with the user, not chosen by the first designer to open a file. Criteria and the record format are in `documentation-criteria`, "Parts".

The path is the same at every scale, because the PRD is:

| Step | Agent | Record |
|------|-------|--------|
| Propose | `requirement-analyzer` | `parts[]` — shown at the requirement confirmation stop as a preliminary split |
| Refine | `prd-creator` | PRD, "Delivery Parts" section — the authoritative parts list |
| Confirm | user | PRD approval stop |

Present the split as a decision at the PRD stop, not as a line in a summary: name each part, what it covers, and what it depends on, and offer the alternative — fewer parts, or a different seam. One part is a legitimate answer and the common one; the question put to the user is whether the proposed seam is real.

After confirmation, a change to the parts list re-enters this phase through `prd-creator` in `update` mode and PRD re-approval. Designs of parts the change does not touch stay approved; a part whose plan is `completed` is frozen.

## Document Requirements by Scale

| Scale | PRD | UXRD |
|-------|-----|------|
| Small | **Required**, `lite` depth | Not needed |
| Medium | **Required**, `lite` depth (update when one exists) | When frontend/UI work is involved |
| Large | **Required**, `full` depth (new, updated, or reverse-engineered) | When frontend/UI work is involved |

Depth is defined in `documentation-criteria`, "PRD depth". An existing PRD keeps its depth when updated.

Scale comes from `task-analyzer`'s five-axis assessment, not from file count alone — see `workflow-orchestration`, "Scale Determination".

## Stop Points

Every stop in this phase is a genuine decision gate, not a status update. Use `AskUserQuestion` so the choice is structured.

| Stop | After | What the user decides |
|------|-------|----------------------|
| Requirement confirmation | requirement-analyzer | Whether the understood scope and scale match intent; answers to open questions; a first look at the proposed parts |
| PRD approval | document-reviewer completes PRD review | Whether the requirements and success metrics are right, and whether the Delivery Parts split is the right one — every scale |
| UXRD approval | document-reviewer completes UXRD review | Whether the flows, states, and accessibility posture are right — only when the work has a UI surface |

Each stop happens **once per feature**. Per-part stops begin in the technical phase.

When `requirement-analyzer` reports a `decidingAxis` other than `files`, state it at the confirmation stop: "6 files but routed as Large because this is a breaking contract change" is information the user needs in order to approve or override the routing.

## Requirement Changes

Requirements change mid-flow. Detecting that early is cheaper than discovering it during implementation.

**Stop the flow and return to requirement-analyzer** when a user response contains:
- Mentions of new features or behaviors (additional operations, display on a different screen)
- Added constraints or conditions (data volume limits, permission controls)
- Changed technical requirements (processing method, output format)
- A change to which parts exist or what they cover — a PRD change, through `prd-creator` in `update` mode and PRD re-approval

Restart from `requirement-analyzer` with the integrated requirements rather than patching the current document. Once `task-decomposer` has started, a requirement change requires overall redesign — restart the whole flow for the parts it touches. Two things survive a restart: a part whose plan is `completed` is **frozen** (its code is committed; a change to it is a new feature), and a part whose requirements the change does not touch keeps its approved design.

## Revision Loop

Verdict handling, the two-review cap, re-review scope, and the one-round rule for a change that touches several documents are defined once in `workflow-orchestration`, "Revision Loop". The owners in this phase are `prd-creator` for a PRD, `ux-designer` for a UXRD. A re-review is a cold read of the coordinates only — path, `doc_type`, `review_scope: changes`, `diff_base`, and the prior issues verbatim; never the author's summary.

The orchestrator never edits a document itself — see `workflow-orchestration`, "File Ownership by Agent".

## Exit Gate [BLOCKING]

Run before handing off to `workflow-technical`. When any item is unsatisfied, stay in this phase — the technical phase cannot recover a missing product decision, it can only guess at one.

☐ The user has confirmed the requirements at the requirement stop
☐ Scale is recorded with its `decidingAxis`, and a non-`files` deciding axis was stated to the user
☐ PRD exists at the depth the scale requires and is approved
☐ UXRD exists and is approved, **or** the work has no UI surface and that is recorded
☐ The parts list is confirmed — the approved PRD's Delivery Parts section. Every part has a name, the requirements it covers, a `cutAlong` seam, and `dependsOn` entries that name other parts in the list, and the dependency graph has no cycle
☐ Every open question is written down with the decision it blocks and who resolves it — not carried forward in conversation
☐ Every `document-reviewer` verdict is `approved`, or the user accepted the open findings and the owner recorded them in the document

**Handoff payload** — concrete paths, not a summary:

| Item | Form |
|------|------|
| PRD | `docs/features/{feature}/prd.md`, with its depth |
| UXRD | `docs/features/{feature}/uxrd.md`, or "no UI surface" |
| Parts list | `{name, covers, cutAlong, dependsOn}` per part, in dependency order — copied from the PRD's Delivery Parts section. `cutAlong` is what the technical phase routes on (`frontend` → `technical-designer-frontend` and `ui-analyzer`) |
| Scale | `{small\|medium\|large}` plus `decidingAxis` |
| Open questions | List of `question → decision it blocks → owner` |

**ENFORCEMENT**: an unchecked item means the phase is not finished. Report which item is unmet and what would satisfy it; do not proceed to technical design.
