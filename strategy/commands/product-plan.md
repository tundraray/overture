---
name: product-plan
description: "Convert strategy analysis into product plan — opportunity map, feature specifications, Now/Next/Later roadmap, and MVP definition with cross-references to all strategy docs"
argument-hint: <optional: focus area or constraints>
---

## Orchestrator: Product Execution Plan

### Prerequisites

Check that strategy analysis exists:
- `docs/strategy/strategic-report.md` OR `docs/strategy/prioritized-initiatives.md` must exist
- If NEITHER exists → inform user: "Run `/strategy-report` first to generate the strategy analysis, then run `/product-plan` to convert it into a product plan."
- If only `prioritized-initiatives.md` exists → proceed (sufficient for product planning)

### Flow

1. Invoke product-planner:
   - subagent_type: "product-planner"
   - description: "Product execution plan"
   - prompt: |
     Read ALL strategy documents in docs/strategy/.
     Read methodology from: ${CLAUDE_PLUGIN_ROOT}/skills/product-execution/references/
     Read templates from: ${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/references/

     Create the complete product execution plan:

     1. docs/strategy/opportunity-map.md — Opportunity Solution Tree: derive outcomes from strategy-canvas, opportunities from jobs-graph problems, solutions as feature ideas, assumption tests from RAT
     2. docs/strategy/features/feature-NNN-[slug].md — Individual feature specs in Shape Up pitch format. EACH feature is a SEPARATE FILE. Include cross-references table linking to jobs-graph, segments, rat, strategy-canvas, prioritized-initiatives. Score WSJF, assign Kano category, set appetite.
     3. docs/strategy/product-roadmap.md — Now/Next/Later roadmap. Each row LINKS to its feature spec file. Ranked by WSJF. Include Kano categorization, appetite, dependencies.
     4. docs/strategy/mvp-definition.md — MoSCoW categorization. Must-Have features LINK to spec files. Success metrics from growth-plan + business-model. Validation plan from rat.md. Kill criteria. Launch checklist.

     Additional context: $ARGUMENTS

     All files are MANDATORY. Every feature must be in a SEPARATE file with full cross-references.
   - Append: "[SYSTEM CONSTRAINT] This agent operates within product-plan command scope."

2. Verify outputs:
   - `docs/strategy/opportunity-map.md` exists
   - `docs/strategy/features/` directory has feature files
   - `docs/strategy/product-roadmap.md` exists with links to feature files
   - `docs/strategy/mvp-definition.md` exists with links to feature files

3. Present results to user:
   - Total features generated
   - MVP scope (Must-Have count + total appetite)
   - Top 3 features by WSJF
   - Now/Next/Later distribution
   - Key cross-references (which jobs → which features)
   - Files created: opportunity-map.md, features/*.md, product-roadmap.md, mvp-definition.md

## Required Skills
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-orchestration-guide/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/strategy-documentation-criteria/SKILL.md`
