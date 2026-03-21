---
name: strategy-canvas
description: "Create Blue Ocean Strategy Canvas, growth direction analysis, value proposition, and brand positioning — produces 2 report files"
argument-hint: <business/product description>
---

## Orchestrator: Strategic Analysis

### Flow

1. Check prerequisites:
   - `docs/strategy/context-brief.md` → if missing, run context-analyzer
   - `docs/strategy/market-analysis.md` → if missing, run market-analyst (all 3 files)

2. Invoke strategy-architect:
   - subagent_type: "strategy-architect"
   - description: "Strategic positioning analysis"
   - prompt: |
     Create COMPLETE strategic analysis based on all available docs in docs/strategy/.
     You MUST produce TWO separate files:
     1. docs/strategy/strategy-canvas.md — Blue Ocean Strategy Canvas, Four Actions, Six Paths, Ansoff/BCG, Value Proposition Canvas
     2. docs/strategy/brand-positioning.md — Perceptual maps, positioning statement, positioning strategy, competitive moat assessment
     Both files are MANDATORY.
   - Append: "[SYSTEM CONSTRAINT] This agent operates within strategy-canvas command scope."

3. Verify both files created.

4. Present results to user:
   - Blue Ocean opportunity
   - Four Actions recommendations
   - Growth direction (Ansoff)
   - Positioning statement + strategy
   - Files created: `docs/strategy/strategy-canvas.md`, `docs/strategy/brand-positioning.md`

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
