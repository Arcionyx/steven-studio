# Steven Studio

Steven Studio is Ruixi (Steven) Feng's personal art and design portfolio. It is a responsive, buildless HTML/CSS/JavaScript site.

## Current content

The supplied **Feng Ruixi A1.pdf** is the source for eight work groups. A1 is a portfolio source, not a design category. Work is organised by discipline:

| Discipline | Work | Source PDF pages |
| --- | --- | --- |
| Architecture & space | Adversity Silver Wings | 179–183, 193–197 |
| Architecture & space | Paper into Space | 35–52 |
| Industrial & product | Snake Scale Tableware | 59–84 |
| Visual communication | Futureform Architects | 19–34 |
| Photography | Light Painting | 8–18 |
| Installation & sculpture | Future Fibre Optic Transmitter | 53–58 |
| Installation & sculpture | Pay Tribute | 85–95 |
| Installation & sculpture | Future Plants | 96–109 |

The website currently uses typographic covers without project images.

The eight groups include workshop studies and a final spatial proposal within one supplied portfolio. Work names, materials, dimensions, camera settings and descriptions are grounded in those pages. “Paper into Space”, “Snake Scale Tableware”, “Light Painting” and “Future Plants” are editorial group titles. The PDF's original names are retained in the descriptions where useful.

**Adversity Silver Wings** is explicitly dated 2023 in the source. Dates are not invented for the other works. Architectural scenes are labelled as conceptual photomontages of physical models, not completed buildings. Futureform is an imagined practice used for an identity exercise. The transmitter and plants are speculative artworks, not functioning devices or scientific claims. Pay Tribute is identified as a study responding to Mori Chack and Adela Andea.

The provided PDF does not identify a named award for Steven's projects. Artist-research awards are not attributed to Steven. Page 144 mentions piano Grade 9 and unspecified childhood competition awards; neither is presented as a project award. The recognition section states the current evidence limit.

## Identity and languages

The existing SF monogram, Steven Studio wordmark, and self-hosted Cormorant Garamond display fonts are preserved. Font licensing is included in `dist/assets/fonts/`.

English is the default. Complete Simplified Chinese, Traditional Chinese, Japanese and Korean dictionaries include project details, filter labels, image captions, alt text, source references, metadata and accessibility labels. Language choice persists locally. A valid `?lang=` parameter takes precedence over storage.

## Preview and checks

```sh
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
npm run check
```

Checks cover source-page references, discipline filters, navigation, complete dictionaries and English HTML. Browser QA covers filters and locales, work dialogs, deep links, keyboard dismissal and responsive layouts.

## Editing

- `dist/index.html`: page sections and real-work cards.
- `dist/portfolio.js`: work IDs, discipline assignments, source-page references and empty image slots for future owner-supplied assets.
- `dist/locales.js`: complete visitor-facing content in five languages.
- `dist/app.js`: filtering, language selection, navigation, accessible dialogs and shareable `#project/<id>` links. “Next work” stays within the selected discipline.
- `dist/style.css`: responsive design and original editorial visual system.
The archive is intentionally text-only at the owner’s request. No project images, PDF screenshots, or derived image assets are deployed. The owner will supply publication images separately. The existing SF brand assets are retained. The original PDF is not included in deployment.

To add more work, add metadata and images, insert its card and provide matching content in all five languages. Classify by the actual design discipline. Keep the current A1 work attached to its source and add separate provenance for later portfolios.

## Publishing

`.openai/hosting.json` preserves the existing Steven Studio project ID and serves `dist/`. The user-owned GitHub source is [Arcionyx/steven-studio](https://github.com/Arcionyx/steven-studio). Existing owner-private audience settings are preserved.

Live site: https://steven-studio-arcionyx.steven0574.chatgpt.site

The confirmed contact destination remains the GitHub profile. No messages or payments are submitted by this site.
