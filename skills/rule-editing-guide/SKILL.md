---
name: rule-editing-guide
description: 9 principles for writing effective rules that maximize LLM execution accuracy. Use when creating or modifying skills, agent prompts, or command instructions.
---

# Rule Editing Guide

## Purpose

This guide provides principles for writing rules (skills, agent instructions, command definitions) that maximize LLM execution accuracy. Rules are instructions that guide AI agent behavior — poorly written rules lead to inconsistent or incorrect execution.

## The 9 Principles

### Principle 1: Context Efficiency
Write rules that provide maximum information with minimum tokens. Every sentence should carry meaning.

**DO**: "Functions MUST have ≤3 parameters. Extract to options object if more needed."
**DON'T**: "When writing functions, it's generally a good practice to try to keep the number of parameters relatively low, ideally around three or fewer, because having too many parameters can make the function harder to understand and use."

### Principle 2: Unified Notation
Use consistent formatting throughout all rules. Same concepts should use same notation.

**Convention table:**
| Element | Notation |
|---|---|
| Required action | **MUST** / **REQUIRED** |
| Prohibited action | **MUST NOT** / **PROHIBITED** |
| Recommended action | **SHOULD** / **RECOMMENDED** |
| Optional action | **MAY** / **OPTIONAL** |
| File paths | `backtick code` |
| Code elements | `backtick code` |
| Key concepts | **bold** |

### Principle 3: Eliminate Duplication
Each rule should exist in exactly one location. Cross-reference instead of copying.

**DO**: "Error handling follows the patterns defined in `coding-principles` skill, Error Handling section."
**DON'T**: [Copy-paste the entire error handling section from coding-principles]

### Principle 4: Aggregate Responsibilities
Group related rules together. One skill should cover one coherent domain.

**DO**: All testing rules in `testing-principles`, all coding rules in `coding-principles`
**DON'T**: Testing rules scattered across 5 different skills

### Principle 5: Measurable Criteria
Rules must be objectively verifiable. Avoid subjective language.

**DO**: "Test coverage MUST be ≥80%. Functions MUST have ≤20 lines."
**DON'T**: "Code should have good test coverage. Functions should be reasonably short."

### Principle 6: NG Patterns as Recommendations
Show both wrong and right patterns. NG patterns are more memorable than abstract rules.

**DO**:
```
❌ NG: catch (error) { return null; }  // Error suppression
✅ OK: catch (error) { logger.error(error); throw new AppError(error); }
```
**DON'T**: "Don't suppress errors in catch blocks."

### Principle 7: Verbalize Implicit Assumptions
Make every assumption explicit. What seems obvious to you may not be obvious to an LLM.

**DO**: "This skill applies to backend services only. Frontend components follow `typescript-rules` instead."
**DON'T**: [Assume the LLM knows which skill applies to which context]

### Principle 8: Arrange by Importance
Put the most critical rules first. LLMs pay more attention to content at the beginning.

**Structure**:
1. Critical constraints (MUST/MUST NOT)
2. Standard practices (SHOULD)
3. Preferences (MAY)
4. Examples and edge cases

### Principle 9: Clarify Scope Boundaries
Every skill must state what it covers and what it does NOT cover.

**DO**:
```
## Scope
- **Covers**: Language-agnostic coding principles
- **Does NOT cover**: TypeScript-specific rules (see `typescript-rules`), testing (see `testing-principles`)
```

## Applying the Principles

When creating or editing a skill:
1. Draft the content
2. Review against all 9 principles
3. Count tokens — can you say the same in fewer words? (Principle 1)
4. Check for duplicated content across skills (Principle 3)
5. Verify all criteria are measurable (Principle 5)
6. Add scope boundaries (Principle 9)

## Quality Checklist

- [ ] Every rule uses consistent MUST/SHOULD/MAY notation
- [ ] No copy-pasted content from other skills
- [ ] All criteria are objectively measurable
- [ ] NG patterns shown alongside correct patterns
- [ ] Scope boundaries clearly stated
- [ ] Most important rules appear first
- [ ] No implicit assumptions left unverbalized
- [ ] Content is token-efficient (no fluff)
- [ ] Related rules are grouped together
