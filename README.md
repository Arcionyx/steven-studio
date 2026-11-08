# Steven Studio

A personal portfolio for multidisciplinary art and design. Built with responsive HTML, CSS and JavaScript, with no build dependencies.

## Preview

Run `python3 -m http.server 8000 --directory dist`, then open http://localhost:8000. In the managed Sites environment, use `sites-preview start /workspace/sites/steven-studio`.

## Check

Run `npm run check`.

## Content

- `dist/index.html` contains the page sections, navigation, project covers, studio introduction and awards section.
- `dist/app.js` contains the six demonstration project descriptions, filters, project dialog and mobile navigation.
- `dist/style.css` contains the responsive design system and original CSS concept visuals.
- All six current projects are clearly labeled layout demonstrations. They are not real Steven projects or client work. The awards area contains an honest empty state until actual awards are provided.
- The only published contact link is the confirmed GitHub profile. Replace it with the preferred professional contact when supplied.

## Adding real projects and awards

For each project, collect title, year, discipline, personal role, a short description and 3–8 images with captions. Replace the corresponding project cover and metadata in `index.html` and description in `app.js`. Keep filter categories consistent between buttons and cards. Each project is opened with `data-project` matching the `id` in `app.js`.

For awards, replace `.awards-empty` with rows using the same three-column layout: year, award/organizer/level, project. Add only verified information supplied by Steven.

## Publishing

The Sites identity is tracked in `.openai/hosting.json`, with static files served from `dist/`. GitHub is the user-owned source repository. The Sites source remote stores the same commit used for deployment. No credentials belong in the source tree.

## Design references

The information structure is informed by MAD (https://www.i-mad.com/) and Zaha Hadid Architects (https://www.zaha-hadid.com/): prominent project presentation, a browsable multidisciplinary archive, and a distinct studio introduction. This site uses original layout, copy and CSS concept artwork; no artwork or project images from either reference studio are reused.
