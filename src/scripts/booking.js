/* VivaMais — booking.js
   Lógica do wizard de agendamento em 5 etapas.
   Estado, navegação, validação, calendário, slots, formulário, .ics, localStorage.
   Dados demonstrativos. */

(function (global) {
  'use strict';

  var VM = global.VivaMais || (global.VivaMais = {});
  var $ = VM.$;
  var $$ = VM.$$;
  var toast = VM.toast;

  /* ---------- Dados ---------- */
  function loadData() {
    var node = document.getElementById('booking-data');
    if (!node) return { specialties: [], doctors: [], insurance: [] };
    try { return JSON.parse(node.textContent); }
    catch (e) { return { specialties: [], doctors: [], insurance: [] }; }
  }

  var DATA = loadData();
  var SPECIALTIES = DATA.specialties || [];
  var DOCTORS = DATA.doctors || [];
  var INSURANCE = DATA.insurance || [];

  /* ---------- Estado ---------- */
  var state = {
    step: 1,
    specialty: null,   // slug
    doctor: null,      // slug
    date: null,        // ISO yyyy-mm-dd
    time: null,        // HH:MM
    patient: { name: '', phone: '', email: '', insurance: '' }
  };

  var TOTAL_STEPS = 5;
  var CAL_MONTH = new Date();
  CAL_MONTH.setDate(1);

  /* ---------- Slots mock ---------- */
  var ALL_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
  /* Slots indisponíveis determinísticos por data (mock) */
  function unavailableSlots(dateIso) {
    if (!dateIso) return [];
    var sum = 0;
    for (var i = 0; i < dateIso.length; i++) sum += dateIso.charCodeAt(i);
    var n = sum % 4; // 0..3 indisponíveis
    var idx = [];
    var start = sum % ALL_SLOTS.length;
    for (var k = 0; k < n; k++) idx.push((start + k * 3) % ALL_SLOTS.length);
    return idx.map(function (i) { return ALL_SLOTS[i]; });
  }

  /* ---------- Helpers ---------- */
  function bySlug(list, slug) {
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i];
    return null;
  }
  function doctorsForSpecialty(slug) {
    return DOCTORS.filter(function (d) { return d.specialty === slug; });
  }
  function toIso(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }
  function isWeekend(d) {
    var w = d.getDay();
    return w === 0 || w === 6;
  }
  function isPast(d) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    return d.getTime() < today.getTime();
  }
  function monthName(m) {
    var names = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return names[m] || '';
  }

  /* ---------- Render: Etapa 1 — Especialidades ---------- */
  function renderSpecialties() {
    var grid = $('#specialty-grid');
    if (!grid) return;
    grid.innerHTML = '';
    SPECIALTIES.forEach(function (s) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wizard-select-card' + (state.specialty === s.slug ? ' selected' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', state.specialty === s.slug ? 'true' : 'false');
      btn.setAttribute('data-slug', s.slug);
      btn.setAttribute('aria-label', 'Selecionar especialidade ' + s.name);
      btn.innerHTML =
        '<span class="wizard-select-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="' + s.icon + '"/></svg></span>' +
        '<span class="wizard-select-body"><span class="wizard-select-name">' + escapeText(s.name) + '</span>' +
        '<span class="wizard-select-desc">' + escapeText(s.shortDescription) + '</span></span>' +
        '<span class="wizard-select-check" aria-hidden="true">' + checkIcon() + '</span>';
      btn.addEventListener('click', function () {
        state.specialty = s.slug;
        state.doctor = null;
        renderSpecialties();
        updateNav();
      });
      grid.appendChild(btn);
    });
  }

  /* ---------- Render: Etapa 2 — Profissionais ---------- */
  function renderDoctors() {
    var grid = $('#doctor-grid');
    var empty = $('#doctor-empty');
    if (!grid) return;
    grid.innerHTML = '';
    var list = doctorsForSpecialty(state.specialty);

    /* skeleton simulado */
    grid.classList.add('is-loading');
    var skel = document.createElement('div');
    skel.className = 'wizard-doctor-skeletons';
    for (var i = 0; i < 2; i++) {
      var sk = document.createElement('div');
      sk.className = 'card wizard-doctor-skel';
      sk.innerHTML =
        '<div class="skeleton skeleton-circle"></div>' +
        '<div class="skeleton skeleton-line"></div>' +
        '<div class="skeleton skeleton-line" style="width:60%"></div>';
      skel.appendChild(sk);
    }
    grid.appendChild(skel);

    setTimeout(function () {
      grid.classList.remove('is-loading');
      grid.innerHTML = '';
      if (list.length === 0) {
        if (empty) empty.hidden = false;
        return;
      }
      if (empty) empty.hidden = true;
      list.forEach(function (d) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'wizard-doctor-card' + (state.doctor === d.slug ? ' selected' : '');
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', state.doctor === d.slug ? 'true' : 'false');
        btn.setAttribute('data-slug', d.slug);
        btn.setAttribute('aria-label', 'Selecionar profissional ' + d.name);
        var areas = d.areas.map(function (a) { return '<span class="badge doctor-area-badge">' + escapeText(a) + '</span>'; }).join('');
        btn.innerHTML =
          '<span class="wizard-doctor-photo" aria-hidden="true"><img src="' + escapeText(d.photo) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'"></span>' +
          '<span class="wizard-doctor-body">' +
          '<span class="wizard-doctor-name">' + escapeText(d.name) + '</span>' +
          '<span class="wizard-doctor-crm">' + escapeText(d.crm) + ' · ' + escapeText(d.location) + '</span>' +
          '<span class="doctor-card-lg-areas">' + areas + '</span>' +
          '</span>' +
          '<span class="wizard-select-check" aria-hidden="true">' + checkIcon() + '</span>';
        btn.addEventListener('click', function () {
          state.doctor = d.slug;
          renderDoctors();
          updateNav();
        });
        grid.appendChild(btn);
      });
    }, 350);
  }

  /* ---------- Render: Etapa 3 — Calendário ---------- */
  function renderCalendar() {
    var cal = $('#calendar');
    var title = $('#cal-title');
    if (!cal) return;
    var y = CAL_MONTH.getFullYear();
    var m = CAL_MONTH.getMonth();
    if (title) title.textContent = monthName(m) + ' ' + y;

    var first = new Date(y, m, 1);
    var startDay = first.getDay(); // 0=dom
    var daysInMonth = new Date(y, m + 1, 0).getDate();

    cal.innerHTML = '';
    var headers = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    headers.forEach(function (h) {
      var hd = document.createElement('div');
      hd.className = 'wizard-cal-dow';
      hd.textContent = h;
      hd.setAttribute('role', 'columnheader');
      cal.appendChild(hd);
    });

    for (var i = 0; i < startDay; i++) {
      var blank = document.createElement('div');
      blank.className = 'wizard-cal-blank';
      blank.setAttribute('aria-hidden', 'true');
      cal.appendChild(blank);
    }

    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var availableCount = 0;
    for (var day = 1; day <= daysInMonth; day++) {
      var d = new Date(y, m, day);
      var iso = toIso(d);
      var weekend = isWeekend(d);
      var past = d.getTime() < today.getTime();
      var disabled = weekend || past;
      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'wizard-cal-day' + (disabled ? ' disabled' : '') + (state.date === iso ? ' selected' : '');
      cell.textContent = String(day);
      cell.setAttribute('data-date', iso);
      cell.setAttribute('role', 'gridcell');
      if (disabled) {
        cell.disabled = true;
        cell.setAttribute('aria-disabled', 'true');
        cell.setAttribute('tabindex', '-1');
      } else {
        cell.setAttribute('aria-label', d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }));
        availableCount++;
        cell.addEventListener('click', function (e) {
          state.date = e.currentTarget.getAttribute('data-date');
          state.time = null;
          renderCalendar();
          updateNav();
        });
      }
      cal.appendChild(cell);
    }

    /* Garantia: se não houver dias úteis no mês atual, avança automaticamente */
    if (availableCount === 0) {
      CAL_MONTH.setMonth(CAL_MONTH.getMonth() + 1);
      renderCalendar();
    }
  }

  /* ---------- Render: Etapa 4 — Slots ---------- */
  function renderSlots() {
    var wrap = $('#time-slots');
    if (!wrap) return;
    wrap.innerHTML = '';
    var unavail = unavailableSlots(state.date);
    ALL_SLOTS.forEach(function (slot) {
      var busy = unavail.indexOf(slot) !== -1;
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wizard-slot' + (busy ? ' unavailable' : '') + (state.time === slot ? ' selected' : '');
      btn.textContent = slot;
      btn.setAttribute('data-time', slot);
      btn.setAttribute('role', 'radio');
      if (busy) {
        btn.disabled = true;
        btn.setAttribute('aria-disabled', 'true');
        btn.setAttribute('aria-label', slot + ' indisponível');
      } else {
        btn.setAttribute('aria-checked', state.time === slot ? 'true' : 'false');
        btn.setAttribute('aria-label', 'Selecionar horário ' + slot);
        btn.addEventListener('click', function () {
          state.time = slot;
          renderSlots();
          updateNav();
        });
      }
      wrap.appendChild(btn);
    });
  }

  /* ---------- Render: Etapa 5 — Convênios ---------- */
  function fillInsurance() {
    var sel = $('#f-insurance');
    if (!sel) return;
    var current = sel.value;
    sel.innerHTML = '<option value="">Selecione...</option>';
    INSURANCE.forEach(function (ins) {
      var opt = document.createElement('option');
      opt.value = ins.slug;
      opt.textContent = ins.name;
      sel.appendChild(opt);
    });
    if (current) sel.value = current;
  }

  /* ---------- Navegação ---------- */
  function showPanel(n) {
    $$('.wizard-panel').forEach(function (p) { p.hidden = true; });
    var panel = $('#panel-' + n);
    if (panel) {
      panel.hidden = false;
      /* focus management */
      var title = panel.querySelector('.wizard-panel-title');
      if (title) {
        title.setAttribute('tabindex', '-1');
        title.focus({ preventScroll: true });
      }
    }
    /* progress */
    $$('.wizard-step').forEach(function (s) {
      var num = parseInt(s.getAttribute('data-step'), 10);
      s.classList.toggle('current', num === n);
      s.classList.toggle('done', num < n);
      if (num === n) s.setAttribute('aria-current', 'step');
      else s.removeAttribute('aria-current');
    });
    var info = $('#wizard-info');
    if (info) info.textContent = 'Etapa ' + n + ' de ' + TOTAL_STEPS;
    var prev = $('#btn-prev');
    if (prev) prev.disabled = n === 1;
    var next = $('#btn-next');
    if (next) {
      next.textContent = '';
      if (n === TOTAL_STEPS) {
        next.textContent = 'Confirmar agendamento';
      } else {
        next.textContent = 'Continuar ';
        next.insertAdjacentHTML('beforeend', arrowIcon());
      }
    }
    updateNav();
    /* render conteúdo da etapa */
    if (n === 1) renderSpecialties();
    if (n === 2) renderDoctors();
    if (n === 3) renderCalendar();
    if (n === 4) renderSlots();
    if (n === 5) fillInsurance();
  }

  function stepValid(n) {
    if (n === 1) return !!state.specialty;
    if (n === 2) return !!state.doctor;
    if (n === 3) return !!state.date;
    if (n === 4) return !!state.time;
    if (n === 5) return validateForm(true);
    return false;
  }

  function updateNav() {
    var next = $('#btn-next');
    if (!next) return;
    next.disabled = !stepValid(state.step);
  }

  function next() {
    if (!stepValid(state.step)) return;
    if (state.step === TOTAL_STEPS) {
      submitBooking();
      return;
    }
    state.step++;
    showPanel(state.step);
  }
  function prev() {
    if (state.step <= 1) return;
    state.step--;
    showPanel(state.step);
  }

  /* ---------- Validação do formulário ---------- */
  function validateForm(silent) {
    var ok = true;
    var fields = [
      { id: 'f-name', test: function (v) { return v.trim().length >= 3; }, err: 'err-name' },
      { id: 'f-phone', test: function (v) { return v.replace(/\D/g, '').length >= 10; }, err: 'err-phone' },
      { id: 'f-email', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, err: 'err-email' },
      { id: 'f-insurance', test: function (v) { return !!v; }, err: 'err-insurance' }
    ];
    fields.forEach(function (f) {
      var input = $('#' + f.id);
      var err = $('#' + f.err);
      var valid = f.test(input ? input.value : '');
      if (!silent) {
        if (input) input.classList.toggle('input-error', !valid);
        if (err) err.hidden = valid;
      }
      if (!valid) ok = false;
    });
    /* LGPD */
    var lgpd = $('#f-lgpd');
    var lgpdErr = $('#err-lgpd');
    var lgpdOk = lgpd ? lgpd.checked : false;
    if (!silent) {
      if (lgpdErr) lgpdErr.hidden = lgpdOk;
    }
    if (!lgpdOk) ok = false;
    return ok;
  }

  function showFieldError(id, errId, show) {
    var input = $('#' + id);
    var err = $('#' + errId);
    if (input) input.classList.toggle('input-error', show);
    if (err) err.hidden = !show;
  }

  function bindFormLive() {
    var map = [
      { id: 'f-name', err: 'err-name', test: function (v) { return v.trim().length >= 3; } },
      { id: 'f-phone', err: 'err-phone', test: function (v) { return v.replace(/\D/g, '').length >= 10; } },
      { id: 'f-email', err: 'err-email', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
      { id: 'f-insurance', err: 'err-insurance', test: function (v) { return !!v; } }
    ];
    map.forEach(function (f) {
      var input = $('#' + f.id);
      if (!input) return;
      input.addEventListener('blur', function () {
        var valid = f.test(input.value);
        showFieldError(f.id, f.err, !valid);
        updateNav();
      });
      input.addEventListener('input', function () {
        if (input.classList.contains('input-error')) {
          var valid = f.test(input.value);
          showFieldError(f.id, f.err, !valid);
        }
        updateNav();
      });
    });
    var lgpd = $('#f-lgpd');
    if (lgpd) lgpd.addEventListener('change', function () {
      showFieldError('f-lgpd', 'err-lgpd', !lgpd.checked);
      updateNav();
    });
    /* máscara de telefone */
    var phone = $('#f-phone');
    if (phone) phone.addEventListener('input', function () {
      phone.value = maskPhone(phone.value);
    });
  }

  function maskPhone(v) {
    var d = v.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return '(' + d;
    if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
    if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
    return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
  }

  /* ---------- Submit ---------- */
  function submitBooking() {
    if (!validateForm(false)) {
      updateNav();
      /* foca no primeiro campo inválido */
      var firstErr = document.querySelector('.input-error');
      if (firstErr) firstErr.focus({ preventScroll: false });
      toast('Verifique os campos destacados.');
      return;
    }
    state.patient.name = $('#f-name').value.trim();
    state.patient.phone = $('#f-phone').value.trim();
    state.patient.email = $('#f-email').value.trim();
    state.patient.insurance = $('#f-insurance').value;

    var appt = buildAppointment();
    saveAppointment(appt);
    renderConfirmation(appt);
    showConfirmation();
    toast('Agendamento registrado (demonstração).');
  }

  function buildAppointment() {
    var spec = bySlug(SPECIALTIES, state.specialty);
    var doc = bySlug(DOCTORS, state.doctor);
    var ins = bySlug(INSURANCE, state.patient.insurance);
    return {
      id: 'appt-' + Date.now(),
      specialty: state.specialty,
      specialtyName: spec ? spec.name : state.specialty,
      doctor: state.doctor,
      doctorName: doc ? doc.name : state.doctor,
      doctorCrm: doc ? doc.crm : '',
      date: state.date,
      time: state.time,
      insurance: state.patient.insurance,
      insuranceName: ins ? ins.name : state.patient.insurance,
      patient: { name: state.patient.name, phone: state.patient.phone, email: state.patient.email },
      location: doc ? doc.location : 'Unidade Centro — Demonstração',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
  }

  /* ---------- localStorage ---------- */
  var STORE_KEY = 'vivamais_appointments';
  function loadAppointments() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveAppointment(appt) {
    var list = loadAppointments();
    list.unshift(appt);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }

  /* ---------- Confirmação ---------- */
  function showConfirmation() {
    var wizard = $('#wizard');
    var nav = $('.wizard-nav');
    var conf = $('#confirmation');
    if (wizard) wizard.hidden = true;
    if (nav) nav.style.display = 'none';
    if (conf) conf.hidden = false;
    conf.setAttribute('tabindex', '-1');
    conf.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderConfirmation(appt) {
    var card = $('#confirmation-card');
    if (!card) return;
    var dateFmt = VM.formatDate ? VM.formatDate(appt.date) : appt.date;
    card.innerHTML =
      '<dl class="confirm-list">' +
      '<div class="confirm-row"><dt>Especialidade</dt><dd>' + escapeText(appt.specialtyName) + '</dd></div>' +
      '<div class="confirm-row"><dt>Profissional</dt><dd>' + escapeText(appt.doctorName) + (appt.doctorCrm ? ' · ' + escapeText(appt.doctorCrm) : '') + '</dd></div>' +
      '<div class="confirm-row"><dt>Data</dt><dd>' + escapeText(dateFmt) + '</dd></div>' +
      '<div class="confirm-row"><dt>Horário</dt><dd>' + escapeText(appt.time) + '</dd></div>' +
      '<div class="confirm-row"><dt>Convênio</dt><dd>' + escapeText(appt.insuranceName) + '</dd></div>' +
      '<div class="confirm-row"><dt>Local</dt><dd>' + escapeText(appt.location) + '</dd></div>' +
      '<div class="confirm-row"><dt>Paciente</dt><dd>' + escapeText(appt.patient.name) + '</dd></div>' +
      '</dl>' +
      '<span class="badge badge-status pending">Aguardando confirmação</span>';
  }

  /* ---------- .ics ---------- */
  function pad(n) { return String(n).padStart(2, '0'); }
  function icsDate(iso, time) {
    /* iso yyyy-mm-dd, time HH:MM -> YYYYMMDDTHHMMSS */
    var d = new Date(iso + 'T' + time + ':00');
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + 'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00';
  }
  function generateIcs(appt) {
    var dtStart = icsDate(appt.date, appt.time);
    var end = new Date(appt.date + 'T' + appt.time + ':00');
    end.setMinutes(end.getMinutes() + 30);
    var dtEnd = end.getFullYear() + pad(end.getMonth() + 1) + pad(end.getDate()) + 'T' + pad(end.getHours()) + pad(end.getMinutes()) + '00';
    var stamp = new Date();
    var dtStamp = stamp.getFullYear() + pad(stamp.getMonth() + 1) + pad(stamp.getDate()) + 'T' + pad(stamp.getHours()) + pad(stamp.getMinutes()) + pad(stamp.getSeconds());
    var loc = appt.location || 'VivaMais — Demonstração';
    var lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VivaMais//Demo//PT',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + appt.id + '@vivamais.demo',
      'DTSTAMP:' + dtStamp,
      'DTSTART:' + dtStart,
      'DTEND:' + dtEnd,
      'SUMMARY:Consulta ' + appt.specialtyName + ' — ' + appt.doctorName,
      'DESCRIPTION:Agendamento demonstrativo VivaMais. Paciente: ' + appt.patient.name + '. Convênio: ' + appt.insuranceName + '.',
      'LOCATION:' + loc,
      'STATUS:TENTATIVE',
      'END:VEVENT',
      'END:VCALENDAR'
    ];
    return lines.join('\r\n');
  }
  function downloadIcs() {
    var list = loadAppointments();
    var appt = list[0];
    if (!appt) return;
    var content = generateIcs(appt);
    var blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'vivamais-consulta-' + appt.date + '.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast('Arquivo .ics gerado para download.');
  }

  /* ---------- Reset ---------- */
  function resetWizard() {
    state.step = 1;
    state.specialty = null;
    state.doctor = null;
    state.date = null;
    state.time = null;
    state.patient = { name: '', phone: '', email: '', insurance: '' };
    CAL_MONTH = new Date();
    CAL_MONTH.setDate(1);
    var form = $('#booking-form');
    if (form) form.reset();
    $$('.field-error').forEach(function (e) { e.hidden = true; });
    $$('.input-error').forEach(function (e) { e.classList.remove('input-error'); });
    var wizard = $('#wizard');
    var nav = $('.wizard-nav');
    var conf = $('#confirmation');
    if (conf) conf.hidden = true;
    if (wizard) wizard.hidden = false;
    if (nav) nav.style.display = '';
    showPanel(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- URL params ---------- */
  function applyParams() {
    var p = VM.params ? VM.params() : {};
    if (p.specialty && bySlug(SPECIALTIES, p.specialty)) {
      state.specialty = p.specialty;
    }
    if (p.doctor && bySlug(DOCTORS, p.doctor)) {
      var doc = bySlug(DOCTORS, p.doctor);
      state.doctor = p.doctor;
      if (!state.specialty) state.specialty = doc.specialty;
    }
  }

  /* ---------- Ícones ---------- */
  function checkIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  }
  function arrowIcon() {
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  }
  function escapeText(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- Bind ---------- */
  function bind() {
    var nextBtn = $('#btn-next');
    var prevBtn = $('#btn-prev');
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);

    var calPrev = $('#cal-prev');
    var calNext = $('#cal-next');
    if (calPrev) calPrev.addEventListener('click', function () {
      CAL_MONTH.setMonth(CAL_MONTH.getMonth() - 1);
      renderCalendar();
    });
    if (calNext) calNext.addEventListener('click', function () {
      CAL_MONTH.setMonth(CAL_MONTH.getMonth() + 1);
      renderCalendar();
    });

    bindFormLive();

    var icsBtn = $('#btn-ics');
    var emailBtn = $('#btn-email');
    var newBtn = $('#btn-new');
    if (icsBtn) icsBtn.addEventListener('click', downloadIcs);
    if (emailBtn) emailBtn.addEventListener('click', function () {
      toast('Confirmação enviada para seu e-mail (demo).');
    });
    if (newBtn) newBtn.addEventListener('click', resetWizard);
  }

  /* ---------- Init ---------- */
  function init() {
    if (!document.getElementById('wizard')) return;
    applyParams();
    bind();
    showPanel(state.step);
    /* se veio specialty ou doctor, pode pular direto */
    if (state.specialty && state.doctor) {
      state.step = 3;
      showPanel(3);
    } else if (state.specialty) {
      state.step = 2;
      showPanel(2);
    }
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);

})(window);
