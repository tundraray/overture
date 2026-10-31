---
name: create-plan
description: Create work plan from design document and obtain plan approval
argument-hint: <design doc name or path>
---

**Command Context**: This command is dedicated to the planning phase.

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator." (see workflow-orchestration skill)

**Execution Protocol**:
1. **Delegate all work** to sub-agents (NEVER create plans yourself)
2. **Follow `workflow-execution`, "Planning", exactly**:
   - Execute steps defined below
   - **Stop and obtain approval** for plan content before completion
3. **Scope**: Complete when work plan receives approval

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-execution/SKILL.md`

**gamedev-overture**: read every agent, skill, and document name in this command as `workflow-orchestration`, "Gamedev Substitutions", maps it — `gamedev-work-planner` writes the plan, and the feature spec's Delivery Parts stand in for the PRD's.

## Scope Boundaries

**Included in this command**:
- Design document selection
- Test skeleton lookup for the part (generation only when none exist)
- Work plan creation with work-planner
- Work plan review with document-reviewer (traceability to Design Doc)
- Plan approval obtainment

**Responsibility Boundary**: This command completes with work plan approval.

Follow the planning process below:

## Execution Process

1. **Design Document Selection**
   ! ls -la docs/features/*/design-*.md | head -10
   - Check for existence of design documents, notify user if none exist
   - Present options if multiple exist (can be specified with $ARGUMENTS)
   - The design's `Part` section names the parts it depends on: when one of them has no `completed` plan yet, say so — the plan will be written against that part's design rather than its code, and the parts list's order says it should normally be built first

2. **Test Skeleton Lookup**
   - Skeletons are normally generated per part in the technical phase (`[feature]-[part].int.test.*`, `[feature]-[part].e2e.test.*`); locate them for this part and pass their paths to work-planner
   - Only when none exist for the part: confirm with the user and generate them with acceptance-test-generator before planning

3. **Work Plan Creation**
   - Create work plan with work-planner
   - Pass the Design Doc path, the part's test skeleton paths, and its ADR paths

4. **Work Plan Review**
   - Submit the plan to `document-reviewer` before presenting it to the user. A plan that omits a Design Doc requirement looks complete — only a traceability check finds the gap.
   ```yaml
   subagent_type: document-reviewer
   prompt: "doc_type: WorkPlan. Review the work plan at [path] against its Design Doc. Verify: 1) Design-to-Plan Traceability — every Design Doc item has a covering task or a justified gap, 2) Verification Strategy citing the Design Doc's, with the task that runs the early verification point, 3) Failure Mode Checklist — all nine categories marked, applicable ones assigned a covering task, 4) Reference Contract Values recorded verbatim where the Design Doc specifies a binding observable value, 5) ADR Bindings present for every ADR the design treats as prerequisite or produced, 6) frontmatter valid — part is in the PRD's Delivery Parts, plan: N of M consistent with siblings. [SYSTEM CONSTRAINT] This agent operates within create-plan command scope."
   ```
   - `approved_with_conditions` or `needs_revision` → re-invoke `work-planner` with the `critical` and `important` issues, then one re-review with `review_scope: changes`
   - A re-review that is not `approved` → **STOP** and present the issues to the user; `recommended` issues are listed at plan approval for the user to pick; `rejected` goes straight to the user (`workflow-orchestration`, "Revision Loop")

5. **Plan Approval**
   - Interact with user to complete plan and obtain approval for plan content
   - After approval, invoke `work-planner` in `update` mode to set the plan's `status: active` — `/build` runs only the active plan

**Think deeply** Create a work plan from the selected design document, clarifying specific implementation steps and risks.

**Scope**: Up to work plan creation and obtaining approval for plan content.

## Response at Completion
✅ **REQUIRED**: End with the following standard response after plan content approval
```
Planning phase completed.
- Work plan: docs/features/[feature]/[part]/[plan-name].md
- Status: Approved

Please provide separate instructions for implementation.
```