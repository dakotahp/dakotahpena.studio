# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Hugo-based personal website. Content lives in `content/`, templates in `layouts/`, and SCSS in `assets/stylesheets/`. Foundation CSS framework handles grid and UI components.

## Commands

```bash
# Local development (uses config.development.toml overlay which disables analytics)
hugo server --watch --config config.toml,config.development.toml
# or via Procfile runner:
foreman start

# Build for production
hugo

# Accessibility tests (requires hugo server running on :1313)
npm run cypress:a11y:run
npm run cypress:a11y:open   # interactive

# Scaffold new content
hugo new posts/my-post-title.md
hugo new essays/my-essay-title.md
```

## Architecture

### Content Sections

Three main sections, each with its own layout templates in `layouts/`:

| Section | Purpose | Front matter notes |
|---------|---------|-------------------|
| `posts/` | Blog posts | `publishDate`, `menu: "blog"`, `tags`, `categories` |
| `essays/` | Long-form writing | `publishDate`, no menu assignment needed |
| `work/` | Portfolio items | Some are directories (e.g. `work/bike/`) for multi-file projects |

Essays front matter uses `publishDate` (not `date`) — follow this convention. Some older essays use `publish_date` (snake_case); don't introduce new ones with that key.

### Layout System

`layouts/_default/baseof.html` is the root shell — all pages extend it via Hugo's `{{ block "main" }}` pattern. Section-specific overrides live in `layouts/{section}/single.html` and `layouts/{section}/list.html`. Partials are in `layouts/partials/`.

### Styling

SCSS entry point is `assets/stylesheets/app.scss`, compiled at build time via Hugo Pipes (see `baseof.html`). Foundation CSS is served from `static/css/foundation.css`. Partial SCSS files follow `_name.scss` convention.

### Config

`config.development.toml` overlays `config.toml` during local dev — currently just blanks out `analyticsId`. Always pass both files when running locally.

### CI

GitHub Actions runs Cypress accessibility tests (`cypress-axe`) on every push. Tests expect Hugo output in `docs/` served via Caddy on port 1313.
