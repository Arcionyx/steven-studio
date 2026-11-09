import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const assets = ['locales.js', 'portfolio.js', 'app.js', 'style.css', 'sketches.js'];
const versions = new Map(await Promise.all(assets.map(async asset => {
  const content = await readFile(new URL('../dist/' + asset, import.meta.url));
  return [asset, createHash('sha256').update(content).digest('hex').slice(0, 12)];
})));

for (const page of ['index.html', 'awards.html', 'tempus-forestum-retreat-sketches.html']) {
  const location = new URL('../dist/' + page, import.meta.url);
  const html = await readFile(location, 'utf8');
  const updated = html.replace(/\b(src|href)="([^"]+)"/g, (match, attribute, reference) => {
    const asset = reference.split('?')[0];
    const version = versions.get(asset);
    return version ? `${attribute}="${asset}?v=${version}"` : match;
  });
  if (updated !== html) await writeFile(location, updated);
}

console.log('Updated content versions for local assets across the site pages.');
