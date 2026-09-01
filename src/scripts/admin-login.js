/* VivaMais — admin-login.js (script)
   Lógica do login administrativo (demo).
   Salva sessão no localStorage e redireciona para admin.html. */

(function (global) {
  'use strict';

  var VM = global.VivaMais || (global.VivaMais = {});
  var toast = VM.toast;

  var SESSION_KEY = 'vivamais_admin_session';

  function validField(id, errId) {
    var input = document.getElementById(id);
    var err = document.getElementById(errId);
    var ok = !!input && input.value.trim().length > 0;
    if (input) input.classList.toggle('input-error', !ok);
    if (err) err.hidden = ok;
    return ok;
  }

  function saveSession(email) {
    var session = {
      name: 'Equipe VivaMais',
      email: email || 'admin@vivamais.demo',
      loggedAt: Date.now()
    };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
    catch (e) { /* ignore */ }
  }

  function handleSubmit(e) {
    e.preventDefault();
    var okEmail = validField('admin-email', 'err-admin-email');
    var okPass = validField('admin-pass', 'err-admin-pass');
    if (!okEmail || !okPass) {
      toast('Preencha os campos destacados.');
      return;
    }
    var emailInput = document.getElementById('admin-email');
    saveSession(emailInput ? emailInput.value.trim() : 'admin@vivamais.demo');
    toast('Acesso liberado. Redirecionando para o painel...');
    setTimeout(function () {
      global.location.href = 'admin.html';
    }, 700);
  }

  function init() {
    var form = document.getElementById('admin-login-form');
    if (form) form.addEventListener('submit', handleSubmit);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);

})(window);
