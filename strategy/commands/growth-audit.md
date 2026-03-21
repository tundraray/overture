---
name: growth-audit
description: "Perform AARRR funnel audit, design growth experiments with ICE/RICE scoring, and create prioritized initiative list — produces 2 report files"
argument-hint: <business/product description>
---

## Orchestrator: Growth Strategy

### Flow

1. Check prerequisites:
   - `docs/strategy/context-brief.md` → if missing, run context-analyzer
   - `docs/strategy/market-analysis.md` → optional but preferred
   - `docs/strategy/business-model.md` → optional but preferred

2. Invoke growth-strategist:
   - subagent_type: "growth-strategist"
   - description: "Growth audit + initiative prioritization"
   - prompt: |
     Create COMPLETE growth strategy based on all available docs in docs/strategy/.
     You MUST produce TWO separate files:
     1. docs/strategy/growth-plan.md — AARRR funnel audit (each stage scored vs benchmarks), North Star metric, growth motion assessment (PLG/Sales-Led/CLG/Hybrid), 10-15 ICE-scored experiments, growth accounting, 90-day sprint plan
     2. docs/strategy/prioritized-initiatives.md — Read ALL prior strategy docs, collect every recommended action and initiative, score with ICE + RICE, categorize into do-now/do-next/defer/kill
     Both files are MANDATORY.
   - Append: "[SYSTEM CONSTRAINT] This agent operates within growth-audit command scope."

3. Verify both files created.

4. Present results to user:
   - Biggest funnel bottleneck
   - North Star metric
   - Top 5 experiments with ICE scores
   - Top 5 prioritized initiatives (do-now)
   - 90-day plan highlights
   - Files created: `docs/strategy/growth-plan.md`, `docs/strategy/prioritized-initiatives.md`

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
