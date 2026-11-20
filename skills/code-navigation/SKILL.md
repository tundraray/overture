---
name: code-navigation
description: This skill governs how to locate code — using LSP for anything that follows a symbol through the codebase, and text search only to reach a first anchor or where no symbol exists. Automatically loaded when finding where a symbol is defined, finding usages or call sites, assessing rename impact, or when "navigate", "find usages", "call sites", "references", "where is X defined", or "impact of renaming" are mentioned.
---

# Code Navigation

## Load LSP First

`LSP` is a deferred tool: it is not callable until its schema is loaded. Before the first symbol lookup of a run, call `ToolSearch` with `select:LSP`. An agent that skips this has only text search, and answers every symbol question with it. If `LSP` is already in the tool list, call it directly. If `ToolSearch` is not available or `select:LSP` returns nothing, use text search and say so in the result.

## The Rule

**Text search reaches a first anchor. LSP follows the symbol from there.**

*"Where does this string appear?"* is a text question; *"what uses this symbol?"* is a semantic one. Grep for `OrderService` returns the class, a comment mentioning it, a log string and a same-named symbol in another module, and misses every use through `import { OrderService as Svc }`. `findReferences` returns exactly the uses the compiler resolves, in one call that answers in under a second.

Every LSP operation needs a position — `filePath`, `line`, `character`, all 1-based — so a lookup that starts from a bare name takes one Grep or Glob to get there:

```
1. Anchor      Grep "class OrderService"  →  src/orders/service.ts:42
2. Traverse    LSP findReferences at 42:7 →  every resolved use
```

Once a symbol's position is known, keep using it for each further question about that symbol.

## Tool by Question

| Question | Tool | Operation |
|----------|------|-----------|
| Where is this symbol defined? | LSP | `goToDefinition` |
| What uses this symbol? What breaks if I rename or change it? | LSP | `findReferences`, then read each site |
| Who calls this function? | LSP | `prepareCallHierarchy` → `incomingCalls` |
| What does this function call? | LSP | `prepareCallHierarchy` → `outgoingCalls` |
| What implements this interface? | LSP | `goToImplementation` |
| What is this symbol's type or doc? | LSP | `hover` |
| What is declared in this file? | LSP | `documentSymbol` |
| Where is a symbol named roughly X? | LSP | `workspaceSymbol` with a non-empty `query`; pass any file of the target language as the position |
| Which files match a name pattern? | Glob | — |
| Where does a literal string, a config key, a template variable, a log format or a TODO appear? | Grep | — |

## When LSP Gives Nothing

Text search answers a symbol question only for a reason you can name, recorded where the finding is reported:

| Reason | What to record |
|--------|----------------|
| LSP returned nothing, or only the declaration itself, for a symbol that demonstrably has uses | `"findReferences returned 0 for OrderService at service.ts:42"` |
| No language server is configured for this file type | `"no LSP server for .erb; text search used"` |
| The operation errored | The error text |
| `LSP` could not be loaded — no `ToolSearch`, or `select:LSP` returned nothing | `"LSP tool not available; text search used"` |

A text result on a symbol question is a **candidate set, not an answer**: read each hit and discard comments, strings, and same-named symbols from other modules. Report counts with their source — "7 call sites (findReferences)" and "23 matches (grep)" are different claims.

## Delegating a Wide Search

For any agent other than `code-explorer` itself. When a lookup exceeds the agent's own scope — every caller of a symbol across the repository, all consumers of a contract, files outside the paths handed to the agent — spawn `code-explorer` rather than sweeping the repository:

```
subagent_type: code-explorer   # or <plugin>:code-explorer, as the Agent tool lists it
prompt: "query: <what to locate>; breadth: focused|medium|thorough"
```

Pass its JSON through to whatever consumes the agent's output rather than restating it: the `resolvedBy` and `confidence` fields distinguish an LSP-resolved reference from a text match, and a summary loses that.

**Spawn only `code-explorer`** — and, for a document author, `document-reviewer` for its draft check (`documentation-criteria`, "Draft Check"). Any other agent routes back through the orchestrator, which owns sequencing and the stop points. Within the agent's own scope, navigate directly per the rules above — spawning to answer a question the agent could resolve itself spends an invocation to save nothing.

## Escalation

Stop and return `escalation_needed` with what was found — the orchestrator puts the question to the user — when:

- LSP reports no server for a file type central to the task, and the answer depends on resolution the text cannot provide — for example, assessing rename impact across a language the server does not cover
- LSP and text search disagree on whether a symbol is used, and the difference changes what you would do. Report both counts and the discrepancy rather than picking the convenient one.
- A symbol resolves into generated or vendored code, so the real definition lives in a generator or upstream package rather than in this repository
