# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains [Claude Code plugins](https://docs.claude.ai/en/docs/claude-code/plugins) — extensions that add agents, commands, and skills to Claude Code CLI.

Overture is a plugin marketplace providing three companion plugins:
- **backend-overture**: Backend and general-purpose development
- **frontend-overture**: React/TypeScript specialized workflows
- **fullstack-overture**: Full-stack development combining both

The framework implements an **agentic orchestration pattern** where specialized sub-agents coordinate through commands (orchestrators) to handle complex software development tasks.

## Architecture

### Core Pattern: Orchestrator/Conductor Model

Commands like `/implement` act as orchestrators:
- Delegate ALL work to specialized sub-agents
- Follow deterministic flow rules in `workflow-orchestration` skill
- Never perform work directly—only coordinate
- Must include constraint suffix on sub-agent prompts: `[SYSTEM CONSTRAINT] This agent operates within [command] command scope...`

### Scale-Based Workflow Routing

Scale is the highest level any of five axes triggers in `requirement-analyzer` (files, observable outcomes, contracts/data, boundaries, decision risk); file count alone never decides it. A PRD is written at every scale.
- **Small (typically 1-2 files)**: PRD (lite) → simplified Work Plan → Tasks → Implementation → quality-fixer → commit
- **Medium (typically 3-5 files)**: PRD (lite) → [UXRD] → Design Doc per part → Work Plan per part → Tasks → Implementation → Review
- **Large (typically 6+ files)**: PRD (full) → [UXRD] → Design Doc per part → Work Plan per part → Tasks → Implementation → Review

All parts are designed before any is planned; then parts are planned and built one at a time, in dependency order.

### Parts

A **part** is an independently designable slice of a feature (`api`, `web`, `billing`, `migration`). The split is a product decision: proposed by `requirement-analyzer`, refined into the PRD's "Delivery Parts" section by `prd-creator`, and confirmed by the user at PRD approval before any design begins — at every scale, since the PRD always exists. Each part gets its own `design-{part}.md` and plan chain under `{part}/`.

- All parts are designed first, in dependency order, each to its own approval stop
- Then each part is planned and built in turn, each with its own batch approval
- Every Must Have requirement belongs to exactly one part; `dependsOn` is acyclic; one part is the common case
- Changing the parts list goes back to the product phase — never done by a designer or the orchestrator

### Document-Driven Development

Progressive document creation based on complexity:
- **PRD** (every scale; `full` at large, `lite` at medium and small): Business requirements, user value, success metrics, Delivery Parts
- **ADR** (rare, after the Design Doc): Only when a decision the design made is costly to reverse, binds beyond the feature, and was taken against real alternatives
- **Design Doc** (medium and large, one per part): Technical specifications, interfaces, acceptance criteria
- **Work Plan** (every scale, per part; simplified at small): Phased task breakdown with dependencies
- **Task Files** (at execution): Single-commit granularity work units

### Explicit Stop Points for User Approval

Autonomous flow halts at (once per feature unless stated):
- After requirement-analyzer (confirm requirements and scale)
- After document-reviewer completes PRD review (including the Delivery Parts split; every scale)
- After document-reviewer completes UXRD review (when the work has a UI surface)
- After design-sync verifies a part's Design Doc (once per part)
- After document-reviewer completes ADR review (only when an ADR was written, after that part's design)
- After document-reviewer reviews a part's work plan (batch approval, once per part)

After a part's batch approval: full autonomy until that part's completion report or an escalation; the next part starts with its own plan review and batch approval.

### Per-Task Quality Cycle

Each task execution follows cycle:
1. task-executor → Implementation
2. Escalation judgment → Check status
3. quality-fixer → Tests, linting, build
4. git commit → Based on selected commit strategy

### Commit Strategy (User Choice)

Ask user before implementation phase:
- **per-task** (default): Commit after each task
- **per-phase**: Commit after each phase completes
- **per-feature**: Single commit at the end
- **manual**: User decides when to commit

**CRITICAL**: No skipping escalation checks, no skipping quality-fixer.

### Document Revision Flow

When document-reviewer returns `needs_revision`:
1. Orchestrator extracts issues from reviewer output
2. Orchestrator calls the appropriate revision agent (specified in `revision_agent` field)
3. Revision agent edits the document
4. Orchestrator re-runs document-reviewer
5. Repeat until approved

**CRITICAL**: Orchestrator NEVER edits documents directly — always delegate to agents.

## Directory Structure

```
overture/
├── .claude-plugin/marketplace.json  # Manages all plugins (version here)
├── agents/                          # Shared agent implementations
├── commands/                        # Command orchestrators
├── skills/                          # Knowledge base modules
├── backend/                         # backend-overture plugin
│   ├── .claude-plugin/plugin.json   # Agents, commands config
│   ├── agents/                      # Symlinks to shared agents
│   ├── commands/                    # Symlinks to shared commands
│   └── skills/                      # Symlinks to shared skills
├── frontend/                        # frontend-overture plugin
│   ├── .claude-plugin/plugin.json   # Agents, commands config
│   └── ...                          # Symlinks (same structure)
├── fullstack/                       # fullstack-overture plugin
│   ├── .claude-plugin/plugin.json   # Agents, commands config
│   └── ...                          # Symlinks (same structure)
├── gamedev/                         # gamedev-overture plugin (own product phase, shared technical/execution)
└── strategy/                        # strategy-overture plugin (own agents and skills)
```

### Symlink Architecture

All three plugins symlink to shared agents/commands/skills:
- Single source of truth for shared components
- Plugin-specific exclusions configured in respective plugin.json
- Changes to shared files propagate to all plugins

## Key Components

### Agent Categories

**Document Creation**: requirement-analyzer, prd-creator, technical-designer, technical-designer-frontend, work-planner, acceptance-test-generator

**Implementation**: task-executor, task-executor-frontend, quality-fixer, quality-fixer-frontend

**Analysis & Review**: code-reviewer, document-reviewer, design-sync, integration-test-reviewer, code-verifier, code-explorer, codebase-analyzer

**Specialized Workflows**: task-decomposer, investigator, verifier, solver, scope-discoverer, rule-advisor

### Skills (Knowledge Base)

Skills contain structured guidance used by agents:
- **workflow-orchestration**: Shared mechanics — agent invocation, response contracts, delegation boundary, conflict precedence, file ownership, TodoWrite
- **workflow-product**: Product phase — requirement analysis, PRD, UXRD, ending at UXRD approval
- **workflow-technical**: Technical phase — codebase fact gathering, Design Doc, conditional ADR, test skeletons, ending at Design Doc approval
- **workflow-execution**: Planning and execution — work plan, review, batch approval, decomposition, per-task cycle, commit strategies, post-implementation verification, auto-stop triggers. Parameterized by planner agent.
- **workflow-gamedev** (gamedev only): Replaces workflow-product — scenario detection, development modes, GDD, game design disciplines. Reuses workflow-technical unchanged.
- **documentation-criteria**: PRD/ADR/Design Doc/Plan/Task templates and creation decision matrices
- **coding-principles**: Language-agnostic code quality standards
- **testing-principles**: TDD practices, test patterns, coverage requirements
- **ai-development-guide**: Anti-patterns, error handling principles, fail-fast design
- **typescript-rules**: TypeScript-first development (frontend)
- **typescript-testing**: React Testing Library patterns (frontend)

## Critical Conventions

### Mandatory JSON Response

**Every agent returns a JSON object to its caller.** The caller is a program deciding what to do next — whether to advance, retry, or stop — and it cannot make that decision from prose.

This holds regardless of what the agent produces. What varies is what goes *in* the response, not whether there is one:

**Agents that return findings** — reviewers, verifiers, analyzers, searchers:

```json
{
  "status": "completed|blocked|escalation_needed",
  "summary": "...",
  "findings": {...},
  "nextSteps": [...]
}
```

Reviewers are the one exception to the `status` enum: `document-reviewer` returns its verdict as the top-level `status` (`approved | approved_with_conditions | needs_revision | rejected`) together with `revision_agent`, because the orchestrator's revision loop keys on exactly those two fields.

**Agents that produce documents** — prd-creator, technical-designer, work-planner, ux-designer, task-decomposer:

```json
{
  "status": "completed|blocked|escalation_needed",
  "documents": [{"path": "docs/features/auth/prd.md", "action": "created|updated"}],
  "summary": "...",
  "openQuestions": [...],
  "nextSteps": [...]
}
```

The document goes to disk; the response carries its **path**, not its contents. A caller that receives the document inline pays for it twice — once when the agent wrote it, again in its own context — and still has no path to hand to the next agent.

**A document written without a returned path is invisible to the flow.** The orchestrator's revision loops key on `status`, and its handoffs key on `documents[].path`; an agent that writes a file and returns prose breaks both.

### TodoWrite Integration

All agents must:
- First todo: "Confirm skill constraints"
- Final todo: "Verify skill fidelity"
- Update status in real-time: pending → in_progress → completed

### Mandatory Escalation Triggers (task-executor)

Immediate escalation required for design deviations:
- Interface definition changes needed
- Layer structure violations
- Dependency direction reversals
- External library additions
- Contract definition bypass needed

### Quality Violations

Immediate escalation required:
- Contract system bypass needed
- Error handling bypass needed
- Test hollowing needed
- Existing test modification/deletion needed

## Modifying This Repository

### Adding/Modifying Agents

1. Edit or create agent file in `/agents/`
2. Agent must output mandatory JSON format
3. Include TodoWrite integration
4. Register agent in both `backend/.claude-plugin/plugin.json` and `frontend/.claude-plugin/plugin.json` (or just one if plugin-specific)
5. Create symlinks in `backend/agents/` and `frontend/agents/`

### Adding/Modifying Commands

1. Edit or create command file in `/commands/`
2. Command must act as orchestrator (delegate to agents)
3. Include mandatory constraint suffix in sub-agent calls
4. Register in appropriate plugin.json
5. Create symlinks in plugin directories

### Adding/Modifying Skills

1. Edit or create skill in `/skills/` directory
2. Skills are loaded automatically by agents based on configuration
3. Register in plugin.json if needed

### Version Updates

**MANDATORY**: Every pull request must include a version bump. Bump patch version in:
- `/.claude-plugin/marketplace.json` (always)
- The affected plugin's `.claude-plugin/plugin.json` (e.g., `strategy/.claude-plugin/plugin.json`)

Only one bump per PR — if the version was already bumped in this branch, do not bump again.

## Command Reference

### Backend Commands (backend-overture)
- `/implement` - Full-cycle feature development
- `/design` - Design document creation
- `/create-plan` - Work plan generation
- `/build` - Execute from existing task plan
- `/task` - Single task with precision
- `/review` - Design compliance check
- `/diagnose` - Root cause analysis
- `/reverse-engineer` - Generate docs from code
- `/add-integration-tests` - Add integration/E2E tests
- `/audit` - Interactive dead code detection and cleanup
- `/update-doc` - Update an existing PRD, UXRD, Design Doc, or ADR through its owning agent

### Frontend Commands (frontend-overture)
- `/front-design` - Frontend Design Doc creation
- `/front-plan` - Component work plan
- `/front-build` - Execute React implementation
- `/front-review` - Frontend design verification
- `/front-reverse-design` - Generate frontend docs from PRD
- `/task` - Single task (shared)
- `/diagnose` - Problem diagnosis (shared)
