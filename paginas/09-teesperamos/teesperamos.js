/* ============================================================
   TEESPERAMOS.JS - Fuegos artificiales en canvas
   - Cohetes que suben desde la parte inferior
   - Explosión con partículas doradas, rojas y rosas
   - Lluvia continua de fuegos artificiales
   ============================================================ */

// ================================================================
//  CONFIGURACIÓN DEL CANVAS
// ================================================================
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

let W = 0;
let H = 0;

function ajustarCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
}

ajustarCanvas();
window.addEventListener('resize', ajustarCanvas);

// ================================================================
//  COLORES DE LOS FUEGOS ARTIFICIALES (paleta del proyecto)
// ================================================================
const COLORES = [
    { nombre: 'dorado',     rgb: [212, 175, 55] },
    { nombre: 'dorado-claro', rgb: [255, 215, 0] },
    { nombre: 'rojo',       rgb: [220, 30, 30] },
    { nombre: 'rojo-vino',  rgb: [179, 0, 0] },
    { nombre: 'rosa',       rgb: [255, 182, 193] },
    { nombre: 'rosa-fuerte',rgb: [255, 105, 140] },
    { nombre: 'crema',      rgb: [255, 245, 220] },
];

function colorAleatorio() {
    return COLORES[Math.floor(Math.random() * COLORES.length)];
}

// ================================================================
//  CLASE: COHETE (rocket)
// ================================================================
class Cohete {
    constructor(x, targetY, color) {
        this.x = x;
        this.y = H + 20;
        this.targetY = targetY;
        this.color = color;
        this.velocidad = 8 + Math.random() * 4;
        this.estela = [];
        this.explotado = false;
        this.gravedad = 0.15;
        this.tamano = 2 + Math.random() * 1.5;
    }

    actualizar() {
        // Guardar estela
        this.estela.push({ x: this.x, y: this.y });
        if (this.estela.length > 8) this.estela.shift();

        // Mover hacia arriba
        this.y -= this.velocidad;
        this.velocidad *= 0.995;

        // Verificar si llegó al punto de explosión
        if (this.y <= this.targetY || this.velocidad < 2) {
            this.explotado = true;
            return true; // Explotar
        }
        return false;
    }

    dibujar() {
        // Dibujar estela
        ctx.beginPath();
        for (let i = 0; i < this.estela.length; i++) {
            const p = this.estela[i];
            const alpha = i / this.estela.length;
            const [r, g, b] = this.color.rgb;
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, this.tamano * alpha, 0, Math.PI * 2);
            ctx.fill();
        }

        // Dibujar cohete
        const [r, g, b] = this.color.rgb;
        ctx.beginPath();
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowColor = `rgb(${r}, ${g}, ${b})`;
        ctx.shadowBlur = 15;
        ctx.arc(this.x, this.y, this.tamano, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ================================================================
//  CLASE: PARTÍCULA (chispas de explosión)
// ================================================================
class Particula {
    constructor(x, y, color, tipo = 'normal') {
        this.x = x;
        this.y = y;
        this.color = color;

        // Ángulo aleatorio
        const angulo = Math.random() * Math.PI * 2;
        const velocidadBase = tipo === 'grande' ? 3 : 2;
        const velocidad = velocidadBase + Math.random() * 4;

        this.vx = Math.cos(angulo) * velocidad;
        this.vy = Math.sin(angulo) * velocidad;

        this.vida = 1;
        this.decaimiento = 0.012 + Math.random() * 0.018;
        this.gravedad = 0.05;
        this.friccion = 0.985;

        // Tamaño
        if (tipo === 'grande') {
            this.tamano = 2 + Math.random() * 2;
        } else {
            this.tamano = 1 + Math.random() * 1.5;
        }

        // Centelleo
        this.centelleo = Math.random() > 0.7;
        this.centelleoFase = Math.random() * Math.PI * 2;
    }

    actualizar() {
        this.vx *= this.friccion;
        this.vy *= this.friccion;
        this.vy += this.gravedad;

        this.x += this.vx;
        this.y += this.vy;

        this.vida -= this.decaimiento;

        return this.vida <= 0;
    }

    dibujar() {
        const [r, g, b] = this.color.rgb;
        let alpha = Math.max(0, this.vida);

        // Efecto de centelleo
        if (this.centelleo) {
            this.centelleoFase += 0.3;
            if (Math.sin(this.centelleoFase) > 0.7) {
                alpha *= 0.3;
            }
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.shadowBlur = 12 * alpha;
        ctx.arc(this.x, this.y, this.tamano * this.vida, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// ================================================================
//  CLASE: EXPLOSIÓN (grupo de partículas)
// ================================================================
class Explosion {
    constructor(x, y, color) {
        this.particulas = [];
        this.terminada = false;

        // Elegir tipo de explosión
        const tipo = Math.random();
        let cantidad = 45;
        let tamanoTipo = 'normal';

        if (tipo > 0.85) {
            // Explosión grande con más partículas
            cantidad = 80;
            tamanoTipo = 'grande';
        } else if (tipo > 0.6) {
            cantidad = 60;
        } else {
            cantidad = 35;
        }

        // Crear partículas en todas direcciones
        for (let i = 0; i < cantidad; i++) {
            this.particulas.push(new Particula(x, y, color, tamanoTipo));
        }

        // Color secundario mezclado
        if (Math.random() > 0.5) {
            const colorSec = colorAleatorio();
            for (let i = 0; i < 15; i++) {
                this.particulas.push(new Particula(x, y, colorSec, 'normal'));
            }
        }
    }

    actualizar() {
        this.particulas = this.particulas.filter(p => !p.actualizar());
        this.terminada = this.particulas.length === 0;
    }

    dibujar() {
        this.particulas.forEach(p => p.dibujar());
    }
}

// ================================================================
//  ESTADO GLOBAL
// ================================================================
const cohetes = [];
const explosiones = [];

// ================================================================
//  LANZAR UN COHETE
// ================================================================
function lanzarCohete() {
    const x = W * (0.15 + Math.random() * 0.7); // entre 15% y 85% del ancho
    const targetY = H * (0.1 + Math.random() * 0.35); // entre 10% y 45% de altura
    const color = colorAleatorio();
    cohetes.push(new Cohete(x, targetY, color));
}

// ================================================================
//  LOOP PRINCIPAL DE ANIMACIÓN
// ================================================================
function animar() {
    // ✅ Fondo con desvanecimiento para efecto de estela
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, W, H);

    // ✅ Volver a modo normal para dibujar
    ctx.globalCompositeOperation = 'lighter';

    // Actualizar y dibujar cohetes
    for (let i = cohetes.length - 1; i >= 0; i--) {
        const cohete = cohetes[i];
        const explotar = cohete.actualizar();

        if (explotar) {
            // Crear explosión
            explosiones.push(new Explosion(cohete.x, cohete.y, cohete.color));
            cohetes.splice(i, 1);
        } else {
            cohete.dibujar();
        }
    }

    // Actualizar y dibujar explosiones
    for (let i = explosiones.length - 1; i >= 0; i--) {
        const ex = explosiones[i];
        ex.actualizar();
        ex.dibujar();

        if (ex.terminada) {
            explosiones.splice(i, 1);
        }
    }

    // ✅ Volver a modo normal
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(animar);
}

// Iniciar animación
animar();

// ================================================================
//  LLUVIA CONTINUA DE FUEGOS ARTIFICIALES
//  Con intervalos irregulares para que sea más natural
// ================================================================
function lluviaFuegos() {
    lanzarCohete();

    // Siguiente cohete en 400-1200ms
    const siguiente = 400 + Math.random() * 800;
    setTimeout(lluviaFuegos, siguiente);
}

// ✅ Inicio con lluvia inicial (varios cohetes juntos al principio)
setTimeout(() => {
    // Ráfaga inicial de 5 cohetes
    for (let i = 0; i < 5; i++) {
        setTimeout(lanzarCohete, i * 200);
    }

    // Luego lluvia continua
    setTimeout(lluviaFuegos, 1500);
}, 500);

// ================================================================
//  INICIALIZAR NAVEGACIÓN
// ================================================================
window.InvitacionNav.init(
    "../08-confirmacion/confirmacion.html",
    null // Es la última página
);

console.log('🎆 Fuegos artificiales iniciados');