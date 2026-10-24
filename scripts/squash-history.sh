#!/usr/bin/env bash
# Squash everything older than RETAIN_DAYS (default 30) into a single baseline commit, keeping the
# recent commits as they are. The tree at every kept commit is preserved byte-for-byte, so the data is
# untouched — only the older history is gone.
#
#   scripts/squash-history.sh [--days 30] [--push]
#
# Why rebuild commits with commit-tree instead of rebasing: replaying trees cannot conflict. The
# alternative (git rebase --onto) re-applies diffs and can stop halfway through a data repository,
# which is the worst possible failure for an unattended job.
set -euo pipefail

DAYS=30
PUSH=0
while [ $# -gt 0 ]; do
  case "$1" in
    --days) DAYS="$2"; shift 2 ;;
    --push) PUSH=1; shift ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

BRANCH="${BRANCH:-$(git rev-parse --abbrev-ref HEAD)}"
CUTOFF="$(date -u -v-"${DAYS}"d +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || date -u -d "${DAYS} days ago" +%Y-%m-%dT%H:%M:%SZ)"

OLDEST="$(git rev-list --reverse "$BRANCH" | head -1)"
OLDEST_DATE="$(git log -1 --format=%aI "$OLDEST")"
if [ "$OLDEST_DATE" \> "$CUTOFF" ] || [ "$OLDEST_DATE" = "$CUTOFF" ]; then
  echo "oldest commit ($OLDEST_DATE) is inside the ${DAYS}d window — nothing to squash"
  exit 0
fi

# First commit that falls inside the window; everything before it becomes one baseline commit.
FIRST_KEPT="$(git log --reverse --format='%H %aI' "$BRANCH" | awk -v c="$CUTOFF" '$2 >= c {print $1; exit}')"
if [ -z "$FIRST_KEPT" ]; then
  echo "no commit inside the ${DAYS}d window — refusing to squash the entire history"
  exit 1
fi

TOTAL="$(git rev-list --count "$BRANCH")"
KEPT="$(git rev-list --count "$FIRST_KEPT".."$BRANCH")"

PARENT_DATE="$(git log -1 --format=%aI "$FIRST_KEPT^")"
BASE_TREE="$(git rev-parse "$FIRST_KEPT^{tree}")"
TREE_BEFORE="$(git rev-parse "HEAD^{tree}")"

# 1) one root commit holding the tree as it stood at the cutoff
NEW_ROOT="$(GIT_AUTHOR_DATE="$PARENT_DATE" GIT_COMMITTER_DATE="$PARENT_DATE" \
  git commit-tree "$BASE_TREE" -m "baseline $(date -u +%Y-%m-%d): history before this point squashed")"

# 2) replay the kept commits on top, preserving each tree, message and author date
TIP="$NEW_ROOT"
while read -r sha; do
  [ -z "$sha" ] && continue
  ADATE="$(git log -1 --format=%aI "$sha")"
  MSG="$(git log -1 --format=%s "$sha")"
  TREE="$(git rev-parse "$sha^{tree}")"
  TIP="$(GIT_AUTHOR_DATE="$ADATE" GIT_COMMITTER_DATE="$ADATE" \
    git commit-tree "$TREE" -p "$TIP" -m "$MSG")"
done <<< "$(git rev-list --reverse "$FIRST_KEPT".."$BRANCH")"

if [ "$(git rev-parse --abbrev-ref HEAD)" = "$BRANCH" ]; then
  git reset -q --hard "$TIP"
else
  git branch -f "$BRANCH" "$TIP"
  git checkout -q "$BRANCH"
fi

TREE_AFTER="$(git rev-parse "HEAD^{tree}")"
echo "squashed: $TOTAL commits → $((KEPT + 1)) (1 baseline + $KEPT kept, ${DAYS}d window)"
if [ "$TREE_BEFORE" != "$TREE_AFTER" ]; then
  echo "ERROR: tree changed ($TREE_BEFORE → $TREE_AFTER)" >&2
  exit 1
fi
echo "tree unchanged: ${TREE_AFTER:0:12}"

if [ "$PUSH" = "1" ]; then
  git push --force-with-lease origin "$BRANCH"
fi
