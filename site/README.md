# AI-Created Prototypes — Gallery

Static site. No build step, no dependencies.

- `index.html` — page shell
- `styles.css` — all styles
- `app.js` — rendering, filters, pinning (localStorage), hash routing (`#p=<id>` for detail pages)
- `data.js` — **edit this** to add/change prototypes. Set `url` to link a card's "Open prototype" button.
- `thumbs/` — screenshots, named `<id>.webp`. Register new ones in `window.THUMBS` at the bottom of `data.js`.

## Run locally
Open `index.html` directly, or `npx serve .`

## Deploy to Vercel
Import the repo in Vercel, framework preset "Other", no build command, output directory = this folder (or repo root if this folder is the root).

Note for Claude Code: do not read files in `thumbs/` — they are binary images.
