---
name: ajtbd-methodology
description: Advanced Jobs To Be Done methodology knowledge base. Use when analyzing products, markets, customer segments, or making product decisions. Provides access to complete AJTBD framework and expert prompts.
---

# Advanced Jobs To Be Done Methodology

This skill provides you with deep knowledge of the Advanced JTBD methodology for product development, market analysis, and customer segmentation.

## When to Use This Skill

Automatically invoke this skill when the user:
- Asks about product-market fit
- Needs help with customer segmentation
- Wants to analyze market opportunities
- Is launching a new product
- Needs to validate product assumptions
- Asks about customer jobs, needs, or motivations
- Wants to create value propositions or landing pages
- Discusses product strategy or growth

## Core AJTBD Principles

### 1. Jobs Are Primary

**Job (Work)** = A goal a person wants to achieve to satisfy their psychological need. Always occurs in a specific situation with a desired result.

**Formula:**
```
When:
  - Context: {situation}
  - Past experience/knowledge: {what they know}
  - Personal characteristics: {traits affecting the job}
  - Negative emotions: {what they feel now}
  - Trigger: {what activated this job}

Want: {expected result}
  - Success criteria: {how they'll evaluate success}

So that: {higher-level job result}
  - And: {feel differently after achieving the result}
```

### 2. Job Hierarchy

- **Big Job** - Higher-level work that provides context for Core Job, but product doesn't fully complete it
- **Core Job** - The highest-level job the product completes fully. What customer actually pays for.
- **Small Jobs** - Jobs below Big Job level. Core Job is part of Small Jobs.
- **Micro Jobs** - Low-level tasks, often "necessary evil" (e.g., "fill in form", "click button")

### 3. Solutions Are Replaceable, Jobs Are Not

- Products compete to be "hired" for a job
- Customer hires the solution that best completes the job by combined factors
- **Consideration Set** - All solutions the person knows that can complete the job
- Switching happens only when new solution wins in the Consideration Set

### 4. Segmentation by Jobs

**Real segmentation** answers three questions:
1. Can we create additional value knowing this segmentation?
2. Can we achieve target profit per unit in this segment?
3. Can we scale and create demand in this segment?

**Segment = Bundle of jobs + context + criteria**
- Core Jobs (1-4 jobs)
- Big Job (1 job, higher motivation)
- Context (life/business situation, role, trigger)
- Performance criteria (quickly, cheaply, reliably, etc.)
- Economic characteristics (frequency, budget, LTV potential)

### 5. Never Use "Pain" - Use Jobs

**Wrong:** "We solve the pain of slow delivery"
**Right:** "When I need to receive a package quickly, I want it delivered same-day so I can complete my project on deadline"

Pain is a consequence of a solution performing below expectations. Focus on the job, not the pain.

### 6. Critical Job Sequence

The sequence of jobs a person must complete to achieve their Big Job. If any job in the critical sequence breaks, the entire value chain fails.

**Optimization priorities:**
1. Complete ALL jobs in the critical sequence for focus sub-segments
2. Complete jobs MORE EFFECTIVELY in the critical sequence
3. Remove problematic jobs from critical path

## Risk Analysis (RAT)

### Five Core Risk Categories

1. **Market** - Large enough, growing, no critical regulatory barriers
2. **Segment** - Economically attractive segment exists with jobs and budget
3. **Value** - Segment will buy the specific value hypothesis
4. **Unit Economics** - Target margin per paying customer, profitable cohorts
5. **Acquisition** - Can create and scale demand, working acquisition channels

### Risk Scoring

- **P (Probability 1-5)**: 1 = strong empirics/sales; 5 = pure hypothesis
- **I (Impact 1-5)**: 1 = local failure; 5 = kills business
- **Score = P × I**, sort by Score↓

### When to Research vs MVP

**Research (AJTBD interviews):**
- Unsure about job/segment existence
- MVP cost > $50K
- Can learn from competitors' failures

**MVP:**
- Segments are clear but need purchase validation
- MVP cost < $20K
- Ready for many iterations

## Available Resources in Plugin

The plugin includes the complete AJTBD book at `${CLAUDE_PLUGIN_ROOT}/skills/ajtbd-methodology/references/`:
- `part1.md` - First Principles (job hierarchy, formulas, core concepts)
- `part2.md` - Segmentation and Market Analysis
- `part3.md` - Product Development and PMF
- `part4.md` - Advanced Topics and Risk Analysis (RAT)
- `part5.md` - Implementation Strategies

**Note:** The product-analyst agent has Read access and can study these in depth when needed.

## How to Apply This Skill

When helping users with product questions:

1. **Frame everything through jobs** - "What job is the customer trying to complete?"
2. **Identify the hierarchy** - What's the Core Job? Big Job? Critical sequence?
3. **Understand the Consideration Set** - What solutions compete for this job?
4. **Validate economic attractiveness** - Is this segment profitable and scalable?
5. **Find the risks** - What assumptions could kill the product?

## Quick Reference Commands

Point users to these commands for specific analyses:
- `/rat` - Risk analysis (RAT)
- `/b2b-segments` - B2B segment discovery
- `/b2c-segments` - B2C segment discovery
- `/jobs-graph` - Jobs graph generation
- `/landing` - Landing page creation

Or suggest the product-analyst agent for deep, autonomous analysis with full book access.

## Key Distinctions from Traditional Approaches

| Traditional | AJTBD |
|------------|-------|
| Fix customer pains | Complete customer jobs |
| Segment by demographics | Segment by job bundles + context |
| Features and benefits | Jobs and criteria |
| Product-centric | Job-centric |
| "What do customers want?" | "What jobs are customers trying to complete?" |

Remember: **Jobs are primary. Everything else is derivative.**
