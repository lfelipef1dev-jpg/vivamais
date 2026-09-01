/* VivaMais — admin.js
   Painel administrativo (demo). Sidebar + conteúdo. Tabs: dashboard,
   agenda, consultas, profissionais, especialidades, convênios, pacientes,
   analytics. Light theme · SVG inline · dados demonstrativos. */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  const doctors = T.loadData('doctors');
  const specialties = T.loadData('specialties');
  const insurance = T.loadData('insurance');
  const appointments = T.loadData('appointments');
  const patients = T.loadData('patients');
  const analytics = T.loadData('analytics');

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Admin</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Dados embutidos para o JS ---------- */
  const dataScript = [
    '<script id="admin-data" type="application/json">',
    JSON.stringify({
      doctors: doctors,
      specialties: specialties,
      insurance: insurance,
      appointments: appointments,
      patients: patients,
      analytics: analytics
    }),
    '</script>'
  ].join('\n');

  /* ---------- Ícones de navegação ---------- */
  const navIcons = {
    dashboard: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>',
    agenda: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    consultas: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    profissionais: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    especialidades: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    convenios: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    pacientes: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    analytics: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>'
  };

  /* ---------- Sidebar ---------- */
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'consultas', label: 'Consultas' },
    { id: 'profissionais', label: 'Profissionais' },
    { id: 'especialidades', label: 'Especialidades' },
    { id: 'convenios', label: 'Convênios' },
    { id: 'pacientes', label: 'Pacientes' },
    { id: 'analytics', label: 'Analytics' }
  ];

  const navHtml = navItems.map(function (n, i) {
    const active = i === 0;
    return [
      '<button type="button" class="admin-nav-link' + (active ? ' admin-nav-active' : '') + '" data-tab="' + n.id + '" role="tab" id="tab-' + n.id + '" aria-controls="panel-' + n.id + '" aria-selected="' + (active ? 'true' : 'false') + '"' + (active ? ' aria-current="page"' : '') + '>',
      '  <span class="admin-nav-icon" aria-hidden="true">' + navIcons[n.id] + '</span>',
      '  <span class="admin-nav-text">' + T.escapeHtml(n.label) + '</span>',
      '</button>'
    ].join('\n');
  }).join('\n');

  const logoutIcon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>';

  const sidebar = [
    '<aside class="admin-sidebar" id="admin-sidebar" aria-label="Menu administrativo">',
    '  <div class="admin-sidebar-head">',
    '    <span class="admin-brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4 9 14l-2-4"/><path d="M18 12h4"/></svg></span>',
    '    <div class="admin-brand-text">',
    '      <span class="admin-brand-name">VivaMais <span class="admin-brand-admin">Admin</span></span>',
    '      <span class="admin-brand-sub text-muted">Painel administrativo</span>',
    '    </div>',
    '  </div>',
    '  <nav class="admin-nav" role="tablist" aria-label="Seções do painel">',
    '    ' + navHtml,
    '  </nav>',
    '  <div class="admin-sidebar-foot">',
    '    <button type="button" class="admin-nav-link admin-logout" id="btn-admin-logout" data-action="logout">',
    '      <span class="admin-nav-icon" aria-hidden="true">' + logoutIcon + '</span>',
    '      <span class="admin-nav-text">Sair</span>',
    '    </button>',
    '  </div>',
    '</aside>'
  ].join('\n');

  /* ---------- Botão de menu mobile ---------- */
  const mobileToggle = [
    '<button type="button" class="admin-drawer-toggle" id="admin-drawer-toggle" aria-label="Abrir menu administrativo" aria-controls="admin-sidebar" aria-expanded="false">',
    '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    '  <span>Menu</span>',
    '</button>'
  ].join('\n');

  const drawerOverlay = '<div class="admin-drawer-overlay" id="admin-drawer-overlay" hidden></div>';

  /* ---------- Painel: Dashboard ---------- */
  const dashboardPanel = [
    '<section class="admin-panel" id="panel-dashboard" role="tabpanel" aria-labelledby="tab-dashboard" data-panel="dashboard">',
    '  <div class="admin-panel-head">',
    '    <h2>Dashboard</h2>',
    '    <span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span>',
    '  </div>',
    '  <div class="admin-kpis grid-5" id="admin-kpis"></div>',
    '  <div class="admin-charts">',
    '    <div class="card admin-chart-card">',
    '      <div class="admin-chart-head"><h3>Agendamentos — últimos 30 dias</h3><span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span></div>',
    '      <div class="admin-chart-line" id="chart-line-30" role="img" aria-label="Gráfico de linha de agendamentos dos últimos 30 dias"></div>',
    '    </div>',
    '    <div class="card admin-chart-card">',
    '      <div class="admin-chart-head"><h3>Consultas por especialidade</h3><span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span></div>',
    '      <div class="admin-chart-bars" id="chart-bars-spec" role="img" aria-label="Gráfico de barras de consultas por especialidade"></div>',
    '    </div>',
    '  </div>',
    '  <div class="admin-subhead"><h3>Próximos atendimentos</h3></div>',
    '  <div id="dashboard-upcoming"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Painel: Agenda ---------- */
  const agendaPanel = [
    '<section class="admin-panel" id="panel-agenda" role="tabpanel" aria-labelledby="tab-agenda" data-panel="agenda" hidden>',
    '  <div class="admin-panel-head">',
    '    <h2>Gestão de agenda</h2>',
    '    <span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span>',
    '  </div>',
    '  <div class="admin-agenda-controls">',
    '    <div class="tabs admin-agenda-tabs" id="agenda-tabs" role="tablist" aria-label="Visualização da agenda">',
    '      <button type="button" class="tab tab-active" data-view="day" role="tab" aria-selected="true">Dia</button>',
    '      <button type="button" class="tab" data-view="week" role="tab" aria-selected="false">Semana</button>',
    '      <button type="button" class="tab" data-view="month" role="tab" aria-selected="false">Mês</button>',
    '    </div>',
    '    <div class="admin-agenda-nav">',
    '      <button type="button" class="btn btn-ghost admin-agenda-nav-btn" id="agenda-prev" aria-label="Período anterior">' + '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>' + '</button>',
    '      <span class="admin-agenda-period" id="agenda-period">—</span>',
    '      <button type="button" class="btn btn-ghost admin-agenda-nav-btn" id="agenda-next" aria-label="Próximo período">' + '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>' + '</button>',
    '    </div>',
    '  </div>',
    '  <div class="admin-agenda-legend" aria-hidden="true">',
    '    <span class="admin-legend-item"><span class="admin-legend-dot status-confirmed"></span> Confirmado</span>',
    '    <span class="admin-legend-item"><span class="admin-legend-dot status-pending"></span> Aguardando</span>',
    '    <span class="admin-legend-item"><span class="admin-legend-dot status-cancelled"></span> Cancelado</span>',
    '    <span class="admin-legend-item"><span class="admin-legend-dot status-completed"></span> Concluído</span>',
    '    <span class="admin-legend-item"><span class="admin-legend-dot status-available"></span> Disponível</span>',
    '  </div>',
    '  <div id="agenda-content"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Painel: Consultas ---------- */
  const consultasPanel = [
    '<section class="admin-panel" id="panel-consultas" role="tabpanel" aria-labelledby="tab-consultas" data-panel="consultas" hidden>',
    '  <div class="admin-panel-head">',
    '    <h2>Consultas</h2>',
    '    <span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span>',
    '  </div>',
    '  <div class="admin-filters" id="consultas-filters">',
    '    <div class="admin-filter-search">',
    '      <span class="admin-search-icon" aria-hidden="true">' + icons.search + '</span>',
    '      <input class="input admin-search-input" id="consultas-search" type="search" placeholder="Buscar por paciente..." aria-label="Buscar por paciente">',
    '    </div>',
    '    <label class="admin-filter-field"><span class="admin-filter-label">Status</span><select class="select" id="consultas-filter-status"><option value="">Todos</option><option value="confirmed">Confirmado</option><option value="pending">Aguardando</option><option value="completed">Concluído</option><option value="cancelled">Cancelado</option></select></label>',
    '    <label class="admin-filter-field"><span class="admin-filter-label">Médico</span><select class="select" id="consultas-filter-doctor"><option value="">Todos</option></select></label>',
    '    <label class="admin-filter-field"><span class="admin-filter-label">Data</span><input class="input" id="consultas-filter-date" type="date"></label>',
    '  </div>',
    '  <div id="consultas-table"></div>',
    '  <div class="admin-pagination" id="consultas-pagination"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Painel: Profissionais ---------- */
  const profissionaisPanel = [
    '<section class="admin-panel" id="panel-profissionais" role="tabpanel" aria-labelledby="tab-profissionais" data-panel="profissionais" hidden>',
    '  <div class="admin-panel-head">',
    '    <h2>Profissionais</h2>',
    '    <div class="admin-panel-actions">',
    '      <span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span>',
    '      <button type="button" class="btn btn-primary" id="btn-add-doctor">' + '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' + ' Adicionar profissional</button>',
    '    </div>',
    '  </div>',
    '  <div id="profissionais-table"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Painel: Especialidades ---------- */
  const especialidadesPanel = [
    '<section class="admin-panel" id="panel-especialidades" role="tabpanel" aria-labelledby="tab-especialidades" data-panel="especialidades" hidden>',
    '  <div class="admin-panel-head">',
    '    <h2>Especialidades</h2>',
    '    <div class="admin-panel-actions">',
    '      <span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span>',
    '      <button type="button" class="btn btn-primary" id="btn-add-specialty">' + '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' + ' Adicionar especialidade</button>',
    '    </div>',
    '  </div>',
    '  <div id="especialidades-table"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Painel: Convênios ---------- */
  const conveniosPanel = [
    '<section class="admin-panel" id="panel-convenios" role="tabpanel" aria-labelledby="tab-convenios" data-panel="convenios" hidden>',
    '  <div class="admin-panel-head">',
    '    <h2>Convênios</h2>',
    '    <div class="admin-panel-actions">',
    '      <span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span>',
    '      <button type="button" class="btn btn-primary" id="btn-add-insurance">' + '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>' + ' Adicionar convênio</button>',
    '    </div>',
    '  </div>',
    '  <div class="admin-filters" id="convenios-filters">',
    '    <div class="admin-filter-search">',
    '      <span class="admin-search-icon" aria-hidden="true">' + icons.search + '</span>',
    '      <input class="input admin-search-input" id="convenios-search" type="search" placeholder="Buscar convênio..." aria-label="Buscar convênio">',
    '    </div>',
    '    <label class="admin-filter-field"><span class="admin-filter-label">Status</span><select class="select" id="convenios-filter-status"><option value="">Todos</option><option value="active">Ativo</option><option value="inactive">Inativo</option></select></label>',
    '  </div>',
    '  <div id="convenios-table"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Painel: Pacientes ---------- */
  const pacientesPanel = [
    '<section class="admin-panel" id="panel-pacientes" role="tabpanel" aria-labelledby="tab-pacientes" data-panel="pacientes" hidden>',
    '  <div class="admin-panel-head">',
    '    <h2>Pacientes</h2>',
    '    <span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span>',
    '  </div>',
    '  <div class="admin-filters" id="pacientes-filters">',
    '    <div class="admin-filter-search">',
    '      <span class="admin-search-icon" aria-hidden="true">' + icons.search + '</span>',
    '      <input class="input admin-search-input" id="pacientes-search" type="search" placeholder="Buscar por nome..." aria-label="Buscar por nome">',
    '    </div>',
    '  </div>',
    '  <div id="pacientes-table"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Painel: Analytics ---------- */
  const analyticsPanel = [
    '<section class="admin-panel" id="panel-analytics" role="tabpanel" aria-labelledby="tab-analytics" data-panel="analytics" hidden>',
    '  <div class="admin-panel-head">',
    '    <h2>Analytics</h2>',
    '    <span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span>',
    '  </div>',
    '  <div class="admin-kpis grid-4" id="analytics-kpis"></div>',
    '  <div class="alert alert-error admin-analytics-disclaimer" role="alert">',
    '    ' + icons.shield,
    '    <span>Dados demonstrativos — não representam resultados reais da clínica.</span>',
    '  </div>',
    '  <div class="admin-subhead"><h3>Funil de conversão</h3></div>',
    '  <div class="card admin-funnel-card">',
    '    <span class="badge badge-demo admin-funnel-badge">' + icons.shield + ' Dataset demonstrativo</span>',
    '    <div class="admin-funnel" id="analytics-funnel" role="img" aria-label="Funil de conversão de agendamentos"></div>',
    '  </div>',
    '  <div class="admin-charts">',
    '    <div class="card admin-chart-card">',
    '      <div class="admin-chart-head"><h3>Origem dos agendamentos</h3><span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span></div>',
    '      <div class="admin-chart-bars" id="chart-bars-origin" role="img" aria-label="Gráfico de barras de origem dos agendamentos"></div>',
    '    </div>',
    '    <div class="card admin-chart-card">',
    '      <div class="admin-chart-head"><h3>Consultas por especialidade</h3><span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span></div>',
    '      <div class="admin-chart-bars" id="chart-bars-spec-2" role="img" aria-label="Gráfico de barras de consultas por especialidade"></div>',
    '    </div>',
    '  </div>',
    '  <div class="card admin-chart-card admin-chart-full">',
    '    <div class="admin-chart-head"><h3>Visitas — últimos 30 dias</h3><span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo</span></div>',
    '    <div class="admin-chart-line" id="chart-line-visits" role="img" aria-label="Gráfico de linha de visitas dos últimos 30 dias"></div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Modal genérico ---------- */
  const modal = [
    '<div class="modal-overlay" id="admin-modal" role="dialog" aria-modal="true" aria-labelledby="admin-modal-title">',
    '  <div class="modal admin-modal">',
    '    <div class="modal-header">',
    '      <h3 id="admin-modal-title">—</h3>',
    '      <button type="button" class="modal-close" id="admin-modal-close" aria-label="Fechar">' + icons.close + '</button>',
    '    </div>',
    '    <div class="admin-modal-body" id="admin-modal-body"></div>',
    '  </div>',
    '</div>'
  ].join('\n');

  /* ---------- Montagem ---------- */
  const layout = [
    '<section class="admin" id="conteudo">',
    '  <div class="container admin-container">',
    '    ' + mobileToggle,
    '    ' + drawerOverlay,
    '    ' + sidebar,
    '    <div class="admin-main" id="admin-main">',
    '      <div class="admin-demo-bar">',
    '        <span class="badge badge-demo">' + icons.shield + ' Dataset demonstrativo — todos os dados são fictícios</span>',
    '      </div>',
    '      ' + dashboardPanel,
    '      ' + agendaPanel,
    '      ' + consultasPanel,
    '      ' + profissionaisPanel,
    '      ' + especialidadesPanel,
    '      ' + conveniosPanel,
    '      ' + pacientesPanel,
    '      ' + analyticsPanel,
    '    </div>',
    '  </div>',
    '</section>',
    modal
  ].join('\n');

  const content = [breadcrumb, dataScript, layout].join('\n\n');

  return T.renderLayout('Admin', 'Painel administrativo da VivaMais: agenda, consultas, profissionais, especialidades, convênios, pacientes e analytics. Ambiente demonstrativo com dados fictícios.', content, {
    activeNav: 'home',
    root: '',
    noindex: true,
    extraCss: ['styles/admin.css'],
    extraScripts: ['scripts/admin.js']
  });
}

module.exports = { renderPage: renderPage };
