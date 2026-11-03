#!/usr/bin/env bash

# Catches CMS entries saved at a path Hugo will never render as a page.
#
# Decap builds an entry's path from `{{year}}/{{slug}}/index` in
# static/admin/config.yml, with the slug taken from the title. Two failure modes
# end up silently missing from the site:
#
# - Same title twice in one year. Decap makes the path unique by appending -1 to
#   the whole path, so the second entry lands at <year>/<slug>/index-1.md inside
#   the first entry's bundle, where Hugo treats it as a page resource.
# - A title with no English letters. The ascii slug comes out empty, so the
#   entry lands at <year>/index.md beside the year's _index.md.

set -euo pipefail

readonly CONTENT_ROOT="${1:-content}"
readonly FEED_SECTIONS=(news publications jobs)

errors=0

for section in "${FEED_SECTIONS[@]}"; do
  section_dir="$CONTENT_ROOT/$section"
  [[ -d "$section_dir" ]] || continue

  while IFS= read -r -d '' year_dir; do
    if [[ -f "$year_dir/index.md" ]]; then
      printf 'ERROR: %s/index.md has no slug folder. Its title had no English letters; delete it in the CMS and create it again with an English word in the title.\n' \
        "$year_dir" >&2
      errors=$((errors + 1))
    fi

    while IFS= read -r -d '' duplicate; do
      printf 'ERROR: %s shares a title with another entry from the same year and will not be published. Delete it in the CMS and create it again with a different title, then check which images in %s belong to it.\n' \
        "$duplicate" "$(dirname "$duplicate")" >&2
      errors=$((errors + 1))
    done < <(find "$year_dir" -mindepth 2 -maxdepth 2 -type f -name 'index-*.md' -print0)
  done < <(find "$section_dir" -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9][0-9]' -print0)
done

if ((errors > 0)); then
  printf 'Content path validation failed with %s error(s).\n' "$errors" >&2
  exit 1
fi

printf 'Content path validation passed.\n'
