---
name: technical-design
description: This skill governs how a Design Doc and an ADR are authored — inputs, the code investigation before design, scope agreement, change impact, contracts, the no-code rule, update mode, the draft check and response to the caller, and the author's self-validation. Automatically loaded when writing or revising a Design Doc or an ADR, or when "design doc", "ADR", "technical design", "change impact", "no code in design", "acceptance criteria scoping", or "design self-validation" are mentioned.
---

# Technical Design

How `technical-designer` and `technical-designer-frontend` author a Design Doc and an ADR. Each agent adds the questions, sweeps, and checks of its layer; where the two differ only in nouns, a component, a prop, and a usage site stand for an operation, a field, and a caller.

## Responsibilities

1. Identify and evaluate technical options
2. Create the Design Doc for a part, and the ADR when a decision passes the test
3. Define acceptance criteria that a test can verify
4. Analyze trade-offs and verify consistency with the existing architecture
5. Research current technology information and cite sources

## Documents

- **Design Doc**: one per part at medium and large scale, at `docs/features/[feature-name]/design-[part].md`, from `design-template.md` in `documentation-criteria`
- **ADR**: written after the Design Doc is approved, in a separate call with the same part, only when a decision the design made passes the test in `documentation-criteria`, "ADR Creation Conditions". The `adrSignals` from requirement analysis say what to test; they do not decide. Path `docs/adr/ADR-[4-digit number]-[title].md` from `adr-template.md`: check existing numbers and use max+1; initial status is `Proposed`

## Required Information

- **Operation Mode**: `create` (default) or `update`
- **Requirements Analysis Results**: scale determination, technical requirements
- **PRD**: the PRD document (if it exists)
- **focusAreas**: the fact-gathering output (`codebase-analyzer`, or `ui-analyzer` for a frontend part) — each entry is disposed of in the template's "Appendix: Fact Disposition"; the evidence stays in the analyzer output
- **Part**: the part this design covers, from the PRD's Delivery Parts — its name, the requirements it owns, and `dependsOn` with the approved `design-{part}.md` path of each. The design covers exactly these requirements; a sibling part's requirement appears only as a consumed contract, never as a redesign. A missing part name is a blocking input — do not invent one.
- **Documents to Create**: Design Doc, or ADR
- **Existing Architecture Information**: current technology stack, adopted architecture patterns, technical constraints, and the list of existing common ADRs (mandatory verification)
- **Update Context** (update mode only): path to the existing document, reason for changes, sections needing updates

## Existing Code Investigation【Required】

Performed before the Design Doc. A design is a proposal for how new work joins existing work; written without looking, it describes a system that does not exist — correct in isolation, wrong at every seam.

**Delegate the sweep.** Spawn `code-explorer` rather than sweeping the repository here: it resolves symbols with LSP before falling back to text search, so a call-site list is what the compiler resolves rather than what a string matched. Within files already in hand, navigate directly per `code-navigation`. The agent lists the questions to ask for its layer.

```
subagent_type: code-explorer   # or <plugin>:code-explorer, as the Agent tool lists it
prompt: "query: how outbound webhooks are registered and dispatched today; breadth: thorough"
```

**Similar functionality** (Pattern 5 prevention from `ai-development-guide`). Run the search before deciding, and act on what it returns:

- **Similar functionality found** → use that implementation; do not create a new one
- **Similar functionality is technical debt** → propose the improvement as a Key Decision before building alongside it
- **None found** → proceed with a new implementation, and record `coverage.searched` as the evidence

"No existing abstraction fits" is a claim, and the sweep's coverage is what supports it. Without that evidence a second way of doing the same thing enters the codebase by default rather than by decision.

**Existing interface** (when changing an existing feature). List the target unit's public surface — the 5 most significant when there are more than 10. Its consumers come from the Change Impact sweep.

**Use the results in the Design Doc.** State the similar-functionality outcome in the Key Decision it drives — the implementation found, or "none, having searched <coverage>". Carry `code-explorer` counts with their `resolvedBy`: an LSP-resolved consumer list is evidence, a text-matched one is a candidate list, and the Design Doc does not present them as the same thing.

**Self-serve before recording an open question.** A fact discoverable in the code is answered, not deferred: run one `code-explorer` query before an unknown becomes an `openQuestions` entry, and one broader retry (`breadth: thorough`) when the first comes back empty. Then stop — a product or priority call, another team's decision, or a genuine contradiction between sources goes to the user. The entry records what was searched, so the reader can tell a decision nobody can make from a lookup nobody ran.

## Scope Agreement【Most Important】

Performed at the beginning of Design Doc creation. List what was agreed with the user: what changes, what does not, and the constraints — parallel operation, compatibility, browser support, accessibility, performance targets and how they are measured.

Record them in the template's Part section as plain sentences: **Out of scope**, and **Constraints** with how the design meets each. No design element contradicts an agreement; one the design cannot meet is an open question, not a silent omission.

## Change Impact【Required】

Obtain the impact set from `code-explorer` rather than assuming it — assumed consumers are how a Design Doc ships a breaking change described as backward-compatible:

- Changing an interface, signature, schema, or props contract → `query: every consumer of <symbol>; breadth: thorough`
- Removing or renaming → `query: every reference to <symbol>; breadth: thorough`
- Claiming something is unaffected → only for what the sweep actually covered; check `coverage.notSearched` first

The design describes the change, not a list of files: new and changed elements show by node colour in the architecture diagrams, a change to an existing contract that existing callers must follow is a Key Decision saying how they keep working, and what stays untouched goes to Part, Out of scope. The list of files and components to change is the work plan's.

## Contracts at Component Boundaries【Required】

Define what crosses each component boundary in Contract Definitions — each operation's input, output (sync or async), and the failures the caller handles; for a UI component its props, events, and state-management contracts and how errors surface — at the design's altitude (`documentation-criteria` "Writing for the Reader"), one item per operation or prop group, in sentences.

Confirm and document conflicts with existing systems (priority, naming conventions, props patterns) to prevent integration inconsistencies.

**State Transitions** (when applicable): document state definitions and transitions for stateful components, and the invariants as plain sentences.

## Design Principles

1. **Consistency first**: follow existing patterns; document clear reasons when introducing a new one
2. **Appropriate abstraction**: design for the current requirements and apply YAGNI (follow project rules)
3. **Testability**: parameterized dependencies (dependency injection, function parameters, props) and mockable boundaries
4. **Test derivation from acceptance criteria**: use cases that prove each acceptance criterion through observable behaviour
5. **Explicit trade-offs**: evaluate the benefits and drawbacks of each option quantitatively

## Acceptance Criteria Scoping

Scope acceptance criteria to what an isolated CI run can verify: observable behaviour is in; real external connections (the boundary is mocked, and the Test Strategy names which), performance numbers, implementation detail, and exact layout are out.

- ❌ Implementation detail: "Data is stored using specific technology X"
- ✅ Observable behaviour: "Saved data can be retrieved after system restart"

Non-functional requirements come from the PRD's Non-Functional Requirements and are cited by NFR ID.

## No Code in Design Docs and ADRs

A Design Doc decides *what* is built and *how the parts meet*; the code is written once, at implementation. A code block in the design is a second copy that the implementer either retypes or contradicts, and every review round has to keep both in sync.

| Allowed | Not allowed |
|---|---|
| Identifiers exactly as in code (`ThreadsService`, `GET /api/threads`, `THREAD_NOT_FOUND`, `useThreads`, `onRename`) | Schema, type, component, or hook source (zod, TS interfaces, Props types, classes, DTOs, TSX, SQL DDL) — or the same copied into a table field by field, with column lists |
| Contracts, shapes, and props described per the template's Contract Definitions | Function bodies, "key fragments", snippets of changed files |
| Mermaid diagrams; file paths in Appendix: Fact Disposition and in the text under a diagram | Config files, styling code, command lines beyond the build/test commands the project already has |

## Diagrams

Read `mermaid-diagrams` `references/c4-levels.md` before drawing the first diagram. Which diagrams a Design Doc carries is set by the template and `documentation-criteria`, "Diagram Requirements".

## Update Mode

- **ADR**: update the existing file for minor changes; create a new file for major changes
- **Every revision** — after review feedback or a user change — follows `documentation-criteria` "Revising a Document", and saves the draft check's `diff_base` before its first edit ("Draft Check", step 2). A reviewer's fix request is never a reason to add code: a contract question is answered by extending the contract or props description, a test question by adding or sharpening a use case.

## Draft Check

After the Write and the `check-mermaid.mjs` run, unless the prompt says `draft_check: skip`, run the draft check per `documentation-criteria`, "Draft Check", with `doc_type: DesignDoc` or `ADR`, and return it as `draftCheck`. On an update or revision it runs on the diff against the saved copy.

## Response to Caller

```json
{
  "status": "completed|blocked|escalation_needed",
  "documents": [{"path": "docs/features/{feature}/design-{part}.md", "action": "created|updated"},
    {"path": "docs/adr/ADR-XXXX-title.md", "action": "created"}],
  "summary": "[what the document establishes, in one or two sentences]",
  "adrWritten": false,
  "adrRationale": "[which part of the three-part test failed, when no ADR was written]",
  "factsDisposed": {"total": 0, "unaddressed": []},
  "openQuestions": [
    {"question": "[what is unresolved]", "blocks": "[the decision it blocks]", "owner": "[who resolves it]"}
  ],
  "draftCheck": {"verdict": "[document-reviewer status, not_run, or skipped]", "fixed": ["[issue id: one line]"],
    "open": [{"severity": "[critical|important|recommended]", "issue": "[one line]", "why_open": "needs user decision|recommended|deferred|could not resolve"}]},
  "nextSteps": ["[what the caller should do next]"]
}
```

Return the path even when the run ends in `blocked`.

## Self-Validation [BLOCKING — before output]

The agent adds the items of its layer.

- [ ] Every `focusAreas` entry is disposed of per the template's "Appendix: Fact Disposition"
- [ ] The design covers exactly the requirements assigned to its part; every `dependsOn` contract is cited by link to the upstream design's contract section, not restated, and an insufficiency there is recorded as an open question against that design rather than redefined here
- [ ] Every agreement with the user is in Part (Out of scope, Constraints) or in the design itself; no design element contradicts one
- [ ] The change impact comes from a resolved consumer list, not an assumed one; a claim that something is unaffected covers only what the sweep reached; every changed existing contract is a Key Decision saying how existing callers keep working
- [ ] The ADR test was applied and its outcome recorded — an approved ADR, or which part of the test failed; existing ADRs whose decisions the design follows are linked under Part, Prerequisite ADRs
- [ ] An ADR, when written, restates its KD-n: its options are every option the KD names, each pro, con and consequence traces to the Design Doc, and nothing new is introduced — a claim not in the Design Doc is removed from the ADR, and a Design Doc change it would need goes in `nextSteps`; the approved Design Doc is not edited during ADR work
- [ ] Identifiers are written exactly as they appear in code, character for character
- [ ] No code: the document passes No Code in Design Docs and ADRs
- [ ] Test Strategy is a list of use cases; every acceptance criterion is named by a use case whose Given sets up that criterion's condition, or recorded as out of scope
- [ ] `check-mermaid.mjs` passed on the whole document in this pass (or the summary says it could not run and why)
- [ ] Cold read: from the Overview alone, a reader who has not followed the feature can say what this part does and how it works in outline
- [ ] `documentation-criteria` "Writing for the Reader" holds
- [ ] `prose` rules applied while drafting; one read-through of the written document as its reader found no stall
- [ ] Snapshot, Key Decisions and acceptance criteria match the body; no absolute (never, always, atomic, exactly once) is narrowed by a Risk, an Open Question or a failure path in the runtime flows
- [ ] On a revision, every place that depends on what changed agrees with it, and no cut left a reference to removed content (`documentation-criteria` "Revising a Document")
- [ ] The returned `documents[].path` matches the file actually written

## Latest Information Research

**Mandatory** when introducing a new technology or library, designing performance optimization or security-related implementation, and for a major version upgrade. **Recommended** before a complex algorithm and when improving an existing pattern. Confirm a new technology against more than one reliable source.

**Search patterns** (the current year from the operating environment, not training data):
- `[technology] [feature] best practices {current_year}` (new feature research)
- `[tech A] vs [tech B] comparison {current_year}` (technology selection)
- `[architecture pattern] [concern] patterns` (design patterns)
- `[framework] v[X] breaking changes migration guide` (version upgrade)
- `[library name] official documentation` (official docs need no year)

**Context7 MCP**, when available: `resolve-library-id` for each candidate library, then `query-docs`, and compare the results in the Key Decision or the ADR's options — before selecting a library, when checking current API patterns, and when verifying breaking changes between versions.

**Citation**: link each source where it is used — in the Design Doc, at the Key Decision it supports; in an ADR, under Related Information, one link per line.
