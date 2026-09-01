/* VivaMais — cookies.js
   Política de Cookies. Light theme. SVG inline. Texto profissional. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  const updated = '15 de janeiro de 2025';

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Cookies</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero ---------- */
  const hero = [
    '<section class="page-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Legal</p>',
    '    <h1>Política de Cookies</h1>',
    '    <p class="page-hero-lead">Atualizado em ' + T.escapeHtml(updated) + '. Esta política explica como utilizamos cookies e tecnologias similares, em conformidade com a LGPD (Lei nº 13.709/2018).</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Seções ---------- */
  const sections = [
    { n: 1, t: 'O que são cookies', body: '<p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita um site. Eles permitem que a plataforma lembre suas ações e preferências ao longo do tempo.</p><p>Os cookies não danificam seu dispositivo e, por si só, não identificam você pessoalmente — apenas o seu navegador.</p>' },
    { n: 2, t: 'Tipos de cookies utilizados', body: '<p>Utilizamos as seguintes categorias de cookies:</p><ul class="legal-list"><li><strong>Essenciais:</strong> necessários para o funcionamento básico da plataforma (sessão, segurança).</li><li><strong>Desempenho:</strong> coletam informações anônimas sobre como os visitantes utilizam o site, para melhorias.</li><li><strong>Funcionalidade:</strong> lembram suas preferências (ex.: idioma, tema).</li></ul><p>Não utilizamos cookies de publicidade ou rastreamento de terceiros para marketing.</p>' },
    { n: 3, t: 'Cookies de terceiros', body: '<p>Podemos utilizar serviços de terceiros (ex.: mapas, fontes, hospedagem) que definem seus próprios cookies. Esses terceiros têm suas próprias políticas de privacidade, às quais recomendamos acessar.</p><p>Não controlamos os cookies de terceiros e não nos responsabilizamos por suas práticas.</p>' },
    { n: 4, t: 'Gerenciamento de cookies', body: '<p>Você pode gerenciar ou excluir cookies a qualquer momento por meio das configurações do seu navegador. A maioria dos navegadores permite:</p><ul class="legal-list"><li>Visualizar os cookies armazenados.</li><li>Aceitar ou recusar cookies individualmente.</li><li>Excluir todos os cookies ao fechar o navegador.</li><li>Bloquear cookies de terceiros.</li></ul><p>Ao desativar cookies essenciais, algumas funcionalidades da plataforma podem deixar de funcionar corretamente.</p>' },
    { n: 5, t: 'Alterações', body: '<p>Esta Política de Cookies pode ser atualizada periodicamente. A versão vigente estará sempre disponível nesta página, com a data de atualização no topo.</p><p>Para dúvidas sobre dados e privacidade, consulte também nossa <a href="privacidade.html">Política de Privacidade</a>.</p>' }
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

  /* ---------- Banner de consentimento ---------- */
  const banner = [
    '<div class="cookie-banner" id="cookie-banner" role="dialog" aria-label="Consentimento de cookies">',
    '  <div class="cookie-banner-inner">',
    '    <p class="cookie-banner-text">Utilizamos cookies essenciais e de desempenho para melhorar sua experiência. Saiba mais em nossa <a href="cookies.html">Política de Cookies</a>.</p>',
    '    <div class="cookie-banner-actions">',
    '      <button class="btn btn-primary" type="button" id="cookie-accept">Aceitar</button>',
    '      <button class="btn btn-ghost" type="button" id="cookie-reject">Recusar opcionais</button>',
    '    </div>',
    '  </div>',
    '</div>'
  ].join('\n');

  const content = [
    breadcrumb,
    hero,
    '<section class="section-tight"><div class="container"><div class="legal-toc" aria-label="Sumário"><h2 class="legal-toc-title">Sumário</h2><ol class="legal-toc-list">' + sumarioItems + '</ol></div></div></section>',
    '<section class="section-tight"><div class="container"><div class="legal-doc">' + sectionsHtml + '</div></div></section>',
    banner
  ].join('\n\n');

  return T.renderLayout('Política de Cookies', 'Política de Cookies da VivaMais. Saiba como utilizamos cookies e tecnologias similares, em conformidade com a LGPD.', content, {
    activeNav: '',
    root: '',
    canonical: 'cookies',
    extraScripts: ['scripts/content-script.js']
  });
}

module.exports = { renderPage: renderPage };
