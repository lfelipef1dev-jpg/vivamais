/* VivaMais — portal-login.js (script)
   Lógica do login do portal (demo).
   Salva sessão no localStorage e redireciona para portal.html. */

(function (global) {
  'use strict';

  var VM = global.VivaMais || (global.VivaMais = {});
  var $ = VM.$;
  var toast = VM.toast;

  var SESSION_KEY = 'vivamais_patient_session';

  function validField(id, errId) {
    var input = document.getElementById(id);
    var err = document.getElementById(errId);
    var ok = !!input && input.value.trim().length > 0;
    if (input) input.classList.toggle('input-error', !ok);
    if (err) err.hidden = ok;
    return ok;
  }

  function saveSession() {
    var session = {
      name: 'Ana Costa',
      email: 'ana@demo.com',
      loggedAt: Date.now()
    };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(session)); }
    catch (e) { /* ignore */ }
  }

  function handleSubmit(e) {
    e.preventDefault();
    var okId = validField('login-id', 'err-login-id');
    var okPass = validField('login-pass', 'err-login-pass');
    if (!okId || !okPass) {
      toast('Preencha os campos destacados.');
      return;
    }
    saveSession();
    toast('Bem-vinda, Ana! Redirecionando...');
    setTimeout(function () {
      global.location.href = 'portal.html';
    }, 700);
  }

  function init() {
    var form = document.getElementById('portal-login-form');
    if (form) form.addEventListener('submit', handleSubmit);

    var forgot = document.getElementById('link-forgot');
    if (forgot) forgot.addEventListener('click', function () {
      toast('Funcionalidade demonstrativa — recuperação de senha não disponível.');
    });

    var signup = document.getElementById('link-signup');
    if (signup) signup.addEventListener('click', function () {
      toast('Funcionalidade demonstrativa — cadastro não disponível. Use qualquer e-mail e senha.');
    });
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);

})(window);
