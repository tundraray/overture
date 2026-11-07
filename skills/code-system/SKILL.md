---
name: code-system
description: This skill governs the project code system in docs/code-system/ — the architecture style, layer map, module boundaries and the catalogue of canonical patterns — designing it (source, style, patterns), building to it and reviewing against it. Automatically loaded when creating or extending the code system, choosing how to structure new code, reviewing an implementation for architectural conformance, or when "code system", "pattern catalogue", "building block", "architecture style", "layer map", "module boundary", or "canonical pattern" are mentioned.
---

# Code System

The project's way of structuring code lives in `docs/code-system/` and is owned by `technical-designer` and `technical-designer-frontend`. It names the layers, the boundaries between modules, and the canonical pattern for each recurring problem. It holds no code; each pattern's Reference points at the implementation. Part A is for whoever designs it; Part B for whoever builds from it; Part C for whoever reviews against it. Layout and templates: `documentation-criteria`, "Code System", and `code-system-template.md`.

## Reading the System

| File | Answers |
|---|---|
| `README.md` | Source (where the style was derived from), Style (the stance every structural choice traces to), Layer map and dependency rules, Module boundaries, Index of patterns |
| `patterns/{name}.md` | Problem, Shape, Reference (the canonical implementation), Not For, Used In |

Read the README first. A pattern file decides *how* a recurring problem is solved here; the Reference path is the place to read before writing a new instance. A Design Doc cites patterns by path; it never restates them.

## Style

The stance: the simplest structure that keeps modules independently replaceable; reuse before invention. The README states it in the project's words. A pattern earns its place in the catalogue by two or more uses, or by guarding a boundary; a way used once is a Key Decision in its Design Doc, not a pattern.

## Part A — Designing (technical-designer, technical-designer-frontend)

### Workflow

Run during the code investigation, before writing the Design Doc body.

1. **Read first**: `docs/code-system/` (README, the patterns the part may use), the Reference implementations those patterns name, and `codebase-analyzer` facts when the caller passes them — its `conformance` findings say where the code and the catalogue already disagree.
2. **None exists** → create `README.md` (Source, Style, Layer map, Module boundaries, Index) and a `patterns/` file for each pattern the part relies on that the code already uses in two or more places. `/code-context` does this once for a whole project; a first Design Doc does it for what that part needs.
3. **One exists** → follow it. For every module, service, utility or component the design introduces, decide reused / extended / new and write the row into the Design Doc's Building-block Inventory, naming what was searched in the catalogue and in the code before choosing `new`. A `new` block where a catalogued one fits, a new pattern, and a change to an existing pattern or README rule are each a Key Decision; a new or changed pattern file goes in the Index with the Design Doc in its Used In.

### Source

Decide it once per project, in the README:

- **Derived from the code** — the style was read out of the existing codebase (`/code-context`); the README says which packages were read and when.
- **Reference architecture** — a named style (layered, hexagonal, feature-sliced, …) or a framework's conventions decide the shape; link it and say what it covers.
- **Defined here** — nothing external decides; every rule is a decision recorded in the README.

Cite, don't restate: a framework convention the README names is cited by the pattern that follows it, not copied.

### Patterns

A pattern file is precise enough to build a new instance from, and still contains no code.

- **Problem** — the recurring situation it answers, in one or two sentences, and the signal that a piece of code is such a situation.
- **Shape** — the parts and their names, which layer each lives in, what each may depend on, and where the data crosses a boundary. Prose and names; the Reference holds the code.
- **Reference** — the path(s) to the implementation that embodies the pattern. One is enough; it is the copy that is read, so it is kept canonical.
- **Not For** — the neighbouring situations that look alike and have a different answer, each pointing at that answer.
- **Used In** — the Design Docs that cite the pattern.

## Part B — Implementing (task-executor, task-executor-frontend)

The task file carries the patterns its Design Doc cites. Before writing, read each cited pattern and its Reference, and build the new instance to that shape: same layer, same dependency direction, same names for the same parts. The Building-block Inventory decides whether a block is reused, extended or new; an executor does not reopen that decision. Where the catalogue is silent, the existing code around the change is the convention to follow.

### Mismatch or Gap

- **Mismatch with the pattern** — the implementation diverges from a cited pattern or its Reference: fix it as a defect.
- **Gap in the catalogue** — no pattern decides something the task needs (a boundary crossing, a module shape, where a shared piece belongs), and the surrounding code gives no convention: don't invent architecture. Report it in your response (executor: escalation), and the orchestrator routes it to the technical designer, who decides and records it.

## Part C — Reviewing (code-reviewer, code-verifier)

Conformance is a review axis beside Design Doc compliance and acceptance criteria. The reviewer reads the implementation against the patterns the Design Doc cites and against the codebase itself — never by running anything — and reports:

- **Duplicate of an existing building block** — a module, utility or component that does what a catalogued or existing one already does; the finding names the existing one.
- **Boundary or dependency-direction violation** — a call across a module boundary the README does not allow, or against the direction its dependency rules set.
- **A new way where a canonical one exists** — an instance of a catalogued problem solved differently from its pattern; the finding names the pattern.
- **Candidate pattern** — a structure the implementation introduced that the catalogue does not hold and that is used, or will plainly be used, in more than one place. It is reported with its locations, not written: the catalogue changes only through its owner.

What the user confirms from the completion report, the technical designer records through `/update-doc`, as a Key Decision in the Design Doc it serves.
