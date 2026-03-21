# Feature Specification Formats

## Format Selection Guide

| Format | Appetite | When to Use | Output Length |
|--------|----------|-------------|--------------|
| **Shape Up Pitch** | M (1-2 weeks) or L (3-6 weeks) | Default for most features. Problem is understood, solution needs shaping. | 1-3 pages |
| **Amazon PR/FAQ** | L (3-6 weeks) or XL (strategic) | Large features that need cross-team alignment. Strategic bets. | 2-4 pages |
| **Cagan Lightweight Spec** | S (1-2 days) | Small improvements, bug fixes, quick tactical features. | Half page |

---

## Shape Up Pitch (Primary Format)

The Shape Up pitch format (Ryan Singer, Basecamp) is the default feature specification format. It shapes the solution to fit within a time budget rather than estimating time for a predetermined solution.

### Pitch Structure

#### 1. Problem

The problem must link to a specific job and problem from `jobs-graph.md`. Do not invent problems that are not grounded in research.

```markdown
## Problem

**Job**: [Job X from jobs-graph.md]: [job name]
**Problem**: [Problem Y]: [problem description] — Severity: [Z]/10
**Segment**: [segment from customer-segments.md]

[1-2 paragraphs describing the problem in context. Include specific situations where
the problem occurs, how frequently, and what users do today to work around it.]

**Current workaround**: [what users do now — this reveals the bar your solution must clear]
**Cost of inaction**: [what happens if we don't solve this — from rat.md if available]
```

#### 2. Appetite

Appetite is a time budget that constrains the solution. It is NOT an estimate.

| Appetite | Duration | Suitable For |
|----------|----------|-------------|
| **Small (S)** | 1-2 days | Bug fixes, copy changes, config tweaks, tiny improvements |
| **Medium (M)** | 1-2 weeks | Single-feature work, redesigns, integrations |
| **Large (L)** | 3-6 weeks | Major features, new capabilities, architectural work |

```markdown
## Appetite

**Size**: [S / M / L]
**Duration**: [specific time budget]
**Rationale**: This problem is worth [S/M/L] because [why — value vs. cost tradeoff].
If we can't solve it in [duration], we should [reshape / split / defer].
```

**Rules**:
- If a problem requires more than 6 weeks, it needs to be split into multiple pitches
- The appetite shapes the solution — a 2-week appetite produces a different solution than a 6-week appetite
- Never extend appetite after starting — reshape the solution instead

#### 3. Solution

The solution should be described at a level of fidelity that is enough to evaluate but not enough to implement. Show the approach, not the implementation details.

```markdown
## Solution

[Describe the approach using words, rough sketches, or breadboard diagrams.
Focus on the key interactions and the core workflow. Do not specify UI details,
database schemas, or API endpoints — those are implementation decisions.]

**Key elements**:
1. [Element 1]: [what it does, not how it's built]
2. [Element 2]: [what it does, not how it's built]
3. [Element 3]: [what it does, not how it's built]

**How it solves the problem**: [explicit connection between solution elements and the stated problem]
```

**Fidelity guide**:

| Too Vague | Right Level | Too Detailed |
|-----------|-------------|-------------|
| "Make onboarding better" | "New users see a 3-step wizard that asks their role, imports their data, and shows a pre-configured dashboard" | "Step 1 is a React modal with a dropdown using Radix Select component bound to a roles API endpoint..." |
| "Add reporting" | "Users can create a report by selecting a date range and metrics, then export as PDF or share a link" | "PostgreSQL materialized view refreshes every 15 minutes, exposed via GraphQL subscription..." |

#### 4. Rabbit Holes

Rabbit holes are areas of complexity that could derail the solution if not identified upfront. Calling them out prevents teams from discovering them mid-build.

```markdown
## Rabbit Holes

1. **[Risk area]**: [Why this is risky]. To avoid this, we will [mitigation — e.g., use existing library, skip edge case, simplify scope].

2. **[Risk area]**: [Why this is risky]. To avoid this, we will [mitigation].

3. **[Risk area]**: [Why this is risky]. To avoid this, we will [mitigation].
```

**Common rabbit hole categories**:
- Performance at scale (what happens with 10x data?)
- Edge cases in user input (international formats, empty states, error recovery)
- Third-party API reliability (rate limits, downtime, breaking changes)
- Migration of existing data (backwards compatibility, data loss)
- Permissions and access control (who can see/do what?)

#### 5. No-Gos

Explicit exclusions protect scope. They prevent stakeholder creep and keep the solution within appetite.

```markdown
## No-Gos

- **[Excluded thing]**: [Why it's out of scope for this appetite]
- **[Excluded thing]**: [Why — could be a future pitch]
- **[Excluded thing]**: [Why — not worth the complexity]
```

**Rule**: If someone asks "why doesn't this include X?", the No-Gos section should have the answer.

### Complete Shape Up Pitch Template

```markdown
# Pitch: [Feature Name]

**Date**: [current date]
**Author**: [name]
**Status**: [Draft / Betting Table / In Progress / Shipped]

## Traceability

| Field | Source | Reference |
|-------|--------|-----------|
| **Job** | jobs-graph.md | Job [X]: [name] |
| **Segment** | customer-segments.md | [segment name] |
| **Problem** | jobs-graph.md | Problem [Y]: [description], Severity [Z]/10 |
| **Risk** | rat.md | Risk Card [N]: [name], Score [P x I] |
| **Strategy** | strategy-canvas.md | [ERRC action]: [factor] |
| **Initiative** | prioritized-initiatives.md | Initiative [N]: [name] |
| **Opportunity** | opportunity-tree.md | Opportunity [N]: [HMW statement] |

## Problem

[Problem description grounded in jobs-graph evidence]

**Current workaround**: [what users do today]
**Cost of inaction**: [consequence of not solving]

## Appetite

**Size**: [S / M / L]
**Duration**: [time budget]
**Rationale**: [why this problem is worth this investment]

## Solution

[Low-fidelity description of approach]

**Key elements**:
1. [Element]: [what it does]
2. [Element]: [what it does]
3. [Element]: [what it does]

## Rabbit Holes

1. [Risk]: [mitigation]
2. [Risk]: [mitigation]

## No-Gos

- [Exclusion]: [reason]
- [Exclusion]: [reason]

## Acceptance Criteria

1. **Given** [precondition], **When** [action], **Then** [expected result]
2. **Given** [precondition], **When** [action], **Then** [expected result]
3. **Given** [precondition], **When** [action], **Then** [expected result]
```

---

## Amazon PR/FAQ (Alternative for Large Features)

The PR/FAQ format (Amazon "Working Backwards") is used for strategic features that need alignment across teams. Write as if the feature has already shipped.

### Structure

```markdown
# [Feature Name] — Internal Press Release

**Date**: [imagined launch date]
**Target customer**: [segment from customer-segments.md]

## Headline
[One sentence: who is the customer, what is the benefit]

## Subheadline
[One sentence: how the feature delivers the benefit]

## Problem Paragraph
[Describe the customer's problem. Use specific situations and emotions.
Reference jobs-graph.md pain points. Make the reader feel the problem.]

## Solution Paragraph
[Describe how the feature solves the problem. Written from the customer's
perspective — what they experience, not what we built.]

## Quote from Company Leader
"[Why this feature matters strategically — connects to strategy-canvas.md]"

## How It Works
[3-5 steps the customer takes. Simple, concrete, jargon-free.]

## Quote from Customer
"[Testimonial from target segment describing the transformation —
from Point A emotions to Point B emotions, using AJTBD language]"

## Call to Action
[How the customer gets started]

---

## FAQ — Customer Questions

**Q: How is this different from [competitor/alternative]?**
A: [Differentiation — reference strategy-canvas.md ERRC actions]

**Q: How much does this cost?**
A: [Pricing — reference business-model.md]

**Q: What if I need [adjacent feature]?**
A: [Scope boundary — what's included, what's not]

## FAQ — Internal/Stakeholder Questions

**Q: How does this affect our [existing feature]?**
A: [Integration impact]

**Q: What are the key risks?**
A: [Top 3 risks from rat.md with mitigation plans]

**Q: How will we measure success?**
A: [Metrics from growth-plan.md — leading + lagging indicators]

**Q: What's the estimated effort?**
A: [Appetite, not estimate — reference Shape Up sizing]

## Traceability

| Field | Source | Reference |
|-------|--------|-----------|
| **Job** | jobs-graph.md | Job [X]: [name] |
| **Segment** | customer-segments.md | [segment name] |
| **Problem** | jobs-graph.md | Problem [Y]: [description], Severity [Z]/10 |
| **Strategy** | strategy-canvas.md | [ERRC action]: [factor] |
```

### When PR/FAQ Works Better Than Shape Up Pitch

| Signal | Use PR/FAQ |
|--------|-----------|
| Feature needs buy-in from 3+ stakeholders | PR/FAQ forces customer-centric framing that aligns teams |
| Feature creates a new category or capability | Press release format clarifies the "why" before the "what" |
| Feature has significant pricing/business model implications | FAQ section surfaces hard questions early |
| Feature will be externally announced | PR/FAQ doubles as launch communication draft |

---

## Cagan Lightweight Spec (For Small Features)

For features with S appetite (1-2 days), a full Shape Up pitch is overhead. Use this one-page format.

### Template

```markdown
# Feature: [Name]

**Date**: [current date]
**Appetite**: S (1-2 days)
**Job reference**: jobs-graph.md → Job [X], Problem [Y]

## Problem
[2-3 sentences. What's broken or missing.]

## Solution
[2-3 sentences. What we'll do.]

## Acceptance Criteria
1. **Given** [context], **When** [action], **Then** [result]
2. **Given** [context], **When** [action], **Then** [result]
3. **Given** [context], **When** [action], **Then** [result]

## Risks
- [One-liner risk, if any]

## Not Included
- [One-liner exclusion, if any]
```

### When to Use Lightweight Spec

- Bug fixes with clear reproduction steps
- Copy or configuration changes
- Minor UX improvements with obvious solutions
- Features where the implementation approach is self-evident
- Items that a senior developer can hold in their head entirely

---

## Cross-Reference Pattern

Every feature specification, regardless of format, must include a traceability section linking back to strategy documents:

| Field | Source Document | What to Extract | Example |
|-------|----------------|----------------|---------|
| **Job** | `jobs-graph.md` | Job number + name | Job 3: "Configure notification preferences" |
| **Segment** | `customer-segments.md` | Primary segment affected | "SMB Marketing Managers" |
| **Problem** | `jobs-graph.md` | Problem number, description, severity | Problem 2: "No way to set quiet hours", Severity 8/10 |
| **Risk** | `rat.md` | Risk card number, category, P x I score | Risk Card 2: Usability risk, Score 15/25 |
| **Strategy** | `strategy-canvas.md` | ERRC action + competitive factor | Raise: "Customization" from 2 to 5 |
| **Initiative** | `prioritized-initiatives.md` | Initiative number + name | Initiative 3: "Personalization engine" |

**If a field has no match**: Document it as "No direct link — [justification for building without strategic trace]". This forces conscious decisions about unlinked features.

## Acceptance Criteria Standards

All formats use Given/When/Then (Gherkin) for acceptance criteria:

| Component | Purpose | Example |
|-----------|---------|---------|
| **Given** | Precondition — the state of the world before | "Given a user has connected their Slack workspace" |
| **When** | Action — what the user does | "When they set quiet hours to 6pm-8am" |
| **Then** | Expected result — observable outcome | "Then notifications are held and delivered at 8:01am" |

**Rules**:
- 3-5 criteria per feature (fewer = underspecified, more = overspecified)
- Each criterion must be independently testable
- Include at least one error/edge case criterion
- Link criteria to job success criteria from `jobs-graph.md` where possible

## Anti-Patterns

| Anti-Pattern | Signal | Fix |
|-------------|--------|-----|
| Solution masquerading as problem | "The problem is we don't have feature X" | Rewrite: "Users cannot accomplish [job] because [obstacle]" |
| Appetite inflation | "This is really important so let's give it 8 weeks" | Split into multiple pitches. No single pitch exceeds 6 weeks. |
| Spec as contract | 40-page PRD with pixel-perfect mockups | Shape Up pitch: enough to evaluate, not enough to implement |
| Missing No-Gos | Scope creeps because boundaries were never set | Every pitch needs 2-3 explicit No-Gos |
| Orphan acceptance criteria | Criteria not connected to the stated problem | Each criterion should trace to the Problem section |
| Format mismatch | PR/FAQ for a 1-day bug fix | Match format to appetite: S=Lightweight, M/L=Shape Up, XL=PR/FAQ |
