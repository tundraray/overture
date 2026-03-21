# Pricing Strategy

## Pricing Approaches

| Approach | When to Use | Risk |
|----------|------------|------|
| **Cost-Plus** | Commodity products, manufacturing | Ignores value; leaves money on table |
| **Competitor-Based** | Mature markets, parity products | Race to bottom; no differentiation signal |
| **Value-Based** | Differentiated products, B2B | Requires deep customer understanding |

**Default to Value-Based** — cost-plus and competitor-based are fallbacks, not strategies.

## Value-Based Pricing

### Core Formula

```
Price = Customer's Economic Value × Capture Rate

Where:
  Economic Value = Reference Value + Differentiation Value
  Reference Value = Price of next-best alternative
  Differentiation Value = $ value of unique benefits
  Capture Rate = 10-30% (customer keeps 70-90% of value created)
```

### 10:1 Rule (Consulting Standard)

Customer should receive **10x the price** in value. If you charge $1,000/mo, the product should save or generate $10,000/mo.

```yaml
Value Calculation:
  time_saved: "[X hours/month] × [hourly cost] = $[X]/month"
  revenue_generated: "[additional revenue attributable] = $[X]/month"
  cost_avoided: "[risk × probability of occurrence] = $[X]/month"
  total_value: "$[sum]"
  recommended_price: "$[total_value / 10]"
  margin_of_safety: "[if ratio > 10:1, comfortable; if 5:1, risky]"
```

## Pricing Models

| Model | Best For | Pros | Cons |
|-------|---------|------|------|
| **Flat Rate** | Simple products, SMB | Easy to understand | Over/under-charges some segments |
| **Tiered** | Multi-segment, feature differentiation | Captures value at each level | Complexity, feature gating friction |
| **Per-Seat** | Team tools, collaboration | Predictable, easy to forecast | Discourages adoption, seat-sharing |
| **Usage-Based** | APIs, infrastructure, consumption | Aligns cost with value | Unpredictable bills, churn on overages |
| **Freemium** | PLG, viral products | Low friction, high top-of-funnel | Conversion rate risk, free-rider cost |
| **Reverse Trial** | PLG, feature discovery | Users experience full value first | Churn at trial end if not activated |

### Pricing Model Selection

```yaml
Choose Flat Rate when:
  - Product is simple
  - One primary use case
  - SMB target

Choose Tiered when:
  - Multiple segments with different needs
  - Clear feature differentiation between tiers
  - Want to anchor with high tier

Choose Usage-Based when:
  - Value scales with usage
  - Heavy users get disproportionate value
  - API / infrastructure product

Choose Freemium when:
  - Network effects exist
  - Marginal cost of free user ≈ $0
  - Virality is core to GTM

Choose Per-Seat when:
  - Value is per-person
  - Collaboration features
  - Enterprise procurement expects it
```

## Price Anchoring & Tier Design

### Three-Tier Standard

| Element | Tier 1 (Starter) | Tier 2 (Professional) | Tier 3 (Enterprise) |
|---------|------------------|----------------------|---------------------|
| **Purpose** | Entry / try | Best value (target) | Full capability |
| **Pricing** | Low / Free | 3-5x Starter | Custom / 2-3x Pro |
| **Features** | Core only | Core + growth | All + customization |
| **Role** | Anchor low | Drive conversion | Anchor high, capture value |

**Rule**: Design Tier 2 to be obviously the best deal. Tier 1 exists to show what's missing. Tier 3 exists to make Tier 2 look reasonable.

## Competitive Pricing Analysis

```markdown
| Competitor | Price | Model | Features at Price | Our Position |
|-----------|-------|-------|------------------|-------------|
| [name] | $[X]/mo | [model] | [what they include] | [premium/parity/discount] |
```

**Positioning decision**:
- **Premium (>20% above)**: Requires clear differentiation + proof
- **Parity (±20%)**: Need non-price differentiation
- **Discount (>20% below)**: Risk of quality perception; justify with cost structure advantage

## Output Template

```markdown
# Pricing Strategy

## Value Assessment
- **Reference value** (next-best alternative): $[X]/mo
- **Differentiation value**: $[X]/mo — [specific benefits valued]
- **Total economic value**: $[X]/mo
- **10:1 check**: $[value] / $[price] = [X]:1 ✅/❌

## Recommended Model: [model type]
**Rationale**: [why this model]

## Tier Structure
| | Starter | Professional | Enterprise |
|---|---|---|---|
| Price | $[X]/mo | $[X]/mo | Custom |
| Target segment | [who] | [who] | [who] |
| Key features | [list] | [list] | [list] |
| Expected mix | [X]% | [X]% | [X]% |

## Competitive Position
[Competitive pricing table]
**Position**: [Premium / Parity / Discount] — [rationale]

## Projected Unit Economics
- **ARPU**: $[X]/mo
- **CAC**: $[X]
- **LTV**: $[X]
- **LTV:CAC**: [X]:1 (target >3:1)
- **Payback period**: [X months] (target <12)
```
