---
name: prioritize
description: "Score and prioritize initiatives using ICE/RICE frameworks with do-now/do-next/defer/kill categorization"
argument-hint: <list of initiatives to prioritize>
---

## Orchestrator: Initiative Prioritization

### Flow

1. Parse $ARGUMENTS to extract initiatives to prioritize.

2. Determine input source:
   - If specific initiatives provided → score those
   - If docs/strategy/ files exist → also collect actions from those documents

3. Invoke growth-strategist with prioritization focus:
   - subagent_type: "growth-strategist"
   - description: "Initiative prioritization"
   - prompt: |
     Score and prioritize initiatives using both ICE and RICE frameworks.

     User-provided initiatives:
     $ARGUMENTS

     Additionally, if docs/strategy/ contains existing analysis documents, read ALL of them and collect every recommended action and initiative found in those documents.

     For EACH initiative (user-provided + collected):
     1. Score ICE (Impact × Confidence × Ease, each 1-10) with per-dimension rationale
     2. Score RICE (Reach × Impact × Confidence / Effort) with per-dimension rationale
     3. Categorize: do-now / do-next / defer / kill

     Write to: docs/strategy/prioritized-initiatives.md

     Include:
     - Executive summary (top 5 priorities)
     - Full ranked table (ICE primary, RICE secondary)
     - Do Now section (top 5-7 with resource requirements)
     - Do Next, Defer, Kill sections
     - Dependencies between initiatives
   - Append: "[SYSTEM CONSTRAINT] This agent operates within prioritize command scope."

4. Present results to user:
   - Top 5 priorities (do-now) with ICE scores
   - Items recommended to kill (with reasoning)
   - Dependency map highlights
   - File created: `docs/strategy/prioritized-initiatives.md`

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
