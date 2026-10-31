---
name: typescript-testing-backend
description: This skill provides backend testing rules on the project's test runner (Vitest or Jest), real DB/API integration patterns, and service-level testing conventions. Automatically loaded when writing backend tests, reviewing test quality, or when "backend test", "service test", "API test", "integration test", "database test", or "backend test coverage" are mentioned.
---

# TypeScript Testing Rules (Backend)

## Test Framework

- **Test runner**: the project's own (Vitest or Jest; a NestJS project defaults to Jest); the examples below use Vitest — translate `vi.*` to `jest.*` on Jest
- **Supertest**: For HTTP endpoint testing
- **fast-check**: For property-based testing
- Test imports: `import { describe, it, expect, beforeEach, vi } from 'vitest'`
- Mock creation: Use `vi.mock()`

## Basic Testing Policy

### Quality Requirements

- **Coverage**: Assert the named acceptance result, public branch, or failure state on critical paths and high-reuse units. Treat coverage as a signal for finding untested areas, not as a target — a target gets gamed into trivial tests. Any enforced numeric threshold is the project's CI/coverage config, not a goal in itself.
- **Independence**: Each test can run independently without depending on other tests
- **Reproducibility**: Control time, randomness, environment values, and external responses so identical inputs produce the same observable result
- **Readability**: Each test names one behavior, separates arrange/act/assert, and keeps fixtures limited to values used by that behavior

### Where to concentrate test rigor

Cover public branches, error states, and boundary contracts on units whose regression blast radius is widest. Read coverage reports as a map of where to look first, in roughly this order of payoff:

- **Services (business logic)** and **Utils/Helpers** — highest reuse, most branch logic; a gap here is almost always a real finding
- **Guards/Interceptors/Pipes** — cross-cutting, so a defect reaches every route that uses them
- **Controllers (API layer)** — thin by design; verify contract shape and error mapping rather than chasing a number
- **Repositories (data access)** — concentrate on custom query methods; generated CRUD rarely repays unit tests and is better served by integration tests

**Metrics** (what coverage reports break down): Statements, Branches, Functions, Lines

### Test Types and Scope

1. **Unit Tests**
   - Verify behavior of individual services, functions, or classes
   - Mock all external dependencies (DB, APIs, message queues)
   - One table-driven test per unit with branching logic, cases as rows (`testing-principles`, Test Selection)
   - Focus on business logic correctness

2. **Integration Tests**
   - Verify coordination between layers (Controller → Service → Repository)
   - Use a real database test instance of the engine production runs (`testing-principles`, Test Selection)
   - Use real HTTP through Supertest
   - Test API contracts end-to-end within the service

3. **Property-Based Tests (fast-check)**
   - Verify invariants hold across random inputs
   - Use for: parsers, validators, serializers, mathematical operations
   - When to write one: `testing-principles`, "Property-Based Testing"

## Red-Green-Refactor Process (Test-First Development)

**Recommended Principle**: Start each change that adds behaviour with a failing test — behaviour that passes `testing-principles`, Test Selection; a constant, type, or wiring step gets no test of its own

The cycle itself is `testing-principles`, "The RED-GREEN-REFACTOR Cycle".

**NG Cases (Test-first not required)**:
- Pure configuration file changes (nest-cli.json, ormconfig.ts, etc.)
- Documentation-only updates
- Emergency production incident response (post-incident tests mandatory)

## Test Design Principles

### Test Case Structure

- Tests consist of three stages: "Arrange," "Act," "Assert"
- Clear naming that shows purpose of each test
- One test case verifies only one behavior

### Test Data Management

- Manage test data where the project's test layout keeps it
- Use factory functions or builder patterns for test data creation
- Always mock sensitive information (API keys, credentials)
- Keep test data minimal — only data directly related to test verification
- Use database fixtures or seeding for integration tests

### Mock and Stub Usage Policy

**Recommended: Mock external dependencies in unit tests**
- Mock database connections, external API clients, message queues
- Mock at the boundary — not internal functions

**For integration tests: Use real dependencies**
- Real database (a test instance of the production engine)
- Real HTTP stack through Supertest
- Mock only truly external services (third-party APIs)

### Test Failure Response Decision Criteria

A failing test that already existed before this task is resolved by fixing the implementation. When the test itself looks wrong — a wrong expected value, a feature that no longer exists — deleting or weakening it is escalated, never done to get green (`testing-principles`, Keep Tests Active). A test written in this task is fixed freely.

## Test Implementation Conventions

### Directory Structure

Follow the project's existing test layout. When none exists, one common shape:

```
src/
├── users/
│   ├── users.service.ts
│   ├── users.controller.ts
│   ├── __tests__/
│   │   ├── users.service.test.ts
│   │   ├── users.controller.test.ts
│   │   └── users.integration.test.ts
│   └── index.ts
```

**Rationale**: tests sit next to the module they cover, and unit and integration tests are told apart by file name.

### Naming Conventions

- Test files: `{module}.{layer}.test.ts` (e.g., `users.service.test.ts`)
- Integration test files: `{feature}.integration.test.ts`
- Test suites: Names describing target module or feature
- Test cases: Names describing expected behavior from caller perspective

### Test Code Quality Rules

**Recommended: Keep all tests always active**
- Fix problematic tests and activate them

**Avoid: `test.skip()` or commenting out**
- Creates test gaps and incomplete quality checks
- Solution: fix the test, or escalate its removal (`testing-principles`, Keep Tests Active)

## Service Testing Patterns

### Unit Testing Services

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserService } from '../users.service'
import type { UserRepository } from '../users.repository'
import { NotFoundError } from '../errors'

describe('UserService', () => {
  let service: UserService
  let mockRepository: { findOne: ReturnType<typeof vi.fn>; save: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockRepository = {
      findOne: vi.fn(),
      save: vi.fn(),
    }
    // Test double with only the methods the service calls
    service = new UserService(mockRepository as unknown as UserRepository)
  })

  it('should return user when found', async () => {
    const expectedUser = { id: '1', name: 'John', email: 'john@example.com' }
    mockRepository.findOne.mockResolvedValue(expectedUser)

    const result = await service.findById('1')

    expect(result).toEqual(expectedUser)
    expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } })
  })

  it('should throw NotFoundError when user not found', async () => {
    mockRepository.findOne.mockResolvedValue(null)

    await expect(service.findById('999')).rejects.toThrow(NotFoundError)
  })
})
```

### Integration Testing with Supertest

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import type { Express } from 'express'
import { createApp } from '../app'

describe('POST /api/users', () => {
  let app: Express
  let shutdown: () => Promise<void> // closes the DB connection the app opened

  beforeAll(async () => {
    ;({ app, shutdown } = await createApp({ database: 'test' }))
  })

  afterAll(async () => {
    await shutdown()
  })

  it('should create user and return 201', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'Jane', email: 'jane@example.com' })
      .expect(201)

    expect(response.body).toMatchObject({
      name: 'Jane',
      email: 'jane@example.com',
    })
    expect(response.body.id).toBeDefined()
  })

  it('should return 400 for invalid email', async () => {
    await request(app)
      .post('/api/users')
      .send({ name: 'Jane', email: 'not-an-email' })
      .expect(400)
  })
})
```

### Property-Based Testing with fast-check

```typescript
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { parseUserId } from '../utils/parse-user-id'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

describe('parseUserId', () => {
  it('should round-trip: format(parse(id)) === id for valid UUIDs', () => {
    fc.assert(
      fc.property(fc.uuid(), (uuid) => {
        const parsed = parseUserId(uuid)
        expect(parsed.toString()).toBe(uuid)
      })
    )
  })

  it('should reject non-UUID strings', () => {
    fc.assert(
      fc.property(
        fc.string().filter((s) => !UUID_RE.test(s)),
        (invalidId) => {
          expect(() => parseUserId(invalidId)).toThrow()
        }
      )
    )
  })
})
```

## Test Quality Criteria

The criteria are `testing-principles`, "Test Quality Criteria"; these are their backend forms.

### Literal Expected Values

Use hardcoded literal values for assertions:
```typescript
expect(calculatePrice(100, 0.1)).toBe(110)
expect(formatDate(new Date('2025-01-15'))).toBe('2025-01-15')
expect(user.role).toBe('admin')
```

### Result-Based Verification

Verify final results and outcomes:
```typescript
expect(mockRepository.save).toHaveBeenCalledWith({ name: 'test', email: 'test@example.com' })
expect(result).toEqual({ id: '1', status: 'created' })
expect(response.statusCode).toBe(201)
```

### Meaningful Assertions

Every test must include at least one `expect()` that validates observable behavior.

### Appropriate Mock Scope

Mock only direct external I/O dependencies. Internal utilities use real implementations:
```typescript
vi.mock('../repositories/user.repository') // External I/O — mock
vi.mock('../clients/email.client')          // External API — mock
// Internal validators, formatters, mappers — use real implementations
```

## Database Testing Patterns

### Test Database Setup

- Use a separate test database instance of the production engine
- Run migrations before test suite
- Clean data between tests (truncate or transaction rollback)
- Seed with minimal required data per test

### Transaction Rollback Pattern

The transaction must run on the same connection the code under test uses. `BEGIN` sent through a pooled `dataSource.query` lands on an arbitrary connection and isolates nothing; hand the code under test the transaction's own manager, or clean up by truncation instead.

```typescript
let queryRunner: QueryRunner

beforeEach(async () => {
  queryRunner = dataSource.createQueryRunner()
  await queryRunner.connect()
  await queryRunner.startTransaction()
  service = new UserService(queryRunner.manager.getRepository(User))
})

afterEach(async () => {
  await queryRunner.rollbackTransaction()
  await queryRunner.release()
})
```

### Avoid Shared State

- Each test creates its own data
- Never depend on data created by another test
- Use unique identifiers to prevent collision in parallel runs
