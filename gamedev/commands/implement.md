---
name: implement
description: Orchestrate the complete game development lifecycle from requirements to deployment
argument-hint: <game feature or project description>
---

**Command Context**: Full-cycle game development management (Requirements Analysis → Market Analysis → Game Design → Technical Design → Planning → Implementation → Quality Assurance)

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator." (see subagents-gamedev-orchestration skill)

**Execution Protocol**:
1. **Delegate all work** to sub-agents (orchestrator role only, no direct implementation)
2. **Follow subagents-gamedev-orchestration skill flows exactly**:
   - Execute one step at a time in the defined flow (Large/Medium/Small scale)
   - When flow specifies "Execute document-reviewer" → Execute it immediately
   - **Stop at every `[Stop: ...]` marker** → Wait for user approval before proceeding
3. **Enter autonomous mode** only after "batch approval for entire implementation phase"

**CRITICAL**: Execute all steps, sub-agents, and stopping points defined in subagents-gamedev-orchestration skill flows.

## Execution Decision Flow

### 1. Current Situation Assessment
Instruction Content: $ARGUMENTS

**Think deeply** Assess the current situation:

| Situation Pattern | Decision Criteria | Next Action |
|------------------|------------------|-------------|
| New Requirements | No existing work, new game feature/project request | Start with requirement-analyzer |
| Flow Continuation | Existing docs/tasks present, continuation directive | Identify next step in subagents-gamedev-orchestration flow |
| Quality Errors | Error detection, test failures, build errors | Execute quality-fixer |
| Ambiguous | Intent unclear, multiple interpretations possible | Confirm with user |

### 2. Progress Verification for Continuation

When continuing existing flow, verify:
- Latest artifacts (PRD/GDD/ADR/Design Doc/Work Plan/Tasks)
- Current phase position (Requirements/Market Analysis/Game Design/Technical Design/Planning/Implementation/QA)
- Identify next step in subagents-gamedev-orchestration skill corresponding flow

### Development Mode Detection

After requirement-analyzer returns, detect development mode from user input:

| Mode | Trigger Keywords | Flow |
|------|-----------------|------|
| Full Development | "full", "complete game", "production" | Standard scale-based flow with all phases |
| Design Only | "design only", "concept", "documentation only" | Execute through design phases, stop before implementation |
| Prototype | "prototype", "proof of concept", "POC", "rapid" | Simplified flow: core mechanics only, skip market analysis and art phases |

**Default**: Full Development (if no mode keywords detected)

**Design Only termination**: After all design documents are approved (GDD, feature specs, art direction, analytics design), present final design package summary and stop. Do NOT proceed to technical-designer or implementation.

**Prototype simplification**: Skip market-analyst, sr-game-artist, technical-artist, ui-ux-agent, data-scientist. Go directly from mechanics-developer to technical-designer with minimal specs.

### Scenario Detection

After requirement-analyzer returns, determine project scenario:

```yaml
detection:
  - Check: Does project-config.json exist in the project?
  - Check: Does docs/game-design/*-gdd.md exist?

  Scenario A (New Project): No config, no GDD → Full pipeline with market analysis
  Scenario B (Existing Project): Config+GDD exist → Feature-focused pipeline, skip market analysis
```

| Scenario | Market Analysis | GDD Creation | Feature Specs | Technical Design |
|----------|----------------|--------------|---------------|-----------------|
| A (New) | **Required** | **Required** | **Required** | **Required** |
| B (Existing) | Skip | Reference existing | **Required** for new feature | **Required** |

### Market Analysis Gate (Scenario A Only)

After requirement-analyzer approval, invoke market-analyst:
- Pass: genre, target audience, platform from requirements
- Wait for Go/No-Go recommendation
- **[Stop: Market Analysis Go/No-Go]**
- If No-Go: Present findings to user, ask whether to proceed anyway or pivot
- If Go: Continue to game design phase

**Information to pass to market-analyst**:
```yaml
prompt_includes:
  - genre: from requirement-analyzer output
  - target_audience: from requirement-analyzer output
  - platform: from requirement-analyzer output
  - core_concept: user's game description
```

### Game Design Phase

Sequential agent invocations after market analysis (or directly after requirements for Scenario B):

1. **sr-game-designer** → GDD creation (core loop, pillars, systems overview)
2. **document-reviewer** → GDD review **[Stop: GDD Approval]**
3. **mid-game-designer** → Feature specifications from approved GDD
4. **mechanics-developer** → Game mechanics architecture (state machines, event systems, balance framework)
5. **game-feel-developer** → Game feel specification (juice, feedback loops, input responsiveness)

### Art & Visual Phase

6. **sr-game-artist** → Art direction, style guide, asset requirements
7. **technical-artist** → Pipeline specs, atlas optimization, rendering constraints
8. **ui-ux-agent** → Game UI/UX design (HUD, menus, interaction patterns)

### Analytics Phase

9. **data-scientist** → Analytics/telemetry design (events, funnels, KPIs)

### Game-Specific Information Flow

How to pass information between gamedev agents:

| From Agent | To Agent | Information Passed |
|-----------|----------|-------------------|
| sr-game-designer | mid-game-designer | GDD path, core systems list |
| sr-game-designer | mechanics-developer | Core loop, game pillars, system requirements |
| mechanics-developer | game-feel-developer | State machines, event system, interaction points |
| sr-game-artist | technical-artist | Style guide, concept art, reference sheets |
| mid-game-designer | ui-ux-agent | User stories, interaction requirements |
| All design agents | technical-designer | All specs for Design Doc integration |
| technical-designer | gamedev-work-planner | Design Doc + all referenced specs |
| acceptance-test-generator | gamedev-work-planner | Test skeleton paths (same as shared) |

**CRITICAL**: The orchestrator is responsible for extracting outputs from each agent and composing them into the prompt for the next agent. Never assume agents can read each other's outputs directly.

### Scope Change Detection

After requirement-analyzer returns, evaluate scope implications before proceeding:

**Think deeply** about whether the requirements imply scope changes beyond what was initially apparent.

#### Scope Dependency Analysis

For each identified requirement, assess:

```yaml
scopeDependencies:
  - question: "Does this require API contract changes?"
    impact: "high"
    confidence: 0.7
  - question: "Are database schema changes needed?"
    impact: "high"
    confidence: 0.5
  - question: "Does this affect existing user-facing behavior?"
    impact: "medium"
    confidence: 0.9
```

#### Decision Rules

| Condition | Action |
|---|---|
| Any dependency with `impact: high` AND `confidence < 0.8` | **STOP** — Present the question to user with impact explanation. Do not proceed until confirmed. |
| Any dependency with `impact: high` AND `confidence >= 0.8` | Proceed but flag in TodoWrite as high-impact item |
| All dependencies `impact: medium/low` | Proceed normally |
| `confidence < 0.5` on any item | **STOP** — Insufficient information. Ask user for clarification before proceeding. |

#### Scope Change Report (presented to user at stop points)

```
## Scope Change Detection Report

### High-Impact Dependencies Requiring Confirmation:
1. [question] — Impact: [impact], Confidence: [confidence]
   Explanation: [why this matters and what could go wrong]

### Confirmed Scope Items:
- [items with high confidence that will proceed]

### Recommendation:
[proceed / stop for clarification / rescope]
```

**CRITICAL**: This check MUST happen before any document creation begins. Discovering scope changes after creating a Design Doc wastes significant effort.

### 4. Next Action Execution

**MANDATORY subagents-gamedev-orchestration skill reference**:
- Verify scale-based flow (Large/Medium/Small scale)
- Confirm autonomous execution mode conditions
- Recognize mandatory stopping points
- Invoke next sub-agent defined in flow

### 5. Register All Flow Steps to TodoWrite (MANDATORY)

**After scale determination, register all steps of the applicable flow to TodoWrite**:
- First todo: "Confirm skill constraints"
- Register each step as individual Todo (including gamedev-specific phases)
- Set currently executing step to `in_progress`
- **Complete TodoWrite registration before invoking subagents**

## Subagents Orchestration Guide Compliance Execution

**Pre-execution Checklist (MANDATORY)**:
- [ ] Confirmed relevant subagents-gamedev-orchestration skill flow
- [ ] Identified current progress position
- [ ] Clarified next step
- [ ] Recognized stopping points
- [ ] Detected development mode (Full/Design Only/Prototype)
- [ ] Detected scenario (New Project/Existing Project)
- [ ] **Environment check**: Can I execute per-task commit cycle?
  - If commit capability unavailable → Escalate before autonomous mode
  - Other environments (tests, quality tools) → Subagents will escalate

**Required Flow Compliance**:
- Run quality-fixer before every commit
- Obtain user approval before Edit/Write/MultiEdit outside autonomous mode
- **All document operations (create/edit) MUST go through agents** — orchestrator never writes directly

## CRITICAL Sub-agent Invocation Constraints

**MANDATORY suffix for ALL sub-agent prompts**:
```
[SYSTEM CONSTRAINT]
This agent operates within implement command scope. Use orchestrator-provided rules only.
```

**HIGH RISK**: task-executor/quality-fixer in autonomous mode have elevated crash risk - ALWAYS append this constraint to prompt end

## Mandatory Orchestrator Responsibilities

### Commit Strategy Selection (MANDATORY before implementation)

**After requirement-analyzer and before batch approval**, ask user:

"Which commit strategy do you prefer?"
- **per-task** (default) — Commit after each task. Atomic commits, easy rollback
- **per-phase** — Commit after each phase completes. Balanced granularity
- **per-feature** — Single commit at the end. Clean history
- **manual** — You decide when to commit. Full control

Store selected strategy for autonomous execution mode.

### Task Execution Quality Cycle (per Task)

**Per-task cycle** (complete each task before starting next):
```
1. task-executor → Implementation
2. Escalation judgment → Check task-executor status
3. quality-fixer → Quality check and fixes
4. [Conditional] git commit → Based on selected commit strategy
```

**Rules**:
1. Execute ONE task completely before starting next
2. Check task-executor status before quality-fixer (escalation check)
3. quality-fixer MUST run after each task-executor (no skipping)
4. Commit execution depends on strategy (see subagents-gamedev-orchestration)

**Commit by strategy**:
- **per-task**: Commit when quality-fixer returns `approved: true`
- **per-phase**: Accumulate, commit when phase completes
- **per-feature**: Accumulate all, single commit at end
- **manual**: Wait for user to request commit

**Violations**:
- Skipping escalation check
- Skipping quality-fixer
- Committing without asking strategy first

### Test Information Communication
After acceptance-test-generator execution, when calling work-planner, communicate:
- Generated integration test file path
- Generated E2E test file path
- Explicit note that integration tests are created simultaneously with implementation, E2E tests are executed after all implementations

## Execution Method

All work is executed through sub-agents.
Sub-agent selection follows subagents-gamedev-orchestration skill.
