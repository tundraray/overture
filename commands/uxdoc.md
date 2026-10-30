---
name: uxdoc
description: Execute from requirement analysis to UX Requirement Documentation (UXRD) creation
argument-hint: <UX feature or interaction description>
---

**Command Context**: This command is dedicated to the UXRD (UX Requirement Documentation) phase.

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator." (see workflow-orchestration skill)

**Execution Protocol**:
1. **Delegate all work** to sub-agents (NEVER investigate/analyze yourself)
2. **Follow workflow-orchestration skill design flow exactly**:
   - Execute: requirement-analyzer → ux-designer → document-reviewer
   - **Stop at every `[Stop: ...]` marker** → Wait for user approval before proceeding
3. **Scope**: Complete when UXRD receives approval

**CRITICAL**: NEVER skip document-reviewer or stopping points defined in workflow-orchestration skill flows.

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-product/SKILL.md`

## Workflow Overview

```
Requirements → requirement-analyzer → [Stop: Scope & UX requirements confirmation]
                                            ↓
                                      ux-designer → document-reviewer → [Stop: UXRD approval]
```

## Scope Boundaries

**Included in this command**:
- Requirement analysis with requirement-analyzer (focused on UX scope)
- UXRD creation with ux-designer
- Document review with document-reviewer

**Excluded from this command**:
- PRD creation — the UXRD cites the PRD, so an approved `prd.md` must exist; if it does not, use `/design` or `/implement`
- Technical Design Doc creation (use `/front-design` for that)
- Work planning and implementation

**Responsibility Boundary**: This command completes with UXRD approval.

Requirements: $ARGUMENTS

**gamedev-overture**: every `ux-designer` call below goes to `game-ui-designer`, and the PRD reference is the feature spec (`docs/game-design/features/*-spec.md`).

## Execution Flow

### 1. Requirement Analysis Phase

**Think harder**: Considering the deep impact on user experience design, first engage in dialogue to understand the background and purpose of requirements:
- What user problems do you want to solve?
- Who are the target users and their key needs?
- Expected user outcomes and success criteria
- Relationship with existing UI/UX patterns in the system
- Accessibility requirements (WCAG level)

Once requirements are moderately clarified:

```yaml
subagent_type: requirement-analyzer
description: "UX requirement analysis and scope determination"
prompt: "Requirements: [user requirements]. Execute requirement analysis with focus on UX/UI scope. Determine UXRD necessity and identify affected user flows, components, and interaction patterns. [SYSTEM CONSTRAINT] This agent operates within /uxdoc command scope. Focus analysis on UX impact, user interaction patterns, and accessibility requirements."
```

**[STOP]**: Present requirement analysis results to user:
- Confirm UX scope and affected user flows
- Review identified interaction patterns
- Address any clarification questions from the analyzer
- Confirm UXRD creation should proceed

### 2. UXRD Creation Phase

**Think deeply**: Based on confirmed requirements, determine ux-designer operation mode:
- `create`: New UXRD for new features/interactions
- `update`: Modify existing UXRD (glob `docs/features/*/uxrd.md`)
- `reverse-engineer`: Create UXRD from existing UI implementation

```yaml
subagent_type: ux-designer
description: "UXRD creation"
prompt: "Create UXRD based on the following confirmed requirements: [requirement-analyzer output]. PRD Reference: docs/features/[feature]/prd.md. Design System: docs/design-system/ (create if absent). Operation mode: [create|update|reverse-engineer]. Include user flows, interaction states, accessibility requirements (WCAG), a Component Inventory linking to the design-system component specs, and responsive design breakpoints. [SYSTEM CONSTRAINT] This agent operates within /uxdoc command scope. Create UX Requirement Documentation only — do not include technical implementation details."
```

### 3. Document Review Phase

After ux-designer produces the UXRD, submit it for review together with the `docs/design-system/` files it reported in `documents[]`:

```yaml
subagent_type: document-reviewer
description: "UXRD review"
prompt: "target: [document path]; design-system files: [paths from documents[], if any]. doc_type: UXRD. [SYSTEM CONSTRAINT] This agent operates within /uxdoc command scope."
```

**Document Revision Flow**:
- **IF document-reviewer returns `approved_with_conditions` or `needs_revision`** (`rejected` goes straight to the user):
  1. Extract the `critical` and `important` issues from reviewer output; `recommended` ones are listed at the approval stop for the user to pick
  2. Call ux-designer to revise the UXRD:
     ```yaml
     subagent_type: ux-designer
     description: "UXRD revision"
     prompt: "Update UXRD at [path] to address the following review issues: [issues from document-reviewer]. Operation mode: update. [SYSTEM CONSTRAINT] This agent operates within /uxdoc command scope. Revise UXRD to address reviewer feedback."
     ```
  3. Re-run document-reviewer once with `review_scope: changes`, the `diff_base`, and the prior issues verbatim
  4. A re-review that is not `approved` goes to the user (revise again / accept with rationale recorded / abort) — see `workflow-orchestration`, "Revision Loop"

**[STOP]**: Present approved UXRD, with the design-system files it created or changed, to user for final approval.

An existing Design Doc of the feature is updated through `/update-doc` after UXRD approval.

## Completion Criteria

- [ ] Executed requirement-analyzer and confirmed UX scope
- [ ] Created UXRD with ux-designer (appropriate operation mode)
- [ ] Executed document-reviewer; `critical` and `important` issues resolved or accepted by the user, `recommended` ones shown to the user
- [ ] Obtained user approval for UXRD

## Output Example

UXRD phase completed.

- UX Requirement Document: docs/features/[feature]/uxrd.md
- Design System: docs/design-system/ — files created or changed
- Approval status: User approved

**Important**: This command ends with UXRD approval. Does not propose transition to next phase.
