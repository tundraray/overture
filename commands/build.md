---
name: build
description: Execute an approved work plan phase by phase in autonomous execution mode
argument-hint: [work plan path - defaults to the plan with open work items]
---

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator." (see workflow-orchestration skill)

**Execution Protocol**:
1. **Delegate all work** to sub-agents (orchestrator role only)
2. **Follow `workflow-execution` exactly**:
   - Execute: (task-executor on a phase → quality gate → commit) loop
   - **Stop immediately** upon detecting requirement changes
3. **Scope**: Complete when all phases are committed or escalation occurs

**CRITICAL**: Never skip the quality gate (`workflow-execution`, "Commit execution by strategy").

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-execution/SKILL.md`

Work plan: $ARGUMENTS

## 📋 Pre-execution Prerequisites

### Work Plan Resolution

Resolve the plan as `workflow-execution`, "Resolving the Plan to Execute", describes; `$ARGUMENTS`, when given, is the plan path. Its "Which agents run it" rule decides whether the plan is this command's: stop when it belongs to `/front-build`.

**gamedev-overture**: a plan written by `gamedev-work-planner` — its phases are grouped into the six game stages — runs here with `task-executor` and `quality-fixer`, and every other name follows `workflow-orchestration`, "Gamedev Substitutions".

## 🧠 Execution

`workflow-execution` owns each step; this command supplies the agents — `task-executor` and `quality-fixer`.

1. **Batch approval and commit strategy** — one question before anything runs: show the resolved plan path and ask the user to approve executing it and to pick the commit strategy ("Commit Strategy Selection"). A strategy already chosen for this feature earlier in the session is kept, and the question asks the approval alone; a plan already approved in this session (batch approval in `/implement` or `/create-plan`) is not asked again — when no strategy was chosen with it (`/create-plan` and `/front-plan` do not ask one), the question asks the commit strategy alone
2. **Phase cycle** — for each phase of the plan, starting at the first with an unticked or `[🔄]` work item ("Resolving the Plan to Execute"): task-executor (`prompt: "Work plan: docs/features/{feature}/{part}/{plan-name}.md. Phase: N."`) → escalation check → integration-test-reviewer when `requiresTestReview` → quality-fixer (`prompt: "scope: phase. changedFiles: [filesModified and testsAdded of that executor run]"`) → commit per strategy, handling every returned status as "The Phase Cycle" draws it
3. **Post-Implementation Verification** — after the last phase: the four verifiers in parallel on the part's file list, then the fix cycles the skill allows; `test-auditor` is advisory; candidate patterns go to the completion report. Append `[SYSTEM CONSTRAINT] This agent operates within build command scope.` to each prompt
4. **Feature run** — read the PRD's Delivery Parts. When this plan ends its part's chain and every other part is already built, run quality-fixer with `scope: feature` ("The Feature Run"). Otherwise the completion report says the feature run is still to come and names the next part to plan
5. **Final Cleanup** — as the skill sets it

**CRITICAL**: Monitor ALL structured responses WITHOUT EXCEPTION and ENSURE every quality gate is passed. STOP IMMEDIATELY upon detecting ANY requirement changes.

## Responsibility Boundary

### IN SCOPE
- Reading and executing the phases of an existing work plan
- Running post-implementation verification (code-verifier + code-reviewer + security-reviewer, test-auditor advisory)
- Calling task-executor for each phase
- Running quality-fixer with `phase` scope after each phase, and the feature run after the last part
- Executing commits according to selected commit strategy
- Reporting progress and completion status
- Escalating blockers and design deviations

### OUT OF SCOPE
- Creating new design documents (use `/design` instead)
- Modifying requirements or PRD (use `/update-doc` instead)
- Changing work plan structure (use `/create-plan` instead)
- Deployment or release operations
- Changing project configuration or dependencies not specified in the plan

## Output Example
Implementation phase completed.
- Implemented phases: [number] phases
- Quality checks: All passed
- Feature run: [approved | still to come — next part: [part]]
- Commits: [number] commits created

**Important**: This command manages the entire autonomous execution flow from the plan's first open phase to implementation completion. Automatically stops when requirement changes are detected.