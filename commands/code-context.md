---
name: code-context
description: Record the project's architecture style and canonical patterns in its code system (docs/code-system/) through technical-designer
argument-hint: (no arguments - reads the codebase)
---

**Command Context**: Read the existing codebase and record how it is structured in the project code system — `docs/code-system/README.md` (Source, Style, Layer Map, Module Boundaries, Index) and `docs/code-system/patterns/*.md` — through `codebase-analyzer` and `technical-designer`. Plugin skill files are never edited.

## Execution Process

### 1. Current State Verification

! ls -la docs/code-system/ docs/code-system/patterns/ 2>/dev/null
! cat package.json | grep -E '"name":|"workspaces":'
! ls -d apps/* packages/* src 2>/dev/null

When `docs/code-system/` exists, read its README and patterns first: this run updates them through the owner in update mode rather than starting over.

Decide the layer from what the codebase holds: a frontend-only project takes `technical-designer-frontend`; a backend or general project takes `technical-designer`; a fullstack project takes both, backend first, each writing the layers, boundaries and patterns of its own side into the same README.

### 2. Fact Gathering Through codebase-analyzer

```
subagent_type: codebase-analyzer
prompt: "Task: gather architecture facts for the project code system — the whole codebase, not a feature. Report: the layers as the code has them and the direction calls take between them; module or package boundaries, what each owns and how it is exposed; structures that recur in two or more places (how a handler reaches a service, how a service reaches data, how errors cross a boundary, how a module is registered) with the path of the implementation that embodies each; and, when docs/code-system/ exists, `conformance` against it. Facts with file:line, no proposals. [SYSTEM CONSTRAINT] This agent operates within /code-context command scope. Read only; write nothing."
```

### 3. Record the Style Through technical-designer

Map the facts onto the code system, then call the designer for the layer:

| Facts | Go to |
|---|---|
| packages read, date, any reference architecture or framework convention the code follows | README → Source |
| layers and the direction of calls | README → Layer Map |
| boundaries, what each owns and exposes | README → Module Boundaries |
| each recurring structure and its canonical path | `patterns/{name}.md` (Problem, Shape, Reference, Not For, Used In), listed in README → Index |

```
subagent_type: technical-designer   # technical-designer-frontend for the frontend layer
prompt: "Task: run only the `code-system` skill's Part A Workflow — no Design Doc this run. Record the project's architecture in docs/code-system/: README.md (Source, Style, Layer Map, Module Boundaries, Index) and one patterns/{name}.md per structure the code already uses in two or more places, following code-system-template.md and the code-system skill. Facts: [codebase-analyzer JSON]. The facts are the source: record what the code does, cite a framework convention instead of restating it, and write the Style in the project's own words from what the layers and boundaries show. A pattern used once is not recorded. No code in any file. If the files exist, update them and keep what the facts do not change. Run your draft check and return documents[] with every file written. [SYSTEM CONSTRAINT] This agent operates within /code-context command scope. Write only under docs/code-system/; no Design Doc, no ADR."
```

### 4. Verify and Report

Read the files the designer returned and confirm:
- [ ] Every recurring structure in the facts has a pattern file, or was dropped as used once
- [ ] Every Reference path exists in the codebase
- [ ] Nothing is both cited and restated, and the files contain no code

Show the user the paths, a short summary of Source, Style, the layers and the pattern index, and the designer's `draftCheck.open` items. Revisions go back through the designer in update mode.

**Scope**: Write `docs/code-system/README.md` and `docs/code-system/patterns/*.md` only, through the technical designer. Patterns a feature introduces come with the Design Doc that needs them; project context and technical specifications belong to other commands.
