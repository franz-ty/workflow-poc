# AI Automation Workflow: Linear Issue → Code → Ticket Update

## Setup Requirements

Everything needed to recreate this workflow from scratch.

### Accounts & Services

| Service    | Purpose                                                    | Notes                                                     |
| ---------- | ---------------------------------------------------------- | --------------------------------------------------------- |
| **Linear** | Issue tracking, webhook source, status sink                | Any plan with API access                                  |
| **GitHub** | Repo hosting, Actions runner, PR automation                | Free tier is fine                                         |
| **OpenAI** | Powers the planning step (GPT-4o) and Codex implementation | Needs API access — Responses API quota required for Codex |

### GitHub Actions Secrets

Set these under **Settings → Secrets and variables → Actions → Repository secrets**:

| Secret           | Value                                                        | Used by                                |
| ---------------- | ------------------------------------------------------------ | -------------------------------------- |
| `LINEAR_API_KEY` | Linear personal API key (Settings → API → Personal API keys) | Both AI Agent workflows                |
| `CODEX_API_KEY`  | OpenAI API key (platform.openai.com → API keys)              | Both AI Agent workflows                |
| `GITHUB_TOKEN`   | Automatically provided by Actions — no setup needed          | `ai-agent-implement.yml` (PR creation) |

### Linear Webhook

The automated trigger (`repository_dispatch: linear-ai-agent`) requires a middleware layer to bridge Linear webhooks to the GitHub API. You need a small HTTP endpoint (e.g. a Vercel function, Cloudflare Worker, or n8n workflow) that:

1. Receives `POST` from Linear on the `issueLabel` event
2. Checks the label is `ai-agent` (or whatever label you configure)
3. Calls the GitHub API to fire a `repository_dispatch` event with `event_type: linear-ai-agent` and `client_payload: { identifier: "<LINEAR-ID>" }`

The GitHub API call looks like:

```sh
curl -X POST https://api.github.com/repos/<owner>/<repo>/dispatches \
  -H "Authorization: Bearer <GITHUB_PAT>" \
  -H "Accept: application/vnd.github+json" \
  -d '{"event_type":"linear-ai-agent","client_payload":{"identifier":"TY-7"}}'
```

The PAT used here needs `repo` scope (or `contents: write` for fine-grained tokens).

For the plan-approval trigger (`linear-ai-agent-implement`), the same middleware must also watch for Linear comment events where the comment body contains "approved" and fire a second dispatch with `event_type: linear-ai-agent-implement`.

### Local Developer Workflow (no middleware needed)

Both workflows support `workflow_dispatch` for manual testing. You can also use the pickup script locally:

```sh
# Requires LINEAR_API_KEY in .env or exported in your shell
./scripts/pickup.sh TY-7
```

This fetches the issue, creates the branch, and writes a `TASK.md` prompt file. Then point any AI coding tool (Claude Code, Cursor, etc.) at it:

```
Read TASK.md and AGENTS.md, then implement the issue.
```

### Tool Versions

Pinned in the workflow files — change these if your project requires different versions:

| Tool            | Version                                            |
| --------------- | -------------------------------------------------- |
| Node.js         | 20                                                 |
| pnpm            | 10.33.0                                            |
| `@openai/codex` | latest (installed at runtime via `npm install -g`) |

### GitHub Branch Protection (recommended)

Once the workflows are wired up, add branch protection on `main`:

- Require status checks: `Typecheck, Lint, Test` (from `ci.yml`)
- Require at least 1 human approval
- Dismiss stale reviews on new pushes
- Block force-pushes

---

## Overview

A full-cycle automation using **Linear** (issue tracking), **Codex** (primary code agent), and **GitHub Actions** (orchestration), bridged by a thin webhook layer.

---

## The Cycle

```
Linear Issue Created
       │
       ▼
[WEBHOOK] → Orchestrator (GitHub Action / n8n)
       │
       ▼
AI reads issue + analyzes codebase
       │
       ▼
    Plan posted to Linear comment
       │
       ▼
  ★ HUMAN: Approve plan
       │
       ▼
Agent creates branch + writes code
       │
       ▼
Tests + lint run in CI
       │
       ▼
PR opened, AI self-review posted
       │
       ▼
  ★ HUMAN: Code review + merge
       │
       ▼
Linear ticket auto-updated → Done
```

---

## Phase-by-Phase Breakdown

### Phase 1 — Issue Intake (Linear)

| Step          | Who        | What                                                                           |
| ------------- | ---------- | ------------------------------------------------------------------------------ |
| Create issue  | **Human**  | Write title, description, acceptance criteria, and attach the `ai-ready` label |
| Triage label  | **Human**  | Add a label like `ai-agent` to signal the issue is eligible for automation     |
| Webhook fires | Automation | Linear POSTs to your orchestrator endpoint on `issueLabel` event               |

**Human checkpoint:** Issue authorship. The quality of the acceptance criteria directly determines the quality of the output. Vague issues produce vague code.

---

### Phase 2 — Analysis & Planning (Codex)

| Step               | Who        | What                                                                |
| ------------------ | ---------- | ------------------------------------------------------------------- |
| Fetch issue detail | Automation | Linear API pulls title, description, linked issues                  |
| Codebase analysis  | **Codex**  | Reads relevant files and maps the issue to affected areas           |
| Plan generation    | **Codex**  | Produces a structured plan: affected files, approach, test strategy |
| Post plan          | Automation | Plan is posted as a comment on the Linear issue                     |

**Human checkpoint:** Reviewer reads the plan comment in Linear and either:

- Replies "approved" (triggers Phase 3), or
- Leaves feedback for revision (loops Codex back)

This gate prevents runaway code generation on misunderstood requirements.

---

### Phase 3 — Implementation

| Step                     | Who          | What                                                                                                                                                                                                                                         |
| ------------------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Branch creation          | Automation   | `git checkout -b feat/linear-<issue-id>-<slug>`                                                                                                                                                                                              |
| Code generation          | **Codex**    | Implements per the approved plan, runs autonomously in the background                                                                                                                                                                        |
| Self-check               | **Codex**    | Runs `tsc`, `eslint`, `pnpm test` and fixes errors autonomously (up to 3 retry loops)                                                                                                                                                        |
| Architectural boundaries | ESLint       | `no-restricted-imports` rules in `eslint.config.mjs` enforce layer boundaries deterministically during `pnpm lint` — no LLM pass needed                                                                                                      |
| Consolidated AI review   | **AI agent** | Single adversarial pass (`pnpm ai:verify`) covering React/Next.js, test quality, branch coverage, dead code/scope, business-logic placement, and correctness/safety. Fixes critical/warning issues; writes review summary for the PR comment |
| Commit                   | Automation   | Commits with `[LINEAR-XXX]` in message for traceability                                                                                                                                                                                      |

The verification pass is driven by `scripts/runAIVerificationPasses.sh` and is provider-agnostic — set `AI_CLI=codex` (default) or `AI_CLI=claude`. Defaults to a scoped sandbox (`codex --full-auto` / `claude --permission-mode acceptEdits` with a tool allowlist); set `AI_BYPASS=1` for full-bypass mode in ephemeral CI runners. Full prompt and configuration details are in `docs/extreme_quality_enforcement.md`.

**Human checkpoint:** If CI fails after 3 auto-fix attempts, the loop halts and pings the engineer in Slack/Linear with the error output. The engineer takes over in their own editor.

---

### Phase 4 — PR Creation & Review

| Step             | Who        | What                                                                      |
| ---------------- | ---------- | ------------------------------------------------------------------------- |
| PR opened        | Automation | `gh pr create` with Linear issue ID in title and body                     |
| AI review        | **Codex**  | Posts a review comment summarizing changes, risks, and test coverage gaps |
| Security scan    | Automation | CI runs SAST (e.g., CodeQL or Semgrep)                                    |
| Human review     | **Human**  | Engineer reads AI review, inspects diff, adds comments                    |
| Approval + merge | **Human**  | Required — no auto-merge without a human approval                         |

**Human checkpoint:** PR approval is always human. The AI review is advisory, not a substitute.

---

### Phase 5 — Post-Merge Ticket Update

| Step           | Who        | What                                                                  |
| -------------- | ---------- | --------------------------------------------------------------------- |
| Merge detected | Automation | GitHub Action on `push` to `main`                                     |
| Linear update  | Automation | Linear API moves issue to **Done**, adds merge commit link as comment |
| Deploy trigger | Automation | Kicks off deploy pipeline (if applicable)                             |
| Notify         | Automation | Posts summary to Slack: issue title, PR link, deploy status           |

No human action required here — this is fully automated.

---

## Repository Structure

This project is a **Turborepo monorepo** with two deployment targets sharing common packages:

```
apps/
  web/      → Next.js website
  native/   → Native wrapper app (iOS + Android)

packages/
  ui/       → Shared atomic design components (atoms/molecules/organisms)
  types/    → Shared TypeScript types
  utils/    → Shared utilities
```

**Impact on the workflow:**

- When Codex receives an issue, it must first identify which app(s) and package(s) are affected before writing any code
- Branch names should be scoped where relevant: `feat/linear-<id>-web-<slug>` or `feat/linear-<id>-pkg-<slug>`
- CI runs `turbo` so all affected packages and apps are linted, type-checked, and tested in one pass — changes to `packages/ui` automatically trigger tests in both `apps/web` and `apps/native`
- Do not import across apps directly — cross-app sharing must go through `packages/` only

---

## Tool Role Summary

| Tool               | Role                                                                         |
| ------------------ | ---------------------------------------------------------------------------- |
| **Linear**         | Source of truth for requirements; webhook trigger; status sink               |
| **Codex**          | Primary AI agent — planning, code generation, self-review, agentic fix loops |
| **GitHub Actions** | Orchestration glue, CI, Linear API calls, PR automation                      |

---

## Human Intervention Points (Summary)

| #   | Where                      | Why human is needed                                |
| --- | -------------------------- | -------------------------------------------------- |
| 1   | Issue creation             | Requirements quality cannot be automated           |
| 2   | Plan approval              | Catches misunderstood scope before code is written |
| 3   | CI failure (after retries) | Ambiguous errors require judgment                  |
| 4   | PR review + merge          | Accountability, security, correctness              |

---

## Implementation Sequencing

To build this incrementally rather than all at once:

1. **Week 1** — Wire Linear webhook → GitHub Action → post a comment back (validate the pipe)
2. **Week 2** — Add Codex plan generation + Linear comment posting
3. **Week 3** — Add branch + Codex code generation for a single simple issue type
4. **Week 4** — Add PR auto-creation + Codex self-review comment
5. **Week 5** — Add Linear status update on merge
6. **Week 6** — Harden with retry loops, Slack notifications, failure escalation

---

## Key Risks

- **Codex hallucinating on unfamiliar APIs** — mitigated by always running `tsc` and tests before PR
- **Runaway commits on ambiguous issues** — mitigated by the plan-approval gate
- **Linear status drift** — mitigated by keying all automation on GitHub merge events, not intermediate states
- **Security** — AI-generated code must still pass SAST; the human PR review gate is non-negotiable

---

## Code Quality Enforcement

AI-generated code bypasses the cognitive checks a developer applies while typing. Enforcement must be layered so no single point of failure lets bad code through.

### Layer 1 — AI Instructions (Before Code Is Written)

The most leveraged layer — prevents bad code from being generated in the first place.

**`AGENTS.md`** is the canonical source of standards, derived directly from `docs/bsava_architecture_plan.md`. It covers project structure, naming conventions, the BFF/gateway pattern, cache strategy, and code standards. Codex reads it before writing any code.

**`CLAUDE.md`** and **`.cursorrules`** mirror the same rules for developers using Claude Code or Cursor locally. These tools are not part of the automated pipeline but developers are free to use them — these files ensure ad-hoc AI assistance produces code that follows the same architecture regardless of which AI generated it.

**Source of truth hierarchy:**

1. `docs/bsava_architecture_plan.md` — architectural decisions live here
2. `AGENTS.md` — enforces the plan for all AI agents (Codex and others)
3. `CLAUDE.md` / `.cursorrules` — mirrors `AGENTS.md` for developer-facing AI tools

If architecture decisions change, update `bsava_architecture_plan.md` first, then `AGENTS.md`, then propagate to the others. Drift between them means different AI tools produce inconsistent code on the same codebase.

---

### Layer 2 — Formatter

Prettier eliminates formatting as a source of review noise. AI output is auto-formatted on save and on commit — no debates, no configuration drift.

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}
```

---

### Layer 3 — Strict Linter + TypeScript

ESLint with zero-warning tolerance:

```js
// eslint.config.mjs
rules: {
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/no-unused-vars": "error",
  "no-console": "error",
  "no-debugger": "error",
}
```

Architectural layer boundaries (app ↔ modules ↔ infrastructure, packages ↔ apps, SDK isolation, caching location) are enforced by scoped `no-restricted-imports` rules in the same config — violations fail `pnpm lint` with a message pointing at the forbidden import. This replaces what was previously done by an LLM verification pass.

TypeScript strict mode in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true
  }
}
```

---

### Layer 4 — Pre-commit Hooks

Catches issues before they reach the remote. Uses **Husky** + **lint-staged**:

```json
// package.json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix --max-warnings=0", "prettier --write"],
  "*.{json,md,css}": ["prettier --write"]
}
```

The `--max-warnings=0` flag turns warnings into errors — important for AI-generated code which often produces lint warnings rather than errors.

Add **commitlint** to enforce conventional commits and Linear issue ID tracing:

```sh
# .husky/commit-msg
pnpm exec commitlint --edit "$1"
```

---

### Layer 5 — CI Gates

The backstop. Even if pre-commit hooks are bypassed with `--no-verify`, CI catches violations before merge.

Turborepo's task graph means a change to `packages/ui` automatically runs lint, typecheck, and tests for both `apps/web` and `apps/native` — no manual scoping needed.

```yaml
# .github/workflows/ci.yml
jobs:
  quality:
    steps:
      - run: pnpm turbo lint # ESLint across all affected packages
      - run: pnpm turbo typecheck # TypeScript across all affected packages
      - run: pnpm turbo test # Tests across all affected packages
      - run: pnpm turbo test --coverage # Coverage threshold enforced per package
```

---

### Layer 6 — Security Scanning

AI-generated code is prone to specific vulnerability classes: injection, insecure defaults, exposed secrets.

| Tool           | Purpose                                             |
| -------------- | --------------------------------------------------- |
| **CodeQL**     | SAST — free for public repos, GitHub-native         |
| **Semgrep**    | OWASP Top 10 + Next.js-specific rule sets           |
| **secretlint** | Catches accidentally committed secrets and API keys |

`secretlint` runs in lint-staged so secrets are caught before commit.

---

### Layer 7 — Branch Protection Rules

Enforces all of the above at the merge gate — makes CI non-skippable, even for admins:

- Require status checks: `lint`, `typecheck`, `test`, `security-scan`
- Require at least 1 human approval
- Dismiss stale reviews on new pushes
- Do not allow bypassing for repository admins

---

### Layer 8 — AI Self-Review Before PR

Before opening a PR, Codex reviews its own output — checking for unused vars, missing tests, security issues, and violations against `AGENTS.md` standards. Violations are fixed before the PR is opened. The review output is posted as a PR comment so human reviewers know what was already checked.

---

### Enforcement Stack Summary

| Layer                    | Tool                               | Blocks if fails?                                                                                                                                         |
| ------------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AI instructions          | `AGENTS.md`                        | Prevents bad output                                                                                                                                      |
| Formatting               | Prettier                           | Pre-commit                                                                                                                                               |
| Linting                  | ESLint (strict)                    | Pre-commit + CI                                                                                                                                          |
| Type safety              | TypeScript strict                  | Pre-commit + CI                                                                                                                                          |
| Commit format            | commitlint                         | Pre-commit                                                                                                                                               |
| Architectural boundaries | ESLint `no-restricted-imports`     | Pre-commit + CI                                                                                                                                          |
| Consolidated AI review   | `pnpm ai:verify` (Codex or Claude) | Fixes critical/warning issues across React/Next.js, tests, branch coverage, dead code, business-logic placement, correctness/safety; review posted to PR |
| Test coverage            | Vitest / Jest threshold            | CI                                                                                                                                                       |
| Security                 | CodeQL + Semgrep + secretlint      | CI                                                                                                                                                       |
| Merge gate               | GitHub branch protection           | Blocks PR merge                                                                                                                                          |
| Human gate               | Required PR approval               | Blocks PR merge                                                                                                                                          |
