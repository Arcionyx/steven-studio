import {readFile, access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const html = await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
const manifest = JSON.parse(await readFile(new URL('../.openai/hosting.json',import.meta.url),'utf8'));
assert.equal(manifest.static.directory,'dist');
assert.ok(manifest.project_id);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate element IDs');
for (const [,id] of html.matchAll(/href="#([^"]+)"/g)) if (!id.startsWith('project/')) assert.ok(ids.includes(id),`Missing section: ${id}`);
for (const [,asset] of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css|svg|png|webp|woff2))"/g)) await access(new URL('../dist/'+asset,import.meta.url));
assert.ok(ids.includes('awards'));
assert.ok([...html.matchAll(/data-project="/g)].length > 0);
assert.ok(html.includes('<html lang="en">'),'English must be the static default');
const localeContext = {window:{}};
vm.runInNewContext(await readFile(new URL('../dist/locales.js',import.meta.url),'utf8'),localeContext);
const locales = localeContext.window.STUDIO_LOCALES;
assert.deepEqual(Object.keys(locales),['en','zh-Hans','zh-Hant','ja','ko']);
const flatten = (object,prefix='') => Object.entries(object).flatMap(([key,value]) => {
  const path = prefix ? `${prefix}.${key}` : key;
  return typeof value === 'string' ? [[path,value]] : flatten(value,path);
});
const portfolioContext = {window:{}};
vm.runInNewContext(await readFile(new URL('../dist/portfolio.js',import.meta.url),'utf8'),portfolioContext);
const works = portfolioContext.window.STUDIO_WORKS;
const cardIds = [...html.matchAll(/data-project="([^"]+)"/g)].map(match=>match[1]);
assert.deepEqual(cardIds,Object.keys(works),'Cards must match the real work archive');
for (const [id,work] of Object.entries(works)) {
  assert.ok(work.pages || work.source, `${id} is missing internal provenance`);
  assert.ok(html.includes(`data-filter="${work.category}"`), `${id} has no discipline filter`);
  for (const [image,caption,width,height] of work.images) {
    await access(new URL('../dist/'+(work.assetPath || 'assets/a1')+'/'+image+'.webp',import.meta.url));
    assert.ok(width>0 && height>0, `${image} is missing image dimensions`);
    for (const [language,dictionary] of Object.entries(locales)) {
      assert.ok(dictionary.projects[id].gallery[caption], `${language}.${id} is missing a caption`);
      if (dictionary.projects[id].scenes) assert.ok(dictionary.projects[id].scenes[caption].title && dictionary.projects[id].scenes[caption].description, `${language}.${id} is missing its scene introduction`);
    }
  }
}
const silver = works['silver-wings'];
assert.equal(silver.images.length,4,'Silver Wings must contain the four owner-supplied images');
assert.equal(silver.cover,silver.images[0][0],'The first image must be the cover');
assert.ok(html.includes(`src="assets/a1/${silver.cover}.webp"`),'Cover must appear in the work grid');
for (const [file] of silver.images.slice(1)) assert.ok(!html.includes(`src="assets/a1/${file}.webp"`),'Additional images must appear only inside work details');
const frost = works.frostfade;
assert.equal(frost.category,'installation');
assert.equal(frost.images.length,2,'Only the two Frostfade work photos belong in its gallery');
assert.equal(frost.cover,frost.images[0][0]);
assert.equal(frost.awards[0].distinction,'Gold Medal');
assert.equal(frost.awards[0].date,'2024-09-30');
const argen=works.argenrubi;
assert.equal(argen.category,'installation');
assert.equal(argen.images.length,2,'ArgenRubi must contain only the two work photos');
assert.equal(argen.awards[0].distinction,'Bronze Medal');
assert.equal(argen.awards[0].date,'2024-09-30');
const color=works['color-sphere'];
assert.equal(color.category,'installation');
assert.equal(color.images.length,2,'Color Sphere must contain only the two work photos');
assert.equal(color.awards[0].distinction,'Silver Medal');
assert.equal(color.awards[0].date,'2024-09-30');
for(const dictionary of Object.values(locales)) assert.equal(dictionary.projects['color-sphere'].title,'Color Sphere Marine Blossoms','The work title must retain the space between Color and Sphere');
for (const [id,work] of Object.entries(works)) {
  const imageRoot=work.assetPath || 'assets/a1';
  assert.ok(html.includes(`src="${imageRoot}/${work.cover}.webp"`),`${id} cover is missing`);
  for (const [image] of work.images.slice(1)) assert.ok(!html.includes(`src="${imageRoot}/${image}.webp"`),`${id} detail image leaked into the work grid`);
}
assert.ok(!/Weixin|certificate|526_137/i.test(html),'The award certificate image must not be published');
const awardsHtml=await readFile(new URL('../dist/awards.html',import.meta.url),'utf8');
assert.ok(awardsHtml.includes('European Association of Culture and Education'),'Award organiser is missing');
assert.ok(awardsHtml.includes('href="#project/frostfade"'),'Award must link to the work');
assert.ok(awardsHtml.includes('Gold Medal') && awardsHtml.includes('Silver Medal') && awardsHtml.includes('Bronze Medal') && awardsHtml.includes('2024-09-30'),'Award date or distinction is missing');
assert.ok(awardsHtml.includes('href="#project/color-sphere"'),'Silver award must link to Color Sphere');
assert.ok(awardsHtml.includes('href="#project/argenrubi"'),'Bronze award must link to ArgenRubi');
for(const [,category,count] of html.matchAll(/<button[^>]*data-filter="([^"]+)"[\s\S]*?<sup>(\d+)<\/sup><\/button>/g)) {
  const expected=category==='all'?Object.keys(works).length:Object.values(works).filter(w=>w.category===category).length;
  assert.equal(Number(count),expected,`Incorrect filter count for ${category}`);
}
assert.ok(html.includes('href="awards.html"'),'Awards page must be reachable');
const awardsIds=[...awardsHtml.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(awardsIds.length,new Set(awardsIds).size,'Duplicate awards-page IDs');
for(const page of [html,awardsHtml]) for(const [,route] of page.matchAll(/href="#project\/([^"]+)"/g)) assert.ok(works[route],`Unknown linked work ${route}`);
assert.ok(!/source-reference|id="dialog-source"|Portfolio source|PDF pages|A1 PORTFOLIO/.test(html),'Internal provenance must not be rendered');
assert.ok(ids.includes('gallery-prev') && ids.includes('gallery-next'),'Gallery navigation is missing');
assert.ok(!/Form &amp; Feeling|Soft Objects|Between the Lines|Serious About Play/.test(html),'Demo projects must be removed');
if (Object.values(works).every(work => work.images.length === 0)) {
  const imageSources = [...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(match=>match[1]);
  assert.ok(imageSources.length > 0 && imageSources.every(source=>source==='assets/sf-monogram.png'),'Text-only archive must preserve only SF brand images');
  assert.ok(!html.includes('assets/a1/'),'Removed project images must not remain referenced');
}
const baseKeys = flatten(locales.en).map(([key])=>key).sort();
const baseMessages = Object.fromEntries(flatten(locales.en));
const usedKeys = [...(html+awardsHtml).matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)].map(match=>match[1]);
for (const [locale,messages] of Object.entries(locales)) {
  const flattened = Object.fromEntries(flatten(messages));
  assert.deepEqual(Object.keys(flattened).sort(),baseKeys,`${locale} has missing or extra translations`);
  for (const key of usedKeys) assert.ok(flattened[key],`${locale} is missing ${key}`);
  for (const [key,value] of Object.entries(flattened)) {
    assert.ok(value.trim(),`${locale}.${key} is empty`);
    assert.ok(!/[<>]/.test(value),`${locale}.${key} must be plain text`);
    const variables = [...value.matchAll(/\{(\w+)\}/g)].map(match=>match[1]).sort();
    const reference = baseMessages[key];
    assert.deepEqual(variables,[...reference.matchAll(/\{(\w+)\}/g)].map(match=>match[1]).sort(),`${locale}.${key} has inconsistent placeholders`);
  }
}
const withoutLanguageOptions = html.replace(/<select id="language-selector"[^>]*>[\s\S]*?<\/select>/,'');
assert.ok(!/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(withoutLanguageOptions),'Default English HTML contains mixed-language copy');
console.log('Site checks passed: real work archive, source pages, image assets, navigation, five complete language dictionaries and English default.');
