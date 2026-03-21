# MVP Definition: [Product/Business]

**Date**: [current date]
**Analyst**: Product Planner Agent
**MVP Type**: [Wizard of Oz / Concierge / Landing Page / Single-Feature / Full MVP]
**Confidence**: [High / Medium / Low]

## [MVP scope statement as action title — e.g., "MVP with 5 Must-Have features completing the Core Job for Segment #1 in 4 weeks"]

## Core Job Being Served

- **Core Job**: [from segments.md — "When [context], want [result]"]
- **Big Job**: [from segments.md]
- **Primary Segment**: [segments.md → Segment #1]
- **Critical Job Sequence**: [from jobs-graph.md — key jobs MVP must support]

## MVP Scope (MoSCoW)

### Must-Have (MVP is not viable without these)

| # | Feature | Spec | Job Served | Appetite |
|---|---------|------|-----------|----------|
| 1 | [name] | [features/feature-NNN.md] | [Job #N from jobs-graph] | [S/M/L] |

**Total Must-Have appetite**: [X weeks]
**Rule check**: Must-Haves are [X]% of total effort (target ~60%) ✅/❌

### Should-Have (Important, workaround exists)

| # | Feature | Spec | Why Not Must | Workaround |
|---|---------|------|-------------|-----------|
| 1 | [name] | [features/feature-NNN.md] | [rationale] | [how users cope without it] |

### Could-Have (If time permits)

| # | Feature | Spec | Value Add |
|---|---------|------|----------|
| 1 | [name] | [features/feature-NNN.md] | [what it adds] |

### Won't-Have (This Release)

| # | Feature | Why Not Now | When |
|---|---------|-----------|------|
| 1 | [name] | [rationale] | Next / Later / Never |

## Success Metrics

### North Star Metric
- **Metric**: [from growth-plan.md]
- **MVP Target**: [realistic target for MVP period]

### Leading Indicators (measure in first 2 weeks)

| Metric | Target | Source |
|--------|--------|--------|
| [metric] | [target] | [growth-plan.md / business-model.md] |

### Lagging Indicators (measure after 1-3 months)

| Metric | Target | Source |
|--------|--------|--------|
| [metric] | [target] | [business-model.md — unit economics] |

### Kill Criteria
- If [metric] < [threshold] after [timeframe] → [Pivot / Stop / Reassess]

## Validation Plan

### Risk-First Validation (from rat.md)

| # | RAT Risk | Score (P×I) | Validation Method | When | Decision |
|---|---------|------------|------------------|------|---------|
| 1 | [risk from rat.md] | [score] | [method] | Before MVP / During MVP | Go / Pivot / Stop |

### Beta User Plan
- **First 10 users**: [from customer-segments.md — where to find them]
- **Recruitment method**: [how to reach them]
- **Feedback loop**: [how to collect and act on feedback]

## Launch Criteria Checklist

- [ ] All Must-Have features complete and tested
- [ ] Success metrics instrumented and baseline measured
- [ ] First 10 beta users identified and contacted
- [ ] Top 3 risks have validation plan in progress
- [ ] Core Job can be completed end-to-end
- [ ] No critical Rabbit Holes unresolved
- [ ] Pricing tier implemented (from pricing-analysis.md)

## Cross-References

| Document | What It Informed |
|----------|-----------------|
| segments.md | Primary segment + Core Job |
| jobs-graph.md | Critical job sequence for MVP scope |
| rat.md | Risk-first validation order |
| growth-plan.md | North Star metric + success targets |
| business-model.md | Unit economics targets + pricing |
| pricing-analysis.md | Tier structure for MVP |
| customer-segments.md | Beta user recruitment |
