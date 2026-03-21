# Growth Metrics & Strategies

## AARRR Framework (Pirate Metrics)

Five stages of the customer lifecycle funnel:

| Stage | Metric | Key Question | Example KPIs |
|-------|--------|-------------|-------------|
| **Acquisition** | How people find you | "Where do users come from?" | Visitors, signups, CAC by channel |
| **Activation** | First value experience | "Do they have a great first experience?" | Signup-to-activation rate, time-to-value |
| **Retention** | Users come back | "Do they keep using it?" | D1/D7/D30 retention, DAU/MAU, churn rate |
| **Revenue** | Users pay | "Do they pay?" | Conversion rate, ARPU, LTV, MRR |
| **Referral** | Users bring others | "Do they tell others?" | Viral coefficient (K-factor), NPS, referral rate |

### Funnel Audit Process

```yaml
For each stage:
  1. Measure current performance
  2. Benchmark against industry
  3. Identify the biggest drop-off
  4. Prioritize fixing the worst stage first (biggest leverage)
```

**Rule**: Fix the funnel from top to bottom. Acquisition without activation is waste. Revenue without retention is a leaky bucket.

### Industry Benchmarks (SaaS B2B)

| Metric | Poor | Average | Good | Great |
|--------|------|---------|------|-------|
| Signup → Activation | <20% | 20-35% | 35-50% | >50% |
| Month 1 Retention | <60% | 60-75% | 75-85% | >85% |
| Free → Paid | <2% | 2-5% | 5-10% | >10% |
| NPS | <0 | 0-30 | 30-50 | >50 |
| Viral Coefficient (K) | <0.2 | 0.2-0.5 | 0.5-0.8 | >0.8 |

## Product-Led Growth (PLG)

### Core Principles

- Product is the primary driver of acquisition, activation, retention, expansion
- Users get value BEFORE they pay (freemium, free trial, reverse trial)
- Data-driven: every interaction is measured and optimized
- Self-serve: users can buy/upgrade without talking to sales

### PLG Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| **Time-to-Value (TTV)** | Time from signup to first value moment | < 5 minutes (ideal: < 60 seconds) |
| **PQL** (Product-Qualified Lead) | User who demonstrated buying intent through usage | Conversion 25-30% |
| **NRR** (Net Revenue Retention) | Revenue from existing customers including expansion | > 120% |
| **Natural rate of growth** | Organic growth from product usage (no sales/marketing) | Measures PLG efficiency |

### PLG vs Sales-Led Decision

```yaml
PLG works when:
  - ACV < $50K (self-serve is viable)
  - Product is simple to try
  - Value is experienced quickly
  - End user = buyer OR can influence buyer
  - Network effects drive adoption

Sales-Led works when:
  - ACV > $50K (justifies sales cost)
  - Product requires setup/customization
  - Buyer ≠ user (procurement-driven)
  - Compliance/security gates exist
  - Relationship is part of the value

Hybrid (PLG + Sales) when:
  - Land with PLG, expand with sales
  - SMB via PLG, Enterprise via sales
  - Most B2B SaaS in 2026
```

## Community-Led Growth (CLG)

### Principles

- Community of users/fans as primary growth engine
- Lower CAC through organic advocacy
- Stronger retention through belonging and peer support
- Knowledge base built by community

### CLG Metrics

| Metric | What It Measures |
|--------|-----------------|
| Community size | Total active members |
| Engagement rate | Active members / total members |
| Community-sourced leads | Signups attributable to community |
| CSAT from community users | Satisfaction of community members vs non-members |
| Content contribution rate | Members creating content / total members |

### CLG Best Practices

1. **Purpose**: Clear "why" for the community (not "promote our product")
2. **Platform**: Match platform to audience (Discord for dev/gaming, Slack for B2B, forum for long-form)
3. **Content**: 80% value, 20% product — never flip this ratio
4. **Moderation**: Dedicated community manager (not a marketing intern)
5. **Metrics**: Connect community engagement to business outcomes

## Output Template

```markdown
# Growth Analysis

## Funnel Audit (AARRR)
| Stage | Current | Benchmark | Gap | Priority |
|-------|---------|-----------|-----|----------|
| Acquisition | [X] | [X] | [X] | [1-5] |
| Activation | [X]% | [X]% | [X]pp | [1-5] |
| Retention | [X]% | [X]% | [X]pp | [1-5] |
| Revenue | $[X] | $[X] | [X] | [1-5] |
| Referral | K=[X] | K=[X] | [X] | [1-5] |

**Biggest bottleneck**: [stage] — [why]
**Recommended focus**: [stage] — [expected impact]

## Growth Motion: [PLG / Sales-Led / CLG / Hybrid]
**Rationale**: [why this motion]
**Key metric to track**: [metric]

## Growth Opportunities
1. [opportunity] — Impact: [High/Med/Low], Effort: [High/Med/Low]
2. [opportunity] — Impact: [High/Med/Low], Effort: [High/Med/Low]
```
