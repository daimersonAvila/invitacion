/* ============================================================
   DETALLES.JS - Sección "Detalles del Evento"
   - Mariposas grandes volando
   - Contador de tiempo hasta el 29 Nov 2026 a las 2:00 PM
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
    // ✅ Tamaño aleatorio GRANDE: entre 60px y 90px
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
    document.getElementById('cd-dias').textContent = '00';
    document.getElementById('cd-horas').textContent = '00';
    document.getElementById('cd-min').textContent = '00';
    document.getElementById('cd-seg').textContent = '00';
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
//  INICIALIZAR NAVEGACIÓN
// ================================================================
window.InvitacionNav.init(
    "../05-padre/padre.html",
    "../08-confirmacion/confirmacion.html"
);