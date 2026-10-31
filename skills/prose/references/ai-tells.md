# AI-writing tells

Patterns that mark prose as machine-written. A human reads them as filler and stops trusting the text around them. Each pattern has a stable code, `R1`–`R25`; a finding cites the code.

Most tells are structural and work the same in any language. Where a tell is a word list, the Russian equivalents follow the English ones: a Russian document is checked against the Russian list, not the English one.

**Scope**: narrative prose only (SKILL.md, Applicability).

## 1. Vocabulary tics

**R1**: over-used AI vocabulary.

- **English**: delve, tapestry, realm, landscape (figurative), navigate (figurative), testament to, stands as, plays a pivotal / crucial / key role, underscores, showcase, boasts, holistic, nuanced, multifaceted, ever-evolving, fast-paced, in today's world, seamless, leverage.
- **Russian**: играет ключевую / важную роль, является ключевым, неотъемлемая часть, комплексный подход, бесшовный, всесторонний, в современном мире, на сегодняшний день, данный (in the sense of «этот»), осуществляет, обеспечивает (when nothing concrete is provided), позволяет (as a filler verb: «позволяет обеспечить»), представляет собой.

Fancy borrowings go under `T5`, marketing adjectives under `P2`, intro filler under `P1`; their word lists are in [sentence-craft.md](sentence-craft.md).

## 2. Structural tells

- **R2 Rule of three**: a triad picked for rhythm: "fast, reliable, and scalable"; «быстро, надёжно и удобно». Three items the facts supply are a count, not a tell.
- **R3 Synonym cycling**: the same thing renamed every sentence to avoid repetition: "the service" → "the platform" → "the solution"; «сервис» → «модуль» → «решение». Pick one name and keep it.
- **R4 Bold-label micro-headers**: "**Performance:** It is fast. **Security:** It is safe." where a sentence or a real table serves better. A term-definition list (a Terms list, a glossary) is not this tell.
- **R5 Dash splice**: an em dash used to bolt a second clause or an aside onto a sentence, or to stage a pause: "The cache is warm — and that changes everything." Replace it with a comma, a colon, a full stop, or parentheses. Allowed: a dash inside a table cell, and the dash after a bold term in a definition bullet. In Russian, the dash that grammar requires (between subject and predicate nouns, «Беседа — это список сообщений»; in place of an omitted verb) is punctuation, not this tell; the splice and the staged pause are the tell in Russian too.
- **R6 Identical section shape**: every section the same length and structure, as if stamped from one mould.

### Rhetorical scaffolding

- **R7 Antithesis**: a sentence built on an opposition for cadence, where the contrast carries no information: "This isn't about speed, it's about trust"; «Дело не в скорости, а в доверии».
- **R8 Corrective negation**: asserting by first denying a strawman: "not X, but Y", "X isn't just Y, it's Z"; «не просто X, а Y», «это не X — это Y». State the claim once, positively.
- **R9 Negative parallelism**: a run of "no …, no …, no …"; «никаких …, никаких …».
- **R10 Negative anaphora**: consecutive sentences opening with the same negation: "It does not cache. It does not retry."; «Он не кэширует. Он не повторяет».
- **R11 Repeated frame**: two or more back-to-back sentences built on one syntactic frame. Parallel construction inside one sentence is correct (`T1`); the tell is the frame repeated across sentences.
- **R12 Parataxis**: a run of short flat clauses with no subordination: "The job starts. The queue fills. The worker dies." It is what a careless `T1` split leaves behind; fix it by subordinating one half or folding the fragment into its neighbour.
- **R13 Paragraph pinning**: a paragraph that opens and closes on the same phrase or idea.
- **R14 Throat-clearing opener**: a first sentence that announces the topic before saying anything: "This section describes …"; «В данном разделе рассматривается …». Delete it; the heading already says it.
- **R15 Summary beat**: a closing sentence that restates the paragraph: "In short, …"; «Таким образом, …», «Итак, …».
- **R16 Landing sentence**: a short final line placed for effect: "That is the whole trick."; «В этом и весь секрет».
- **R17 Stacked nouns**: three or more nouns chained into one modifier block: "customer onboarding data validation flow". In Russian the same tell is a genitive chain: «процесс проверки корректности данных запроса пользователя». Unpack it into a verb: «сервис проверяет, что пользователь прислал корректные данные».

Already covered elsewhere: hedges and intensifiers at `P3`, nominalisation at `T4`, corporate verbs at `T5`, an over-long sentence at `T1`.

## 3. Tone tells

- **R18 Sycophancy**: "Great question!", "You're absolutely right"; «Отличный вопрос!».
- **R19 Hollow conclusion**: "In conclusion, X is a powerful tool that helps you achieve your goals"; «В заключение, X является мощным инструментом …». It says nothing; cut it.
- **R20 Undue significance**: "This is a crucial step toward …"; «Это важнейший шаг на пути к …».
- **R21 Hedging overload**: "may", "might", "could potentially", "in some cases" stacked until nothing is asserted; «может», «возможно», «в ряде случаев», «как правило» stacked the same way.
- **R22 Collaborative filler**: "Let's explore", "Let's dive in"; «Давайте рассмотрим», «Разберёмся».

## 4. Tooling leakage

**R23**: the machinery that produced the document shows in its prose: an agent name as the subject, a raw field or mode quoted verbatim, a slash command, a reviewer's finding ID.

| Bad | Good |
|---|---|
| `` `requirement-analyzer` returned `scale: large` `` | the feature is large: it changes three containers |
| as `code-explorer` found | the search found, or simply state the fact |
| fixed per review finding I003 | (state the current design; history goes to Update History) |
| run `/update-doc` to change this | (delete: the document describes the system, not the workflow) |

## 5. Written-surface tells

- **R24 Provenance narration**: a phrase about how the document was made rather than about the system: "as built", "restored", "kept from the original", "omitted on purpose", "now also"; «как было сделано», «восстановлено», «теперь также», «по итогам ревью». Delete it; `documentation-criteria` "Current truth only" says where history goes.
- **R25 Section sign**: a section is cited by the word and its number or heading (`section 5`, `раздел 5`, "Data Model"), never by the sign §: it is on no keyboard, and nobody greps for it.

## Quick detection checklist

- Could the subject be swapped for almost any noun and the sentence still work? → `R1` / `P2`: it says nothing.
- A triplet filling rhythm rather than counting facts? → `R2`.
- One concept, three names on one screen? → `R3`.
- Bold-colon micro-headers where a sentence fits? → `R4`.
- "Robust", «надёжный», «эффективный» with no number behind it? → `P2`.
- A dash bolting on a clause or staging a pause? → `R5`.
- Two adjacent sentences on one frame, or "not X, but Y" / «не X, а Y»? → `R11` / `R8`.
- A run of flat clauses left by a split? → `R12`.
- Does the last sentence add a fact, or only land a beat? → `R15` / `R16`.
- A genitive chain of three or more nouns? → `R17`.
- An agent, field, command, or finding ID in the prose? → `R23`.
- A phrase about how the document was made? → `R24`.
