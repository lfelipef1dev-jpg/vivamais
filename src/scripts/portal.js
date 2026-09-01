/* VivaMais — portal.js (script)
   Lógica do portal do paciente (demo).
   Sessão, tabs, agendamentos (localStorage + mock), documentos, exames, perfil.
   Tudo client-side. */

(function (global) {
  'use strict';

  var VM = global.VivaMais || (global.VivaMais = {});
  var $ = VM.$;
  var $$ = VM.$$;
  var toast = VM.toast;

  var SESSION_KEY = 'vivamais_patient_session';
  var APPT_KEY = 'vivamais_appointments';
  var PROFILE_KEY = 'vivamais_patient_profile';

  /* ---------- Dados embutidos ---------- */
  function loadData() {
    var node = document.getElementById('portal-data');
    if (!node) return { doctors: [], doctorMap: {}, insurance: [] };
    try { return JSON.parse(node.textContent); }
    catch (e) { return { doctors: [], doctorMap: {}, insurance: [] }; }
  }
  var DATA = loadData();
  var DOCTOR_MAP = DATA.doctorMap || {};
  var INSURANCE = DATA.insurance || [];

  /* ---------- Dados mockados (embutidos) ---------- */
  var MOCK_APPTS = [
    { id: 'mock-1', specialtyName: 'Cardiologia', doctorName: 'Dra. Ana Souza', doctorId: 'doc-1', date: '2025-02-10', time: '09:00', status: 'confirmed', insuranceName: 'Unimed', location: 'Unidade Centro — Demonstração', type: 'consulta', source: 'mock' },
    { id: 'mock-2', specialtyName: 'Clínica Geral', doctorName: 'Dr. Fernando Costa', doctorId: 'doc-6', date: '2025-01-15', time: '10:00', status: 'completed', insuranceName: 'Unimed', location: 'Unidade Centro — Demonstração', type: 'consulta', source: 'mock' },
    { id: 'mock-3', specialtyName: 'Dermatologia', doctorName: 'Dr. Bruno Lima', doctorId: 'doc-2', date: '2024-12-20', time: '11:00', status: 'completed', insuranceName: 'Unimed', location: 'Unidade Centro — Demonstração', type: 'consulta', source: 'mock' },
    { id: 'mock-4', specialtyName: 'Ortopedia', doctorName: 'Dra. Carla Mendes', doctorId: 'doc-3', date: '2024-11-05', time: '14:00', status: 'cancelled', insuranceName: 'Bradesco Saúde', location: 'Unidade Centro — Demonstração', type: 'consulta', source: 'mock' },
    { id: 'mock-5', specialtyName: 'Ginecologia', doctorName: 'Dr. Eduardo Santos', doctorId: 'doc-5', date: '2024-10-12', time: '15:00', status: 'completed', insuranceName: 'Unimed', location: 'Unidade Centro — Demonstração', type: 'consulta', source: 'mock' },
    { id: 'mock-6', specialtyName: 'Pediatria', doctorName: 'Dra. Diana Rocha', doctorId: 'doc-4', date: '2024-09-18', time: '08:00', status: 'completed', insuranceName: 'Unimed', location: 'Unidade Centro — Demonstração', type: 'consulta', source: 'mock' },
    { id: 'mock-7', specialtyName: 'Cardiologia', doctorName: 'Dra. Ana Souza', doctorId: 'doc-1', date: '2024-08-22', time: '09:00', status: 'completed', insuranceName: 'Unimed', location: 'Unidade Centro — Demonstração', type: 'consulta', source: 'mock' },
    { id: 'mock-8', specialtyName: 'Clínica Geral', doctorName: 'Dr. Fernando Costa', doctorId: 'doc-6', date: '2024-07-10', time: '10:00', status: 'completed', insuranceName: 'Unimed', location: 'Unidade Centro — Demonstração', type: 'consulta', source: 'mock' },
    { id: 'mock-9', specialtyName: 'Cardiologia', doctorName: 'Dra. Ana Souza', doctorId: 'doc-1', date: '2025-02-18', time: '10:00', status: 'pending', insuranceName: 'Unimed', location: 'Unidade Centro — Demonstração', type: 'exame', source: 'mock' }
  ];

  var MOCK_DOCS = [
    { id: 'mdoc-1', type: 'receita', name: 'Receita de medicação — Cardiologia', doctorId: 'doc-1', date: '2025-01-15', status: 'available' },
    { id: 'mdoc-2', type: 'exame', name: 'Eletrocardiograma — Resultado', doctorId: 'doc-1', date: '2025-01-15', status: 'available' },
    { id: 'mdoc-3', type: 'laudo', name: 'Laudo de consulta — Clínica Geral', doctorId: 'doc-6', date: '2025-01-15', status: 'available' },
    { id: 'mdoc-4', type: 'receita', name: 'Receita — Dermatologia', doctorId: 'doc-2', date: '2024-12-20', status: 'available' },
    { id: 'mdoc-5', type: 'exame', name: 'Ecocardiograma — Resultado', doctorId: 'doc-1', date: '2024-11-05', status: 'available' },
    { id: 'mdoc-6', type: 'laudo', name: 'Laudo ortopédico', doctorId: 'doc-3', date: '2024-11-05', status: 'pending' },
    { id: 'mdoc-7', type: 'receita', name: 'Receita — Ginecologia', doctorId: 'doc-5', date: '2024-10-12', status: 'available' }
  ];

  /* ---------- Sessão ---------- */
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); }
    catch (e) { return null; }
  }
  function clearSession() {
    try { localStorage.removeItem(SESSION_KEY); }
    catch (e) { /* ignore */ }
  }

  /* ---------- Agendamentos (localStorage + mock) ---------- */
  function loadStoredAppointments() {
    try { return JSON.parse(localStorage.getItem(APPT_KEY)) || []; }
    catch (e) { return []; }
  }
  function normalizeAppt(raw) {
    /* agendamentos do booking.js têm estrutura diferente */
    return {
      id: raw.id || ('appt-' + Math.random().toString(36).slice(2)),
      specialtyName: raw.specialtyName || (raw.specialty ? capitalize(raw.specialty) : 'Consulta'),
      doctorName: raw.doctorName || (raw.doctorId && DOCTOR_MAP[raw.doctorId] ? DOCTOR_MAP[raw.doctorId].name : 'Profissional'),
      doctorId: raw.doctorId || '',
      date: raw.date || '',
      time: raw.time || '',
      status: raw.status || 'pending',
      insuranceName: raw.insuranceName || (raw.insurance ? capitalize(raw.insurance) : '—'),
      location: raw.location || 'Unidade Centro — Demonstração',
      type: raw.type || 'consulta',
      source: raw.source || 'stored'
    };
  }
  function allAppointments() {
    var stored = loadStoredAppointments().map(normalizeAppt);
    var mock = MOCK_APPTS.map(normalizeAppt);
    /* stored primeiro, depois mock; ordenar por data desc */
    var list = stored.concat(mock);
    list.sort(function (a, b) {
      return (b.date || '').localeCompare(a.date || '');
    });
    return list;
  }

  /* ---------- Documentos ---------- */
  function allDocuments() {
    return MOCK_DOCS.slice().sort(function (a, b) {
      return (b.date || '').localeCompare(a.date || '');
    });
  }
  function examDocuments() {
    return allDocuments().filter(function (d) { return d.type === 'exame'; });
  }

  /* ---------- Helpers ---------- */
  function capitalize(s) {
    s = String(s || '');
    return s.replace(/(^|[\s-])([a-z])/g, function (_, p, c) { return p + c.toUpperCase(); });
  }
  function escapeText(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function formatDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }
  function formatDateShort(iso) {
    if (!iso) return '—';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  function statusLabel(s) {
    var map = { confirmed: 'Confirmada', pending: 'Pendente', completed: 'Concluída', cancelled: 'Cancelada', available: 'Disponível' };
    return map[s] || capitalize(s);
  }
  function typeLabel(t) {
    var map = { receita: 'Receita', exame: 'Exame', laudo: 'Laudo', consulta: 'Consulta' };
    return map[t] || capitalize(t);
  }
  function doctorName(id) {
    if (DOCTOR_MAP[id]) return DOCTOR_MAP[id].name;
    return 'Profissional demonstrativo';
  }

  /* ---------- Tabs ---------- */
  function activateTab(id) {
    $$('.portal-nav-link[data-tab]').forEach(function (btn) {
      var active = btn.getAttribute('data-tab') === id;
      btn.classList.toggle('portal-nav-active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
      if (active) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    $$('.portal-panel').forEach(function (p) {
      p.hidden = p.getAttribute('data-panel') !== id;
    });
    /* focus management */
    var panel = document.getElementById('panel-' + id);
    if (panel) {
      panel.setAttribute('tabindex', '-1');
      panel.focus({ preventScroll: true });
    }
    /* fecha drawer no mobile */
    closeDrawer();
  }

  /* ---------- Drawer mobile ---------- */
  function openDrawer() {
    var sb = document.getElementById('portal-sidebar');
    var ov = document.getElementById('portal-drawer-overlay');
    var tg = document.getElementById('portal-drawer-toggle');
    if (sb) sb.classList.add('open');
    if (ov) ov.hidden = false;
    if (tg) tg.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    var sb = document.getElementById('portal-sidebar');
    var ov = document.getElementById('portal-drawer-overlay');
    var tg = document.getElementById('portal-drawer-toggle');
    if (sb) sb.classList.remove('open');
    if (ov) ov.hidden = true;
    if (tg) tg.setAttribute('aria-expanded', 'false');
  }
  function toggleDrawer() {
    var sb = document.getElementById('portal-sidebar');
    if (sb && sb.classList.contains('open')) closeDrawer();
    else openDrawer();
  }

  /* ---------- Render: Visão geral ---------- */
  function renderOverview() {
    renderNextAppointment();
    renderKpis();
    renderOverviewUpcoming();
    renderOverviewDocs();
  }

  function renderNextAppointment() {
    var card = document.getElementById('next-appointment-card');
    if (!card) return;
    var list = allAppointments();
    /* próxima = primeira confirmada ou pendente com data futura/mais recente */
    var upcoming = list.filter(function (a) {
      return a.status === 'confirmed' || a.status === 'pending';
    });
    var appt = upcoming[0] || list[0];
    if (!appt) {
      card.innerHTML =
        '<div class="portal-next-empty">' +
        '<p class="text-muted">Nenhuma consulta agendada no momento.</p>' +
        '<a class="btn btn-primary" href="agendamento.html">Agendar consulta</a>' +
        '</div>';
      return;
    }
    card.innerHTML =
      '<div class="portal-next-head">' +
      '  <span class="portal-next-eyebrow eyebrow">Próxima consulta</span>' +
      '  <span class="badge badge-status ' + appt.status + '">' + statusLabel(appt.status) + '</span>' +
      '</div>' +
      '<div class="portal-next-body">' +
      '  <div class="portal-next-main">' +
      '    <h3>' + escapeText(appt.specialtyName) + '</h3>' +
      '    <p class="text-muted">' + escapeText(appt.doctorName) + '</p>' +
      '  </div>' +
      '  <div class="portal-next-meta">' +
      '    <p><span class="portal-next-meta-label">Data</span> ' + escapeText(formatDate(appt.date)) + ' · ' + escapeText(appt.time) + '</p>' +
      '    <p><span class="portal-next-meta-label">Local</span> ' + escapeText(appt.location) + '</p>' +
      '    <p><span class="portal-next-meta-label">Convênio</span> ' + escapeText(appt.insuranceName) + '</p>' +
      '  </div>' +
      '</div>' +
      '<div class="portal-next-actions">' +
      '  <a class="btn btn-ghost" href="agendamento.html">Agendar nova</a>' +
      '</div>';
  }

  function renderKpis() {
    var wrap = document.getElementById('portal-kpis');
    if (!wrap) return;
    var list = allAppointments();
    var upcoming = list.filter(function (a) { return a.status === 'confirmed' || a.status === 'pending'; }).length;
    var docs = allDocuments().length;
    var exams = examDocuments().length;
    var history = list.filter(function (a) { return a.status === 'completed'; }).length;
    var kpis = [
      { num: upcoming, label: 'Próximas consultas', icon: calendarIcon() },
      { num: docs, label: 'Documentos', icon: docIcon() },
      { num: exams, label: 'Exames', icon: flaskIcon() },
      { num: history, label: 'Histórico', icon: clockIcon() }
    ];
    wrap.innerHTML = kpis.map(function (k) {
      return '<div class="card portal-kpi">' +
        '<span class="portal-kpi-icon" aria-hidden="true">' + k.icon + '</span>' +
        '<span class="portal-kpi-num">' + k.num + '</span>' +
        '<span class="portal-kpi-label">' + escapeText(k.label) + '</span>' +
        '</div>';
    }).join('');
  }

  function renderOverviewUpcoming() {
    var wrap = document.getElementById('overview-upcoming');
    if (!wrap) return;
    var list = allAppointments().filter(function (a) {
      return a.status === 'confirmed' || a.status === 'pending';
    }).slice(0, 3);
    if (list.length === 0) {
      wrap.innerHTML = emptyState('Nenhuma consulta próxima', 'Agende sua próxima consulta para vê-la aqui.', 'agendamento.html', 'Agendar consulta');
      return;
    }
    wrap.innerHTML = '<ul class="portal-list">' + list.map(function (a) {
      return '<li class="portal-list-item">' +
        '<span class="portal-list-date">' + escapeText(formatDateShort(a.date)) + ' · ' + escapeText(a.time) + '</span>' +
        '<span class="portal-list-main">' + escapeText(a.specialtyName) + ' <span class="text-muted">' + escapeText(a.doctorName) + '</span></span>' +
        '<span class="badge badge-status ' + a.status + '">' + statusLabel(a.status) + '</span>' +
        '</li>';
    }).join('') + '</ul>';
  }

  function renderOverviewDocs() {
    var wrap = document.getElementById('overview-docs');
    if (!wrap) return;
    var list = allDocuments().slice(0, 3);
    if (list.length === 0) {
      wrap.innerHTML = emptyState('Nenhum documento', 'Seus documentos aparecerão aqui.', null, null);
      return;
    }
    wrap.innerHTML = '<ul class="portal-list">' + list.map(function (d) {
      return '<li class="portal-list-item">' +
        '<span class="portal-list-date">' + escapeText(formatDateShort(d.date)) + '</span>' +
        '<span class="portal-list-main">' + escapeText(d.name) + ' <span class="text-muted">' + escapeText(doctorName(d.doctorId)) + '</span></span>' +
        '<span class="badge">' + typeLabel(d.type) + '</span>' +
        '</li>';
    }).join('') + '</ul>';
  }

  /* ---------- Render: Consultas ---------- */
  function renderAppointments() {
    var wrap = document.getElementById('appointments-content');
    if (!wrap) return;
    var list = allAppointments();
    if (list.length === 0) {
      wrap.innerHTML = emptyState('Nenhuma consulta encontrada', 'Você ainda não tem consultas registradas.', 'agendamento.html', 'Agendar consulta');
      return;
    }
    var rows = list.map(function (a) {
      return '<tr>' +
        '<td data-label="Data">' + escapeText(formatDateShort(a.date)) + ' <span class="portal-cell-time">' + escapeText(a.time) + '</span></td>' +
        '<td data-label="Especialidade">' + escapeText(a.specialtyName) + '</td>' +
        '<td data-label="Médico">' + escapeText(a.doctorName) + '</td>' +
        '<td data-label="Status"><span class="badge badge-status ' + a.status + '">' + statusLabel(a.status) + '</span></td>' +
        '<td data-label="Ações" class="portal-cell-actions">' +
        '  <button type="button" class="link-btn" data-action="appt-detail" data-id="' + escapeText(a.id) + '">Ver detalhes</button>' +
        '  <button type="button" class="link-btn link-btn-danger" data-action="appt-cancel" data-id="' + escapeText(a.id) + '">Cancelar</button>' +
        '</td>' +
        '</tr>';
    }).join('');
    wrap.innerHTML =
      '<div class="table-wrap">' +
      '<table class="table portal-table">' +
      '<thead><tr><th>Data</th><th>Especialidade</th><th>Médico</th><th>Status</th><th>Ações</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table></div>';
  }

  /* ---------- Render: Documentos ---------- */
  function renderDocuments() {
    var wrap = document.getElementById('documents-content');
    if (!wrap) return;
    var list = allDocuments();
    if (list.length === 0) {
      wrap.innerHTML = emptyState('Nenhum documento', 'Seus documentos aparecerão aqui.', null, null);
      return;
    }
    var rows = list.map(function (d) {
      return '<tr>' +
        '<td data-label="Documento">' + escapeText(d.name) + '</td>' +
        '<td data-label="Data">' + escapeText(formatDateShort(d.date)) + '</td>' +
        '<td data-label="Médico">' + escapeText(doctorName(d.doctorId)) + '</td>' +
        '<td data-label="Tipo"><span class="badge">' + typeLabel(d.type) + '</span></td>' +
        '<td data-label="Status"><span class="badge badge-status ' + (d.status === 'available' ? 'confirmed' : 'pending') + '">' + statusLabel(d.status) + '</span></td>' +
        '<td data-label="Ações"><button type="button" class="link-btn" data-action="doc-view" data-id="' + escapeText(d.id) + '">Visualizar</button></td>' +
        '</tr>';
    }).join('');
    wrap.innerHTML =
      '<div class="table-wrap">' +
      '<table class="table portal-table">' +
      '<thead><tr><th>Documento</th><th>Data</th><th>Médico</th><th>Tipo</th><th>Status</th><th>Ações</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
      '</table></div>';
  }

  /* ---------- Render: Exames ---------- */
  function renderExams() {
    var wrap = document.getElementById('exams-content');
    if (!wrap) return;
    var list = examDocuments();
    if (list.length === 0) {
      wrap.innerHTML = emptyState('Nenhum exame', 'Seus exames aparecerão aqui.', null, null);
      return;
    }
    wrap.innerHTML = '<div class="grid-3 portal-exam-grid">' + list.map(function (d) {
      return '<div class="card portal-exam-card">' +
        '<span class="portal-exam-icon" aria-hidden="true">' + flaskIcon() + '</span>' +
        '<h3 class="portal-exam-name">' + escapeText(d.name) + '</h3>' +
        '<p class="text-muted portal-exam-meta">' + escapeText(formatDate(d.date)) + '</p>' +
        '<p class="text-muted portal-exam-meta">' + escapeText(doctorName(d.doctorId)) + '</p>' +
        '<span class="badge badge-status ' + (d.status === 'available' ? 'confirmed' : 'pending') + '">' + statusLabel(d.status) + '</span>' +
        '<button type="button" class="btn btn-ghost btn-block portal-exam-btn" data-action="exam-view" data-id="' + escapeText(d.id) + '">Ver resultado</button>' +
        '</div>';
    }).join('') + '</div>';
  }

  /* ---------- Modal de documento ---------- */
  function openDocModal(doc) {
    var modal = document.getElementById('doc-modal');
    var body = document.getElementById('doc-modal-body');
    var title = document.getElementById('doc-modal-title');
    if (!modal || !body) return;
    if (title) title.textContent = doc.name;
    body.innerHTML =
      '<dl class="portal-doc-list">' +
      '<div class="portal-doc-row"><dt>Tipo</dt><dd>' + escapeText(typeLabel(doc.type)) + '</dd></div>' +
      '<div class="portal-doc-row"><dt>Data</dt><dd>' + escapeText(formatDate(doc.date)) + '</dd></div>' +
      '<div class="portal-doc-row"><dt>Profissional</dt><dd>' + escapeText(doctorName(doc.doctorId)) + '</dd></div>' +
      '<div class="portal-doc-row"><dt>Status</dt><dd>' + escapeText(statusLabel(doc.status)) + '</dd></div>' +
      '</dl>' +
      '<p class="text-muted portal-doc-note">Este é um documento demonstrativo. Nenhum conteúdo médico real é exibido ou armazenado nesta aplicação.</p>';
    modal.classList.add('open');
    var closeBtn = document.getElementById('doc-modal-close');
    if (closeBtn) closeBtn.focus();
    document.addEventListener('keydown', escModal);
  }
  function closeDocModal() {
    var modal = document.getElementById('doc-modal');
    if (modal) modal.classList.remove('open');
    document.removeEventListener('keydown', escModal);
  }
  function escModal(e) { if (e.key === 'Escape') closeDocModal(); }

  function findDoc(id) {
    var all = allDocuments();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function findAppt(id) {
    var all = allAppointments();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  /* ---------- Perfil ---------- */
  function loadProfile() {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null; }
    catch (e) { return null; }
  }
  function saveProfile(p) {
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); }
    catch (e) { /* ignore */ }
  }
  function fillProfile() {
    var saved = loadProfile() || {};
    var name = document.getElementById('p-name');
    var email = document.getElementById('p-email');
    var phone = document.getElementById('p-phone');
    var birth = document.getElementById('p-birth');
    var ins = document.getElementById('p-insurance');
    var prefEmail = document.getElementById('pref-email');
    var prefWa = document.getElementById('pref-whatsapp');
    if (name) name.value = saved.name || 'Ana Costa';
    if (email) email.value = saved.email || 'ana@demo.com';
    if (phone) phone.value = saved.phone || '(11) 90000-0003';
    if (birth) birth.value = saved.birthDate || '1988-05-14';
    /* convênios */
    if (ins) {
      ins.innerHTML = '<option value="">Selecione...</option>';
      INSURANCE.forEach(function (i) {
        var o = document.createElement('option');
        o.value = i.slug; o.textContent = i.name;
        ins.appendChild(o);
      });
      ins.value = saved.insurance || 'unimed';
    }
    if (prefEmail) prefEmail.checked = saved.prefEmail !== false;
    if (prefWa) prefWa.checked = !!saved.prefWhatsapp;
  }

  function handleProfileSubmit(e) {
    e.preventDefault();
    var p = {
      name: (document.getElementById('p-name') || {}).value || '',
      email: (document.getElementById('p-email') || {}).value || '',
      phone: (document.getElementById('p-phone') || {}).value || '',
      birthDate: (document.getElementById('p-birth') || {}).value || '',
      insurance: (document.getElementById('p-insurance') || {}).value || '',
      prefEmail: !!(document.getElementById('pref-email') || {}).checked,
      prefWhatsapp: !!(document.getElementById('pref-whatsapp') || {}).checked
    };
    saveProfile(p);
    toast('Dados salvos (demonstração).');
  }

  /* ---------- Empty state ---------- */
  function emptyState(title, msg, href, btnLabel) {
    var html =
      '<div class="empty-state portal-empty">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>' +
      '<h3>' + escapeText(title) + '</h3>' +
      '<p>' + escapeText(msg) + '</p>';
    if (href && btnLabel) html += '<a class="btn btn-primary" href="' + escapeText(href) + '">' + escapeText(btnLabel) + '</a>';
    html += '</div>';
    return html;
  }

  /* ---------- Ícones ---------- */
  function calendarIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  }
  function docIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';
  }
  function flaskIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2v6l-5 9a3 3 0 0 0 3 4h10a3 3 0 0 0 3-4l-5-9V2"/><path d="M7 16h10M9 2h6"/></svg>';
  }
  function clockIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>';
  }

  /* ---------- Logout ---------- */
  function logout() {
    clearSession();
    toast('Sessão encerrada. Redirecionando...');
    setTimeout(function () { global.location.href = 'index.html'; }, 700);
  }

  /* ---------- Bind ---------- */
  function bind() {
    /* Tabs */
    $$('.portal-nav-link[data-tab]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activateTab(btn.getAttribute('data-tab'));
      });
    });

    /* Logout */
    var logoutBtn = document.getElementById('btn-logout');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);

    /* Drawer mobile */
    var drawerToggle = document.getElementById('portal-drawer-toggle');
    if (drawerToggle) drawerToggle.addEventListener('click', toggleDrawer);
    var overlay = document.getElementById('portal-drawer-overlay');
    if (overlay) overlay.addEventListener('click', closeDrawer);

    /* Modal close */
    var modalClose = document.getElementById('doc-modal-close');
    if (modalClose) modalClose.addEventListener('click', closeDocModal);
    var modal = document.getElementById('doc-modal');
    if (modal) modal.addEventListener('click', function (e) {
      if (e.target === modal) closeDocModal();
    });

    /* Delegação de ações (documentos, exames, consultas) */
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-action]');
      if (!btn) return;
      var action = btn.getAttribute('data-action');
      var id = btn.getAttribute('data-id');
      if (action === 'doc-view' || action === 'exam-view') {
        var doc = findDoc(id);
        if (doc) openDocModal(doc);
      } else if (action === 'appt-detail') {
        var appt = findAppt(id);
        if (appt) openDocModal({
          id: appt.id,
          name: appt.specialtyName + ' — ' + appt.doctorName,
          type: 'laudo',
          doctorId: appt.doctorId,
          date: appt.date,
          status: appt.status
        });
      } else if (action === 'appt-cancel') {
        toast('Funcionalidade demonstrativa — cancelamento não disponível.');
      }
    });

    /* Perfil */
    var form = document.getElementById('portal-profile-form');
    if (form) form.addEventListener('submit', handleProfileSubmit);
  }

  /* ---------- Init ---------- */
  function init() {
    var session = getSession();
    if (!session) {
      global.location.href = 'portal-login.html';
      return;
    }
    bind();
    fillProfile();
    renderOverview();
    renderAppointments();
    renderDocuments();
    renderExams();
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);

})(window);
