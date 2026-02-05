---
name: integration-e2e-testing
description: This skill provides integration and E2E test design principles, ROI calculation, test skeleton specification, and review criteria. Automatically loaded when designing integration tests, E2E tests, reviewing test quality, or when "integration test", "E2E test", "end-to-end", "test skeleton", or "acceptance test" are mentioned.
---

# Integration and E2E Testing Principles

## Test Type Definition and Limits

| Test Type | Purpose | Scope | Limit per Feature | Implementation Timing |
|-----------|---------|-------|-------------------|----------------------|
| Integration | Verify component interactions | Partial system integration | MAX 3 | Created alongside implementation |
| E2E | Verify critical user journeys | Full system | MAX 1-2 | Executed in final phase only |

## Behavior-First Principle

### Include (High ROI)
- Business logic correctness (calculations, state transitions, data transformations)
- Data integrity and persistence behavior
- User-visible functionality completeness
- Error handling behavior (what user sees/experiences)

### Exclude (Low ROI in CI/CD)
- External service real connections → Use contract/interface verification
- Performance metrics → Non-deterministic, defer to load testing
- Implementation details → Focus on observable behavior
- UI layout specifics → Focus on information availability

**Principle**: Test = User-observable behavior verifiable in isolated CI environment

## ROI Calculation

```
ROI Score = (Business Value × User Frequency + Legal Requirement × 10 + Defect Detection)
            / (Creation Cost + Execution Cost + Maintenance Cost)
```

### Cost Table

| Test Type | Create | Execute | Maintain | Total |
|-----------|--------|---------|----------|-------|
| Unit | 1 | 1 | 1 | 3 |
| Integration | 3 | 5 | 3 | 11 |
| E2E | 10 | 20 | 8 | 38 |

## Test Skeleton Specification

### Required Comment Patterns

Each test MUST include the following annotations:

```
// AC: [Original acceptance criteria text]
// Behavior: [Trigger] → [Process] → [Observable Result]
// @category: core-functionality | integration | edge-case | e2e
// @dependency: none | [component names] | full-system
// @complexity: low | medium | high
// ROI: [score]
```

### Verification Items (Optional)

When verification points need explicit enumeration:
```
// Verification items:
// - [Item 1]
// - [Item 2]
```

## EARS Format Mapping

| EARS Keyword | Test Type | Generation Approach |
|--------------|-----------|---------------------|
| **When** | Event-driven | Trigger event → verify outcome |
| **While** | State condition | Setup state → verify behavior |
| **If-then** | Branch coverage | Both condition paths verified |
| (none) | Basic functionality | Direct invocation → verify result |

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

Property-based testing generates random inputs to verify invariants that should hold for ALL possible values, not just specific test cases.

### When to Apply

| Scenario | Property Example |
|---|---|
| Sorting algorithms | `sort(arr).length === arr.length` AND each element <= next |
| Serialization | `decode(encode(value)) === value` for any valid value |
| Data transformations | `transform(transform_inverse(x)) === x` |
| Validation functions | Valid inputs always pass, structurally invalid inputs always fail |
| Mathematical operations | Commutativity, associativity, distributivity |
| Collection operations | Map preserves length, filter reduces or preserves length |

### Property Test Structure (Language-Agnostic)

```
PROPERTY: "Description of the invariant"
FOR ALL: generator description (e.g., "arbitrary arrays of integers, length 0-1000")
ASSERT: invariant expression
SHRINK: how to minimize failing cases

Example:
  PROPERTY: "Sorting preserves all elements"
  FOR ALL: arrays of comparable elements
  ASSERT:
    - sorted.length === original.length
    - every element in original exists in sorted
    - sorted[i] <= sorted[i+1] for all valid i
  SHRINK: reduce array size until minimal failing case found
```

### ROI Assessment for Property Tests

| Factor | Score Guidance |
|---|---|
| Input space size | Large (>100 meaningful variations) → High ROI |
| Bug severity if invariant broken | Data corruption / security → High ROI |
| Implementation complexity | Simple property → High ROI |
| Existing coverage | No edge case coverage → High ROI |

**Minimum ROI threshold**: Only create property tests when at least 2 factors score High.

### Integration with Test Budget

Property tests count toward the integration test budget. Each property test replaces approximately 5-10 specific input unit tests, making them highly budget-efficient for the right scenarios.