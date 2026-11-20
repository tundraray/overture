import {patch} from './patchlib.mjs';
patch('skills/technical-design/SKILL.md',[
[` — each entry is disposed of in the template's "Appendix: Fact Disposition"; the evidence stays in the analyzer output.`,` — the existing behaviour the design starts from; the evidence stays in the analyzer output.`],
[`Carry \`code-explorer\` counts with their \`resolvedBy\`: an LSP-resolved consumer list`,`An LSP-resolved consumer list`],
[`## Contracts at Component Boundaries【Required】

Define what crosses each component boundary in Contract Definitions — each operation's input, output (sync or async), and the failures the caller handles; for a UI component its props, events, and state-management contracts and how errors surface — at the design's altitude (\`documentation-criteria\` "Writing for the Reader"), one item per operation or prop group, in sentences.`,
`## Contracts at the Part's Boundary【Required】

Define in Contract Definitions what crosses the part's boundary — to another part, the UI, an external system, or a store: each operation's input, output (sync or async), and the failures the caller handles; for a UI part, the calls it makes, how errors surface, and the props and events of a component other parts reuse. Exact where a caller relies on a value; what sits behind the boundary is the implementer's (\`documentation-criteria\` "Writing for the Reader"). One item per operation, in sentences.`],
[`| Identifiers exactly as in code (\`ThreadsService\`, \`GET /api/threads\`, \`THREAD_NOT_FOUND\`, \`useThreads\`, \`onRename\`) |`,`| Identifiers that exist in code or cross the part's boundary, spelled exactly (\`GET /api/threads\`, \`THREAD_NOT_FOUND\`, \`ThreadsService\`) |`],
[`| Mermaid diagrams; file paths in Appendix: Fact Disposition and in the text under a diagram |`,`| Mermaid diagrams; a link to existing code in the text under a diagram |`],
[`follows \`documentation-criteria\` "Revising a Document", and saves the draft check's \`diff_base\` before its first edit ("Draft Check", step 2). A reviewer's fix request is never a reason to add code: a contract question is answered by extending the contract or props description, a test question by adding or sharpening a use case.`,
`follows \`documentation-criteria\` "Revising a Document"; one that gets a draft check saves its \`diff_base\` before the first edit ("Draft Check", step 2). A reviewer's fix request is never a reason to add code or detail from behind the part's boundary.`],
[`On an update or revision it runs on the diff against the saved copy.`,`A revision gets one only when it alters a requirement, a decision, or a contract, and it runs on the diff against the saved copy.`],
[`- [ ] Every \`focusAreas\` entry is disposed of per the template's "Appendix: Fact Disposition"
`,``],
[`its options are every option the KD names, each pro, con and consequence traces to the Design Doc`,`its options are the ones the KD names, each reason and consequence traces to the Design Doc`],
[`- [ ] Identifiers are written exactly as they appear in code, character for character`,`- [ ] An identifier the document names exists in code or crosses the part's boundary, and is spelled exactly; a name for code not yet written is the implementer's`],
[`every acceptance criterion is named by a use case whose Given sets up that criterion's condition, or recorded as out of scope`,`every acceptance criterion is named by a use case, or recorded as out of scope`],
]);
patch('agents/technical-designer.md',[
[`| Failure handling in Runtime Flows |`,`| Runtime Flows |`],
[`For every new data structure, search for an existing one first and record reuse, extend, or new as a Key Decision, with the rejected options.`,`For a new data structure that is persisted or crosses the part's boundary, search for an existing one first; reuse, extend, or new is a Key Decision.`],
[`- [ ] Every operation a flow or component calls exists in the Contract Definitions of the component that offers it, with inputs, outputs, and error behaviour; every rule a field or counter is said to enforce is stated in the contract or in State Transitions and Invariants
- [ ] Each new maintenance-surface element (persistent state, data structure, boundary-crossing field, mode or flag, abstraction) is a Key Decision naming the smaller options rejected`,
`- [ ] Every operation a runtime flow shows crossing the part's boundary exists in the Contract Definitions of the part that offers it, with inputs, outputs, and error behaviour
- [ ] New persistent state and each new crossing of the part's boundary has its reason in a Key Decision; one decision may cover several`],
]);
patch('agents/technical-designer-frontend.md',[
[`| Key Decisions — \`reuse\` / \`extend\` / \`new\` is a finding, not a preference |`,`| Building-block Inventory — \`reuse\` / \`extend\` / \`new\` is a finding, not a preference |`],
[`| Failure handling in Runtime Flows |`,`| Runtime Flows |`],
[`designs the implementation (props, state, composition) instead`,`designs the implementation (composition, state, data) instead`],
[`- [ ] Every prop, event, and API call a component uses exists in the Contract Definitions of the component or part that offers it; an API call also with its error behaviour
- [ ] A new component is a Key Decision stating what was searched and why nothing existing fit
- [ ] Each new prop, variant, or mode is a Key Decision naming the smaller options rejected — a new prop is permanent surface`,
`- [ ] Every API call the part makes, and every prop or event of a component other parts reuse, exists in the Contract Definitions of the part that offers it; an API call also with its error behaviour
- [ ] A new prop, variant, or mode on a design-system component is a Key Decision — it is permanent surface for every screen that uses the component`],
]);
patch('agents/document-reviewer.md',[
[`anything less is not reported, because the author acts only on these two.`,`anything less is not reported, because the author acts only on these two. A document fixes what someone other than the implementer depends on (\`authoring-rules.md\`, "Fix what others depend on"): do not ask for detail below that line, and detail below it that the document does carry is a finding only when it contradicts a contract.`],
[`- [ ] Snapshot and Key Decisions at the top, each decision and its rejected alternatives argued only there and cited by \`KD-n\` elsewhere
- [ ] Part section states which part this design covers, the requirements it owns, and the \`design-{part}.md\` files it depends on`,
`- [ ] Snapshot and Key Decisions at the top, each decision saying why, argued only there and cited by \`KD-n\` elsewhere
- [ ] Part section states what is out of scope and the constraints the design meets`],
[`- [ ] Appendix: Fact Disposition, filled as its template comment says
`,``],
[`or has a failure path that changes state, with its failure handling`,`or has a failure path that changes state`],
[`- [ ] At least two real options compared
- [ ] Consequences listed (both positive and negative)`,`- [ ] At least two real options, each with why it won or lost
- [ ] Consequences: what is accepted by choosing this`],
[`4. **Completeness Check**: No TODO/TBD/placeholder markers remain in the document; detail is sufficient for implementation`,`4. **Completeness Check**: No TODO/TBD/placeholder markers remain in the document`],
[`the Part section's \`Depends on\` lists design files`,`the header's \`Depends on\` lists design files`],
[`- Completeness check: Confirm depth and coverage of required elements`,`- Completeness check: Confirm coverage of required elements`],
[`- Complexity justification: every element that adds maintenance surface (persistent state, a boundary crossing, a mode or flag) is a Key Decision whose "why" names the requirement or constraint that needs it`,`- Complexity justification: new persistent state and each new boundary crossing has a stated reason that names the requirement or constraint that needs it`],
[`      "location": "Section 3.2",
      "description": "FileUtil method mismatch",
      "suggestion": "Update document to reflect actual FileUtil usage"`,
`      "location": "Contract Definitions, GET /api/threads",
      "description": "The contract returns 404 for a thread the user does not own; Flow 2 shows 403",
      "suggestion": "Keep 404 in Contract Definitions and change the reply in Flow 2 to 404"`],
]);
patch('skills/mermaid-diagrams/SKILL.md',[
[`Each runtime flow has a **Starts when** line, its diagram, an **Outcome** line (result and persisted state the picture does not show), and **Failure handling** as a list.`,`Each runtime flow has a **Starts when** line and its diagram; the text under it says only what the picture cannot show — what is persisted, a failure no contract states.`],
]);
patch('skills/mermaid-diagrams/references/c4-levels.md',[
[`- Under the diagram, a sentence per container the part touches: what it does in this part — "\`api\` serves the threads and chat endpoints".`,`- Under the diagram, only what the node labels do not say about a container's job in this part.`],
]);
