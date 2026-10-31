#!/usr/bin/env node
/**
 * Document ownership guard (PreToolUse).
 *
 * The File Ownership table in workflow-orchestration says which agent owns
 * which document. It is guidance, and guidance is followed until it isn't:
 * a Design Doc rewritten by an executor mid-task is indistinguishable, after
 * the fact, from one the designer wrote.
 *
 * This turns the table into a gate. It reads `agent_type` from the hook input
 * — present whenever the call comes from inside a subagent — and decides:
 *
 *   author   may Write and Edit   (create or replace: authoring)
 *   updater  may Edit only        (targeted change, e.g. a progress checkbox)
 *   other    denied
 *   no agent denied               (main conversation: the orchestrator delegates)
 *
 * Write versus Edit is the load-bearing distinction. A Write replaces the file
 * wholesale, which is authorship; an Edit is surgical, which is what an
 * executor ticking a checkbox in someone else's plan is doing.
 *
 * The main conversation is denied rather than asked: under auto mode an `ask`
 * is resolved without the user, so it let the orchestrator edit a PRD directly.
 *
 * Bash and PowerShell are watched too. A `sed -i` or a redirect into docs/
 * changes a human document without passing through Write/Edit, so ownership
 * cannot be checked — every caller, owner included, is sent back to
 * Edit/Write. The command is tokenised (quoted strings and heredoc bodies are
 * data; `cd` is followed) and a write is a redirect, `rm`/`mv`/`tee`/`touch`/
 * `truncate`, a copy destination, an in-place `sed`/`perl`, a writing `git`
 * subcommand, or a PowerShell content/item cmdlet whose target is a human
 * document. Work plans and task files are temporary and not guarded here. A
 * script that opens files itself (`python -c`, `node -e`) is not recognised.
 *
 * The same hook also watches Agent/Task calls for one shape: a document owner
 * spawning a *different* document owner. The Write/Edit guard only sees who is
 * knocking right now, so an owner blocked from writing a file it does not own
 * can route around it by spawning the file's owner and having that agent do
 * the write. A cross-owner handoff belongs to the orchestrator, which
 * delegates to the owner explicitly; an owner spawning itself (fan-out) or a
 * non-owning helper (code-explorer) is untouched.
 *
 * Dependency-free (node: builtins only). Unmatched paths are allowed — this
 * guards documents, not the repository.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Ownership rules, most specific first. `test` matches a repo-relative,
 * forward-slashed path.
 */
const RULES = [
  {
    name: 'PRD',
    test: /^docs\/features\/[^/]+\/prd\.md$/,
    authors: ['prd-creator'],
    updaters: [],
  },
  {
    name: 'UXRD',
    test: /^docs\/features\/[^/]+\/uxrd\.md$/,
    authors: ['ux-designer', 'game-ui-designer'],
    updaters: [],
  },
  {
    // project-wide: README, foundations, components/*; created and extended by UXRDs
    name: 'design system',
    test: /^docs\/design-system\/.+\.md$/,
    authors: ['ux-designer', 'game-ui-designer'],
    updaters: [],
  },
  {
    name: 'Design Doc',
    test: /^docs\/features\/[^/]+\/design-[^/]+\.md$/,
    authors: ['technical-designer', 'technical-designer-frontend'],
    // a design has no progress section; progress lives in plans and task files
    updaters: [],
  },
  {
    name: 'ADR',
    test: /^docs\/adr\/[^/]+\.md$/,
    authors: ['technical-designer', 'technical-designer-frontend'],
    updaters: [],
  },
  {
    name: 'feature spec',
    test: /^docs\/game-design\/features\/[^/]+\.md$/,
    authors: ['mid-game-designer'],
    updaters: [],
  },
  {
    name: 'GDD',
    test: /^docs\/game-design\/[^/]+\.md$/,
    authors: ['sr-game-designer'],
    updaters: [],
  },
  {
    // research task deliverables (task metadata `Provides:`)
    name: 'research deliverable',
    test: /^docs\/features\/[^/]+\/[^/]+\/[^/]+\/analysis\/.+\.md$/,
    authors: ['task-executor', 'task-executor-frontend'],
    updaters: [],
  },
  {
    name: 'task file',
    test: /^docs\/features\/[^/]+\/[^/]+\/[^/]+\/.+\.md$/,
    authors: ['task-decomposer'],
    updaters: ['task-executor', 'task-executor-frontend'],
  },
  {
    name: 'work plan',
    test: /^docs\/features\/[^/]+\/[^/]+\/[^/]+\.md$/,
    authors: ['work-planner', 'gamedev-work-planner'],
    updaters: ['task-executor', 'task-executor-frontend'],
  },
];

const WRITE_TOOLS = new Set(['Write', 'NotebookEdit']);
const EDIT_TOOLS = new Set(['Edit', 'MultiEdit']);
const SPAWN_TOOLS = new Set(['Agent', 'Task']);

// --- shell guard ------------------------------------------------------------
//
// Human documents — PRD, UXRD, design system, Design Doc, ADR, GDD, feature
// spec — change only through Write/Edit. Work plans and task files (a part
// directory under docs/features/<feature>/) are temporary working state: the
// shell may touch them, and Final Cleanup deletes them with `rm`.

const SHELL_TOOLS = new Set(['Bash', 'PowerShell']);

/** `docs`, `docs/features[/<feature>[/<file>]]`, `docs/adr/…`, … — but not a part directory. */
function isHumanDocPath(p) {
  if (p === 'docs') return true;
  if (!p.startsWith('docs/')) return false;
  const rest = p.slice('docs/'.length);
  if (/^features\/[^/]+\/[^/.]+(\/|$)/.test(rest)) return false; // part directory: plans and task files
  return /^(features|adr|design-system|game-design)(\/|$)/.test(rest);
}

/** Heredoc bodies are data, not commands. */
const stripHeredocs = (cmd) =>
  cmd.replace(/<<-?\s*(['"]?)(\w+)\1[^\n]*\n[\s\S]*?\n[ \t]*\2[ \t]*(?=\n|$)/g, '<<HEREDOC');

/**
 * Split a command into segments of tokens. A quoted string is one word (so a
 * commit message never reads as a command); `;`, `|`, `&`, newlines and
 * parentheses end a segment; `>`/`>>` (with an fd prefix) are redirect tokens.
 */
function shellSegments(command) {
  const re = /"((?:[^"\\]|\\.)*)"|'([^']*)'|(\d*>>?|&>>?)|(&&|\|\||[;|&\n()])|([^\s"';|&<>()]+)/g;
  const segments = [[]];
  let end = -1; // where the previous word piece ended: pieces with no space between are one word (`S="a b"`)
  for (const m of stripHeredocs(command).matchAll(re)) {
    if (m[4] !== undefined) {
      segments.push([]);
      end = -1;
      continue;
    }
    const seg = segments[segments.length - 1];
    if (m[3] !== undefined) {
      seg.push({ op: m[3] });
      end = -1;
      continue;
    }
    const piece = m[1] ?? m[2] ?? m[5];
    const last = seg[seg.length - 1];
    if (m.index === end && last?.word !== undefined) last.word += piece;
    else seg.push({ word: piece });
    end = m.index + m[0].length;
  }
  return segments.filter((s) => s.length);
}

const WRITE_ANY_ARG = new Set([
  // POSIX
  'rm', 'rmdir', 'unlink', 'truncate', 'touch', 'tee', 'shred', 'mv',
  // PowerShell cmdlets and aliases
  'set-content', 'add-content', 'out-file', 'clear-content', 'remove-item', 'move-item', 'rename-item',
  'new-item', 'sc', 'ac', 'del', 'erase', 'ri', 'rni', 'ni', 'mi', 'move', 'ren',
]);
const COPY = new Set(['cp', 'install', 'copy-item', 'copy', 'cpi']);
const CD = new Set(['cd', 'pushd', 'set-location', 'sl']);
const GIT_WRITES = new Set(['checkout', 'restore', 'clean', 'rm', 'mv']);

function shellChangesDocuments(command, cwd) {
  const cwdForms = [];
  if (cwd) {
    const c = cwd.replace(/\\/g, '/').replace(/\/+$/, '');
    cwdForms.push(c);
    const drive = /^([A-Za-z]):\/(.*)$/.exec(c);
    if (drive) cwdForms.push(`/${drive[1].toLowerCase()}/${drive[2]}`);
  }
  let base = ''; // directory `cd` moved into, relative to the repository

  const resolve = (word) => {
    let w = word.replace(/\\/g, '/');
    const lower = w.toLowerCase();
    let absolute = false;
    for (const c of cwdForms) {
      if (lower === c.toLowerCase()) return '';
      if (lower.startsWith(c.toLowerCase() + '/')) {
        w = w.slice(c.length + 1);
        absolute = true;
        break;
      }
    }
    if (!absolute && /^([/~$]|[A-Za-z]:)/.test(w)) return null; // outside the repository, or unknown
    w = w.replace(/^(\.\/)+/, '');
    if (!absolute && base) w = `${base}/${w}`;
    return w.replace(/\/+$/, '') || '';
  };
  const human = (word) => {
    const p = resolve(word);
    return p !== null && isHumanDocPath(p);
  };

  const segments = shellSegments(command);
  // Variables assigned in the command (`f=docs/features/x/prd.md`). A value built
  // by command substitution (`files=$(grep -rl …)`) is unknown and not recorded.
  const vars = new Map();
  const expand = (word) => word.replace(/^\$\{?(\w+)\}?/, (m, name) => vars.get(name) ?? m);
  for (const s of segments) {
    for (const t of s) {
      const a = t.word === undefined ? null : /^(\w+)=(.+)$/.exec(t.word);
      const value = a ? expand(a[2]) : '';
      if (a && !value.startsWith('$')) vars.set(a[1], value);
    }
  }
  // An unknown variable target (`sed -i … $files`) counts when the command names a human document anywhere.
  const namesHumanDoc = segments.some((s) => s.some((t) => t.word !== undefined
    && (human(t.word) || human(t.word.replace(/^\w+=/, '')))));

  for (const seg of segments) {
    for (let i = 0; i < seg.length - 1; i++) {
      if (seg[i].op && !seg[i].op.startsWith('&') && seg[i + 1].word !== undefined && human(seg[i + 1].word)) return true;
    }
    // Arguments, without redirect targets (`2>/dev/null` is not a copy destination).
    const words = seg.filter((t, i) => t.word !== undefined && !(i > 0 && seg[i - 1].op)).map((t) => t.word);
    while (words.length && /^\w+=/.test(words[0])) words.shift();
    if (words[0] === 'sudo' || words[0] === 'command') words.shift();
    if (!words.length) continue;
    const cmd = words[0].replace(/\\/g, '/').split('/').pop().toLowerCase();
    const args = words.slice(1).map(expand);

    if (CD.has(cmd)) {
      const target = args.find((a) => !a.startsWith('-'));
      const p = target === undefined ? null : resolve(target);
      base = p ?? '';
      continue;
    }
    if (WRITE_ANY_ARG.has(cmd) && args.some(human)) return true;
    if (COPY.has(cmd)) {
      const paths = args.filter((a) => !a.startsWith('-'));
      const t = args.findIndex((a) => a === '-t' || /^-destination$/i.test(a));
      const dest = t >= 0 ? args[t + 1] : paths[paths.length - 1];
      if (dest !== undefined && human(dest)) return true;
    }
    const inPlace = (cmd === 'sed' && args.some((a) => /^-[nErsuz]*i|^--in-place/.test(a)))
      || (cmd === 'perl' && args.some((a) => /^-[pnlaw0-9]*i/.test(a)));
    if (inPlace && (args.some(human) || (namesHumanDoc && args.some((a) => a.startsWith('$'))))) return true;
    if (cmd === 'git' && GIT_WRITES.has(args[0]) && args.some(human)
      && !(args[0] === 'restore' && args.includes('--staged') && !args.includes('--worktree'))) return true;
  }
  return false;
}

function decideShell(command, cwd, agentType) {
  if (typeof command !== 'string' || !command || !shellChangesDocuments(command, cwd)) return null;
  const next = agentType
    ? 'Use Edit on a document you own; for one you do not, return the change to the orchestrator.'
    : 'Delegate the change to the owning agent (see File Ownership by Agent in workflow-orchestration), '
      + 'e.g. through /update-doc.';
  return {
    decision: 'deny',
    reason: `This command changes a document under docs/ through the shell. PRD, UXRD, design system, `
      + `Design Doc, ADR, GDD, and feature spec change only through Write/Edit, where ownership is checked. `
      + `${next} Work plans and task files are not affected by this rule.`,
  };
}

/**
 * `agent_type` arrives bare (`prd-creator`) or plugin-scoped
 * (`backend-overture:prd-creator`) depending on how the agent was resolved.
 * Both forms name the same agent, so compare on the bare, lowercased name.
 */
const normalise = (a) => String(a).trim().split(':').pop().toLowerCase();

/**
 * The plugin's own agents, read from the `agents/` directory beside this hook.
 * A plugin agent missing from the table (quality-fixer, document-reviewer) owns
 * no document, so it is denied like any other non-owner — not asked, which
 * auto mode resolves without the user.
 */
function pluginAgents() {
  // Beside the hook, and the plugin root: `hooks/` is a symlink in the plugin
  // directories, so Node resolves the first to the shared root and misses
  // agents only one plugin ships (gamedev).
  const dirs = [join(dirname(fileURLToPath(import.meta.url)), '..', 'agents')];
  if (process.env.CLAUDE_PLUGIN_ROOT) dirs.push(join(process.env.CLAUDE_PLUGIN_ROOT, 'agents'));
  return dirs.flatMap((dir) => {
    try {
      return readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3));
    } catch {
      return [];
    }
  });
}

/** Every agent named in the table or shipped by the plugin — used to tell "wrong agent" from "unknown name". */
const KNOWN_AGENTS = new Set(
  [...RULES.flatMap((r) => [...r.authors, ...r.updaters]), ...pluginAgents()].map(normalise),
);

/** Agents that author a governed document — the only ones the spawn guard cares about. */
const DOCUMENT_OWNERS = new Set(RULES.flatMap((r) => r.authors).map(normalise));

/**
 * Spawn guard: a document owner may not spawn a different document owner.
 *
 * Only the owner-to-other-owner pair is judged. The main conversation (no
 * agent_type), a non-owning caller, a self-spawn, and a spawn of a non-owning
 * helper all pass. The target name is compared bare, so `prd-creator` and
 * `backend-overture:prd-creator` are the same agent here.
 */
function decideSpawn(agentType, subagentType) {
  if (!agentType || !subagentType) return null;
  const caller = normalise(agentType);
  const target = normalise(subagentType);
  if (!DOCUMENT_OWNERS.has(caller) || !DOCUMENT_OWNERS.has(target)) return null;
  if (caller === target) return null;
  return {
    decision: 'deny',
    reason: `${caller} owns a document and may not spawn ${target}, which owns another. `
      + `Spawning the owner to perform a write the caller is not permitted to make routes around `
      + `the ownership guard. Return the needed change to the orchestrator, which delegates to `
      + `${target} explicitly (see File Ownership by Agent in workflow-orchestration).`,
  };
}

function decide(kind, toolName, agentType) {
  const rule = RULES.find((r) => r.test.test(kind));
  if (!rule) return null; // not a governed document

  const isWrite = WRITE_TOOLS.has(toolName);
  const isEdit = EDIT_TOOLS.has(toolName);
  if (!isWrite && !isEdit) return null;

  // Main conversation: the orchestrator delegates documents, it never edits them.
  if (!agentType) {
    return {
      decision: 'deny',
      reason: `${rule.name} is owned by ${rule.authors.join(' or ')}; the main conversation does not `
        + `edit it. Delegate the change to ${rule.authors.join(' or ')} (e.g. through /update-doc). `
        + `To change it by hand, edit the file outside Claude Code.`,
    };
  }

  const bare = normalise(agentType);

  if (rule.authors.some((a) => normalise(a) === bare)) return { decision: 'allow' };

  if (rule.updaters.some((a) => normalise(a) === bare)) {
    if (isEdit) return { decision: 'allow' };
    return {
      decision: 'deny',
      reason: `${bare} may make targeted edits to this ${rule.name} `
        + `(progress checkboxes), but Write replaces the whole file. `
        + `Authoring it belongs to ${rule.authors.join(' or ')}. Use Edit, or escalate.`,
    };
  }

  // A fork reports no identity of its own, so ownership cannot be checked. An
  // owner that splits its work spawns itself instead, which reports its type.
  if (bare === 'fork') {
    return {
      decision: 'deny',
      reason: `${rule.name} is owned by ${rule.authors.join(' or ')}. A fork reports agent_type "fork", `
        + `so the guard cannot tell whose work it is. To split the work, spawn yourself as a subagent `
        + `(subagent_type "<plugin>:<your agent name>", e.g. "fullstack-overture:${rule.authors[0]}") `
        + `instead of a fork; otherwise return the change to the orchestrator.`,
    };
  }

  // An agent this guard has never heard of is not evidence of a violation — it
  // is more likely a name arriving in a shape the table does not list. Denying
  // here would block the legitimate owner over a labelling mismatch, so ask and
  // report the observed value, which makes the mismatch diagnosable.
  if (!KNOWN_AGENTS.has(bare)) {
    return {
      decision: 'ask',
      reason: `${rule.name} is owned by ${rule.authors.join(' or ')}. `
        + `The caller reports agent_type "${agentType}", which this guard does not recognise — `
        + `confirm this is intended, and if the name is legitimate add it to hooks/document-guard.mjs.`,
    };
  }

  return {
    decision: 'deny',
    reason: `${rule.name} is owned by ${rule.authors.join(' or ')}; ${bare} may not modify it. `
      + `Return the needed change to the orchestrator, which routes revisions to the owning agent `
      + `(see File Ownership by Agent in workflow-orchestration).`,
  };
}

function main() {
  let raw = '';
  try {
    raw = readFileSync(0, 'utf8');
  } catch {
    process.exit(0); // no input: nothing to judge
  }

  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    process.exit(0); // unparseable: fail open, this guard must never wedge a session
  }

  if (!input || typeof input !== 'object') process.exit(0);
  const toolName = input.tool_name || '';
  const agentType = typeof input.agent_type === 'string' ? input.agent_type : '';

  let verdict = null;
  if (SPAWN_TOOLS.has(toolName)) {
    verdict = decideSpawn(agentType, input.tool_input?.subagent_type || '');
  } else if (SHELL_TOOLS.has(toolName)) {
    verdict = decideShell(input.tool_input?.command, input.cwd || '', agentType);
  } else {
    const filePath = input.tool_input?.file_path || input.tool_input?.notebook_path || '';
    if (typeof filePath !== 'string' || !filePath) process.exit(0);

    // Normalise to a repo-relative, forward-slashed path.
    const cwd = (input.cwd || '').replace(/\\/g, '/').replace(/\/$/, '');
    let rel = filePath.replace(/\\/g, '/');
    if (cwd && rel.startsWith(cwd + '/')) rel = rel.slice(cwd.length + 1);
    rel = rel.replace(/^\.\//, '');

    verdict = decide(rel, toolName, agentType);
  }
  if (!verdict || verdict.decision === 'allow') process.exit(0);

  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: verdict.decision,
      permissionDecisionReason: verdict.reason,
    },
  }));
  process.exit(0);
}

main();
