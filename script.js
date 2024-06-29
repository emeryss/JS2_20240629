const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 200,
    width: 32,
    height: 32,
    speed: 5,
    jumpForce: 10,
    velocityY: 0,
    isJumping: false
};

const platforms = [
    { x: 0, y: 300, width: 800, height: 100 },
    { x: 300, y: 200, width: 200, height: 20 },
    { x: 500, y: 150, width: 200, height: 20 }
];

const coins = [
    { x: 350, y: 170, width: 20, height: 20 },
    { x: 550, y: 120, width: 20, height: 20 }
];

const enemies = [
    { x: 400, y: 268, width: 32, height: 32, direction: 1 }
];

let score = 0;

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'gray';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawCoins() {
    ctx.fillStyle = 'gold';
    coins.forEach(coin => {
        ctx.beginPath();
        ctx.arc(coin.x + coin.width / 2, coin.y + coin.height / 2, coin.width / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawEnemies() {
    ctx.fillStyle = 'green';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
    player.velocityY += 0.5; // Gravity
    player.y += player.velocityY;

    // Platform collision
    platforms.forEach(platform => {
        if (player.y + player.height > platform.y &&
            player.y < platform.y + platform.height &&
            player.x + player.width > platform.x &&
            player.x < platform.x + platform.width) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    });

    // Coin collection
    coins.forEach((coin, index) => {
        if (player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y) {
            coins.splice(index, 1);
            score++;
        }
    });

    // Enemy movement and collision
    enemies.forEach(enemy => {
        enemy.x += enemy.direction;
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.direction *= -1;
        }

        if (player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y) {
            alert('Game Over! Your score: ' + score);
            document.location.reload();
        }
    });

    // Keep player in bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatforms();
    drawPlayer();
    drawCoins();
    drawEnemies();
    drawScore();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            player.x -= player.speed;
            break;
        case 'ArrowRight':
            player.x += player.speed;
            break;
        case ' ':
            if (!player.isJumping) {
                player.velocityY = -player.jumpForce;
                player.isJumping = true;
            }
            break;
    }
});

gameLoop();