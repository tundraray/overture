---
name: strategy-overture
version: 2.0.0
description: McKinsey-grade business strategy and marketing frameworks. Loaded when agents need strategic analysis methodology — market sizing, competitive analysis, Blue Ocean, GTM, growth, pricing, business modeling. Methods only; document structure and quality standards live in strategy-documentation-criteria.
---

# Strategy Overture — Strategic Analysis Framework

## Purpose

This skill provides the methodology backbone for all strategy agents. It codifies consulting-grade frameworks used by McKinsey, BCG, and Bain into analysis methods; the document templates live in `strategy-documentation-criteria`.

## When This Skill Applies

- Market sizing and opportunity assessment
- Competitive landscape analysis
- Strategic positioning and differentiation
- Business model design and validation
- Go-to-market planning
- Growth strategy and experiment design
- Pricing strategy
- Brand positioning

## Core Principles

Document rules — Pyramid Principle, MECE, action titles, source credibility tiers, So what / Now what, and the reader rules — belong to `strategy-documentation-criteria`, "Quality Standards". This skill holds the analysis methods.

### Data Source for Software and Subscription Products: TrustMRR

**URL**: https://trustmrr.com/
**What**: Database of Stripe-verified startup revenues (MRR, growth rates, multiples).
**Tier**: 1 (Stripe-verified revenue data).
**When to use**: market, competitive, and idea validation for a software or subscription product. For other businesses (offline, services, physical goods) it says nothing — skip it rather than report "not listed".

| Use Case | How TrustMRR Helps |
|----------|-------------------|
| Idea validation | Category density: many startups = proven market; zero = blue ocean or no market |
| Market sizing | Real MRR data grounds SOM estimates with actual achievable numbers |
| Competitive analysis | Verified revenue for competitor profiles instead of Tier 2/3 guesses |
| Benchmarking | Category median MRR, top quartile, growth rates |
| Valuation | Revenue multiples from marketplace listings |

## Framework Reference Map

| Framework | Reference File | Primary Agent |
|-----------|---------------|---------------|
| TAM/SAM/SOM | `references/market-sizing.md` | market-analyst |
| Porter's Five Forces + SWOT | `references/competitive-analysis.md` | market-analyst |
| Blue Ocean Strategy | `references/blue-ocean.md` | strategy-architect |
| Ansoff + BCG Matrix | `references/growth-frameworks.md` | strategy-architect |
| Customer Segmentation | `references/customer-segmentation.md` | market-analyst |
| Value Proposition Canvas | `references/value-proposition.md` | strategy-architect |
| GTM Strategy | `references/gtm-strategy.md` | gtm-planner |
| Pricing Strategy | `references/pricing.md` | gtm-planner |
| Brand Positioning | `references/brand-positioning.md` | strategy-architect |
| AARRR / PLG / CLG | `references/growth-metrics.md` | growth-strategist |
| ICE / RICE Scoring | `references/growth-experiments.md` | growth-strategist |
| BMC / Lean Canvas | `references/business-model-canvas.md` | business-modeler |
| Content Marketing | `references/content-marketing.md` | gtm-planner |
| Partnership Strategy | `references/partnership-strategy.md` | gtm-planner |
| Innovation Accounting | `references/innovation-accounting.md` | business-modeler |

## Framework Pairing Rules

Frameworks are most effective when paired:

| Pair | Purpose |
|------|---------|
| Porter's Five Forces + SWOT | Industry structure (macro) + company position (micro) |
| Ansoff Matrix + BCG Matrix | Growth direction + portfolio resource allocation |
| Lean Canvas + AARRR | Business model + funnel metrics |
| Blue Ocean + Value Proposition Canvas | Market creation + customer value alignment |
| ICE/RICE + AARRR | Experiment prioritization + funnel stage targeting |
| TAM/SAM/SOM + Customer Segmentation | Market size + segment attractiveness |

## Anti-Patterns

| Anti-Pattern | Why It's Wrong | Correct Approach |
|-------------|----------------|-----------------|
| Presenting TAM as revenue potential | TAM is theoretical maximum, not realistic target | Use SOM with clear capture assumptions |
| SWOT without prioritization | Flat lists provide no actionable direction | Rank items by impact × likelihood, focus on top 3 |
| Blue Ocean without implementation cost | Easy to find blue oceans, hard to reach them | Include resource requirements and timeline |
| Growth hacking without metrics | Random experiments waste resources | Define success metric before running experiment |
| Pricing based only on competition | Ignores value created for customer | Start with value-based, validate against competition |
| Lean Canvas as one-time exercise | Business model evolves constantly | Update after every major learning cycle |
