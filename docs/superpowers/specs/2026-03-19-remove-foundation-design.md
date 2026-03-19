# Remove Foundation CSS/JS — Design Spec

**Goal:** Replace Foundation CSS (168KB) and its JS dependencies (jQuery, what-input, foundation.min.js) with ~20 lines of vanilla CSS, reducing total page weight by ~200KB and eliminating all framework dependencies.

**Approach:** Vanilla CSS using custom properties. Preserve the existing visual layout exactly. Replace the broken Foundation Orbit carousel on work pages with a CSS-only hero + thumbnail gallery using `:target`. Update the BackstopJS baseline after the migration.

---

## What Gets Removed

| File | Size | Why removable |
|------|------|---------------|
| `static/css/foundation.css` | 168KB | Replaced by ~20 lines in `app.css` |
| `static/javascripts/jquery.js` | ~87KB | Only loaded for Foundation |
| `static/javascripts/what-input.js` | ~7KB | Foundation input detection utility |
| `static/javascripts/foundation.min.js` | ~30KB | Powers Orbit carousel (only JS component in use) |

The four `<link>`/`<script>` tags referencing these files are removed from `layouts/_default/baseof.html`.

---

## Layout System Replacement

Foundation's XY grid is replaced with three CSS classes added to `static/css/app.css`:

```css
:root {
  --content-width: 62.5rem;
  --column-8: 66.667%;
}

.container        { max-width: var(--content-width); margin: 0 auto; padding: 0 0.9375rem; }
.container--fluid { width: 100%; padding: 0 0.9375rem; }
.content-column   { max-width: var(--column-8); margin: 0 auto; }
```

### Template class mapping

| Foundation classes | Replacement | Files affected |
|-------------------|-------------|----------------|
| `class="grid-container"` | `class="container"` | `baseof.html`, section layouts |
| `class="grid-container fluid"` | `class="container--fluid"` | `baseof.html` (footer) |
| `class="grid-x post__container"` + `class="cell small-8"` | `class="post__container"` + `class="content-column"` | `posts/single.html`, `essays/single.html` |
| `class="grid-x"` + `class="cell small-8 medium-offset-2"` etc. | `class="content-column"` | various list/single layouts |

The `post__container`, `posts__container`, and other semantic classes remain unchanged — only Foundation-specific grid utility classes are swapped.

---

## Work Page Gallery Replacement

`layouts/work/single.html` replaces the Foundation Orbit carousel with a CSS-only hero + thumbnail gallery. This also fixes the existing broken image bug (the carousel depended on Foundation JS which was failing to initialize).

### HTML structure

```html
{{ $images := .Resources.ByType "image" }}
{{ if $images }}
<div class="work-gallery">
  <div class="gallery-hero">
    {{ range $index, $image := $images }}
      {{ $full := $image.Fit "1200x800 q90" }}
      <img id="gallery-img-{{ $index }}"
           src="{{ $full.RelPermalink }}"
           alt="{{ with $image.Title }}{{ . }}{{ else }}{{ $.Title }} image {{ $index | add 1 }}{{ end }}">
    {{ end }}
  </div>
  {{ if gt (len $images) 1 }}
  <div class="gallery-thumbs">
    {{ range $index, $image := $images }}
      {{ $thumb := $image.Fit "200x150 q80" }}
      <a href="#gallery-img-{{ $index }}">
        <img src="{{ $thumb.RelPermalink }}"
             alt="{{ with $image.Title }}{{ . }}{{ else }}{{ $.Title }} image {{ $index | add 1 }}{{ end }}">
      </a>
    {{ end }}
  </div>
  {{ end }}
</div>
{{ end }}
```

### CSS

```css
.work-gallery {
  margin: 2rem 0;
}

.gallery-hero img              { display: none; width: 100%; height: auto; }
.gallery-hero img:first-child  { display: block; }
.gallery-hero:has(:target) img { display: none; }
.gallery-hero img:target       { display: block; }

.gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
}

.gallery-thumbs a img {
  width: 100px;
  height: 75px;
  object-fit: cover;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.15s;
}

.gallery-thumbs a:hover img,
.gallery-thumbs a img:target {
  opacity: 1;
}
```

---

## Orphaned CSS Cleanup

Remove these rules from `static/css/app.css` — they reference Foundation component classes that no longer exist:

- `.orbit .orbit-bullets button.is-active` (references Orbit)
- `.orbit-bullets button` (references Orbit)
- `.callout` color rules in dark/light mode blocks (Foundation component not used in any template)

---

## Testing Strategy

BackstopJS (installed in the previous migration) handles visual regression.

1. After all changes, run `npx backstop test`
2. Expected: the 22 non-work-page scenarios pass with 0% mismatch (layout is visually identical)
3. Expected: the 4 work-page scenarios show a diff (broken carousel → working gallery — this is intentional)
4. Visually inspect the work-page diffs in the BackstopJS HTML report to confirm the gallery looks correct
5. Run `npx backstop reference` to commit the new baseline, capturing the gallery as the new ground truth

---

## Out of Scope

- Modernizing the spacer/padder utility classes (already in `app.css`, working fine)
- Replacing the custom font stack or typography
- Lightweight framework adoption (planned as a future third iteration)
