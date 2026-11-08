const locales = window.STUDIO_LOCALES;
const projectIds = ['form', 'soft', 'between', 'ordinary', 'room', 'play'];
const storageKey = 'steven-studio-language';
const languageSelector = document.querySelector('#language-selector');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.project')];
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const dialog = document.querySelector('#project-dialog');
let currentLocale = 'en';
let currentIndex = 0;

function supportedLocale(value) {
  return Object.hasOwn(locales, value) ? value : null;
}
function initialLocale() {
  const linked = supportedLocale(new URL(window.location.href).searchParams.get('lang'));
  if (linked) return linked;
  try { return supportedLocale(localStorage.getItem(storageKey)) || 'en'; }
  catch { return 'en'; }
}
function text(key) {
  return key.split('.').reduce((value, segment) => value[segment], locales[currentLocale]);
}
function format(template, values) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key]);
}
function updateFilterStatus() {
  document.querySelector('#filter-status').textContent = format(text('filterStatus'), {count: cards.filter(card => !card.hidden).length});
}
function updateMenuLabel() {
  menuButton.setAttribute('aria-label', text(menuButton.getAttribute('aria-expanded') === 'true' ? 'menuClose' : 'menuOpen'));
}
function applyLocale(value, updateUrl = false) {
  currentLocale = supportedLocale(value) || 'en';
  document.documentElement.lang = currentLocale;
  document.title = text('metaTitle');
  document.querySelector('meta[name="description"]').content = text('metaDescription');
  document.querySelectorAll('[data-i18n]').forEach(element => {
    element.textContent = text(element.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
    element.setAttribute('aria-label', text(element.dataset.i18nAriaLabel));
  });
  document.querySelectorAll('[data-project]').forEach(button => {
    button.setAttribute('aria-label', format(text('projectOpen'), {title: text(`projects.${button.dataset.project}.title`)}));
  });
  languageSelector.value = currentLocale;
  updateFilterStatus();
  updateMenuLabel();
  renderProject(currentIndex);
  try { localStorage.setItem(storageKey, currentLocale); } catch { /* Language switching also works without storage. */ }
  if (updateUrl) {
    const url = new URL(window.location.href);
    url.searchParams.set('lang', currentLocale);
    window.history.replaceState(null, '', url);
  }
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  updateFilterStatus();
}));
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  mobileNav.hidden = true;
  updateMenuLabel();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  mobileNav.hidden = !open;
  updateMenuLabel();
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width:761px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
function renderProject(index) {
  currentIndex = index;
  const id = projectIds[index];
  document.querySelector('#dialog-title').textContent = text(`projects.${id}.title`);
  document.querySelector('#dialog-category').textContent = text(`projects.${id}.category`);
  document.querySelector('#dialog-description').textContent = text(`projects.${id}.description`);
  const cover = document.querySelector(`[data-project="${id}"] .project-cover`).cloneNode(true);
  document.querySelector('#dialog-art').replaceChildren(cover);
  dialog.scrollTop = 0;
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  renderProject(projectIds.indexOf(button.dataset.project));
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#next-project').addEventListener('click', () => renderProject((currentIndex + 1) % projectIds.length));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
languageSelector.addEventListener('change', () => applyLocale(languageSelector.value, true));
window.addEventListener('popstate', () => applyLocale(initialLocale()));
applyLocale(initialLocale());
languageSelector.disabled = false;
document.querySelector('#year').textContent = new Date().getFullYear();
