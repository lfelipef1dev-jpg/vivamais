/* VivaMais — app.js
   Utilitários compartilhados: datas, telefone, storage, router.
   Dados demonstrativos. */

(function (global) {
  'use strict';

  var VivaMais = global.VivaMais || (global.VivaMais = {});

  /* ---------- Date helpers ---------- */
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
  function relativeDate(iso) {
    if (!iso) return '—';
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    var days = Math.round((Date.now() - d.getTime()) / 86400000);
    if (days <= 0) return 'hoje';
    if (days === 1) return 'ontem';
    if (days < 30) return 'há ' + days + ' dias';
    if (days < 365) return 'há ' + Math.round(days / 30) + ' meses';
    return 'há ' + Math.round(days / 365) + ' anos';
  }

  /* ---------- Phone helpers ---------- */
  function formatPhone(value) {
    if (!value) return '';
    var digits = String(value).replace(/\D/g, '');
    if (digits.length === 11) return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7);
    if (digits.length === 10) return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 6) + '-' + digits.slice(6);
    return value;
  }

  /* ---------- Storage helpers (demo) ---------- */
  var STORE_KEY = 'vivamais_demo';
  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveStore(data) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); }
    catch (e) { /* ignore */ }
  }
  function setItem(key, value) {
    var s = loadStore(); s[key] = value; saveStore(s);
  }
  function getItem(key) { return loadStore()[key]; }
  function removeItem(key) { var s = loadStore(); delete s[key]; saveStore(s); }

  /* ---------- Router helpers (sem framework) ---------- */
  function params() {
    var q = global.location.search.replace(/^\?/, '');
    if (!q) return {};
    var out = {};
    q.split('&').forEach(function (pair) {
      var kv = pair.split('=');
      out[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
    });
    return out;
  }
  function navigate(path) { global.location.href = path; }

  /* ---------- DOM helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else if (k.slice(0, 5) === 'data-') node.setAttribute(k, attrs[k]);
      else if (k === 'aria') Object.keys(attrs[k]).forEach(function (a) { node.setAttribute('aria-' + a, attrs[k][a]); });
      else node[k] = attrs[k];
    });
    (children || []).forEach(function (c) { node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }

  /* ---------- Toast ---------- */
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    t.setAttribute('role', 'status');
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('show'); });
    setTimeout(function () {
      t.classList.remove('show');
      setTimeout(function () { t.remove(); }, 250);
    }, 3200);
  }

  /* ---------- Mobile menu ---------- */
  function initMenu() {
    var toggle = $('.menu-toggle');
    var links = $('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- Demo banner ---------- */
  function injectDemoNotice() {
    if (document.querySelector('[data-demo-banner]')) return;
    var b = document.createElement('div');
    b.setAttribute('data-demo-banner', '');
    b.style.cssText = 'background:#FFF7ED;color:#B45309;border-bottom:1px solid #FED7AA;font-size:0.8rem;text-align:center;padding:8px 16px;';
    b.textContent = 'Ambiente demonstrativo — todos os dados são fictícios.';
    var nav = document.querySelector('.navbar');
    if (nav && nav.parentNode) nav.parentNode.insertBefore(b, nav);
  }

  /* ---------- Init ---------- */
  function init() {
    initMenu();
    injectDemoNotice();
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);

  /* ---------- Export ---------- */
  VivaMais.formatDate = formatDate;
  VivaMais.formatDateShort = formatDateShort;
  VivaMais.relativeDate = relativeDate;
  VivaMais.formatPhone = formatPhone;
  VivaMais.storage = { get: getItem, set: setItem, remove: removeItem, all: loadStore };
  VivaMais.params = params;
  VivaMais.navigate = navigate;
  VivaMais.$ = $;
  VivaMais.$$ = $all;
  VivaMais.el = el;
  VivaMais.toast = toast;
})(window);
