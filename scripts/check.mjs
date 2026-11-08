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
for (const [,asset] of html.matchAll(/(?:src|href)="([^"#]+\.(?:js|css|svg))"/g)) await access(new URL('../dist/'+asset,import.meta.url));
assert.ok(ids.includes('awards'));
assert.equal([...html.matchAll(/data-project="/g)].length,6);
assert.ok(html.includes('<html lang="en">'),'English must be the static default');
const localeContext = {window:{}};
vm.runInNewContext(await readFile(new URL('../dist/locales.js',import.meta.url),'utf8'),localeContext);
const locales = localeContext.window.STUDIO_LOCALES;
assert.deepEqual(Object.keys(locales),['en','zh-Hans','zh-Hant','ja','ko']);
const flatten = (object,prefix='') => Object.entries(object).flatMap(([key,value]) => {
  const path = prefix ? `${prefix}.${key}` : key;
  return typeof value === 'string' ? [[path,value]] : flatten(value,path);
});
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
console.log('Site checks passed: assets, navigation, five complete language dictionaries, translation keys and English default.');
