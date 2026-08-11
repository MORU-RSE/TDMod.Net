# Content Guide

This guide describes how to add and organize content for the TDMod.Net website.
Use it when creating news posts, project pages, publication records,
opportunity pages, and collaboration information.

## General Approach

Use one folder per post or record. Each folder should contain an `index.md`
file plus any images, PDFs, diagrams, or attachments that belong only to that
page.

This Hugo pattern is called a leaf bundle:

```text
content/news/2026/example-post/
  index.md
  cover.webp
  figure-1.webp
  flyer.pdf
```

Keeping page-specific files in the same folder makes posts easier to copy,
archive, review, and maintain.

## Recommended Structure

```text
content/
  about/
    _index.md

  news/
    _index.md
    2026/
      _index.md
      post-slug/
        index.md
        cover.webp
        attachment.pdf

  models/
    _index.md
    2026/
      _index.md
      project-slug/
        index.md
        cover.webp
        model-diagram.webp

  publications/
    _index.md
    2026/
      _index.md
      publication-slug/
        index.md
        cover.webp
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

## Section Guidelines

Use `news/` for group announcements, meetings, workshops, seminars, training,
field updates, website updates, and other short activity posts.

Use `models/` for modelling projects, software tools, dashboards, analysis
workflows, data pipelines, reproducible research resources, and project status
pages.

Use `publications/` for papers, preprints, reports, policy briefs, technical
documents, and other research outputs. Attach PDFs or figures in the same page
folder when appropriate.

Use `jobs/` for vacancies, student projects, fellowships, internships,
consultancies, and expressions of interest.

Use `collaboration/` as a simple directory or information page for partner
links, collaboration routes, and ways to work with the team. It does not need
to behave like a news feed unless the site later needs detailed collaborator
pages.

Use `about/` for stable information about the team, mission, host institution,
research themes, contact routes, and governance.

## File And Slug Rules

- Use `section/year/page-slug/index.md` for news, models, publications, and
  jobs.
- Use lowercase slugs with hyphens, for example `modelling-workshop-2026`.
- Keep page-specific images, PDFs, and attachments inside the same page folder.
- Use `static/images/` only for shared site assets such as banners, logos,
  partner logos, and default template images.
- Avoid editing generated files in `public/`; they are rebuilt by Hugo.

## Front Matter

Each post or record should start with front matter like this:

```yaml
---
title: "Project or Post Title"
date: 2026-05-18
author: "Author Name"
summary: "Short summary for listing pages."
categories: ["News"]
tags: ["training", "modelling"]
cover:
  image: "cover.webp"
  alt: "Short image description"
---
```

Use `summary` for the short text shown in listing pages. Keep it concise,
usually one sentence.

Multiple authors are supported:

```yaml
author: ["First Author", "Second Author"]
```

## Covers And Images

For a page-specific cover image, put the image in the same folder as
`index.md`:

```text
content/news/2026/example-post/
  index.md
  cover.webp
```

Then reference it in front matter:

```yaml
cover:
  image: "cover.webp"
  alt: "Workshop participants during a modelling session"
```

For inline images, use normal Markdown:

```markdown
![Workshop participants](workshop-photo.webp)
```

When an editor uploads a JPEG, PNG, or WebP file through `/admin/`, the browser
automatically resizes it to at most 1600 pixels on its longest side and converts
it to a WebP file targeting 500 KB. GIF, BMP, TIFF, and SVG uploads are not
accepted. Always add useful alt text in the CMS.

Images committed manually must be no larger than 1 MB. Run
`bash scripts/validate-media.sh` before committing manual image changes.

If a post does not have `cover.image`, the site automatically uses a
section-based template image from:

```text
static/images/post-templates/
```

Current default templates:

```text
static/images/post-templates/news.svg
static/images/post-templates/models.svg
static/images/post-templates/publications.svg
static/images/post-templates/jobs.svg
static/images/post-templates/collaboration.svg
static/images/post-templates/default.svg
```

## Content Checklist

Before publishing a new page, check that:

- The page is in the correct section and year folder.
- The title, date, author, summary, categories, and tags are filled in.
- Images have useful `alt` text.
- New raster images are WebP where practical and no file is larger than 1 MB.
- Links to PDFs, papers, repositories, or partner websites work.
- The page builds locally with `hugo --minify --cleanDestinationDir`.
