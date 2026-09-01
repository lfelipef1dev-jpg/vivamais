/* VivaMais — medico.js
   Páginas individuais de médico (gera 6 dinamicamente). Light theme. SVG inline. Dados demonstrativos. */

const T = require('../templates/templates');
const icons = T.icons;

function getSpecName(specialties, slug) {
  const found = specialties.filter(function (s) { return s.slug === slug; })[0];
  return found ? found.name : slug;
}

function renderFor(slug) {
  const specialties = T.loadData('specialties');
  const doctors = T.loadData('doctors');
  const insurance = T.loadData('insurance');
  const doc = doctors.filter(function (d) { return d.slug === slug; })[0];
  if (!doc) return '';
  const specName = getSpecName(specialties, doc.specialty);
  const docInsurance = insurance.filter(function (i) {
    return doc.insurance.indexOf(i.slug) !== -1;
  });

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <a href="profissionais.html">Profissionais</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">' + T.escapeHtml(doc.name) + '</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero page-hero-doctor">',
    '  <div class="container">',
    '    <div class="doctor-hero">',
    '      <div class="doctor-hero-photo">',
    '        <img src="' + doc.photo + '" alt="Foto de ' + T.escapeAttr(doc.name) + ' — demonstração" loading="eager" width="200" height="200">',
    '      </div>',
    '      <div class="doctor-hero-info">',
    '        <p class="eyebrow">' + T.escapeHtml(specName) + '</p>',
    '        <h1>' + T.escapeHtml(doc.name) + '</h1>',
    '        <p class="doctor-hero-crm">' + T.escapeHtml(doc.crm) + (doc.rqe ? ' · ' + T.escapeHtml(doc.rqe) : '') + '</p>',
    '        <span class="badge badge-demo doctor-demo-badge">' + icons.shield + ' Dados demonstrativos</span>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Sobre ---------- */
  const sobre = [
    '<section class="section" id="sobre">',
    '  <div class="container">',
    '    <div class="prose-block">',
    '      <p class="eyebrow">Sobre</p>',
    '      <h2>Conheça ' + T.escapeHtml(doc.name) + '</h2>',
    '      <p class="prose-text">' + T.escapeHtml(doc.bio) + '</p>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Formação ---------- */
  const education = doc.education.map(function (e) {
    return '<li class="list-tick-item">' + icons.check + '<span>' + T.escapeHtml(e) + '</span></li>';
  }).join('');

  const formacao = [
    '<section class="section-alt" id="formacao">',
    '  <div class="container">',
    '    <div class="prose-block">',
    '      <p class="eyebrow">Formação</p>',
    '      <h2>Formação acadêmica</h2>',
    '      <ul class="list-tick">' + education + '</ul>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Áreas de atuação ---------- */
  const areas = doc.areas.map(function (a) {
    return '<span class="badge area-badge">' + T.escapeHtml(a) + '</span>';
  }).join('');

  const areasSection = [
    '<section class="section" id="areas">',
    '  <div class="container">',
    '    <div class="prose-block">',
    '      <p class="eyebrow">Atuação</p>',
    '      <h2>Áreas de atuação</h2>',
    '      <div class="cluster area-cluster">' + areas + '</div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Idiomas ---------- */
  const languages = doc.languages.map(function (l) {
    return '<li class="list-tick-item">' + icons.check + '<span>' + T.escapeHtml(l) + '</span></li>';
  }).join('');

  const idiomas = [
    '<section class="section-alt" id="idiomas">',
    '  <div class="container">',
    '    <div class="prose-block">',
    '      <p class="eyebrow">Comunicação</p>',
    '      <h2>Idiomas</h2>',
    '      <ul class="list-tick list-tick-inline">' + languages + '</ul>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Convênios ---------- */
  const insList = docInsurance.map(function (i) {
    return '<li class="list-tick-item">' + icons.check + '<span>' + T.escapeHtml(i.name) + '</span></li>';
  }).join('');

  const convenios = [
    '<section class="section" id="convenios">',
    '  <div class="container">',
    '    <div class="prose-block">',
    '      <p class="eyebrow">Atendimento</p>',
    '      <h2>Convênios atendidos</h2>',
    '      <ul class="list-tick list-tick-inline">' + insList + '</ul>',
    '      <p class="text-muted list-note">' + icons.shield + ' <span>Lista demonstrativa. Confirme a cobertura no momento do agendamento.</span></p>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Local ---------- */
  const local = [
    '<section class="section-alt" id="local">',
    '  <div class="container">',
    '    <div class="prose-block">',
    '      <p class="eyebrow">Onde atender</p>',
    '      <h2>Local de atendimento</h2>',
    '      <div class="location-card">',
    '        <div class="location-icon" aria-hidden="true">' + icons.pin + '</div>',
    '        <div class="location-body">',
    '          <p class="location-name">' + T.escapeHtml(doc.location) + '</p>',
    '          <p class="text-muted">Endereço demonstrativo — Av. Demonstrativa, 1000 — Centro</p>',
    '          <span class="badge badge-demo">' + icons.shield + ' Dados fictícios</span>',
    '        </div>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Próximos horários ---------- */
  const days = [
    { key: 'seg', label: 'Seg' },
    { key: 'ter', label: 'Ter' },
    { key: 'qua', label: 'Qua' },
    { key: 'qui', label: 'Qui' },
    { key: 'sex', label: 'Sex' }
  ];
  const allSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  const dayCols = days.map(function (day) {
    const daySlots = (doc.schedule[day.key] || []);
    const slotBtns = allSlots.map(function (t) {
      const free = daySlots.indexOf(t) !== -1;
      const cls = 'schedule-slot' + (free ? ' schedule-slot-free' : ' schedule-slot-busy');
      const state = free ? 'Disponível' : 'Indisponível';
      return '<button class="' + cls + '" type="button" data-day="' + day.key + '" data-time="' + t + '" data-doctor="' + doc.slug + '" ' + (free ? '' : 'disabled') + ' aria-label="' + day.label + ' ' + t + ' — ' + state + '">' + t + '</button>';
    }).join('');
    return [
      '<div class="schedule-day" data-day="' + day.key + '">',
      '  <h3 class="schedule-day-title">' + T.escapeHtml(day.label) + '</h3>',
      '  <div class="schedule-slots">' + slotBtns + '</div>',
      '</div>'
    ].join('\n');
  }).join('');

  const horarios = [
    '<section class="section" id="horarios">',
    '  <div class="container">',
    '    <div class="section-head">',
    '      <p class="eyebrow">Agenda</p>',
    '      <h2>Próximos horários</h2>',
    '      <p>Selecione um horário disponível para iniciar o agendamento. Dados demonstrativos.</p>',
    '    </div>',
    '    <div class="schedule-grid" id="schedule-grid">' + dayCols + '</div>',
    '    <p class="schedule-note text-muted">' + icons.clock + ' <span>Horários ilustrativos para demonstração.</span></p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- CTA ---------- */
  const cta = [
    '<section class="section cta-final">',
    '  <div class="container">',
    '    <div class="cta-final-card">',
    '      <h2>Agendar com ' + T.escapeHtml(doc.name) + '</h2>',
    '      <p>Marque sua consulta de ' + T.escapeHtml(specName) + ' em poucos cliques.</p>',
    '      <div class="cta-final-actions">',
    '        <a class="btn btn-primary" href="agendamento.html?doctor=' + doc.slug + '">Agendar consulta</a>',
    '        <a class="btn btn-ghost" href="profissionais.html">Ver outros profissionais ' + icons.arrowRight + '</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, sobre, formacao, areasSection, idiomas, convenios, local, horarios, cta].join('\n\n');

  return T.renderLayout(doc.name, doc.bio + ' Especialista em ' + specName + '. Dados demonstrativos.', content, {
    activeNav: 'doctors',
    root: '',
    canonical: 'medico-' + doc.slug,
    extraScripts: ['scripts/pages-script.js'],
    jsonLd: [
      T.buildPhysician(doc, specName),
      T.buildBreadcrumbList([
        { name: 'Início', slug: 'index' },
        { name: 'Profissionais', slug: 'profissionais' },
        { name: doc.name, slug: 'medico-' + doc.slug }
      ])
    ]
  });
}

function renderAll() {
  const doctors = T.loadData('doctors');
  return doctors.map(function (d) {
    return { slug: d.slug, html: renderFor(d.slug) };
  });
}

module.exports = { renderFor: renderFor, renderAll: renderAll };
