# Story Mapping

## Jeff Patton User Story Mapping

User Story Mapping arranges user stories along two dimensions to create a visual representation of the user's journey through the product. It prevents the common failure mode of a flat backlog where context and sequence are lost.

### Structure

```
                            TIME (User's journey) →
                ┌──────────┬──────────┬──────────┬──────────┐
    BACKBONE    │Activity 1│Activity 2│Activity 3│Activity 4│  ← User activities
                ├──────────┼──────────┼──────────┼──────────┤
    WALKING     │ Story 1a │ Story 2a │ Story 3a │ Story 4a │  ← Minimum for e2e flow
    SKELETON    │          │          │          │          │
                ├──────────┼──────────┼──────────┼──────────┤
    RELEASE 1   │ Story 1b │ Story 2b │          │ Story 4b │  ← First real release
    (MVP)       │ Story 1c │          │          │          │
                ├──────────┼──────────┼──────────┼──────────┤
    RELEASE 2   │ Story 1d │ Story 2c │ Story 3b │ Story 4c │  ← Second release
                │          │ Story 2d │ Story 3c │          │
                ├──────────┼──────────┼──────────┼──────────┤
    RELEASE 3   │ Story 1e │ Story 2e │ Story 3d │ Story 4d │  ← Third release
  DETAIL        │          │          │ Story 3e │ Story 4e │
                └──────────┴──────────┴──────────┴──────────┘
       ↓
    (less essential)
```

### Axis Definitions

| Axis | What It Represents | Moves Left to Right / Top to Bottom |
|------|-------------------|--------------------------------------|
| **Horizontal** | User's journey through time | Activities in the order the user experiences them |
| **Vertical** | Detail level and priority | More essential (top) to less essential (bottom) |

### Layer Definitions

| Layer | Definition | Populated From | Rule |
|-------|-----------|----------------|------|
| **Backbone** | Top row of user activities, in chronological order | `jobs-graph.md` — each job becomes an activity column | Must cover the complete user journey from trigger to outcome |
| **Walking Skeleton** | Minimum stories needed for a working end-to-end flow | Core steps within each activity — one story per activity | Must be technically functional, not just a mockup |
| **Release 1 (MVP)** | First real release to users | Must-Have features from MoSCoW analysis | Must complete the Core Job — references `mvp-definition.md` |
| **Release 2+** | Subsequent releases adding Should-Have and Could-Have features | Should-Have and Could-Have from MoSCoW | Each release adds a horizontal slice of value |

### Building the Map: Step by Step

**Step 1 — Frame the story**
```
Who: [target segment from customer-segments.md]
Core Job: [from jobs-graph.md]
Trigger: [what initiates the journey — from Job 1 "When" section]
Desired Outcome: [what "done" looks like — from last Job "Want" section]
```

**Step 2 — Build the backbone (activities)**
Walk through the user's journey from trigger to outcome. Each major activity becomes a column. Source from `jobs-graph.md` job sequence:

```
Job 1 → Activity 1: [job name]
Job 2 → Activity 2: [job name]
Job 3 → Activity 3: [job name]
...
Job N → Activity N: [job name]
```

**Step 3 — Add steps under each activity**
Break each activity into specific user steps. These become the stories in the vertical columns.

**Step 4 — Identify the walking skeleton**
Mark the minimum story in each column needed for a working end-to-end flow. This is the thinnest possible horizontal slice.

**Step 5 — Slice releases**
Draw horizontal lines across the map to define releases. Each slice is a complete horizontal cut that adds value across the journey.

### Story Mapping Template

```markdown
# Story Map: [Feature/Product Name]

**Date**: [current date]
**Target segment**: [from customer-segments.md]
**Core Job**: [from jobs-graph.md]
**Trigger**: [from Job 1 "When" → Trigger]
**Desired Outcome**: [from last Job "Want"]

## Backbone (Activities in Order)

| Activity 1 | Activity 2 | Activity 3 | Activity N |
|------------|------------|------------|------------|
| [Job 1 name] | [Job 2 name] | [Job 3 name] | [Job N name] |

## Walking Skeleton (Minimum End-to-End)

| Activity 1 | Activity 2 | Activity 3 | Activity N |
|------------|------------|------------|------------|
| [simplest version of step] | [simplest version] | [simplest version] | [simplest version] |

## Release 1 — MVP (Must-Haves)

| Activity 1 | Activity 2 | Activity 3 | Activity N |
|------------|------------|------------|------------|
| [story 1a] | [story 2a] | [story 3a] | [story Na] |
| [story 1b] | [story 2b] | | |

## Release 2 (Should-Haves)

| Activity 1 | Activity 2 | Activity 3 | Activity N |
|------------|------------|------------|------------|
| [story 1c] | [story 2c] | [story 3b] | [story Nb] |

## Release 3 (Could-Haves)

| Activity 1 | Activity 2 | Activity 3 | Activity N |
|------------|------------|------------|------------|
| [story 1d] | [story 2d] | [story 3c] | [story Nc] |
```

---

## Job Stories vs User Stories

### Format Comparison

| Aspect | User Story | Job Story |
|--------|-----------|-----------|
| **Format** | "As a [persona], I want to [action], so that [benefit]" | "When [situation], I want to [need], so I can [goal]" |
| **Focus** | Who the user is (role-centric) | What situation the user is in (context-centric) |
| **Origin** | Agile/Scrum (Mike Cohn) | JTBD (Alan Klement) |
| **Best for** | Sprint planning, team communication | Discovery, prioritization, understanding motivation |
| **Weakness** | Personas can be fictional, "so that" often contrived | Less familiar to most teams, harder to estimate |

### Why Job Stories Are JTBD-Compatible

Job Stories focus on the **situation** rather than the **persona**. This matters because the same person behaves differently in different situations:

| User Story (persona-driven) | Job Story (situation-driven) |
|---------------------------|----------------------------|
| "As a project manager, I want to see a Gantt chart, so that I can track progress" | "When I'm preparing for a stakeholder meeting and need to show project status, I want to see timeline vs. actual progress, so I can identify delays before I'm asked about them" |
| "As a user, I want to export data, so that I can use it elsewhere" | "When I need to share findings with a colleague who doesn't have an account, I want to send them a self-contained view of the data, so they can act on it without signing up" |

The Job Story reveals the **real motivation** (avoiding embarrassment in meetings, enabling action without signup) that the User Story hides behind a generic "so that."

### When to Use Which

| Phase | Recommended Format | Rationale |
|-------|-------------------|-----------|
| **Discovery & Opportunity Mapping** | Job Stories | Context-driven, reveals true motivation, connects to AJTBD |
| **Story Mapping (backbone)** | Job Stories | Activities map to jobs-graph situations |
| **Sprint Planning** | User Stories (translated) | Teams are familiar, easier to estimate |
| **Acceptance Criteria** | Given/When/Then (Gherkin) | Testable, unambiguous, works with both formats |

### Job Story Template

```markdown
**When** [situation — context + trigger from jobs-graph.md]
**I want to** [need — the capability or action required]
**So I can** [goal — the desired outcome, linked to job success criteria]

**Source**: jobs-graph.md → Job [X]: [name] → Problem [Y]
**Acceptance Criteria**:
1. Given [context], When [action], Then [result]
2. Given [context], When [action], Then [result]
3. Given [context], When [action], Then [result]
```

### Translation Guide: Job Story to User Story

When the team prefers User Stories for sprint planning, translate Job Stories systematically:

| Job Story Component | Maps To User Story | Example |
|--------------------|--------------------|---------|
| **When [situation]** | Context for acceptance criteria (Given) | Given a user is preparing a stakeholder report |
| **I want to [need]** | "I want to [action]" | I want to generate a status summary |
| **So I can [goal]** | "So that [benefit]" | So that I can present progress confidently |
| **Segment** (from customer-segments.md) | "As a [persona]" | As a project manager |

**Translated**: "As a project manager, I want to generate a status summary, so that I can present progress confidently."
**Original context preserved in acceptance criteria**: "Given the user is preparing for a stakeholder meeting within the next 24 hours..."

---

## From jobs-graph to Story Map

The `jobs-graph.md` document provides the structural backbone for the story map. This section explains the exact conversion process.

### Step 1: Jobs Graph Provides the Backbone

Each job in the sequential job graph becomes an activity column:

| jobs-graph.md | Story Map |
|--------------|-----------|
| Job 1: [name] | Activity Column 1: [same name] |
| Job 2: [name] | Activity Column 2: [same name] |
| Job 3: [name] | Activity Column 3: [same name] |
| Job N: [name] | Activity Column N: [same name] |

### Step 2: Problems Become Feature Opportunities

High-severity problems from each job become feature stories in that job's column:

| Job | Problem (from jobs-graph) | Severity | Feature Story |
|-----|--------------------------|----------|---------------|
| Job 1 | "[problem description]" | 9/10 | "When [Job 1 context], I want to [solution to problem], so I can [Job 1 success criteria]" |
| Job 2 | "[problem description]" | 8/10 | "When [Job 2 context], I want to [solution to problem], so I can [Job 2 success criteria]" |
| Job 3 | "No significant problems" | — | Walking skeleton only — no additional stories needed |

### Step 3: Feature Specs Fill In the Details

Feature specifications (Shape Up pitches) from `feature-specification.md` provide the detailed stories beneath each activity:

```
Activity Column (from jobs-graph Job)
├── Walking Skeleton story (minimum viable step)
├── Feature A stories (from Shape Up pitch, Must-Have)
│   ├── Story A1 (key element 1 of pitch)
│   └── Story A2 (key element 2 of pitch)
├── Feature B stories (from Shape Up pitch, Should-Have)
│   └── Story B1
└── Feature C stories (Could-Have)
    └── Story C1
```

### Step 4: MoSCoW Drives Release Slicing

The MoSCoW categorization from `mvp-definition.md` determines which horizontal slice each story belongs to:

| MoSCoW Category | Story Map Release | Position |
|-----------------|------------------|----------|
| Must-Have | Release 1 (MVP) | Just below walking skeleton |
| Should-Have | Release 2 | Below Release 1 line |
| Could-Have | Release 3 | Below Release 2 line |
| Won't-Have | Not on map (or far bottom as "future") | Off the map |

### Complete Conversion Example

```markdown
## Source: jobs-graph.md (Freelancer Invoice Tool)

Job 1: Create Invoice → Job 2: Send to Client → Job 3: Track Payment → Job 4: Follow Up

## Resulting Story Map

| Create Invoice | Send to Client | Track Payment | Follow Up |
|---------------|---------------|--------------|-----------|
| **Walking Skeleton** | | | |
| Enter line items manually | Email invoice as PDF | Mark as paid/unpaid | — (manual for skeleton) |
| **Release 1 (MVP)** | | | |
| Add client details | Send via email with link | Dashboard showing status | Send payment reminder |
| Calculate tax automatically | Custom email message | Filter by status | |
| **Release 2** | | | |
| Save invoice templates | Send via Slack/SMS | Auto-reconcile with bank | Auto-remind after X days |
| Multi-currency support | Schedule send | Export to accounting | Escalation workflow |
| **Release 3** | | | |
| AI-generate line items from timesheet | Client portal for viewing | Predictive payment scoring | Collection agency integration |
```

---

## Acceptance Criteria

### Given/When/Then Format (Gherkin)

Every story on the map needs acceptance criteria in Gherkin format:

```gherkin
Given [precondition — the state of the world before the action]
When [action — what the user does]
Then [expected result — observable outcome]
```

### Writing Good Acceptance Criteria

| Rule | Good Example | Bad Example |
|------|-------------|-------------|
| **Be specific about state** | "Given the user has 3 unpaid invoices" | "Given the user has invoices" |
| **One action per When** | "When the user clicks Send" | "When the user fills in details and clicks Send" |
| **Observable outcome** | "Then a confirmation email is sent within 5 seconds" | "Then the system processes the request" |
| **Include error cases** | "Given the email address is invalid, When..., Then an error message shows 'Invalid email'" | (missing — only happy path) |

### Acceptance Criteria Template (Per Story)

```markdown
## Story: [name]

**Job Story**: When [situation], I want to [need], so I can [goal]
**Source**: jobs-graph.md → Job [X], Problem [Y]
**MoSCoW**: [Must-Have / Should-Have / Could-Have]

### Acceptance Criteria

1. **Happy path**
   Given [normal precondition]
   When [standard action]
   Then [expected result]

2. **Edge case**
   Given [boundary condition]
   When [same or similar action]
   Then [appropriate handling]

3. **Error case**
   Given [invalid state or input]
   When [action that should fail]
   Then [error message or recovery]

4. **Performance** (if applicable)
   Given [load condition — e.g., 1000 records]
   When [action]
   Then [result within X seconds]
```

### Linking to Job Success Criteria

Acceptance criteria should map to success criteria from `jobs-graph.md`:

| Job Success Criteria (jobs-graph.md) | Story Acceptance Criterion |
|-------------------------------------|---------------------------|
| "Invoice sent within 2 minutes of creation" | Given a completed invoice, When user clicks Send, Then email is delivered within 30 seconds |
| "Client receives professional-looking document" | Given default template, When invoice is rendered, Then it includes logo, formatted table, and total |
| "Payment status visible without manual checking" | Given 5 sent invoices, When user opens dashboard, Then each shows current status (paid/unpaid/overdue) |

### How Many Criteria Per Story

| Story Size | Criteria Count | Rationale |
|-----------|---------------|-----------|
| Small (1-2 days) | 3 | Happy path + 1 edge + 1 error |
| Medium (3-5 days) | 3-5 | Happy path + 2 edges + 1-2 errors |
| Large (1-2 weeks) | 5-7 | Consider splitting the story |
| More than 7 criteria | Split the story | Too much complexity for one story |

---

## When NOT to Use Story Mapping

| Situation | Why Story Mapping Is Overkill | What to Use Instead |
|-----------|------------------------------|---------------------|
| **Single-feature product** | Only one activity column — map adds no value | Feature spec (Shape Up pitch) + flat backlog |
| **Pure API / infrastructure work** | No user journey to map — it's technical work | Technical spec + task list |
| **Jobs-graph already provides sufficient structure** | If the job sequence is simple (3-4 jobs, few problems), the map is the jobs-graph | Use jobs-graph directly as the backlog structure |
| **Team of 1-2 developers** | Overhead of maintaining the map exceeds communication benefit | Lightweight spec + task list |
| **Bug fix sprint** | No new user journey — fixing existing flows | Bug triage list ranked by severity |
| **Exploration / spike work** | User journey is unknown — need to discover it first | Discovery interviews / prototypes, then story map |

### When Story Mapping IS Essential

| Signal | Why Story Mapping Helps |
|--------|------------------------|
| 3+ developers working on interconnected features | Visualizes how work fits together — prevents integration surprises |
| Multiple user types / personas using the same flow | Reveals where journeys diverge and converge |
| MVP scoping disagreements | Makes trade-offs visible — horizontal slicing forces prioritization |
| Team keeps building features that don't connect | Map shows gaps in the user journey |
| Stakeholders want to know "what's in Release 1 vs Release 2" | Horizontal slices make release scope tangible |

## Anti-Patterns

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| Flat backlog (no map) | Stories lose context — team builds fragments | Map first, then pull stories into sprints |
| Vertical slice releases | Each release adds one deep feature but leaves journey incomplete | Horizontal slices — each release enables end-to-end flow |
| Story map without backbone | Random stories with no user journey context | Build backbone from jobs-graph first |
| Too many stories per activity | Analysis paralysis, map becomes unreadable | 3-5 stories per activity per release. Split activities if more. |
| Map created once, never updated | Becomes stale artifact nobody references | Review map at the start of each planning cycle |
| Acceptance criteria without error cases | Only happy path tested — bugs in edge cases | Every story needs at least one error/edge case criterion |
| User Stories without Job Story origin | "As a user, I want to..." hides real motivation | Write as Job Story first, translate to User Story if team prefers |
| Skipping the walking skeleton | No way to validate end-to-end flow early | Build and deploy walking skeleton before adding features |
