/* VivaMais — localizacao.js
   Página de localização e contato. Light theme. SVG inline. Endereço demonstrativo. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  const clinic = T.clinic;
  const geoQuery = encodeURIComponent(clinic.address.street + ', ' + clinic.address.city + ' - ' + clinic.address.state);
  const mapsEmbed = 'https://www.google.com/maps?q=' + geoQuery + '&output=embed';
  const mapsDirections = 'https://www.google.com/maps/dir/?api=1&destination=' + geoQuery;

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Localização</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Localização</p>',
    '    <h1>Como chegar</h1>',
    '    <p class="page-hero-lead">' + T.escapeHtml(clinic.address.street) + ' — ' + T.escapeHtml(clinic.address.city) + ', ' + T.escapeHtml(clinic.address.state) + '</p>',
    '    <span class="badge badge-demo" style="margin-top:var(--space-4);">' + icons.pin + ' Endereço demonstrativo</span>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Mapa + card de info ---------- */
  const hoursHtml = clinic.hours.map(function (h) {
    return '<li class="loc-hours-row"><span class="loc-hours-day">' + T.escapeHtml(h.day) + '</span><span class="loc-hours-time">' + T.escapeHtml(h.time) + '</span></li>';
  }).join('');

  const infoCard = [
    '<aside class="loc-info-card" aria-label="Informações de contato e funcionamento">',
    '  <h2 class="loc-info-title">Informações</h2>',
    '  <ul class="loc-info-list">',
    '    <li class="loc-info-row">' + icons.pin + '<div><span class="loc-info-label">Endereço</span><span class="loc-info-value">' + T.escapeHtml(clinic.address.street) + '<br>' + T.escapeHtml(clinic.address.city) + ' — ' + T.escapeHtml(clinic.address.state) + ' · CEP ' + T.escapeHtml(clinic.address.zip) + '</span></div></li>',
    '    <li class="loc-info-row">' + icons.phone + '<div><span class="loc-info-label">Telefone</span><a class="loc-info-value" href="tel:' + T.escapeAttr(clinic.phone.replace(/\D/g, '')) + '">' + T.escapeHtml(clinic.phone) + '</a></div></li>',
    '    <li class="loc-info-row">' + icons.whatsapp + '<div><span class="loc-info-label">WhatsApp</span><a class="loc-info-value" href="https://wa.me/' + T.escapeAttr(clinic.whatsapp.replace(/\D/g, '')) + '" rel="noopener">' + T.escapeHtml(clinic.whatsapp) + '</a></div></li>',
    '    <li class="loc-info-row">' + icons.mail + '<div><span class="loc-info-label">E-mail</span><a class="loc-info-value" href="mailto:' + T.escapeAttr(clinic.email) + '">' + T.escapeHtml(clinic.email) + '</a></div></li>',
    '  </ul>',
    '  <h3 class="loc-info-subtitle">Horários de funcionamento</h3>',
    '  <ul class="loc-hours-list">' + hoursHtml + '</ul>',
    '  <h3 class="loc-info-subtitle">Estacionamento</h3>',
    '  <p class="loc-info-text">Estacionamento no local, com vagas reservadas para idosos e pessoas com deficiência.</p>',
    '  <h3 class="loc-info-subtitle">Acessibilidade</h3>',
    '  <p class="loc-info-text">Rampas de acesso, elevador, banheiros adaptados e sinalização tátil. Estrutura preparada para todos.</p>',
    '  <div class="loc-info-actions">',
    '    <a class="btn btn-primary" href="' + T.escapeAttr(mapsDirections) + '" target="_blank" rel="noopener">' + icons.pin + ' Traçar rota</a>',
    '    <a class="btn btn-ghost" href="https://wa.me/' + T.escapeAttr(clinic.whatsapp.replace(/\D/g, '')) + '" rel="noopener">' + icons.whatsapp + ' Falar no WhatsApp</a>',
    '  </div>',
    '</aside>'
  ].join('\n');

  const mapa = [
    '<section class="section" id="mapa">',
    '  <div class="container">',
    '    <div class="loc-layout">',
    '      <div class="loc-map-wrap" aria-label="Mapa com localização demonstrativa">',
    '        <iframe class="loc-map" src="' + T.escapeAttr(mapsEmbed) + '" title="Mapa — endereço demonstrativo" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>',
    '      </div>',
    infoCard,
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, mapa].join('\n\n');

  return T.renderLayout('Localização', 'Como chegar à VivaMais: endereço, telefone, WhatsApp, horários de funcionamento, estacionamento e acessibilidade. Endereço demonstrativo.', content, {
    activeNav: '',
    root: '',
    canonical: 'localizacao',
    jsonLd: [
      T.buildLocalBusiness(),
      T.buildBreadcrumbList([
        { name: 'Início', slug: 'index' },
        { name: 'Localização', slug: 'localizacao' }
      ])
    ]
  });
}

module.exports = { renderPage: renderPage };
