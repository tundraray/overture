# MVP Definition Methodology

## What MVP Actually Means

| Word | Meaning | Common Misunderstanding |
|------|---------|------------------------|
| **Minimum** | Smallest thing that tests the riskiest assumption | Fewest features possible (leads to broken products) |
| **Viable** | Actually usable — not broken, not embarrassing | "It works on my machine" (leads to bad first impressions) |
| **Product** | Delivers on the Core Job (from AJTBD) | A prototype or demo (leads to products that don't solve real problems) |

**The test**: Can a user in the target segment complete the Core Job from `jobs-graph.md` using only the MVP? If no, it is not viable.

---

## MoSCoW Prioritization

MoSCoW categorizes features by their necessity for the MVP release.

### The Four Categories

| Category | Definition | Decision Question | Effort Target |
|----------|-----------|-------------------|--------------|
| **Must-Have** | Without this, the MVP is not viable. Core Job cannot be completed. | "Can the user complete the Core Job without this feature?" If no → Must-Have. | ~60% of total effort |
| **Should-Have** | Important and painful to leave out, but a workaround exists. | "Is there a manual workaround the user can tolerate for 1-2 months?" If yes → Should-Have. | ~20% of total effort |
| **Could-Have** | Nice to have. Included only if time and budget permit. | "Would users notice if this was missing?" If probably not → Could-Have. | ~20% of total effort |
| **Won't-Have (this time)** | Explicitly excluded from this release. Documented so stakeholders know it is intentional. | "Is this needed for the Core Job or for scaling?" If scaling → Won't-Have. | 0% |

### Effort Distribution Rule

```
Must-Have:    ████████████████████████████████████████████████  ~60%
Should-Have:  ████████████████                                  ~20%
Could-Have:   ████████████████                                  ~20%
Won't-Have:   (explicitly excluded — 0%)
```

**If Must-Haves exceed 60% of effort**: Your MVP scope is too large. Either:
- Re-examine: are some Must-Haves actually Should-Haves?
- Simplify Must-Have implementations (reduce fidelity, not features)
- Split into two releases

**If Must-Haves are under 40% of effort**: Your MVP may be too thin. Either:
- Promote a Should-Have to Must-Have
- Increase the fidelity of Must-Have implementations

### MoSCoW Decision Tree

```
Is this feature needed to complete the Core Job?
├── Yes → MUST-HAVE
└── No
    ├── Is there a manual workaround users can tolerate?
    │   ├── No → SHOULD-HAVE (painful to leave out)
    │   └── Yes
    │       ├── Would users notice it's missing in first 2 weeks?
    │       │   ├── Yes → SHOULD-HAVE
    │       │   └── No → COULD-HAVE
    └── Is this for scale, not for first users?
        └── Yes → WON'T-HAVE (this time)
```

### MoSCoW Template

```markdown
## MoSCoW Analysis: [MVP Name]

**Core Job**: [from jobs-graph.md]
**Target Segment**: [from customer-segments.md]
**Date**: [current date]

### Must-Have (~60% of effort)

| # | Feature | Job Reference | Why Must-Have | Effort (days) |
|---|---------|--------------|---------------|--------------|
| 1 | [feature] | Job [X], Problem [Y] | [Core Job cannot complete without this] | [days] |
| 2 | [feature] | Job [X], Problem [Y] | [reason] | [days] |

**Must-Have effort total**: [X] days ([Y]% of total)

### Should-Have (~20% of effort)

| # | Feature | Job Reference | Workaround | Effort (days) |
|---|---------|--------------|-----------|--------------|
| 1 | [feature] | Job [X] | [manual workaround] | [days] |

**Should-Have effort total**: [X] days ([Y]% of total)

### Could-Have (~20% of effort)

| # | Feature | Job Reference | User Impact if Missing | Effort (days) |
|---|---------|--------------|----------------------|--------------|
| 1 | [feature] | Job [X] | [low — users unlikely to notice] | [days] |

**Could-Have effort total**: [X] days ([Y]% of total)

### Won't-Have (this time)

| # | Feature | Why Excluded | When to Revisit |
|---|---------|-------------|----------------|
| 1 | [feature] | [scaling concern / not Core Job] | [after X users / after validation] |

**Total MVP effort**: [X] days
**Must-Have %**: [Y]% (target: ~60%)
```

---

## Lean MVP Principles

### MVP Types

Choose the MVP type based on what you need to validate:

| MVP Type | What It Validates | Cost | Time | Fidelity |
|----------|------------------|------|------|----------|
| **Landing Page** | Demand — "Do people want this?" | $200-2,000 | 1-3 days | Very low |
| **Fake Door / Painted Door** | Interest — "Would users click on this?" | $0-500 | 1-2 days | Very low |
| **Concierge** | Value — "Can we deliver the outcome manually?" | $0-1,000 | 2-4 weeks | Medium (manual behind the scenes) |
| **Wizard of Oz** | Usability — "Can users navigate the experience?" | $1,000-5,000 | 2-4 weeks | Medium (looks real, manual backend) |
| **Single-Feature** | Core value — "Does the primary feature solve the Core Job?" | $5,000-50,000 | 4-8 weeks | High (one thing, done well) |

### MVP Type Selection Guide

| What You're Validating | Best MVP Type | Example |
|----------------------|---------------|---------|
| "Is there enough demand for this?" | Landing Page | Landing page with waitlist signup, drive traffic with $500 ad spend |
| "Would users actually use this feature?" | Fake Door | Add button in existing product, measure clicks, show "coming soon" |
| "Can we deliver the promised value?" | Concierge | Manually perform the service for 5-10 users, measure satisfaction |
| "Does the UX make sense?" | Wizard of Oz | Build the frontend, manually process actions on the backend |
| "Does the core feature solve the problem?" | Single-Feature | Build one feature end-to-end, nothing else |

### Lean MVP Checklist

| Check | Requirement |
|-------|------------|
| Riskiest assumption identified | What single thing, if wrong, kills this product? |
| MVP type matches the assumption | Landing page for demand, concierge for value, etc. |
| Core Job completable | User can get from trigger to desired outcome |
| Success metric defined before building | Know what "success" looks like before writing code |
| Kill criteria established | Know when to stop if it's not working |
| First users identified | Know who will use the MVP (not "everyone") |
| Timeline is weeks, not months | If MVP takes >8 weeks, scope is too large |

---

## Success Metrics Design

### Metric Hierarchy

Every MVP needs metrics at three levels, linked to strategy documents:

| Level | Source Document | Metric Type | Measurement Window |
|-------|----------------|-------------|-------------------|
| **North Star** | `growth-plan.md` | The one metric that best captures value delivery | Ongoing |
| **Leading Indicators** | Derived from AARRR funnel | Early signals that predict North Star movement | First 2 weeks |
| **Lagging Indicators** | `business-model.md` | Revenue, retention, unit economics outcomes | After 1-3 months |

### Leading vs Lagging Indicators

| Type | When to Measure | Examples | Purpose |
|------|----------------|---------|---------|
| **Leading** | First 2 weeks after MVP launch | Signup rate, activation rate, feature adoption, session frequency, NPS score | Early signal — can still course-correct |
| **Lagging** | After 1-3 months | MRR, churn rate, CAC, LTV, expansion revenue | True outcome — validates business viability |

### Metrics Template

```markdown
## Success Metrics: [MVP Name]

**North Star Metric**: [from growth-plan.md]
- Current: [value]
- MVP target (90 days): [value]
- Stretch target: [value]

### Leading Indicators (Measure in first 2 weeks)

| Metric | Current Baseline | MVP Target | Measurement Method |
|--------|-----------------|------------|-------------------|
| [activation rate] | [X]% | [Y]% | [how — analytics tool, manual count] |
| [feature adoption] | N/A (new) | [Y]% of active users | [how] |
| [session frequency] | [X]/week | [Y]/week | [how] |

### Lagging Indicators (Measure after 1-3 months)

| Metric | Current Baseline | MVP Target | Link to Business Model |
|--------|-----------------|------------|----------------------|
| [MRR from segment] | $[X] | $[Y] | business-model.md → Revenue Streams |
| [churn rate] | [X]% | [Y]% | business-model.md → Unit Economics |
| [CAC] | $[X] | $[Y] | business-model.md → Acquisition Cost |

### Kill Criteria

| Metric | Threshold | Timeframe | Decision |
|--------|-----------|-----------|----------|
| [activation rate] | < [X]% | After 2 weeks | Pivot — rethink onboarding |
| [weekly active users] | < [X] users | After 4 weeks | Stop — insufficient demand |
| [willingness to pay] | < [X]% convert to paid | After 6 weeks | Pivot — pricing or value problem |
| [retention D30] | < [X]% | After 6 weeks | Stop — product doesn't retain |
```

### Kill Criteria Design

Kill criteria prevent endless iteration on a failing product. Define them **before building**.

| Rule | Rationale |
|------|-----------|
| Every MVP has at least 3 kill criteria | Prevents "one more feature" syndrome |
| Thresholds are set before launch, not after | Prevents moving goalposts |
| Each criterion has a specific timeframe | Prevents indefinite waiting |
| Decision is binary: Pivot or Stop | "Continue as-is" is not a valid kill criteria outcome |
| Kill criteria are shared with stakeholders before launch | Prevents political override of data |

---

## Validation Plan

### Link to RAT Risks

The MVP validation plan is directly connected to the Riskiest Assumption Testing (RAT) from `rat.md`:

```markdown
## Validation Plan: [MVP Name]

**Source**: rat.md — Risk Ranking Summary
**Validation principle**: Validate highest P x I risk first

| Priority | Risk (from rat.md) | P x I | Validation Method | Timeline | Success Threshold | Status |
|----------|-------------------|-------|-------------------|----------|-------------------|--------|
| 1 | Risk Card [N]: [name] | [score] | [method] | [days/weeks] | [what "validated" looks like] | Not started |
| 2 | Risk Card [N]: [name] | [score] | [method] | [days/weeks] | [threshold] | Not started |
| 3 | Risk Card [N]: [name] | [score] | [method] | [days/weeks] | [threshold] | Not started |
```

### Validation Methods by Risk Category

| Risk Category (from rat.md) | Best Validation Method | Cost | Timeline |
|---------------------------|----------------------|------|----------|
| **Market risk** | Landing page + ad spend to measure demand | $500-2,000 | 1-2 weeks |
| **Segment risk** | Customer interviews (10-15 in target segment) | $0-500 | 1-2 weeks |
| **Value risk** | Concierge MVP with 5-10 users, measure satisfaction | $0-1,000 | 2-4 weeks |
| **Unit economics risk** | Pricing page test, willingness-to-pay survey | $200-500 | 1 week |
| **Acquisition risk** | Small-budget ad campaigns across 3 channels | $1,000-3,000 | 2-3 weeks |
| **Operational risk** | Manual process simulation at 2x expected volume | $0 | 1-2 weeks |

### Decision Gates

At each validation checkpoint, apply this decision framework:

```
Validation Result Analysis
├── SUCCESS (metric exceeds threshold)
│   ├── Proceed to next risk validation
│   └── If all top risks validated → Build MVP
│
├── PARTIAL (metric is close but below threshold)
│   ├── Investigate: wrong metric? wrong threshold? wrong segment?
│   ├── Adjust and re-test (one more attempt)
│   └── If still partial → Pivot
│
└── FAILURE (metric far below threshold)
    ├── Pivot: change approach to the same opportunity
    │   ├── Different solution for the same problem
    │   ├── Different segment for the same solution
    │   └── Different problem in the same space
    └── Stop: abandon this opportunity
        └── Return to Opportunity Tree, select next opportunity
```

### Decision Gate Template

```markdown
## Decision Gate: [Risk Name]

**Date**: [date]
**Validation method**: [what was tested]
**Sample size**: [N]

### Results
| Metric | Threshold | Actual | Verdict |
|--------|-----------|--------|---------|
| [metric] | [threshold] | [actual] | Pass / Partial / Fail |

### Decision: [Go / Pivot / Stop]
**Rationale**: [why]
**Next action**: [specific next step]
```

---

## Launch Criteria Checklist

Before declaring MVP "ready to launch," verify all items:

### Product Readiness

| # | Criterion | Status | Evidence |
|---|----------|--------|----------|
| 1 | All Must-Have features complete | [ ] | [link to feature checklist] |
| 2 | All Must-Have acceptance criteria passing | [ ] | [link to test results] |
| 3 | Core Job completable end-to-end | [ ] | [manual walkthrough date] |
| 4 | Critical error paths handled gracefully | [ ] | [error state testing] |
| 5 | Performance acceptable for first 100 users | [ ] | [load test results] |

### Measurement Readiness

| # | Criterion | Status | Evidence |
|---|----------|--------|----------|
| 6 | Success metrics instrumented and reporting | [ ] | [analytics dashboard link] |
| 7 | Kill criteria documented and shared with stakeholders | [ ] | [document link] |
| 8 | Leading indicator tracking verified (data flowing) | [ ] | [first data point captured] |
| 9 | Error/crash monitoring active | [ ] | [monitoring tool configured] |

### User Readiness

| # | Criterion | Status | Evidence |
|---|----------|--------|----------|
| 10 | First 10 beta users identified | [ ] | [from customer-segments.md early adopters] |
| 11 | Beta users confirmed willingness to participate | [ ] | [outreach log] |
| 12 | Feedback collection mechanism in place | [ ] | [survey / interview schedule] |
| 13 | Support channel established for beta users | [ ] | [Slack channel / email / form] |

### Risk Readiness

| # | Criterion | Status | Evidence |
|---|----------|--------|----------|
| 14 | Top 3 risks (from rat.md) have mitigation plans | [ ] | [mitigation documented] |
| 15 | Rollback plan exists if MVP causes harm | [ ] | [rollback procedure] |
| 16 | Legal/compliance review complete (if applicable) | [ ] | [review sign-off] |

### Launch Decision

```markdown
**Launch readiness score**: [X] / 16 criteria met
**Minimum to launch**: All Product Readiness + all Measurement Readiness (9/16)
**Recommended to launch**: All criteria (16/16)

**Decision**: [Launch / Delay — specify which criteria are blocking]
**Launch date**: [date]
**First review date**: [2 weeks after launch — check leading indicators]
```

## Anti-Patterns

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| MVP with no kill criteria | Sunk cost fallacy — keep investing in failure | Define kill criteria before building |
| All features marked Must-Have | MoSCoW becomes meaningless, MVP is actually V1 | Apply the Core Job test: "Can the job be completed without this?" |
| MVP for 8+ weeks of work | Not minimum — scope has crept | If >8 weeks, split into two releases or reduce fidelity |
| Validating the easy risk first | Hard risks lurk and kill the project later | Validate highest P x I score first (from rat.md) |
| Success metrics chosen after launch | Goalpost moving, confirmation bias | Lock metrics and thresholds before writing code |
| "We'll figure out users later" | No users to test with at launch | Identify first 10 beta users during spec phase |
| Skipping manual validation | Building software to test an assumption that can be tested manually | Use Concierge/Wizard of Oz before writing production code |
| MVP without Core Job completion | Users try it, can't accomplish anything, leave | MVP must complete the Core Job, even if nothing else |
