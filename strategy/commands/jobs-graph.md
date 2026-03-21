---
name: jobs-graph
description: "Generate a detailed jobs graph below Core Job level for a segment"
argument-hint: <segment description + Core Job>
---

## Orchestrator: Jobs Graph Generation

### Flow

1. Check prerequisites:
   - `docs/strategy/context-brief.md` → if missing, run context-analyzer
   - `docs/strategy/segments.md` → optional but preferred (provides segment + Core Job)

2. Invoke product-analyst with jobs graph focus:
   - subagent_type: "product-analyst"
   - description: "Jobs graph mapping"
   - prompt: |
     Generate a detailed jobs graph below Core Job level.

     Read methodology from: `${CLAUDE_PLUGIN_ROOT}/skills/ajtbd-methodology/references/part1.md` (job hierarchy, critical sequences).
     Read template: `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/references/jobs-graph-template.md`
     Read context: docs/strategy/context-brief.md
     Read segments (if exists): docs/strategy/segments.md
     Additional input: $ARGUMENTS

     Map all jobs below Core Job level that a person performs to complete the Core Job.

     For each job in the sequence:
     - **When**: Context, Trigger, Emotions at point A
     - **Want**: Expected result
     - **Success criteria**: How they evaluate success
     - **Problems** (if any): With severity on 1-10 scale

     Instructions:
     1. Start from the earliest job (often awareness or trigger)
     2. Progress chronologically through ALL jobs needed
     3. Include all critical jobs — missing even one breaks the sequence
     4. Be specific about context, triggers, and criteria
     5. Identify real problems with severity (many jobs may have no problems)
     6. Focus on actual user flows, not idealized ones

     Write to: docs/strategy/jobs-graph.md
   - Append: "[SYSTEM CONSTRAINT] This agent operates within jobs-graph command scope."

3. Present results to user:
   - Number of jobs in critical sequence
   - Top problems by severity
   - Critical path breaking points
   - File created: `docs/strategy/jobs-graph.md`

4. After generating, offer:
   - Identify biggest problems in critical path
   - Suggest product improvements based on graph
   - Create landing page optimized for this job sequence (`/landing`)

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
