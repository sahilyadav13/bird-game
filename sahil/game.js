const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const GRAVITY = 0.6;
const FLAP_STRENGTH = -7;
const SPAWN_RATE = 120; // Slower pipe spawn rate
const PIPE_WIDTH = 60;
const PIPE_SPACING = 200; // Increased gap between pipes
const BIRD_SIZE = 40; // Adjusted size for the bird image

// Canvas size
canvas.width = 400;
canvas.height = 600;

// Game state
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdFlap = false;

let pipes = [];
let frame = 0;
let score = 0;
let isGameOver = false;

// Load bird image
const birdImage = new Image();
birdImage.src = "https://img.favpng.com/7/8/11/bird-flight-animation-clip-art-png-favpng-ge3xwB69n6UrjNs043KmjHcM9.jpg";

// Event listeners
document.addEventListener('keydown', () => {
    if (!isGameOver) {
        birdFlap = true; // Make the bird jump
    } else {
        resetGame(); // Restart the game on game over
    }
});

// Draw the bird image
function drawBird() {
    if (birdImage.complete) {
        ctx.drawImage(birdImage, 50, birdY, BIRD_SIZE, BIRD_SIZE);
    } else {
        // Optional: Draw fallback yellow square if image isn't loaded
        ctx.fillStyle = 'yellow';
        ctx.fillRect(50, birdY, BIRD_SIZE, BIRD_SIZE);
    }
}

function drawBackground() {
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }
}

const backgroundImage = new Image();
backgroundImage.src = "https://cdn.gamedevmarket.net/wp-content/uploads/20191203145553/d874367282cec41be1ac5d8000899d2a.png"; // Replace with a valid wildlife image URL



// Draw pipes
function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.top); // Top pipe
        ctx.fillRect(pipe.x, pipe.bottom, PIPE_WIDTH, canvas.height - pipe.bottom); // Bottom pipe
    });
}

// Move pipes and generate new ones
function movePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 3; // Move pipes to the left
    });

    // Remove pipes that are off-screen
    if (pipes.length && pipes[0].x + PIPE_WIDTH <= 0) {
        pipes.shift();
    }

    // Generate new pipes periodically
    if (frame % SPAWN_RATE === 0) {
        const gap = Math.random() * (canvas.height - PIPE_SPACING - 50) + 50;
        pipes.push({
            x: canvas.width,
            top: gap - PIPE_SPACING / 2,
            bottom: gap + PIPE_SPACING / 2
        });
    }
}

// Check for collisions
function checkCollisions() {
    // Bird hits the ground or top of the canvas
    if (birdY + BIRD_SIZE >= canvas.height || birdY <= 0) {
        isGameOver = true;
    }

    // Bird hits a pipe
    pipes.forEach(pipe => {
        if (
            50 + BIRD_SIZE > pipe.x && // Bird's right side
            50 < pipe.x + PIPE_WIDTH && // Bird's left side
            (birdY < pipe.top || birdY + BIRD_SIZE > pipe.bottom) // Bird hits top or bottom pipe
        ) {
            isGameOver = true;
        }
    });
}

// Main game loop
function updateGame() {
    if (isGameOver) return;

    // Update bird mechanics
    birdVelocity += GRAVITY;
    if (birdFlap) {
        birdVelocity = FLAP_STRENGTH; // Apply upward force
        birdFlap = false; // Reset flap
    }
    birdY += birdVelocity;

    // Move pipes
    movePipes();

    // Check for collisions
    checkCollisions();

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw game elements
    drawPipes();
    drawBird();

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    // Increment frame count and score
    frame++;
    if (frame % SPAWN_RATE === 0) {
        score++;
    }

    // Request next animation frame
    requestAnimationFrame(updateGame);
}
function updateGame() {
    // Clear canvas and draw background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    if (isGameOver) {
        // Draw "Game Over" message
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);

        // Display final score
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('Final Score: ' + score, canvas.width / 2, canvas.height / 2 + 20);

        return; // Stop the game loop when the game is over
    }

    // Update bird mechanics
    birdVelocity += GRAVITY;
    if (birdFlap) {
        birdVelocity = FLAP_STRENGTH;
        birdFlap = false;
    }
    birdY += birdVelocity;

    // Move pipes
    movePipes();

    // Check for collisions
    checkCollisions();

    // Draw game elements
    drawPipes();
    drawBird();

    // Draw current score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);

    // Increment frame count and score
    frame++;
    if (frame % SPAWN_RATE === 0) {
        score++;
    }

    // Request next animation frame
    requestAnimationFrame(updateGame);
}

// Reset the game
function resetGame() {
    birdY = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    frame = 0;
    score = 0;
    isGameOver = false;
    updateGame();
}

// Start the game
updateGame();


