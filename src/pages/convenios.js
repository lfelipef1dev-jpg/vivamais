/* VivaMais — convenios.js
   Página de convênios. Light theme. SVG inline. Dados demonstrativos. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  const insurance = T.loadData('insurance');
  const specialties = T.loadData('specialties');

  function specName(slug) {
    const found = specialties.filter(function (s) { return s.slug === slug; })[0];
    return found ? found.name : slug;
  }

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Convênios</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Convênios</p>',
    '    <h1>Convênios atendidos</h1>',
    '    <p class="page-hero-lead">Trabalhamos com os principais convênios da região. Encontre o seu e veja as especialidades disponíveis.</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Busca ---------- */
  const busca = [
    '<section class="section-tight" id="busca-convenios">',
    '  <div class="container">',
    '    <div class="search-box" style="max-width:560px;margin-inline:auto;">',
    '      <div class="search-input-wrap">',
    '        ' + icons.search,
    '        <input class="search-input" id="insurance-search" type="search" placeholder="Encontre seu convênio..." aria-label="Buscar convênio" autocomplete="off">',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Grid de convênios ---------- */
  const cards = insurance.map(function (i) {
    const isParticular = i.slug === 'particular';
    const specList = i.specialties.map(function (s) {
      return '<li class="insurance-spec-item">' + icons.check + '<span>' + T.escapeHtml(specName(s)) + '</span></li>';
    }).join('');
    return [
      '<article class="card card-hover insurance-card" data-name="' + T.escapeAttr(i.name.toLowerCase()) + '">',
      '  <div class="insurance-card-head">',
      '    <h2 class="insurance-card-name">' + T.escapeHtml(i.name) + '</h2>',
      '    ' + (isParticular ? '<span class="badge badge-demo">Particular</span>' : '<span class="badge badge-status confirmed">Ativo</span>'),
      '  </div>',
      '  <p class="insurance-card-sub text-muted">' + i.specialties.length + ' especialidades disponíveis</p>',
      '  <button class="insurance-card-toggle" type="button" aria-expanded="false" aria-controls="ins-spec-' + i.slug + '">Ver especialidades ' + icons.chevronDown + '</button>',
      '  <div class="insurance-card-specs" id="ins-spec-' + i.slug + '" hidden>',
      '    <ul class="insurance-spec-list">' + specList + '</ul>',
      '  </div>',
      '</article>'
    ].join('\n');
  }).join('\n');

  const grid = [
    '<section class="section" id="lista-convenios">',
    '  <div class="container">',
    '    <div class="insurance-grid-lg" id="insurance-grid">' + cards + '</div>',
    '    <div class="empty-state" id="insurance-empty" hidden>',
    '      ' + icons.search,
    '      <h3>Nenhum convênio encontrado</h3>',
    '      <p>Tente buscar por outro nome ou entre em contato.</p>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- CTA ---------- */
  const cta = [
    '<section class="section cta-final">',
    '  <div class="container">',
    '    <div class="cta-final-card">',
    '      <h2>Agende sua consulta</h2>',
    '      <p>Confirme seu convênio no momento do agendamento.</p>',
    '      <div class="cta-final-actions">',
    '        <a class="btn btn-primary" href="agendamento.html">Agendar consulta</a>',
    '        <a class="btn btn-ghost" href="https://wa.me/' + T.clinic.whatsapp.replace(/\D/g, '') + '" rel="noopener">' + icons.whatsapp + ' Tirar dúvidas</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, busca, grid, cta].join('\n\n');

  return T.renderLayout('Convênios', 'Convênios atendidos pela VivaMais: Unimed, Bradesco Saúde, SulAmérica, Amil, Notredame, Hapvida, Porto Seguro e Particular. Confira as especialidades.', content, {
    activeNav: 'insurance',
    root: '',
    canonical: 'convenios',
    extraScripts: ['scripts/pages-script.js'],
    jsonLd: [
      T.buildBreadcrumbList([
        { name: 'Início', slug: 'index' },
        { name: 'Convênios', slug: 'convenios' }
      ])
    ]
  });
}

module.exports = { renderPage: renderPage };
