# TDMod.Net Website

Hugo website for the TDMod.Net research and modelling group. The site is built
with the PaperMod theme plus local custom layouts and styling for a simple
academic news/blog layout.

## Requirements

- Hugo Extended
- Git
- PaperMod theme submodule in `themes/PaperMod`

Check Hugo:

```bash
hugo version
```

## Local Development

Run the local server:

```bash
hugo server -D --renderToMemory --bind 127.0.0.1 --port 1313
```

Open:

```text
http://localhost:1313/
```

The development config is in:

```text
config/development/hugo.toml
```

It sets local links to `http://localhost:1313/`. Production builds use the
root `hugo.toml` `baseURL`.

## Build

Build the production site:

```bash
hugo --cleanDestinationDir
```

`public/` is generated output and should normally not be committed when GitHub
Actions or another deployment system builds the site.

## Content Structure

Use one folder per post or record. Keep images, PDFs, and related files inside
the same folder as that post.

```text
content/
  news/
    2026/
      post-slug/
        index.md
        cover.jpg
        figure-1.jpg

  models/
    2026/
      project-slug/
        index.md
        cover.jpg
        model-diagram.png

  publications/
    2026/
      publication-slug/
        index.md
        cover.jpg
        paper.pdf

  jobs/
    2026/
      opportunity-slug/
        index.md
        advert.pdf

  collaboration/
    _index.md
```

`collaboration/` is intended as a simple partner-link page, similar to `about/`,
rather than a news feed.

More detail is in:

```text
CONTENT_STRUCTURE.md
```

## Front Matter

Example post:

```yaml
---
title: "Post Title"
date: 2026-05-18
author: "Author Name"
summary: "Short summary for listing pages."
categories: ["News"]
tags: ["training", "modelling"]
cover:
  image: "cover.jpg"
  alt: "Short image description"
---
```

Multiple authors:

```yaml
author: ["First Author", "Second Author"]
```

## Images

For a post-specific cover image, put the image in the same folder as `index.md`:

```text
content/news/2026/example-post/
  index.md
  cover.jpg
```

Then reference it in front matter:

```yaml
cover:
  image: "cover.jpg"
  alt: "Description of the cover image"
```

For inline images:

```markdown
![Workshop participants](workshop-photo.jpg)
```

If a post does not have `cover.image`, the site automatically uses a section
template from:

```text
static/images/post-templates/
```

## Important Files

```text
hugo.toml
config/development/hugo.toml
layouts/index.html
layouts/list.html
layouts/_partials/header.html
layouts/_partials/cover.html
layouts/_partials/td-card-cover.html
assets/css/extended/tdmod-academic.css
static/images/post-templates/
```

## Git Notes

Do not commit generated Hugo output unless the deployment workflow requires it.
The `.gitignore` excludes:

```text
/public/
/resources/_gen/
.hugo_build.lock
```

If `public/` was already tracked before adding `.gitignore`, remove it from Git
tracking without deleting local files:

```bash
git rm -r --cached public
```
