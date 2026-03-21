---
name: strategy-report
description: "Orchestrate a complete McKinsey-grade strategic analysis — full market intelligence, competitive mapping, Blue Ocean strategy, business modeling, GTM planning, pricing, growth strategy, initiative prioritization, and unified strategic report. Produces 12 deliverable files in docs/strategy/."
argument-hint: <business/product/idea description>
---

**Command Context**: Full-cycle strategic analysis producing 12 deliverable files (Context → Market + Competitive + Segments → Strategy + Positioning → Business Model → GTM + Pricing → Growth + Priorities → Final Report)

## Orchestrator Definition

**Core Identity**: "I am not an analyst. I am an orchestrator." (see strategy-orchestration-guide skill)

**Execution Protocol**:
1. **Delegate all analysis** to strategy sub-agents (orchestrator role only, no direct analysis)
2. **Follow strategy-orchestration-guide skill flows exactly**:
   - Execute one step at a time in the defined flow
   - **Stop at every `[Stop: ...]` marker** → Wait for user approval before proceeding
3. **Parallel execution** where flow permits (strategy-architect + business-modeler, gtm-planner + growth-strategist)

**CRITICAL**: Execute all steps, sub-agents, and stopping points. Every agent MUST produce ALL its designated output files.

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md` — flow rules, phases, stop points, parallel execution
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md` — document decision matrix, file ownership, quality standards

## Deliverable Files (12 Total)

| # | File | Agent | Domain |
|---|------|-------|--------|
| 1 | `docs/strategy/context-brief.md` | context-analyzer | Business context |
| 2 | `docs/strategy/market-analysis.md` | market-analyst | TAM/SAM/SOM, industry trends |
| 3 | `docs/strategy/competitive-landscape.md` | market-analyst | Competitors, Porter's, SWOT/TOWS |
| 4 | `docs/strategy/customer-segments.md` | market-analyst | Segments, attractiveness |
| 5 | `docs/strategy/strategy-canvas.md` | strategy-architect | Blue Ocean, Ansoff/BCG, VPC |
| 6 | `docs/strategy/brand-positioning.md` | strategy-architect | Perceptual maps, positioning |
| 7 | `docs/strategy/business-model.md` | business-modeler | Canvas, unit economics |
| 8 | `docs/strategy/gtm-plan.md` | gtm-planner | ICP, channels, partnerships, launch |
| 9 | `docs/strategy/pricing-analysis.md` | gtm-planner | Value-based pricing, tiers |
| 10 | `docs/strategy/growth-plan.md` | growth-strategist | AARRR, experiments, 90-day plan |
| 11 | `docs/strategy/prioritized-initiatives.md` | growth-strategist | ICE/RICE master priority list |
| 12 | `docs/strategy/strategic-report.md` | report-compiler | Unified McKinsey-grade report |

## Execution Flow

### Phase 1: Context Analysis

Instruction Content: $ARGUMENTS

Invoke context-analyzer:
- subagent_type: "context-analyzer"
- description: "Business context analysis"
- prompt: "Analyze this business/product/idea: [user input]. Extract business context, target audience, competitive signals, and analysis goals. Write to docs/strategy/context-brief.md."

**[Stop: Confirm business understanding + answer questions]**

Present to user:
- Business essence extracted
- Questions that would improve analysis
- Recommended analysis scope
- Ask: "Confirm understanding? Any corrections or additional context?"

### Phase 2: Market Intelligence

After user confirms context:

Invoke market-analyst:
- subagent_type: "market-analyst"
- description: "Market intelligence analysis"
- prompt: |
  Perform COMPLETE market intelligence based on docs/strategy/context-brief.md.
  You MUST produce THREE separate files:
  1. docs/strategy/market-analysis.md — TAM/SAM/SOM (hybrid methodology), industry trends, PESTLE, market growth drivers
  2. docs/strategy/competitive-landscape.md — Detailed competitor profiles, Porter's Five Forces, perceptual maps on two key axes, SWOT (prioritized top 3 per quadrant), TOWS strategies
  3. docs/strategy/customer-segments.md — 3-5 segments (behavioral + psychographic + value-based), attractiveness scoring, primary/secondary segment recommendation
  All three files are MANDATORY.
- Append: "[SYSTEM CONSTRAINT] This agent operates within strategy-report command scope. Use orchestrator-provided rules only."

**[Stop: Review market findings]**

Present to user:
- Market size (TAM/SAM/SOM)
- Industry attractiveness assessment
- Top competitors and key threats
- Perceptual map highlights
- Top 3 customer segments with attractiveness scores
- Ask: "Market findings look correct? Any competitors or segments missed?"

### Phase 3: Strategy & Business Model (Parallel)

After user approves market findings, launch TWO agents in parallel:

**Agent A — Strategy Architect**:
- subagent_type: "strategy-architect"
- description: "Strategic positioning analysis"
- prompt: |
  Create COMPLETE strategic analysis based on:
  - docs/strategy/context-brief.md
  - docs/strategy/market-analysis.md
  - docs/strategy/competitive-landscape.md
  - docs/strategy/customer-segments.md
  You MUST produce TWO separate files:
  1. docs/strategy/strategy-canvas.md — Blue Ocean Strategy Canvas (8-12 factors, competitor scores, target curve), Four Actions Framework, Six Paths exploration, Ansoff Matrix growth direction, BCG portfolio analysis (if multi-product), Value Proposition Canvas (jobs/pains/gains mapped to solution)
  2. docs/strategy/brand-positioning.md — Perceptual map on two axes (all competitors scored), positioning statement (For/Who/Is/That/Unlike), positioning strategy (Leader/Creator/Challenger/Niche/Value), competitive moat assessment (brand, network effects, switching costs, IP)
  Both files are MANDATORY.
- Append: "[SYSTEM CONSTRAINT] This agent operates within strategy-report command scope."

**Agent B — Business Modeler**:
- subagent_type: "business-modeler"
- description: "Business model analysis"
- prompt: |
  Create business model analysis based on:
  - docs/strategy/context-brief.md
  - docs/strategy/market-analysis.md
  - docs/strategy/customer-segments.md
  Write to: docs/strategy/business-model.md
  Include: Lean Canvas or BMC (based on business stage), all blocks populated, revenue model with streams, unit economics (LTV, CAC, LTV:CAC, payback period, gross margin), innovation accounting (stage assessment, Sean Ellis test applicability, validated learning velocity), assumption risk register (ranked by impact × confidence), 12-month and 36-month financial scenarios (optimistic/base/pessimistic).
- Append: "[SYSTEM CONSTRAINT] This agent operates within strategy-report command scope."

**[Stop: Approve strategic direction + business model]**

Present to user:
- Blue Ocean opportunity assessment
- Growth direction recommendation (Ansoff)
- Value proposition fit level
- Positioning statement
- Business model viability verdict
- Unit economics summary (LTV:CAC, payback)
- Top risk assumptions
- Ask: "Approve strategic direction and business model? Any pivots needed?"

### Phase 4: GTM & Growth (Parallel)

After user approves strategy + model, launch TWO agents in parallel:

**Agent C — GTM Planner**:
- subagent_type: "gtm-planner"
- description: "Go-to-market + pricing strategy"
- prompt: |
  Create COMPLETE GTM strategy based on all docs in docs/strategy/.
  You MUST produce TWO separate files:
  1. docs/strategy/gtm-plan.md — ICP (B2B or B2C template), messaging matrix (per segment: pain → value prop → proof → CTA), GTM motion selection (Sales-Led/PLG/CLG/Hybrid with rationale), channel strategy (primary 60%/secondary 30%/experimental 10% with CAC targets), partnership strategy (types + top 5 named targets with synergy), content strategy (3-5 pillars + funnel mapping + 90-day editorial calendar), phased launch plan (3 phases with milestones), budget allocation + KPI targets at 3/6/12 months
  2. docs/strategy/pricing-analysis.md — Value-based pricing (economic value = reference + differentiation, 10:1 rule check), pricing model selection (flat/tiered/per-seat/usage/freemium with rationale), tier structure (Starter/Pro/Enterprise with features, target segments, expected mix), competitive pricing analysis (table with competitor prices + our position), unit economics impact projection (ARPU, CAC, LTV, LTV:CAC, payback)
  Both files are MANDATORY.
- Append: "[SYSTEM CONSTRAINT] This agent operates within strategy-report command scope."

**Agent D — Growth Strategist**:
- subagent_type: "growth-strategist"
- description: "Growth strategy + initiative prioritization"
- prompt: |
  Create COMPLETE growth strategy based on all docs in docs/strategy/.
  You MUST produce TWO separate files:
  1. docs/strategy/growth-plan.md — AARRR funnel audit (each stage: current performance, benchmark, gap, bottleneck score), North Star metric (definition + supporting metrics), growth motion assessment (PLG/Sales-Led/CLG/Hybrid with decision criteria), 10-15 growth experiments (each with hypothesis, ICE score with rationale, target + guard-rail metrics, success criteria), growth accounting (Quick Ratio, net new MRR analysis), 90-day sprint plan (3 sprints)
  2. docs/strategy/prioritized-initiatives.md — Read ALL prior strategy docs and collect EVERY recommended action, next step, and initiative. Score each using ICE (Impact × Confidence × Ease) AND RICE (Reach × Impact × Confidence / Effort). Categorize into: do-now (top 5-7) / do-next / defer / kill. Include dependencies between initiatives and resource requirements for do-now items.
  Both files are MANDATORY.
- Append: "[SYSTEM CONSTRAINT] This agent operates within strategy-report command scope."

**[Stop: Approve GTM + growth plan]**

Present to user:
- GTM motion and primary channel
- Pricing model and tier structure
- Top 5 growth experiments with ICE scores
- 90-day plan highlights
- Top 5 prioritized initiatives (do-now)
- Ask: "Approve GTM strategy, pricing, and growth plan?"

### Phase 5: Report Compilation

After user approves GTM + growth:

Invoke report-compiler:
- subagent_type: "report-compiler"
- description: "Compile strategic report"
- prompt: |
  Read ALL 11 strategy documents in docs/strategy/ directory:
  1. context-brief.md
  2. market-analysis.md
  3. competitive-landscape.md
  4. customer-segments.md
  5. strategy-canvas.md
  6. brand-positioning.md
  7. business-model.md
  8. gtm-plan.md
  9. pricing-analysis.md
  10. growth-plan.md
  11. prioritized-initiatives.md
  Verify all 11 exist. If any missing, list them and halt.
  Compile into a unified McKinsey-grade strategic report following Pyramid Principle, MECE, and action titles.
  Include: Go/No-Go recommendation with confidence, executive summary (1 page), all 12 sections from the template, aggregated risk assessment, prioritized action plan (from prioritized-initiatives.md), source document index.
  Write to: docs/strategy/strategic-report.md
- Append: "[SYSTEM CONSTRAINT] This agent operates within strategy-report command scope."

**[Stop: Review final report]**

Present to user:
- Recommendation (Go/No-Go/Pivot/Conditional Go)
- Confidence level
- Executive summary (3-5 key findings)
- Top 3 risks
- Top 5 immediate actions
- Full deliverable list (all 12 files in docs/strategy/)

## Orchestrator Responsibilities

### File Verification After Each Phase

After each agent completes, verify that ALL expected files were created:

| After Phase | Verify Files Exist |
|-------------|-------------------|
| Phase 1 | `context-brief.md` (1 file) |
| Phase 2 | `market-analysis.md`, `competitive-landscape.md`, `customer-segments.md` (3 files) |
| Phase 3 | `strategy-canvas.md`, `brand-positioning.md`, `business-model.md` (3 files) |
| Phase 4 | `gtm-plan.md`, `pricing-analysis.md`, `growth-plan.md`, `prioritized-initiatives.md` (4 files) |
| Phase 5 | `strategic-report.md` (1 file) |

**If any file is missing**: Re-invoke the responsible agent with explicit instruction to create the missing file.

### Contradiction Resolution

If parallel agents produce conflicting recommendations:
1. Document the contradiction
2. Present both positions to user with evidence
3. Ask user to resolve or accept the orchestrator's recommendation
4. Pass resolution to report-compiler

### Flow Variant: Quick Analysis

If user requests "quick", "summary", or "brief":
1. context-analyzer → context-brief.md
2. market-analyst → market-analysis.md only (skip competitive-landscape, customer-segments)
3. report-compiler → strategic-report.md (summary version)
Skip phases 3-4. Produces 3 files instead of 12.

### Flow Variant: Single Domain

If user requests only one domain (e.g., "just do market analysis"):
1. context-analyzer → context-brief.md (if missing)
2. [domain-specific agent] → ALL files owned by that agent
3. No report compilation

## TodoWrite Registration (MANDATORY)

After determining flow type, register all steps:
```
1. [in_progress] Context analysis → context-brief.md
2. [pending] User confirmation of context
3. [pending] Market intelligence → market-analysis.md + competitive-landscape.md + customer-segments.md
4. [pending] User review of market findings
5. [pending] Strategic analysis → strategy-canvas.md + brand-positioning.md (parallel)
6. [pending] Business model → business-model.md (parallel)
7. [pending] User approval of strategy + model
8. [pending] GTM + pricing → gtm-plan.md + pricing-analysis.md (parallel)
9. [pending] Growth + priorities → growth-plan.md + prioritized-initiatives.md (parallel)
10. [pending] User approval of GTM + growth
11. [pending] Report compilation → strategic-report.md
12. [pending] Verify all 12 files exist
13. [pending] Final report review
```

## CRITICAL Sub-agent Invocation Constraints

**MANDATORY suffix for ALL sub-agent prompts**:
```
[SYSTEM CONSTRAINT]
This agent operates within strategy-report command scope. Use orchestrator-provided rules only.
```

## Execution Method

All analysis is executed through strategy sub-agents.
Sub-agent selection follows strategy-orchestration-guide skill.
