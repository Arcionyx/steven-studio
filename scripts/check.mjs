import {readFile, access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const html = await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
const manifest = JSON.parse(await readFile(new URL('../.openai/hosting.json',import.meta.url),'utf8'));
assert.equal(manifest.static.directory,'dist');
assert.ok(manifest.project_id);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate element IDs');
for (const [,id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(id),`Missing section: ${id}`);
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
  assert.ok(work.pages, `${id} is missing source pages`);
  assert.ok(html.includes(`data-filter="${work.category}"`), `${id} has no discipline filter`);
  for (const [image,caption,width,height] of work.images) {
    await access(new URL('../dist/assets/a1/'+image+'.webp',import.meta.url));
    assert.ok(width>0 && height>0, `${image} is missing image dimensions`);
    for (const [language,dictionary] of Object.entries(locales)) assert.ok(dictionary.projects[id].gallery[caption], `${language}.${id} is missing a caption`);
  }
}
assert.ok(!/Form &amp; Feeling|Soft Objects|Between the Lines|Serious About Play/.test(html),'Demo projects must be removed');
if (Object.values(works).every(work => work.images.length === 0)) {
  const imageSources = [...html.matchAll(/<img\b[^>]*src="([^"]+)"/g)].map(match=>match[1]);
  assert.ok(imageSources.length > 0 && imageSources.every(source=>source==='assets/sf-monogram.png'),'Text-only archive must preserve only SF brand images');
  assert.ok(!html.includes('assets/a1/'),'Removed project images must not remain referenced');
}
const baseKeys = flatten(locales.en).map(([key])=>key).sort();
const baseMessages = Object.fromEntries(flatten(locales.en));
const usedKeys = [...html.matchAll(/data-i18n(?:-aria-label)?="([^"]+)"/g)].map(match=>match[1]);
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
