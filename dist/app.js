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
const gallery = document.querySelector('#dialog-gallery');
const gallerySection = document.querySelector('#project-gallery');
let currentLocale = 'en';
let currentIndex = 0;
let currentSlide = 0;
let drag = null;
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
  const status = document.querySelector('#filter-status');
  if (status) status.textContent = format(text('filterStatus'), {count: cards.filter(card => !card.hidden).length});
}
function updateMenuLabel() {
  menuButton.setAttribute('aria-label', text(menuButton.getAttribute('aria-expanded') === 'true' ? 'menuClose' : 'menuOpen'));
}
function applyLocale(value, updateUrl = false) {
  currentLocale = supportedLocale(value) || 'en';
  document.documentElement.lang = currentLocale;
  const awardsPage = document.body.dataset.page === 'awards';
  document.title = text(awardsPage ? 'awardsMetaTitle' : 'metaTitle');
  document.querySelector('meta[name="description"]').content = text(awardsPage ? 'awardsMetaDescription' : 'metaDescription');
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = text(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => { element.setAttribute('aria-label', text(element.dataset.i18nAriaLabel)); });
  document.querySelectorAll('[data-i18n-alt]').forEach(element => { element.alt = text(element.dataset.i18nAlt); });
  document.querySelectorAll('[data-project]').forEach(button => { button.setAttribute('aria-label', format(text('projectOpen'), {title: text(`projects.${button.dataset.project}.title`)})); });
  languageSelector.value = currentLocale;
  updateFilterStatus();
  updateMenuLabel();
  if (dialog.open) renderProject(currentIndex, currentSlide);
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
function updateSlideState(index) {
  const total = works[projectIds[currentIndex]].images.length;
  currentSlide = Math.max(0, Math.min(index, total - 1));
  const position = document.querySelector('#gallery-position');
  position.textContent = `${currentSlide + 1} / ${total}`;
  position.setAttribute('aria-label', format(text('galleryPosition'), {current: currentSlide + 1, total}));
  const imageKey = works[projectIds[currentIndex]].images[currentSlide]?.[1];
  const scene = imageKey && text(`projects.${projectIds[currentIndex]}`).scenes?.[imageKey];
  document.querySelector('.gallery-story').hidden = !scene;
  if (scene) {
    document.querySelector('#gallery-scene-title').textContent = scene.title;
    const description = document.querySelector('#gallery-scene-description');
    if (description.textContent !== scene.description) description.textContent = scene.description;
  }
  document.querySelector('#gallery-prev').disabled = currentSlide === 0;
  document.querySelector('#gallery-next').disabled = currentSlide >= total - 1;
  document.querySelectorAll('.gallery-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
    dot.setAttribute('aria-pressed', String(i === currentSlide));
  });
}
function goToSlide(index, smooth = true) {
  const total = works[projectIds[currentIndex]].images.length;
  if (!total) return;
  updateSlideState(index);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gallery.scrollTo({left: currentSlide * gallery.clientWidth, behavior: smooth && !reduced ? 'smooth' : 'auto'});
}
gallery.addEventListener('scroll', () => {
  if (!gallery.clientWidth) return;
  updateSlideState(Math.round(gallery.scrollLeft / gallery.clientWidth));
}, {passive:true});
document.querySelector('#gallery-prev').addEventListener('click', () => goToSlide(currentSlide - 1));
document.querySelector('#gallery-next').addEventListener('click', () => goToSlide(currentSlide + 1));
gallery.addEventListener('keydown', event => {
  const destinations = {ArrowLeft:currentSlide - 1, ArrowRight:currentSlide + 1, Home:0, End:works[projectIds[currentIndex]].images.length - 1};
  if (Object.hasOwn(destinations, event.key)) {
    event.preventDefault();
    goToSlide(destinations[event.key]);
  }
});
gallery.addEventListener('dragstart', event => event.preventDefault());
gallery.addEventListener('pointerdown', event => {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  drag = {start:event.clientX, left:gallery.scrollLeft, moved:false};
  gallery.setPointerCapture(event.pointerId);
});
gallery.addEventListener('pointermove', event => {
  if (!drag) return;
  const delta = event.clientX - drag.start;
  if (Math.abs(delta) > 5) drag.moved = true;
  if (!drag.moved) return;
  event.preventDefault();
  gallery.classList.add('is-dragging');
  gallery.scrollLeft = drag.left - delta;
});
function finishDrag(event) {
  if (!drag) return;
  const moved = drag.moved;
  drag = null;
  if (gallery.hasPointerCapture(event.pointerId)) gallery.releasePointerCapture(event.pointerId);
  gallery.classList.remove('is-dragging');
  if (moved) goToSlide(Math.round(gallery.scrollLeft / gallery.clientWidth));
}
gallery.addEventListener('pointerup', finishDrag);
gallery.addEventListener('pointercancel', finishDrag);
window.addEventListener('resize', () => { if (dialog.open) goToSlide(currentSlide, false); });
function renderProject(index, slide = 0) {
  currentIndex = index;
  const id = projectIds[index];
  const work = works[id];
  const copy = text(`projects.${id}`);
  document.querySelector('#dialog-title').textContent = copy.title;
  document.querySelector('#dialog-category').textContent = copy.category;
  const description = document.querySelector('#dialog-description');
  description.textContent = copy.description;
  description.hidden = Boolean(copy.narrative);
  const narrative = document.querySelector('#dialog-narrative');
  narrative.hidden = !copy.narrative;
  narrative.replaceChildren(...Object.values(copy.narrative || {}).map(section => {
    const block = document.createElement('section');
    const heading = document.createElement('h3');
    heading.textContent = section.title;
    const paragraph = document.createElement('p');
    paragraph.textContent = section.body;
    block.append(heading, paragraph);
    return block;
  }));
  document.querySelector('#dialog-details').textContent = copy.details;
  const awardSection = document.querySelector('#dialog-awards');
  awardSection.hidden = !copy.award;
  if (copy.award) {
    document.querySelector('#dialog-award-level').textContent = `${work.awards[0].year} · ${copy.award.level}`;
    document.querySelector('#dialog-award-name').textContent = copy.award.name;
    document.querySelector('#dialog-award-organizer').textContent = `${text('awardOrganizerLabel')}: ${copy.award.organizer}`;
  }
  const firstImage = work.images[0];
  if (firstImage) gallery.style.setProperty('--gallery-aspect', `${firstImage[2]} / ${firstImage[3]}`);
  const figures = work.images.map(([file, captionKey, width, height], imageIndex) => {
    const figure = document.createElement('figure');
    figure.setAttribute('role', 'group');
    figure.setAttribute('aria-label', format(text('galleryPosition'), {current:imageIndex + 1, total:work.images.length}));
    const image = document.createElement('img');
    image.src = `${work.assetPath || 'assets/a1'}/${file}.webp`;
    image.alt = copy.gallery[captionKey];
    image.width = width;
    image.height = height;
    image.loading = imageIndex ? 'lazy' : 'eager';
    const caption = document.createElement('figcaption');
    caption.textContent = copy.gallery[captionKey];
    figure.append(image, caption);
    return figure;
  });
  gallery.replaceChildren(...figures);
  gallerySection.hidden = figures.length === 0;
  const dots = work.images.map((_, imageIndex) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot';
    dot.setAttribute('aria-label', format(text('galleryImage'), {number:imageIndex + 1}));
    dot.addEventListener('click', () => goToSlide(imageIndex));
    return dot;
  });
  document.querySelector('#gallery-dots').replaceChildren(...dots);
  if (figures.length) goToSlide(slide, false);
  else currentSlide = 0;
  const visible = cards.filter(card => !card.hidden);
  document.querySelector('#next-project').hidden = visible.length < 2;
  dialog.scrollTop = 0;
}
function openProject(id, updateHash = true) {
  if (!Object.hasOwn(works, id)) return;
  renderProject(projectIds.indexOf(id));
  if (!dialog.open) dialog.showModal();
  requestAnimationFrame(() => { if (dialog.open) goToSlide(currentSlide, false); });
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
