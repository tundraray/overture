# Overture Agents

## Shared Agents (Available in All Plugins)

These agents work the same way whether you're building a REST API or a React app:

| Agent | What It Does |
|-------|--------------|
| **requirement-analyzer** | Figures out how complex your task is and picks the right workflow |
| **expert-analyst** | Multi-perspective analysis from expert viewpoint (Security, Architecture, Performance, etc.) -- spawned in parallel |
| **work-planner** | Breaks down design docs into actionable tasks |
| **task-decomposer** | Splits work into small, commit-ready chunks |
| **code-reviewer** | Checks your code against design docs to make sure nothing's missing |
| **document-reviewer** | Reviews single document quality, completeness, and rule compliance |
| **design-sync** | Verifies consistency across multiple Design Docs and detects conflicts |
| **codebase-scanner** | Scans for dead code, orphan files, unused exports across 7 categories |
| **cleanup-executor** | Safely removes confirmed dead code with git branch backup and build verification |
| **investigator** | Collects evidence, enumerates hypotheses, builds evidence matrix for problem diagnosis |
| **verifier** | Validates investigation results using ACH and Devil's Advocate methods |
| **solver** | Generates solutions with tradeoff analysis and implementation steps |
| **scope-discoverer** | Discovers PRD/Design Doc targets from codebase for reverse engineering |
| **code-verifier** | Validates consistency between documentation and code implementation |

## Backend-Specific Agents (backend-overture)

| Agent | What It Does |
|-------|--------------|
| **prd-creator** | Writes product requirement docs for complex features |
| **technical-designer** | Plans architecture and tech stack decisions |
| **acceptance-test-generator** | Creates E2E and integration test scaffolds from requirements |
| **integration-test-reviewer** | Reviews integration/E2E tests for skeleton compliance and quality |
| **task-executor** | Implements backend features with TDD |
| **quality-fixer** | Runs tests, fixes type errors, handles linting - everything quality-related |
| **rule-advisor** | Picks the best coding rules for your current task |

## Frontend-Specific Agents (frontend-overture)

| Agent | What It Does |
|-------|--------------|
| **prd-creator** | Writes product requirement docs for complex features |
| **technical-designer-frontend** | Plans React component architecture and state management |
| **ux-designer** | Creates UX Requirement Documentation (UXRD) with interaction patterns and accessibility specs |
| **task-executor-frontend** | Implements React components with Testing Library |
| **quality-fixer-frontend** | Handles React-specific tests, TypeScript checks, and builds |
| **rule-advisor** | Picks the best coding rules for your current task |
| **design-sync** | Verifies consistency across multiple Design Docs and detects conflicts |
