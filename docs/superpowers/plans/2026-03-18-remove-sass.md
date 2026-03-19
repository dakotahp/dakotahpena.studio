# Remove Sass / Migrate to Plain CSS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Hugo's SCSS compilation pipeline (which requires Hugo Extended) with a plain CSS file, with zero visual regressions verified by automated screenshot diffing.

**Architecture:** Two-phase migration. Phase 1 is a mechanical swap: compile the current SCSS to CSS using Hugo Extended locally, drop the output in as a static file, and confirm pixel-identical rendering via BackstopJS. Phase 2 (optional, separate effort) modernizes the CSS using custom properties and removes dead code. This plan covers Phase 1 only — visual correctness is confirmed before any cleanup is attempted.

**Tech Stack:** Hugo (standard, post-migration), BackstopJS (visual regression), plain CSS

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `backstop.json` | Visual regression config — all pages, two viewports |
| Modify | `layouts/_default/baseof.html` | Remove Hugo Pipes SCSS pipeline, add plain `<link>` |
| Create | `static/css/app.css` | The compiled CSS output that replaces SCSS |
| Modify | `render.yaml` | Remove Hugo Extended, use standard Hugo |
| Modify | `.github/workflows/cypress.yml` | Remove `extended: true`, match render.yaml version |
| Delete | `assets/stylesheets/` (whole directory) | No longer needed after migration |

---

## Task 1: Install BackstopJS and Write Visual Regression Config

**Files:**
- Create: `backstop.json`
- Modify: `package.json`

- [ ] **Step 1: Install BackstopJS**

```bash
npm install --save-dev backstopjs
```

- [ ] **Step 2: Verify install**

```bash
npx backstop --version
```
Expected: prints a version number, no error.

- [ ] **Step 3: Create `backstop.json` at the repo root**

```json
{
  "id": "dakotahpena_studio",
  "viewports": [
    { "label": "desktop", "width": 1280, "height": 900 },
    { "label": "mobile", "width": 375, "height": 812 }
  ],
  "scenarios": [
    { "label": "home",               "url": "http://localhost:1313/" },
    { "label": "about",              "url": "http://localhost:1313/about/" },
    { "label": "contact",            "url": "http://localhost:1313/contact/" },
    { "label": "attribution",        "url": "http://localhost:1313/attribution/" },
    { "label": "essays-index",       "url": "http://localhost:1313/essays/" },
    { "label": "essay-everyday-carry", "url": "http://localhost:1313/essays/everyday-carry/" },
    { "label": "essay-perfect-change", "url": "http://localhost:1313/essays/perfect-change/" },
    { "label": "posts-index",        "url": "http://localhost:1313/posts/" },
    { "label": "post-miniflux",      "url": "http://localhost:1313/posts/self-host-miniflux-docker/" },
    { "label": "post-short-term-memory", "url": "http://localhost:1313/posts/give-short-term-memory-break/" },
    { "label": "work-index",         "url": "http://localhost:1313/work/" },
    { "label": "work-bike",          "url": "http://localhost:1313/work/bike/" },
    { "label": "work-human-fund-card", "url": "http://localhost:1313/work/human-fund-card/" }
  ],
  "paths": {
    "bitmaps_reference": "backstop_data/bitmaps_reference",
    "bitmaps_test":      "backstop_data/bitmaps_test",
    "html_report":       "backstop_data/html_report",
    "ci_report":         "backstop_data/ci_report"
  },
  "report": ["browser"],
  "engine": "puppeteer",
  "engineOptions": { "args": ["--no-sandbox"] },
  "asyncCaptureLimit": 3,
  "asyncCompareLimit": 50,
  "misMatchThreshold": 0.1
}
```

- [ ] **Step 4: Add backstop artifacts to `.gitignore`**

Open `.gitignore` (create it if it doesn't exist). Add:

```
backstop_data/bitmaps_test/
backstop_data/html_report/
```

Keep `backstop_data/bitmaps_reference/` unignored — these reference screenshots are committed to the repo as the baseline.

- [ ] **Step 5: Commit**

```bash
git add backstop.json package.json package-lock.json .gitignore
git commit -m "chore: add backstopjs for visual regression"
```

---

## Task 2: Capture the Visual Baseline

This locks in what the site looks like with the current SCSS pipeline. These screenshots become the "ground truth" for the migration.

**Prerequisite:** You must have Hugo Extended installed locally. Verify with:
```bash
hugo version
```
Expected output contains `extended`. If it doesn't, install Hugo Extended:
- macOS: `brew install hugo` (Homebrew's hugo is Extended by default)
- Direct download: https://github.com/gohugoio/hugo/releases — download the `_extended_` tarball

- [ ] **Step 1: Start the local dev server (leave it running)**

In a separate terminal:
```bash
hugo server --watch --config config.toml,config.development.toml
```

Wait until you see `Web Server is available at http://localhost:1313/` before proceeding.

- [ ] **Step 2: Capture baseline screenshots**

```bash
npx backstop reference
```

Expected: BackstopJS opens Puppeteer, visits all 13 scenario URLs, captures screenshots. Ends with `Baseline files captured.`

If any scenario fails with a 404, check the URL against what `hugo server` actually serves. Adjust the URL in `backstop.json` if needed (e.g., draft pages won't be served — check with `hugo server --buildDrafts`).

- [ ] **Step 3: Verify reference images exist**

```bash
ls backstop_data/bitmaps_reference/
```

Expected: a directory of PNG files, one per scenario × viewport.

- [ ] **Step 4: Commit the reference images**

```bash
git add backstop_data/bitmaps_reference/
git commit -m "chore: commit visual regression baseline (pre-sass-removal)"
```

---

## Task 3: Extract the Compiled CSS from Hugo's Build

Hugo Extended compiles the SCSS and writes the fingerprinted output to `public/`. We capture that exact file — this is the CSS we'll serve as a static file. Because it was produced by the same SCSS we're replacing, it is by definition visually identical.

- [ ] **Step 1: Run a full Hugo build**

```bash
hugo --config config.toml,config.development.toml
```

Expected: `public/` is populated. Build completes without errors.

- [ ] **Step 2: Find the compiled CSS file**

```bash
ls public/css/
```

You'll see a fingerprinted file like `app.min.abc123def.css`. Note the filename.

- [ ] **Step 3: Copy it to `static/css/app.css`**

Use the full filename exactly as shown by `ls` — it already includes the `.css` extension:

```bash
# Example: if ls showed "app.min.a1b2c3d4e5f6.css", the command is:
cp public/css/app.min.a1b2c3d4e5f6.css static/css/app.css
```

- [ ] **Step 4: Verify the file is non-empty**

```bash
wc -l static/css/app.css
```

Expected: several hundred lines. If it's empty or very small, the Hugo build may have failed silently — re-run Step 1 with `hugo --verbose`.

- [ ] **Step 5: Commit**

```bash
git add static/css/app.css
git commit -m "chore: add pre-compiled css as static file (sass migration step 1)"
```

---

## Task 4: Swap the Template to Use Plain CSS

Replace the Hugo Pipes SCSS compilation block in `baseof.html` with a simple `<link>` tag.

**Files:**
- Modify: `layouts/_default/baseof.html` (lines 22–30)

- [ ] **Step 1: Open `layouts/_default/baseof.html` and replace the SCSS pipeline block**

Find this block (around line 22):

```html
{{ $options := (dict "outputStyle" "compressed" "enableSourceMap" true) }}
{{ $style := resources.Get "stylesheets/app.scss" | css.Sass $options | fingerprint }}
<link
  rel="stylesheet"
  integrity="{{ $style.Data.Integrity }}"
  href="{{ $style.RelPermalink }}"
  crossorigin="anonymous"
  type="text/css"
>
```

Replace it with:

```html
<link rel="stylesheet" href="/css/app.css">
```

- [ ] **Step 2: Verify the dev server still loads (it should have reloaded automatically)**

Open http://localhost:1313 in a browser. The page should look identical — same fonts, same colors, same layout. If the page loads with no CSS at all (unstyled), the `static/css/app.css` file path is wrong — double-check Step 3 of Task 3.

- [ ] **Step 3: Commit**

```bash
git add layouts/_default/baseof.html
git commit -m "feat: replace scss pipeline with plain css static file"
```

---

## Task 5: Run Visual Regression Comparison

This is the critical validation step. BackstopJS compares screenshots of the current state (plain CSS) against the baseline (SCSS pipeline).

- [ ] **Step 1: Confirm the dev server is still running on :1313**

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:1313/
```

Expected: `200`. If not, restart it: `hugo server --watch --config config.toml,config.development.toml`

- [ ] **Step 2: Run the visual regression test**

```bash
npx backstop test
```

Expected: all scenarios pass at 0% mismatch. BackstopJS will open a browser report automatically.

- [ ] **Step 3: Interpret results**

  - **All green (0% mismatch):** Proceed to Task 6.
  - **Small mismatches (< 0.1%) on all pages:** Likely sub-pixel rendering differences from the browser launching fresh. Acceptable — proceed.
  - **Mismatch on specific pages:** Open the HTML report (`backstop_data/html_report/index.html`). If the diff shows a real visual difference, the static CSS file may be incomplete or the `<link>` href is wrong. Check `static/css/app.css` exists and is served at http://localhost:1313/css/app.css.
  - **All pages broken (totally unstyled):** The `<link>` href is wrong. Verify `static/css/app.css` exists and try opening http://localhost:1313/css/app.css directly.

- [ ] **Step 4: Commit the test report summary (optional)**

No commit needed — the test artifacts are gitignored.

---

## Task 6: Update Build Configs to Standard Hugo

Now that the SCSS pipeline is gone, Hugo Extended is no longer required.

**Files:**
- Modify: `render.yaml`
- Modify: `.github/workflows/cypress.yml`

- [ ] **Step 1: Update `render.yaml`**

Replace the current content with:

```yaml
services:
  - type: web
    name: dakotahpena-studio
    env: static
    buildCommand: |
      curl -sSL https://github.com/gohugoio/hugo/releases/download/v0.121.2/hugo_0.121.2_linux-amd64.tar.gz | tar -xz
      ./hugo
    staticPublishPath: public
```

This keeps the version pinned to 0.121.2 (matching the GitHub Actions workflow) while switching from the `_extended_` tarball to the standard one.

- [ ] **Step 2: Update `.github/workflows/cypress.yml`**

Change the Hugo setup step from:

```yaml
- name: Setup Hugo
  uses: peaceiris/actions-hugo@v2
  with:
    hugo-version: '0.121.2'
    extended: true
```

To:

```yaml
- name: Setup Hugo
  uses: peaceiris/actions-hugo@v2
  with:
    hugo-version: '0.121.2'
```

- [ ] **Step 3: Commit**

```bash
git add render.yaml .github/workflows/cypress.yml
git commit -m "chore: remove hugo extended requirement from build configs"
```

---

## Task 7: Delete the SCSS Files

The `assets/stylesheets/` directory is now dead code. Removing it also removes any risk of someone accidentally re-enabling the SCSS pipeline.

- [ ] **Step 1: Delete the directory**

```bash
rm -rf assets/stylesheets/
```

- [ ] **Step 2: Verify the site still builds correctly**

```bash
hugo --config config.toml,config.development.toml
```

Expected: build succeeds with no errors. Previously this would have required Hugo Extended; now it should work with standard Hugo.

- [ ] **Step 3: Run visual regression one final time**

```bash
npx backstop test
```

Expected: all green. This confirms the deleted files had no remaining effect.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete scss source files, sass migration complete"
```

---

## Post-Migration Notes

**The `.spacer-horizontal-20` bug:** `_spacers.scss:105` had `padding-right` instead of `margin-right`. This bug is now frozen into `static/css/app.css`. It's a minor visual anomaly that's been there for years and is low risk to fix, but it's a separate change from this migration.

**Future CSS modernization (Phase 2, not in this plan):** The compiled `app.css` is minified and hard to edit. If you want a maintainable plain CSS source, a follow-up refactor would:
- Replace Sass color variables with CSS custom properties on `:root`
- Replace spacer/padder utility classes with literal pixel values
- Use native CSS nesting (supported in all modern browsers as of 2024) for the dark mode and component blocks
- Split into logical files using `@layer`

This is safe to do incrementally with BackstopJS as the safety net.
