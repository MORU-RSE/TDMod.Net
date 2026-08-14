#!/usr/bin/env bash

set -euo pipefail

readonly MAX_RASTER_BYTES=$((1024 * 1024))
readonly WARN_TOTAL_BYTES=$((300 * 1024 * 1024))
readonly STOP_TOTAL_BYTES=$((500 * 1024 * 1024))

total_bytes=0
errors=0
media_roots=("$@")

# Preserve the two default roots as separate arguments when none are supplied.
if (($# == 0)); then
  media_roots=(content static)
fi

is_approved_svg() {
  case "$1" in
    static/images/research-banner.svg | \
      static/images/post-templates/*.svg)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

while IFS= read -r -d '' file_path; do
  file_size=$(wc -c < "$file_path")
  file_size=${file_size//[[:space:]]/}
  total_bytes=$((total_bytes + file_size))
  extension=${file_path##*.}
  extension=$(printf '%s' "$extension" | tr '[:upper:]' '[:lower:]')

  case "$extension" in
    jpg | jpeg | png | webp)
      if ((file_size > MAX_RASTER_BYTES)); then
        printf 'ERROR: %s is %s bytes; raster images must not exceed %s bytes.\n' \
          "$file_path" "$file_size" "$MAX_RASTER_BYTES" >&2
        errors=$((errors + 1))
      fi
      ;;
    svg)
      if ! is_approved_svg "$file_path"; then
        printf 'ERROR: %s is a new SVG. CMS uploads must be JPEG, PNG, or WebP.\n' \
          "$file_path" >&2
        errors=$((errors + 1))
      fi
      ;;
    gif | bmp | tif | tiff)
      printf 'ERROR: %s uses unsupported image format .%s. Convert it to WebP.\n' \
        "$file_path" "$extension" >&2
      errors=$((errors + 1))
      ;;
  esac
done < <(find "${media_roots[@]}" -type f \
  \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \
  -o -iname '*.svg' -o -iname '*.gif' -o -iname '*.bmp' -o -iname '*.tif' \
  -o -iname '*.tiff' \) -print0)

printf 'Tracked image size: %s bytes.\n' "$total_bytes"

if ((total_bytes >= STOP_TOTAL_BYTES)); then
  printf 'ERROR: Tracked images reached the 500 MB stop threshold. Review external storage before adding more media.\n' >&2
  errors=$((errors + 1))
elif ((total_bytes >= WARN_TOTAL_BYTES)); then
  printf 'WARNING: Tracked images exceeded 300 MB. Begin an image-storage review.\n' >&2
  if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
    printf '::warning::Tracked images exceeded 300 MB. Begin an image-storage review.\n'
  fi
fi

if ((errors > 0)); then
  printf 'Media validation failed with %s error(s).\n' "$errors" >&2
  exit 1
fi

printf 'Media validation passed.\n'
