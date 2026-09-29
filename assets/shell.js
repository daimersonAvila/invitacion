// ================================================================
//  SHELL.JS v3.1 - Música de YouTube + Navegación + Precarga
//  Optimizado para reducir el tiempo entre páginas
// ================================================================

console.log('🟢 SHELL.JS v3.1 CARGADO');

const musicBtn = document.getElementById('musicBtn');
const contentFrame = document.getElementById('contentFrame');
const youtubeAudio = document.getElementById('youtube-audio');

let musicaIniciada = false;
let musicaPausada = false;

// ================================================================
//  LISTA COMPLETA DE PÁGINAS (en orden) para la precarga
//  ⚠️ Ajusta los nombres si tu estructura es diferente
// ================================================================
const PAGINAS = [
  'paginas/01-portada/portada.html',
  'paginas/02-mis15/mis15.html',
  'paginas/03-keidy/keidy.html',
  'paginas/04-invitacion/invitacion.html',
  'paginas/05-padre/padre.html',
  'paginas/06-padrinos/padrinos.html',
  // Si tienes más, agrégalas aquí
];

// ================================================================
//  CACHÉ DE PRECARGA (evita duplicados)
// ================================================================
const paginasPrecargadas = new Set();

// ================================================================
//  COMANDO A YOUTUBE
// ================================================================
function enviarComandoYoutube(comando, args) {
  if (!youtubeAudio || !youtubeAudio.contentWindow) return;
  youtubeAudio.contentWindow.postMessage(
      JSON.stringify({ event: 'command', func: comando, args: args || [] }),
      '*'
  );
}

// ================================================================
//  INICIAR MÚSICA
// ================================================================
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

// ================================================================
//  ✅ PRECARGA: Descarga la siguiente página en segundo plano
// ================================================================
function precargarSiguiente(rutaActual) {
  // Normalizar la ruta actual
  const rutaLimpia = rutaActual
      .replace(/^.*?paginas\//, 'paginas/')
      .replace(/[?#].*$/, '');

  // Encontrar el índice de la página actual
  const indice = PAGINAS.findIndex(p => rutaLimpia.includes(p.split('/')[1]));
  if (indice === -1) return;
  if (indice === PAGINAS.length - 1) return;

  const siguiente = PAGINAS[indice + 1];

  // No precargar dos veces la misma
  if (paginasPrecargadas.has(siguiente)) return;
  paginasPrecargadas.add(siguiente);

  console.log('📥 Precargando:', siguiente);

  // Crear iframe invisible que carga la siguiente página
  const prefetch = document.createElement('iframe');
  prefetch.src = siguiente;
  prefetch.style.cssText =
      'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;top:-9999px;left:-9999px;';
  prefetch.setAttribute('aria-hidden', 'true');
  prefetch.setAttribute('tabindex', '-1');
  document.body.appendChild(prefetch);

  // Eliminar el iframe después de 15s (ya cumplió su función)
  setTimeout(() => {
    if (prefetch.parentNode) prefetch.remove();
  }, 15000);
}

// ================================================================
//  CAMBIAR DE PÁGINA (con transición suave)
// ================================================================
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

// Exponer globalmente
window.cambiarPagina = cambiarPagina;

// ================================================================
//  ESCUCHAR MENSAJES DEL IFRAME
// ================================================================
window.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.tipo === 'invitacion-musica') {
    console.log('📨 Mensaje: iniciar música');
    iniciarMusica();
  }

  if (event.data.tipo === 'invitacion-nav' && event.data.url) {
    console.log('📨 Mensaje: navegar a', event.data.url);
    cambiarPagina(event.data.url);
  }
});

// ================================================================
//  BOTÓN DE MÚSICA
// ================================================================
if (musicBtn) {
  musicBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!musicaIniciada) {
      iniciarMusica();
      return;
    }
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

// ================================================================
//  ✅ DETECTAR CUANDO EL IFRAME TERMINA DE CARGAR
//  Al terminar, precargamos la siguiente automáticamente
// ================================================================
contentFrame.addEventListener('load', () => {
  try {
    const rutaActual = contentFrame.contentWindow.location.pathname;
    precargarSiguiente(rutaActual);
  } catch (e) {
    // Ignorar errores de CORS si los hubiera
    console.warn('No se pudo leer la ruta del iframe:', e);
  }
});

// ================================================================
//  ✅ PRECARGA INICIAL (al cargar el shell)
//  Esperamos 1 segundo para no saturar la red al inicio
// ================================================================
setTimeout(() => {
  console.log('🚀 Iniciando precarga inicial...');
  // Precargar la segunda y tercera página
  [1, 2].forEach(i => {
    if (PAGINAS[i] && !paginasPrecargadas.has(PAGINAS[i])) {
      paginasPrecargadas.add(PAGINAS[i]);
      console.log('📥 Precargando (inicial):', PAGINAS[i]);

      const prefetch = document.createElement('iframe');
      prefetch.src = PAGINAS[i];
      prefetch.style.cssText =
          'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;top:-9999px;left:-9999px;';
      prefetch.setAttribute('aria-hidden', 'true');
      prefetch.setAttribute('tabindex', '-1');
      document.body.appendChild(prefetch);

      setTimeout(() => {
        if (prefetch.parentNode) prefetch.remove();
      }, 15000);
    }
  });
}, 1500);

console.log('✅ SHELL.JS v3.1 LISTO');