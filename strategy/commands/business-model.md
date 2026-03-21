---
name: business-model
description: "Create a Business Model Canvas or Lean Canvas with unit economics, innovation accounting, and financial scenarios"
argument-hint: <business/product description>
---

## Orchestrator: Business Model Analysis

### Flow

1. Check prerequisites:
   - `docs/strategy/context-brief.md` → if missing, run context-analyzer
   - `docs/strategy/market-analysis.md` → optional but preferred

2. Invoke business-modeler:
   - subagent_type: "business-modeler"
   - description: "Business model analysis"
   - prompt: |
     Create COMPREHENSIVE business model analysis based on all available docs in docs/strategy/.
     Build appropriate canvas (Lean Canvas for idea/MVP stage, BMC for growth/mature stage).
     Include: All canvas blocks populated, revenue model with streams, unit economics (LTV, CAC, LTV:CAC, payback, gross margin), innovation accounting (stage assessment, Sean Ellis test, validated learning velocity), assumption risk register (ranked by impact × confidence), 12-month and 36-month scenarios (optimistic/base/pessimistic).
     Write to: docs/strategy/business-model.md
   - Append: "[SYSTEM CONSTRAINT] This agent operates within business-model command scope."

3. Present results to user:
   - Canvas type selected and summary
   - Revenue model
   - Unit economics (LTV:CAC, payback)
   - PMF assessment
   - Top risk assumptions with test methods
   - Financial scenario highlights
   - File created: `docs/strategy/business-model.md`

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
