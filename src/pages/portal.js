/* VivaMais — portal.js
   Dashboard do paciente (portal). Sidebar + conteúdo. Tabs: visão geral,
   consultas, documentos, exames, perfil. Light theme · SVG inline · demo. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  const doctors = T.loadData('doctors');
  const insurance = T.loadData('insurance');

  /* Mapa de médicos por id (para o JS resolver nomes) */
  const doctorMap = {};
  doctors.forEach(function (d) { doctorMap[d.id] = d; });

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Área do paciente</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Dados embutidos para o JS ---------- */
  const dataScript = [
    '<script id="portal-data" type="application/json">',
    JSON.stringify({
      doctors: doctors,
      doctorMap: doctorMap,
      insurance: insurance
    }),
    '</script>'
  ].join('\n');

  /* ---------- Ícone de mão acenando (sem emoji) ---------- */
  const waveIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 11V6a2 2 0 0 1 4 0v5"/><path d="M7 11a2 2 0 0 0-4 0v3a8 8 0 0 0 16 0v-3a2 2 0 0 0-4 0"/><path d="M11 11V4a2 2 0 0 1 4 0v7"/><path d="M15 11V6a2 2 0 0 1 4 0v7"/></svg>';

  /* ---------- Sidebar ---------- */
  const navItems = [
    { id: 'overview', label: 'Visão geral', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>' },
    { id: 'appointments', label: 'Consultas', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>' },
    { id: 'documents', label: 'Documentos', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>' },
    { id: 'exams', label: 'Exames', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2v6l-5 9a3 3 0 0 0 3 4h10a3 3 0 0 0 3-4l-5-9V2"/><path d="M7 16h10M9 2h6"/></svg>' },
    { id: 'profile', label: 'Perfil', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>' }
  ];

  const navHtml = navItems.map(function (n, i) {
    const active = i === 0;
    return [
      '<button type="button" class="portal-nav-link' + (active ? ' portal-nav-active' : '') + '" data-tab="' + n.id + '" role="tab" id="tab-' + n.id + '" aria-controls="panel-' + n.id + '" aria-selected="' + (active ? 'true' : 'false') + '"' + (active ? ' aria-current="page"' : '') + '>',
      '  <span class="portal-nav-icon" aria-hidden="true">' + n.icon + '</span>',
      '  <span class="portal-nav-text">' + T.escapeHtml(n.label) + '</span>',
      '</button>'
    ].join('\n');
  }).join('\n');

  const sidebar = [
    '<aside class="portal-sidebar" id="portal-sidebar" aria-label="Menu do paciente">',
    '  <div class="portal-sidebar-head">',
    '    <span class="portal-avatar" aria-hidden="true">A</span>',
    '    <div class="portal-sidebar-user">',
    '      <p class="portal-sidebar-greeting"><span>Olá, Ana</span> ' + waveIcon + '</p>',
    '      <p class="portal-sidebar-email text-muted">ana@demo.com</p>',
    '    </div>',
    '  </div>',
    '  <nav class="portal-nav" role="tablist" aria-label="Seções do portal">',
    '    ' + navHtml,
    '  </nav>',
    '  <div class="portal-sidebar-foot">',
    '    <button type="button" class="portal-nav-link portal-logout" id="btn-logout" data-action="logout">',
    '      <span class="portal-nav-icon" aria-hidden="true"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg></span>',
    '      <span class="portal-nav-text">Sair</span>',
    '    </button>',
    '  </div>',
    '</aside>'
  ].join('\n');

  /* ---------- Botão de menu mobile ---------- */
  const mobileToggle = [
    '<button type="button" class="portal-drawer-toggle" id="portal-drawer-toggle" aria-label="Abrir menu do paciente" aria-controls="portal-sidebar" aria-expanded="false">',
    '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    '  <span>Menu</span>',
    '</button>'
  ].join('\n');

  /* ---------- Painel: Visão geral ---------- */
  const overviewPanel = [
    '<section class="portal-panel" id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" data-panel="overview">',
    '  <div class="portal-panel-head">',
    '    <h2>Visão geral</h2>',
    '    <a class="btn btn-primary portal-cta" href="agendamento.html">' + icons.calendar + ' Agendar nova consulta</a>',
    '  </div>',
    '  <div class="portal-next-appointment card" id="next-appointment-card"></div>',
    '  <div class="portal-kpis grid-4" id="portal-kpis"></div>',
    '  <div class="portal-overview-cols">',
    '    <div class="portal-overview-col">',
    '      <div class="portal-subhead">',
    '        <h3>Próximos atendimentos</h3>',
    '      </div>',
    '      <div id="overview-upcoming"></div>',
    '    </div>',
    '    <div class="portal-overview-col">',
    '      <div class="portal-subhead">',
    '        <h3>Documentos recentes</h3>',
    '      </div>',
    '      <div id="overview-docs"></div>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Painel: Consultas ---------- */
  const appointmentsPanel = [
    '<section class="portal-panel" id="panel-appointments" role="tabpanel" aria-labelledby="tab-appointments" data-panel="appointments" hidden>',
    '  <div class="portal-panel-head">',
    '    <h2>Consultas</h2>',
    '    <a class="btn btn-primary" href="agendamento.html">' + icons.calendar + ' Agendar nova consulta</a>',
    '  </div>',
    '  <div id="appointments-content"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Painel: Documentos ---------- */
  const documentsPanel = [
    '<section class="portal-panel" id="panel-documents" role="tabpanel" aria-labelledby="tab-documents" data-panel="documents" hidden>',
    '  <div class="portal-panel-head">',
    '    <h2>Documentos</h2>',
    '  </div>',
    '  <div id="documents-content"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Painel: Exames ---------- */
  const examsPanel = [
    '<section class="portal-panel" id="panel-exams" role="tabpanel" aria-labelledby="tab-exams" data-panel="exams" hidden>',
    '  <div class="portal-panel-head">',
    '    <h2>Exames</h2>',
    '  </div>',
    '  <div id="exams-content"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Painel: Perfil ---------- */
  const profilePanel = [
    '<section class="portal-panel" id="panel-profile" role="tabpanel" aria-labelledby="tab-profile" data-panel="profile" hidden>',
    '  <div class="portal-panel-head">',
    '    <h2>Perfil</h2>',
    '    <span class="badge badge-demo">' + icons.shield + ' Dados demonstrativos</span>',
    '  </div>',
    '  <form class="portal-profile-form card" id="portal-profile-form" novalidate>',
    '    <div class="form-grid-2">',
    '      <div class="field">',
    '        <label class="label" for="p-name">Nome completo</label>',
    '        <input class="input" id="p-name" name="name" type="text" autocomplete="name">',
    '      </div>',
    '      <div class="field">',
    '        <label class="label" for="p-email">E-mail</label>',
    '        <input class="input" id="p-email" name="email" type="email" autocomplete="email">',
    '      </div>',
    '      <div class="field">',
    '        <label class="label" for="p-phone">Telefone</label>',
    '        <input class="input" id="p-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(00) 00000-0000">',
    '      </div>',
    '      <div class="field">',
    '        <label class="label" for="p-birth">Data de nascimento</label>',
    '        <input class="input" id="p-birth" name="birthDate" type="date">',
    '      </div>',
    '      <div class="field">',
    '        <label class="label" for="p-insurance">Convênio</label>',
    '        <select class="select" id="p-insurance" name="insurance"><option value="">Selecione...</option></select>',
    '      </div>',
    '    </div>',
    '    <div class="portal-prefs">',
    '      <h3 class="portal-prefs-title">Preferências</h3>',
    '      <label class="checkbox-row">',
    '        <input type="checkbox" id="pref-email" name="prefEmail">',
    '        <span class="checkbox-box" aria-hidden="true">' + icons.check + '</span>',
    '        <span class="checkbox-label">Receber lembretes por e-mail</span>',
    '      </label>',
    '      <label class="checkbox-row">',
    '        <input type="checkbox" id="pref-whatsapp" name="prefWhatsapp">',
    '        <span class="checkbox-box" aria-hidden="true">' + icons.check + '</span>',
    '        <span class="checkbox-label">Receber lembretes por WhatsApp</span>',
    '      </label>',
    '    </div>',
    '    <div class="portal-profile-actions">',
    '      <button type="submit" class="btn btn-primary" id="btn-save-profile">Salvar alterações</button>',
    '    </div>',
    '  </form>',
    '</section>'
  ].join('\n');

  /* ---------- Modal de documento ---------- */
  const docModal = [
    '<div class="modal-overlay" id="doc-modal" role="dialog" aria-modal="true" aria-labelledby="doc-modal-title">',
    '  <div class="modal portal-doc-modal">',
    '    <div class="modal-header">',
    '      <h3 id="doc-modal-title">Documento</h3>',
    '      <button type="button" class="modal-close" id="doc-modal-close" aria-label="Fechar documento">' + icons.close + '</button>',
    '    </div>',
    '    <div class="alert alert-error portal-doc-disclaimer" role="alert">',
    '      ' + icons.shield,
    '      <span>Documento demonstrativo — nenhum dado médico real é utilizado nesta aplicação.</span>',
    '    </div>',
    '    <div class="portal-doc-body" id="doc-modal-body"></div>',
    '  </div>',
    '</div>'
  ].join('\n');

  /* ---------- Overlay do drawer mobile ---------- */
  const drawerOverlay = '<div class="portal-drawer-overlay" id="portal-drawer-overlay" hidden></div>';

  /* ---------- Montagem ---------- */
  const layout = [
    '<section class="portal" id="conteudo">',
    '  <div class="container portal-container">',
    '    ' + mobileToggle,
    '    ' + drawerOverlay,
    '    ' + sidebar,
    '    <div class="portal-main" id="portal-main">',
    '      <div class="portal-demo-bar">',
    '        <span class="badge badge-demo">' + icons.shield + ' Ambiente demonstrativo — dados fictícios</span>',
    '      </div>',
    '      ' + overviewPanel,
    '      ' + appointmentsPanel,
    '      ' + documentsPanel,
    '      ' + examsPanel,
    '      ' + profilePanel,
    '    </div>',
    '  </div>',
    '</section>',
    docModal
  ].join('\n');

  const content = [breadcrumb, dataScript, layout].join('\n\n');

  return T.renderLayout('Área do paciente', 'Portal do paciente VivaMais: consultas, documentos, exames e perfil. Ambiente demonstrativo com dados fictícios.', content, {
    activeNav: 'home',
    root: '',
    noindex: true,
    extraScripts: ['scripts/portal.js']
  });
}

module.exports = { renderPage: renderPage };
