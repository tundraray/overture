---
name: pricing-strategy
description: "Design a value-based pricing strategy with economic value calculation, tier structure, competitive pricing, and unit economics"
argument-hint: <product/service to price>
---

## Orchestrator: Pricing Strategy

### Flow

1. Check prerequisites:
   - `docs/strategy/context-brief.md` → if missing, run context-analyzer
   - `docs/strategy/market-analysis.md` → preferred for competitive pricing data
   - `docs/strategy/competitive-landscape.md` → preferred for competitor pricing

2. Invoke gtm-planner with pricing focus:
   - subagent_type: "gtm-planner"
   - description: "Pricing strategy deep-dive"
   - prompt: |
     Focus on COMPREHENSIVE pricing strategy for the business in docs/strategy/context-brief.md.
     Additional context: $ARGUMENTS
     Apply value-based pricing methodology:
     1. Calculate economic value (reference value + differentiation value)
     2. Apply 10:1 rule check
     3. Select pricing model (flat/tiered/per-seat/usage/freemium) with rationale
     4. Design tier structure (Starter/Pro/Enterprise) with features, target segments, expected mix
     5. Competitive pricing analysis table
     6. Unit economics projection (ARPU, CAC, LTV, LTV:CAC, payback period)
     7. Price sensitivity and risk assessment
     Write to: docs/strategy/pricing-analysis.md
   - Append: "[SYSTEM CONSTRAINT] This agent operates within pricing-strategy command scope. Focus exclusively on pricing analysis."

3. Present results to user:
   - Economic value assessment + 10:1 check result
   - Recommended pricing model
   - Tier structure with price points
   - Competitive position (premium/parity/discount)
   - Unit economics impact
   - File created: `docs/strategy/pricing-analysis.md`

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
