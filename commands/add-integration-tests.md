---
name: add-integration-tests
description: Add integration/E2E tests to existing backend codebase using Design Doc
argument-hint: <design doc name or path>
---

**Command Context**: Test addition workflow for existing backend implementations

**Scope**: Backend only (implementation and checks use task-executor and quality-fixer)

## Orchestrator Definition

**Core Identity**: "I am not a worker. I am an orchestrator."

**First Action**: Register Steps 1-7 to TodoWrite before any execution.

**Why Delegate**: Orchestrator's context is shared across all steps. Direct implementation consumes context needed for review and quality check phases. Task files create context boundaries. Subagents work in isolated context.

## Required Skills

Before executing, load these skill files for guidance:
- `${CLAUDE_PLUGIN_ROOT}/skills/documentation-criteria/SKILL.md`

**Execution Method**:
- Skeleton generation → delegate to acceptance-test-generator
- Test implementation → delegate to task-executor
- Test review → delegate to integration-test-reviewer
- Quality checks → delegate to quality-fixer

Design Doc path: $ARGUMENTS

## Prerequisites

- Design Doc must exist (created manually or via reverse-engineer)
- Existing implementation to test

## Execution Flow

### Step 1: Validate Design Doc

```bash
# Verify Design Doc exists
ls $ARGUMENTS || ls docs/features/*/design-*.md | grep -v template | tail -1
```

### Step 2: Skeleton Generation

Invoke acceptance-test-generator using Task tool:
- `subagent_type`: "acceptance-test-generator"
- `description`: "Generate test skeletons"
- `prompt`: "Generate test skeletons from Design Doc at [path from Step 1]"

**Expected output**: `generatedFiles` containing integration and e2e paths

### Step 3: Test Implementation

Skeleton test cases are hollow tests, so task-executor implements them in Fix Mode — no task file:
- `subagent_type`: "task-executor"
- `description`: "Implement integration tests"
- `prompt`: "incompleteImplementations: [one {type: hollow_test, location: <skeleton file>, description: 'implement every test case in this skeleton'} per path from Step 2 generatedFiles]. Design Doc: [path from Step 1]."

**Expected output**: `status`, `testsAdded`

### Step 4: Test Review

Invoke integration-test-reviewer using Task tool:
- `subagent_type`: "integration-test-reviewer"
- `description`: "Review test quality"
- `prompt`: "testFiles: [paths from Step 3 testsAdded]. designDoc: [path from Step 1]"

**Expected output**: `status` (approved/needs_revision/blocked), `requiredFixes`

### Step 5: Apply Review Fixes

Check Step 4 result:
- `status: approved` → Mark complete, proceed to Step 6
- `status: needs_revision` → Invoke task-executor with requiredFixes, then return to Step 4
- `status: blocked` → STOP and present the reason to the user

Invoke task-executor using Task tool:
- `subagent_type`: "task-executor"
- `description`: "Fix review findings"
- `prompt`: "requiredFixes: [requiredFixes from Step 4]"

### Step 6: Quality Check

Invoke quality-fixer using Task tool:
- `subagent_type`: "quality-fixer"
- `description`: "Quality gate check"
- `prompt`: "Execute final quality checks for test files: [paths from Step 3 testsAdded]"

**Expected output**: `approved` (true/false)

### Step 7: Final Report and Commit

```
Test Implementation Complete

Generated skeletons: [paths from Step 2]
Implemented tests: [paths from Step 3]
Review status: [approved]
Quality status: [approved]

Ready for commit.
```

Commit test files with message: `test: add integration tests for [feature name]`
