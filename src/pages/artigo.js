/* VivaMais — artigo.js
   Páginas de artigo individual (8 páginas dinâmicas). Light theme. SVG inline. */

const T = require('../templates/templates');
const icons = T.icons;
const blog = require('./blog');

function renderAll() {
  const articles = T.loadData('articles');
  const doctors = T.loadData('doctors');
  const specialties = T.loadData('specialties');
  return articles.map(function (a) {
    return { slug: a.slug, html: renderArticle(a, articles, doctors, specialties) };
  });
}

function renderArticle(article, allArticles, doctors, specialties) {
  /* Mapeia a categoria do artigo para um slug de especialidade (se houver) */
  var specSlug = '';
  if (article.category) {
    var match = specialties.filter(function (s) { return s.name === article.category; })[0];
    if (match) specSlug = match.slug;
  }
  /* Link de agendamento contextualizado quando a categoria é uma especialidade */
  var bookingHref = specSlug ? ('agendamento.html?specialty=' + specSlug) : 'agendamento.html';

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <a href="blog.html">Blog</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">' + T.escapeHtml(article.title) + '</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero page-hero-article">',
    '  <div class="container">',
    '    <span class="badge blog-hero-cat">' + T.escapeHtml(article.category) + '</span>',
    '    <h1>' + T.escapeHtml(article.title) + '</h1>',
    '    <div class="article-hero-meta">',
    '      <span class="article-hero-author">' + icons.user + ' ' + T.escapeHtml(article.author) + '</span>',
    '      <span class="article-hero-date">' + icons.calendar + ' ' + T.escapeHtml(blog.formatDate(article.date)) + '</span>',
    '      <span class="article-hero-time">' + icons.clock + ' ' + T.escapeHtml(article.readTime) + ' de leitura</span>',
    '    </div>',
    '    <div class="article-hero-cover"><img src="' + T.escapeAttr(article.image) + '" alt="Imagem ilustrativa sobre ' + T.escapeAttr(article.category) + ' — demonstração" loading="eager" width="1200" height="500"></div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Conteúdo ---------- */
  const paragraphs = article.content.map(function (p) {
    return '<p>' + T.escapeHtml(p) + '</p>';
  }).join('\n');

  /* ---------- Box CTA no meio ---------- */
  const midCta = [
    '<aside class="article-cta-box" aria-label="Agende sua consulta">',
    '  <div class="article-cta-box-inner">',
    '    <h3>Agende sua consulta</h3>',
    '    <p>Fale com um especialista e receba orientação personalizada.</p>',
    '    <a class="btn btn-primary" href="' + bookingHref + '">Agendar agora ' + icons.arrowRight + '</a>',
    '  </div>',
    '</aside>'
  ].join('\n');

  /* ---------- Box do autor ---------- */
  const authorBox = renderAuthorBox(article, doctors, specialties);

  /* ---------- Artigos relacionados ---------- */
  const related = renderRelated(article, allArticles);

  /* ---------- Ações finais ---------- */
  const finalActions = [
    '<section class="section-tight">',
    '  <div class="container">',
    '    <div class="article-actions">',
    '      <a class="btn btn-primary" href="' + bookingHref + '">Agendar consulta</a>',
    '      <button class="btn btn-ghost" type="button" id="article-share-btn" aria-label="Compartilhar artigo">' + icons.arrowRight + ' Compartilhar</button>',
    '      <button class="btn btn-ghost" type="button" id="article-copy-btn" aria-label="Copiar link do artigo">Copiar link</button>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [
    breadcrumb,
    hero,
    '<section class="section-tight"><div class="container article-layout"><div class="article-content prose-article">' + paragraphs + '</div>' + authorBox + '</div></section>',
    midCta,
    '<section class="section-tight"><div class="container"><div class="article-content prose-article">' + related + '</div></div></section>',
    finalActions
  ].join('\n\n');

  return T.renderLayout(article.title, article.excerpt + ' — Artigo da VivaMais sobre ' + article.category + '.', content, {
    activeNav: 'blog',
    root: '',
    canonical: 'artigo-' + article.slug,
    ogType: 'article',
    extraScripts: ['scripts/content-script.js'],
    jsonLd: [
      T.buildArticle(article),
      T.buildBreadcrumbList([
        { name: 'Início', slug: 'index' },
        { name: 'Blog', slug: 'blog' },
        { name: article.title, slug: 'artigo-' + article.slug }
      ])
    ]
  });
}

function renderAuthorBox(article, doctors, specialties) {
  /* Tenta encontrar médico pelo nome do autor */
  const authorName = article.author;
  const doctor = doctors.filter(function (d) { return d.name === authorName; })[0];
  if (doctor) {
    const specName = getSpecName(specialties, doctor.specialty);
    return [
      '<aside class="article-author-box" aria-label="Sobre o autor">',
      '  <div class="article-author-photo"><img src="' + doctor.photo + '" alt="Foto profissional de ' + T.escapeAttr(doctor.name) + ', especialista da VivaMais" loading="lazy" width="80" height="80"></div>',
      '  <div class="article-author-body">',
      '    <h3 class="article-author-name">' + T.escapeHtml(doctor.name) + '</h3>',
      '    <p class="article-author-spec">' + T.escapeHtml(specName) + ' · ' + T.escapeHtml(doctor.crm) + '</p>',
      '    <p class="article-author-bio">' + T.escapeHtml(doctor.bio) + '</p>',
      '    <a class="article-author-link" href="medico-' + doctor.slug + '.html">Ver perfil ' + icons.arrowRight + '</a>',
      '  </div>',
      '</aside>'
    ].join('\n');
  }
  /* Autor genérico (Equipe VivaMais) */
  return [
    '<aside class="article-author-box" aria-label="Sobre o autor">',
    '  <div class="article-author-photo article-author-photo-initial" aria-hidden="true">' + T.escapeHtml(initials(authorName)) + '</div>',
    '  <div class="article-author-body">',
    '    <h3 class="article-author-name">' + T.escapeHtml(authorName) + '</h3>',
    '    <p class="article-author-spec">Equipe editorial VivaMais</p>',
    '    <p class="article-author-bio">Conteúdo produzido pela equipe da VivaMais, com revisão de profissionais de saúde.</p>',
    '  </div>',
    '</aside>'
  ].join('\n');
}

function renderRelated(article, allArticles) {
  const related = allArticles
    .filter(function (a) { return a.category === article.category && a.slug !== article.slug; })
    .slice(0, 3);
  /* Se não houver 3 da mesma categoria, completa com outros */
  if (related.length < 3) {
    const others = allArticles.filter(function (a) {
      return a.slug !== article.slug && related.indexOf(a) === -1;
    });
    while (related.length < 3 && others.length) {
      related.push(others.shift());
    }
  }
  const cards = related.slice(0, 3).map(function (a) {
    return [
      '<article class="card card-hover blog-card">',
      '  <a class="blog-card-link" href="artigo-' + a.slug + '.html">',
      '    <span class="blog-card-cat badge">' + T.escapeHtml(a.category) + '</span>',
      '    <h3 class="card-title blog-card-title">' + T.escapeHtml(a.title) + '</h3>',
      '    <p class="card-body blog-card-excerpt">' + T.escapeHtml(a.excerpt) + '</p>',
      '    <span class="blog-card-more">Ler artigo ' + icons.arrowRight + '</span>',
      '  </a>',
      '</article>'
    ].join('\n');
  }).join('');

  return [
    '<h2 class="article-related-title">Artigos relacionados</h2>',
    '<div class="grid-3 article-related-grid">' + cards + '</div>'
  ].join('\n');
}

function getSpecName(specialties, slug) {
  const found = specialties.filter(function (s) { return s.slug === slug; })[0];
  return found ? found.name : slug;
}

function initials(name) {
  const parts = name.replace(/^(Dra?\.|Equipe)\s+/i, '').split(' ');
  return ((parts[0] || '')[0] || '') + ((parts[1] || '')[0] || '');
}

module.exports = { renderAll: renderAll };
