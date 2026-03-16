# Quintessential Homes of Somerville

A scroll-driven editorial about architectural styles in Somerville, MA. Vanilla HTML/CSS/JS — no framework, no build step.

## Running locally

```
python3 -m http.server 8080
```

## File structure

| File | Purpose |
|------|---------|
| `index.html` | Page shell — static markup only |
| `style.css` | All styles |
| `main.js` | All logic; `sections[]` config array at top |
| `houses.json` | House data (address, square, lat/lng) |
| `images.json` | Paths to house images |

## Adding a house

1. Drop a transparent PNG into `Cropped Houses Transparent/` and add its path to `images.json`.
2. Add an entry to `houses.json`:
```json
{ "address": "123 Example St, Somerville", "square": "Davis Square", "lat": 42.3965, "lng": -71.1220 }
```
`", Somerville"` is stripped from the address at display time.

## Editing section text

Edit the `sections` array near the top of `main.js`. Each entry has `label`, `title`, and `paragraphs`:

```js
{
  id: 'section-1',
  label: 'Victorian',
  title: 'A Living Archive',
  paragraphs: ['First paragraph...', 'Second paragraph...']
}
```

Section HTML and nav items are generated from this array at runtime — no HTML editing needed.

## Adding a new section

Add one entry to the `sections` array in `main.js` and 5 corresponding houses to `houses.json`. Everything else (HTML, nav, map wiring) is generated automatically.
