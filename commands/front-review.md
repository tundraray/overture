---
name: front-review
description: Design Doc compliance validation with optional auto-fixes
argument-hint: (no arguments - reviews current implementation)
---

**Command Context**: Post-implementation quality assurance command for React/TypeScript frontend

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-orchestration/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/workflow-technical/SKILL.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/SKILL.md`

## Execution Method

- Compliance validation → performed by code-reviewer
- Rule analysis → performed by rule-advisor
- Fix implementation → performed by task-executor-frontend
- Quality checks → performed by quality-fixer-frontend
- Re-validation → performed by code-reviewer

Orchestrator invokes sub-agents and passes structured JSON between them.

Design Doc (uses most recent if omitted): $ARGUMENTS

**Think deeply** Understand the essence of compliance validation and execute:

## Execution Flow

### 1. Prerequisite Check
```bash
# Identify Design Doc
ls docs/features/*/design-*.md | grep -v template | tail -1

# Check implementation files
git diff --name-only main...HEAD

# Code system, when the project has one
ls docs/code-system/README.md 2>/dev/null
```

### 2. Execute code-reviewer
`prompt: "Design Doc Path: [path from Step 1]. Implementation Files: [git diff list from Step 1]. Code System Path: docs/code-system/ (when Step 1 found it)"` — validates:
- Acceptance criteria fulfillment
- Code quality check
- Implementation completeness assessment
- Conformance to the code system — duplicate blocks, boundaries, cited patterns — with candidate patterns reported, not fixed

### 3. Verdict and Response

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

If user selects `y`:

## Pre-fix Metacognition
**Required**: `rule-advisor → TodoWrite → task-executor-frontend → quality-fixer-frontend`

1. **Execute rule-advisor**: Understand fix essence (symptomatic treatment vs root solution)
2. **Update TodoWrite**: Register work steps. Always include: first "Confirm skill constraints", final "Verify skill fidelity"
3. **Execute task-executor-frontend** in Fix Mode, no task file: `Design Doc: [path]` and `requiredFixes` built from code-reviewer's `unfulfilledItems` and `qualityIssues` (`{location, issue, fix}`); `candidatePatterns` stay out of `requiredFixes`
4. **Execute quality-fixer-frontend**: Confirm quality gate passage
5. **Re-validate**: Measure improvement with code-reviewer

### 4. Final Report
```
Initial compliance: [X]%
Final compliance: [Y]% (if fixes executed)
Improvement: [Y-X]%

Remaining issues:
- [items requiring manual intervention]

Candidate patterns (confirm to add via /update-doc, code system):
- [name — shape — locations]
```

## Auto-fixable Items
- Simple unimplemented acceptance criteria
- Error handling additions
- Contract definition fixes
- Function splitting (length/complexity improvements)
- Conformance fixes with a named target: a duplicate block replaced by the existing one, an instance brought to its cited pattern

## Non-fixable Items
- Fundamental business logic changes
- Architecture-level modifications
- Design Doc deficiencies
- Code-system changes — a candidate pattern reaches the catalogue only through `/update-doc`

**Scope**: Design Doc compliance validation and auto-fixes.
