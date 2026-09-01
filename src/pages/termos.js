/* VivaMais — termos.js
   Termos de Uso. Light theme. SVG inline. Texto profissional. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  const clinic = T.clinic;
  const updated = '15 de janeiro de 2025';

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Termos</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Legal</p>',
    '    <h1>Termos de Uso</h1>',
    '    <p class="page-hero-lead">Atualizado em ' + T.escapeHtml(updated) + '. Estes termos regulam o uso da plataforma ' + T.escapeHtml(clinic.name) + '. Ao acessá-la, você concorda com as condições abaixo.</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Seções ---------- */
  const sections = [
    { n: 1, t: 'Aceitação dos termos', body: '<p>Ao acessar ou utilizar esta plataforma, você concorda integralmente com estes Termos de Uso. Caso não concorde com qualquer disposição, não utilize os serviços.</p><p>Esta é uma plataforma demonstrativa. Os serviços, dados e profissionais aqui apresentados são fictícios e não devem ser utilizados para atendimento real.</p>' },
    { n: 2, t: 'Descrição do serviço', body: '<p>A plataforma oferece recursos para agendamento de consultas, gestão de informações do paciente e comunicação com a clínica, em caráter demonstrativo.</p><p>Não substitui atendimento médico presencial, telemedicina regulamentada ou serviços de emergência. Em casos de urgência, procure socorro médico imediato.</p>' },
    { n: 3, t: 'Cadastro e conta', body: '<p>Para utilizar funcionalidades como o portal do paciente, você deve fornecer dados verdadeiros, completos e atualizados.</p><p>É responsável pela manutenção da confidencialidade de sua conta e senha, bem como por todas as atividades realizadas com ela.</p>' },
    { n: 4, t: 'Responsabilidades do usuário', body: '<p>Você se compromete a:</p><ul class="legal-list"><li>Fornecer informações verídicas no cadastro e agendamento.</li><li>Não utilizar a plataforma para fins ilícitos ou prejudiciais.</li><li>Não tentar acessar áreas restritas ou comprometer a segurança do sistema.</li><li>Respeitar os direitos de propriedade intelectual da clínica e de terceiros.</li><li>Utilizar os recursos de forma compatível com a finalidade demonstrativa.</li></ul>' },
    { n: 5, t: 'Responsabilidades da clínica', body: '<p>A ' + T.escapeHtml(clinic.name) + ' compromete-se a:</p><ul class="legal-list"><li>Manter a plataforma disponível, dentro de limites razoáveis de manutenção.</li><li>Tratar seus dados conforme a <a href="privacidade.html">Política de Privacidade</a> e a LGPD.</li><li>Oferecer canais de suporte e contato.</li><li>Adotar medidas de segurança técnicas e organizacionais.</li></ul><p>Não nos responsabilizamos por indisponibilidades decorrentes de fatores externos, manutenções programadas ou casos fortuitos.</p>' },
    { n: 6, t: 'Propriedade intelectual', body: '<p>Todo o conteúdo da plataforma — textos, imagens, logos, layout e código — é protegido por direitos autorais e pertence à ' + T.escapeHtml(clinic.name) + ' ou a seus licenciadores.</p><p>É proibida a reprodução, distribuição ou modificação sem autorização expressa, exceto para uso pessoal e não comercial.</p>' },
    { n: 7, t: 'Limitação de responsabilidade', body: '<p>Esta plataforma é fornecida "como está", sem garantias expressas ou implícitas. Por se tratar de ambiente demonstrativo, os dados não constituem aconselhamento médico.</p><p>Em nenhum caso a clínica será responsável por danos diretos, indiretos ou consequentes decorrentes do uso ou impossibilidade de uso da plataforma.</p>' },
    { n: 8, t: 'Suspensão de conta', body: '<p>Podemos suspender ou encerrar o acesso de usuários que descumpram estes Termos, forneçam dados falsos ou utilizem a plataforma de forma indevida, sem aviso prévio quando necessário.</p>' },
    { n: 9, t: 'Alterações dos termos', body: '<p>Estes Termos podem ser atualizados periodicamente. A versão vigente estará sempre disponível nesta página, com a data de atualização. O uso continuado após alterações implica aceitação.</p>' },
    { n: 10, t: 'Legislação aplicável e foro', body: '<p>Estes Termos são regidos pelas leis da República Federativa do Brasil, incluindo a LGPD (Lei nº 13.709/2018) e o Código de Defesa do Consumidor (Lei nº 8.078/1990).</p><p>Fica eleito o foro da comarca de ' + T.escapeHtml(clinic.address.city) + ' / ' + T.escapeHtml(clinic.address.state) + ' para dirimir quaisquer controvérsias, com renúncia a qualquer outro, por mais privilegiado que seja.</p>' }
  ];

  const sumarioItems = sections.map(function (s) {
    return '<li class="legal-toc-item"><a href="#sec-' + s.n + '"><span class="legal-toc-num">' + s.n + '</span><span>' + T.escapeHtml(s.t) + '</span></a></li>';
  }).join('');

  const sectionsHtml = sections.map(function (s) {
    return [
      '<section class="legal-section" id="sec-' + s.n + '">',
      '  <h2 class="legal-section-title"><span class="legal-section-num">' + s.n + '</span> ' + T.escapeHtml(s.t) + '</h2>',
      '  <div class="legal-section-body prose-legal">' + s.body + '</div>',
      '</section>'
    ].join('\n');
  }).join('\n');

  const content = [
    breadcrumb,
    hero,
    '<section class="section-tight"><div class="container"><div class="legal-toc" aria-label="Sumário"><h2 class="legal-toc-title">Sumário</h2><ol class="legal-toc-list">' + sumarioItems + '</ol></div></div></section>',
    '<section class="section-tight"><div class="container"><div class="legal-doc">' + sectionsHtml + '</div></div></section>'
  ].join('\n\n');

  return T.renderLayout('Termos de Uso', 'Termos de Uso da plataforma VivaMais. Condições para utilização dos serviços, responsabilidades e legislação aplicável.', content, {
    activeNav: '',
    root: '',
    canonical: 'termos'
  });
}

module.exports = { renderPage: renderPage };
