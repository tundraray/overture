# Market Sizing (TAM / SAM / SOM)

## Definitions

- **TAM** (Total Addressable Market): Total global demand for the product/service category. "If we had 100% market share with zero constraints."
- **SAM** (Serviceable Addressable Market): Portion of TAM reachable given geography, product scope, and go-to-market constraints. "Our realistic playing field."
- **SOM** (Serviceable Obtainable Market): Share of SAM capturable within 1-3 years given current resources and competition. "What we can actually win."

## Methodology

### Top-Down (Macro → Micro)

```
Total industry revenue (reports, filings)
  → Filter by geography / vertical
    → Filter by product fit
      → Apply market share assumption
```

**When to use**: Initial scoping, investor decks, sanity checks
**Weakness**: Relies on published data which may be stale or overly broad

### Bottom-Up (Micro → Macro)

```
Number of potential customers
  × Average revenue per customer
    × Realistic conversion rate
      = Revenue estimate
```

**When to use**: Operational planning, pricing validation, SOM estimation
**Strength**: Based on unit economics you can verify

### TrustMRR Validation (Mandatory)

**Source**: https://trustmrr.com/ — Stripe-verified startup revenue database.

Use TrustMRR as a **Tier 1 data source** to ground-truth market sizing:

```yaml
TrustMRR Research Steps:
  1. Search relevant category (AI, SaaS, Dev Tools, Fintech, Marketing, etc.)
  2. Extract top startups: MRR, growth rate, category
  3. Calculate category benchmarks:
     - Median MRR for the category
     - Top quartile MRR (what "good" looks like)
     - Average MoM growth rate
  4. Check marketplace listings for revenue multiples (validates valuation)
  5. Identify revenue ceiling: what is the highest MRR in this category?

Application:
  - SOM validation: "Top startups in this category achieve $X MRR → SOM of $Y is realistic/unrealistic"
  - Growth benchmarking: "Category average MoM growth is X% → our projection of Y% is conservative/aggressive"
  - Competitive revenue: Real revenue data for competitor profiles (Tier 1)
  - Idea validation: If no startups exist in the category → either blue ocean or no market
```

**Key advantage**: Unlike analyst reports (Tier 2), TrustMRR data is Stripe-verified (Tier 1). Use it to validate or challenge assumptions from industry reports.

### Hybrid Approach (Recommended)

Combine all three methods. If estimates diverge by >30%, investigate the gap.

```yaml
Triangulation:
  topDown: $X (source: [report])
  bottomUp: $Y (source: [calculation])
  trustMRR: $Z (source: [category benchmark × estimated players])
  delta: max deviation from mean
  action:
    - delta < 15%: Use average, high confidence
    - delta 15-30%: Use bottom-up, note range
    - delta > 30%: Investigate assumptions before proceeding
```

## Output Template

```markdown
## Market Size Assessment

### TAM: $[X]B ([Year])
- **Method**: [Top-down / Bottom-up / Hybrid]
- **Source**: [Tier 1/2/3 — specific source]
- **Growth rate**: [X]% CAGR ([period])

### SAM: $[X]B
- **Geographic filter**: [regions]
- **Segment filter**: [verticals]
- **Product fit filter**: [criteria]
- **SAM as % of TAM**: [X]%

### SOM: $[X]M (Year 1-3)
- **Capture assumption**: [X]% of SAM
- **Basis**: [comparable company benchmarks, sales capacity]
- **Key constraints**: [list limiting factors]

### Confidence Assessment
- **Data quality**: [High/Medium/Low]
- **Assumption risk**: [which assumptions are weakest]
- **Revalidation trigger**: [when to rerun this analysis]
```

## Common Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Using TAM in financial projections | Massively overstates opportunity | Use SOM with explicit capture rate |
| Static market sizing | Markets shift, especially in tech | Set revalidation triggers (quarterly) |
| Ignoring adjacent markets | Misses expansion opportunity | Include TAM for adjacent verticals separately |
| Single-source data | Bias from one analyst's methodology | Triangulate with 2-3 sources |
| Confusing revenue with transaction volume | 10x overcount if marketplace model | Clarify: revenue = take rate × GMV |
