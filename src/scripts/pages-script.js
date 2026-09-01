/* VivaMais — pages-script.js
   Interações das páginas de especialidades, profissionais, convênios e calendário.
   Vanilla JS. Light theme. Dados demonstrativos. */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function debounce(fn, wait) {
    var t;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, wait || 180);
    };
  }

  /* =========================================================
     1. Filtro de especialidades por nome (especialidades.html)
     ========================================================= */
  (function specSearch() {
    var input = $('#spec-search');
    var grid = $('#spec-grid');
    var empty = $('#spec-empty');
    if (!input || !grid) return;
    var cards = $all('.spec-card-lg', grid);

    function filter() {
      var q = input.value.trim().toLowerCase();
      var visible = 0;
      cards.forEach(function (card) {
        var keywords = card.getAttribute('data-keywords') || '';
        var match = !q || keywords.indexOf(q) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    }
    input.addEventListener('input', debounce(filter, 150));
  })();

  /* =========================================================
     2. Filtro de profissionais (profissionais.html)
     ========================================================= */
  (function doctorFilter() {
    var search = $('#doctor-search');
    var specChips = $all('.filter-chip');
    var insSelect = $('#insurance-filter');
    var grid = $('#doctor-grid');
    var empty = $('#doctor-empty');
    if (!grid) return;
    var cards = $all('.doctor-card-lg', grid);
    var state = { spec: 'all', insurance: 'all', q: '' };

    function apply() {
      var visible = 0;
      cards.forEach(function (card) {
        var spec = card.getAttribute('data-spec') || '';
        var ins = (card.getAttribute('data-insurance') || '').split(' ');
        var name = card.getAttribute('data-name') || '';
        var specOk = state.spec === 'all' || spec === state.spec;
        var insOk = state.insurance === 'all' || ins.indexOf(state.insurance) !== -1;
        var qOk = !state.q || name.indexOf(state.q) !== -1;
        var ok = specOk && insOk && qOk;
        card.style.display = ok ? '' : 'none';
        if (ok) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    }

    if (search) {
      search.addEventListener('input', debounce(function () {
        state.q = search.value.trim().toLowerCase();
        apply();
      }, 150));
    }
    specChips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        specChips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        state.spec = chip.getAttribute('data-spec') || 'all';
        apply();
      });
    });
    if (insSelect) {
      insSelect.addEventListener('change', function () {
        state.insurance = insSelect.value || 'all';
        apply();
      });
    }
  })();

  /* =========================================================
     3. Busca de convênios + toggle expand (convenios.html)
     ========================================================= */
  (function insurancePage() {
    var search = $('#insurance-search');
    var grid = $('#insurance-grid');
    var empty = $('#insurance-empty');
    if (!grid) return;
    var cards = $all('.insurance-card', grid);

    if (search) {
      search.addEventListener('input', debounce(function () {
        var q = search.value.trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
          var name = card.getAttribute('data-name') || '';
          var match = !q || name.indexOf(q) !== -1;
          card.style.display = match ? '' : 'none';
          if (match) visible++;
        });
        if (empty) empty.hidden = visible !== 0;
      }, 150));
    }

    $all('.insurance-card-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = $('#' + btn.getAttribute('aria-controls'));
        if (!target) return;
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        target.hidden = expanded;
      });
    });
  })();

  /* =========================================================
     4. Calendário de horários — selecionar slot
     Converte dia-da-semana (seg/ter/...) em data ISO real
     (próxima ocorrência desse dia útil) e monta deep link
     contextualizado para o agendamento.
     ========================================================= */
  (function schedule() {
    var grid = $('#schedule-grid');
    if (!grid) return;
    var slots = $all('.schedule-slot-free', grid);

    /* Mapa dia-da-semana → índice JS (0=Dom .. 6=Sáb) */
    var DAY_MAP = { dom: 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sab: 6 };

    function pad2(n) { return String(n).padStart(2, '0'); }
    function toIso(d) {
      return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
    }
    /* Próxima ocorrência (a partir de amanhã) do dia-da-semana informado */
    function nextDateForDay(dayKey) {
      var target = DAY_MAP[dayKey];
      if (target == null) return null;
      var d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 1); /* começa amanhã */
      while (d.getDay() !== target) d.setDate(d.getDate() + 1);
      return d;
    }

    slots.forEach(function (slot) {
      slot.addEventListener('click', function () {
        slots.forEach(function (s) { s.classList.remove('schedule-slot-selected'); s.removeAttribute('aria-pressed'); });
        slot.classList.add('schedule-slot-selected');
        slot.setAttribute('aria-pressed', 'true');
        var day = slot.getAttribute('data-day');
        var time = slot.getAttribute('data-time');
        var doctor = slot.getAttribute('data-doctor');
        var specialty = slot.getAttribute('data-specialty');
        var dateObj = nextDateForDay(day);
        var dateIso = dateObj ? toIso(dateObj) : '';
        var base = 'agendamento.html';
        var params = [];
        if (specialty) params.push('specialty=' + encodeURIComponent(specialty));
        if (doctor) params.push('doctor=' + encodeURIComponent(doctor));
        if (dateIso) params.push('date=' + encodeURIComponent(dateIso));
        if (time) params.push('time=' + encodeURIComponent(time));
        var url = base + (params.length ? '?' + params.join('&') : '');
        var vm = window.VivaMais;
        if (vm && typeof vm.toast === 'function') {
          vm.toast('Horário ' + time + ' selecionado. Redirecionando...');
        }
        setTimeout(function () { window.location.href = url; }, 600);
      });
    });
  })();

})();
