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
```

**Naming**: `{game-slug}` = lowercase, hyphenated game name (e.g., `hollow-knight`, `stardew-valley`, `clash-royale`)

## Analysis Framework

### Seven Pillars of Game Analysis

Each game should be analyzed across these dimensions:

| Pillar | Key Questions | Primary Agent |
|--------|--------------|---------------|
| **1. Core Loop** | What is the fundamental gameplay cycle? How long is one loop? What drives repetition? | sr-game-designer |
| **2. Progression** | How does the player advance? What are the unlock gates? What creates the "one more turn" feeling? | sr-game-designer |
| **3. Retention Mechanics** | What brings players back? Daily hooks? Social obligations? FOMO? Loss aversion? | data-scientist |
| **4. Monetization** | What is the revenue model? What are the conversion triggers? How does spending enhance experience? | market-analyst |
| **5. Technology** | What engine/framework? How do they handle performance? What are technical differentiators? | mechanics-developer |
| **6. Marketing & Community** | How was the game marketed? What communities exist? How is content distributed? | market-analyst |
| **7. Game Feel** | What makes the game "feel good"? Audio design, visual feedback, input responsiveness? | game-feel-developer |

### Retention Analysis Deep Dive

Special focus area — what keeps players engaged:

#### Short-Term Retention (D1-D7)
- First-time user experience (FTUE) quality
- Tutorial effectiveness
- Time-to-fun measurement
- Initial content variety
- Early reward pacing

#### Mid-Term Retention (D7-D30)
- Content depth discovery
- Social features activation
- Habit loop formation
- Difficulty curve management
- Second-session hooks

#### Long-Term Retention (D30+)
- Endgame content systems
- Community integration
- Competitive/cooperative hooks
- Content update cadence
- Sunk cost and identity investment

### Source Code Analysis (when available)

For open-source games or games with accessible source code:

| Analysis Area | What to Extract |
|--------------|----------------|
| **Architecture** | Module structure, dependency graph, entry points |
| **State Management** | How game state is stored, updated, persisted |
| **Event System** | Communication patterns, decoupling strategy |
| **Networking** | Client-server model, sync strategy, lag compensation |
| **Performance** | Object pooling, rendering pipeline, memory management |
| **AI Systems** | Decision trees, state machines, behavior patterns |
| **Content Pipeline** | How content is loaded, cached, hot-swapped |

## Quality Criteria for Research

### Data Quality Tiers

| Tier | Source Type | Confidence | Usage |
|------|-----------|------------|-------|
| **Verified** | Official developer data, store APIs, public financials | 90%+ | Direct citation |
| **Inferred** | Review aggregation, community data, tool analysis | 60-89% | Cite with confidence level |
| **Estimated** | Industry benchmarks, comparable titles, analyst reports | 30-59% | Mark as estimate |
| **Speculative** | Educated guesses based on patterns | <30% | Mark as hypothesis |

### Minimum Research Requirements

| Depth Level | Sources Required | Reports Generated | Estimated Duration |
|------------|-----------------|-------------------|-------------------|
| **Quick** | Store page + 3 reviews + 1 article | Executive Summary only | ~10 min |
| **Standard** | Store page + 10 reviews + 3 articles + community scan | All 8 reports | ~30 min |
| **Deep** | Standard + source code + gameplay analysis + developer interviews | All 8 reports + source code analysis | ~60 min |

### Report Quality Gates

Before a report is considered complete:
- [ ] All template sections filled or explicitly marked N/A with reason
- [ ] Data sources cited for each major claim
- [ ] Confidence level stated for numerical estimates
- [ ] At least 3 actionable insights per report
- [ ] Cross-references to other reports where relevant

## Cross-Game Comparison

When analyzing multiple games, generate a comparison matrix:

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
