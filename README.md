# TDMod.Net Website

Website: https://moru-rse.github.io/TDMod.Net/

TDMod.Net is the website of the Tropical Diseases Modelling Network.  
The website is designed to be a central place for sharing the network’s news, activities, research updates, opportunities, and selected outputs.

The main purpose of this website is to help communicate the work of the group in a clear and accessible way. It brings together updates from the team, information about modelling projects, publications, events, and possible routes for collaboration.

## Purpose of the Website

This website can be used to:

- Share news and activity updates from the group.
- Announce workshops, meetings, seminars, training, and field activities.
- Present modelling projects, tools, workflows, and related resources.
- Keep a simple record of publications and research outputs.
- Share job opportunities, student projects, expressions of interest, and collaboration opportunities.
- Provide general information about the network and its activities.

## Main Sections

The website is organized into the following main sections:

```text
content/
  about/           Group overview and general information
  news/            News, events, activities, and announcements
  models/          Modelling projects, tools, and workflows
  publications/    Publications and research outputs
  jobs/            Opportunities and expressions of interest
  collaboration/   Collaboration information and partner links
```

## Content Management

This site includes a Decap CMS admin interface at `/TDMod.Net/admin/` on
GitHub Pages (`/admin/` in local development), so editors can manage content
through a browser instead of editing Markdown files directly.

Editors manage the four feed sections — news, models, publications, and jobs.
The home page, About, Collaboration, and the section introductions are edited in
the repository by a developer.

Documentation:

- `CMS_GUIDE.md` — running the CMS: GitHub authentication, the Draft toggle and
  publishing behaviour, image optimization, and media growth limits.
- `CONTENT_GUIDE.md` — writing content: folder layout, front matter fields,
  slugs, covers, and the pre-publish checklist.

## Local Development

The PaperMod theme is a git submodule, so a fresh clone needs it initialised:

```sh
git clone https://github.com/MORU-RSE/TDMod.Net.git
cd TDMod.Net
git submodule update --init --recursive
hugo server
```

Use plain `hugo server`, not `hugo server -D`: the `-D` flag builds draft pages,
so drafts appear locally that will never appear on the live site.

To exercise the CMS locally, run `npx decap-server` alongside `hugo server` and
open `http://localhost:1313/admin/`. The local backend writes straight to the
working copy, so no GitHub login is required.

Checks the deployment also runs:

```sh
node --test tests/image-optimizer.test.js
bash scripts/validate-media.sh
bash scripts/prune-orphan-bundles.sh
hugo --minify --cleanDestinationDir
```

Editors publish by committing to `main` through the CMS, so pull before starting
local work.
