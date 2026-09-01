/* VivaMais — faq.js
   Página de perguntas frequentes (accordion). Light theme. SVG inline. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">FAQ</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Dúvidas</p>',
    '    <h1>Perguntas frequentes</h1>',
    '    <p class="page-hero-lead">Reunimos as dúvidas mais comuns sobre agendamento, atendimento e funcionamento. Se não encontrar o que procura, fale com a gente.</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- FAQ ---------- */
  const faqs = [
    { q: 'Como faço para agendar uma consulta?', a: 'Você pode agendar diretamente pela plataforma, em poucos cliques. Escolha a especialidade, o profissional, a data e o horário disponível. Ao final, confirme seus dados e receba a confirmação.' },
    { q: 'Quais convênios são aceitos?', a: 'Atendemos os principais convênios da região. A lista completa está disponível na página de Convênios, onde você pode conferir quais especialidades cada plano cobre.' },
    { q: 'Posso cancelar ou remarcar minha consulta?', a: 'Sim. Acesse a Área do paciente para remarcar ou cancelar seu agendamento com facilidade. Recomendamos avisar com antecedência para liberar o horário para outros pacientes.' },
    { q: 'Como funciona o portal do paciente?', a: 'O portal reúne suas consultas, exames, receitas e dados em um só lugar. Acesse com seu e-mail e senha para acompanhar seu histórico e gerenciar agendamentos.' },
    { q: 'Como recebo meus exames e receitas?', a: 'Exames e receitas são disponibilizados no portal do paciente assim que prontos. Você também pode solicitar uma cópia presencial na recepção.' },
    { q: 'Preciso levar algo na primeira consulta?', a: 'Traga documento de identidade, cartão do convênio (se aplicável) e exames anteriores relacionados ao motivo da consulta. Anote suas dúvidas para aproveitar melhor o atendimento.' },
    { q: 'Atende emergências?', a: 'A VivaMais é focada em atendimento ambulatorial e consultas. Em casos de emergência, procure um pronto-socorro ou ligue para o SAMU (192).' },
    { q: 'Qual o horário de funcionamento?', a: 'Funcionamos de segunda a sexta, das 07h00 às 19h00, e aos sábados das 08h00 às 13h00. Domingos e feriados permanecemos fechados.' },
    { q: 'Tem estacionamento?', a: 'Sim, oferecemos estacionamento no local com vagas reservadas para idosos e pessoas com deficiência. Informações detalhadas estão na página de Localização.' },
    { q: 'A clínica é acessível para cadeirantes?', a: 'Sim. A estrutura conta com rampas de acesso, elevador, banheiros adaptados e sinalização tátil. Nosso time está preparado para acolher todos os pacientes.' },
    { q: 'Como funciona o atendimento particular?', a: 'Para atendimentos particulares, o valor da consulta é informado no momento do agendamento. Pagamento pode ser feito via pix, cartão ou dinheiro na recepção.' },
    { q: 'Posso agendar para outra pessoa?', a: 'Sim. No formulário de agendamento, informe os dados do paciente que será atendido. É importante que os dados estejam corretos para o registro clínico.' }
  ];
  const faqHtml = faqs.map(function (f, i) {
    return [
      '<details class="faq-item faq-single" id="faq-' + i + '">',
      '  <summary class="faq-q" aria-expanded="false">' + T.escapeHtml(f.q) + icons.chevronDown + '</summary>',
      '  <div class="faq-a"><p>' + T.escapeHtml(f.a) + '</p></div>',
      '</details>'
    ].join('\n');
  }).join('');

  const faqSection = [
    '<section class="section" id="faq-lista">',
    '  <div class="container faq-container">',
    '    <div class="faq-list faq-single-list">' + faqHtml + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- CTA ---------- */
  const cta = [
    '<section class="section cta-final">',
    '  <div class="container">',
    '    <div class="cta-final-card">',
    '      <h2>Ainda tem dúvidas?</h2>',
    '      <p>Nossa equipe está pronta para ajudar você.</p>',
    '      <div class="cta-final-actions">',
    '        <a class="btn btn-primary" href="https://wa.me/' + T.clinic.whatsapp.replace(/\D/g, '') + '" rel="noopener">' + icons.whatsapp + ' Fale conosco</a>',
    '        <a class="btn btn-ghost" href="agendamento.html">Agendar consulta</a>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, faqSection, cta].join('\n\n');

  return T.renderLayout('FAQ', 'Perguntas frequentes sobre agendamento, convênios, funcionamento e atendimento na VivaMais. Tire suas dúvidas.', content, {
    activeNav: '',
    root: '',
    canonical: 'faq',
    extraScripts: ['scripts/content-script.js'],
    jsonLd: [
      T.buildBreadcrumbList([
        { name: 'Início', slug: 'index' },
        { name: 'FAQ', slug: 'faq' }
      ])
    ]
  });
}

module.exports = { renderPage: renderPage };
