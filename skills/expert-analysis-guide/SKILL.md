---
name: expert-analysis-guide
description: Multi-perspective expert analysis framework for pre-design evaluation. Automatically loaded when orchestrating expert analysis, spawning parallel expert agents, or when "expert analysis", "multi-perspective", or "parallel analysis" are mentioned.
---

# Multi-Expert Analysis Guide

## Purpose

Provide multi-perspective analysis of a task **before** design begins. By examining the problem through different expert lenses in parallel, the orchestrator gathers diverse insights that inform the Design Doc — catching blind spots, surfacing trade-offs, and identifying cross-cutting concerns early.

## Expert Persona Reference Table

Each aspect maps to an expert persona with defined focus areas:

| Aspect | Expert Persona | Focus Areas |
|--------|---------------|-------------|
| Security | Security Architect | Authentication, authorization, data protection, OWASP Top 10, input validation, secrets management |
| API Design | API Design Expert | Contracts, versioning strategy, error response formats, backward compatibility, pagination |
| Architecture | Systems Architect | Layer boundaries, coupling analysis, dependency direction, module cohesion, separation of concerns |
| Performance | Performance Engineer | Query optimization, caching strategy, bottleneck identification, resource management, scalability |
| Data Modeling | Data Architect | Schema design, migrations, referential integrity, indexing strategy, data lifecycle |
| Testability | Test Engineer | Test surface area, mockability, edge case identification, integration test boundaries |
| Error Handling | Reliability Engineer | Failure modes, recovery strategies, observability, circuit breakers, graceful degradation |
| UX Impact | UX Engineer | User-facing behavior changes, accessibility implications, loading states, error messaging |

## Fan-Out Pattern (Parallel Spawning)

### How the Orchestrator Selects Aspects

1. Examine the task requirements and affected files
2. Select **3-5 aspects** most relevant to the task (see Aspect Selection Heuristics)
3. Spawn one `expert-analyst` agent per selected aspect **in parallel** using the Task tool
4. Each agent receives: aspect, expertPersona, taskContext, affectedFiles

### Spawning Template

For each selected aspect, the orchestrator calls:
```yaml
subagent_type: expert-analyst
description: "[Aspect] expert analysis"
prompt: |
  Aspect: [aspect name]
  Expert Persona: [persona name]
  Task Context: [requirement summary and scope]
  Affected Files: [list of files from requirement-analyzer]
  Design Constraints: [any known constraints]

  Analyze the task from your expert perspective. Investigate actual project code, generate options with pros/cons, and provide a recommendation.
```

**All expert-analyst calls MUST be made in a single message** to enable parallel execution.

## Fan-In Synthesis (Merging Results)

After all expert-analyst agents complete, the orchestrator:

1. **Collect** all JSON responses
2. **Identify conflicts** between expert recommendations (e.g., Security recommends strict validation vs. Performance recommends minimal processing)
3. **Resolve conflicts** by documenting the trade-off and noting both perspectives
4. **Synthesize** a consolidated brief with:
   - Key recommendations per aspect
   - Cross-cutting concerns (issues raised by 2+ experts)
   - Unresolved trade-offs (for the user or technical-designer to decide)
   - Interaction points between aspects

### Synthesis Output Structure

```yaml
expertAnalysisSynthesis:
  aspectsCovered: [list of aspects analyzed]
  keyRecommendations:
    - aspect: "Security"
      recommendation: "..."
      confidence: high|medium|low
    - aspect: "Architecture"
      recommendation: "..."
      confidence: high|medium|low
  crossCuttingConcerns:
    - concern: "..."
      raisedBy: ["Security", "Architecture"]
      impact: "..."
  unresolvedTradeoffs:
    - tradeoff: "..."
      perspectives: { "Performance": "...", "Security": "..." }
  interactionPoints:
    - between: ["API Design", "Data Modeling"]
      issue: "..."
```

### Passing to Technical Designer

The synthesis is included in the technical-designer prompt as additional context:
```
Expert Analysis Results: [synthesis JSON]
Consider these expert perspectives when creating the Design Doc.
Unresolved trade-offs require explicit design decisions.
```

## Aspect Selection Heuristics

| Task Characteristics | Recommended Aspects |
|---------------------|-------------------|
| New API endpoint | API Design, Security, Data Modeling, Error Handling |
| Database schema change | Data Modeling, Performance, Architecture |
| Authentication/authorization | Security, Architecture, Testability |
| UI feature with backend | UX Impact, API Design, Error Handling |
| Performance optimization | Performance, Architecture, Data Modeling |
| Refactoring / restructuring | Architecture, Testability, Error Handling |
| External integration | Security, Error Handling, API Design, Testability |

**Minimum**: Always include Architecture for 3+ file changes.
**Maximum**: 5 aspects — more adds noise without proportional insight.

## Skip Conditions

Expert Analysis Phase should be **skipped** when:

- **Small scale** (1-2 files): Overhead exceeds value
- **Pure bug fix**: Root cause already identified, no design decisions needed
- **Documentation-only changes**: No code impact
- **Dependency updates**: Unless major version with breaking changes
- **Task marked as "straightforward"** by requirement-analyzer with confidence ≥ 0.9

When skipped, the orchestrator proceeds directly to the next phase in the flow.
