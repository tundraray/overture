---
name: front-build
description: Execute frontend implementation in autonomous execution mode
argument-hint: [work plan path - defaults to the plan with open work items]
---

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator." (see workflow-orchestration skill)

**Execution Method**:
- Frontend implementation, one plan phase per run → performed by task-executor-frontend
- Quality checks and fixes → performed by quality-fixer-frontend
- Commits → performed by orchestrator (Bash tool)

Orchestrator invokes sub-agents and passes structured JSON between them.

**CRITICAL**: Never skip the quality gate (`workflow-execution`, "Commit execution by strategy").

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-execution/SKILL.md`

Work plan: $ARGUMENTS

## 📋 Pre-execution Prerequisites

### Work Plan Resolution

Resolve the plan as `workflow-execution`, "Resolving the Plan to Execute", describes; `$ARGUMENTS`, when given, is the plan path. Its "Which agents run it" rule decides whether the plan is this command's: stop when it belongs to `/build`.

## 🧠 Execution - Frontend Specialized

`workflow-execution` owns each step; this command supplies the agents — `task-executor-frontend` and `quality-fixer-frontend`. The orchestrator commits with Bash, using `changeSummary` for the message.

1. **Batch approval and commit strategy** — one question before anything runs: show the resolved plan path and ask the user to approve executing it and to pick the commit strategy ("Commit Strategy Selection"). A strategy already chosen for this feature earlier in the session is kept, and the question asks the approval alone; a plan already approved in this session (batch approval in `/implement` or `/create-plan`) is not asked again — when no strategy was chosen with it (`/create-plan` and `/front-plan` do not ask one), the question asks the commit strategy alone
2. **Phase cycle** — for each phase of the plan, starting at the first with an unticked or `[🔄]` work item ("Resolving the Plan to Execute"): task-executor-frontend (`prompt: "Work plan: docs/features/{feature}/{part}/{plan-name}.md. Phase: N."`) → escalation check → integration-test-reviewer when `requiresTestReview` → quality-fixer-frontend (`prompt: "scope: phase. changedFiles: [filesModified and testsAdded of that executor run]"`) → commit per strategy, handling every returned status as "The Phase Cycle" draws it
3. **Post-Implementation Verification** — after the last phase: the four verifiers in parallel on the part's file list against the frontend Design Doc, then the fix cycles the skill allows, dispatched to task-executor-frontend in Fix Mode and quality-fixer-frontend; `test-auditor` is advisory; candidate patterns go to the completion report. Append `[SYSTEM CONSTRAINT] This agent operates within front-build command scope.` to each prompt
4. **Feature run** — read the PRD's Delivery Parts. When this plan ends its part's chain and every other part is already built, run quality-fixer-frontend with `scope: feature` ("The Feature Run"). Otherwise the completion report says the feature run is still to come and names the next part to plan
5. **Final Cleanup** — as the skill sets it

**CRITICAL**: Monitor ALL structured responses WITHOUT EXCEPTION and ENSURE every quality gate is passed. STOP IMMEDIATELY upon detecting ANY requirement changes.

## Output Example
Frontend implementation phase completed.
- Implemented phases: [number] phases
- Quality checks: All passed
- Feature run: [approved | still to come — next part: [part]]
- Commits: [number] commits created

**Important**: This command manages the entire autonomous execution flow for FRONTEND implementation from the plan's first open phase to completion. Automatically uses frontend-specialized agents (task-executor-frontend, quality-fixer-frontend).
