/* Lógica propia de la página de Confirmación (RSVP) */
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

    const mensaje = `¡Hola! Confirmo mi asistencia a los XV años de Keidy Julieth 💖%0A%0A*Nombre:* ${nombre}%0A*Asistencia:* ${asistencia}%0A*Personas:* ${personas}`;
    window.open(`https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`, "_blank");

    rsvpForm.innerHTML = `
        <div style="text-align:center; padding: 20px;">
            <p style="font-family:'Great Vibes',cursive; font-size:2.5rem; color:#b30000; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">¡Gracias!</p>
            <p style="color:#4a0000; font-weight: bold;">Tu confirmación ha sido enviada ✦</p>
        </div>
    `;
  });
});

window.InvitacionNav.init("../07-detalles/detalles.html", "../09-teesperamos/teesperamos.html");
