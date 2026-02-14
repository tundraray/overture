---
name: typescript-rules-backend
description: This skill provides backend TypeScript development rules including functions-over-classes design, NestJS/TypeORM patterns, layered error handling, streaming, and memory management. Automatically loaded when implementing backend TypeScript services, APIs, or when "NestJS", "backend TypeScript", "API service", "TypeORM", or "server-side TypeScript" are mentioned.
---

# TypeScript Development Rules (Backend)

## Basic Principles

- **Functions Over Classes**: Prefer pure functions and function composition. Use classes only when the framework requires it (NestJS controllers/services, TypeORM entities)
- **YAGNI Principle**: Don't implement until necessary — no speculative abstractions
- **Aggressive Refactoring**: Prevent technical debt; delete unused code immediately

## Comment Writing Rules

- **Function Description Focus**: Describe what the code "does"
- **No Historical Information**: Do not record development history
- **Timeless**: Write only content that remains valid whenever read
- **Conciseness**: Keep explanations to necessary minimum

## Type Safety

**Absolute Rule**: `any` type is completely prohibited. It disables type checking and becomes a source of runtime errors.

**`any` Type Alternatives (Priority Order)**
1. **`unknown` Type + Type Guards**: Use for validating external input (API request bodies, environment variables, message queue payloads)
2. **Generics**: When type flexibility is needed across services
3. **Union Types / Intersection Types**: Combinations of multiple types
4. **Type Assertions (Last Resort)**: Only when type is certain and documented

**Type Guard Implementation Pattern**
```typescript
function isCreateUserDto(value: unknown): value is CreateUserDto {
  return typeof value === 'object' && value !== null && 'email' in value && 'name' in value
}
```

**Modern Type Features**
- **`satisfies` Operator**: `const config = { port: 3000 } satisfies AppConfig` — Preserves inference
- **`const` Assertion**: `const ROLES = ['admin', 'user', 'viewer'] as const` — Immutable and type-safe
- **Branded Types**: `type UserId = string & { __brand: 'UserId' }` — Distinguish domain identifiers
- **Template Literal Types**: `type EventName = \`on${Capitalize<string>}\`` — Express string patterns with types

**Type Safety in Backend Implementation**
- **API Request Bodies**: Always receive as `unknown`, validate with Zod/class-validator before processing
- **Environment Variables**: Treat as `unknown`, validate at startup — fail fast on missing required values
- **Database Query Results**: Trust ORM type mappings; validate raw query results
- **Message Queue Payloads**: Treat as `unknown`, validate with schema before processing
- **Configuration Files**: Validate at application startup, not at usage sites

**Type Safety in Data Flow**
- **Client → Server**: Request body (`unknown`) → Validation (Zod/class-validator) → DTO (Type Guaranteed) → Service
- **Server → Database**: DTO → Entity mapping → ORM (Type Guaranteed) → Database
- **Database → Server**: Query result (ORM typed) → Response DTO → Serialization → Client

**Type Complexity Management**
- **DTO Design**: Keep DTOs flat; max 2 levels of nesting. Split complex DTOs into composition
- **Generic Services**: Max 3 type parameters. If more needed, reconsider design
- **Type Assertions**: Review design if used 3+ times in a module

## Coding Conventions

**Function Design**
- **Functions Over Classes**: Default to exported functions for business logic
- **0-2 parameters maximum**: Use object for 3+ parameters
  ```typescript
  // ✅ Object parameter
  function createUser({ name, email, role }: CreateUserParams): Promise<User> {}
  ```
- **Pure Functions**: Minimize side effects; isolate I/O at boundaries
- **Single Responsibility**: One function does one thing

**NestJS Patterns (when using NestJS)**
- **Controllers**: Thin — validate input, call service, return response. No business logic
- **Services**: Business logic lives here. Inject repositories, not raw database connections
- **Repositories**: Data access layer. Custom repository methods for complex queries
- **Modules**: Feature-based module organization. Avoid circular dependencies
- **Guards/Interceptors/Pipes**: Cross-cutting concerns — auth, logging, validation, transformation

```typescript
// ✅ Thin controller — delegates to service
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(dto)
  }
}
```

**TypeORM Patterns (when using TypeORM)**
- **Entities**: Define with decorators. Use strict column types matching database schema
- **Migrations**: Always use migrations for schema changes. Never use `synchronize: true` in production
- **Query Builder**: Prefer repository methods. Use QueryBuilder only for complex joins/aggregations
- **Relations**: Define as lazy or eager explicitly. Avoid N+1 queries

**Dependency Injection**
- **Constructor Injection**: Standard pattern for NestJS services
- **Factory Functions**: For non-NestJS modules, use factory functions that accept dependencies as parameters

**Asynchronous Processing**
- **Promise Handling**: Always use `async/await`
- **Concurrent Operations**: Use `Promise.all()` for independent operations, `Promise.allSettled()` when partial failure is acceptable
- **Stream Processing**: Use Node.js streams for large data sets (files, DB result sets)

**Environment Variables**
- **Validate at startup**: Fail fast if required variables are missing
- **Centralize configuration**: Single config module/service that validates and exports typed config
- **Never access `process.env` directly** in business logic — always go through config layer

```typescript
// ✅ Centralized, validated config
const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  dbUrl: requiredEnv('DATABASE_URL'),
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
} satisfies AppConfig

function requiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}
```

**Security**
- **Input Validation**: Validate all external input at API boundary (controllers/middleware)
- **SQL Injection**: Use parameterized queries — never concatenate user input into queries
- **Secret Management**: Never log secrets. Use environment variables, not hardcoded values
- **Rate Limiting**: Apply to public endpoints. Use guards/middleware, not service logic
- **Authentication/Authorization**: Implement as guards, not inline checks in controllers

**Format Rules**
- Semicolon omission (follow project linter settings)
- Types in `PascalCase`, variables/functions in `camelCase`
- Use path aliases for imports (`@/`, `@app/`, etc.)

**Clean Code Principles**
- Delete unused code immediately
- Delete debug `console.log()`
- No commented-out code (manage history with version control)
- Comments explain "why" (not "what")

## Error Handling

**Absolute Rule**: Error suppression prohibited. All errors must have log output and appropriate handling.

**Layered Error Handling (Backend)**

Three distinct layers, each with specific responsibilities:

1. **API Layer (Controllers/Middleware)**
   - Catch service errors, map to HTTP status codes
   - Return consistent error response format
   - Log request context (method, path, user ID)

2. **Service Layer (Business Logic)**
   - Throw domain-specific errors (ValidationError, NotFoundError, ConflictError)
   - Include context in error messages (what was being done, with what data)
   - Never catch and suppress — either handle or propagate

3. **Repository Layer (Data Access)**
   - Convert database errors to domain errors
   - Handle connection failures, deadlocks, constraint violations
   - Retry transient failures (connection drops, deadlocks) with backoff

```typescript
// ✅ Layered error handling
// Repository layer
async findById(id: string): Promise<User> {
  const user = await this.repository.findOne({ where: { id } })
  if (!user) throw new NotFoundError(`User not found: ${id}`)
  return user
}

// Service layer
async updateUser(id: string, dto: UpdateUserDto): Promise<User> {
  const user = await this.userRepository.findById(id) // Throws NotFoundError
  Object.assign(user, dto)
  return this.userRepository.save(user)
}

// Controller layer (NestJS exception filter handles mapping)
@Put(':id')
async update(@Param('id') id: string, @Body() dto: UpdateUserDto): Promise<UserResponseDto> {
  return this.userService.updateUser(id, dto)
}
```

**Fail-Fast Principle**: Fail quickly on errors to prevent continued processing in invalid states
```typescript
// ✅ Required: Explicit failure
catch (error) {
  logger.error('Processing failed', { error, context })
  throw error
}
```

**Custom Error Classes**
```typescript
export class AppError extends Error {
  constructor(message: string, public readonly code: string, public readonly statusCode = 500) {
    super(message)
    this.name = this.constructor.name
  }
}
// Purpose-specific: ValidationError(400), NotFoundError(404), ConflictError(409), ApiError(502)
```

**Structured Logging**
- Use structured logger (pino, winston) — not `console.log`
- Include correlation IDs for request tracing
- Never log sensitive information (passwords, tokens, API keys, PII)

## Streaming and Memory Management

**Stream Processing**
- Use Node.js streams for processing files, large database result sets, and bulk operations
- Prefer `pipeline()` over `.pipe()` for proper error handling and cleanup

```typescript
import { pipeline } from 'stream/promises'

// ✅ Stream large file processing
await pipeline(
  createReadStream('input.csv'),
  new CsvParser(),
  new TransformStream(),
  createWriteStream('output.json'),
)
```

**Memory Leak Prevention**
- Clean up event listeners in service shutdown hooks (`onModuleDestroy`)
- Use `WeakMap`/`WeakRef` for caches that should not prevent garbage collection
- Set explicit timeouts on all external connections (HTTP, DB, Redis)
- Monitor memory usage in production; set container memory limits

## Refactoring Techniques

**Basic Policy**
- Small Steps: Maintain always-working state through gradual improvements
- Safe Changes: Minimize the scope of changes at once
- Behavior Guarantee: Ensure existing behavior remains unchanged while proceeding

**Implementation Procedure**: Understand Current State → Gradual Changes → Behavior Verification → Final Validation

**Priority**: Duplicate Code Removal > Large Function Division > Complex Conditional Branch Simplification > Type Safety Improvement

## Performance Optimization

- **Database Queries**: Use indexes, avoid N+1 queries, paginate large result sets
- **Caching**: Apply at service layer — Redis for shared state, in-memory for single-instance
- **Connection Pooling**: Configure appropriate pool sizes for database and Redis connections
- **Lazy Loading**: Load expensive resources on demand, not at startup
- **Batch Processing**: Process bulk operations in batches to control memory usage
