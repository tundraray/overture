# Customer Segmentation

## Beyond Demographics

Demographics (age, gender, income) tell you WHO the customer is. Strategic segmentation tells you WHY they buy and HOW to reach them.

## Segmentation Types

### 1. Psychographic Segmentation

Groups by values, attitudes, lifestyles, personality traits.

| Dimension | What It Reveals | Data Source |
|-----------|----------------|------------|
| Values | What matters most (innovation, security, status) | Surveys, reviews, social media |
| Attitudes | Openness to change, risk tolerance, brand loyalty | Behavioral patterns + interviews |
| Lifestyles | Activity patterns, interests, opinions (AIO) | Usage data, content consumption |
| Personality | Decision-making style, social orientation | Interaction patterns |

**When to use**: Crafting messaging, content strategy, brand positioning.

### 2. Behavioral Segmentation

Groups by actual actions, not stated preferences.

| Dimension | Categories | Example |
|-----------|-----------|---------|
| Purchase behavior | Frequency, recency, monetary value (RFM) | Heavy user vs. occasional buyer |
| Usage patterns | Feature adoption, depth of use | Power user vs. casual |
| Benefit sought | Primary value driver | Speed vs. cost vs. quality |
| Occasion | When/why they engage | Work vs. personal, seasonal |
| Loyalty status | Advocate → loyal → switcher → lapsed | Retention strategy differs per group |

**When to use**: Product decisions, pricing tiers, retention strategy.

### 3. Value-Based Segmentation

Groups by economic value to the business.

```yaml
Tiers:
  Platinum (top 5%):
    CLV: ">$10,000"
    Strategy: "White-glove service, dedicated CSM, exclusive features"
  Gold (next 15%):
    CLV: "$3,000-$10,000"
    Strategy: "Priority support, early access, upsell opportunities"
  Silver (next 30%):
    CLV: "$500-$3,000"
    Strategy: "Self-serve + automated nurture, upgrade paths"
  Bronze (bottom 50%):
    CLV: "<$500"
    Strategy: "Automated only, monitor for upgrade signals"
```

**When to use**: Resource allocation, customer success prioritization, pricing.

### 4. Firmographic Segmentation (B2B)

| Dimension | Categories |
|-----------|-----------|
| Company size | Enterprise / Mid-market / SMB / Solo |
| Industry | Vertical-specific needs |
| Revenue | Budget capacity |
| Growth stage | Startup / Scaleup / Mature / Declining |
| Technology stack | Integration requirements |
| Decision process | Committee vs. champion vs. top-down |

### 5. Jobs-to-Be-Done Segmentation

For comprehensive job-based segmentation, see the **ajtbd-methodology** skill which provides the complete AJTBD framework including:
- Job hierarchy (Big Job → Core Job → Small Jobs → Micro Jobs)
- Critical job sequences
- Segment-by-jobs methodology (segment = job bundles + context + criteria)
- RAT framework for segment economic validation

Use `/b2b-segments` or `/b2c-segments` commands for guided job-based segmentation.

## Segment Attractiveness Scoring

Rate each segment on:

| Criterion | Weight | Score (1-5) |
|-----------|--------|-------------|
| Market size | 20% | [size of segment] |
| Growth rate | 15% | [segment growth trajectory] |
| Profitability | 20% | [willingness to pay, cost to serve] |
| Accessibility | 15% | [can we reach them?] |
| Competitive intensity | 15% | [how many competitors serve this segment?] |
| Strategic fit | 15% | [alignment with our capabilities] |

**Total score = weighted average. Rank segments. Focus on top 2-3.**

## Output Template

```markdown
# Customer Segmentation Analysis

## Primary Segmentation Approach: [Behavioral / Value-Based / AJTBD]
**Rationale**: [why this approach for this business]

## Identified Segments

### Segment 1: "[Name]" (Priority: HIGH)
- **Size**: [X]% of addressable market
- **Profile**: [behavioral/psychographic description]
- **Willingness to pay**: $[X]/month
> See segments.md for full AJTBD job analysis if available
- **Acquisition channel**: [where to find them]
- **Attractiveness score**: [X/5]
- **Key insight**: [non-obvious finding]

### Segment 2: "[Name]" (Priority: MEDIUM)
[same structure]

## Segment Prioritization Matrix
| Segment | Size | Growth | Profit | Access | Competition | Fit | Total |
|---------|------|--------|--------|--------|-------------|-----|-------|

## Recommended Focus
**Primary**: [segment] — [why]
**Secondary**: [segment] — [why]
**Avoid**: [segment] — [why]
```
