/* VivaMais — privacidade.js
   Política de Privacidade (LGPD). Light theme. SVG inline. Texto profissional. */

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
    '  <span class="breadcrumb-current" aria-current="page">Privacidade</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Legal</p>',
    '    <h1>Política de Privacidade</h1>',
    '    <p class="page-hero-lead">Atualizado em ' + T.escapeHtml(updated) + '. Esta política descreve como tratamos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Sumário ---------- */
  const sections = [
    { n: 1, t: 'Introdução', body: '<p>Esta Política de Privacidade explica como a ' + T.escapeHtml(clinic.name) + ' ("nós", "clínica" ou "controladora") coleta, utiliza, compartilha e protege os dados pessoais dos usuários desta plataforma.</p><p>Ao utilizar nossos serviços, você concorda com as práticas descritas neste documento. Esta é uma plataforma demonstrativa; os dados aqui tratados são fictícios e utilizados apenas para fins de demonstração do produto.</p>' },
    { n: 2, t: 'Dados coletados', body: '<p>Podemos coletar os seguintes dados pessoais:</p><ul class="legal-list"><li><strong>Identificação:</strong> nome completo, documento de identidade, data de nascimento.</li><li><strong>Contato:</strong> e-mail, telefone, endereço.</li><li><strong>Saúde (dados sensíveis):</strong> histórico clínico, exames, receitas, informações de agendamento.</li><li><strong>Navegação:</strong> endereço IP, cookies, páginas visitadas (conforme nossa Política de Cookies).</li></ul><p>Os dados de saúde são classificados como sensíveis pelo art. 11 da LGPD e recebem tratamento especial, com maior nível de proteção.</p>' },
    { n: 3, t: 'Uso dos dados', body: '<p>Os dados coletados são utilizados para:</p><ul class="legal-list"><li>Agendamento e gestão de consultas e procedimentos.</li><li>Comunicação com o paciente sobre seu atendimento.</li><li>Registro clínico e emissão de documentos (receitas, atestados, laudos).</li><li>Cobrança e tramitação com convênios.</li><li>Melhoria da experiência e dos serviços oferecidos.</li><li>Cumprimento de obrigações legais e regulatórias.</li></ul>' },
    { n: 4, t: 'Base legal (LGPD)', body: '<p>O tratamento dos dados pessoais ocorre nas seguintes hipóteses previstas pela LGPD:</p><ul class="legal-list"><li><strong>Consentimento</strong> (art. 8º): quando você autoriza expressamente um tratamento específico.</li><li><strong>Execução de contrato</strong> (art. 7º, V): para cumprir o atendimento solicitado.</li><li><strong>Cumprimento de obrigação legal</strong> (art. 7º, II): para atender exigências sanitárias e fiscais.</li><li><strong>Tutela da saúde</strong> (art. 7º, VIII e art. 11, II, f): para proteção da saúde do próprio titular, por profissionais de saúde.</li></ul>' },
    { n: 5, t: 'Compartilhamento', body: '<p>Seus dados podem ser compartilhados, sempre na medida do necessário, com:</p><ul class="legal-list"><li><strong>Operadoras de convênios</strong>, para autorização e faturamento de procedimentos.</li><li><strong>Profissionais de saúde</strong> envolvidos no seu atendimento.</li><li><strong>Órgãos sanitários e regulatórios</strong>, quando exigido por lei.</li><li><strong>Prestadores de serviço</strong> (ex.: hospedagem, e-mail), sob contratos com cláusulas de confidencialidade.</li></ul><p>Não comercializamos seus dados pessoais.</p>' },
    { n: 6, t: 'Direitos do titular', body: '<p>Conforme o art. 18 da LGPD, você pode solicitar, a qualquer momento:</p><ul class="legal-list"><li><strong>Acesso</strong> aos dados tratados.</li><li><strong>Retificação</strong> de dados incompletos ou inexatos.</li><li><strong>Eliminação</strong> de dados tratados com consentimento (quando aplicável).</li><li><strong>Portabilidade</strong> dos dados a outro fornecedor.</li><li><strong>Informação</strong> sobre o compartilhamento de dados.</li><li><strong>Revogação do consentimento</strong>.</li></ul><p>Para exercer seus direitos, entre em contato pelo e-mail indicado na seção 10.</p>' },
    { n: 7, t: 'Segurança', body: '<p>Adotamos medidas técnicas e organizacionais para proteger seus dados contra acessos não autorizados, alteração ou divulgação indevida, incluindo:</p><ul class="legal-list"><li>Criptografia em trânsito (TLS).</li><li>Controle de acesso baseado em perfis.</li><li>Backups e monitoramento contínuo.</li><li>Treinamento de equipe em proteção de dados.</li></ul><p>Nenhum sistema é totalmente seguro. Em caso de incidente, agiremos conforme a LGPD e comunicaremos os afetados e a ANPD quando aplicável.</p>' },
    { n: 8, t: 'Cookies', body: '<p>Utilizamos cookies para melhorar a navegação e a segurança da plataforma. Os detalhes estão descritos em nossa <a href="cookies.html">Política de Cookies</a>. Você pode gerenciar suas preferências a qualquer momento.</p>' },
    { n: 9, t: 'Alterações desta política', body: '<p>Esta política pode ser atualizada periodicamente. A versão vigente estará sempre disponível nesta página, com a data de atualização no topo. Recomendamos revisitar este documento regularmente.</p>' },
    { n: 10, t: 'Contato do encarregado (DPO)', body: '<p>Para dúvidas, solicitações ou exercício de direitos relacionados aos seus dados, entre em contato com nosso Encarregado pelo Tratamento de Dados Pessoais (DPO):</p><ul class="legal-list"><li><strong>E-mail:</strong> <a href="mailto:' + T.escapeAttr(clinic.email) + '">' + T.escapeHtml(clinic.email) + '</a></li><li><strong>Telefone:</strong> ' + T.escapeHtml(clinic.phone) + '</li></ul><p>Esta plataforma é demonstrativa. Os canais de contato acima são fictícios e não devem ser utilizados para fins reais.</p>' }
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

  return T.renderLayout('Política de Privacidade', 'Política de Privacidade da VivaMais em conformidade com a LGPD. Saiba como tratamos seus dados pessoais e sensíveis de saúde.', content, {
    activeNav: '',
    root: '',
    canonical: 'privacidade'
  });
}

module.exports = { renderPage: renderPage };
