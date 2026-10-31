---
name: front-design
description: Execute from requirement analysis to frontend design document creation
argument-hint: <feature description>
---

**Command Context**: This command is dedicated to the frontend design phase.

## Orchestrator Definition

**Role**: Orchestrator

**Execution Method**:
- Requirement analysis → performed by requirement-analyzer
- PRD (depth by scale) → performed by prd-creator
- UXRD and the design system (`docs/design-system/`) → performed by ux-designer
- UI fact gathering → performed by ui-analyzer, per part
- Design document creation → performed by technical-designer-frontend, per part
- Independent review → performed by document-reviewer, when the user asks for it at a stop
- Consistency verification → performed by design-sync, per part
- Test skeletons → performed by acceptance-test-generator, per part

Orchestrator invokes sub-agents and passes structured JSON between them.

Each author runs its own draft check before it returns. Each document **[STOP]** below runs as `workflow-orchestration`, "Explicit Stop Points", describes.

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-product/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-technical/SKILL.md`

## Scope Boundaries

**Included in this command**:
- Requirement analysis with requirement-analyzer
- PRD creation or update with prd-creator (`full` at large scale, `lite` otherwise), carrying the Delivery Parts
- UXRD creation with ux-designer, creating or extending `docs/design-system/` with it
- Design Doc creation with technical-designer-frontend, one per frontend part, after ui-analyzer fact gathering
- Consistency verification with design-sync; independent review with document-reviewer when the user asks for it
- ADR creation only when a decision the design made passes the three-part test in `documentation-criteria`
- Test skeleton generation with acceptance-test-generator, per part

**Responsibility Boundary**: This command completes with design document approval for every frontend part.

Requirements: $ARGUMENTS

## Execution Flow

### 1. Requirement Analysis Phase
**Think harder**: Considering the deep impact on design, first engage in dialogue to understand the background and purpose of requirements:
- What problems do you want to solve?
- Expected outcomes and success criteria
- Relationship with existing systems

Once requirements are moderately clarified:
- Invoke **requirement-analyzer** using Task tool
  - `subagent_type: "requirement-analyzer"`
  - `description: "Requirement analysis"`
  - `prompt: "Requirements: [user requirements] Execute requirement analysis and scale determination"`
- **[STOP]**: Review requirement analysis results and address question items

### 2. PRD and UXRD Phase
- Invoke **prd-creator** with `depth` from the scale (`full` at large, `lite` otherwise; `update` when a PRD already covers the feature), passing the `parts[]` proposal
- **[STOP]**: PRD approval, including the Delivery Parts split — the parts list from here on
- Invoke **ux-designer**
- **[STOP]**: UXRD approval, with the design-system files it created or changed

### 3. Design Document Creation Phase
Create one Design Doc per frontend part, in dependency order. A frontend part that depends on a backend part needs that part's approved `design-{part}.md` first — its contract is consumed, not redesigned:
- Invoke **ui-analyzer** for the part → `focusAreas[]`
- Invoke **technical-designer-frontend** using Task tool
  - For Design Doc: `subagent_type: "technical-designer-frontend"`, `description: "Design Doc creation"`, `prompt: "Create Design Doc for part [part] covering [requirements]; depends on [approved design paths]; focusAreas: [...]"`
- Invoke **design-sync** with `source_design` set to the new design, comparing against the sibling designs of the feature (the `Depends on` designs first); conflicts go back through the `revision_agent` for one fix round, whose draft check covers the diff, then design-sync once; anything left goes to the user (`workflow-orchestration`, "Revision Loop")
- **[STOP]**: Present design alternatives and trade-offs, obtain user approval — one stop per part
- When a decision the design made passes the three-part test: `subagent_type: "technical-designer-frontend"`, `description: "ADR creation"`, `prompt: "Create ADR for [technical decision]; part [part]; approved design [path]"` → **[STOP]**: ADR approval
- Invoke **acceptance-test-generator** for the part → skeleton paths

**Scope**: Up to frontend design document (ADR/Design Doc) approval for every part. Work planning and beyond are outside the scope of this command.

## Output Example
Frontend design phase completed.
- PRD: docs/features/[feature]/prd.md (lite); UXRD: docs/features/[feature]/uxrd.md; Design System: docs/design-system/
- Parts: web (depends on api, approved)
- Design document: docs/features/[feature]/design-web.md; ADR: docs/adr/ADR-[number]-[title].md or "none passed the test"
- Test skeletons: tests/[feature]-web.int.test.tsx
- Approval status: User approved

**Important**: This command ends with design approval. Does not propose transition to next phase.
