/* ============================================================
   DETALLES.JS - Lógica de la sección "Detalles del Evento"
   Navegación: 05-padre → 07-detalles → 08-confirmacion
   ============================================================ */

// ===== MARIPOSAS LOCAS =====
function hacerMariposasLocas() {
  const mariposas = document.querySelectorAll(".bfly");

  mariposas.forEach((mariposa) => {
    const tamaño = Math.random() * 40 + 20;
    mariposa.style.width = `${tamaño}px`;

    mariposa.style.left = `${Math.random() * 100}vw`;
    mariposa.style.top = `${Math.random() * 100}vh`;

    const duracion = Math.random() * 10 + 5;
    const retraso = Math.random() * 5;
    mariposa.style.animationDuration = `${duracion}s`;
    mariposa.style.animationDelay = `-${retraso}s`;

    const animaciones = ["vuelo-1", "vuelo-2", "vuelo-3", "vuelo-4"];
    const animacionElegida =
        animaciones[Math.floor(Math.random() * animaciones.length)];
    mariposa.style.animationName = animacionElegida;
    mariposa.style.animationIterationCount = "infinite";
    mariposa.style.animationTimingFunction = "ease-in-out";
  });
}
window.addEventListener("load", hacerMariposasLocas);

// ===== INICIALIZAR NAVEGACIÓN =====
// Anterior: 05-padre  |  Siguiente: 08-confirmacion
window.InvitacionNav.init(
    "../05-padre/padre.html",                 // ✅ CORREGIDO (antes era 06-padrinos)
    "../08-confirmacion/confirmacion.html"    // ✅ Siguiente correcto
);