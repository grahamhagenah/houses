# Quintessential Homes of Somerville

A scrollytelling editorial webpage about architectural styles in Somerville, MA. Built with vanilla HTML/CSS/JS — no framework, no build step.

## Running locally

```
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## How it's built

Everything lives in `index.html`. Key pieces:

- **MapLibre GL JS** (v4.1.0) — single shared map instance with a dot that fades between house locations as you scroll
- **CartoDB light_nolabels** raster tiles for the basemap
- **IntersectionObserver** — detects which house is in view, updates the map dot and address display
- **`images.json`** — flat array of image paths, loaded via `fetch()` on page load
- **CSS Grid + Flexbox** — desktop layout is `360px text | 1fr houses | 260px map`; mobile stacks columns with a fixed bottom map popup

---

## Adding houses

### 1. Add the image

Drop a PNG with a transparent background into `Cropped Houses Transparent/`.

### 2. Register the image

Add the path to `images.json`:

```json
[
  "Cropped Houses Transparent/your-new-house.png",
  ...
]
```

Images are distributed across sections via `imageOffset` — see step 4.

### 3. Add house data

In `index.html`, find the `allHouseData` array near the top of the `<script>` block. Add an entry:

```js
{ address: "123 Example St, Somerville", square: "Davis Square", lat: 42.3965, lng: -71.1220 }
```

- `address` — full street address; ", Somerville" is stripped in the UI automatically
- `square` — nearest neighborhood square (shown below the address on the map)
- `lat` / `lng` — coordinates for the map dot

### 4. Assign houses to a section

Each section is initialized with a slice of `allHouseData` and an `imageOffset` that indexes into the `images.json` array:

```js
initSection({ displayId: "house-display", images: houseImages, data: allHouseData.slice(0, 5), imageOffset: 0 });
initSection({ displayId: "house-display-2", images: houseImages, data: allHouseData.slice(5, 10), imageOffset: 5 });
```

Adjust the `.slice()` range and `imageOffset` to include your new house in the right section.

---

## Editing section text

Each architectural style section is a `.map-section` block in the HTML. Find the `.intro-text` div inside the section you want to edit:

```html
<section class="map-section" id="section-1">
  <div class="intro-text">
    <span class="section-kicker">Victorian</span>
    <h2>Your headline here</h2>
    <p>Body text...</p>
  </div>
  <div id="house-display" class="house-display"></div>
</section>
```

- `section-kicker` — small label above the headline (also used in mobile sticky nav)
- `h2` — section headline
- `p` — body paragraphs

---

## Adding a new style section

1. Copy an existing `.map-section` block and give it a new `id` (e.g. `section-5`) and a new `house-display` id (e.g. `house-display-5`).
2. Add a nav item in `.section-nav` pointing to the new section id.
3. Add house data entries to `allHouseData`.
4. Call `initSection()` for the new section with the appropriate data slice and image offset.
5. Add a `<hr class="section-divider">` before the new section if desired.
