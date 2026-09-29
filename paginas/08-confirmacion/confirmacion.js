/* ================================================================
   CONFIRMACION.JS - Sección "Confirma tu Asistencia"
   - Envía el formulario por WhatsApp
   - Muestra un mensaje de agradecimiento elegante
   ================================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const rsvpForm = document.getElementById("rsvpForm");

  // ⚠️ CAMBIA ESTE NÚMERO POR EL TUYO (Código de país + número, sin espacios)
  const NUMERO_WHATSAPP = "573142739961";

  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const asistencia = document.getElementById("asistencia").value;
    const personas = document.getElementById("personas").value;

    if (!nombre || !asistencia) {
      alert("Por favor completa todos los campos ✦");
      return;
    }

    // Armar mensaje de WhatsApp
    const mensaje =
        `¡Hola! Confirmo mi asistencia a los XV años de Keidy Julieth 💖%0A%0A` +
        `*Nombre:* ${nombre}%0A` +
        `*Asistencia:* ${asistencia}%0A` +
        `*Personas:* ${personas}`;

    window.open(
        `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`,
        "_blank"
    );

    // ✅ Reemplazar el formulario por un mensaje elegante
    rsvpForm.innerHTML = `
      <div class="gracias-container">
        <div class="gracias-icon">✦</div>
        <p class="gracias-titulo">¡Gracias!</p>
        <p class="gracias-sub">Tu confirmación ha sido enviada</p>
        <p class="gracias-detalle">Te esperamos con mucho cariño 💖</p>
      </div>
    `;
  });
});

// ================================================================
//  INICIALIZAR NAVEGACIÓN
// ================================================================
window.InvitacionNav.init(
    "../07-detalles/detalles.html",
    "../09-teesperamos/teesperamos.html"
);