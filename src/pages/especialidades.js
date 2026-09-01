/* VivaMais — especialidades.js
   Página de listagem de especialidades. Light theme. SVG inline. Dados demonstrativos. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  const specialties = T.loadData('specialties');

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Especialidades</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Especialidades</p>',
    '    <h1>Nossas especialidades</h1>',
    '    <p class="page-hero-lead">Equipe multidisciplinar com acompanhamento próximo e humano. Encontre a área de cuidado ideal para você e sua família.</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Busca ---------- */
  const busca = [
    '<section class="section-tight" id="busca-especialidades">',
    '  <div class="container">',
    '    <div class="search-box" style="max-width:640px;margin-inline:auto;">',
    '      <div class="search-input-wrap">',
    '        ' + icons.search,
    '        <input class="search-input" id="spec-search" type="search" placeholder="Buscar especialidade por nome ou sintoma..." aria-label="Buscar especialidade" autocomplete="off">',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Grid de especialidades ---------- */
  const cards = specialties.map(function (s) {
    const symptoms = s.whenToSeek.slice(0, 4).map(function (w) {
      return '<li class="spec-list-symptom">' + icons.check + '<span>' + T.escapeHtml(w) + '</span></li>';
    }).join('');
    const services = s.services.slice(0, 3).map(function (sv) {
      return '<span class="badge spec-service-badge">' + T.escapeHtml(sv) + '</span>';
    }).join('');
    return [
      '<article class="card card-hover spec-card-lg" data-name="' + T.escapeAttr(s.name.toLowerCase()) + '" data-keywords="' + T.escapeAttr((s.name + ' ' + s.whenToSeek.join(' ') + ' ' + s.services.join(' ')).toLowerCase()) + '">',
      '  <div class="spec-card-lg-head">',
      '    <div class="spec-icon-lg" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + s.icon + '"/></svg></div>',
      '    <h2 class="spec-card-lg-title">' + T.escapeHtml(s.name) + '</h2>',
      '  </div>',
      '  <p class="spec-card-lg-desc">' + T.escapeHtml(s.longDescription) + '</p>',
      '  <div class="spec-card-lg-section">',
      '    <h3 class="spec-card-lg-subtitle">Quando procurar?</h3>',
      '    <ul class="spec-list-symptoms">' + symptoms + '</ul>',
      '  </div>',
      '  <div class="spec-card-lg-section">',
      '    <h3 class="spec-card-lg-subtitle">Serviços</h3>',
      '    <div class="cluster spec-services">' + services + '</div>',
      '  </div>',
      '  <a class="spec-card-lg-cta" href="especialidade-' + s.slug + '.html">Ver especialidade ' + icons.arrowRight + '</a>',
      '</article>'
    ].join('\n');
  }).join('\n');

  const grid = [
    '<section class="section" id="lista-especialidades">',
    '  <div class="container">',
    '    <div class="spec-grid-lg" id="spec-grid">' + cards + '</div>',
    '    <div class="empty-state" id="spec-empty" hidden>',
    '      ' + icons.search,
    '      <h3>Nenhuma especialidade encontrada</h3>',
    '      <p>Tente buscar por outro termo ou entre em contato conosco.</p>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- CTA ---------- */
  const cta = [
    '<section class="section cta-final">',
    '  <div class="container">',
    '    <div class="cta-final-card">',
    '      <h2>Não encontrou o que procura?</h2>',
    '      <p>Nossa equipe pode ajudar você a encontrar o cuidado ideal.</p>',
    '      <div class="cta-final-actions">',
    '        <a class="btn btn-primary" href="agendamento.html">Agendar consulta</a>',
    '        <a class="btn btn-ghost" href="https://wa.me/' + T.clinic.whatsapp.replace(/\D/g, '') + '" rel="noopener">' + icons.whatsapp + ' Fale conosco</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, busca, grid, cta].join('\n\n');

  return T.renderLayout('Especialidades', 'Conheça todas as especialidades da VivaMais: cardiologia, dermatologia, ortopedia, pediatria, ginecologia e clínica geral. Encontre o cuidado ideal.', content, {
    activeNav: 'specialties',
    root: '',
    canonical: 'especialidades',
    extraScripts: ['scripts/pages-script.js'],
    jsonLd: [
      T.buildBreadcrumbList([
        { name: 'Início', slug: 'index' },
        { name: 'Especialidades', slug: 'especialidades' }
      ])
    ]
  });
}

module.exports = { renderPage: renderPage };
