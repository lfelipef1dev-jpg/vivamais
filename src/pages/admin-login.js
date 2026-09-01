/* VivaMais — admin-login.js
   Página de login do painel administrativo (demo).
   Light theme · SVG inline · dados demonstrativos. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Admin</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero compacto ---------- */
  const hero = [
    '<section class="page-hero admin-login-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Painel administrativo</p>',
    '    <h1>Acesso administrativo</h1>',
    '    <p class="page-hero-lead">Gestão de agenda, consultas, profissionais e métricas da clínica.</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Card de login ---------- */
  const shieldIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';

  const loginCard = [
    '<section class="section admin-login-section" id="conteudo">',
    '  <div class="admin-login-wrap">',
    '    <div class="card admin-login-card">',
    '      <div class="admin-login-card-head">',
    '        <span class="admin-login-icon" aria-hidden="true">' + shieldIcon + '</span>',
    '        <h2>Entrar no painel</h2>',
    '        <p class="text-muted">Acesso restrito à equipe administrativa da VivaMais.</p>',
    '      </div>',
    '      <form class="admin-login-form" id="admin-login-form" novalidate>',
    '        <div class="field">',
    '          <label class="label" for="admin-email">E-mail</label>',
    '          <input class="input" id="admin-email" name="email" type="email" autocomplete="username" placeholder="admin@vivamais.demo" required aria-required="true" aria-describedby="err-admin-email">',
    '          <p class="field-error" id="err-admin-email" role="alert" hidden>Informe um e-mail para continuar.</p>',
    '        </div>',
    '        <div class="field">',
    '          <label class="label" for="admin-pass">Senha</label>',
    '          <input class="input" id="admin-pass" name="password" type="password" autocomplete="current-password" placeholder="Sua senha" required aria-required="true" aria-describedby="err-admin-pass">',
    '          <p class="field-error" id="err-admin-pass" role="alert" hidden>Informe sua senha para continuar.</p>',
    '        </div>',
    '        <button type="submit" class="btn btn-primary btn-block" id="btn-admin-login">Entrar no painel ' + icons.arrowRight + '</button>',
    '      </form>',
    '      <div class="admin-login-demo-note">',
    '        <span class="badge badge-demo">' + icons.shield + ' Ambiente demonstrativo</span>',
    '        <p class="text-muted">Use qualquer e-mail e senha para entrar. Nenhum dado real é armazenado ou enviado a servidores.</p>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, loginCard].join('\n\n');

  return T.renderLayout('Admin', 'Acesso ao painel administrativo da VivaMais. Ambiente demonstrativo com dados fictícios.', content, {
    activeNav: 'home',
    root: '',
    noindex: true,
    extraCss: ['styles/admin.css'],
    extraScripts: ['scripts/admin-login.js']
  });
}

module.exports = { renderPage: renderPage };
