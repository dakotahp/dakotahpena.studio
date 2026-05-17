# dakotahpena.dev

Personal website for [Dakotah Peña](https://dakotahpena.dev), built with [Hugo](https://gohugo.io/) and [PicoCSS](https://picocss.com/). Deployed via Render on push to `master`.

## Development

```bash
# Start local dev server (disables analytics via config overlay)
hugo server --watch --config config.toml,config.development.toml
```

Always pass both config files locally — `config.development.toml` blanks out `analyticsId` so pageviews aren't tracked during development.

## Building

```bash
hugo
```

Output goes to `public/`. Render runs this automatically on deploy.

## Content

Three content sections, each with its own layout templates under `layouts/`:

| Section | Path | Purpose |
|---------|------|---------|
| Blog posts | `content/posts/` | Shorter writing |
| Essays | `content/essays/` | Long-form writing |
| Work | `content/work/` | Portfolio items (some are directories for multi-file projects) |

### Scaffolding new content

```bash
hugo new posts/my-post-title.md
hugo new essays/my-essay-title.md
```

### Front matter

All content uses `date` for the published date. Templates render `.Date` — do not use `publishDate` or `publish_date`, they are ignored.

To mark an essay as edited, add `edited` to the front matter with the edit date. This is the only way to trigger the "Edited" label — it is intentionally opt-in:

```yaml
---
title: "My Essay"
date: 2026-01-01T00:00:00-07:00
edited: 2026-03-15T00:00:00-07:00
---
```

## Homepage

The homepage hero (intro + photo) lives in `content/_index.html`. Everything below it is rendered dynamically by `layouts/index.html` via two partials:

- `layouts/partials/home-featured.html` — the hand-pinned **Featured** item
- `layouts/partials/home-latest.html` — the **Latest** stream (5 most recent posts, essays, and work items)

### Featuring an item

The featured item is set with a single site param in `config.toml`:

```toml
[params]
featured = "/work/letsconnectlol/"
```

Set this to the relative permalink of any page in `posts/`, `essays/`, or `work/`. The page's first image resource (if any) is used as the thumbnail; its `description` front matter populates the supporting line. If the param is unset or the page is missing, the Featured section is omitted entirely and the page still renders cleanly.

The featured page is also automatically excluded from the Latest stream so it doesn't display twice.

### Latest stream

`home-latest.html` collects `site.RegularPages` from the three content sections, sorts by `.Date` descending, drops the featured page, and shows the first 5. To change the count, edit `first 5` in the partial.

## Styling

- `static/css/pico.min.css` — PicoCSS base styles (vendored)
- `static/css/app.css` — site-specific overrides using `--pico-*` CSS custom properties

## Config

- `config.toml` — production config
- `config.development.toml` — local dev overlay (blanks `analyticsId`)
