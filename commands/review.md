---
name: review
description: Design Doc compliance validation with optional auto-fixes
argument-hint: (no arguments - reviews current implementation)
---

**Command Context**: Post-implementation quality assurance command

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator."

**First Action**: Register Steps 1-7 to TodoWrite before any execution.

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-technical/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/SKILL.md`

## Execution Method

- Compliance validation → performed by code-reviewer
- Fix implementation → performed by task-executor
- Quality checks → performed by quality-fixer
- Re-validation → performed by code-reviewer

Orchestrator invokes sub-agents and passes structured JSON between them.

Design Doc (uses most recent if omitted): $ARGUMENTS

## Execution Flow

### Step 1: Prerequisite Check
```bash
# Identify Design Doc
ls docs/features/*/design-*.md | grep -v template | tail -1

# Check implementation files
git diff --name-only main...HEAD
```

### Step 2: Execute code-reviewer
Invoke code-reviewer using Task tool:
- `subagent_type`: "code-reviewer"
- `description`: "Validate compliance"
- `prompt`: "Design Doc Path: [path from Step 1]. Implementation Files: [git diff list from Step 1]"

Validate:
- Acceptance criteria fulfillment
- Code quality check
- Implementation completeness assessment

### Step 2.5: Execute security-reviewer

Invoke security-reviewer using Task tool:
- `subagent_type`: "security-reviewer"
- `description`: "Security compliance review"
- `prompt`: "Review security compliance for implementation files from Step 1. Design Doc: [path from Step 1]"

Include security findings in the Step 3 verdict. If `blocked`, override verdict to "needs-redesign" regardless of compliance rate.

### Step 3: Verdict and Response

**Criteria (considering project stage)**:
- Prototype: Pass at 70%+
- Production: 90%+ recommended
- Critical items (security, etc.): Required regardless of rate

**Compliance-based response**:

For low compliance (production <90%):
```
Validation Result: [X]% compliance
Unfulfilled items:
- [item list]

Execute fixes? (y/n):
```

### Step 4: Execute Fixes

If user selects `n` or compliance sufficient: skip to Step 7.

Invoke task-executor in Fix Mode — no task file; scope comes from the fix locations:
- `subagent_type`: "task-executor"
- `description`: "Execute review fixes"
- `prompt`: "Design Doc: [path]. requiredFixes: [each unfulfilledItems entry as {location, issue: item, fix: solution} and each qualityIssues entry as {location, issue: type, fix: suggestion}]"

**Expected output**: `status`, `filesModified`

### Step 5: Quality Check

Invoke quality-fixer using Task tool:
- `subagent_type`: "quality-fixer"
- `description`: "Quality gate check"
- `prompt`: "Confirm quality gate passage for fixed files."

**Expected output**: `approved` (true/false)

### Step 6: Re-validate

Invoke code-reviewer using Task tool:
- `subagent_type`: "code-reviewer"
- `description`: "Re-validate compliance"
- `prompt`: "Design Doc Path: [path from Step 1]. Implementation Files: [git diff list, re-read]"

### Step 7: Final Report

```
Initial compliance: [X]%
Final compliance: [Y]% (if fixes executed)
Improvement: [Y-X]%

Remaining issues:
- [items requiring manual intervention]
```

## Auto-fixable Items
- Simple unimplemented acceptance criteria
- Error handling additions
- Contract definition fixes
- Function splitting (length/complexity improvements)

## Non-fixable Items
- Fundamental business logic changes
- Architecture-level modifications
- Design Doc deficiencies

**Scope**: Design Doc compliance validation and auto-fixes.
