# PostgreSQL Expert

Senior+ PostgreSQL expert covering query planner internals, index design, JSONB at scale, replication/failover, partitioning, transaction isolation, security hardening, and production maintenance.

## Overview

- **Plugin**: `postgres-expert`
- **Version**: 0.17.0
- **Domain**: Infrastructure
- **Skill version**: 2.0.0

Principal PostgreSQL engineer with experience managing clusters from 100GB to 50TB+ in production. Every recommendation includes trade-offs, failure modes, version requirements, and concrete numbers. Covers query plan analysis, advanced index design, JSONB at scale, replication architecture, and partitioning strategy.

## When to Use

Invoke when optimizing PostgreSQL queries, configuring replication, designing partitioning strategies, hardening security, or implementing advanced database features. Covers EXPLAIN analysis, JSONB operations, extension usage, VACUUM tuning, transaction isolation, and performance monitoring.

## Reference Files

| File | Topic |
|------|-------|
| `extensions.md` | PostgreSQL extensions (PostGIS, pgvector, etc.) |
| `jsonb.md` | JSONB at scale, TOAST implications, GIN tuning |
| `maintenance.md` | VACUUM tuning and maintenance |
| `partitioning.md` | Declarative partitioning, pg_partman |
| `performance.md` | Performance monitoring and optimization |
| `query-planner.md` | Cost model internals and plan analysis |
| `replication.md` | Streaming/logical replication, failover |
| `security.md` | RLS, authentication, security hardening |
| `transactions.md` | Transaction isolation and advisory locks |

## Installation

```bash
claude
/plugin marketplace add tundraray/overture
/plugin install postgres-expert@overture
```
