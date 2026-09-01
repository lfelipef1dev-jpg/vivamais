/* VivaMais — content-script.js
   Interações de blog, FAQ, artigos e cookies. Vanilla JS. Light theme. */

(function () {
  'use strict';

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
     1. BLOG — filtro por categoria + busca + paginação
     ========================================================= */
  (function blogFilters() {
    var grid = $('#blog-grid');
    if (!grid) return;
    var searchInput = $('#blog-search');
    var empty = $('#blog-empty');
    var pagination = $('#blog-pagination');
    var chips = $all('.blog-filter-chip');
    var items = $all('.blog-item', grid);
    var perPage = 6;
    var currentPage = 1;
    var currentCategory = 'Todos';
    var currentQuery = '';

    function getFiltered() {
      return items.filter(function (it) {
        var cat = it.getAttribute('data-category') || '';
        var title = it.getAttribute('data-title') || '';
        var catMatch = currentCategory === 'Todos' || cat === currentCategory;
        var queryMatch = !currentQuery || title.indexOf(currentQuery) !== -1;
        return catMatch && queryMatch;
      });
    }

    function render() {
      var filtered = getFiltered();
      var totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
      if (currentPage > totalPages) currentPage = totalPages;

      var start = (currentPage - 1) * perPage;
      var pageItems = filtered.slice(start, start + perPage);
      var pageIds = pageItems.map(function (it) { return it; });

      items.forEach(function (it) {
        it.style.display = pageIds.indexOf(it) !== -1 ? '' : 'none';
      });

      if (empty) empty.hidden = filtered.length !== 0;

      /* Paginação */
      if (pagination) {
        pagination.innerHTML = '';
        if (totalPages <= 1) {
          if (filtered.length === 0) { pagination.hidden = true; }
          else { pagination.hidden = true; }
          return;
        }
        pagination.hidden = false;

        var prev = document.createElement('button');
        prev.type = 'button';
        prev.className = 'blog-page-btn';
        prev.textContent = '‹ Anterior';
        prev.disabled = currentPage === 1;
        prev.addEventListener('click', function () { currentPage--; render(); window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' }); });
        pagination.appendChild(prev);

        for (var i = 1; i <= totalPages; i++) {
          (function (n) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'blog-page-btn' + (n === currentPage ? ' active' : '');
            btn.textContent = String(n);
            btn.setAttribute('aria-label', 'Página ' + n);
            if (n === currentPage) btn.setAttribute('aria-current', 'page');
            btn.addEventListener('click', function () { currentPage = n; render(); window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' }); });
            pagination.appendChild(btn);
          })(i);
        }

        var next = document.createElement('button');
        next.type = 'button';
        next.className = 'blog-page-btn';
        next.textContent = 'Próxima ›';
        next.disabled = currentPage === totalPages;
        next.addEventListener('click', function () { currentPage++; render(); window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' }); });
        pagination.appendChild(next);
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('active'); c.removeAttribute('aria-current'); });
        chip.classList.add('active');
        chip.setAttribute('aria-current', 'true');
        currentCategory = chip.getAttribute('data-category') || 'Todos';
        currentPage = 1;
        render();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', debounce(function () {
        currentQuery = searchInput.value.trim().toLowerCase();
        currentPage = 1;
        render();
      }, 200));
    }

    render();
  })();

  /* =========================================================
     2. FAQ — accordion single-open (nativo details/summary)
     ========================================================= */
  (function faqSingleOpen() {
    var list = $('.faq-single-list');
    if (!list) return;
    var items = $all('.faq-single', list);
    items.forEach(function (item) {
      var summary = $('.faq-q', item);
      item.addEventListener('toggle', function () {
        if (item.open) {
          items.forEach(function (other) {
            if (other !== item && other.open) other.open = false;
          });
          if (summary) summary.setAttribute('aria-expanded', 'true');
        } else {
          if (summary) summary.setAttribute('aria-expanded', 'false');
        }
      });
      /* Sincroniza aria-expanded ao clicar no summary */
      if (summary) {
        summary.addEventListener('click', function () {
          /* O toggle do details acontece depois; ajustamos no evento toggle acima */
        });
      }
    });
  })();

  /* =========================================================
     3. ARTIGO — Web Share API + copy link
     ========================================================= */
  (function articleShare() {
    var shareBtn = $('#article-share-btn');
    var copyBtn = $('#article-copy-btn');
    var url = window.location.href;

    if (shareBtn) {
      shareBtn.addEventListener('click', function () {
        var title = document.title;
        if (navigator.share) {
          navigator.share({ title: title, url: url }).catch(function () {});
        } else {
          copyToClipboard(url, shareBtn);
        }
      });
    }
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        copyToClipboard(url, copyBtn);
      });
    }

    function copyToClipboard(text, btn) {
      var done = false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { done = true; feedback(); }).catch(fallback);
      } else {
        fallback();
      }
      function fallback() {
        try {
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          done = true;
          feedback();
        } catch (e) { feedback(); }
      }
      function feedback() {
        if (!btn) return;
        var original = btn.textContent;
        btn.textContent = done ? 'Link copiado!' : 'Não foi possível copiar';
        setTimeout(function () { btn.textContent = original; }, 2000);
      }
    }
  })();

  /* =========================================================
     4. COOKIE BANNER — consentimento
     ========================================================= */
  (function cookieBanner() {
    var banner = $('#cookie-banner');
    if (!banner) return;
    var accept = $('#cookie-accept');
    var reject = $('#cookie-reject');
    var key = 'vivamais-cookie-consent';
    try {
      if (localStorage.getItem(key)) { banner.hidden = true; return; }
    } catch (e) {}
    /* Mostra com pequeno delay */
    setTimeout(function () { banner.classList.add('show'); banner.hidden = false; }, 600);

    function setConsent(value) {
      try { localStorage.setItem(key, value); } catch (e) {}
      banner.classList.remove('show');
      setTimeout(function () { banner.hidden = true; }, 200);
    }
    if (accept) accept.addEventListener('click', function () { setConsent('accepted'); });
    if (reject) reject.addEventListener('click', function () { setConsent('rejected'); });
  })();

})();
