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

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-execution/SKILL.md`

## Scope Boundaries

**Included in this command**:
- Design document selection
- Test skeleton lookup for the part (generation only when none exist)
- Work plan creation with work-planner
- Work plan review with document-reviewer, when the user asks for it at plan approval
- Plan approval obtainment

**Responsibility Boundary**: This command completes with work plan approval.

Create frontend work plan with the following process:

## Execution Process

### 1. Design Document Selection
! ls -la docs/features/*/design-*.md | head -10
- Check for existence of design documents, notify user if none exist
- Present options if multiple exist (can be specified with $ARGUMENTS)
- The design's `Part` section names the parts it depends on (typically the backend part): when one has no `completed` plan yet, say so — the plan will be written against that part's design rather than its code, and the parts list's order says it should normally be built first

### 2. Test Skeleton Lookup
- Skeletons are normally generated per part in the technical phase (`[feature]-[part].int.test.*`, `[feature]-[part].e2e.test.*`); locate them for this part and pass their paths to work-planner
- Only when none exist for the part: confirm with the user and generate them with acceptance-test-generator before planning

### 3. Work Plan Creation
Invoke **work-planner** using Task tool:
- `subagent_type: "work-planner"`
- `description: "Work plan creation"`
- `prompt: "Create work plan for part [part]. PRD: docs/features/[feature]/prd.md; UXRD: [docs/features/[feature]/uxrd.md, if it exists]; Design Doc: [path]; ADRs: [paths, or none]; test skeletons: [paths]. [SYSTEM CONSTRAINT] This agent operates within front-plan command scope."`

### 4. Work Plan Check
work-planner runs its own draft check before it returns. Present the plan at the stop per `workflow-orchestration`, "Explicit Stop Points". An independent review:
- `subagent_type: "document-reviewer"`
- `prompt: "doc_type: WorkPlan; target: [path]. [SYSTEM CONSTRAINT] This agent operates within front-plan command scope."`
- `approved_with_conditions` or `needs_revision` → re-invoke work-planner with `draft_check: skip` and the `critical` and `important` issues, then one re-review with `review_scope: changes`, the `diff_base`, and the prior issues verbatim; a re-review that is not `approved`, or `rejected`, goes to the user (`workflow-orchestration`, "Revision Loop")
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
