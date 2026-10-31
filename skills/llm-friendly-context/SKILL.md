---
name: llm-friendly-context
description: Clarifies inputs, outputs, success criteria, decisions, and unresolved conditions so downstream agents can execute without guessing. Use when writing or revising LLM-facing prompts, agent handoffs, or generated instructions.
---

# LLM-Friendly Context

The goal is stable downstream execution: the next agent should know what to read, what to do, what counts as success, and when to stop or escalate.

This skill governs the clarity of LLM-facing output — prompts, handoffs, and generated instructions. Documents a person reads (PRD, Design Doc, plan) follow `documentation-criteria`, "Writing for the Reader", not this skill.

## Core Rules

1. **Use positive, executable instructions**
   - State what the next agent should do.
   - Convert quality policies into positive criteria.
   - Example: "Preserve existing public API behavior across the documented compatibility cases."

2. **Make vague instructions concrete**
   - Replace subjective terms with observable conditions, paths, commands, schemas, examples, or decision rules.
   - Terms that often need clarification when they leave a decision to the next agent: `appropriate`, `proper`, `related`, `existing behavior`, `optional`, `as needed`, `if needed`, `per convention`, unresolved alternatives, `TBD`, `placeholder`.

3. **Specify output shape**
   - Define required sections, fields, table columns, JSON keys, or checklist items.
   - For handoffs, include paths to produced artifacts and the exact status fields the caller must inspect.

4. **Provide necessary context**
   - Include the purpose, source artifacts, hard constraints, accepted decisions, and unresolved conditions.
   - Prefer concrete file paths and section hints over broad module names.

5. **Decompose complex work into verifiable steps**
   - Split work with 3+ objectives or sequential dependencies into ordered steps.
   - Each step needs a checkpoint: what evidence proves it is complete.

6. **Permit uncertainty explicitly**
   - If the source material is missing, contradictory, or not verifiable, state the uncertainty and the required escalation.
   - Record unknown business, product, security, or compatibility decisions as blocking unresolved items, each stating the required input to resolve it and the condition under which the next agent stops rather than guesses.

7. **Keep constraints proportionate**
   - Add only constraints that reduce ambiguity or preserve a real requirement.
   - Keep simple downstream tasks lightweight when the target action, context, and success criteria are already clear.

## Rewrite Patterns

Use these rewrites before treating a prompt or handoff as complete.

| Ambiguous form | Rewrite as |
|---|---|
| `optional` used as an unresolved choice | Required, omitted, or required only under a named condition |
| Multiple alternatives that the next agent must choose between | The selected option, or a deterministic decision rule |
| `as needed` / `if needed` | The triggering condition and required action |
| `per convention` | The file, function, test, or documented convention to follow |
| `related files` | Specific paths, globs, or search hints |
| `existing behavior` | The observable behavior, source file, test, API response, or UI state to preserve |
| `placeholder` | Exact temporary value/behavior, allowed dependencies, and verification expectation |
| `TBD` used as a placeholder for required information | A blocking unresolved item stating the required input and escalation condition (and owner when known) |
| `appropriate` / `proper` | A measurable criterion or checklist |

## Handoff Checklist

Before sending a prompt or artifact to another agent, verify:

- [ ] The target action is explicit.
- [ ] Required input paths and source artifacts are named.
- [ ] Accepted decisions and constraints are stated once, without alternate wording.
- [ ] Output format or expected status fields are specified.
- [ ] Success criteria are observable.
- [ ] Ambiguous expressions have been rewritten or marked as unresolved.
- [ ] The next agent can complete its scope with explicit choices, decision rules, or blocking unresolved items.
