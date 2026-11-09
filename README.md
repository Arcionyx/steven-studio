# Steven Studio

Ruixi (Steven) Feng's personal art and design portfolio. The site uses responsive HTML, CSS and JavaScript with no build dependencies.

## Current work

Only **Adversity Silver Wings** is published, classified as **Architectural design** at the owner's direction. Other unfinished work entries have been removed. New works and their classifications will be supplied by the owner individually.

The first of four owner-supplied images is the work's cover. All four appear in their original order inside the work dialog. Visitors can swipe on touch screens, drag with a mouse, use the previous/next buttons, select a dot, or use Left/Right/Home/End while the gallery is focused. The corresponding scene introduction changes with each image. All four owner-provided narratives are polished for natural expression in five languages while preserving their content and substantial length. There is no automatic slideshow. Images retain their full composition. Reduced-motion preferences disable smooth movement.

Only the cover appears in the work grid. The other three images are created in the gallery after the work is opened. Optimised images are stored as `dist/assets/a1/silver-wings-01.webp` through `04.webp`. No PDF screenshots are used.

The 2023 study uses acrylic board, wood strips and mirror paper. Model dimensions are 19.3 × 10.4 × 5.55 inches. The four scenes are conceptual photomontages of models, not completed buildings. Internal reference: the owner-supplied Feng Ruixi A1.pdf, pages 179–183 and 193–197. Provenance stays in source metadata and this README; portfolio source names, PDF page numbers and A1 tags are not displayed to visitors.

No named project awards have been supplied. Artist-research awards are not attributed to Steven. Awards can be added when details are provided.

## Identity and languages

The SF monogram, Steven Studio wordmark and self-hosted Cormorant Garamond display fonts are preserved. Font licensing is included in `dist/assets/fonts/`.

English is the default. Simplified Chinese, Traditional Chinese, Japanese and Korean dictionaries include work content, gallery captions and controls, alt text, metadata and accessibility labels. Language choice persists locally; a valid `?lang=` parameter takes precedence.

## Preview and checks

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
npm run check
```

Checks cover the work archive, cover selection, four-image ordering, images limited to work details, internal provenance kept out of rendered markup, local assets, navigation and complete translations. Browser QA covers the gallery controls, image loading, keyboard interaction, mobile dimensions, five languages and direct links.

## Editing

- `dist/index.html`: navigation, page sections, cover and work dialog.
- `dist/portfolio.js`: owner-assigned category, internal provenance, cover and ordered image metadata.
- `dist/locales.js`: visitor content in five languages.
- `dist/app.js`: filters, language selection, navigation, dialogs and image gallery.
- `dist/style.css`: responsive visual system and gallery layout.

Work links use `#project/silver-wings`. Future works should be added only when supplied, with the category specified by the owner and matching copy in all five languages.

## Publishing

`.openai/hosting.json` preserves the existing Site identity and serves `dist/`. GitHub source: [Arcionyx/steven-studio](https://github.com/Arcionyx/steven-studio). Preserve the current owner-private access settings.

Live site: https://steven-studio-arcionyx.steven0574.chatgpt.site

The contact destination remains the confirmed GitHub profile. The site submits no messages or payments.
