#!/usr/bin/env bash

# Removes entry folders left behind when a post is deleted through the CMS.
#
# Decap's deleteEntry only removes the entry file itself, so deleting a post in
# /admin/ leaves its folder in place with every uploaded image still inside — and
# Hugo keeps publishing those images even though the post page is gone.
#
# An entry folder lives at content/<section>/<year>/<slug>/, which is the depth
# implied by `path: "{{year}}/{{slug}}/index"` in static/admin/config.yml. Only
# that exact depth is scanned, and a folder is removed only when it holds neither
# index.md (leaf bundle) nor _index.md (branch bundle) — so sections, year
# folders, and asset subfolders nested inside a real entry are never touched.

set -euo pipefail

readonly CONTENT_ROOT="${1:-content}"

if [[ ! -d "$CONTENT_ROOT" ]]; then
  printf 'Nothing to prune: %s does not exist.\n' "$CONTENT_ROOT"
  exit 0
fi

pruned=0

while IFS= read -r -d '' entry_dir; do
  if [[ -f "$entry_dir/index.md" || -f "$entry_dir/_index.md" ]]; then
    continue
  fi

  leftovers=$(find "$entry_dir" -type f | wc -l)
  leftovers=${leftovers//[[:space:]]/}

  printf 'Pruning %s (%s leftover file(s), no index.md).\n' "$entry_dir" "$leftovers"
  rm -rf "$entry_dir"
  pruned=$((pruned + 1))
done < <(find "$CONTENT_ROOT" -mindepth 3 -maxdepth 3 -type d -print0)

if ((pruned == 0)); then
  printf 'No orphaned entry folders found.\n'
else
  printf 'Pruned %s orphaned entry folder(s).\n' "$pruned"
fi
