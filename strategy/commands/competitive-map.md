---
name: competitive-map
description: "Create competitive perceptual maps, detailed competitor profiles, Porter's Five Forces, and SWOT/TOWS analysis"
argument-hint: <business/product and competitors to analyze>
---

## Orchestrator: Competitive Mapping

### Flow

1. Check prerequisites:
   - `docs/strategy/context-brief.md` → if missing, run context-analyzer

2. Invoke market-analyst with competitive focus:
   - subagent_type: "market-analyst"
   - description: "Competitive landscape analysis"
   - prompt: |
     Focus on DEEP competitive analysis for the business described in docs/strategy/context-brief.md.
     Additional context: $ARGUMENTS
     Create detailed competitor profiles for ALL direct and indirect competitors.
     Include Porter's Five Forces, perceptual maps on two strategically relevant axes, prioritized SWOT (top 3 per quadrant), and TOWS strategic actions.
     Write to: docs/strategy/competitive-landscape.md
     If docs/strategy/market-analysis.md doesn't exist, also create it with market sizing context.
   - Append: "[SYSTEM CONSTRAINT] This agent operates within competitive-map command scope."

3. Present results to user:
   - Porter's Five Forces scores
   - Perceptual map (axes + competitor positions + white spaces)
   - Competitor profiles (top strengths/weaknesses)
   - TOWS strategic actions
   - File created: `docs/strategy/competitive-landscape.md`

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
