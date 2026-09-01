/* VivaMais — search.js
   Busca global (placeholder). Indexa dados mockados em memória.
   Dados demonstrativos. */

(function (global) {
  'use strict';
  var VivaMais = global.VivaMais || (global.VivaMais = {});

  var index = [];
  var built = false;

  function build() {
    if (built) return index;
    built = true;
    // Index será populado pelos agentes seguintes conforme as páginas ganham dados.
    // Por ora, expõe a estrutura pronta para uso.
    return index;
  }

  function search(query) {
    build();
    var q = String(query || '').trim().toLowerCase();
    if (!q) return [];
    return index.filter(function (item) {
      return (item.title + ' ' + (item.description || '') + ' ' + (item.tags || []).join(' '))
        .toLowerCase().indexOf(q) !== -1;
    }).slice(0, 10);
  }

  function register(items) {
    build();
    (items || []).forEach(function (it) { index.push(it); });
  }

  VivaMais.search = search;
  VivaMais.searchRegister = register;
})(window);
