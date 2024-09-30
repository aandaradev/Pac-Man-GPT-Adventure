const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 25;  // Tamaño de cada tile (en píxeles)

// Definir el número de columnas y filas que tendrá el laberinto
const cols = 30;  // Número de columnas en el laberinto
const rows = 20;  // Número de filas en el laberinto

// Ajustar el tamaño del canvas según el tamaño del laberinto
canvas.width = cols * tileSize;
canvas.height = rows * tileSize;

// Colores
const pacmanColor = "yellow";
const ghostColor = "red";

// Cargar los sonidos
let pointSound = new Audio('sounds/point-sound.mp3');
let fruitSound = new Audio('sounds/fruit-sound.mp3');
let eatGhostSound = new Audio('sounds/eat-ghost-sound.mp3');
// Cargar el sonido cuando Pac-Man pierde una vida
let loseLifeSound = new Audio('sounds/lose-life-sound.mp3');

let isPaused = false;  // Variable que controla si el juego está pausado o no


const levels = [
    // Nivel 1 - Laberinto básico
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
        [1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // Nivel 2 - Laberinto más complicado
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 3, 1],
        [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
        [1, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1],
        [1, 2, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 2, 2, 4, 2, 2, 1, 2, 2, 2, 2, 1, 1, 2, 1],
        [1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
        [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
        [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 3, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
        [1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1],
        [1, 2, 1, 2, 1, 2, 2, 1, 2, 3, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2, 2, 1],
        [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];

// Laberinto ajustado al tamaño del canvas (20x30 tiles)
// Laberinto de tamaño 20x30, ajustado al canvas
let currentLevel = 0;  // Nivel inicial
let maze = levels[currentLevel];  // Laberinto del nivel actual

/*const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 1, 2, 2, 1, 2, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];*/

// Posiciones iniciales
let pacman = { x: 1, y: 1 };  // Posición inicial de Pac-Man
let ghosts = [
    { x: 10, y: 5, speed: 1 },
    { x: 15, y: 10, speed: 1 },
    { x: 5, y: 15, speed: 1 }
];

// Dirección de Pac-Man
let direction = { x: 0, y: 0 };

function drawTile(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawPacman() {
    ctx.font = "25px Arial";  // Tamaño de la fuente para el emoji
    ctx.fillText("😋", pacman.x * tileSize, pacman.y * tileSize + tileSize);  // Dibujar Pac-Man (emoji)
}

function drawGhosts() {
    ctx.font = "25px Arial";  // Tamaño de la fuente para los fantasmas
    ghosts.forEach(ghost => {
        ctx.fillText("👻", ghost.x * tileSize, ghost.y * tileSize + tileSize);  // Dibujar cada fantasma
    });
}

function drawPoints() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 2) {
                ctx.fillStyle = "white";  // Color de los puntos
                ctx.beginPath();
                ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 5, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawFruits() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 3) {  // Si es una fruta
                ctx.font = "25px Arial";  // Tamaño de la fuente para las frutas
                ctx.fillText("🍎", col * tileSize, row * tileSize + tileSize);  // Dibujar una cereza (puedes cambiarlo por otra fruta)
            }
        }
    }
}

function drawMaze() {
  for (let row = 0; row < maze.length; row++) {
      for (let col = 0; col < maze[row].length; col++) {
          if (maze[row][col] === 1) {
              drawTile(col, row, "#14033D");  // Dibujar las paredes en azul
          }
      }
  }
}

function drawPowerUps() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 4) {  // Si es un power-up
                ctx.fillStyle = "blue";  // Color del power-up
                ctx.beginPath();
                ctx.arc(col * tileSize + tileSize / 2, row * tileSize + tileSize / 2, 8, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}

function drawScore() {
    // Ajustar la posición del texto sobre la primera fila del laberinto
    ctx.fillStyle = "white";  // Color del texto
    ctx.font = "bold 24px Arial";  // Tamaño y fuente del texto

    // Sombra para el texto (opcional)
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;

    // Dibujar el texto en la parte superior del canvas, justo encima de la primera fila
    ctx.fillText("Puntuación: " + score, 20, 20);  // Ajuste de posición (x: 20, y: 30)

    // Restablecer la sombra
    ctx.shadowColor = "transparent";
}

let lives = 3;  // Pac-Man comienza con 3 vidas
function drawLives() {
    ctx.fillStyle = "white";  // Color del texto
    ctx.font = "bold 24px Arial";  // Tamaño y fuente del texto
    // Sombra para el texto (opcional)
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 4;
    ctx.fillText("Vidas: " + lives, 300, 20);  // Mostrar las vidas junto a la puntuación
}

function drawPauseMessage() {
    if (isPaused) {
        ctx.fillStyle = "white";
        ctx.font = "bold 48px Arial";
        ctx.fillText("Juego en pausa", canvas.width / 2 - 150, canvas.height / 2);
    }
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Manejo de eventos de teclado para mover a Pac-Man
window.addEventListener("keydown", function (event) {
  switch (event.key) {
      case "ArrowUp":
          direction = { x: 0, y: -1 };
          break;
      case "ArrowDown":
          direction = { x: 0, y: 1 };
          break;
      case "ArrowLeft":
          direction = { x: -1, y: 0 };
          break;
      case "ArrowRight":
          direction = { x: 1, y: 0 };
          break;
  }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'p' || event.key === 'P') {  // Tecla 'P' para pausar
        isPaused = !isPaused;  // Alternar entre pausado y en ejecución
        if (isPaused) {
            console.log("Juego pausado");
        } else {
            console.log("Juego reanudado");
        }
    }
});

// Evento para pausar y reanudar el juego con el botón
document.getElementById('pauseButton').addEventListener('click', function() {
    isPaused = !isPaused;  // Alternar entre pausa y reanudar

    if (isPaused) {
        this.textContent = "Reanudar";  // Cambiar el texto del botón a "Reanudar"
        console.log("Juego pausado");
    } else {
        this.textContent = "Pausar";  // Cambiar el texto del botón a "Pausar"
        console.log("Juego reanudado");
    }
});

let pacmanMoveDelay = 250;  // Tiempo en milisegundos entre movimientos de Pac-Man
let lastPacmanMoveTime = 0; // Última vez que Pac-Man se movió

function movePacman() {
    let currentTime = Date.now();  // Obtener el tiempo actual

    // Solo mover a Pac-Man si ha pasado el tiempo suficiente desde el último movimiento
    if (currentTime - lastPacmanMoveTime > pacmanMoveDelay) {
        let nextX = pacman.x + direction.x;
        let nextY = pacman.y + direction.y;

        // Verificar que la nueva posición de Pac-Man es un camino válido (0, 2, 3 o 4)
        if (maze[nextY] && (maze[nextY][nextX] === 0 || maze[nextY][nextX] === 2 || maze[nextY][nextX] === 3 || maze[nextY][nextX] === 4)) {
            pacman.x = nextX;
            pacman.y = nextY;
        }

        lastPacmanMoveTime = currentTime;  // Actualizar el tiempo del último movimiento
    }
}

let ghostMoveDelay = 500; // Tiempo en milisegundos entre movimientos de los fantasmas
let lastGhostMoveTime = 0; // Última vez que los fantasmas se movieron

function moveGhosts() {
    let currentTime = Date.now();  // Obtener el tiempo actual

    if (currentTime - lastGhostMoveTime > ghostMoveDelay) {
        ghosts.forEach(ghost => {
            // Si el power-up está activo, los fantasmas son "comestibles"
            if (powerUpActive) {
                // Cambia su comportamiento o color para mostrar que son vulnerables
                ctx.fillStyle = "blue";  // Por ejemplo, cambiar el color de los fantasmas
            }

            let dx = pacman.x - ghost.x;
            let dy = pacman.y - ghost.y;

            let moveX = 0;
            let moveY = 0;

            if (Math.abs(dx) > Math.abs(dy)) {
                moveX = Math.sign(dx);
            } else {
                moveY = Math.sign(dy);
            }

            let nextX = ghost.x + moveX;
            let nextY = ghost.y + moveY;

            // Verificar si la nueva posición es un camino (0) o contiene un punto (2)
            if (maze[nextY] && (maze[nextY][nextX] === 0 || maze[nextY][nextX] === 2)) {
                ghost.x = nextX;
                ghost.y = nextY;
            }
        });

        lastGhostMoveTime = currentTime;  // Actualizar el tiempo del último movimiento
    }
}

pointSound.volume = 0.5;  // Ajustar el volumen a la mitad
fruitSound.volume = 0.7;  // Ajustar el volumen de las frutas
eatGhostSound.volume = 1.0;  // Volumen máximo para comer fantasmas
loseLifeSound.volume = 0.8;  // Ajustar el volumen al 80%

function checkCollisions() {
    ghosts.forEach((ghost) => {
        if (pacman.x === ghost.x && pacman.y === ghost.y) {
            if (powerUpActive) {
                // Pac-Man se come al fantasma
                console.log("Fantasma comido!");
                ghost.x = 1;  // Posición inicial segura del fantasma
                ghost.y = 1;
                score += 100;  // Aumentar la puntuación por comer al fantasma
                eatGhostSound.play();  // Reproducir sonido de fantasma comido
            } else {
                // Si Pac-Man es atrapado y no tiene power-up
                console.log("Pac-Man ha sido atrapado por un fantasma!");
                loseLife();  // Llamar a la función para perder una vida
            }
        }
    });
}


let score = 0;  // Contador de puntos recogidos
let powerUpActive = false;  // Si Pac-Man puede comerse a los fantasmas
let powerUpTimer = 0;  // Temporizador para la duración del poder
let powerUpDuration = 5000;  // 5 segundos de duración

function checkObjectCollection() {
    const currentCell = maze[pacman.y][pacman.x];

    if (currentCell === 2) {  // Si es un punto
        maze[pacman.y][pacman.x] = 0;  // Eliminar el punto
        score += 10;  // Aumentar la puntuación
        pointSound.play();  // Reproducir sonido de punto recogido
        if (isLevelComplete()) {
            advanceToNextLevel();  // Pasar al siguiente nivel si el actual está completo
        }
        console.log("Punto recogido. Puntuación:", score);
    }
    else if (currentCell === 3) {  // Si es una fruta
        maze[pacman.y][pacman.x] = 0;  // Eliminar la fruta
        score += 50;  // Aumentar la puntuación por la fruta
        fruitSound.play();  // Reproducir sonido de fruta recogida
        console.log("Fruta recogida. Puntuación:", score);
    }
    else if (currentCell === 4) {  // Si es un power-up
        maze[pacman.y][pacman.x] = 0;  // Eliminar el power-up
        powerUpActive = true;  // Activar el poder
        powerUpTimer = Date.now();  // Comenzar el temporizador para el poder
        console.log("Power-up recogido. Pac-Man puede comerse a los fantasmas.");
    }
}

function updatePowerUpState() {
    if (powerUpActive && Date.now() - powerUpTimer > powerUpDuration) {
        powerUpActive = false;  // Desactivar el poder cuando termine el tiempo
        console.log("El poder de comer fantasmas ha terminado.");
    }
}

function loseLife() {
    lives--;  // Restar una vida

    // Reproducir el sonido cuando se pierde una vida
    loseLifeSound.play();

    if (lives > 0) {
        // Reiniciar la posición de Pac-Man y los fantasmas si aún quedan vidas
        pacman.x = 1;  // Reiniciar Pac-Man a su posición inicial
        pacman.y = 1;

        // Reiniciar la posición de los fantasmas
        ghosts = [
            { x: 10, y: 5, speed: 1 },
            { x: 15, y: 10, speed: 1 },
            { x: 5, y: 15, speed: 1 }
        ];

        console.log("Perdiste una vida. Vidas restantes: " + lives);
    } else {
        // Terminar el juego si no quedan vidas
        endGame();
    }
}

function isLevelComplete() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 2) {
                return false;  // Si queda al menos un punto, el nivel no está completo
            }
        }
    }
    return true;  // El nivel está completo si no quedan puntos
}

function advanceToNextLevel() {
    if (currentLevel < levels.length - 1) {
        currentLevel++;  // Incrementar el nivel
        maze = levels[currentLevel];  // Cargar el nuevo laberinto
        // Reiniciar Pac-Man y los fantasmas
        pacman.x = 1;
        pacman.y = 1;
        ghosts = [
            { x: 10, y: 5, speed: 1 },
            { x: 15, y: 10, speed: 1 },
            { x: 5, y: 15, speed: 1 }
        ];
        console.log("Nivel " + (currentLevel + 1) + " iniciado");
    } else {
        alert("¡Has completado todos los niveles!");
        resetGame();  // Reiniciar el juego cuando todos los niveles estén completos
    }
}

function endGame() {
    console.log("El juego ha terminado.");
    alert("¡El juego ha terminado! Puntuación final: " + score);
    // Aquí puedes reiniciar el juego o detener el bucle
    resetGame();  // Llamamos a una función para reiniciar el juego
}

function resetGame() {
    // Reiniciar la posición de Pac-Man y los fantasmas
    pacman.x = 1;
    pacman.y = 1;

    // Resetear la posición de los fantasmas
    ghosts = [
        { x: 10, y: 5, speed: 1 },
        { x: 15, y: 10, speed: 1 },
        { x: 5, y: 15, speed: 1 }
    ];

    //score = 0;  // Reiniciar la puntuación
    lives = 3;  // Restablecer las vidas a 3
    powerUpActive = false;  // Desactivar el power-up
}


function gameLoop() {
    if (!isPaused) {  // Solo continuar si el juego no está pausado
        clearCanvas();
        drawMaze();           // Dibujar el laberinto
        drawPoints();         // Dibujar los puntos
        drawFruits();         // Dibujar las frutas
        drawPowerUps();       // Dibujar los power-ups
        movePacman();         // Mover Pac-Man
        moveGhosts();         // Mover fantasmas
        checkCollisions();    // Verificar colisiones con los fantasmas
        checkObjectCollection();  // Verificar la recolección de puntos, frutas y power-ups
        updatePowerUpState();  // Actualizar el estado del power-up
        drawPacman();          // Dibujar Pac-Man
        drawGhosts();          // Dibujar fantasmas
        drawScore();          // Mostrar la puntuación
        drawLives();          // Mostrar las vidas
    } else {
        drawPauseMessage();  // Mostrar mensaje de pausa si el juego está pausado
    }

    requestAnimationFrame(gameLoop);  // Mantener el bucle del juego
}

gameLoop();
