---
title: "Example Publication Record"
date: 2026-05-12
author: ["First Author", "Second Author"]
summary: "A placeholder publication entry showing how publications can be listed on the site."
categories: ["Publications"]
tags: ["publication", "preprint", "methods"]
cover:
  image: "cover.svg"
  alt: "Placeholder cover image for a publication record"
  caption: "Replace `cover.svg` with a journal image, graphical abstract, or project image."
---

Replace this placeholder with a real paper, preprint, technical report, or policy brief.

A publication page can include citation details, DOI, abstract, project links, code availability, data availability, funder information, and related news posts.

## Example Publication Figure

For a publication page, keep paper-specific images and PDFs in the same folder:

```text
content/publications/2026/example-publication-record/
  index.md
  cover.jpg
  graphical-abstract.jpg
  paper.pdf
```

Then reference them in the page:

```markdown
![Graphical abstract](graphical-abstract.jpg)

[Download the paper](paper.pdf)
```

Placeholder figure:

![Example graphical abstract](graphical-abstract.svg)
