/* VivaMais — blog.js
   Listagem de artigos do blog. Light theme. SVG inline. Dados demonstrativos. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  const articles = T.loadData('articles');

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Blog</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Conteúdo</p>',
    '    <h1>Central de saúde</h1>',
    '    <p class="page-hero-lead">Conteúdo sobre saúde, prevenção e bem-estar, produzido pela nossa equipe. Orientações claras para você cuidar melhor de si.</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Filtros por categoria ---------- */
  const categories = ['Todos', 'Cardiologia', 'Pediatria', 'Ortopedia', 'Nutrição', 'Ginecologia', 'Bem-estar'];
  const chipsHtml = categories.map(function (c, i) {
    const active = i === 0 ? ' active' : '';
    return '<button class="chip blog-filter-chip' + active + '" type="button" data-category="' + T.escapeAttr(c) + '">' + T.escapeHtml(c) + '</button>';
  }).join('');

  /* ---------- Busca ---------- */
  const busca = [
    '<section class="section-tight" id="blog-filtros">',
    '  <div class="container">',
    '    <div class="blog-controls">',
    '      <div class="search-box" style="max-width:560px;">',
    '        <div class="search-input-wrap">',
    '          ' + icons.search,
    '          <input class="search-input" id="blog-search" type="search" placeholder="Buscar artigo por título..." aria-label="Buscar artigo" autocomplete="off">',
    '        </div>',
    '      </div>',
    '      <div class="blog-chips" role="group" aria-label="Filtrar por categoria">' + chipsHtml + '</div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Grid de artigos ---------- */
  const cards = articles.map(function (a) {
    return [
      '<article class="card card-hover blog-card blog-item" data-category="' + T.escapeAttr(a.category) + '" data-title="' + T.escapeAttr(a.title.toLowerCase()) + '">',
      '  <a class="blog-card-link" href="artigo-' + a.slug + '.html">',
      '    <div class="blog-card-cover" aria-hidden="true"><span class="blog-card-cover-cat">' + T.escapeHtml(a.category) + '</span></div>',
      '    <span class="blog-card-cat badge">' + T.escapeHtml(a.category) + '</span>',
      '    <h2 class="card-title blog-card-title">' + T.escapeHtml(a.title) + '</h2>',
      '    <p class="card-body blog-card-excerpt">' + T.escapeHtml(a.excerpt) + '</p>',
      '    <div class="blog-card-meta">',
      '      <span class="blog-card-author text-muted">' + T.escapeHtml(a.author) + '</span>',
      '      <span class="blog-card-info text-muted">' + T.escapeHtml(formatDate(a.date)) + ' · ' + T.escapeHtml(a.readTime) + '</span>',
      '    </div>',
      '    <span class="blog-card-more">Ler artigo ' + icons.arrowRight + '</span>',
      '  </a>',
      '</article>'
    ].join('\n');
  }).join('');

  const grid = [
    '<section class="section" id="blog-lista">',
    '  <div class="container">',
    '    <div class="grid-3" id="blog-grid">' + cards + '</div>',
    '    <div class="empty-state" id="blog-empty" hidden>',
    '      ' + icons.search,
    '      <h3>Nenhum artigo encontrado</h3>',
    '      <p>Tente buscar por outro termo ou limpar os filtros.</p>',
    '    </div>',
    '    <nav class="blog-pagination" id="blog-pagination" aria-label="Paginação"></nav>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- CTA ---------- */
  const cta = [
    '<section class="section cta-final">',
    '  <div class="container">',
    '    <div class="cta-final-card">',
    '      <h2>Cuidar da saúde começa com informação</h2>',
    '      <p>Agende sua consulta com a nossa equipe.</p>',
    '      <div class="cta-final-actions">',
    '        <a class="btn btn-primary" href="agendamento.html">Agendar consulta</a>',
    '        <a class="btn btn-ghost" href="https://wa.me/' + T.clinic.whatsapp.replace(/\D/g, '') + '" rel="noopener">' + icons.whatsapp + ' Falar no WhatsApp</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, busca, grid, cta].join('\n\n');

  return T.renderLayout('Blog', 'Central de saúde da VivaMais: artigos sobre prevenção, bem-estar e cuidados em diversas especialidades. Conteúdo da nossa equipe.', content, {
    activeNav: 'blog',
    root: '',
    canonical: 'blog',
    extraScripts: ['scripts/content-script.js'],
    jsonLd: [
      T.buildBlog(),
      T.buildBreadcrumbList([
        { name: 'Início', slug: 'index' },
        { name: 'Blog', slug: 'blog' }
      ])
    ]
  });
}

function formatDate(iso) {
  const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const d = new Date(iso + 'T00:00:00');
  return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

module.exports = { renderPage: renderPage, formatDate: formatDate };
