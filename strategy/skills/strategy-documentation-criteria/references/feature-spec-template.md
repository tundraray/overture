# Feature: [Feature Name]

**ID**: F-[NNN]
**Date**: [current date]
**Priority**: Now / Next / Later
**Kano Category**: Must-Be / Performance / Attractive
**WSJF Score**: CoD [X] / Duration [X] = [Score]
**Appetite**: S (1-2 days) / M (1-2 weeks) / L (3-6 weeks)

## Cross-References

| Source | Reference | What It Provides |
|--------|-----------|-----------------|
| Job | [jobs-graph.md → Job #N: "job name"] | The specific job this feature helps complete |
| Segment | [segments.md → Segment #N: "segment name"] | Target segment for this feature |
| Problem | [jobs-graph.md → Job #N, Problem: severity X/10] | The problem this feature solves |
| Risk | [rat.md → Risk #N: "risk name", P×I=X] | Which risky assumption this addresses |
| Strategy | [strategy-canvas.md → Four Actions: Eliminate/Reduce/Raise/Create] | Strategic action this supports |
| Initiative | [prioritized-initiatives.md → #N, ICE=X] | Source initiative with priority score |
| Opportunity | [opportunity-map.md → Opportunity #N] | Parent opportunity in OST |

## Problem

[Specific problem from jobs-graph. Describe the situation, who experiences it, how severe it is. Link to the exact job and problem.]

**Job context**: "When [situation from jobs-graph], the customer wants [result], but [problem occurs] (severity: X/10)"

## Solution (Low-Fidelity)

[What the feature does, not how it's implemented. Enough detail to evaluate the approach, not enough to start coding. Describe the user experience, not the technical architecture.]

## Rabbit Holes

[Risks and complexities that could derail this feature. Things that seem simple but might not be.]
- [rabbit hole 1] — Mitigation: [how to avoid]
- [rabbit hole 2] — Mitigation: [how to avoid]

## No-Gos

[What is explicitly NOT part of this feature. Scope boundaries.]
- [exclusion 1] — Why: [rationale]
- [exclusion 2] — Why: [rationale]

## Success Metrics

| Metric | Current | Target | Measurement Method |
|--------|---------|--------|-------------------|
| [metric linked to North Star] | [baseline or N/A] | [target] | [how to measure] |

## Acceptance Criteria

| # | Criterion |
|---|----------|
| 1 | Given [precondition], When [action], Then [expected result] |
| 2 | Given [precondition], When [action], Then [expected result] |
| 3 | Given [precondition], When [action], Then [expected result] |

## WSJF Scoring Detail

| Dimension | Score (1-20) | Rationale |
|-----------|-------------|-----------|
| User/Business Value | [score] | [why] |
| Time Criticality | [score] | [why] |
| Risk Reduction | [score] | [why] |
| **Cost of Delay** | **[sum]** | |
| Job Duration | [score] | [estimated effort] |
| **WSJF** | **[CoD/Duration]** | |
