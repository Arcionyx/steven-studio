# Steven Studio

Ruixi (Steven) Feng's personal art and design portfolio. The site uses responsive HTML, CSS and JavaScript with no build dependencies.

## Current work

Five owner-supplied works are published: **Adversity Silver Wings** (Architectural design), **Frostfade**, **Color Sphere Marine Blossoms**, **ArgenRubi**, and **Pay Tribute** (Installation). Categories are assigned by the owner. Unfinished work entries remain removed.

The first of four owner-supplied images is the work's cover. All four appear in their original order inside the work dialog. Visitors can swipe on touch screens, drag with a mouse, use the previous/next buttons, select a dot, or use Left/Right/Home/End while the gallery is focused. The corresponding scene introduction changes with each image. All four owner-provided narratives are polished for natural expression in five languages while preserving their content and substantial length. There is no automatic slideshow. Images retain their full composition. Reduced-motion preferences disable smooth movement.

Only the cover appears in the work grid. The other three images are created in the gallery after the work is opened. Optimised images are stored as `dist/assets/a1/silver-wings-01.webp` through `04.webp`. No PDF screenshots are used.

The 2023 study uses acrylic board, wood strips and mirror paper. Model dimensions are 19.3 × 10.4 × 5.55 inches. The four scenes are conceptual photomontages of models, not completed buildings. Internal reference: the owner-supplied Feng Ruixi A1.pdf, pages 179–183 and 193–197. Provenance stays in source metadata and this README; portfolio source names, PDF page numbers and A1 tags are not displayed to visitors.

Frostfade uses two owner-supplied photographs: the first is its cover and the second is a detail visible only in its gallery. Dimensions are 28 × 20 × 16 cm; materials are 3D printing supplies and flower-making liquid. The five-language introduction preserves the speculative environmental narrative.

Frostfade is associated by the owner with the **2024 Global Art Creation Award — Gold Medal**, dated **30 September 2024**, issued to Feng Rui Xi. The organiser/issuing institution is **European Association of Culture and Education**, as named on the supplied certificate. The certificate does not name the work; the work association is supplied by the owner. The certificate image, number and signatures are excluded from the site and repository. The separate `awards.html` page, homepage recognition row and work dialog list the award and institution. Only the confirmed Gold Medal is listed; the certificate’s future-tense reference to a European Teenagers Art Medal is not treated as another received award.

**Color Sphere Marine Blossoms** uses two further owner-supplied photographs, with the first as its cover and the second only in the work gallery. The owner specifies the space between “Color” and “Sphere” in every language. Dimensions are 26 × 15 × 17 cm; materials are foam balls, modelling clay and 3D printing supplies. Its future marine ecology narrative is polished in all five languages.

Its separate **Global Art Creation Award — Silver Medal** is dated **30 September 2024**, with the same named organiser, **European Association of Culture and Education**. The supplied certificate names Feng Rui Xi; the owner associates the award with this work. The certificate photograph, number and signatures are excluded. The Silver Medal appears as its own row beside Frostfade’s Gold Medal on the homepage and the dedicated awards page, and in its own work dialog.

**ArgenRubi** follows the same owner-supplied workflow: the first photograph is its cover, and both work photographs appear in the detail gallery. Dimensions are 41 × 32 × 34 cm; materials are tinfoil and balloons. The full speculative narrative about metal pollution, silver structures and red fruit-like forms is polished in all five languages.

The owner associates ArgenRubi with the **2024 Global Art Creation Award — Bronze Medal**, dated **30 September 2024**, organised/issued by **European Association of Culture and Education**. Its certificate image, number and signatures are excluded. The Bronze Medal is a separate entry in the homepage awards section, dedicated awards page and work dialog; the existing Gold and Silver entries remain attached to their own works.

**Pay Tribute** uses six owner-supplied photographs in their original order, with the first as its cover and the remaining five visible only in the work gallery. Its full narrative retains Background, Introduction and Significance sections, polished in all five languages. Dimensions are 36.5 × 38.1 × 24.7 cm; materials are polyester fibre, iron chain, iron wire, wooden strips and LED light strip. The owner states that this work has no award; it does not appear in Awards & honours.

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

- `dist/index.html`: navigation, page sections, covers and work dialog.
- `dist/awards.html`: dedicated awards and honours page, including organiser information and a work link.
- `dist/portfolio.js`: owner-assigned category, internal provenance, cover and ordered image metadata.
- `dist/locales.js`: visitor content in five languages.
- `dist/app.js`: filters, language selection, navigation, dialogs and image gallery.
- `dist/style.css`: responsive visual system and gallery layout.

Work links use `#project/silver-wings`. Future works should be added only when supplied, with the category specified by the owner and matching copy in all five languages.

## Publishing

`.openai/hosting.json` preserves the existing Site identity and serves `dist/`. GitHub source: [Arcionyx/steven-studio](https://github.com/Arcionyx/steven-studio). Preserve the current owner-private access settings.

Live site: https://steven-studio-arcionyx.steven0574.chatgpt.site

The contact destination remains the confirmed GitHub profile. The site submits no messages or payments.
