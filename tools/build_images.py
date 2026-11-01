"""Make web copies of the client's original art.

Originals stay untouched in assets-src/drive/. This writes WebP copies to
assets/img/art/<slug>.webp (max 1800px) and assets/img/art/thumb/<slug>.webp
(max 720px), keeping transparency and aspect ratio. No cropping, no recolouring.

Run from the project folder:  python tools/build_images.py
Then copy the printed sizes into js/content.js if a file changed.
"""

import json
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets-src", "drive")
OUT = os.path.join(ROOT, "assets", "img", "art")

# original file name -> web slug
SLUGS = {
    "Cr. Fahsan.png": "fahsan-chibi-wink",
    "Cr. Father.png": "father-portrait",
    "Cr. Maya Alphax.png": "maya-monochrome",
    "Cr. PpAws Kanok.png": "kanok-duo-a",
    "Cr. PpAws Kanok1.png": "kanok-duo-b",
    "Cr. PpAws Kanok2.png": "kanok-heart",
    "Cr. RapiZRAN.PNG": "rapizran-night",
    "Cr. RapiZRAN1.PNG": "rapizran-chibi-full",
    "Cr. RapiZRAN2.png": "rapizran-cake-card",
    "Cr. RapiZRAN3.png": "rapizran-cake",
    "Cr. RapiZRAN4.PNG": "rapizran-pale-full",
    "Cr. RapiZRAN5.PNG": "rapizran-butterflies",
    "Cr. emakai.png": "emakai-heart",
}


def save(im: Image.Image, path: str, edge: int) -> tuple[int, int]:
    copy = im.copy()
    copy.thumbnail((edge, edge), Image.Resampling.LANCZOS)
    copy.save(path, "WEBP", quality=84, method=6)
    return copy.size


def main() -> None:
    os.makedirs(os.path.join(OUT, "thumb"), exist_ok=True)
    sizes = {}
    for name, slug in SLUGS.items():
        src = os.path.join(SRC, name)
        if not os.path.exists(src):
            print("missing", name, file=sys.stderr)
            continue
        im = Image.open(src)
        im = im.convert("RGBA") if im.mode in ("RGBA", "LA", "P") else im.convert("RGB")
        w, h = save(im, os.path.join(OUT, slug + ".webp"), 1800)
        save(im, os.path.join(OUT, "thumb", slug + ".webp"), 720)
        sizes[slug] = [w, h]
        print(f"{name} -> {slug}.webp {w}x{h}")
    print(json.dumps(sizes))


if __name__ == "__main__":
    main()
