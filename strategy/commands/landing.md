---
name: landing
description: "Generate a landing page text for a specific segment using AJTBD job-focused structure"
argument-hint: <segment description with jobs + product description>
---

## Orchestrator: Landing Page Generation

### Flow

1. Check prerequisites:
   - `docs/strategy/context-brief.md` → if missing, run context-analyzer
   - `docs/strategy/segments.md` → required (provides segment + jobs + criteria)
   - `docs/strategy/jobs-graph.md` → optional but enhances quality

2. Invoke product-analyst with landing page focus:
   - subagent_type: "product-analyst"
   - description: "AJTBD landing page"
   - prompt: |
     Generate a landing page text using AJTBD structure.

     Read methodology from: `${CLAUDE_PLUGIN_ROOT}/skills/ajtbd-methodology/references/part1.md` (job structure).
     Read context: docs/strategy/context-brief.md
     Read segments: docs/strategy/segments.md
     Read jobs graph (if exists): docs/strategy/jobs-graph.md
     Additional input: $ARGUMENTS

     Follow this 10-section structure:

     1. **Oneliner**: [What] + [Core Job] + [value]
     2. **Core Value Proposition**: [Core Job] + [value] + [how via features] + Key Micro Jobs
     3. **Aha-Moment Section**: Allow experiencing the easiest first Micro Job
     4. **Value Communication**: Value for each job
     5. **Recognition Section**: "Do you recognize yourself?" — Big Jobs, Triggers, Emotions at A, Problems at A
     6. **How It Works**: Micro Jobs + Value received for each
     7. **Point B Vision — Emotions**: How you'll feel after
     8. **Point B Vision — Outcomes**: What you'll achieve (Big Jobs completed)
     9. **Barrier Reduction**: Obstacles and how we remove them
     10. **Fire Competitors**: Why switch from alternatives

     Rules:
     - Job-focused, not feature-focused copy
     - Use emotional language for Big Jobs
     - Be specific about value delivery
     - Use language from segment analysis

     Write to: docs/strategy/landing.md
   - Append: "[SYSTEM CONSTRAINT] This agent operates within landing command scope."

3. Present results to user:
   - Landing page summary (oneliner + core value prop)
   - File created: `docs/strategy/landing.md`

4. After generating, offer:
   - Refine specific sections
   - Create variations for A/B testing
   - Adapt for different channels (email, ads)

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
