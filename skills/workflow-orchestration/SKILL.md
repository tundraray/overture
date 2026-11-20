---
name: workflow-orchestration
description: This skill guides subagent coordination through implementation workflows. Automatically loaded when orchestrating multiple agents, managing workflow phases, determining autonomous execution mode, or when "orchestration", "workflow phases", "scale determination", "stop points", or "autonomous mode" are mentioned.
---

# Subagents Orchestration Guide

## Role: The Orchestrator

**The orchestrator coordinates subagents like a conductor—directing the musicians without playing the instruments.**

All investigation, analysis, and implementation work flows through specialized subagents.

### Automatic Responses

| Trigger | Action |
|---------|--------|
| New task | Invoke **requirement-analyzer** |
| Flow in progress | Take the next step from the current phase skill's flow (see "Workflow Phases") |
| Phase completion | Delegate to the appropriate subagent |
| Stop point reached | Wait for user approval |

### Session Start

Before the first action in a new session, load the project-context skill: it holds the project-specific constraints every later decision depends on.

## Requirement Change Detection During Flow

**During flow execution**, if detecting the following in user response, stop flow and go to requirement-analyzer:
- Mentions of new features/behaviors (additional operation methods, display on different screens, etc.)
- Additions of constraints/conditions (data volume limits, permission controls, etc.)
- Changes in technical requirements (processing methods, output format changes, etc.)

**If any one applies → Restart from requirement-analyzer with integrated requirements**

## Gamedev Substitutions

gamedev-overture ships the shared commands but not every shared agent or skill. When a shared command or skill runs there, read each name on the left as the one on the right:

| Shared | gamedev-overture |
|--------|------------------|
| `workflow-product` | `workflow-gamedev` |
| `prd-creator`; the PRD (`docs/features/{feature}/prd.md`, `doc_type: PRD`) | `mid-game-designer`; the feature spec (`docs/game-design/features/{feature}-spec.md`, `doc_type: FeatureSpec`), with the GDD as context |
| `ux-designer`; the UXRD | `game-ui-designer`; its UXRD |
| `work-planner` | `gamedev-work-planner` |
| `technical-designer-frontend` | `technical-designer`, with `ui-analyzer` for a `ui`, `hud`, or `menu` part |
| `task-executor-frontend`, `quality-fixer-frontend` | `task-executor`, `quality-fixer` |

`/reverse-engineer` is the one exception: no gamedev agent writes a feature spec from code, so on gamedev it skips its PRD phase and generates Design Docs against an existing feature spec.

## Orchestration Principles

### Task Assignment with Responsibility Separation

Assign work based on each subagent's responsibilities:

**What to delegate to task-executor**:
- One plan phase: implementation and test addition, test-first
- The unit tests it writes and those of the modules it touches, one typecheck of the touched package, and the phase's Operational Verification; the integration and e2e files it writes first run in the feature run
- Do not delegate quality assurance

**What to delegate to quality-fixer**:
- Quality assurance at the `scope` the orchestrator passes — `phase` (static checks plus the unit tests of the phase's changed files), `feature` (whole suite, integration, e2e, coverage); see `workflow-execution`, "Commit execution by strategy"
- Complete execution of quality error fixes
- Self-contained processing until fix completion
- Final approved judgment (only after fixes are complete)

## Constraints Between Subagents

### Subagent Nesting

A subagent can spawn subagents, up to three layers below the main conversation by default (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`). Which agents use that, and what they may spawn, is declared in each agent's own definition.

**Naming.** Plugin agents are registered as `<plugin>:<agent>`. Whether the bare name also resolves is not documented, and a failed spawn returns "Agent type not found" — an error an autonomous caller tends to absorb and move past without the result it needed. The examples in this repository write the bare name because the same agent file ships in several plugins; use the name as the `Agent` tool's available-agents list shows it, and treat "not found" as a reason to retry in the namespaced form, never as an answer.

**Depth.** The chain orchestrator → document owner → `code-explorer` stays within the default limit; a command run as a subagent rather than from the main conversation starts one level deeper.

What stays true regardless: subagents cannot coordinate with each other. There is no channel between siblings, and a result reaches a peer only by returning to whoever spawned them — so **sequencing remains the orchestrator's**, whatever an agent does internally to answer its own question.

### Delegation Boundary: What vs How

Pass **what to accomplish** and **where to work**. Each specialist determines **how to execute** autonomously. Prescribing the how discards the specialist's knowledge of the repository and turns a capable agent into a script runner.

**Pass to specialists** (what / where / constraints):
- Work plan path and phase number — executor agents (task-executor, task-executor-frontend); broader scope requires an explicit user request
- Target directory or package scope — discovery and review agents (code-verifier, code-reviewer, security-reviewer, integration-test-reviewer)
- Acceptance criteria and hard constraints from the user or design artifacts

**Let specialists determine** (how):
- Which commands to run — they discover these from project configuration and repo conventions
- Execution order and tool flags
- Executor/fixer agents: which files to inspect or modify within the given scope
- Review/discovery agents: which files to inspect within the given scope

| | Bad (prescribing how) | Good (passing what) |
|---|---|---|
| quality-fixer | "Run these checks: 1. lint 2. test" | "scope: phase. changedFiles: [filesModified and testsAdded of the phase's executor run]" |
| task-executor | "Edit file X and add handler Y" | "Work plan: docs/features/checkout/core/20260726-feature-checkout.md. Phase: 2." |

### Decision Precedence When Outputs Conflict

When two specialists disagree, or a specialist contradicts the orchestrator's expectation, resolve in this order:

1. **User instructions** — explicit requests or constraints
2. **Design artifacts** — Design Doc, PRD, work plan
3. **Objective repo state** — git status, file system, project configuration
4. **Specialist judgment**

Verify against objective repo state (3) rather than picking the more confident-sounding output. Follow specialist output when it aligns with (1) and (2); when it conflicts, user instructions win first, then design artifacts.

### Orchestrator Never Writes Directly

**All document and code operations MUST go through agents.**

The orchestrator coordinates using only these tools:

| Tool | Purpose |
|------|---------|
| Agent / Task | Invoke subagents |
| AskUserQuestion | User confirmations and questions |
| Bash | Shell operations (git commit, ls) |
| Read | Deliverable documents, for information bridging between subagents |

Edit, Write, and MultiEdit are performed by subagents, never by the orchestrator.

### File Ownership by Agent

| File Pattern | Owner Agent |
|--------------|-------------|
| `docs/features/*/prd.md` | prd-creator |
| `docs/features/*/uxrd.md` | ux-designer (gamedev: game-ui-designer) |
| `docs/design-system/**` (project design system) | ux-designer (gamedev: game-ui-designer) — created and extended through a UXRD |
| `docs/code-system/**` (project code system) | technical-designer(-frontend) — created by `/code-context` or a Design Doc, extended through a Design Doc |
| `docs/game-design/*.md` (GDD) | sr-game-designer (gamedev) |
| `docs/game-design/features/*-spec.md` (feature spec) | mid-game-designer (gamedev) |
| `docs/adr/*.md` | technical-designer(-frontend) |
| `docs/features/*/design-*.md` | technical-designer(-frontend) |
| `docs/features/*/*/*.md` (work plans) | work-planner (gamedev: gamedev-work-planner); executors may Edit progress checkboxes and a phase's Investigation Notes |
| `docs/features/{feature}/{part}/analysis/*.md` | task-executor(-frontend) — research deliverables |
| `src/**/*`, `tests/**/*` (code) | task-executor(-frontend) |
| Any file (quality fixes) | quality-fixer(-frontend) |

**Enforced by hook.** `hooks/document-guard.mjs` runs on every `Write`/`Edit` and reads `agent_type` from the hook input:

| Role | Write | Edit |
|------|-------|------|
| Owning agent | allowed | allowed |
| Progress updater (`task-executor`) | denied | allowed |
| Any other plugin agent | denied | denied |
| Main conversation (no `agent_type`) | denied | denied |

The Write/Edit split is the load-bearing part: a `Write` replaces the file, which is authorship, while an `Edit` is the targeted change an executor makes when ticking a progress checkbox in someone else's plan. The main conversation is denied, not asked: auto mode resolves an `ask` without the user. A fork is denied too — it reports `agent_type: "fork"`, not whose work it does — so an owner that splits its work spawns itself (`<plugin>:<agent>`), which the spawn check below allows.

Human documents change only through `Write`/`Edit`. A `Bash` or `PowerShell` command that writes one — `sed -i`, `perl -i`, a redirect, `tee`, `rm`, `mv`, `touch`, a copy destination, `git checkout`/`restore`/`clean`, `Set-Content`, `Remove-Item` — is denied for every caller, owner included, because a shell edit cannot be attributed to an owner. Work plans and a part's `analysis/` files are temporary and may be changed or deleted from the shell.

The same hook watches `Agent`/`Task` calls for one shape: **a document owner spawning a different document owner** is denied. The Write/Edit guard only sees who is knocking right now, so an owner blocked from a file it does not own could otherwise spawn that file's owner and have it write on the caller's behalf. A cross-owner handoff goes back to the orchestrator, which delegates to the owner explicitly. An owner spawning itself (fan-out) or a non-owning helper (`code-explorer`) passes.

Hooks load at session start, so a change to the guard takes effect only after restarting Claude Code — `/reload-plugins` does not pick it up.

**Rules**:
- Create/edit files only through the owner agent
- For revisions after review: call owner agent with `mode: update`
- When document-reviewer returns anything but `approved`: use `revision_agent` field to identify owner; what goes to the owner is set by "Revision Loop"

## Explicit Stop Points

Autonomous execution MUST stop and wait for user input at these points.
**Use AskUserQuestion tool** to present confirmations and questions in a structured format.

| Phase | Stop Point | Once per | User Action Required |
|-------|------------|----------|---------------------|
| Product | After requirement-analyzer completes | feature | Confirm requirements and scale / answer questions |
| Product | After prd-creator returns the PRD (with its draft check) | feature | Approve PRD, including the Delivery Parts split — every scale |
| Product | After ux-designer (gamedev: game-ui-designer) returns the UXRD (with its draft check; frontend/UI work) | feature | Approve UXRD, with the design-system files it created or changed |
| Technical | After design-sync completes consistency verification | part | Approve that part's Design Doc, with the code-system files it created or changed |
| Technical | After technical-designer(-frontend) returns the ADR (with its draft check; only when an ADR was written) | ADR | Approve ADR |
| Execution | After the planner returns the work plan (with its draft check; small scale and gamedev Prototype: the simplified plan, which is not reviewed) | part | Batch approval for that part's implementation |

**At a document stop** the orchestrator shows the document path, the draft-check verdict — approved, approved with open items, `skipped` (no draft check ran on this revision) or `not_run` — and the author's `draftCheck.open` items in plain words, and asks: approve, request changes (one owner pass in `mode: update` with the user's instruction verbatim, then the same stop), or independent review — a cold `document-reviewer` run, after which "Revision Loop" applies. No option is preselected; independent review is marked recommended only when `draftCheck.verdict` is `not_run`. `design-sync` before the Design Doc stop stays automatic.

**After batch approval**: Autonomous execution proceeds without stops until the current part's completion report or an escalation. The next part begins with its own plan and batch approval. `/build` and `/front-build` started on their own take the batch approval as their first question; a plan already approved in this session is not asked again.

## Scale Determination and Document Requirements
| Scale | Typical file count※5 | PRD | UXRD | ADR | Design Doc | Work Plan |
|-------|------------|-----|------|-----|------------|-----------|
| Small | 1-2 | **Required**, lite※1 | Not needed | Not needed | Not needed | Simplified, one part |
| Medium | 3-5 | **Required**, lite※1 | Conditional※4 | Rare※2 | **Required**, per part | **Required**, per part |
| Large | 6+ | **Required**, full※3 | Conditional※4 | Rare※2 | **Required**, per part | **Required**, per part |

※1: Lite depth — see `documentation-criteria`, "PRD depth"; an existing PRD is updated at its own depth
※2: Only after the Design Doc, when a decision it made passes the three-part test in `documentation-criteria`; most features produce none
※3: New creation/update existing/reverse PRD (when no existing PRD)
※4: When frontend/UI work is involved - UX Requirement Documentation for interaction patterns, accessibility, visual specs
※5: File count is the typical range, not the rule. Scale comes from `task-analyzer`'s 5-axis assessment (files, observable outcomes, contracts/data, boundaries, decision risk) — the highest scale any axis triggers wins. A 2-file breaking contract change routes as Large.

## How to Call Subagents

### Reviewers Are Cold Readers

A reviewer call (`document-reviewer`, `design-sync`, `code-verifier`, `code-reviewer`, `security-reviewer`, `integration-test-reviewer`) carries the artifact's **coordinates and nothing else**: the document path (or directory scope), its `doc_type` / `mode`, and on a re-review `review_scope: changes`, the `diff_base` (a git ref, or a copy of the reviewed version — a coordinate, not an account of the change), and the previous verdict's `issues` list verbatim so resolution can be checked.

Never passed to a reviewer:
- the author agent's `summary` or rationale for what it wrote
- another reviewer's findings (each reviewer forms its own verdict; the orchestrator merges afterwards)
- the orchestrator's own opinion of the document, or what it expects the verdict to be
- a `SendMessage` resume of an earlier reviewer run — every review is a fresh `Agent` call

A reviewer that is told what changed and why reviews the explanation instead of the document. The document on disk is the only thing under review.

One exception: when a document is reviewed against existing code (`reverse-engineer`, `front-reverse-design`, `update-doc`), `code-verifier`'s discrepancy list is passed to `document-reviewer` as evidence. It reports facts about the code, not a verdict on the document, and the reviewer still forms its own verdict.

### Call Example (document-reviewer, re-review)
- subagent_type: "document-reviewer"
- description: "Design Doc re-review"
- prompt: "target: docs/features/[feature]/design-[part].md. doc_type: DesignDoc. review_scope: changes. diff_base: [git ref the first review read, or the copy of that version]. Prior issues (verbatim from the previous verdict): [issues JSON]"

### Revision Loop

Shared by every phase, for the reviews the orchestrator runs: an independent review the user picked at a document stop (PRD, GDD, Feature Spec, UXRD with its design-system files, Design Doc with its code-system files, ADR, work plan), and the review round over a set one change touched (below). The author's draft check is not part of this loop. A loop converges only when each round is narrower than the last: a fresh full read after every fix always finds something new, so the loop is bounded by rounds and by scope, never by waiting for a clean report.

**What each verdict sends to the owner** (`revision_agent`, `mode: update`; a pass a re-review follows carries `draft_check: skip`, since the re-review is the check):

| Verdict | Owner pass | Re-review |
|---|---|---|
| `approved` | none | none |
| `approved_with_conditions` | the `critical` and `important` issues only | yes, `review_scope: changes` |
| `needs_revision` | the `critical` and `important` issues only | yes, `review_scope: changes` |
| `rejected` | none — straight to the user | — |

The reviewer's `deferred` list never goes to the owner on the orchestrator's initiative. It is shown at the gate's stop point as one short list, and the user picks which to apply: one owner pass, no re-review unless the user asks for one.

**Round cap.** At most two reviews per document per gate: the first review and one re-review. A re-review that is not `approved` stops the loop. Put it to the user via `AskUserQuestion` with the outstanding issues in plain words and three options:
- **Revise again** — one more owner pass with the user's instruction passed verbatim, then one more re-review
- **Accept as is** — the owner records the accepted finding and the user's rationale in the document's Update History (`mode: update`; an ADR has none and records nothing), and the gate advances
- **Abort** — hold at the current document

**Keep the reviewed version.** Documents are usually uncommitted while under review, so before sending one to its owner the orchestrator copies it to the session scratchpad; that copy is the re-review's `diff_base`.

**Re-review scope.** A re-review checks the prior issues and the changed text (`document-reviewer` Step 2b); it does not read the whole document cold again.

**One change, one round across documents.** When one decision changes several documents — a user answer at a stop, an escalation during implementation — every affected owner updates its document first, in dependency order (PRD → UXRD + design system → Design Docs + code system → ADR → work plan), with `draft_check: skip` in its prompt. Then one review round runs over the set: one `document-reviewer` call per changed document with `review_scope: changes`, in parallel, plus one `design-sync` when a Design Doc changed. The user approves the set at one stop. A document is not re-reviewed because a neighbour changed; a neighbour's change reaches it only through the update step.

The orchestrator never accepts a reviewer finding on its own authority, and never edits the document to make a finding go away. An author's `draftCheck.open` items are findings too: they go to the user at the stop, never dropped. Only the user's explicit accept advances a gate past an open finding.

## Structured Response Specification

Each subagent replies in JSON. A reply carries the status, the paths written, and what the orchestrator must decide. An agent that writes files returns their paths, and the next agent is handed the path. An agent that cannot write (the reviewers, verifiers and analyzers) returns only the findings the flow acts on, and the orchestrator forwards them as returned, without retyping or restructuring them. An author that runs a draft check (`documentation-criteria`, "Draft Check") also returns `draftCheck` (`verdict`, `fixed`, `open`). The fields the flow keys on:
- **requirement-analyzer**: status, scale, scaleRationale.decidingAxis, confidence, parts, requiredDocuments, scopeDependencies, questions
- **document authors** (prd-creator, ux-designer, technical-designer(-frontend), the planner): status, documents[].path, draftCheck, openQuestions
- **task-executor**: status, filesModified, testsAdded, requiresTestReview
- **quality-fixer**: status, approved, incompleteImplementations
- **document-reviewer**: status, revision_agent, issues
- **design-sync**: syncStatus, conflicts (with revision_agent)
- **integration-test-reviewer**: status, requiredFixes
- **code-verifier**, **code-reviewer**, **security-reviewer**, **test-auditor**: the verdict `workflow-execution`, "Post-Implementation Verification", reads, and the findings a fix acts on

## Handling Requirement Changes

### Handling Requirement Changes in requirement-analyzer
requirement-analyzer follows the "completely self-contained" principle and processes requirement changes as new input.

#### How to Integrate Requirements

**Important**: To maximize accuracy, integrate requirements as complete sentences, including all contextual information communicated by the user.

```yaml
Integration example:
  Initial: "I want to create user management functionality"
  Addition: "Permission management is also needed"
  Result: "I want to create user management functionality. Permission management is also needed.

          Initial requirement: I want to create user management functionality
          Additional requirement: Permission management is also needed"
```

### Update Mode for Document Generation Agents
Document generation agents (work-planner, technical-designer, technical-designer-frontend, prd-creator, ux-designer) can update existing documents in `update` mode.

- **Initial creation**: Create new document in create (default) mode
- **On requirement change**: Edit existing document and add history in update mode

Criteria for timing when to call each agent:
- **work-planner**: Request structural updates only before execution
- **technical-designer(-frontend)**: Request updates according to design changes → the designer's draft check covers a change to a requirement, a decision, or a contract; any other revision returns `draftCheck.verdict: "skipped"`, which is normal
- **prd-creator**: Request updates according to requirement changes → the author's draft check covers the change, on the same condition
- **ux-designer**: Request updates according to UX/UI requirement changes → the author's draft check covers the change, on the same condition
- **document-reviewer**: Run by the author as its draft check (`documentation-criteria`, "Draft Check"); by the orchestrator only when the user picks independent review at the stop, and in the review round over a set one change touched

## Workflow Phases

This skill holds the mechanics shared by every phase. The phases themselves live in their own skills, so a change to one does not drag the others along:

| Phase | Skill | Answers | Ends at |
|-------|-------|---------|---------|
| Product | `workflow-product` | What to build and why | UXRD approval |
| Technical | `workflow-technical` | How to build it | Design Doc approval |
| Execution | `workflow-execution` | Scheduling it, then doing it | Completion report |

Planning belongs to execution, not to technical design: a plan is a schedule for doing the work rather than a statement of what the work is, and batch approval — the authority boundary — gates the plan.

Game development substitutes its own product phase — GDD, market analysis, scenario routing — via `workflow-gamedev`, and reuses `workflow-technical` unchanged.

**Load the phase skill for the phase you are in.** This skill answers "how do I invoke and coordinate agents"; the phase skills answer "which agent, and when".

## Autonomous Execution Mode

Everything after batch approval — entry conditions, the phase cycle, commit strategies and quality-fixer scopes, post-implementation verification, the feature run, final cleanup, and auto-stop triggers — is governed by `workflow-execution`.

Load `${CLAUDE_PLUGIN_ROOT}/skills/workflow-execution/SKILL.md` before entering autonomous mode.

## Main Orchestrator Roles

1. **State Management**: Grasp current phase, each subagent's state, and next action
2. **Handoffs**: Pass the next agent the paths the previous one returned; when requirements change, integrate the initial and additional requirements explicitly
3. **Quality Assurance and Commit Execution**: After `approved: true` at a commit point of the chosen strategy, execute git commit
4. **Autonomous Execution Mode Management**: Start/stop autonomous execution after approval, escalation decisions

## Required Dialogue Points with Humans

### Basic Principles
- **Stopping is mandatory**: Always wait for human response at the following timings
- **Confirmation → Agreement cycle**: After document generation, proceed to next step after agreement or fix instructions in update mode
- **Specific questions**: Make decisions easy with options (A/B/C) or comparison tables
