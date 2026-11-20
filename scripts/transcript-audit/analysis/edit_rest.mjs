import {edit, must, ceremony} from './edit1.mjs';
const skills = {
  'code-reviewer': ['ai-development-guide, coding-principles, testing-principles, code-navigation, code-system','ai-development-guide, coding-principles, code-navigation, code-system'],
  'code-verifier': ['documentation-criteria, ai-development-guide, coding-principles, code-navigation, code-system','coding-principles, code-system'],
  'design-sync': ['documentation-criteria, coding-principles', null],
  'expert-analyst': ['coding-principles, ai-development-guide, expert-analysis-guide','coding-principles, expert-analysis-guide'],
  'integration-test-reviewer': ['testing-principles, integration-e2e-testing, code-navigation','integration-e2e-testing'],
  'investigator': ['ai-development-guide, coding-principles, code-navigation','ai-development-guide, coding-principles'],
  'verifier': ['ai-development-guide, coding-principles, code-navigation','ai-development-guide, coding-principles'],
  'solver': ['ai-development-guide, coding-principles, implementation-approach, code-navigation','ai-development-guide, coding-principles, implementation-approach'],
  'scope-discoverer': ['documentation-criteria, ai-development-guide, coding-principles, code-navigation','documentation-criteria, ai-development-guide, coding-principles'],
  'security-reviewer': ['coding-principles, ai-development-guide, security-checks, code-navigation','coding-principles, security-checks'],
  'rule-advisor': null, 'cleanup-executor': null,
};
for (const [name, sk] of Object.entries(skills)) edit(name, t=>{
  if (sk) t = sk[1] ? must(t,'skills: '+sk[0]+'\n','skills: '+sk[1]+'\n') : must(t,'skills: '+sk[0]+'\n','');
  t=ceremony(t);
  t=t.replace(/## Delegating a Wide Search\n\nWhen a lookup exceeds this agent's own scope, delegate it per `code-navigation`, "Delegating a Wide Search"\.\n\n/,'');
  if (name==='code-verifier') { t=must(t,/## Delegating a Wide Search\n[\s\S]*?(?=## Output Format)/,''); t=must(t,'(Glob for files, code-explorer or LSP for symbols)','(Glob for files, a search and a read of the code for symbols)'); }
  t=t.replace(/### Code Navigation\n[\s\S]*?(?=\n## |$)/,'');
  t=t.replace(/## MCP Tools Usage\n\n+(?=## |$)/,'');
  t=t.replace(/## Completion Criteria\n[\s\S]*?(?=## Self-Validation)/,'');
  t=t.replace(/Completion Criteria (above )?confirm the steps ran\. These confirm the output is \*correct\*\. /,'');
  t=t.replace(/## Quality Checklist\n[\s\S]*?(?=\n## |$)/,'');
  t=t.replace(/\n{3,}/g,'\n\n');
  return t;
});
