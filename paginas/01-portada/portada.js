/* ================================================================
   PORTADA.JS - Video de YouTube con iframe directo (sin API)
   El video se reproduce en bucle y avanza al terminar un ciclo
   con un temporizador de respaldo.
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const skipBtn = document.getElementById('skipBtn');
  const tapOverlay = document.getElementById('tapOverlay');

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

    // 4. ⏱️ Temporizador de respaldo
    //    Como no podemos saber cuándo termina el video exactamente,
    //    usamos un temporizador manual.
    //    ✅ Ajusta este tiempo según la duración real de tu video
    temporizadorFin = setTimeout(() => {
      console.log('⏱️ Tiempo de video terminado, pasando a la siguiente página...');
      pasarSiguiente();
    }, 15000); // 15 segundos (ajusta según tu video)
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

  // ===== INICIALIZAR NAVEGACIÓN =====
  window.InvitacionNav.init(null, SIGUIENTE_PAGINA);
});