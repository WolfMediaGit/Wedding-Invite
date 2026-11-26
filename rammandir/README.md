# Ram Mandir — Divine Wedding Theme (Next.js)

A Next.js recreation of the Framer site **rammandir.framer.website** (Akash weds Drashti): the temple hero, invitation, wedding timeline, couple note, photo wheel, venue map, WhatsApp RSVP, "Things to know" and countdown.

## Quick start

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
```

Deploy: push to GitHub and import into Vercel (framework preset Next.js; `vercel.json` is included), or run `npx vercel`.

## How it's built

Framer serves a **separate fixed-width artboard per breakpoint**, so this project does the same instead of guessing a responsive layout. Every layer (image, text block, component) was measured on the live site at each breakpoint, with Framer's entrance-animation start states removed:

| Artboard      | Viewport      | Width  | Page height |
|---------------|---------------|--------|-------------|
| `mobile`      | < 430 px      | 398 (fluid) | 6180 at 393 |
| `mobile-wide` | 430 – 767     | 435    | 6180 |
| `tablet`      | 768 – 959     | 846    | 9708 |
| `tablet-wide` | 960 – 1279    | 975    | 10279 |
| `laptop`      | 1280 – 1348   | 1282   | 11804 |
| `desktop`     | ≥ 1349        | 1515   | 12261 |

Artboards are centred and cropped when wider than the window, as on Framer. Below 430px the mobile design scales with the window; at 1559px and above the desktop design scales up.

```
app/            layout.tsx (metadata, fonts), page.tsx, globals.css
components/
  Invitation.tsx        picks the artboard for the window width, smooth scroll (Lenis)
  Artboard.tsx          draws one artboard: 4 overlapping sections with Framer's z-order
  Section.tsx           one Framer section (Hero & Invitation, Timeline, Couple, Location & Countdown)
  layers/               positioning + motion shells, text, images
  widgets/              HangingBell, WavingFlag, FlockingBirds, ScrollArrow, EventCard,
                        MessageReveal, PhotoGallery, RSVPForm, Countdown, LocationMap, InfoIcons
lib/
  config.ts             names, date, WhatsApp number, events, venues, message, info cards  ← edit this
  animations.ts         entrance, in-view, parallax and scroll-shrink presets (measured)
  layout.ts             artboard types and breakpoint selection
  assets.ts             image/font URLs and @font-face
data/
  *.json                normalised artboards used by the app
  raw/*.json            the raw measurements, as captured
scripts/
  normalize-layout.py   raw → data/*.json
  download-assets.mjs   copy all images & fonts into /public
  static-preview.py     flat HTML render of an artboard, for checking measurements
tests/visual.spec.ts    Playwright: heights vs the live site, side-by-side screenshots, interactions
```

## Behaviour reproduced

- **Load sequence**: sky layers rise into place, the names swing in, the bell frame zooms from 2.3× (1.6× on desktop) and the bells fade in.
- **Scroll**: Framer scroll-speed factors measured on the live page: cloud and sun −0.7, mountains −0.5, temple and invitation −0.2, corner and flag −0.1, timeline pillars +0.05. The hero names sink (+0.6 to +0.8) while shrinking to 0.4× and fading to 30% over the first 500px.
- **In view**: text lifts 24–32px, event cards swing in from alternate sides on mobile and slide from the left on desktop, the location block rises 56px from 94% scale.
- **Couple note**: words light up from 22% to full colour as the block scrolls past.
- **RSVP**: name, multi-select events (Mehendi, Sangeet, Wedding Ceremony, Reception), guest count 1–50. The button stays at half opacity until all three are filled, then opens `wa.me/919819200906` with the same message text the original sends.
- **Map**: OpenStreetMap via Leaflet, inert until tapped, re-centre, copy address, "Open in Google Maps", and a location switcher.
- **Countdown**: live, rolling digits. The target is 29 Aug 2026 6 pm IST, which has passed, so it shows 00 like the original.

## Assets

Images and fonts load from the Framer CDN by default (`framerusercontent.com`), the same files the live site uses. To self-host:

```bash
npm run assets                          # writes public/images, public/fonts, public/asset-manifest.json
NEXT_PUBLIC_LOCAL_ASSETS=1 npm run build
```

The fonts (IvyOra Display, Gotham, Miofarin, Brother Signature) are the files uploaded to your Framer project; check your licences cover web use outside Framer. The photo wheel uses the same Unsplash placeholders as the original.

## Known differences

- **Birds, flag, bells and scroll arrow** are hand-built equivalents. Framer uses a three.js boids canvas and a canvas flag. Bell sway, flag wave and arrow bounce timings were not measurable and are approximations.
- **Animation easing**: Framer's springs (bounce 0) are used with the measured start states, but in-view durations are estimated (1.2s).
- **375px and ≥1600px** are scaled from the nearest measured artboard. Framer has its own variants there, so heights differ by up to about 5% at 375 and 3–16% at 1600–1920.
- **Map tiles** come from OpenStreetMap's public servers. Use a tile provider with an API key for heavy traffic.
- **Desktop bells 5 and 6**: their image was taken from the 1280px layout.

## Verification

`npm run test:visual` (with the site running) checks page height and section offsets against the live site at 1440, 1280, 1024, 768, 390 and 375, attaches reference/clone screenshot pairs for each screenful, checks for console errors, and exercises the RSVP link, the map links and the countdown.
