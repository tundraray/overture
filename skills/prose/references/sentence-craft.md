# Sentence craft: the techniques behind P1–P5 and T1–T5

The rule text of each code is in SKILL.md section 3; this file holds the word lists, the techniques, and worked pairs. Canonical technical terms are out of scope here: a term that names a real artifact is never swapped for a plainer word (SKILL.md section 2).

## Vocabulary

### English: fancy → plain

| Fancy | Plain | Fancy | Plain | Fancy | Plain |
|---|---|---|---|---|---|
| utilize, leverage | use | facilitate | help | commence, initiate | start |
| terminate | end, stop | ascertain | find out | demonstrate | show |
| necessitate | need | in order to | to | due to the fact that | because |
| in the event that | if | at this point in time | now | with regard to | about |
| a number of | several | the vast majority of | most | prior to | before |
| subsequent to | after | has the ability to, is able to | can | make a decision | decide |
| perform a validation of | validate | provide support for | support | functionality | feature, what it does |
| sufficient | enough | optimal | best | numerous | many |
| additionally | also | approximately | about | it is recommended that | should |

### Russian: канцелярит → plain

Russian bureaucratic style (канцелярит, after Нора Галь, «Слово живое и мёртвое») hides the actor and the action inside nouns. An English list does not catch it.

| Канцелярит | Plain | Канцелярит | Plain |
|---|---|---|---|
| осуществлять (проверку) | проверять | производить (запись) | записывать |
| является | — (тире) or «это»; often just drop it | данный | этот |
| в рамках | в, при, для | в случае если, в случае | если |
| с целью, в целях | чтобы, для | в связи с тем что | потому что |
| имеет возможность | может | на сегодняшний день, в настоящее время | сейчас, or delete |
| при помощи, посредством | с помощью, через | по причине | из-за |
| обеспечивать (выполнение) | выполнять | осуществляется (passive) | the active verb with its actor |
| в части | о, по | на предмет | на, для |
| ряд (+ род. п.) | несколько | функционал | функция, возможность |

## Word lists

| Kind | English | Russian | Action |
|---|---|---|---|
| Hollow intensifiers | very, quite, rather, really, actually, basically, essentially, simply, just, clearly, obviously, significantly (without a number) | очень, достаточно, довольно, весьма, крайне, по сути, фактически, в принципе, собственно, просто, явно, очевидно, значительно (без числа) | delete |
| Hedges | sort of, kind of, more or less, to some extent, in a sense | как бы, в какой-то мере, в определённом смысле, отчасти | delete; real uncertainty is an open question |
| Intro filler | it should be noted that, it is important to mention, as we all know, needless to say, interestingly | стоит отметить, важно отметить, следует подчеркнуть, как известно, необходимо отметить, интересно, что | delete |
| Time parasites | currently, as of today, going forward | на данный момент, в настоящее время, в дальнейшем | delete (the document states current truth) |
| Bureaucratese | the aforementioned, herein, pursuant to, in respect of | вышеуказанный, нижеследующий, вышеперечисленный, по линии | cut or name the thing |
| Marketing adjectives | robust, seamless, powerful, cutting-edge, best-in-class, scalable solution, flexible | надёжный, бесшовный, мощный, передовой, гибкий, масштабируемое решение, эффективный | replace with a fact (`P2`) or cut |
| Weasel words | various, several, certain, appropriate, relevant, a range of | различные, некоторые, определённые, соответствующий, ряд | name them or count them |
| Unfounded claims | increasingly, studies show, best practice dictates | всё чаще, как показывает практика, общепринятый подход | give the source or the number, or cut |
| Glue openers | firstly, furthermore, moreover, in addition, in conclusion | во-первых, кроме того, более того, помимо этого, в заключение | delete; the paragraph opens on its topic |
| Empty verbs | is responsible for, handles, deals with, provides | отвечает за, занимается, обеспечивает, производит | the verb that says what happens: rejects, stores, retries; отклоняет, хранит, повторяет |
| Euphemisms | experienced some challenges, suboptimal, an opportunity for improvement | возникли некоторые сложности, неоптимальный, есть потенциал для улучшения | name it: failed, too slow (+ number), a defect |

## P1: every word tells

- Intro filler and time parasites are deleted outright; nothing replaces them.
- Cut contextual redundancy: "in the codebase" inside a code document, "end result", "completely eliminate", «конечный результат», «полностью исключить».
- **Close synonyms in a list** are one idea in three coats: "slow, tedious, and time-consuming" → "slow" → better "two minutes per request".
- **Repetition**: a word used three times in a sentence, or twice within about fifteen words, is fixed by a pronoun or a restructure, never by cycling synonyms (`R3`).

## P2: facts, not evaluations

- "robust caching" → "the cache survives a restart; entries live 5 minutes"
- "significantly faster" → "p99 drops from 480 ms to 120 ms"
- «эффективная обработка ошибок» → «ошибка базы возвращает 503 и не теряет сообщение»
- **Substitution test**: if the subject can be swapped for almost anything and the sentence still sounds plausible, it says nothing.

## P3: no qualifiers or hedges

- Intensifiers and hedges are deleted.
- Genuine uncertainty becomes an open question with who resolves it (`documentation-criteria`, "Undecided stays an open question").
- Stacked modals are `R21`.

## T1: one assertion per sentence

- Fold a clause into its neighbour instead of standing it alone (this is the split `R12` requires).
- When the halves of "not only … but also …" or «как …, так и …» drift far apart, make two sentences.
- An opening participial phrase refers to the grammatical subject. In Russian, a деепричастный оборот must share the subject of the main verb: «Получив запрос, сервис проверяет его», never «Получив запрос, выполняется проверка».
- Keep related words together.

## T2: active voice, named actor

- Find the hidden actor: "a decision was made" → "we decided"; "the row is updated by the consumer" → "the consumer updates the row".
- Russian passives come in two forms, and both hide the actor: «запрос отклоняется», «производится отклонение запроса» → «api отклоняет запрос».
- The subject is something that acts: a person, a service, a component, never an abstraction ("the implementation of the process", «реализация процесса»).
- The document names no actor → use the one it names elsewhere, or ask (SKILL.md section 4.2); never invent one.

## T3: one topic per paragraph

- Name the topic in the opening sentence; the close adds a fact that opening set up.
- Delete glue openers; the paragraph opens on its own main idea.

## T4: concrete noun, action verb

- Verbal noun → verb: «осуществление проверки корректности» → «проверяет, что …». A noun that names a thing or a term of art stays (`migration`, «миграция» as the artifact).
- Empty verb → action verb.
- A chain of "which … that … where …" or «который … которая … где …» becomes two sentences, one subordinated to the other.
- State a claim positively; asserting it by denying a strawman is `R8`.

## T5: plain words

- A word with a plain equivalent in the vocabulary is replaced by it.
- Bureaucratese and канцелярит signal nothing: cut them, or use the plain form.

The paragraph as the unit of composition, the topic sentence with a conforming close, and parallel construction within one sentence come from Strunk, *The Elements of Style* (1918).

## Worked pairs

**AI-heavy → clean** (`R1`, `P2`, `T5`)
- Before: "In today's fast-paced environment, our robust and seamless solution leverages cutting-edge technology to deliver a holistic experience."
- After: "The api caches the thread list in memory, so the sidebar opens in 120 ms instead of 480 ms."

**Канцелярит → plain** (`T2`, `T4`, `T5`)
- Before: «В рамках данного решения осуществляется проверка принадлежности беседы пользователю с целью обеспечения безопасности доступа.»
- After: «Перед каждым запросом api проверяет, что беседа принадлежит пользователю.»

**Bureaucratese → plain** (`P1`, `T2`, `T5`)
- Before: "It should be noted that, pursuant to the aforementioned requirements, a decision was made to undertake the implementation of validation logic."
- After: "We added validation because the requirements need it."

**Evaluation → fact** (`P2`)
- Before: «Решение обеспечивает высокую надёжность и значительно повышает производительность.»
- After: «Сообщение пишется в той же транзакции, что и событие, поэтому падение процесса его не теряет; p95 ответа — 200 мс вместо 900.»

**Nominalisation → action** (`T4`, `T2`)
- Before: "The performance of a validation of the input is the responsibility of the gateway prior to the forwarding of the request."
- After: "The gateway validates the input before it forwards the request."

**Hedging → assertion** (`P3`, `T4`)
- Before: "It might be the case that the worker could potentially fail to process the event in some situations."
- After: "The worker drops the event when the payload has no `threadId`."

**Flat clause run → subordinated** (`R12`, `T1`)
- Before: «Сервис проверяет токен. Сервис загружает беседу. Сервис проверяет владельца. Сервис удаляет беседу.»
- After: «Сервис проверяет токен и загружает беседу. Если беседа принадлежит пользователю, сервис её удаляет.»

**Genitive chain → verb** (`R17`, `T4`)
- Before: «Обеспечение контроля соблюдения ограничений длины заголовка беседы.»
- After: «Api отклоняет заголовок длиннее предела из AC-04.2.»

**Glue openers → topic-led** (`T3`)
- Before: "The cache holds the session for 15 minutes. Furthermore, it evicts on logout. Additionally, a cold read falls through to Postgres."
- After: "The cache holds the session for 15 minutes, and a logout evicts it early. On a miss, the read falls through to Postgres."
