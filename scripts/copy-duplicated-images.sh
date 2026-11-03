#!/usr/bin/env bash

# Copies images that an entry references but its folder does not hold.
#
# "Publish and duplicate" in the CMS copies an entry's front matter and body, but
# not its images, so the new entry points at files that stay behind in the
# original's folder and render as broken images. CMS uploads get unique names
# (timestamp plus random suffix), so the missing file can be found by name in
# another entry folder and copied in.
#
# Only bundle-relative references are checked: cover.image in front matter and
# Markdown images in the body. Anything containing / or : is a site path or URL
# and is left alone.

set -euo pipefail

readonly CONTENT_ROOT="${1:-content}"
readonly FEED_SECTIONS=(news publications jobs)

copied=0
errors=0

# Prints cover.image and every body image destination, one per line.
image_references() {
  awk '
    NR == 1 && /^---[[:space:]]*$/ { front = 1; next }
    front && /^---[[:space:]]*$/ { front = 0; next }
    front && /^cover:/ { cover = 1; next }
    front && cover && /^[^[:space:]]/ { cover = 0 }
    front && cover && /^[[:space:]]+image:/ {
      sub(/^[[:space:]]+image:[[:space:]]*/, "")
      gsub(/^["\047]|["\047][[:space:]]*$/, "")
      print
      next
    }
    !front {
      line = $0
      while (match(line, /!\[[^]]*\]\([^)]+\)/)) {
        target = substr(line, RSTART, RLENGTH)
        sub(/^!\[[^]]*\]\(/, "", target)
        sub(/\)$/, "", target)
        sub(/[[:space:]].*$/, "", target)
        print target
        line = substr(line, RSTART + RLENGTH)
      }
    }
  ' "$1"
}

search_roots=()
for section in "${FEED_SECTIONS[@]}"; do
  [[ -d "$CONTENT_ROOT/$section" ]] && search_roots+=("$CONTENT_ROOT/$section")
done

if ((${#search_roots[@]} == 0)); then
  printf 'Nothing to check: no feed sections under %s.\n' "$CONTENT_ROOT"
  exit 0
fi

while IFS= read -r -d '' entry_file; do
  entry_dir=$(dirname "$entry_file")

  while IFS= read -r reference; do
    reference=${reference#./}
    case "$reference" in
      "" | */* | *:*) continue ;;
    esac
    [[ -f "$entry_dir/$reference" ]] && continue

    source_file=$(find "${search_roots[@]}" -type f -name "$reference" \
      -not -path "$entry_dir/*" -print -quit)

    if [[ -z "$source_file" ]]; then
      printf 'ERROR: %s references %s, which is not in its folder or any other entry. Upload the image again in the CMS.\n' \
        "$entry_file" "$reference" >&2
      errors=$((errors + 1))
      continue
    fi

    cp "$source_file" "$entry_dir/$reference"
    printf 'Copied %s into %s (referenced but missing, likely from a CMS duplicate).\n' \
      "$source_file" "$entry_dir"
    copied=$((copied + 1))
  done < <(image_references "$entry_file")
done < <(find "${search_roots[@]}" -mindepth 3 -maxdepth 3 -type f -name 'index.md' -print0)

if ((errors > 0)); then
  printf 'Image copy failed with %s missing image(s).\n' "$errors" >&2
  exit 1
fi

if ((copied == 0)); then
  printf 'No missing entry images found.\n'
else
  printf 'Copied %s missing entry image(s).\n' "$copied"
fi
