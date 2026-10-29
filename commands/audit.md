---
name: audit
description: Interactive codebase audit to find and remove dead code and suspicious areas
argument-hint: [scope path or keyword]
---

**Command Context**: Interactive dead code detection and cleanup flow

Target scope: $ARGUMENTS

**Role**: Orchestrator

**Execution Method**:
- Scanning → performed by code-explorer (undirected sweep)
- Cleanup → performed by cleanup-executor

Orchestrator invokes sub-agents and passes structured JSON between them.

**TodoWrite Registration**: Register execution steps in TodoWrite and proceed systematically

## Audit Flow Overview

```
Scope → code-explorer (sweep) → Interactive Review → Confirm → cleanup-executor → Report
```

**Context Separation**: Pass only structured JSON output to each step. Each step starts fresh with the JSON data only.

## Execution Steps

Register the following in TodoWrite and execute:

### Step 1: Scan (code-explorer)

**Task tool invocation**:
```
subagent_type: code-explorer
prompt: query: what in this codebase is unused or dead?; breadth: thorough; scope_hint: [user-provided scope, if any]; exclude: node_modules, dist, build, vendor, .git
```

**Expected output**: `findings[]` (`id`, `category`, `name`, `files`, `confidence`, `signals`, `notRuledOut`) and `coverage`

### Step 2: Scan Quality Check

Review scanner output:

**Quality Check** (verify JSON output contains):
- [ ] `findings` array with at least one entry (or confirm codebase is clean)
- [ ] Each finding has `confidence` and `signals`
- [ ] `coverage` — areas in `notSearched` are not "clean"

**If zero findings**: Report clean codebase to user and exit.

### Step 3: Interactive Review

Present findings to user **one at a time**, sorted by `confidence` (high first).

For EACH item, use **AskUserQuestion** with the item context:

```
Finding: [item.name]
Category: [item.category]
Confidence: [item.confidence]
Files: [item.files]
Evidence: [item.signals joined]

What would you like to do with this finding?
```

Options:
- **Delete**: Approve for removal
- **Deprecate**: Mark as deprecated (add deprecation comment, don't delete yet)
- **Keep**: Confirmed in use, no action needed
- **Unsure**: Skip for now, include in report for future review

Track all decisions in a decisions list.

**Efficiency**: For items with the same category and confidence, you may group up to 3 related items in a single question. But never group items from different categories.

### Step 4: Decision Report

After reviewing all items, present a summary to the user:

```
## Audit Decision Summary

### Approved for Deletion ([count])
- [item name] — [category] — [files]
...

### Marked as Deprecated ([count])
- [item name] — [category] — [files]
...

### Kept ([count])
- [item name] — reason confirmed in use
...

### Deferred ([count])
- [item name] — needs future review
...
```

### Step 5: Confirm Cleanup

**This is a mandatory stop point.** Before any deletions, explicitly confirm with the user:

Use **AskUserQuestion**:
```
Ready to proceed with cleanup. This will:
- Create a safety branch (cleanup/audit-YYYY-MM-DD)
- Delete [N] files/exports
- Update imports in [M] consumer files

Proceed with cleanup?
```

Options:
- **Yes, proceed**: Execute cleanup
- **No, abort**: Exit without changes
- **Modify selections**: Return to Step 3

If user selects "No, abort": Present the decision report and exit.

### Step 6: Execute Cleanup (cleanup-executor)

**Task tool invocation**:
```
subagent_type: cleanup-executor
prompt: Execute safe cleanup of confirmed dead code.

Approved items: [JSON list of items marked "Delete"]
Project root: [project root path]
Build command: [detected or user-provided build command]
Test command: [detected or user-provided test command]
```

**Expected output**: Branch name, files removed, imports updated, reverted items, build/test status

### Step 7: Handle Deprecations

For items marked "Deprecate", have task-executor add deprecation comments:
- Add `@deprecated` or equivalent comment to the export/file
- Include date and reason

### Step 8: Final Report

Present comprehensive report to user:

```
## Audit Complete

### Branch
`cleanup/audit-YYYY-MM-DD`

### Removed ([count])
| File | Category | Status |
|------|----------|--------|
| [path] | [category] | Removed successfully |
...

### Reverted ([count])
| File | Category | Reason |
|------|----------|--------|
| [path] | [category] | [failure reason] |
...

### Deprecated ([count])
| File | Category |
|------|----------|
| [path] | [category] |
...

### Deferred for Future Review ([count])
| File | Category | Suspicion |
|------|----------|-----------|
| [path] | [category] | [level] |
...

### Verification
- Build: [pass/fail]
- Tests: [pass/fail]

### Next Steps
- Review the `cleanup/audit-YYYY-MM-DD` branch
- Merge when satisfied with changes
- Re-run `/audit` periodically to catch new dead code
```

## Completion Criteria

- [ ] Executed code-explorer as an undirected sweep and obtained findings
- [ ] Reviewed each finding interactively with user
- [ ] Obtained explicit confirmation before any deletions
- [ ] Executed cleanup-executor for approved deletions
- [ ] Handled deprecation markers for deferred items
- [ ] Presented final report with verification status
