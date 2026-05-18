# Content Structure

Use leaf bundles for posts and long-lived records. A leaf bundle is a folder
with an `index.md` file and any images, PDFs, or attachments used only by that
page.

Recommended structure:

```text
content/
  about/
    _index.md
    team.md
    contact.md

  news/
    _index.md
    2026/
      _index.md
      post-slug/
        index.md
        cover.jpg
        flyer.pdf

  models/
    _index.md
    2026/
      _index.md
      project-slug/
        index.md
        cover.jpg
        model-diagram.png

  publications/
    _index.md
    2026/
      _index.md
      publication-slug/
        index.md
        cover.jpg
        paper.pdf

  jobs/
    _index.md
    2026/
      _index.md
      opportunity-slug/
        index.md
        advert.pdf

  collaboration/
    _index.md
```

Rules:

- Use `section/year/page-slug/index.md` for news, models/projects,
  publications, and jobs.
- Keep assets that belong to one page inside that page folder.
- Use `static/images/` only for shared site assets such as logos, partner
  logos, and general banners.
- Keep `collaboration/` as a simple directory page for partner links unless a
  future collaborator needs its own detailed page.
- For post images, use `cover.image` for listing/hero images and normal
  Markdown image syntax for inline images.
- If a post has no `cover.image`, the site automatically shows a section-based
  template image from `static/images/post-templates/`.

Example page front matter:

```yaml
---
title: "Project or Post Title"
date: 2026-05-18
author: "Author Name"
summary: "Short summary for listing pages."
categories: ["Models"]
tags: ["modelling", "software"]
cover:
  image: "cover.jpg"
  alt: "Short image description"
---
```

If you do not have a real image yet, leave `cover` out entirely. The site will
use one of these default templates:

```text
static/images/post-templates/news.svg
static/images/post-templates/models.svg
static/images/post-templates/publications.svg
static/images/post-templates/jobs.svg
static/images/post-templates/default.svg
```

Multiple authors are also supported:

```yaml
author: ["First Author", "Second Author"]
```

Inline image example:

```markdown
![Workshop participants](workshop-photo.jpg)
```
