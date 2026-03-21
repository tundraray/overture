# Deliverable Standards (McKinsey-Grade)

## Pyramid Principle (Barbara Minto)

### Structure

```
GOVERNING THOUGHT (answer/recommendation)
  ├── Key Argument 1
  │     ├── Evidence 1a
  │     └── Evidence 1b
  ├── Key Argument 2
  │     ├── Evidence 2a
  │     └── Evidence 2b
  └── Key Argument 3
        ├── Evidence 3a
        └── Evidence 3b
```

### Rules

1. **Start with the answer**: State the recommendation/conclusion first, then support it
2. **Group and summarize**: Each level of the pyramid summarizes the ideas below it
3. **Logically order**: Arguments within a group follow deductive or inductive logic
4. **MECE at every level**: Each group of arguments is mutually exclusive and collectively exhaustive

### Action Titles

Every section heading must be a complete sentence stating the main point:

| Bad (Generic) | Good (Action Title) |
|--------------|-------------------|
| "Market Analysis" | "The B2B SaaS market is growing at 18% CAGR with consolidation favoring integrated platforms" |
| "Competition" | "Three competitors control 60% of market share but none serve the mid-market segment effectively" |
| "Recommendation" | "Enter via product-led growth targeting mid-market companies with a $49/seat pricing model" |

**Titles Test**: If someone reads ONLY the section titles, they should understand the full argument.

## MECE Principle

### Application

```yaml
MECE Checklist:
  Mutually Exclusive:
    - Can any item belong to two categories?
    - If yes → redefine categories
  Collectively Exhaustive:
    - Is every relevant item covered?
    - Is there a gap?
    - If yes → add missing category or use "Other" (sparingly)
```

### Common MECE Frameworks

| Framework | Categories |
|-----------|-----------|
| 3C's | Company, Customers, Competitors |
| 4P's | Product, Price, Place, Promotion |
| Internal/External | (for any organizational analysis) |
| Supply/Demand | (for market analysis) |
| Quantitative/Qualitative | (for data classification) |
| Short-term/Long-term | (for recommendations) |

## Report Structure (Full Strategic Report)

```markdown
# Strategic Analysis: [Product/Business Name]

## Executive Summary
[1 page maximum. Lead with recommendation. Include:]
- **Recommendation**: [Go / No-Go / Pivot] with confidence level
- **Market opportunity**: [TAM/SOM in one line]
- **Key finding 1**: [one sentence]
- **Key finding 2**: [one sentence]
- **Key finding 3**: [one sentence]
- **Critical risk**: [biggest thing that could go wrong]
- **Next steps**: [3 immediate actions]

## 1. Business Context
[From context-analyzer output]

## 2. Market Landscape
### 2.1 Market Size & Growth
### 2.2 Competitive Landscape
### 2.3 Industry Structure
[From market-analyst output]

## 3. Strategic Positioning
### 3.1 Blue Ocean Analysis
### 3.2 Value Proposition
### 3.3 Growth Direction
[From strategy-architect output]

## 4. Business Model
### 4.1 Value Creation & Capture
### 4.2 Revenue Model
### 4.3 Unit Economics
[From business-modeler output]

## 5. Go-to-Market Strategy
### 5.1 Target Customer
### 5.2 Messaging & Positioning
### 5.3 Channel Strategy
### 5.4 Pricing
[From gtm-planner output]

## 6. Growth Strategy
### 6.1 Funnel Analysis
### 6.2 Growth Experiments
### 6.3 Prioritized Initiatives
[From growth-strategist output]

## 7. Risk Assessment
[Aggregated from all agents]
| Risk | Probability | Impact | Mitigation |
|------|------------|--------|-----------|

## 8. Appendix
### Sources & Methodology
### Detailed Data Tables
### Assumptions Log
```

## Quality Checklist

Before finalizing any deliverable:

```yaml
Structure:
  - [ ] Pyramid Principle applied (conclusion first)
  - [ ] All categorizations are MECE
  - [ ] Action titles on every section
  - [ ] Titles test passes (titles alone tell the story)

Content:
  - [ ] Every data point has source tier tag
  - [ ] No Tier 3 data presented as Tier 1
  - [ ] Every section ends with "So what?" and "Now what?"
  - [ ] Recommendations are specific and actionable
  - [ ] Confidence levels stated for key assertions

Formatting:
  - [ ] Executive summary fits on one page
  - [ ] Tables used for comparisons (not paragraphs)
  - [ ] Numbers are specific, not vague ("18% CAGR", not "growing fast")
  - [ ] Consistent formatting throughout
  - [ ] No orphan sections (every section has ≥2 sub-points)

Completeness:
  - [ ] All framework outputs included
  - [ ] Risk assessment with mitigations
  - [ ] Clear next steps with owners and timelines
  - [ ] Assumptions explicitly stated
```

## Tone & Voice

| Do | Don't |
|----|-------|
| "We recommend entering via PLG because..." | "It might be good to consider possibly trying..." |
| "Revenue will reach $2M ARR by Month 18" | "Revenue could potentially grow significantly" |
| "This approach carries three risks" | "There are some concerns" |
| "The data shows 73% preference" | "Most people seem to prefer" |
| Use numbers, percentages, timelines | Use "many", "some", "soon", "significant" |

**Principle**: Write like a partner presenting to a CEO. Confident, specific, evidence-backed, actionable.
