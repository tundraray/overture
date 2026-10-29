---
name: design
description: Execute from requirement analysis through PRD to design document approval for every part
argument-hint: <feature description>
---

**Command Context**: This command is dedicated to the product and design phases. It ends when every part's Design Doc is approved.

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator." (see workflow-orchestration skill)

**Execution Protocol**:
1. **Delegate all work** to sub-agents (NEVER investigate/analyze yourself)
2. **Follow the `workflow-product` and `workflow-technical` flows exactly**, in that order
   - **Stop at every `[Stop: ...]` marker** → Wait for user approval before proceeding
3. **Scope**: Complete when every part in the PRD's Delivery Parts has an approved `design-{part}.md`

**CRITICAL**: NEVER skip prd-creator, document-reviewer, design-sync, acceptance-test-generator, or a stopping point defined in the skill flows.

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-product/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-technical/SKILL.md`

## Workflow Overview

```
Requirements → requirement-analyzer → [Stop: requirement confirmation]
                     ↓
             prd-creator (depth by scale) → document-reviewer → [Stop: PRD approval — includes the parts split]
                     ↓
             ux-designer → document-reviewer → [Stop: UXRD approval]        (only when the work has a UI surface)
                     ↓
   for each part in the PRD's Delivery Parts, in dependency order:
             codebase-analyzer (ui-analyzer for a frontend part)
                     ↓
             technical-designer(-frontend) → document-reviewer → design-sync → [Stop: Design Doc approval — part X]
                     ↓
             technical-designer(-frontend) → ADR → document-reviewer → [Stop: ADR approval]   (only when the three-part test passes)
                     ↓
             acceptance-test-generator → test skeletons for the part
```

A PRD is written at every scale (`full` at large, `lite` at medium and small) — it is where the Delivery Parts live, and the parts list is the only source of part names. `cutAlong: frontend` routes a part to `technical-designer-frontend` and `ui-analyzer`; anything else to `technical-designer` and `codebase-analyzer`. Small scale ends after PRD approval: there is no Design Doc, and `/create-plan` or `/implement` continue from the lite PRD.

## Scope Boundaries

**Included in this command**:
- Requirement analysis with requirement-analyzer
- PRD creation or update with prd-creator, reviewed by document-reviewer
- UXRD creation with ux-designer when the work has a UI surface
- Fact gathering with codebase-analyzer / ui-analyzer, per part
- Design Doc creation with technical-designer(-frontend), per part
- Document review with document-reviewer
- Design Doc consistency verification with design-sync, per part
- ADR creation only when a decision the design made passes the three-part test in `documentation-criteria`
- Test skeleton generation with acceptance-test-generator, per part

**Responsibility Boundary**: This command completes with design document approval for every part.

Requirements: $ARGUMENTS

**Think harder** Considering the deep impact on design, first engage in dialogue to understand the background and purpose of requirements:
- What problems do you want to solve?
- Expected outcomes and success criteria
- Relationship with existing systems

Once requirements are moderately clarified, analyze with requirement-analyzer, write the PRD at the scale's depth, and design each part in dependency order.

Clearly present design alternatives and trade-offs.

**Scope**: Up to design document approval for every part. Work planning and beyond are outside the scope of this command.

### Consistency Verification via design-sync

After document-reviewer approves a part's Design Doc, run design-sync against the already-approved designs of sibling parts:

```yaml
subagent_type: design-sync
prompt: "source_design: docs/features/[feature]/design-[part].md. Compare against the other design-*.md files of this feature, starting with the designs named under Depends on."
```

design-sync detects explicit conflicts between Design Docs only; traceability to the PRD and UXRD is document-reviewer's check.

**Conflict Resolution Flow** (`workflow-orchestration`, "Revision Loop" — one fix round, then the user):
- **IF conflicts found**:
  1. Call the `revision_agent` named on each conflict — normally technical-designer(-frontend) in `update` mode — with the conflict details. A conflict with a `dependsOn` design is fixed in this design, which consumes the upstream contract as written; if the upstream contract itself must change, ask the user
  2. Re-run document-reviewer on each revised document with `review_scope: changes`
  3. Re-run design-sync once to verify resolution
  4. Conflicts or a re-review not `approved` remaining → stop and present them to the user
- **IF no conflicts**: Present the clean verification result and proceed to the Design Doc approval stop

## Completion Criteria

- [ ] Executed requirement-analyzer and determined scale with its deciding axis
- [ ] PRD written at the scale's depth, reviewed, and approved with its Delivery Parts
- [ ] UXRD written, reviewed, and approved when the work has a UI surface
- [ ] For every part, in dependency order: fact gathering, Design Doc, document-reviewer, design-sync, user approval
- [ ] ADR written and approved for any decision that passed the three-part test, or "none passed" recorded
- [ ] Test skeletons generated per part

## Output Example
Design phase completed.
- PRD: docs/features/[feature]/prd.md (lite)
- Parts: api → web
- Design documents: docs/features/[feature]/design-api.md, docs/features/[feature]/design-web.md; ADR: docs/adr/ADR-[number]-[title].md or "none passed the test"
- Test skeletons: tests/[feature]-api.int.test.ts, tests/[feature]-web.int.test.ts
- Approval status: User approved, all parts

**Important**: This command ends with design approval. Does not propose transition to next phase.
