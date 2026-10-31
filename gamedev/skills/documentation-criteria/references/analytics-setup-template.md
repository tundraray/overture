# [Project Name] — Analytics Setup

<!--
Follow `documentation-criteria`, "Writing for the Reader": header and Snapshot first, delete what does not apply.
Targets the GDD sets under Success Metrics are cited from it, not repeated. Implementation order belongs to the work plan.
Text inside these comments is guidance for the author; it is not copied into the document.
-->

**Date**: YYYY-MM-DD · **Engine**: [engine] · **Platform**: [platforms] · **GDD**: [path]

## Snapshot

<!-- At most ten lines. -->

**Overview.** [three to five plain sentences — the questions the game's data must answer, what is collected to answer them, and where it goes]

- **Biggest risk**: [one line, e.g. a privacy constraint or a missing SDK]
- **Open questions**: [a link to Open Questions, or "none"]

## Metrics

<!-- One row per metric the team will act on. "Alert when" is the value that makes someone look. -->

| Metric | What it measures | Target | Alert when |
|---|---|---|---|
| Day-1 retention | share of new players who return the next day | [GDD Success Metrics] | [below X%] |
| Crash rate | share of sessions that end in a crash | [GDD Success Metrics] | [> 2%] |

## Telemetry Events

<!-- One row per event. Parameters are named in words; the event schema is written at implementation. -->

| Event | Fires when | Parameters | How often |
|---|---|---|---|
| `game_start` | the player starts a session | session, player level, game mode | once per session |
| `level_complete` | the player finishes a level | level, time taken, score, deaths | per level |

## Experiments

<!-- Delete the section when no experiment is planned. -->

| Experiment | Question it answers | Variants | Decides on | Guardrail |
|---|---|---|---|---|
| [name] | [hypothesis, in a sentence] | [control and treatment] | [primary metric] | [metric that must not get worse] |

- **Significance**: [confidence level, minimum effect, minimum players per variant, duration]

## Engine Integration

- **SDK**: [analytics SDK, or custom]
- **Where events go**: [service or storage, and how they are sent]
- **Performance monitoring**: [profiling or crash-reporting tool]

## Privacy and Compliance

- **Collected**: [only what the metrics above need; no personally identifiable information]
- **Consent**: [how the player opts in and out]
- **Retention**: [how long data is kept]
- **Regulations**: [which apply — GDPR, CCPA, COPPA, store policies — and how each is met]

## Reporting

| Report | Reader | What it shows | How often |
|---|---|---|---|
| [dashboard / weekly report] | [team or role] | [the metrics and decisions it supports] | [real time / weekly] |

## Data Quality

- **Validation**: [how events are checked — schema, types, ranges, duplicates]
- **Freshness and completeness**: [the delay and coverage the reports can tolerate]

## Open Questions

<!-- Delete the section when none are open. -->

- **OQ-1**: [Question] — [who decides, what it blocks]
