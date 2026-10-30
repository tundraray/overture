# Overture Workflows

## The Implementation Workflow

The main workflow triggered by `/implement`. Analyzes your request, determines complexity, and routes through the appropriate agent pipeline.

**Command**: `/implement <feature description>`

**How it works**:

1. **requirement-analyzer** parses your request and assesses scale on five axes — files, observable outcomes, contracts/data, boundaries, decision risk. The highest axis wins; file count alone never decides. It also proposes how the feature splits into **parts**
2. **prd-creator** writes a PRD at every scale — `full` at large, `lite` at medium and small. Its Delivery Parts section is the parts list: which requirements each part covers and which parts it depends on. **document-reviewer** reviews it
3. Based on scale, the workflow branches:
   - **Large** — UXRD when there is a UI surface, then a Design Doc per part, then a work plan per part
   - **Medium** — the same, with a lite PRD
   - **Small** — a lite PRD and a simplified work plan, no Design Doc
4. **Expert analysis** (optional, once per feature) — for complex tasks, 3-5 expert-analyst agents evaluate the problem in parallel from different perspectives before design begins
5. **For each part, in dependency order**: **codebase-analyzer** (or **ui-analyzer**) gathers facts, **technical-designer** (or **technical-designer-frontend**) produces `design-{part}.md`, **document-reviewer** and **design-sync** verify it, **acceptance-test-generator** creates that part's test skeletons. Every part is designed before any is planned
6. **For each part, in dependency order**: **work-planner** breaks the part into phased tasks, **document-reviewer** checks traceability, **task-decomposer** splits phases into single-commit tasks, then **task-executor** and **quality-fixer** handle each task autonomously until the part's completion report

**Stop points** (workflow pauses for your approval):
- After requirement-analyzer — confirm scope and scale (once)
- After document-reviewer — approve the PRD, including the parts split (once, every scale)
- After document-reviewer — approve the UXRD (once, when there is a UI surface)
- After design-sync — approve a part's Design Doc (once per part)
- After document-reviewer — approve an ADR (only when the design produced one)
- After document-reviewer reviews a part's work plan — batch-approve that part's implementation (once per part)

After a part's batch approval, execution is autonomous until that part's completion report or an escalation; the next part starts with its own plan review and batch approval.

```mermaid
graph TB
    A[User Request] --> B[requirement-analyzer]
    B --> C[prd-creator: full or lite PRD with Delivery Parts]
    C --> CR[document-reviewer]
    CR --> SCALE{Scale}

    SCALE --> |Small| SP[work-planner: simplified plan]
    SCALE --> |Medium or Large| UX{UI surface?}
    UX --> |Yes| UXD[ux-designer → document-reviewer]
    UX --> |No| EX{Expert Analysis?}
    UXD --> EX
    EX --> |Optional| EA[expert-analyst x3-5 in parallel]
    EX --> |Skip| PART[Next part in dependency order]
    EA --> PART

    PART --> AN[codebase-analyzer / ui-analyzer]
    AN --> D[technical-designer / -frontend]
    D --> DR[document-reviewer]
    DR --> DS[design-sync]
    DS --> F[acceptance-test-generator]
    F --> MORE{More parts to design?}
    MORE --> |Yes| PART
    MORE --> |No| BP[Next part to build]

    BP --> G[work-planner]
    G --> PR[document-reviewer: plan review]
    PR --> H[task-decomposer]
    SP --> H

    H --> I[task-executor]
    I --> J[quality-fixer]
    J --> K{More tasks?}
    K --> |Yes| I
    K --> |No| L{More parts to build?}
    L --> |Yes| BP
    L --> |No| M[Completion report]
```

---

## The Diagnosis Workflow

Root cause analysis for bugs, errors, and unexpected behavior. Uses a multi-agent investigation pipeline that gathers evidence before proposing solutions.

**Command**: `/diagnose <problem description>`

**How it works**:

1. **investigator** examines the codebase, logs, and error messages to build an evidence matrix — a structured collection of facts, hypotheses, and confidence levels
2. Based on complexity, the workflow branches:
   - **Complex problems** — **verifier** independently validates the investigator's conclusions, eliminating false leads and confirming root causes
   - **Simple problems** — Skip directly to solver
3. **solver** takes the validated conclusions and produces actionable solutions with step-by-step implementation guidance

**When to use**:
- Bugs that aren't obvious from the stack trace
- Performance issues with unclear bottlenecks
- Flaky tests or intermittent failures
- Behavior that doesn't match expectations

```mermaid
graph LR
    P[Problem] --> INV[investigator]
    INV --> |Evidence Matrix| ASS{Complex?}
    ASS --> |Yes| VER[verifier]
    ASS --> |No| SOL[solver]
    VER --> |Validated Conclusion| SOL
    SOL --> |Solutions + Steps| R[Report]
```

---

## The Audit Workflow

Interactive dead code detection and cleanup. Scans the codebase for unused exports, orphaned files, and dead code paths, then lets you decide what to do with each finding.

**Command**: `/audit`

**How it works**:

1. **code-explorer** runs an undirected sweep to identify unused exports, unreachable code, orphaned files, and deprecated patterns
2. You review each finding interactively and decide: **delete**, **keep** (with justification), or **deprecate** (mark for future removal)
3. After confirmation, **cleanup-executor** applies the approved changes on a safety branch, runs the full build and test suite, and reports results

**Safety guarantees**:
- All changes happen on a separate branch
- Build and tests must pass before the branch is considered clean
- Nothing is deleted without your explicit approval per item

```mermaid
graph LR
    A["/audit"] --> S[code-explorer sweep]
    S --> |Findings| R{Review each item}
    R --> |Delete / Keep / Deprecate| C[Confirm cleanup]
    C --> X[cleanup-executor]
    X --> |Safety branch + build check| D[Report]
```

---

## The Reverse Engineering Workflow

Generates documentation from existing code. Useful when you inherit a codebase without docs or need to formalize undocumented features.

**Command**: `/reverse-engineer`

**How it works**:

The workflow runs in two phases with a gate between them:

**Phase 1 — PRD Generation**:
1. **scope-discoverer** analyzes the codebase to identify features, boundaries, and dependencies
2. **prd-creator** generates a PRD (Product Requirements Document) describing what the code does in business terms
3. **code-verifier** validates the PRD against actual code behavior — ensures claims match reality
4. **document-reviewer** reviews the PRD for completeness and accuracy

**Gate**: All PRDs must be approved before Phase 2 begins.

**Phase 2 — Design Doc Generation**:
1. **scope-discoverer** re-analyzes with focus on technical architecture
2. **technical-designer** generates a Design Doc with interfaces, data flows, and component relationships
3. **code-verifier** validates technical accuracy against the actual implementation
4. **document-reviewer** reviews the Design Doc

**Output**: Production-quality PRD and Design Doc that accurately reflect the existing codebase.

```mermaid
graph TB
    subgraph Phase1[Phase 1: PRD Generation]
        CMD["/reverse-engineer"] --> SD1[scope-discoverer]
        SD1 --> PRD[prd-creator]
        PRD --> CV1[code-verifier]
        CV1 --> DR1[document-reviewer]
    end

    subgraph Phase2[Phase 2: Design Doc Generation]
        SD2[scope-discoverer] --> DD[technical-designer]
        DD --> CV2[code-verifier]
        CV2 --> DR2[document-reviewer]
        DR2 --> DONE[Complete]
    end

    DR1 --> |All PRDs Approved| SD2
```

---

## The Gamedev Implementation Workflow

Extended implementation workflow for game development with Phaser 3. Adds market analysis, GDD-driven design, and 12 specialized game agents on top of the shared pipeline.

**Command**: `/implement <game feature or concept>`

**How it works**:

The workflow detects the project context and branches into two scenarios:

- **Scenario A (New Project)** — No existing GDD or project config. Full pipeline: market analysis with Go/No-Go gate, GDD creation, art direction, mechanics architecture, analytics design, then standard implementation
- **Scenario B (Existing Project)** — GDD already exists. Updates the GDD for the new feature, runs relevant specialist agents based on feature type, then standard implementation

**Game-specific phases** (not present in backend/frontend):
- **Market analysis** — competitor research, target audience, monetization strategy, Go/No-Go recommendation
- **GDD creation/update** — game vision, core loop, progression systems, balancing parameters
- **Specialist agents** — mechanics-developer, game-feel-developer, sr-game-artist, technical-artist, game-ui-designer, data-scientist each contribute their domain expertise
- **6-phase work planning** — tasks organized by game development phases instead of generic Foundation/Core/Integration/QA

See [detailed gamedev workflow diagrams](gamedev-workflows.md) for all scale variants, scenario detection, development modes, and phase dependencies.

```mermaid
graph TB
    A[User Request] --> B[requirement-analyzer]
    B --> |Scenario A: New Project| MA[market-analyst → Go/No-Go]
    B --> |Scenario B: Existing| SGD2[sr-game-designer → GDD update]
    MA --> SGD[sr-game-designer → GDD]
    SGD --> GAME[mid-game-designer → mechanics-developer<br/>→ game-feel-developer → artists → ui-ux → analytics]
    SGD2 --> GAME
    GAME --> TD[technical-designer → Design Doc]
    TD --> DR[document-reviewer → design-sync]
    DR --> WP[gamedev-work-planner → 6-phase plan]
    WP --> AUTO[task-decomposer → task-executor → quality-fixer]
    AUTO --> DONE[Ready to Commit]
```
