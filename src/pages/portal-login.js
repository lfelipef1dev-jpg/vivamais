/* VivaMais — portal-login.js
   Página de login da Área do Paciente (demo).
   Light theme · SVG inline · dados demonstrativos. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Área do paciente</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero compacto ---------- */
  const hero = [
    '<section class="page-hero portal-login-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Portal do paciente</p>',
    '    <h1>Área do paciente</h1>',
    '    <p class="page-hero-lead">Acesse suas consultas, documentos e exames em um só lugar.</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Card de login ---------- */
  const loginCard = [
    '<section class="section portal-login-section" id="conteudo">',
    '  <div class="portal-login-wrap">',
    '    <div class="card portal-login-card">',
    '      <div class="portal-login-card-head">',
    '        <span class="portal-login-icon" aria-hidden="true">' + icons.user + '</span>',
    '        <h2>Entrar na sua conta</h2>',
    '        <p class="text-muted">Acesse o painel do paciente para acompanhar seus atendimentos.</p>',
    '      </div>',
    '      <form class="portal-login-form" id="portal-login-form" novalidate>',
    '        <div class="field">',
    '          <label class="label" for="login-id">E-mail ou CPF</label>',
    '          <input class="input" id="login-id" name="loginId" type="text" autocomplete="username" placeholder="voce@exemplo.com" required aria-required="true" aria-describedby="err-login-id">',
    '          <p class="field-error" id="err-login-id" role="alert" hidden>Informe seu e-mail ou CPF para continuar.</p>',
    '        </div>',
    '        <div class="field">',
    '          <label class="label" for="login-pass">Senha</label>',
    '          <input class="input" id="login-pass" name="password" type="password" autocomplete="current-password" placeholder="Sua senha" required aria-required="true" aria-describedby="err-login-pass">',
    '          <p class="field-error" id="err-login-pass" role="alert" hidden>Informe sua senha para continuar.</p>',
    '        </div>',
    '        <button type="submit" class="btn btn-primary btn-block" id="btn-login">Entrar ' + icons.arrowRight + '</button>',
    '      </form>',
    '      <div class="portal-login-links">',
    '        <button type="button" class="link-btn" id="link-forgot" data-action="forgot">Esqueci minha senha</button>',
    '        <button type="button" class="link-btn" id="link-signup" data-action="signup">Não tem conta? Cadastre-se</button>',
    '      </div>',
    '      <div class="portal-login-demo-note">',
    '        <span class="badge badge-demo">' + icons.shield + ' Ambiente demonstrativo</span>',
    '        <p class="text-muted">Use qualquer e-mail e senha para entrar. Nenhum dado real é armazenado ou enviado.</p>',
    '      </div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, loginCard].join('\n\n');

  return T.renderLayout('Área do paciente', 'Acesse a área do paciente da VivaMais para consultar agendamentos, documentos e exames. Ambiente demonstrativo.', content, {
    activeNav: 'home',
    root: '',
    noindex: true,
    extraScripts: ['scripts/portal-login.js']
  });
}

module.exports = { renderPage: renderPage };
