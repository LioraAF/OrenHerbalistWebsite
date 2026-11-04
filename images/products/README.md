# Products page images

- `main/`: default images shown on the product cards.
- `hover/`: bottle or packaging images revealed on hover or keyboard focus.
- `gallery/`: market, preparation, and product display photos.
- `gifts/`: gift basket photos, also shared with the gallery and perfume hover.
- `alternatives/`: unused plant photos and earlier image choices, kept for future use.

Use lowercase English plant names with hyphens for filenames. Add a descriptive
suffix when keeping several photos of one plant. File extensions match the image
format. Identical uploads from the project root are consolidated here.

| Plant or material | Main image |
| --- | --- |
| קלנדולה | `main/calendula.png` |
| שיח אברהם | `main/chaste-tree.jpg` |
| אשווגנדה | `main/ashwagandha-roots.webp` |
| קמפור | `main/camphor-tree.jpg` |
| אזובית המדבר | `main/origanum-dayi.jpg` |
| פרופוליס | `main/propolis-in-beehives.jpg` |
| מנטה | `main/mint.jpg` |
| קינמון | `main/cinnamon.jpg` |
| פיגם | `main/rue.jpg` |
| חרוב | `main/carob.jpg` |
| רוזמרין | `main/rosemary.jpg` |
| הדס | `main/myrtle.jpg` |
| גרניום ריחני | `main/scented-geranium.png` |
| עוזרר | `main/hawthorn.jpeg` |
| ולריאן | `main/valerian.webp` |
| מור | `main/myrrh.jpeg` |
| חסת בר | `main/wild-lettuce.jpeg` |
| חסת המצפן | `main/prickly-lettuce.png` |

`main/prickly-lettuce.png` is the uploaded חסת המצפן photo. The treatment
header keeps its original shared ginseng photo; an unused product copy is kept
in `alternatives/korean-ginseng-root.jpg`.

Set `--prep-image` on the product's `.prep-*` CSS class for its main image.
Set `--prep-bottle-image` on the same class for its hover image. Products without an individual hover image use `hover/herbal-extract-bottle-display.jpeg`.
Use `--prep-bottle-position` and `--prep-bottle-size` to frame a close-up from a
full photo. Shared photos have one canonical file:

- `hover/muscle-and-joint-balm-display.jpg`: muscle balm hover and rotating gallery.
- `gallery/herbal-balm-jar-display.jpeg`: first aid balm hover, framed around the pink jar on the left, and rotating gallery.
- `hover/facial-hydrosol-bottle-display.jpg`: hydrosol and hawthorn hovers, plus rotating gallery.
- `hover/herbal-extract-bottle-display.jpeg`: default hover, rotating gallery, and perfume hover framed around the slim bottles with silver caps on the right.
- `gifts/herbal-gift-set-in-dappled-light.jpg`: gift display.

Plant photos belong in `main/`, even when originally uploaded into the gallery.
Gallery JavaScript paths are relative to `images/products/`, so it can share
images from `hover/` and `gifts/` without duplicate copies. Gallery-only photos
belong in `gallery/`. Keep unused variants in `alternatives/`.

Keep shared originals used by other pages in their existing folders. Existing
remote image URLs remain in use until a local replacement is supplied.
