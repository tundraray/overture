import {edit, must, ceremony} from './edit1.mjs';
edit('requirement-analyzer', t=>{
  t=must(t,'skills: ai-development-guide, documentation-criteria, task-analyzer','skills: documentation-criteria, task-analyzer');
  t=ceremony(t);
  t=must(t,/### File Count Estimation \(MANDATORY\)\n[\s\S]*?(?=### Important: Clear Determination Expressions)/,
`### File Count Estimation

Estimate which files the change touches by reading the entry points and what imports them, related tests included, and list the paths in the output: the scale determination cites them as evidence.

`);
  t=must(t,/## Operating Principles\n[\s\S]*?(?=## Required Information)/,'');
  t=must(t,/\n## Quality Checklist\n[\s\S]*$/,'');
  return t;
});
