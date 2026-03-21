# Growth Strategy Frameworks

## Ansoff Matrix

Maps growth direction across two dimensions: markets × products.

| | Existing Products | New Products |
|---|------------------|-------------|
| **Existing Markets** | **Market Penetration** | **Product Development** |
| **New Markets** | **Market Development** | **Diversification** |

### Strategy Details

| Strategy | Risk Level | Typical Actions |
|----------|-----------|-----------------|
| **Market Penetration** | Low | Increase usage, win competitor customers, convert non-users. Pricing, promotion, distribution. |
| **Product Development** | Medium | New features, line extensions, next-gen products for current customers. R&D investment. |
| **Market Development** | Medium | New geographies, new segments, new channels for existing products. Market research + GTM. |
| **Diversification** | High | New products for new markets. Related (synergies) or unrelated (conglomerate). Highest capital. |

### Decision Criteria

```yaml
Choose Market Penetration when:
  - Market is growing
  - Current share < 30%
  - Competitors are weak
  - Product is strong

Choose Product Development when:
  - Market is mature
  - Current share > 30%
  - Customer needs are evolving
  - R&D capability exists

Choose Market Development when:
  - Product-market fit is proven
  - Adjacent markets exist
  - Distribution can extend
  - Regulatory allows

Choose Diversification when:
  - Current market is declining
  - Strong cash position
  - Synergies with core business
  - Risk tolerance is high
```

## BCG Matrix

Categorizes products/business units for resource allocation.

| | High Market Growth | Low Market Growth |
|---|-------------------|-------------------|
| **High Market Share** | **Stars** ★ | **Cash Cows** 🐄 |
| **Low Market Share** | **Question Marks** ❓ | **Dogs** 🐕 |

### Portfolio Strategy

| Category | Cash Flow | Strategy |
|----------|-----------|---------|
| **Stars** | Neutral (high revenue, high investment) | Invest to maintain/grow share. Future cash cows. |
| **Cash Cows** | Positive (high revenue, low investment) | Harvest profits. Invest minimum for maintenance. Fund stars/question marks. |
| **Question Marks** | Negative (low revenue, high investment needed) | Decide: invest to become star, or divest. Use ICE/RICE to prioritize. |
| **Dogs** | Low/Negative | Divest or reposition. Don't throw good money after bad. |

### Ansoff + BCG Integration

Use Ansoff to plot growth direction, BCG to allocate resources:

```
Stars → Market Penetration (defend share) or Product Development (extend lead)
Cash Cows → Market Penetration (maximize extraction)
Question Marks → Market Development or Product Development (choose one, commit fully)
Dogs → Market Development (find new market) or Divest
```

## GE-McKinsey Matrix (Advanced)

More nuanced than BCG — uses two composite axes:

- **Industry Attractiveness**: Market size, growth rate, profitability, competitive intensity, tech requirements
- **Competitive Strength**: Market share, brand strength, production capacity, margins, tech capability

### Nine-Cell Grid

| | High Attractiveness | Medium | Low |
|---|---|---|---|
| **High Strength** | Invest/Grow | Invest/Grow | Selective |
| **Medium** | Invest/Grow | Selective | Harvest/Divest |
| **Low** | Selective | Harvest/Divest | Harvest/Divest |

**When to use GE-McKinsey over BCG**: When you need more granularity (multiple business units), when market share alone doesn't capture competitive strength, or when industry attractiveness is multi-dimensional.

## Output Template

```markdown
# Growth Strategy Analysis

## Current Portfolio Position (BCG)
| Product/Unit | Market Share | Market Growth | Category | Recommendation |
|---|---|---|---|---|
| [name] | [X]% | [X]% | Star/Cow/QM/Dog | [action] |

## Growth Direction (Ansoff)
**Primary vector**: [strategy] — [rationale]
**Secondary vector**: [strategy] — [rationale]

### Recommended Actions
1. [action] — Timeline: [X months], Investment: $[X], Expected return: [X]
2. [action] — Timeline: [X months], Investment: $[X], Expected return: [X]

## Resource Allocation
| Source | Destination | Amount | Rationale |
|--------|------------|--------|-----------|
| Cash Cow [X] | Star [Y] | $[X] | [why] |

## Risk Assessment
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|
| [risk] | High/Med/Low | High/Med/Low | [action] |
```
