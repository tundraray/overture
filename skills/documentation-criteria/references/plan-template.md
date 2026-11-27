---
feature: [feature-name]           # directory under docs/features/
part: [part-name]                 # directory holding this plan
design: design-[part-name].md     # governing design, at feature level; `none` for a simplified plan (the PRD or feature spec is the specification)
temporary: true                   # AI working file — see documentation-criteria
---

<!--
Temporary AI working file — not in git, deleted after the feature ships. It must state exactly what the documentation states; nothing else is judged.
Text inside these comments is guidance for the author; it is not copied into the document.
When the part has more than one plan, the frontmatter also carries `plan: N of M` and, after the first plan, `depends-on: [previous plan filename]`.
A section with nothing to put in it is left out; every phase has Work Items. Headings stay as written, in any plan language: the executor finds sections by them.
-->

# Work Plan: [Feature Name] — [part-name]

## Snapshot

<!-- What gets built, in what order, and what could go wrong. The why of the feature is the PRD's and the design's; cite them, don't retell them. -->

**Overview.** [Three to five plain sentences: what this plan builds, in what order, and why that order.]

- **Does not change**: [what a reader would otherwise assume this plan touches]
- **Biggest risk**: [one line, and the phase that meets it first]
- **Open questions**: [each question and who resolves it, or "none"]
- **Design items no phase covers**: [each item, why it is left out, and that the user confirmed it — or "none"]

## Implementation Phases

<!-- One block per phase, numbered in the order the phases run. A last Quality Assurance phase is written only when the part has measurement or profiling scripts, or an end-to-end check of its journeys that no earlier phase holds; it is a phase like any other. -->

### Phase 1: [Phase Name]
**Purpose**: [what this phase delivers, in one or two sentences]
**Depends on**: [only when this phase reads an earlier phase's deliverable: Phase N — `docs/features/{feature}/{part}/analysis/{name}.md`]
**Change Category**: [only for a bug fix, regression, state change, or boundary change: one or more of bug-fix, regression, state-change, boundary-change]

#### Patterns
<!-- When `docs/code-system/` exists and the Design Doc's Building-block Inventory cites a pattern for a block this phase builds. -->
- [docs/code-system/patterns/{pattern-name}.md — the block in this phase it shapes; a `new` block cites the Design Doc Key Decision and pattern path, when it created one]

#### Contracts
<!-- What in the documentation binds this phase. A section is pointed at, never copied: the executor reads the value at its owner. When `design: none`, only a phase that builds UI has this section, holding only the uxrd.md line. -->
- [DD §[Section] — implements | consumes [contract name]]
- [DD §[Section] — reproduce exactly: [the kind of value — limits, enum values, status codes, field order]]
- [uxrd.md [screens, screen states, element and MC-n IDs] and docs/design-system/components/[name].md — reproduce exactly (only in a phase that builds UI)]
- [docs/adr/ADR-XXXX.md §[Section] — binds this phase (only when an ADR does)]

#### Work Items
<!-- In the order they are done. Each is one outcome the phase must leave true — a behaviour, capability or state that exists once it is done — in the terms of the PRD and Design Doc, and what it covers (the PRD's requirement IDs when `design: none`). It names no file, function, signature or implementation step. An item that crosses a boundary cites the Design Doc contract. -->
- [ ] 1. [the outcome] — covers DD §[Section] / AC-[n]
- [ ] 2. [the outcome] — covers DD §[Section] / AC-[n]

#### Proof Obligations
<!-- For each AC or risk this phase proves: the level that proves it, the test skeleton's path where one exists, and the regression it turns red on. Failure modes suites tend to omit: same-value, no-op, empty input, invalid option, missing config, unavailable boundary, shared-state dependency, rollback-only visibility, missing-sort-key ordering. -->
- [AC-[n] or the risk — `unit | integration | e2e`[, skeleton path] — turns red when [the regression]]

#### Operational Verification
<!-- When this phase completes an integration point, where new code joins existing code: what to check and the outcome that proves it. -->
- [what to verify — the observable outcome that proves it]

#### Investigation Notes
<!-- Added by the executor: what it found and decided, in a few lines, and a `Files changed:` list. -->

## Notes

<!-- Anything the executor must know that no section above holds. -->
