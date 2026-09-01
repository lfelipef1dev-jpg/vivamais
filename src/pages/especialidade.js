/* VivaMais — especialidade.js
   Páginas individuais de especialidade (gera 6 dinamicamente). Light theme. SVG inline. Dados demonstrativos. */

const T = require('../templates/templates');
const icons = T.icons;

function getSpecName(specialties, slug) {
  const found = specialties.filter(function (s) { return s.slug === slug; })[0];
  return found ? found.name : slug;
}

function renderFor(slug) {
  const specialties = T.loadData('specialties');
  const doctors = T.loadData('doctors');
  const spec = specialties.filter(function (s) { return s.slug === slug; })[0];
  if (!spec) return '';
  const specDoctors = doctors.filter(function (d) { return d.specialty === slug; });

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <a href="especialidades.html">Especialidades</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">' + T.escapeHtml(spec.name) + '</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero page-hero-spec" style="--spec-color:' + spec.color + ';">',
    '  <div class="container">',
    '    <div class="page-hero-spec-inner">',
    '      <div class="spec-icon-xl" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + spec.icon + '"/></svg></div>',
    '      <div>',
    '        <p class="eyebrow">Especialidade</p>',
    '        <h1>' + T.escapeHtml(spec.name) + '</h1>',
    '        <p class="page-hero-lead">' + T.escapeHtml(spec.longDescription) + '</p>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Quando procurar ---------- */
  const symptoms = spec.whenToSeek.map(function (w) {
    return [
      '<article class="card symptom-card">',
      '  <div class="symptom-icon" aria-hidden="true">' + icons.check + '</div>',
      '  <p class="symptom-text">' + T.escapeHtml(w) + '</p>',
      '</article>'
    ].join('\n');
  }).join('\n');

  const quandoProcurar = [
    '<section class="section" id="quando-procurar">',
    '  <div class="container">',
    '    <div class="section-head">',
    '      <p class="eyebrow">Sinais de alerta</p>',
    '      <h2>Quando procurar um ' + T.escapeHtml(specNameLabel(spec.name)) + '?</h2>',
    '      <p>Busque atendimento se apresentar algum destes sinais ou sintomas.</p>',
    '    </div>',
    '    <div class="grid-3 symptom-grid">' + symptoms + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Serviços ---------- */
  const services = spec.services.map(function (sv) {
    return [
      '<li class="service-item">',
      '  <span class="service-check" aria-hidden="true">' + icons.check + '</span>',
      '  <span>' + T.escapeHtml(sv) + '</span>',
      '</li>'
    ].join('\n');
  }).join('');

  const servicos = [
    '<section class="section-alt" id="servicos">',
    '  <div class="container">',
    '    <div class="section-head">',
    '      <p class="eyebrow">O que oferecemos</p>',
    '      <h2>Serviços relacionados</h2>',
    '      <p>Procedimentos e atendimentos disponíveis nesta especialidade.</p>',
    '    </div>',
    '    <ul class="service-list">' + services + '</ul>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Especialistas ---------- */
  let especialistas = '';
  if (specDoctors.length) {
    const docCards = specDoctors.map(function (d) {
      return [
        '<article class="card card-hover doctor-card-lg">',
        '  <a class="doctor-card-lg-link" href="medico-' + d.slug + '.html" aria-label="Ver perfil de ' + T.escapeAttr(d.name) + '">',
        '    <div class="doctor-photo-lg"><img src="' + d.photo + '" alt="Foto profissional de ' + T.escapeAttr(d.name) + ', especialista da VivaMais" loading="lazy" width="160" height="160"></div>',
        '    <div class="doctor-card-lg-body">',
        '      <h3 class="doctor-card-lg-name">' + T.escapeHtml(d.name) + '</h3>',
        '      <p class="doctor-card-lg-crm text-muted">' + T.escapeHtml(d.crm) + '</p>',
        '      <span class="doctor-card-lg-more">Ver perfil ' + icons.arrowRight + '</span>',
        '    </div>',
        '  </a>',
        '</article>'
      ].join('\n');
    }).join('\n');
    especialistas = [
      '<section class="section" id="especialistas">',
      '  <div class="container">',
      '    <div class="section-head">',
      '      <p class="eyebrow">Equipe</p>',
      '      <h2>Especialistas disponíveis</h2>',
      '      <p>Profissionais dedicados a esta especialidade.</p>',
      '    </div>',
      '    <div class="grid-3">' + docCards + '</div>',
      '  </div>',
      '</section>'
    ].join('\n');
  } else {
    especialistas = [
      '<section class="section" id="especialistas">',
      '  <div class="container">',
      '    <div class="empty-state">',
      '      ' + icons.user,
      '      <h3>Nenhum profissional disponível</h3>',
      '      <p>No momento não há especialistas cadastrados nesta área. Entre em contato para orientação.</p>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('\n');
  }

  /* ---------- Horários ---------- */
  const days = [
    { key: 'seg', label: 'Segunda' },
    { key: 'ter', label: 'Terça' },
    { key: 'qua', label: 'Quarta' },
    { key: 'qui', label: 'Quinta' },
    { key: 'sex', label: 'Sexta' }
  ];
  const slots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
  const dayCols = days.map(function (day) {
    const available = (day.key === 'seg' || day.key === 'qua' || day.key === 'sex');
    const daySlots = slots.map(function (t) {
      const free = available && (t === '08:00' || t === '09:00' || t === '14:00' || t === '15:00');
      const cls = 'schedule-slot' + (free ? ' schedule-slot-free' : ' schedule-slot-busy');
      const state = free ? 'Disponível' : 'Indisponível';
      return '<button class="' + cls + '" type="button" data-day="' + day.key + '" data-time="' + t + '" data-specialty="' + spec.slug + '" ' + (free ? '' : 'disabled') + ' aria-label="' + day.label + ' ' + t + ' — ' + state + '">' + t + '</button>';
    }).join('');
    return [
      '<div class="schedule-day" data-day="' + day.key + '">',
      '  <h3 class="schedule-day-title">' + T.escapeHtml(day.label) + '</h3>',
      '  <div class="schedule-slots">' + daySlots + '</div>',
      '</div>'
    ].join('\n');
  }).join('');

  const horarios = [
    '<section class="section-alt" id="horarios">',
    '  <div class="container">',
    '    <div class="section-head">',
    '      <p class="eyebrow">Disponibilidade</p>',
    '      <h2>Horários disponíveis</h2>',
    '      <p>Veja os slots de atendimento desta especialidade. Dados demonstrativos.</p>',
    '    </div>',
    '    <div class="schedule-grid" id="schedule-grid">' + dayCols + '</div>',
    '    <p class="schedule-note text-muted">' + icons.clock + ' <span>Horários ilustrativos. Confirme ao agendar.</span></p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- FAQ ---------- */
  const faqs = buildFaq(spec.name);
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
    '      <h2>Perguntas sobre ' + T.escapeHtml(spec.name) + '</h2>',
    '    </div>',
    '    <div class="faq-list">' + faqHtml + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- CTA ---------- */
  const cta = [
    '<section class="section cta-final">',
    '  <div class="container">',
    '    <div class="cta-final-card">',
    '      <h2>Agendar consulta de ' + T.escapeHtml(spec.name) + '</h2>',
    '      <p>Marque seu atendimento em poucos cliques.</p>',
    '      <div class="cta-final-actions">',
    '        <a class="btn btn-primary" href="agendamento.html?specialty=' + spec.slug + '">Agendar consulta</a>',
    '        <a class="btn btn-ghost" href="profissionais.html">Ver profissionais ' + icons.arrowRight + '</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, quandoProcurar, servicos, especialistas, horarios, faq, cta].join('\n\n');

  return T.renderLayout(spec.name, spec.shortDescription + ' Na VivaMais, ' + spec.name.toLowerCase() + ' com acompanhamento humanizado e equipe especializada.', content, {
    activeNav: 'specialties',
    root: '',
    canonical: 'especialidade-' + spec.slug,
    extraScripts: ['scripts/pages-script.js'],
    jsonLd: [
      T.buildMedicalSpecialty(spec),
      T.buildBreadcrumbList([
        { name: 'Início', slug: 'index' },
        { name: 'Especialidades', slug: 'especialidades' },
        { name: spec.name, slug: 'especialidade-' + spec.slug }
      ])
    ]
  });
}

function specNameLabel(name) {
  const map = {
    'Cardiologia': 'cardiologista',
    'Dermatologia': 'dermatologista',
    'Ortopedia': 'ortopedista',
    'Pediatria': 'pediatra',
    'Ginecologia': 'ginecologista',
    'Clínica Geral': 'clínico geral'
  };
  return map[name] || 'especialista';
}

function buildFaq(specName) {
  return [
    {
      q: 'Preciso de encaminhamento para marcar consulta de ' + specName + '?',
      a: 'Na maioria dos casos não é necessário encaminhamento. Para alguns exames específicos, o profissional pode solicitar solicitação prévia.'
    },
    {
      q: 'Quais convênios são aceitos em ' + specName + '?',
      a: 'Atendemos os principais convênios. Confira a lista completa na página de Convênios ou consulte no momento do agendamento.'
    },
    {
      q: 'É possível remarcar a consulta?',
      a: 'Sim. Acesse a Área do paciente para remarcar ou cancelar com facilidade, respeitando o prazo mínimo de antecedência.'
    },
    {
      q: 'O atendimento é presencial ou online?',
      a: 'Oferecemos atendimento presencial em nossa unidade. O agendamento é feito totalmente online pela plataforma.'
    }
  ];
}

function renderAll() {
  const specialties = T.loadData('specialties');
  return specialties.map(function (s) {
    return { slug: s.slug, html: renderFor(s.slug) };
  });
}

module.exports = { renderFor: renderFor, renderAll: renderAll };
