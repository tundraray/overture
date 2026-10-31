---
name: implement
description: Orchestrate the complete game development lifecycle from requirements to deployment
argument-hint: <game feature or project description>
---

**Command Context**: Full-cycle game development management (Requirements Analysis → Market Analysis → Game Design → Technical Design → Planning → Implementation → Quality Assurance)

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator." (see workflow-gamedev skill)

**Execution Protocol**:
1. **Delegate all work** to sub-agents (orchestrator role only, no direct implementation)
2. **Follow the phase skills' flows exactly** (`workflow-gamedev` → `workflow-technical` → `workflow-execution`):
   - Execute one step at a time in the defined flow (Large/Medium/Small scale)
   - At a document stop → `workflow-orchestration`, "Explicit Stop Points"
   - **Stop at every `[Stop: ...]` marker** → Wait for user approval before proceeding
3. **Enter autonomous mode** only after the batch approval of the current part's plan
4. **Drive the parts loop** (see "Parts Loop" below): all parts designed first, then each part planned and built in turn

**CRITICAL**: Execute all steps, sub-agents, and stopping points defined in the phase skills' flows.

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-gamedev/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-technical/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-execution/SKILL.md`

## Execution Decision Flow

### 1. Current Situation Assessment
Instruction Content: $ARGUMENTS

**Think deeply** Assess the current situation:

| Situation Pattern | Decision Criteria | Next Action |
|------------------|------------------|-------------|
| New Requirements | No existing work, new game feature/project request | Start with requirement-analyzer |
| Flow Continuation | Existing docs/tasks present, continuation directive | Identify next step in workflow-gamedev flow |
| Quality Errors | Error detection, test failures, build errors | Execute quality-fixer |
| Ambiguous | Intent unclear, multiple interpretations possible | Confirm with user |

### 2. Progress Verification for Continuation

When continuing existing flow, verify:
- Latest artifacts (GDD/Feature Spec/ADR/Design Doc/Work Plan/Tasks), and which parts of the feature spec's Delivery Parts have an approved `design-{part}.md` or a `completed` plan chain — the current part is the first one not finished in the current phase
- Current phase position (Requirements/Market Analysis/Game Design/Technical Design/Planning/Implementation/QA)
- Identify next step in workflow-gamedev skill corresponding flow

### Development Mode and Scenario

After requirement-analyzer returns, detect the development mode and the scenario as `workflow-gamedev` defines them ("Development Mode Routing", "Scenario Detection"), and confirm both at the first stop. Design Only stops after the design package; Prototype runs the reduced flow defined there: after the lite feature spec is approved, it goes straight to a simplified plan.

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
2. **[Stop: GDD Approval]** — a document stop (`workflow-orchestration`, "Explicit Stop Points"); an independent review uses `doc_type: GDD`
3. **mid-game-designer** → feature specification from the approved GDD, with `depth` (`full` at large scale, `lite` at medium and small) and the `parts[]` proposal from requirement-analyzer, producing the spec's **Delivery Parts** section
4. **[Stop: Feature Spec Approval — includes the parts split]** — a document stop; an independent review uses `doc_type: FeatureSpec` and the same `depth`. The approved Delivery Parts are the parts list for every later phase; Scenario A repeats steps 3-4 per feature the GDD defines
5. **mechanics-developer** → Game mechanics architecture (state machines, event systems, balance framework)
6. **game-feel-developer** → Game feel specification (juice, feedback loops, input responsiveness)

**Medium and small scale**: skip the GDD steps (1-2) unless new mechanics need a game design spec; run steps 3-4 with `depth: lite`, then continue per `workflow-gamedev`. At small scale the approved lite spec goes straight to a simplified plan.

### Art & Visual Phase

7. **sr-game-artist** → Art direction, style guide, asset requirements
8. **technical-artist** → Pipeline specs, atlas optimization, rendering constraints
9. **game-ui-designer** → Game UI/UX design (HUD, menus, interaction patterns)

### Analytics Phase

10. **data-scientist** → Analytics/telemetry design (events, funnels, KPIs)

### Game-Specific Information Flow

How to pass information between gamedev agents:

| From Agent | To Agent | Information Passed |
|-----------|----------|-------------------|
| sr-game-designer | mid-game-designer | GDD path, core systems list |
| sr-game-designer | mechanics-developer | Core loop, game pillars, system requirements |
| mechanics-developer | game-feel-developer | State machines, event system, interaction points |
| sr-game-artist | technical-artist | Style guide, concept art, reference sheets |
| mid-game-designer | game-ui-designer | User stories, interaction requirements |
| sr-game-artist | game-ui-designer | Art direction path — the design system's source |
| All design agents | technical-designer | All specs for Design Doc integration |
| technical-designer | gamedev-work-planner | Design Doc + all referenced specs |
| acceptance-test-generator | gamedev-work-planner | Test skeleton paths (same as shared) |

**CRITICAL**: The orchestrator is responsible for extracting outputs from each agent and composing them into the prompt for the next agent. Never assume agents can read each other's outputs directly.

### 3. Scope Change Detection

After requirement-analyzer returns, evaluate scope implications before proceeding:

**Think deeply** about whether the requirements imply scope changes beyond what was initially apparent.

#### Scope Dependency Analysis

requirement-analyzer reports a top-level `confidence` (`confirmed` | `provisional`) and, when provisional, the questions whose answers would move the scale:

```yaml
confidence: provisional
scopeDependencies:
  - question: "Does this change the save-file format?"
    impact: { if_yes: "large", if_no: "medium" }
    reason: "a persisted-data migration routes as Large regardless of file count"
  - question: "Does this touch the networked game-state contract?"
    impact: { if_yes: "large", if_no: "medium" }
    reason: "a breaking contract change is a Large-scale axis"
```

#### Decision Rules

| Condition | Action |
|---|---|
| `confidence: provisional` and any `scopeDependencies[].impact.if_yes` is a higher scale than the reported `scale` | **STOP** — Present the question with its `reason` at the requirements stop; a "yes" re-runs requirement-analyzer with the answer |
| `confidence: provisional` and no answer changes the scale | Proceed, carrying the questions into the feature spec's open items |
| `confidence: confirmed` | Proceed normally |
| `scaleRationale.decidingAxis` is not `files` | State it at the stop |

#### Scope Change Report (presented to user at stop points)

```
## Scope Change Detection Report

### Scale-Changing Questions Requiring an Answer:
1. [question] — if yes: [scale], if no: [scale]
   Reason: [why this matters and what could go wrong]

### Confirmed Scope Items:
- [items with high confidence that will proceed]

### Recommendation:
[proceed / stop for clarification / rescope]
```

**CRITICAL**: This check MUST happen before any document creation begins. Discovering scope changes after creating a Design Doc wastes significant effort.

### 4. Next Action Execution

**MANDATORY workflow-gamedev skill reference**:
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
- [ ] Confirmed relevant workflow-gamedev skill flow
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

### Parts Loop (MANDATORY)

The parts list confirmed in the product phase — the feature spec's Delivery Parts section, at every scale — drives two loops, both in the list's dependency order:

1. **Technical phase**: design every part to approval before planning any — `workflow-technical`, "Flow". One `[Stop: Design Doc approval — part X]` per part.
2. **Execution phase**: for each part, plan → batch approval → decompose → execute → post-implementation verification → Final Cleanup, then the next part — `workflow-execution`, "One part at a time". One batch approval per part.

Register per-part steps in TodoWrite as `[part] step`, so the current part is always visible. Commit strategy is asked once per feature, before the first part's batch approval. The orchestrator does not add, merge, or rename parts: a change to the list returns to the product phase (`mid-game-designer` in `update` mode and feature spec re-approval).

### Execution Phase (per part)

`workflow-execution` owns every step below, with `gamedev-work-planner` as `{planner}`; follow it there rather than from memory:

- **Commit strategy** — asked once per feature, after feature spec approval and before the first part's batch approval ("Commit Strategy Selection"); `per-phase` groups commits by the six game phases
- **Per-task cycle** — task-executor → escalation check → integration-test-reviewer when integration/E2E tests were added → quality-fixer → commit per strategy ("The Per-Task Cycle"). Never skip the escalation check or quality-fixer; never commit on `stub_detected`
- **Post-Implementation Verification** — the three verifiers in parallel on the part's file list, then at most two fix cycles. A `security-reviewer` `blocked` stops the run and nothing is committed
- **Final Cleanup** — the consumed task directory is deleted and `gamedev-work-planner` (`update` mode) sets the plan `completed`; the feature spec, GDD, `docs/design-system/`, and every design document stay
- **Test skeleton paths** reach `gamedev-work-planner` per part — `workflow-orchestration`, "Main Orchestrator Roles"

Append `[SYSTEM CONSTRAINT] This agent operates within implement command scope.` to each verifier prompt as well.

## Execution Method

All work is executed through sub-agents.
Sub-agent selection follows workflow-gamedev skill.
