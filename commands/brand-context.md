---
name: brand-context
description: Record the project's brand in its design system (docs/design-system/) through ux-designer
argument-hint: (no arguments - interactive setup)
---

**Command Context**: Collect the project's brand guidelines and record them in the project design system — `docs/design-system/README.md` (Source, Direction) and `docs/design-system/foundations.md` — through `ux-designer`. Plugin skill files are never edited.

## Execution Process

### 1. Current State Verification

! ls -la docs/design-system/ 2>/dev/null
! cat package.json | grep -E '"name":|"description":'

When `docs/design-system/` exists, read its README and foundations first: this run updates them rather than starting over.

### 2. Brand Context Collection

Interact with the user to collect the following information:

```
【Brand Identity】
1. What is your brand's core positioning?
   Examples: "Professional and trustworthy" "Playful and innovative" "Minimalist and elegant"

2. What emotions should the UI evoke?
   Examples: "Confidence and clarity" "Excitement and creativity" "Calm and focus"

【Color System】
3. Primary brand color (hex or description)?
   Examples: "#0066CC" "Deep blue" "Vibrant orange"

4. Secondary/accent colors?
   Examples: "#FF6B35 for CTAs" "Soft green for success states"

5. Light/Dark mode preference?
   - Light mode only
   - Dark mode only
   - Both (specify primary)

【Typography】
6. Primary font family (or style preference)?
   Examples: "Inter" "System fonts" "Serif for headings, sans-serif for body"

7. Typography scale/sizing approach?
   Examples: "Compact for data-dense UI" "Generous for reading-focused"

【Design System Integration】
8. Component library in use?
   Examples: "Shadcn UI" "MUI" "Custom components" "None yet"

9. Existing brand assets or guidelines?
   Examples: "Figma brand kit" "PDF style guide" "None - starting fresh"

【Accessibility Requirements】
10. WCAG compliance level?
    - Level A (minimum)
    - Level AA (recommended)
    - Level AAA (strict)
```

### 3. Record the Brand Through ux-designer

Map the answers onto the design system, then call `ux-designer`:

| Answers | Go to |
|---|---|
| 9 (brand assets), 8 (component library) | README → Source: link each, with what it covers |
| 1, 2 (positioning, emotions) | README → Direction |
| 3–5 (color, modes) | foundations.md → Color, as roles |
| 6, 7 (typography) | foundations.md → Typography |
| 10 (WCAG level) | Contrast targets in foundations.md → Color |

```
subagent_type: ux-designer
prompt: "Task: run only the Design System Workflow — no UXRD this run. Record the project's brand in docs/design-system/: README.md (Source, Direction, Index) and foundations.md, following design-system-template.md and the design-system skill. Brand answers: [collected answers]. The user's answers are decisions: record them; where a linked brand book or component library decides something, cite it instead of restating it; fill the remaining gaps per <ux_aesthetics>, traceable to the Direction. If the files exist, update them and keep what the answers do not change. Return documents[] with every file written. [SYSTEM CONSTRAINT] This agent operates within /brand-context command scope. Write only docs/design-system/README.md and docs/design-system/foundations.md; no component specs, no code."
```

### 4. Verify and Report

Read the files ux-designer returned and confirm:
- [ ] Every answer the user gave appears in README or foundations, or is cited from the linked source
- [ ] Colors are roles with light and dark values as the mode answer requires, with contrast targets from the WCAG level
- [ ] Nothing is both cited and restated, and the files contain no code

Show the user the paths and a short summary of Source, Direction, and the foundations set.

**Scope**: Write `docs/design-system/README.md` and `docs/design-system/foundations.md` only, through `ux-designer`. Component specs come with the UXRDs that need them; project context and technical specifications belong to other commands.
