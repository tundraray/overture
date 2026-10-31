# Handoff: [what is handed over] — [from] → [to]

<!--
A handoff lets the receiver start without asking the sender anything. It cites the documents it hands over by path and ID and never restates them.
Follow `documentation-criteria`, "Writing for the Reader". Text inside these comments is guidance for the author; it is not copied into the document.
-->

**Date**: YYYY-MM-DD · **From**: [sending agent or person] · **To**: [receiving agent or person] · **Phase**: [market analysis / design / development / polish]

## Snapshot

<!-- At most ten lines. -->

**Overview.** [three to five plain sentences — what was done, what state it is in, and what the receiver does first]

- **Biggest risk**: [one line, or "none above low"]
- **Open issues**: [a link to Open Issues, or "none"]

## What Is Handed Over

| Document | Path | What the receiver uses it for |
|---|---|---|
| [GDD / feature spec / design doc / asset set] | [path] | [one phrase] |

## What the Receiver Must Respect

<!-- The requirements and constraints that bind the next step, each cited by ID from the document that owns it. -->

- [requirement or constraint, in a sentence] ([document] [ID])

## Decisions Already Made

<!-- Only the decisions the receiver might otherwise reopen, with the reason. A decision recorded in a Key Decisions table or an ADR is cited, not retold. -->

- [decision] — [why]

## Open Issues

<!-- Delete the section when none are open. -->

- **[Issue]**: [what it blocks] — [who resolves it]

## Risks

| Risk | Impact | Mitigation |
|---|---|---|
| [risk] | High / Medium / Low | [what is done about it] |

## First Steps for the Receiver

1. [first action]
2. [second action]
