---
name: strategy-orchestration-guide
description: Orchestration rules for strategy analysis workflows. Loaded when coordinating strategy agents, managing analysis phases, or running /strategy-report. Defines flows, stop points, agent coordination, and report compilation.
---

# Strategy Orchestration Guide

## Role: The Strategy Orchestrator

**The orchestrator coordinates strategy agents like a McKinsey engagement manager — directing analysts without doing the analysis.**

All research, analysis, and report generation flows through specialized strategy agents.

### Automatic Responses

| Trigger | Action |
|---------|--------|
| New business/product to analyze | Invoke **context-analyzer** |
| Flow in progress | Check flow table for next agent |
| Phase completion | Delegate to next agent |
| Stop point reached | Wait for user approval |

### First Action Rule

**Every new analysis begins with context-analyzer.**

## Available Strategy Agents

1. **context-analyzer**: Understands the business, product, or idea. Extracts core value proposition, target audience, current state, and analysis goals
2. **market-analyst**: TAM/SAM/SOM sizing, competitive analysis, Porter's Five Forces, SWOT, industry trends
3. **strategy-architect**: Blue Ocean Strategy Canvas, Ansoff/BCG growth matrix, brand positioning, perceptual maps
4. **business-modeler**: Business Model Canvas / Lean Canvas, innovation accounting, revenue model analysis
5. **gtm-planner**: Go-to-market strategy, pricing, channels, partnerships, ICP definition, messaging
6. **growth-strategist**: AARRR funnel audit, PLG/CLG analysis, growth experiments, ICE/RICE prioritization
7. **report-compiler**: Compiles all agent outputs into a unified McKinsey-grade strategic report
8. **product-analyst**: AJTBD deep analysis — RAT risk assessment (P×I scoring), job-based segmentation (B2B/B2C), jobs graph mapping, landing page generation from jobs
9. **product-planner**: Strategy-to-execution bridge — opportunity maps (Teresa Torres OST), feature specifications (Shape Up pitch), Now/Next/Later roadmap (Kano + WSJF), MVP definition (MoSCoW)

## Output Files

All strategy documents are written to `docs/strategy/` in the user's project, one file per analysis domain — no analysis is embedded or hidden inside another report. Paths, owner agents, and the commands that write each file: `strategy-documentation-criteria`, Storage Locations.

**Rules**:
- Create/edit files only through the owner agent
- Orchestrator NEVER writes documents directly — always delegate to agents
- Each agent reads previous agents' outputs for context continuity
- **Every analysis domain = its own file** — never merge domains into one file

## Explicit Stop Points

| Phase | Stop Point | User Action Required |
|-------|------------|---------------------|
| Context | After context-analyzer completes | Confirm business understanding, answer questions |
| AJTBD | After product-analyst completes | Validate Core Job, Big Job, segments, top risks |
| Market | After market-analyst completes | Review market findings, adjust scope if needed |
| Strategy + Model | After strategy-architect AND business-modeler complete | Approve strategic direction and business model |
| GTM + Growth | After gtm-planner AND growth-strategist complete | Approve GTM and growth strategy |
| Report | After report-compiler produces final report | Review final deliverable |
| Product Plan | After product-planner completes | Approve features, roadmap, MVP scope |

## Full Analysis Flow (/strategy-report)

### Complete Flow (Default)

The full flow produces **18+ deliverable files** and covers every analysis domain available in individual commands.

```
Phase 1: Context
  1. context-analyzer → docs/strategy/context-brief.md
     [Stop: Confirm business understanding]

Phase 2: AJTBD Deep Dive
  2. product-analyst → THREE files:
     - docs/strategy/rat.md (RAT: Top 5 risky assumptions with P×I scoring)
     - docs/strategy/segments.md (5 most attractive segments by jobs, B2B or B2C)
     - docs/strategy/jobs-graph.md (Critical job sequence for primary segment)
     [Stop: Review AJTBD analysis — validate Core Job, Big Job, segments, top risks]

Phase 3: Market Intelligence
  3. market-analyst → THREE files:
     - docs/strategy/market-analysis.md (TAM/SAM/SOM + industry trends)
     - docs/strategy/competitive-landscape.md (competitor profiles + perceptual maps + SWOT/TOWS)
     - docs/strategy/customer-segments.md (behavioral, psychographic, value-based segments)
     [Stop: Review market findings]

Phase 4: Strategy & Business Model (Parallel)
  4a. strategy-architect → TWO files:
      - docs/strategy/strategy-canvas.md (Blue Ocean + Four Actions + Ansoff/BCG + Value Proposition)
      - docs/strategy/brand-positioning.md (perceptual maps + positioning statement + strategy)
  4b. business-modeler → ONE file:
      - docs/strategy/business-model.md (Lean Canvas/BMC + unit economics + innovation accounting)
      [Stop: Approve strategic direction + business model]

Phase 5: GTM & Growth (Parallel)
  5a. gtm-planner → TWO files:
      - docs/strategy/gtm-plan.md (ICP + messaging + channels + partnerships + content + launch plan)
      - docs/strategy/pricing-analysis.md (value-based pricing + tier design + competitive pricing)
  5b. growth-strategist → TWO files:
      - docs/strategy/growth-plan.md (AARRR funnel + North Star + experiments + 90-day plan)
      - docs/strategy/prioritized-initiatives.md (ICE/RICE scored list of ALL strategic actions from all prior phases)
      [Stop: Approve GTM + growth plan]

Phase 6: Final Report
  6. report-compiler → ONE file:
     - docs/strategy/strategic-report.md (unified McKinsey-grade report with Go/No-Go)
     [Stop: Review final report]

Phase 7: Product Plan
  product-planner → FOUR+ files:
    - docs/strategy/opportunity-map.md (Opportunity Solution Tree from strategy analysis)
    - docs/strategy/features/feature-NNN-[slug].md (Individual feature specs with cross-references, N files)
    - docs/strategy/product-roadmap.md (Now/Next/Later with links to feature files + Kano + WSJF)
    - docs/strategy/mvp-definition.md (MoSCoW scope, success metrics, validation plan)
    [Stop: Review product plan — validate features, roadmap priorities, MVP scope]
```

**CRITICAL**: Every file listed above MUST be created during a full /strategy-report run. The orchestrator verifies each phase's files before the next phase starts, and all of them before the completion report.

### Quick Analysis Flow (User requests "quick" or "summary")

```
1. context-analyzer → context-brief.md
   [Stop: Confirm]

2. product-analyst → rat.md + segments.md (skip jobs-graph)
   [Stop: Review AJTBD findings]

3. report-compiler → strategic-report.md (summary version)
   [Stop: Review]
```

### Single-Domain Flow (Individual commands)

Used when user invokes a single command (e.g., `/analyze-market`):
```
1. context-analyzer → If no context-brief.md exists, run first
2. [domain-specific agent] → Execute analysis, write the files the command names
3. No report compilation needed
```

## How to Call Strategy Agents

### Execution Method
Call agents using the Agent tool:
- subagent_type: Agent name
- description: Concise task description (3-5 words)
- prompt: Specific instructions with prior context

Each command holds its agents' prompts; a prompt names the files the agent reads and the files it must write. This guide holds the phases, stop points, and parallel rules the commands follow.

### Parallel Execution Rules

Agents that can run in parallel:
- **strategy-architect + business-modeler** (both depend on market-analyst, independent of each other)
- **gtm-planner + growth-strategist** (both depend on strategy + model, independent of each other)

Agents that MUST be sequential:
- context-analyzer → product-analyst (AJTBD needs context)
- product-analyst → market-analyst (market needs AJTBD insights)
- market-analyst → strategy-architect/business-modeler (strategy needs market data)
- strategy/model → gtm/growth (GTM needs strategic direction)
- Phases 1–5 → report-compiler (it compiles the documents those phases produced; product-plan documents come after it, in Phase 7)

## Information Bridging

The orchestrator's key responsibility is passing context between agents. Each agent reads the files listed below:

| From Agent | Files Produced | Read By |
|-----------|---------------|---------|
| context-analyzer | `context-brief.md` | ALL subsequent agents |
| product-analyst | `rat.md`, `segments.md`, `jobs-graph.md` | market-analyst, strategy-architect, business-modeler, growth-strategist |
| market-analyst | `market-analysis.md`, `competitive-landscape.md`, `customer-segments.md` | strategy-architect, business-modeler, gtm-planner, growth-strategist |
| strategy-architect | `strategy-canvas.md`, `brand-positioning.md` | gtm-planner, growth-strategist |
| business-modeler | `business-model.md` | gtm-planner, growth-strategist |
| gtm-planner | `gtm-plan.md`, `pricing-analysis.md` | report-compiler, product-planner |
| growth-strategist | `growth-plan.md`, `prioritized-initiatives.md` | report-compiler |
| report-compiler | `strategic-report.md` | User (final deliverable) |
| All prior agents | all 15 docs | product-planner |

**CRITICAL**: growth-strategist for `prioritized-initiatives.md` reads every document from Phases 1–4 to collect each recommended action and score it. GTM actions run in parallel with it and reach the action plan through report-compiler.

## Structured Response Format

Each agent returns JSON. Key fields:

```json
{
  "status": "completed|blocked|needs_input",
  "summary": "One-line executive summary",
  "confidence": "high|medium|low",
  "sourceTier": "Primary data tier used",
  "outputFiles": ["docs/strategy/[file].md"],
  "keyFindings": ["finding1", "finding2", "finding3"],
  "questions": ["question for user if any"],
  "nextSteps": ["recommended next actions"]
}
```

## Constraints

- **No guessing numbers**: If market data unavailable, state "Data unavailable — Tier 3 estimate: [range]"
- **Structured JSON output**: All agents return structured responses
- **File ownership**: Only owner agent writes to its file
- **Stop points honored**: Orchestrator MUST stop and wait at every defined stop point
