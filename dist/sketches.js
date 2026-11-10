const sketchLocales = window.STUDIO_LOCALES;
const sketchCopyKey = 'projects.tempus-forestum-retreat.sketchbook';
const sketchLanguageSelector = document.querySelector('#language-selector');
const sketchStorageKey = 'steven-studio-language';
let sketchLanguage = 'en';
const sketchText = key => key.split('.').reduce((value, segment) => value[segment], sketchLocales[sketchLanguage]);

function initialSketchLanguage() {
  const linked = new URL(location.href).searchParams.get('lang');
  if (Object.hasOwn(sketchLocales, linked)) return linked;
  try {
    const saved = localStorage.getItem(sketchStorageKey);
    if (Object.hasOwn(sketchLocales, saved)) return saved;
  } catch { /* Language storage is optional. */ }
  return 'en';
}
function updateSketchMenuLabel() {
  const button = document.querySelector('.menu-toggle');
  button.setAttribute('aria-label', sketchText(button.getAttribute('aria-expanded') === 'true' ? 'menuClose' : 'menuOpen'));
}
function applySketchLanguage(language, updateUrl = false) {
  sketchLanguage = Object.hasOwn(sketchLocales, language) ? language : 'en';
  document.documentElement.lang = sketchLanguage;
  document.title = sketchText(sketchCopyKey + '.metaTitle');
  document.querySelector('meta[name="description"]').content = sketchText(sketchCopyKey + '.metaDescription');
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = sketchText(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => { element.setAttribute('aria-label', sketchText(element.dataset.i18nAriaLabel)); });
  document.querySelectorAll('[data-i18n-alt]').forEach(element => { element.alt = sketchText(element.dataset.i18nAlt); });
  document.querySelectorAll('[data-work-return]').forEach(link => {
    link.href = `index.html?lang=${encodeURIComponent(sketchLanguage)}#project/tempus-forestum-retreat`;
  });
  document.querySelectorAll('[data-profile-link]').forEach(link => { link.href = 'about.html?lang=' + encodeURIComponent(sketchLanguage); });
  sketchLanguageSelector.value = sketchLanguage;
  updateSketchMenuLabel();
  try { localStorage.setItem(sketchStorageKey, sketchLanguage); } catch { /* Language storage is optional. */ }
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('lang', sketchLanguage);
    history.replaceState(null, '', url);
  }
}
const sketchMenuButton = document.querySelector('.menu-toggle');
const sketchMobileNav = document.querySelector('#mobile-nav');
function closeSketchMenu() {
  sketchMenuButton.setAttribute('aria-expanded', 'false');
  sketchMobileNav.hidden = true;
  updateSketchMenuLabel();
}
sketchMenuButton.addEventListener('click', () => {
  const open = sketchMenuButton.getAttribute('aria-expanded') !== 'true';
  sketchMenuButton.setAttribute('aria-expanded', String(open));
  sketchMobileNav.hidden = !open;
  updateSketchMenuLabel();
});
sketchMobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeSketchMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeSketchMenu(); });
window.matchMedia('(min-width:761px)').addEventListener('change', event => { if (event.matches) closeSketchMenu(); });
sketchLanguageSelector.addEventListener('change', () => applySketchLanguage(sketchLanguageSelector.value, true));
window.addEventListener('popstate', () => applySketchLanguage(initialSketchLanguage()));
applySketchLanguage(initialSketchLanguage());
sketchLanguageSelector.disabled = false;
document.querySelector('#year').textContent = new Date().getFullYear();
