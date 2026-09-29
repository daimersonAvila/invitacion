/* ============================================================
   DETALLES.JS - Sección "Detalles del Evento"
   - Mariposas grandes volando
   - Contador de tiempo hasta el 29 Nov 2026 a las 2:00 PM
   - ✅ Animación: overlay oscuro + contador sube + aparece el texto
   ============================================================ */

// ================================================================
//  ✅ CONFIGURACIÓN DE LA FECHA DEL EVENTO
//  29 de Noviembre de 2026 a las 2:00 PM (hora de Colombia UTC-5)
// ================================================================
const FECHA_EVENTO = new Date('2026-11-29T14:00:00-05:00').getTime();

// ================================================================
//  MARIPOSAS VOLANDO (más grandes)
// ================================================================
function hacerMariposasLocas() {
  const mariposas = document.querySelectorAll(".bfly");

  mariposas.forEach((mariposa) => {
    // Tamaño aleatorio GRANDE: entre 60px y 90px
    const tamaño = 60 + Math.random() * 30;
    mariposa.style.width = `${tamaño}px`;

    // Duración y retraso aleatorio
    const duracion = Math.random() * 6 + 6;
    const retraso = Math.random() * 3;
    mariposa.style.animationDuration = `${duracion}s`;
    mariposa.style.animationDelay = `-${retraso}s`;
  });
}
window.addEventListener("load", hacerMariposasLocas);

// ================================================================
//  ✅ CONTADOR DE TIEMPO
// ================================================================
function actualizarContador() {
  const ahora = new Date().getTime();
  const distancia = FECHA_EVENTO - ahora;

  // Si ya pasó la fecha
  if (distancia < 0) {
    const elD = document.getElementById('cd-dias');
    const elH = document.getElementById('cd-horas');
    const elM = document.getElementById('cd-min');
    const elS = document.getElementById('cd-seg');
    if (elD) elD.textContent = '00';
    if (elH) elH.textContent = '00';
    if (elM) elM.textContent = '00';
    if (elS) elS.textContent = '00';
    return;
  }

  // Cálculos de días, horas, minutos, segundos
  const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

  // Actualizar los elementos en el HTML
  const elDias = document.getElementById('cd-dias');
  const elHoras = document.getElementById('cd-horas');
  const elMin = document.getElementById('cd-min');
  const elSeg = document.getElementById('cd-seg');

  if (elDias) elDias.textContent = String(dias).padStart(2, '0');
  if (elHoras) elHoras.textContent = String(horas).padStart(2, '0');
  if (elMin) elMin.textContent = String(minutos).padStart(2, '0');
  if (elSeg) elSeg.textContent = String(segundos).padStart(2, '0');
}

// Iniciar el contador cuando se carga la página
window.addEventListener('load', () => {
  actualizarContador();
  // Actualizar cada segundo
  setInterval(actualizarContador, 1000);
});

// ================================================================
//  ✅ ANIMACIÓN DE ENTRADA
//  1. Al entrar, todo se ve oscuro (overlay al 92% de opacidad)
//  2. Solo se ven los 2 contadores (el central y el del shell)
//  3. A los 1.5s, el contador del shell SUBE hacia el centro
//  4. Cuando llega, el overlay desaparece y aparece todo el texto
// ================================================================
function iniciarAnimacionEntrada() {
  const overlay = document.getElementById('introOverlay');

  console.log('🎬 Iniciando animación de entrada a Detalles');

  // A los 1.5s, pedir al shell que suba su contador
  setTimeout(() => {
    console.log('⬆️ Pidiendo al shell que suba su contador');

    // Enviar mensaje al shell para que anime su contador
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ tipo: 'sube-contador' }, '*');
    }

    // A los 1.2s más (cuando el contador ya subió), quitar el overlay
    setTimeout(() => {
      console.log('✨ Revelando el contenido de Detalles');
      if (overlay) overlay.classList.add('oculto');
    }, 1200);

  }, 1500);
}

// Iniciar animación cuando el DOM esté listo
window.addEventListener('load', iniciarAnimacionEntrada);

// ================================================================
//  INICIALIZAR NAVEGACIÓN
// ================================================================
window.InvitacionNav.init(
    "../05-padre/padre.html",
    "../08-confirmacion/confirmacion.html"
);