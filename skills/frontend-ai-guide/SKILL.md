---
name: frontend-ai-guide
description: This skill provides frontend-specific technical decision criteria, anti-patterns, debugging techniques, and quality check workflow. Automatically loaded when making frontend technical decisions, performing React/TypeScript quality assurance, or when "React anti-pattern", "frontend code smell", or "component quality" are mentioned.
---

# AI Developer Guide - Technical Decision Criteria and Anti-pattern Collection (Frontend)

The language-agnostic criteria — anti-patterns, fail-fast fallbacks, Rule of Three, failure patterns, debugging, unused and broken code, impact before change — are in `ai-development-guide` and apply here unchanged. This skill adds only what React and the browser change.

## Technical Anti-patterns (Red Flag Patterns)

In addition to `ai-development-guide`, "Technical Anti-patterns":
1. **Type assertions (`as`) to silence the compiler** - Abandons type safety; use `unknown` and type guards
2. **Prop drilling through many levels** - Use composition, Context, or the project's state management
3. **A component that renders, fetches, and decides business rules at once** - Split view, data hook, and logic

## Fallback Design Principles

The fail-fast rules of `ai-development-guide` apply. Layer responsibilities in React:
- **Component Layer**: an Error Boundary catches rendering errors and shows the fallback UI
- **Hook Layer**: decides handling from business requirements; a fallback exists only when the Design Doc defines it

## Common Failure Patterns and Avoidance Methods

Patterns 1, 3, and 4 are as in `ai-development-guide`. React adds to Patterns 2 and 5:

### Pattern 2: Abandoning Type Safety
**Symptom**: `any` or `as` spreading through props, state, and API data
**Avoidance**: Receive external data as `unknown` and narrow it with type guards (`typescript-rules`, Type Safety)

### Pattern 5: Insufficient Existing Code Investigation
**Symptom**: A second date picker, a second fetch wrapper, a hook that duplicates one that exists
**Avoidance**: Before writing a component or hook, search the existing ones by domain, responsibility, and component pattern; reuse or extend a fit, and escalate when the existing one is technical debt — whether to replace it is a design decision. At design time the decision is recorded in the Design Doc's Existing Component Reuse Map.

## Debugging Techniques

In addition to `ai-development-guide`, "Debugging Techniques":
- Inspect the component tree, props, and state with React DevTools
- In a minimal reproduction, replace API calls with mocks and remove unrelated components
- Remove debug `console.log` calls before committing

## Quality Check Workflow

The phases match `ai-development-guide` "Quality Check Workflow". Commands come from the project's own scripts — `package.json`, run with the package manager its `packageManager` field names — or from project-context; never assume another project's script names.

- **Phase 1: Static Analysis** — the lint/format script (ESLint, Biome, Prettier) and the type check (the project's type-check script, or `tsc --noEmit`)
- **Phase 2: Build Verification** — the production build script
- **Phase 3: Testing** — the test script (React Testing Library), and the coverage script when the project has one
- **Phase 4: Final Quality Gate** — every check above passes in one run; the project's aggregate check script, when it has one

### Troubleshooting
- **Port in use or hanging test processes**: stop the leftover runner processes (the project's cleanup script, when it has one)
- **Stale results**: re-run with the test runner's cache cleared
- **Dependency errors**: clean reinstall dependencies

## Situations Requiring Technical Decisions

`ai-development-guide`, "Situations Requiring Technical Decisions" applies. For React:
- **Performance vs readability**: measure with the React DevTools Profiler before memoizing or splitting
- **Granularity**: design components that express UI patterns; prefer composition over inheritance
