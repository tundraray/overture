# Real-World Examples

## What People Have Built

### [Sub-Agents MCP Server](https://github.com/shinpr/sub-agents-mcp)
Built in 2 days - 30 TypeScript files with full test coverage, now running in production.

### [MCP Image Generator](https://github.com/shinpr/mcp-image)
Built in 1.5 days - Complete creative tool with multi-image blending and character consistency.

> The right workflow structure + specialized agents = production-quality code at AI speed.

---

## Typical Workflows

### Backend Feature Development

```bash
/implement "Add user authentication with JWT"

# What happens:
# 1. Analyzes your requirements
# 2. Creates design documents
# 3. Breaks down into tasks
# 4. Implements with TDD
# 5. Runs tests and fixes issues
# 6. Reviews against design docs
```

### Frontend Feature Development

```bash
/front-design "Build a user profile dashboard"

# What happens:
# 1. Plans React component structure
# 2. Defines state management approach
# 3. Creates work plan
#
# Then run:
/front-build

# This:
# 1. Implements components with Testing Library
# 2. Writes tests for each component
# 3. Handles TypeScript types
# 4. Fixes lint and build errors
```

### Quick Fixes (All Plugins)

```bash
/task "Fix validation error message"

# Direct implementation with quality checks
# Works the same in both plugins
```

### Code Review

```bash
/review

# Checks your implementation against design docs
# Catches missing features or inconsistencies
```

### Problem Diagnosis (All Plugins)

```bash
/diagnose "API returns 500 error on user login"

# What happens:
# 1. Investigator collects evidence from code, logs, git history
# 2. Builds evidence matrix with multiple hypotheses
# 3. Verifier validates findings with ACH and Devil's Advocate
# 4. Solver generates solutions with tradeoff analysis
# 5. Presents actionable implementation steps
```

### Codebase Audit (All Plugins)

```bash
/audit "src/"

# What happens:
# 1. Scans for dead code, orphan files, unused exports
# 2. Reviews each finding with you interactively
# 3. Creates safety branch before any deletions
# 4. Removes confirmed dead code with build verification
# 5. Reverts automatically if anything breaks
```

### Reverse Engineering

**Backend (backend-overture):**

```bash
/reverse-engineer "src/auth module"

# What happens:
# 1. Discovers PRD targets (user value units) from code
# 2. Generates PRD for each feature
# 3. Verifies PRD against actual code
# 4. Reviews and revises until consistent
# 5. Discovers Design Doc targets (technical components)
# 6. Generates backend Design Docs with code verification
# 7. Produces complete documentation from existing code
```

**Frontend (frontend-overture):**

```bash
# First, generate PRD using backend-overture's /reverse-engineer
# Then, generate frontend Design Docs from existing PRD:

/front-reverse-design "docs/prd/my-feature-prd.md"

# What happens:
# 1. Uses existing PRD as basis
# 2. Discovers frontend component targets
# 3. Generates frontend Design Docs with code verification
# 4. Reviews and revises until consistent
```

> If you're working with undocumented legacy code, these commands are designed to make it AI-friendly by generating PRD and design docs.
> For a quick walkthrough, see: [How I Made Legacy Code AI-Friendly with Auto-Generated Docs](https://dev.to/shinpr/how-i-made-legacy-code-ai-friendly-with-auto-generated-docs-4353)
