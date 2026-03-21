# Innovation Accounting

## Why Traditional Metrics Fail for New Products

| Traditional Metric | Why It Fails | Alternative |
|-------------------|-------------|-------------|
| Revenue | Near zero for months/years | Validated learning velocity |
| Market share | Unmeasurable in new markets | Customer acquisition rate |
| ROI | Can't divide by zero | Innovation pipeline value |
| Profit margin | Negative during investment | Unit economics trajectory |

## Innovation Metrics Framework

### Stage-Appropriate Metrics

| Stage | Focus | Key Metrics |
|-------|-------|------------|
| **Problem Validation** | Do customers have this problem? | Problem interview hit rate, severity score |
| **Solution Validation** | Does our solution resonate? | Solution interview conversion, LOI/signup rate |
| **MVP** | Do customers use it? | Activation rate, D7 retention, usage frequency |
| **Product-Market Fit** | Do customers love it? | Sean Ellis test (>40% "very disappointed"), NPS >40 |
| **Scale** | Can we grow efficiently? | LTV:CAC >3:1, payback <12mo, NRR >100% |

### Sean Ellis Test (PMF Validation)

```
Survey question: "How would you feel if you could no longer use [product]?"

Responses:
  - Very disappointed → [X]%  (target: >40%)
  - Somewhat disappointed → [X]%
  - Not disappointed → [X]%

If "Very disappointed" > 40% → Product-Market Fit achieved
If 25-40% → Close, iterate on value proposition
If < 25% → Pivot or major iteration needed
```

### Validated Learning Velocity

```yaml
Definition: "Rate at which assumptions are validated or invalidated"

Tracking:
  assumptions_tested_this_week: [X]
  assumptions_validated: [X]
  assumptions_invalidated: [X]
  pivots_triggered: [X]
  average_test_cycle_time: "[X days]"

Target: 1-2 assumptions tested per week
Warning: 0 assumptions tested for 2+ weeks = stagnation
```

## Innovation Pipeline

### Idea → Experiment → Scale Funnel

```
Ideas (100%)
  → Hypotheses formed (50%)
    → Experiments run (25%)
      → Validated (10%)
        → Scaled (3-5%)
```

**Rule**: Expect 95% failure rate. Budget and plan accordingly.

### Innovation Portfolio (Three Horizons)

| Horizon | Focus | Timeframe | Budget % | Risk | Expected Return |
|---------|-------|-----------|----------|------|----------------|
| **H1**: Core | Improve existing business | 0-12 months | 70% | Low | Incremental |
| **H2**: Adjacent | Expand into related areas | 12-36 months | 20% | Medium | 2-5x |
| **H3**: Transformational | Create new markets | 36+ months | 10% | High | 10x+ |

### Opportunity Scoring

Rate each opportunity on customer-derived criteria:

```yaml
Opportunity Score = Importance + (Importance - Satisfaction)

Where:
  Importance: How important is this outcome? (1-10)
  Satisfaction: How satisfied with current solution? (1-10)

Interpretation:
  Score > 15: Over-served (don't invest)
  Score 10-15: Appropriately served
  Score < 10: Under-served (opportunity!)
  Importance high + Satisfaction low = Best opportunity
```

## Output Template

```markdown
# Innovation Accounting Report

## Current Stage: [Problem Validation / Solution Validation / MVP / PMF / Scale]

## Key Metrics
| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| [stage-appropriate metric 1] | [X] | [X] | [↑↓→] |
| [stage-appropriate metric 2] | [X] | [X] | [↑↓→] |

## Product-Market Fit Assessment
- **Sean Ellis Score**: [X]% very disappointed
- **PMF Status**: [Not yet / Approaching / Achieved]
- **Key gap**: [what's missing]

## Validated Learning Log
| Week | Assumption Tested | Method | Result | Action |
|------|------------------|--------|--------|--------|
| [date] | [assumption] | [method] | [validated/invalidated] | [next step] |

## Innovation Portfolio
| Initiative | Horizon | Stage | Confidence | Next Milestone |
|-----------|---------|-------|-----------|---------------|

## Opportunity Scoring
| Outcome | Importance | Satisfaction | Score | Priority |
|---------|-----------|-------------|-------|----------|

## Recommendations
1. [action] — Impact: [X], Urgency: [X]
2. [action] — Impact: [X], Urgency: [X]
```
