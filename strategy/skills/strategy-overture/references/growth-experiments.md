# Growth Experiments & Prioritization

## ICE Scoring Framework

Quick prioritization for growth experiments.

### Formula

```
ICE Score = Impact × Confidence × Ease
```

| Dimension | Scale | Description |
|-----------|-------|-------------|
| **Impact** | 1-10 | How much will this move the target metric? |
| **Confidence** | 1-10 | How confident are we in the impact estimate? |
| **Ease** | 1-10 | How easy is this to implement? |

### Scoring Guidelines

| Score | Impact | Confidence | Ease |
|-------|--------|-----------|------|
| **10** | >50% improvement | A/B test data exists | < 1 day |
| **8** | 20-50% improvement | Strong analogous data | < 1 week |
| **5** | 5-20% improvement | Educated estimate | 2-4 weeks |
| **3** | 1-5% improvement | Gut feeling with logic | 1-2 months |
| **1** | <1% improvement | Pure speculation | > 3 months |

### When to Use ICE

- Early-stage, rapid experimentation
- Limited data for detailed scoring
- Small team, need speed
- Scoring entire backlog in 60-90 minutes

## RICE Scoring Framework

More rigorous prioritization with reach dimension.

### Formula

```
RICE Score = (Reach × Impact × Confidence) / Effort
```

| Dimension | Scale | Description |
|-----------|-------|-------------|
| **Reach** | Number | How many users/customers affected per time period |
| **Impact** | 0.25-3 | Effect on each user reached (0.25=minimal, 3=massive) |
| **Confidence** | 0-100% | How confident in estimates |
| **Effort** | Person-months | Total work required |

### Impact Scale (Intercom Standard)

| Score | Description |
|-------|-------------|
| **3** | Massive impact per user |
| **2** | High impact |
| **1** | Medium impact |
| **0.5** | Low impact |
| **0.25** | Minimal impact |

### When to Use RICE Over ICE

- Consumer products where reach varies significantly
- Larger team, more resources to score accurately
- Need to compare fundamentally different types of initiatives
- Stakeholders need quantified justification

## Experiment Design Template

```markdown
## Experiment: [Name]

### Hypothesis
"If we [change], then [metric] will [improve by X%] because [reasoning]."

### Scoring
| Framework | Dimension | Score | Rationale |
|-----------|-----------|-------|-----------|
| ICE | Impact | [1-10] | [why] |
| ICE | Confidence | [1-10] | [why] |
| ICE | Ease | [1-10] | [why] |
| **ICE Total** | | **[I×C×E]** | |

### Target Metric
- **Primary**: [metric] — Current: [X], Target: [Y]
- **Guard rail**: [metric we must NOT hurt] — Current: [X], Threshold: [Y]

### Design
- **Variant A (Control)**: [current state]
- **Variant B (Treatment)**: [proposed change]
- **Sample size**: [X users]
- **Duration**: [X days/weeks]
- **Statistical significance**: 95%

### Success Criteria
- [primary metric improves by ≥X%]
- [guard rail metric stays above threshold]

### Next Steps
- **If wins**: [scale to 100%, next iteration]
- **If loses**: [what we learned, next experiment]
- **If inconclusive**: [extend duration or increase sample]
```

## Experiment Backlog Template

```markdown
# Growth Experiment Backlog

## Prioritized Queue

| # | Experiment | Funnel Stage | ICE Score | Status |
|---|-----------|-------------|-----------|--------|
| 1 | [name] | [AARRR stage] | [score] | [planned/running/done] |
| 2 | [name] | [AARRR stage] | [score] | [planned/running/done] |

## Scoring Summary
- Total experiments scored: [X]
- Currently running: [X]
- Completed this month: [X]
- Win rate: [X]%
- Average impact of wins: [X]%

## Learnings Log
| Date | Experiment | Result | Key Learning |
|------|-----------|--------|-------------|
```

## Growth Accounting

Track whether growth is healthy or artificial:

```yaml
New MRR: "$[X] (from new customers)"
Expansion MRR: "$[X] (from upgrades)"
Contraction MRR: "$[X] (from downgrades)"
Churn MRR: "$[X] (from cancellations)"
Net New MRR: "$[New + Expansion - Contraction - Churn]"

Quick Ratio: (New + Expansion) / (Contraction + Churn)
  # > 4 = excellent, 2-4 = good, 1-2 = concerning, < 1 = shrinking
```

## Output Template

```markdown
# Growth Experiment Plan

## Current Growth Health
- **Quick Ratio**: [X]
- **Net New MRR trend**: [growing/flat/declining]
- **Biggest funnel gap**: [AARRR stage]

## Prioritized Experiments (Top 5)
[Experiment design for each]

## Resource Allocation
- **Experiments per sprint**: [X]
- **Team capacity**: [X person-days/sprint]
- **Experiment budget**: $[X]/month

## 90-Day Target
- **Experiments to run**: [X]
- **Expected win rate**: [X]%
- **Target metric improvement**: [X]% in [metric]
```
