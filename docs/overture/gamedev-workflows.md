# Gamedev Workflows

## Scenario Detection

```mermaid
graph TD
    A[User Request] --> B[requirement-analyzer]
    B --> C{project-config.json exists?}
    C --> |No| D{GDD exists?}
    C --> |Yes| E{GDD exists?}
    D --> |No| F[Scenario A: New Project]
    D --> |Yes| G[Scenario B: Pre-GDD Project]
    E --> |Yes| H[Scenario B: Existing Project]
    E --> |No| G
    F --> SC{Scale?}
    H --> SC
    G --> SC
    SC --> |Large 6+| L[Large Flow]
    SC --> |Medium 3-5| M[Medium Flow]
    SC --> |Small 1-2| S[Small Flow]
```

## Development Modes

```mermaid
graph LR
    REQ[requirement-analyzer] --> MODE{Development Mode?}
    MODE --> |Full Development| FULL[Standard scale-based flow]
    MODE --> |Design Only| DESIGN[Execute through design phases only]
    MODE --> |Prototype| PROTO[Core mechanics only]
    DESIGN --> STOP[Deliver design package]
    PROTO --> SIMPLE[Simplified plan → mechanics execution]
```

## Large Scale — Scenario A: New Project

```mermaid
graph TB
    A[User Request] --> B[requirement-analyzer]
    B --> |"Stop: Requirements + Dev Mode"| MA[market-analyst]
    MA --> |"Stop: Go/No-Go"| PA[producer-agent]
    PA --> SGD[sr-game-designer → GDD]
    SGD --> DR1[document-reviewer]
    DR1 --> |"Stop: GDD Approval"| MGD[mid-game-designer]
    MGD --> MD[mechanics-developer]
    MD --> GFD[game-feel-developer]
    GFD --> ART[sr-game-artist + technical-artist]
    ART --> UI[ui-ux-agent]
    UI --> DS[data-scientist]
    DS --> ADR{Architecture changes?}
    ADR --> |Yes| TD1[technical-designer → ADR]
    TD1 --> DR2[document-reviewer]
    DR2 --> |"Stop: ADR Approval"| TD2[technical-designer → Design Doc]
    ADR --> |No| TD2
    TD2 --> DR3[document-reviewer]
    DR3 --> SYNC[design-sync]
    SYNC --> |"Stop: Design Doc Approval"| ATG[acceptance-test-generator]
    ATG --> WP[gamedev-work-planner]
    WP --> |"Stop: Batch Approval"| AUTO[Autonomous Execution]

    AUTO --> TDECOMP[task-decomposer]
    TDECOMP --> LOOP[task-executor → quality-fixer → commit]
    LOOP --> DONE[Completion Report]
```

## Large Scale — Scenario B: Large Feature (Existing Project)

```mermaid
graph TB
    A[User Request] --> B[requirement-analyzer]
    B --> |"Stop: Requirements"| SGD[sr-game-designer → GDD update]
    SGD --> DR1[document-reviewer]
    DR1 --> |"Stop: GDD Approval"| MD[mechanics-developer]
    MD --> COND{Feature type?}
    COND --> |Polish| GFD[game-feel-developer]
    COND --> |Art| ART[sr-game-artist]
    COND --> |UI| UI[ui-ux-agent]
    COND --> |Analytics| DS[data-scientist]
    COND --> |Code only| TD
    GFD --> TD[technical-designer → Design Doc]
    ART --> TD
    UI --> TD
    DS --> TD
    TD --> DR2[document-reviewer]
    DR2 --> SYNC[design-sync]
    SYNC --> |"Stop: Design Doc Approval"| ATG[acceptance-test-generator]
    ATG --> WP[gamedev-work-planner]
    WP --> |"Stop: Batch Approval"| AUTO[Autonomous Execution]
    AUTO --> DONE[Completion Report]
```

## Medium Scale (3-5 Files)

```mermaid
graph TB
    A[User Request] --> B[requirement-analyzer]
    B --> |"Stop: Requirements"| COND{Mechanics involved?}
    COND --> |Yes| SGD[sr-game-designer → game design spec]
    COND --> |No| MGD[mid-game-designer → feature spec]
    SGD --> MD[mechanics-developer]
    MGD --> COND2{UI or Polish?}
    MD --> COND2
    COND2 --> |UI| UI[ui-ux-agent]
    COND2 --> |Polish| GFD[game-feel-developer]
    COND2 --> |Neither| TD
    UI --> TD[technical-designer → Design Doc]
    GFD --> TD
    TD --> DR[document-reviewer]
    DR --> SYNC[design-sync]
    SYNC --> |"Stop: Design Doc Approval"| ATG[acceptance-test-generator]
    ATG --> WP[gamedev-work-planner]
    WP --> |"Stop: Batch Approval"| AUTO[Autonomous Execution]
    AUTO --> DONE[Completion Report]
```

## Small Scale (1-2 Files)

```mermaid
graph LR
    A[User Request] --> B[Simplified Plan]
    B --> |"Stop: Batch Approval"| C[Direct Implementation]
    C --> D[quality-fixer]
    D --> E[Ready to Commit]
```

## 6-Phase Game Work Planning

```mermaid
graph LR
    P1[Phase 1: Core Mechanics] --> P2[Phase 2: Game Feel]
    P2 --> P3[Phase 3: Art Integration]
    P3 --> P4[Phase 4: UI Implementation]
    P4 --> P5[Phase 5: Analytics]
    P5 --> P6[Phase 6: QA & Performance]
```

### Phase Dependencies

```mermaid
graph TB
    P1[Phase 1: Core Mechanics<br/>mechanics-developer] --> P2[Phase 2: Game Feel<br/>game-feel-developer]
    P1 --> P3[Phase 3: Art Integration<br/>technical-artist]
    P1 --> P4[Phase 4: UI<br/>ui-ux-agent]
    P3 --> P4
    P1 -.-> P5[Phase 5: Analytics<br/>data-scientist]
    P2 --> P6[Phase 6: QA<br/>qa-agent]
    P3 --> P6
    P4 --> P6
    P5 --> P6

    style P1 fill:#e1f5fe
    style P2 fill:#fff3e0
    style P3 fill:#f3e5f5
    style P4 fill:#e8f5e9
    style P5 fill:#fce4ec
    style P6 fill:#fff9c4
```

- Phase 2 (Game Feel) depends on Phase 1 — needs systems to attach feedback to
- Phase 3 (Art) can partially parallel Phase 1 — asset pipeline is independent
- Phase 4 (UI) depends on Phase 1 (game state) and Phase 3 (visual assets)
- Phase 5 (Analytics) can parallel Phases 3-4 — event schema is independent
- Phase 6 (QA) depends on all previous phases but can start performance baselines early

## Per-Task Quality Cycle

Same as the shared overture pattern:

```mermaid
graph LR
    TE[task-executor] --> ESC{Escalation?}
    ESC --> |No| QF[quality-fixer]
    ESC --> |Yes| USER[Escalate to User]
    QF --> |approved| COMMIT[git commit]
    QF --> |failed| TE
    COMMIT --> NEXT{More tasks?}
    NEXT --> |Yes| TE
    NEXT --> |No| REPORT[Completion Report]
```

## Agent Communication Flow

```mermaid
graph TB
    SGD[sr-game-designer<br/>GDD] --> MGD[mid-game-designer<br/>Feature Specs]
    SGD --> MD[mechanics-developer<br/>Systems Architecture]
    MD --> GFD[game-feel-developer<br/>Feedback Systems]
    SGD --> SGA[sr-game-artist<br/>Art Direction]
    SGA --> TA[technical-artist<br/>Pipeline Specs]
    MGD --> UI[ui-ux-agent<br/>UI/UX Design]

    MGD --> TD[technical-designer<br/>Design Doc]
    MD --> TD
    GFD --> TD
    TA --> TD
    UI --> TD
    DS[data-scientist<br/>Analytics] --> TD

    TD --> WP[gamedev-work-planner<br/>6-Phase Plan]
```
