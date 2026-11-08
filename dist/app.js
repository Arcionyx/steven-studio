const locales = window.STUDIO_LOCALES;
const works = window.STUDIO_WORKS;
const projectIds = Object.keys(works);
const storageKey = 'steven-studio-language';
const languageSelector = document.querySelector('#language-selector');
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.project')];
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const dialog = document.querySelector('#project-dialog');
let currentLocale = 'en';
let currentIndex = 0;
let opener = null;

function supportedLocale(value) {
  return Object.hasOwn(locales, value) ? value : null;
}
function initialLocale() {
  const linked = supportedLocale(new URL(location.href).searchParams.get('lang'));
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
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = text(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => { element.setAttribute('aria-label', text(element.dataset.i18nAriaLabel)); });
  document.querySelectorAll('[data-i18n-alt]').forEach(element => { element.alt = text(element.dataset.i18nAlt); });
  document.querySelectorAll('[data-project]').forEach(button => { button.setAttribute('aria-label', format(text('projectOpen'), {title: text(`projects.${button.dataset.project}.title`)})); });
  languageSelector.value = currentLocale;
  updateFilterStatus();
  updateMenuLabel();
  if (dialog.open) renderProject(currentIndex);
  try { localStorage.setItem(storageKey, currentLocale); } catch { /* Storage is optional. */ }
  if (updateUrl) {
    const url = new URL(location.href);
    url.searchParams.set('lang', currentLocale);
    history.replaceState(null, '', url);
  }
}
filterButtons.forEach(button => button.addEventListener('click', () => {
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  cards.forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; });
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
  const work = works[id];
  const copy = text(`projects.${id}`);
  document.querySelector('#dialog-title').textContent = copy.title;
  document.querySelector('#dialog-category').textContent = copy.category;
  document.querySelector('#dialog-description').textContent = copy.description;
  document.querySelector('#dialog-details').textContent = copy.details;
  document.querySelector('#dialog-source').textContent = format(text('sourceText'), {pages:work.pages});
  const figures = work.images.map(([file, captionKey, width, height], imageIndex) => {
    const figure = document.createElement('figure');
    const image = document.createElement('img');
    image.src = `assets/a1/${file}.webp`;
    image.alt = copy.gallery[captionKey];
    image.width = width;
    image.height = height;
    image.loading = imageIndex ? 'lazy' : 'eager';
    const caption = document.createElement('figcaption');
    caption.textContent = copy.gallery[captionKey];
    figure.append(image, caption);
    return figure;
  });
  const gallery = document.querySelector('#dialog-gallery');
  gallery.replaceChildren(...figures);
  gallery.hidden = figures.length === 0;
  const visible = cards.filter(card => !card.hidden);
  document.querySelector('#next-project').hidden = visible.length < 2;
  dialog.scrollTop = 0;
}
function openProject(id, updateHash = true) {
  if (!Object.hasOwn(works, id)) return;
  renderProject(projectIds.indexOf(id));
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
  if (updateHash) {
    const url = new URL(location.href);
    url.hash = `project/${id}`;
    history.replaceState(null, '', url);
  }
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  opener = button;
  openProject(button.dataset.project);
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#next-project').addEventListener('click', () => {
  const visibleIds = cards.filter(card => !card.hidden).map(card => card.querySelector('[data-project]').dataset.project);
  const currentId = projectIds[currentIndex];
  openProject(visibleIds[(visibleIds.indexOf(currentId) + 1) % visibleIds.length]);
} );
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  if (location.hash.startsWith('#project/')) {
    const url = new URL(location.href); url.hash = 'work'; history.replaceState(null, '', url);
  }
  if (opener && !opener.closest('.project').hidden) opener.focus({preventScroll:true});
});
function syncLocation() {
  applyLocale(initialLocale());
  const id = location.hash.slice('#project/'.length);
  if (location.hash.startsWith('#project/') && Object.hasOwn(works,id)) openProject(id, false);
  else if (dialog.open) dialog.close();
}
languageSelector.addEventListener('change', () => applyLocale(languageSelector.value, true));
window.addEventListener('popstate', syncLocation);
window.addEventListener('hashchange', syncLocation);
syncLocation();
languageSelector.disabled = false;
document.querySelector('#year').textContent = new Date().getFullYear();
