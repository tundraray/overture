---
name: front-build
description: Execute frontend implementation in autonomous execution mode
argument-hint: (no arguments - uses existing task files)
---

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator." (see workflow-orchestration skill)

**Execution Method**:
- Task decomposition → performed by task-decomposer
- Frontend implementation → performed by task-executor-frontend
- Quality checks and fixes → performed by quality-fixer-frontend
- Commits → performed by orchestrator (Bash tool)

Orchestrator invokes sub-agents and passes structured JSON between them.

**CRITICAL**: Run quality-fixer-frontend before every commit. Obtain batch approval before autonomous mode.

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-execution/SKILL.md`

Work plan: $ARGUMENTS

## 📋 Pre-execution Prerequisites

### Work Plan Resolution

Before any task processing, locate the work plan. This recipe is the **frontend** build lane — it routes to `task-executor-frontend` and must never pick up a backend plan.

Resolve the plan as `workflow-execution`, "Resolving the Plan to Execute", describes; `$ARGUMENTS`, when given, is the plan path. Then **verify the plan belongs to this lane before executing it.** A design's layer is not in its filename — `design-{part}.md` is layer-neutral — so read the governing design named in the plan's `design:` frontmatter, plus the plan itself. Absence of backend markers is not sufficient: many plans use layer-neutral paths (`src/presentation`, `src/app`) matching neither marker set, so a confirmed frontend signal is required.

**Frontend signals (need at least one)**:
- The plan has a `UXRD Component → Task Mapping` section
- Target Files match frontend markers exclusively: `**/components/**`, `**/pages/**`, `**/web/**`, `**/*.tsx`, `**/*.jsx`, or the project's own equivalents of those directories
- The governing design describes component hierarchy, screen states, or UI interactions
- The part name identifies the layer (`ui`, `frontend`, `web`, or a screen name)
- Plan title or Snapshot explicitly identifies the work as frontend

**Backend signals (any one disqualifies, even alongside a frontend signal)**:
- Target Files exclusively under `**/api/**`, `**/server/**`, `**/services/**`, `**/backend/**`, `**/handlers/**`, `**/repositories/**`
- The governing design describes API endpoints, data schemas, or persistence with no rendering surface
- Title or Snapshot mentioning API endpoints, database migrations, or server-side work

**Decision**: at least one frontend signal AND zero backend signals → proceed. Otherwise stop and report which signals were checked and their results, then ask for an explicit plan path.

**Mixed-layer plans**: when a plan carries both, its part was not split cleanly. Do not guess — report that the plan spans layers, and ask whether to run `/implement` (which drives both) or to split the work into separate parts.

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

## 🧠 Execution - Frontend Specialized

`workflow-execution` owns each step; this lane supplies the agents — `task-executor-frontend`, `quality-fixer-frontend`, and `work-planner` for the plan's status. The orchestrator commits with Bash, using `changeSummary` for the message.

1. **Commit strategy** — ask before starting, unless one was already chosen for this feature earlier in the session ("Commit Strategy Selection")
2. **Per-task cycle** — for each task in the Consumed Task Set: register its steps in TodoWrite (first "Confirm skill constraints", last "Verify skill fidelity"), then task-executor-frontend (`prompt: "Task file: docs/features/{feature}/{part}/{plan-name}/[filename].md Execute implementation"`) → escalation check → integration-test-reviewer when integration/E2E tests were added → quality-fixer-frontend (`prompt: "Execute all frontend quality checks and fixes"`) → commit per strategy, handling every returned status as "The Per-Task Cycle" draws it
3. **Post-Implementation Verification** — after the last task: the three verifiers in parallel on the part's file list against the frontend Design Doc, then the fix cycles the skill allows, dispatched to task-executor-frontend in Fix Mode and quality-fixer-frontend; `test-auditor` is advisory. Append `[SYSTEM CONSTRAINT] This agent operates within front-build command scope.` to each prompt
4. **Final Cleanup** — as the skill sets it. Then read the PRD's Delivery Parts: a part that depends on this one and has no `completed` plan yet is named in the completion report as the next part to plan

**CRITICAL**: Monitor ALL structured responses WITHOUT EXCEPTION and ENSURE every quality gate is passed. VERIFY the plan's approval status (`status: active`) before entering autonomous execution, and STOP IMMEDIATELY upon detecting ANY requirement changes.

## Output Example
Frontend implementation phase completed.
- Task decomposition: Generated under docs/features/{feature}/{part}/{plan-name}/
- Implemented tasks: [number] tasks
- Quality checks: All passed
- Commits: [number] commits created

**Important**: This command manages the entire autonomous execution flow for FRONTEND implementation from task decomposition to completion. Automatically uses frontend-specialized agents (task-executor-frontend, quality-fixer-frontend).
