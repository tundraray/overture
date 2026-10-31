---
name: integration-e2e-testing
description: This skill provides integration and E2E test design principles, test skeleton specification, and review criteria. Automatically loaded when designing integration tests, E2E tests, reviewing test quality, or when "integration test", "E2E test", "end-to-end", "test skeleton", or "acceptance test" are mentioned.
---

# Integration and E2E Testing Principles

## Test Type Definition and Limits

| Test Type | Purpose | Scope | Limit per Part | Implementation Timing |
|-----------|---------|-------|-------------------|----------------------|
| Integration | Verify component interactions | Partial system integration | MAX 3; up to 5 only when each extra test names the defect no other test catches | Created alongside implementation |
| E2E | Verify critical user journeys | Full system | MAX 1-2 | Executed in final phase only |

## Behavior-First Principle

### Include
- Business logic correctness (calculations, state transitions, data transformations)
- Data integrity and persistence behavior
- User-visible functionality completeness
- Error handling behavior (what user sees/experiences)

### Exclude (not verifiable in an isolated CI run)
- External service real connections → Use contract/interface verification
- Performance metrics → Non-deterministic, defer to load testing
- Implementation details → Focus on observable behavior
- UI layout specifics → Focus on information availability

**Principle**: Test = User-observable behavior verifiable in isolated CI environment

## Test Skeleton Specification

### Required Comment Patterns

Each test MUST include the following annotations:

```
// AC: [Original acceptance criteria text]
// Behavior: [Trigger] → [Process] → [Observable Result]
// Catches: [the defect this test catches that no other test catches]
// @category: core-functionality | integration | edge-case | e2e
// @dependency: none | [component names] | full-system
// @complexity: low | medium | high
```

### Verification Items (Optional)

When verification points need explicit enumeration:
```
// Verification items:
// - [Item 1]
// - [Item 2]
```

## Criterion Shape Mapping

| The criterion describes | Test Type | Generation Approach |
|--------------|-----------|---------------------|
| An event ("when a user …") | Event-driven | Trigger event → verify outcome |
| A state ("while the thread is streaming …") | State condition | Setup state → verify behavior |
| A condition ("if the credentials are wrong …") | Branch coverage | Both condition paths verified |
| Plain behaviour | Basic functionality | Direct invocation → verify result |

## Test File Naming Convention

- Integration tests: `*.int.test.*` or `*.integration.test.*`
- E2E tests: `*.e2e.test.*`

The test runner or framework in the project determines the appropriate file extension.

## Review Criteria

### Skeleton and Implementation Consistency

| Check | Failure Condition |
|-------|-------------------|
| Behavior Verification | No assertion for "observable result" in skeleton |
| Verification Item Coverage | Listed items not all covered by assertions |
| Mock Boundary | Internal components mocked in integration test |

### Implementation Quality

| Check | Failure Condition |
|-------|-------------------|
| AAA Structure | Arrange/Act/Assert separation unclear |
| Independence | State sharing between tests, order dependency |
| Reproducibility | Date/random dependency, varying results |
| Readability | Test name doesn't match verification content |

## Quality Standards

### Required
- Each test verifies one behavior
- Clear AAA (Arrange-Act-Assert) structure
- No test interdependencies
- Deterministic execution

### Prohibited
- Testing implementation details
- Multiple behaviors per test
- Shared mutable state
- Time-dependent assertions without mocking

## Property-Based Testing

When and how to write a property test is defined in `testing-principles`, "Property-Based Testing". A property test counts as unit-level proof, not against the integration budget.
