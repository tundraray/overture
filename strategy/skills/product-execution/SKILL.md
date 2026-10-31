---
name: product-execution
description: Product execution frameworks for converting strategy analysis into actionable product plans. Use when creating feature specifications, product roadmaps, MVP definitions, opportunity maps, or when "feature spec", "roadmap", "MVP", "product plan", "opportunity map", "WSJF", "Kano", or "Shape Up" is mentioned.
---

# Product Execution — Strategy-to-Product Bridge

## Purpose

This skill bridges the gap between strategic analysis (market research, competitive landscape, AJTBD) and actionable product development. It converts strategy documents into opportunity trees, feature specifications, prioritized roadmaps, and MVP definitions.

## When This Skill Applies

- After strategy analysis is complete and product planning begins
- Creating feature specifications from identified opportunities
- Building or updating product roadmaps
- Defining MVP scope and success criteria
- Prioritizing features using WSJF, Kano, or MoSCoW
- Designing opportunity solution trees from strategy insights

## Core Principles

### 1. Opportunity-First Thinking

Never start with a solution. Start with the opportunity:
1. **Identify the outcome** you want to drive (from strategy docs)
2. **Map the opportunities** that could move that outcome (from jobs-graph problems)
3. **Generate solutions** for the highest-value opportunities
4. **Test assumptions** before committing to build

Features without a traced opportunity are waste.

### 2. Shape Up Pitch Format

Use Ryan Singer's Shape Up pitch as the default feature specification format:
- **Problem** — linked to a specific job and problem from `jobs-graph.md`
- **Appetite** — time budget that constrains the solution (not an estimate)
- **Solution** — low-fidelity description of approach (enough to evaluate, not enough to implement)
- **Rabbit Holes** — known risks and complexity traps
- **No-Gos** — explicit exclusions

Appetite is not an estimate. Estimates answer "how long will this take?" Appetite answers "how much time is this problem worth?"

### 3. WSJF Scoring for Feature Prioritization

Use Weighted Shortest Job First (WSJF) to prioritize features in the roadmap:
- **Cost of Delay** = User/Business Value + Time Criticality + Risk Reduction
- **WSJF** = Cost of Delay / Job Duration
- Score relative to other features, not absolute

### 4. Kano Categorization

Classify every feature by its satisfaction profile:
- **Must-Be**: absence causes dissatisfaction, presence is expected
- **Performance**: linear relationship — more is better
- **Attractive**: delighters — absence is neutral, presence creates joy
- **Indifferent**: no impact — do not build
- **Reverse**: presence causes dissatisfaction — avoid

### 5. Cross-Reference Everything

Every feature must trace back through the strategy document chain:

```
Feature → Opportunity → Job + Problem → Segment → Strategy Insight
```

If you cannot draw this line, the feature lacks strategic justification.

## The Bridge Pattern

Strategy documents feed into product execution in a specific order:

```
Strategy Docs          Product Execution
─────────────          ─────────────────
strategy-canvas.md ──→ Desired Outcomes
jobs-graph.md ───────→ Opportunities (problems at or above the severity threshold, references/opportunity-trees.md)
rat.md ──────────────→ Assumption Tests (map risks to solutions)
customer-segments.md → Target Users (who gets the feature first)
growth-plan.md ──────→ Success Metrics (North Star, AARRR)
business-model.md ───→ Revenue Constraints (pricing, unit economics)
                       ↓
                   Opportunity Tree → Feature Specs → Roadmap → MVP
```

## Reference Map

| Reference File | Purpose | When to Use |
|---------------|---------|-------------|
| `references/opportunity-trees.md` | Teresa Torres Opportunity Solution Tree methodology | When mapping outcomes to opportunities to solutions |
| `references/feature-specification.md` | Shape Up pitch + Amazon PR/FAQ + Cagan lightweight spec | When writing feature specifications |
| `references/roadmap-methods.md` | Now/Next/Later, Kano Model, WSJF scoring | When prioritizing and sequencing features |
| `references/mvp-definition.md` | MoSCoW prioritization, lean MVP, validation planning | When scoping an MVP or defining launch criteria |

## Key Distinction: ICE/RICE vs WSJF

| Framework | Use For | Owned By | Reference |
|-----------|---------|----------|-----------|
| **ICE/RICE** | Growth experiments — short-lived tests with measurable outcomes | growth-strategist | `strategy-overture/references/growth-experiments.md` |
| **WSJF** | Feature prioritization — committed product roadmap items | product-planner | `product-execution/references/roadmap-methods.md` |

Do not use ICE/RICE to prioritize features. Do not use WSJF to prioritize experiments. The frameworks solve different problems.

## Cross-Reference Rules

Every feature specification carries a traceability table in its appendix (the template's Cross-References):

| Field | Source Document | Specific Reference |
|-------|----------------|-------------------|
| **Job** | `jobs-graph.md` | Job [X]: [name] |
| **Segment** | `customer-segments.md` | [segment name] |
| **Problem** | `jobs-graph.md` | Problem [Y]: [description], Severity [Z] |
| **Risk** | `rat.md` | Risk Card [N]: [name], Score [P x I] |
| **Strategy** | `strategy-canvas.md` | [ERRC action]: [factor] |
| **Initiative** | `prioritized-initiatives.md` | Initiative [N]: [name] |

A cell whose source document has no matching entry says "no source" — never an invented link. A feature with neither a Job nor a Problem lacks strategic grounding; question whether it should exist.

## Anti-Patterns

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| Features without job linkage | Building what nobody asked for — solution-first thinking | Every feature traces to a job + problem from `jobs-graph.md` |
| Roadmap without prioritization scores | No defensible ordering — squeaky wheel gets resources | Score every item with WSJF before sequencing |
| MVP without success metrics | Cannot determine if MVP succeeded — endless iteration | Define kill criteria before writing a single line of code |
| Skipping Opportunity Tree | Jumping from outcome to solution misses better alternatives | Always generate 3+ solutions per opportunity, then pick |
| Appetite as estimate | Teams gold-plate because scope is unbounded | Set appetite first, shape solution to fit within it |
| All features as Must-Have | MoSCoW becomes meaningless — everything is critical | Must-Haves should be ~60% of effort; if more, re-evaluate |
| Roadmap as commitment | Dates on Later items create false expectations | Now/Next/Later format — only Now has dates |
