/* VivaMais — sobre.js
   Página institucional "Sobre". Light theme. SVG inline. Ambiente demonstrativo. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  const doctors = T.loadData('doctors');
  const specialties = T.loadData('specialties');

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Sobre</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Institucional</p>',
    '    <h1>Sobre a VivaMais</h1>',
    '    <p class="page-hero-lead">Uma plataforma digital para saúde integrada, com atendimento humanizado e experiência simples do agendamento ao acompanhamento.</p>',
    '    <span class="badge badge-demo" style="margin-top:var(--space-4);">' + icons.shield + ' Ambiente demonstrativo</span>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Propósito ---------- */
  const proposito = [
    '<section class="section" id="proposito">',
    '  <div class="container">',
    '    <div class="section-head text-center" style="margin-inline:auto;">',
    '      <p class="eyebrow">Propósito</p>',
    '      <h2>Cuidar de gente, com gente</h2>',
    '    </div>',
    '    <div class="prose-block" style="margin-inline:auto;">',
    '      <p class="prose-text">A VivaMais nasceu de uma ideia simples: tornar o cuidado em saúde mais próximo, claro e acessível. Acreditamos que tecnologia deve servir às pessoas — não o contrário — e que cada atendimento começa com escuta.</p>',
    '      <p class="prose-text">Nossa proposta é conectar pacientes e profissionais em uma experiência fluida, do primeiro contato ao acompanhamento contínuo, respeitando o tempo e a história de cada pessoa.</p>',
    '      <p class="prose-text list-note">' + icons.check + ' <em>Esta é uma plataforma demonstrativa. Os dados e a história aqui apresentados são fictícios, criados para ilustrar o produto.</em></p>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Valores ---------- */
  const valores = [
    { icon: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z', t: 'Atendimento humanizado', d: 'Escuta, empatia e respeito em cada interação.' },
    { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', t: 'Excelência técnica', d: 'Profissionais qualificados e protocolos atualizados.' },
    { icon: 'M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z', t: 'Acessibilidade', d: 'Estrutura e canais pensados para todos.' },
    { icon: 'M12 2v20M2 12h20', t: 'Inovação', d: 'Tecnologia a serviço do cuidado, sem perder o humano.' },
    { icon: 'M9 12l2 2 4-4', t: 'Transparência', d: 'Informação clara sobre preços, prazos e procedimentos.' },
    { icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', t: 'Cuidado integral', d: 'Visão completa da saúde, além do sintoma isolado.' }
  ];
  const valoresCards = valores.map(function (v) {
    return [
      '<article class="card value-card">',
      '  <div class="value-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + v.icon + '"/></svg></div>',
      '  <h3 class="value-title">' + T.escapeHtml(v.t) + '</h3>',
      '  <p class="value-desc text-muted">' + T.escapeHtml(v.d) + '</p>',
      '</article>'
    ].join('\n');
  }).join('');

  const valoresSection = [
    '<section class="section-alt" id="valores">',
    '  <div class="container">',
    '    <div class="section-head text-center" style="margin-inline:auto;">',
    '      <p class="eyebrow">Valores</p>',
    '      <h2>O que nos move</h2>',
    '      <p>Princípios que orientam cada decisão e cada atendimento.</p>',
    '    </div>',
    '    <div class="grid-3 values-grid">' + valoresCards + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Modelo de atendimento ---------- */
  const modeloItems = [
    { icon: 'M3 10h18M3 6h18M3 14h18M3 18h18', t: 'Agendamento online', d: 'Marque consultas em poucos cliques, a qualquer hora.' },
    { icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', t: 'Equipe multidisciplinar', d: 'Especialistas que conversam entre si pelo seu cuidado.' },
    { icon: 'M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z', t: 'Principais convênios', d: 'Ampla cobertura para facilitar seu acesso.' },
    { icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z', t: 'Acompanhamento contínuo', d: 'Histórico integrado e cuidado de longo prazo.' }
  ];
  const modeloCards = modeloItems.map(function (m) {
    return [
      '<article class="card modelo-card">',
      '  <div class="modelo-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + m.icon + '"/></svg></div>',
      '  <div class="modelo-body">',
      '    <h3 class="modelo-title">' + T.escapeHtml(m.t) + '</h3>',
      '    <p class="modelo-desc text-muted">' + T.escapeHtml(m.d) + '</p>',
      '  </div>',
      '</article>'
    ].join('\n');
  }).join('');

  const modeloSection = [
    '<section class="section" id="modelo">',
    '  <div class="container">',
    '    <div class="section-head text-center" style="margin-inline:auto;">',
    '      <p class="eyebrow">Modelo de atendimento</p>',
    '      <h2>Como cuidamos de você</h2>',
    '      <p>Um fluxo simples e completo, do primeiro contato ao acompanhamento.</p>',
    '    </div>',
    '    <div class="grid-2 modelo-grid">' + modeloCards + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Estrutura (galeria) ---------- */
  const galleryImgs = [
    { src: 'img-recepcao.webp', alt: 'Recepção moderna da clínica VivaMais com balcão de atendimento e sala de espera iluminada' },
    { src: 'img-exame.webp', alt: 'Sala de consulta limpa e contemporânea com equipamentos médicos modernos' },
    { src: 'img-cardio.webp', alt: 'Consulta cardiológica com médico e paciente em ambiente acolhedor' }
  ];
  const galleryHtml = galleryImgs.map(function (g) {
    return '<figure class="gallery-item"><img src="' + g.src + '" alt="' + T.escapeAttr(g.alt) + '" loading="lazy" width="400" height="300"></figure>';
  }).join('');

  const estrutura = [
    '<section class="section-alt" id="estrutura">',
    '  <div class="container">',
    '    <div class="section-head text-center" style="margin-inline:auto;">',
    '      <p class="eyebrow">Estrutura</p>',
    '      <h2>Um espaço pensado para cuidar</h2>',
    '      <p>Ambiente acolhedor, salas equipadas e equipe preparada. Imagens demonstrativas.</p>',
    '    </div>',
    '    <div class="gallery">' + galleryHtml + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Equipe (preview) ---------- */
  const docCards = doctors.slice(0, 6).map(function (d) {
    const specName = getSpecName(specialties, d.specialty);
    return [
      '<article class="card card-hover doctor-card">',
      '  <a class="doctor-card-link" href="medico-' + d.slug + '.html" aria-label="Ver perfil de ' + T.escapeAttr(d.name) + '">',
      '    <div class="doctor-photo"><img src="' + d.photo + '" alt="Foto profissional de ' + T.escapeAttr(d.name) + ', especialista da VivaMais" loading="lazy" width="120" height="120"></div>',
      '    <h3 class="card-title doctor-name">' + T.escapeHtml(d.name) + '</h3>',
      '    <p class="doctor-spec">' + T.escapeHtml(specName) + '</p>',
      '    <span class="doctor-more">Ver perfil ' + icons.arrowRight + '</span>',
      '  </a>',
      '</article>'
    ].join('\n');
  }).join('');

  const equipe = [
    '<section class="section" id="equipe">',
    '  <div class="container">',
    '    <div class="section-head section-head-row">',
    '      <div>',
    '        <p class="eyebrow">Equipe</p>',
    '        <h2>Profissionais dedicados</h2>',
    '        <p>Médicos com escuta e cuidado humano.</p>',
    '      </div>',
    '      <a class="link-more" href="profissionais.html">Ver todos ' + icons.arrowRight + '</a>',
    '    </div>',
    '    <div class="grid-3">' + docCards + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- CTA ---------- */
  const cta = [
    '<section class="section cta-final">',
    '  <div class="container">',
    '    <div class="cta-final-card">',
    '      <h2>Pronto para cuidar da sua saúde?</h2>',
    '      <p>Agende sua consulta em poucos cliques.</p>',
    '      <div class="cta-final-actions">',
    '        <a class="btn btn-primary" href="agendamento.html">Agendar consulta</a>',
    '        <a class="btn btn-ghost" href="https://wa.me/' + T.clinic.whatsapp.replace(/\D/g, '') + '" rel="noopener">' + icons.whatsapp + ' Falar no WhatsApp</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, proposito, valoresSection, modeloSection, estrutura, equipe, cta].join('\n\n');

  return T.renderLayout('Sobre', 'Conheça a VivaMais: propósito, valores, modelo de atendimento e equipe. Plataforma demonstrativa para saúde integrada com cuidado humanizado.', content, {
    activeNav: 'about',
    root: '',
    canonical: 'sobre',
    jsonLd: [
      T.buildAboutPage(),
      T.buildBreadcrumbList([
        { name: 'Início', slug: 'index' },
        { name: 'Sobre', slug: 'sobre' }
      ])
    ]
  });
}

function getSpecName(specialties, slug) {
  const found = specialties.filter(function (s) { return s.slug === slug; })[0];
  return found ? found.name : slug;
}

module.exports = { renderPage: renderPage };
