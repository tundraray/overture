---
name: technical-spec
description: This skill provides technical design rules including environment variable management, architecture design, and build/testing commands. Automatically loaded when discussing architecture, environment variables, build commands, or when "tech stack", "architecture pattern", "environment config", or "build command" are mentioned.
---

# Technical Design Rules

## Basic Technology Stack Policy

TypeScript-based application implementation. Architecture patterns should be selected according to project requirements and scale.

## Environment Variable Management and Security

### Environment Variable Management

- Centrally manage environment variables and build mechanisms to ensure type safety
- Avoid direct references to `process.env`, obtain through configuration management layer
- Properly implement default value settings and mandatory checks

### Security

- Do not include `.env` files in Git
- Always manage API keys and secrets as environment variables
- Prohibit logging of sensitive information
- Do not include sensitive information in error messages

## Architecture Design

### Architecture Design Principles

Select appropriate architecture for each project and define clearly:

- **Separation of Responsibilities**: Clearly define responsibilities for each layer and module, and maintain boundaries

## Unified Data Flow Principles

#### Basic Principles

1. **Single Data Source**: Store the same information in only one place
2. **Structured Data Priority**: Use parsed objects rather than JSON strings
3. **Clear Responsibility Separation**: Clearly define responsibilities for each layer

#### Data Flow Best Practices

- **Validation at Input**: Validate data at input layer and pass internally in type-safe form
- **Centralized Transformation**: Consolidate data transformation logic in dedicated utilities
- **Structured Logging**: Output structured logs at each stage of data flow

## Build and Testing

Commands come from the project's own scripts — `package.json`, run with the package manager its `packageManager` field names — or from project-context; never assume another project's script names.

### Quality Check Requirements

Quality checks are mandatory upon implementation completion, in the phases of `ai-development-guide` "Quality Check Workflow":

- **Phase 1: Static Analysis** — the lint/format script, the type check, and the unused-export and circular-dependency checks when the project has them
- **Phase 2: Build Verification** — the build script
- **Phase 3: Testing** — the test script, and the coverage script when the project has one
- **Phase 4: Final Quality Gate** — every check above passes in one run, so a fix made for a test did not break an earlier phase

### Troubleshooting

- **Port in use or hanging test processes**: stop the leftover runner processes (the project's cleanup script, when it has one)
- **Stale results**: re-run with the test runner's cache cleared
- **Dependency errors**: Clean reinstall dependencies

### Coverage Requirements

- Coverage is read as a map of untested logic, not a target (`testing-principles`, Coverage Standards)
- A threshold the project's own CI enforces is met; this skill sets none of its own
- **Metrics**: Statements, Branches, Functions, Lines
