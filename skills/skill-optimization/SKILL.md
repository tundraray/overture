---
name: skill-optimization
description: Optimization patterns and grading system for skill quality assessment. Automatically loaded when creating new skills, evaluating skill quality, reviewing skill content, or when "skill optimization", "skill quality", "BP pattern", "skill grading", or "skill assessment" are mentioned.
---

# Skill Optimization

## BP Patterns (Best Practice Patterns)

### P1 Critical — Must fix before skill is usable

**BP-1: Negative-to-Positive Rewriting**

Convert prohibitions into actionable instructions. Agents follow positive directives more reliably than avoiding negatives.

```
BAD:  "Don't use any in TypeScript"
GOOD: "Use explicit types: unknown for external data, generics for reusable code, union types for variants"
```

**BP-2: Vague-to-Specific Conversion**

Replace ambiguous guidance with measurable criteria.

```
BAD:  "Write clean functions"
GOOD: "Function length: <50 lines ideal, <200 max. Single return type. Max 3 parameters (use options object beyond 3)."
```

**BP-3: Missing Output Format Specification**

Every skill used by an agent that produces structured output MUST define the expected format.

```
BAD:  "Report the findings"
GOOD: "Output JSON: { status, findings: [{category, severity, location, remediation}], summary }"
```

### P2 High — Should fix for production-quality skills

**BP-4: Unstructured-to-Organized**

Content should flow from general principles to specific patterns. Use consistent heading hierarchy.

```
BAD:  Mixed tips, rules, and examples in random order
GOOD: Principle → When to apply → Pattern → Example → Anti-pattern
```

**BP-5: Missing Context Provision**

State when and why a rule applies, not just what the rule is.

```
BAD:  "Use Result type for error handling"
GOOD: "Use Result type when: crossing service boundaries, parsing external input, operations with expected failure modes. Skip for: internal logic with guaranteed preconditions."
```

**BP-6: Complex-to-Decomposed**

Break complex multi-part rules into discrete, independently applicable items.

```
BAD:  "Handle errors properly with logging, user notification, and recovery"
GOOD: Three separate sections: "Error Logging" (what/when/format), "User Notification" (messages/severity), "Error Recovery" (retry/fallback/escalation)
```

### P3 Enhancement — Nice to have for polish

**BP-7: Biased Examples**

Provide examples that cover both success and failure paths, not just happy paths.

```
BAD:  Only showing successful validation
GOOD: Show validation success AND common validation failure scenarios
```

**BP-8: Missing Escalation Criteria**

Define when the agent should stop and escalate to the user instead of continuing.

```
BAD:  No mention of edge cases or uncertainty handling
GOOD: "Escalate when: security implications unclear, performance impact >10%, breaking change to public API"
```

## Editing Principles

For detailed editing principles (context efficiency, deduplication, grouping, measurability, positive form, consistent notation, explicit prerequisites, priority ordering, scope boundaries), reference **rule-editing-guide** skill.

### Skill-Specific Applications

1. **Context Efficiency**: Skill SKILL.md should be self-contained within its scope. Reference other skills by name, never duplicate content.

2. **Deduplication**: If content overlaps with another skill, reference it: "See [skill-name] skill '[section]' for details."

3. **Measurability**: Every criterion should be checkable — "Is this rule followed? Yes/No" must be answerable from the code.

4. **Scope Boundaries**: First paragraph of skill MUST state what is in scope and what is not.

5. **Expert References**: Every skill should end with "Expert References (Reasoning Calibration)" table for decision grounding.

## Grading System

### A Grade — Production Ready
- All P1 patterns (BP-1, BP-2, BP-3) resolved
- 80%+ of P2 patterns (BP-4, BP-5, BP-6) addressed
- Output format clearly specified
- Expert References section present
- No ambiguous or unmeasurable criteria

### B Grade — Usable with Gaps
- All P1 patterns resolved
- Some P2 gaps remain (1-2 unaddressed)
- Core content is clear and actionable
- Minor structural improvements possible

### C Grade — Requires Revision
- P1 patterns remaining (negative rules, vague criteria, or missing output format)
- Significant restructuring needed
- Cannot be reliably used by agents in current state

## Assessment Checklist

When evaluating a skill, check each item:

### Structure
- [ ] Frontmatter has name and description with auto-load triggers
- [ ] Description includes "Automatically loaded when..." clause
- [ ] Content flows general → specific
- [ ] Consistent heading hierarchy (H2 for sections, H3 for subsections)
- [ ] Scope clearly stated in opening paragraph

### Content Quality
- [ ] No negative-only rules (BP-1)
- [ ] All criteria are specific and measurable (BP-2)
- [ ] Output format defined if agent produces structured output (BP-3)
- [ ] Organized by topic, not chronologically (BP-4)
- [ ] Context provided for when/why rules apply (BP-5)
- [ ] Complex rules decomposed into discrete items (BP-6)

### Completeness
- [ ] Both success and failure examples included (BP-7)
- [ ] Escalation criteria defined (BP-8)
- [ ] Expert References table present
- [ ] No content duplicated from other skills

### Integration
- [ ] Referenced in skills-index.yaml with accurate tags
- [ ] Tags cover all relevant search terms
- [ ] key_sections list matches actual H2 headings
