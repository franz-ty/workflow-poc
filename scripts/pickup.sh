#!/usr/bin/env bash
set -euo pipefail

IDENTIFIER="${1:?Usage: ./scripts/pickup.sh <identifier>  (e.g. TY-7)}"

# Load .env if present
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

if [ -z "${LINEAR_API_KEY:-}" ]; then
  echo "Error: LINEAR_API_KEY is not set."
  echo "Add it to a .env file in the repo root, or export it in your shell."
  exit 1
fi

echo "Fetching $IDENTIFIER from Linear..."

RESPONSE=$(curl -s -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d "$(jq -n --arg id "$IDENTIFIER" \
    '{"query": "{ issue(id: \"\($id)\") { identifier title description } }"}')")

TITLE=$(echo "$RESPONSE" | jq -r '.data.issue.title')
DESCRIPTION=$(echo "$RESPONSE" | jq -r '.data.issue.description // "No description provided."')

if [ "$TITLE" = "null" ] || [ -z "$TITLE" ]; then
  echo "Error: Could not fetch issue $IDENTIFIER. Check your LINEAR_API_KEY and identifier."
  exit 1
fi

# Create branch
SLUG=$(echo "$TITLE" \
  | tr '[:upper:]' '[:lower:]' \
  | sed 's/[^a-z0-9]/-/g' \
  | sed 's/-\+/-/g' \
  | sed 's/^-//' \
  | sed 's/-$//' \
  | cut -c1-50)
BRANCH="feat/${IDENTIFIER,,}-${SLUG}"

if git show-ref --quiet "refs/heads/$BRANCH"; then
  git checkout "$BRANCH"
  echo "Switched to existing branch: $BRANCH"
else
  git checkout -b "$BRANCH"
  echo "Created branch: $BRANCH"
fi

# Write task context file
cat > TASK.md << TASK
# $IDENTIFIER — $TITLE

$DESCRIPTION

---

## Instructions

You are implementing the Linear issue above in this codebase.

1. Read \`AGENTS.md\` — it defines the folder structure, naming conventions, BFF/gateway pattern, and code standards. Follow it exactly.
2. Implement only what the issue describes. Do not add unrequested features or refactor surrounding code.
3. Write a test for every new function (co-located next to the file it tests).
4. When done, verify with: \`pnpm turbo typecheck lint test\`

**Branch:** \`$BRANCH\`
TASK

echo ""
echo "  Issue : $IDENTIFIER — $TITLE"
echo "  Branch: $BRANCH"
echo "  Context written to TASK.md"
echo ""
echo "Suggested prompt for your AI:"
echo "────────────────────────────────────────────────────────"
echo "  Read TASK.md and AGENTS.md, then implement the issue."
echo "────────────────────────────────────────────────────────"
echo ""
