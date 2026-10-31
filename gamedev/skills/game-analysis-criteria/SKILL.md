---
name: game-analysis-criteria
description: This skill provides templates, analysis frameworks, and quality criteria for game reverse-engineering and competitive analysis. Used when analyzing external games for mechanics, technology, marketing, retention, and market positioning. Loaded by game-researcher agent and game-analyze command.
---

# Game Analysis Criteria

## Purpose

Framework for systematic reverse-engineering and analysis of external games to extract actionable insights for player retention, market positioning, and game design decisions.

## Templates

### Mechanics (per-mechanic reverse engineering)
- **[mechanics-overview-template.md](${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/mechanics-overview-template.md)** - Map of all mechanics, core loop diagram, system interconnections
- **[mechanic-detail-template.md](${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/mechanic-detail-template.md)** - Per-mechanic deep dive: states, triggers, formulas, balancing, edge cases

### Analysis Reports
- **[technology-report-template.md](${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/technology-report-template.md)** - Engine, frameworks, networking, performance
- **[marketing-report-template.md](${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/marketing-report-template.md)** - Marketing strategies, community engagement, influencer relations
- **[retention-report-template.md](${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/retention-report-template.md)** - Retention mechanics, monetization, live ops
- **[market-position-report-template.md](${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/market-position-report-template.md)** - Competitive landscape, market share, audience
- **[ui-ux-report-template.md](${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/ui-ux-report-template.md)** - UI/UX design, onboarding, accessibility
- **[game-feel-report-template.md](${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/game-feel-report-template.md)** - Polish, juice, feedback systems, audio design

### Synthesis
- **[executive-summary-template.md](${CLAUDE_PLUGIN_ROOT}/skills/game-analysis-criteria/references/executive-summary-template.md)** - Final synthesis with actionable retention strategies

## Storage Convention

All game research is stored **per game** under the user's project:

```
docs/game-research/
  {game-slug}/
    raw-research.md              # Raw data from game-researcher
    mechanics/                   # Per-mechanic reverse engineering
      overview.md                # sr-game-designer: all mechanics map, core loop
      {mechanic-slug}.md         # mechanics-developer: detailed per-mechanic analysis
    technology-analysis.md       # Engine, frameworks, performance
    marketing-analysis.md        # Marketing strategies, community
    retention-analysis.md        # Retention mechanics, monetization
    market-position.md           # Competitive landscape
    ui-ux-analysis.md            # UI/UX design analysis
    game-feel-analysis.md        # Polish, juice, feedback
    executive-summary.md         # Final synthesis with recommendations
    source-code/                 # Source code notes (if available)
      architecture.md
      patterns.md
  comparison-matrix.md           # Cross-game comparison (Phase 5 of /game-analyze)
```

**Naming**: `{game-slug}` = lowercase, hyphenated game name (e.g., `hollow-knight`, `stardew-valley`, `clash-royale`)

## Quality Criteria for Research

### Data Quality Tiers

| Tier | Source Type | Usage |
|------|-----------|-------|
| **Verified** | Official developer data, store APIs, public financials | Direct citation |
| **Inferred** | Review aggregation, community data, tool analysis | Cite with its tier |
| **Estimated** | Industry benchmarks, comparable titles, analyst reports | Mark as estimate |
| **Speculative** | Educated guesses based on patterns | Mark as hypothesis |

Confidence is always one of these tier names, never a percentage. Depth (quick / standard / deep) sets how many sources `game-researcher` collects (its STEP 3); which reports exist follows the focus areas chosen in `/game-analyze`.

### Report Quality Gates

Before a report is considered complete:
- A row, metric, or section the sources do not support is deleted — not filled with "N/A" or a guess. What could not be found is listed once at the end of the report — under its Sources when it has that section.
- Each major claim cites a source; each number carries its tier.
- Insights, lessons, and "top N" lists hold as many items as the sources support, up to the number the template names; fewer is a valid answer.
- Lines and columns about our game — the framing in "Lessons for Our Game", "Our Opportunity", "Fit with Our Game", timing — are written only when `/game-analyze` passed a project context; without one, lessons are observations that transfer to any game, and the our-game lines are deleted.
- Cross-references to other reports where relevant.
- Template guidance in `<!-- -->` comments is not copied into the report.

## Cross-Game Comparison

When analyzing multiple games, generate a comparison matrix from each game's reports (`executive-summary.md`, `mechanics/overview.md`, `retention-analysis.md`, `marketing-analysis.md`, `market-position.md`, where they exist). A row no report supports is dropped; the "Our Opportunity" column is written only with a project context.

```markdown
## Comparison Matrix: [Game A] vs [Game B] vs [Game C]

| Dimension | Game A | Game B | Game C | Our Opportunity |
|-----------|--------|--------|--------|----------------|
| Core Loop Duration | X min | Y min | Z min | Target |
| D1 Retention | X% | Y% | Z% | Target |
| D30 Retention | X% | Y% | Z% | Target |
| ARPU | $X | $Y | $Z | Target |
| Session Length | X min | Y min | Z min | Target |
| Metacritic | X | Y | Z | Target |
| Community Size | X | Y | Z | Target |
```
