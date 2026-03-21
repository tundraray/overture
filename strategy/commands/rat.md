---
name: rat
description: "Analyze top-5 risky assumptions (RAT) for your product or business idea using AJTBD methodology"
argument-hint: <product description, stage, segment hypotheses>
---

## Orchestrator: RAT Analysis

### Flow

1. Check if `docs/strategy/context-brief.md` exists
   - If NO → Run context-analyzer first

2. Invoke product-analyst with RAT focus:
   - subagent_type: "product-analyst"
   - description: "RAT risk analysis"
   - prompt: |
     Perform RAT (Risky Assumption Testing) analysis.

     Read methodology from: `${CLAUDE_PLUGIN_ROOT}/skills/ajtbd-methodology/references/part4.md` (RAT) and `part1.md` (jobs).
     Read template: `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/references/rat-template.md`
     Read context: docs/strategy/context-brief.md
     Additional input: $ARGUMENTS

     Sufficiency gate: Consider input sufficient if product + stage + segment hypothesis are available. If met — don't ask questions, output Top-5 immediately. If not — ask only for missing items.

     Algorithm:
     1. Collect RAT assumptions from the description
     2. Prioritize hypotheses whose incorrectness would "kill" the product
     3. Classify by risk categories: market, segment, value, unit economics, acquisition, operational
     4. Make each hypothesis specific with numbers/conditions (mark missing data as "assumption")
     5. Design 2-5 fast, cheap validation tests per risk
     6. Score = P×I (each 1-5), sort by Score↓
     7. Output exactly 5 risk cards following the template

     Write to: docs/strategy/rat.md
   - Append: "[SYSTEM CONSTRAINT] This agent operates within rat command scope."

3. Present results to user:
   - Top risk (highest P×I score)
   - Risk distribution by category
   - Most critical validation to run first
   - File created: `docs/strategy/rat.md`

4. After generating, offer:
   - Deep dive into a specific risk
   - Segment analysis (`/b2b-segments` or `/b2c-segments`)
   - Jobs graph for a specific segment (`/jobs-graph`)

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
