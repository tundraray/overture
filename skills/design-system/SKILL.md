---
name: design-system
description: This skill governs the project design system in docs/design-system/ — designing it (source, direction, foundations, component specs) and implementing it (tokens, every specified state, fonts for the product's script, visual verification in a real browser). Automatically loaded when creating or extending a design system, implementing or styling UI components, checking UI visually, or when "design system", "design tokens", "foundations", "component spec", "brand", "theme", "dark mode", "typography", "visual verification", or "screenshot" are mentioned.
---

# Design System

The project's visual language lives in `docs/design-system/` and is owned by `ux-designer` (gamedev: `game-ui-designer`). It holds no code. Part A is for whoever designs it; Part B is for whoever builds UI from it. Layout and templates: `documentation-criteria`, "Design System", and `design-system-template.md`.

## Reading the System

| File | Answers |
|---|---|
| `README.md` | Source (what decides the visuals), Direction (the character every choice traces to), Index |
| `foundations.md` | Typography, color roles for light and dark, spacing & density, shape & elevation, motion, iconography |
| `components/{name}.md` | Purpose, anatomy, variants & sizes, states (looks / behaves), content rules, accessibility, where used |

Read the README first. When the Source is a brand book or an external system (shadcn/ui, Material, an internal library), that source decides what it covers, and the files fill only its gaps. A UXRD links component specs; it never restates them.

## Part A — Designing (ux-designer)

### Source

Decide it once per project, in the README:

- **Brand book** — link it; foundations cite its sections ("Brand book, Color").
- **External design system** — link it and the version in use; cite its components and tokens.
- **Defined here** — nothing external decides; every foundation is your decision.

Cite, don't restate: a value copied from a source drifts when the source changes. Mixed sources are normal — the "Covers" column says which source decides what.

### Direction

One phrase of character ("calm, dense tool for long sessions") and two or three references, each with what it lends. With no brand, this is a deliberate choice, not the generic default — `<ux_aesthetics>` in `ux-designer` governs it. Every foundation below traces back to this line.

### Foundations

- **Typography** — a scale with a clear hierarchy: few sizes, each role distinct at a glance. Body size and line height fit the reading the product demands. Name the family and its fallback, and confirm it covers the product's languages and scripts.
- **Color** — roles, not palettes: surface, text, muted, border, accent, danger (success and warning when used). Each role has a light and a dark value when the product is themed. Contrast targets come from the PRD's WCAG level (AA: 4.5:1 for body text, 3:1 for large text and UI parts); check each text/surface pair in both modes.
- **Spacing & density** — one base unit and a short scale; say where compact and comfortable density apply.
- **Shape & elevation** — radius, border, and shadow per element class; elevation signals layering, not decoration.
- **Motion** — a character (quick and quiet, or expressive) and a duration per kind; what replaces movement under reduced motion.
- **Iconography** — one set, its size and stroke, and when an icon needs a visible label.

### Components

A spec is precise enough to build without guessing, and still contains no code.

- **Anatomy** — the named parts in visual order.
- **Variants & sizes** — when to use each, and what differs.
- **States** — every state the component can reach: default, hover, focus, active, disabled, loading, empty, error, partial. Each row says how it looks (citing foundation roles, not raw values) and how it behaves. Delete unreachable states; never leave a reachable one undecided.
- **Content rules** — length, casing, truncation, tone.
- **Accessibility** — role, accessible name, keyboard, focus movement.

Search the system and the code before creating a component; extending one is usually better.

## Part B — Implementing (frontend designer, executor, quality-fixer)

- **technical-designer-frontend** — the Design Doc states where tokens live, how theming switches, and which component specs the part builds. It cites the specs and does not redesign them.
- **task-executor-frontend** — builds to the specs and verifies visually before reporting done.
- **quality-fixer-frontend** — runs the visual verification as a quality phase, next to tests and build.

### Foundations Become Tokens

Each foundation becomes a token: CSS custom properties, a theme config (Tailwind, a CSS-in-JS theme), or the external system's own theming. Token names follow the roles in `foundations.md`, so a spec row ("Accent", "Motion: micro") maps to one token. Components use tokens only — a hardcoded color, size, font, or duration in a component is a defect.

### Verify the Token Chain Resolves

A token can be defined and still not apply. Common breaks:

- A variable references itself or an undefined name — the browser silently falls back to its default font or color.
- The font is never loaded, or the loader registers it under a different name than the token reads.
- A theme layer or utility config overrides the token, or the dark-mode selector never matches.

```css
--font-sans: var(--font-sans);                    /* broken: resolves to the browser default (Times New Roman) */
--font-sans: var(--font-loaded), system-ui, sans-serif;  /* works: the loaded family, then a fallback */
```

Check computed values in the browser (body text, a button, a surface), not only the source.

### States, Accessibility, Motion

- Implement every state in the spec's States table — including loading, empty, error, and partial, which are easy to skip.
- Accessibility as specified: role, accessible name, keyboard keys, focus movement, a visible focus ring, and the contrast foundations set.
- Motion as specified, honouring `prefers-reduced-motion` with the replacement foundations name.

### Language and Fonts

UI text is in the product's language, as the UXRD's content defines it — not placeholder English. Fonts must cover that script: load the subsets it needs (e.g. `cyrillic` alongside `latin`); a missing subset falls back glyph by glyph and mixes typefaces. Check long words and translated labels against the spec's truncation rules.

### Visual Verification

Green tests do not mean the UI looks right. After implementing or fixing UI:

1. Run the app and open each changed screen in a real browser (Playwright MCP or equivalent).
2. View it at each breakpoint in the UXRD's "Responsive Behavior", in light and dark when the product is themed.
3. Compare it with the component specs and the UXRD screens: typography, color roles, spacing, and each state (trigger hover, focus, loading, empty, error).
4. Confirm the computed font family and key colors come from the tokens.
5. Keep a screenshot per screen and breakpoint as evidence, and give the paths in your response.

When a screen cannot be opened (no runnable app, auth required), say so with the reason; it is not verified.

### Mismatch or Gap

- **Mismatch with the spec** — the implementation is wrong: fix it as a defect.
- **Gap in the spec** — the spec does not decide something you need (a state, a size, a breakpoint behaviour): don't invent design. Report it in your response (executor: escalation; quality-fixer: `blocked`), and the orchestrator routes it to `ux-designer`.
