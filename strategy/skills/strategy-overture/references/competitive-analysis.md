# Competitive Analysis

## Porter's Five Forces

Analyzes industry-level structural attractiveness.

### The Five Forces

| Force | Key Question | High = Bad for You |
|-------|-------------|-------------------|
| **Buyer Power** | Can customers easily switch or demand lower prices? | Commodity product, low switching cost, price-sensitive buyers |
| **Supplier Power** | Can suppliers dictate terms? | Few suppliers, unique inputs, high switching cost |
| **New Entrants** | How easy to enter this market? | Low capital, no IP moats, weak brands |
| **Substitutes** | Can customers solve this differently? | Many alternative approaches, low switching cost |
| **Rivalry** | How intense is competition? | Many competitors, slow growth, low differentiation |

### Scoring Template

```yaml
Force: Buyer Power
Score: High / Medium / Low
Evidence:
  - [specific evidence]
  - [specific evidence]
Implication: "[what this means for strategy]"
```

### When Porter's Is NOT Enough

Porter's analyzes industry structure, not company position. Pair with SWOT for company-specific analysis.

## SWOT Analysis

Analyzes company-specific position.

### Structure

| | Helpful | Harmful |
|---|---------|---------|
| **Internal** | Strengths | Weaknesses |
| **External** | Opportunities | Threats |

### SWOT with Prioritization (Required)

Flat SWOT lists are useless. Rank each item:

```yaml
- item: "[description]"
  impact: High / Medium / Low
  likelihood: High / Medium / Low  # for O/T only
  actionability: High / Medium / Low
  priority: [impact × actionability score]
```

**Focus on top 3 per quadrant.** Everything else is noise.

### TOWS Matrix (Converting SWOT to Strategy)

| | Strengths | Weaknesses |
|---|-----------|-----------|
| **Opportunities** | **SO**: Use strengths to capture opportunities | **WO**: Fix weaknesses to capture opportunities |
| **Threats** | **ST**: Use strengths to neutralize threats | **WT**: Minimize weaknesses, avoid threats |

## PESTLE Analysis (Macro Environment)

Layer on top of Porter's for macro context:

| Factor | Analysis Focus |
|--------|---------------|
| **P**olitical | Regulation, trade policy, government stability |
| **E**conomic | GDP growth, interest rates, inflation, FX |
| **S**ocial | Demographics, cultural trends, consumer behavior |
| **T**echnological | Emerging tech, disruption potential, R&D trends |
| **L**egal | IP law, employment law, data privacy (GDPR, etc.) |
| **E**nvironmental | Sustainability, ESG, resource constraints |

## Competitive Landscape Mapping

### Direct vs Indirect Competitors

| Type | Definition | Example |
|------|-----------|---------|
| **Direct** | Same product, same market | Notion vs Coda |
| **Indirect** | Different product, same job-to-be-done | Notion vs Excel + Email |
| **Potential** | Could enter your market | Large tech with adjacent products |

### TrustMRR for Competitor Revenue (Mandatory Check)

**Source**: https://trustmrr.com/ — Stripe-verified MRR database.

Before relying on analyst estimates for competitor revenue:
1. Search TrustMRR for each competitor by name
2. If listed → use verified MRR as **Tier 1** revenue data
3. If not listed → note "Not on TrustMRR" and use Tier 2/3 estimates
4. Check TrustMRR leaderboard for the category to discover competitors you may have missed

```yaml
TrustMRR Competitor Data:
  - MRR (hourly updated, Stripe-verified)
  - MoM growth %
  - Revenue multiples (if listed for sale)
  - Category ranking
```

### Competitor Profile Template

```markdown
## [Competitor Name]

**Founded**: [year] | **Funding**: $[X] | **Employees**: ~[X]
**Revenue**: $[X] (Tier [1/2/3]) | **TrustMRR Verified**: [Yes — $X MRR / Not listed] | **Growth**: [X]% YoY

### Positioning
- **Target segment**: [who]
- **Value proposition**: [what they promise]
- **Pricing**: [model + price points]

### Strengths
1. [ranked by impact]

### Weaknesses
1. [ranked by exploitability]

### Recent Moves (Last 12 months)
- [product launches, pivots, fundraising]

### Threat Level: [High / Medium / Low]
**Reasoning**: [why]
```

## Output Template (Full Competitive Analysis)

```markdown
# Competitive Landscape Analysis

## Executive Summary
[One paragraph: key finding, market structure, our positioning]

## Industry Structure (Porter's Five Forces)
[Each force scored with evidence]
**Overall industry attractiveness**: [Attractive / Neutral / Unattractive]

## Macro Environment (PESTLE)
[Key factors only — skip irrelevant dimensions]

## Competitive Landscape
### Direct Competitors
[Competitor profiles]

### Indirect Competitors
[Competitor profiles]

### Competitive Positioning Map
[2D positioning on key axes]

## SWOT (Prioritized)
[Top 3 per quadrant with TOWS strategies]

## Strategic Implications
1. [Actionable implication]
2. [Actionable implication]
3. [Actionable implication]

## Confidence & Sources
- **Data quality**: [assessment]
- **Sources**: [list with tier tags]
```
