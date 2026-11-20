import fs from 'fs';
const root = 'D:/git/github/ai/claude-code-workflows/';
const rep = (file, pairs) => {
  let s = fs.readFileSync(root + file, 'utf8');
  const crlf = s.includes('\r\n');
  if (crlf) s = s.replace(/\r\n/g, '\n');
  for (const [a, b] of pairs) {
    const n = s.split(a).length - 1;
    if (n !== 1) { console.log('MISS(' + n + ') in ' + file + ': ' + a.slice(0, 70)); continue; }
    s = s.replace(a, () => b);
  }
  if (crlf) s = s.replace(/\n/g, '\r\n');
  fs.writeFileSync(root + file, s);
};

rep('skills/work-planning/SKILL.md', [
  ["Those paths are the executor's file scope — a path missing from Target Files blocks the executor mid-phase and costs an escalation round trip. Guessing the list is what produces that.",
   "Those paths are the executor's expected scope — a missing path that touches a contract or another part stops the executor mid-phase and costs an escalation round trip. Guessing the list is what produces that."],
  ["`query: where <value> is written and where it is read; breadth: medium` — fills the Connection Map's Owner columns, which require concrete paths |",
   "`query: where <value> is written and where it is read; breadth: medium` — gives the work item that crosses the boundary the other side's file |"],
  ["Use the result to populate **Target Files** per phase, the **Connection Map** owners, and the phase ordering.",
   "Use the result to populate **Target Files** per phase, the other side's file in a work item that crosses a boundary, and the phase ordering."],
  ["- **Set `M` in `plan: N of M` deliberately.** When the work genuinely needs a second pass, raise `M` on every plan in the part and add the new plan with the next `N` — do not drop an unannounced plan file into the directory.\n- **`depends-on` fixes the order**, so sequencing never relies on filename sort. Omit it only for `N: 1`.\n",
   "- **`plan: N of M` and `depends-on` are written only when the part has more than one plan.** When the work genuinely needs a second pass, give every plan in the part its `plan: N of M` and each plan after the first its `depends-on` — do not drop an unannounced plan file into the directory. `depends-on` fixes the order, so sequencing never relies on filename sort.\n"],
  ["and the work items cite the PRD's requirements (the feature spec's acceptance criteria). A plan for a part whose `dependsOn` parts are not yet built is planned against their designs; say so in the plan's Connection Map.",
   "and the work items cite the PRD's requirements (the feature spec's acceptance criteria). It is the same template with the parts that cite a design (Patterns, Contracts) absent. A plan for a part whose `dependsOn` parts are not yet built is planned against their designs; say so in the plan's Notes."],
  ["3. **Target Files**: Every file the phase touches, implementation and test alike; the list is the executor's file scope\n4. **Built-in Quality**: A work item's unit tests are written test-first with it (Red-Green-Refactor); the phase's Proof Obligations name them\n5. **Risk Management**: List risks and countermeasures in advance, define detection methods\n6. **Design Doc Compliance**: Work items and completion conditions derive from Design Doc specifications; an implementation sample complies strictly with the Design Doc's decisions and contracts\n",
   "3. **Target Files**: Every file the phase is expected to touch, implementation and test alike; the list is the executor's expected scope\n4. **Built-in Quality**: A work item's unit tests are written test-first with it (Red-Green-Refactor); the phase's Proof Obligations name them\n5. **Design Doc Compliance**: Work items derive from Design Doc specifications; an implementation sample complies strictly with the Design Doc's decisions and contracts\n6. **Contracts**: A phase points at what binds it — the Design Doc sections it implements or consumes, the sections whose exact values it must reproduce (naming the kind of value), and an ADR section when one binds the phase. The value stays at its owner; the executor reads it there\n"],
  ["Select the implementation approach per `implementation-approach` and name it, with its reason, in the plan's Overview. Divide the work into phases based on that approach and the technical dependencies the Design Doc's components and contracts show, and give each phase's operational verification its level (L1/L2/L3) from the implementation-approach skill.",
   "Select the implementation approach per `implementation-approach`, and divide the work into phases based on that approach and the technical dependencies the Design Doc's components and contracts show."],
  ["- Phases run in number order; each names the earlier phases it builds on in `Depends on`\n",
   "- Phases run in number order; a phase carries `Depends on` only when it reads an earlier phase's deliverable\n"],
  ["place its operational verification procedure in the phase that completes it.",
   "place its operational verification in the phase that completes it. A phase that completes none has no such section."],
  ["- Specify traceability per AC: the one test that proves it (`AC-1 → <test title>`), never several\n- A phase's Completion Condition names only what the phase gate checks — work items ticked, static checks, and the unit tests of what the phase changed; no case counts in the plan text\n",
   "- Specify traceability per AC: the one test that proves it (`AC-1 → <test title>`), never several, and the regression it turns red on; the form is the planner's\n"],
  ["The simplified plan (`design: none`), the `status` flip, and a Target Files amendment during execution get no draft check.",
   "The simplified plan (`design: none`) and a Target Files amendment during execution get no draft check."],
  ["- [ ] Every Failure Mode category that applies is listed with a covering phase\n- [ ] Reference Contract Values are copied verbatim from the Design Doc, not paraphrased\n- [ ] Frontmatter is complete and consistent: `plan: N of M` matches the part's plan count\n- [ ] Target Files per phase were obtained from a resolved search, not assumed — a missing path blocks the executor mid-phase; every existing path and symbol a phase names was checked against current code\n",
   "- [ ] Every Design Doc section with an exact value a phase must reproduce, and every ADR section that binds a phase, is pointed at from that phase's Contracts; no value is copied into the plan\n- [ ] Frontmatter is complete; when the part has more than one plan, `plan: N of M` matches the part's plan count\n- [ ] Target Files per phase were obtained from a resolved search, not assumed; every existing path and symbol a phase names was checked against current code\n"],
  ["Structural changes (phases, work items, traceability) are made only before execution starts;",
   "Structural changes (phases, work items) are made only before execution starts;"],
  ["- **Processing**: Add one line to Update History (a phrase per change); fold the change into the body as current truth, and update the Snapshot when it changed",
   "- **Processing**: Fold the change into the body as current truth, and update the Snapshot when it changed"],
]);

rep('agents/work-planner.md', [
  ["4. Define each phase's completion condition (derived from Design Doc acceptance criteria)\n5. **Define operational verification procedures for each phase**\n6. Concretize risks and countermeasures\n7. Document in progress-trackable format",
   "4. Define operational verification for each phase that completes an integration point\n5. Name the biggest risk and the phase that meets it first\n6. Document in progress-trackable format"],
  ["Always include quality assurance (acceptance criteria achieved, test set within budget) in final phase.",
   "A final Quality Assurance phase is written only when the part has measurement or profiling scripts, or an end-to-end check of its journeys that no earlier phase holds."],
]);

rep('gamedev/agents/gamedev-work-planner.md', [
  ["4. Define each phase's completion condition (derived from Design Doc and GDD acceptance criteria)\n5. **Define operational verification procedures for each phase**\n6. Concretize risks and countermeasures (frame budget, memory, platform targets)\n7. Document in progress-trackable format",
   "4. Define operational verification for each phase that completes an integration point\n5. Name the biggest risk (frame budget, memory, platform targets) and the phase that meets it first\n6. Document in progress-trackable format"],
]);

for (const f of ['agents/task-executor.md', 'agents/task-executor-frontend.md']) rep(f, [
  ["**Step 3**: Before any file write or edit, verify the target path is in the allowed list.\n\nWhen a file outside the list needs modification, return `status: \"escalation_needed\"` with `escalation_type: \"out_of_scope_file\"`, including `details.file_path`, `details.allowed_list`, and `details.modification_reason`.\n",
   "**Step 3**: The list is the expected scope. Before writing to a file outside it, decide which case it is:\n- **A small change in another file of the same part that the phase cannot compile or work without**, and that changes no contract, no public interface and no file of another part → make it, and name the file and the reason in `changeSummary`.\n- **Anything that crosses a part boundary or alters a contract or a public interface** → return `status: \"escalation_needed\"` with `escalation_type: \"out_of_scope_file\"`, including `details.file_path`, `details.allowed_list`, and `details.modification_reason`.\n"],
  ["`#### Work Items`, `#### Proof Obligations`, `#### Operational Verification`, `#### Completion Condition`, `#### Investigation Notes`.",
   "`#### Work Items`, `#### Proof Obligations`, `#### Operational Verification`, `#### Investigation Notes`. Only Target Files and Work Items are in every phase; the planner leaves out a section with nothing to put in it."],
  ["1. **Read every Investigation Target**, using its search hint.",
   "1. **Read the Target Files that exist and every Investigation Target**, using its search hint."],
  ["a symbol the phase changes whose current signature contradicts the plan's Reference Contract Values → `design_compliance_violation`.",
   "a symbol the phase changes whose current signature contradicts the Design Doc contract the phase cites → `design_compliance_violation`."],
  ["   - Depends on → deliverables of earlier phases",
   "   - Contracts → each cited ADR section, when the phase names one\n   - Depends on → deliverables of earlier phases"],
  ["1. From the Investigation Targets, identify cases", "1. From the Target Files and Investigation Targets, identify cases"],
  ["*Required when the plan's ADR Bindings table has one or more rows whose \"Covered By Phase(s)\" names this phase.*\n\nBefore the TDD cycle, read each row's ADR Source Section and judge the planned approach against the row's Compliance Check. An approach that fails a row → stop and escalate with `escalation_type: \"binding_decision_violation\"` and `stage: \"pre_implementation\"`; a row that cannot be judged is escalated with `evaluation: Unknown`. The Exit Gate judges the rows again against the final implementation.",
   "*Required when the phase's `#### Contracts` cite an ADR section.*\n\nBefore the TDD cycle, read each cited ADR section and judge the planned approach against the decisions it makes. An approach that breaks one → stop and escalate with `escalation_type: \"binding_decision_violation\"` and `stage: \"pre_implementation\"`; a decision that cannot be judged is escalated with `evaluation: Unknown`. The Exit Gate judges them again against the final implementation."],
  ["*Required when the plan's Reference Contract Values table has one or more rows whose \"Covered By Phase(s)\" names this phase.*\n\nBefore the TDD cycle, read each row's Design Doc section and judge whether the planned approach reproduces the row's Required Observable Value. One that does not → stop and escalate with `escalation_type: \"design_compliance_violation\"`, `details.design_doc_expectation` = the row's Required Observable Value, `details.actual_situation` = the planned approach; a row that cannot be judged is escalated the same way, with `actual_situation` saying what is unknown. The Exit Gate judges the rows again against the final implementation.",
   "*Required when the phase's `#### Contracts` name a Design Doc section whose values it must reproduce exactly.*\n\nBefore the TDD cycle, read each named section — the value is taken from the Design Doc, its owner — and judge whether the planned approach reproduces it. One that does not → stop and escalate with `escalation_type: \"design_compliance_violation\"`, `details.design_doc_expectation` = the section and its value, `details.actual_situation` = the planned approach; a value that cannot be judged is escalated the same way, with `actual_situation` saying what is unknown. The Exit Gate judges them again against the final implementation."],
  ["- Execute the phase's `#### Operational Verification` section\n- Perform verification according to level defined in implementation-approach skill\n",
   "- Execute the phase's `#### Operational Verification` section, when it has one\n"],
  ["The phase is complete when all its Work Items are `[x]` and operation verification is done.",
   "The phase is complete when all its Work Items are `[x]` and its operational verification, when it has one, is done."],
  ["`failures[{source, axis, decision, complianceCheck, evaluation: 'N' \\| 'Unknown', rationale}]` | \"Adjust the planned approach to satisfy the binding decision\" / \"Update the ADR, then the work plan's ADR Bindings\"",
   "`failures[{source, decision, evaluation: 'N' \\| 'Unknown', rationale}]` | \"Adjust the planned approach to satisfy the binding decision\" / \"Update the ADR, then the phase that cites it\""],
  ["☐ Every ADR Bindings Compliance Check covering this phase evaluates to `Y` against the **final** implementation (when such rows exist)\n☐ Every Reference Contract Values Compliance Check covering this phase evaluates to `Y` against the **final** implementation (when such rows exist)",
   "☐ The **final** implementation satisfies every ADR section the phase's Contracts cite (when one is cited)\n☐ The **final** implementation reproduces every exact value in the Design Doc sections the phase's Contracts name for it, checked against the section (when one is named)"],
  ["For an unchecked ADR Bindings item use", "For an unchecked ADR item use"],
]);

rep('agents/task-executor.md', [
  ["\nThe phase's Target Files are the source of truth for scope. Any modification outside the union above goes through escalation.\n", ""],
]);
console.log('done');
