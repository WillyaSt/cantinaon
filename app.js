const routes = [
  { section: 'Comece aqui', icon: '✦', items: [
    ['introducao', 'Introdução', 'pages/introducao.html'], ['primeiro-acesso', 'Primeiro acesso', 'pages/primeiro-acesso.html'], ['relatorios', 'Relatórios', 'pages/relatorios.html'], ['faq', 'FAQ e suporte', 'pages/faq.html']
  ]},
  { section: 'Aluno / Responsável', icon: '👤', items: [
    ['aluno/dashboard', 'Dashboard', 'pages/aluno/dashboard.html'], ['aluno/cardapio', 'Cardápio e categorias', 'pages/aluno/cardapio.html'], ['aluno/carrinho-checkout', 'Carrinho, checkout e pagamento', 'pages/aluno/carrinho-checkout.html'], ['aluno/pedidos-fila', 'Pedidos, fila e retirada', 'pages/aluno/pedidos-fila.html'], ['aluno/carteira-historico', 'Carteira e histórico', 'pages/aluno/carteira-historico.html'], ['aluno/alergenicos', 'Alérgenos e alergias', 'pages/aluno/alergenicos.html'], ['aluno/controle-parental', 'Controle parental', 'pages/aluno/controle-parental.html'], ['aluno/responsavel-aluno', 'Vínculo responsável-aluno', 'pages/aluno/responsavel-aluno.html']
  ]},
  { section: 'Funcionário da Cantina', icon: '🍽️', items: [
    ['funcionario/painel-operacional', 'Painel operacional', 'pages/funcionario/painel-operacional.html'], ['funcionario/pedidos-status', 'Pedidos e status', 'pages/funcionario/pedidos-status.html'], ['funcionario/retirada-contingencia', 'Retirada, online e contingência', 'pages/funcionario/retirada-contingencia.html'], ['funcionario/cancelamentos-auditoria', 'Cancelamentos e auditoria', 'pages/funcionario/cancelamentos-auditoria.html']
  ]},
  { section: 'Administrador', icon: '⚙️', items: [
    ['admin/usuarios-permissoes', 'Usuários, perfis e permissões', 'pages/admin/usuarios-permissoes.html'], ['admin/produtos-cardapio', 'Produtos e cardápio', 'pages/admin/produtos-cardapio.html'], ['admin/estoque-disponibilidade', 'Estoque e disponibilidade', 'pages/admin/estoque-disponibilidade.html'], ['admin/parametros-seguranca', 'Parâmetros e segurança alimentar', 'pages/admin/parametros-seguranca.html']
  ]},
  { section: 'Governança documental', icon: '📘', items: [
    ['estrutura-documental', 'Estrutura documental', 'pages/estrutura-documental.html']
  ]}
];

const routeMap = new Map(routes.flatMap(group => group.items.map(item => [item[0], { title: item[1], path: item[2], section: group.section }])));
const $ = selector => document.querySelector(selector);
const state = { page: null, searchIndex: [], selectedResult: -1, filter: 'Todos' };

function init() {
  buildNav();
  bindEvents();
  applyTheme(localStorage.getItem('cantinaon-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  if (!localStorage.getItem('cantinaon-onboarded')) $('#onboarding').hidden = false;
  loadSearchIndex();
  navigate(currentPage(), true);
}

function currentPage() {
  const params = new URLSearchParams(location.search);
  const page = params.get('page') || location.hash.replace('#/', '');
  return routeMap.has(page) ? page : 'introducao';
}

function buildNav() {
  $('#sidebarNav').innerHTML = routes.map(group => `
    <details class="nav-section" open>
      <summary><span>${group.icon} ${group.section}</span></summary>
      ${group.items.map(([id, title]) => `<a class="nav-link" href="?page=${id}" data-page="${id}"><span class="nav-icon">${iconFor(id)}</span><span>${title}</span></a>`).join('')}
    </details>`).join('');
}

function iconFor(id) {
  if (id.includes('aluno')) return '◉';
  if (id.includes('funcionario')) return '▣';
  if (id.includes('admin')) return '◇';
  if (id.includes('faq')) return '?';
  if (id.includes('relatorio')) return '↗';
  return '•';
}

async function navigate(page, replace = false) {
  const route = routeMap.get(page) || routeMap.get('introducao');
  state.page = page;
  closeMobileSidebar();
  setActiveNav(page);
  setBreadcrumbs(route);
  updateFavoriteButton();
  $('#skeleton').hidden = false;
  $('#content').style.opacity = .35;
  try {
    const response = await fetch(route.path, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Página não encontrada: ${route.path}`);
    const html = await response.text();
    $('#content').innerHTML = html;
    document.title = `${route.title} — CantinaON Docs`;
    enhanceContent();
    if (replace) history.replaceState({ page }, '', `?page=${page}`);
    else history.pushState({ page }, '', `?page=${page}`);
    queueMicrotask(() => $('#content').focus({ preventScroll: true }));
    scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    $('#content').innerHTML = `<div class="callout critical"><strong>Não foi possível carregar a página.</strong><p>${error.message}</p></div>`;
  } finally {
    $('#skeleton').hidden = true;
    $('#content').style.opacity = 1;
    updateReadingProgress();
  }
}

function bindEvents() {
  document.addEventListener('click', event => {
    const pageLink = event.target.closest('[data-page]');
    const action = event.target.closest('[data-action]')?.dataset.action;
    if (pageLink) { event.preventDefault(); navigate(pageLink.dataset.page); }
    if (!action) return;
    if (action === 'toggle-sidebar') toggleSidebar();
    if (action === 'toggle-theme') applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
    if (action === 'open-search') openSearch();
    if (action === 'close-search') closeSearch();
    if (action === 'toggle-favorite') toggleFavorite();
    if (action === 'toggle-focus') document.querySelector('.app-shell').classList.toggle('focus-mode');
    if (action === 'close-onboarding') closeOnboarding();
  });
  window.addEventListener('popstate', () => navigate(currentPage(), true));
  window.addEventListener('scroll', () => { updateReadingProgress(); updateTocActive(); }, { passive: true });
  document.addEventListener('keydown', event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); openSearch(); }
    if (event.key === 'Escape') closeSearch();
    if (!$('#searchDialog').hidden) handleSearchKeys(event);
  });
  $('#searchInput').addEventListener('input', runSearch);
}

function setActiveNav(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    const active = link.dataset.page === page;
    link.classList.toggle('active', active);
    if (active) link.closest('details').open = true;
  });
}

function setBreadcrumbs(route) {
  $('#breadcrumbs').innerHTML = `<span>CantinaON Docs</span><span>${route.section}</span><span>${route.title}</span>`;
}

function enhanceContent() {
  assignHeadingIds();
  buildToc();
  wireFaqs();
  updateReadingTime();
  document.querySelectorAll('img[loading="lazy"]').forEach(img => img.decoding = 'async');
}

function assignHeadingIds() {
  $('#content').querySelectorAll('h2, h3').forEach(heading => {
    if (!heading.id) heading.id = heading.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  });
}

function buildToc() {
  const headings = [...$('#content').querySelectorAll('h2, h3')];
  $('#toc').innerHTML = headings.length ? headings.map(h => `<a href="#${h.id}" data-heading="${h.id}" style="margin-left:${h.tagName === 'H3' ? '12px' : '0'}">${h.textContent}</a>`).join('') : '<p class="muted">Sem seções internas.</p>';
}

function updateTocActive() {
  const headings = [...$('#content').querySelectorAll('h2, h3')];
  const current = headings.filter(h => h.getBoundingClientRect().top < 140).pop();
  document.querySelectorAll('#toc a').forEach(a => a.classList.toggle('active', current && a.dataset.heading === current.id));
}

function updateReadingProgress() {
  const article = $('#content');
  const total = Math.max(article.scrollHeight - innerHeight, 1);
  const top = Math.max(0, scrollY - article.offsetTop + 120);
  $('#readingProgress').style.inlineSize = `${Math.min(100, (top / total) * 100)}%`;
}

function updateReadingTime() {
  const words = ($('#content').innerText || '').trim().split(/\s+/).filter(Boolean).length;
  $('#readingTime').textContent = `Leitura: ${Math.max(1, Math.ceil(words / 210))} min`;
}

function wireFaqs() {
  $('#content').querySelectorAll('.faq-item button').forEach(button => {
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      item.classList.toggle('open');
      button.setAttribute('aria-expanded', item.classList.contains('open'));
    });
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('cantinaon-theme', theme);
}

function toggleSidebar() {
  const shell = document.querySelector('.app-shell');
  const open = shell.dataset.sidebar !== 'open';
  shell.dataset.sidebar = open ? 'open' : 'closed';
  $('[data-action="toggle-sidebar"]').setAttribute('aria-expanded', open);
}
function closeMobileSidebar(){ document.querySelector('.app-shell').dataset.sidebar = 'closed'; }

function favorites() { return JSON.parse(localStorage.getItem('cantinaon-favorites') || '[]'); }
function toggleFavorite() {
  const set = new Set(favorites());
  set.has(state.page) ? set.delete(state.page) : set.add(state.page);
  localStorage.setItem('cantinaon-favorites', JSON.stringify([...set]));
  updateFavoriteButton();
}
function updateFavoriteButton() {
  const isFav = favorites().includes(state.page);
  const button = $('[data-action="toggle-favorite"]');
  button.textContent = isFav ? '★ Favorito' : '☆ Favoritar';
  button.setAttribute('aria-pressed', isFav);
}

async function loadSearchIndex() {
  const response = await fetch('search-index.json', { cache: 'no-cache' });
  state.searchIndex = await response.json();
  buildSearchFilters();
}
function buildSearchFilters() {
  const categories = ['Todos', ...new Set(state.searchIndex.map(item => item.category))];
  $('#searchFilters').innerHTML = categories.map(cat => `<button class="filter-chip ${cat === state.filter ? 'active' : ''}" type="button" data-filter="${cat}">${cat}</button>`).join('');
  $('#searchFilters').onclick = event => {
    const chip = event.target.closest('[data-filter]');
    if (!chip) return;
    state.filter = chip.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.toggle('active', c === chip));
    runSearch();
  };
}
function openSearch() { $('#searchDialog').hidden = false; $('#searchInput').focus(); runSearch(); }
function closeSearch() { $('#searchDialog').hidden = true; state.selectedResult = -1; }
function runSearch() {
  const query = $('#searchInput').value.trim().toLowerCase();
  const pool = state.searchIndex.filter(item => state.filter === 'Todos' || item.category === state.filter);
  const results = (query ? pool.filter(item => `${item.title} ${item.category} ${item.keywords} ${item.summary}`.toLowerCase().includes(query)) : pool.slice(0, 6)).slice(0, 9);
  $('#searchResults').innerHTML = results.length ? results.map((item, i) => `<a class="result" role="option" data-index="${i}" data-page="${item.page}" href="?page=${item.page}"><strong>${highlight(item.title, query)}</strong><small>${item.category} · ${highlight(item.summary, query)}</small></a>`).join('') : '<div class="card"><strong>Nenhum resultado encontrado</strong><p>Tente pesquisar por pedido, pagamento, estoque, alergênico ou limite.</p></div>';
}
function highlight(text, query) {
  if (!query) return text;
  return text.replace(new RegExp(`(${escapeRegExp(query)})`, 'ig'), '<mark>$1</mark>');
}
function escapeRegExp(text) { return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function handleSearchKeys(event) {
  const results = [...document.querySelectorAll('.result')];
  if (!['ArrowDown', 'ArrowUp', 'Enter'].includes(event.key) || !results.length) return;
  event.preventDefault();
  if (event.key === 'ArrowDown') state.selectedResult = Math.min(results.length - 1, state.selectedResult + 1);
  if (event.key === 'ArrowUp') state.selectedResult = Math.max(0, state.selectedResult - 1);
  results.forEach((result, i) => result.classList.toggle('active', i === state.selectedResult));
  if (event.key === 'Enter') results[Math.max(0, state.selectedResult)].click();
}
function closeOnboarding() { localStorage.setItem('cantinaon-onboarded', 'true'); $('#onboarding').hidden = true; }

init();
