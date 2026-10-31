---
name: prose
description: This skill governs how a PRD, UXRD, design system, Design Doc, ADR, GDD, or Feature Spec reads — the whole document read top to bottom as its reader meets it, then the sentence-level pass: cutting noise, plain sentences (P1–P5, T1–T5), the R-coded catalogue of AI-writing tells, canonical technical terms in non-English prose, and asking instead of guessing. Automatically loaded when writing, revising, or reviewing a document's prose, or when "tighten this", "make this clearer", "reads like a robot", "de-jargon", "канцелярит", "читается как робот", "сделай понятнее", or "AI tells" are mentioned.
---

# Prose

`documentation-criteria` "Writing for the Reader" decides what a document says and in what order: the cold reader, the Snapshot, current truth only, short units, sentences rather than telegrams, terms, one language, words before IDs. This skill decides how it reads: whether a person can read it through and get what they came for, and how each sentence reads on the way. It restates none of those rules; where a check depends on one, it cites it.

## Applicability

- **Applies to** narrative prose: the sentences that explain what the system does and why, in any document language.
- **Never edited**: tables' identifiers, diagrams, code, IDs, file paths, quoted text, UI strings owned by a UXRD or design system.
- **Instruction text is exempt**: rules, checklists, and gate wording inside prompts and templates, and the labels a template prescribes (bold item labels such as **Authentication & Authorization**). A negative rule (`never X`) is a specification, not a voice problem.
- **Not applied to temporary AI working files** — work plans, task files, `_overview.md` (`documentation-criteria`).

## 1. The editing pass

The pass starts and ends with the whole document as its reader meets it (1.0). In between, sentences are edited until they clear the exit checks (1.3) and no `R1`–`R25` tell from [references/ai-tells.md](references/ai-tells.md) survives. Clean sentences in a document nobody can read through are still a failed pass.

### 1.0 Read it as its reader

A document is a product, and its user is the person who opens it. Before editing a sentence, and again when done, read the whole document top to bottom as that person: without the conversation that produced it, without opening the code, in the document's language.

| Document | Who opens it | What they came for |
|---|---|---|
| PRD, Feature Spec, GDD | the user at an approval stop, a product owner | is this what we want to build, and what is left out |
| UXRD, design system | a designer, the frontend implementer | what the user sees and does, screen by screen |
| Design Doc | a reviewer, the implementer months later | how the part works and why it is built this way |
| ADR | an engineer who meets the decision later | what was chosen, against what, and why |

Mark every place where that reader stalls:

- they must skip a block to keep going, or read it twice to understand it;
- a name, term, or ID arrives before it is explained (`documentation-criteria` "Terms", "Words before IDs");
- they must open another document or the code to understand this sentence, rather than to go deeper;
- a table or diagram cannot be read without the prose, or the prose only retells the diagram;
- the same thing is said twice, or two sections disagree;
- they reach the end and cannot say what they came for.

A stall is a finding at the place it happens. The fix is usually a cut or a move, not an added sentence. A stall caused by structure (order, a misplaced section, a missing diagram) is reported per 1.5, not patched in prose. The rules each stall breaks live in `documentation-criteria` "Writing for the Reader"; cite them by name.

### 1.1 Cut

- Read the whole passage first, then cut.
- Remove AI tells per [references/ai-tells.md](references/ai-tells.md); every finding names its `R`-code.
- Apply `P1`–`P5` (section 3.1); the word lists and techniques are in [references/sentence-craft.md](references/sentence-craft.md).
- The cut's output feeds 1.2: a span the cut left ambiguous is restated there.

### 1.2 Unambiguity

- A span the cut left ambiguous or ungrammatical is restated with `T1`–`T5` (section 3.2).
- Every pronoun and demonstrative ("it", "this", «он», «это», «данный») resolves to something named in the same sentence or the one before. No antecedent anywhere in the document → section 4.2.

### 1.3 Exit checks

Count these on the edited text; nothing else gates the pass.

- [ ] Every sentence carries one assertion and stays within the `T1` ceiling.
- [ ] Every sentence with an actor names it as the subject, in the active voice (`T2`).
- [ ] Every paragraph covers one topic and opens on it (`T3`).
- [ ] No sentence carries three or more words the vocabulary lists with a plain equivalent (`T5`).
- [ ] No adjective the reader cannot check against a fact in the document (`P2`).
- [ ] Zero surviving `R1`–`R25` tells.
- [ ] Run last, on the whole document: the reader from 1.0 reads it top to bottom without a stall and leaves with what they came for. A section that reads clean alone still fails when the document around it strands the reader.

### 1.4 Edit unit

The rewritten span is the smallest one that carries the defect: a clause, a sentence, or a list row. A defect that crosses sentence boundaries (a referent chain, a paragraph's opening, one frame repeated across sentences) makes the whole paragraph the unit.

### 1.5 Output

- **Writing or revising a document**: the edited text is the output; no defect list unless asked.
- **Reviewing**: one finding per failing span, in the calling agent's own output contract: the problem in one line, the code (`R7`, `T2`, `P2`), and the corrected span at 1.4 granularity. The caller's contract sets severity.
- **Both**: unclear text goes out as a separate question (section 4.2). A structural problem (a flow narrated instead of drawn, code threaded through prose, a section in the wrong place) is reported, never silently fixed while editing sentences.

## 2. Canonical terms

A term that names a real artifact is reproduced character for character in prose of any language. Such terms include identifiers, type, class, and function names, service and package names, enum values, feature-flag and setting names, file paths, section anchors, ID shapes (`AC-03.1`, `KD-2`, `UC-E1`), and tool and product names.

- **Banned on such a term**: translation, transliteration, inflection to fit the sentence (case endings, plurals), re-casing, a changed hyphen, an acronym expanded in its place, a paraphrase.
- **Non-English prose**: the sentence bends around the term, never the term around the sentence. When the grammar needs an inflected form, add a generic head noun that takes the ending and keep the term as an appendix to it: «в сервисе `ThreadsService`», «у поля `deletedAt`», not «в ThreadsService'е», «тредсервис», «у deletedAt'а».
- **First use**: the term plus a short gloss in the document's language (`documentation-criteria` "Terms"); later mentions use the bare term. A gloss never replaces the term.
- **Not sure whether a term is canonical**: treat it as canonical and copy it as found in the source.
- **One name per concept**: a concept keeps the one name it was given (`R3`).

`documentation-criteria` "One language" decides which language the document is written in; this section only protects the terms inside it.

## 3. Rule sets

`P1`–`P5` cut what is wrong; `T1`–`T5` give the surviving text its shape. When a `T`-rule and the cold-reader test conflict, comprehension wins: keep the clause the reader needs and split the sentence.

### 3.1 P1–P5: cut the noise

| # | Rule |
|---|---|
| **P1** | **Every word tells.** No unnecessary word in a sentence, no unnecessary sentence in a paragraph. Filler, throat-clearing, and contextual redundancy go. |
| **P2** | **Facts, not evaluations.** An adjective the reader cannot verify ("robust", «надёжный», «эффективный») is replaced by the fact that earns it, or deleted. |
| **P3** | **No qualifiers or hedges.** Intensifiers and hedges add length and no force. Genuine uncertainty is an open question, never hedging prose. |
| **P4** | **Explain the new through the known.** Anchor an unfamiliar concept to one the reader already holds; chain reasoning step by step. |
| **P5** | **The shorter version ships.** Of two versions that state the same facts and both pass 1.3, the one with fewer words is the output. |

### 3.2 T1–T5: plain sentences

| # | Rule |
|---|---|
| **T1** | **One assertion per sentence**, about 25 words or fewer (Russian, which runs longer per thought, about 20). Over the ceiling → subordinate one half to the other, or fold the fragment into its neighbour; never chop it into a run of flat clauses (`R12`). |
| **T2** | **Active voice, named actor.** The thing that acts is the grammatical subject: "the api rejects the request", not "the request is rejected"; «сервис отклоняет запрос», not «запрос отклоняется» or «производится отклонение запроса». |
| **T3** | **One topic per paragraph.** The paragraph opens on its topic sentence; the close adds a fact rather than restating the opening (`R15`). |
| **T4** | **Concrete noun, action verb.** "deletes the thread after the runs stop", not "handles thread removal"; «удаляет беседу», not «осуществляет удаление беседы». A verbal noun that names a thing or a term of art stays. |
| **T5** | **Plain words.** A word with a plain equivalent in the vocabulary is replaced by it. Three such words in one sentence → rewrite the sentence. |

## 4. Standing rules

### 4.1 Reproduce what the source states

- Citations, IDs, and paths are copied exactly as the source states them. A citation that contradicts the surrounding text is raised as a question naming both readings; it is not corrected on a guess.
- Meaning is preserved exactly: no load-bearing fact is added or dropped.
- A passage that is already clear and lean is left alone.

### 4.2 Unclear text: ask, don't guess

Triggers: a referent with no antecedent, an undefined term, an unparseable claim, an implied but absent fact ("much faster" with no baseline), a contradiction.

- Name what is unclear and ask the specific question: `Data Model ¶2 — "the consumer retries" — which consumer?`
- Writing in the main conversation → ask the user. Reviewing as a subagent → return the question as an issue at the unclear span, its suggestion naming what must be answered.
- Never close by guessing.

### 4.3 Where each document leans

The rules apply to every document; only the hardest-pulled lever changes.

| Document | Lean on |
|---|---|
| PRD, Feature Spec, GDD | puffery and evaluations (`P2`, `R1`, `R20`): replace with the observable outcome |
| UXRD, design system | concrete user-visible behaviour (`T4`): what the user sees and does, not what the interface "supports" |
| Design Doc, ADR | bureaucratese and nominalisations (`T4`, `T5`); keep the terminology exact (section 2) |

### 4.4 Rendering-safe markup

- A `<placeholder>` is wrapped in backticks, or Markdown swallows it.
- A comparison operator gets a space: `< 500 ms`.
- Renderable content (tables, links, lists) is never wrapped in a code fence.
