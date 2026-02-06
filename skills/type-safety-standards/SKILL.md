---
name: type-safety-standards
description: Frontend type safety patterns for React/TypeScript including runtime validation with Zod, discriminated unions, branded types, type guards, and performance optimization. Automatically loaded when implementing API integrations, form handling, state management with strict typing, or when "Zod schema", "type guard", "branded type", "runtime validation", or "discriminated union" are mentioned.
---

# Frontend Type Safety Standards

**Pattern**: Strict TypeScript + Runtime Validation + Type Guards

Comprehensive type safety across frontend code using **TypeScript strict mode**, **runtime validation at boundaries**, and **type guards** for complex types.

> **Scope**: This skill covers type safety *patterns and techniques*. For general TypeScript/React rules (component design, state management, error handling), see `typescript-rules`.

## Runtime Validation with Zod

Validate at trust boundaries: API responses, user input, URL parameters, localStorage, and any external data source.

### Schema Definition and Type Derivation

Always derive TypeScript types from Zod schemas to prevent schema-type drift:

```typescript
import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  displayName: z.string().min(1),
  email: z.string().email(),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    locale: z.string(),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Derive type from schema - single source of truth
export type UserProfile = z.infer<typeof UserProfileSchema>;
```

### API Response Validation

```typescript
async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const response = await fetch(`/api/users/${userId}`);
  const data: unknown = await response.json();

  const result = UserProfileSchema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid user profile data: ${result.error.message}`);
  }

  return result.data;
}
```

### Form Input Validation

```typescript
const ContactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

function handleSubmit(formData: unknown) {
  const result = ContactFormSchema.safeParse(formData);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    setFieldErrors(errors);
    return;
  }

  submitForm(result.data); // Type-safe after validation
}
```

## Discriminated Unions and Type Guards

### Defining Discriminated Unions

Use a shared literal field (`type`, `kind`, `status`) as the discriminant:

```typescript
export type MediaElement =
  | { type: 'image'; id: string; src: string; alt?: string }
  | { type: 'video'; id: string; src: string; poster?: string }
  | { type: 'text'; id: string; content: string; fontSize: number };
```

### Type Guards for Discriminated Unions

```typescript
export function isImageElement(
  element: MediaElement
): element is Extract<MediaElement, { type: 'image' }> {
  return element.type === 'image';
}

export function isVideoElement(
  element: MediaElement
): element is Extract<MediaElement, { type: 'video' }> {
  return element.type === 'video';
}
```

### Exhaustiveness Checking

Ensure all union variants are handled at compile time:

```typescript
function renderElement(element: MediaElement): JSX.Element {
  switch (element.type) {
    case 'image':
      return <img src={element.src} alt={element.alt} />;
    case 'video':
      return <video src={element.src} poster={element.poster} />;
    case 'text':
      return <p style={{ fontSize: element.fontSize }}>{element.content}</p>;
    default: {
      const _exhaustive: never = element;
      return _exhaustive;
    }
  }
}
```

## Branded Types

Prevent accidental interchange of structurally identical types:

```typescript
type UserId = string & { readonly __brand: 'UserId' };
type WorkspaceId = string & { readonly __brand: 'WorkspaceId' };
type OrderId = string & { readonly __brand: 'OrderId' };

// Constructor functions for branded types
function toUserId(id: string): UserId {
  return id as UserId;
}

function toWorkspaceId(id: string): WorkspaceId {
  return id as WorkspaceId;
}

// Compile-time safety: cannot mix ID types
function getUser(userId: UserId): Promise<User> { /* ... */ }
function getWorkspace(workspaceId: WorkspaceId): Promise<Workspace> { /* ... */ }

const userId = toUserId('user-123');
const workspaceId = toWorkspaceId('ws-456');

getUser(userId);        // OK
getUser(workspaceId);   // Compile error - type mismatch
```

## Type Assertion Avoidance

### DON'T: Assert Without Validation

```typescript
// UNSAFE: No runtime guarantee that data matches type
const data = await fetch('/api/data').then(res => res.json());
const user = data as User;
```

### DO: Validate Then Use

```typescript
const data: unknown = await fetch('/api/data').then(res => res.json());
const result = UserSchema.safeParse(data);
if (!result.success) {
  throw new Error('Invalid user data');
}
const user = result.data; // Type-safe without assertion
```

### DO: Assertion Functions for Reusable Validation

```typescript
function assertIsUser(value: unknown): asserts value is User {
  const result = UserSchema.safeParse(value);
  if (!result.success) {
    throw new Error(`Not a valid user: ${result.error.message}`);
  }
}

const data: unknown = loadFromStorage();
assertIsUser(data);
// TypeScript knows data is User from here
```

## Generic Component Typing

### Typed List Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
}

function TypedList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items',
}: ListProps<T>) {
  if (items.length === 0) return <p>{emptyMessage}</p>;

  return (
    <ul>
      {items.map((item, index) => (
        <li key={keyExtractor(item)}>{renderItem(item, index)}</li>
      ))}
    </ul>
  );
}

// Usage preserves type inference
<TypedList
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
  keyExtractor={(user) => user.id}
/>
```

### Typed Select/Dropdown

```typescript
interface SelectProps<T extends string> {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (value: T) => void;
}

function TypedSelect<T extends string>({
  value,
  options,
  onChange,
}: SelectProps<T>) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
```

## State Type Safety

### Typed Reducer with Discriminated Actions

```typescript
type CounterState = { count: number; lastAction: string };

type CounterAction =
  | { type: 'increment'; payload: number }
  | { type: 'decrement'; payload: number }
  | { type: 'reset' };

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment':
      return { count: state.count + action.payload, lastAction: 'increment' };
    case 'decrement':
      return { count: state.count - action.payload, lastAction: 'decrement' };
    case 'reset':
      return { count: 0, lastAction: 'reset' };
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
```

### Typed Context with Null Safety

```typescript
interface AuthContext {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

function useAuth(): AuthContext {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

## Result Type Pattern for Typed Error Handling

```typescript
type ResultSuccess<T> = { success: true; data: T };
type ResultError<E = string> = { success: false; error: E };
type Result<T, E = string> = ResultSuccess<T> | ResultError<E>;

// Usage in API layer
async function fetchUsers(): Promise<Result<User[], ApiError>> {
  try {
    const response = await fetch('/api/users');
    const data: unknown = await response.json();
    const parsed = UsersSchema.safeParse(data);

    if (!parsed.success) {
      return { success: false, error: { code: 'VALIDATION', message: parsed.error.message } };
    }

    return { success: true, data: parsed.data };
  } catch (err) {
    return { success: false, error: { code: 'NETWORK', message: String(err) } };
  }
}

// Consumer handles both cases explicitly
const result = await fetchUsers();
if (!result.success) {
  showError(result.error.message);
  return;
}
renderUserList(result.data); // Type-narrowed to User[]
```

## Zod Performance Optimization

### When to Optimize

| Validation Frequency     | Schema Complexity    | Strategy                              |
| ------------------------ | -------------------- | ------------------------------------- |
| Once per page load       | Simple (<10 fields)  | Full validation                       |
| Once per page load       | Complex (50+ fields) | Use `.pick()` for critical path       |
| Multiple times (list)    | Any                  | Use `.pick()` or cache results        |
| Real-time (10+ per sec)  | Any                  | Cache + lazy validation               |
| High-frequency (60+/sec) | Any                  | Skip Zod, use manual type guards      |

### Partial Validation with .pick()

```typescript
// Full schema for detail view
const ItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.object({
    body: z.string(),
    metadata: z.record(z.unknown()),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Lightweight schema for list views
const ItemListSchema = ItemSchema.pick({
  id: true,
  title: true,
}).extend({
  content: z.unknown(),
});
```

### Validation Caching

```typescript
const validationCache = new Map<string, z.infer<typeof ItemSchema>>();

function validateCached(data: unknown, cacheKey: string) {
  const cached = validationCache.get(cacheKey);
  if (cached) return { success: true as const, data: cached };

  const result = ItemSchema.safeParse(data);
  if (result.success) {
    validationCache.set(cacheKey, result.data);
  }
  return result;
}
```

### Schema Precompilation

```typescript
// DON'T: Create schema inside function (re-created every call)
function validate(data: unknown) {
  const schema = z.object({ id: z.string() });
  return schema.parse(data);
}

// DO: Define schema at module level (created once)
const REQUEST_SCHEMA = z.object({ id: z.string() });

function validate(data: unknown) {
  return REQUEST_SCHEMA.parse(data);
}
```

### Coercion for Type Conversion

```typescript
// Slower: manual validation + transform
const SlowSchema = z.object({
  count: z.string().refine(val => !isNaN(Number(val))).transform(Number),
});

// Faster: built-in coercion
const FastSchema = z.object({
  count: z.coerce.number(),
  enabled: z.coerce.boolean(),
});
```

### High-Frequency Operations: Manual Type Guards

For operations at 60+ validations/second (drag, scroll, animation), skip Zod:

```typescript
function isValidPosition(data: unknown): data is { x: number; y: number } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'x' in data &&
    'y' in data &&
    typeof (data as Record<string, unknown>).x === 'number' &&
    typeof (data as Record<string, unknown>).y === 'number'
  );
}
```

## Testing Type Safety

### Compile-Time Type Tests

```typescript
describe('Type Safety', () => {
  it('should reject invalid discriminated union members', () => {
    const valid: MediaElement = {
      type: 'image',
      id: '123',
      src: 'photo.jpg',
    };

    // @ts-expect-error - video elements require src, not alt alone
    const invalid: MediaElement = {
      type: 'video',
      id: '456',
      alt: 'Missing required fields',
    };
  });

  it('should prevent branded type mixing', () => {
    const userId = toUserId('user-1');
    const workspaceId = toWorkspaceId('ws-1');

    // @ts-expect-error - cannot pass WorkspaceId where UserId expected
    getUser(workspaceId);
  });
});
```

### Runtime Validation Tests

```typescript
describe('Schema Validation', () => {
  it('should accept valid user profile', () => {
    const valid = { id: crypto.randomUUID(), displayName: 'Test', /* ... */ };
    expect(UserProfileSchema.safeParse(valid).success).toBe(true);
  });

  it('should reject profile with missing required fields', () => {
    const invalid = { id: 'not-a-uuid' };
    const result = UserProfileSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
```

## Risks and Mitigations

| Risk                          | Mitigation                                                      |
| ----------------------------- | --------------------------------------------------------------- |
| Type assertions bypass safety | Prefer type guards and runtime validation; review `as` usage    |
| `any` escape hatch overuse    | ESLint `no-explicit-any` rule; see `typescript-rules` skill     |
| Schema and type drift         | Derive types with `z.infer`; co-locate schema and type          |
| Over-validation performance   | Validate at boundaries only; use optimization strategies above  |
| External data corruption      | Always treat external data as `unknown`; validate before use    |
