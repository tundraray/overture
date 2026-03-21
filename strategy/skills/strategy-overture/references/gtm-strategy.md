# Go-to-Market Strategy

## Five Pillars of GTM

| Pillar | Focus | Key Deliverable |
|--------|-------|----------------|
| **Product Analysis** | What are we selling? | Feature-benefit mapping |
| **Product Messaging** | How do we communicate value? | Positioning statement + messaging matrix |
| **Sales Proposition** | Why buy from us? Why now? | Sales deck + objection handling |
| **Marketing Strategy** | How do we generate demand? | Channel plan + content calendar |
| **Sales Strategy** | How do we close? | Sales process + enablement |

## ICP (Ideal Customer Profile)

### B2B ICP Template

```yaml
Company:
  industry: "[verticals]"
  size: "[employee range or revenue range]"
  growth_stage: "[startup/scaleup/enterprise]"
  tech_stack: "[relevant technologies]"
  budget: "$[range]/year for this category"
  geography: "[regions]"

Buying Process:
  champion: "[title — who finds you first]"
  decision_maker: "[title — who signs]"
  influencers: "[titles — who affects decision]"
  blockers: "[titles — who can veto]"
  sales_cycle: "[X weeks/months]"
  buying_trigger: "[what event causes them to search]"

Disqualifiers:
  - "[criteria that means bad fit]"
  - "[criteria that means bad fit]"
```

### B2C ICP Template

```yaml
Demographics:
  age_range: "[X-Y]"
  income: "$[range]"
  location: "[urban/suburban/rural, regions]"

Psychographics:
  values: "[what matters to them]"
  lifestyle: "[activity patterns]"
  frustrations: "[what annoys them about current solutions]"

Behavior:
  discovery_channels: "[where they find new products]"
  purchase_triggers: "[what makes them buy]"
  purchase_frequency: "[how often]"
  price_sensitivity: "[high/medium/low]"
```

## Messaging Matrix

| Audience | Pain Point | Value Proposition | Proof Point | CTA |
|----------|-----------|-------------------|-------------|-----|
| [Segment 1] | [their #1 pain] | [how you solve it] | [evidence] | [specific action] |
| [Segment 2] | [their #1 pain] | [how you solve it] | [evidence] | [specific action] |

### Message Hierarchy (Pyramid Principle applied to messaging)

```
Level 1: One-liner (7 words or less)
  → "Reporting that writes itself"

Level 2: Elevator pitch (30 seconds)
  → Problem + Solution + Proof

Level 3: Full positioning statement
  → For [target] who [need], [product] is [category] that [benefit].
     Unlike [competition], we [differentiator].
```

## Channel Strategy

### Channel Selection Matrix

| Channel | CAC | Time to Impact | Scalability | Control | Best For |
|---------|-----|---------------|-------------|---------|----------|
| SEO / Content | Low | 6-12 months | High | High | Established demand, educational product |
| Paid Search (SEM) | Medium-High | Days | High | High | Proven demand, high-intent keywords |
| Paid Social | Medium | Days-Weeks | High | Medium | Awareness, retargeting, B2C |
| Outbound Sales | High | Weeks-Months | Low | High | Enterprise B2B, high ACV |
| Product-Led (PLG) | Very Low | Months | Very High | Low | Self-serve, technical users |
| Partnerships | Medium | Months | Medium | Low | Distribution, credibility, market access |
| Community | Low | Months-Years | Medium | Low | Developer tools, consumer brands |
| Events | High | Weeks | Low | Medium | Enterprise, relationship-driven |
| Referral | Very Low | Months | High | Low | Strong NPS, viral potential |

### Channel Prioritization

```yaml
Primary channel (60% budget):
  channel: "[name]"
  rationale: "[why this is the best fit]"
  target_CAC: "$[X]"
  expected_timeline: "[X months to ROI]"

Secondary channel (30% budget):
  channel: "[name]"
  rationale: "[why this complements primary]"

Experimental (10% budget):
  channel: "[name]"
  hypothesis: "[what we're testing]"
  kill_criteria: "[when to abandon]"
```

## GTM Motion Types

| Motion | Best For | Key Metric | Example |
|--------|---------|-----------|---------|
| **Sales-Led** | Enterprise, high ACV, complex decisions | Pipeline velocity, win rate | Salesforce, Palantir |
| **Product-Led** | Self-serve, technical users, freemium | PQL conversion, time-to-value | Slack, Notion, Figma |
| **Community-Led** | Developer tools, passion products | Community size, engagement | Docker, dbt |
| **Marketing-Led** | SMB, brand-driven, content-heavy | MQL→SQL rate, content ROI | HubSpot |
| **Partner-Led** | Distribution-dependent, ecosystem plays | Partner-sourced revenue | AWS Marketplace |

**75% of B2B buyers prefer rep-free experience** (Gartner 2025) — default to PLG unless ACV > $50K.

## Output Template

```markdown
# Go-to-Market Strategy

## Executive Summary
[One paragraph: target, motion, primary channel, timeline to revenue]

## Ideal Customer Profile
[ICP details]

## Messaging
### Core Positioning
[Positioning statement]

### Messaging Matrix
[By audience segment]

## GTM Motion: [Sales-Led / Product-Led / Community-Led / Hybrid]
**Rationale**: [why this motion]

## Channel Plan
### Primary: [channel] (60% budget)
[Details, CAC target, timeline]

### Secondary: [channel] (30% budget)
[Details]

### Experimental: [channel] (10% budget)
[Hypothesis, success criteria]

## Launch Plan
| Phase | Timeline | Activities | Success Metric |
|-------|----------|-----------|---------------|

## Budget Allocation
| Category | % of Budget | Amount | Expected ROI |
|----------|-------------|--------|-------------|

## KPIs
| Metric | Target (Month 3) | Target (Month 6) | Target (Year 1) |
|--------|------------------|------------------|-----------------|
```
