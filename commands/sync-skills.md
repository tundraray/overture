---
name: sync-skills
description: Synchronize skill metadata and optimize rule-advisor precision after skill edits
argument-hint: (no arguments - syncs all skills)
---

**Command Context**: Post-editing maintenance workflow for skill files

**Think deeply** Maximize rule-advisor execution precision through systematic synchronization:

## Execution Flow

### 1. Discover Skills from All Sources

Scan **two** directories to build a unified skill inventory:

```bash
# Source 1: Plugin-provided skills (read-only baseline)
PLUGIN_SKILLS_DIR="${CLAUDE_PLUGIN_ROOT}/skills"

# Source 2: Project-local skills (user customizations / additions)
LOCAL_SKILLS_DIR=".claude/skills"

# Output: project-local index
INDEX_FILE=".claude/skills/task-analyzer/references/skills-index.yaml"

# Discover all SKILL.md files from both sources
# Plugin skills first (baseline), then local skills (overrides)
find "${PLUGIN_SKILLS_DIR}" -name "SKILL.md" -type f 2>/dev/null | sort
find "${LOCAL_SKILLS_DIR}" -name "SKILL.md" -type f 2>/dev/null | sort
```

#### Merge Rules

| Situation | Action |
|-----------|--------|
| Skill exists only in plugin | Add to index as `source: plugin` |
| Skill exists only in project-local | Add to index as `source: local` |
| Skill exists in both (same name) | **Project-local wins** — override plugin version |

**Source tracking**: Each skill entry in the generated index MUST include a `source` field (`plugin` or `local`) so users can tell where each skill originates.

### 2. Synchronize and Optimize Metadata

For every discovered skill (from both sources):

#### Automatic Section Synchronization

- Extract the `## ` level headings from each SKILL.md (a leading section number such as `1. ` is dropped)
- Update `sections` in skills-index.yaml automatically

#### Tag Optimization

- Analyze file content for relevant keywords
- Propose addition of missing tags
- Suggest removal of obsolete tags

#### Typical-Use Enhancement

- Infer usage scenarios from file changes
- Propose more specific and actionable descriptions

#### Key-References Completion

- Detect newly introduced concepts or methodologies
- Suggest relevant reference additions

#### Description Extraction

- Read the `description` field from SKILL.md YAML frontmatter
- Use it as the `description` value in the index entry

### 3. Rule-Advisor Precision Optimization

Enhance metadata quality to enable accurate skill selection by rule-advisor:

```
=== Skill Metadata Synchronization ===
Sources:
  Plugin: ${CLAUDE_PLUGIN_ROOT}/skills (11 skills)
  Local:  .claude/skills (3 skills)
  Merged: 13 skills (1 local override)

Updates executed:
✅ Sections synchronized
  - typescript-testing: 2 sections added
  - coding-standards: 1 section updated

✅ Tags optimized
  - typescript-rules: Suggest adding [functional-programming]
  - technical-spec: Suggest removing [deprecated]

✅ Typical-use improved
  - 3 skills updated with more specific descriptions

✅ Source tracking
  - 11 skills from plugin, 2 local-only, 1 local override

Final result: Rule-advisor precision optimization complete
```

## 🧠 Metacognitive Points

**Essential Purpose**:

- Not mere consistency maintenance, but rule-advisor selection accuracy enhancement
- Metadata optimization as the final step of skill editing workflow

**Quality Criteria**:

- Sections must achieve 100% synchronization
- Tags must accurately reflect content
- Typical-use must specify concrete usage scenarios
- Key-references must cover current methodologies

## Change Necessity Evaluation

**EVALUATION SEQUENCE**:

- IF sections achieve 100% synchronization → OUTPUT "Synchronization verified. No updates required." THEN TERMINATE
- IF content-to-tag mapping shows zero mismatches → DETERMINE no_changes_needed = true THEN TERMINATE
- IF AND ONLY IF measurable improvements exist → GENERATE specific modification proposals WITH exact before/after values

**NOTE**: You MUST NOT force changes. When no improvements are detected, you SHALL report "No modifications necessary" and STOP execution.

## Execution Timing

- After skill file edits (mandatory)
- When adding new skill files (plugin or project-local)
- After plugin updates that introduce new skills
- After major skill revisions
- When rule-advisor selection accuracy appears degraded

## Example Output

```
=== Skill Metadata Synchronization Started ===
Sources:
  Plugin: ${CLAUDE_PLUGIN_ROOT}/skills (11 skills found)
  Local:  .claude/skills (3 skills found)
Output:  .claude/skills/task-analyzer/references/skills-index.yaml

[1/14] coding-principles (plugin)
  ✅ sections: 15 synchronized
  ✅ tags: No changes needed
  ✅ typical-use: Maintained

[2/14] typescript-rules (plugin)
  ✅ sections: 7 synchronized
  💡 tags proposed: +[functional-programming, dependency-injection]
  💡 typical-use: "General TypeScript implementation" → "Type-safe implementation with modern TypeScript features"

[3/14] typescript-testing (plugin)
  ✅ sections: 2 added (Test Granularity Principles, Mock Type Safety Enforcement)
  ✅ tags: No changes needed
  ✅ typical-use: Maintained

[4/14] my-custom-skill (local)
  🆕 New skill added to index
  ✅ sections: 4 extracted
  ✅ tags: [custom, project-specific]

[5/14] coding-principles (local override)
  ⚠️ Overrides plugin skill — local version used
  ✅ sections: 16 synchronized (+1 custom section)

...

=== Synchronization Complete ===
Skills: 11 plugin + 2 local-only + 1 local override = 14 total
Updated: 4 skills
Proposals: 5 items (approval required)

Rule-advisor precision improvement: Estimated 15% enhancement
```

**Scope**: Post-edit skill metadata synchronization and rule-advisor precision optimization.
