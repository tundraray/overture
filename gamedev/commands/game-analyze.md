---
name: game-analyze
description: Orchestrate comprehensive reverse-engineering and analysis of external games for competitive intelligence, retention insights, and market positioning
argument-hint: <game name or URL to analyze>
---

**Command Context**: External game reverse-engineering and competitive analysis workflow (Research → Mechanics Deep Dive → Specialized Analysis → Synthesis)

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator." All research, analysis, and report creation flows through specialized sub-agents.

**Execution Protocol**:
1. **Delegate all work** to sub-agents (orchestrator role only)
2. **Follow the phase flow** defined in this command
3. **Stop at every `[Stop: ...]` marker** — wait for user approval before proceeding
4. **Phase 2 (Mechanics) has a per-mechanic loop** — complete each mechanic before moving on
5. **Phase 3 runs autonomously** after mechanics approval

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/SKILL.md`

## Phase 0: Scope Configuration

Target: $ARGUMENTS

**TodoWrite**: Register Phase 0: Scope Configuration as first todo.

### 0.1 Game Identification

Use AskUserQuestion to collect:

1. **Game Name**: Full title of the game to analyze (required)
   - Pre-fill from $ARGUMENTS if provided
2. **Game Slug**: Auto-derive as lowercase hyphenated (e.g., "Hollow Knight" → `hollow-knight`). Confirm with user.
3. **Analysis Depth**:
   - **Quick** — Store page + 3 reviews + 1 article → Executive Summary only
   - **Standard** (recommended) — 15+ sources → All reports + mechanics breakdown
   - **Deep** — 25+ sources + source code + GDC talks → Full analysis with code patterns
4. **Focus Areas** (select multiple or "all"):
   - [ ] Core Loop & Mechanics
   - [ ] Retention & Monetization
   - [ ] Technology & Architecture
   - [ ] Marketing & Community
   - [ ] Game Feel & Polish
   - [ ] UI/UX & Onboarding
5. **Source Code URL** (optional): GitHub/GitLab repo URL for source code analysis
6. **Your Project Context** (optional): Path to your project's docs/ for "Our Opportunity" framing
7. **Comparison Mode**: Is this part of a multi-game comparison? (yes/no)

### 0.2 Output Configuration

- Output directory: `docs/game-research/{game-slug}/`
- Create directory if it does not exist
- If directory already exists, ask user: Update existing analysis or start fresh?

**[Stop: Confirm analysis scope, depth, and focus areas]**

## Workflow Overview

```
Phase 0: Scope Configuration                    [STOP: Confirm scope]
Phase 1: Research Data Collection                [STOP: Review research]
Phase 2: Mechanics Deep Dive (per-mechanic loop) [STOP: Review mechanics]
Phase 3: Specialized Analysis (autonomous)
Phase 4: Quality Review + Synthesis              [STOP: Review final reports]
Phase 5: Comparison (conditional)
```

## Phase 1: Research Data Collection

**TodoWrite**: Register Phase 1 steps.

### Step 1.1: Invoke game-researcher

**Task invocation**:
```
subagent_type: game-researcher
description: "Research {game_name}"
prompt: |
  Collect comprehensive research data for the following game.

  mode: research
  game_name: {game_name}
  game_slug: {game_slug}
  depth: {depth_level}
  focus_areas: {focus_areas}
  source_code_url: {source_code_url or "none"}
  output_dir: docs/game-research/{game_slug}/

  Write the structured raw research document to:
  docs/game-research/{game_slug}/raw-research.md

  If source code URL is provided and depth is "deep", also write:
  - docs/game-research/{game_slug}/source-code/architecture.md
  - docs/game-research/{game_slug}/source-code/patterns.md

  [SYSTEM CONSTRAINT]
  This agent operates within game-analyze command scope. Collect factual data only. Do NOT analyze or recommend — only gather and structure data.
```

### Step 1.2: Validate Research Output

- Verify `raw-research.md` exists and has content
- Check data quality summary: if >50% Speculative → flag for user

**Quality Gate**:
- Data quality adequate → proceed
- Data quality poor → ask user if they want to proceed with limited data or try additional research

**[Stop: Review raw research quality and completeness. User can request additional research.]**

## Phase 2: Mechanics Deep Dive

**TodoWrite**: Register Phase 2 steps.

**Skip this phase** if "Core Loop & Mechanics" was not selected in focus areas. Proceed to Phase 3.

### Step 2.1: Mechanics Discovery

**Task invocation**:
```
subagent_type: sr-game-designer
description: "Mechanics overview for {game_name}"
prompt: |
  Analyze the following raw research data and create a comprehensive mechanics overview.

  Game: {game_name}
  Raw Research: [Include full content of raw-research.md OR path if too large]

  Use the mechanics overview template at:
  ${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/mechanics-overview-template.md

  Your deliverables:
  1. Read the template
  2. Create the overview document at: docs/game-research/{game_slug}/mechanics/overview.md
  3. The mechanics inventory table MUST include:
     - Mechanic slug (lowercase-hyphenated)
     - Mechanic name
     - Category (Core / Secondary / Meta)
     - One-line description
  4. Include core loop diagram (mermaid)
  5. Include system interconnection map

  CRITICAL: The mechanics inventory drives the per-mechanic deep dive loop.
  Include ALL identifiable mechanics — err on the side of completeness.

  [SYSTEM CONSTRAINT]
  This agent operates within game-analyze command scope. Analyze the external game described in the provided research data. Do NOT make design decisions for the user's project — only analyze and report.
```

**Store output as**: `$MECHANICS_OVERVIEW` (path to overview.md + list of mechanic slugs)

### Step 2.2: Per-Mechanic Deep Dive

**For EACH mechanic listed in the overview's Mechanics Inventory table**:

**Task invocation** (repeat for each mechanic):
```
subagent_type: mechanics-developer
description: "Analyze {mechanic_name}"
prompt: |
  Perform detailed reverse-engineering of a single game mechanic.

  Game: {game_name}
  Mechanic: {mechanic_name} (slug: {mechanic_slug})
  Category: {mechanic_category}
  Description: {mechanic_description}

  Raw Research (relevant sections): [Extract mechanic-relevant data from raw-research.md]
  Mechanics Overview: [Include overview.md content for interconnection context]
  Source Code Notes: [If available, include relevant source-code/*.md excerpts]

  Use the mechanic detail template at:
  ${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/mechanic-detail-template.md

  Write the detailed analysis to:
  docs/game-research/{game_slug}/mechanics/{mechanic_slug}.md

  Cover ALL template sections. If data is unavailable for a section, mark it as
  "[Data Unavailable — {reason}]" rather than skipping it.

  Pay special attention to:
  - States & Transitions (state machine diagram)
  - Math & Formulas (balancing, scaling)
  - Retention Impact (how this mechanic keeps players engaged)
  - Lessons for Our Game (actionable insights)

  [SYSTEM CONSTRAINT]
  This agent operates within game-analyze command scope. Analyze the external game described in the provided research data. Do NOT make design decisions for the user's project — only analyze and report.
```

### Step 2.3: Mechanics Completion Check

- Verify all mechanic files exist in `docs/game-research/{game_slug}/mechanics/`
- Count files vs. expected from inventory
- If any missing → retry that specific mechanic (max 2 retries)

**[Stop: Review mechanics breakdown. User can request deeper analysis of specific mechanics.]**

## Phase 3: Specialized Analysis

**TodoWrite**: Register Phase 3 steps based on selected focus areas.

**Autonomous execution**: After mechanics approval, run all applicable agents without stopping.

### Agent Invocations by Focus Area

**For each focus area selected in Phase 0**, invoke the corresponding agent:

#### Retention & Monetization (data-scientist)

```
subagent_type: data-scientist
description: "Retention analysis for {game_name}"
prompt: |
  Analyze retention mechanics and monetization for the following game.

  Game: {game_name}
  Raw Research: [Include raw-research.md content]
  Mechanics Overview: [Include mechanics/overview.md content]

  Use the retention report template at:
  ${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/retention-report-template.md

  Write the analysis to: docs/game-research/{game_slug}/retention-analysis.md

  Special focus on:
  - Short/Mid/Long-term retention mechanisms
  - Habit loop identification
  - Monetization ethics assessment
  - Churn points and win-back strategies
  - Top 5 retention strategies the user can learn from

  [SYSTEM CONSTRAINT]
  This agent operates within game-analyze command scope. Analyze the external game described in the provided research data. Do NOT make design decisions for the user's project — only analyze and report.
```

#### Marketing & Community (market-analyst)

```
subagent_type: market-analyst
description: "Marketing analysis for {game_name}"
prompt: |
  Analyze marketing strategy and community for the following game.

  Game: {game_name}
  Raw Research: [Include raw-research.md content]

  Use the marketing report template at:
  ${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/marketing-report-template.md

  Write to: docs/game-research/{game_slug}/marketing-analysis.md

  Also use the market position template at:
  ${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/market-position-report-template.md

  Write to: docs/game-research/{game_slug}/market-position.md

  Generate BOTH reports. Cover marketing timeline, channels, community health,
  SWOT analysis, competitive positioning, and target audience analysis.

  [SYSTEM CONSTRAINT]
  This agent operates within game-analyze command scope. Analyze the external game described in the provided research data. Do NOT make design decisions for the user's project — only analyze and report.
```

#### Technology & Architecture (mechanics-developer)

```
subagent_type: mechanics-developer
description: "Technology analysis for {game_name}"
prompt: |
  Analyze the technology stack and architecture for the following game.

  Game: {game_name}
  Raw Research: [Include raw-research.md content]
  Source Code Notes: [If available, include source-code/*.md content]

  Use the technology report template at:
  ${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/technology-report-template.md

  Write to: docs/game-research/{game_slug}/technology-analysis.md

  Focus on: engine identification, architecture patterns, performance characteristics,
  networking model (if multiplayer), technical differentiators.

  [SYSTEM CONSTRAINT]
  This agent operates within game-analyze command scope. Analyze the external game described in the provided research data. Do NOT make design decisions for the user's project — only analyze and report.
```

#### Game Feel & Polish (game-feel-developer)

```
subagent_type: game-feel-developer
description: "Game feel analysis for {game_name}"
prompt: |
  Analyze game feel, polish, and audio design for the following game.

  Game: {game_name}
  Raw Research: [Include raw-research.md content]

  Use the game feel report template at:
  ${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/game-feel-report-template.md

  Write to: docs/game-research/{game_slug}/game-feel-analysis.md

  Focus on: visual feedback systems, screen effects, particle quality, audio layers,
  input responsiveness, camera work, juice inventory.

  [SYSTEM CONSTRAINT]
  This agent operates within game-analyze command scope. Analyze the external game described in the provided research data. Do NOT make design decisions for the user's project — only analyze and report.
```

#### UI/UX & Onboarding (ui-ux-agent)

```
subagent_type: ui-ux-agent
description: "UI/UX analysis for {game_name}"
prompt: |
  Analyze UI/UX design and onboarding for the following game.

  Game: {game_name}
  Raw Research: [Include raw-research.md content]

  Use the UI/UX report template at:
  ${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/ui-ux-report-template.md

  Write to: docs/game-research/{game_slug}/ui-ux-analysis.md

  Focus on: FTUE quality, navigation architecture, HUD design, menu patterns,
  shop UX, information hierarchy, accessibility features.

  [SYSTEM CONSTRAINT]
  This agent operates within game-analyze command scope. Analyze the external game described in the provided research data. Do NOT make design decisions for the user's project — only analyze and report.
```

## Phase 4: Quality Review + Synthesis

**TodoWrite**: Register Phase 4 steps.

### Step 4.1: Quality Gate

For each generated report, invoke document-reviewer:

```
subagent_type: document-reviewer
description: "Review {report_name}"
prompt: |
  Review the following game analysis report for quality and completeness.

  doc_type: GameAnalysisReport
  target: docs/game-research/{game_slug}/{report_file}

  Quality criteria (from game-analysis-criteria skill):
  - All template sections filled or marked N/A with reason
  - Data sources cited for each major claim
  - Confidence level stated for numerical estimates
  - At least 3 actionable insights
  - Cross-references to other reports where relevant

  If the report fails quality criteria, specify which sections need improvement.
```

**Revision logic**: If document-reviewer returns `needs_revision`:
1. Identify the owning agent from the Phase 3 table
2. Re-invoke that agent with revision instructions
3. Maximum 2 revision cycles per report
4. After 2 cycles, accept as-is with quality caveats noted

### Step 4.2: Executive Summary Synthesis

After all reports pass quality review (or reach max revisions):

```
subagent_type: game-researcher
description: "Executive summary for {game_name}"
prompt: |
  Generate the executive summary for the game analysis.

  mode: synthesis
  game_name: {game_name}
  game_slug: {game_slug}
  output_dir: docs/game-research/{game_slug}/

  Read ALL analysis reports from docs/game-research/{game_slug}/:
  - mechanics/overview.md + mechanics/*.md
  - retention-analysis.md
  - marketing-analysis.md
  - market-position.md
  - technology-analysis.md
  - game-feel-analysis.md
  - ui-ux-analysis.md

  Use the executive summary template at:
  ${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/executive-summary-template.md

  Write to: docs/game-research/{game_slug}/executive-summary.md

  CRITICAL: The "Top 5 Retention Strategies to Learn From" and "Top 5 Weaknesses to Exploit"
  sections are the most important deliverables for the user. Make them specific and actionable.

  {If user project context path was provided:}
  Also frame the "What This Means for Our Game" section with context from: {project_context_path}

  [SYSTEM CONSTRAINT]
  This agent operates within game-analyze command scope. Synthesize findings from all analysis reports. Focus on actionable retention strategies and competitive insights.
```

**[Stop: Review executive summary and final reports. Present summary of all generated documents.]**

## Phase 5: Comparison (conditional)

**Execute only if** comparison mode was selected in Phase 0 AND at least 2 games have been analyzed (check for other directories under `docs/game-research/`).

### Step 5.1: Identify Comparison Candidates

- List all `docs/game-research/*/executive-summary.md` files
- Present list to user, ask which games to compare

### Step 5.2: Generate Comparison Matrix

```
subagent_type: game-researcher
description: "Game comparison matrix"
prompt: |
  Generate a comparison matrix across the following analyzed games.

  mode: synthesis
  Games: [List of game slugs and names]

  Read the executive-summary.md from each game's directory.

  Use the comparison matrix format from the game-analysis-criteria skill.

  Write to: docs/game-research/comparison-matrix.md

  Include:
  - Scorecard comparison (all dimensions)
  - Metrics comparison (retention, revenue, players)
  - Feature comparison (what each game does/doesn't do)
  - "Our Opportunity" column for each dimension

  [SYSTEM CONSTRAINT]
  This agent operates within game-analyze command scope. Compare games objectively based on the analysis data.
```

## Final Report

Present to user:
- List of all generated documents with file paths
- Overall data quality assessment
- Key highlights from executive summary
- Recommended next steps

## Error Handling

| Error | Action |
|-------|--------|
| game-researcher finds no data | Ask user for store page URL or alternative search terms |
| Mechanic count > 15 | Ask user to prioritize top 10 for deep analysis, mark rest as overview-only |
| Agent report completely empty | Re-invoke with simplified prompt. If still empty, mark as failed in final report |
| Source code analysis fails | Skip silently, note in executive summary that source code was unavailable |
| Quality review loops exhausted | Accept report with caveats, note quality issues in executive summary |

## TodoWrite Integration

1. First todo: "Confirm skill constraints"
2. Register all phases at start
3. Within Phase 2: register each mechanic as individual todo
4. Update status in real-time: pending → in_progress → completed
5. Final todo: "Verify skill fidelity"

## CRITICAL Sub-agent Invocation Constraints

**MANDATORY suffix for ALL sub-agent prompts**:
```
[SYSTEM CONSTRAINT]
This agent operates within game-analyze command scope. Analyze the external game described in the provided research data. Do NOT make design decisions for the user's project — only analyze and report.
```

## Execution Method

All work is executed through sub-agents.
The orchestrator NEVER writes analysis documents directly — always delegate to the appropriate agent.
