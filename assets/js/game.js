const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let estado = "start";
let score = 0;
let vidas = 3;
let velocidad = 2;
let enemigos = [];
let explosiones = [];

let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").textContent = highScore;

// IMÁGENES
const fondo = new Image();
fondo.src = "assets/img/fondo.jpg";

const virus = new Image();
virus.src = "assets/img/virus.png";

const explosionImg = new Image();
explosionImg.src = "assets/img/explosion.png";

// CREAR ENEMIGO
function crearEnemigo() {
    enemigos.push({
        x: Math.random() * (canvas.width - 50),
        y: -50,
        size: 50,
        speed: velocidad + Math.random() * 2
    });
}

// CREAR EXPLOSIÓN
function crearExplosion(x, y) {
    explosiones.push({
        x: x,
        y: y,
        size: 20,
        alpha: 1
    });
}

// DIBUJAR
function dibujar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

    // ENEMIGOS
    enemigos.forEach((e, i) => {
        e.y += e.speed;
        ctx.drawImage(virus, e.x, e.y, e.size, e.size);

        // SI ESCAPA
        if (e.y > canvas.height) {
            enemigos.splice(i, 1);
            vidas--;
            document.getElementById("vidas").textContent = vidas;

            if (vidas <= 0) {
                vidas = 3;
                score = Math.max(0, score - 5);
                document.getElementById("score").textContent = score;
            }
        }
    });

    // EXPLOSIONES 💥
    explosiones.forEach((ex, i) => {
        ctx.globalAlpha = ex.alpha;
        ctx.drawImage(explosionImg, ex.x - 25, ex.y - 25, ex.size, ex.size);
        ctx.globalAlpha = 1;

        ex.size += 2;
        ex.alpha -= 0.05;

        if (ex.alpha <= 0) {
            explosiones.splice(i, 1);
        }
    });
}

// CLICK
canvas.addEventListener("click", function (e) {

    if (estado !== "playing") return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let hit = false;

    enemigos.forEach((enemy, index) => {
        if (
            mouseX > enemy.x &&
            mouseX < enemy.x + enemy.size &&
            mouseY > enemy.y &&
            mouseY < enemy.y + enemy.size
        ) {
            enemigos.splice(index, 1);
            score++;
            hit = true;

            document.getElementById("score").textContent = score;

            // DIFICULTAD
            if (score % 5 === 0) {
                velocidad += 0.5;
            }

            // HIGHSCORE
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", score);
                document.getElementById("highScore").textContent = score;
            }
        }
    });

    // CREAR EXPLOSIÓN SIEMPRE (le da estilo 😎)
    crearExplosion(mouseX, mouseY);
});

// INICIAR
function iniciarJuego() {
    estado = "playing";
    document.getElementById("menuInicio").style.display = "none";
}

// LOOP
function loop() {

    if (estado === "playing") {
        dibujar();

        if (Math.random() < 0.02) {
            crearEnemigo();
        }
    }

    requestAnimationFrame(loop);
}

loop();