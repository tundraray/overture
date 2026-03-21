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

## Orchestration Principles

### Pyramid Principle (Mandatory for All Outputs)

Every deliverable follows Barbara Minto's Pyramid Principle:
1. **Lead with the conclusion** — the "so what" comes first
2. **Support with MECE arguments** — Mutually Exclusive, Collectively Exhaustive
3. **Action titles** — every section heading is a complete sentence stating the main point
4. **Titles test** — an executive reads only titles and understands the entire argument

### Source Credibility Tiers

All data in reports must be tagged:
- **Tier 1 (Primary)**: Direct market data, official filings, confirmed metrics
- **Tier 2 (Secondary)**: Industry reports, analyst estimates, reliable press
- **Tier 3 (Inference)**: AI-generated estimates, pattern extrapolation, analogies

### MECE Enforcement

All categories, segments, and analysis dimensions must be:
- **Mutually Exclusive**: No overlap between categories
- **Collectively Exhaustive**: Categories cover the full space

## Output Directory Structure

All strategy reports are written to `docs/strategy/` in the user's project. **Each analysis domain produces its own dedicated file** — no analyses are embedded or hidden inside other reports.

```
docs/strategy/
├── context-brief.md              # Business context (context-analyzer)
├── rat.md                        # RAT: Top 5 risky assumptions with P×I scoring (product-analyst)
├── segments.md                   # AJTBD job-based segments, B2B or B2C (product-analyst)
├── jobs-graph.md                 # Critical job sequence for primary segment (product-analyst)
├── market-analysis.md            # Market sizing TAM/SAM/SOM + industry trends (market-analyst)
├── competitive-landscape.md      # Competitor profiles + perceptual maps + SWOT/TOWS (market-analyst)
├── customer-segments.md          # Customer segmentation analysis (market-analyst)
├── strategy-canvas.md            # Blue Ocean + Ansoff/BCG + value proposition (strategy-architect)
├── brand-positioning.md          # Perceptual maps + positioning statement + strategy (strategy-architect)
├── business-model.md             # BMC / Lean Canvas + unit economics + innovation accounting (business-modeler)
├── gtm-plan.md                   # ICP + messaging + channels + partnerships + content + launch plan (gtm-planner)
├── pricing-analysis.md           # Value-based pricing + tier design + competitive pricing (gtm-planner)
├── growth-plan.md                # AARRR funnel + North Star + experiments + 90-day plan (growth-strategist)
├── prioritized-initiatives.md    # ICE/RICE scored list of ALL strategic initiatives (growth-strategist)
├── strategic-report.md           # Final compiled McKinsey-grade report (report-compiler)
├── opportunity-map.md            # Opportunity Solution Tree (product-planner)
├── features/                     # Individual feature specifications (product-planner)
│   └── feature-NNN-[slug].md    # Per-feature Shape Up pitch with cross-references
├── product-roadmap.md            # Now/Next/Later roadmap with feature links (product-planner)
└── mvp-definition.md             # MVP scope, MoSCoW, validation plan (product-planner)
```

**Total: 18+ deliverable files per full analysis.**

### File Ownership by Agent

| File | Owner Agent | Corresponds to Command |
|------|-------------|----------------------|
| `docs/strategy/context-brief.md` | context-analyzer | (part of all flows) |
| `docs/strategy/rat.md` | product-analyst | `/rat` |
| `docs/strategy/segments.md` | product-analyst | `/b2b-segments` or `/b2c-segments` |
| `docs/strategy/jobs-graph.md` | product-analyst | `/jobs-graph` |
| `docs/strategy/market-analysis.md` | market-analyst | `/analyze-market` |
| `docs/strategy/competitive-landscape.md` | market-analyst | `/competitive-map` |
| `docs/strategy/customer-segments.md` | market-analyst | `/analyze-market` |
| `docs/strategy/strategy-canvas.md` | strategy-architect | `/strategy-canvas` |
| `docs/strategy/brand-positioning.md` | strategy-architect | `/strategy-canvas` |
| `docs/strategy/business-model.md` | business-modeler | `/business-model` |
| `docs/strategy/gtm-plan.md` | gtm-planner | `/gtm-plan` |
| `docs/strategy/pricing-analysis.md` | gtm-planner | `/pricing-strategy` |
| `docs/strategy/growth-plan.md` | growth-strategist | `/growth-audit` |
| `docs/strategy/prioritized-initiatives.md` | growth-strategist | `/prioritize` |
| `docs/strategy/strategic-report.md` | report-compiler | `/strategy-report` |
| `docs/strategy/opportunity-map.md` | product-planner | `/product-plan` |
| `docs/strategy/features/*.md` | product-planner | `/product-plan` |
| `docs/strategy/product-roadmap.md` | product-planner | `/product-plan` |
| `docs/strategy/mvp-definition.md` | product-planner | `/product-plan` |

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

**CRITICAL**: Every file listed above MUST be created during a full /strategy-report run. The orchestrator must verify all 18+ files exist before proceeding to completion.

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
2. [domain-specific agent] → Execute analysis, write ALL files owned by that agent
3. No report compilation needed
```

## How to Call Strategy Agents

### Execution Method
Call agents using the Task tool:
- subagent_type: Agent name
- description: Concise task description (3-5 words)
- prompt: Specific instructions with prior context

### Call Pattern

```yaml
# Step 1
subagent_type: context-analyzer
prompt: |
  Analyze this business/product/idea: [user input]
  Extract business context and analysis goals.
  Write to: docs/strategy/context-brief.md

# Step 2
subagent_type: product-analyst
prompt: |
  Perform complete AJTBD analysis based on docs/strategy/context-brief.md.
  Read methodology from: ${CLAUDE_PLUGIN_ROOT}/skills/ajtbd-methodology/references/
  You MUST produce THREE separate files:
  1. docs/strategy/rat.md — Top 5 risky assumptions with P×I scoring, validation methods
  2. docs/strategy/segments.md — 5 most attractive segments (B2B or B2C based on context-brief) with Core Jobs, Big Job, criteria, TAM/SAM/SOM
  3. docs/strategy/jobs-graph.md — Jobs graph below Core Job level for the primary segment
  All three files are mandatory.

# Step 3
subagent_type: market-analyst
prompt: |
  Perform COMPLETE market intelligence for the business in docs/strategy/context-brief.md.
  Read AJTBD analysis from docs/strategy/rat.md, docs/strategy/segments.md, docs/strategy/jobs-graph.md to inform segmentation and competitive analysis.
  You MUST produce THREE separate files:
  1. docs/strategy/market-analysis.md — TAM/SAM/SOM (hybrid methodology), industry trends, PESTLE, market growth
  2. docs/strategy/competitive-landscape.md — Detailed competitor profiles, Porter's Five Forces, perceptual maps, SWOT with TOWS
  3. docs/strategy/customer-segments.md — Behavioral, psychographic, value-based segmentation with attractiveness scoring
  All three files are mandatory.

# Step 4 (parallel)
subagent_type: strategy-architect
prompt: |
  Create COMPLETE strategic analysis based on:
  - docs/strategy/context-brief.md
  - docs/strategy/rat.md
  - docs/strategy/segments.md
  - docs/strategy/jobs-graph.md
  - docs/strategy/market-analysis.md
  - docs/strategy/competitive-landscape.md
  - docs/strategy/customer-segments.md
  You MUST produce TWO separate files:
  1. docs/strategy/strategy-canvas.md — Blue Ocean Strategy Canvas, Four Actions, Six Paths, Ansoff/BCG growth direction, Value Proposition Canvas
  2. docs/strategy/brand-positioning.md — Perceptual maps on two axes, positioning statement, positioning strategy (Leader/Creator/Challenger/Niche/Value), competitive moat assessment
  Both files are mandatory.

subagent_type: business-modeler
prompt: |
  Create business model analysis based on:
  - docs/strategy/context-brief.md
  - docs/strategy/rat.md
  - docs/strategy/segments.md
  - docs/strategy/market-analysis.md
  - docs/strategy/customer-segments.md
  Write to: docs/strategy/business-model.md
  Include: Lean Canvas or BMC (based on stage), revenue model, unit economics (LTV, CAC, payback, margins), innovation accounting, assumption risk register, 12-month and 36-month scenarios.

# Step 5 (parallel)
subagent_type: gtm-planner
prompt: |
  Create COMPLETE go-to-market strategy based on all docs in docs/strategy/.
  You MUST produce TWO separate files:
  1. docs/strategy/gtm-plan.md — ICP, messaging matrix (positioning + per-segment), GTM motion selection, channel strategy (primary 60%/secondary 30%/experimental 10%), partnership strategy (types + top 5 targets), content strategy (pillars + calendar), phased launch plan
  2. docs/strategy/pricing-analysis.md — Value-based pricing (economic value calculation, 10:1 rule check), tier structure design (Starter/Pro/Enterprise), competitive pricing position, projected unit economics impact
  Both files are mandatory.

subagent_type: growth-strategist
prompt: |
  Create COMPLETE growth strategy based on all docs in docs/strategy/.
  You MUST produce TWO separate files:
  1. docs/strategy/growth-plan.md — AARRR funnel audit (each stage scored vs benchmarks), North Star metric definition, growth motion assessment (PLG/Sales-Led/CLG/Hybrid), 10-15 ICE-scored experiments, growth accounting (Quick Ratio), 90-day sprint plan
  2. docs/strategy/prioritized-initiatives.md — Collect ALL recommended actions and initiatives from ALL prior docs (context-brief, rat, segments, jobs-graph, market-analysis, competitive-landscape, strategy-canvas, brand-positioning, business-model). Score each using ICE AND RICE frameworks. Produce a single prioritized master list with: do now / do next / defer / kill recommendations.
  Both files are mandatory.

# Step 6
subagent_type: report-compiler
prompt: |
  Read ALL 14 strategy documents in docs/strategy/ directory.
  Compile into a unified McKinsey-grade strategic report.
  Write to: docs/strategy/strategic-report.md
  Follow Pyramid Principle, MECE, action titles.
  Include: Go/No-Go recommendation, executive summary, aggregated risk assessment, unified action plan, and references to all 14 source documents.
  Verify all 14 source files exist before compiling.

# Step 7
subagent_type: product-planner
prompt: |
  Read ALL strategy documents in docs/strategy/.
  Create complete product execution plan:
  1. docs/strategy/opportunity-map.md — Opportunity Solution Tree
  2. docs/strategy/features/feature-NNN-[slug].md — Individual feature specs (separate files)
  3. docs/strategy/product-roadmap.md — Now/Next/Later roadmap with links
  4. docs/strategy/mvp-definition.md — MVP scope with MoSCoW
  All files mandatory. Each feature = separate file.
```

### Parallel Execution Rules

Agents that can run in parallel:
- **strategy-architect + business-modeler** (both depend on market-analyst, independent of each other)
- **gtm-planner + growth-strategist** (both depend on strategy + model, independent of each other)

Agents that MUST be sequential:
- context-analyzer → product-analyst (AJTBD needs context)
- product-analyst → market-analyst (market needs AJTBD insights)
- market-analyst → strategy-architect/business-modeler (strategy needs market data)
- strategy/model → gtm/growth (GTM needs strategic direction)
- All agents → report-compiler (needs all outputs)

## Information Bridging

The orchestrator's key responsibility is passing context between agents. Each agent reads the files listed below:

| From Agent | Files Produced | Read By |
|-----------|---------------|---------|
| context-analyzer | `context-brief.md` | ALL subsequent agents |
| product-analyst | `rat.md`, `segments.md`, `jobs-graph.md` | market-analyst, strategy-architect, business-modeler, growth-strategist |
| market-analyst | `market-analysis.md`, `competitive-landscape.md`, `customer-segments.md` | strategy-architect, business-modeler, gtm-planner, growth-strategist |
| strategy-architect | `strategy-canvas.md`, `brand-positioning.md` | gtm-planner, growth-strategist |
| business-modeler | `business-model.md` | gtm-planner, growth-strategist |
| gtm-planner | `gtm-plan.md`, `pricing-analysis.md` | growth-strategist (for prioritization), report-compiler |
| growth-strategist | `growth-plan.md`, `prioritized-initiatives.md` | report-compiler |
| report-compiler | `strategic-report.md` | User (final deliverable) |
| All prior agents | all 15 docs | product-planner |
| product-planner | opportunity-map.md, features/*.md, product-roadmap.md, mvp-definition.md | report-compiler |

**CRITICAL**: growth-strategist for `prioritized-initiatives.md` must read ALL prior docs to collect every recommended action and score them.

## Structured Response Format

Each agent returns JSON. Key fields:

```json
{
  "status": "completed|blocked|needs_input",
  "summary": "One-line executive summary",
  "confidence": "high|medium|low",
  "sourceTier": "Primary data tier used",
  "outputFile": "docs/strategy/[file].md",
  "keyFindings": ["finding1", "finding2", "finding3"],
  "questions": ["question for user if any"],
  "nextSteps": ["recommended next actions"]
}
```

## Constraints

- **Pyramid Principle mandatory**: Every section leads with conclusion
- **MECE mandatory**: All categorizations must be MECE
- **Source tiers mandatory**: All data points tagged with credibility tier
- **No guessing numbers**: If market data unavailable, state "Data unavailable — Tier 3 estimate: [range]"
- **Structured JSON output**: All agents return structured responses
- **File ownership**: Only owner agent writes to its file
- **Stop points honored**: Orchestrator MUST stop and wait at every defined stop point
