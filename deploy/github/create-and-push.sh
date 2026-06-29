#!/usr/bin/env bash
# ===========================================================================
# Create the GitHub repository `takeawaypack-website` and push this project.
# ===========================================================================
# This script is NON-DESTRUCTIVE and IDEMPOTENT:
#   - It will NOT delete or force-push anything.
#   - If the repo already exists on GitHub, it skips creation and just pushes.
#   - If `origin` already exists, it reuses it.
#
# The repository root is THIS project folder (it contains source/, deploy/,
# content/, docs). Vercel then builds with Root Directory = source/.
#
# Requirements: git + the `gh` CLI (https://cli.github.com), authenticated.
# Run from the project root:  bash deploy/github/create-and-push.sh
#
# NOTE: This project folder lives inside a larger workspace git repository.
# Running `git init` here creates a NESTED repository for the standalone
# GitHub push. That is intentional and does not affect the parent workspace.
# ===========================================================================

set -euo pipefail

REPO_NAME="takeawaypack-website"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

VISIBILITY="${REPO_VISIBILITY:-public}"   # public | private
BRANCH="${REPO_BRANCH:-main}"

# --- 0. Preflight -----------------------------------------------------------
if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: GitHub CLI (gh) is not installed or not on PATH." >&2
  echo "Install: https://cli.github.com  then run: gh auth login" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh is not authenticated." >&2
  echo "Run:  gh auth login" >&2
  echo "(Choose GitHub.com → HTTPS → login with a web browser or paste a token.)" >&2
  exit 1
fi

echo "→ Working in: $ROOT"
echo "→ Repo: $REPO_NAME ($VISIBILITY), branch: $BRANCH"

# --- 1. Initialize git (nested repo) if needed -----------------------------
if [ ! -d ".git" ]; then
  echo "→ Initializing a new git repository in $ROOT"
  git init -b "$BRANCH" >/dev/null
else
  echo "→ .git already exists; reusing."
fi

# Ensure the root .gitignore exists so node_modules/.next/env are excluded.
if [ ! -f ".gitignore" ]; then
  echo "→ Writing root .gitignore"
  cat > .gitignore <<'EOF'
source/node_modules/
source/.next/
source/out/
source/build/
source/.vercel/
source/next-env.d.ts
.env
.env*.local
source/.env
source/.env*.local
*.log
logs/
.DS_Store
.idea/
.vscode/
.temp/
source/.data/
EOF
fi

# --- 2. Commit --------------------------------------------------------------
git add -A
if git diff --cached --quiet; then
  echo "→ Nothing new to commit."
else
  git commit -m "Initial commit: Takeawaypack B2B inquiry website (Next.js + Supabase)"
fi

# Ensure we're on the target branch.
git branch -M "$BRANCH" 2>/dev/null || true

# --- 3. Create remote repo if needed ----------------------------------------
REMOTE_URL="https://github.com/$(gh api user --jq .login)/${REPO_NAME}.git"

if ! git remote get-url origin >/dev/null 2>&1; then
  if gh repo view "$REPO_NAME" >/dev/null 2>&1; then
    echo "→ GitHub repo already exists; adding remote only."
  else
    echo "→ Creating GitHub repo '$REPO_NAME' ($VISIBILITY)…"
    gh repo create "$REPO_NAME" --"$VISIBILITY" --description "B2B inquiry website for takeaway packaging (Next.js + Supabase + Vercel)" >/dev/null
  fi
  git remote add origin "$REMOTE_URL"
else
  echo "→ Remote 'origin' already configured: $(git remote get-url origin)"
fi

# --- 4. Push ----------------------------------------------------------------
echo "→ Pushing to origin/${BRANCH}..."
git push -u origin "$BRANCH"

echo ""
echo "✓ Done. Repo: https://github.com/$(gh api user --jq .login)/$REPO_NAME"
echo "  Next: import into Vercel (see deploy/vercel/deploy.md)."
