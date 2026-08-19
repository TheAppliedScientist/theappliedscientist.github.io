# AppliedScientist — project website

Production project page for the AAAI 2027 paper. Next.js 15 (App Router,
TypeScript), statically exported — no server required.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Build / deploy

```bash
npm run build      # static export → out/
python3 -m http.server -d out 8000
```

`out/` is fully static: host it on nginx, GitHub Pages, or any object store.

## Data (paper-exact rule)

Every number on the site must match `Paper_AAAI27_Latest/AnonymousSubmission2027.tex`
(the submission) — not local result files, which can be stale. The single
source of truth is:

```bash
python3 tools/extract_data.py   # Paper tex/figures → app/data/*.json
```

Each dataset in that script carries a comment naming the table/figure it
came from. If the paper changes, change the script, re-run it, and the
site follows.

## Images

- `tools/generate_image.py hero|og` — gpt-image-2 artwork. Needs
  `OPENAI_API_KEY` in the environment or in `website/.env`
  (gitignored — never commit the key, never ship it in the site).
- `tools/make_og.py` — renders the 1200×630 share card from HTML so it
  uses the site's real fonts. Output: `public/img/og-card.jpg`.
- `tools/shot.py <url> <out> [width] [full]` — scrolling screenshot for
  visual review.

## Design system

One centered column (`app/styles/layout.css`): a hero, then numbered
sections with a consistent header pattern (kicker → title → lede),
separated by whitespace rather than rules. Rules appear only where they
are deliberate: the masthead, the hero stat band, booktabs tables, and
the footer. `app/styles/tokens.css` holds the palette, type scale (STIX
Two Text / IBM Plex Sans / IBM Plex Mono, self-hosted in
`public/fonts/`), and spacing. Charts are hand-built SVG React
components in `app/components/figures/` — no chart library, no embedded
matplotlib PNGs.

## Before launch (TODO)

1. `app/site.config.ts` — real author names, affiliation, contact email,
   code/data release links, and the real domain in `url`.
2. Point `url` at the production domain (OG/Twitter cards resolve absolute
   image URLs from it).
3. Re-check `.env` is not committed: `git status` should never list it.
