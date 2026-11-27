# Authoring Rules

The rules every document author and reviewer follows, in every plugin.

## Writing for the Reader

A document is read far more often than it is written, and most readers stop after the first screen. Every PRD, UXRD, Design Doc, and ADR — and in gamedev every GDD, Feature Spec, market analysis, and analytics setup — follows these rules; the templates are laid out to match them. How the finished document reads, as a whole and sentence by sentence, is checked with the `prose` skill.

**The reader is cold.** They know the product and the codebase in general, but not this feature, and they read without the author or the conversation that produced the document — a teammate, the user at an approval stop, the implementer months later. **Lean** means the document says fewer things and says each one fully; the same content squeezed into shorthand is not lean, it is unreadable.

**Purpose first.** Before saying what something is, say why it is there: the problem it answers and what it buys. The Snapshot does this for the document, and each Key Decision for itself. A reader who cannot tell why a thing exists cannot judge whether it is right.

**Order.** A short header (date, links to the neighbouring documents — no more than five fields) → **Snapshot** → the body → **Update History**, always last. A reader learns what the document decides before how it was researched or how it got here. An ADR's Status and Decision sections are its header and Snapshot, and it has no Update History: a changed decision is a new ADR that supersedes it.

**Snapshot.** At most ten lines at the top. It opens with **Overview** — three to five plain sentences telling what problem this solves and how, the way one explains it to a colleague: no IDs, no code names the reader has not met. Then what does not change, the biggest risk, and whether questions are open, with a link to them. A cold reader who stops there can say what the document decides. A Design Doc and a UXRD follow it with three to seven **Key Decisions** — in a Design Doc a `KD-n` heading with a paragraph of why and the options a reviewer would raise, in a UXRD a table — not counted in the Snapshot's ten lines; the rest of the document cites `KD-n` instead of re-arguing the decision.

**Current truth only.** The body states what is true now. Who decided, on which date, in which version, or in answer to which review finding belongs to Update History and to git — not to requirements, acceptance criteria, table cells, or design text. "(user decision 2026-10-28)", "v1.2:", "per review I003" in the body are defects. Update History has one line per version, a phrase per change, no reviewer IDs.

**Delete, don't stub.** A section marked *when applicable* is deleted when it does not apply — no "N/A", no "does not exist", no placeholder sentence. Template guidance in `<!-- -->` comments is never copied into the document. A mandatory section that has nothing to say answers in one line with the reason.

**Short units.** A paragraph has at most four sentences. A table appears only where the reader compares several rows across the same columns. A table cell holds one phrase or short sentence; reasoning goes under the table or into Key Decisions. A list item is one statement.

**Sentences, not telegrams.** Write sentences with a subject and a verb, one idea each. A chain of noun phrases joined by commas, semicolons, and parentheses is shorthand only the author can expand — split it, or cut what the reader does not need. A table cell is one phrase a newcomer can read: "the event survives a crash because it is written in the same transaction", not "tx outbox, crash-safe". A table or diagram whose title does not say what it shows gets one lead sentence that does.

**The picture carries the explanation.** A section that describes a structure, a flow, or a state change leads with its diagram, and the text under it says only what the picture cannot: reasons, limits, what is persisted. A reader grasps structure and flow from a picture faster than from prose, and long prose around a picture only repeats it.

**Terms.** A word the cold reader may not know — a domain term, a technique, an abbreviation — is explained in a few words where it first appears.

**For people first.** The document is prose, lists, tables, and diagrams a person reads. No YAML or JSON block appears anywhere in it: a structured record is a table, a rule or invariant is a sentence (a work plan's frontmatter is metadata, not a block). Checklists of pointers or pre-ticked items, and tables that only map one ID set onto another, do not appear in the body — progress checkboxes a reader or executor ticks, as in a work plan, are not such a checklist: traceability is written once where the reader meets it ("covers AC-03.1" on a runtime flow). No sentence only tells the reader where else to look; the link sits where the reader needs it.

**One language.** The document is written in the project's document language. Section headings keep the template's wording, because other documents and agents link to them by anchor; everything under a heading — labels, table headers, text — is in the document's language.

**Words before IDs.** Prose names things in words and adds the ID in parentheses — "the open thread is marked as current (AC-01.2)" — not "AC-01.2, SB-06, UX-04". A list citing PRD requirements or criteria by ID only (Covers, From the PRD, a flow's "for") is allowed. Each ID is defined in exactly one place and cited everywhere else.

**Cite by path and ID, never by version.** A link to a neighbouring document names its path and the section or ID — `uxrd.md` MC-8 — not "UXRD v1.6"; a UXRD element is cited by its ID (TH-10), not by its section number. A version in a citation goes stale on the neighbour's next edit and turns every edit into a round of edits elsewhere.

**Fix what others depend on; leave the rest to the implementer.** A document fixes what someone other than the implementer relies on — behaviour a user can observe, what crosses a boundary between parts or systems (API shapes, events, persisted data, shared enums, limits), and decisions that are costly to reverse — and gives the reason for each. What lives inside one part and can change during implementation without anyone outside noticing — internal names, file layout, helper structure, local constants, the order of internal steps, the exact wording of internal messages — is left to the implementer: prose names only what crosses the boundary and the decisions, and an existing internal name appears on a diagram, in the text under it, or in a Design Doc's Building-block Inventory. Every pinned detail is a future revision, and a revision costs a review round.

**Write what this document decides, and only what is decided.** Every statement in a document is a promise that has to stay true. Detail that the document does not own, or that is not settled, goes stale and comes back as a review finding:
- **One owner per value.** A number, a UI string, a threshold, or a limit is written in the document that owns it. Everywhere else cites it by ID without repeating the value — "within the title latency budget (AC-17.1)", not "within 10 s (AC-17.1)". A repeated value drifts at the owner's next edit.
- **Verified or assumed, never guessed.** A claim about how a library, framework, or existing code behaves is either verified — with how: the installed version, the code location, a spike — or written as an assumption with the check that will settle it in the plan. Internals that do not show at a contract boundary (call order inside a library, exception class names, props of a third-party component, the database lock mode or lock order behind an invariant) are not written at all; the design states the invariant, implementation decides the mechanism.
- **The design's altitude, not the code's.** A contract, schema, or data model is described at the level its consumer and reviewer need: what each operation does, what it returns, which failures the caller handles, what each field means. Storage lengths and sizes no caller observes, full column lists, query conditions, and update guards are code — restated as table rows they are still code, and go stale the same way. An exact value a caller or test observes at the contract — a limit, an enum value, a status code, a timeout, a setting's name and default — is written as it is; the work plan points at its section.
- **No references that go stale on their own.** No line numbers into another document or the codebase, no version tags in headers of generated files, no counts of something listed elsewhere — tasks, tests, cases ("19 tasks", "3/14"); a list counts itself, no status line that narrates which versions are pending.
- **Undecided stays an open question.** An acceptance criterion whose outcome is not decided cites the open question and states nothing else — no list of acceptable alternatives, no "guarantee" the design rates as low certainty. The decision is written once, when it is made.

**Size.** Soft targets for the document, in characters, excluding Update History: PRD or Feature Spec lite 15 000, PRD or Feature Spec full 30 000, UXRD 40 000, design-system component spec 6 000, Design Doc 45 000 per part, ADR 10 000. Over the target, the author merges restated content into a citation. The target is a signal, not a cap.

## Temporary Working Files

Work plans are temporary AI working state, marked `temporary: true` in their frontmatter and excluded by `.gitignore`. A file with that marker is judged only by consistency with the documentation (PRD or feature spec, UXRD, Design Doc, ADR) — "Writing for the Reader", the `prose` pass, and diagrams do not apply; once its part is implemented, a later documentation change — from this feature or another — never updates it; and it may be deleted once the feature is implemented.

## Revising a Document

An edit is finished when nothing else still says the old thing. Most findings on a re-review sit not in the edited lines but in the places that relied on them.

- **Bounds.** A revision edits only the finding's span and the passages that depend on it; every other passage stays byte-for-byte. A sound paragraph reworded in passing is how a revision breaks a section that already passed review.
- **Dependents.** After an edit, find every place that cites, depends on, or restates what changed in this document, and make it agree. A dependent in another document — found by searching for the changed IDs — is named in the response (`nextSteps`), not edited; the orchestrator routes it to its owner.
- **Cuts.** Removing or merging content leaves no reference pointing at what was removed. Passages that share words but make different claims are not duplicates, and both stay.
- **Self-check scope.** A new document settles every item of the author's Self-Validation while it is composed, before the Write; after the Write the items are a check, not an edit pass. A change to sections, numbering, or IDs checks every item again, and a targeted edit checks the items whose subject it touched, plus the dependents check above.

## Draft Check

Before it returns, the author has its written document read cold by `document-reviewer`. Most review findings are visible from the author's own inputs to a reader who did not write the text, so the author catches them before the stop instead of after it. This applies to the authors of a PRD, UXRD, Design Doc, ADR, and work plan, and in gamedev of a GDD and Feature Spec too. The simplified plan (`design: none`, at small scale and in gamedev Prototype) has no draft check. Neither has a document whose caller reviews it itself — the reverse-engineering generation loops, or a change to several documents reviewed as one set: the caller's prompt says `draft_check: skip`, and the author returns `"verdict": "skipped"`.

1. **Creation.** The author composes the whole document, writes it once to its path, and runs the checks it already runs on the written file, such as the diagram render check. It then spawns the reviewer with coordinates only: `target` (the document path, and for a UXRD the design-system files written with it), `doc_type`, `depth` for a PRD or Feature Spec, and `review_scope: full`. No summary, rationale, or self-assessment goes with them, because the reviewer reads cold.
2. **Update or revision.** A revision gets a draft check when it alters a requirement, a decision, or a contract. A wording or detail fix gets none, and the author returns `"verdict": "skipped"`. For a checked revision, before the first edit the author copies the current version out of the repository with the shell — `cp docs/features/{feature}/prd.md <scratchpad>/prd.base.md`, where `<scratchpad>` is the session's scratchpad directory. The document guard allows a copy whose destination is outside the repository. After its edits the author spawns the reviewer with the same coordinates, `review_scope: changes`, `diff_base` set to the copy, and the issues the revision was asked to fix, if any.
3. **One round.** The author fixes the issues its inputs resolve, within the bounds of "Revising a Document", and does not run the reviewer again. Issues that need a user decision (scope, product judgment) and `deferred` findings are returned in `open`.
4. **Return.** The author's JSON response gains a `draftCheck` field. Every finding the reviewer returned appears in `fixed` or in `open`; none is dropped.

   ```json
   "draftCheck": {
     "verdict": "<reviewer status> | not_run | skipped",
     "fixed": ["<issue id: one line>"],
     "open": [{"severity": "...", "issue": "...", "why_open": "needs user decision | deferred | could not resolve"}]
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
- Each real option (at least two), and why it won or lost
- Consequences: what is accepted by choosing this
- Principled implementation guidelines (e.g., "Use dependency injection")

**Excludes**:
- Implementation schedule (→Work Plan)
- Detailed implementation procedures (→Design Doc)
- Specific code examples (→Design Doc)
- Resource assignments (→Work Plan)

### Design Document

**Purpose**: Describe, for a person reading top to bottom, how the part works and why it is built that way

**Includes**:
- **Existing codebase analysis** (required) as the ground the design stands on: what it changes or removes shows in Key Decisions, what it leaves alone in Out of scope
- Key decisions, each with its reason and the options a reviewer would raise — a breaking change to an existing contract, and a data migration, are decisions
- Contract definitions: what crosses the part's boundary
- Architecture and runtime flows, as diagrams
- **Acceptance criteria**: the PRD's (gamedev: the feature spec's) criteria cited by ID; plain-sentence criteria only where the design refines one
- Scope agreed with the user: what is out of scope and the constraints the design meets
- **Prerequisite ADRs** (including common ADRs)

**Excludes**:
- Source code of any kind — schemas, interfaces, function bodies, snippets of changed files, and their copies as field-by-field tables (→written at implementation; contracts state what a caller needs)
- Test code, test-file lists, fixtures, test helpers, mock boundaries (→acceptance-test-generator and the executor)
- Implementation order and approach, integration points and how each is verified, when to implement (→Work Plan)
- The files to change or remove, browser-check tables (→the executor)
- Who will implement (→Work Plan)

### Work Plan

**Purpose**: Tell the executor of each phase what must be done, and track progress

**Includes**:
- Phase breakdown and the dependencies between phases; a phase is one committable outcome that a single executor run finishes
- Per phase, the work items — each one outcome the phase must leave true, in the terms of the PRD and Design Doc, citing the AC or Design Doc section it covers — and the proof level (unit / integration / e2e) of each AC
- Implementation approach (vertical/horizontal/hybrid), and the integration points the Design Doc names
- Operational verification in each phase that completes an integration point
- A final Quality Assurance phase, only when the part has measurement or profiling scripts, or an end-to-end check of its journeys that no earlier phase holds
- Progress records (checkbox format)

**Excludes**:
- Technical rationale (→ADR)
- Design decisions and contracts restated (→Design Doc; the phase cites the section)
- Files, functions, signatures, implementation steps, test titles (→the executor, which locates the code and decides the how)

The planner composes the phases from the PRD and the Design Doc — the dependencies between outcomes and the implementation approach — and owns the completion definition of a phase (`work-planning`, "Phase completion — 3 elements").