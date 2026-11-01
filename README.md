# Cupid — interactive character diary

A static website for the original character **Cupid**: entrance cover, profile, a page-turning diary,
relationships and credits. Light mode shows the soft diary; Dark mode adds secret pages and photos.
Thai and English throughout.

No build step, no backend, no dependencies — plain HTML, CSS and JavaScript. It works from any static host
(GitHub Pages, Cloudflare Pages, Netlify) and even when `index.html` is opened directly from disk.

## Run locally

```bash
python -m http.server 5178
```

Then open http://127.0.0.1:5178/

After editing any file in `css/` or `js/`, raise the `?v=` number on its links in `index.html` so visitors'
browsers load the new version instead of a cached copy.

## Folder layout

```
index.html              page skeleton (entrance, header, 4 sections)
css/base.css            colour tokens (light + dark), type, header, entrance, shared bits
css/sections.css        profile, relationships, credits, photo viewer
css/book.css            the diary (flipbook) and every page layout
js/content.js           ALL character content — edit this file
js/i18n.js              interface words in Thai and English
js/core.js              state, translation and image helpers
js/pages.js             diary page templates
js/sections.js          profile / relationships / credits templates
js/flipbook.js          page-turning engine (written for this site, no library)
js/lightbox.js          photo viewer
js/app.js               wiring: entrance, theme, language, navigation
assets/img/art/         web copies of the artwork (WebP), thumb/ = small versions
assets-src/drive/       the client's original files from Google Drive — never edited
tools/build_images.py   regenerates assets/img/art from assets-src/drive
```

## Editing content

Everything the site says about Cupid is in `js/content.js`.

- Text fields are `{ th: "...", en: "..." }`. Leave a field as `""` and the site shows a clearly marked
  "waiting for the owner" blank. If only one language is filled in, that language is shown for both.
- `mode: "normal"` shows in both themes; `mode: "dark"` is only rendered in Dark mode.
- Diary pages are listed in reading order in `DIARY`. Keep the number of normal pages **even** and the
  number of dark pages **even**, so the back cover always lands on a left-hand page.
- Add relationships by copying the block in `RELATIONSHIPS`.

### Dark-mode-only content

Dark items are filtered out before anything is rendered, so in Light mode they are not in the page at all
(not hidden with CSS) and their images are never downloaded. Every image goes through one helper
(`Cupid.img`) that refuses to output a dark image in Light mode, and the photo viewer closes itself if the
theme switches to Light while a dark photo is open.

Note: this is a static site, so the dark image files still exist on the server. Someone who guesses a file
URL can open it directly. Real access control would need a server, which this project deliberately does
not have.

## Music and sound

`js/audio.js` makes all sound in the browser with the Web Audio API — no audio files, nothing to license.

- Light mode: a music-box waltz in F major. Dark mode: the same melody in D minor, slower and slightly
  out of tune, with a low drone and a heartbeat. Switching theme crossfades between them (about 2 s).
- Effects: diary opening, page turn, theme switch, photo viewer, language switch.
- Browsers block sound until the visitor clicks, so music starts on "Open the diary". The speaker button
  (header, and on the entrance) mutes everything; the choice is remembered. Music pauses when the tab is hidden.
- To use the owner's own songs instead, put them in `assets/audio/` and set `AUDIO.music.light` / `.dark`
  in `js/content.js`. Only use music the owner has the rights to.
- `CupidAudio.status` in the browser console shows whether sound is running and which piece is playing.

## Artwork

13 images from the client's Google Drive folder `[OC website] Cupid`. The artist is taken from each file name
(`Cr. <artist>`). Web copies are WebP at most 1800 px (and 720 px thumbnails); transparency and aspect ratio
are kept, nothing is cropped or recoloured.

| Web file | Original | Artist | Mode |
|---|---|---|---|
| rapizran-chibi-full | Cr. RapiZRAN1.PNG | RapiZRAN | normal — main illustration |
| fahsan-chibi-wink | Cr. Fahsan.png | Fahsan | normal — entrance + cover |
| father-portrait | Cr. Father.png | Father | normal |
| rapizran-night | Cr. RapiZRAN.PNG | RapiZRAN | normal |
| rapizran-cake-card | Cr. RapiZRAN2.png | RapiZRAN | normal |
| rapizran-cake | Cr. RapiZRAN3.png | RapiZRAN | normal |
| kanok-duo-a | Cr. PpAws Kanok.png | PpAws Kanok | normal |
| kanok-duo-b | Cr. PpAws Kanok1.png | PpAws Kanok | normal |
| kanok-heart | Cr. PpAws Kanok2.png | PpAws Kanok | normal |
| emakai-heart | Cr. emakai.png | emakai | **dark (provisional)** |
| maya-monochrome | Cr. Maya Alphax.png | Maya Alphax | **dark (provisional)** |
| rapizran-pale-full | Cr. RapiZRAN4.PNG | RapiZRAN | **dark (provisional)** |
| rapizran-butterflies | Cr. RapiZRAN5.PNG | RapiZRAN | **dark (provisional)** |

**Provisional dark list:** the red-circled reference that marks which photos belong to Dark mode, the
character reference sheet and the two theme-example images were not in the Drive folder. The four dark
images above were chosen by mood. To change it, edit `mode` on the image in `IMAGES` and on any diary page
that shows it.

To add or replace art: put the original in `assets-src/drive/`, add it to `SLUGS` in
`tools/build_images.py`, run `python tools/build_images.py` (needs Pillow), then add the image to `IMAGES` in
`js/content.js` with the printed width/height.

## Character text

The profile (basic information, outfit, abilities, hobbies, personality, likes, dislikes, main information and
the woman's quote) is the owner's own Thai text, copied without changes — including spelling. The owner wrote
it in Thai only, so the English page shows the same Thai words with a short note; add an `en` only with the
owner's own English. Items the owner marked "Dark mode" (one ability, three personality traits, the emoji) have
`mode: "dark"`.

The relationship card for ที่รัก ("My dear", the owner's words) has an appearance description written from the
owner's two reference pictures (a 3D avatar and a chibi pair). The reference pictures are not on the site.

The entrance shows an 18+ content warning; opening the diary counts as confirming the visitor is 18 or older.

## Still needed from the owner

- Which photos are Dark-mode only (the red-circled reference)
- The Dark-mode emoji (the profile shows a blank for it in Dark mode)
- English versions of the character text, if wanted
- Diary entry texts and dates
- Relationship type and description for ที่รัก
- Character owner name and special thanks for the credits
