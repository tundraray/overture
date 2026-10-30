# Design System Templates

<!--
The design system lives in docs/design-system/ and is owned by ux-designer (gamedev: game-ui-designer).
The first UXRD that needs a design system and finds none creates README.md, foundations.md, and the component specs that feature needs. Later UXRDs follow it and add or extend components.
Changing an existing foundation or component is a Key Decision of the UXRD that changes it.
No code anywhere: no CSS, tokens as source, props, or markup. Implementation decides those.
Reader rules (current truth, delete don't stub, short units, one owner per value): documentation-criteria, "Writing for the Reader". Guidance in these comments is not copied into the files.
-->

```
docs/design-system/
├── README.md
├── foundations.md
└── components/
    └── {component-name}.md
```

---

## Part 1: `README.md`

````markdown
# Design System

## Source

<!-- One of: a brand book, an external design system (shadcn/ui, Material, an internal library), or "defined here". When a source exists, link it; the files below cite it and fill only its gaps. -->

| Source | Link | Covers |
|---|---|---|
| [Brand book / external design system / defined here] | [path or URL] | [which foundations or components it decides] |

## Direction

<!-- The interface's character in one phrase, then two or three references it draws from. Every foundation choice should be traceable to this line. -->

- **Character**: [one phrase — e.g. "quiet, dense tool for long sessions"]
- **References**: [product, publication, or style it borrows from, and what exactly]

## Index

- [Foundations](./foundations.md)

| Component | Spec |
|---|---|
| [Component name] | [components/component-name.md](./components/component-name.md) |
````

---

## Part 2: `foundations.md`

````markdown
# Foundations

<!-- Each section either cites the source that decides it ("Brand book, Typography") or states the value here — never both. Fill only the gaps the source leaves. Cells hold one phrase. -->

## Typography

| Role | Family | Size / line height | Weight |
|---|---|---|---|
| [Display / Heading / Body / Caption / Mono] | [family] | [e.g. 15 / 22 px] | [weight] |

## Color

<!-- Roles, not raw palettes: what each color is for. Contrast targets come from the PRD's accessibility level. -->

| Role | Light | Dark | Used for |
|---|---|---|---|
| [Surface / Text / Muted / Border / Accent / Danger] | [value] | [value] | [one phrase] |

## Spacing & Density

- **Base unit**: [e.g. 4 px]
- **Scale**: [the steps used]
- **Density**: [compact / comfortable, and where each applies]

## Shape & Elevation

| Element | Radius | Border | Shadow |
|---|---|---|---|
| [Control / Card / Overlay] | [value] | [value] | [value or none] |

## Motion

| Kind | Duration | Easing character |
|---|---|---|
| [Micro (hover, press) / Enter-exit / Layout] | [ms] | [e.g. quick out, no bounce] |

- **Reduced motion**: [what replaces movement when the user asks for less]

## Iconography

- **Set**: [icon set or "drawn here"]
- **Size and stroke**: [values]
- **Usage**: [icon alone needs an accessible name; icon with label when …]
````

---

## Part 3: `components/{component-name}.md`

````markdown
# [Component Name]

<!-- How the component works and looks, precisely enough to build — without code. One file per component. Feature-specific placement and copy stay in the UXRD that uses it. -->

## Purpose

[One or two sentences: what the component is for, and what it is not for.]

## Anatomy

<!-- The named parts, in visual order. A small ASCII sketch is welcome. -->

- [Part 1 — e.g. container]
- [Part 2 — e.g. label]

## Variants & Sizes

| Variant / size | When to use | Differs in |
|---|---|---|
| [Primary / Secondary / sm / md] | [one phrase] | [one phrase] |

## States

<!-- Delete rows for states the component cannot reach. Visual values cite foundations roles ("Accent", "Motion: micro"), not raw values. -->

| State | Looks | Behaves |
|---|---|---|
| Default | [description] | [interaction] |
| Hover | [description] | [interaction] |
| Focus | [description] | [keyboard behaviour] |
| Active / Pressed | [description] | [interaction] |
| Disabled | [description] | [why and when] |
| Loading | [description] | [what the user sees while waiting] |
| Empty | [description] | [what renders with no data, and the action offered] |
| Error | [description] | [display and recovery] |
| Partial | [description] | [rendering when only some data arrived] |

## Content Rules

- [Label length, casing, truncation, what text may and may not say]

## Accessibility

| Aspect | Rule |
|---|---|
| Role | [e.g. button, dialog, listbox] |
| Accessible name | [where it comes from] |
| Keyboard | [keys and what each does] |
| Focus | [where focus goes on open, close, and after actions] |

## Used In

- [docs/features/{feature}/uxrd.md — screen or flow]
````
