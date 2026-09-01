/* VivaMais — profissionais.js
   Página de listagem de profissionais. Light theme. SVG inline. Dados demonstrativos. */

const T = require('../templates/templates');
const icons = T.icons;

function getSpecName(specialties, slug) {
  const found = specialties.filter(function (s) { return s.slug === slug; })[0];
  return found ? found.name : slug;
}

function renderPage() {
  const specialties = T.loadData('specialties');
  const doctors = T.loadData('doctors');
  const insurance = T.loadData('insurance');

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Profissionais</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Profissionais</p>',
    '    <h1>Nossa equipe</h1>',
    '    <p class="page-hero-lead">Médicos dedicados, com escuta e cuidado humano. Conheça nossos especialistas e agende sua consulta.</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Filtros ---------- */
  const specChips = specialties.map(function (s) {
    return '<button class="chip filter-chip" type="button" data-spec="' + s.slug + '">' + T.escapeHtml(s.name) + '</button>';
  }).join('');
  const allChip = '<button class="chip filter-chip active" type="button" data-spec="all">Todas</button>';
  const insOptions = insurance.map(function (i) {
    return '<option value="' + i.slug + '">' + T.escapeHtml(i.name) + '</option>';
  }).join('');

  const filtros = [
    '<section class="section-tight" id="filtros-profissionais">',
    '  <div class="container">',
    '    <div class="filter-bar">',
    '      <div class="search-box" style="max-width:480px;">',
    '        <div class="search-input-wrap">',
    '          ' + icons.search,
    '          <input class="search-input" id="doctor-search" type="search" placeholder="Buscar profissional por nome..." aria-label="Buscar profissional" autocomplete="off">',
    '        </div>',
    '      </div>',
    '      <div class="filter-controls">',
    '        <label class="label" for="insurance-filter">Convênio</label>',
    '        <select class="select" id="insurance-filter">',
    '          <option value="all">Todos os convênios</option>',
    '          ' + insOptions,
    '        </select>',
    '      </div>',
    '    </div>',
    '    <div class="filter-chips" role="group" aria-label="Filtrar por especialidade">' + allChip + specChips + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Grid de médicos ---------- */
  const cards = doctors.map(function (d) {
    const specName = getSpecName(specialties, d.specialty);
    const areas = d.areas.map(function (a) {
      return '<span class="badge doctor-area-badge">' + T.escapeHtml(a) + '</span>';
    }).join('');
    const insSlugs = d.insurance.join(' ');
    return [
      '<article class="card card-hover doctor-card-lg" data-spec="' + d.specialty + '" data-insurance="' + insSlugs + '" data-name="' + T.escapeAttr(d.name.toLowerCase()) + '">',
      '  <a class="doctor-card-lg-link" href="medico-' + d.slug + '.html" aria-label="Ver perfil de ' + T.escapeAttr(d.name) + '">',
      '    <div class="doctor-photo-lg"><img src="' + d.photo + '" alt="Foto profissional de ' + T.escapeAttr(d.name) + ', especialista da VivaMais" loading="lazy" width="160" height="160"></div>',
      '    <div class="doctor-card-lg-body">',
      '      <h3 class="doctor-card-lg-name">' + T.escapeHtml(d.name) + '</h3>',
      '      <p class="doctor-card-lg-spec">' + T.escapeHtml(specName) + '</p>',
      '      <p class="doctor-card-lg-crm text-muted">' + T.escapeHtml(d.crm) + '</p>',
      '      <div class="doctor-card-lg-areas">' + areas + '</div>',
      '      <span class="doctor-card-lg-more">Ver perfil ' + icons.arrowRight + '</span>',
      '    </div>',
      '  </a>',
      '</article>'
    ].join('\n');
  }).join('\n');

  const grid = [
    '<section class="section" id="lista-profissionais">',
    '  <div class="container">',
    '    <div class="grid-3" id="doctor-grid">' + cards + '</div>',
    '    <div class="empty-state" id="doctor-empty" hidden>',
    '      ' + icons.search,
    '      <h3>Nenhum profissional encontrado</h3>',
    '      <p>Ajuste os filtros ou entre em contato para ajuda.</p>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- CTA ---------- */
  const cta = [
    '<section class="section cta-final">',
    '  <div class="container">',
    '    <div class="cta-final-card">',
    '      <h2>Pronto para agendar?</h2>',
    '      <p>Escolha o profissional e marque sua consulta em segundos.</p>',
    '      <div class="cta-final-actions">',
    '        <a class="btn btn-primary" href="agendamento.html">Agendar consulta</a>',
    '        <a class="btn btn-ghost" href="especialidades.html">Ver especialidades ' + icons.arrowRight + '</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, filtros, grid, cta].join('\n\n');

  return T.renderLayout('Profissionais', 'Conheça a equipe da VivaMais: cardiologistas, dermatologistas, ortopedistas, pediatras, ginecologistas e clínicos gerais. Agende sua consulta.', content, {
    activeNav: 'doctors',
    root: '',
    canonical: 'profissionais',
    extraScripts: ['scripts/pages-script.js'],
    jsonLd: [
      T.buildBreadcrumbList([
        { name: 'Início', slug: 'index' },
        { name: 'Profissionais', slug: 'profissionais' }
      ])
    ]
  });
}

module.exports = { renderPage: renderPage };
