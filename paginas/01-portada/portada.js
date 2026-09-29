/* ================================================================
   PORTADA.JS - Video de YouTube con botón "Saltar intro"
   - NO muestra la flecha de siguiente (nav-next)
   - Solo el botón "Saltar intro" avanza a la siguiente página
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const tapOverlay = document.getElementById('tapOverlay');
  const skipBtn = document.getElementById('skipBtn');

  const SIGUIENTE_PAGINA = '../02-mis15/mis15.html';

  let yaPaso = false;
  let videoIniciado = false;
  let temporizadorFin = null;

  // ===== PASAR A LA SIGUIENTE PÁGINA =====
  function pasarSiguiente() {
    if (yaPaso) return;
    yaPaso = true;

    if (temporizadorFin) clearTimeout(temporizadorFin);

    window.InvitacionNav.irA(SIGUIENTE_PAGINA, 'next');
  }

  // ===== ENVIAR MENSAJE AL SHELL PARA INICIAR MÚSICA =====
  function iniciarMusica() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ tipo: 'invitacion-musica' }, '*');
    }
  }

  // ===== COMENZAR TODO AL TOCAR EL OVERLAY =====
  function comenzar() {
    if (videoIniciado) return;
    videoIniciado = true;

    // 1. Iniciar música de fondo
    iniciarMusica();

    // 2. Ocultar el overlay
    if (tapOverlay) tapOverlay.classList.add('oculto');

    // 3. Mostrar el botón "Saltar intro" después de 1s
    setTimeout(() => {
      if (skipBtn) skipBtn.classList.remove('hidden');
    }, 1000);

    // 4. ⏱️ Temporizador de respaldo: avanza solo tras 15s
    temporizadorFin = setTimeout(() => {
      console.log('⏱️ Tiempo de video terminado, pasando a la siguiente página...');
      pasarSiguiente();
    }, 15000);
  }

  // ===== EVENTOS =====
  if (tapOverlay) {
    tapOverlay.addEventListener('click', comenzar);
    tapOverlay.addEventListener('touchstart', comenzar, { passive: true });
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      pasarSiguiente();
    });
  }

  // ===== INICIALIZAR NAVEGACIÓN (sin flechas en portada) =====
  // ⚠️ Pasar null como segundo parámetro evita que se cree la flecha "siguiente"
  window.InvitacionNav.init(null, null);

  // ✅ Ocultar la flecha "siguiente" si se creó por el nav.js
  setTimeout(() => {
    const btnNext = document.querySelector('.nav-next');
    if (btnNext) {
      btnNext.style.display = 'none';
      console.log('🚫 Flecha siguiente oculta en la portada');
    }
    const btnPrev = document.querySelector('.nav-prev');
    if (btnPrev) {
      btnPrev.style.display = 'none';
      console.log('🚫 Flecha anterior oculta en la portada');
    }
  }, 100);
});