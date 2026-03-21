---
name: b2c-segments
description: "Generate 5 most attractive B2C segments using AJTBD job-based methodology"
argument-hint: <B2C product description>
---

## Orchestrator: B2C Segment Analysis

### Flow

1. Check if `docs/strategy/context-brief.md` exists
   - If NO → Run context-analyzer first

2. Invoke product-analyst with B2C segmentation focus:
   - subagent_type: "product-analyst"
   - description: "B2C segment discovery"
   - prompt: |
     Perform B2C segment analysis using AJTBD methodology.

     Read methodology from: `${CLAUDE_PLUGIN_ROOT}/skills/ajtbd-methodology/references/part2.md` (segmentation) and `part1.md` (job hierarchy).
     Read template: `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/references/segments-template.md`
     Read context: docs/strategy/context-brief.md
     Additional input: $ARGUMENTS

     Steps:
     1. Build 7-10 hypothetical B2C segments (don't output). Each segment:
        - United by 1-4 Core Jobs
        - Contains one Big Job (life goal, transition, ambition, state they strive for)
        - Differs by: context, customer role, performance criteria
        - A segment = people with similar job bundles and similar criteria (NOT demographics)
     2. Analyze each by: TAM/SAM/SOM, Customer Value, Profitability, Scalability (don't output)
     3. Output top 5 segments ranked by attractiveness

     Per segment output: Segment name, Core Jobs (When..want..), Performance Criteria, What kind of people, Big Job, TAM/SAM/SOM with calculation logic, Why attractive (1-2 paragraphs).

     Rules:
     - Output only step 3
     - Don't use "pain" — describe motivations, situations, criteria

     Write to: docs/strategy/segments.md
   - Append: "[SYSTEM CONSTRAINT] This agent operates within b2c-segments command scope."

3. Present results to user:
   - Top 5 segments ranked
   - Core Jobs for #1 segment
   - File created: `docs/strategy/segments.md`

4. After generating, offer:
   - Deep dive into a specific segment
   - Jobs graph for a segment (`/jobs-graph`)
   - Landing page for a segment (`/landing`)
   - RAT analysis for a segment (`/rat`)

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
