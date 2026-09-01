/* VivaMais — 404.js
   Página de erro 404. Light theme. SVG inline. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  /* ---------- Ilustração SVG 404 ---------- */
  const illustration = [
    '<div class="error-illustration" aria-hidden="true">',
    '  <svg viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustração 404">',
    '    <defs>',
    '      <linearGradient id="err-grad" x1="0" y1="0" x2="1" y2="1">',
    '        <stop offset="0%" stop-color="#0D9488"/>',
    '        <stop offset="100%" stop-color="#0F766E"/>',
    '      </linearGradient>',
    '    </defs>',
    '    <circle cx="240" cy="120" r="96" fill="rgba(13,148,136,0.08)"/>',
    '    <circle cx="240" cy="120" r="64" fill="rgba(13,148,136,0.12)"/>',
    '    <text x="240" y="148" text-anchor="middle" font-family="Inter, sans-serif" font-size="88" font-weight="800" fill="url(#err-grad)" letter-spacing="-4">404</text>',
    '    <path d="M120 200 Q240 230 360 200" stroke="rgba(13,148,136,0.3)" stroke-width="3" fill="none" stroke-linecap="round"/>',
    '    <circle cx="120" cy="200" r="6" fill="#0D9488"/>',
    '    <circle cx="360" cy="200" r="6" fill="#0D9488"/>',
    '  </svg>',
    '</div>'
  ].join('\n');

  /* ---------- Sugestões ---------- */
  const suggestions = [
    { href: 'especialidades.html', label: 'Especialidades', icon: 'M12 21s-6.5-4.35-9-8.5C1 9 3 5 6.5 5c2 0 3.5 1 5.5 3 2-2 3.5-3 5.5-3C21 5 23 9 21 12.5c-2.5 4.15-9 8.5-9 8.5z' },
    { href: 'profissionais.html', label: 'Profissionais', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
    { href: 'agendamento.html', label: 'Agendamento', icon: 'M3 10h18M3 6h18M3 14h18M3 18h18' },
    { href: 'blog.html', label: 'Blog', icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z' }
  ];
  const suggestionsHtml = suggestions.map(function (s) {
    return [
      '<a class="card card-hover error-suggestion-card" href="' + s.href + '">',
      '  <span class="error-suggestion-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + s.icon + '"/></svg></span>',
      '  <span class="error-suggestion-label">' + T.escapeHtml(s.label) + '</span>',
      '  <span class="error-suggestion-arrow" aria-hidden="true">' + icons.arrowRight + '</span>',
      '</a>'
    ].join('\n');
  }).join('');

  const content = [
    '<section class="error-section">',
    '  <div class="container error-container">',
    illustration,
    '    <h1 class="error-title">Página não encontrada</h1>',
    '    <p class="error-message">Não encontramos a página que você procura. O endereço pode estar incorreto ou a página ter sido movida.</p>',
    '    <a class="btn btn-primary error-home-btn" href="index.html">' + icons.arrowRight + ' Voltar para o início</a>',
    '    <h2 class="error-suggestions-title">Talvez você procure:</h2>',
    '    <div class="grid-4 error-suggestions">' + suggestionsHtml + '</div>',
    '  </div>',
    '</section>'
  ].join('\n');

  return T.renderLayout('Página não encontrada', 'A página que você procura não foi encontrada. Volte para o início ou explore especialidades, profissionais e agendamento da VivaMais.', content, {
    activeNav: '',
    root: '',
    noindex: true
  });
}

module.exports = { renderPage: renderPage };
