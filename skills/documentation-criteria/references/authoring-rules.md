# Authoring Rules

The rules every document author and reviewer follows, in every plugin.

## Writing for the Reader

A document is read far more often than it is written, and most readers stop after the first screen. Every PRD, UXRD, Design Doc, and ADR — and in gamedev every GDD, Feature Spec, market analysis, and analytics setup — follows these rules; the templates are laid out to match them. How the finished document reads, as a whole and sentence by sentence, is checked with the `prose` skill.

**The reader is cold.** They know the product and the codebase in general, but not this feature, and they read without the author or the conversation that produced the document — a teammate, the user at an approval stop, the implementer months later. **Lean** means the document says fewer things and says each one fully; the same content squeezed into shorthand is not lean, it is unreadable.

**Order.** A short header (status, date, links to the neighbouring documents — no more than five fields) → **Snapshot** → the body → the appendix (**Appendix: Fact Disposition** in a Design Doc, **Appendix: Traceability** in a work plan) → **Update History**, always last. A reader learns what the document decides before how it was researched or how it got here. An ADR's Status and Decision sections are its header and Snapshot, and it has no Update History: a changed decision is a new ADR that supersedes it.

**Snapshot.** At most ten lines at the top. It opens with **Overview** — three to five plain sentences telling what problem this solves and how, the way one explains it to a colleague: no IDs, no code names the reader has not met. Then what does not change, the biggest risk, and whether questions are open, with a link to them. A cold reader who stops there can say what the document decides. A Design Doc and a UXRD follow it with three to seven **Key Decisions** — in a Design Doc a `KD-n` heading with a paragraph of why and the options not taken, in a UXRD a table — not counted in the Snapshot's ten lines; the rest of the document cites `KD-n` instead of re-arguing the decision.

**Current truth only.** The body states what is true now. Who decided, on which date, in which version, or in answer to which review finding belongs to Update History and to git — not to requirements, acceptance criteria, table cells, or design text. "(user decision 2026-10-28)", "v1.2:", "per review I003" in the body are defects. Update History has one line per version, a phrase per change, no reviewer IDs.

**Delete, don't stub.** A section marked *when applicable* is deleted when it does not apply — no "N/A", no "does not exist", no placeholder sentence. Template guidance in `<!-- -->` comments is never copied into the document. A mandatory section that has nothing to say answers in one line with the reason.

**Short units.** A paragraph has at most four sentences. A table appears only where the reader compares several rows across the same columns. A table cell holds one phrase or short sentence; reasoning goes under the table or into Key Decisions. A list item is one statement.

**Sentences, not telegrams.** Write sentences with a subject and a verb, one idea each. A chain of noun phrases joined by commas, semicolons, and parentheses is shorthand only the author can expand — split it, or cut what the reader does not need. A table cell is one phrase a newcomer can read: "the event survives a crash because it is written in the same transaction", not "tx outbox, crash-safe". A table or diagram whose title does not say what it shows gets one lead sentence that does.

**Terms.** A word the cold reader may not know — a domain term, a technique, an abbreviation — is explained in a few words where it first appears. A document that leans on five or more such words gathers them in a short **Terms** list after the Snapshot instead.

**For people first.** The document is prose, lists, tables, and diagrams a person reads. No YAML or JSON block appears anywhere in it, the appendix included: a structured record is a table, a rule or invariant is a sentence (a work plan's frontmatter is metadata, not a block). Checklists of pointers or pre-ticked items, and tables that only map one ID set onto another, do not appear in the body — progress checkboxes a reader or executor ticks, as in a work plan or task file, are not such a checklist: traceability is written once where the reader meets it ("covers AC-03.1" on a use case), and a record kept for tools goes to the document's appendix. No sentence only tells the reader where else to look; the link sits where the reader needs it.

**One language.** The document is written in the project's document language. Section headings keep the template's wording, because other documents and agents link to them by anchor; everything under a heading — labels, table headers, text — is in the document's language.

**Words before IDs.** Prose names things in words and adds the ID in parentheses — "the open thread is marked as current (AC-01.2)" — not "AC-01.2, SB-06, UX-04". A list citing PRD requirements or criteria by ID only (Covers, From the PRD, a flow's "for") is allowed. Each ID is defined in exactly one place and cited everywhere else.

**Cite by path and ID, never by version.** A link to a neighbouring document names its path and the section or ID — `uxrd.md` MC-8 — not "UXRD v1.6"; a UXRD element is cited by its ID (TH-10), not by its section number. A version in a citation goes stale on the neighbour's next edit and turns every edit into a round of edits elsewhere.

**Write what this document decides, and only what is decided.** Every statement in a document is a promise that has to stay true. Detail that the document does not own, or that is not settled, goes stale and comes back as a review finding:
- **One owner per value.** A number, a UI string, a threshold, or a limit is written in the document that owns it. Everywhere else cites it by ID without repeating the value — "within the title latency budget (AC-17.1)", not "within 10 s (AC-17.1)". A repeated value drifts at the owner's next edit. The one exception is a work plan's Reference Contract Values, which copy a binding value verbatim next to its source because the executor reads the task without the design open.
- **Verified or assumed, never guessed.** A claim about how a library, framework, or existing code behaves is either verified — with how: the installed version, the code location, a spike — or written as an assumption with the check that will settle it in the plan. Internals that do not show at a contract boundary (call order inside a library, exception class names, props of a third-party component, the database lock mode or lock order behind an invariant) are not written at all; the design states the invariant, implementation decides the mechanism.
- **The design's altitude, not the code's.** A contract, schema, or data model is described at the level its consumer and reviewer need: what each operation does, what it returns, which failures the caller handles, what each field means. Storage lengths and sizes no caller observes, full column lists, query conditions, and update guards are code — restated as table rows they are still code, and go stale the same way. An exact value a caller or test observes at the contract — a limit, an enum value, a status code, a timeout, a setting's name and default — is written as it is; the work plan's Reference Contract Values copy it.
- **No references that go stale on their own.** No line numbers into another document or the codebase, no version tags in headers of generated files, no counts of something listed elsewhere — tasks, tests, cases ("19 tasks", "3/14"); a list counts itself, no status line that narrates which versions are pending.
- **Undecided stays an open question.** An acceptance criterion whose outcome is not decided cites the open question and states nothing else — no list of acceptable alternatives, no "guarantee" the design rates as low certainty. The decision is written once, when it is made.

**Size.** Soft targets for the document, in characters, excluding Update History: PRD or Feature Spec lite 15 000, PRD or Feature Spec full 30 000, UXRD 40 000, design-system component spec 6 000, Design Doc 45 000 per part (appendix included), ADR 10 000. Over the target, the author merges restated content into a citation. The target is a signal, not a cap.

## Temporary Working Files

Work plans, task files, and `_overview.md` are temporary AI working state, marked `temporary: true` in their frontmatter and excluded by `.gitignore`. A file with that marker is judged only by consistency with the documentation (PRD or feature spec, UXRD, Design Doc, ADR) — "Writing for the Reader", the `prose` pass, and diagrams do not apply; once its part is implemented, a later documentation change — from this feature or another — never updates it; and it may be deleted once the feature is implemented.

## Revising a Document

An edit is finished when nothing else still says the old thing. Most findings on a re-review sit not in the edited lines but in the places that relied on them.

- **Bounds.** A revision edits only the finding's span and the passages that depend on it; every other passage stays byte-for-byte. A sound paragraph reworded in passing is how a revision breaks a section that already passed review.
- **One write per region.** The change to a region — a section, a table, a diagram — is composed whole and written in one Write or Edit, not built up by a run of small edits.
- **Dependents.** After an edit, find every place that cites, depends on, or restates what changed in this document, and make it agree. A dependent in another document — found by searching for the changed IDs — is named in the response (`nextSteps`), not edited; the orchestrator routes it to its owner.
- **Cuts.** Removing or merging content leaves no reference pointing at what was removed. Passages that share words but make different claims are not duplicates, and both stay.
- **Self-check scope.** A new document settles every item of the author's Self-Validation while it is composed, before the Write; after the Write the items are a check, not an edit pass. A change to sections, numbering, or IDs checks every item again, and a targeted edit checks the items whose subject it touched, plus the dependents check above.

## Draft Check

Before it returns, the author has its written document read cold by `document-reviewer`. Most review findings are visible from the author's own inputs to a reader who did not write the text, so the author catches them before the stop instead of after it. This applies to the authors of a PRD, UXRD, Design Doc, ADR, and work plan, and in gamedev of a GDD and Feature Spec too. Task files and the simplified plan (`design: none`, at small scale and in gamedev Prototype) have no draft check. Neither has a document whose caller reviews it itself — the reverse-engineering generation loops, or a change to several documents reviewed as one set: the caller's prompt says `draft_check: skip`, and the author returns `"verdict": "skipped"`.

1. **Creation.** The author composes the whole document, writes it once to its path, and runs the checks it already runs on the written file, such as the diagram render check. It then spawns the reviewer with coordinates only: `target` (the document path, and for a UXRD the design-system files written with it), `doc_type`, `depth` for a PRD or Feature Spec, and `review_scope: full`. No summary, rationale, or self-assessment goes with them, because the reviewer reads cold.
2. **Update or revision.** Before the first edit, the author copies the current version out of the repository with the shell — `cp docs/features/{feature}/prd.md <scratchpad>/prd.base.md`, where `<scratchpad>` is the session's scratchpad directory. The document guard allows a copy whose destination is outside the repository. After its edits the author spawns the reviewer with the same coordinates, `review_scope: changes`, `diff_base` set to the copy, and the issues the revision was asked to fix, if any.
3. **One round.** The author fixes the `critical` and `important` issues its inputs resolve, one Edit per region within the bounds of "Revising a Document", and does not run the reviewer again. Issues that need a user decision (scope, product judgment), `recommended` issues, and `deferred` findings are returned, not acted on.
4. **Return.** The author's JSON response gains a `draftCheck` field. Every finding the reviewer returned appears in `fixed` or in `open`; none is dropped.

   ```json
   "draftCheck": {
     "verdict": "<reviewer status> | not_run | skipped",
     "fixed": ["<issue id: one line>"],
     "open": [{"severity": "...", "issue": "...", "why_open": "needs user decision | recommended | deferred | could not resolve"}]
   }
   ```

The reviewer is spawned like any helper, two levels below the main conversation:

```
subagent_type: document-reviewer   # or <plugin>:document-reviewer, as the Agent tool lists it
```

It owns no document and spawns nothing, so the guard's rule against one owner spawning another does not apply. When the Agent tool is unavailable, the author returns `"verdict": "not_run"` with the reason, and the orchestrator offers an independent review at the stop as the recommended option.

## Document Definitions

### ADR (Architecture Decision Record)

**Purpose**: Record technical decision rationale and background

**Includes**:
- Decision (what was selected)
- Rationale (why that selection was made)
- Option comparison (at least two real options) and trade-offs
- Architecture impact
- Principled implementation guidelines (e.g., "Use dependency injection")

**Excludes**:
- Implementation schedule (→Work Plan)
- Detailed implementation procedures (→Design Doc)
- Specific code examples (→Design Doc)
- Resource assignments (→Work Plan)

### Design Document

**Purpose**: Describe, for a person reading top to bottom, how the part works and why it is built that way

**Includes**:
- **Existing codebase analysis** (required), disposed of in Appendix: Fact Disposition
- Key decisions, each with the options not taken — a breaking change to an existing contract, and a data migration, are decisions
- Interface and contract definitions
- Data flow and component design
- **Acceptance criteria**: the PRD's (gamedev: the feature spec's) criteria cited by ID; plain-sentence criteria only where the design refines one
- Scope agreed with the user: what is out of scope and the constraints the design meets
- **Prerequisite ADRs** (including common ADRs)

**Excludes**:
- Source code of any kind — schemas, interfaces, function bodies, snippets of changed files, and their copies as field-by-field tables (→written at implementation; contracts state what a caller needs)
- Test code, test file names, fixtures, test helpers, mock boundaries (→acceptance-test-generator and task files; the Design Doc states use cases)
- Why that technology was chosen (→Reference ADR)
- Implementation order and approach, the files to change, integration points and how each is verified, the verification strategy, when to implement (→Work Plan)
- Who will implement (→Work Plan)

### Work Plan

**Purpose**: Implementation task management and progress tracking

**Includes**:
- Task breakdown and dependencies (maximum 2 levels)
- Implementation approach (vertical/horizontal/hybrid), and the integration points where new code joins existing code
- Verification: what correctness means for the part and how it is proven, the early verification point and the task that runs it, and each phase's operational verification
- **A final Quality Assurance phase (required)**
- Progress records (checkbox format)

**Excludes**:
- Technical rationale (→ADR)
- Design details (→Design Doc)

The planner composes the phases from technical dependencies and the implementation approach, and owns the completion definition of a task (`work-planning`, "Task completion — 3 elements").

## Creation Process

Each step names the evidence that must exist before the next step starts. A step without its output evidence has not completed, regardless of elapsed effort.

**1. Problem Analysis** — change scale assessment
- *Output evidence*: confirmed scale with its deciding axis named; a named source for each existing document consulted
- *Transition*: proceed when the scale has an explicit deciding axis

**2. ADR Option Consideration** (ADR only, after the Design Doc) — compare the real options, specify trade-offs
- *Output evidence*: at least two real options with trade-offs stated as concrete costs, not generic caveats
- *Transition*: proceed when the selected option names what the rejected options fail to satisfy

**3. Creation** — use templates, include measurable conditions
- *Output evidence*: every mandatory template section filled (or answered in one line with the reason), every *when applicable* section that does not apply deleted; every acceptance criterion measurable
- *Transition*: proceed when no section is silently empty — an unanswered question is not the same as an inapplicable one

**4. Approval** — the user's approval at the stop enables implementation (an ADR's status becomes `Accepted`)
- *Output evidence*: the draft check's verdict recorded; every blocking issue fixed or listed in `draftCheck.open` for the user
- *Transition*: implementation begins only on the user's approval

## ADR Status
`Proposed` → `Accepted` → `Deprecated`/`Superseded`/`Rejected`

## Common ADR Relationships
1. **At creation**: Identify common technical areas (logging, error handling, async processing, etc.) and search `docs/adr/ADR-*.md` for decisions that already cover them
2. **Design Doc**: List those ADRs under Part, Prerequisite ADRs
3. **Compliance check**: Verify the design aligns with them

A missing common decision is not a reason to write an ADR on its own; it goes through the three-part test in "ADR Creation Conditions" after the design like any other.