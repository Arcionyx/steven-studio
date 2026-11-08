const projects = [
  {id:'form',title:'Form & Feeling',category:'视觉识别 / 品牌探索',description:'用几何形态与有机曲线，探索视觉语言如何传递情绪。这个概念版式预留了品牌背景、设计过程、视觉系统与应用场景的展示空间。真实项目更新时，可以加入草图、成品图和项目说明。'},
  {id:'soft',title:'Soft Objects',category:'物件设计 / 材质研究',description:'一次关于触感、比例与日常物件的概念研究。项目详情可以记录从灵感、材料测试，到模型与最终实物的完整过程，并补充个人角色、年份与合作信息。'},
  {id:'between',title:'Between the Lines',category:'生成艺术 / 视觉实验',description:'以重复、节奏与变化为线索的概念视觉。这里可以展示艺术实验、动态作品或创意编程项目，并解释作品的创作动机与探索方式。'},
  {id:'ordinary',title:'The Ordinary',category:'编辑设计 / 字体排版',description:'从日常观察出发的编辑设计概念。这一项目页可以呈现书刊封面、内页节奏、字体选择和印刷细节，让作品从整体到细节都有清晰的展示。'},
  {id:'room',title:'A Room for Pause',category:'空间概念 / 光影研究',description:'以光、材质与停留为主题的空间概念。未来可替换为空间、装置、展陈或建筑相关作品，使用全景、细部、平面与过程图，完整讲述项目。'},
  {id:'play',title:'Serious About Play',category:'创意编程 / 自由实验',description:'为暂时没有分类的新想法保留一个位置。这个概念项目可以承载跨媒介实验、交互原型或个人艺术创作，持续记录创作过程中的发现。'}
];
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('.project')];
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
  cards.forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  document.querySelector('#filter-status').textContent = `显示 ${cards.filter(card => !card.hidden).length} 个概念项目`;
}));
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded','false'); menuButton.setAttribute('aria-label','打开导航'); mobileNav.hidden = true; }
menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open ? '关闭导航' : '打开导航'); mobileNav.hidden = !open; });
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
document.addEventListener('keydown', event => { if(event.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width:761px)').addEventListener('change', event => { if(event.matches) closeMenu(); });
const dialog = document.querySelector('#project-dialog');
let currentIndex = 0;
function renderProject(index) {
  currentIndex = index;
  const project = projects[index];
  document.querySelector('#dialog-title').textContent = project.title;
  document.querySelector('#dialog-category').textContent = project.category;
  document.querySelector('#dialog-description').textContent = project.description;
  const cover = document.querySelector(`[data-project="${project.id}"] .project-cover`).cloneNode(true);
  document.querySelector('#dialog-art').replaceChildren(cover);
  dialog.scrollTop = 0;
}
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  renderProject(projects.findIndex(project => project.id === button.dataset.project));
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
document.querySelector('#next-project').addEventListener('click', () => renderProject((currentIndex + 1) % projects.length));
dialog.addEventListener('click', event => { if(event.target === dialog) { const rect = dialog.getBoundingClientRect(); if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
document.querySelector('#year').textContent = new Date().getFullYear();
