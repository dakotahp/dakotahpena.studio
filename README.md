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

## Styling

- `static/css/pico.min.css` — PicoCSS base styles (vendored)
- `static/css/app.css` — site-specific overrides using `--pico-*` CSS custom properties

## Config

- `config.toml` — production config
- `config.development.toml` — local dev overlay (blanks `analyticsId`)
