---
name: front-plan
description: Create frontend work plan from design document and obtain plan approval
argument-hint: <design doc name or path>
---

**Command Context**: This command is dedicated to the frontend planning phase.

## Orchestrator Definition

**Role**: Orchestrator

**Execution Method**:
- Work plan creation → performed by work-planner

Orchestrator invokes sub-agents and passes structured JSON between them.

## Scope Boundaries

**Included in this command**:
- Design document selection
- Work plan creation with work-planner
- Plan approval obtainment

**Responsibility Boundary**: This command completes with work plan approval.

Create frontend work plan with the following process:

## Execution Process

### 1. Design Document Selection
! ls -la docs/features/*/design-*.md | head -10
- Check for existence of design documents, notify user if none exist
- Present options if multiple exist (can be specified with $ARGUMENTS)
- The design's `Part` section names the parts it depends on (typically the backend part): when one has no `completed` plan yet, say so — the plan will be written against that part's design rather than its code, and the parts list's order says it should normally be built first

### 2. Work Plan Creation
Invoke **work-planner** using Task tool:
- `subagent_type: "work-planner"`
- `description: "Work plan creation"`
- `prompt: "Create work plan from Design Doc at [path] for part [part]; test skeletons: [paths]"`

### 3. Work Plan Review
Submit the plan to **document-reviewer** before presenting it to the user — a plan that omits a Design Doc requirement looks complete, and only a traceability check finds the gap:
- `subagent_type: "document-reviewer"`
- `prompt: "doc_type: WorkPlan. Review the work plan at [path] against its Design Doc. Verify: 1) Design-to-Plan Traceability, 2) Verification Strategy with an early verification point, 3) Failure Mode Checklist — all nine categories marked, 4) Reference Contract Values verbatim, 5) ADR Bindings for every applicable ADR, 6) frontmatter valid — part is in the PRD's Delivery Parts, plan: N of M consistent with siblings. [SYSTEM CONSTRAINT] This agent operates within front-plan command scope."`
- `approved_with_conditions` or `needs_revision` → re-invoke work-planner with the `critical` and `important` issues, then one re-review with `review_scope: changes`, the `diff_base`, and the prior issues verbatim; a re-review that is not `approved`, or `rejected`, goes to the user (`workflow-orchestration`, "Revision Loop")
- Then interact with user to obtain approval for plan content
- After approval, invoke **work-planner** in `update` mode to set the plan's `status: active` — `/front-build` runs only the active plan

**Think deeply** Create a work plan from the selected design document, clarifying specific implementation steps and risks.

**Scope**: Up to work plan creation and obtaining approval for plan content.

## Response at Completion
✅ **Recommended**: End with the following standard response after plan content approval
```
Frontend planning phase completed.
- Work plan: docs/features/[feature]/[part]/[plan-name].md
- Status: Approved

Please provide separate instructions for implementation.
```
