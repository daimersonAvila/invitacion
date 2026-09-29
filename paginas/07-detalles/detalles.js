/* Lógica propia de la página "Detalles del Evento" */
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

window.InvitacionNav.init("../06-padrinos/padrinos.html", "../08-confirmacion/confirmacion.html");
