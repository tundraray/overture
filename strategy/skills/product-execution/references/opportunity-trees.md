# Opportunity Solution Trees

## Teresa Torres OST Methodology

The Opportunity Solution Tree (OST) is a visual framework that connects desired outcomes to the opportunities, solutions, and experiments that will drive those outcomes. It prevents the common failure mode of jumping from a business goal directly to a solution.

### Structure

```
Desired Outcome
├── Opportunity A
│   ├── Solution A1
│   │   ├── Assumption Test A1a
│   │   └── Assumption Test A1b
│   └── Solution A2
│       └── Assumption Test A2a
├── Opportunity B
│   ├── Solution B1
│   │   └── Assumption Test B1a
│   └── Solution B2
│       ├── Assumption Test B2a
│       └── Assumption Test B2b
└── Opportunity C
    └── Solution C1
        └── Assumption Test C1a
```

### Layer Definitions

| Layer | Definition | Source | Rule |
|-------|-----------|--------|------|
| **Desired Outcome** | Measurable business or product metric you want to move | `strategy-canvas.md`, `growth-plan.md` | One outcome per tree. Must be quantifiable. |
| **Opportunities** | Unmet needs, pains, or desires that, if addressed, could move the outcome | `jobs-graph.md` (problems with severity >7) | Discovered through research, not brainstormed. MECE if possible. |
| **Solutions** | Specific product changes or features that could address an opportunity | Team ideation, Shape Up pitches | Generate 3+ per opportunity before selecting. Never just one. |
| **Assumption Tests** | Smallest experiments that test the riskiest assumption of a solution | `rat.md` risk mapping | Test before building. Cheapest/fastest test first. |

## Deriving Outcomes from Strategy Docs

### From strategy-canvas.md

The Strategy Canvas reveals where your product will differentiate. Each ERRC action implies an outcome:

| ERRC Action | Strategy Canvas Factor | Derived Outcome | Example |
|------------|----------------------|-----------------|---------|
| **Create** | New factor not in industry | Adoption of new capability | "50% of active users use [new factor] weekly" |
| **Raise** | Factor raised above industry | Improved satisfaction on dimension | "NPS on [factor] increases from 30 to 60" |
| **Reduce** | Factor reduced below industry | Reduced cost or complexity | "Onboarding time drops from 3 days to 3 hours" |
| **Eliminate** | Factor removed entirely | Simplified experience | "Support tickets about [factor] drop to zero" |

### From growth-plan.md

The North Star Metric from the growth plan is often the best outcome for the primary OST:

```
North Star Metric: [metric from growth-plan.md]
├── AARRR bottleneck stage → Opportunity cluster 1
├── Second bottleneck stage → Opportunity cluster 2
└── Supporting metric gap → Opportunity cluster 3
```

### From value-proposition.md

Pains ranked by severity and gains ranked by relevance provide a prioritized list of opportunities.

## Converting jobs-graph.md Problems into Opportunities

### Selection Criteria

Not every problem from the jobs graph becomes an opportunity. Apply these filters:

| Filter | Threshold | Rationale |
|--------|-----------|-----------|
| **Severity** | >= 7 out of 10 | Low-severity problems don't move outcomes meaningfully |
| **Frequency** | Occurs in core job flow | Edge-case problems affect too few users |
| **Segment coverage** | Affects primary or secondary segment | Tertiary segments can wait |
| **Strategic alignment** | Connects to an ERRC action | If strategy doesn't call for it, defer |

### Conversion Template

For each qualifying problem from `jobs-graph.md`:

```markdown
## Opportunity: [Reframed as unmet need]

**Source**: jobs-graph.md → Job [X]: [job name] → Problem [Y]
**Original problem**: "[problem description]"
**Severity**: [score]/10
**Segment**: [segment name from customer-segments.md]

**Opportunity reframe**: "How might we [enable/reduce/eliminate] [reframed problem] so that [segment] can [complete the job successfully]?"

**Outcome connection**: Addressing this opportunity would move [outcome] because [reasoning].

**Evidence**:
- [Tier X evidence from jobs-graph]
- [Additional evidence if available]
```

### Reframing Rules

Problems describe what is wrong. Opportunities describe what could be better. The reframe matters:

| Problem (from jobs-graph) | Bad Opportunity (too narrow) | Good Opportunity (opens solution space) |
|--------------------------|----------------------------|----------------------------------------|
| "Users spend 2 hours on manual data entry" | "Automate data entry" | "Reduce time to get data into the system" |
| "30% of users abandon onboarding at step 3" | "Simplify step 3" | "Help users reach their first success faster" |
| "Export format doesn't match customer needs" | "Add more export formats" | "Ensure output works in customer's existing workflow" |

The good opportunity allows for multiple solution approaches. The bad one prescribes a solution.

## Generating Solutions from Opportunities

### Diverge Then Converge

For each opportunity, generate solutions in two phases:

**Phase 1 — Diverge (quantity over quality)**:
- Generate at least 5 solution ideas per opportunity
- No evaluation during divergence
- Include wild/ambitious ideas — they spark practical ones
- Consider: analogies from other industries, opposite of current approach, automation, elimination

**Phase 2 — Converge (evaluate and select)**:

| Solution | Opportunity Fit | Appetite | Confidence | Risk Level | Select? |
|----------|----------------|----------|------------|------------|---------|
| [Solution 1] | How well does it address the opportunity? (High/Med/Low) | S/M/L | How sure are we it works? (High/Med/Low) | How much could go wrong? (High/Med/Low) | Yes/No |
| [Solution 2] | [assessment] | [size] | [confidence] | [risk] | [decision] |

**Selection rules**:
- Pick 1-2 solutions per opportunity to test (not all 5)
- Prefer solutions with smaller appetite + higher confidence
- If the best solution is high-risk, it needs more assumption tests before committing

### Solution Quality Checklist

| Check | Requirement |
|-------|------------|
| Addresses the opportunity, not a different problem | The solution directly helps with the stated unmet need |
| Within appetite | Can be shaped to fit a reasonable time budget |
| Does not require new infrastructure | Or, if it does, that dependency is called out explicitly |
| Does not conflict with other in-progress work | Check against current roadmap |
| Has at least one testable assumption | If you can't test it, you can't validate it |

## Designing Assumption Tests from rat.md

### Mapping RAT Risks to Solution Assumptions

Every solution carries assumptions. The riskiest assumptions must be tested before committing to build. Cross-reference with `rat.md`:

| Solution Assumption | Related RAT Risk | P x I Score | Test Design |
|--------------------|-----------------|------------|-------------|
| "Users will understand the new interface" | Risk Card [N]: Usability risk | [score] | 5-user usability test with prototype — 3 days, $0 |
| "API integration is technically feasible" | Risk Card [N]: Technical risk | [score] | Spike: build proof-of-concept — 2 days, $0 |
| "Users will pay $X/mo for this feature" | Risk Card [N]: Willingness-to-pay | [score] | Fake door test + survey — 1 week, $200 |

### Assumption Test Design

```markdown
## Assumption Test: [Name]

**Solution**: [which solution this tests]
**Assumption**: "[specific, falsifiable statement]"
**Related RAT risk**: Risk Card [N], Score [P x I]

**Test type**: [interview / prototype / fake door / spike / survey / landing page / concierge]
**Duration**: [days]
**Cost**: $[X]
**Sample size**: [N participants/responses]

**Success criteria**: "[threshold that validates the assumption]"
**Failure criteria**: "[threshold that invalidates the assumption]"

**If validated**: Proceed to feature specification (Shape Up pitch)
**If invalidated**: [pivot to alternative solution / re-examine opportunity / abandon]
```

### Test Type Selection Guide

| What You're Testing | Best Test Type | Time | Cost |
|--------------------|---------------|------|------|
| "Do users have this problem?" | Customer interviews (5-10) | 1-2 weeks | $0 |
| "Will users use this solution?" | Prototype usability test | 3-5 days | $0-500 |
| "Will users pay for this?" | Fake door + survey | 1-2 weeks | $200-1000 |
| "Is this technically feasible?" | Engineering spike | 1-3 days | $0 |
| "Is there enough demand?" | Landing page + ads | 1-2 weeks | $500-2000 |
| "Can we deliver value manually first?" | Concierge MVP | 2-4 weeks | $0 |

## Complete OST Template

```markdown
# Opportunity Solution Tree: [Product/Feature Area]

**Date**: [current date]
**Desired outcome**: [measurable outcome from strategy docs]
**Current value**: [current metric value]
**Target value**: [target metric value]
**Timeline**: [by when]

## Outcome Source
- **Strategy Canvas**: [ERRC action that drives this outcome]
- **Growth Plan**: [North Star or supporting metric]
- **Business Model**: [revenue/cost constraint]

---

## Opportunity 1: [HMW statement]

**Source**: jobs-graph.md → Job [X], Problem [Y] (Severity: [Z]/10)
**Segment**: [from customer-segments.md]

### Solution 1a: [Name]
- **Description**: [low-fidelity description]
- **Appetite**: [S/M/L]
- **Riskiest assumption**: "[statement]"
- **Test**: [test type] — [duration], $[cost]
- **Success criteria**: [threshold]

### Solution 1b: [Name]
- **Description**: [low-fidelity description]
- **Appetite**: [S/M/L]
- **Riskiest assumption**: "[statement]"
- **Test**: [test type] — [duration], $[cost]
- **Success criteria**: [threshold]

---

## Opportunity 2: [HMW statement]

**Source**: jobs-graph.md → Job [X], Problem [Y] (Severity: [Z]/10)
**Segment**: [from customer-segments.md]

### Solution 2a: [Name]
[same structure as above]

---

## Decision Log

| Opportunity | Selected Solution | Rationale | Status |
|------------|------------------|-----------|--------|
| [Opp 1] | [Sol 1a] | [why this over 1b] | Testing / Validated / Building |
| [Opp 2] | [Sol 2a] | [why] | Testing / Validated / Building |

## Next Steps
1. [Run assumption test for highest-priority solution]
2. [Validate or invalidate within [X] days]
3. [If validated, proceed to feature spec (Shape Up pitch)]
```

## When NOT to Use OST

| Situation | Why OST Is Overkill | What to Use Instead |
|-----------|--------------------|--------------------|
| Single obvious solution with no uncertainty | OST adds overhead when the path is clear | Go directly to feature spec |
| Bug fix or technical debt | No opportunity discovery needed | Task ticket |
| Regulatory/compliance requirement | Must do it regardless of opportunity size | Compliance spec |
| Exact feature requested by paying customer | Discovery already done by customer | Lightweight spec (Cagan) |
| Fewer than 3 possible solutions | Not enough solution space to warrant a tree | Skip to assumption testing |

## Common Mistakes

| Mistake | Consequence | Fix |
|---------|------------|-----|
| Too many outcomes on one tree | Tree becomes unwieldy, loses focus | One outcome per tree. Period. |
| Opportunities brainstormed instead of researched | Solutions to problems nobody has | Ground opportunities in `jobs-graph.md` evidence |
| Only one solution per opportunity | No comparison = no confidence in choice | Generate 3-5, select 1-2 |
| Solutions without assumption tests | Building on unvalidated assumptions | Every selected solution needs at least one test |
| Skipping the opportunity layer | Jumping from outcome to solution | Always ask "what opportunity does this address?" |
| Testing the easy assumption first | Real risk remains untested | Test the assumption that, if wrong, kills the solution |
| Never updating the tree | Tree becomes stale artifact | Review and prune monthly |
