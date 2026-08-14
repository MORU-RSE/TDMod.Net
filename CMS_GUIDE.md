# Decap CMS Setup

This site includes a Decap CMS admin interface at `/TDMod.Net/admin/` on the
GitHub Pages deployment and `/admin/` in local development.

## What Editors Can Manage

- News / Activities
- Models / Projects
- Publications
- Jobs / Opportunities

That is the whole list. The home page, About, Collaboration, and the section
introduction pages are **not** in the CMS: they change rarely and are edited in
`content/**/_index.md` by a developer. Homepage copy such as the hero text,
metrics, and quick links lives in `hugo.toml` and is likewise developer-edited.

New feed items are saved as Hugo leaf bundles, for example:

```text
content/news/2026/example-post/index.md
content/news/2026/example-post/cover.webp
```

## GitHub Authentication

The CMS uses the GitHub backend:

```yaml
backend:
  name: github
  repo: MORU-RSE/TDMod.Net
  branch: main
  base_url: https://tdmod-net-oauth.moru-rse.workers.dev
  auth_endpoint: /auth
```

Editors need GitHub accounts with write access to the repository.

GitHub OAuth requires a small authentication service. Use the free Cloudflare
Worker template linked below so the public website can remain on GitHub Pages.

1. Create a free Cloudflare account owned by the team. Do not enable R2 or add a
   payment method.
2. Clone `sterlingwes/decap-proxy`, copy `wrangler.toml.sample` to
   `wrangler.toml`, choose a Worker name, run `npx wrangler login`, then run
   `npx wrangler deploy`. Keep `workers.dev` enabled and leave
   `GITHUB_REPO_PRIVATE` at `0` while this repository is public.
3. Create a GitHub OAuth App. Use the Worker URL as its homepage and
   `<worker-url>/callback` as its callback URL.
4. Store `GITHUB_OAUTH_ID` and `GITHUB_OAUTH_SECRET` as encrypted Worker
   secrets, either in the Cloudflare dashboard or with
   `npx wrangler secret put <NAME>`. Never put them in this repository.
5. The deployed Worker URL is configured as
   `https://tdmod-net-oauth.moru-rse.workers.dev` in
   `static/admin/config.yml`.
6. An owner of `MORU-RSE` must approve `TDMod.Net CMS` under the organization's
   OAuth app policy before the CMS can write to the organization repository.
7. Add each editor to `MORU-RSE/TDMod.Net` with repository write access.

Useful Decap docs:

- https://decapcms.org/docs/github-backend/
- https://decapcms.org/docs/backends-overview/#using-github-with-an-oauth-proxy
- https://github.com/sterlingwes/decap-proxy

## Publishing

`publish_mode: simple` is enabled. Saving in the CMS commits directly to `main`,
which starts the existing GitHub Pages deployment workflow. Every editor is
therefore a publisher.

### The Draft toggle decides what is public, not the Publish button

Each entry has a **Draft** switch that is on by default. It maps to Hugo's
`draft` front matter, and the deployment builds without `--buildDrafts`, so a
draft entry is never rendered on the live site.

This means "Publish" in the CMS only means "commit to the repository". An entry
saved with Draft still on is stored safely and stays invisible to the public.
Turning Draft off and saving is what puts a page on the site, about a minute
later once the workflow finishes.

The Publish button also offers "Publish and create new" and "Publish and
duplicate". All three save identically; they differ only in what the editor sees
next, with duplicate pre-filling a copy of the current entry.

### Do not change the year of an existing entry

An entry's folder is chosen from `date` when it is first saved. Editing the year
afterwards leaves the original behind and writes a second copy under the new
year. If the year is wrong, delete the entry and create it again.

## Deleting Entries

Deleting an entry in the CMS removes only its `index.md`, so the folder and any
uploaded images would otherwise stay in the repository and keep being published.
The deployment workflow runs `scripts/prune-orphan-bundles.sh` before building,
which deletes any `content/<section>/<year>/<slug>/` folder that has no
`index.md` and commits the removal. Editors do not need to do anything; the
folder disappears within a minute of the delete.

## Image Uploads

The admin page optimizes image uploads in the browser before Decap receives
them. JPEG, PNG, and WebP sources up to 20 MB are accepted. They are resized so
their longest side is at most 1600 pixels, stripped of metadata, converted to
WebP, and reduced to a target of 500 KB.

GIF, BMP, TIFF, and SVG uploads are rejected. Trusted SVG templates already in
the repository remain supported. Page-specific images are stored beside the
page's `index.md`; this keeps each Hugo leaf bundle self-contained.

The deployment workflow provides a second safety layer:

- Raster images over 1 MB fail validation.
- Unsupported formats and new SVG files fail validation.
- A warning starts at 300 MB of tracked images.
- New media is blocked at 500 MB until the storage approach is reviewed.

Do not enable Git LFS: the Decap GitHub backend does not support it.

## Growth Policy

Keep images in this repository while the publishing rate remains around 100
images per year or less and the tracked-image total stays below 300 MB. Upload
a newly named file when replacing an image instead of repeatedly overwriting
the same binary; Git retains old revisions.

At 300 MB, review the current free-storage options before adding more media.
Cloudinary Free is a possible fallback, but is intentionally not connected now
so the site has no additional vendor dependency. Do not enable Cloudflare R2
for this phase because it requires a subscription and can incur usage charges.
The CI stop at 500 MB remains in force until that review is completed.

- https://cloudinary.com/documentation/billing_and_plans
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits

## Local Testing

The config enables `local_backend: true` for local CMS testing. When local
backend tooling is running, `/admin/` can write to the local repository instead
of the hosted GitHub repository.

Always verify the site after CMS configuration changes:

```sh
hugo --minify --cleanDestinationDir
node --test tests/image-optimizer.test.js
bash scripts/validate-media.sh
bash scripts/prune-orphan-bundles.sh
```

Use plain `hugo server` rather than `hugo server -D` when checking local output:
`-D` builds drafts, which hides the effect of the Draft toggle.

Before handing the CMS to editors, confirm that the OAuth Worker redirects to
GitHub:

```sh
curl -I "https://tdmod-net-oauth.moru-rse.workers.dev/auth?provider=github&fresh=1"
```

The response should redirect to `github.com/login/oauth/authorize`.
