---
name: analyze-market
description: "Perform market sizing (TAM/SAM/SOM), competitive analysis, and customer segmentation — produces 3 report files"
argument-hint: <business/product description>
---

## Orchestrator: Market Analysis

### Flow

1. Check if `docs/strategy/context-brief.md` exists
   - If NO → Run context-analyzer first, then market-analyst
   - If YES → Run market-analyst directly

2. Invoke context-analyzer (if needed):
   - subagent_type: "context-analyzer"
   - prompt: "Analyze this business: $ARGUMENTS. Write to docs/strategy/context-brief.md."

3. Invoke market-analyst:
   - subagent_type: "market-analyst"
   - description: "Market intelligence analysis"
   - prompt: |
     Perform COMPLETE market intelligence based on docs/strategy/context-brief.md.
     You MUST produce THREE separate files:
     1. docs/strategy/market-analysis.md — TAM/SAM/SOM (hybrid methodology), industry trends, PESTLE, market growth
     2. docs/strategy/competitive-landscape.md — Competitor profiles, Porter's Five Forces, perceptual maps, SWOT/TOWS
     3. docs/strategy/customer-segments.md — Behavioral, psychographic, value-based segmentation with attractiveness scoring
     All three files are MANDATORY.
   - Append: "[SYSTEM CONSTRAINT] This agent operates within analyze-market command scope."

4. Verify all 3 files created. If any missing, re-invoke market-analyst for missing file.

5. Present results to user:
   - Market size summary (TAM/SAM/SOM)
   - Industry attractiveness
   - Top competitors + perceptual map
   - Prioritized segments
   - Files created: `docs/strategy/market-analysis.md`, `docs/strategy/competitive-landscape.md`, `docs/strategy/customer-segments.md`

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
