# Roadmap Methods & Feature Prioritization

## Now/Next/Later Roadmap (Primary Format)

The Now/Next/Later format replaces date-based roadmaps. It communicates intent and priority without creating false commitments on timelines.

### Structure

| Column | Timeframe | Confidence | Detail Level | Commitment |
|--------|-----------|------------|-------------|------------|
| **Now** | 0-6 weeks | High (80%+) | Feature specs written, teams assigned | Committed — in progress or about to start |
| **Next** | 6-12 weeks | Medium (50-80%) | Requirements clear, specs in draft | Planned — will start after current cycle |
| **Later** | 3-6 months | Low (20-50%) | Ideas, needs more discovery | Exploring — may change significantly |

### Rules

1. **Now items have feature specs** — link to Shape Up pitch or equivalent
2. **Next items have WSJF scores** — priority is defensible
3. **Later items are outcomes, not features** — "Improve activation rate" not "Add onboarding wizard"
4. **No dates on Later items** — they create false expectations
5. **Maximum 3-5 items per column** — more means you haven't prioritized
6. **Review cadence**: Re-evaluate every 6 weeks (one Shape Up cycle)

### Now/Next/Later Template

```markdown
# Product Roadmap: [Product Name]

**Last updated**: [date]
**Review cadence**: Every 6 weeks
**North Star Metric**: [from growth-plan.md]

## NOW (0-6 weeks) — Committed

| # | Feature | WSJF | Kano | Spec | Team | Status |
|---|---------|------|------|------|------|--------|
| 1 | [feature name] | [score] | [Must-Be/Performance/Attractive] | [link to pitch] | [team] | [In Progress / Starting] |
| 2 | [feature name] | [score] | [category] | [link to pitch] | [team] | [status] |

## NEXT (6-12 weeks) — Planned

| # | Feature | WSJF | Kano | Spec Status | Depends On |
|---|---------|------|------|-------------|------------|
| 1 | [feature name] | [score] | [category] | [Draft / Needs Discovery] | [dependency] |
| 2 | [feature name] | [score] | [category] | [status] | [dependency] |

## LATER (3-6 months) — Exploring

| # | Outcome/Theme | Why | Discovery Status |
|---|--------------|-----|-----------------|
| 1 | [outcome, not feature] | [strategic rationale] | [Not Started / In Discovery] |
| 2 | [outcome, not feature] | [strategic rationale] | [status] |

## Parking Lot (Explicitly Deferred)

| # | Idea | Why Deferred | Revisit When |
|---|------|-------------|-------------|
| 1 | [idea] | [reason — WSJF too low / not strategic / dependency not met] | [condition] |

## Changelog

| Date | Change | Rationale |
|------|--------|-----------|
| [date] | Moved [X] from Next to Now | [why] |
| [date] | Removed [Y] from Later | [why — validated that it's not worth building] |
```

---

## Kano Model (Feature Categorization)

The Kano Model classifies features by their relationship to customer satisfaction. Not all features have the same satisfaction curve.

### The Five Categories

| Category | Absent | Present | Satisfaction Curve | Product Impact |
|----------|--------|---------|-------------------|----------------|
| **Must-Be** | Strong dissatisfaction | Neutral (expected) | Diminishing returns — investing more doesn't increase satisfaction | Table stakes. Must be in MVP. |
| **Performance** | Some dissatisfaction | Proportional satisfaction | Linear — more investment = more satisfaction | Competitive differentiators. |
| **Attractive** | No dissatisfaction | Delight, surprise | Exponential — small investment = large satisfaction jump | Wow factors. Create advocacy. |
| **Indifferent** | No effect | No effect | Flat — zero impact regardless | Do not build. Waste of resources. |
| **Reverse** | No dissatisfaction | Dissatisfaction | Negative — presence hurts | Remove or make optional. |

### How to Categorize: Two-Question Survey Method

For each feature, ask two questions:

1. **Functional**: "If [feature] were present, how would you feel?"
2. **Dysfunctional**: "If [feature] were absent, how would you feel?"

Answer options for both: Like it / Expect it / Neutral / Can live with it / Dislike it

| | **Dysfunctional: Like** | **Dysfunctional: Expect** | **Dysfunctional: Neutral** | **Dysfunctional: Live with** | **Dysfunctional: Dislike** |
|---|---|---|---|---|---|
| **Functional: Like** | Questionable | Attractive | Attractive | Attractive | Performance |
| **Functional: Expect** | Reverse | Indifferent | Indifferent | Indifferent | Must-Be |
| **Functional: Neutral** | Reverse | Indifferent | Indifferent | Indifferent | Must-Be |
| **Functional: Live with** | Reverse | Indifferent | Indifferent | Indifferent | Must-Be |
| **Functional: Dislike** | Reverse | Reverse | Reverse | Reverse | Questionable |

### Kano Scoring Template

```markdown
## Kano Analysis: [Feature Set]

| # | Feature | Functional Response | Dysfunctional Response | Category | Confidence |
|---|---------|--------------------|-----------------------|----------|------------|
| 1 | [feature] | [Like/Expect/Neutral/Live with/Dislike] | [same options] | [Must-Be/Performance/Attractive/Indifferent/Reverse] | [High/Med/Low — based on sample size] |
| 2 | [feature] | [response] | [response] | [category] | [confidence] |
```

### Integration with WSJF

Kano categories influence WSJF scoring:

| Kano Category | Time Criticality Modifier | User/Business Value Modifier | Rationale |
|---------------|--------------------------|-----------------------------|-----------|
| **Must-Be** | +3 to Time Criticality | Base value (users expect it) | Cannot ship without these — delay = dissatisfaction |
| **Performance** | +0 (score normally) | Score based on degree of improvement | Linear value — score proportionally |
| **Attractive** | -1 to Time Criticality | +2 to User Value | Delighters can wait, but they punch above their weight |
| **Indifferent** | N/A | N/A | Remove from roadmap entirely |
| **Reverse** | N/A | N/A | Do not build. If built, remove. |

### Kano Decay

Features move categories over time as customer expectations evolve:

```
Attractive → Performance → Must-Be
(yesterday's delight becomes today's expectation)
```

**Example**: Real-time collaboration was Attractive in 2015 (Google Docs wow factor), Performance by 2020 (Notion, Figma), and Must-Be by 2025 (expected in any collaborative tool).

**Implication**: Re-run Kano analysis annually. What was Attractive last year may be Must-Be now.

---

## WSJF (Weighted Shortest Job First)

WSJF prioritizes features by their economic value relative to their cost. It ensures that the features delivering the most value per unit of time are built first.

### Formula

```
WSJF = Cost of Delay / Job Duration
```

Where Cost of Delay is the sum of three dimensions:

```
Cost of Delay = User/Business Value + Time Criticality + Risk Reduction / Opportunity Enablement
```

### Scoring Dimensions

Each dimension is scored on a Fibonacci-like scale: **1, 2, 3, 5, 8, 13, 20**

Scores are **relative to other features** being compared, not absolute. The smallest item in the comparison set gets a 1.

| Dimension | Question | Scoring Guide |
|-----------|----------|--------------|
| **User/Business Value** | How much value does this deliver to users and/or the business? | 1 = minimal value, 20 = transformative value |
| **Time Criticality** | How much does the value decrease if we delay? | 1 = value is stable over time, 20 = value drops to zero if delayed |
| **Risk Reduction / Opportunity Enablement** | Does this reduce risk or unlock future opportunities? | 1 = no risk reduction or enablement, 20 = existential risk mitigated or massive opportunity unlocked |
| **Job Duration** | How long will this take to deliver? | 1 = very quick (days), 20 = very long (months). Relative to other items. |

### WSJF Scoring Template

```markdown
## WSJF Prioritization: [Feature Set]

**Scoring date**: [date]
**Scored by**: [team/person]
**Scale**: Fibonacci-relative (1, 2, 3, 5, 8, 13, 20)

| # | Feature | User/Biz Value | Time Criticality | Risk Reduction | CoD (sum) | Duration | WSJF (CoD/Dur) | Rank |
|---|---------|---------------|-----------------|----------------|-----------|----------|----------------|------|
| 1 | [feature] | [1-20] | [1-20] | [1-20] | [sum] | [1-20] | [score] | [rank] |
| 2 | [feature] | [1-20] | [1-20] | [1-20] | [sum] | [1-20] | [score] | [rank] |
| 3 | [feature] | [1-20] | [1-20] | [1-20] | [sum] | [1-20] | [score] | [rank] |

### Scoring Rationale

**[Feature 1]**:
- User/Biz Value: [score] — [why]
- Time Criticality: [score] — [why]
- Risk Reduction: [score] — [why]
- Duration: [score] — [why]

**[Feature 2]**:
[same structure]
```

### How WSJF Differs from ICE/RICE

| Attribute | WSJF | ICE/RICE |
|-----------|------|----------|
| **Purpose** | Prioritize features for a product roadmap | Prioritize growth experiments |
| **Time horizon** | Weeks to months | Days to weeks |
| **Key insight** | Delay cost matters — some features lose value over time | Speed of learning matters — fast experiments win |
| **Cost component** | Job Duration (delivery effort) | Ease/Effort (implementation cost) |
| **Unique dimension** | Time Criticality — captures urgency and decay | Reach — captures how many users are affected |
| **Best for** | Committed product work | Experimental growth work |
| **Used by** | Product managers, product-planner agent | Growth teams, growth-strategist agent |

**Rule**: Use WSJF for items on the roadmap (committed features). Use ICE/RICE for items in the experiment backlog.

---

## Cost of Delay (CoD)

Cost of Delay quantifies the economic impact of not delivering a feature on time. It is the core concept underlying WSJF.

### Three Urgency Profiles

| Profile | Shape | Description | Example |
|---------|-------|-------------|---------|
| **Standard (Linear)** | Gradual slope | Value decreases slowly over time | Improving dashboard performance |
| **Urgent (Hockey Stick)** | Steep curve | Value drops rapidly after a trigger point | Competitor launches similar feature |
| **Fixed Date (Cliff)** | Flat then vertical drop | Value drops to zero after a deadline | Tax season compliance, conference demo |

### How to Estimate Cost of Delay

Ask: "If we delay this feature by 1 month, what is the dollar impact?"

| CoD Type | Estimation Method | Example |
|----------|------------------|---------|
| **Revenue CoD** | Lost MRR × months delayed | Feature unlocks $50K MRR. 1 month delay = $50K lost. |
| **Cost CoD** | Continued cost × months delayed | Manual process costs $10K/mo. Automation delayed = $10K/mo waste. |
| **Risk CoD** | Probability of loss × impact × months | 20% chance of losing $500K contract if delayed = $100K/mo CoD |
| **Opportunity CoD** | Future features blocked × their value | This feature enables 3 others worth $30K/mo each = $90K/mo CoD |

### CD3 — Simplified WSJF

If full WSJF scoring is too heavy, use CD3 (Cost of Delay Divided by Duration):

```
CD3 = Cost of Delay ($/week) / Duration (weeks)
```

| Feature | CoD ($/week) | Duration (weeks) | CD3 | Priority |
|---------|-------------|-----------------|-----|----------|
| Feature A | $10,000 | 2 | 5,000 | 1st |
| Feature B | $15,000 | 6 | 2,500 | 2nd |
| Feature C | $3,000 | 1 | 3,000 | 3rd (despite lowest CoD, fast to deliver) |

---

## Feature Dependency Mapping

Features often depend on each other. Dependency mapping prevents blocked work and reveals critical path.

### Dependency Types

| Type | Description | Example | Risk Level |
|------|-------------|---------|------------|
| **Hard dependency** | Cannot start B until A is complete | "Search requires indexing service" | High — blocks work |
| **Soft dependency** | B is better with A, but can work without | "Notifications are better with preferences, but can default" | Low — work around |
| **Shared dependency** | A and B both need C | "Both features need the new API gateway" | Medium — bottleneck risk |

### Dependency Matrix Template

```markdown
## Feature Dependencies

| Feature | Depends On | Dependency Type | Blocks | Critical Path? |
|---------|-----------|----------------|--------|---------------|
| [Feature A] | — | — | [Feature C, D] | Yes |
| [Feature B] | — | — | [Feature D] | No |
| [Feature C] | [Feature A] | Hard | [Feature E] | Yes |
| [Feature D] | [Feature A, B] | Hard, Soft | — | No |
| [Feature E] | [Feature C] | Hard | — | Yes |

### Critical Path
A → C → E (total: [X] weeks)

### Bottleneck Analysis
- [Feature A] blocks 2 downstream features — prioritize delivery
- [Feature B] has no blockers and soft-blocks [D] — can parallelize
```

### Dependency Rules for WSJF

1. **Enabler features get +3 Risk Reduction** — they unlock downstream value
2. **Blocked features cannot be in Now** — move to Next until dependency clears
3. **Shared dependencies are scheduled first** — they unblock the most work
4. **Circular dependencies indicate poor decomposition** — re-split the features

---

## Putting It All Together: Roadmap Construction Process

### Step-by-Step Process

1. **Gather candidates**: All features from opportunity trees, stakeholder requests, tech debt items
2. **Categorize with Kano**: Must-Be / Performance / Attractive / Indifferent / Reverse
3. **Remove Indifferent and Reverse**: Do not score these — they are out
4. **Score with WSJF**: Score remaining features relative to each other
5. **Map dependencies**: Identify hard/soft dependencies and critical path
6. **Assign to columns**:
   - **Now**: Top WSJF scores with no unresolved dependencies + Must-Be items
   - **Next**: Next tier of WSJF scores + items waiting on Now dependencies
   - **Later**: Everything else worth keeping (outcomes, not features)
   - **Parking Lot**: Low WSJF scores, revisit next cycle
7. **Validate against strategy**: Every Now/Next item should trace to strategy docs
8. **Review with stakeholders**: Present roadmap with WSJF rationale

### Roadmap Health Checklist

| Check | Pass Criteria |
|-------|-------------|
| All Must-Be features are in Now or Next | Cannot defer table stakes |
| No Indifferent or Reverse features on roadmap | Waste elimination |
| Every Now item has a feature spec | Cannot commit without a spec |
| Every Now/Next item has a WSJF score | Defensible prioritization |
| Dependencies are resolved for all Now items | No blocked work in current cycle |
| Later items are outcomes, not features | Preserves flexibility |
| Roadmap has 3-5 items per column maximum | Focused execution |
| North Star metric connection is clear for each item | Strategic alignment |

## Anti-Patterns

| Anti-Pattern | Why It Fails | Correct Approach |
|-------------|-------------|-----------------|
| Date-based roadmap for Later items | Creates false commitments, erodes trust when dates slip | Now/Next/Later — only Now has dates |
| Scoring WSJF in isolation (not relative) | Scores are meaningless without comparison context | Always score features against each other in the same session |
| Skipping Kano categorization | All features treated as equal importance | Categorize first, then score |
| Too many items in Now | Team is spread thin, nothing finishes | Maximum 3-5 items in Now per team |
| Roadmap never changes | Ignoring new information and market changes | Review and re-score every 6 weeks |
| Using WSJF for growth experiments | Wrong framework — experiments need speed, not economic modeling | Use ICE/RICE for experiments (see growth-experiments.md) |
| Missing dependency analysis | Teams get blocked mid-cycle | Map dependencies before committing to Now column |
| Stakeholder pet project bypasses scoring | Undermines trust in the prioritization process | Every item gets scored. No exceptions. Discuss the score. |
