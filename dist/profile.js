const profileLocales = window.STUDIO_LOCALES;
const profileSelector = document.querySelector('#language-selector');
const profileStorageKey = 'steven-studio-language';
const profileMenu = document.querySelector('.menu-toggle');
const profileMobileNav = document.querySelector('#mobile-nav');
let profileLanguage = 'en';
const profileText = key => key.split('.').reduce((value, segment) => value[segment], profileLocales[profileLanguage]);

function initialProfileLanguage() {
  const linked = new URL(location.href).searchParams.get('lang');
  if (Object.hasOwn(profileLocales, linked)) return linked;
  try {
    const saved = localStorage.getItem(profileStorageKey);
    if (Object.hasOwn(profileLocales, saved)) return saved;
  } catch { /* Language storage is optional. */ }
  return 'en';
}
function updateProfileMenuLabel() {
  profileMenu.setAttribute('aria-label', profileText(profileMenu.getAttribute('aria-expanded') === 'true' ? 'menuClose' : 'menuOpen'));
}
function applyProfileLanguage(language, updateUrl = false) {
  profileLanguage = Object.hasOwn(profileLocales, language) ? language : 'en';
  document.documentElement.lang = profileLanguage;
  document.title = profileText('profile.metaTitle');
  document.querySelector('meta[name="description"]').content = profileText('profile.metaDescription');
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = profileText(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => { element.setAttribute('aria-label', profileText(element.dataset.i18nAriaLabel)); });
  document.querySelectorAll('[data-i18n-alt]').forEach(element => { element.alt = profileText(element.dataset.i18nAlt); });
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.getAttribute('href').startsWith('#')) return;
    const url = new URL(link.getAttribute('href'), location.href);
    if (url.origin !== location.origin || !url.pathname.endsWith('.html')) return;
    url.searchParams.set('lang', profileLanguage);
    link.href = url.pathname.split('/').pop() + url.search + url.hash;
  });
  profileSelector.value = profileLanguage;
  updateProfileMenuLabel();
  try { localStorage.setItem(profileStorageKey, profileLanguage); } catch { /* Language storage is optional. */ }
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('lang', profileLanguage);
    history.replaceState(null, '', url);
  }
}
function closeProfileMenu() {
  profileMenu.setAttribute('aria-expanded', 'false');
  profileMobileNav.hidden = true;
  updateProfileMenuLabel();
}
profileMenu.addEventListener('click', () => {
  const open = profileMenu.getAttribute('aria-expanded') !== 'true';
  profileMenu.setAttribute('aria-expanded', String(open));
  profileMobileNav.hidden = !open;
  updateProfileMenuLabel();
});
profileMobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeProfileMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeProfileMenu(); });
window.matchMedia('(min-width:761px)').addEventListener('change', event => { if (event.matches) closeProfileMenu(); });
profileSelector.addEventListener('change', () => applyProfileLanguage(profileSelector.value, true));
window.addEventListener('popstate', () => applyProfileLanguage(initialProfileLanguage()));
applyProfileLanguage(initialProfileLanguage());
profileSelector.disabled = false;
document.querySelector('#year').textContent = new Date().getFullYear();
