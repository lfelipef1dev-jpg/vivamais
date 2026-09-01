/* VivaMais — agendamento.js
   Wizard de agendamento em 5 etapas. Light theme. SVG inline. Dados demonstrativos.
   Params aceitos: ?specialty={slug} e ?doctor={slug} */

const T = require('../templates/templates');
const icons = T.icons;

function renderPage() {
  const specialties = T.loadData('specialties');
  const doctors = T.loadData('doctors');
  const insurance = T.loadData('insurance');

  /* ---------- Breadcrumb ---------- */
  const breadcrumb = [
    '<nav class="container breadcrumb" aria-label="Trilha de navegação">',
    '  <a href="index.html">Início</a>',
    '  <span class="breadcrumb-sep" aria-hidden="true">/</span>',
    '  <span class="breadcrumb-current" aria-current="page">Agendamento</span>',
    '</nav>'
  ].join('\n');

  /* ---------- Hero compacto ---------- */
  const hero = [
    '<section class="page-hero booking-hero">',
    '  <div class="container">',
    '    <p class="eyebrow">Agendamento online</p>',
    '    <h1>Agende sua consulta</h1>',
    '    <p class="page-hero-lead">Em poucos passos você escolhe a especialidade, o profissional, a data e o horário. Simples, rápido e humano.</p>',
    '    <span class="badge badge-demo booking-hero-badge">' + icons.shield + ' Ambiente demonstrativo — dados fictícios</span>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Dados embutidos para o JS ---------- */
  const dataScript = [
    '<script id="booking-data" type="application/json">',
    JSON.stringify({ specialties: specialties, doctors: doctors, insurance: insurance }),
    '</script>'
  ].join('\n');

  /* ---------- Progress indicator (5 steps) ---------- */
  const stepLabels = ['Especialidade', 'Profissional', 'Data', 'Horário', 'Seus dados'];
  const steps = stepLabels.map(function (label, i) {
    const n = i + 1;
    return [
      '<li class="wizard-step" data-step="' + n + '">',
      '  <span class="wizard-step-num" aria-hidden="true">' + n + '</span>',
      '  <span class="wizard-step-label">' + T.escapeHtml(label) + '</span>',
      '</li>'
    ].join('\n');
  }).join('\n');

  const progress = [
    '<div class="wizard-progress" role="list" aria-label="Progresso do agendamento">',
    '  <ol class="wizard-steps">' + steps + '</ol>',
    '</div>'
  ].join('\n');

  /* ---------- Etapa 1 — Especialidade ---------- */
  const step1 = [
    '<section class="wizard-panel" id="panel-1" data-panel="1" aria-labelledby="panel-1-title" hidden>',
    '  <div class="wizard-panel-head">',
    '    <h2 id="panel-1-title" class="wizard-panel-title">Escolha a especialidade</h2>',
    '    <p class="wizard-panel-sub">Selecione a área de cuidado que você procura.</p>',
    '  </div>',
    '  <div class="wizard-select-grid" id="specialty-grid" role="radiogroup" aria-label="Especialidades disponíveis"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Etapa 2 — Profissional ---------- */
  const step2 = [
    '<section class="wizard-panel" id="panel-2" data-panel="2" aria-labelledby="panel-2-title" hidden>',
    '  <div class="wizard-panel-head">',
    '    <h2 id="panel-2-title" class="wizard-panel-title">Selecione o profissional</h2>',
    '    <p class="wizard-panel-sub" id="doctor-panel-sub">Veja os profissionais disponíveis para a especialidade escolhida.</p>',
    '  </div>',
    '  <div class="wizard-doctor-grid" id="doctor-grid" role="radiogroup" aria-label="Profissionais disponíveis"></div>',
    '  <div class="empty-state" id="doctor-empty" hidden>',
    '    ' + icons.user,
    '    <h3>Nenhum profissional disponível</h3>',
    '    <p>Não há profissionais cadastrados para esta especialidade no momento.</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Etapa 3 — Data ---------- */
  const step3 = [
    '<section class="wizard-panel" id="panel-3" data-panel="3" aria-labelledby="panel-3-title" hidden>',
    '  <div class="wizard-panel-head">',
    '    <h2 id="panel-3-title" class="wizard-panel-title">Escolha a data</h2>',
    '    <p class="wizard-panel-sub">Selecione um dia útil disponível no calendário.</p>',
    '  </div>',
    '  <div class="wizard-calendar-wrap">',
    '    <div class="wizard-calendar-head">',
    '      <button type="button" class="wizard-cal-nav" id="cal-prev" aria-label="Mês anterior">' + icons.chevronDown.replace('m6 9 6 6 6-6', 'M15 18l-6-6 6-6') + '</button>',
    '      <span class="wizard-cal-title" id="cal-title" aria-live="polite"></span>',
    '      <button type="button" class="wizard-cal-nav" id="cal-next" aria-label="Próximo mês">' + icons.chevronDown + '</button>',
    '    </div>',
    '    <div class="wizard-calendar" id="calendar" role="grid" aria-label="Calendário de datas disponíveis"></div>',
    '    <p class="wizard-cal-note text-muted">Atendemos de segunda a sexta. Datas em cinza não estão disponíveis.</p>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Etapa 4 — Horário ---------- */
  const step4 = [
    '<section class="wizard-panel" id="panel-4" data-panel="4" aria-labelledby="panel-4-title" hidden>',
    '  <div class="wizard-panel-head">',
    '    <h2 id="panel-4-title" class="wizard-panel-title">Escolha o horário</h2>',
    '    <p class="wizard-panel-sub">Selecione um dos horários disponíveis para o dia escolhido.</p>',
    '  </div>',
    '  <div class="wizard-slots" id="time-slots" role="radiogroup" aria-label="Horários disponíveis"></div>',
    '</section>'
  ].join('\n');

  /* ---------- Etapa 5 — Dados ---------- */
  const step5 = [
    '<section class="wizard-panel" id="panel-5" data-panel="5" aria-labelledby="panel-5-title" hidden>',
    '  <div class="wizard-panel-head">',
    '    <h2 id="panel-5-title" class="wizard-panel-title">Seus dados</h2>',
    '    <p class="wizard-panel-sub">Preencha seus dados para concluir o agendamento.</p>',
    '  </div>',
    '  <form class="wizard-form" id="booking-form" novalidate>',
    '    <div class="form-grid-2">',
    '      <div class="field">',
    '        <label class="label" for="f-name">Nome completo <span aria-hidden="true">*</span></label>',
    '        <input class="input" id="f-name" name="name" type="text" autocomplete="name" required aria-required="true" aria-describedby="err-name">',
    '        <p class="field-error" id="err-name" role="alert" hidden>Informe seu nome completo.</p>',
    '      </div>',
    '      <div class="field">',
    '        <label class="label" for="f-phone">Telefone <span aria-hidden="true">*</span></label>',
    '        <input class="input" id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="(00) 00000-0000" required aria-required="true" aria-describedby="err-phone">',
    '        <p class="field-error" id="err-phone" role="alert" hidden>Informe um telefone válido com DDD.</p>',
    '      </div>',
    '      <div class="field">',
    '        <label class="label" for="f-email">E-mail <span aria-hidden="true">*</span></label>',
    '        <input class="input" id="f-email" name="email" type="email" autocomplete="email" required aria-required="true" aria-describedby="err-email">',
    '        <p class="field-error" id="err-email" role="alert" hidden>Informe um e-mail válido.</p>',
    '      </div>',
    '      <div class="field">',
    '        <label class="label" for="f-insurance">Convênio <span aria-hidden="true">*</span></label>',
    '        <select class="select" id="f-insurance" name="insurance" required aria-required="true" aria-describedby="err-insurance">',
    '          <option value="">Selecione...</option>',
    '        </select>',
    '        <p class="field-error" id="err-insurance" role="alert" hidden>Selecione um convênio.</p>',
    '      </div>',
    '    </div>',
    '    <div class="field wizard-lgpd">',
    '      <label class="checkbox-row">',
    '        <input type="checkbox" id="f-lgpd" name="lgpd" required aria-required="true" aria-describedby="err-lgpd">',
    '        <span class="checkbox-box" aria-hidden="true">' + icons.check + '</span>',
    '        <span class="checkbox-label">Concordo com o uso dos meus dados para agendamento, conforme a <a href="privacidade.html">Política de Privacidade</a>.</span>',
    '      </label>',
    '      <p class="field-error" id="err-lgpd" role="alert" hidden>É necessário concordar com o uso dos dados para continuar.</p>',
    '    </div>',
    '    <p class="wizard-form-note text-muted">Campos com <span aria-hidden="true">*</span> são obrigatórios. Dados fictícios — nenhuma informação real é enviada.</p>',
    '  </form>',
    '</section>'
  ].join('\n');

  /* ---------- Navegação do wizard ---------- */
  const nav = [
    '<div class="wizard-nav">',
    '  <button type="button" class="btn btn-ghost" id="btn-prev" disabled aria-label="Voltar para a etapa anterior">Voltar</button>',
    '  <span class="wizard-nav-info" id="wizard-info" aria-live="polite">Etapa 1 de 5</span>',
    '  <button type="button" class="btn btn-primary" id="btn-next" disabled aria-label="Avançar para a próxima etapa">Continuar ' + icons.arrowRight + '</button>',
    '</div>'
  ].join('\n');

  /* ---------- Tela de confirmação ---------- */
  const confirmation = [
    '<section class="wizard-confirmation" id="confirmation" hidden aria-live="polite">',
    '  <div class="confirmation-inner">',
    '    <div class="confirmation-icon" aria-hidden="true">',
    '      <svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="26" cy="26" r="24" stroke="rgba(13,148,136,0.2)" fill="rgba(13,148,136,0.08)"/><path d="M16 27l7 7 13-14" stroke="#0D9488"/></svg>',
    '    </div>',
    '    <h2 class="confirmation-title">Solicitação registrada!</h2>',
    '    <p class="confirmation-sub">Seu pedido de agendamento foi salvo (demonstração). Confira os detalhes abaixo.</p>',
    '    <div class="confirmation-card card" id="confirmation-card"></div>',
    '    <div class="confirmation-actions">',
    '      <button type="button" class="btn btn-primary" id="btn-ics">' + icons.calendar + ' Adicionar ao calendário</button>',
    '      <button type="button" class="btn btn-ghost" id="btn-email">' + icons.mail + ' Receber confirmação</button>',
    '      <a class="btn btn-ghost" href="portal.html">' + icons.user + ' Ver meus agendamentos</a>',
    '      <button type="button" class="btn btn-ghost" id="btn-new">Novo agendamento</button>',
    '    </div>',
    '  </div>',
    '</section>'
  ].join('\n');

  /* ---------- Montagem ---------- */
  const wizard = [
    '<section class="section booking-section" id="conteudo-wizard">',
    '  <div class="container">',
    '    ' + progress,
    '    <div class="wizard" id="wizard">',
    '      ' + step1,
    '      ' + step2,
    '      ' + step3,
    '      ' + step4,
    '      ' + step5,
    '    </div>',
    '    ' + nav,
    '    ' + confirmation,
    '  </div>',
    '</section>'
  ].join('\n');

  const content = [breadcrumb, hero, dataScript, wizard].join('\n\n');

  return T.renderLayout('Agendamento', 'Agende sua consulta na VivaMais em 5 passos: escolha especialidade, profissional, data, horário e preencha seus dados. Ambiente demonstrativo.', content, {
    activeNav: 'home',
    root: '',
    canonical: 'agendamento',
    extraScripts: ['scripts/booking.js'],
    jsonLd: [
      T.buildBreadcrumbList([
        { name: 'Início', slug: 'index' },
        { name: 'Agendamento', slug: 'agendamento' }
      ])
    ]
  });
}

module.exports = { renderPage: renderPage };
