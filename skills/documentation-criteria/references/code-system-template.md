# Code System Templates

<!--
The code system lives in docs/code-system/ and is owned by technical-designer and technical-designer-frontend.
Workflow (create, reuse, extend): `code-system`, "Workflow".
No code anywhere: no snippets, signatures, or config. The Reference path points at the implementation; the files describe its shape.
Reader rules (current truth, delete don't stub, short units, one owner per value): documentation-criteria, "Writing for the Reader". Guidance in these comments is not copied into the files.
-->

```
docs/code-system/
├── README.md
└── patterns/
    └── {pattern-name}.md
```

---

## Part 1: `README.md`

````markdown
# Code System

## Source

<!-- One of: derived from the code (name the packages read and the date), a reference architecture or framework convention (link it), or "defined here". When a source exists, the files below cite it and fill only its gaps. -->

| Source | Link | Covers |
|---|---|---|
| [Derived from the code / reference architecture / defined here] | [path, URL, or packages read] | [which layers, boundaries, or patterns it decides] |

## Style

<!-- The stance every structural choice traces to, in the project's own words (`code-system`, "Style"). One short paragraph. -->

[Style statement]

## Layer Map

<!-- The layers as the code has them, top to bottom, and the one rule for calls between them. A layer not present in the code is not listed. -->

| Layer | Holds | Lives in | May depend on |
|---|---|---|---|
| [e.g. Transport / Application / Domain / Infrastructure] | [one phrase] | [path pattern] | [layers below it, or none] |

- **Dependency rule**: [e.g. "calls go downward only; a lower layer never imports an upper one"]

## Module Boundaries

<!-- What a module is here, what it owns, and how one talks to another. Name the shared pieces that sit outside any module. -->

| Boundary | Owns | Exposed through | Crossed by |
|---|---|---|---|
| [module or package] | [data and behaviour it owns] | [its public surface — a facade, a service, an API] | [the only allowed callers or mechanism] |

## Index

| Pattern | Problem | Spec |
|---|---|---|
| [Pattern name] | [one phrase] | [patterns/pattern-name.md](./patterns/pattern-name.md) |
````

---

## Part 2: `patterns/{pattern-name}.md`

````markdown
# [Pattern Name]

<!-- How a recurring problem is solved here, precisely enough to build a new instance — without code. One file per pattern. Feature-specific wiring stays in the Design Doc that uses it. -->

## Problem

[One or two sentences: the recurring situation this answers, and how to recognise a piece of code as such a situation.]

## Shape

<!-- The parts and their names, the layer each lives in, what each may depend on, where data crosses a boundary. Prose and names; a small ASCII sketch is welcome. -->

- [Part 1 — e.g. the handler: lives in …, receives …, calls …]
- [Part 2 — e.g. the service: owns …, never imports …]

## Reference

<!-- The implementation that embodies the pattern. One path is enough; it is the copy that is read before writing a new instance, so it is kept canonical. -->

- [path/to/canonical/implementation]

## Not For

| Looks like | Use instead |
|---|---|
| [a neighbouring situation] | [the pattern or place that answers it] |

## Used In

- [docs/features/{feature}/design-{part}.md — the block or flow that cites it]
````
