/* Aviso de cookies e armazenamento. Mostra-se uma vez e lembra a escolha no navegador.
   O site não usa cookies de publicidade nem de rastreio; o aviso só informa. */
(function () {
  var K = 'aviso-cookies-ok';
  try { if (localStorage.getItem(K)) return; } catch (e) {}
  var R = window.REST || {}, C = R.cores || {};
  var css = document.createElement('style');
  css.textContent =
    '#avisoCk{position:fixed;left:12px;right:12px;bottom:12px;z-index:9999;max-width:34rem;margin:0 auto;background:' + (C.texto || '#2b1d14') + ';color:' + (C.fundo || '#f6f0e6') + ';border-radius:16px;padding:14px 16px;box-shadow:0 18px 40px rgba(0,0,0,.35);font:400 .92rem/1.45 Lato,system-ui,sans-serif;display:flex;gap:12px;align-items:center;flex-wrap:wrap;transform:translateY(140%);transition:transform .5s cubic-bezier(.2,.8,.2,1)}' +
    '#avisoCk.on{transform:none}#avisoCk p{margin:0;flex:1 1 15rem}#avisoCk a{color:inherit;text-decoration:underline}' +
    '#avisoCk button{font:700 .92rem Lato,system-ui,sans-serif;border:0;border-radius:999px;padding:.55rem 1.2rem;background:' + (C.destaque || '#b5562b') + ';color:#fff;cursor:pointer}' +
    '#avisoCk button:focus-visible,#avisoCk a:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
    '@media (min-width:700px){#avisoCk{left:20px;right:auto;margin:0;bottom:20px}}' +
    '@media (prefers-reduced-motion:reduce){#avisoCk{transition:none}}';
  document.head.appendChild(css);
  function mostrar() {
    var d = document.createElement('div');
    d.id = 'avisoCk'; d.setAttribute('role', 'region'); d.setAttribute('aria-label', 'Aviso de cookies');
    d.innerHTML = '<p>Este site não usa cookies de publicidade nem de rastreio. Só guarda no seu dispositivo o que é preciso para funcionar. <a href="privacidade.html">Saber mais</a></p><button type="button">Percebi</button>';
    document.body.appendChild(d);
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('on'); }); });
    d.querySelector('button').addEventListener('click', function () {
      try { localStorage.setItem(K, '1'); } catch (e) {}
      d.classList.remove('on'); setTimeout(function () { d.remove(); }, 600);
    });
  }
  if (document.body) mostrar(); else document.addEventListener('DOMContentLoaded', mostrar);
})();
