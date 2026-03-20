# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Hugo-based personal website. Content lives in `content/`, templates in `layouts/`, and SCSS in `assets/stylesheets/`. PicoCSS handles base styles.

## Commands

```bash
# Local development (uses config.development.toml overlay which disables analytics)
hugo server --watch --config config.toml,config.development.toml
# or via Procfile runner:
foreman start

# Build for production
hugo

# Scaffold new content
hugo new posts/my-post-title.md
hugo new essays/my-essay-title.md
```

## Architecture

### Content Sections

Three main sections, each with its own layout templates in `layouts/`:

| Section | Purpose | Front matter notes |
|---------|---------|-------------------|
| `posts/` | Blog posts | `date`, `menu: "blog"`, `tags`, `categories` |
| `essays/` | Long-form writing | `date`, no menu assignment needed |
| `work/` | Portfolio items | Some are directories (e.g. `work/bike/`) for multi-file projects |

All content uses `date` for the page date — this is what templates render via `.Date`. Never use `publishDate` (maps to `.PublishDate`, ignored by templates) or `publish_date` (unrecognized by Hugo).

### Layout System

`layouts/_default/baseof.html` is the root shell — all pages extend it via Hugo's `{{ block "main" }}` pattern. Section-specific overrides live in `layouts/{section}/single.html` and `layouts/{section}/list.html`. Partials are in `layouts/partials/`.

### Styling

PicoCSS is served from `static/css/pico.min.css`. Site-specific styles are in `static/css/app.css`, loaded after PicoCSS. CSS custom properties (`--pico-*`) are used for font and color overrides.

### Config

`config.development.toml` overlays `config.toml` during local dev — currently just blanks out `analyticsId`. Always pass both files when running locally.

### CI

Cypress accessibility tests have been removed. Visual regression is handled by BackstopJS (`npx backstop test`).
