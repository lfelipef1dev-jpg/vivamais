/* VivaMais — home-script.js
   Home page interactivity: search, chips, accordion, scroll spy,
   navbar shadow, global search overlay. Vanilla JS. */

(function (global) {
  'use strict';
  var VivaMais = global.VivaMais || (global.VivaMais = {});
  var $ = VivaMais.$ || function (s, r) { return (r || document).querySelector(s); };
  var $$ = VivaMais.$$ || function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- Embedded demo data (mirrors JSON) ---------- */
  var SPECIALTIES = [
    { slug: 'cardiologia', name: 'Cardiologia', desc: 'Saúde do coração e do sistema circulatório.', type: 'Especialidade' },
    { slug: 'dermatologia', name: 'Dermatologia', desc: 'Pele, cabelos e unhas com cuidado humano.', type: 'Especialidade' },
    { slug: 'ortopedia', name: 'Ortopedia', desc: 'Movimento, ossos, articulações e recuperação.', type: 'Especialidade' },
    { slug: 'pediatria', name: 'Pediatria', desc: 'Cuidado completo para crianças e adolescentes.', type: 'Especialidade' },
    { slug: 'ginecologia', name: 'Ginecologia', desc: 'Saúde da mulher em todas as fases.', type: 'Especialidade' },
    { slug: 'clinica-geral', name: 'Clínica Geral', desc: 'Porta de entrada para o cuidado contínuo.', type: 'Especialidade' }
  ];
  var DOCTORS = [
    { slug: 'ana-souza', name: 'Dra. Ana Souza', spec: 'Cardiologia', crm: 'CRM-DEMO-101', type: 'Profissional' },
    { slug: 'bruno-lima', name: 'Dr. Bruno Lima', spec: 'Dermatologia', crm: 'CRM-DEMO-102', type: 'Profissional' },
    { slug: 'carla-mendes', name: 'Dra. Carla Mendes', spec: 'Ortopedia', crm: 'CRM-DEMO-103', type: 'Profissional' },
    { slug: 'diana-rocha', name: 'Dra. Diana Rocha', spec: 'Pediatria', crm: 'CRM-DEMO-104', type: 'Profissional' },
    { slug: 'eduardo-santos', name: 'Dr. Eduardo Santos', spec: 'Ginecologia', crm: 'CRM-DEMO-105', type: 'Profissional' },
    { slug: 'fernando-costa', name: 'Dr. Fernando Costa', spec: 'Clínica Geral', crm: 'CRM-DEMO-106', type: 'Profissional' }
  ];
  var ARTICLES = [
    { slug: 'prevencao-cardiovascular-no-dia-a-dia', title: 'Prevenção cardiovascular no dia a dia', excerpt: 'Pequenos hábitos que protegem o coração a longo prazo.', type: 'Artigo' },
    { slug: 'cuidados-com-a-pele-no-verao', title: 'Cuidados com a pele no verão', excerpt: 'Proteção solar, hidratação e sinais de alerta.', type: 'Artigo' },
    { slug: 'lesoes-por-esforco-como-evitar', title: 'Lesões por esforço: como evitar', excerpt: 'Orientações para treinar com segurança.', type: 'Artigo' },
    { slug: 'vacinacao-infantil-o-que-mudou', title: 'Vacinação infantil: o que mudou', excerpt: 'Calendário atualizado e dúvidas comuns.', type: 'Artigo' },
    { slug: 'check-up-ginecologico-a-importancia', title: 'Check-up ginecológico: a importância da rotina', excerpt: 'Por que a prevenção anual faz diferença.', type: 'Artigo' },
    { slug: 'cuidado-continuo-em-clinica-geral', title: 'Cuidado contínuo em clínica geral', excerpt: 'O papel do clínico geral como coordenador.', type: 'Artigo' }
  ];

  function buildIndex() {
    var idx = [];
    SPECIALTIES.forEach(function (s) {
      idx.push({ type: s.type, title: s.name, sub: s.desc, href: 'especialidade-' + s.slug + '.html', terms: (s.name + ' ' + s.desc).toLowerCase() });
    });
    DOCTORS.forEach(function (d) {
      idx.push({ type: d.type, title: d.name, sub: d.spec + ' · ' + d.crm, href: 'medico-' + d.slug + '.html', terms: (d.name + ' ' + d.spec).toLowerCase() });
    });
    ARTICLES.forEach(function (a) {
      idx.push({ type: a.type, title: a.title, sub: a.excerpt, href: 'artigo-' + a.slug + '.html', terms: (a.title + ' ' + a.excerpt).toLowerCase() });
    });
    return idx;
  }
  var INDEX = buildIndex();

  function runSearch(query) {
    var q = String(query || '').trim().toLowerCase();
    if (!q || q.length < 2) return [];
    return INDEX.filter(function (it) { return it.terms.indexOf(q) !== -1; }).slice(0, 8);
  }

  /* ---------- Home inline search ---------- */
  function initHomeSearch() {
    var input = $('#home-search');
    var results = $('#home-search-results');
    if (!input || !results) return;

    function render(q) {
      var items = runSearch(q);
      if (!q || q.length < 2) { results.innerHTML = ''; return; }
      if (!items.length) {
        results.innerHTML = '<p class="search-empty">Nenhum resultado para "' + escapeText(q) + '". Tente outro termo.</p>';
        return;
      }
      results.innerHTML = items.map(function (it) {
        return '<a class="search-result-row" href="' + it.href + '">' +
          '<div class="search-result-row-info">' +
          '<span class="search-result-row-type">' + it.type + '</span>' +
          '<span class="search-result-row-title">' + escapeText(it.title) + '</span>' +
          '<span class="search-result-row-sub">' + escapeText(it.sub) + '</span>' +
          '</div>' +
          '<span class="search-result-row-link">Abrir →</span>' +
          '</a>';
      }).join('');
    }

    var debounce;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      var val = input.value;
      debounce = setTimeout(function () { render(val); }, 180);
      $$('.chip').forEach(function (c) { c.classList.toggle('active', c.getAttribute('data-search') && val.toLowerCase().indexOf(c.getAttribute('data-search').toLowerCase()) !== -1); });
    });

    $$('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var term = chip.getAttribute('data-search') || '';
        input.value = term;
        render(term);
        input.focus();
      });
    });
  }

  /* ---------- Global search overlay ---------- */
  function initSearchOverlay() {
    var btn = $('#nav-search-btn');
    var overlay = $('#search-overlay');
    var close = $('#search-overlay-close');
    var input = $('#search-overlay-input');
    var results = $('#search-overlay-results');
    if (!btn || !overlay) return;

    function open() {
      overlay.hidden = false;
      requestAnimationFrame(function () {
        overlay.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        if (input) input.focus();
      });
    }
    function closeOverlay() {
      overlay.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      setTimeout(function () { overlay.hidden = true; }, 200);
      if (input) input.value = '';
      if (results) results.innerHTML = '';
    }

    btn.addEventListener('click', function () {
      if (overlay.classList.contains('open')) closeOverlay(); else open();
    });
    if (close) close.addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); open(); }
    });

    if (input && results) {
      var debounce;
      input.addEventListener('input', function () {
        clearTimeout(debounce);
        var val = input.value;
        debounce = setTimeout(function () {
          var items = runSearch(val);
          if (!val || val.length < 2) { results.innerHTML = ''; return; }
          if (!items.length) {
            results.innerHTML = '<p class="search-overlay-empty">Nenhum resultado encontrado.</p>';
            return;
          }
          results.innerHTML = items.map(function (it) {
            return '<a class="search-result-item" href="' + it.href + '" role="option">' +
              '<span class="search-result-type">' + it.type + '</span>' +
              '<span class="search-result-title">' + escapeText(it.title) + '</span>' +
              '<span class="search-result-desc">' + escapeText(it.sub) + '</span>' +
              '</a>';
          }).join('');
        }, 180);
      });
    }
  }

  /* ---------- Navbar shadow on scroll ---------- */
  function initNavbarScroll() {
    var nav = $('#navbar');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('scrolled', global.scrollY > 8); }
    onScroll();
    global.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Scroll spy (active nav link) ---------- */
  function initScrollSpy() {
    var sections = $$('section[id]');
    var navLinks = $$('.nav-link');
    if (!sections.length || !navLinks.length) return;
    var map = {};
    navLinks.forEach(function (l) {
      var href = l.getAttribute('href') || '';
      if (href.indexOf('#') === 0) map[href.slice(1)] = l;
    });
    function onScroll() {
      var scrollPos = global.scrollY + 120;
      var current = null;
      sections.forEach(function (s) {
        if (s.offsetTop <= scrollPos) current = s.id;
      });
      navLinks.forEach(function (l) {
        var href = l.getAttribute('href') || '';
        var isActive = href.indexOf('#') === 0 && href.slice(1) === current;
        l.classList.toggle('nav-link-current', isActive);
        if (isActive) l.setAttribute('aria-current', 'page');
        else l.removeAttribute('aria-current');
      });
    }
    global.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Smooth scroll for in-page anchors ---------- */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.getElementById(href.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      var links = $('#nav-links');
      var toggle = $('.menu-toggle');
      if (links && links.classList.contains('open')) {
        links.classList.remove('open');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- FAQ accordion (native details, single-open) ---------- */
  function initFaqAccordion() {
    var items = $$('.faq-item');
    if (items.length < 2) return;
    items.forEach(function (item) {
      item.addEventListener('toggle', function () {
        if (item.open) {
          items.forEach(function (other) {
            if (other !== item && other.open) other.open = false;
          });
        }
      });
    });
  }

  /* ---------- Utils ---------- */
  function escapeText(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ---------- Init ---------- */
  function init() {
    initHomeSearch();
    initSearchOverlay();
    initNavbarScroll();
    initScrollSpy();
    initSmoothScroll();
    initFaqAccordion();
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})(window);
