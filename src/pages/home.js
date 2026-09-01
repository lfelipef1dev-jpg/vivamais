/* VivaMais — home.js
   Página inicial premium. Light theme. SVG inline. Dados demonstrativos. */

const T = require('../templates/templates');
const icons = T.icons;

function renderHome() {
  const specialties = T.loadData('specialties');
  const doctors = T.loadData('doctors');
  const insurance = T.loadData('insurance');
  const articles = T.loadData('articles');

  /* ---------- A. Hero ---------- */
  const heroBullets = [
    'Agendamento simplificado',
    'Principais convênios',
    'Atendimento presencial',
    'Equipe multidisciplinar'
  ];
  const heroBulletsHtml = heroBullets.map(function (b) {
    return '<li class="hero-bullet">' + icons.check + '<span>' + T.escapeHtml(b) + '</span></li>';
  }).join('');

  const hero = [
    '<section class="hero" id="inicio">',
    '  <div class="container hero-inner">',
    '    <div class="hero-content">',
    '      <p class="eyebrow">Plataforma digital para saúde integrada</p>',
    '      <h1>Cuidado completo para você e sua família</h1>',
    '      <p class="hero-lead">Especialistas em diversas áreas, atendimento humanizado e uma experiência simples do agendamento ao acompanhamento.</p>',
    '      <ul class="hero-bullets" role="list">' + heroBulletsHtml + '</ul>',
    '      <div class="hero-actions">',
    '        <a class="btn btn-primary" href="agendamento.html">Agendar consulta</a>',
    '        <a class="btn btn-ghost" href="#busca">Encontrar especialista</a>',
    '      </div>',
    '    </div>',
    '    <div class="hero-visual-wrap">',
    '      <div class="hero-visual">',
    '        <img src="img-hero.jpg" alt="Médica conversando com paciente em consulta — ambiente claro e acolhedor da clínica VivaMais" loading="eager" fetchpriority="high" width="800" height="600">',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- B. Busca inteligente ---------- */
  const chips = specialties.slice(0, 6).map(function (s) {
    return '<button class="chip" type="button" data-search="' + T.escapeAttr(s.name) + '">' + T.escapeHtml(s.name) + '</button>';
  }).join('');

  const busca = [
    '<section class="section section-busca" id="busca">',
    '  <div class="container">',
    '    <div class="section-head text-center" style="margin-inline:auto;">',
    '      <p class="eyebrow">Busca inteligente</p>',
    '      <h2>Encontre o cuidado que você precisa</h2>',
    '      <p>Pesquise por especialidade, profissional ou sintoma. Os resultados aparecem em tempo real.</p>',
    '    </div>',
    '    <div class="search-box">',
    '      <div class="search-input-wrap">',
    '        ' + icons.search,
    '        <input class="search-input" id="home-search" type="search" placeholder="Cardiologista, dermatologista, check-up..." aria-label="Buscar especialidade, médico ou sintoma" autocomplete="off">',
    '      </div>',
    '      <div class="search-chips" role="group" aria-label="Filtros rápidos">' + chips + '</div>',
    '    </div>',
    '    <div class="search-results" id="home-search-results" aria-live="polite"></div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- C. Especialidades (preview) ---------- */
  const specCards = specialties.slice(0, 6).map(function (s) {
    return [
      '<article class="card card-hover spec-card">',
      '  <a class="spec-card-link" href="especialidade-' + s.slug + '.html" aria-label="Ver especialidade ' + T.escapeAttr(s.name) + '">',
      '    <div class="spec-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + s.icon + '"/></svg></div>',
      '    <h3 class="card-title">' + T.escapeHtml(s.name) + '</h3>',
      '    <p class="card-body">' + T.escapeHtml(s.shortDescription) + '</p>',
      '    <span class="spec-card-more">Ver especialidade ' + icons.arrowRight + '</span>',
      '  </a>',
      '</article>'
    ].join('\n');
  }).join('\n');

  const especialidades = [
    '<section class="section" id="especialidades">',
    '  <div class="container">',
    '    <div class="section-head section-head-row">',
    '      <div>',
    '        <p class="eyebrow">Especialidades</p>',
    '        <h2>Nossas especialidades</h2>',
    '        <p>Equipe multidisciplinar com acompanhamento próximo e humano.</p>',
    '      </div>',
    '      <a class="link-more" href="especialidades.html">Ver todas ' + icons.arrowRight + '</a>',
    '    </div>',
    '    <div class="grid-3">' + specCards + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- D. Profissionais (preview) ---------- */
  const docCards = doctors.slice(0, 6).map(function (d) {
    const specName = getSpecName(specialties, d.specialty);
    return [
      '<article class="card card-hover doctor-card">',
      '  <a class="doctor-card-link" href="medico-' + d.slug + '.html" aria-label="Ver perfil de ' + T.escapeAttr(d.name) + '">',
      '    <div class="doctor-photo"><img src="' + d.photo + '" alt="Foto profissional de ' + T.escapeAttr(d.name) + ', especialista da VivaMais" loading="lazy" width="120" height="120"></div>',
      '    <h3 class="card-title doctor-name">' + T.escapeHtml(d.name) + '</h3>',
      '    <p class="doctor-spec">' + T.escapeHtml(specName) + '</p>',
      '    <p class="doctor-crm text-muted">' + T.escapeHtml(d.crm) + '</p>',
      '    <span class="doctor-more">Ver perfil ' + icons.arrowRight + '</span>',
      '  </a>',
      '</article>'
    ].join('\n');
  }).join('\n');

  const profissionais = [
    '<section class="section-alt" id="profissionais">',
    '  <div class="container">',
    '    <div class="section-head section-head-row">',
    '      <div>',
    '        <p class="eyebrow">Profissionais</p>',
    '        <h2>Nossa equipe</h2>',
    '        <p>Médicos dedicados, com escuta e cuidado humano.</p>',
    '      </div>',
    '      <a class="link-more" href="profissionais.html">Ver todos ' + icons.arrowRight + '</a>',
    '    </div>',
    '    <div class="grid-3">' + docCards + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- E. Como funciona ---------- */
  const steps = [
    { t: 'Escolha a especialidade', d: 'Selecione a área de cuidado que você precisa.' },
    { t: 'Selecione o profissional', d: 'Conheça a equipe e escolha quem atende você.' },
    { t: 'Escolha a data', d: 'Veja os dias disponíveis e escolha o melhor.' },
    { t: 'Escolha o horário', d: 'Selecione o horário que cabe na sua rotina.' },
    { t: 'Confirme seus dados', d: 'Revise e confirme o agendamento em segundos.' }
  ];
  const stepsHtml = steps.map(function (s, i) {
    return [
      '<li class="step-item">',
      '  <div class="step-num" aria-hidden="true">' + (i + 1) + '</div>',
      '  <div class="step-body">',
      '    <h3 class="step-title">' + T.escapeHtml(s.t) + '</h3>',
      '    <p class="step-desc text-muted">' + T.escapeHtml(s.d) + '</p>',
      '  </div>',
      '</li>'
    ].join('\n');
  }).join('\n');

  const comoFunciona = [
    '<section class="section" id="como-funciona">',
    '  <div class="container">',
    '    <div class="section-head text-center" style="margin-inline:auto;">',
    '      <p class="eyebrow">Como funciona</p>',
    '      <h2>Como funciona o agendamento</h2>',
    '      <p>Cinco passos simples, do início ao fim.</p>',
    '    </div>',
    '    <ol class="steps" role="list">' + stepsHtml + '</ol>',
    '    <div class="text-center" style="margin-top:var(--space-6);">',
    '      <a class="btn btn-primary" href="agendamento.html">Iniciar agendamento ' + icons.arrowRight + '</a>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- F. Convênios (preview) ---------- */
  const insCards = insurance.slice(0, 8).map(function (i) {
    return '<div class="insurance-chip">' + T.escapeHtml(i.name) + '</div>';
  }).join('');

  const convenios = [
    '<section class="section-alt" id="convenios">',
    '  <div class="container">',
    '    <div class="section-head section-head-row">',
    '      <div>',
    '        <p class="eyebrow">Convênios</p>',
    '        <h2>Convênios atendidos</h2>',
    '        <p>Trabalhamos com os principais convênios da região.</p>',
    '      </div>',
    '      <a class="link-more" href="convenios.html">Ver todos ' + icons.arrowRight + '</a>',
    '    </div>',
    '    <div class="insurance-grid">' + insCards + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- G. Estrutura (preview) ---------- */
  const galleryImgs = [
    { src: 'img-recepcao.jpg', alt: 'Recepção moderna da clínica VivaMais com balcão de atendimento e sala de espera iluminada' },
    { src: 'img-exame.jpg', alt: 'Sala de consulta limpa e contemporânea com equipamentos médicos modernos' },
    { src: 'img-cardio.jpg', alt: 'Consulta cardiológica com médico e paciente em ambiente acolhedor' }
  ];
  const galleryHtml = galleryImgs.map(function (g) {
    return '<figure class="gallery-item"><img src="' + g.src + '" alt="' + T.escapeAttr(g.alt) + '" loading="lazy" width="400" height="300"></figure>';
  }).join('');

  const estrutura = [
    '<section class="section" id="estrutura">',
    '  <div class="container">',
    '    <div class="section-head text-center" style="margin-inline:auto;">',
    '      <p class="eyebrow">Estrutura</p>',
    '      <h2>Um espaço pensado para cuidar de você</h2>',
    '      <p>Ambiente acolhedor, salas equipadas e equipe preparada para uma experiência completa.</p>',
    '    </div>',
    '    <div class="gallery">' + galleryHtml + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- H. Conteúdo/Blog (preview) ---------- */
  const blogCards = articles.slice(0, 3).map(function (a) {
    return [
      '<article class="card card-hover blog-card">',
      '  <a class="blog-card-link" href="artigo-' + a.slug + '.html">',
      '    <span class="blog-card-cat badge">' + T.escapeHtml(a.category) + '</span>',
      '    <h3 class="card-title blog-card-title">' + T.escapeHtml(a.title) + '</h3>',
      '    <p class="card-body blog-card-excerpt">' + T.escapeHtml(a.excerpt) + '</p>',
      '    <div class="blog-card-meta"><span class="text-muted">' + T.escapeHtml(a.readTime) + ' de leitura</span><span class="blog-card-more">Ler artigo ' + icons.arrowRight + '</span></div>',
      '  </a>',
      '</article>'
    ].join('\n');
  }).join('\n');

  const blog = [
    '<section class="section-alt" id="blog">',
    '  <div class="container">',
    '    <div class="section-head section-head-row">',
    '      <div>',
    '        <p class="eyebrow">Conteúdo</p>',
    '        <h2>Central de saúde</h2>',
    '        <p>Artigos e orientações da nossa equipe.</p>',
    '      </div>',
    '      <a class="link-more" href="blog.html">Ver todos os artigos ' + icons.arrowRight + '</a>',
    '    </div>',
    '    <div class="grid-3">' + blogCards + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- I. FAQ (preview) ---------- */
  const faqs = [
    { q: 'Como faço para agendar uma consulta?', a: 'Você pode agendar diretamente pela plataforma, em poucos cliques. Escolha a especialidade, o profissional, a data e o horário.' },
    { q: 'Quais convênios são atendidos?', a: 'Atendemos os principais convênios da região. Confira a lista completa na página de Convênios.' },
    { q: 'Preciso de encaminhamento para marcar consulta?', a: 'Na maioria das especialidades não é necessário encaminhamento. Para alguns exames específicos, pode ser solicitado.' },
    { q: 'Posso remarcar ou cancelar meu agendamento?', a: 'Sim. Acesse a Área do paciente para remarcar ou cancelar com facilidade.' },
    { q: 'O atendimento é presencial ou online?', a: 'Oferecemos atendimento presencial em nossa unidade. O agendamento é feito totalmente online pela plataforma.' }
  ];
  const faqHtml = faqs.map(function (f) {
    return [
      '<details class="faq-item">',
      '  <summary class="faq-q">' + T.escapeHtml(f.q) + icons.chevronDown + '</summary>',
      '  <div class="faq-a"><p>' + T.escapeHtml(f.a) + '</p></div>',
      '</details>'
    ].join('\n');
  }).join('\n');

  const faq = [
    '<section class="section" id="faq">',
    '  <div class="container faq-container">',
    '    <div class="section-head text-center" style="margin-inline:auto;">',
    '      <p class="eyebrow">Dúvidas</p>',
    '      <h2>Perguntas frequentes</h2>',
    '    </div>',
    '    <div class="faq-list">' + faqHtml + '</div>',
    '    <div class="text-center" style="margin-top:var(--space-5);">',
    '      <a class="link-more" href="faq.html">Ver todas ' + icons.arrowRight + '</a>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- J. CTA final ---------- */
  const cta = [
    '<section class="section cta-final" id="cta">',
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

  const content = [hero, busca, especialidades, profissionais, comoFunciona, convenios, estrutura, blog, faq, cta].join('\n\n');

  return T.renderLayout('', 'VivaMais — plataforma digital para saúde integrada. Agende consultas, encontre especialistas e cuide da sua saúde com atendimento humanizado.', content, {
    activeNav: 'home',
    root: '',
    canonical: 'index',
    ogImage: 'img-hero.jpg',
    extraScripts: ['scripts/home-script.js'],
    jsonLd: [
      T.buildMedicalClinic(),
      T.buildOrganization(),
      T.buildWebSite()
    ]
  });
}

function getSpecName(specialties, slug) {
  const found = specialties.filter(function (s) { return s.slug === slug; })[0];
  return found ? found.name : slug;
}

module.exports = { renderHome: renderHome };
