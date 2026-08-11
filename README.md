# zhibinyou — personal academic website

Live site: **https://astroceanman.github.io**
Repository: **https://github.com/Astroceanman/Astroceanman.github.io**

A hand-written static website: plain HTML + CSS + vanilla JavaScript. No framework, no build
step, no npm, no server-side code. What is in this repository is exactly what is served.
Total size ~27 MB, almost all of it photographs.

---

## 1. How it is hosted

- The repository is named `Astroceanman.github.io`, which makes it a **GitHub Pages user site**:
  GitHub automatically serves the root of the `main` branch at `https://astroceanman.github.io`.
  There is nothing to configure and no build pipeline.
- Every `git push` to `main` triggers a "pages build and deployment" run (visible under the
  repo's **Actions** tab). It typically finishes in 30–60 s.
- After a deploy, browsers often show a cached copy. Hard refresh with **Cmd+Shift+R**
  (Safari: Cmd+Option+R) before concluding something did not update.

## 2. Working on the site locally

```bash
git clone https://github.com/Astroceanman/Astroceanman.github.io.git
cd Astroceanman.github.io
```

(Zhibin's local copy lives at `~/personal_website` on his Mac.)

Preview locally — any static file server works, e.g.:

```bash
python3 -m http.server 4321
# then open http://localhost:4321
```

Opening the HTML files directly via `file://` mostly works too, but the star-field data and
photos load more reliably through a local server.

Publish changes:

```bash
git add -A
git commit -m "describe the change"
git pull --rebase origin main   # in case someone edited via the GitHub web UI
git push
```

The `pull --rebase` matters: this repo has been edited both locally and directly on
github.com; pushing without rebasing first is rejected when the remote has moved.

## 3. Collaborating (two people, one repo)

**Granting access:** on github.com → repo → *Settings* → *Collaborators* → *Add people*.
An invited collaborator can push directly to `main`; no fork or pull request is needed
for a site this small.

**Two safe ways to edit:**

1. *In the browser* — open any file on github.com and click the pencil icon. Good for
   fixing wording in an HTML file. The commit happens instantly on `main`, so tell the
   other person, and always run `git pull --rebase` locally afterwards.
2. *Locally* — clone, edit, preview, push (see §2). Necessary for anything involving new
   images or JavaScript.

**Avoiding collisions:** always start a work session with `git pull --rebase origin main`
and end it by pushing. Because the site is split into one file per page, two people
editing *different* pages will never conflict. If both edit the same file and Git reports
a conflict, the conflicting lines are marked with `<<<<<<<`/`>>>>>>>`; keep the intended
version, delete the markers, then `git add <file>` and `git rebase --continue`.

**Rolling back:** every version is recoverable. `git log --oneline` lists commits;
`git revert <hash>` undoes one safely (it creates a new commit rather than rewriting
history). On GitHub, the *History* button on any file shows and restores older versions.

## 4. File map

```
.
├── index.html            Landing page: hero, About, three research cards, Contact
├── research.html         Research topics (placeholder text, see §9)
├── publications.html     Publication list (placeholder entries, see §9)
├── cv.html               Education / research experience / skills
├── astrophotography.html Photo gallery shell (content comes from photos.js)
├── egg.html              Hidden easter-egg page (see §8)
├── void.html             "SIGNAL LOST" page, reachable only from the easter egg
├── style.css             All styling for the main site (egg/void carry their own <style>)
├── stars.js              Canvas star-field renderer, shared by every page
├── gaia_stars.js         Data file: 12,119 real stars, auto-generated (see §5)
├── gaia_raw.csv          Raw Gaia query result kept for provenance (not loaded by the site)
├── assets/
│   └── gaia_allsky.jpg   ESA Gaia DR2 all-sky map, background texture (see §5)
├── photos/               Web-sized JPEGs for the gallery (originals stay on Zhibin's Mac)
└── photos.js             Gallery database + rendering + lightbox code (see §7)
```

Fonts (Fraunces, Inter, JetBrains Mono) load from Google Fonts — the only external asset
dependency of the main pages.

## 5. The star background (every page)

The animated sky is not decorative noise; it is real data, rendered by `stars.js`:

- **Stars:** all 12,119 Gaia DR3 sources with G < 6.5. Fetched once from the Gaia archive
  (ADQL over TAP: `SELECT ra, dec, phot_g_mean_mag, bp_rp FROM gaiadr3.gaia_source_lite
  WHERE phot_g_mean_mag < 6.5`), converted to galactic (l, b), and baked into
  `gaia_stars.js` as `[l, b, G, BP-RP]` rows. Star color comes from BP–RP, size/alpha from G.
  The ~20 brightest naked-eye stars (Sirius, Vega, ...) saturate in Gaia and are hard-coded
  from Hipparcos values inside `stars.js` (`BRIGHT` array).
- **Milky Way texture:** `assets/gaia_allsky.jpg`, the official ESA Gaia DR2 all-sky
  brightness map (integrated light of ~1.7 billion stars), cropped to its Hammer-projection
  ellipse (source rect x 140–3860, y 330–2188) and drawn beneath the star points.
- **Projection:** Hammer, galactic coordinates, Galactic Center at screen center; both the
  texture and the point stars use the same projection, so they align to the pixel.
- Stars brighter than G ≈ 5.2 twinkle; occasional meteors streak; the sky parallax-shifts
  slightly on scroll.
- To regenerate `gaia_stars.js` (e.g. deeper magnitude cut): re-run the TAP query, convert
  ra/dec → l/b, and write rows in the same compact format. `gaia_raw.csv` is the archived
  raw query result.

**License note:** the all-sky map is ESA/Gaia/DPAC, **CC BY-SA 3.0 IGO**. The attribution
line in every page footer ("Sky: ESA/Gaia/DPAC, CC BY-SA 3.0 IGO") is a license requirement.
Do not remove it.

## 6. Page anatomy (shared pieces)

Every main page has the same skeleton: `<canvas id="sky">` (the star field), a fixed `<nav>`,
a `<header>` (full-height hero on index, shorter `.page-head` elsewhere), content sections
with class `reveal` (fade-in on scroll via IntersectionObserver, defined in `stars.js`),
and a `<footer>` with the attribution line. Responsive breakpoints: at **760 px** the nav
stacks (brand on top, links wrapping below) and photo rows collapse to a single column;
at **640 px** the About grid, publication entries and CV timeline rows also go single-column.

## 7. Editing the photo gallery

Everything lives in `photos.js`. Each entry:

```js
{
  src:  "photos/file.jpg",          // required, path inside photos/
  pos:  "50% 20%",                  // optional, object-position for the 3:2 thumbnail crop
  title: "Name",                    // shown as heading and in lightbox caption
  meta:  "Month Year · City, ST · Camera · exposure",  // the blue caption line
  desc:  "Full description...",     // may contain HTML (links, <strong>)
  captionHtml: "..."                // optional, overrides the lightbox caption (used once,
                                    // for the easter-egg link, see §8)
}
```

Workflow for a new photo: export a web-sized JPEG (≤ ~3000 px, target ≤ ~2 MB;
`sips -Z 3000 -s format jpeg -s formatOptions 80 in.jpg --out photos/name.jpg` works),
drop it in `photos/`, add an entry at the right chronological position (list is
newest-first), commit, push. Rows alternate image-left / image-right automatically; the
image always occupies the wider (3fr) column. Clicking a photo opens the lightbox;
Esc or clicking outside closes it. If a `src` path is wrong the row shows a dashed
"image not found" placeholder instead of breaking.

House style for descriptions: scientifically correct, no em dashes, exposure quoted as
total seconds ("4020 s total"), locations as "City, ST".

## 8. The easter egg (please keep it secret)

- **Entry:** on `astrophotography.html`, open the **M45 · The Pleiades** photo in the
  lightbox. In the caption, the words "Canon EOS 6D" are an invisible link to `egg.html`
  (class `.egg` in `style.css` strips every visual cue: inherited color, no underline,
  default cursor). This is intentional; do not "fix" it into a visible link.
- **egg.html** ("signal://found"): terminal-style HUD over the same Gaia sky. Typewriter
  intro, glitching title, a global like counter ("TRANSMISSIONS LOGGED") with a
  `[ TRANSMIT SIGNAL ]` button (one like per browser, tracked in `localStorage`
  key `egg-liked`), and a `[ WARP DRIVE ]` rapid-fire button bottom-right: each click
  fires a meteor burst, a combo counter, synthesized WebAudio sound (no audio files),
  and increments a second global counter ("JUMPS LOGGED").
- **Warp-out rule:** clicking is always safe below combo 50. Past combo ≥ 50, clicks
  faster than 180 ms apart build a "fast streak"; five consecutive fast clicks trigger a
  white-flash warp to `void.html` ("SIGNAL LOST", glitch title, `[ RETURN HOME ]`).
  Slowing down resets the streak, so deliberate pacing can farm arbitrarily high combos.
- **Counters:** stored on the free public counter API **Abacus**
  (`abacus.jasoncameron.dev`), namespace `astroceanman-site`, keys `egg-likes` and
  `egg-storm`. There is no backend of our own. To reset a counter to zero, just rename its
  key in `egg.html` (e.g. `egg-likes-v2`) — a new key starts at 0. All API responses are
  validated with `Number.isFinite` before use; if Abacus rate-limits or dies, the page
  keeps counting locally and displays normally.
- Both `egg.html` and `void.html` carry `<meta name="robots" content="noindex">` and are
  linked from nowhere else.

## 9. Known placeholders (the current to-do list)

- `research.html`: the three topic sections still contain template sentences
  ("Expand this with a paragraph on your specific projects...") and describe an older
  draft of research directions. Needs real content.
- `publications.html`: the three papers are fake placeholders; the "Full list on ADS"
  button points at the ADS homepage.
- `cv.html`: the `[ CV (PDF) ]` button links to `#`. When adding a real PDF, strip the
  phone number and street address first — the site is public.
- `index.html`: the About paragraph is half placeholder, the ORCID link is
  `0000-0000-0000-0000`, and the ADS contact link is generic.
- No favicon yet.

## 10. Credits

- Sky map: ESA/Gaia/DPAC, CC BY-SA 3.0 IGO
- Star catalogue: ESA Gaia DR3; brightest stars from Hipparcos
- All photographs © Zhibin You (M45 taken together with Gavin Wang)
- Fonts: Fraunces, Inter, JetBrains Mono (Google Fonts)
- Like counter: Abacus (abacus.jasoncameron.dev)
