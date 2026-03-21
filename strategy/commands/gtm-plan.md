---
name: gtm-plan
description: "Create Go-to-Market strategy with ICP, messaging, channels, partnerships, content strategy, and launch plan — produces 2 report files"
argument-hint: <business/product description>
---

## Orchestrator: GTM Strategy

### Flow

1. Check prerequisites:
   - `docs/strategy/context-brief.md` → if missing, run context-analyzer
   - `docs/strategy/market-analysis.md` → if missing, run market-analyst
   - `docs/strategy/strategy-canvas.md` → optional but preferred
   - `docs/strategy/business-model.md` → optional but preferred

2. Invoke gtm-planner:
   - subagent_type: "gtm-planner"
   - description: "Go-to-market + pricing strategy"
   - prompt: |
     Create COMPLETE GTM strategy based on all available docs in docs/strategy/.
     You MUST produce TWO separate files:
     1. docs/strategy/gtm-plan.md — ICP, messaging matrix, GTM motion, channel strategy (primary/secondary/experimental), partnership strategy (types + top 5 targets), content strategy (pillars + calendar), phased launch plan, budget + KPIs
     2. docs/strategy/pricing-analysis.md — Value-based pricing (economic value, 10:1 rule), pricing model selection, tier structure (Starter/Pro/Enterprise), competitive pricing analysis, unit economics projection
     Both files are MANDATORY.
   - Append: "[SYSTEM CONSTRAINT] This agent operates within gtm-plan command scope."

3. Verify both files created.

4. Present results to user:
   - ICP summary
   - GTM motion + primary channel
   - Pricing model + tier structure
   - Launch timeline
   - Files created: `docs/strategy/gtm-plan.md`, `docs/strategy/pricing-analysis.md`

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
