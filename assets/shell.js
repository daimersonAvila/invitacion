// ================================================================
//  SHELL.JS v3.0 - Música de YouTube + Navegación (doble soporte)
// ================================================================

console.log('🟢 SHELL.JS v3.0 CARGADO');

const musicBtn = document.getElementById('musicBtn');
const contentFrame = document.getElementById('contentFrame');
const youtubeAudio = document.getElementById('youtube-audio');

let musicaIniciada = false;
let musicaPausada = false;

// ===== COMANDO A YOUTUBE =====
function enviarComandoYoutube(comando, args) {
  if (!youtubeAudio || !youtubeAudio.contentWindow) return;
  youtubeAudio.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: comando, args: args || [] }),
      '*'
  );
}

// ===== INICIAR MÚSICA =====
function iniciarMusica() {
  if (musicaIniciada) return;
  musicaIniciada = true;
  console.log('🎵 Iniciando música');
  enviarComandoYoutube('seekTo', [26, true]);
  enviarComandoYoutube('unMute');
  enviarComandoYoutube('setVolume', [40]);
  enviarComandoYoutube('playVideo');
  if (musicBtn) musicBtn.classList.add('playing');
}

// ===== CAMBIAR DE PÁGINA =====
function cambiarPagina(ruta) {
  console.log('📄 Cambiando a:', ruta);
  if (!musicaIniciada) iniciarMusica();
  if (!contentFrame) return;
  if (contentFrame.src.endsWith(ruta)) return;

  contentFrame.style.transition = 'opacity 0.5s ease';
  contentFrame.style.opacity = '0';

  setTimeout(() => {
    contentFrame.src = ruta;
    contentFrame.onload = () => {
      contentFrame.style.opacity = '1';
    };
  }, 400);
}

// Exponer globalmente (por si el iframe llama directamente)
window.cambiarPagina = cambiarPagina;

// ===== ESCUCHAR MENSAJES DEL IFRAME (doble sistema) =====
window.addEventListener('message', (event) => {
  if (!event.data) return;

  // Sistema nuevo: iniciar música
  if (event.data.tipo === 'invitacion-musica') {
    console.log('📨 Mensaje: iniciar música');
    iniciarMusica();
  }

  // Sistema viejo Y nuevo: navegación
  if (event.data.tipo === 'invitacion-nav' && event.data.url) {
    console.log('📨 Mensaje: navegar a', event.data.url);
    cambiarPagina(event.data.url);
  }
});

// ===== BOTÓN DE MÚSICA =====
if (musicBtn) {
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!musicaIniciada) { iniciarMusica(); return; }
    if (musicaPausada) {
      enviarComandoYoutube('unMute');
      enviarComandoYoutube('setVolume', [40]);
      enviarComandoYoutube('playVideo');
      musicBtn.classList.add('playing');
      musicaPausada = false;
    } else {
      enviarComandoYoutube('pauseVideo');
      musicBtn.classList.remove('playing');
      musicaPausada = true;
    }
  });
}

console.log('✅ SHELL.JS v3.0 LISTO');