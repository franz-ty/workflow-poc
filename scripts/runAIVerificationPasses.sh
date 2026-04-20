#!/usr/bin/env bash

set -euo pipefail

if [[ "${1:-}" == "--" ]]; then
  shift
fi

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  cat <<'EOF'
Usage: pnpm ai:verify -- [linear-issue-id]

Runs the consolidated AI verification pass against the current worktree.
Architectural import boundaries are enforced separately by ESLint.
If no issue id is provided, the script uses LOCAL-RUN in the prompts.

Environment variables:
  AI_CLI              Which CLI drives the pass: codex | claude (default: codex)
  AI_BYPASS           Set to 1 to use full-bypass mode instead of the scoped sandbox.
                      Only safe in ephemeral CI runners.
  BASE_REF            Base ref used for diff reasoning (default: origin/main, fallback: main)
  VALIDATION_COMMAND  Command run after the pass to confirm the worktree still passes checks (default: pnpm quality)
  AI_REVIEW_OUTPUT    File written by the review pass (default: /tmp/ai-review.md)
EOF
  exit 0
fi

AI_CLI="${AI_CLI:-codex}"
AI_BYPASS="${AI_BYPASS:-0}"

case "$AI_CLI" in
  codex|claude) ;;
  *)
    echo "Unsupported AI_CLI: $AI_CLI (supported: codex, claude)"
    exit 1
    ;;
esac

if ! command -v "$AI_CLI" >/dev/null 2>&1; then
  echo "$AI_CLI CLI is required to run local verification passes"
  exit 1
fi

IDENTIFIER="${1:-LOCAL-RUN}"
BASE_REF="${BASE_REF:-origin/main}"
VALIDATION_COMMAND="${VALIDATION_COMMAND:-pnpm quality}"
ADVERSARIAL_REVIEW_FILE="${AI_REVIEW_OUTPUT:-/tmp/ai-review.md}"
CLAUDE_ALLOWED_TOOLS="Read Grep Glob Edit Write Bash(git *) Bash(pnpm *) Bash(rg *) Bash(ls *) Bash(cat *)"

if ! git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
  if git rev-parse --verify main >/dev/null 2>&1; then
    BASE_REF="main"
  else
    echo "Unable to resolve a base ref. Set BASE_REF explicitly before running the local verification passes."
    exit 1
  fi
fi

invoke_ai() {
  local prompt="$1"
  case "$AI_CLI" in
    codex)
      if [[ "$AI_BYPASS" == "1" ]]; then
        codex exec --dangerously-bypass-approvals-and-sandbox "$prompt"
      else
        codex exec --full-auto "$prompt"
      fi
      ;;
    claude)
      if [[ "$AI_BYPASS" == "1" ]]; then
        claude -p "$prompt" --dangerously-skip-permissions
      else
        claude -p "$prompt" \
          --permission-mode acceptEdits \
          --allowedTools "$CLAUDE_ALLOWED_TOOLS"
      fi
      ;;
  esac
}

run_validation() {
  local pass_name="$1"

  echo "::group::Validation — ${pass_name}"
  eval "$VALIDATION_COMMAND"
  echo "::endgroup::"
}

run_ai_pass() {
  local pass_name="$1"
  local prompt
  prompt="$(cat)"

  echo "::group::AI verification — ${pass_name} (${AI_CLI})"
  invoke_ai "$prompt"
  echo "::endgroup::"

  run_validation "$pass_name"
}

run_ai_pass "Consolidated verification" <<EOF
You are the verification pass for Linear issue ${IDENTIFIER}.

Review the current git diff against ${BASE_REF} and inspect the changed files. Treat this as an adversarial review — assume the diff contains bugs. "Looks good" is not an acceptable outcome.

Note: architectural import boundaries (app ↔ infrastructure ↔ modules, packages ↔ apps, SDK isolation, cache location) are enforced by ESLint (\`pnpm lint\`). Do not re-check import graphs — focus on what a linter cannot catch.

Work through the checklist below. For each section, fix every critical or warning-level issue you find. Keep nits for the summary only.

## 1. React / Next.js (AGENTS.md)
- Server-first boundaries: \`'use client'\` only where browser APIs or interactivity require it; push it to leaves.
- No client-side data fetching or derived-state \`useEffect\`; compute during render or fetch on the server.
- Next.js conventions: \`next/image\`, \`next/link\`, \`next/font\`, Metadata API, \`loading.tsx\`/\`error.tsx\` boundaries.
- Accessibility: labels on form inputs, alt text on images, semantic HTML, keyboard-accessible interactive elements.
- No large client-only dependencies pulled into server-renderable components.

## 2. Tests (quality + branch coverage)
- For every changed assertion: if the production code it covers were deleted, would the test fail? Rewrite weak assertions.
- Flag and fix tests that over-mock and do not exercise real behavior.
- Enumerate conditional branches in the changed code (if/else, switch, ternary, early return, try/catch, fallback). Confirm a test covers each meaningful path. Add missing coverage.

## 3. Scope and dead code
- Every new export, function, type, and constant is actually used.
- No unjustified new dependencies.
- Scope stays tight to the approved implementation — tighten a sprawling change rather than widening it.

## 4. Business logic placement
- \`apps/web/src/app/**\` route files (\`page.tsx\`, \`layout.tsx\`, \`route.ts\`) contain only entrypoint wiring and metadata. Data fetching, orchestration, and business logic belong in \`modules/<feature>/server/\`. Move anything that drifted.

## 5. Correctness and safety
- Logic errors, off-by-one, missing validation at boundaries (API routes, form submissions — Zod-validated).
- Silent failures, swallowed errors, unhandled edge cases.
- Security issues: input trust, \`dangerouslySetInnerHTML\` without sanitisation, leaked secrets.

## Instructions
- Fix every critical or warning-level issue found.
- Preserve nit-level observations in the summary only — do not spend fixes on them.
- Before exiting, leave the worktree in a state that passes \`${VALIDATION_COMMAND}\`.

## Output
Write the final review summary to ${ADVERSARIAL_REVIEW_FILE}, with these sections:
1. What changed (1–2 sentences).
2. Issues found and fixed, grouped by checklist section.
3. Remaining nits, if any.
4. Residual risks for the human reviewer.
EOF

if [ ! -s "$ADVERSARIAL_REVIEW_FILE" ]; then
  echo "::error::Review summary file was not created"
  exit 1
fi

echo "Review summary saved to $ADVERSARIAL_REVIEW_FILE"
