# Eminem Fan Site

A compact, static fan site built with plain HTML, CSS, and JavaScript. The project provides a responsive landing layout, a theme toggle, a small playlist with a footer audio player, and a discography carousel. Images, audio, and external links are currently placeholders.

## What this repository contains

- `index.html` — Single-page layout: navigation, hero, about, top tracks, discography carousel, contact form, and footer audio player.
- `styles.css` — Theme variables, responsive rules, carousel and player styling.
- `script.js` — All client-side behavior: smooth scrolling, theme persistence, typewriter effect, playlist and audio controls, carousel controls, basic form handling.
- Placeholder assets are used via `https://via.placeholder.com` for album art and audio URLs.

## Key features

- Responsive single-page layout that adapts to mobile and desktop.
- Theme toggle that stores preference in `localStorage`.
- Playlist UI populated from a `tracks` array in `script.js`.
- Footer audio player with play, pause, next and previous controls, progress bar, and time display.
- Discography carousel with previous and next controls.
- Lazy loading on images and ARIA attributes on interactive controls for better accessibility.

## Quick start

1. Clone the repository:
   git clone https://github.com/swarn6402/eminem-fansite.git
2. Open `index.html` in a browser, or serve it with a simple web server:
   - Python 3:
     python3 -m http.server 8000
     Then open http://localhost:8000
   - Node: (if you have package `serve` installed)
     npx serve .

No build step is required. The site runs as static files.

## Where to make common edits

- Update playlist tracks and audio sources
  - File: `script.js`
  - Section: `const tracks = [ ... ]`
  - Each track entry: `{ title, artist, src, art }`
  - Replace `src` values with actual audio file URLs or local paths and `art` with real images.

- Replace album cards in the discography
  - File: `index.html`
  - Section: `#discography` — each `.album-card` contains front and back content and a Spotify link.

- Swap placeholder images and hero background
  - File: `styles.css` and `index.html`
  - Replace `https://via.placeholder.com/...` URLs with real assets or local files.

- Load Font Awesome icons
  - File: `index.html`
  - The HTML contains placeholder icon elements. Add the official Font Awesome script or replace with SVGs.

## Accessibility and performance notes

- Images use `loading="lazy"` to reduce initial load.
- Controls include `aria-label` attributes. Verify screen reader behavior after replacing placeholders.
- Consider adding keyboard focus styles and a visible skip link for better navigation.
- Reduce animation motion for users who prefer reduced motion. The site already uses short transitions; consider honoring `prefers-reduced-motion`.

## Small checklist before publishing

- Replace placeholder audio and image URLs with production assets.
- Replace placeholder social and Spotify links with valid destinations.
- Add proper metadata and Open Graph tags if sharing on social platforms.
- Add a favicon and manifest if you want an installable experience.
- Run an accessibility audit with Lighthouse and address any warnings flagged for interactive elements.

## Suggested next improvements

- Persist current playing track across page reloads if desired.
- Implement keyboard controls for the carousel and audio player.
- Add server-side form handling or integrate a service for the subscription form.
- Replace placeholder icons with inline SVGs for smaller bundle size and consistent styling.

## Contributing

PRs welcome. Keep changes focused and include screenshots or short recordings for UI changes. If you plan to add large assets, add them under an `assets/` folder and update references in the HTML and CSS.

## License

No license file is included in the repository. If you want to make this project public for reuse, add a license file. A common choice is the MIT License.
