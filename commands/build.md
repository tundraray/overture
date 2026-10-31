---
name: build
description: Execute decomposed tasks in autonomous execution mode
argument-hint: (no arguments - uses existing task files)
---

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator." (see workflow-orchestration skill)

**First Action**: Register execution steps to TodoWrite before any execution:
- Step 1: Prerequisites check
- Step 2: Task decomposition (if needed)
- Step 3: Commit strategy selection
- Step 4-N: Task execution cycles

**Execution Protocol**:
1. **Delegate all work** to sub-agents (orchestrator role only)
2. **Follow `workflow-execution` exactly**:
   - Execute: task-decomposer → (task-executor → quality-fixer → commit) loop
   - **Stop immediately** upon detecting requirement changes
3. **Scope**: Complete when all tasks are committed or escalation occurs

**CRITICAL**: Run quality-fixer before every commit. Obtain batch approval before autonomous mode.

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-execution/SKILL.md`

Work plan: $ARGUMENTS

## 📋 Pre-execution Prerequisites

### Work Plan Resolution

Before any task processing, locate the work plan. This recipe is the **backend** build lane — it routes to `task-executor` and must never pick up a frontend plan.

Resolve the plan as `workflow-execution`, "Resolving the Plan to Execute", describes; `$ARGUMENTS`, when given, is the plan path. Then **verify the plan belongs to this lane before executing it.** A design's layer is not in its filename — `design-{part}.md` is layer-neutral — so read the governing design named in the plan's `design:` frontmatter, plus the plan itself. Absence of frontend markers is not sufficient: many plans use layer-neutral paths (`src/presentation`, `src/app`) matching neither marker set, so a confirmed backend signal is required.

**Backend signals (need at least one)**:
- The Target Files of the plan's tasks match backend markers exclusively: `**/api/**`, `**/server/**`, `**/services/**`, `**/backend/**`, `**/handlers/**`, `**/repositories/**`, or the project's own equivalents of those directories
- The governing design describes API endpoints, data schemas, persistence, or service boundaries
- The part name identifies the layer (`api`, `backend`, `service`, `migration`)
- Plan title or Snapshot explicitly identifies the work as backend

**Frontend signals (any one disqualifies, even alongside a backend signal)**:
- `## Related Documents` pointing to a UXRD (`docs/features/*/uxrd.md`)
- A `UXRD Component → Task Mapping` section
- Target Files exclusively under `**/components/**`, `**/pages/**`, `**/web/**`, `**/*.tsx`, `**/*.jsx`
- The governing design describes component hierarchy, screen states, or UI interactions
- Title or Snapshot mentioning React, UI components, or screens

**Decision**: at least one backend signal AND zero frontend signals → proceed. Frontend signals only → stop: the plan belongs to `/front-build`. Otherwise stop and report which signals were checked and their results, then ask for an explicit plan path.

**Mixed-layer plans**: when a plan carries both, its part was not split cleanly. Do not guess — report that the plan spans layers, and ask whether to run `/implement` (which drives both) or to split the work into separate parts.

**gamedev-overture**: there is one build lane, so skip the lane check. A plan written by `gamedev-work-planner` — its phases are the six game phases — runs here with `task-executor` and `quality-fixer`, and every other name follows `workflow-orchestration`, "Gamedev Substitutions".

### Consumed Task Set

Compute the **Consumed Task Set** — the exact files this run owns, executes, and later deletes:

1. List `docs/features/{feature}/{part}/{plan-name}/task-*.md` for the plan resolved above
2. Exclude `_overview.md`, which describes the set rather than being a task

Every subsequent reference to "task files" in this command — the decision flow below, the execution cycle, and Final Cleanup — means this set, **not** an unrestricted glob over the directory. Tasks of a sibling plan in the same part are never in scope.

### Task File Existence Check
```bash
# Check work plans
! ls -la docs/features/*/*/*.md | grep -v template | tail -5

# Check task files
! ls docs/features/*/*/*/task-*.md 2>/dev/null || echo "⚠️ No task files found"
```

### Task Generation Decision Flow

**Think deeply** Analyze task file existence state and determine the EXACT action required:

| State | Criteria | Next Action |
|-------|----------|-------------|
| Tasks exist | `task-*.md` files in the plan's directory `docs/features/{feature}/{part}/{plan-name}/` | Proceed to autonomous execution |
| No tasks + plan exists | Plan exists but no task files | Confirm with user → run task-decomposer |
| Neither exists | No plan or task files | Error: Prerequisites not met |

## 🔄 Task Decomposition Phase (Conditional)

When task files don't exist:

### 1. User Confirmation
```
No task files found.
Work plan: docs/features/[feature]/[part]/[plan-name].md

Generate tasks from the work plan? (y/n): 
```

### 2. Task Decomposition (if approved)

Invoke task-decomposer using Task tool:
- `subagent_type`: "task-decomposer"
- `description`: "Decompose work plan into tasks"
- `prompt`: "Read work plan and decompose into atomic tasks. Input: docs/features/[feature]/[part]/[plan-name].md. Output: Individual task files in docs/features/{feature}/{part}/{plan-name}/. Granularity: atomic, independently executable units (commit grouping determined by selected strategy)"

### 3. Verify Generation
```bash
# Verify generated task files
! ls -la docs/features/*/*/*/task-*.md | head -10
```

✅ **Flow**: Task generation → Autonomous execution (in this order)

## 🧠 Execution

`workflow-execution` owns each step; this lane supplies the agents — `task-executor`, `quality-fixer`, and `work-planner` for the plan's status.

1. **Commit strategy** — ask before starting, unless one was already chosen for this feature earlier in the session ("Commit Strategy Selection")
2. **Per-task cycle** — for each task in the Consumed Task Set: register its steps in TodoWrite (first "Confirm skill constraints", last "Verify skill fidelity"), then task-executor → escalation check → integration-test-reviewer when integration/E2E tests were added → quality-fixer → commit per strategy, handling every returned status as "The Per-Task Cycle" draws it
3. **Post-Implementation Verification** — after the last task: the three verifiers in parallel on the part's file list, then the fix cycles the skill allows; `test-auditor` is advisory. Append `[SYSTEM CONSTRAINT] This agent operates within build command scope.` to each prompt
4. **Final Cleanup** — as the skill sets it. Then read the PRD's Delivery Parts: a part that depends on this one and has no `completed` plan yet is named in the completion report as the next part to plan

**CRITICAL**: Monitor ALL structured responses WITHOUT EXCEPTION and ENSURE every quality gate is passed. VERIFY the plan's approval status (`status: active`) before entering autonomous execution, and STOP IMMEDIATELY upon detecting ANY requirement changes.

## Responsibility Boundary

### IN SCOPE
- Reading and executing tasks from existing work plan
- Running post-implementation verification (code-verifier + security-reviewer, test-auditor advisory)
- Calling task-executor for each task
- Running quality-fixer after each task
- Executing commits according to selected commit strategy
- Reporting progress and completion status
- Escalating blockers and design deviations

### OUT OF SCOPE
- Creating new design documents (use `/design` instead)
- Modifying requirements or PRD (use `/update-doc` instead)
- Changing work plan structure (use `/create-plan` instead)
- Deployment or release operations
- Changing project configuration or dependencies not specified in tasks

## Output Example
Implementation phase completed.
- Task decomposition: Generated under docs/features/{feature}/{part}/{plan-name}/
- Implemented tasks: [number] tasks
- Quality checks: All passed
- Commits: [number] commits created

**Important**: This command manages the entire autonomous execution flow from task decomposition to implementation completion. Automatically stops when requirement changes are detected.