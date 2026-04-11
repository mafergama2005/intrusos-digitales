const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("highScore").textContent = highScore;

let enemigos = [];
let velocidad = 2;

// IMÁGENES
const fondo = new Image();
fondo.src = "assets/img/fondo.jpg";

const virus = new Image();
virus.src = "assets/img/virus.png";

// CREAR ENEMIGOS
function crearEnemigo() {
    enemigos.push({
        x: Math.random() * (canvas.width - 50),
        y: -50,
        size: 50,
        speed: velocidad + Math.random() * 2
    });
}

// DIBUJAR
function dibujar() {
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);

    enemigos.forEach((e, i) => {
        e.y += e.speed;

        ctx.drawImage(virus, e.x, e.y, e.size, e.size);

        // Si se escapa
        if (e.y > canvas.height) {
            enemigos.splice(i, 1);
        }
    });
}

// CLICK
canvas.addEventListener("click", function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    enemigos.forEach((enemy, index) => {
        if (
            mouseX > enemy.x &&
            mouseX < enemy.x + enemy.size &&
            mouseY > enemy.y &&
            mouseY < enemy.y + enemy.size
        ) {
            enemigos.splice(index, 1);
            score++;
            document.getElementById("score").textContent = score;

            // dificultad
            if (score % 5 === 0) {
                velocidad += 0.5;
            }

            // guardar highscore
            if (score > highScore) {
                localStorage.setItem("highScore", score);
                document.getElementById("highScore").textContent = score;
            }
        }
    });
});

// LOOP
function loop() {
    dibujar();

    if (Math.random() < 0.02) {
        crearEnemigo();
    }

    requestAnimationFrame(loop);
}

loop();