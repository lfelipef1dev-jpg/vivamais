/* VivaMais — admin.js (script)
   Lógica do painel administrativo (demo).
   Tabs, KPIs, gráficos CSS-only, agenda, tabelas, CRUD (localStorage),
   modais, paginação, toasts, logout. Tudo client-side. */

(function (global) {
  'use strict';

  var VM = global.VivaMais || (global.VivaMais = {});
  var $ = VM.$;
  var $$ = VM.$$;
  var toast = VM.toast;
  var formatDate = VM.formatDate;
  var formatDateShort = VM.formatDateShort;

  var SESSION_KEY = 'vivamais_admin_session';
  var LS_DOCTORS = 'vivamais_admin_doctors';
  var LS_SPECIALTIES = 'vivamais_admin_specialties';
  var LS_INSURANCE = 'vivamais_admin_insurance';

  /* ---------- Dados embutidos ---------- */
  function loadData() {
    var node = document.getElementById('admin-data');
    if (!node) return {};
    try { return JSON.parse(node.textContent); }
    catch (e) { return {}; }
  }
  var DATA = {};
  var doctorMap = {};
  var specialtyMap = {};
  var insuranceMap = {};

  /* ---------- Storage helpers (CRUD demo) ---------- */
  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key)) || null; }
    catch (e) { return null; }
  }
  function lsSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { /* ignore */ }
  }

  /* ---------- Merge JSON + localStorage ---------- */
  function mergedDoctors() {
    var extra = lsGet(LS_DOCTORS) || [];
    var ids = {};
    var merged = DATA.doctors.slice();
    merged.forEach(function (d) { ids[d.id] = true; });
    extra.forEach(function (d) {
      if (!ids[d.id]) { merged.push(d); ids[d.id] = true; }
      else {
        var idx = -1;
        merged.forEach(function (m, i) { if (m.id === d.id) idx = i; });
        if (idx >= 0) merged[idx] = Object.assign({}, merged[idx], d);
      }
    });
    return merged;
  }
  function mergedSpecialties() {
    var extra = lsGet(LS_SPECIALTIES) || [];
    var ids = {};
    var merged = DATA.specialties.slice();
    merged.forEach(function (s) { ids[s.id] = true; });
    extra.forEach(function (s) {
      if (!ids[s.id]) { merged.push(s); ids[s.id] = true; }
      else {
        var idx = -1;
        merged.forEach(function (m, i) { if (m.id === s.id) idx = i; });
        if (idx >= 0) merged[idx] = Object.assign({}, merged[idx], s);
      }
    });
    return merged;
  }
  function mergedInsurance() {
    var extra = lsGet(LS_INSURANCE) || [];
    var ids = {};
    var merged = DATA.insurance.slice();
    merged.forEach(function (i) { ids[i.id] = true; });
    extra.forEach(function (i) {
      if (!ids[i.id]) { merged.push(i); ids[i.id] = true; }
      else {
        var idx = -1;
        merged.forEach(function (m, j) { if (m.id === i.id) idx = j; });
        if (idx >= 0) merged[idx] = Object.assign({}, merged[idx], i);
      }
    });
    return merged;
  }

  /* ---------- Sessão ---------- */
  function checkSession() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch (e) { s = null; }
    if (!s) {
      global.location.href = 'admin-login.html';
      return null;
    }
    return s;
  }
  function logout() {
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    toast('Sessão encerrada.');
    setTimeout(function () { global.location.href = 'admin-login.html'; }, 600);
  }

  /* ---------- Helpers de escape ---------- */
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- Status helpers ---------- */
  var STATUS_LABELS = {
    confirmed: 'Confirmado',
    pending: 'Aguardando',
    cancelled: 'Cancelado',
    completed: 'Concluído',
    available: 'Disponível'
  };
  function statusBadge(status) {
    return '<span class="badge badge-status ' + esc(status) + '">' + esc(STATUS_LABELS[status] || status) + '</span>';
  }

  /* ---------- Empty state ---------- */
  function emptyState(msg) {
    return [
      '<div class="empty-state">',
      '  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 21l-4.3-4.3"/><circle cx="11" cy="11" r="8"/></svg>',
      '  <h3>Nada por aqui</h3>',
      '  <p>' + esc(msg || 'Nenhum registro encontrado.') + '</p>',
      '</div>'
    ].join('');
  }

  /* =========================================================
     NAVEGAÇÃO (tabs)
     ========================================================= */
  function initTabs() {
    var links = $$('.admin-nav-link[data-tab]');
    var panels = $$('.admin-panel');
    links.forEach(function (link) {
      link.addEventListener('click', function () {
        var tab = link.getAttribute('data-tab');
        links.forEach(function (l) {
          var active = l === link;
          l.classList.toggle('admin-nav-active', active);
          l.setAttribute('aria-selected', active ? 'true' : 'false');
          if (active) l.setAttribute('aria-current', 'page');
          else l.removeAttribute('aria-current');
        });
        panels.forEach(function (p) {
          p.hidden = p.getAttribute('data-panel') !== tab;
        });
        closeDrawer();
        renderTab(tab);
      });
    });
  }

  function renderTab(tab) {
    switch (tab) {
      case 'dashboard': renderDashboard(); break;
      case 'agenda': renderAgenda(); break;
      case 'consultas': renderConsultas(); break;
      case 'profissionais': renderProfissionais(); break;
      case 'especialidades': renderEspecialidades(); break;
      case 'convenios': renderConvenios(); break;
      case 'pacientes': renderPacientes(); break;
      case 'analytics': renderAnalytics(); break;
    }
  }

  /* =========================================================
     DRAWER (mobile)
     ========================================================= */
  function initDrawer() {
    var toggle = $('#admin-drawer-toggle');
    var sidebar = $('#admin-sidebar');
    var overlay = $('#admin-drawer-overlay');
    if (!toggle || !sidebar || !overlay) return;
    function open() {
      sidebar.classList.add('open');
      overlay.hidden = false;
      toggle.setAttribute('aria-expanded', 'true');
    }
    function close() { closeDrawer(); }
    toggle.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) closeDrawer();
      else open();
    });
    overlay.addEventListener('click', close);
  }
  function closeDrawer() {
    var sidebar = $('#admin-sidebar');
    var overlay = $('#admin-drawer-overlay');
    var toggle = $('#admin-drawer-toggle');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.hidden = true;
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  /* =========================================================
     DASHBOARD
     ========================================================= */
  function renderDashboard() {
    var kpis = [
      { label: 'Consultas hoje', value: '24', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>', trend: '+12% vs ontem', trendUp: true },
      { label: 'Novos pacientes', value: '18', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>', trend: '+8% na semana', trendUp: true },
      { label: 'Taxa de ocupação', value: '82%', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>', trend: '+5pp no mês', trendUp: true },
      { label: 'Cancelamentos', value: '3', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>', trend: '-2 vs ontem', trendUp: true },
      { label: 'Tempo médio até consulta', value: '2,4 dias', icon: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>', trend: '-0,3 dia', trendUp: true }
    ];
    var kpiHtml = kpis.map(function (k) {
      return [
        '<div class="card admin-kpi-card">',
        '  <div class="admin-kpi-top">',
        '    <span class="admin-kpi-icon" aria-hidden="true">' + k.icon + '</span>',
        '    <span class="admin-kpi-trend ' + (k.trendUp ? 'trend-up' : 'trend-down') + '">' + esc(k.trend) + '</span>',
        '  </div>',
        '  <p class="admin-kpi-value">' + esc(k.value) + '</p>',
        '  <p class="admin-kpi-label">' + esc(k.label) + '</p>',
        '</div>'
      ].join('');
    }).join('');
    var kpisEl = $('#admin-kpis');
    if (kpisEl) kpisEl.innerHTML = kpiHtml;

    /* Gráfico de linha — agendamentos 30 dias (usa visits series) */
    renderLineChart('chart-line-30', (DATA.analytics.visits && DATA.analytics.visits.series) || [], 'Agendamentos');

    /* Gráfico de barras — consultas por especialidade */
    renderBarsChart('chart-bars-spec', DATA.analytics.bySpecialty || {});

    /* Próximos atendimentos */
    var upcoming = (DATA.appointments || []).slice(0, 8);
    renderUpcomingTable('dashboard-upcoming', upcoming);
  }

  function renderUpcomingTable(targetId, rows) {
    var el = $('#' + targetId);
    if (!el) return;
    if (!rows.length) { el.innerHTML = emptyState('Nenhum atendimento próximo.'); return; }
    var head = '<tr><th>Paciente</th><th>Médico</th><th>Especialidade</th><th>Horário</th><th>Status</th></tr>';
    var body = rows.map(function (a) {
      var doc = doctorMap[a.doctorId];
      return [
        '<tr>',
        '<td>' + esc(a.patientName) + '</td>',
        '<td>' + esc(doc ? doc.name : '—') + '</td>',
        '<td>' + esc(specialtyName(a.specialty)) + '</td>',
        '<td>' + esc(formatDateShort(a.date)) + ' ' + esc(a.time) + '</td>',
        '<td>' + statusBadge(a.status) + '</td>',
        '</tr>'
      ].join('');
    }).join('');
    el.innerHTML = '<div class="table-wrap"><table class="table admin-table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
  }

  /* =========================================================
     GRÁFICOS CSS-ONLY
     ========================================================= */
  function renderLineChart(targetId, series, label) {
    var el = $('#' + targetId);
    if (!el) return;
    if (!series.length) { el.innerHTML = emptyState('Sem dados de série.'); return; }
    var max = 0;
    series.forEach(function (p) { if (p.value > max) max = p.value; });
    if (max <= 0) max = 1;
    var points = series.map(function (p, i) {
      var x = (i / (series.length - 1)) * 100;
      var y = 100 - (p.value / max) * 100;
      return x.toFixed(2) + ',' + y.toFixed(2);
    });
    var polyPoints = points.join(' ');
    var bars = series.map(function (p, i) {
      var x = (i / (series.length - 1)) * 100;
      var h = ((p.value / max) * 100).toFixed(2);
      return '<span class="admin-line-bar" style="left:' + x.toFixed(2) + '%;height:' + h + '%;" title="' + esc(label) + ': ' + p.value + '"></span>';
    }).join('');
    var areaPoints = '0,100 ' + polyPoints + ' 100,100';
    el.innerHTML = [
      '<div class="admin-line-chart" role="img" aria-label="' + esc(label) + ' — últimos ' + series.length + ' dias">',
      '  <svg class="admin-line-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">',
      '    <polygon class="admin-line-area" points="' + areaPoints + '"></polygon>',
      '    <polyline class="admin-line-stroke" points="' + polyPoints + '"></polyline>',
      '  </svg>',
      '  <div class="admin-line-bars" aria-hidden="true">' + bars + '</div>',
      '</div>',
      '<div class="admin-chart-foot"><span>' + esc(formatDateShort(series[0].date)) + '</span><span>' + esc(formatDateShort(series[series.length - 1].date)) + '</span></div>'
    ].join('');
  }

  function renderBarsChart(targetId, dataObj) {
    var el = $('#' + targetId);
    if (!el) return;
    var entries = Object.keys(dataObj).map(function (k) { return { key: k, value: dataObj[k] }; });
    if (!entries.length) { el.innerHTML = emptyState('Sem dados.'); return; }
    var max = 0;
    entries.forEach(function (e) { if (e.value > max) max = e.value; });
    if (max <= 0) max = 1;
    var bars = entries.map(function (e) {
      var h = ((e.value / max) * 100).toFixed(2);
      return [
        '<div class="admin-bar-item">',
        '  <div class="admin-bar-track"><span class="admin-bar-fill" style="height:' + h + '%;" title="' + esc(e.key) + ': ' + e.value + '"></span></div>',
        '  <span class="admin-bar-label">' + esc(specialtyName(e.key)) + '</span>',
        '  <span class="admin-bar-value">' + e.value + '</span>',
        '</div>'
      ].join('');
    }).join('');
    el.innerHTML = '<div class="admin-bars-chart">' + bars + '</div>';
  }

  /* =========================================================
     AGENDA
     ========================================================= */
  var agendaView = 'day';
  var agendaRef = new Date('2025-01-20T00:00:00');

  function initAgenda() {
    var tabs = $$('#agenda-tabs .tab');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        tabs.forEach(function (x) {
          var active = x === t;
          x.classList.toggle('tab-active', active);
          x.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        agendaView = t.getAttribute('data-view');
        renderAgenda();
      });
    });
    var prev = $('#agenda-prev');
    var next = $('#agenda-next');
    if (prev) prev.addEventListener('click', function () { shiftAgenda(-1); });
    if (next) next.addEventListener('click', function () { shiftAgenda(1); });
  }
  function shiftAgenda(dir) {
    if (agendaView === 'day') agendaRef.setDate(agendaRef.getDate() + dir);
    else if (agendaView === 'week') agendaRef.setDate(agendaRef.getDate() + dir * 7);
    else if (agendaView === 'month') agendaRef.setMonth(agendaRef.getMonth() + dir);
    renderAgenda();
  }

  function renderAgenda() {
    var periodEl = $('#agenda-period');
    if (periodEl) {
      if (agendaView === 'day') periodEl.textContent = formatDate(isoDate(agendaRef));
      else if (agendaView === 'week') {
        var start = startOfWeek(agendaRef);
        var end = new Date(start);
        end.setDate(end.getDate() + 6);
        periodEl.textContent = formatDateShort(isoDate(start)) + ' — ' + formatDateShort(isoDate(end));
      } else {
        periodEl.textContent = agendaRef.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      }
    }
    var content = $('#agenda-content');
    if (!content) return;
    if (agendaView === 'day') content.innerHTML = agendaDayHtml();
    else if (agendaView === 'week') content.innerHTML = agendaWeekHtml();
    else content.innerHTML = agendaMonthHtml();
    bindAgendaSlots(content);
  }

  function isoDate(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }
  function startOfWeek(d) {
    var c = new Date(d);
    var day = c.getDay();
    var diff = (day === 0 ? -6 : 1 - day);
    c.setDate(c.getDate() + diff);
    return c;
  }
  function timeSlots() {
    return ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  }
  function apptAt(doctorId, date, time) {
    var list = DATA.appointments || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].doctorId === doctorId && list[i].date === date && list[i].time === time) return list[i];
    }
    return null;
  }

  function agendaDayHtml() {
    var docs = mergedDoctors().slice(0, 6);
    var date = isoDate(agendaRef);
    var slots = timeSlots();
    var head = docs.map(function (d) {
      return '<div class="admin-agenda-col-head">' + esc(d.name) + '<span class="admin-agenda-col-sub">' + esc(specialtyName(d.specialty)) + '</span></div>';
    }).join('');
    var rows = slots.map(function (t) {
      var cells = docs.map(function (d) {
        var a = apptAt(d.id, date, t);
        return agendaSlotCell(a, d, date, t);
      }).join('');
      return '<div class="admin-agenda-row"><div class="admin-agenda-time">' + t + '</div>' + cells + '</div>';
    }).join('');
    return [
      '<div class="admin-agenda admin-agenda-day" style="--cols:' + docs.length + ';" role="grid" aria-label="Agenda do dia ' + esc(formatDateShort(date)) + '">',
      '  <div class="admin-agenda-row admin-agenda-head"><div class="admin-agenda-time">Horário</div>' + head + '</div>',
      rows,
      '</div>'
    ].join('');
  }

  function agendaSlotCell(appt, doc, date, time) {
    if (appt) {
      return '<button type="button" class="admin-agenda-slot slot-' + appt.status + '" data-appt="' + esc(appt.id) + '" data-doctor="' + esc(doc.id) + '" data-date="' + esc(date) + '" data-time="' + esc(time) + '" aria-label="' + esc(appt.patientName) + ' — ' + esc(STATUS_LABELS[appt.status]) + '"><span class="admin-slot-patient">' + esc(appt.patientName) + '</span><span class="admin-slot-status">' + esc(STATUS_LABELS[appt.status]) + '</span></button>';
    }
    return '<button type="button" class="admin-agenda-slot slot-available" data-doctor="' + esc(doc.id) + '" data-date="' + esc(date) + '" data-time="' + esc(time) + '" aria-label="Horário disponível"><span class="admin-slot-patient">Disponível</span></button>';
  }

  function agendaWeekHtml() {
    var start = startOfWeek(agendaRef);
    var days = [];
    for (var i = 0; i < 7; i++) {
      var d = new Date(start); d.setDate(d.getDate() + i);
      days.push({ iso: isoDate(d), label: d.toLocaleDateString('pt-BR', { weekday: 'short' }), num: d.getDate() });
    }
    var slots = timeSlots();
    var head = '<div class="admin-agenda-time">Horário</div>' + days.map(function (d) {
      return '<div class="admin-agenda-col-head">' + esc(d.label) + ' <span class="admin-agenda-col-num">' + d.num + '</span></div>';
    }).join('');
    var docs = mergedDoctors();
    var rows = slots.map(function (t) {
      var cells = days.map(function (d) {
        var dayAppts = (DATA.appointments || []).filter(function (a) { return a.date === d.iso && a.time === t; });
        if (!dayAppts.length) {
          return '<button type="button" class="admin-agenda-slot slot-available" data-date="' + esc(d.iso) + '" data-time="' + esc(t) + '" aria-label="Disponível"><span class="admin-slot-patient">—</span></button>';
        }
        var first = dayAppts[0];
        return '<button type="button" class="admin-agenda-slot slot-' + first.status + '" data-appt="' + esc(first.id) + '" data-date="' + esc(d.iso) + '" data-time="' + esc(t) + '" aria-label="' + esc(first.patientName) + '"><span class="admin-slot-patient">' + esc(first.patientName) + '</span></button>';
      }).join('');
      return '<div class="admin-agenda-row"><div class="admin-agenda-time">' + t + '</div>' + cells + '</div>';
    }).join('');
    return [
      '<div class="admin-agenda admin-agenda-week" role="grid" aria-label="Agenda da semana">',
      '  <div class="admin-agenda-row admin-agenda-head">' + head + '</div>',
      rows,
      '</div>'
    ].join('');
  }

  function agendaMonthHtml() {
    var year = agendaRef.getFullYear();
    var month = agendaRef.getMonth();
    var first = new Date(year, month, 1);
    var startDay = first.getDay();
    var startOffset = (startDay === 0 ? 6 : startDay - 1);
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var cells = [];
    var i;
    for (i = 0; i < startOffset; i++) cells.push('<div class="admin-cal-empty" aria-hidden="true"></div>');
    var apptsByDate = {};
    (DATA.appointments || []).forEach(function (a) {
      if (!apptsByDate[a.date]) apptsByDate[a.date] = { total: 0, confirmed: 0, pending: 0 };
      apptsByDate[a.date].total++;
      if (a.status === 'confirmed') apptsByDate[a.date].confirmed++;
      if (a.status === 'pending') apptsByDate[a.date].pending++;
    });
    for (i = 1; i <= daysInMonth; i++) {
      var d = new Date(year, month, i);
      var iso = isoDate(d);
      var info = apptsByDate[iso];
      var occ = info ? (info.total / 4) : 0;
      var occClass = occ >= 0.75 ? 'occ-high' : (occ >= 0.4 ? 'occ-mid' : (info ? 'occ-low' : ''));
      cells.push(
        '<button type="button" class="admin-cal-day ' + occClass + '" data-date="' + esc(iso) + '" aria-label="' + esc(formatDateShort(iso)) + (info ? ' — ' + info.total + ' atendimentos' : ' — sem atendimentos') + '">' +
        '<span class="admin-cal-num">' + i + '</span>' +
        (info ? '<span class="admin-cal-dot" aria-hidden="true"></span>' : '') +
        '</button>'
      );
    }
    var weekdays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    var head = weekdays.map(function (w) { return '<div class="admin-cal-weekday">' + w + '</div>'; }).join('');
    return [
      '<div class="admin-agenda admin-agenda-month" role="grid" aria-label="Agenda mensal">',
      '  <div class="admin-cal-head">' + head + '</div>',
      '  <div class="admin-cal-grid">' + cells.join('') + '</div>',
      '</div>'
    ].join('');
  }

  function bindAgendaSlots(root) {
    var slots = $$('.admin-agenda-slot', root);
    slots.forEach(function (s) {
      s.addEventListener('click', function () {
        var id = s.getAttribute('data-appt');
        if (id) {
          var appt = null;
          (DATA.appointments || []).forEach(function (a) { if (a.id === id) appt = a; });
          if (appt) openApptModal(appt);
        } else {
          toast('Horário disponível para agendamento.');
        }
      });
    });
    var calDays = $$('.admin-cal-day', root);
    calDays.forEach(function (d) {
      d.addEventListener('click', function () {
        var date = d.getAttribute('data-date');
        agendaRef = new Date(date + 'T00:00:00');
        agendaView = 'day';
        var tabs = $$('#agenda-tabs .tab');
        tabs.forEach(function (t) {
          var active = t.getAttribute('data-view') === 'day';
          t.classList.toggle('tab-active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        renderAgenda();
      });
    });
  }

  /* =========================================================
     CONSULTAS (tabela + filtros + paginação)
     ========================================================= */
  var consultasState = { page: 1, perPage: 10, search: '', status: '', doctor: '', date: '' };

  function initConsultas() {
    var doctorSel = $('#consultas-filter-doctor');
    if (doctorSel) {
      mergedDoctors().forEach(function (d) {
        var opt = document.createElement('option');
        opt.value = d.id; opt.textContent = d.name;
        doctorSel.appendChild(opt);
      });
    }
    var search = $('#consultas-search');
    var fStatus = $('#consultas-filter-status');
    var fDoctor = $('#consultas-filter-doctor');
    var fDate = $('#consultas-filter-date');
    function onChange() {
      consultasState.search = search ? search.value.trim().toLowerCase() : '';
      consultasState.status = fStatus ? fStatus.value : '';
      consultasState.doctor = fDoctor ? fDoctor.value : '';
      consultasState.date = fDate ? fDate.value : '';
      consultasState.page = 1;
      renderConsultas();
    }
    if (search) search.addEventListener('input', onChange);
    if (fStatus) fStatus.addEventListener('change', onChange);
    if (fDoctor) fDoctor.addEventListener('change', onChange);
    if (fDate) fDate.addEventListener('change', onChange);
  }

  function filterConsultas() {
    var list = DATA.appointments || [];
    return list.filter(function (a) {
      if (consultasState.status && a.status !== consultasState.status) return false;
      if (consultasState.doctor && a.doctorId !== consultasState.doctor) return false;
      if (consultasState.date && a.date !== consultasState.date) return false;
      if (consultasState.search && a.patientName.toLowerCase().indexOf(consultasState.search) === -1) return false;
      return true;
    }).sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); });
  }

  function renderConsultas() {
    var el = $('#consultas-table');
    if (!el) return;
    var filtered = filterConsultas();
    if (!filtered.length) {
      el.innerHTML = emptyState('Nenhuma consulta encontrada com os filtros atuais.');
      var pag = $('#consultas-pagination');
      if (pag) pag.innerHTML = '';
      return;
    }
    var total = filtered.length;
    var pages = Math.max(1, Math.ceil(total / consultasState.perPage));
    if (consultasState.page > pages) consultasState.page = pages;
    var start = (consultasState.page - 1) * consultasState.perPage;
    var pageRows = filtered.slice(start, start + consultasState.perPage);

    var head = '<tr><th>Data</th><th>Horário</th><th>Paciente</th><th>Médico</th><th>Especialidade</th><th>Convênio</th><th>Status</th><th class="col-actions">Ações</th></tr>';
    var body = pageRows.map(function (a) {
      var doc = doctorMap[a.doctorId];
      var ins = insuranceMap[a.insurance];
      return [
        '<tr>',
        '<td>' + esc(formatDateShort(a.date)) + '</td>',
        '<td>' + esc(a.time) + '</td>',
        '<td>' + esc(a.patientName) + '</td>',
        '<td>' + esc(doc ? doc.name : '—') + '</td>',
        '<td>' + esc(specialtyName(a.specialty)) + '</td>',
        '<td>' + esc(ins ? ins.name : a.insurance) + '</td>',
        '<td>' + statusBadge(a.status) + '</td>',
        '<td class="col-actions"><div class="admin-row-actions">',
        '<button type="button" class="admin-action-btn" data-action="view" data-appt="' + esc(a.id) + '" aria-label="Ver detalhes">Ver</button>',
        '<label class="admin-status-select"><span class="sr-only">Alterar status</span><select class="select admin-status-change" data-appt="' + esc(a.id) + '"><option value="">Alterar…</option><option value="confirmed">Confirmar</option><option value="cancelled">Cancelar</option><option value="completed">Concluir</option></select></label>',
        '</div></td>',
        '</tr>'
      ].join('');
    }).join('');
    el.innerHTML = '<div class="table-wrap"><table class="table admin-table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';

    bindConsultasActions();
    renderPagination('consultas-pagination', consultasState.page, pages, function (p) {
      consultasState.page = p; renderConsultas();
    });
  }

  function bindConsultasActions() {
    $$('.admin-action-btn[data-action="view"]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-appt');
        var appt = null;
        (DATA.appointments || []).forEach(function (a) { if (a.id === id) appt = a; });
        if (appt) openApptModal(appt);
      });
    });
    $$('.admin-status-change').forEach(function (sel) {
      sel.addEventListener('change', function () {
        var id = sel.getAttribute('data-appt');
        var v = sel.value;
        if (!v) return;
        (DATA.appointments || []).forEach(function (a) { if (a.id === id) a.status = v; });
        toast('Status alterado para "' + (STATUS_LABELS[v] || v) + '".');
        renderConsultas();
      });
    });
  }

  function renderPagination(targetId, current, pages, onChange) {
    var el = $('#' + targetId);
    if (!el) return;
    if (pages <= 1) { el.innerHTML = ''; return; }
    var btns = '';
    btns += '<button type="button" class="admin-page-btn" data-page="' + (current - 1) + '" ' + (current === 1 ? 'disabled' : '') + ' aria-label="Página anterior">Anterior</button>';
    for (var p = 1; p <= pages; p++) {
      btns += '<button type="button" class="admin-page-btn' + (p === current ? ' active' : '') + '" data-page="' + p + '" aria-label="Página ' + p + '"' + (p === current ? ' aria-current="page"' : '') + '>' + p + '</button>';
    }
    btns += '<button type="button" class="admin-page-btn" data-page="' + (current + 1) + '" ' + (current === pages ? 'disabled' : '') + ' aria-label="Próxima página">Próxima</button>';
    el.innerHTML = btns;
    $$('.admin-page-btn', el).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled) return;
        onChange(parseInt(b.getAttribute('data-page'), 10));
      });
    });
  }

  /* =========================================================
     PROFISSIONAIS (CRUD demo)
     ========================================================= */
  function renderProfissionais() {
    var el = $('#profissionais-table');
    if (!el) return;
    var docs = mergedDoctors();
    if (!docs.length) { el.innerHTML = emptyState('Nenhum profissional cadastrado.'); return; }
    var head = '<tr><th>Nome</th><th>Especialidade</th><th>CRM-DEMO</th><th>Agenda</th><th>Status</th><th class="col-actions">Ações</th></tr>';
    var body = docs.map(function (d) {
      var active = d.status !== 'inactive';
      var scheduleCount = d.schedule ? Object.keys(d.schedule).reduce(function (acc, k) { return acc + d.schedule[k].length; }, 0) : 0;
      return [
        '<tr>',
        '<td>' + esc(d.name) + '</td>',
        '<td>' + esc(specialtyName(d.specialty)) + '</td>',
        '<td><span class="admin-crm">' + esc(d.crm || 'CRM-DEMO-000') + '</span></td>',
        '<td>' + scheduleCount + ' slots</td>',
        '<td>' + (active ? '<span class="badge badge-status confirmed">Ativo</span>' : '<span class="badge badge-status cancelled">Inativo</span>') + '</td>',
        '<td class="col-actions"><div class="admin-row-actions">',
        '<button type="button" class="admin-action-btn" data-action="edit-doctor" data-id="' + esc(d.id) + '" aria-label="Editar profissional">Editar</button>',
        '<button type="button" class="admin-action-btn" data-action="toggle-doctor" data-id="' + esc(d.id) + '" aria-label="Ativar ou desativar">' + (active ? 'Desativar' : 'Ativar') + '</button>',
        '</div></td>',
        '</tr>'
      ].join('');
    }).join('');
    el.innerHTML = '<div class="table-wrap"><table class="table admin-table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
    bindProfissionaisActions();
  }

  function bindProfissionaisActions() {
    $$('[data-action="edit-doctor"]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        var docs = mergedDoctors();
        var doc = null;
        docs.forEach(function (d) { if (d.id === id) doc = d; });
        openDoctorModal(doc);
      });
    });
    $$('[data-action="toggle-doctor"]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        toggleDoctorStatus(id);
      });
    });
    var addBtn = $('#btn-add-doctor');
    if (addBtn) addBtn.onclick = function () { openDoctorModal(null); };
  }

  function toggleDoctorStatus(id) {
    var extra = lsGet(LS_DOCTORS) || [];
    var found = null;
    extra.forEach(function (d) { if (d.id === id) found = d; });
    var base = null;
    (DATA.doctors || []).forEach(function (d) { if (d.id === id) base = d; });
    var current = found || base;
    if (!current) return;
    var newStatus = current.status === 'inactive' ? 'active' : 'inactive';
    var updated = Object.assign({}, current, { status: newStatus });
    var exists = false;
    extra = extra.map(function (d) { if (d.id === id) { exists = true; return updated; } return d; });
    if (!exists) extra.push(updated);
    lsSet(LS_DOCTORS, extra);
    toast('Profissional ' + (newStatus === 'active' ? 'ativado' : 'desativado') + '.');
    renderProfissionais();
  }

  function openDoctorModal(doc) {
    var isNew = !doc;
    var d = doc || { id: 'doc-new-' + Date.now(), name: '', specialty: 'clinica-geral', crm: 'CRM-DEMO-', rqe: 'RQE-DEMO-', photo: '', bio: '', insurance: [], schedule: { seg: ['09:00'] } };
    var specOpts = mergedSpecialties().map(function (s) {
      return '<option value="' + esc(s.slug) + '"' + (s.slug === d.specialty ? ' selected' : '') + '>' + esc(s.name) + '</option>';
    }).join('');
    var insOpts = mergedInsurance().map(function (i) {
      var checked = (d.insurance || []).indexOf(i.slug) !== -1 ? ' checked' : '';
      return '<label class="admin-check"><input type="checkbox" name="insurance" value="' + esc(i.slug) + '"' + checked + '><span>' + esc(i.name) + '</span></label>';
    }).join('');
    var body = [
      '<form class="admin-crud-form" id="doctor-form" novalidate>',
      '  <div class="alert alert-error admin-crud-disclaimer" role="alert"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Cadastro demonstrativo — use CRM-DEMO. Nenhum dado real é enviado.</span></alert>',
      '  <div class="form-grid-2">',
      '    <div class="field"><label class="label" for="d-name">Nome</label><input class="input" id="d-name" name="name" type="text" value="' + esc(d.name) + '" required></div>',
      '    <div class="field"><label class="label" for="d-specialty">Especialidade</label><select class="select" id="d-specialty" name="specialty">' + specOpts + '</select></div>',
      '    <div class="field"><label class="label" for="d-crm">CRM (demo)</label><input class="input" id="d-crm" name="crm" type="text" value="' + esc(d.crm) + '"></div>',
      '    <div class="field"><label class="label" for="d-rqe">RQE (demo)</label><input class="input" id="d-rqe" name="rqe" type="text" value="' + esc(d.rqe || '') + '"></div>',
      '    <div class="field"><label class="label" for="d-photo">Foto (URL)</label><input class="input" id="d-photo" name="photo" type="text" value="' + esc(d.photo || '') + '" placeholder="pessoa1.jpg"></div>',
      '  </div>',
      '  <div class="field"><label class="label" for="d-bio">Descrição</label><textarea class="textarea" id="d-bio" name="bio">' + esc(d.bio || '') + '</textarea></div>',
      '  <div class="field"><span class="label">Convênios aceitos</span><div class="admin-checks">' + insOpts + '</div></div>',
      '  <div class="field"><label class="label" for="d-schedule">Horários (ex: seg:09:00,10:00; ter:14:00)</label><input class="input" id="d-schedule" name="schedule" type="text" value="' + esc(scheduleToString(d.schedule)) + '"></div>',
      '  <div class="admin-modal-actions"><button type="submit" class="btn btn-primary" id="btn-save-doctor">Salvar</button><button type="button" class="btn btn-ghost" id="btn-cancel-doctor">Cancelar</button></div>',
      '</form>'
    ].join('');
    openModal(isNew ? 'Adicionar profissional' : 'Editar profissional', body);
    var form = $('#doctor-form');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      saveDoctor(d.id, isNew);
    });
    var cancel = $('#btn-cancel-doctor');
    if (cancel) cancel.addEventListener('click', closeModal);
  }

  function scheduleToString(sched) {
    if (!sched) return '';
    return Object.keys(sched).map(function (k) { return k + ':' + sched[k].join(','); }).join('; ');
  }
  function parseSchedule(str) {
    var out = {};
    if (!str) return out;
    str.split(';').forEach(function (part) {
      var kv = part.split(':');
      if (kv.length === 2) {
        var day = kv[0].trim();
        var times = kv[1].split(',').map(function (t) { return t.trim(); }).filter(Boolean);
        if (day && times.length) out[day] = times;
      }
    });
    return out;
  }

  function saveDoctor(id, isNew) {
    var name = ($('#d-name') || {}).value || '';
    if (!name.trim()) { toast('Informe o nome do profissional.'); return; }
    var specialty = ($('#d-specialty') || {}).value;
    var crm = ($('#d-crm') || {}).value || 'CRM-DEMO-000';
    var rqe = ($('#d-rqe') || {}).value || '';
    var photo = ($('#d-photo') || {}).value || '';
    var bio = ($('#d-bio') || {}).value || '';
    var schedule = parseSchedule(($('#d-schedule') || {}).value || '');
    var insurance = [];
    $$('input[name="insurance"]').forEach(function (c) { if (c.checked) insurance.push(c.value); });
    var extra = lsGet(LS_DOCTORS) || [];
    var base = null;
    (DATA.doctors || []).forEach(function (d) { if (d.id === id) base = d; });
    var existing = null;
    extra.forEach(function (d) { if (d.id === id) existing = d; });
    var record = Object.assign({}, base || {}, existing || {}, {
      id: id,
      name: name.trim(),
      specialty: specialty,
      crm: crm.trim(),
      rqe: rqe.trim(),
      photo: photo.trim(),
      bio: bio.trim(),
      insurance: insurance,
      schedule: schedule,
      status: (existing && existing.status) || (base && base.status) || 'active'
    });
    if (existing) {
      extra = extra.map(function (d) { return d.id === id ? record : d; });
    } else {
      extra.push(record);
    }
    lsSet(LS_DOCTORS, extra);
    closeModal();
    toast(isNew ? 'Profissional adicionado (demo).' : 'Profissional atualizado (demo).');
    renderProfissionais();
  }

  /* =========================================================
     ESPECIALIDADES (CRUD demo)
     ========================================================= */
  function renderEspecialidades() {
    var el = $('#especialidades-table');
    if (!el) return;
    var specs = mergedSpecialties();
    if (!specs.length) { el.innerHTML = emptyState('Nenhuma especialidade cadastrada.'); return; }
    var docs = mergedDoctors();
    var head = '<tr><th>Nome</th><th>Descrição</th><th>Profissionais vinculados</th><th>Status</th><th class="col-actions">Ações</th></tr>';
    var body = specs.map(function (s) {
      var count = docs.filter(function (d) { return d.specialty === s.slug; }).length;
      var active = s.status !== 'inactive';
      return [
        '<tr>',
        '<td>' + esc(s.name) + '</td>',
        '<td class="admin-cell-desc">' + esc(s.shortDescription || '') + '</td>',
        '<td>' + count + '</td>',
        '<td>' + (active ? '<span class="badge badge-status confirmed">Ativo</span>' : '<span class="badge badge-status cancelled">Inativo</span>') + '</td>',
        '<td class="col-actions"><div class="admin-row-actions">',
        '<button type="button" class="admin-action-btn" data-action="edit-spec" data-id="' + esc(s.id) + '" aria-label="Editar especialidade">Editar</button>',
        '<button type="button" class="admin-action-btn" data-action="toggle-spec" data-id="' + esc(s.id) + '" aria-label="Ativar ou desativar">' + (active ? 'Desativar' : 'Ativar') + '</button>',
        '</div></td>',
        '</tr>'
      ].join('');
    }).join('');
    el.innerHTML = '<div class="table-wrap"><table class="table admin-table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
    bindEspecialidadesActions();
  }

  function bindEspecialidadesActions() {
    $$('[data-action="edit-spec"]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        var specs = mergedSpecialties();
        var s = null;
        specs.forEach(function (x) { if (x.id === id) s = x; });
        openSpecialtyModal(s);
      });
    });
    $$('[data-action="toggle-spec"]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        toggleSpecialtyStatus(id);
      });
    });
    var addBtn = $('#btn-add-specialty');
    if (addBtn) addBtn.onclick = function () { openSpecialtyModal(null); };
  }

  function toggleSpecialtyStatus(id) {
    var extra = lsGet(LS_SPECIALTIES) || [];
    var found = null;
    extra.forEach(function (s) { if (s.id === id) found = s; });
    var base = null;
    (DATA.specialties || []).forEach(function (s) { if (s.id === id) base = s; });
    var current = found || base;
    if (!current) return;
    var newStatus = current.status === 'inactive' ? 'active' : 'inactive';
    var updated = Object.assign({}, current, { status: newStatus });
    var exists = false;
    extra = extra.map(function (s) { if (s.id === id) { exists = true; return updated; } return s; });
    if (!exists) extra.push(updated);
    lsSet(LS_SPECIALTIES, extra);
    toast('Especialidade ' + (newStatus === 'active' ? 'ativada' : 'desativada') + '.');
    renderEspecialidades();
  }

  function openSpecialtyModal(spec) {
    var isNew = !spec;
    var s = spec || { id: 'spec-new-' + Date.now(), slug: '', name: '', shortDescription: '', longDescription: '', icon: '', seoTitle: '', seoDescription: '', status: 'active' };
    var body = [
      '<form class="admin-crud-form" id="spec-form" novalidate>',
      '  <div class="alert alert-error admin-crud-disclaimer" role="alert"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Cadastro demonstrativo — dados fictícios.</span></alert>',
      '  <div class="form-grid-2">',
      '    <div class="field"><label class="label" for="s-name">Nome</label><input class="input" id="s-name" name="name" type="text" value="' + esc(s.name) + '" required></div>',
      '    <div class="field"><label class="label" for="s-slug">Slug (URL)</label><input class="input" id="s-slug" name="slug" type="text" value="' + esc(s.slug) + '" placeholder="ex: cardiologia"></div>',
      '  </div>',
      '  <div class="field"><label class="label" for="s-short">Descrição curta</label><input class="input" id="s-short" name="shortDescription" type="text" value="' + esc(s.shortDescription || '') + '"></div>',
      '  <div class="field"><label class="label" for="s-long">Descrição longa</label><textarea class="textarea" id="s-long" name="longDescription">' + esc(s.longDescription || '') + '</textarea></div>',
      '  <div class="field"><label class="label" for="s-icon">Ícone (path SVG)</label><input class="input" id="s-icon" name="icon" type="text" value="' + esc(s.icon || '') + '" placeholder="M12 21s-6.5-4.35..."></div>',
      '  <div class="form-grid-2">',
      '    <div class="field"><label class="label" for="s-seo-title">SEO Title</label><input class="input" id="s-seo-title" name="seoTitle" type="text" value="' + esc(s.seoTitle || '') + '"></div>',
      '    <div class="field"><label class="label" for="s-seo-desc">SEO Description</label><input class="input" id="s-seo-desc" name="seoDescription" type="text" value="' + esc(s.seoDescription || '') + '"></div>',
      '  </div>',
      '  <div class="admin-modal-actions"><button type="submit" class="btn btn-primary" id="btn-save-spec">Salvar</button><button type="button" class="btn btn-ghost" id="btn-cancel-spec">Cancelar</button></div>',
      '</form>'
    ].join('');
    openModal(isNew ? 'Adicionar especialidade' : 'Editar especialidade', body);
    var form = $('#spec-form');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      saveSpecialty(s.id, isNew);
    });
    var cancel = $('#btn-cancel-spec');
    if (cancel) cancel.addEventListener('click', closeModal);
  }

  function saveSpecialty(id, isNew) {
    var name = ($('#s-name') || {}).value || '';
    if (!name.trim()) { toast('Informe o nome da especialidade.'); return; }
    var slug = (($('#s-slug') || {}).value || '').trim() || slugify(name);
    var record = {
      id: id,
      slug: slug,
      name: name.trim(),
      shortDescription: (($('#s-short') || {}).value || '').trim(),
      longDescription: (($('#s-long') || {}).value || '').trim(),
      icon: (($('#s-icon') || {}).value || '').trim(),
      seoTitle: (($('#s-seo-title') || {}).value || '').trim(),
      seoDescription: (($('#s-seo-desc') || {}).value || '').trim()
    };
    var extra = lsGet(LS_SPECIALTIES) || [];
    var base = null;
    (DATA.specialties || []).forEach(function (s) { if (s.id === id) base = s; });
    var existing = null;
    extra.forEach(function (s) { if (s.id === id) existing = s; });
    var full = Object.assign({}, base || {}, existing || {}, record);
    full.status = (existing && existing.status) || (base && base.status) || 'active';
    if (existing) extra = extra.map(function (s) { return s.id === id ? full : s; });
    else extra.push(full);
    lsSet(LS_SPECIALTIES, extra);
    closeModal();
    toast(isNew ? 'Especialidade adicionada (demo).' : 'Especialidade atualizada (demo).');
    renderEspecialidades();
  }

  function slugify(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  /* =========================================================
     CONVÊNIOS (CRUD demo + filtros)
     ========================================================= */
  var conveniosState = { search: '', status: '' };

  function initConvenios() {
    var search = $('#convenios-search');
    var fStatus = $('#convenios-filter-status');
    function onChange() {
      conveniosState.search = search ? search.value.trim().toLowerCase() : '';
      conveniosState.status = fStatus ? fStatus.value : '';
      renderConvenios();
    }
    if (search) search.addEventListener('input', onChange);
    if (fStatus) fStatus.addEventListener('change', onChange);
    var addBtn = $('#btn-add-insurance');
    if (addBtn) addBtn.onclick = function () { openInsuranceModal(null); };
  }

  function renderConvenios() {
    var el = $('#convenios-table');
    if (!el) return;
    var list = mergedInsurance().filter(function (i) {
      if (conveniosState.status && (i.status || 'active') !== conveniosState.status) return false;
      if (conveniosState.search && i.name.toLowerCase().indexOf(conveniosState.search) === -1) return false;
      return true;
    });
    if (!list.length) { el.innerHTML = emptyState('Nenhum convênio encontrado.'); return; }
    var head = '<tr><th>Nome</th><th>Especialidades aceitas</th><th>Status</th><th class="col-actions">Ações</th></tr>';
    var body = list.map(function (i) {
      var active = (i.status || 'active') === 'active';
      var specNames = (i.specialties || []).map(function (s) { return specialtyName(s); }).join(', ');
      return [
        '<tr>',
        '<td>' + esc(i.name) + '</td>',
        '<td class="admin-cell-desc">' + esc(specNames) + '</td>',
        '<td>' + (active ? '<span class="badge badge-status confirmed">Ativo</span>' : '<span class="badge badge-status cancelled">Inativo</span>') + '</td>',
        '<td class="col-actions"><div class="admin-row-actions">',
        '<button type="button" class="admin-action-btn" data-action="edit-ins" data-id="' + esc(i.id) + '" aria-label="Editar convênio">Editar</button>',
        '<button type="button" class="admin-action-btn" data-action="toggle-ins" data-id="' + esc(i.id) + '" aria-label="Ativar ou desativar">' + (active ? 'Desativar' : 'Ativar') + '</button>',
        '</div></td>',
        '</tr>'
      ].join('');
    }).join('');
    el.innerHTML = '<div class="table-wrap"><table class="table admin-table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
    bindConveniosActions();
  }

  function bindConveniosActions() {
    $$('[data-action="edit-ins"]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        var list = mergedInsurance();
        var ins = null;
        list.forEach(function (i) { if (i.id === id) ins = i; });
        openInsuranceModal(ins);
      });
    });
    $$('[data-action="toggle-ins"]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        toggleInsuranceStatus(id);
      });
    });
  }

  function toggleInsuranceStatus(id) {
    var extra = lsGet(LS_INSURANCE) || [];
    var found = null;
    extra.forEach(function (i) { if (i.id === id) found = i; });
    var base = null;
    (DATA.insurance || []).forEach(function (i) { if (i.id === id) base = i; });
    var current = found || base;
    if (!current) return;
    var cur = current.status || 'active';
    var newStatus = cur === 'inactive' ? 'active' : 'inactive';
    var updated = Object.assign({}, current, { status: newStatus });
    var exists = false;
    extra = extra.map(function (i) { if (i.id === id) { exists = true; return updated; } return i; });
    if (!exists) extra.push(updated);
    lsSet(LS_INSURANCE, extra);
    toast('Convênio ' + (newStatus === 'active' ? 'ativado' : 'desativado') + '.');
    renderConvenios();
  }

  function openInsuranceModal(ins) {
    var isNew = !ins;
    var i = ins || { id: 'ins-new-' + Date.now(), slug: '', name: '', specialties: [], status: 'active' };
    var specOpts = mergedSpecialties().map(function (s) {
      var checked = (i.specialties || []).indexOf(s.slug) !== -1 ? ' checked' : '';
      return '<label class="admin-check"><input type="checkbox" name="spec" value="' + esc(s.slug) + '"' + checked + '><span>' + esc(s.name) + '</span></label>';
    }).join('');
    var body = [
      '<form class="admin-crud-form" id="ins-form" novalidate>',
      '  <div class="alert alert-error admin-crud-disclaimer" role="alert"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Cadastro demonstrativo — dados fictícios.</span></alert>',
      '  <div class="form-grid-2">',
      '    <div class="field"><label class="label" for="i-name">Nome</label><input class="input" id="i-name" name="name" type="text" value="' + esc(i.name) + '" required></div>',
      '    <div class="field"><label class="label" for="i-slug">Slug</label><input class="input" id="i-slug" name="slug" type="text" value="' + esc(i.slug) + '" placeholder="ex: unimed"></div>',
      '  </div>',
      '  <div class="field"><span class="label">Especialidades aceitas</span><div class="admin-checks">' + specOpts + '</div></div>',
      '  <div class="admin-modal-actions"><button type="submit" class="btn btn-primary" id="btn-save-ins">Salvar</button><button type="button" class="btn btn-ghost" id="btn-cancel-ins">Cancelar</button></div>',
      '</form>'
    ].join('');
    openModal(isNew ? 'Adicionar convênio' : 'Editar convênio', body);
    var form = $('#ins-form');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      saveInsurance(i.id, isNew);
    });
    var cancel = $('#btn-cancel-ins');
    if (cancel) cancel.addEventListener('click', closeModal);
  }

  function saveInsurance(id, isNew) {
    var name = ($('#i-name') || {}).value || '';
    if (!name.trim()) { toast('Informe o nome do convênio.'); return; }
    var slug = (($('#i-slug') || {}).value || '').trim() || slugify(name);
    var specs = [];
    $$('input[name="spec"]').forEach(function (c) { if (c.checked) specs.push(c.value); });
    var extra = lsGet(LS_INSURANCE) || [];
    var base = null;
    (DATA.insurance || []).forEach(function (x) { if (x.id === id) base = x; });
    var existing = null;
    extra.forEach(function (x) { if (x.id === id) existing = x; });
    var full = Object.assign({}, base || {}, existing || {}, { id: id, slug: slug, name: name.trim(), specialties: specs });
    full.status = (existing && existing.status) || (base && base.status) || 'active';
    if (existing) extra = extra.map(function (x) { return x.id === id ? full : x; });
    else extra.push(full);
    lsSet(LS_INSURANCE, extra);
    closeModal();
    toast(isNew ? 'Convênio adicionado (demo).' : 'Convênio atualizado (demo).');
    renderConvenios();
  }

  /* =========================================================
     PACIENTES
     ========================================================= */
  var pacientesState = { search: '' };

  function initPacientes() {
    var search = $('#pacientes-search');
    if (search) search.addEventListener('input', function () {
      pacientesState.search = search.value.trim().toLowerCase();
      renderPacientes();
    });
  }

  function renderPacientes() {
    var el = $('#pacientes-table');
    if (!el) return;
    var list = (DATA.patients || []).filter(function (p) {
      if (!pacientesState.search) return true;
      return p.name.toLowerCase().indexOf(pacientesState.search) !== -1;
    });
    if (!list.length) { el.innerHTML = emptyState('Nenhum paciente encontrado.'); return; }
    var head = '<tr><th>Nome</th><th>E-mail</th><th>Telefone</th><th>Convênio</th><th>Última visita</th><th class="col-actions">Ações</th></tr>';
    var body = list.map(function (p) {
      var ins = insuranceMap[p.insurance];
      return [
        '<tr>',
        '<td>' + esc(p.name) + '</td>',
        '<td>' + esc(p.email) + '</td>',
        '<td>' + esc(p.phone) + '</td>',
        '<td>' + esc(ins ? ins.name : p.insurance) + '</td>',
        '<td>' + esc(formatDateShort(p.lastVisit)) + '</td>',
        '<td class="col-actions"><div class="admin-row-actions">',
        '<button type="button" class="admin-action-btn" data-action="view-patient" data-id="' + esc(p.id) + '" aria-label="Ver detalhes">Detalhes</button>',
        '<button type="button" class="admin-action-btn" data-action="history-patient" data-id="' + esc(p.id) + '" aria-label="Ver histórico">Histórico</button>',
        '</div></td>',
        '</tr>'
      ].join('');
    }).join('');
    el.innerHTML = '<div class="table-wrap"><table class="table admin-table"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>';
    bindPacientesActions();
  }

  function bindPacientesActions() {
    $$('[data-action="view-patient"]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        var p = null;
        (DATA.patients || []).forEach(function (x) { if (x.id === id) p = x; });
        if (p) openPatientModal(p);
      });
    });
    $$('[data-action="history-patient"]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        var p = null;
        (DATA.patients || []).forEach(function (x) { if (x.id === id) p = x; });
        if (p) openPatientHistoryModal(p);
      });
    });
  }

  function openPatientModal(p) {
    var ins = insuranceMap[p.insurance];
    var body = [
      '<div class="admin-detail">',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Nome</span><span>' + esc(p.name) + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">E-mail</span><span>' + esc(p.email) + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Telefone</span><span>' + esc(p.phone) + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Convênio</span><span>' + esc(ins ? ins.name : p.insurance) + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Nascimento</span><span>' + esc(formatDateShort(p.birthDate)) + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Última visita</span><span>' + esc(formatDate(p.lastVisit)) + '</span></div>',
      '  <div class="alert alert-error admin-crud-disclaimer" role="alert"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Paciente demonstrativo — dados fictícios.</span></alert>',
      '</div>'
    ].join('');
    openModal('Detalhes do paciente', body);
  }

  function openPatientHistoryModal(p) {
    var appts = (DATA.appointments || []).filter(function (a) { return a.patientName === p.name; });
    var rows = appts.map(function (a) {
      var doc = doctorMap[a.doctorId];
      return '<div class="admin-history-item"><span class="admin-history-date">' + esc(formatDateShort(a.date)) + ' ' + esc(a.time) + '</span><span class="admin-history-info">' + esc(specialtyName(a.specialty)) + ' — ' + esc(doc ? doc.name : '—') + '</span>' + statusBadge(a.status) + '</div>';
    }).join('');
    if (!rows) rows = '<p class="text-muted">Sem histórico de atendimentos.</p>';
    var body = '<div class="admin-detail"><h4>Histórico de ' + esc(p.name) + '</h4><div class="admin-history-list">' + rows + '</div><div class="alert alert-error admin-crud-disclaimer" role="alert"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Histórico demonstrativo — dados fictícios.</span></alert></div>';
    openModal('Histórico do paciente', body);
  }

  /* =========================================================
     ANALYTICS
     ========================================================= */
  function renderAnalytics() {
    var a = DATA.analytics || {};
    var kpis = [
      { label: 'Visitas (30 dias)', value: formatNum(a.visits && a.visits.last30Days) },
      { label: 'Agendamentos iniciados', value: formatNum(a.appointmentsStarted) },
      { label: 'Agendamentos concluídos', value: formatNum(a.appointmentsCompleted) },
      { label: 'Taxa de conversão', value: pct(a.conversionRate) }
    ];
    var kpiHtml = kpis.map(function (k) {
      return [
        '<div class="card admin-kpi-card">',
        '  <p class="admin-kpi-value">' + esc(k.value) + '</p>',
        '  <p class="admin-kpi-label">' + esc(k.label) + '</p>',
        '</div>'
      ].join('');
    }).join('');
    var kEl = $('#analytics-kpis');
    if (kEl) kEl.innerHTML = kpiHtml;

    /* Funil */
    renderFunnel('analytics-funnel', a.funil || {});
    /* Origem */
    renderBarsChart('chart-bars-origin', a.byOrigin || {});
    /* Especialidade (analytics) */
    renderBarsChart('chart-bars-spec-2', a.bySpecialty || {});
    /* Visitas 30 dias */
    renderLineChart('chart-line-visits', (a.visits && a.visits.series) || [], 'Visitas');
  }

  function renderFunnel(targetId, funil) {
    var el = $('#' + targetId);
    if (!el) return;
    var stages = [
      { key: 'visita', label: 'Visitas' },
      { key: 'especialidade', label: 'Escolha de especialidade' },
      { key: 'medico', label: 'Escolha de médico' },
      { key: 'agendamento_iniciado', label: 'Agendamento iniciado' },
      { key: 'agendamento_concluido', label: 'Agendamento concluído' }
    ];
    var max = 0;
    stages.forEach(function (s) { if (funil[s.key] > max) max = funil[s.key]; });
    if (max <= 0) max = 1;
    var rows = stages.map(function (s, i) {
      var v = funil[s.key] || 0;
      var w = ((v / max) * 100).toFixed(2);
      var conv = i === 0 ? 100 : Math.round((v / (funil[stages[0].key] || 1)) * 100);
      return [
        '<div class="admin-funnel-row">',
        '  <span class="admin-funnel-label">' + esc(s.label) + '</span>',
        '  <div class="admin-funnel-track"><span class="admin-funnel-fill" style="width:' + w + '%;">' + formatNum(v) + '</span></div>',
        '  <span class="admin-funnel-conv">' + conv + '%</span>',
        '</div>'
      ].join('');
    }).join('');
    el.innerHTML = '<div class="admin-funnel">' + rows + '</div>';
  }

  function formatNum(n) {
    if (n == null) return '—';
    return Number(n).toLocaleString('pt-BR');
  }
  function pct(v) {
    if (v == null) return '—';
    return (Number(v) * 100).toFixed(1).replace('.', ',') + '%';
  }

  /* =========================================================
     MODAL
     ========================================================= */
  function openModal(title, bodyHtml) {
    var overlay = $('#admin-modal');
    var titleEl = $('#admin-modal-title');
    var bodyEl = $('#admin-modal-body');
    if (!overlay || !bodyEl) return;
    if (titleEl) titleEl.textContent = title;
    bodyEl.innerHTML = bodyHtml;
    overlay.classList.add('open');
    var close = $('#admin-modal-close');
    if (close) close.focus();
  }
  function closeModal() {
    var overlay = $('#admin-modal');
    if (overlay) overlay.classList.remove('open');
  }
  function initModal() {
    var close = $('#admin-modal-close');
    if (close) close.addEventListener('click', closeModal);
    var overlay = $('#admin-modal');
    if (overlay) overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openApptModal(a) {
    var doc = doctorMap[a.doctorId];
    var ins = insuranceMap[a.insurance];
    var body = [
      '<div class="admin-detail">',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Paciente</span><span>' + esc(a.patientName) + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Médico</span><span>' + esc(doc ? doc.name : '—') + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Especialidade</span><span>' + esc(specialtyName(a.specialty)) + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Data</span><span>' + esc(formatDate(a.date)) + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Horário</span><span>' + esc(a.time) + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Convênio</span><span>' + esc(ins ? ins.name : a.insurance) + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Tipo</span><span>' + esc(a.type) + '</span></div>',
      '  <div class="admin-detail-row"><span class="admin-detail-label">Status</span>' + statusBadge(a.status) + '</div>',
      '  <div class="alert alert-error admin-crud-disclaimer" role="alert"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Atendimento demonstrativo — dados fictícios.</span></alert>',
      '</div>'
    ].join('');
    openModal('Detalhes do atendimento', body);
  }

  /* ---------- Helpers de nomes ---------- */
  function specialtyName(slug) {
    var s = specialtyMap[slug];
    return s ? s.name : slug;
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    var session = checkSession();
    if (!session) return;
    DATA = loadData();
    (DATA.doctors || []).forEach(function (d) { doctorMap[d.id] = d; });
    (DATA.specialties || []).forEach(function (s) { specialtyMap[s.slug] = s; specialtyMap[s.id] = s; });
    (DATA.insurance || []).forEach(function (i) { insuranceMap[i.slug] = i; insuranceMap[i.id] = i; });

    initTabs();
    initDrawer();
    initAgenda();
    initConsultas();
    initConvenios();
    initPacientes();
    initModal();

    var logoutBtn = $('#btn-admin-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    renderDashboard();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);

})(window);
